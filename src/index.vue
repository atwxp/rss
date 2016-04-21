<template>
    <div class="app">
        <section class="sidebar">

            <ul class="nav">
                <li>
                    <nav-item path="/home" icon="home" text="全部"></nav-item>
                </li>
                <li>
                    <nav-item path="/starred" icon="starred" text="已加星标"></nav-item>
                </li>
                <li>
                    <nav-item path="/search" icon="search" text="搜索"></nav-item>
                </li>
                <li>
                    <nav-item path="/add" icon="add" text="添加订阅"></nav-item>
                </li>
                <li>
                    <nav-item path="/setting" icon="setting" text="设置"></nav-item>
                </li>
            </ul>

            <div class="rss">
                <p class="headline"><span>订阅源</span></p>

                <ul>
                    <li v-for="f in feeds">
                        <nav-item :path="'/feed/' + f.id" :text="f.title"></nav-item>
                    </li>
                </ul>
            </div>
        </section>
        
        <section class="main">
            <router-view></router-view>
        </section>
    </div>
</template>

<script>
    var localStorage = require('./util/localstorage');

    module.exports = {
        data: function () {
            return {
                feeds: []
            };
        },

        ready: function () {
            this.feeds = localStorage.get('feeds') || [];
        },

        components: {
            'nav-item': require('./components/nav-item.vue')
        },

        events: {
            'feeds-change': function (feeds) {
                this.feeds = feeds;
            }
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
        color: #2080b8;
        text-decoration: none;
        &:hover {
            color: #b82020;
        }
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
        src: url('assets/fonts/icomoon.eot?8pbdmf');
        src: url('assets/fonts/icomoon.eot?8pbdmf#iefix') format('embedded-opentype'),
            url('assets/fonts/icomoon.ttf?8pbdmf') format('truetype'),
            url('assets/fonts/icomoon.woff?8pbdmf') format('woff'),
            url('assets/fonts/icomoon.svg?8pbdmf#icomoon') format('svg');
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
    .icon-starred:before {
        content: '\e902';
    }
    .icon-add:before {
        content: '\e903';
    }
    .icon-home:before {
        content: '\e904';
    }

    body {
        font: 14px/1.5 "Avenir Next", Helvetica, Arial, "Lantinghei SC", "Microsoft YaHei", sans-serif;
        color: #696969;
    }

    .app {
        overflow-x: hidden;
    }

    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 240px;
        padding: 10px 0;
        background-color: #E8E8E8;
        .nav-item {
            display: block;
            padding: 0 10px 0 20px;
            height: 30px;
            line-height: 30px;
            -webkit-transition: background-color .3s;
            transition: background-color .3s;
            font-size: 13px;
            color: #696969;
            &.active,
            &:hover {
                background-color: rgba(205, 205, 205, 0.43);
                color: #333;
            }
        }

        .rss {
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
        }
    }

    .main {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px 0 20px;
        background: #fff;
    }

    @media (max-width: 1360px) {
        .main {
            margin-left: 280px;
        }
    }
</style>
