import { createStore } from "vuex";

export default createStore({
    state: {
        item: [],
        filters: {},
        transaction: {
            success: false,
            message: '',
            data: null,
            errors: [],
        },
        transactionLoaded: false,
    },
    mutations: {
        setItem(state, item) {
            state.item = item;
        },
        setFilter(state, filters) {
            state.filters = filters;
        },
        setTransaction(state, transactionData) {
            state.transaction = transactionData;
        }, 
        setTransactionLoaded(state, loaded) {
            state.transactionLoaded = loaded;
        }
    },
    actions: {
        async handleApiTransaction({ commit }, apiCall) {
            try {
                const response = await apiCall();
                commit('setTransaction', response.data);

                if(!response.data.success) {
                    throw new Error(response.data.message || 'Erro desconhecido');
                }
                return response.data;
            } catch (error) {
                const errorData = error.response?.data || {
                    success: false,
                    message: 'Erro ao realizar a transação',
                    data: null, 
                    errors: ['Erro desconhecido'],
                };
                commit('setTransaction', errorData);
                throw new Error(errorData.message || 'Erro desconhecido');
            }
        }
    },
    getters: {
        transaction: (state) => state.transaction,
        transactionLoaded: (state) => state.transactionLoaded,
    },
});