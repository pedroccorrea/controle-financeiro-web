<template>
    <div class="container">
        <card-component titulo="Relação de Categorias">
            <template v-slot:conteudo>
                <table-component 
                    :visualizar="{visivel: false, dataToggle:'modal', dataTarget:'#modalVisualizar'}"
                    :atualizar="{visivel: true, dataToggle:'modal', dataTarget:'#modalAtualizar', callback: editar}"
                    :remover="{visivel: true, callback: remover}"
                    :dados="categorias.data"
                    :titulos="{
                        id: {titulo: 'ID', tipo: 'texto'},
                        nome: {titulo: 'Nome', tipo: 'texto'},
                        created_at: {titulo: 'Data', tipo:'data'},
                    }"
                ></table-component>
            </template>
            <template v-slot:rodape>
                <paginate-component>
                    <li :class="link.active? 'page-item active':'page-item'" v-for="link, key in categorias.links" :key="key"><a class="page-link" href="#" v-html="formatLabel(link.label)" @click="paginacao(link)"></a></li>
                </paginate-component>
                <button type="submit" class="btn btn-custom" style="float:right;" data-bs-toggle="modal" data-bs-target="#modalAdicionar" @click.prevent="adicionar()">Adicionar</button>
            </template>
        </card-component>
    </div>

    <modal-component id="modalAdicionar" titulo="Criar Entrada" :campos="this.item">
        <template v-slot:alertas>
            <alert-component tipo="success" v-if="transaction.success && transactionLoaded" titulo="Sucesso!" :dados="transaction"></alert-component>
            <alert-component tipo="danger" v-if="!transaction.success && transactionLoaded" titulo="Erro na operação!" :dados="transaction"></alert-component>
        </template>
        <template v-slot:rodape>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-custom" @click="salvar()">Salvar</button>
        </template>
    </modal-component>

    <modal-component id="modalAtualizar" titulo="Atualizar Entrada" :campos="this.item">
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
        name: 'Categoria',
        data() {
            return {
                urlBase: '/categoria', 
                urlPaginacao: '/categoria', 
                categorias : { data: [] },
                params : {},
                campos: Object.freeze([
                    {
                        id: 'nome', 
                        tipo: 'text',
                        titulo: 'Nome da Categoria',
                        valor: '',
                        placeholder: 'Exemplo: Comida...'
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
                const { data: categorias } = await this.$axios.get(url, { params:this.params })
                this.categorias = categorias;
            }, 
            adicionar() {
                this.setState(structuredClone(this.campos));
            },
            editar(resource) {
                this.setState(structuredClone(this.campos));
                this.item.forEach(campo => {
                    if(resource[campo.id] !== undefined) {
                        campo.valor=resource[campo.id];
                    }
                });
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
                    const { data: categoria } = await this.$axios.post(url, form);
                    this.setTransaction(categoria);
                    this.setTransactionLoaded(true);
                    this.carregarLista();
                } catch (errors) {
                    this.tratarErro(errors);
                }
            }, 
            remover() {
                this.$swal({
                    title: 'Você tem certeza que deseja excluir essa categoria?',
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
                            const { data: { message }} = await this.$axios.post(url, form);
                            console.log(message)
                            console.log(message)
                            this.$swal('Excluído!', message, 'success');
                                this.carregarLista();
                        } catch (errors) {
                            this.tratarErro(errors);
                            
                        }
                    }
                });
            }, 
            tratarErro(errors) {
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
        },
    };
</script>