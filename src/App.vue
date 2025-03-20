<template>
    <div class="app-container">
        <topbar-component class="topbar-component" @toggle-menu="toggleMenu"/>
        <sidebar-component class="sidebar-component" :class="{ open: isMenuOpen }" @toggle-menu="toggleMenu"/>
        <div class="main-content">
            <router-view></router-view>
        </div>
        <div class="overlay" v-if="isMenuOpen" @click.stop="toggleMenu"></div>
    </div>
</template>
<script>

export default {
    name: 'App',
    data() {
        return {
            isMenuOpen: false,
        };
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
    },
};
</script>

<style>
    #app {
        margin: 0 !important;
        padding: 0 !important;
    }
    .app-container {
        display: grid;
        grid-template-columns: 0 auto;
        grid-template-rows: 50px auto;
        grid-template-areas: 
            "sidebar topbar"
            "sidebar main";
        height: 100vh;
        width: 100vw;
    }

    .sidebar-component {
        grid-area: sidebar;
        position: absolute;
        top: 0;
        left: 0;
        width: 250px;
        height: 100%;
        transition: transform 0.3s ease;
        transform: translateX(-100%);
        z-index: 100;
    }
    @media (min-width: 1024px) {
        .app-container {
            grid-template-columns: 250px auto;
        }
        .sidebar-component {
            position: relative;
            transform: translateX(0);
        }
    }
    .sidebar-component.open{
        transform: translateX(0);
    }
    .topbar-component {
        grid-area: topbar;
        z-index: 90;
    }

    .main-content {
        grid-area: main;
        padding: 10px;
        overflow-y: auto;
        background-color: #1D222B;
        color: #D2D2D2;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.1);
        z-index: 95;
    }
    .dark-popup {
        background-color: #212631;
        color: #fff; 
        border: 1px solid #495057;
    }

    .dark-title {
        color: #f8f9fa;
    }

    .dark-confirm-button {
        background-color: #6261CC;
        color: #fff;
        border: none;
    }

    .dark-cancel-button {
        background-color: #6c757d;
        color: #fff;
        border: none;
    }
</style>
