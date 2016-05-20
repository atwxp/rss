 <template>
    <div v-show="$loadingRouteData">loading</div>

    <div v-show="!$loadingRouteData">
        <feed-item v-for="r in rss" :rss="r"></feed-item>
        <v-pager></v-pager>
    </div>
</template>

<script>
    var util = require('../util/index');
    var localStorage = require('../util/localstorage');

    module.exports = {
        route: {
            data: function (transition) {

                // 天数
                var options = localStorage.get('options') || {};

                var expiryTime = options.expired || 1;

                // 每页数量
                var perPage = options.perPage || 5;

                // feeds数据库
                var feeds = localStorage.get('feeds') || [];

                var fd = feeds.filter(function (f) {
                    return f.id == transition.to.params.id;
                })[0];

                // feeds 数据库中不存在指定id的feed源
                if (!fd) {
                    console.error('no rss feed');

                    return;
                }

                this.$set('perPage', perPage);

                var cached = localStorage.get(fd.id);

                // 如果有缓存的rss，并且没有过期
                if (
                    cached
                    && cached.items
                    && cached.items.length
                    && expiryTime * 24 * 60 * 60 * 1000 + cached._t > +new Date()
                ) {

                    transition.next({
                        cacheRss: cached.items
                    });

                    return;
                }

                return this.$http.get(fd.feed)
                    .then(function (res) {
                        if (!res.ok) {
                            console.error('request not valid');
                            return;
                        }

                        var rss = util.parseFeed(res.data);

                        if (!rss) {
                            console.error('rss structure not valid');

                            return;
                        }

                        // 更新缓存
                        localStorage.set(fd.id, {
                            items: rss.items,
                            _t: +new Date()
                        });

                        this.$set('cacheRss', rss.items);
                    });
            }
        },

        watch: {
            cacheRss: function (v) {
                this.$broadcast('change-rss', Math.ceil(v.length / this.perPage));
            }
        },

        data: function () {
            return {
                rss: [],
                cacheRss: [],
                perPage: 0
            };
        },

        events: {
            'change-pager': function (curPage) {
                this.rss = this.cacheRss.slice((curPage - 1) * this.perPage, curPage * this.perPage);

                window.scrollTo(0, 1);
            }
        },

        components: {
            'feed-item': require('../components/feed-item.vue'),

            'v-pager': require('../components/v-pager.vue')
        }
    };
</script>
