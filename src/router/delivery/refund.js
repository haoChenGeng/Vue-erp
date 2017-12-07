// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const RefundOrderIndex = resolve => require(['src/views/m-delivery/project-execution/refundOrder-list.vue'], resolve)
const RefundOrderDetail = resolve => require(['src/views/m-delivery/project-execution/refundOrder-detail.vue'], resolve)
const routes = [
    //交付
    {
        path: '/tochat-delivery',
        component: Console,
        children: [
            { path: 'refundOrder-index', meta: { isFulldialog:false, title: '工程退货' }, component: RefundOrderIndex},
            { path: 'refundOrder-detail', meta: { isFulldialog: true, title: '工程退货' }, component: RefundOrderDetail}
        ]
    }
]

export default routes
