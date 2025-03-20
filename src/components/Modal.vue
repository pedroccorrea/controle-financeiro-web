<template>
    <div class="container">
        <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content modal-bg-custom">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">{{ titulo }}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="background-color: #fff;"></button>
                    </div>
                    <div class="modal-body">
                        <slot name="alertas"></slot>
                        <div v-for="campo, index in campos" :key="index" class="form-group">
                            <input-container-component :campo="campo"/>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <slot name="rodape"></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['id', 'titulo', 'campos'],
    }
</script>

<style>
    .modal-bg-custom {
        background-color: #323A49;
    }

    .btn-custom {
        background-color: #6261cc;
        color: #eee;
    }
    .btn-custom:hover {
        background-color: #5352ad;
        color: #fff;
    }
</style>
<!-- <template>
    <div class="container">
        <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content modal-bg-custom">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">{{ titulo }}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="background-color: #fff;"></button>
                    </div>
                    <div class="modal-body">
                        <slot name="alertas"></slot>
                        <slot name="conteudo"></slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="rodape"></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['id', 'titulo']
    }
</script>

<style>
    .modal-bg-custom {
        background-color: #323A49;
    }

    .btn-custom {
        background-color: #6261cc;
        color: #eee;
    }
    .btn-custom:hover {
        background-color: #5352ad;
        color: #fff;
    }
</style> -->
