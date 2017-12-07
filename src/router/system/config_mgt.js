// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

const eventManagement = resolve => require(['src/views/m-system/page-config-manager/page-evt-mgt.vue'], resolve)
const actionManagement = resolve => require(['src/views/m-system/page-config-manager/page-action-mgt.vue'], resolve)
const constantManagement = resolve => require(['src/views/m-system/page-config-manager/page-constant-mgt.vue'], resolve)
const variableManagement = resolve => require(['src/views/m-system/page-config-manager/page-variable-mgt.vue'], resolve)
    // 公式管理
const formulaManagement = resolve => require(['src/views/m-system/page-config-manager/page-formula-mgt.vue'], resolve)
const formulaManagementDialog = resolve => require(['src/views/m-system/page-config-manager/page-formula-mgt-dialog.vue'], resolve)

const conditionManagement = resolve => require(['src/views/m-system/page-config-manager/page-condition-mgt.vue'], resolve)

const routes = [
    // 配置管理
    {
        path: '/tuchat-system',
        component: Console,
        children: [
            { path: 'event-management', meta: { isFulldialog: false, title: '事件管理' }, component: eventManagement },
            { path: 'action-management', meta: { isFulldialog: false, title: '动作管理' }, component: actionManagement },
            { path: 'constant-management', meta: { isFulldialog: false, title: '常量管理' }, component: constantManagement },
            { path: 'variable-management', meta: { isFulldialog: false, title: '变量管理' }, component: variableManagement },
            { path: 'formula-management', meta: { isFulldialog: false, title: '公式管理' }, component: formulaManagement },
            { path: 'formula-management-dialog', meta: { isFulldialog: true, title: '公式管理' }, component: formulaManagementDialog },
            { path: 'condition-management', meta: { isFulldialog: false, title: '条件管理' }, component: conditionManagement }
        ]
    }
]

export default routes
