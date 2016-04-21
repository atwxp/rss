<template>
    <a class="nav-item" v-link="{path: path, activeClass: 'active', replace: true}">
        <i :class="iconClass"></i>
        {{text}}
        <span class="del" v-if="del" v-on:click="doDel($event)">X</span>
    </a>
</template>

<script>
    module.exports = {
        props: {
            path: '',
            icon: '',
            text: '',
            del: false
        },

        computed: {
            iconClass: function () {
                if (this.icon) {
                    return 'icon-' + this.icon;
                }
            }
        },

        methods: {
            doDel: function (e) {
                e.preventDefault();

                this.$dispatch('do-del');
            }
        }
    };
</script>

<style lang="less">
    
</style>
