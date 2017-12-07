/**
 * 系统相关的数据
 */
// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const loginLog = resolve => require(['src/views/m-om/system/loginLog.vue'], resolve)

const routes = [
    {
        path: '/tochat-om',
        component: Console,
        children: [
            { path: 'loginLog', meta:{isFulldialog: false,title: '登录日志'}, component: loginLog}
        ]
    },
]

export default routes
