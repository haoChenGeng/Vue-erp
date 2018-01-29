// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const WorkBench = resolve => require(['src/views/workbench/workbench.vue'], resolve);

const routes = [
    // 可视化图表
    {
        path: '/tuchat-index',
        component: Console,
        children: [
            { path: '', meta: { isFulldialog: false, auth: false, title: '我的工作台' }, component: WorkBench }
        ]
    }
]

export default routes
