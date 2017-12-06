import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {

    queryPage(args) {
        return axios({
            method: Service.FINA_PAY_METHOD_DISTRIBUTION.methods.QUERY_PAGE,
            service: Service.FINA_PAY_METHOD_DISTRIBUTION.name,
            args: args
        })
    },
    findByIdNames(args){
        return axios({
            method: Service.FINA_PAY_METHOD_DISTRIBUTION.methods.FIND_BY_ID_NAMES,
            service: Service.FINA_PAY_METHOD_DISTRIBUTION.name,
            args: args
        })
    },
    create(args) {
        return axios({
            method: Service.FINA_PAY_METHOD_DISTRIBUTION.methods.CREATE,
            service: Service.FINA_PAY_METHOD_DISTRIBUTION.name,
            args: args
        })
    },
    update(args) {
         return axios({
             method: Service.FINA_PAY_METHOD_DISTRIBUTION.methods.UPDATE,
             service: Service.FINA_PAY_METHOD_DISTRIBUTION.name,
            args: args
        })
    },
    updateStatus(args) {
        return axios({
            method: Service.FINA_PAY_METHOD_DISTRIBUTION.methods.CHANGE_STATUS,
            service: Service.FINA_PAY_METHOD_DISTRIBUTION.name,
            args: args
        })
    },
    updateStatusBatch(args) {
        return axios({
            method: Service.FINA_PAY_METHOD_DISTRIBUTION.methods.CHANGE_STATUS_BATCH,
            service: Service.FINA_PAY_METHOD_DISTRIBUTION.name,
            args: args
        })
    },
    query(args) {
        return axios({
            method: Service.FINA_PAY_METHOD_DISTRIBUTION.methods.QUERY,
            service: Service.FINA_PAY_METHOD_DISTRIBUTION.name,
            args: args
        })
    },
    //获取符合条件的分配
    getAllOptionals(args) {
        return axios({
            method: 'GiNbah0nSeKdBiedY_GSYfHvE-mCvFvahVXKFiXcEClAsRYBvPc5SXo4v-vP_5WOTbb',
            service: 'VmHS1srPCZUThqolu6uXm3c_R-lSOfL',
            args: args
        })
    }
}
