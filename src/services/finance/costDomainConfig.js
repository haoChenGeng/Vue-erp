import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    query(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.costDomainConfigConfigQuery,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    queryPage(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.costDomainConfigQueryPage,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    findById(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.costDomainConfigConfigfindById,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    create(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.costDomainConfigCeate,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    update(args) {
         return axios({
             method: Service.INVENTORY_ACCOUNTING.methods.costDomainConfigUpdate,
             service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    }
}
