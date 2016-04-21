<template>
    <article v-for="r in rss" class="rss">        
        <h2 class="title"><a href="{{r.link}}" target="_blank">{{r.title}}</a></h2>

        <p class="meta">
           <span class="author">{{r.creator}}</span>
           <span class="date">{{r.pubDate|normalizeDate|formatDate 'yyyy-MM-dd'}}</span>
           <span class="cat"></span>
        </p>

        <div class="content" v-if="r.encoded">{{{r.encoded}}}</div>
        <div class="desc" v-if="!r.encoded">{{{r.description}}}</div>
    </article>
</template>

<script>
    module.exports = {
        props: {
            rss: []
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
                margin-left: 20px;
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
