<template>
    <div class="app-home">
        <app-loading v-if="isLoading"></app-loading>

        <div v-if="group">

            <h1 class="title">
                {{group.name}}
            </h1>

            <p>
                {{ $t('Total Games') }}: {{group.totalGames}}
            </p>

            <div class="card grey darken-2" v-for="game in group.games">
                <div class="card-content white-text">
                    <span class="card-title">
                        {{formatDate(game.dateStamp)}}
                    </span>
                    <p>
                        {{ $t('Winner') }}:
                    </p>
                </div>
                <div class="card-action">
                    <router-link :to="{name: 'EditGame', params: {groupId: group.id, gameId: game.id}}" tag="a" class="waves-effect waves-light btn yellow darken-3">
                        {{ $t('Edit') }}
                    </router-link>
                    <button type="button" class="waves-effect waves-light btn red darken-3" @click="confirmDeleteGroup()">
                        {{ $t('Delete') }}
                    </button>
                </div>
            </div>

            <div class="card grey darken-2" v-if="!group.games">
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
            @onDismissModal="dismissModal" @onConfirmationModal="deleteGroup"></app-modal>
    </div>
</template>

<script>

    import firebase from '../firebase';
    import Vue from 'vue';
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
                userId: firebase.auth().currentUser.uid,
                databaseRef: firebase.database(),
                isLoading: true,
                $modal: null,
                modalTitle: Vue.t('Delete Group'),
                modalMessage: Vue.t('Are you really sure you want to delete this group?'),
                modalCancelBtn: Vue.t('Cancel'),
                modalDeleteBtn: Vue.t('Delete')
            };
        },

        mounted() {
            this.$modal = jQuery('#message').modal({
                dismissible: false
            });
        },

        created() {
            document.title = 'Poker Stats - Group Details';
            this.groupId = this.$route.params.groupId;
            this.getGroup();
        },

        methods: {

            getGroup() {

                this.databaseRef.ref(`groups/${this.userId}/${this.groupId}`).once('value').then(
                    (groupSnapshot) => {

                        this.group = groupSnapshot.val();

                        this.databaseRef.ref(`games/${this.groupId}`).once('value').then(
                            (gameSnapshot) => {
                                this.group.games = gameSnapshot.val();
                                this.isLoading = false;
                            },
                            (error) => {
                                this.isLoading = false;
                            }
                        );
                    },
                    (error) => {
                        this.isLoading = false;
                    }
                );
            },

            confirmDeleteGroup() {
                this.$modal.modal('open');
            },

            deleteGroup() {

                this.dismissModal();

                this.isLoading = true;

                this.databaseRef.ref(`groups/${this.userId}/${this.groupId}`).remove().then(
                    () => {
                        this.$router.push('/');
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

            formatDate(timeStamp) {

                const SELECTED_DATE = new Date(timeStamp);
                let MONTH_NUMBER = SELECTED_DATE.getMonth() + 1;
                let DATE_NUMBER = SELECTED_DATE.getDate();
                const FULL_YEAR = SELECTED_DATE.getFullYear();

                MONTH_NUMBER = MONTH_NUMBER < 10 ? '0' + MONTH_NUMBER : MONTH_NUMBER;
                DATE_NUMBER = DATE_NUMBER < 10 ? '0' + DATE_NUMBER : DATE_NUMBER;

                return this.$lang === 'en' ?
                    `${MONTH_NUMBER}/${DATE_NUMBER}/${FULL_YEAR}` :
                    `${DATE_NUMBER}/${MONTH_NUMBER}/${FULL_YEAR}`;
            },

            goBack() {
                this.$router.go(-1);
            }
        }
    }

</script>

<style lang="scss">

    .app-home .chips {
        border-bottom: none;
        line-height: 36px;
        margin: 25px 0 0;
    }

    .card .card-content .app-home-row {
        margin: 8px 0;
    }

</style>
