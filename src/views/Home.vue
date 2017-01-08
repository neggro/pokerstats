<template>
    <div class="app-home">
        <app-loading v-if="isLoading"></app-loading>
        <div class="card grey darken-2" v-for="group in groups">
            <div class="card-content white-text">
                <span class="card-title">
                    {{group.name}}
                </span>
                <p>
                    {{group.description}}
                </p>
                <div class="chips chips-placeholder">
                    <div class="chip" v-for="member in group.members">
                        {{member}}
                    </div>
                </div>
            </div>
            <div class="card-action">
                <router-link to="/create-group" tag="button" class="waves-effect waves-light btn green darken-3">
                    {{ $t('Details') }}
                </router-link>
                <router-link to="/create-group" tag="button" class="waves-effect waves-light btn yellow darken-3">
                    {{ $t('Edit') }}
                </router-link>
                <button type="button" class="waves-effect waves-light btn red darken-3" @click="deleteGroup(group.id)">
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
    </div>
</template>

<script>

import firebase from '../firebase';
import AppLoading from '../components/layout/AppLoading.vue';

export default {

    components: {
        AppLoading
    },

    data() {

        return {
            groups: null,
            userId: firebase.auth().currentUser.uid,
            isLoading: true
        };
    },

    created() {
        this.getGroups();
    },

    methods: {

        getGroups() {

            firebase.database().ref('groups/' + this.userId).once('value').then(
                (snapshot) => {

                    this.groups = snapshot.val();

                    this.isLoading = false;
                },
                () => {
                    this.isLoading = false;
                }
            );
        },

        deleteGroup(groupId) {

            this.isLoading = true;

            firebase.database().ref('groups/' + this.userId + '/' + groupId).remove().then(
                () => {
                    this.getGroups();
                },
                () => {
                    alert('error, bla, bla, bla...');
                    this.isLoading = false;
                }
            );
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

</style>
