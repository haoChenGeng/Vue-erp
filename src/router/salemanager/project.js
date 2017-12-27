/**
 * Created by tony.huang on 2017/12/7.
 */
const Console = resolve => require(['src/views/console/console.vue'], resolve);
const projectList = resolve => require(['src/views/m-salemanager/project-info/page-project-list.vue'], resolve)
const projectDetail = resolve => require(['src/views/m-salemanager/project-info/page-project-detail.vue'], resolve)
const routes = [
    {
        path: '/tuchat-sale-manage',
        component: Console,
        children: [
            { path: 'page-project-list', meta: { isFulldialog: false, title: '项目查询' }, component: projectList },
            { path: 'page-project-detail', meta: { isFulldialog: true, title: '项目详情' }, component: projectDetail },
        ]
    }
];

export default routes

