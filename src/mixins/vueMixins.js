import { computed } from "vue";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import moment from 'moment';

export const vuexMixins = {
    computed: {
        ...mapState({
            item: state => state.item,
            filters: state => state.filters,
            transaction: state => state.transaction,
            transactionLoaded: state => state.transactionLoaded
        }),
        ...mapGetters(['transaction', 'transactionLoaded']),

        ...mapState('auth', {
            token: state => state.token,
            user: state => state.user 
        }),
        ...mapGetters('auth', ['isAuthenticated']),

        isLoggedIn() {
            return !!this.token;
        }, 
    },
    methods: {
        ...mapActions(['handleApiTransaction']),
        ...mapMutations(['setItem', 'setFilter', 'setTransaction', 'setTransactionLoaded']), 

        formatDate(date) {
            if(!date) return '';
            return moment(String(date)).format('DD/MM/YYYY');
        }, 
        formatDateTime(date) {
            if(!date) return '';
            return moment(String(date)).format('DD/MM/YYYY HH:mm');
        },
        formatCurrency(value) {
            if (isNaN(value)) return '';
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        },
        sumValues(array, key = 'valor') {
            return array.reduce((sum, item) => {
                return sum + parseFloat(item[key] || 0);
            }, 0);
        },
        navigateTo(route) {
            this.$router.push(route);
            this.currentRoute = route;
            this.$emit('toggle-menu');
        }
    }
}