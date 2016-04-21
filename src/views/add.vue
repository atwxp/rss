<template>
    <div class="manage">
        <div class="add-rss">
            <input type="text" name="feed" v-model="feed" placeholder="输入要订阅的RSS源">
            <button type="button" v-on:click="addRSS">添加订阅</button>
        </div>

        <div class="rss-list">
            <ul>
                <li v-for="r in feeds" v-on:mouseenter="toggleShow(true, $event)" v-on:mouseleave="toggleShow(false, $event)">
                    <a href="{{r.link}}" target="_blank">{{r.title}}</a>
                    <p class="desc">{{r.description}}</p>
                    <i class="close" v-on:click="removeFeed(r.id)"></i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    var util = require('../util/index');
    var localStorage = require('../util/localstorage');

    module.exports = {
        route: {
            data: function (transition) {
                transition.next({
                    feeds: localStorage.get('feeds') || []
                });
            }
        },

        data: function () {
            return {
                feed: '',
                feeds: []
            };
        },

        watch: {
            feeds: function (v) {
                this.$dispatch('feeds-change', v);

                localStorage.set('feeds', v);
            }
        },

        methods: {
            toggleShow: function (show, e) {
                e.currentTarget.classList[show ? 'add' : 'remove']('show');
            },

            addRSS: function () {
                var feed = this.feed;

                // check feed
                if (!util.checkUrl(feed)) {

                    alert('请输入合法的RSS Feed');

                    return;
                }

                // 检测是否已经添加feed
                // 目前只是判断是否输入相同的url，类似 http://baidu.com, baidu.com 没有做判断
                // 即仅支持精确匹配，不支持模糊匹配
                util.forEach(this.feeds, function (f) {
                    if (f.feed === feed) {
                        alert('已添加过该Feed');

                        return;
                    }
                });

                // var hasAdded = this.feeds.some(function (f) {
                //     return f.feed === feed;
                // });
                // if (hasAdded) {
                //     alert('已添加过该Feed');
                //     return;
                // }

                // ajax 获取该feed内容
                this.$http.get(feed).then(function (res) {

                    if (!res.ok) {
                        console.log('request not valid');

                        return;
                    }

                    var rss = util.parseRSS(res.data);

                    if (!rss) {

                        console.log('RSS struct not valid');

                        return;
                    }

                    var newRss = util.extend({
                        id: util.gid(),
                        feed: feed
                    }, {
                        link: rss.link,
                        title: rss.title,
                        description: rss.description
                    });

                    this.feeds.push(newRss);

                    // 现在这里cache还是在点击订阅源时候再发一次请求那时在cache呢？
                    localStorage.set(newRss.id, {
                        items: rss.items,
                        _t: +new Date()
                    });

                    this.feed = '';
                });
            },

            removeFeed: function (id) {
                for (var i = 0, len = this.feeds.length; i < len; i++) {

                    if (this.feeds[i].id === id) {
                        break;
                    }
                }

                localStorage.remove(id);

                this.feeds.splice(i, 1);
            }
        }
    };
</script>

<style lang="less">
    .manage {
        width: 50%;

        .add-rss {
            input {
                width: 100%;
                height: 36px;
                padding: 0 8px;
                margin-bottom: 16px;
                border: 1px solid #ccc;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                font-size: 14px;
                &:focus {

                }
            }
            button {
                display: block;
                height: 34px;
                width: 120px;
                border-radius: 4px;
                background-color: #5EA2DB;
                border: none;
                color: #fff;
                cursor: pointer;
                &:hover,
                &:focus,
                &:active {
                    background-color: #5493C8;
                }
            }
        }
        .rss-list {
            color: #ccc;

            li {
                position: relative;
                margin: 10px 0;
                font-size: 13px;
                &.show {
                    .close {
                        display: block;
                    }
                }
            }

            .desc {
                color: #666;
            }

            .close {
                display: none;
                position: absolute;
                right: 20px;
                top: 0;
                width: 20px;
                height: 20px;
                background: url(../assets/images/close.png) no-repeat center;
                -webkit-background-size: 50% 50%;
                background-size: 50% 50%;
                cursor: pointer;
            }
        }
    }
</style>
