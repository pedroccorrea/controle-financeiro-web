<template>
    <div class="container">
        <div :class="estilo" role="alert">
            {{ titulo }}
            <hr>
            <p>{{ dados.message }}</p>
            <ul v-if="dados.dados">
                <li v-for="e, key in dados.dados" :key="key">{{ e[0] }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['tipo', 'titulo', 'dados'],
        computed: {
            estilo() {
                return `alert alert-${this.tipo}`
            }
        }
    }
</script>
