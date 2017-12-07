// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
//销售管理--促销管理
const CashDiscount = resolve => require(['src/views/m-salemanager/promotion/cash-discount/cash-discount.vue'], resolve)
const CashDiscountAdd = resolve => require(['src/views/m-salemanager/promotion/cash-discount/cash-discount-add.vue'], resolve)
const CashDiscountEdit = resolve => require(['src/views/m-salemanager/promotion/cash-discount/cash-discount-edit.vue'], resolve)
const DiscountBills = resolve => require(['src/views/m-salemanager/promotion/discount-bills/discount-bills.vue'], resolve)
const DiscountBillsAdd = resolve => require(['src/views/m-salemanager/promotion/discount-bills/discount-bills-add.vue'], resolve)
const DiscountBillsEdit = resolve => require(['src/views/m-salemanager/promotion/discount-bills/discount-bills-edit.vue'], resolve)
const DiscountApproveBills = resolve => require(['src/views/m-salemanager/promotion/discount-approve-bills/discount-approve-bills.vue'], resolve)
const DiscountApproveBillsAdd = resolve => require(['src/views/m-salemanager/promotion/discount-approve-bills/discount-approve-bills-add.vue'], resolve)

const routes = [{
    path: '/tochat-salemanager',
    component: Console,
    children: [
        { path: 'cash-discount', meta: {isFulldialog:false, title: '现金优惠' }, component: CashDiscount},
        { path: 'cash-discount/add', meta: {isFulldialog:true, title: '现金优惠--新增' }, component: CashDiscountAdd},
        { path: 'cash-discount/edit', meta: {isFulldialog:true, title: '现金优惠--编辑' }, component:CashDiscountEdit},
        { path: 'discount-bills', meta: {isFulldialog:false, title: '优惠单' }, component: DiscountBills },
        { path: 'discount-bills/add', meta: {isFulldialog:true, title: '优惠单--新增' }, component:DiscountBillsAdd},
        { path: 'discount-bills/edit', meta: {isFulldialog:true, title: '优惠单--编辑' }, component:DiscountBillsEdit},
        { path: 'discount-approve-bills', meta: {isFulldialog:false, title: '优惠审批单' }, component:DiscountApproveBills },
        { path: 'discount-approve-bills/add', meta: {isFulldialog:true, title: '优惠审批单--新增' }, component:DiscountApproveBillsAdd},
        { path: 'discount-approve-bills/approve', meta: {isFulldialog:true, title: '优惠审批单--审批' }, component:DiscountApproveBillsAdd}]
}]

export default routes
