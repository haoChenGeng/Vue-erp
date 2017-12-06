import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default {
    queryRoleList(args) {
        return axios({
            service: Service.PERMISSION.name,
            method: Service.PERMISSION.methods.roleList,
            args: args
        })
    },
    queryGroupsAndChilds(args) {
        return axios({
            service: Service.PROPERTY.name,
            method: Service.PROPERTY.methods.queryGroupsAndChilds,
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
    queryUnionParent(args) {
        return axios({
            method: Service.PROPERTY.methods.queryUnionParent,
            service: Service.PROPERTY.name,
            args: args
        })
    },
    OplQueryPage(args) {
        return axios({
            method: Service.OPL.methods.queryPage,
            service: Service.OPL.name,
            args: args
        })
    },
    CityTreeGet(args) {
        return axios({
            method: Service.SYSDST.methods.CITYTREE,
            service: Service.SYSDST.name,
            args: args
        })
    },
    accountsConfigQueryFormula(args) {
        return axios({
            method: Service.ENTRY.methods.accountsConfigQueryFormula,
            service: Service.ENTRY.name,
            args: args
        })
    },
    queryGroupsAndChilds(args) {
        return axios({
            method: Service.PROPERTY.methods.queryGroupsAndChilds,
            service: Service.PROPERTY.name,
            args: args
        })
    },
    productPackageQueryPage(args) {
        return axios({
            method: Service.PRSPQM.methods.productPackageQueryPage,
            service: Service.PRSPQM.name,
            args: args
        })
    },


    customerDistributionCreate(args) {
        return axios({
            method: Service.COMPLAINT.methods.CUSTOMERDISTRIBUTIONCREATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    customerDistributionQueryList(args) {
        return axios({
            method: Service.COMPLAINT.methods.CUSTOMERDISTRIBUTIONQUERYLIST,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    customerDistributionStatusUpdate(args) {
        return axios({
            method: Service.COMPLAINT.methods.CUSTOMERDISTRIBUTIONSTATUSUPDATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    customerDistributionUpdate(args) {
        return axios({
            method: Service.COMPLAINT.methods.CUSTOMERDISTRIBUTIONUPDATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    customerOrderqueryList(args) {
        return axios({
            method: Service.COMPLAINT.methods.CUSTOMERORDERQUERYLIST,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    customerOrdersave(args) {
        return axios({method: Service.COMPLAINT.methods.CUSTOMERORDERSAVE, service: Service.COMPLAINT.name, args: args})
    },
    customerOrderstatusUpdate(args) {
        return axios({
            method: Service.COMPLAINT.methods.CUSTOMERORDERSTATUSUPDATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintUpgradeCreate(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTUPGRADECREATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintUpgradeQueryList(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTUPGRADEQUERYLIST,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintUpgradeStatusUpdate(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTUPGRADESTATUSUPDATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintUpgradeUpdate(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTUPGRADEUPDATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintObjectCreate(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTOBJECTCREATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintObjectQueryList(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTOBJECTQUERYLIST,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintObjectStatusUpdate(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTOBJECTSTATUSUPDATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintObjectUpdate(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTOBJECTUPDATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintContentQueryList(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTCONTENTQUERYLIST,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintManaCreate(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTMANACREATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintManaQueryList(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTMANAQUERYLIST,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintManaStatusUpdate(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTMANASTATUSUPDATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintManaUpdate(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTMANAUPDATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintStaffQueryList(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSTAFFQUERYLIST,
            service: Service.COMPLAINT.name,
            args: args
        })
    }, complaintsItemqueryPage(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSITEMQUERYPAGE,
            service: Service.COMPLAINT.name,
            args: args
        })
    }, complaintsOrdercreate(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSORDERCREATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    }, complaintsOrderfindById(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSORDERFINDBYID,
            service: Service.COMPLAINT.name,
            args: args
        })
    }, complaintsOrderfindByProcessId(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSORDERFINDBYPROCESSID,
            service: Service.COMPLAINT.name,
            args: args
        })
    }, complaintsOrderhandUpgrade(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSORDERHANDUPGRADE,
            service: Service.COMPLAINT.name,
            args: args
        })
    }, complaintsOrderqueryPage(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSORDERQUERYPAGE,
            service: Service.COMPLAINT.name,
            args: args
        })
    }, complaintsOrderupdate(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSORDERUPDATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    }, updatehandlerAndVistor(args) {
        return axios({
            method: Service.COMPLAINT.methods.UPDATEHANDLERANDVISTOR,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintsOrderProtect(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSORDERPROTECT,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintManaQueryPage(args) {
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTMANAQUERYPAGE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintsOrderspecificName(args){
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSORDERSPECIFICNAME,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintContentFindContent(args){
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTCONTENTFINDCONTENT,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    vistorOrHandleQuery(args){
        return axios({
            method: Service.COMPLAINT.methods.VISTORORHANDLEQUERY,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintsOrderPicture(args){
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSORDERPICTURE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },

    complaintOrderTempCreate(args){
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTORDERTEMPCREATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintOrderTempUpdate(args){
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTORDERTEMPUPDATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintOrderSubmitCreate(args){
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTORDERSUBMITCREATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintOrderSubmitUpdate(args){
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTORDERSUBMITUPDATE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintOrderApprove(args){
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTORDERAPPROVE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintOrderHandle(args){
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTORDERHANDLE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    updateVistor(args){
        return axios({
            method: Service.COMPLAINT.methods.UPDATEVISTOR,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    updateHandler(args){
        return axios({
            method: Service.COMPLAINT.methods.UPDATEHANDLER,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintsFollow(args){
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSFOLLOW,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    complaintsOrderAssignType(args){
        return axios({
            method: Service.COMPLAINT.methods.COMPLAINTSORDERASSIGNTYPE,
            service: Service.COMPLAINT.name,
            args: args
        })
    },
    makeCall(args) {
        return axios({
            method: Service.PSCSM.methods.MAKECALL,
            service: Service.PSCSM.name,
            args: args
        })
    }


}
