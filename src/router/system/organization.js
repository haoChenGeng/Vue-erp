// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
    // 组织架构
const PageOrganization = resolve => require(['src/views/m-system/organization/index.vue'], resolve)

const menuTree = resolve => require(['src/views/m-system/page-permission-manager/page-menu-tree-drag.vue'], resolve)

const RoleBoundPosition = resolve => require(['src/views/m-system/page-role-manager/page-role-bound-position.vue'], resolve)

// 账号管理
const AccountManagement = resolve => require(['src/views/m-system/account-management/index.vue'], resolve)

const routes = [
    // 系统管理
    {
        path: '/console',
        component: Console,
        children: [
            { path: 'page-organization', meta: { isFulldialog: false, title: '组织机构' }, component: PageOrganization }
        ]
    }, {
        path: '/tochat-system',
        component: Console,
        children: [
            { path: 'organization', meta: { isFulldialog: false, title: '组织机构' }, component: PageOrganization },
            { path: 'menu-tree-drag', meta: { isFulldialog: false, title: '菜单调整' }, component: menuTree },
            { path: 'role-bound-position', meta: { isFulldialog: false, title: '角色绑定岗位' }, component: RoleBoundPosition },
            { path: 'account-management', meta: { isFulldialog: false, title: '账号管理' }, component: AccountManagement }
        ]
    }
]

export default routes
