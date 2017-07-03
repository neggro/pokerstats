<template>
    <div class="app-home">
        <app-loading v-if="isLoading"></app-loading>

        <h1 class="title">
            {{ $t('Game Groups') }}
        </h1>

        <div class="card grey darken-2" v-for="group in groups">
            <div class="card-content white-text">
                <span class="card-title">
                    {{group.name}}
                </span>
                <p class="app-home-row">
                    {{group.description}}
                </p>
                <p class="app-home-row">
                    {{ $t('Chips Total Per Game') }}: {{group.chips}}
                </p>
                <p class="app-home-row">
                    {{ $t('Total Games') }}: {{group.totalGames}}
                </p>
                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            <th>{{ $t('Player') }}</th>
                            <th class="center-align">{{ $t('Chips') }}</th>
                            <th class="center-align">{{ $t('Played') }}</th>
                            <th class="center-align">{{ $t('Won') }}</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="member in group.members">
                            <td>{{member.name}}</td>
                            <td class="center-align">{{member.chips}}</td>
                            <td class="center-align">{{member.playedGames}}</td>
                            <td class="center-align">{{member.gamesWon}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card-action">
                <router-link :to="{name: 'GroupDetails', params: {groupId: group.id}}" tag="button" class="btn btn-flat teal-text text-lighten-2">
                    {{ $t('Games') }}
                </router-link>
                <router-link :to="{name: 'EditGroup', params: {groupId: group.id}}" tag="a" class="btn btn-flat teal-text text-lighten-2">
                    {{ $t('Edit') }}
                </router-link>
                <button type="button" class="btn btn-flat teal-text text-lighten-2" @click="confirmDeleteGroup(group.id)">
                    {{ $t('Delete') }}
                </button>
            </div>
        </div>

        <div class="card grey darken-2"  v-if="!groups">
            <div class="card-content white-text" v-if="isLoading">
                <span class="card-title">
                    {{ $t('Loading Groups Information') }}...
                </span>
            </div>
            <div class="card-content white-text" v-else>
                <span class="card-title">
                    {{ $t('No Groups') }}
                </span>
                <p>
                    {{ $t('You have not created any game group yet') }}.
                </p>
            </div>
        </div>

        <div class="fixed-action-btn">
            <router-link to="/create-group" tag="button" class="btn-floating btn-large">
                <i class="material-icons">add</i>
            </router-link>
        </div>

        <app-modal id="message" :title="modalTitle" :message="modalMessage"
            :dismissButtonText="modalCancelBtn" :confirmationButtonText="modalDeleteBtn"
            @onDismissModal="dismissModal" @onConfirmationModal="deleteGroup"></app-modal>
    </div>
</template>

<script>

    import firebase from '../firebase';
    import i18n from '../i18n';
    import AppLoading from '../components/layout/AppLoading.vue';
    import AppModal from '../components/helpers/AppModal.vue';

    export default {

        components: {
            AppLoading,
            AppModal
        },

        data() {

            return {
                groups: null,
                userId: firebase.auth().currentUser.uid,
                isLoading: true,
                $modal: null,
                groupToDelete: null,
                modalTitle: i18n.t('Delete Group'),
                modalMessage: i18n.t('Are you really sure you want to delete this group?'),
                modalCancelBtn: i18n.t('Cancel'),
                modalDeleteBtn: i18n.t('Delete')
            };
        },

        mounted() {

            document.title = 'Poker Stats - ' + i18n.t('Home');

            this.$modal = jQuery('#message').modal({
                dismissible: false
            });
        },

        created() {
            this.getGroups();
        },

        methods: {

            getGroups() {

                firebase.database().ref(`groups/${this.userId}`).once('value').then(
                    (snapshot) => {

                        let groups = snapshot.val();

                        for (let groupId in groups) {

                            let currentGroup = groups[groupId];

                            // if there are games and more than one member,
                            // let's sort the array from more to less chips
                            if (currentGroup.totalGames && currentGroup.members && currentGroup.members.length > 1) {
                                currentGroup.members = currentGroup.members.sort((a, b) => {
                                    if (a.chips > b.chips) {
                                        return -1;
                                    } else if (b.chips > a.chips) {
                                        return 1;
                                    }
                                    return 0;
                                });
                            }
                        }

                        this.groups = groups;

                        this.isLoading = false;
                    },
                    () => {
                        this.isLoading = false;
                    }
                );
            },

            confirmDeleteGroup(groupId) {

                this.groupToDelete = groupId;
                this.$modal.modal('open');
            },

            deleteGroup() {

                this.dismissModal(true);

                this.isLoading = true;

                firebase.database().ref(`groups/${this.userId}/${this.groupToDelete}`).remove().then(
                    () => {
                        this.getGroups();
                    },
                    () => {
                        alert('error, bla, bla, bla...');
                        this.isLoading = false;
                    }
                );

                this.groupToDelete = null;
            },

            dismissModal(resetGroupToDelete) {
                if (!resetGroupToDelete) {
                    this.groupToDelete = null;
                }
                this.$modal.modal('close');
            }
        }
    }

</script>

<style lang="scss">

    .title {
        margin-top: 0;
    }

    // .app-home .chips {
    //     border-bottom: none;
    //     line-height: 36px;
    //     margin: 25px 0 0;
    // }

    .card .card-content .app-home-row {
        margin: 8px 0;
    }

    table.striped > tbody > tr:nth-child(odd) {
        background-color: #555;
    }

</style>
