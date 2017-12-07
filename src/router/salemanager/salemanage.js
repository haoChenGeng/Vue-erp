/**
 * Created by lshc.lu on 2017/6/23.
 */
const Console = resolve => require(['src/views/console/console.vue'], resolve);
const potentialOwnerList = resolve => require(['src/views/m-salemanager/owner/page-potential-owner-list.vue'], resolve);
const potentialOwnerView = resolve => require(['src/views/m-salemanager/owner/page-potential-owner-detail-view.vue'], resolve);
const potentialOwnerEdit = resolve => require(['src/views/m-salemanager/owner/page-potential-owner-detail-edit.vue'], resolve);
const intentinOwnerList = resolve => require(['src/views/m-salemanager/owner/page-intention-owner-list.vue'], resolve);
const intentinOwnerView = resolve => require(['src/views/m-salemanager/owner/page-intention-owner-detail.vue'], resolve);
const standingBook = resolve => require(['src/views/m-salemanager/standing-book/page-standing-book.vue'], resolve);
const routes = [
    {
        path: '/tochat-sale-manage',
        component: Console,
        children: [
            {path: 'page-potential-owner-list', component: potentialOwnerList, meta: {isFulldialog:false, title: '潜在业主管理'}},
            {path: 'page-potential-owner-list/view', component: potentialOwnerView, meta: {isFulldialog:true, title: '潜在业主项目详情'}},
            {path: 'page-potential-owner-list/edit', component: potentialOwnerEdit, meta: {isFulldialog:true, title: '潜在业主项目详情'}},
            {path: 'page-intention-owner-list', component: intentinOwnerList, meta: {isFulldialog:false, title: '意向业主管理'}},
            {path: 'page-intention-owner-list/view', component: intentinOwnerView, meta: {isFulldialog:true, title: '意向业主项目详情'}},
            {path: 'page-standing-book', component: standingBook, meta: {isFulldialog:false, title: '业主跟进记录'}}
        ]
    }
];

export default routes
