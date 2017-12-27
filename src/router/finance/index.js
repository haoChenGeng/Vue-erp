import pay from './pay.js'
import bankBaseData from './bankBaseData.js'
import invoice from './invoice.js'
import projectCosts from './projectCosts.js'
import deposit from './deposit'
import k3Map from './k3Map.js'

import payableCheck from './payableCheck.js'
import virtualCard from './virtualCard.js'
import inventoryAccounting from './inventoryAccounting.js'
import financialVoucher from './financialVoucher.js'
import baseAccount from './baseAccount.js'
import refundManage from './refundManage.js'


let routes = [].concat(
    pay,
    bankBaseData,
    invoice,
    projectCosts,
    deposit,
    k3Map,
    payableCheck,
    virtualCard,
    inventoryAccounting,
    financialVoucher,
    baseAccount,
    refundManage
)

export default routes
