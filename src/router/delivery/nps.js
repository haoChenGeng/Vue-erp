//客服nps
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const npsList = resolve => require(['src/views/m-delivery/nps/list.vue'], resolve)
const npsEdit = resolve => require(['src/views/m-delivery/nps/edit.vue'], resolve)
const npsView = resolve => require(['src/views/m-delivery/nps/edit.vue'], resolve)

const routes = [
    {
        path: '/tochat-delivery',
        component: Console,
        children: [
        	{ path: 'nps-list', meta: { isFulldialog:false, title: 'NPS评分' }, component: npsList },
            { path: 'nps-edit', meta: { isFulldialog: true, title: 'NPS评分' }, component: npsEdit },
            { path: 'nps-view', meta: { isFulldialog: true, title: 'NPS评分' }, component: npsView }
        ]
    }
]

export default routes