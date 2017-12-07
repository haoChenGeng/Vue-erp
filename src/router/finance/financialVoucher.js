// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

// 财务凭证
const PageVoucherTemplate = resolve => require(['src/views/m-finance/page-voucher-template/voucherTemplate-list.vue'], resolve)
const PageVoucherOrderCreate = resolve => require(['src/views/m-finance/page-voucher-order-create/voucherOrderCreate-list.vue'], resolve)
const PageVoucherOrder = resolve => require(['src/views/m-finance/page-voucher-order/voucherOrder-list.vue'], resolve)
const PageVoucherOrderView = resolve => require(['src/views/m-finance/page-voucher-order/voucherOrderItem-detail.vue'], resolve)
const PageVoucherSourceItem = resolve => require(['src/views/m-finance/page-voucher-order/voucherSourceItem-list.vue'], resolve)
const PageVoucherTemplateView = resolve => require(['src/views/m-finance/page-voucher-template/voucherTemplate-view.vue'], resolve)
const PageVoucherTemplateAdd = resolve => require(['src/views/m-finance/page-voucher-template/voucherTemplate-add.vue'], resolve)
const PageVoucherTemplateEdit = resolve => require(['src/views/m-finance/page-voucher-template/voucherTemplate-edit.vue'], resolve)

const routes = [{
    path: '/tuchat-finance',
    component: Console,
    children: [
        { path: 'page-voucher-template', meta: { isFulldialog: false,title: '凭证模板设置' }, component: PageVoucherTemplate },
        { path: 'page-voucher-order-create', meta: { isFulldialog: false,title: '凭证生成' }, component: PageVoucherOrderCreate },
        { path: 'page-voucher-order', meta: { isFulldialog: false,title: '凭证查询' }, component: PageVoucherOrder},
        { path: 'page-voucher-order/detail', meta: { isFulldialog: true,title: '凭证查询' }, component: PageVoucherOrderView},
        { path: 'page-voucher-order/detail/sourceItem', meta: { isFulldialog: false,title: '联查明细' }, component: PageVoucherSourceItem },
        { path: 'page-voucher-template/view', meta: { isFulldialog: false,title: '凭证模板查看' }, component: PageVoucherTemplateView },
        { path: 'page-voucher-template/add', meta: { isFulldialog: false,title: '凭证模板新增' }, component: PageVoucherTemplateAdd },
        { path: 'page-voucher-template/edit', meta: { isFulldialog: false,title: '凭证模板编辑' }, component: PageVoucherTemplateEdit },
    ]
}]

export default routes
