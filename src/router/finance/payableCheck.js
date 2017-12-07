// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

// 应付核算-采购发票
const PagePurchaseInvoice = resolve => require(['src/views/m-finance/page-purchase-invoice/page-purchase-invoice.vue'], resolve)
const PagePurchaseInvoiceAutoCreate = resolve => require(['src/views/m-finance/page-purchase-invoice/autoCreate.vue'], resolve)
const PagePurchaseInvoiceCreate = resolve => require(['src/views/m-finance/page-purchase-invoice/create.vue'], resolve)
const PagePurchaseInvoiceView = resolve => require(['src/views/m-finance/page-purchase-invoice/detail.vue'], resolve)
const PagePurchaseInvoiceEdit = resolve => require(['src/views/m-finance/page-purchase-invoice/detail.vue'], resolve)
const PagePurchaseInvoiceAudit = resolve => require(['src/views/m-finance/page-purchase-invoice/detail.vue'], resolve)
const PagePurchaseInvoiceWriteOff = resolve => require(['src/views/m-finance/page-purchase-invoice/writeOff.vue'], resolve)
//采购核销单
const PagePurchaseVerificationSheet = resolve => require(['src/views/m-finance/page-purchase-verification-sheet/index.vue'], resolve)
const PagePurchaseVerificationSheetView = resolve => require(['src/views/m-finance/page-purchase-verification-sheet/view.vue'], resolve)
//入库调整单
const PageInventoryAdjustmentNote = resolve => require(['src/views/m-finance/page-inventory-adjustment-note/index.vue'], resolve)


const routes = [{
    path: '/tochat-finance',
    component: Console,
    children: [
        //应付核算-采购发票
        { path: 'page-purchase-invoice', meta: { isFulldialog: false, title: '采购发票'}, component: PagePurchaseInvoice },
        { path: 'page-purchase-invoice/autoCreate', meta: { isFulldialog: true, title: '采购发票-参照对账单新增'}, component: PagePurchaseInvoiceAutoCreate },
        { path: 'page-purchase-invoice/create', meta: { isFulldialog: true, title: '采购发票-新增'}, component: PagePurchaseInvoiceCreate },
        { path: 'page-purchase-invoice/view', meta: { isFulldialog: true, title: '采购发票-查看'}, component: PagePurchaseInvoiceView },
        { path: 'page-purchase-invoice/edit', meta: { isFulldialog: true, title: '采购发票-编辑'}, component: PagePurchaseInvoiceEdit },
        { path: 'page-purchase-invoice/audit', meta: { isFulldialog: true, title: '采购发票-审批'}, component: PagePurchaseInvoiceAudit },
        { path: 'page-purchase-invoice/writeOff', meta: { isFulldialog: true, title: '采购发票-核销'}, component: PagePurchaseInvoiceWriteOff },
        { path: 'page-purchase-verification-sheet', meta: { isFulldialog: false, title: '采购核销单'}, component: PagePurchaseVerificationSheet },
        { path: 'page-purchase-verification-sheet/view', meta: { isFulldialog: false, title: '采购核销单-查看'}, component: PagePurchaseVerificationSheetView },
        { path: 'page-inventory-adjustment-note', meta: { isFulldialog: false, title: '入库调整单'}, component: PageInventoryAdjustmentNote },
    ]
}]

export default routes
