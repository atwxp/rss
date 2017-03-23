<template>
<div class="content">
    <div v-show="loading">loading</div>

    <div v-show="post">
        <feed-item v-for="r in post" :rss="r" :key="r.id"></feed-item>

        <v-pager :total-page="totalPage" :init-page="initPage" v-on:pagechange="pagechange"></v-pager>
    </div>
</div>
</template>

<script>
import FeedItem from 'components/feed-item'
import VPager from 'components/v-pager'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            loading: false,

            allPost: [],

            post: [],

            totalPage: 0,

            initPage: 0
        }
    },

    computed: {
        ...mapState({
            perPage: state => state.config.perPage,
            expired: state => state.config.expired
        }),

        ...mapGetters([
            'feedList',
            'getFeedById',
            'getFeedFromCache'
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
        ...mapActions([
            'fetchFeedList'
        ]),

        setPost(post) {
            this.loading = false

            this.allPost = post

            this.initPage = 1

            this.totalPage = Math.ceil(this.allPost.length / this.perPage)

            this.pagechange(this.initPage)
        },

        fetchData() {
            this.post = []
            this.loading = true
            this.allPost = []
            this.totalPage = 0

            const me = this

            const id = this.$route.params.id

            const feed = this.getFeedById(id)

            if (!feed) {
                return alert('不存在该feed id')
            }

            // 检查缓存
            const cacheFeed = this.getFeedFromCache(id)
            if (
                cacheFeed && cacheFeed.list && cacheFeed.list.length
                && +new Date() < this.expired * 24 * 60 * 60 * 1000 + cacheFeed._t
            ) {
                this.setPost(cacheFeed.list)
            }
            else {
                this.fetchFeedList([feed.url, id]).then(rss => {
                    me.setPost(rss.items)
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
