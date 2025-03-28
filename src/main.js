import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import  { vuexMixins } from './mixins/vueMixins';
import './style.css';
import api from './services/api';
import VueApexCharts from 'vue3-apexcharts';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const alertOptions = {
    customClass: {
        popup: 'dark-popup',
        title: 'dark-title',
        confirmButton: 'dark-confirm-button',
        cancelButton: 'dark-cancel-button',
    },
}

const app = createApp(App);


app.use(router);
app.mixin(vuexMixins);
app.use(store);
app.use(VueSweetalert2, alertOptions);
app.use(VueApexCharts);

app.config.globalProperties.$axios = api;

import Sidebar from './components/Sidebar.vue';
app.component('sidebar-component', Sidebar);

import Topbar from './components/Topbar.vue';
app.component('topbar-component', Topbar);

import Card from './components/Card.vue';
app.component('card-component', Card);

import Table from './components/Table.vue';
app.component('table-component', Table);

import Modal from './components/Modal.vue';
app.component('modal-component', Modal);

import InputContainer from './components/InputContainer.vue';
app.component('input-container-component', InputContainer);

import Alert from './components/Alert.vue';
app.component('alert-component', Alert);

import Paginate from './components/Paginate.vue';
app.component('paginate-component', Paginate);

import GraficoPizza from './components/GraficoPizza.vue';
app.component('grafico-pizza-component', GraficoPizza);

import GraficoLinha from './components/GraficoLinha.vue';
app.component('grafico-linha-component', GraficoLinha);

app.mount('#app');