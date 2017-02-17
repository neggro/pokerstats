<template>
    <div class="modal">
        <div class="modal-content">
            <h4>{{title}}</h4>
            <p>{{message}}</p>
        </div>
        <div class="modal-footer">
            <a v-if="confirmationButtonText" href="#" @click.prevent="confirmationModal" class="modal-action modal-close waves-effect waves-green btn-flat">
                {{confirmationButtonText}}
            </a>
            <a href="#" @click.prevent="dismissModal" class="modal-action modal-close waves-effect waves-green btn-flat">
                {{dismissButtonText}}
            </a>
        </div>
    </div>
</template>

<script>
    export default {

        props: [
            'title',
            'message',
            'confirmationButtonText',
            'dismissButtonText'
        ],

        methods: {

            confirmationModal() {
                this.$emit('onConfirmationModal');
            },

            dismissModal() {
                this.$emit('onDismissModal');
            }
        }
    }
</script>

<style lang="scss">

    .modal {
        color: #424242;
        max-width: 480px;
    }

    .modal-footer .btn-flat {
        color: #212121;
    }

</style>
