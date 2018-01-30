// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router/index.js'
// cookie-config在t8t-element-ui前引用
import './config/cookie-config.js'
import Cookie from 'js-cookie'
window.Cookie = Cookie

import T8tElementUI from 't8t-element-ui'
import T8tBreadcrumb from 'src/components/t8t-breadcrumb'
import 't8t-element-ui/lib/theme-default/index.css'
// 皮肤覆盖文件
import 'src/components/element-ui/erp-theme.css'

import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
    color: 'rgb(119, 182, 255)',
    failedColor: 'red',
    height: '2px'
})

// 开发环境不影响心情
import Tcs from 'src/components/t8t-tcs/index'

Vue.use(Tcs)

import App from './App'

Vue.use(T8tElementUI)
Vue.use(T8tBreadcrumb)


import Filter from './utils/filter'

// 网关sdk
import http from 'src/utils/http.js'
Vue.prototype.$http = http

Vue.config.silent = true
Vue.config.errorHandler = function(err, vm) {
    console.log(err, vm)
}

var app = new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router
})