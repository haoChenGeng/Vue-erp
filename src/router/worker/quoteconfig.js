// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
//交付模块
const QuoteConfigTemplateBase = resolve => require(['src/views/m-worker/quote/m-quoteconfig/quoteconfig/show.vue'], resolve)
// const PageDeliveryTemplateDetail = resolve => require(['src/views/m-delivery/schedule-template/template-detail.vue'], resolve)
const QuoteConfigTemplateRef = resolve => require(['src/views/m-worker/quote/m-quoteconfig/quoteconfig/versionShow.vue'], resolve)
// const PageDeliveryNodeAttribute = resolve => require(['src/views/m-delivery/schedule-template/node-attribute.vue'], resolve)


const routes = [
    //交付
    {
        path: '/tuchat-quoteconfig',
        component: Console,
        children: [
            { path: 'showlist', meta: { title: '报价字典',isFulldialog:false }, component: QuoteConfigTemplateBase},
            { path: 'versionShow', meta: { title: '查看小计',isFulldialog:true }, component: QuoteConfigTemplateRef }
        ]
    }
]

export default routes
