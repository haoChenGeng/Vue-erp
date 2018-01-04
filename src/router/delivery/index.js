import delivery from './delivery.js'
// 退款单
import refund from './refund.js'

//安装调度
import installation from './installation.js'


//验收
import check from './check.js'

//要货单
import goodsDemand from './goodsDemand.js'

import scheduleSystem from './scheduleSystem.js'

let routes = [].concat(
    delivery,
    refund,
    installation,
    check,
    goodsDemand,
    scheduleSystem
)

export default routes
