<template>
    <div class="card-custom" :class="classe">
        <div class="card-custom-header">{{ titulo }}</div>
        <div class="card-custom-body">
            <slot name="conteudo"></slot>
        </div>
        <div class="card-custom-footer">
            <slot name="rodape"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Entradas',
        props: ['titulo', 'classe'],
    };
</script>

<style>
    .card-custom {
        background-color: #212631;
        height: 100%;
        width: 100%;
        margin-bottom: 1.5rem;
        position: relative;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        overflow: hidden;
    }

    .card-custom-header {
        width: 100%;
        padding: 15px;
        background-color: #282D37;
    }
    .card-custom-body {
        padding: 15px;
    }

    .card-custom:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    .card-custom:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    .card-custom-footer {
        padding: 0 15px 15px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .w-30 {
        width: 30%;
    }
</style>