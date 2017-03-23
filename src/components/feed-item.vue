<template>
<article class="rss">
    <h2 class="title"><a :href="rss.link" target="_blank">{{rss.title}}</a></h2>

    <p class="meta">
        <span class="author">{{rss.creator}}</span>

        <span class="date">{{rss.pubDate|normalizeDate}}</span>
    </p>

    <div class="feed-content" v-if="rss.summary" v-html="rss.summary"></div>

    <div class="feed-content" v-if="!rss.summary" v-html="rss.article"></div>

    <div class="share">
        分享到：
        <a href="javascript:;" class="link share-wechat"></a>
        <a :href="weibourl" target="_blank" class="link share-weibo"></a>
        <a :href="evernoteurl" target="_blank" class="link share-evernote"></a>        
    </div>
</article>
</template>

<script>
export default {
    props: {
        rss: {
            type: Object,

            default() {
                return {}
            }
        }
    },

    computed: {
        weibourl() {
            const url = encodeURIComponent(this.rss.link)

            const title = encodeURIComponent(this.rss.title)

            return `http://service.weibo.com/share/share.php?url=${url}&title=${title}&pic=&appkey=`
        },

        evernoteurl() {
            const url = encodeURIComponent(this.rss.link)

            const title = encodeURIComponent(this.rss.title)

            return `http://app.yinxiang.com/clip.action?url=${url}&title=${title}`
        }
    }
}
</script>

<style lang="less">
.rss {
    .title {

    }
    .meta {
        margin-bottom: 20px;
        font-size: 12px;
        color: #999;
        .date {
            margin-left: 10px;
        }
    }

    img {
        max-width: 100%;
    }

    .feed-content {
        font-size: 16px;
        line-height: 2;
    }

    .share {
        .link {
            display: inline-block;
            margin: 0 3px;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 18px;
            border: 1px solid currentColor;
            border-radius: 50%;
            transition: .5s;
            &:hover {
                color: #fff;
            }
        }
        .share-evernote {
            color: #79C13A;
            &:hover {
                background-color: #79C13A;
            }
        }
        .share-wechat {
            color: #0cc417;
            &:hover {
                background-color: #0cc417;
            }
        }
        .share-weibo {
            color: #E6162D;
            &:hover {
                background-color: #E6162D;
            }
        }
        .share-qq {
            color: #28A8E2;
            &:hover {
                background-color: #28A8E2;
            }
        }
        .share-qzone {
            color: #F3B73D;
            &:hover {
                background-color: #28A8E2;
            }
        }
    }
}
</style>
