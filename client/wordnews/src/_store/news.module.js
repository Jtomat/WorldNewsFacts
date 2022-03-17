import { newsService } from '../_services';

export const news = {
    namespaced: true,
    state: {
        all: {}
    },
    actions: {
        getAll({commit}) {
            commit('getAllRequest');

            newsService.getAll()
                .then(
                    news => commit('getAllSuccess', news),
                    error => commit('getAllFailure', error)
                );
        }
    },
    mutations: {
        getAllRequest(state) {
            state.all = { loading: true };
        },
        getAllSuccess(state, news) {
            state.all = { news };
        },
        getAllFailure(state, error) {
            state.all = { error };
        }
    }
}