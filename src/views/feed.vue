<template>
<div class="content">
    <div v-show="loading">loading</div>

    <div v-show="post">
        <feed-item v-for="r in post" :rss="r" :key="r.id"></feed-item>

        <v-pager :total-page="totalPage" v-on:pagechange="pagechange"></v-pager>
    </div>
</div>
</template>

<script>
import * as util from 'util/index'
import * as ls from 'util/localstorage'

import FeedItem from 'components/feed-item'
import VPager from 'components/v-pager'

import { mapState, mapGetters } from 'vuex'

export default {
    data() {
        return {
            loading: false,

            post: null,

            allPost: null,

            totalPage: 0
        }
    },

    computed: {
        ...mapState({
            perPage: state => state.config.perPage,
            expired: state => state.config.expired
        }),

        ...mapGetters([
            'feedList'
        ])
    },

    created() {
        this.fetchData()
    },

    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': 'fetchData'
    },

    methods: {
        setPost(post) {
            this.loading = false

            this.allPost = post
            this
            .totalPage = Math.ceil(this.allPost.length / this.perPage)
        },

        fetchData() {
            this.post = null
            this.loading = true
            this.allPost = null
            this.totalPage = 0

            const me = this
            const id = this.$route.params.id

            const feed = this.feedList.filter(fl => fl.id === id)[0]

            if (!feed) {
                return alert('不存在该feed id')
            }

            // 检查缓存
            const cacheFeed = ls.get(feed.id)
            if (
                cacheFeed && cacheFeed.list && cacheFeed.list.length
                && +new Date() < this.expired * 24 * 60 * 60 * 1000 + cacheFeed._t
            ) {
                this.setPost(cacheFeed.list)
            }
            else {
                util.fetchFeed(feed.url).then(rss => {

                    me.setPost(rss.items)

                    ls.set(feed.id, {
                        list: rss.items,
                        _t: +new Date()
                    })

                }).catch(err => {
                    console.log(err)
                })
            }
        },

        pagechange(curPage) {
            this.post = this.allPost.slice((curPage - 1) * this.perPage, curPage * this.perPage)
        }
    },

    components: {
        FeedItem,
        VPager
    }
}
</script>
