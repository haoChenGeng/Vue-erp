// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
//交付模块
const PageDeliveryTemplateBase = resolve => require(['src/views/m-delivery/schedule-template/template-base.vue'], resolve)
const PageDeliveryTemplateDetail = resolve => require(['src/views/m-delivery/schedule-template/template-detail.vue'], resolve)
const PageDeliveryTemplateRef = resolve => require(['src/views/m-delivery/schedule-template/showRef.vue'], resolve)
const PageDeliveryNodeAttribute = resolve => require(['src/views/m-delivery/schedule-template/node-attribute.vue'], resolve)
//项目计划
const PageDeliveryProjectList = resolve => require(['src/views/m-delivery/project-plan/project-list.vue'], resolve)
const PageDeliveryProjectQuery = resolve => require(['src/views/m-delivery/project-plan/project-query.vue'], resolve)
const PageDeliveryProjectShow = resolve => require(['src/views/m-delivery/project-plan/project-show.vue'], resolve)
const ProjectDetail = resolve => require(['src/views/m-delivery/project-plan/project-detail.vue'], resolve)
const ProjectReport = resolve => require(['src/views/m-delivery/project-plan/project-report.vue'], resolve)
//配置
const BillsEntry = resolve => require(['src/views/m-delivery/bills-setting/bills-entry.vue'], resolve)
//项目执行
const YanShouBill = resolve => require(['src/views/m-delivery/project-execution/yanshou-list.vue'], resolve)
const YanShouDetail = resolve => require(['src/views/m-delivery/project-execution/yanshou-detail.vue'], resolve)
const YanShouView = resolve => require(['src/views/m-delivery/project-execution/yanshou-view.vue'], resolve)
const YanshouProjectDetail = resolve => require(['src/views/m-delivery/project-execution/project-detail.vue'], resolve)
const LockoutBill = resolve => require(['src/views/m-delivery/project-execution/lockout-bill.vue'], resolve)
const LockoutDetail = resolve => require(['src/views/m-delivery/project-execution/lockout-detail.vue'], resolve)
const LockoutVerify = resolve => require(['src/views/m-delivery/project-execution/lockout-verify.vue'], resolve)
const DelayBill = resolve => require(['src/views/m-delivery/project-execution/delay-bill.vue'], resolve)
const DelayDetail = resolve => require(['src/views/m-delivery/project-execution/delay-detail.vue'], resolve)
const DelayVerify = resolve => require(['src/views/m-delivery/project-execution/delay-verify.vue'], resolve)
const AccountsIndex = resolve => require(['src/views/m-delivery/base-setting/accounts/index.vue'], resolve)
const AccountsDetail = resolve => require(['src/views/m-delivery/base-setting/accounts/detail.vue'], resolve)
const ShutConfigIndex = resolve => require(['src/views/m-delivery/base-setting/shutConfig.vue'], resolve)
//发包单价
const FbIndex = resolve => require(['src/views/m-delivery/base-data/fb/index.vue'], resolve)
const PageDeliveryMeasure = resolve => require(['src/views/m-delivery/measure/measure-list.vue'], resolve)
const PageDeliveryMeasureDetail = resolve => require(['src/views/m-delivery/measure/measure-detail.vue'], resolve)


//工费项词典
const DictionaryIndex = resolve => require(['src/views/m-delivery/base-data/dictionary/index.vue'], resolve)
//工费项定额
const QuotaIndex = resolve => require(['src/views/m-delivery/base-data/quota/index.vue'], resolve)

//配送计划
const DeliveryPlan = resolve => require(['src/views/m-delivery/project-execution/deliver-plan/deliverInstallPlan-list.vue'], resolve)
const MasterReported = resolve => require(['src/views/m-delivery/project-execution/deliver-plan/master-reported.vue'], resolve)
const DeliveryPlanDetail = resolve => require(['src/views/m-delivery/project-execution/deliver-plan/deliverInstallPlan-detail.vue'], resolve)

//发包核算
const ContractBillList = resolve => require(['src/views/m-delivery/sub-account/contractBill-list.vue'], resolve)
const ContractBillDetail = resolve => require(['src/views/m-delivery/sub-account/contractBill-detail.vue'], resolve)


//节点变更记录
const PageProjectNodeModifyQuery = resolve => require(['src/views/m-delivery/project-plan/projectNodeModifyRecord-list.vue'], resolve)
//节点-项目状态管理
const NodeProjectList = resolve => require(['src/views/m-delivery/base-data/pro-status/index.vue'], resolve)

//客服配置 暂时不上线
const PageCustomerOrderConfig = resolve => require(['src/views/m-delivery/page-customer-service-config/page-order-config.vue'], resolve)
const PageCustomerAssignConfig = resolve => require(['src/views/m-delivery/page-customer-service-config/page-assign-config.vue'], resolve)
const PageComplaintsManageList = resolve => require(['src/views/m-delivery/page-complaints-config/page-manage-config.vue'], resolve)
const PageComplaintsManageDetail = resolve => require(['src/views/m-delivery/page-complaints-config/manage-detail.vue'], resolve)
const PageComplaintsObjectConfig = resolve => require(['src/views/m-delivery/page-complaints-config/page-object-config.vue'], resolve)
const PageComplaintsUpgradeConfig = resolve => require(['src/views/m-delivery/page-complaints-config/page-upgrade-config.vue'], resolve)
const PageComplaintsOrderDetail = resolve => require(['src/views/m-delivery/complaints-order/complaintsOrder-detail'], resolve)
const PageComplaintsOrderList = resolve => require(['src/views/m-delivery/complaints-order/complaintsOrder-list'], resolve)


//项目结算配置
const ProjectSettleSettingIndex = resolve => require(['src/views/m-delivery/project-settle/setting/index.vue'], resolve)
const ProjectSettleSettingDetail = resolve => require(['src/views/m-delivery/project-settle/setting/detail.vue'], resolve)
const InstallQuotaIndex = resolve => require(['src/views/m-delivery/install-settle/setting/index.vue'], resolve)

//项目结算单
const ProjectSettleRecordIndex = resolve => require(['src/views/m-delivery/project-settle/record/index.vue'], resolve)
const ProjectSettleRecordDetail = resolve => require(['src/views/m-delivery/project-settle/record/detail.vue'], resolve)
const ProjectSettleRecordVerify = resolve => require(['src/views/m-delivery/project-settle/record/verify.vue'], resolve)
const ProjectSettleRecordFlow = resolve => require(['src/views/m-delivery/project-settle/record/flow.vue'], resolve)
const ProjectSettleRecordInstallIndex = resolve => require(['src/views/m-delivery/install-settle/record/index.vue'], resolve)
const ProjectSettleRecordInstallDetail = resolve => require(['src/views/m-delivery/install-settle/record/detail.vue'], resolve)
const ProjectSettleRecordInstallVerify = resolve => require(['src/views/m-delivery/install-settle/record/verify.vue'], resolve)
//门店项目列表
const ProjectList = resolve => require(['src/views/m-delivery/project/index.vue'], resolve)
const ProjectManageList = resolve => require(['src/views/m-delivery/project/manage.vue'], resolve)
const ProjectDetail1 = resolve => require(['src/views/m-delivery/project/detail.vue'], resolve)

//要货批次配置
const GoodsDemandSetting = resolve => require(['src/views/m-delivery/goods-demand/setting.vue'], resolve)

const routes = [
    //交付
    {
        path: '/tuchat-delivery',
        component: Console,
        children: [
            { path: 'bills-entry', meta: { isFulldialog: false, title: '单据条目管理' }, component: BillsEntry },
            { path: 'yanshou-bill', meta: { isFulldialog: false, title: '质检验收' }, component: YanShouBill },
            { path: 'yanshou-detail', meta: { isFulldialog: true, title: '质检验收' }, component: YanShouDetail },
            { path: 'yanshou-view', meta: { isFulldialog: true, title: '质检验收' }, component: YanShouView },
            { path: 'yanshou-project-detail', meta: { isFulldialog: true, title: '质检验收' }, component: YanshouProjectDetail },
            { path: 'lockout-bill', meta: { isFulldialog: false, title: '停工单' }, component: LockoutBill },
            { path: 'lockout-detail', meta: { isFulldialog: true, title: '停工单' }, component: LockoutDetail },
            { path: 'lockout-verify', meta: { isFulldialog: true, title: '审核停工单' }, component: LockoutVerify },
            { path: 'delay-bill', meta: { isFulldialog: false, title: '延期单' }, component: DelayBill },
            { path: 'delay-detail', meta: { isFulldialog: true, title: '延期单' }, component: DelayDetail },
            { path: 'delay-verify', meta: { isFulldialog: true, title: '审核延期单' }, component: DelayVerify },
            { path: 'base-setting/accounts-index', meta: { isFulldialog: false, title: '核算发包配置' }, component: AccountsIndex },
            { path: 'base-setting/accounts-detail', meta: { isFulldialog: true, title: '核算发包配置' }, component: AccountsDetail },
            { path: 'base-setting/shut-config', meta: { isFulldialog: false, title: '停工校验配置' }, component: ShutConfigIndex },
            { path: 'base-data/fb-index', meta: { isFulldialog: false, title: '发包单价' }, component: FbIndex },
            { path: 'measure-list', meta: { isFulldialog: false, title: '主材测量单' }, component: PageDeliveryMeasure },
            { path: 'measure-view', meta: { isFulldialog: true, title: '主材测量单' }, component: PageDeliveryMeasureDetail },
            { path: 'measure-edit', meta: { isFulldialog: true, title: '主材测量单' }, component: PageDeliveryMeasureDetail },
            { path: 'measure-approval', meta: { isFulldialog: true, title: '主材测量单' }, component: PageDeliveryMeasureDetail },
            { path: 'base-data/dictionary-index', meta: { isFulldialog: false, title: '工费项词典' }, component: DictionaryIndex },
            { path: 'base-data/quota-index', meta: { isFulldialog: false, title: '工费项定额' }, component: QuotaIndex },
            { path: 'sub-account/contractBill-list', meta: { isFulldialog: false, title: '核算发包' }, component: ContractBillList },
            { path: 'sub-account/contractBill-detail', meta: { isFulldialog: true, title: '核算发包' }, component: ContractBillDetail },
            { path: 'distribution-plan', meta: { isFulldialog: false, title: '配送调度列表' }, component: DeliveryPlan },
            { path: 'distribution-plan/detail', meta: { isFulldialog: true, title: '配送调度详情' }, component: DeliveryPlanDetail },
            { path: 'distribution-plan/master-reported', meta: { isFulldialog: true, title: '配送调度工长报备' }, component: MasterReported },
            { path: 'customer-order-config', meta: { isFulldialog: false, title: '客服接单配置' }, component: PageCustomerOrderConfig },   //暂时不上线
            { path: 'customer-assign-config', meta: { isFulldialog: false, title: '客服分配配置' }, component: PageCustomerAssignConfig },
            { path: 'complaints-object-config', meta: { isFulldialog: false, title: '投诉对象配置' }, component: PageComplaintsObjectConfig },
            { path: 'complaints-upgrade-config', meta: { isFulldialog: false, title: '投诉升级配置' }, component: PageComplaintsUpgradeConfig },
            { path: 'complaints-manage-config', meta: { isFulldialog: false, title: '投诉管理配置' }, component: PageComplaintsManageList },
            { path: 'complaints-manage-config-detail', meta: { isFulldialog: true, title: '投诉管理配置' }, component: PageComplaintsManageDetail },
            { path: 'complaints-order-list', meta: { isFulldialog: false, title: '投诉管理' }, component: PageComplaintsOrderList },
            { path: 'complaints-order-detail', meta: { isFulldialog: true, title: '投诉单' }, component: PageComplaintsOrderDetail },
            { path: 'settle-setting/index', meta: { isFulldialog: false, title: '结算规则配置' }, component: ProjectSettleSettingIndex },
            { path: 'settle-setting/detail', meta: { isFulldialog: true, title: '结算规则配置' }, component: ProjectSettleSettingDetail },
            { path: 'settle-setting/install-quata-config', meta: { isFulldialog: false, title: '安装定额配置' }, component: InstallQuotaIndex },
            { path: 'settle-record/index', meta: { isFulldialog: false, title: '项目经理结算' }, component: ProjectSettleRecordIndex },
            { path: 'settle-record/install-list', meta: { isFulldialog: false, title: '安装结算' }, component: ProjectSettleRecordInstallIndex },
            { path: 'settle-record/install-detail', meta: { isFulldialog: true, title: '安装结算' }, component: ProjectSettleRecordInstallDetail },
            { path: 'settle-record/install-verify', meta: { isFulldialog: true, title: '安装结算' }, component: ProjectSettleRecordInstallVerify },
            { path: 'settle-record/detail', meta: { isFulldialog: true, title: '项目经理结算' }, component: ProjectSettleRecordDetail },
            { path: 'settle-record/verify', meta: { isFulldialog: true, title: '项目经理结算' }, component: ProjectSettleRecordVerify },
            { path: 'settle-record/flow', meta: { isFulldialog: true, title: '项目经理结算' }, component: ProjectSettleRecordFlow },
            { path: 'project/index', meta: { isFulldialog: false, title: '全部项目' }, component: ProjectList },
            { path: 'project/manage', meta: { isFulldialog: false, title: '销售项目管理' }, component: ProjectManageList },
            { path: 'project/detail', meta: { isFulldialog: true, title: '项目详情' }, component: ProjectDetail1 },
            { path: 'demand-setting', meta: { isFulldialog: false, title: '要货批次配置' }, component: GoodsDemandSetting },
        ]
    }
]


export default routes
