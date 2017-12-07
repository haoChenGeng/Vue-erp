// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const ServiceTypeConfiguration = resolve => require(['../../views/m-finance/accounts-receivable/service-type-configuration.vue'], resolve)
const InvoiceInfoList = resolve => require(['../../views/m-finance/accounts-receivable/invoiceInfo-list.vue'], resolve)
const InvoiceInfoEdit = resolve => require(['../../views/m-finance/accounts-receivable/invoiceInfo-edit.vue'], resolve)
const InvoicesSalesList = resolve => require(['../../views/m-finance/accounts-receivable/invoiceSales-list.vue'], resolve)
const InvoicesSalesView = resolve => require(['../../views/m-finance/accounts-receivable/invoiceSales-view.vue'], resolve)


const routes = [{
    path: '/tochat-finance',
    component: Console,
    children: [
        { path: 'service-type-configuration', meta: {isFulldialog: false,title: '财务配置管理'}, component: ServiceTypeConfiguration },
        { path: 'invoice-info',meta: {isFulldialog: false,title: '开票信息'}, component: InvoiceInfoList },
        { path: 'invoice-info/edit',meta: {isFulldialog: false,title: '开票信息-编辑'}, component: InvoiceInfoEdit},
        { path: 'invoice-info/view',meta: {isFulldialog: false,title: '开票信息-查看'}, component:InvoiceInfoEdit},
        { path: 'invoice-sales',meta: {isFulldialog: false,title: '销售发票'}, component: InvoicesSalesList },
        { path: 'invoice-sales/view',meta: {isFulldialog: true,title: '销售发票-查看'}, component:InvoicesSalesView }
    ]
}]

export default routes
