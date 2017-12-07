// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
//空间配置
const SpaceConfigTemplateBase = resolve => require(['src/views/m-worker/quote/m-spaceconfig/space-config/show.vue'], resolve)


const routes = [
    //交付
    {
        path: '/tuchat-spaceconfig',
        component: Console,
        children: [
            { path: 'showlist', meta: { title: '空间配置',isFulldialog:false }, component: SpaceConfigTemplateBase},
        ]
    }
]

export default routes
