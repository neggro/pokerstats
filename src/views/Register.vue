<template>
    <div class="row">
        <app-loading v-if="isLoading"></app-loading>
        <form class="col s12" novalidate autocomplete="off" @submit.prevent="register">
            <div class="row">
                <div class="input-field col m6 s12">
                    <input id="first_name" type="text" class="validate" v-model="user.firstName">
                    <label for="first_name">
                        {{ $t('First Name') }}
                    </label>
                </div>
                <div class="input-field col m6 s12">
                    <input id="last_name" type="text" class="validate" v-model="user.lastName">
                    <label for="last_name">
                        {{ $t('Last Name') }}
                    </label>
                </div>
                <div class="input-field col m6 s12">
                    <input id="email" type="email" class="validate" v-model="user.email">
                    <label for="email" data-error="Please enter a valid Email">
                        Email
                    </label>
                </div>
                <div class="input-field col m6 s12">
                    <input id="password" type="password" class="validate" v-model="user.password">
                    <label for="password">
                        {{ $t('Password') }}
                    </label>
                </div>
                <div class="col s12 action-controls">
                    <button type="sumbit" name="button" class="waves-effect waves-light btn">
                        {{ $t('Create User') }}
                    </button>
                    <router-link to="/login" tag="button" class="btn btn-flat">
                        {{ $t('Login') }}
                    </router-link>
                </div>
            </div>
        </form>
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
                user: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: ''
                },
                updatedFirstTime: false,
                isLoading: false
            }
        },

        created() {
            document.title = 'Poker Stats - Register';
        },

        // this is to avoid browser autocomplete
        updated() {
            if (!this.updatedFirstTime) {
                this.user.firstName = '';
                this.user.lastName = '';
                this.user.email = '';
                this.user.password = '';
                this.updatedFirstTime = true;
            }
        },

        methods: {

            register() {

                const EMAIL_RE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                const IS_VALID = Boolean(this.user.firstName) && Boolean(this.user.lastName) &&
                    EMAIL_RE.test(this.user.email) && Boolean(this.user.password);

                if (IS_VALID) {

                    this.isLoading = true;

                    firebase.auth()
                        .createUserWithEmailAndPassword(this.user.email, this.user.password)
                        .then(
                            (user) => {
                                firebase.database().ref(`users/${user.uid}`).set({
                                    firstName: this.user.firstName,
                                    lastName: this.user.lastName,
                                    email: this.user.email
                                }).then(
                                    () => {
                                        this.$router.push('/');
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
                }
            }
        }
    }

</script>

<style lang="scss">

    .action-controls {
        margin-top: 15px;

        button {
            margin-right: 15px;
        }
    }

</style>
