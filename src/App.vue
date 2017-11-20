<template>
    <div id="app">
        <router-view></router-view>
        <vue-progress-bar></vue-progress-bar>
    </div>
</template>

<script>
    import Cookie from 'js-cookie'

    const HAS_NOTIFIED = 'hasNotified'
    const DOWNLOAD_ADDR = 'http://www.google.cn/chrome/browser/desktop/'

    export default {
        beforeCreate() {
            // 检测登陆状态，没有登陆直接跳转登录页
            let uid = Cookie.get('t8t-tc-uid');
            let ticket = Cookie.get('t8t-tc-ticket');
        },
        mounted() {
            this.$Progress.finish()
            // 浏览器版本检测提示代码
            this.browserNotify()
        },
        created() {
            this.$Progress.start()
            this.$router.beforeEach((to, from, next) => {
                if (to.meta.progress !== undefined) {
                    let meta = to.meta.progress
                    this.$Progress.parseMeta(meta)
                }
                this.$Progress.start()
                next()
            })
            this.$router.afterEach(() => {
                this.$Progress.finish()
            })
        },
        methods: {
            browserNotify() {
                let that = this
                let ua = this.detect(navigator.userAgent)
                setTimeout(function () {
                    if (ua.browser.family !== 'Chrome' || ua.browser.version < 50) {
                        let message = '检测到您的浏览器版本较低，为了更好的体验，建议您使用推荐浏览器版本！<a href="' + DOWNLOAD_ADDR + '" target="_blank">点击下载</a>'
                        that.$notify({
                            title: '警告',
                            message: message,
                            duration: 0,
                            type: 'warning'
                        })
                    }
                }, 1000)
            },
            detect(ua) {
                let ret = {
                    browser: {
                        family: '',
                        version: 0
                    }
                }
                // 判断chrome
                if (ua.indexOf('Chrome') != -1) {
                    ret.browser.family = 'Chrome'
                    let regChrome = /chrome\/[\d.]+/gi;
                    let _version = parseInt(ua.match(regChrome)[0].split('/')[1], 10) || 0
                    ret.browser.version = _version
                }
                return ret
            }
        }
    }
</script>

<style>
    [v-cloak] {
        display: none;
    }

    html {
        font-family: "Helvetica Neue", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
        color: #48556a;
        background: #fff;
        overflow: hidden;
    }

    button,
    input,
    select,
    textarea {
        font-family: "Helvetica Neue", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
    }

    html,
    body {
        width: 100%;
        height: 100%;
        margin: 0;
    }

    #app {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 15px;
        height: 15px;
    }

    ::-webkit-scrollbar-thumb {
        background-clip: padding-box;
        background-color: #B6B6B6;
        border: 2px solid transparent;
        border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #9C9E9C;
    }

    ::-webkit-scrollbar-thumb:active {
        background-color: #848284;
    }

    ::-webkit-scrollbar-track {
        background-color: inherit;
    }

    ::selection {
        background: #d7dbf0;
    }

    /* 需要滚动条请使用内部滚动 */

    /* 全局样式 */

    .g-transparent-dialog .el-dialog--full {
        background: transparent;
        display: flex;
        flex-direction: column;
    }

    .g-transparent-dialog .el-dialog__body {
        flex: 1;
        display: flex;
    }

    .g-transparent-dialog .g-img-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .g-w-450 .el-dialog {
        width: 450px;
    }

    .g-w-640 .el-dialog {
        width: 640px;
    }

    .g-w-1000 .el-dialog {
        width: 1000px;
    }
</style>
<!-- 单据页样式 -->
<style>
    .t8t-full-dialog2 .el-dialog__header {
        padding: 0;
    }

    .t8t-full-dialog2 .el-dialog__body {
        padding: 0;
        overflow: hidden;
        /*width: 100%;*/
        height: 100%;
    }

    .t8t-full-dialog2 .t8t-full-dialog2-container {
        overflow: hidden;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .t8t-full-dialog2 .full-dialog-toolbar-container {
        height: 38px;
        background-color: #1e3046;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
    }

    .t8t-full-dialog2 .toolbar-container {
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }

    .t8t-full-dialog2 .dialog2-main-container {
        min-width: 1280px;
        padding: 38px 30px 20px 30px;
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .t8t-full-dialog2 .el-dialog__headerbtn {
        z-index: 10;
    }

    .t8t-full-dialog2 .top-hide {
        position: absolute;
        top: 48px;
        right: 10px;
        z-index: 1;
        transform: rotate(90deg);
        cursor: pointer;
    }

    .t8t-full-dialog2.isHide .top-hide {
        transform: rotate(-90deg);
    }

    .t8t-full-dialog2.isHide .full-dialog-form-container {
        height: 0;
        padding-top: 0;
        overflow: hidden;
    }

    .t8t-full-dialog2 .full-dialog-form-container {
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
        overflow: hidden;
    }

    .t8t-full-dialog2 .dialog2-form-item-container {
        width: 25%;
    }

    .t8t-full-dialog2 .full-dialog-form-container .el-form-item__content,
    .t8t-full-dialog2 .full-dialog-form-container .el-date-editor.el-input {
        width: 180px;
    }

    .t8t-full-dialog2 .dialog2-form-item-container .el-form-item {
        margin-top: 0;
        margin-bottom: 15px;
    }

    .t8t-full-dialog2 .dialog2-form-item-container .el-form-item__error {
        padding-top: 0;
    }

    .t8t-full-dialog2 .dialog2-form-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        margin-top: 15px;
    }

    .t8t-full-dialog2 .full-dialog-tabs-container {
        display: flex;
        flex: 1;
        overflow: auto;
        flex-direction: column;
    }

    .t8t-full-dialog2 .full-dialog-tabs-container .el-tabs {
        flex: 1;
        position: relative;
    }

    .t8t-full-dialog2 .full-dialog-tabs-container .el-tabs__content {
        position: absolute;
        left: 0;
        right: 0;
        top: 42px;
        bottom: 0;
        display: flex;
    }

    .t8t-full-dialog2 .full-dialog-tabs-container .el-tab-pane {
        width: 100%;
        overflow: auto;
        display: flex;
        flex-direction: column;
    }

    .t8t-full-dialog2 .el-tabs__item {
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 8px;
        margin-bottom: 8px;
    }

    .t8t-full-dialog2 .el-tabs__header {
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
        margin-bottom: 0;
    }

    .t8t-full-dialog2 .el-tabs__active-bar {
        height: 1px;
    }

    .t8t-full-dialog2 .el-tabs__item+.el-tabs__item {
        border-left: 1px solid #d4dce7;
    }

    .t8t-full-dialog2 .el-tabs__nav-wrap {
        width: 1220px;
        margin: 0 auto;
    }

    .t8t-full-dialog2 .dialog2-flex-column {
        display: flex;
        flex-direction: column;
    }

    .t8t-full-dialog2 .dialog2-toolbar-container {
        padding: 10px 0;
    }

    /* 深色皮肤 */

    .full-dialog-toolbar-container .t8t-toolbar .el-button--toolbar {
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }

    .full-dialog-toolbar-container .el-dialog__wrapper .t8t-toolbar .el-button--toolbar:hover {
        color: #1e3046;
        background-color: #d2deeb;
    }
</style>
