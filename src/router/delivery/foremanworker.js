// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

const PageForemanworkerList = resolve => require(['src/views/m-delivery/page-foremanworker-data/page-list.vue'], resolve)
const PageForemanworkerEdit = resolve => require(['src/views/m-delivery/page-foremanworker-data/page-edit.vue'], resolve)
const Audit = resolve => require(['src/views/m-delivery/page-foremanworker-data/audit.vue'], resolve)

const routes = [
    //交付
    {
        path: '/delivery',
        component: Console,
        children: [
            { path: 'foremanworker-list', meta: { isFulldialog:false, title: '工长管理' }, component: PageForemanworkerList},
            { path: 'foremanworker/:type', meta: { isFulldialog: true,title: '工长管理' }, component: PageForemanworkerEdit },
            { path: 'foremanworker-audit', meta: { isFulldialog: true, title: '工长管理' }, component: Audit},
            { path: 'foremanworker-termination', meta: { isFulldialog: true, title: '工长管理' }, component: Audit},
        ]
    }
]

export default routes
