import axios from 'src/utils/axios.js'
import Service from './operateService.js'

export default {
    operate(args) {
        return axios({
            method: Service.OPERATE.methods.operate,
            service: Service.OPERATE.name,
            args: args
        })
    },
     logQuery(args) {
        return axios({
            method: Service.OPERATE.methods.logQuery,
            service: Service.OPERATE.name,
            args: args
        })
    },
    queryListOperateVO(args) {
        return axios({
            method: Service.OPERATE.methods.queryListOperateVO,
            service: Service.OPERATE.name,
            args: args
        })
    },
    queryOperateGoods(args) {
        return axios({
            method: Service.OPERATE.methods.queryOperateGoods,
            service: Service.OPERATE.name,
            args: args
        })
    },
    queryOperateGoodsTree(args) {
        return axios({
            method: Service.OPERATE.methods.queryOperateGoodsTree,
            service: Service.OPERATE.name,
            args: args
        })
    },
    queryOperateInventoryVO(args) {
        return axios({
            method: Service.OPERATE.methods.queryOperateInventoryVO,
            service: Service.OPERATE.name,
            args: args
        })
    },
    queryOperateResultVO(args) {
        return axios({
            method: Service.OPERATE.methods.queryOperateResultVO,
            service: Service.OPERATE.name,
            args: args
        })
    },
    requirementQueryUnion(args) {
        return axios({
            method: Service.OPERATE.methods.requirementQueryUnion,
            service: Service.OPERATE.name,
            args: args
        })
    },
    inventoryQueryUnion(args) {
        return axios({
            method: Service.OPERATE.methods.inventoryQueryUnion,
            service: Service.OPERATE.name,
            args: args
        })
    },


}