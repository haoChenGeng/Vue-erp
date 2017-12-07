// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
//选品维度
const CategorySearchTemplateBase = resolve => require(['src/views/m-worker/quote/m-categorysearch/category-search/show.vue'], resolve)

const routes = [
    //
    {
        path: '/tuchat-categorysearch',
        component: Console,
        children: [
            { path: 'showlist', meta: { title: '选品维度',isFulldialog:false }, component: CategorySearchTemplateBase},
        ]
    }
]

export default routes
