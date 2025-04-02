<template>
    <div style="width:100%;display:flex;justify-content:center;align-items:flex-start;flex-direction: column;padding-bottom: 30px;">
        <div style="width: 100%;font-size: 2em;text-align: left;height:100px;background-color: #30475E;padding:20px;">Olá, Pedro</div>
        <div style="width: 100%;" @click="navigateTo('/extrato')">
            <div style="display: flex;align-items: center;justify-content: space-between;width:100%;padding:20px 20px 0 20px;">
                <span>Saldo em conta</span>
                <span style="font-size: 1.5em;">></span>
            </div>
            <div style="padding:0 20px;text-align: left;">
                {{ this.formatCurrency(gastoPorCategoria.saldoAtual) }}
            </div>
        </div>
    </div>
    
    <div class="container">
        <card-component titulo="Gastos por mês">
            <template v-slot:conteudo>
                <grafico-linha-component :dadosParaGrafico="dadosParaGraficoBarras"/>
            </template>
        </card-component>
        
        <card-component titulo="Gastos por categoria">
            <template v-slot:conteudo>
                <grafico-pizza-component :dadosParaGrafico="dadosParaGraficoPizza"/>
            </template>
        </card-component>
    </div>

</template>

<script>
    export default {
        name: 'Home',
        data() {
            return {
                dadosParaGraficoPizza: { labels: [], series: [] },
                dadosParaGraficoBarras: { categories: [], series: [] },
                gastoPorCategoria: {},
                gastosPorMes: [],
            }
        }, 
        methods: {
            async buscarDados() {
                const { data: { data: gastoPorCategoria } } = await this.$axios.get('/relatorios/gastos-por-categoria');
                const { data: { data: gastosPorMes }} = await this.$axios.get('/relatorios/gastos-por-mes');
                
                this.gastoPorCategoria = gastoPorCategoria;
                
                this.dadosParaGraficoBarras.categories = gastosPorMes.map(gasto => gasto.mes);
                this.dadosParaGraficoBarras.series = gastosPorMes.map(gasto => parseFloat(gasto.total));
            },
            buscarCategorias(categoria) {
                let url = `/categoria${categoria ? `/${categoria}` : ''}`;
                return this.$axios.get(url, { params: {incluir_soma_gastos :true} })
            },
            async processarDadosGraficoPizza() {
                try {
                    const pegarGastosRecorrentes = await this.$axios.get(`/recorrente`, { params: { por_pagina: 9999} });
                    const gastosRecorrentes = pegarGastosRecorrentes.data.data.data;
                    const totalGastosRecorrentes = gastosRecorrentes.reduce(
                        (soma, gasto) => soma + parseFloat(gasto.valor || 0), 0
                    );

                    const { data } = await this.buscarCategorias();
                    this.categorias = data.data;
                    
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
                    this.dadosParaGraficoPizza = { labels, series };
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
        computed: {
            meses() {
                return this.gastosPorMes.map(gasto => gasto.mes);
            },
            valores() {
                return this.gastosPorMes.map(gasto => this.formatCurrency(gasto.valor));
            },
        },
        mounted() {
            this.processarDadosGraficoPizza();
            this.buscarDados();
        }
    };
</script>