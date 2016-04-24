<template>
    <article class="rss">
        <h2 class="title"><a href="{{rss.link}}" target="_blank">{{rss.title}}</a></h2>

        <p class="meta">
           <span class="author">{{rss.creator}}</span>
           <span class="date">{{rss.pubDate|normalizeDate}}</span>
           <span class="cat"></span>
        </p>

        <div class="content" v-if="rss.encoded">{{{rss.encoded}}}</div>
        <div class="desc" v-if="!rss.encoded">{{{rss.description}}}</div>
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
    }
</style>
