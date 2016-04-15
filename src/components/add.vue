<template>
    <div class="manage">
        <div class="add-rss">
            <input type="text" name="feed" placeholder="输入要订阅的RSS源" v-model="feed">
            <button type="button" v-on:click="addRSS">添加订阅</button>
        </div>

        <div class="rss-list">
            <ul>
                <li v-for="r in feeds" v-on:mouseenter="toggleShow(true, $event)" v-on:mouseleave="toggleShow(false, $event)">
                    <a href="{{r.url}}" target="_blank">{{r.title}}</a>
                    <p class="desc">{{r.desc}}</p>
                    <i class="close" v-on:click="removeFeed($index)"></i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    var util = require('../util/index');

    module.exports = {
        props: ['feeds'],

        data: function () {
            return {
                feed: ''
            };
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

                this.feeds.forEach(function (f) {
                    if (f.feed === feed) {
                        alert('已添加过该Feed');

                        return;
                    }
                });

                this.$http.get(feed).then(function (res) {
                    if (!res.ok) {
                        console.log('request not valid');
                        return;
                    }

                    var meta = util.parseRSSMeta(res.data);

                    if (!meta) {
                        console.log('RSS struct not valid');
                        return;
                    }

                    this.feeds.push(util.extend({
                        feed: feed
                    }, meta));

                    this.feed = '';
                });
            },

            removeFeed: function (i) {
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
                background: url(../images/close.png) no-repeat center;
                -webkit-background-size: 50% 50%;
                background-size: 50% 50%;
                cursor: pointer;
            }
        }
    }
</style>
