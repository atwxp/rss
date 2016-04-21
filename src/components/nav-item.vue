<template>
    <a class="nav-item" v-link="{path: path, activeClass: 'active', replace: true}">
        <i :class="iconClass"></i>
        {{text}}
    </a>
</template>

<script>
    module.exports = {
        props: {
            path: '',
            icon: '',
            text: ''
        },

        computed: {
            iconClass: function () {
                if (this.icon) {
                    return 'icon-' + this.icon;
                }
            }
        }
    };
</script>

<style lang="less">
    
</style>
