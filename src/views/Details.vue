<template>
    <div class="app-home">
        <app-loading v-if="isLoading"></app-loading>

        <div v-if="group">

            <h1 class="title">
                {{group.name}}
            </h1>

            <p>
                {{ $t('Total Games') }}: {{group.games ? group.games.length : 0}}
            </p>

            <div class="card grey darken-2" v-for="game in group.games">
                <div class="card-content white-text">

                </div>
                <div class="card-action">
                    <router-link :to="{name: 'EditGroup', params: {groupId: group.id}}" tag="a" class="waves-effect waves-light btn yellow darken-3">
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

            <router-link :to="{name: 'CreateGame', params: {groupId: group.id}}" tag="button" class="waves-effect waves-light btn right">
                {{ $t('Create New Game') }}
            </router-link>

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
