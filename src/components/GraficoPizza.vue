<template>
    <apexchart type="pie" height="350" :options="pieOptions" :series="pieSeries"></apexchart>
</template>
<script>
import VueApexCharts from 'vue3-apexcharts';

    export default {
        name: 'GraficoPizza',
        props: ['dadosParaGrafico'],
        computed: {
            pieOptions() {
                return {
                    chart: {
                        type: 'pie'
                    },
                    labels: this.dadosParaGrafico.labels,
                    responsive: [{
                        breakpoint: 300,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }],
                    theme: {
                        monochrome: {
                            enabled: true,
                            color: '#255aee',
                            shadeTo: 'light',
                            shadeIntensity: 16
                        }
                    },
                    legend: {
                        show: true,
                        position: 'right',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        labels: {
                            useSeriesColors: true,
                        },
                        horizontalAlign: 'center',
                    }      
                }
            }, 
            pieSeries() {
                return this.dadosParaGrafico.series;
            }
        }, 
    };
</script>