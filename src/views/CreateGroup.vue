<template>
    <div>
        <app-loading v-if="isLoading"></app-loading>

        <h1>
            {{ $t('Create New Game Group') }}
        </h1>
        <div class="row">
            <form class="col s12" novalidate autocomplete="off" @submit.prevent="createGroup">
                <div class="row">
                    <div class="input-field col s12">
                        <input id="name" type="text" class="validate" v-model="group.name">
                        <label for="name">
                            {{ $t('Group Name') }}
                        </label>
                    </div>
                    <div class="input-field col s12">
                        <input id="description" type="text" class="validate" v-model="group.description">
                        <label for="description">
                            {{ $t('Description') }}
                        </label>
                    </div>
                    <div class="input-field col s12">
                        <div class="chips chips-placeholder"></div>
                    </div>
                    <div class="col s12 action-controls">
                        <button type="submit" name="button" class="waves-effect waves-light btn">
                            {{ $t('Create Group') }}
                        </button>
                        <router-link to="/" tag="button" class="btn btn-flat">
                            {{ $t('Back') }}
                        </router-link>
                    </div>
                </div>
            </form>
        </div>

        <app-modal id="message" title="" message="" @onDismissModal="dismissModal"></app-modal>
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
            isLoading: false
        }
    },

    mounted() {

        var $chipsControl = jQuery('.chips-placeholder');

        $chipsControl.material_chip({
            placeholder: Vue.t('+ member'),
            secondaryPlaceholder: Vue.t('+ member'),
        })

        $chipsControl.on('chip.add', (e, chip) => {
            this.group.members.push(chip.tag);
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

        createGroup() {

            var groupKey;

            if (this.group.name) {

                if (this.group.members.length > 1) {

                    this.isLoading = true;

                    groupKey = firebase.database().ref('groups/' + this.userId).push().key;

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
