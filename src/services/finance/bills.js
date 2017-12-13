import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    query(args) {
        return axios({
            method: Service.FINA_BILLS.methods.QUERY,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    audit(args) {
        return axios({
            method: Service.FINA_BILLS.methods.AUDIT,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    antiAudit(args) {
        return axios({
            method: Service.FINA_BILLS.methods.ANTIAUDIT,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    reject(args) {
        return axios({
            method: Service.FINA_BILLS.methods.REJECT,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    queryFlat(args) {
        return axios({
            method: Service.FINA_BILLS.methods.QUERYFLAT,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    planQuery(args) {
        return axios({
            method: Service.FINA_BILLS.methods.PLAN_QUERY,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    create(args) {
        return axios({
            method: Service.FINA_BILLS.methods.CREATE,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    verify(args) {
        return axios({
            method: Service.FINA_BILLS.methods.VERIFY,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    orQuery(args) {
        return axios({
            method: Service.FINA_BILLS.methods.OR_QUERY,
            service: Service.FINA_BILLS.name,
            args: args
        })
    },
    sendRecToCloud(args) {
        return axios({
            method: Service.FINA_BILLS.methods.SEND_TO_CLOUD,
            service: Service.FINA_BILLS.name,
            args: args
        })
    }
}
