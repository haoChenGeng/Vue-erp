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



//节点变更记录
const PageProjectNodeModifyQuery = resolve => require(['src/views/m-delivery/project-plan/projectNodeModifyRecord-list.vue'], resolve)
//节点-项目状态管理
const NodeProjectList = resolve => require(['src/views/m-delivery/base-data/pro-status/index.vue'], resolve)


//城市排期模板关系配置
const CityScheduleList = resolve => require(['src/views/m-delivery/city-schedule/schedule-config.vue'], resolve)

const routes = [
    //交付
    {
        path: '/tuchat-delivery',
        component: Console,
        children: [
            { path: 'template-base', meta: { isFulldialog: false, title: '排期模板维护' }, component: PageDeliveryTemplateBase },
            { path: 'template-detail', meta: { isFulldialog: true, title: '排期模板维护' }, component: PageDeliveryTemplateDetail },
            { path: 'node-attribute', meta: { isFulldialog: true, title: '排期模板维护' }, component: PageDeliveryNodeAttribute },
            { path: 'template-ref', meta: { isFulldialog: true, title: '查看排期模板引用' }, component: PageDeliveryTemplateRef },
            { path: 'project-list', meta: { isFulldialog: false, title: '项目进度管理' }, component: PageDeliveryProjectList },
            { path: 'project-detail', meta: { isFulldialog: true, title: '项目进度管理' }, component: ProjectDetail },
            { path: 'project-report', meta: { isFulldialog: false, title: '交付监控报表' }, component: ProjectReport },
            { path: 'project-query', meta: { isFulldialog: false, title: '项目综合查询' }, component: PageDeliveryProjectQuery },
            { path: 'project-show', meta: { isFulldialog: true, title: '项目综合查询' }, component: PageDeliveryProjectShow },
            { path: 'node-modify-query', meta: { isFulldialog: false, title: '节点变更查询' }, component: PageProjectNodeModifyQuery },
            { path: 'node-project-status-list', meta: { isFulldialog: false, title: '项目状态管理' }, component: NodeProjectList },
            { path: 'city-schedule-relation', meta: { isFulldialog: false, title: '城市排期模板配置' }, component: CityScheduleList }

        ]
    }
]


export default routes
