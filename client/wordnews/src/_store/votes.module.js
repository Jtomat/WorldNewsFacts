import { voteService } from '../_services';

export const votes = {
    namespaced: true,
    state: {
        all: {}
    },
    actions: {
        vote({commit}, { user, result, proof, news }) {
            commit('voteRequest');
            voteService.vote( user, result, proof, news)
                .then(
                    vote => commit('getAllSuccess', vote),
                    error => commit('getAllFailure', error)
                );
        }
    },
    mutations: {
        voteRequest(state) {
            state.all = { loading: true };
        },
        voteSuccess(state, news) {
            state.all = { news };
        },
        voteFailure(state, error) {
            state.all = { error };
        }
    }
}