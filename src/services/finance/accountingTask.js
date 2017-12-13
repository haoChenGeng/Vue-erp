import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    query(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.accountingTaskQuery,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    startWkf(args){
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.startWkf,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    executeWkf(args){
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.executeWkf,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    }
}
