<template>
    <article class="rss">
        <h2 class="title"><a href="{{rss.link}}" target="_blank">{{rss.title}}</a></h2>

        <p class="meta">
           <span class="author">{{rss.creator}}</span>
           <span class="date">{{rss.pubDate|normalizeDate}}</span>
           <span class="cat"></span>
        </p>

        <div class="content" v-if="rss.encoded">{{{rss.encoded}}}</div>
        <div class="content" v-if="!rss.encoded">{{{rss.description}}}</div>
        <div class="share">
            分享到：
            <a href="javascript:;" class="link share-wechat"></a>
            <a href="http://service.weibo.com/share/share.php?url={{rss.link|escape 'url'}}&title={{rss.title|escape 'url'}}&pic=&appkey=" class="link share-weibo" target="_blank"></a>
            <a href="http://app.yinxiang.com/clip.action?url={{rss.link|escape 'url'}}&title={{rss.title|escape 'url'}}" target="_blank" class="link share-yinxiang"></a>
        </div>
    </article>
</template>

<script>
    module.exports = {
        props: {
            rss: {}
        }
    };
</script>

<style lang="less">
    .rss {
        .title {

        }
        .meta {
            margin-bottom: 20px;
            font-size: 12px;
            color: #999;
            .date,
            .cat {
                margin-left: 10px;
            }
        }

        img {
            max-width: 100%;
        }

        .content {
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
            .share-yinxiang {
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
                    background-color: #F3B73D;
                }
            }
        }
    }
</style>
