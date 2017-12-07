// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

// 银行主数据
const PageBankBasedata = resolve => require(['src/views/m-finance/page-bank-basedata/index.vue'], resolve)
const PageBankBasedataView = resolve => require(['src/views/m-finance/page-bank-basedata/view-dialog.vue'], resolve)

const routes = [{
    path: '/tuchat-finance',
    component: Console,
    children: [
        { path: 'basedata', meta: { isFulldialog: false, title: '银行账号' }, component: PageBankBasedata },
        { path: 'basedata/view', meta: { isFulldialog: true, title: '银行账号' }, component: PageBankBasedataView }
    ]
}]

export default routes
