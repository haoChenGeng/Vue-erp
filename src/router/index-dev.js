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
// workbench工作台
import workbench from './workbench/index.js'

// dev
import dev from './route-dev.js'

let routes = []


routes = routes.concat(login)

// 只输入域名是，跳转到/index
routes.push({
    path: '/',
    redirect: '/index'
})

routes = routes.concat(
    forbidden,
    workbench,
    dev
)

// =========================================================================================

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {

    let _args = { ...{ local: 'tuchat-pc' }, ...to.query }

    if (_args.uid && _args.certificate && _args.from) {
        //认证成功后跳转的链接地址
        var query = to.query
        var uid = to.query.uid
        delete query['uid']
        delete query['from']
        delete query['certificate']
        let jumpUrl = {
            path:to.path,
            query:query,
            replace: true
        }

        if (Cookie.get('t8t-tc-uid') && Cookie.get('t8t-tc-uid') != uid ) {
            Vue.prototype.$confirm(`警告：${Cookie.get('t8t-tc-username')}已登录系统，继续登录将使${Cookie.get('t8t-tc-username')}下线`, '警告', {
                confirmButtonText: '继续登录',
                cancelButtonText: '取消登录',
                type: 'warning'
            }).then(_ => {
                routerCheckCertificate(_args, jumpUrl)
            }).catch(_ => {
                console.log("取消")
            })
        } else {
            routerCheckCertificate(_args, jumpUrl)
        }
    }else{
        if (to.meta.auth === false || debug === true) {
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
    }

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

function routerCheckCertificate(_args, jumpUrl) {
    api.newaccount.checkCertificate(_args)
        .then(res => {
            if (res.data.status == 200) {
                Vue.prototype.$message.success("登录成功")
                Cookie.set('t8t-tc-ticket', res.data.result.tickets['tuchat-pc'].value)
                Cookie.set('t8t-tc-uid', res.data.result.user.id)
                Cookie.set('t8t-tc-username', res.data.result.user.name)

                //装修公司id
                let comid = ( res.data.result.bounds.length > 1 ? res.data.result.bounds[0].extId : 0 )
                //获取登录的装修公司信息

                if(comid){
                    Vue.prototype.$http.fetch(
                        'fcominfo/getbyId',
                        {
                            id:comid
                        }
                    ).then((res) => {
                        if( res.data.status == 200 ){
                            Cookie.set('t8t-tc-comname', res.data.result && res.data.result.name ? res.data.result.name : '' )
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
