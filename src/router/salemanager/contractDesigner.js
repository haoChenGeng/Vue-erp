/**
 * Created by tomy.li on 2017/12/4.
 * 设计师合同签约，包含：装修保合同创建等
 */
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const contractList = resolve => require(['src/views/m-salemanager/contract-designer/list.vue'], resolve)
const contractDetail = resolve => require(['src/views/m-salemanager/contract-designer/detail.vue'], resolve)
const routes = [
    {
        path: '/tuchat-sale-manage',
        component: Console,
        children: [
            {path: 'contract-designer-list', component: contractList, meta: {isFulldialog:false, title: '设计师签约'}},
            {path: 'contract-designer-detail', component: contractDetail, meta: {isFulldialog:true, title: '合同详情'}}
        ]
    }
]

export default routes

