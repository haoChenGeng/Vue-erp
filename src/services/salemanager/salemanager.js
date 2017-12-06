import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
    queryDetailPage (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.QUERYDETAILPAGE,
            args: args
        })
    },
    listAccountByRoleCode (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.LISTACCOUNTBYROLECODE,
            args: args
        })
    },
    //分配跟进人
    assignAuditStaff (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.ASSIGN_AUDIT_STAFF,
            args: args
        })
    },
    //添加跟进记录
    addRevisited (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.CREATE_REVISIT_RECORD,
            args: args
        })
    },
    findOrderDetailByIdList (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.FINDORDERDETAILBYIDLIST,
            args: args
        })
    },
    findOrderDetailById (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.FIND_ORDER_DETAIL_BY_ID,
            args: args
        })
    },
    findRevisitedList (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.FIND_REVISIT_LIST,
            args: args
        })
    },
    //楼盘信息查询
    estateSearch (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.ESTATE_SEARCH,
            args: args
        })
    },
    //手动创建
    createOrder (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.CREATE_ORDER,
            args: args
        })
    },
    //批量导入
    importOrder (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.IMPORT_ORDER,
            args: args
        })
    },
    //批量导入
    queryProperty (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.QUERY_PROPERTY,
            args: args
        })
    },
    //提交
    updateDetail (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.UPDATE_DETAIL,
            args: args
        })
    },
    //审核
    createAuditBill (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.CREATE_AUDIT_BILL,
            args: args
        })
    },
    //设为主要联系人
    setPrimaryContact (args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.SET_PRIMARY_CONTACT,
            args: args
        })
    },
}
