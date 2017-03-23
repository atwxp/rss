import { get } from 'util/localstorage'

export const feedList = state => state.feedList

export const config = state => state.config

export const getFeedById = state => {
     return function (id) {
         return state.feedList.find(feed => feed.id === id)
     }
}

export const getFeedFromCache = state => {
    return function (id) {
        return get(id)
    }
}
