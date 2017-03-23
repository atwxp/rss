import Vue from 'vue'

import * as types from './mutation-type'

import { gid, parseFeed } from 'util/index'

export const addFeed = ({ commit }, feed) => {
    commit(types.ADD_FEED, Array.isArray(feed) ? feed : [feed])
}

export const deleteFeed = ({ commit }, id) => {
    commit(types.DELETE_FEED, id)
}

export const updateConfig = ({ commit }, cfg) => {
    commit(types.UPDATE_CONFIG, cfg)
}

export const fetchFeedList = ({ commit }, [ url, id ]) => {
    return new Promise((resolve, reject) => {

        const success = function (data) {
            let rss = parseFeed(data, url)

            if (rss) {
                Object.assign(rss, {
                    id: id || gid(),
                    url: url
                })

                commit(types.SET_FEEDLIST, rss)

                resolve(rss)
            }
            else {
                reject()
            }
        }

        Vue.http.get(url).then(response => {
            if (!response.ok) {
                reject()
            }

            else if (typeof response.body === 'string') {
                success(response.body)
            }

            else {
                const reader = new FileReader()

                reader.onload = function (e) {
                    success(e.target.result)
                }

                reader.onerror = function () {
                    reject()
                }

                reader.readAsText(response.body)
            }
        }, err => {
            reject(err)
        })
    })
}
