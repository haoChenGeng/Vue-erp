import axios from 'src/utils/axios.js'
import Service from './refundOrder-Service.js'

export default {
    queryTreeByType(args) {
        return axios({
            method: Service.ORGANIZATION.methods.queryTreeByType,
            service: Service.ORGANIZATION.name,
            args: args
        })
    },
    refundOrderCreate(args) {
        return axios({
            method: Service.refundOrder.methods.refundOrderCreate,
            service: Service.refundOrder.name,
            args: args
        })
    },
    refundOrderCancel(args) {
        return axios({
            method: Service.refundOrder.methods.refundOrderCancel,
            service: Service.refundOrder.name,
            args: args
        })
    },
    refundOrderReject(args) {
        return axios({
            method: Service.refundOrder.methods.refundOrderReject,
            service: Service.refundOrder.name,
            args: args
        })
    },
    refundOrderComplete(args) {
        return axios({
            method: Service.refundOrder.methods.refundOrderComplete,
            service: Service.refundOrder.name,
            args: args
        })
    },
    refundOrderQueryPage(args) {
        return axios({
            method: Service.refundOrder.methods.refundOrderQueryPage,
            service: Service.refundOrder.name,
            args: args
        })
    },
    refundOrderItemQueryPage(args) {
        return axios({
            method: Service.refundOrder.methods.refundOrderItemQueryPage,
            service: Service.refundOrder.name,
            args: args
        })
    },
    refundOrderProjectDetail(args) {
        return axios({
            method: Service.refundOrder.methods.refundOrderProjectDetail,
            service: Service.refundOrder.name,
            args: args
        })
    },
    refundOrderFindById(args) {
        return axios({
            method: Service.refundOrder.methods.refundOrderFindById,
            service: Service.refundOrder.name,
            args: args
        })
    },
    queryByDemandOrderCode(args) {
        return axios({
            method: Service.refundOrder.methods.queryByDemandOrderCode,
            service: Service.refundOrder.name,
            args: args
        })
    },
    queryByRefundOrderCode(args) {
        return axios({
            method: Service.refundOrder.methods.queryByRefundOrderCode,
            service: Service.refundOrder.name,
            args: args
        })
    },
    queryPageForChooseDemandOrderCode(args) {
        return axios({
            method: Service.refundOrder.methods.queryPageForChooseDemandOrderCode,
            service: Service.refundOrder.name,
            args: args
        })
    }
}
