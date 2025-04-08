<template>
    <div class="container">
        <card-component titulo="Relação de Cartões">
            <template v-slot:conteudo>
                <table-component 
                    :visualizar="{visivel: false, dataToggle:'modal', dataTarget:'#modalVisualizar'}"
                    :atualizar="{visivel: true, dataToggle:'modal', dataTarget:'#modalEditar', callback: editar}"
                    :remover="{visivel: true, callback: remover}"
                    :dados="cartoes.data"
                    :titulos="{
                        id: {titulo: 'ID', tipo: 'texto'},
                        nome: {titulo: 'Nome', tipo: 'texto'},
                        limite: {titulo: 'Limite', tipo: 'moeda'},
                        data_vencimento: {titulo: 'Vencimento', tipo:'data'},
                    }"
                ></table-component>
            </template>
            <template v-slot:rodape>
                <paginate-component>
                    <li :class="link.active? 'page-item active':'page-item'" v-for="link, key in cartoes.links" :key="key"><a class="page-link" href="#" v-html="formatLabel(link.label)" @click="paginacao(link)"></a></li>
                </paginate-component>
                <button type="submit" class="btn btn-custom" style="float:right;" data-bs-toggle="modal" data-bs-target="#modalCriar" @click.prevent="adicionar()">Adicionar</button>
            </template>
        </card-component>
    </div>

    <modal-component id="modalCriar" titulo="Cadastrar cartão" :campos="this.item">
        <template v-slot:alertas>
            <alert-component tipo="success" v-if="transaction.success && transactionLoaded" titulo="Sucesso!" :dados="transaction"></alert-component>
            <alert-component tipo="danger" v-if="!transaction.success && transactionLoaded" titulo="Erro na operação!" :dados="transaction"></alert-component>
        </template>
        <template v-slot:rodape>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-custom" @click="salvar()">Salvar</button>
        </template>
    </modal-component>

    <modal-component id="modalEditar" titulo="Atualizar cartão" :campos="this.item">
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
                urlBase: '/cartao', 
                urlPaginacao: '/cartao', 
                cartoes : { data: [] },
                campos: Object.freeze([
                    {
                        id: 'nome', 
                        tipo: 'text',
                        titulo: 'Nome do cartão',
                        valor: '',
                        placeholder: 'Exemplo: Nubank...'
                    }, 
                    {
                        id: 'limite',
                        tipo: 'number',
                        titulo: 'Valor do Limite',
                        valor: '',
                        placeholder: 'Exemplo: 2000'
                    },
                    {
                        id: 'data_vencimento',
                        tipo: 'date',
                        titulo: 'Vencimento',
                        valor: '',
                        placeholder: ''
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
            carregarLista() {
                let url = this.urlPaginacao;
                this.$axios.get(url)
                .then(response => {
                    this.cartoes = response.data;
                })
            }, 
            adicionar() {
                this.setState(structuredClone(this.campos));
            },
            editar(resource) {
                this.setState(structuredClone(this.campos));
                Object.entries(resource).forEach(([chave, valor]) => {
                    let campo = this.item.find(obj => obj.id === chave);
                    if(campo) {
                        campo.valor=valor;
                    }
                })
                this.item.id=resource.id
            }, 
            async salvar() {
                try {
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

                    const { data } = await this.$axios.post(url, form);

                    this.setTransaction(data);
                    this.setTransactionLoaded(true);
                    this.carregarLista();
                } catch (error) {
                    const errorData = error.response?.data || {
                        success: false,
                        message: 'Erro ao criar registro.',
                        errors: ['Erro desconhecido.'],
                    }
                    this.setTransaction(errorData);
                    this.setTransactionLoaded(true);
                }
            }, 
            remover() {
                this.$swal({
                    title: 'Você tem certeza que deseja excluir este cartão?',
                    text: 'Essa ação não pode ser desfeita!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, excluir!',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            let url = `${this.urlBase}/${this.item[0].id}`;
                            let form = new FormData();
                            form.append('_method', 'DELETE');

                            const { data: { message } } = await this.$axios.post(url, form)

                            this.$swal('Excluído!',message, 'success');
                            
                            this.carregarLista();
                        } catch (error) {
                            console.log('erro', error);
                        }
                    }
                });
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