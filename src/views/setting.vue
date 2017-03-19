<template>
<form action="" class="setting">
    <p class="form-control">
        <label for="perPage">页数</label>
        <input type="text" id="perPage" name="perPage" class="input" v-model="config.perPage" />
    </p>

    <p class="form-control">
        <label for="expired">更新天数</label>
        <input type="text" id="expired" name="expired" value="1" class="input" v-model="config.expired" />
    </p>

    <p class="form-control">
        <button type="submit" class="button save" v-on:click="save">保存</button>
    </p>
</form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapGetters([
            'config'
        ])
    },

    methods: {
        ...mapActions([
            'updateConfig',
        ]),

        save(e) {
            e.preventDefault()

            const perPage = this.$el.querySelector('#perPage').value

            const expired = this.$el.querySelector('#expired').value

            if (perPage <= 0) {
                alert('perPage must > 0')
            }
            else {
                this.updateConfig({perPage})
            }

            if (expired <= 0)  {
                alert('更新天数 > 0')
            }
            else {
                this.updateConfig({expired})
            }

            alert('设置成功')
        }
    }
}
</script>

<style lang="less">
.setting {
    .form-control {
        margin-bottom: 15px;
        label {
            display: inline-block;
            width: 12%;
        }
        .input {
            height: 30px;
        }
    }
}
</style>