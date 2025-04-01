<template>
    <div class="container">
        <card-component>
            <template v-slot:conteudo>
                <h1>Login</h1>
                <form @submit.prevent="login">
                    <div v-for="campo, index in campos" :key="index" class="form-group">
                        <input-container-component :campo="campo"/>
                    </div> 
                    <button type="submit" class="btn btn-custom"  @click.prevent="handleLogin()">Entrar</button>
                </form>
            </template>
        </card-component>
    </div>
</template>

<script>
import { mapActions } from 'vuex'; // Para mapear as ações do Vuex

export default {
    data() {
        return {
            urlBase: 'http://localhost:8000/api/recebimento',
            urlPaginacao: 'http://localhost:8000/api/recebimento',
            entradas: { data: [] },
            params: {},
            campos: Object.freeze([
                {
                    id: 'email',
                    tipo: 'text',
                    titulo: 'Email',
                    valor: '',
                    placeholder: 'Digite seu email..'
                },
                {
                    id: 'password',
                    tipo: 'password',
                    titulo: 'Senha',
                    valor: '',
                    placeholder: 'Digite sua senha...'
                },
            ])
        }
    },
    methods: {
        ...mapActions('auth', ['login']),
        setState(obj) {
                this.limparTransaction();
                this.setItem(obj);
        },
        limparTransaction() {
            this.setTransactionLoaded(false);
            this.setTransaction({
                success: false, 
                message: '', 
                data: null, 
                errors: [],
            })
        },
        async handleLogin() {
            const form = new FormData();
            this.setState(structuredClone(this.campos));

            this.item.forEach(campo => {
                form.append(campo.id, campo.valor);
            })

            const credentials = {
                email: this.item.find(campo => campo.id === 'email').valor,
                password: this.item.find(campo => campo.id === 'password').valor
            }

            const response = await this.login(form);

            if (response.success) {
                this.$router.push({ name: "Home" });
            } else {
                this.errorMessage = response.message;
            }
        }
    }
};
</script>