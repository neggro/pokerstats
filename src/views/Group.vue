<template>
    <div>
        <app-loading v-if="isLoading"></app-loading>

        <h1>
            {{title}}
        </h1>
        <div class="row">
            <form class="col s12" novalidate autocomplete="off" @submit.prevent="submitGroup">
                <div class="row">
                    <div class="input-field col s12">
                        <input id="name" type="text" class="validate" v-model="group.name">
                        <label for="name" :class="{'active': group.description}">
                            {{ $t('Group Name') }}
                        </label>
                    </div>
                    <div class="input-field col s12">
                        <input id="description" type="text" class="validate" v-model="group.description">
                        <label for="description" :class="{'active': group.description}">
                            {{ $t('Description') }}
                        </label>
                    </div>
                    <div class="input-field col s12">
                        <div class="chips chips-placeholder"></div>
                    </div>
                    <div class="col s12 action-controls">
                        <button type="submit" name="button" class="waves-effect waves-light btn">
                            {{submitButton}}
                        </button>
                        <router-link to="/" tag="button" class="btn btn-flat">
                            {{ $t('Back') }}
                        </router-link>
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
                group: {
                    name: '',
                    description: '',
                    members: []
                },
                userId: firebase.auth().currentUser.uid,
                $modal: null,
                $chipsControl: null,
                isLoading: false,
                groupId: null,
                title: Vue.t('Create New Game Group'),
                submitButton: Vue.t('Create Group')
            }
        },

        created() {

            this.groupId = this.$route.params.groupId;

            if (this.groupId) {

                this.title = Vue.t('Update Game Group');
                this.submitButton = Vue.t('Update Group');

                this.getGroupData();
            }
        },

        mounted() {

            this.$chipsControl = jQuery('.chips-placeholder');

            this.$chipsControl.material_chip({
                placeholder: Vue.t('+ member'),
                secondaryPlaceholder: Vue.t('+ member'),
            });

            this.$chipsControl.on('chip.add', (e, chip) => {
                // this is to prevent add duplplicate members on load
                if (this.group.members.indexOf(chip.tag) === -1) {
                    this.group.members.push(chip.tag);
                }
            })
            .on('chip.delete', (e, chip) => {
                var index = this.group.members.indexOf(chip.tag);
                this.group.members.splice(index, 1);
            });

            this.$modal = jQuery('#message').modal({
                dismissible: false
            });
        },

        methods: {

            submitGroup() {

                var groupKey;

                if (this.group.name) {

                    if (this.group.members.length > 1) {

                        this.isLoading = true;

                        // update the existing group or create a new one
                        groupKey = this.groupId || firebase.database().ref('groups/' + this.userId).push().key;

                        firebase.database().ref('groups/' + this.userId + '/' + groupKey).update({
                            id: groupKey,
                            name: this.group.name,
                            description: this.group.description,
                            members: this.group.members
                        }).then(
                            () => {
                                this.$router.push('/');
                            },
                            (error) => {
                                this.isLoading = false;
                                alert(error.message);
                            }
                        );

                    } else {

                        this.$modal
                            .find('h4').text('Warning')
                            .next().text('Warning message.');
                        this.$modal.modal('open');
                    }

                } else {
                    this.$modal
                        .find('h4').text('Error')
                        .next().text('Error message.');
                    this.$modal.modal('open');
                }
            },

            dismissModal() {
                this.$modal.modal('close');
            },

            getGroupData(groupId) {

                this.isLoading = true;

                firebase.database().ref('groups/' + this.userId + '/' + this.groupId).once('value').then(
                    (snapshot) => {

                        this.group = snapshot.val();

                        if (this.group.members.length) {

                            this.group.members.forEach((member) => {

                                this.$chipsControl.addChip({
                                    tag: member
                                }, this.$chipsControl);
                            });
                        }

                        this.isLoading = false;
                    },
                    () => {
                        this.isLoading = false;
                    }
                );
            }
        }
    }

</script>

<style lang="scss">

    .modal {
        color: #424242;
        max-width: 480px;
    }

</style>
