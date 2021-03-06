import Vue from 'vue';
import Vuex from 'vuex';

import { alert } from './alert.module';
import { authentication } from './auth.module';
import { users } from './users.module';
import { news } from './news.module';
import { votes } from './votes.module';

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        alert,
        authentication,
        users,
        news,
        votes
    } 
});
