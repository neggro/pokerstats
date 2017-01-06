<template>
    <div class="container">
        <div class="row">
            <form class="col s12" novalidate autocomplete="off" @submit.prevent="login">
                <div class="row">
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
                        <button type="submit" name="button" class="waves-effect waves-light btn">
                            {{ $t('Login') }}
                        </button>
                        <router-link to="/register">
                            {{ $t('Create User') }}
                        </router-link>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>

    import firebase from '../firebase';

    export default {
        data() {
            return {
                user: {
                    email: '',
                    password: ''
                },
                updatedFirstTime: false
            }
        },

        // this is to avoid browser autocomplete
        updated() {
            if (!this.updatedFirstTime) {
                this.user.email = '';
                this.user.password = '';
                this.updatedFirstTime = true;
            }
        },

        methods: {

            login() {

                var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (emailRE.test(this.user.email) && Boolean(this.user.password)) {

                    firebase.auth()
                        .signInWithEmailAndPassword(this.user.email, this.user.password)
                        .then(
                            () => {
                                this.$router.push('/');
                            },
                            (error) => {
                                // var errorCode = error.code;
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
