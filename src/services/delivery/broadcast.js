/**
 * Created by tony.huang on 2017/8/25.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    broadcastDurationCreate(args) {
        return axios({
            method: Service.BROADCAST.methods.BROADCASTDURATIONCREATE,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    broadcastDurationFindById(args) {
        return axios({
            method: Service.BROADCAST.methods.BROADCASTDURATIONFINDBYID,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    broadcastDurationQueryPage(args) {
        return axios({
            method: Service.BROADCAST.methods.BROADCASTDURATIONQUERYPAGE,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    broadcastDurationUpdateStatus(args) {
        return axios({
            method: Service.BROADCAST.methods.BROADCASTDURATIONUPDATESTATUS,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    broadcastDurationItemCreate(args) {
        return axios({
            method: Service.BROADCAST.methods.BROADCASTDURATIONITEMCREATE,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    broadcastDurationItemDeleteByIds(args) {
        return axios({
            method: Service.BROADCAST.methods.BROADCASTDURATIONITEMDELETEBYIDS,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    broadcastDurationItemUpdate(args) {
        return axios({
            method: Service.BROADCAST.methods.BROADCASTDURATIONITEMUPDATE,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    broadcastDurationItemFindById(args) {
        return axios({
            method: Service.BROADCAST.methods.BROADCASTDURATIONITEMFINDBYID,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    broadcastDurationItemFindByDurationId(args) {
        return axios({
            method: Service.BROADCAST.methods.BROADCASTDURATIONITEMFINDBYDURATIONID,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    broadcastDurationItemQueryPage(args) {
        return axios({
            method: Service.BROADCAST.methods.BROADCASTDURATIONITEMQUERYPAGE,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    broadcastDurationItemDeleteByIds(args) {
        return axios({
            method: Service.BROADCAST.methods.BROADCASTDURATIONITEMDELETEBYIDS,
            service: Service.BROADCAST.name,
            args: args
        })
    },


    getBroadcastRecordInfoForPC(args) {
        return axios({
            method: Service.BROADCAST.methods.GETBROADCASTRECORDINFOFORPC,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    getCalendarByProjectIdForShare(args){
        return axios({
            method: Service.BROADCAST.methods.GETCALENDARBYPROJECTIDFORSHARE,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    getCalendarByProjectId(args){
        return axios({
            method: Service.BROADCAST.methods.GETCALENDARBYPROJECTID,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    queryBroadcastRecordProjectInfoForPC(args){
        return axios({
            method: Service.BROADCAST.methods.QUERYBROADCASTRECORDPROJECTINFOFORPC,
            service: Service.BROADCAST.name,
            args: args
        })
    },
    queryPage(args){
        return axios({
            method: Service.BROADCAST.methods.QUERYPAGE,
            service: Service.BROADCAST.name,
            args: args
        })
    },


    pkgQueryPage(args) {
        return axios({
            method: Service.PRSPQM.methods.productPackageQueryPage,
            service: Service.PRSPQM.name,
            args: args
        })
    },
    pkgQuery(args) {
        return axios({
            method: Service.PRSPQM.methods.packageQuery,
            service: Service.PRSPQM.name,
            args: args
        })
    },
    pctreeGetConfig(args){
        return axios({
            method: Service.SYSDST.methods.pctreeGetConfig,
            service: Service.SYSDST.name,
            args: args
        })
    },
    decorationOrderFindOrderById(args){
        return axios({
            method: Service.PRSMDM.methods.decorationOrderFindOrderById,
            service: Service.PRSMDM.name,
            args: args
        })
    },
}
