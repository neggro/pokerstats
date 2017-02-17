<template>
    <div class="app-home">
        <app-loading v-if="isLoading"></app-loading>

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
                    {{ $t('Total Games') }}: {{group.games ? group.games.length : 0}}
                </p>
                <div class="chips chips-placeholder">
                    <div class="chip" v-for="member in group.members">
                        {{member}}
                    </div>
                </div>
            </div>
            <div class="card-action">
                <router-link :to="{name: 'GroupDetails', params: {groupId: group.id}}" tag="button" class="waves-effect waves-light btn green darken-3">
                    {{ $t('Details') }}
                </router-link>
                <router-link :to="{name: 'EditGroup', params: {groupId: group.id}}" tag="a" class="waves-effect waves-light btn yellow darken-3">
                    {{ $t('Edit') }}
                </router-link>
                <button type="button" class="waves-effect waves-light btn red darken-3" @click="confirmDeleteGroup(group.id)">
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

        <router-link to="/create-group" tag="button" class="waves-effect waves-light btn right">
            {{ $t('Create New Group') }}
        </router-link>

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
                groups: null,
                userId: firebase.auth().currentUser.uid,
                isLoading: true,
                $modal: null,
                groupToDelete: null,
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
            this.getGroups();
        },

        methods: {

            getGroups() {

                firebase.database().ref(`groups/${this.userId}`).once('value').then(
                    (snapshot) => {

                        this.groups = snapshot.val();

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

    .app-home .chips {
        border-bottom: none;
        line-height: 36px;
        margin: 25px 0 0;
    }

    .card .card-content .app-home-row {
        margin: 8px 0;
    }

</style>
