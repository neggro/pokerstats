<template>
    <div class="app-details">
        <app-loading v-if="isLoading"></app-loading>

        <div v-if="group">

            <h1 class="title">
                {{group.name}}
            </h1>

            <p>
                {{ $t('Total Games') }}: {{group.totalGames}}
            </p>

            <!-- game details -->
            <div class="card grey darken-2" v-for="game in games">
                <div class="card-content white-text">
                    <span class="card-title">
                        {{utils.formatDate(game.dateStamp)}}
                    </span>
                    <p class="app-details-row">
                        <span class="group-details-label">
                            {{ $t('Chips') }}:
                        </span>
                        <span class="group-details-value">
                            {{game.chips}}
                        </span>
                    </p>
                    <p class="app-details-row">
                        <span class="group-details-label">
                            {{ $t('Chips per Player') }}:
                        </span>
                        <span class="group-details-value">
                            {{game.chipsPerPlayer}}
                        </span>
                    </p>
                    <p class="app-details-row">
                        <span class="group-details-label">
                            {{ $t('Players') }}:
                        </span>
                    </p>
                    <div class="chips chips-placeholder">
                        <span class="chip" v-for="player in game.players">
                            {{player.tag}}
                        </span>
                    </div>
                    <div v-if="game.winners && game.winners.length">
                        <span class="group-details-label">
                            {{ $t('Winner(s)') }}:
                        </span>
                        <p class="app-details-row" v-for="winner in game.winners">
                            <span class="group-details-label">
                                {{winner.name}}:
                            </span>
                            <span class="group-details-value">
                                {{winner.chips}}
                            </span>
                        </p>
                    </div>
                    <p class="app-details-row" v-else>
                        {{ $t('No winners added yet') }}
                    </p>
                </div>
                <div class="card-action" v-if="!game.isClosed">
                    <router-link :to="{name: 'EditGame', params: {groupId: group.id, gameId: game.id}}" tag="a" class="waves-effect waves-light btn yellow darken-3">
                        {{ $t('Edit') }}
                    </router-link>
                    <button type="button" class="waves-effect waves-light btn red darken-3" @click="confirmDeleteGame(game.id)">
                        {{ $t('Delete') }}
                    </button>
                    <button v-if="game.winners && game.winners.length" type="button" class="waves-effect waves-light btn green darken-3" @click="closeGame(game)">
                        {{ $t('Close Game') }}
                    </button>
                </div>
            </div>
            <!-- end game details -->

            <div class="card grey darken-2" v-if="!games.length">
                <div class="card-content white-text">
                    <span class="card-title">
                        {{ $t('This group has no associated games') }}
                    </span>
                </div>
            </div>

            <div class="col s12 action-controls">
                <router-link :to="{name: 'CreateGame', params: {groupId: group.id}}" tag="button" class="waves-effect waves-light btn">
                    {{ $t('Create New Game') }}
                </router-link>
                <button type="button" class="btn btn-flat" @click="goBack()">
                    {{ $t('Back') }}
                </button>
            </div>

        </div>
        <!-- if group was loaded correctly -->

        <div class="card grey darken-2"  v-if="!group">
            <div class="card-content white-text" v-if="isLoading">
                <span class="card-title">
                    {{ $t('Loading Group Information') }}...
                </span>
            </div>
            <div class="card-content white-text" v-else>
                <span class="card-title">
                    {{ $t('The group was not found') }}
                </span>
            </div>
        </div>

        <app-modal id="message" :title="modalTitle" :message="modalMessage"
            :dismissButtonText="modalCancelBtn" :confirmationButtonText="modalDeleteBtn"
            @onDismissModal="dismissModal" @onConfirmationModal="deleteGame"></app-modal>
    </div>
</template>

<script>

    import firebase from '../firebase';
    import i18n from '../i18n';
    import utils from '../utils';
    import AppLoading from '../components/layout/AppLoading.vue';
    import AppModal from '../components/helpers/AppModal.vue';

    export default {

        components: {
            AppLoading,
            AppModal
        },

        data() {

            return {
                groupId: null,
                group: null,
                games: [],
                userId: firebase.auth().currentUser.uid,
                databaseRef: firebase.database(),
                isLoading: true,
                $modal: null,
                modalTitle: i18n.t('Delete Game'),
                modalMessage: i18n.t('Are you really sure you want to delete this game?'),
                modalCancelBtn: i18n.t('Cancel'),
                modalDeleteBtn: i18n.t('Delete'),
                utils: utils
            };
        },

        mounted() {
            this.$modal = jQuery('#message').modal({
                dismissible: false
            });
        },

        created() {
            document.title = 'Poker Stats - ' + i18n.t('Group Details');
            this.groupId = this.$route.params.groupId;
            this.getGroup();
        },

        methods: {

            getGroup() {

                let groupPromise = new Promise((resolve, reject) => {
                    this.databaseRef.ref(`groups/${this.userId}/${this.groupId}`).once('value').then(
                        (groupSnapshot) => {
                            this.group = groupSnapshot.val();
                            resolve(this.group.totalGames);
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                });

                let gamePromise = new Promise((resolve, reject) => {
                    this.games = [];
                    this.databaseRef.ref(`games/${this.groupId}`).orderByChild('sortStamp').on('child_added',
                        (snapshot) => {
                            let gameSnapshot = snapshot.val();
                            //if there are more than one winner, let's sort the array from more to less chips
                            if (gameSnapshot.winners && gameSnapshot.winners.length > 1) {
                                gameSnapshot.winners = gameSnapshot.winners.sort((a, b) => {
                                    if (a.chips > b.chips) {
                                        return -1;
                                    } else if (b.chips > a.chips) {
                                        return 1;
                                    }
                                    return 0;
                                });
                            }
                            this.games.push(gameSnapshot);
                            resolve();
                        }, (error) => {
                            reject(error);
                        }
                    );
                    // this is used when the group has no games, in that case,
                    // the child_added event is never triggered
                    groupPromise.then((totalGames) => {
                        if (!totalGames) {
                            this.games = [];
                            resolve();
                        }
                    });
                });

                Promise.all([groupPromise, gamePromise]).then(
                    () => this.isLoading = false,
                    (error) => {
                        this.isLoading = false;
                        console.warn(error);
                    }
                );
            },

            closeGame(selectedGame) {

                this.isLoading = true;

                firebase.database().ref(`games/${this.groupId}/${selectedGame.id}`).update({
                    isClosed: true
                }).then(
                    () => {
                        // in case there are winners with same amount of chips
                        let chipsFirstWinner;

                        selectedGame.winners.forEach((winner, index) => {

                            let currentMember = this.group.members.find((member) => member.id === winner.id);

                            if (index === 0 || chipsFirstWinner === winner.chips) {
                                chipsFirstWinner = winner.chips;
                                currentMember.gamesWon++;
                            }

                            currentMember.chips += winner.chips;
                        });

                        this.group.members.forEach((member) => {
                            const MEMBER_PLAYED_THIS_GAME = selectedGame.players
                                .find((player) => player.id === member.id);
                            if (MEMBER_PLAYED_THIS_GAME) {
                                member.chips -= selectedGame.chipsPerPlayer;
                                member.playedGames++;
                            }
                        });

                        firebase.database().ref(`groups/${this.userId}/${this.groupId}`).update({
                            members: this.group.members
                        }).then(
                            () => {
                                selectedGame.isClosed = true;
                                this.isLoading = false;
                            },
                            (error) => {
                                this.isLoading = false;
                                alert(error.message);
                            }
                        );
                    },
                    (error) => {
                        this.isLoading = false;
                        alert(error.message);
                    }
                );
            },

            confirmDeleteGame(gameId) {
                this.$modal.modal('open');
                this.gameToDelete = gameId;
            },

            deleteGame() {

                this.dismissModal();

                this.isLoading = true;

                this.databaseRef.ref(`games/${this.groupId}/${this.gameToDelete}`).remove().then(
                    () => {
                        this.databaseRef.ref(`groups/${this.userId}/${this.groupId}`).update({
                            totalGames: this.group.totalGames - 1
                        }).then(
                            this.getGroup,
                            (error) => {
                                console.log(error);
                                this.isLoading = false;
                            }
                        );
                    },
                    (error) => {
                        alert('error, bla, bla, bla...');
                        this.isLoading = false;
                    }
                );
            },

            dismissModal() {
                this.$modal.modal('close');
            },

            goBack() {
                this.$router.go(-1);
            }
        }
    }

</script>

<style lang="scss">

    .app-details .chips {
        border-bottom: none;
        line-height: 36px;
        margin: 5px 0;
    }

    .card .card-content .app-details-row {
        margin: 8px 0;
    }

    .group-details-label {
        display: inline-block;
        min-width: 125px;
    }

    .group-details-value {
        display: inline-block;
        min-width: 45px;
        text-align: right;
    }

</style>
