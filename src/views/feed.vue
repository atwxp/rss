<template>
    <feed-item :rss="rss"></feed-item>
</template>

<script>
    var util = require('../util/index');
    var localStorage = require('../util/localstorage');

    module.exports = {
        route: {
            data: function (transition) {
                // 天数
                var expiryTime = localStorage.get('expired') || 1;

                // 每页数量
                var pageNum = localStorage.get('pageNum') || 5;

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

                var cacheRSS = localStorage.get(fd.id);

                // 如果有缓存的rss，并且没有过期
                if (
                    cacheRSS
                    && expiryTime * 24 * 60 * 60 + cacheRSS._t > +new Date()
                ) {
                    this.$set('rss', cacheRSS.items.slice(0, pageNum));

                    return;
                }

                this.$http.get(fd.feed)
                    .then(function (res) {
                        if (!res.ok) {
                            console.error('request not valid');
                            return;
                        }

                        var rss = util.parseRSS(res.data);

                        if (!rss) {
                            console.error('rss structure not valid');

                            return;
                        }

                        // 更新缓存
                        localStorage.set(fd.id, {
                            items: rss.items,
                            _t: +new Date()
                        });

                        this.$set('rss', rss.items.slice(0, pageNum));
                    });
            }
        },

        data: function () {
            return {
                rss: []
            };
        },

        components: {
            'feed-item': require('../components/feed-item.vue')
        }
    };
</script>
