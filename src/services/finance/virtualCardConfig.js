import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    queryPage (args) {
        return axios({
            method: Service.VIRTUAL_CARD_CONFIG.methods.QUERY_PAGE,
            service: Service.VIRTUAL_CARD_CONFIG.name,
            args: args
        })
    },
    queryList (args) {
        return axios({
            method: Service.VIRTUAL_CARD_CONFIG.methods.QUERY_LIST,
            service: Service.VIRTUAL_CARD_CONFIG.name,
            args: args
        })
    },
    create (args) {
        return axios({
            method: Service.VIRTUAL_CARD_CONFIG.methods.CONFIG_CREATE,
            service: Service.VIRTUAL_CARD_CONFIG.name,
            args: args
        })
    },
    update (args) {
        return axios({
            method: Service.VIRTUAL_CARD_CONFIG.methods.CONFIG_UPDATE,
            service: Service.VIRTUAL_CARD_CONFIG.name,
            args: args
        })
    },
    updateStatus (args) {
        return axios({
            method: Service.VIRTUAL_CARD_CONFIG.methods.UPDATE_STATUS,
            service: Service.VIRTUAL_CARD_CONFIG.name,
            args: args
        })
    },
    queryDebitMethod (args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.PAYMETHOD_QUERY,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    queryTree (args) {
        return axios({
            method: Service.ORG.methods.ORG_TREE,
            service: Service.ORG.name,
            args: args
        })
    }
}
