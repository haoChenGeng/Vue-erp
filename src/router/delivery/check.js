// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

//平台验收
const ConfirmList = resolve => require(['src/views/m-delivery/plat-check/confirm-list.vue'], resolve)
const PlatCheckList = resolve => require(['src/views/m-delivery/plat-check/plat-check-list.vue'], resolve)
const PlatCheckDetail = resolve => require(['src/views/m-delivery/plat-check/plat-check-detail.vue'], resolve)


const routes = [
    //交付 - 平台验收
    {
        path: '/tuchat-delivery',
        component: Console,
        children: [
            { path: 'confirm-list', meta: { isFulldialog: false, title: '开工确认' }, component: ConfirmList },
            { path: 'plat-check-list', meta: { isFulldialog: false, title: '验收管理' }, component: PlatCheckList },
            { path: 'plat-check-detail', meta: { isFulldialog: true, title: '验收管理' }, component: PlatCheckDetail },
        ]
    }
]

export default routes
