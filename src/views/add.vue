<template>
<div class="manage">
    <div class="add-rss">
        <input type="text" name="feed" v-model="feed" @keyup.enter="addRSS" class="input" placeholder="输入要订阅的RSS源">
        
        <div class="operation">
            <button type="button" class="button add" v-on:click="addRSS">添加订阅</button>

            <button type="button" class="button export" v-on:click="exportOPML">一键导出</button>

            <div class="button import">
                <input type="file" name="opml" v-on:change="importOPML">
                <span class="text">导入opml文件</span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
// http://blog.csdn.net/oscar999/article/details/16342699
import * as util from 'util/index'

import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            feed: ''
        }
    },

    computed: mapGetters([
        'feedList'
    ]),

    methods: {
        ...mapActions([
            'addFeed',
            'fetchFeedList'
        ]),

        addRSS() {
            const feed = this.feed

            const feedList = this.feedList || []

            const me = this

            // check feed url is valid
            if (!util.checkUrl(feed)) {
                alert('RSS Feed 不合法')
            }

            // 检测是否已经添加feed
            else if (feedList.some(f => f.url && f.url.includes(feed))) {
                alert('已添加过该Feed')
            }

            else {
                this.fetchFeedList([feed]).then(rss => {
                    delete rss.items

                    me.addFeed(rss)

                    me.feed = ''

                    alert('订阅成功')
                })
                .catch(err => {
                    console.log('fetch err')
                })
            }
        },

        exportOPML() {
            if (!this.feedList || !this.feedList.length) {
                return alert('没有任何订阅源')
            }

            let opml = ''
                + '<?xml version="1.0" encoding="UTF-8"?>'
                +     '<opml version="1.0">'
                +         '<head><title>RSS Reader Chrome Extension</title></head>'
                +         '<body><outline>'

            // http://stackoverflow.com/questions/23422316/xml-validation-error-entityref-expecting
            // 需要对XML中的 & 进行实体编码
            this.feedList.forEach(f => {
                opml += `<outline type="rss" text="${f.title}" title="${f.title}"
                xmlUrl="${util.encodeHTML(f.url)}" htmlUrl="${util.encodeHTML(f.link)}"></outline>`
            })

            opml += '</outline></body></opml>'

            let a = document.createElement('a')

            a.download = 'rss.opml'

            a.href = `data:text/xml;charset=utf-8,${opml}`

            a.click()
        },

        importOPML(e) {
            const me = this;

            const file = e.target.files[0]

            // 没有明确的 MIME
            if (!/\.opml$/.test(file.name)) {
                return alert('OPML格式不合法！')
            }

            const reader = new FileReader()

            reader.onload = function (e) {
                const feedArr = util.parseOPML(e.target.result)

                if (!feedArr || !feedArr.length) {
                    alert('导入失败')
                }
                else {
                    me.addFeed(feedArr.map(f => {
                        return {
                            id: util.gid(),

                            url: f.url,

                            link: f.link,

                            title: f.title
                        }
                    }))

                    alert('导入成功')
                }
            }

            reader.onerror = function () {}

            reader.readAsText(file)
        }
    }
}
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
