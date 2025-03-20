<template>
    <div class="mb-3" style="margin:10px;">
        <label :for="campo.id" class="form-label" style="float: left;">{{ campo.titulo }}</label>
        <select v-if="campo.tipo === 'select'" 
                class="form-select" 
                :id="campo.id" 
                aria-describedby="criarDescricaoHelp"
                v-model="campo.valor"
            >
            <option value="">Selecione...</option>
            <option v-for="opcao in campo.options" :key="opcao.valor" :value="opcao.valor">{{ opcao.nome }}</option>
        </select>
        <input v-else
            :type="campo.tipo" 
            class="form-control" 
            :id="campo.id" 
            aria-describedby="criarDescricaoHelp"
            :placeholder="campo.placeholder" 
            v-model="campo.valor"
        >
    </div>
</template>

<script>
    export default {
        props: ['campo'],
        created() {
            if(this.campo.tipo === 'select' && !this.campo.valor) {
                const opcaoSelecionada = this.campo.options.find(opcao => opcao.selected);
                this.campo.valor = opcaoSelecionada ? opcaoSelecionada.valor : '';
            }
        }
    }
    
</script>
<style>
    input {
        background-color: #4B5365    !important;
        border: none !important;
        color: #ccc !important;
        outline: none !important;
    }

    input:focus {
        box-shadow: 0 0 5px rgba(98, 97, 204, 0.7) !important;
    }
    select {
        background-color: #4b5365 !important;
        color: #ccc !important;
        border: #4b5365 !important;
    }
    select:focus {
        box-shadow: 0 0 5px rgba(98, 97, 204, 0.7) !important;
    }
</style>
<!-- <template>
    <div class="mb-3">
        <label :for="id" class="form-label" style="float: left;">{{ titulo }}</label>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: ['id', 'titulo', 'idHelp', 'textoAjuda']
    }
</script>
<style>
    input {
        background-color: #4B5365    !important;
        border: none !important;
        color: #ccc !important;
        outline: none !important;
    }

    input:focus {
        box-shadow: 0 0 5px rgba(98, 97, 204, 0.7) !important;
    }
</style> -->