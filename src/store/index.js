import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

import { get } from 'util/localstorage'

Vue.use(Vuex)

const config = get('config') || {}

const state = {
    config: {
        perPage: config.perPage || 5,
        expired: config.expired || 1
    },
    feedList: get('feeds') || []
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})
