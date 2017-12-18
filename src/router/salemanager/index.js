/**
 * Created by lshc.lu on 2017/6/23.
 */
import salemanage from './salemanage.js'
import promotion from './promotion.js'
import companyAllocation from './companyAllocation.js'
import contract from './contract.js'
import contractDesigner from 'src/router/salemanager/contractDesigner.js'
import project from 'src/router/salemanager/project.js'

let routes = [].concat(
    salemanage,
    promotion,
    companyAllocation,
    contract,
    contractDesigner,
    project
)

export default routes
