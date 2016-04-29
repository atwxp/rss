<template>
    <div class="app">
        <section class="sidebar">

            <ul class="nav">
                <li>
                    <nav-item path="/add" icon="add" text="添加订阅"></nav-item>
                </li>
                <li>
                    <nav-item path="/setting" icon="setting" text="设置"></nav-item>
                </li>
            </ul>

            <div class="rss">
                <p class="headline">
                    <span class="text"><i class="icon-home"></i>订阅源</span>
                    <span class="action" v-on:click="edit=!edit"><i class="icon-setting"></i></span>
                </p>

                <ul v-bind:class="edit ? 'edit' : ''">
                    <li v-for="f in feeds">
                        <nav-item :path="'/feed/' + f.id" :text="f.title" del="true" v-on:do-del="doDel(f.id)"></nav-item>
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
                feeds: [],
                edit: false
            };
        },

        ready: function () {
            this.feeds = localStorage.get('feeds') || [];
        },

        components: {
            'nav-item': require('./components/nav-item.vue')
        },

        methods: {
            doDel: function (id) {
                for (var i = 0, len = this.feeds.length; i < len; i++) {

                    if (this.feeds[i].id === id) {
                        break;
                    }
                }

                localStorage.remove(id);

                this.feeds.splice(i, 1);

                this.$emit('change-feed', this.feeds)
            }
        },

        events: {
            'change-feed': function (feeds) {
                this.feeds = feeds;

                localStorage.set('feeds', feeds);
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

    @font-face {
        font-family: 'share';
        src: url('assets/fonts/share.eot');
        src: url('assets/fonts/share.eot?#iefix') format('embedded-opentype'),
        url('assets/fonts/share.ttf') format('truetype'),
        url('assets/fonts/share.woff') format('woff'),
        url('assets/fonts/share.svg#share') format('svg')
    }

    [class^="share-"], [class*=" share-"] {
        font-family: 'share' !important;
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

    .share-weibo:before {
        content: '\e600';
    }

    .share-qzone:before {
        content: '\e602';
    }

    .share-qq:before {
        content: '\e603';
    }

    .share-wechat:before {
        content: '\e60a';
    }
    .share-yinxiang:before {
        content: '\e601';
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

    pre {
        background-color: #000;
        width: 90%;
        margin: 1em auto;
        padding: 1em;
        white-space: pre-wrap;
        border-radius: 5px;
        color: #fff;
    }

    body {
        font: 14px/1.5 "Avenir Next", Helvetica, Arial, "Lantinghei SC", "Microsoft YaHei", sans-serif;
        color: #696969;
    }

    .input {
        height: 36px;
        padding: 0 8px;

        border: 1px solid #ccc;
        border-radius: 3px;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;

        -webkit-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;

        font-size: 14px;
        &:focus {
            border-color: #66afe9;
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
        }
    }
    .button {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        border: none;
        border-radius: 4px;
        background-color: #5EA2DB;
        cursor: pointer;
        color: #fff;
        &:hover,
        &:focus,
        &:active {
            background-color: #5493C8;
        }
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
        overflow-y: auto;
        background-color: #E8E8E8;

        .nav-item {
            position: relative;
            display: block;
            padding: 0 20px;
            height: 30px;
            line-height: 30px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            -webkit-transition: background-color .3s;
            transition: background-color .3s;
            font-size: 13px;
            color: #696969;
            &.active,
            &:hover {
                background-color: rgba(205, 205, 205, 0.43);
                color: #333;
            }
            .del {
                position: absolute;
                right: 10px;
                top: 4px;
                width: 20px;
                text-align: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity .4s;
                &:hover {
                    text-decoration: underline;
                }
            }
        }

        .rss {
            .headline {
                height: 40px;
                line-height: 40px;
                margin-left: 20px;
                .text {
                    background-color: #E8E8E8;
                    padding-right: 4px;
                }

                .action {
                    position: relative;
                    float: right;
                    padding: 0 8px 0 4px;
                    background-color: #e8e8e8;
                    cursor: pointer;
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

        .edit {
            .nav-item {
                .del {
                    opacity: 1;
                    visibility: visible;
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
