<template>
    <div>
        <div class="sidebar-content">
            <div class="logo">Gestão fincanceira</div>
            <ul class="menu">
                <li v-for="(item, index) in menuItems" :key="index" @click="navigateTo(item.route)" :class="{ active: isActive(item.route) }">
                    {{ item.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "Sidebar",
    props: {
        isMenuOpen: Boolean,
        menuItems: {
            type: Array,
            default: () => [
                {name: "Dashboard", route: "/"},
                {name: "Entradas", route: "/entradas"},
                {name: "Gastos Diarios", route: "/gastos-diarios"},
                {name: "Gastos Recorrentes", route: "/gastos-recorrentes"},
                {name: "Metas de Investimento", route: "/investimentos"},
                {name: "Histórico de Gastos", route: "/historico-gastos"},
                {name: "Projeção de Metas", route: "/projecao-metas"},
                {name: "Cartões", route: "/cartoes"},
                {name: "Categorias", route: "/categorias"},
                {name: "Sobre", route: "/about"},
            ]
        },
    },
    methods: {
        toggleMenu() {
            this.$emit('toggle-menu');
        },
        navigateTo(route) {
            this.$router.push(route);
            this.currentRoute = route;
            this.$emit('toggle-menu');
        },
        isActive(route) {
            return this.$route.path === route;
        },
    },
};
</script>

<style>
     .sidebar-content {
        height: 100%;
        width: 100%;
        background-color: #212631;
        color: #D2D2D2;
        padding: 15px;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
    }
    .logo {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
        text-align: center;
        height: 20px;
    }
    .menu {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .menu li {
        padding: 10px 15px;
        text-align: left;
        cursor: pointer;
        transition: background-color 0.3s ease, color 0.3s ease;
        border-radius: 5px;
    }
    .menu li:hover {
        background-color: #323a49;
    }

    .menu li.active {
        background-color: #4a566d;
        color: white;
    }

    @media (min-width: 768px) {
        .sidebar {
            transform: translateX(0);
        }
        .overlay {
            display: none;
        }
    }
</style>