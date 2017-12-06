import axios from 'src/utils/axios.js'
import Service from './invpriceService.js'

export default {
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
    }
}
