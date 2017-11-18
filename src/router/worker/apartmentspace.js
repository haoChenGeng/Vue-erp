// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
//户型空间
const ApartmentSpaceTemplateBase = resolve => require(['src/views/m-worker/quote/m-apartmentspace/apartment-space/show.vue'], resolve)


const routes = [
    //
    {
        path: '/apartmentspace',
        component: Console,
        children: [
            { path: 'showlist', meta: { title: '户型空间',isFulldialog:false }, component: ApartmentSpaceTemplateBase},
        ]
    }
]

export default routes
