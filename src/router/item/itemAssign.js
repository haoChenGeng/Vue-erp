// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
    // 项目经理派单配置模块
const pagePricipalSetting = resolve => require(['src/views/m-item-assign/assign-setting/page-principal-setting/principalSetting-list.vue'], resolve)
    // 项目经理派单配置模块
const pageSynthesisGradeSetting = resolve => require(['src/views/m-item-assign/assign-setting/page-synthesis-grade/page-synthesis-grade-list.vue'], resolve)
const pageSynthesisGradeDialog = resolve => require(['src/views/m-item-assign/assign-setting/page-synthesis-grade/synthesis-grade-dialog.vue'], resolve)


// 项目派单列表页
const listPageAssignPrincipal = resolve => require(['src/views/m-item-assign/page-assign-principal/assign-principal-list.vue'], resolve)
    // 分派交付经理页面
const pageAssignPrincipalDelivery = resolve => require(['src/views/m-item-assign/page-assign-principal/dialog-assign-delivery.vue'], resolve)
    // 分派工程管家页面
const pageAssignPrincipalProject = resolve => require(['src/views/m-item-assign/page-assign-principal/dialog-assign-project.vue'], resolve)
    // 分派项目经理页面
const pageAssignPrincipalItem = resolve => require(['src/views/m-item-assign/page-assign-principal/dialog-assign-item.vue'], resolve)
// 分派售后客服页面
const pageAssignPrincipalCustomerService = resolve => require(['src/views/m-item-assign/page-assign-principal/dialog-assign-customer-service.vue'], resolve)
// 派单记录列表页
const pageAssignPrincipalRecord = resolve => require(['src/views/m-item-assign/page-assign-principal-record/assign-principal-record-list.vue'], resolve)


const routes = [{
    path: '/itemAssign',
    component: Console,
    children: [
        // 项目经理派单模块
        { path: 'page-principal-set', meta: { isFulldialog: false, title: '项目经理接单配置' }, component: pagePricipalSetting },

        // 综合评分配置
        { path: 'page-synthesis-grade-set', meta: { isFulldialog: false, title: '综合评分配置' }, component: pageSynthesisGradeSetting },
        { path: 'page-synthesis-grade-set/view', meta: { isFulldialog: true, title: '综合评分配置-详情' }, component: pageSynthesisGradeDialog },
        { path: 'page-synthesis-grade-set/create', meta: { isFulldialog: true, title: '综合评分配置-创建' }, component: pageSynthesisGradeDialog },
        { path: 'page-synthesis-grade-set/edit', meta: { isFulldialog: true, title: '综合评分配置-编辑' }, component: pageSynthesisGradeDialog },

        // 项目派单列表
        { path: 'assign-principal-list', meta: { isFulldialog: false, title: '工程派单列表页' }, component: listPageAssignPrincipal },
        // 派单页面-交付经理
        { path: 'assign-principal-delivery-page', meta: { isFulldialog: true, title: '交付经理派单' }, component: pageAssignPrincipalDelivery },
        // 派单页面-工程管家
        { path: 'assign-principal-project-page', meta: { isFulldialog: true, title: '工程管家派单' }, component: pageAssignPrincipalProject },
        // 派单页面-项目经理
        { path: 'assign-principal-item-page', meta: { isFulldialog: true, title: '项目经理派单' }, component: pageAssignPrincipalItem },

        { path: 'assign-principal-customer-service-page', meta: { isFulldialog: true, title: '售后客服派单' }, component: pageAssignPrincipalCustomerService },

        // 项目派工记录列表
        { path: 'assign-record-page', meta: { isFulldialog: false, title: '项目派工记录' }, component: pageAssignPrincipalRecord }


    ]
}]
export default routes
