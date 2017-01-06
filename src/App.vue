<template>
<div id="app" class="wrapper">
    <app-header></app-header>
    <app-main></app-main>
    <app-footer></app-footer>
</div>
</template>

<script>

import AppHeader from './components/layout/AppHeader.vue';
import AppMain from './components/layout/AppMain.vue';
import AppFooter from './components/layout/AppFooter.vue';

export default {
    components: {
        AppHeader,
        AppMain,
        AppFooter
    }
}

</script>

<style lang="scss">

$roboto-font-path: '/src/fonts/roboto/';
$error-color: #e57373;
$input-error-color: #e57373;
@import "materialize";

html,
body {
    height: 100%;
}

body {
    @extend .grey, .darken-3;
}

.wrapper {
    min-height: 100%;
    position: relative;
}

input {
    color: #aaa;
}

</style>
