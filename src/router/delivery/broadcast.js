// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const PageDurationList = resolve => require(['src/views/m-delivery/broadcast-duration/duration-list.vue'], resolve)
const PageDurationDetail = resolve => require(['src/views/m-delivery/broadcast-duration/duration-detail.vue'], resolve)


const PageRecordList = resolve => require(['src/views/m-delivery/broadcast-record/record-list.vue'], resolve)
const PageRecordDetail = resolve => require(['src/views/m-delivery/broadcast-record/record-detail.vue'], resolve)



const routes = [
    //工期配置
    {
        path: '/tochat-delivery',
        component: Console,
        children: [
            { path: 'page-duration-detail', meta: { isFulldialog:true,title: '查看工期' }, component:PageDurationDetail},
            { path: 'page-duration-list', meta: { isFulldialog:false,title: '工期配置' }, component: PageDurationList},
            { path: 'page-record-list', meta: { isFulldialog:false,title: '播报记录' }, component: PageRecordList},
            { path: 'page-record-detail', meta: { isFulldialog:true,title: '播报记录' }, component:PageRecordDetail},
        ]
    }
]


export default routes
