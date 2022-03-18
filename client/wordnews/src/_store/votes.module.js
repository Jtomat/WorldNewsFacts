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
                    error => commit('voteFailure', error)
                );
        },
        votesForUser({commit}, {user}) {
            commit('voteRequest')
            voteService.votesForUser(user)
            .then(
                votes => commit('voteSuccess', votes),
                error => commit('voteFailure', error)
            );
        }
    },
    mutations: {
        voteRequest(state) {
            state.all = { loading: true };
        },
        voteSuccess(state, votes) {
            state.all = { votes };
        },
        voteFailure(state, error) {
            state.all = { error };
        }
    }
}