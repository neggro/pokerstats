<template>
    <div class="modal">
        <div class="modal-content">
            <h4>{{title}}</h4>
            <p>{{message}}</p>
        </div>
        <div class="modal-footer">
            <a href="#" @click.prevent="dismissModal" class="modal-action modal-close waves-effect waves-green btn-flat">OK</a>
        </div>
    </div>
</template>

<script>
    export default {

        props: [
            'title',
            'message'
        ],

        methods: {

            dismissModal() {
                this.$emit('onDismissModal');
            }
        }
    }
</script>

<style lang="scss"></style>
