import Vue from 'vue'
import VueRouter from 'vue-router'
import api from 'src/utils/api.js'
import Cookie from 'js-cookie'

Vue.use(VueRouter)
// 判断是否生产环境
const debug = process.env.NODE_ENV !== 'production'

// 登录
import login from './login/index.js'
// 404
import forbidden from './404/index.js'
// 系统管理
import system from './system/index.js'
// 财务
import finance from './finance/index.js'
// workbench工作台
import workbench from './workbench/index.js'
// procenter
import procenter from './procenter/index.js'
// delivery交付
import delivery from './delivery/index.js'
// 工模售前
import commodule from './commodule/index.js'
// 工模
import worker from './worker/index.js'
// 销售管理模块
import salemanager from './salemanager/index.js'

import itemAssign from './item/index.js'

// 系统运营数据
import om from './operationdata/index.js'

let routes = []

// 只输入域名时，跳转到/index
routes.push({
    path: '/',
    redirect: '/index'
})

routes = routes.concat(
    forbidden,
    system,
    finance,
    workbench,
    procenter,
    delivery,
    commodule,
    itemAssign,
    worker,
    salemanager,
    om,
    login
)

// =========================================================================================

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    // 不需要鉴权页面可以直接跳转
    if (to.meta.auth === false || ['/login/','/login'].indexOf(to.path) > -1 || debug === true) {
        return next()
    }

    // 鉴权页面
    let args = {
        ticket: Cookie.get('t8t-tc-ticket'),
        accountId: Cookie.get('t8t-tc-uid'),
        url: '#' + to.path
    }

    api.account.checkPermission(args)
        .then((res) => {
            if (res.data.status === 200 && res.data.result === true) {
                next()
            } else {
                next('/forbidden/404?status=1')
            }
        })
        .catch((err) => {
            next('/forbidden/404?status=2')
        })
})

router.afterEach(route => {
    let title
    if (route.meta.title) {
        title = route.meta.title + ' - 土巴兔装修公司'
    } else {
        title = '土巴兔装修公司'
    }
    document.title = title
        // 本地开发路由弹窗提示
    routerAlert(route)
})

function routerAlert(route) {
    if (debug && route.meta.auth !== false && route.meta.isFulldialog !== true && route.meta.isFulldialog !== false) {
        let _url = 'http://192.168.1.156:3000/kai-fa-zhi-nan/lu-you-shi-yong-gui-fan.html'
        Vue.prototype.$confirm('此页面路由写法不规范<br><a href="' + _url + '" target="_blank">到这里查看规范</a>', '警告', {
            confirmButtonText: '去看看',
            cancelButtonText: '残忍拒绝',
            type: 'warning'
        }).then(() => {
            let a = document.createElement('a')
            a.href = _url
            a.target = "_blank"
            a.click()
        }).catch(() => {
            console.log('残忍拒绝')
        })
    }
}

export default router
