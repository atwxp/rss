import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

import { get } from 'util/localstorage'

Vue.use(Vuex)

const state = {
    config: {
        perPage: get('perPage') || 5,
        expired: get('expired') || 1
    },

    feedList: get('feeds') || []
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})
