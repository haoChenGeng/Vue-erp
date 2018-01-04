// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const PageFaq = resolve => require(['src/views/m-helpcenter/page-faq/page-faq.vue'], resolve)
const PageFaqInfo = resolve => require(['src/views/m-helpcenter/page-faq/page-faq-info.vue'], resolve)

const routes = [{
    path: '/helpcenter',
    component: Console,
    children: [
        // 帮助页面
        { path: 'page-faq', meta: { isFulldialog: false, auth: false, title: '帮助' }, component: PageFaq },
        { path: 'page-faq/info', meta: { isFulldialog: true, auth: false, title: '帮助--详情' }, component: PageFaqInfo },
    ]
}]

export default routes
