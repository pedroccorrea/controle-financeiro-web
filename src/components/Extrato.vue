<template>
    <div class="container">
        <card-component titulo="Extrato">
            <template v-slot:conteudo>
                <div>
                    <div v-for="movimentacao, in extrato" key="i" style="width:100%;display: flex;align-items: flex-start;justify-content: center;flex-direction: row;">

                        <div style="display: flex;align-items: center;justify-content: center;flex-direction: row;border-bottom: 1px solid #000;width: 100%;padding: 10px;">
                            <div style="width: 20%;"></div>
                            <div style="width:100%;display: flex;align-items: flex-start;justify-content: center;flex-direction: column;gap:7px;">
                                <span>Movimentação de {{ movimentacao.tipo }}</span>
                                <span>{{ movimentacao.nome }} {{ movimentacao.cartao ?? '' }} </span>
                                <span>{{ valorFormatado(movimentacao) }}</span>
                            </div>
                            <div style="display: flex;align-items: center;justify-content: center;height: 100%;">{{ this.formatDate(movimentacao.data) }}</div>
                        </div>

                    </div>
                </div>
            </template>
        </card-component>
    </div>
</template>

<script>
    export default {
        name: 'Extrato',
        data() {
            return {
                dadosParaGrafico: { labels: [], series: [] },
                extrato: [],
            }
        }, 
        methods: {
            async buscarExtrato() {
                try {
                    const {data: {data: extrato } } = await this.$axios.get('/relatorios/extrato');
                    this.extrato = extrato;
                } catch (errors) {
                    console.log(errors);
                }
            },
            valorFormatado(movimentacao) {
                const simbolo = movimentacao.tipo === 'Entrada' ? '+': '-';
                return `${simbolo} ${this.formatCurrency(movimentacao.valor)}`;
            },
            tratarErro(errors) {
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
            this.buscarExtrato();
        }
    };
</script>