<template>
    <div class="app">
        <section class="nav">

            <ul class="normal">
                <li class="icon-{{n.icon}}" v-for="n in nav" v-on:click="view=n.view">
                    <span class="text">{{n.text}}</span>
                </li>
            </ul>

            <div class="rss-list">
                <p class="headline"><span>订阅源</span></p>
                <ul>
                    <li v-for="f in feeds" v-on:click="loadFeed(f.feed)">{{f.title}}</li>
                </ul>
            </div>
        </section>
        
        <section class="main">
            <component :is="view" :feeds.sync="feeds"></component>
        </section>
    </div>
</template>

<script>
var localStorage = require('./util/localstorage');

module.exports = {
    data: function () {
        return {
            nav: [
                {
                    icon: 'feed',
                    text: '全部',
                    view: 'all'
                },
                {
                    icon: 'bookmark',
                    text: '已加星标',
                    view: 'starred'
                },
                {
                    icon: 'search',
                    text: '搜索',
                    view: 'search'
                },
                {
                    icon: 'add',
                    text: '添加订阅',
                    view: 'add'
                },
                {
                    icon: 'setting',
                    text: '设置',
                    view: 'setting'
                }
            ],

            view: 'all',

            feeds: []
        };
    },

    watch: {
        feeds: function () {
            localStorage.set('rss', this.feeds);
        }
    },

    methods: {
        loadFeed: function (feed) {

        }
    },

    components: {
        all: require('./components/all.vue'),
        add: require('./components/add.vue'),
        starred: require('./components/starred.vue'),
        search: require('./components/search.vue'),
        setting: require('./components/setting.vue'),
        feed: require('./components/feed.vue')
    },

    compiled: function () {
        this.feeds = localStorage.get('rss') || [];
    }
}; 
</script>

<style lang="less">
    html, body,
    ul, ol,
    p,
    input, button {
        margin: 0;
        padding: 0;
    }

    li {
        list-style: none;
    }

    a {
        text-decoration: none;
    }

    input {
        outline: none;
        -webkit-appearance: none;
    }

    button {
        outline: none;
    }

    @font-face {
        font-family: 'icomoon';
        src: url('fonts/icomoon.eot?8pbdmf');
        src: url('fonts/icomoon.eot?8pbdmf#iefix') format('embedded-opentype'),
            url('fonts/icomoon.ttf?8pbdmf') format('truetype'),
            url('fonts/icomoon.woff?8pbdmf') format('woff'),
            url('fonts/icomoon.svg?8pbdmf#icomoon') format('svg');
        font-weight: normal;
        font-style: normal;
    }

    [class^="icon-"], [class*=" icon-"] {
        /* use !important to prevent issues with browser extensions that change fonts */
        font-family: 'icomoon' !important;
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;

        /* Better Font Rendering =========== */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .icon-search:before {
        content: '\e900';
    }
    .icon-setting:before {
        content: '\e901';
    }
    .icon-bookmark:before {
        content: '\e902';
    }
    .icon-add:before {
        content: '\e903';
    }
    .icon-feed:before {
        content: '\e904';
    }

    body {
        font: 14px/1.5 Arial, sans-serif;
        color: #696969;
    }

    .nav {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 240px;
        padding: 10px 0;
        background-color: #E8E8E8;
        li {
            padding: 0 10px 0 20px;
            height: 30px;
            line-height: 30px;
            -webkit-transition: background-color .3s;
            transition: background-color .3s;
            font-size: 13px;
            cursor: pointer;
            &:hover {
                background-color: rgba(205, 205, 205, 0.43);
                color: #333;
            }
        }

        .rss-list {
            .headline {
                height: 40px;
                line-height: 40px;
                margin-left: 20px;
                span {
                    background-color: #E8E8E8;
                    padding-right: 4px;
                }
                &::after {
                    content: '';
                    float: left;
                    width: 100%;
                    height: 1px;
                    background-color: #ccc;
                    margin-top: -20px;
                }
            }

            li {

            }
        }
    }

    .main {
        margin-left: 280px;
        padding: 20px 0 20px;
        background: #fff;
    }
</style>
