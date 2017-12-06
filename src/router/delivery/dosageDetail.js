/**
 * Created by tomy.li on 2017/6/16.
 */
// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const dosageDetail = resolve => require(['src/views/m-delivery/dosageDetail/index.vue'], resolve)
//用量明细
const routes = [
    {
        path: '/delivery',
        component: Console,
        children: [
            { path: 'dosage-detail', meta: { isFulldialog:false, title: '项目用量明细' }, component: dosageDetail },
        ]
    }
]

export default routes
