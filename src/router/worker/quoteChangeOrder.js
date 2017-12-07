/**
 * 报价变更单
 * Created by tomy.li on 2017/9/11.
 */
// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const detail = resolve => require(['src/views/m-worker/quote/quoteChangeOrder/detail.vue'], resolve)
const list = resolve => require(['src/views/m-worker/quote/quoteChangeOrder/list.vue'], resolve)
const routes = [
    {
        path: '/tochat-worker',
        component: Console,
        children: [
            {
                path:'quote-changeorder-detail',
                meta:{title:'报价变更单详情',isFulldialog:true},
                component: detail
            },
            {
                path:'quote-changeorder-list',
                meta:{title:'报价变更单',isFulldialog:false},
                component: list
            }
        ]
    }
]

export default routes
