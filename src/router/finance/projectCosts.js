//引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const ProjectCosts = resolve => require(['src/views/m-finance/page-projectcosts-main/projectCosts-list.vue'], resolve)
const ProjectCostsDetails = resolve => require(['src/views/m-finance/page-projectcosts-main/projectCosts-detail.vue'], resolve)



const routes = [{
    path: '/finance',
    component: Console,
    children: [
        { path: 'projectCosts', meta: { isFulldialog: false, title: '成本核算主页面'}, component: ProjectCosts },
        { path: 'projectCosts-detail', meta: { isFulldialog: true, title: '项目成本明细'}, component: ProjectCostsDetails }
    ]
}]

export default routes
