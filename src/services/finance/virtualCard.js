import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    queryPage (args) {
        return axios({
            method: Service.VIRTUAL_CARD.methods.QUERY_PAGE,
            service: Service.VIRTUAL_CARD.name,
            args: args
        })
    },
    requestQuery (args) {
        return axios({
            method: Service.VIRTUAL_CARD.methods.REQUEST_QUERY,
            service: Service.VIRTUAL_CARD.name,
            args: args
        })
    },
    requestCMB (args) {
        return axios({
            method: Service.VIRTUAL_CARD.methods.REQUEST_CMB,
            service: Service.VIRTUAL_CARD.name,
            args: args
        })
    },
    requestCMBTrade (args) {
        return axios({
            method: Service.VIRTUAL_CARD.methods.REQUEST_CMB_TRADDE,
            service: Service.VIRTUAL_CARD.name,
            args: args
        })
    },
    queryBindPage (args) {
        return axios({
            method: Service.VIRTUAL_CARD.methods.QUERY_BIND_PAGE,
            service: Service.VIRTUAL_CARD.name,
            args: args
        })
    },
    updateCardStatus (args) {
        return axios({
            method: Service.VIRTUAL_CARD.methods.CARD_STATUS_UPDATE,
            service: Service.VIRTUAL_CARD.name,
            args: args
        })
    },
    virtualCardBatchUnwarp (args) {
        return axios({
            method: Service.VIRTUAL_CARD.methods.CARD_HAND_UNWRAP,
            service: Service.VIRTUAL_CARD.name,
            args: args
        })
    },
    batchCardImport (args) {
        return axios({
            method: Service.VIRTUAL_CARD.methods.BTCH_CARD_IMPORT,
            service: Service.VIRTUAL_CARD.name,
            args: args
        })
    },
    batchRemitCreate (args) {
        return axios({
            method: Service.VIRTUAL_CARD.methods.BATCH_CARD_REMIT_CREATE,
            service: Service.VIRTUAL_CARD.name,
            args: args
        })
    },
    batchCardBindImport (args) {
        return axios({
            method: Service.VIRTUAL_CARD.methods.VIRTUAL_CARD_BIND_CREATE,
            service: Service.VIRTUAL_CARD.name,
            args: args
        })
    }

}
