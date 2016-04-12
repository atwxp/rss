<template>
    <div class="app">
        <section class="nav">
            <ul>
                <li v-on:click="switchView('read')">查看订阅</li>
                <li v-on:click="switchView('manage')">管理订阅</li>
            </ul>
        </section>
        
        <div class="main">
            <component :is="view"></component>
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function () {
        return {
            view: 'read'
        };
    },

    methods: {
        switchView: function (v) {
            this.view = v;
        },
    },


    components: {
        read: require('./components/read.vue'),
        manage: require('./components/manage.vue')
    }
}; 
</script>

<style lang="less">
    html, body,
    ul, ol {
        margin: 0;
        padding: 0;
    }
    li {
        list-style: none;
    }
</style>
