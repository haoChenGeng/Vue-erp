import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    queryRemit(args) {
        return axios({
            method: Service.PAYREMIT.methods.REMIT_ORDER_SERVICE_FINDBYID,
            service: Service.PAYREMIT.name,
            args: args
        })
    },
    checkRepeat(args) {
        return axios({
            method: Service.PAYREMIT.methods.REMIT_ORDER_SERVICE_CHECKREPEAT,
            service: Service.PAYREMIT.name,
            args: args
        })
    },
    checkCount(args){
        return axios({
            method: Service.PAYREMIT.methods.REMIT_ORDER_SERVICE_COUNT,
            service: Service.PAYREMIT.name,
            args: args
        })
    },
    remitFLow(args){
        return axios({
            method: Service.PAYREMIT.methods.REMIT_ORDER_SERVICE_BATCH_DISTRIBUTE_FOR_WKF,
            service: Service.PAYREMIT.name,
            args: args
        })
    },
    remitSubmit(args){
        return axios({
            method: Service.PAYREMIT.methods.REMIT_ORDER_SERVICE_SUBMIT_FOR_WKF,
            service: Service.PAYREMIT.name,
            args: args
        })
    },
    getLogs(args){
        return axios({
            method: Service.LOG_SERVICE.methods.QUERY_PAGE,
            service: Service.LOG_SERVICE.name,
            args: args
        })
    },
    sendToCloud(args){
        return axios({
            method: Service.PAYREMIT.methods.REMIT_ORDER_SERVICE_SEND_TO_CLOUD,
            service: Service.PAYREMIT.name,
            args: args
        })
    }
}
