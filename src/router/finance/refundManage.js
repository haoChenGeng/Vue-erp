/**
 * Created by shuai.pan on 2017/12/06.
 */

// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

// 基础账户
const RefundRoundOrder = resolve => require(['src/views/m-finance/page-refund-roundOrder/roundOrder-list.vue'], resolve)
const RefundTrusteeFee = resolve => require(['src/views/m-finance/page-refund-trusteeFee/trusteeFee-list.vue'], resolve)

const routes = [{
    path: '/tuchat-finance',
    component: Console,
    children: [
        { path: 'page-refund-roundOrder', meta: { isFulldialog: false, title: '轮单费' }, component: RefundRoundOrder },
        { path: 'page-refund-trusteeFee', meta: { isFulldialog: false, title: '托管款' }, component: RefundTrusteeFee }
    ]
}]

export default routes
