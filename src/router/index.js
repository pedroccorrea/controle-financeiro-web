import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import About from '../components/About.vue';
import Entradas from '../components/Entradas.vue';
import GastosRecorrentes from '../components/GastosRecorrentes.vue';
import MetasInvestimentos from '../components/MetasInvestimentos.vue';
import GastosDiarios from '../components/GastosDiarios.vue';
import Cartoes from '../components/Cartoes.vue';
import Categorias from '../components/Categorias.vue';
import Extrato from '../components/Extrato.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/extrato', name: 'Extrato', component: Extrato },
    { path: '/entradas', name: 'Entradas', component: Entradas },
    { path: '/gastos-recorrentes', name: 'GastosRecorrentes', component: GastosRecorrentes },
    { path: '/gastos-diarios', name: 'GastosDiarios', component: GastosDiarios },
    { path: '/investimentos', name: 'MetasInvestimentos', component: MetasInvestimentos },
    { path: '/cartoes', name: 'Cartoes', component: Cartoes },
    { path: '/categorias', name: 'Categorias', component: Categorias },
    { path: '/about', name: 'About', component: About },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;