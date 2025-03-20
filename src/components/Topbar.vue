<template>
     <div class="topbar-content">
        <button class="hamburger" @click="toggleMenu" :class="{ visible: !isMenuOpen}">
            <span></span>
            <span></span>
            <span></span>
        </button>
     </div>
</template>

<script>
    export default {
        name: "Topbar",
        props: ['isMenuOpen'],
        methods: {
            toggleMenu() {
                this.$emit('toggle-menu')
            }
        }
    }
</script>

<style scoped>
    .topbar-content {
        width: 100%;
        height: 100%;
        background-color: #212631;
        color: #D2D2D2;
        padding: 15px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .hamburger {
        position: fixed;
        top: 15px;
        left: 15px;
        z-index: 110;
        background: none;
        border: none;
        cursor: pointer;
        flex-direction: column;
        justify-content: space-between;
        width: 30px;
        height: 25px;
        padding: 0;
    }
    .hamburger span {
        display: block;
        width: 100%;
        height: 4px;
        background-color: #D2D2D2;
        border-radius: 2px;
        transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
        .hamburger {
            display: flex;
        }
    }

    @media (min-width: 768px) {
        .hamburger {
            display: none;
        }
    }
</style>