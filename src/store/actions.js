import * as types from './mutation-type'

export const addFeed = ({ commit }, feed) => {
    commit(types.ADD_FEED, Array.isArray(feed) ? feed : [feed])
}

export const deleteFeed = ({ commit }, id) => {
    commit(types.DELETE_FEED, id)
}

export const updateConfig = ({commit}, cfg) => {
    commit(types.UPDATE_CONFIG, cfg)
}
