// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
//项目列表
const ProjectListTemplateBase = resolve => require(['src/views/m-worker/quote/m-projectlist/project-list/show.vue'], resolve)
const PreviewTemplateBase = resolve => require(['src/views/m-worker/quote/m-projectlist/project-list/preview.vue'], resolve)


const routes = [
    //项目列表
    {
        path: '/projectlist',
        component: Console,
        children: [
            { path: 'showlist', meta: { title: '项目列表',isFulldialog:false }, component: ProjectListTemplateBase},
            { path: 'preview', meta: { title: '预览列表',isFulldialog:true }, component: PreviewTemplateBase},

        ]
    }
]

export default routes
