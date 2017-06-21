<template>
    <header>
        <nav class="top-nav grey darken-4">
            <div class="row">
                <div class="nav-wrapper col s12">
                    <router-link to="/" class="brand-logo">
                        <img src="/src/assets/logo.png" alt="Poker Stats">
                    </router-link>
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

import i18n from '../../i18n';

export default {

    methods: {

        changeLanguage() {

            i18n.locale = i18n.locale === 'en-US' ? 'es-ES' : 'en-US';
            localStorage.setItem('lang', i18n.locale);
        }
    }
}

</script>

<style lang="scss">

.top-nav {
    margin-bottom: 30px;
}

.brand-logo img {
    vertical-align: middle;
}

</style>
