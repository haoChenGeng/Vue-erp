/**
 * Created by tomy.li on 2017/5/9.
 */
import packtemp from './packtemp.js'
import quoteconfig from './quoteconfig.js'
import spaceconfig from './spaceconfig.js'
import productpackage from './productpackage.js'
import categorysearch from './categorysearch.js'
import apartmentspace from './apartmentspace.js'
import quoteorder from './quoteorder.js'
import projectlist from './projectlist.js'
import signManage from './signManage.js'
import quoteChangeOrder from 'src/router/worker/quoteChangeOrder.js'

let routes = [].concat(
    packtemp,
    quoteconfig,
    spaceconfig,
    productpackage,
    categorysearch,
    apartmentspace,
    quoteorder,
    projectlist,
    signManage,
    quoteChangeOrder
)

export default routes
