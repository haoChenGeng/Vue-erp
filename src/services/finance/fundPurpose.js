import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    create (args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.FUNDPERPOSE_CREATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    update (args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.FUNDPERPOSE_UPDATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    queryPage (args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.FUNDPERPOSE_QUERY_PAGE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    statusUpdate (args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.FUNDPERPOSE_STATUS_UPDATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    batchStatusUpdate (args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.FUNDPERPOSE_BATCH_STATUS_UPDATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    }
}
