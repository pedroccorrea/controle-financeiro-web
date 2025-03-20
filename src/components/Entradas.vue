<template>
    <div class="container">
        <card-component titulo="Filtrar Entradas">
            <template v-slot:conteudo>
                <div class="div-busca">
                    <div v-for="campo, index in filters" :key="index" class="form-group">
                        <input-container-component :campo="campo"/>
                    </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px;">
                    <button type="button" class="btn btn-secondary" @click.prevent="limparFiltro()">Limpar</button>
                    <button type="submit" class="btn btn-custom"  @click.prevent="filtrar()">Filtrar</button>
                </div>
            </template>
        </card-component>
        <card-component titulo="Relação de Entradas">
            <template v-slot:conteudo>
                <table-component 
                    :visualizar="{visivel: false, dataToggle:'modal', dataTarget:'#modalEntradaVisualizar'}"
                    :atualizar="{visivel: true, dataToggle:'modal', dataTarget:'#modalEntradaAtualizar', callback: editar}"
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

    <modal-component id="modalMarca" titulo="Criar Entrada" :campos="this.item">
        <template v-slot:alertas>
            <alert-component tipo="success" v-if="transaction.success && transactionLoaded" titulo="Sucesso!" :dados="transaction"></alert-component>
            <alert-component tipo="danger" v-if="!transaction.success && transactionLoaded" titulo="Erro na operação!" :dados="transaction"></alert-component>
        </template>
        <template v-slot:rodape>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-custom" @click="salvar()">Salvar</button>
        </template>
    </modal-component>

    <modal-component id="modalEntradaAtualizar" titulo="Atualizar Entrada" :campos="this.item">
        <template v-slot:alertas>
            <alert-component tipo="success" v-if="transaction.success && transactionLoaded" titulo="Sucesso!" :dados="transaction"></alert-component>
            <alert-component tipo="danger" v-if="!transaction.success && transactionLoaded" titulo="Erro na operação!" :dados="transaction"></alert-component>
        </template>
        <template v-slot:rodape>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-custom" @click="salvar()">Atualizar</button>
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
                camposFiltro: Object.freeze([
                    // {id: 'por_pagina', tipo: 'number', titulo: 'Por Página', valor: 10, placeholder: 'Exemplo 10'},
                    {id: 'data_inicio', tipo: 'date', titulo: 'Inicio do Período', valor: '', placeholder: 'Exemplo 2021-01-01'},
                    {id: 'data_fim', tipo: 'date', titulo: 'Fim do Período', valor: '', placeholder: 'Exemplo 2021-01-31'},
                ]),
                params : {},
                campos: Object.freeze([
                    {
                        id: 'nome', 
                        tipo: 'text',
                        titulo: 'Nome da Entrada',
                        valor: '',
                        placeholder: 'Exemplo: Salario...'
                    }, 
                    {
                        id: 'valor',
                        tipo: 'number',
                        titulo: 'Valor da Entrada',
                        valor: '',
                        placeholder: 'Exemplo 2000'
                    },
                ])
            }
        },
        methods: {
            setState(obj) {
                this.limparTransaction();
                this.setItem(obj);
            },
            limparTransaction() {
                this.setTransactionLoaded(false);
                this.setTransaction({
                    success: false, 
                    message: '', 
                    data: null, 
                    errors: [],
                })
            },
            limparFiltro() {
                this.setFilter(structuredClone(this.camposFiltro));
                this.params = {};
                this.carregarLista();
            },
            filtrar() {
                this.filters.forEach(campo => {
                    this.params[campo.id] = campo.valor;
                });
                this.carregarLista();
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
            async carregarLista() {
                let url = this.urlPaginacao;
                try {
                    const { data : { data: entradas } } =  await this.$axios.get(url, { params:this.params });
                    this.entradas = entradas;
                } catch (errors) {
                    this.tratarErros(errors);
                }
            }, 
            adicionar() {
                this.setState(structuredClone(this.campos));
            },
            editar(resource) {
                this.setState(structuredClone(this.campos));
                this.item.forEach(campo => {
                    if(resource[campo.id !== undefined]) {
                        campo.valor = resource[campo.id];
                    }
                })
                this.item.id=resource.id
            }, 
            async salvar() {
                let url = this.urlBase;
                let form = new FormData();
                if(this.item.id) {
                    url+=`/${this.item.id}`;
                    form.append('_method', 'PATCH');
                }
                form.append('user_id', 1);
                this.item.forEach(campo => {
                    form.append(campo.id, campo.valor);
                })
                try {
                    const { data : entrada } = await this.$axios.post(url, form);
                    this.setTransaction(entrada);
                    this.setTransactionLoaded(true);
                    this.carregarLista();
                } catch (errors) {
                    this.tratarErros(errors);
                    
                }
            }, 
            remover() {
                this.$swal({
                    title: 'Você tem certeza que deseja excluir essa entrada?',
                    text: 'Essa ação não pode ser desfeita!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, excluir!',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        let url = `${this.urlBase}/${this.item[0].id}`;
                        let form = new FormData();
                        form.append('_method', 'DELETE');

                        try {
                            const { data : { message }} = await this.$axios.post(url, form);
                            this.$swal('Excluído!', message, 'success');
                            this.carregarLista();
                        } catch (errors) {
                            this.tratarErros(errors);
                            
                        }
                    }
                });
            }, 
            tratarErros(errors) {
                console.log(errors);
                const errorData = errors.response?.data || {
                    success: false,
                    message: 'Erro ao criar registro.',
                    errors: ['Erro desconhecido.'],
                }
                this.setTransaction(errorData);
                this.setTransactionLoaded(true);
            }
        }, 
        mounted() {
            this.carregarLista();
            this.setFilter(structuredClone(this.camposFiltro));
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