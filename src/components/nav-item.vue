<template>
<router-link class="nav-item" :class="iconClass" :to="{path: path}" active-class="active" replace>
    <span class="feed">{{text}}</span>
    <span class="del" v-if="hasDel" v-on:click="delFeed">X</span>
</router-link>
</template>

<script>
export default {
    props: {
        path: {
            type: [String],
            default: ''
        },

        icon: {
            type: [String],
            default: ''
        },

        text: {
            type: [String],
            default: ''
        },

        feed: {
            type: [String],
            default: ''
        },

        hasDel: {
            type: [Boolean],
            default: false
        }
    },

    computed: {
        iconClass() {
            return this.icon ? 'icon-' + this.icon : ''
        }
    },

    methods: {
        delFeed(e) {
            e.preventDefault()

            e.stopPropagation()

            this.$emit('delfeed')
        }
    }
}
</script>

<style lang="less">
    
</style>
