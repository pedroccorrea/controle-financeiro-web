<template>
    <div class="container">
        <div class="row mt-4 mb-4">
            <div class="col-md-12 text-center">
                <h2>Metas de Investimento</h2>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-md-12 text-end">
                <button 
                    class="btn btn-custom" 
                    data-bs-toggle="modal" 
                    data-bs-target="#modalCriar" 
                    @click.prevent="criar()">
                    Criar Meta
                </button>
            </div>
        </div>
        <div class="col-md-12" style="display: flex;flex-direction: row;align-items: center;justify-content: center; flex-wrap: wrap; gap: 30px;">
            <card-component  v-for="meta in dadosComputados" :key="meta.id" :titulo="meta.nome" :classe="{'w-100': isMobile, 'w-30': !isMobile}">
                <template v-slot:conteudo>
                    <h2>{{ meta.contribuicao }}</h2>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" :style="{ width: `${meta.progresso}%`}" :aria-valuenow="meta.progresso" aria-valuemin="0" aria-valuemax="100">{{ meta.progresso }}%</div>
                    </div>
                    <p>{{ meta.valor }}</p>
                    <p>Data Limite: {{ meta.data_fim }}</p>
                </template>
                <template v-slot:rodape>
                    <button type="submit" class="btn btn-outline-danger" style="float:right;"  @click.prevent="setState(meta.dados), excluir()">Excluir</button>
                    <button type="submit" class="btn btn-outline-primary" style="float:right;" data-bs-toggle="modal" data-bs-target="#modalEditar" @click.prevent="editar(meta.dados)">Editar</button>
                    <button type="submit" class="btn btn-success" style="float:right;" data-bs-toggle="modal" data-bs-target="#modalGasto" @click.prevent="contribuir(meta.dados.id)">Contribuir</button>
                </template>
            </card-component>
        </div>

        <modal-component id="modalCriar" titulo="Criar Meta de Investimento" :campos="this.item">
            <template v-slot:alertas>
                <alert-component tipo="success" v-if="transaction.success && transactionLoaded" titulo="Sucesso!" :dados="transaction"></alert-component>
                <alert-component tipo="danger" v-if="!transaction.success && transactionLoaded" titulo="Erro na operação!" :dados="transaction"></alert-component>
            </template>
            <template v-slot:rodape>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-custom" @click="salvar()">Salvar</button>
            </template>
        </modal-component>

        <modal-component  id="modalEditar" titulo="Editar Meta de Investimento" :campos="this.item">
            <template v-slot:alertas>
                <alert-component tipo="success" v-if="transaction.success && transactionLoaded" titulo="Sucesso!" :dados="transaction"></alert-component>
                <alert-component tipo="danger" v-if="!transaction.success && transactionLoaded" titulo="Erro na operação!" :dados="transaction"></alert-component>
            </template>
            <template v-slot:rodape>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-custom" @click="salvar()">Salvar</button>
            </template>
        </modal-component>

        <modal-component  id="modalGasto" titulo="Contribuir" :campos="camposContribuicao">
            <template v-slot:alertas>
                <alert-component tipo="success" v-if="transaction.success && transactionLoaded" titulo="Sucesso!" :dados="transaction"></alert-component>
                <alert-component tipo="danger" v-if="!transaction.success && transactionLoaded" titulo="Erro na operação!" :dados="transaction"></alert-component>
            </template>
            <template v-slot:rodape>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-custom" @click="salvarContribuicao()">Salvar</button>
            </template>
        </modal-component>
    </div>
</template>
<script>
    export default {
        name: 'Entradas',
        data() {
            return {
                urlBase: '/meta_investimento', 
                urlPaginacao: '/meta_investimento', 
                windowWidth: window.innerWidth,
                metas : { data: [] },
                params: {
                    por_pagina: 10,
                    data_inicio: '',
                    data_fim: ''
                },
                campos: Object.freeze([
                    {
                        id: 'nome', 
                        tipo: 'text',
                        titulo: 'Nome da Meta',
                        valor: '',
                        placeholder: 'Exemplo: Comprar uma casa...'
                    }, 
                    {
                        id: 'valor',
                        tipo: 'number',
                        titulo: 'Valor da Meta',
                        valor: '',
                        placeholder: 'Exemplo 10000'
                    },
                    {
                        id: 'data_inicio',
                        tipo: 'date',
                        titulo: 'Data de Inicio',
                        valor: '' ,
                        placeholder: ''
                    },
                    {
                        id: 'data_fim',
                        tipo: 'date',
                        titulo: 'Data de Conclusão',
                        valor: '',
                        placeholder: ''
                    },
                ]),
                camposContribuicao: [
                    {
                        id: 'valorContribuicao', 
                        tipo: 'text',
                        titulo: 'Valor da Contribuição',
                        valor: '',
                        placeholder: 'Exemplo: 500',
                        meta_investimento_id: ''
                    }
                ],
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
            async carregarLista() {
                let url = this.urlPaginacao;
                try  {
                    const { data: { data: metas } } = await this.$axios.get(url, { params: this.params });
                    this.metas.data = metas;
                } catch (errors) {
                    this.tratarErro(errors);
                }
            },
            criar() {
                this.setState(structuredClone(this.campos));
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
                    const {data: meta} = await this.$axios.post(url, form);
                    console.log(meta)
                    this.setTransaction(meta);
                    this.setTransactionLoaded(true);
                    this.carregarLista();
                } catch (errors) {
                    this.tratarErro(errors);
                }
            },
            editar(resource) {
                this.setState(structuredClone(this.campos));
                this.item.forEach(campo => {
                    if(resource[campo.id] !== undefined) {
                        campo.valor = resource[campo.id];
                    }
                })
                this.item.id=resource.id
            }, 
            excluir() {
                this.$swal({
                    title: 'Você tem certeza que deseja excluir essa meta?',
                    text: 'Essa ação não pode ser desfeita!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, excluir!',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        let url = `${this.urlBase}/${this.item.id}`;
                        let form = new FormData();
                        form.append('_method', 'DELETE');

                        try {
                            const { data: { message } } = await this.$axios.post(url, form);
                            this.$swal({
                                icon: 'success',
                                title: message,
                                showConfirmButton: false,
                                timer: 2000,
                                customClass: {
                                    popup: 'dark-popup',
                                    title: 'dark-title',
                                }
                            });

                            this.carregarLista();
                        } catch (errors) {
                            this.tratarErro(errors);
                        }
                    }
                });
            },
            contribuir(meta) {
                this.camposContribuicao[0].meta_investimento_id = meta;
                this.camposContribuicao[0].valor = '';
                this.limparTransaction();
            },
            async salvarContribuicao() {
                let url = `/contribuicao_meta`;
                let form = new FormData();
                let metaInvestimentoId = this.camposContribuicao[0].meta_investimento_id;
                let valorContribuicao = this.camposContribuicao[0].valor;
                form.append('meta_investimento_id', metaInvestimentoId);
                form.append('valor', valorContribuicao);
                try {
                    const { data: contribuicao } = await this.$axios.post(url, form);
                    this.setTransaction(contribuicao)
                    this.setTransactionLoaded(true);
                    this.carregarLista();
                } catch (errors) {
                    this.tratarErro(errors);
                    
                }
            },
            tratarErro(errors) {
                console.log(errors);
                const errorData = errors.response?.data || {
                    success: false,
                    message: 'Erro ao criar registro.',
                    errors: ['Erro desconhecido.'],
                }
                this.setTransaction(errorData);
                this.setTransactionLoaded(true);
            },
            
            updateWidth() {
                this.windowWidth = window.innerWidth;
            },
        },
        computed: {
            dadosComputados() {
                return this.metas.data.map(meta => {
                    const totalContribuicoes = this.sumValues(meta.contribuicao || []);
                    const valorMeta = parseFloat(meta.valor);
                    const progresso = valorMeta > 0 ? (totalContribuicoes / valorMeta)*100 : 0;
                    return {
                        ...meta,
                        contribuicao: this.formatCurrency(totalContribuicoes),
                        progresso: progresso.toFixed(2),
                        data_inicio: this.formatDate(meta.data_inicio),
                        data_fim: this.formatDate(meta.data_fim),
                        valor: this.formatCurrency(meta.valor),
                        dados: meta
                    };
                });
            },
            isMobile() {
                return this.windowWidth <= 768;
            }
        } ,
        mounted() {
            window.addEventListener("resize", this.updateWidth);
            this.carregarLista();
        },
        beforeUnmount() {
            window.removeEventListener("resize", this.updateWidth);
        },
    };
</script>