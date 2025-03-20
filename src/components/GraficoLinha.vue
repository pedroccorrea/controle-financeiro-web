<template>
    <apexchart type="bar" height="350" :options="lineOptions" :series="lineSeries"></apexchart>
</template>
<script>
    export default {
        name: 'GraficoLinha',
        props: ['dadosParaGrafico'],
        computed: {
            lineOptions() {
                return {
                    chart: {
                        type: 'bar'
                    },
                    xaxis: {
                        categories: this.dadosParaGrafico.categories,
                        labels: {
                            style: {
                                colors: "#9aa0ac",
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: "#9aa0ac",
                            },
                            formatter: (valor) => this.formatCurrency(valor),
                        }
                    },
                    stroke: {
                        curve: "smooth",
                    },
                    colors: ["#FF6384"],
                    tooltip: {
                        y: {
                            formatter: (valor) => this.formatCurrency(valor),
                        }
                    },
                    dataLabels: {
                        formatter: (valor) => this.formatCurrency(valor),
                    }
                }
            }, 
            lineSeries() {
                return [
                    { 
                        name: "Gasto Mensal", 
                        data: this.dadosParaGrafico.series,
                    },
                ];
            },
        }, 
    };
</script>