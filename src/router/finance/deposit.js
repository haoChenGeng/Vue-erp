//引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const DepositCreditList = resolve => require(['../../views/m-finance/page-deposit/depositCredit-list.vue'], resolve)
const DepositList = resolve => require(['../../views/m-finance/page-deposit/deposit-list.vue'], resolve)
const DepositDetail = resolve => require(['../../views/m-finance/page-deposit/deposit-detail.vue'], resolve)
const DepositDetailPage = resolve => require(['../../views/m-finance/page-deposit/deposit-detail-page.vue'], resolve)
const RecordList = resolve => require(['../../views/m-finance/page-deposit/record-list.vue'], resolve)
const RecordUpdate = resolve => require(['../../views/m-finance/page-deposit/record-updateDialog.vue'], resolve)
const RecordApproval = resolve => require(['../../views/m-finance/page-deposit/record-approvalDialog.vue'], resolve)
const RecordCreate = resolve => require(['../../views/m-finance/page-deposit/record-createDialog.vue'], resolve)
const RecordDetail = resolve => require(['../../views/m-finance/page-deposit/record-detail.vue'], resolve)
const RecordAudit = resolve => require(['../../views/m-finance/page-deposit/record-audit.vue'], resolve)



const routes = [{
    path: '/finance',
    component: Console,
    children: [
        { path: 'depositCredit-list', meta: { isFulldialog: false, title: '质保金额度配置'}, component: DepositCreditList },
        { path: 'deposit-list', meta : { isFulldialog: false,title : '质保金余额查看'}, component: DepositList},
        { path: 'deposit-list/deposit-detail',meta: { isFulldialog: true,title: '质保金余额明细查看'}, component: DepositDetail },
        { path: 'deposit-detail-page', meta : { isFulldialog: false,title : '质保金余额明细'}, component: DepositDetailPage},
        { path: 'record-list', meta : { isFulldialog: false, title : '收付记录查看'}, component: RecordList},
        { path: 'record-list/update', meta : { isFulldialog: true, title : '收付记录更新'}, component: RecordUpdate},
        { path: 'record-list/approval', meta : { isFulldialog: true, title : '收付记录审批流'}, component: RecordApproval},
        { path: 'record-list/create', meta : { isFulldialog: true, title : '收付记录新增'}, component: RecordCreate},
        { path: 'record-list/record-detail',meta: { isFulldialog: true, title: '收付记录明细查看'}, component:RecordDetail  },
        { path: 'record-list/record-audit',meta: { isFulldialog: true, title: '收付记录审核'}, component:RecordAudit  }

    ]
}]

export default routes
