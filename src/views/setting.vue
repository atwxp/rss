<template>

<form action="" class="setting">
    <p class="form-control">
        <label for="">页数</label>
        <input type="text" name="perPage" value="5" class="input" v-model="perPage">
    </p>

    <p class="form-control">
        <label for="">更新天数</label>
        <input type="text" name="expired" value="1" class="input" v-model="expired">
    </p>

    <p class="form-control"><button type="submit" class="button save" v-on:click="save($event)">保存</button></p>
</form>

</template>

<script>
    var localStorage = require('../util/localstorage');

    module.exports = {
        data: function () {
            return {
                perPage: 5,
                expired: 1
            }
        },

        methods: {
            save: function (e) {
                e.preventDefault();

                if (this.pageNum <= 0) {
                    alert('pageNum must > 0');
                    return;
                }

                if (this.expired < 0)  {
                    alert('更新天数 >= 0');
                    return;
                }

                localStorage.set('options', {
                    perPage: this.perPage,
                    expired: this.expired
                });

                alert('设置成功！');
            }
        }
    };
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