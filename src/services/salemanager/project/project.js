import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    accountQuery(args) {
        return axios({
            service: Service.ACCOUNT.name,
            method: Service.ACCOUNT.methods.ACCOUNTQUERY,
            args: args,
        })
    },
    listAccountByRoleCode(args) {
        return axios({
            service: Service.SALES.name,
            method: Service.SALES.methods.LISTACCOUNTBYROLECODE,
            args: args,
        })
    },
    decorationOrderQueryOrderPage(args) {
        return axios({
            service: Service.PROJECT.name,
            method: Service.PROJECT.methods.QUERYORDERPAGE,
            args: args,
        })
    },
    decorationOrderFindCrmRecordById(args) {
        return axios({
            service: Service.PROJECT.name,
            method: Service.PROJECT.methods.FINDCRMRECORDBYID,
            args: args,
        })
    },
    decorationOrderFindOrderDetailSheetById(args) {
        return axios({
            service: Service.PROJECT.name,
            method: Service.PROJECT.methods.FINDORDERDETAILSHEETBYID,
            args: args,
        })
    },
    decorationOrderFindSaleAssignById(args) {
        return axios({
            service: Service.PROJECT.name,
            method: Service.PROJECT.methods.FINDSALEASSIGNBYID,
            args: args,
        })
    },
    decorationOrderFindProjectAssignById(args) {
        return axios({
            service: Service.PROJECT.name,
            method: Service.PROJECT.methods.FINDPROJECTASSIGNBYID,
            args: args,
        })
    },
    appointQuery(args) {
        return axios({
            service: Service.MEASURE.name,
            method: Service.MEASURE.methods.APPOINTQUERY,
            args: args,
        })
    },
    measureQueryPage(args) {
        return axios({
            service: Service.PROJECT.name,
            method: Service.PROJECT.methods.QUERYPAGE,
            args: args,
        })
    },
    measureQueryMeasureRecordPage(args) {
        return axios({
            service: Service.MEASURE.name,
            method: Service.MEASURE.methods.QUERYMEASURERECORDPAGE,
            args: args,
        })
    },
    measureOrderQueryPunchPage(args) {
        return axios({
            service: Service.MEASURE.name,
            method: Service.MEASURE.methods.QUERYPUNCHPAGE,
            args: args,
        })
    },
    platCheckQueryPage(args) {
        return axios({
            service: Service.PLATCHECK.name,
            method: Service.PLATCHECK.methods.QUERYPAGE,
            args: args,
        })
    },
    contractPreview(args) {
        return axios({
            service: Service.CONSTRACT.name,
            method: Service.CONSTRACT.methods.PREVIEW,
            args: args,
        })
    },
    goodsQueryPage(args) {
        return axios({
            service: Service.GOODS.name,
            method: Service.GOODS.methods.QUERYPAGE,
            args: args,
        })
    },
    orderGetProjectMoneyInfo(args) {
        return axios({
            service: Service.MONEYINFO.name,
            method: Service.MONEYINFO.methods.GETPROJECTMONEYINFO,
            args: args,
        })
    },
    getCall(args) {
        return axios({
            service: Service.CAll.name,
            method: Service.CAll.methods.GETCALL,
            args: args,
        })
    },
}
