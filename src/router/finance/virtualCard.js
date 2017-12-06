// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)

// 收款单与配置合在一起
const PageVitualCardConfig = resolve => require(['src/views/m-finance/page-virtual-card-config/virtual-card-config.vue'], resolve)
const PageVirtualCard = resolve => require(['src/views/m-finance/page-virtual-card/virtual-card.vue'], resolve)
const PageVirtualCardBind = resolve => require(['src/views/m-finance/page-virtual-card-bind/virtual-card-bind.vue'], resolve)
const PageVirtualCardRmit = resolve => require(['src/views/m-finance/page-virtual-card-remit/virtual-card-remit.vue'], resolve)
const VirtualCardConfigCreate = resolve => require(['src/views/m-finance/page-virtual-card-config/card-config-dialog.vue'], resolve)

const routes = [{
    path: '/finance',
    component: Console,
    children: [
        { path: 'page-virtual-card-config', meta: { isFulldialog: false, title: '银行虚拟卡配置' }, component: PageVitualCardConfig },
        { path: 'page-virtual-card-config/create', meta: { isFulldialog: true, title: '新增银行虚拟卡配置' }, component: VirtualCardConfigCreate },
        { path: 'page-virtual-card-config/edit', meta: { isFulldialog: true, title: '修改银行虚拟卡配置' }, component: VirtualCardConfigCreate },
        { path: 'page-virtual-card', meta: { isFulldialog: false, title: '银行虚拟卡管理' }, component: PageVirtualCard },
        { path: 'page-virtual-card-bind', meta: { isFulldialog: false, title: '银行虚拟卡绑定查询' }, component: PageVirtualCardBind },
        { path: 'page-virtual-card-remit', meta: { isFulldialog: false, title: '银行虚拟卡汇款记录' }, component: PageVirtualCardRmit }
    ]
}]

export default routes
/**
 * Created by word.huo on 2017/5/12.
 */
