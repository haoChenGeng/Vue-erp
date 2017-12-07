/**
 * Created by sean.liu on 2017/8/30.
 */
// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

// 权限管理
const permission = resolve => require(['src/views/m-system/page-permission-manager/page-perm-mgt.vue'], resolve)
const Whitelist = resolve => require(['src/views/m-system/permission-whitelist/index.vue'], resolve)

const routes = [
    // 系统管理
    {
        path: '/tuchat-system',
        component: Console,
        children: [
            {path: 'permission', meta: { isFulldialog: false, title: '权限管理'}, component: permission},
            { path: 'permission-whitelist', meta: { isFulldialog: false, title: '权限白名单' }, component: Whitelist }
        ]
    }
]

export default routes
