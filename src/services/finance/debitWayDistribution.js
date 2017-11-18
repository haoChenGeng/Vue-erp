import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    queryPage(args) {
        return axios({
            method: Service.DEBITWAYDISTRIBUTION.methods.QUERYPAGE,
            service: Service.DEBITWAYDISTRIBUTION.name,
            args: args
        })
    },
    statusUpdate(args){
        return axios({
            method: Service.DEBITWAYDISTRIBUTION.methods.STATUSUPDATE,
            service: Service.DEBITWAYDISTRIBUTION.name,
            args: args
        })
    },
    batchStatusUpdate(args){
        return axios({
            method: Service.DEBITWAYDISTRIBUTION.methods.BATCHSTATUSUPDATE,
            service: Service.DEBITWAYDISTRIBUTION.name,
            args: args
        })
    },
    create(args){
        return axios({
            method: Service.DEBITWAYDISTRIBUTION.methods.CREATE_ALLOT,
            service: Service.DEBITWAYDISTRIBUTION.name,
            args: args
        })
    },
    update(args) {
        return axios({
            method: Service.DEBITWAYDISTRIBUTION.methods.UPDATE_ALLOT,
            service: Service.DEBITWAYDISTRIBUTION.name,
            args: args
        })
    }
}
