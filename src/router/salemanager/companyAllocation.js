const Console = resolve => require(['src/views/console/console.vue'], resolve);
const companyAllocationList = resolve => require(['src/views/m-salemanager/company-allocation/company-allocation-list.vue'], resolve);
const companyAllocationDetail = resolve => require(['src/views/m-salemanager/company-allocation/company-allocation-detail.vue'], resolve);
const routes = [
    {
        path: '/tochat-sale-manage',
        component: Console,
        children: [
            {path: 'company-allocation-list', component: companyAllocationList, meta: {isFulldialog:false,title: '分单记录'}},
            {path: 'company-allocation-detail', component: companyAllocationDetail, meta: {isFulldialog:true,title: '分单记录详情'}},
        ]   }
];

export default routes
