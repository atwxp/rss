<template>
<form action="" class="setting">
    <p class="form-control">
        <label for="perPage">页数</label>
        <input type="text" id="perPage" name="perPage" class="input" v-model="config.perPage" @input="fakeUpdateConfig" />
    </p>

    <p class="form-control">
        <label for="expired">更新天数</label>
        <input type="text" id="expired" name="expired" value="1" class="input" v-model="config.expired" @input="fakeUpdateConfig" />
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

        fakeUpdateConfig(e) {
            const cfg = {}

            cfg[e.target.id] = e.target.value

            this.updateConfig(cfg, false)
        },

        save(e) {
            e.preventDefault()

            if (this.perPage <= 0) {
                alert('perPage must > 0')
            }
            else {
                this.updateConfig({
                    perPage: this.config.perPage
                })
            }

            if (this.expired <= 0)  {
                alert('更新天数 > 0')
            }
            else {
                this.updateConfig({
                    expired: this.config.expired
                })
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