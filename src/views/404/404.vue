<template>
    <div>
        <div class="tip" v-if="status=='1'">
            <p>登录状态失效了，请重新登录系统。(同一个账号不能同时被多人登录)
            </p>
        </div>
        <div class="tip" v-if="status=='2'">您没有权限访问本页面，请联系管理员申请权限。</div>
        <div class="tip" v-if="status=='3'">您访问的页面不存在。</div>
        <div class="tip" v-if="status=='4'">访问系统出错，请联系工作人员处理。</div>
        <!-- <div class="tip">
           <el-button @click="back">返回</el-button>
            <el-button type="primary" @click="index">首页</el-button>
        </div>-->
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
    },
    logOut(){
        Utils.logout()
    }
  }
}
</script>

<style lang="css" scoped>
    .tip{
        font-size: 16px;
        /*margin: auto;*/
        margin-top: 60px;
        text-align: center;
        /*width: 400px;*/
    }
    .info-small{
        font-size: 12px;
    }
    .error-ico{
        color: red;
    }
</style>
