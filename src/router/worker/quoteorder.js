/**
 * Created by tomy.li on 2017/6/1.
 */
// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

const quoteOrderDetail = resolve => require(['src/views/m-worker/quote/m-quoteorder/detail2.vue'], resolve)
const projectList = resolve => require(['src/views/m-worker/quote/m-projectlist/project-list/index.vue'], resolve)
const quoteOrderPreview = resolve => require(['src/views/m-worker/quote/m-quoteorder/preview.vue'], resolve)
const projectSelectQuoteTemp = resolve => require(['src/views/m-worker/quote/m-projectlist/project-list/selectQuoteTemp.vue'], resolve)
const selectionList = resolve => require(['src/views/m-worker/quote/m-quoteorder/selectionList.vue'], resolve)

const routes = [
    {
        path: '/tuchat-worker',
        component: Console,
        children: [
            { path: 'quote-project-list', meta: { title: '选材报价',isFulldialog:false }, component: projectList},
            { path: 'quote-order-detail', meta: { title: '报价单',isFulldialog:true }, component: quoteOrderDetail},
            { path: 'quote-order-preview', meta: { title: '报价单预览',isFulldialog:true }, component: quoteOrderPreview},
            { path: 'quote-project-selectTemp', meta: { title: '选择报价模板',isFulldialog:true }, component: projectSelectQuoteTemp},
            { path: 'quote-order-selectionList', meta: { title: '选品单',isFulldialog:true }, component: selectionList},
        ]
    }
]

export default routes
