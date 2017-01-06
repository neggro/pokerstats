<template>
    <header>
        <nav class="top-nav grey darken-4">
            <div class="row">
                <div class="nav-wrapper col s12">
                    <router-link to="/" class="brand-logo">Poker Stats</router-link>
                    <ul id="nav-mobile" class="right hide-on-med-and-down">
                        <li>
                            <a href="#" @click.prevent="changeLanguage">
                                {{ $t('SELECT_LANG') }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>

import Vue from 'vue';

export default {

    methods: {

        changeLanguage() {

            Vue.config.lang = Vue.config.lang === 'en' ? 'es' : 'en';

            localStorage.setItem('lang', Vue.config.lang);
        }
    }
}

</script>

<style lang="scss">

.top-nav {
    margin-bottom: 30px;
}

</style>
