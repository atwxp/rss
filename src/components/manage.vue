<template>
    <div>
        <div class="add-rss">
            <input type="text" name="url" placeholder="输入要订阅的RSS源" v-model="url">
            <button type="button" v-on:click="addRSS">添加订阅</button>
        </div>

        <div class="rss-list">
            <ul>
                <li v-for="r in list"></li>
            </ul>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data: function () {
            return {
                list: [],
                url: ''
            };
        },

        methods: {
            addRSS: function () {

            }
        }
    };
</script>

<style lang="less">
    
</style>
