// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const GoodsDemandList = resolve => require(['src/views/m-delivery/goods-demand/goodsDemand-list.vue'], resolve)
const GoodsDemandDetail = resolve => require(['src/views/m-delivery/goods-demand/goodsDemand-detail.vue'], resolve)
const routes = [
    //要货单
    {
        path: '/tuchat-delivery',
        component: Console,
        children: [
            { path: 'demand-list', meta: { isFulldialog: false, title: '工程下单' }, component: GoodsDemandList },
            { path: 'demand-view', meta: { isFulldialog: true, title: '工程下单' }, component: GoodsDemandDetail },
        ]
    }
]
export default routes
