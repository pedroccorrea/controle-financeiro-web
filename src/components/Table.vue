<template>
    <div class="table-responsive">
        <table class="table table-dark-custom table-hover">
            <thead>
                <tr>
                    <th v-for="(t, index) in titulos" :key="index">{{ t.titulo }}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(obj, chave) in dadosFiltrados" :key="chave">
                    <td v-for="(valor, chaveValor) in obj" :key="chaveValor">
                        <span v-if="chaveValor!='dados'">
                            <span v-if="titulos[chaveValor].tipo == 'texto'"> {{ valor }}</span>
                            <span v-if="titulos[chaveValor].tipo == 'moeda'">{{ valor }}</span>
                            <span v-if="titulos[chaveValor].tipo == 'data'">{{ valor }}</span>
                            <span v-if="titulos[chaveValor].tipo == 'boolean'">{{ valor==1? 'Sim': 'Não' }}</span>
                            <span v-if="titulos[chaveValor].tipo == 'img'">
                                <img :src="'/storage/'+valor" alt="" style="width: 30px;">
                            </span>
                        </span>
                    </td>
                    <td >
                        <button v-if="visualizar.visivel" class="btn btn-outline-primary btn-sm mx-1" :data-bs-toggle="visualizar.dataToggle" :data-bs-target="visualizar.dataTarget" @click="setState(obj.dados)">Visualizar</button>
                        <button v-if="atualizar.visivel" class="btn btn-outline-primary btn-sm mx-1" :data-bs-toggle="atualizar.dataToggle" :data-bs-target="atualizar.dataTarget" @click="atualizar.callback(obj.dados)">Atualizar</button>
                        <button v-if="remover.visivel" class="btn btn-outline-danger btn-sm mx-1"  @click="setState([obj.dados]), remover.callback()" >Excluir</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: "Table",
        props: ['dados', 'titulos', 'visualizar', 'atualizar', 'remover'],
        methods: {
            setState(obj) {
                this.limparTransaction();
                this.$store.commit('setItem', obj);
            },
            limparTransaction() {
                this.$store.commit('setTransactionLoaded', false);
                this.$store.commit('setTransaction', {
                    success: false, 
                    message: '', 
                    data: null, 
                    errors: [],
                })
            },
        },
        computed: {
            dadosFiltrados() {
                let campos = Object.keys(this.titulos);
                let dadosFiltrados = [];
                this.dados.map((item, chave) => {
                    let itemFiltrado = {};
                    campos.forEach (campo => {
                        if(this.titulos[campo].tipo == 'data') {
                            itemFiltrado[campo] = item[campo] && moment(item[campo]).isValid() 
                            ? ( this.titulos[campo].mostrar === 'DD'
                                ?  moment.utc(String(item[campo])).format('DD')
                                : moment.utc(String(item[campo])).format('DD/MM/YYYY HH:mm')) 
                            : 'Não disponível';
                        } else if(this.titulos[campo].tipo == 'moeda') {
                            let valorFormatado = new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(item[campo]);
                            itemFiltrado[campo] = valorFormatado;
                        } else {
                            itemFiltrado[campo] = item[campo];
                        }
                    })
                    itemFiltrado['dados']=item;
                    dadosFiltrados.push(itemFiltrado);
                });
                return dadosFiltrados;
            }, 
            itemAtual() {
                return this.$store.state.item;
            }
        }
    }
</script>

<style>
    .table-dark-custom th, .table-dark-custom td {
        background-color: #212631;
        color: #fff;
        border-color: #495057;
        border-collapse: collapse;
        white-space: nowrap;
        text-align: center;
    }
</style>