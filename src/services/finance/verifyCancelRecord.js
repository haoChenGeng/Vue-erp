import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    verifyOrderQueryDetail(args) {
        return axios({
            method: Service.VERIFYCANCELRECORD.methods.VERIFY_ORDER_QUERY_DETAIL,
            service: Service.VERIFYCANCELRECORD.name,
            args: args
        })
    },
    //取消核销
    verifyOrderItemAnti(args) {
        return axios({
            method: Service.VERIFYCANCELRECORD.methods.VERIFY_ORDER_ITEM_ANTI,
            service: Service.VERIFYCANCELRECORD.name,
            args: args
        })
    },
    //核销记录详情，单项
    verifyOrderLeftJoinSource(args) {
         return axios({
            method: Service.VERIFYCANCELRECORD.methods.VERIFY_ORDER_LEFT_JOIN_SOURCE,
            service: Service.VERIFYCANCELRECORD.name,
            args: args
        })

    }
}
