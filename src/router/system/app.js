// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

// app功能管理
const appFunction = resolve => require(['src/views/m-system/app-permissions/list.vue'], resolve)
    // app功能详情
    //app版本更新列表
const appVersion = resolve => require(['src/views/m-system/app-version/list.vue'], resolve)
    //app版本详情
const appVersionDetail = resolve => require(['src/views/m-system/app-version/detail.vue'], resolve)

const routes = [{
    path: '/tuchat-system',
    component: Console,
    children: [
        { path: 'app-permissions', meta: { isFulldialog: false, title: 'APP功能管理' }, component: appFunction },
        { path: 'app-version', meta: { isFulldialog: false, title: 'APP版本更新' }, component: appVersion },
        { path: 'app-version/detail', meta: { isFulldialog: true, title: 'APP版本更新-新增' }, component: appVersionDetail }
    ]
}]

export default routes
