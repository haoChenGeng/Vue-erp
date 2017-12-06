import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    queryPage(args) {
        return axios({
            method: Service.RECEIPTPLANORDER.methods.QUERYPAGE,
            service: Service.RECEIPTPLANORDER.name,
            args: args
        })
    },
    verifyOrderQuery(args) {
        return axios({
            method: Service.RECEIPTPLANORDER.methods.VERIFYORDERQUERY,
            service: Service.RECEIPTPLANORDER.name,
            args: args
        })
    },
    // verify.order.item.create.by.receipt
    verifyOrderItemCreate(args) {
        return axios({
            method: Service.RECEIPTPLANORDER.methods.VERIFY_ORDER_ITEM_CREATE,
            service: Service.RECEIPTPLANORDER.name,
            args: args
        })
    },
    // receipt.plan.order.update
    receiptPlanOrderUpdate (args) {
        return axios({
            method: Service.RECEIPTPLANORDER.methods.RECEIPT_PLAN_ORDER_UPDATE,
            service: Service.RECEIPTPLANORDER.name,
            args: args
        })
    },
    // receipt.plan.order.cancel
    receiptPlanOrderCancel (args) {
        return axios({
            method: Service.RECEIPTPLANORDER.methods.RECEIPT_PLAN_ORDER_CANCEL,
            service: Service.RECEIPTPLANORDER.name,
            args: args
        })
    },
    // verify.order.left.join.query
    verifyOrderLeftJoinQuery (args) {
        return axios({
            method: Service.RECEIPTPLANORDER.methods.VERIFY_ORDER_LEFT_JOIN_QUERY,
            service: Service.RECEIPTPLANORDER.name,
            args: args
        })
    },
    // 供测试方使用的页面
    verifyOrderAdd(args) {
        return axios({
            method: Service.RECEIPTPLANORDER.methods.VERIFY_ORDER_ADD,
            service: Service.RECEIPTPLANORDER.name,
            args: args
        })
    },

}
