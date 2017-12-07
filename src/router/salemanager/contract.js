/**
 * Created by tony.huang on 2017/8/7.
 */
const Console = resolve => require(['src/views/console/console.vue'], resolve);
const contractList = resolve => require(['src/views/m-salemanager/contract-verify/page-contract-list.vue'], resolve);
const contractDetail = resolve => require(['src/views/m-salemanager/contract-verify/page-contract-detail.vue'], resolve);
const routes = [
    {
        path: '/tuchat-sale-manage',
        component: Console,
        children: [
            {path: 'contract-list', component: contractList, meta: {isFulldialog:false, title: '合同审核'}},
            {path: 'contract-detail', component: contractDetail, meta: {isFulldialog:true, title: '合同审核'}},
        ]
    }
];

export default routes

