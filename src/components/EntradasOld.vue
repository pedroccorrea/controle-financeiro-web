<template>
    <div class="container">
        <!-- <card-component titulo="Filtrar Entradas">
            <template v-slot:conteudo>
                <div class="div-busca">
                    <div style="padding: 0 5px">
                        <input-container-component id="data_inicio" titulo="Inicio do Período">
                            <input type="date" class="form-control" id="data_inicio" aria-describedby="dataInicioHelp" v-model="params.data_inicio">
                        </input-container-component>
                    </div>
                    <div style="padding: 0 5px">
                        <input-container-component id="data_fim" titulo="Final do Período">
                            <input type="date" class="form-control" id="data_fim" aria-describedby="dataFimHelp" v-model="params.data_fim">
                        </input-container-component>
                    </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px;">
                    <button type="button" class="btn btn-secondary" @click.prevent="limparFiltro()">Limpar</button>
                    <button type="submit" class="btn btn-custom"  @click.prevent="carregarLista()">Filtrar</button>
                </div>
            </template>
        </card-component> -->
        <card-component titulo="Relação de Entradas">
            <template v-slot:conteudo>
                <table-component 
                    :visualizar="{visivel: false, dataToggle:'modal', dataTarget:'#modalEntradaVisualizar'}"
                    :atualizar="{visivel: true, dataToggle:'modal', dataTarget:'#modalEntradaAtualizar'}"
                    :remover="{visivel: true, callback: remover}"
                    :dados="entradas.data"
                    :titulos="{
                        id: {titulo: 'ID', tipo: 'texto'},
                        nome: {titulo: 'Nome', tipo: 'texto'},
                        valor: {titulo: 'Valor', tipo: 'moeda'},
                        created_at: {titulo: 'Data', tipo:'data'},
                    }"
                ></table-component>
            </template>
            <template v-slot:rodape>
                <paginate-component>
                    <li :class="link.active? 'page-item active':'page-item'" v-for="link, key in entradas.links" :key="key"><a class="page-link" href="#" v-html="formatLabel(link.label)" @click="paginacao(link)"></a></li>
                </paginate-component>
                <button type="submit" class="btn btn-custom" style="float:right;" data-bs-toggle="modal" data-bs-target="#modalMarca" @click.prevent="adicionar()">Adicionar</button>
            </template>
        </card-component>
    </div>

    <modal-component id="modalMarca" titulo="Criar Entrada">
        <template v-slot:conteudo>
            <alert-component tipo="success" v-if="transaction.success && transactionLoaded" titulo="Sucesso!" :dados="transaction"></alert-component>
            <alert-component tipo="danger" v-if="!transaction.success && transactionLoaded" titulo="Erro na operação!" :dados="transaction"></alert-component>
            <div class="form-group">
                <input-container-component id="criarDescricao" titulo="Descrição da entrada">
                    <input type="text" class="form-control" id="criarDescricao" aria-describedby="criarDescricaoHelp" placeholder="Descrição da entrada" v-model="item.nome">
                </input-container-component>
                <input-container-component id="criarValor" titulo="Valor da entrada">
                    <input type="text" class="form-control" id="criarValor" aria-describedby="criarValorHelp" placeholder="Valor da entrada" v-model="item.valor">
                </input-container-component>
            </div>
        </template>
        <template v-slot:rodape>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-custom" @click="salvar()">Salvar</button>
        </template>
    </modal-component>

    <modal-component id="modalEntradaAtualizar" titulo="Atualizar Entrada">
        <template v-slot:conteudo>
            <alert-component tipo="success" v-if="transaction.success && transactionLoaded" titulo="Sucesso!" :dados="transaction"></alert-component>
            <alert-component tipo="danger" v-if="!transaction.success && transactionLoaded" titulo="Erro na operação!" :dados="transaction"></alert-component>
            <div class="form-group">
                <input-container-component id="atualizarDescricao" titulo="Descrição da entrada">
                    <input type="text" class="form-control" id="atualizarDescricao" aria-describedby="atualizarDescricaoHelp" placeholder="Descrição da entrada" v-model="item.nome">
                </input-container-component>
                <input-container-component id="atualizarValor" titulo="Valor da entrada">
                    <input type="text" class="form-control" id="atualizarValor" aria-describedby="atualizarValorHelp" placeholder="Valor da entrada" v-model="item.valor">
                </input-container-component>
            </div>
        </template>
        <template v-slot:rodape>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-custom" @click="atualizar()">Atualizar</button>
        </template>
    </modal-component>
</template>
<script>
    export default {
        name: 'Entradas',
        data() {
            return {
                urlBase: 'http://localhost:8000/api/recebimento', 
                urlPaginacao: 'http://localhost:8000/api/recebimento', 
                entradas : { data: [] },
                params: {
                    por_pagina: 10,
                    data_inicio: '',
                    data_fim: ''
                }
            }
        },
        methods: {
            limparFiltro() {
                this.params.data_inicio = '';
                this.params.data_fim = '';
                this.carregarLista();
            },
            filtrar() {
                console.log(this.params);
            },
            formatLabel(label) {
                if (label === 'Next &raquo;') return 'Próximo &raquo;';
                if (label === '&laquo; Previous') return '&laquo; Anterior';
                return label;
            },
            paginacao(link) {
                if(link.url) {
                    this.urlPaginacao = link.url;
                    this.carregarLista();
                }
            },
            carregarLista() {
                let url = this.urlPaginacao;
                this.$axios.get(url, { params:this.params })
                .then(response => {
                    this.entradas = response.data.data;
                    console.log(this.entradas.links)
                })
            }, 
            adicionar() {
                this.item.nome='';
                this.item.valor='';
                this.setTransactionLoaded(false);
                this.setTransaction({
                    success: false, 
                    message: '', 
                    data: null, 
                    errors: [],
                })
            },
            salvar() {
                let url = this.urlBase;
                let form = new FormData();
                form.append('user_id', 1);
                form.append('nome', this.item.nome);
                form.append('valor', this.item.valor);
                this.$axios.post(url, form)
                    .then(response => {
                        this.setTransaction(response.data);
                        this.setTransactionLoaded(true);
                        this.carregarLista();
                    })
                    .catch(errors => {
                        const errorData = errors.response?.data || {
                            success: false,
                            message: 'Erro ao criar registro.',
                            errors: ['Erro desconhecido.'],
                        }
                        this.setTransaction(errorData);
                        this.setTransactionLoaded(true);
                    })
            },
            atualizar() {
                let url = this.urlBase+'/'+this.item.id;
                let form = new FormData();

                form.append('_method', 'PATCH');
                form.append('nome', this.item.nome);
                form.append('valor', this.item.valor);

                this.$axios.post(url, form)
                    .then(response => {
                        this.setTransaction(response.data);
                        this.setTransactionLoaded(true);
                    })
                    .catch(errors => {
                        const errorData = errors.response?.data || {
                            success: false,
                            message: 'Erro ao atualizar.',
                            errors: ['Erro desconhecido.'],
                        }
                        this.setTransaction(errorData);
                        this.setTransactionLoaded(true);
                    })
            }, 
            remover() {
                this.$swal({
                    title: 'Você tem certeza que deseja excluir essa entrada?',
                    text: 'Essa ação não pode ser desfeita!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, excluir!',
                    cancelButtonText: 'Cancelar',
                }).then((result) => {
                    if (result.isConfirmed) {
                        let url = `${this.urlBase}/${this.item.id}`;
                        let form = new FormData();
                        form.append('_method', 'DELETE');

                        this.$axios.post(url, form)
                            .then(response => {
                                this.$swal('Excluído!', response.data.message, 'success');
                                this.carregarLista();
                            })
                            .catch(errors => {
                                console.log('erro', errors);
                            })
                    }
                });
            }

        }, 
        mounted() {
            this.carregarLista();
        },
    };
</script>
<style>
    @media (min-width: 1024px) {
        .div-busca {
            display: flex;align-items: center;justify-content: last baseline;
        }
    }
</style>