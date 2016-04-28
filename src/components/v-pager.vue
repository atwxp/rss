<template>
    <div class="pagination">
        <ul>
            <li v-for="r in range" v-on:click="go(r.page, $event)">
                <a href="javascript:;" class="pager {{r.status}}">{{{r.text}}}</a>
            </li>
        </ul>
    </div>    
</template>

<script>
    module.exports = {
        props: {
            totalPage: 0,
            curPage: 0
        },

        data: function () {
            return {
                range: [],
                showPage: 7,
                curPage: 1
            }
        },

        methods: {
            go: function (page, e) {
                e && e.preventDefault();

                this.curPage = page;

                this.render();

                this.$dispatch('change-pager', page);
            },

            render: function () {
                var showPage = this.showPage;
                var total = this.totalPage;
                var cur = this.curPage;

                if (!total || !cur) {
                    this.range = [];
                    return;
                }

                if (cur < 1 || cur > total) {
                    return;
                }

                console.log('render pager');

                // 现在是偶数，如果是奇数呢？？todo
                var average = Math.floor((showPage - 3) / 2);

                var range = [];

                var start = Math.min(total - average * 2 - 1, Math.max(cur - average, 1));
                var end = Math.max(showPage - 1, Math.min(cur + average, total));

                if (total <= showPage) {
                    start = 1;
                    end = total;
                }

                range.push({
                    page: cur === 1 ? 1 : cur - 1,
                    text: '&laquo;',
                    status: 'prev ' + (cur === 1 ? 'disabled' : '')
                });
                if (start > 1) {
                    range.push({
                        page: 1,
                        text: 1,
                        status: cur === 1 ? 'active' : ''
                    });
                }
                if (start > 2) {
                    range.push({
                        page: cur,
                        text: '...',
                        status: 'dot'
                    });
                }
                for (; start <= end; start++) {
                    range.push({
                        page: start,
                        text: start,
                        status: cur === start ? 'active' : ''
                    });
                }
                if (end < total - 1) {
                    range.push({
                        page: cur,
                        text: '...',
                        status: 'dot'
                    });
                }
                if (end < total) {
                    range.push({
                        page: total,
                        text: total,
                        status: cur === total ? 'active' : ''
                    });
                }
                range.push({
                    page: cur === total ? total : cur + 1,
                    text: '&raquo;',
                    status: 'next ' + (cur === total ? 'disabled' : '')
                });

                this.range = range;
            }
        },

        events: {
            'change-feed': function (tp) {
                this.totalPage = tp;

                this.go(1);
            }
        },

        compiled: function () {
            this.render();
        }
    }; 
</script>

<style lang="less">
    .pagination {
        ul {
            display: inline-block;
            border-radius: 4px;

            & > li {
                display: inline;
            }

            .pager {
                float: left;
                padding: 4px 12px;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-left-width: 0;
                line-height: 20px;
                color: #5493c8;
                &:hover,
                &:focus {
                    background-color: #f5f5f5;
                }

                &.prev {
                    border-left-width: 1px;
                    border-bottom-left-radius: 4px;
                    border-top-left-radius: 4px;
                }

                &.next {
                    border-top-right-radius: 4px;
                    border-bottom-right-radius: 4px;
                }

                &.disabled {
                    background-color: #f5f5f5;
                    color: #999;
                    cursor: default;
                }

                &.active {
                    border-color: #5493c8;
                    background-color: #5493c8;
                    color: #fff;
                    cursor: default;
                }

                &.dot {
                    border-top-color: transparent;
                    border-bottom-color: transparent;
                    background-color: transparent;
                    cursor: default;
                }
            }
        }
    }    
</style>
