import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default {
    exportsale(args) {
        return axios({
            method: Service.SALEREJECTEDORDER.methods.SALESEXPORT,
            service: Service.SALEREJECTEDORDER.name,
            args: args
        })
    },
    orderBatchSubmit(args) {
        return axios({
            method: Service.SALEREJECTEDORDER.methods.ODERBATCHSUBMIT,
            service: Service.SALEREJECTEDORDER.name,
            args: args
        })
    },
    orderStash(args) {
        return axios({
            method: Service.SALEREJECTEDORDER.methods.ORDERSTASH,
            service: Service.SALEREJECTEDORDER.name,
            args: args
        })
    },
    orderSubmit(args) {
        return axios({
            method: Service.SALEREJECTEDORDER.methods.ORDERSUBMIT,
            service: Service.SALEREJECTEDORDER.name,
            args: args
        })
    },
    orderCancel(args) {
        return axios({
            method: Service.SALEREJECTEDORDER.methods.ORDERCANCEL,
            service: Service.SALEREJECTEDORDER.name,
            args: args
        })
    },
    itemCancel(args) {
        return axios({
            method: Service.SALEREJECTEDORDER.methods.ITEMCANCEL,
            service: Service.SALEREJECTEDORDER.name,
            args: args
        })
    },
    orderFindById(args) {
        return axios({
            method: Service.SALEREJECTEDORDER.methods.ORDERFINDBYID,
            service: Service.SALEREJECTEDORDER.name,
            args: args
        })
    },
    ordPageItem(args) {
        return axios({
            method: Service.SALEREJECTEDORDER.methods.ORDPAGEITEM,
            service: Service.SALEREJECTEDORDER.name,
            args: args
        })
    },
    findInitialInfo(args) {
        return axios({
            method: Service.SALEREJECTEDORDER.methods.FINDINITIALINFO,
            service: Service.SALEREJECTEDORDER.name,
            args: args
        })
    },
    updateItemImgs (args) {
        return axios({
            method: Service.SALEREJECTEDORDER.methods.UPDATEITEMIMGS,
            service: Service.SALEREJECTEDORDER.name,
            args: args
        })
    },
    rejectOrder (args) {
        return axios({
            method: Service.SUPPLYUPDATEITEM.methods.REJECTORDER,
            service: Service.SUPPLYUPDATEITEM.name,
            args: args
        })
    },
     receiveOrder (args) {
        return axios({
            method: Service.SUPPLYUPDATEITEM.methods.RECEIVEORDER,
            service: Service.SUPPLYUPDATEITEM.name,
            args: args
        })
    },
    findItemsToRefundById(args){
        return axios({
            method: Service.SALEREJECTEDORDER.methods.FINDITEMSTOREFUNDBYID,
            service: Service.SALEREJECTEDORDER.name,
            args: args
        })
    },
    queryIdentifyCodeList(args){
        return axios({
            method: Service.SUPPLYUPDATEITEM.methods.QUERYINDENTIFYCODELIST,
            service: Service.SUPPLYUPDATEITEM.name,
            args: args
        })
    },

}