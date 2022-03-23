import { voteService } from '../_services';

export const votes = {
    namespaced: true,
    state: {
        all: {},
        current: {}
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
            commit('currentVoteRequest')
            voteService.votesForUser(user)
            .then(
                votes => commit('getVoteSuccess', votes),
                error => commit('getVoteFailure', error)
            );
        }
    },
    mutations: {
        voteRequest(state) {
            state.current = { loading: true };
        },
        voteSuccess(state, votes) {
            state.current = { votes };
        },
        voteFailure(state, error) {
            state.current = { error };
        },
        getVoteRequest(state) {
            state.all = { loading: true };
        },
        getVoteSuccess(state, votes) {
            state.all = { votes };
        },
        getVoteFailure(state, error) {
            state.all = { error };
        }
    }
}