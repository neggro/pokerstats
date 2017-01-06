<template>
<div>
    <div class="card grey darken-2" v-for="group in groups">
        <div class="card-content white-text">
            <span class="card-title">
                {{group.name}}
            </span>
            <p>
                {{group.description}}
            </p>
        </div>
        <div class="card-action">
            <a href="#">This is a link</a>
            <a href="#">This is a link</a>
        </div>
    </div>
    <div class="card grey darken-2"  v-if="!groups">
        <div class="card-content white-text">
            <span class="card-title">
                {{ $t('No Groups') }}
            </span>
            <p>
                {{ $t('You have not created any game group yet') }}.
            </p>
        </div>
        <div class="card-action">
            <a href="#">{{ $t('Create a Group') }}</a>
        </div>
    </div>
</div>
</template>

<script>

import firebase from '../firebase';

export default {

    data() {

        return {
            groups: null,
            userId: firebase.auth().currentUser.uid
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
                }
            );
        }
    }
}

</script>

<style lang="scss"></style>
