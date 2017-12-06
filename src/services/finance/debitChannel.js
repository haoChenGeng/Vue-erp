import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    create(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.CREATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    queryPage(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.PAYMETHOD_QUERY,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    batchStatusUpdate(args) {
         return axios({
            method: Service.DEBITCHANNEL.methods.BATCHSTATUSUPDATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    update(args) {
         return axios({
            method: Service.DEBITCHANNEL.methods.UPDATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    }
}
