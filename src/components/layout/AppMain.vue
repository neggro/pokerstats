<template>
    <main class="main container">
        <transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>
            <router-view class="animated"></router-view>
        </transition>
    </main>
</template>

<script>

export default {
}

</script>

<style lang="scss">

.main {
    color: #efefef;
    padding-bottom: 70px;
}

</style>
