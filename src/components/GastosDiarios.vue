<template>
    <div class="container">
        <card-component titulo="Filtrar Gastos">
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
        <card-component titulo="Analise">
            <template v-slot:conteudo>
                <grafico-pizza-component :dadosParaGrafico="dadosParaGrafico"/>
            </template>
        </card-component>
        <card-component titulo="Relação de Gastos">
            <template v-slot:conteudo>
                <table-component 
                    :visualizar="{visivel: false, dataToggle:'modal', dataTarget:'#modalEntradaVisualizar'}"
                    :atualizar="{visivel: true, dataToggle:'modal', dataTarget:'#modalEditar', callback: editar}"
                    :remover="{visivel: true, callback: remover}"
                    :dados="gastos.data"
                    :titulos="{
                        nome: {titulo: 'Nome', tipo: 'texto'},
                        categoria: {titulo: 'Categoria', tipo: 'texto'},
                        valor: {titulo: 'Valor', tipo: 'moeda'},
                        created_at: {titulo: 'Data', tipo:'data'},
                    }"
                ></table-component>
            </template>
            <template v-slot:rodape>
                <paginate-component>
                    <li :class="link.active? 'page-item active':'page-item'" v-for="link, key in gastos.links" :key="key"><a class="page-link" href="#" v-html="formatLabel(link.label)" @click="paginacao(link)"></a></li>
                </paginate-component>
                <button type="submit" class="btn btn-custom" style="float:right;" data-bs-toggle="modal" data-bs-target="#modalCriar" @click.prevent="adicionar()">Adicionar</button>
            </template>
        </card-component>
    </div>

    <modal-component id="modalCriar" titulo="Registrar Gasto" :campos="camposFiltrados()">
        <template v-slot:alertas>
            <alert-component tipo="success" v-if="transaction.success && transactionLoaded" titulo="Sucesso!" :dados="transaction"></alert-component>
            <alert-component tipo="danger" v-if="!transaction.success && transactionLoaded" titulo="Erro na operação!" :dados="transaction"></alert-component>
        </template>
        <template v-slot:rodape>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-custom" @click="salvar()">Salvar</button>
        </template>
    </modal-component>

    <modal-component id="modalEditar" titulo="Atualizar Gasto" :campos="camposFiltrados()">
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
    import moment from 'moment';
    export default {
        name: 'Entradas',
        data() {
            return {
                urlBase: '/gasto_diario', 
                urlPaginacao: '/gasto_diario', 
                gastos : { data: [] },
                dadosParaGrafico: { labels: [], series: [] },
                categorias: [],
                camposFiltro: Object.freeze([
                    // {id: 'por_pagina', tipo: 'number', titulo: 'Por Página', valor: 10, placeholder: 'Exemplo 10'},
                    {id: 'data_inicio', tipo: 'date', titulo: 'Inicio do Período', valor: '', placeholder: 'Exemplo 2021-01-01'},
                    {id: 'data_fim', tipo: 'date', titulo: 'Fim do Período', valor: '', placeholder: 'Exemplo 2021-01-31'},
                    {
                        id: 'categoria_id',
                        tipo: 'select',
                        titulo: 'Categoria',
                        valor: '',
                        placeholder: 'Exemplo: Comida',
                        options: []
                    }
                ]),
                params : {},
                campos: Object.freeze([
                    {
                        id: 'nome', 
                        tipo: 'text',
                        titulo: 'Nome do Gasto',
                        valor: '',
                        placeholder: 'Exemplo: Refrigerante...'
                    }, 
                    {
                        id: 'categoria_id',
                        tipo: 'select',
                        titulo: 'Categoria',
                        valor: '',
                        placeholder: 'Exemplo: Comida',
                        options: []
                    },
                    {
                        id: 'valor',
                        tipo: 'number',
                        titulo: 'Valor do Gasto',
                        valor: '',
                        placeholder: 'Exemplo: 12'
                    },
                    {
                        id: 'cartao',
                        tipo: 'select',
                        titulo: 'Cartão',
                        valor: '',
                        placeholder: 'Exemplo: Nubank',
                        options: []
                    },
                    {
                        id: 'tipo',
                        tipo: 'select',
                        titulo: 'Crédito/Debito',
                        valor: 1,
                        placeholder: 'Exemplo: Crédito',
                        options: [
                            {valor: 1, nome: 'Débito'},
                            {valor: 2, nome: 'Crédito'},
                        ]
                    },
                    {
                        id: 'parcelas',
                        tipo: 'select',
                        titulo: 'Quantidade de Parcelas',
                        valor: 0,
                        placeholder: 'Exemplo: 12x',
                        options: [
                            {valor: 1, nome: '1x', selected:true},
                            {valor: 2, nome: '2x'},
                            {valor: 3, nome: '3x'},
                            {valor: 4, nome: '4x'},
                            {valor: 5, nome: '5x'},
                            {valor: 6, nome: '6x'},
                            {valor: 7, nome: '7x'},
                            {valor: 8, nome: '8x'},
                            {valor: 9, nome: '9x'},
                            {valor: 10, nome: '10x'},
                            {valor: 11, nome: '11x'},
                            {valor: 12, nome: '12x'},
                        ]
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
            camposFiltrados() {
                const tipoCampo = this.item.find(campo =>campo.id === 'tipo');
                const isCredito = tipoCampo ? tipoCampo.valor === 2 : false;
                return this.item.filter(campo => {
                    if(campo.id === 'parcelas') {
                        return isCredito;
                    }
                    return true;
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
                try {
                    const response = await this.$axios.get(this.urlPaginacao, { params:this.params });
                    this.gastos.data = response.data.data.data;
                } catch (errors) {
                    this.tratarErro(errors);
                }

            }, 
            carregarCartoes() {
                let url = '/cartao';
                this.$axios.get(url)
                    .then(response => {
                        const options = response.data.data.map(cartao => ({
                            valor: cartao.id, 
                            nome: cartao.nome
                        }));
                        this.atualizarCampoOptions('cartao', options);
                    })
            },
            buscarCategorias(categoria) {
                let url = `/categoria${categoria ? `/${categoria}` : ''}`;
                return this.$axios.get(url, { params: {incluir_soma_gastos :true} })
            },
            async carregarCategorias() {
                try {
                    const { data } = await this.buscarCategorias();
                    this.categorias = data.data;
                    const options = this.categorias.map(categoria => ({
                        valor: categoria.id, 
                        nome: categoria.nome
                    }));

                    this.atualizarCampoOptions('categoria_id', options);
                    this.atualizarCampoOptions('categoria_id', options, 'camposFiltro');
                } catch (error) {
                    this.tratarErro(error);
                }
            },
            atualizarCampoOptions(campoId, options, tipo = 'campos') {
                const campo = this[tipo].find(campo => campo.id == campoId)
                if(!campo) return;
                campo.options = options;
            },
            adicionar() {
                this.setState(structuredClone(this.campos));
            },
            async editar(resource) {
                this.setState(structuredClone(this.campos));
                
                this.item.forEach(campo => {
                    if(resource[campo.id] !== undefined) {
                        campo.valor = resource[campo.id];
                    }
                });
                
                if(resource.transacao_cartao_id) {
                    let url = `/transacao_cartao/${resource.transacao_cartao_id}`;
                    try {
                        const { data: {data: transacao }} = await this.$axios.get(url);
                        this.atualizarCampo('cartao', transacao.cartao_id);
                        this.atualizarCampo('tipo', transacao.tipo);
                        this.atualizarCampo('parcelas', transacao.quantidade_parcelas);
                    } catch (error) {
                        this.tratarErro(error);
                    }
                }
                this.item.id=resource.id;
            }, 
            atualizarCampo(id, valor) {
                let campo = this.item.find(campo => campo.id === id);
                if(campo) campo.valor = valor;
            },
            async salvar() {
                let urlTransacao = '/transacao_cartao';
                let urlGasto = this.urlBase;
                let tipo = this.item.find(campo => campo.id === 'tipo').valor;
                const dadosTransacao = {
                    user_id: 1,
                    valor: this.item.find(campo => campo.id === 'valor').valor,
                    cartao_id: this.item.find(campo => campo.id === 'cartao').valor,
                    tipo: tipo,
                    quantidade_parcelas: tipo === 2? this.item.find(campo => campo.id === 'parcelas').valor : 1,
                    data: moment().format('YYYY-MM-DD'),
                }

                try {
                    const { data: { data: transacao } } = await this.$axios.post(urlTransacao, dadosTransacao);
                    const dadosGasto = {
                        user_id: 1,
                        nome: this.item.find(campo => campo.id === 'nome').valor,
                        categoria_id: this.item.find(campo => campo.id === 'categoria_id').valor,
                        valor: this.item.find(campo => campo.id === 'valor').valor,
                        transacao_cartao_id: transacao.id,
                    }
                    if(this.item.id) {
                        urlGasto+=`/${this.item.id}`;
                        dadosGasto._method = 'PATCH';
                    }

                    try {
                        const { data } = await this.$axios.post(urlGasto, dadosGasto)
                        this.setTransaction(data);
                        this.setTransactionLoaded(true);
                        this.atualizarDados();
                    } catch (errors) {
                        this.tratarErro(errors);
                    }
                } catch (errors) {
                    this.tratarErro(errors);
                }
                
            }, 
            atualizarDados() {
                this.carregarLista();
                this.carregarCategorias();
                this.processarDadosGrafico();
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
                        let item = this.item[0];
                        let url = `${this.urlBase}/${item.id}`;
                        let form = new FormData();
                        form.append('_method', 'DELETE');

                        try {
                            const  {data: { message } } = await this.$axios.post(url, form);
                            this.$swal('Excluído!', message, 'success');
                            this.atualizarDados();
                        } catch (errors) {
                            this.tratarErro(errors)
                        }
                    }
                });
            }, 
            async processarDadosGrafico() {
                try {
                    const pegarGastosRecorrentes = await this.$axios.get(`/recorrente`, { params: { por_pagina: 9999} });
                    const gastosRecorrentes = pegarGastosRecorrentes.data.data.data;
                    const totalGastosRecorrentes = gastosRecorrentes.reduce(
                        (soma, gasto) => soma + parseFloat(gasto.valor || 0), 0
                    );
                    
                    const { labels, series } = this.categorias.reduce((acumulador, categoria) => {
                        const totalGasto = parseFloat(categoria.valor) || 0;
                        if(totalGasto > 0) {
                            acumulador.labels.push(categoria.nome);
                            acumulador.series.push(totalGasto);
                        }
                        return acumulador;
                    }, { labels: [], series: [] });
                    if(totalGastosRecorrentes > 0) {
                        labels.push('Gastos Recorrentes');
                        series.push(totalGastosRecorrentes);
                    }
                    this.dadosParaGrafico = { labels, series };
                } catch (errors) {
                    this.tratarErro(errors);
                }
            }, 
            tratarErro(errors) {
                console.log(errors)
                const errorData = errors.response?.data || {
                    success: false,
                    message: 'Erro ao criar registro.',
                    errors: ['Erro desconhecido.'],
                };
                this.setTransaction(errorData);
                this.setTransactionLoaded(true);
            }
        }, 
        mounted() {
            this.carregarCategorias().then(() => {
                this.setState(structuredClone(this.campos));
                this.setFilter(structuredClone(this.camposFiltro));
            });
            this.carregarLista().then(() => {
                this.processarDadosGrafico();
            });
            this.carregarCartoes();
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