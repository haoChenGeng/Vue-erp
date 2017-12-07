// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

// 收款单与配置合在一起
const PagePayMethods = resolve => require(['src/views/m-finance/page-pay-methods/page-pay-methods.vue'], resolve)
const PagePayType = resolve => require(['src/views/m-finance/page-pay-type/page-pay-type.vue'], resolve)
const PagePayPurpose = resolve => require(['src/views/m-finance/page-pay-purpose/page-pay-purpose.vue'], resolve)
const PagePaymentMethodConfig = resolve => require(['src/views/m-finance/page-payment-method-config/page-payment-method-config.vue'], resolve)
const PagePaymentTypeConfig = resolve => require(['src/views/m-finance/page-payment-type-config/page-payment-type-config.vue'], resolve)
const PagePaymentMethodDistribution = resolve => require(['src/views/m-finance/page-payment-method-distribution/page-payment-method-distribution.vue'], resolve)
const PagePaymentMethodDistributionView = resolve => require(['src/views/m-finance/page-payment-method-distribution/pay-dialog.vue'], resolve)
const pagePayRemit = resolve => require(['src/views/m-finance/page-pay-remit/page-pay-remit.vue'], resolve)
const PagePayRemitView = resolve => require(['src/views/m-finance/page-pay-remit/dialogEdit.vue'], resolve)
const PagePayRemitCreate = resolve => require(['src/views/m-finance/page-pay-remit/dialog.vue'], resolve)
const PagePayMethodsAllot = resolve => require(['src/views/m-finance/page-pay-methods-allot/page-pay-methods-allot.vue'], resolve)
const PagePayPlan = resolve => require(['src/views/m-finance/page-pay-plan/page-pay-plan.vue'], resolve)
const PagePayBills = resolve => require(['src/views/m-finance/page-pay-bills/page-pay-bills.vue'], resolve)
const PageVerifyCancelRecord = resolve => require(['src/views/m-finance/page-verify-cancel-record/page-verify-cancel-record.vue'], resolve)
const PagePayBillsCreate = resolve => require(['src/views/m-finance/page-pay-bills/dialog.vue'], resolve)
const PagePayBillsVerify = resolve => require(['src/views/m-finance/page-pay-bills/dialog-verify.vue'], resolve)
const PagePayPlanPay = resolve => require(['src/views/m-finance/page-pay-plan/dialog-pay.vue'], resolve)
const PagePayPlanSee = resolve => require(['src/views/m-finance/page-pay-plan/dialog-see.vue'], resolve)
const PageVerifyCancelRecordSee = resolve => require(['src/views/m-finance/page-verify-cancel-record/dialog-see.vue'], resolve)
const PagePayBillsUpdate = resolve => require(['src/views/m-finance/page-pay-bills/dialogEdit.vue'], resolve)
const PagePayBillsView = resolve => require(['src/views/m-finance/page-pay-bills/dialogEdit-VIEW.vue'], resolve)
// 收款计划单修改作废
const PagePayPlanUpdate = resolve => require(['src/views/m-finance/page-pay-plan/page-pay-plan-update.vue'], resolve)
// 收款单--电子收据
const ElectronicReceipt = resolve => require(['src/views/m-finance/page-pay-bills/electronic-receipt.vue'], resolve)
const PageFundChannelConfig = resolve => require(['src/views/m-finance/page-fund-channel-config/page-fund-channel-config.vue'], resolve)
const PageFundReceiptDailyReConciliation = resolve => require(['src/views/m-finance/page-fund-receiptDailyReConciliation/page-fund-receiptDailyReConciliation.vue'], resolve)
const PageFundReceiptReconciliationQuery = resolve => require(['src/views/m-finance/page-fund-receiptReconciliationQuery/page-fund-receiptReconciliationQuery.vue'], resolve)

const PagePayAbcPay = resolve => require(['src/views/m-finance/page-pay-plan/dialog-abcpay.vue'], resolve)
const PagePayAliPay = resolve => require(['src/views/m-finance/page-pay-plan/dialog-alipay.vue'], resolve)

const routes = [{
    path: '/tochat-finance',
    component: Console,
    children: [
        { path: 'page-pay-plan-update', meta: { isFulldialog: false, title: '收款计划单' }, component: PagePayPlanUpdate },
        { path: 'page-pay-methods', meta: { isFulldialog: false, title: '收款方式配置' }, component: PagePayMethods },
        { path: 'page-pay-type', meta: { isFulldialog: false, title: '收款类型配置' }, component: PagePayType },
        { path: 'page-pay-purpose', meta: { isFulldialog: false,title: '款项用途配置' }, component: PagePayPurpose },
        { path: 'page-payment-method-config', meta: { isFulldialog: false,title: '付款方式配置' }, component: PagePaymentMethodConfig },
        { path: 'page-payment-type-config', meta: { isFulldialog: false,title: '付款类型配置' }, component: PagePaymentTypeConfig },
        { path: 'page-payment-method-distribution', meta: { isFulldialog: false,title: '付款方式分配' }, component: PagePaymentMethodDistribution },
        { path: 'page-payment-method-distribution/create', meta: { isFulldialog: true,title: '新增付款方式分配' }, component:PagePaymentMethodDistributionView  },
        { path: 'page-pay-remit', meta: {isFulldialog: false, title: '付款单' }, component: pagePayRemit },
        { path: 'page-pay-remit/view', meta: { isFulldialog: true,title: '付款单' }, component:PagePayRemitView },
        { path: 'page-pay-remit/create', meta: { isFulldialog: true,title: '付款单' }, component: PagePayRemitCreate },
        { path: 'page-pay-methods-allot', meta: { isFulldialog: false, title: '收款方式分配' }, component: PagePayMethodsAllot },
        { path: 'page-pay-bills', meta: { isFulldialog: false, title: '收款单' }, component: PagePayBills },
        { path: 'page-pay-bills/create', meta: { isFulldialog: true, title: '收款单' }, component: PagePayBillsCreate },
        { path: 'page-pay-bills/update', meta: { isFulldialog: true, title: '收款单' }, component: PagePayBillsUpdate },
        { path: 'page-pay-bills/verify', meta: { isFulldialog: true, title: '收款单' }, component: PagePayBillsVerify },
        { path: 'page-pay-bills/view', meta: { isFulldialog: true, title: '收款单' }, component: PagePayBillsView },
        { path: 'page-pay-bills/e-receipt', meta: { isFulldialog: false,title: '收款单--电子收据' }, component: ElectronicReceipt },
        { path: 'page-pay-plan', meta: { isFulldialog: false, title: '收款计划单' }, component: PagePayPlan },
        { path: 'page-pay-plan/pay', meta: { isFulldialog: true, title: '收款计划单' }, component: PagePayPlanPay },
        { path: 'page-pay-plan/see', meta: { isFulldialog: true, title: '收款计划单' }, component: PagePayPlanSee },
        { path: 'page-verify-cancel-record', meta: { isFulldialog: false, title: '核销记录' }, component: PageVerifyCancelRecord },
        { path: 'page-verify-cancel-record/see', meta: { isFulldialog: true, title: '核销记录' }, component: PageVerifyCancelRecordSee },
        { path: 'page-fund-channel-config', meta: {isFulldialog: false, title: '资金渠道管理配置' }, component: PageFundChannelConfig },
        { path: 'page-fund-receiptDailyReConciliation', meta: { isFulldialog: false,title: '资金收款日记账' }, component: PageFundReceiptDailyReConciliation },
        { path: 'page-fund-receiptReconciliationQuery', meta: { isFulldialog: false,title: '资金收款对账查询' }, component: PageFundReceiptReconciliationQuery },

        { path: 'page-pay-plan/abcPay', meta: {isFulldialog: true, title: '农行POS机支付' }, component: PagePayAbcPay  },
        { path: 'page-pay-plan/aliPay', meta: { isFulldialog: true,title: '支付宝支付' }, component:PagePayAliPay  }
    ]
}]

export default routes
