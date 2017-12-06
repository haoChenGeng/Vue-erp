// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
    //待办任务
const PageProcenterDel = resolve => require(['src/views/m-procenter/page-pro-del/page-pro-del.vue'], resolve)
    //已处理任务
const PageProcenterAlready = resolve => require(['src/views/m-procenter/page-pro-already/page-pro-already.vue'], resolve)
    //在办任务
const PageProcenterStarter = resolve => require(['src/views/m-procenter/page-pro-starter/page-pro-starter.vue'], resolve)
    //授权代理
const PageProcenterDevolution = resolve => require(['src/views/m-procenter/page-pro-devolution/page-pro-devolution.vue'], resolve)
const PageProcenterDevolutionCreate = resolve => require(['src/views/m-procenter/page-pro-devolution/page-pro-devolution-create.vue'], resolve)

//流程分类
const PageProcenterCategory = resolve => require(['src/views/m-procenter/page-pro-category/page-pro-category.vue'], resolve)
    // 流程管理
const WorkFlowManager = resolve => require(['src/views/m-procenter/page-manager/workflow-manager.vue'], resolve)
const InitWorkFlow = resolve => require(['src/views/m-procenter/page-manager/init-workflow.vue'], resolve)
const SeeWorkFlow = resolve => require(['src/views/m-procenter/page-manager/see-workflow.vue'], resolve)
const EditWorkFlow = resolve => require(['src/views/m-procenter/page-manager/edit-workflow.vue'], resolve)

// 版本管理
const VersionManager = resolve => require(['src/views/m-procenter/page-manager/version-manager.vue'], resolve)
const CreateVersion = resolve => require(['src/views/m-procenter/page-manager/create-bpm.vue'], resolve)
const EditVersion = resolve => require(['src/views/m-procenter/page-manager/edit-bpm.vue'], resolve)
const ViewVersion = resolve => require(['src/views/m-procenter/page-manager/see-bpm.vue'], resolve)

// 属性配置
const Attributes = resolve => require(['src/views/m-procenter/page-manager/workflow-attributes.vue'], resolve)

//测试页面
const PageProcenterTest = resolve => require(['src/views/m-procenter/page-pro-test/page-pro-test.vue'], resolve)
    //流程图页面
const PageProcDiagram = resolve => require(['src/views/m-procenter/page-pro-diagram/page-pro-diagram.vue'], resolve)



const routes = [
    //流程后台管理
    {
        path: '/procenter',
        component: Console,
        children: [
            { path: '', redirect: 'page-pro-del' },
            { path: 'page-pro-del', meta: { isFulldialog: false, title: '待办任务' }, component: PageProcenterDel },
            { path: 'page-pro-already', meta: { isFulldialog: false, title: '已办任务' }, component: PageProcenterAlready },
            { path: 'page-pro-starter', meta: { isFulldialog: false, title: '在办任务' }, component: PageProcenterStarter },
            { path: 'page-pro-devolution', meta: { isFulldialog: false, title: '授权代理' }, component: PageProcenterDevolution },
            { path: 'page-pro-category', meta: { isFulldialog: false, title: '流程分类' }, component: PageProcenterCategory },
            { path: 'page-pro-devolution/create', meta: { isFulldialog: true, title: '授权代理' }, component: PageProcenterDevolutionCreate },
            { path: 'workflow-manage', meta: { isFulldialog: false, title: '流程管理' }, component: WorkFlowManager },
            { path: 'create-workflow', meta: { isFulldialog: false, title: '创建流程' }, component: InitWorkFlow },
            { path: 'workflow/edit', name: 'edit-workflow', meta: { isFulldialog: false, title: '编辑流程' }, component: EditWorkFlow },
            { path: 'see-workflow', name: 'see-workflow', meta: { isFulldialog: false, title: '查看流程' }, component: SeeWorkFlow },

            { path: 'version-workflow', meta: { isFulldialog: false, title: '版本管理' }, component: VersionManager },
            { path: 'version-workflow/create', meta: { isFulldialog: false, title: '新建版本' }, component: CreateVersion },
            { path: 'version-workflow/edit', meta: { isFulldialog: false, title: '编辑版本' }, component: EditVersion },
            { path: 'version-workflow/see', meta: { isFulldialog: false, title: '查看版本' }, component: ViewVersion },
            { path: 'workflow-attribute', meta: { isFulldialog: false, title: '属性配置' }, component: Attributes },

            { path: 'page-pro-test', meta: { isFulldialog: false, title: '流程测试页' }, component: PageProcenterTest },
            { path: 'page-pro-diagram', meta: { isFulldialog: false, title: '流程图页' }, component: PageProcDiagram }
        ]
    }
]

export default routes
