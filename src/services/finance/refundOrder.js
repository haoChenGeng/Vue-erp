import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {

    /**
     * 轮单费
     * @param args
     */
    queryRoundOrders (args) {
        return axios({
            method: Service.REFUND_MANAGE_CONFIG.methods.ROUND_ORDER_REFUNDS,
            service: Service.REFUND_MANAGE_CONFIG.name,
            args: args
        })
    },

    backRoundOrders (args) {
        return axios({
            method: Service.REFUND_MANAGE_CONFIG.methods.BACK_ROUND_ORDER_REFOUNDS,
            service: Service.REFUND_MANAGE_CONFIG.name,
            args: args
        })
    },

    /**
     * 托管款
     * @param args
     */
    queryTrusteeFees (args) {
        return axios({
            method: Service.REFUND_MANAGE_CONFIG.methods.TRUSTEE_FEE_REFUND,
            service: Service.REFUND_MANAGE_CONFIG.name,
            args: args
        })
    },

    queryTrusteeFeeInfo (args) {
        return axios({
            method: Service.REFUND_MANAGE_CONFIG.methods.TRUSTEE_FEE_INFO,
            service: Service.REFUND_MANAGE_CONFIG.name,
            args: args
        })
    },

    backTrusteeFees (args) {
        return axios({
            method: Service.REFUND_MANAGE_CONFIG.methods.BACK_TRUSTEE_FEE_REFUND,
            service: Service.REFUND_MANAGE_CONFIG.name,
            args: args
        })
    }

}
