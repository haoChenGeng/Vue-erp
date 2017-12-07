// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const PageSurchargeList = resolve => require(['src/views/m-delivery/page-surcharge/surcharge-list.vue'], resolve)
const PageSurchargeDetail = resolve => require(['src/views/m-delivery/page-surcharge/surcharge-detail.vue'], resolve)
const PageSurchargeApprove = resolve => require(['src/views/m-delivery/page-surcharge/surcharge-approve.vue'], resolve)
const routes = [
    //工期配置
    {
        path: '/tochat-delivery',
        component: Console,
        children: [
            { path: 'page-surcharge-list', meta: { isFulldialog:false,title: '附加费管理' }, component: PageSurchargeList},
            { path: 'page-surcharge-detail', meta: { isFulldialog:true,title: '附加费详情' }, component: PageSurchargeDetail},
            { path: 'page-surcharge-approve', meta: { isFulldialog:true,title: '附加费审核' }, component:PageSurchargeApprove},
        ]
    }
]


export default routes
