// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const GoodsDemandList = resolve => require(['src/views/m-delivery/goods-demand/goodsDemand-list.vue'], resolve)
const GoodsDemandDetail = resolve => require(['src/views/m-delivery/goods-demand/goodsDemand-detail.vue'], resolve)
const TXGoodsDemandNPConfigList = resolve => require(['src/views/m-delivery/goods-demand/goodsDemandNPConfig-list.vue'], resolve)

const routes = [
    //要货单
    {
        path: '/tuchat-delivery',
        component: Console,
        children: [
            { path: 'demand-list', meta: { isFulldialog: false, title: '辅材管理' }, component: GoodsDemandList },
            { path: 'demand-view', meta: { isFulldialog: true, title: '辅材管理' }, component: GoodsDemandDetail },
            { path: 'demandNPConfig-view', meta: { isFulldialog: false, title: '非平台辅材下单配置' }, component: TXGoodsDemandNPConfigList }
        ]
    }
]
export default routes
