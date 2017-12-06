import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    query(args) {
        return axios({
            method: Service.FINA_PAY_TYPE_CONFIG.methods.QUERY,
            service: Service.FINA_PAY_TYPE_CONFIG.name,
            args: args
        })
    },
    queryPage(args) {
        return axios({
            method: Service.FINA_PAY_TYPE_CONFIG.methods.QUERY_PAGE,
            service: Service.FINA_PAY_TYPE_CONFIG.name,
            args: args
        })
    },
    findByIdNames(args){
        return axios({
            method: Service.FINA_PAY_TYPE_CONFIG.methods.FIND_BY_ID_NAMES,
            service: Service.FINA_PAY_TYPE_CONFIG.name,
            args: args
        })
    },
    findById(args) {
        return axios({
            method: Service.FINA_PAY_TYPE_CONFIG.methods.FIND_BY_ID,
            service: Service.FINA_PAY_TYPE_CONFIG.name,
            args: args
        })
    },
    create(args) {
        return axios({
            method: Service.FINA_PAY_TYPE_CONFIG.methods.CREATE,
            service: Service.FINA_PAY_TYPE_CONFIG.name,
            args: args
        })
    },
    update(args) {
         return axios({
             method: Service.FINA_PAY_TYPE_CONFIG.methods.UPDATE,
             service: Service.FINA_PAY_TYPE_CONFIG.name,
            args: args
        })
    },
    updateStatus(args) {
        return axios({
            method: Service.FINA_PAY_TYPE_CONFIG.methods.CHANGE_STATUS,
            service: Service.FINA_PAY_TYPE_CONFIG.name,
            args: args
        })
    },
    updateStatusBatch(args) {
        return axios({
            method: Service.FINA_PAY_TYPE_CONFIG.methods.CHANGE_STATUS_BATCH,
            service: Service.FINA_PAY_TYPE_CONFIG.name,
            args: args
        })
    },
}
