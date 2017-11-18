// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
    //交付模块
const Forbidden = resolve => require(['src/views/404/404.vue'], resolve)

const routes = [
    //交付
    {
        path: '/forbidden',
        component: Console,
        children: [
            { path: '404', meta: { isFulldialog: true, auth: false }, component: Forbidden },
            { path: '400', meta: { isFulldialog: true, auth: false } }
        ]
    }
]

export default routes
