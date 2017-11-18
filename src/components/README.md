1.文件前缀说明

  app开头：为console布局组件

  t8t开头：可以是在element-ui基础上封装的组件

  m开头： 为一个模块文件夹，如财务模块 m-finance

2.element-ui里的内容修改，组内同步

3.资源就近原则，组件内部资源不要暴露出去，也不要影响其他组件样式功能

4.组件说明：组件内加README.md
            1.组件名称
            2.负责人署名
            3.必要使用说明

5.组件模板

<template>
  <div class="t8t-tree">
    <div class="demo"></div>
  </div>
</template>

<script>
export default {

  name: 't8t-tree',

  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>
  .t8t-tree .demo{

  }
</style>
<!-- 样式尽量写上边, 必要时写下边, css前加组件名如.t8t-tree .demo避免样式泄露出去 -->
<style lang="css">

</style>
