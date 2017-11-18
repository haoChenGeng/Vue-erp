// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

// 银行主数据
const PagePreventRepeat = resolve => require(['src/views/m-system/page-preventRepeat/page-prevent-repeat.vue'], resolve)

const routes = [{
    path: '/system',
    component: Console,
    children: [
        { path: 'page-prevent-repeat', meta: { isFulldialog: false,title: '业务防重复配置' }, component: PagePreventRepeat }
    ]
}]

export default routes
