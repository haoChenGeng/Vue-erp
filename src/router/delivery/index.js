import delivery from './delivery.js'
import foremanworker from './foremanworker.js'
 //项目用量明细
import dosageDetail from './dosageDetail.js'
// 退款单
import refund from './refund.js'

//安装调度
import installation from './installation.js'

//客服播报
import broadcast from './broadcast.js'

// nps评分
import nps from './nps.js'

//附加费管理
import surcharge from './surcharge.js'

//验收
import check from './check.js'

//要货单
import goodsDemand from './goodsDemand.js'

import scheduleSystem from './scheduleSystem.js'

let routes = [].concat(
    delivery,
    foremanworker,
    dosageDetail,
    refund,
    installation,
    broadcast,
    nps,
    surcharge,
    check,
    goodsDemand,
    scheduleSystem
)

export default routes
