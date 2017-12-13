import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    queryMS(args) {
        return axios({
            method: Service.FINA_BILLS.methods.QUERY,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    queryM(args) {
        return axios({
            method: Service.FINA_BILLS.methods.ORDER_QUERY,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    queryS(args) {
        return axios({
            method: Service.FINA_BILLS.methods.ITEM_QUERY,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    createS(args) {
        return axios({
            method: Service.FINA_BILLS.methods.CREATE,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    updateMS(args) {
        return axios({
            method: Service.FINA_BILLS.methods.UPDATE,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    verifyQueryS(args) {
        return axios({
            method: Service.VERIFYCANCELRECORD.methods.VERIFYORDERQUERYITEM,
            service: Service.VERIFYCANCELRECORD.name,
            args: args
        })
    },
    receiptOrder(args) {
        return axios({
            method: Service.FINA_BILLS.methods.RECEIPT_ORDER_QUERY,
            service: Service.FINA_BILLS.name,
            args: args
        })
    }
}
