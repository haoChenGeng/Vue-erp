// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
//产品包
const ProductPackageTemplateBase = resolve => require(['src/views/m-worker/quote/m-productpackage/product-package/show.vue'], resolve)

//const PageDeliveryTemplateRef = resolve => require(['src/views/m-worker/quote/m-productpackage/product-package/versionShow.vue'], resolve)


const routes = [
    //交付
    {
        path: '/tochat-productpackage',
        component: Console,
        children: [
            { path: 'showlist', meta: { title: '产品包',isFulldialog:false}, component: ProductPackageTemplateBase},
        ]
    }
]

export default routes
