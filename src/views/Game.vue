<template>
    <div>
        <app-loading v-if="isLoading"></app-loading>

        <h1 class="title">
            {{ $t(title) }}
        </h1>
        <div class="row">
            <form class="col s12" novalidate autocomplete="off" @submit.prevent="submitGame">
                <div class="row">
                    <div class="input-field col s12">
                        <input id="date" type="date" class="validate datepicker">
                        <label for="date" :class="{'active': game.date}">
                            {{ $t('Date') }}
                        </label>
                    </div>
                    <div class="input-field col s12">
                        <input id="chips" type="number" class="validate" v-model="game.chips">
                        <label for="chips" :class="{'active': game.chips}">
                            {{ $t('Chips Total of This Game') }}
                        </label>
                    </div>
                    <div class="input-field col s12">
                        <input id="chipsPerPlayer" type="number" readonly v-model="game.chipsPerPlayer">
                        <label for="chipsPerPlayer" class="active">
                            {{ $t('Chips per Player') }}
                        </label>
                    </div>
                    <div class="input-field col s12">
                        <input id="remainingChips" type="number" readonly v-model="game.remainingChips">
                        <label for="remainingChips" class="active">
                            {{ $t('Remaining Chips') }}
                        </label>
                    </div>
                    <div class="input-field col s12">
                        <div class="chips chips-placeholder"></div>
                    </div>
                    <div class="col s12 action-controls">
                        <button type="submit" name="button" class="waves-effect waves-light btn">
                            {{ $t(submitButton) }}
                        </button>
                        <button type="button" class="btn btn-flat" @click="goBack()">
                            {{ $t('Back') }}
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <app-modal id="message" title="" message="" dismissButtonText="OK" @onDismissModal="dismissModal"></app-modal>
    </div>
</template>

<script>

    import Vue from 'vue';
    import firebase from '../firebase';
    import AppLoading from '../components/layout/AppLoading.vue';
    import AppModal from '../components/helpers/AppModal.vue';

    export default {

        components: {
            AppLoading,
            AppModal
        },

        data() {
            return {
                game: {
                    date: '',
                    dateStamp: '',
                    chips: '',
                    players: [],
                    chipsPerPlayer: 0,
                    remainingChips: 0
                },
                userId: firebase.auth().currentUser.uid,
                $modal: null,
                $chipsControl: null,
                $datePicker: null,
                isLoading: false,
                gameId: null,
                groupId: null,
                title: 'Create New Game',
                submitButton: 'Create Game'
            }
        },

        created() {

            document.title = 'Poker Stats - Game';

            this.groupId = this.$route.params.groupId;

            this.gameId = this.$route.params.gameId;

            if (this.gameId) {

                this.title = 'Update Game';
                this.submitButton = 'Update Game';

                this.getGameData();

            } else {

                // use the group members by default
                this.getGroupData();
            }
        },

        mounted() {

            this.$datePicker = jQuery('.datepicker').pickadate({
                selectMonths: false,
                selectYears: false
            });

            this.$datePicker.data('pickadate').on('set', (value) => {

                if (value.select) {

                    const SELECTED_DATE = new Date(value.select);
                    let MONTH_NUMBER = SELECTED_DATE.getMonth() + 1;
                    let DATE_NUMBER = SELECTED_DATE.getDate();
                    const FULL_YEAR = SELECTED_DATE.getFullYear();

                    MONTH_NUMBER = MONTH_NUMBER < 10 ? '0' + MONTH_NUMBER : MONTH_NUMBER;
                    DATE_NUMBER = DATE_NUMBER < 10 ? '0' + DATE_NUMBER : DATE_NUMBER;

                    this.game.date = this.$lang === 'en' ?
                        `${MONTH_NUMBER}/${DATE_NUMBER}/${FULL_YEAR}` :
                        `${DATE_NUMBER}/${MONTH_NUMBER}/${FULL_YEAR}`;

                    this.game.dateStamp = value.select;

                    // this.$datePicker.removeClass('invalid');

                    if (this.$datePicker.val() !== this.game.date) {

                        this.$datePicker.val(this.game.date);
                    }

                    // this.$datePicker.data('pickadate').close();

                } else {

                    this.game.date = '';
                    this.game.dateStamp = '';
                }
            })
            .on('close', () => {

                if (this.game.date) {
                    this.$datePicker.removeClass('invalid');
                }
            })
            .set({
                select: Date.now()
            });

            this.$datePicker.removeClass('invalid');

            this.$chipsControl = jQuery('.chips-placeholder');

            this.$chipsControl.material_chip({
                placeholder: Vue.t('+ player'),
                secondaryPlaceholder: Vue.t('+ player'),
            });

            this.$chipsControl.on('chip.add', (e, chip) => {
                if (!chip.id) {
                    chip.id = 'temp_' + Date.now();
                }
                // this is to prevent add duplicate players on load
                const MEMBER_EXIST = this.game.players.find((player) => {
                    return player.id === chip.id;
                });
                if (!MEMBER_EXIST) {
                    this.game.players.push({
                        id: chip.id,
                        tag: chip.tag
                    });
                }
                this.calculateChips();
            })
            .on('chip.delete', (e, chip) => {
                const INDEX = this.game.players.findIndex((player) => {
                    return player.id === chip.id;
                });
                this.game.players.splice(INDEX, 1);
                this.calculateChips();
            });

            this.$modal = jQuery('#message').modal({
                dismissible: false
            });
        },

        methods: {

            submitGame() {

                if (this.game.dateStamp && this.game.chips && this.game.players.length) {

                    this.isLoading = true;

                    // update the existing group or create a new one
                    const GAME_KEY = this.gameId || firebase.database().ref(`games/${this.groupId}`).push().key;

                    firebase.database().ref(`games/${this.groupId}/${GAME_KEY}`).update({
                        id: GAME_KEY,
                        dateStamp: this.game.dateStamp,
                        chips: this.game.chips,
                        chipsPerPlayer: this.game.chipsPerPlayer,
                        remainingChips: this.game.remainingChips,
                        players: this.game.players
                    }).then(
                        () => {
                            // this is a new game, let's update the totalGames number of the group
                            if (!this.gameId) {
                                firebase.database().ref(`groups/${this.userId}/${this.groupId}`).update({
                                    totalGames: this.groupTotalGames + 1 || 0
                                });
                            }
                            this.goBack();
                        },
                        (error) => {
                            this.isLoading = false;
                            alert(error.message);
                        }
                    );

                } else {
                    this.$modal
                        .find('h4').text('Error')
                        .next().text('Faltan datos muñaño!!!');
                    this.$modal.modal('open');
                }
            },

            calculateChips() {
                this.game.chipsPerPlayer = Math.floor(this.game.chips / this.game.players.length);
                this.game.remainingChips = this.game.chips % this.game.players.length;
            },

            dismissModal() {
                this.$modal.modal('close');
            },

            getGameData() {

                this.isLoading = true;

                firebase.database().ref(`games/${this.groupId}/${this.gameId}`).once('value').then(
                    (snapshot) => {

                        this.game = snapshot.val();

                        this.game.dateStamp = this.game.dateStamp;

                        this.$datePicker.data('pickadate').set({
                            select: this.game.dateStamp
                        });

                        this.$datePicker.removeClass('invalid');

                        if (this.game.players && this.game.players.length) {

                            this.game.players.forEach((player) => {

                                this.$chipsControl.addChip({
                                    tag: player.tag,
                                    id: player.id
                                }, this.$chipsControl);
                            });
                        }

                        this.isLoading = false;
                    },
                    () => {
                        this.isLoading = false;
                    }
                );
            },

            getGroupData() {

                this.isLoading = true;

                firebase.database().ref(`groups/${this.userId}/${this.groupId}`).once('value').then(
                    (snapshot) => {

                        let group = snapshot.val();

                        this.game.chips = group.chips;

                        this.groupTotalGames = group.totalGames;

                        if (group.members && group.members.length) {

                            group.members.forEach((member) => {

                                this.$chipsControl.addChip({
                                    tag: member.name,
                                    id: member.id
                                }, this.$chipsControl);
                            });

                        }

                        this.isLoading = false;
                    },
                    () => {
                        this.isLoading = false;
                    }
                );
            },

            // update members data to be saved
            updateMembersData(groupId) {

                let playersToBeStored = [];

                this.game.players.forEach((player) => {

                    let playerKey = player.id;

                    // if (playerKey.indexOf && playerKey.indexOf('temp_') === 0) {
                    //
                    //     playerKey = firebase.database().ref(`groups/${this.userId}/players`).push().key;
                    // }

                    playersToBeStored.push({
                        id: playerKey,
                        name: player.tag || player.name
                    });
                });

                return playersToBeStored;
            },

            goBack() {
                this.$router.go(-1);
            }
        }
    }

</script>

<style lang="scss">

    input[type=text][readonly="readonly"],
    input[type=number][readonly="readonly"] {
        color: #efefef;
        border-bottom: 1px solid #9e9e9e;
    }

    input[type=text][readonly="readonly"] + label,
    input[type=number][readonly="readonly"] + label {
        color: #9e9e9e;
    }

    select {

        &.browser-default {
            color: #666;
            margin-top: 10px;
            max-width: 100px;
        }
    }

</style>
