import axios from 'src/utils/axios.js'
import Service from './inventoryCheckService.js'

export default {
    //查询库存
    storageQuery(args) {
        return axios({
            method: Service.CHECK.methods.storageQuery,
            service: Service.CHECK.name,
            args: args
        })
    },
    queryStorageByOrganizationAndType(args){
        return axios({
            method: Service.CHECK.methods.queryStorageByOrganizationAndType,
            service: Service.CHECK.name,
            args: args
        })
    },
    //查询货位
    storageBinQuery(args) {
        return axios({
            method: Service.CHECK.methods.storageBinQuery,
            service: Service.CHECK.name,
            args: args
        })
    },
    //查询分组（品类）
    groupQueryPage(args) {
        return axios({
            method: Service.CHECK.methods.groupQueryPage,
            service: Service.CHECK.name,
            args: args
        })
    },
    //查询商品信息
    inventoryCheckFindGoodsRecord(args) {
        return axios({
            method: Service.CHECK.methods.inventoryCheckFindGoodsRecord,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点单新增
    inventoryCheckCreate(args) {
        return axios({
            method: Service.CHECK.methods.inventoryCheckCreate,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点单删除
    inventoryCheckDeleteByIds(args) {
        return axios({
            method: Service.CHECK.methods.inventoryCheckDeleteByIds,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点单详情
    inventoryCheckFindCheckOrderDataById(args) {
        return axios({
            method: Service.CHECK.methods.inventoryCheckFindCheckOrderDataById,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点单暂存
    inventoryCheckTemp(args) {
        return axios({
            method: Service.CHECK.methods.inventoryCheckTemp,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点单提交
    inventoryCheckSubmit(args) {
        return axios({
            method: Service.CHECK.methods.inventoryCheckSubmit,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点单取消
    inventoryCheckCancelCheckOrder(args) {
        return axios({
            method: Service.CHECK.methods.inventoryCheckCancelCheckOrder,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点单列表页提交
    inventoryCheckBatchSubmit(args) {
        return axios({
            method: Service.CHECK.methods.inventoryCheckBatchSubmit,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点单-初盘保存
    tempSubmitFirstCheckForm(args) {
        return axios({
            method: Service.CHECK.methods.tempSubmitFirstCheckForm,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点单-初盘提交
    submitFirstCheckForm(args) {
        return axios({
            method: Service.CHECK.methods.submitFirstCheckForm,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点单-复盘保存
    tempSubmitSecondCheckForm(args) {
        return axios({
            method: Service.CHECK.methods.tempSubmitSecondCheckForm,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点单-复盘提交
    submitSecondCheckForm(args) {
        return axios({
            method: Service.CHECK.methods.submitSecondCheckForm,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点损益单-提交
    batchSubmitProfitLossOrder(args) {
        return axios({
            method: Service.CHECK.methods.batchSubmitProfitLossOrder,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点损益单-审核
    completeWorkFlow(args) {
        return axios({
            method: Service.CHECK.methods.completeWorkFlow,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点损益单根据流程id获取盘点损益单数据
    findProfitLossAndItem(args) {
        return axios({
            method: Service.CHECK.methods.findProfitLossAndItem,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点损益单确认调账
    confirmDiff(args) {
        return axios({
            method: Service.CHECK.methods.confirmDiff,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点损益单明细保存
    tempSubmitProfitLossOrder(args) {
        return axios({
            method: Service.CHECK.methods.tempSubmitProfitLossOrder,
            service: Service.CHECK.name,
            args: args
        })
    },
    //盘点损益单明细提交
    submitProfitLossOrder(args) {
        return axios({
            method: Service.CHECK.methods.submitProfitLossOrder,
            service: Service.CHECK.name,
            args: args
        })
    },
    //附件上传
    accessoryCreate(args) {
        return axios({
            method: Service.CHECK.methods.accessoryCreate,
            service: Service.CHECK.name,
            args: args
        })
    },
    //附件删除
    accessoryDelete(args) {
        return axios({
            method: Service.CHECK.methods.accessoryDelete,
            service: Service.CHECK.name,
            args: args
        })
    },
    //单项索赔数量，责任人更新
    updateItems(args) {
        return axios({
            method: Service.CHECK.methods.updateItems,
            service: Service.CHECK.name,
            args: args
        })
    },

}
