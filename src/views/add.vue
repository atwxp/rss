<template>
    <div class="manage">
        <div class="add-rss">
            <input type="text" name="feed" v-model="feed" class="input" placeholder="输入要订阅的RSS源">
            
            <div class="operation">
                <button type="button" class="button add" v-on:click="addRSS">添加订阅</button>

                <button type="button" class="button export" v-on:click="exportOPML">一键导出</button>

                <div class="button import">
                    <input type="file" name="opml" v-on:change="importOPML($event)">
                    <span class="text">导入opml文件</span>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    // http://blog.csdn.net/oscar999/article/details/16342699
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
                var hasAdded = this.feeds.some(function (f) {
                    return f.feed === feed;
                });
                if (hasAdded) {
                    alert('已添加过该Feed');
                    return;
                }

                // ajax 获取该feed内容
                this.$http.get(feed).then(function (res) {

                    if (!res.ok) {
                        console.log('request not valid');

                        return;
                    }

                    var rss = util.parseFeed(res.data);

                    if (!rss) {

                        console.log('RSS struct not valid');

                        return;
                    }

                    var newRss = util.extend({
                        id: util.gid(),
                        feed: feed
                    }, {
                        link: rss.link,
                        title: rss.title
                    });

                    this.feeds.unshift(newRss);

                    localStorage.set(newRss.id, {
                        items: rss.items,
                        _t: +new Date()
                    });

                    this.$dispatch('change-feed', this.feeds);

                    this.feed = '';

                    alert('订阅成功');
                });
            },

            exportOPML: function () {
                var opml = ''
                    + '<?xml version="1.0" encoding="UTF-8"?>'
                    +     '<opml version="1.0">'
                    +         '<head><title>RSS List</title></head>'
                    +         '<body><outline>';

                var outline = '';

                // @see http://stackoverflow.com/questions/23422316/xml-validation-error-entityref-expecting
                // 需要对XML中的 & 进行实体编码
                util.forEach(this.feeds, function (f) {
                    outline += ''
                        + '<outline text="' + f.title + '" '
                        +     'title="' + f.title + '" type="rss" '
                        +     'xmlUrl="' + util.encodeHTML(f.feed) + '" '
                        +     'htmlUrl="' + util.encodeHTML(f.link) + '">'
                        + '</outline>';
                });

                opml += outline + '</outline></body></opml>';

                var a = document.createElement('a');
                a.download = 'rss.opml';
                a.href = 'data:text/xml;charset=utf-8,' + opml;

                a.click();
            },

            importOPML: function (e) {
                var me = this;

                var file = e.target.files[0];

                // 没有明确的 MIME
                if (!/\.opml$/.test(file.name)) {
                    alert('OPML格式不合法！');

                    return;
                }

                var reader = new FileReader();

                reader.onload = function (e) {
                    var xml = e.target.result;

                    var feedArr = util.parseOPML(xml);

                    if (!feedArr || !feedArr.length) {

                        alert('OPML格式不合法！导入失败');

                        return;
                    }

                    var newRss = util.map(feedArr, function (f) {
                        return util.extend({
                            id: util.gid()
                        }, {
                            feed: f.xmlUrl,
                            link: f.htmlUrl,
                            title: f.title
                        });
                    });

                    me.feeds = newRss.concat(me.feeds);

                    me.$dispatch('change-feed', me.feeds);

                    alert('导入成功');
                };

                reader.onerror = function () {
                };

                reader.readAsText(file);
            }
        }
    };
</script>

<style lang="less">
    .manage {
        .button {
            margin: 0 10px 10px 0;
            vertical-align: middle;
        }

        .add-rss {
            .input {
                width: 60%;
                margin-right: 10px;
            }
        }

        .operation {
            margin-top: 16px;

            .add {

            }

            .export {
                background-color: #6BD2A2;
                &:hover,
                &:focus,
                &:active {
                    background-color: #41AA79;
                }
            }

            .import {
                position: relative;
                background-color: #6BD2A2;
                vertical-align: middle;
                &:hover,
                &:focus,
                &:active {
                    background-color: #41AA79;
                }
                input {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                }
            }
        }
    }
</style>
