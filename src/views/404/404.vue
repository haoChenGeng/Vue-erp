<template>
    <div>
        <div class="tip" v-if="status=='1'">您没有权限访问本页面，请联系管理员申请权限.</div>
        <div class="tip" v-if="status=='2'">您没有权限访问本页面.</div>
        <div class="tip" v-if="status=='3'">您访问的页面不存在.</div>
        <div class="tip">
            <el-button @click="back">返回</el-button><el-button type="primary" @click="index">首页</el-button>
        </div>
    </div>
</template>

<script>
import Utils from 'src/utils/Utils.js'
export default {

  name: '404',

  data () {
    return {
      status: '1'
    }
  },
  created() {
    this.status = this.$route.query.status
  },
  methods: {
    back() {
        this.$router.go(-1)
    },
    index() {
        Utils.redirectIndex()
    }
  }
}
</script>

<style lang="css" scoped>
    .tip{
        font-size: 20px;
        margin-top: 60px;
        text-align: center;
    }
</style>
