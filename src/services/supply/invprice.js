import axios from 'src/utils/axios.js'
import Service from './invpriceService.js'

export default {
    //仓库分组（公用接口）
    // 获取用户分配的仓库分组
    orgQuery(args) {
        return axios({
            method: Service.ORG.methods.QUERY,
            service: Service.ORG.name,
            args: args
        })
    },

    //仓库操作费
    // 仓库操作费查询
    queryPage(args) {
        return axios({
            method: Service.OPERATE.methods.queryPage,
            service: Service.OPERATE.name,
            args: args
        })
    },
    // 仓库操作费详情
    findPriceDetail(args) {
        return axios({
            method: Service.OPERATE.methods.findPriceDetail,
            service: Service.OPERATE.name,
            args: args
        })
    },
    // 仓库操作费暂存
    tempSubmit(args) {
        return axios({
            method: Service.OPERATE.methods.tempSubmit,
            service: Service.OPERATE.name,
            args: args
        })
    },
    // 仓库操作费提交
    submit(args) {
        return axios({
            method: Service.OPERATE.methods.submit,
            service: Service.OPERATE.name,
            args: args
        })
    },
    // 仓库操作费审批
    completeWorkFlow(args) {
        return axios({
            method: Service.OPERATE.methods.completeWorkFlow,
            service: Service.OPERATE.name,
            args: args
        })
    },


    //仓库租赁费
    // 仓库租赁费查询
    queryPageRent(args) {
        return axios({
            method: Service.RENT.methods.queryPage,
            service: Service.RENT.name,
            args: args
        })
    },
    // 仓库租赁费详情
    findPriceDetailRent(args) {
        return axios({
            method: Service.RENT.methods.findPriceDetail,
            service: Service.RENT.name,
            args: args
        })
    },
    // 仓库租赁费暂存
    tempSubmitRent(args) {
        return axios({
            method: Service.RENT.methods.tempSubmit,
            service: Service.RENT.name,
            args: args
        })
    },
    // 仓库租赁费提交
    submitRent(args) {
        return axios({
            method: Service.RENT.methods.submit,
            service: Service.RENT.name,
            args: args
        })
    },
    // 仓库租赁费审批
    completeWorkFlowRent(args) {
        return axios({
            method: Service.RENT.methods.completeWorkFlow,
            service: Service.RENT.name,
            args: args
        })
    },
    // 仓库租赁费禁用
    forbidden(args) {
        return axios({
            method: Service.RENT.methods.forbidden,
            service: Service.RENT.name,
            args: args
        })
    },
    // 仓库租赁费反禁用
    unForbidden(args) {
        return axios({
            method: Service.RENT.methods.unForbidden,
            service: Service.RENT.name,
            args: args
        })
    }
}
