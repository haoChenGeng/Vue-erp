import Vue from 'vue'
import VueRouter from 'vue-router'
import api from 'src/utils/api.js'
import Cookie from 'js-cookie'
import Utils from 'src/utils/Utils.js'

Vue.use(VueRouter)
// 判断是否生产环境
const debug = process.env.NODE_ENV !== 'production'

// 登录
import login from './login/index.js'
// 404
import forbidden from './404/index.js'
// 系统管理
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
// 帮助中心
import helpcenter from './helpcenter/index'

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
    finance,
    workbench,
    procenter,
    delivery,
    commodule,
    itemAssign,
    worker,
    salemanager,
    om,
    login,
    helpcenter
)

// =========================================================================================

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {

    // if(!Cookie.get('t8t-tc-uid')) {
    //     Utils.redirectLoginPage()
    //     // window.location.href = "http://www.to8to.com/com_login.php"
    //     return
    // }

    let _args = { ...{ local: 'tuchat-pc' }, ...to.query }

    if (_args.uid && _args.certificate && _args.from) {
        //认证成功后跳转的链接地址
        var query = to.query
        var uid = to.query.uid

        //
        /* delete query['uid']
        delete query['from']
        delete query['certificate']
        let jumpUrl = {
            path:to.path,
            query:query,
            replace: true
        }*/

        let jumpUrl = {
            path: query['url'] ? decodeURI(query['url']) : '/index',
            //query:query,
            replace: true
        }

        let args = {
            'local':'tuchat-pc',
            uid:_args['uid'],
            certificate:_args['certificate'],
            from: _args['from']
        }

        if (Cookie.get('t8t-tc-uid') && Cookie.get('t8t-tc-uid') != uid ) {
            Vue.prototype.$confirm(`警告：${Cookie.get('t8t-tc-username')}已登录系统，继续登录将使${Cookie.get('t8t-tc-username')}下线`, '警告', {
                confirmButtonText: '继续登录',
                cancelButtonText: '取消登录',
                type: 'warning'
            }).then(_ => {
                routerCheckCertificate(args, jumpUrl)
            }).catch(_ => {
                console.log("取消")
            })
        } else {
            routerCheckCertificate(args, jumpUrl)
        }
    }else{

        //未登录则重定向到登录页, 排除login页面防止死循环
        if( (!Cookie.get('t8t-tc-ticket') || !Cookie.get('t8t-tc-uid') ) && ['/login/','/login'].indexOf(to.path) < 0 ) {
            Utils.redirectLoginPage()
            return
        }

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
                if (res.data.status === 200) {
                    if(res.data.result === true){
                        next()
                    }else{
                        next('/forbidden/404?status=2')
                    }

                }

                //不合法的ticket
                else if(res.data.status === 605){
                    //直接登出
                    Utils.logout(false)

                    //提示被别人挤出
                    next('/forbidden/404?status=1')
                }

                //权限校验失败，当前用户没有操作某个接口或服务的权限 或者 接口/服务未在访问白名单
                else if(res.data.status === 607 || res.data.status === 602 || res.data.status === 80098){
                    next('/forbidden/404?status=2')
                }

                //其他错误
                else{
                    next('/forbidden/404?status=4')
                }
            })
            .catch((err) => {
                next('/forbidden/404?status=4')
            })
    }

})

router.afterEach(route => {
    let title
    if (route.meta.title) {
        title = route.meta.title + ' - 土巴兔商家后台'
    } else {
        title = '土巴兔商家后台'
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

function routerCheckCertificate(_args, jumpUrl) {
    api.newaccount.checkCertificate(_args)
        .then(res => {
            if (res.data.status == 200) {
                Vue.prototype.$message.success("登录成功")
                Cookie.set('t8t-tc-ticket', res.data.result.tickets['tuchat-pc'].value, { domain: '.to8to.com' })
                Cookie.set('t8t-tc-uid', res.data.result.user.id, { domain: '.to8to.com' })
                Cookie.set('t8t-tc-username', res.data.result.user.name, { domain: '.to8to.com' })
                //装修公司id
                let comid = ( res.data.result.bounds.length >= 1 ? res.data.result.bounds[0].extId : 0 )
                Cookie.set('t8t-tc-comid', comid, { domain: '.to8to.com' })
                //获取登录的装修公司信息

                if(comid){
                    Vue.prototype.$http.fetch(
                        'fcominfo/getbyId',
                        {
                            id:comid
                        }
                    ).then((res) => {
                        if( res.data.status == 200 ){
                            Cookie.set('t8t-tc-comname', res.data.result && res.data.result.name ? res.data.result.name : '', { domain: '.to8to.com' } )
                        }
                        router.replace(jumpUrl)
                    })
                }else{
                    router.replace(jumpUrl)
                }
            } else {
                Vue.prototype.$message.error(`授权登录失败`)
            }
        }).catch(err => {
        debugger
        Vue.prototype.$message.error("请求超时或服务器出错")
        console.log(err)
    })
}

export default router
