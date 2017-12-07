/**
 * Created by luke.lv on 2017/9/13.
 */

// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

// 基础账户
const AccAccountConfig = resolve => require(['src/views/m-finance/page-acc-account-config/accAccountConfig-list.vue'], resolve)
const AccAccountConfigCreate = resolve => require(['src/views/m-finance/page-acc-account-config/accAccountConfig-dialog.vue'], resolve)

// 收支类型配置
const AccRecordeTypeConfig = resolve => require(['src/views/m-finance/page-acc-recordType-config/accRecordTypeConfig-list.vue'], resolve)
const AccRecordeTypeConfigCreate = resolve => require(['src/views/m-finance/page-acc-recordType-config/accRecordTypeConfig-dialog.vue'], resolve)

// 业务调用模板
const AccInvokeTemplateConfig = resolve => require(['src/views/m-finance/page-acc-invoke-template/accInvokeTemplate-list.vue'], resolve)
const AccInvokeTemplateConfigCreate = resolve => require(['src/views/m-finance/page-acc-invoke-template/accInvokeTemplate-dialog.vue'], resolve)

//账户收支单
const recordOrder = resolve => require(['src/views/m-finance/page-acc-record-order/recordOrder-list.vue'], resolve)

//账户余额
const accountBalance = resolve => require(['src/views/m-finance/page-acc-account-balance/accAccountBalance-list.vue'], resolve)
//账户余额明细查看
const accountBalanceDetail = resolve => require(['src/views/m-finance/page-acc-account-balance/accAccountBalance-detail.vue'], resolve)

const routes = [{
    path: '/tochat-finance',
    component: Console,
    children: [
        { path: 'accAccountConfig-list', meta: { isFulldialog: false, title: '基础账户配置' }, component: AccAccountConfig },
        { path: 'accAccountConfig-list/create', meta: { isFulldialog: true, title: '新增基础账户配置' }, component: AccAccountConfigCreate },
        { path: 'accAccountConfig-list/edit', meta: { isFulldialog: true, title: '编辑基础账户配置' }, component: AccAccountConfigCreate },
        { path: 'accRecordTypeConfig-list', meta: { isFulldialog: false, title: '收支类型配置' }, component: AccRecordeTypeConfig },
        { path: 'accRecordTypeConfig-list/create', meta: { isFulldialog: true, title: '新增收支类型配置' }, component: AccRecordeTypeConfigCreate },
        { path: 'accRecordTypeConfig-list/edit', meta: { isFulldialog: true, title: '编辑收支类型配置' }, component: AccRecordeTypeConfigCreate },
        { path: 'accInvokeTemplate-list', meta: { isFulldialog: false, title: '业务调用模板' }, component: AccInvokeTemplateConfig },
        { path: 'accInvokeTemplate-list/create', meta: { isFulldialog: true, title: '新增业务调用模板' }, component: AccInvokeTemplateConfigCreate },
        { path: 'accInvokeTemplate-list/edit', meta: { isFulldialog: true, title: '编辑业务调用模板' }, component: AccInvokeTemplateConfigCreate },
        { path: 'recordOrder-list', meta: { isFulldialog: false, title: '账户收支单' }, component: recordOrder },
        { path: 'accAccountBalance-list', meta: { isFulldialog: false, title: '账户余额' }, component: accountBalance },
        { path: 'accAccountBalance-detail', meta: { isFulldialog: false, title: '账户余额明细查看' }, component: accountBalanceDetail }
    ]
}]

export default routes
