import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    queryUnionParent(args) {
        return axios({
            method: Service.PROPERTY.methods.queryUnionParent,
            service: Service.PROPERTY.name,
            args: args
        })
    },
    queryTreeByType(args) {
        return axios({
            method: Service.ORGANIZATION.methods.queryTreeByType,
            service: Service.ORGANIZATION.name,
            args: args
        })
    },
    queryPage(args) {
        return axios({
            method: Service.DEMAND.methods.QUERYPAGE,
            service: Service.DEMAND.name,
            args: args
        })
    },
    queryProperty(args) {
        return axios({
            method: Service.DEMAND.methods.QUERYPROPERTY,
            service: Service.DEMAND.name,
            args: args
        })
    },
    queryDetail(args) {
        return axios({
            method: Service.DEMAND.methods.QUERYDETAIL,
            service: Service.DEMAND.name,
            args: args
        })
    },
    createNormalOrder(args) {
        return axios({
            method: Service.DEMAND.methods.CREATENORMALORDER,
            service: Service.DEMAND.name,
            args: args
        })
    },
    createAuxiliaryOrder(args) {
        return axios({
            method: Service.DEMAND.methods.CREATEAUXILIARYORDER,
            service: Service.DEMAND.name,
            args: args
        })
    },
    queryNodeByProjectId(args) {
        return axios({
            method: Service.DEMAND.methods.QUERYNODEBYPROJECTID,
            service: Service.DEMAND.name,
            args: args
        })
    },
    queryTookGoods(args) {
        return axios({
            method: Service.DEMAND.methods.QUERYTOOKGOODS,
            service: Service.DEMAND.name,
            args: args
        })
    },
    queryNoTookGoods(args) {
        return axios({
            method: Service.DEMAND.methods.QUERYNOTOOKGOODS,
            service: Service.DEMAND.name,
            args: args
        })
    },
    queryAuxiliaryMaterial(args) {
        return axios({
            method: Service.DEMAND.methods.QUERYAUXILIARYMATERIAL,
            service: Service.DEMAND.name,
            args: args
        })
    },
    confirmReceipt(args) {
        return axios({
            method: Service.DEMAND.methods.CONFIRMRECEIPT,
            service: Service.DEMAND.name,
            args: args
        })
    },
    applyReplenishGoods(args) {
        return axios({
            method: Service.DEMAND.methods.APPLYREPLENISHGOODS,
            service: Service.DEMAND.name,
            args: args
        })
    },
    verify(args) {
        return axios({
            method: Service.DEMAND.methods.VERIFY,
            service: Service.DEMAND.name,
            args: args
        })
    },
    getProcessDetailById(args) {
        return axios({
            method: Service.DEMAND.methods.GETPROCESSDETAILBYID,
            service: Service.DEMAND.name,
            args: args
        })
    },
    getDetailByProcessId(args) {
        return axios({
            method: Service.DEMAND.methods.GETDETAILBYPROCESSID,
            service: Service.DEMAND.name,
            args: args
        })
    },
    closeOrder(args) {
        return axios({
            method: Service.DEMAND.methods.CLOSEORDER,
            service: Service.DEMAND.name,
            args: args
        })
    }, itemQueryListById(args) {
        return axios({
            method: Service.DEMAND.methods.ITEMQUERYLISTBYID,
            service: Service.DEMAND.name,
            args: args
        })
    },
    itemQueryPageById(args) {
        return axios({
            method: Service.DEMAND.methods.ITEMQUERYPAGEBYID,
            service: Service.DEMAND.name,
            args: args
        })
    },
    itemQueryDetail(args) {
        return axios({
            method: Service.DEMAND.methods.ITEMQUERYDETAIL,
            service: Service.DEMAND.name,
            args: args
        })
    },
    itemQueryOrderAllItem(args) {
        return axios({
            method: Service.DEMAND.methods.ITEMQUERYORDERALLITEM,
            service: Service.DEMAND.name,
            args: args
        })
    },
    itemQueryPageAllItem(args) {
        return axios({
            method: Service.DEMAND.methods.ITEMQUERYPAGEALLITEM,
            service: Service.DEMAND.name,
            args: args
        })
    },
    itemAddRemark(args) {
        return axios({
            method: Service.DEMAND.methods.ITEMADDREMARK,
            service: Service.DEMAND.name,
            args: args
        })
    },
    checkoutGoodsDosage(args) {
        return axios({
            method: Service.DEMAND.methods.CHECKOUTGOODSDOSAGE,
            service: Service.DEMAND.name,
            args: args
        })
    },
    cancelOrder(args) {
        return axios({
            method: Service.DEMAND.methods.CANCELORDER,
            service: Service.DEMAND.name,
            args: args
        })
    },
    queryProjectList(args) {
        return axios({
            method: Service.DEMAND.methods.queryProjectList,
            service: Service.DEMAND.name,
            args: args
        })
    },
    queryProjectId(args) {
        return axios({
            method: Service.DEMAND.methods.QUERYPROJECTID,
            service: Service.DEMAND.name,
            args: args
        })
    },
    goodsDemandReport(args){
        return axios({
            method: Service.DEMAND.methods.goodsDemandReport,
            service: Service.DEMAND.name,
            args: args
        })
    },
    goodsDemandSave(args){
        return axios({
            method: Service.DEMAND.methods.goodsDemandSave,
            service: Service.DEMAND.name,
            args: args
        })
    },
    querySaveOrder(args){
        return axios({
            method: Service.DEMAND.methods.querySaveOrder,
            service: Service.DEMAND.name,
            args: args
        })
    },
    querySaveOrderItems(args){
        return axios({
            method: Service.DEMAND.methods.querySaveOrderItems,
            service: Service.DEMAND.name,
            args: args
        })
    }


}
