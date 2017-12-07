// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

// 存货核算
const PageCostDomainConfig = resolve => require(['src/views/m-finance/page-cost-domain-config/page-cost-domain-config.vue'], resolve)
const CostDomainConfigCreate = resolve => require(['src/views/m-finance/page-cost-domain-config/cost-domain-dialog.vue'], resolve)
const PageInitialAccountingData = resolve => require(['src/views/m-finance/page-initial-accounting-data/page-initial-accounting-data.vue'], resolve)
const PageAccountingTask = resolve => require(['src/views/m-finance/page-accounting-task/page-accounting-task.vue'], resolve)
const PageAccountingTaskItem = resolve => require(['src/views/m-finance/page-accounting-task-item/page-accounting-task-item.vue'], resolve)
const PageGoodsCostPrice = resolve => require(['src/views/m-finance/page-goods-cost-price/page-goods-cost-price.vue'], resolve)
const PageInventoryAccountingItem = resolve => require(['src/views/m-finance/page-inventory-accounting-item/page-inventory-accounting-item.vue'], resolve)
const PageTransceiverDepositBooks = resolve => require(['src/views/m-finance/page-transceiver-deposit-books/page-transceiver-deposit-books.vue'], resolve)

const routes = [{
    path: '/tochat-finance',
    component: Console,
    children: [
        { path: 'page-cost-domain-config', meta: { isFulldialog: false, title: '存货核算成本域配置' }, component: PageCostDomainConfig },
        { path: 'page-cost-domain-config/create', meta: { isFulldialog: false, title: '新增存货核算成本域配置' }, component: CostDomainConfigCreate },
        { path: 'page-cost-domain-config/edit', meta: { isFulldialog: false, title: '编辑存货核算成本域配置' }, component: CostDomainConfigCreate },
        { path: 'page-cost-domain-config/view', meta: { isFulldialog: false, title: '查看存货核算成本域配置' }, component: CostDomainConfigCreate },
        { path: 'page-initial-accounting-data', meta: { isFulldialog: false, title: '存货核算期初核算数据' }, component: PageInitialAccountingData },
        { path: 'page-accounting-task', meta: { isFulldialog: false, title: '存货核算存货单价计算' }, component: PageAccountingTask },
        { path: 'page-accounting-task-item', meta: { isFulldialog: false, title: '存货核算执行任务列表' }, component: PageAccountingTaskItem },
        { path: 'page-goods-cost-price', meta: { isFulldialog: false, title: '存货核算成本单价查询' }, component: PageGoodsCostPrice },
        { path: 'page-inventory-accounting-item', meta: { isFulldialog: false, title: '存货核算库存明细账查询' }, component: PageInventoryAccountingItem },
        { path: 'page-transceiver-deposit-books', meta: { isFulldialog: false, title: '存货核算收发存账簿' }, component: PageTransceiverDepositBooks }
    ]
}]

export default routes
