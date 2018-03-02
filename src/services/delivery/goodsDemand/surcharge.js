import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    approveOrderOM(args){
        return  axios({
            method: Service.DEMAND.methods.APPROVEORDEROM,
            service: Service.DEMAND.name,
            args: args
        })
    },
    cancelOrderOM(args){
        return  axios({
            method: Service.DEMAND.methods.CANCELORDEROM,
            service: Service.DEMAND.name,
            args: args
        })
    },
    confirmReceiptOM(args){
        return  axios({
            method: Service.DEMAND.methods.CONFIRMRECEIPTOM,
            service: Service.DEMAND.name,
            args: args
        })
    },
    getOrderdetailOM(args){
        return  axios({
            method: Service.DEMAND.methods.GETORDERDETAILOM,
            service: Service.DEMAND.name,
            args: args
        })
    },
    statOrderStatusOM(args){
        return axios({
            method: Service.DEMAND.methods.STATORDERSTATUSOM,
            service: Service.DEMAND.name,
            args: args
        })
    },
}