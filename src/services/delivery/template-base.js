import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    getById(args) {
        return axios({
            method: Service.TEMPLATE.methods.GETBYID,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    create(args) {
        return axios({
            method: Service.TEMPLATE.methods.CREATE,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    update(args) {
        return axios({
            method: Service.TEMPLATE.methods.UPDATE,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    setModuleStatus(args){
        return axios({
            method: Service.TEMPLATE.methods.SETMODULESTATUS,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    queryModuleQuotaionById(args) {
        return axios({
            method: Service.TEMPLATE.methods.queryModuleQuotaionById,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    moduleItemQueryPage(args) {
        return axios({
            method: Service.TEMPLATE.methods.moduleItemQueryPage,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    queryQuoteList(args) {
        return axios({
            method: Service.TEMPLATE.methods.queryPagePqmQuotaion,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    moduleItemSave(args) {
        return axios({
            method: Service.TEMPLATE.methods.moduleItemSave,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    propertyQueryPage(args) {
        return axios({
            method: Service.PROPERTY.methods.propertyQueryPage,
            service: Service.PROPERTY.name,
            args: args
        })
    },
    itemBillSave(args) {
        return axios({
            method: Service.TEMPLATE.methods.itemBillSave,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    itemBillQueryPage(args) {
        return axios({
            method: Service.TEMPLATE.methods.itemBillQueryPage,
            service: Service.TEMPLATE.name,
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
    groupListAsTree(args) {
        return axios({
            method: Service.ENTRY.methods.groupListAsTree,
            service: Service.ENTRY.name,
            args: args
        })
    },
    groupBillTypeList(args) {
        return axios({
            method: Service.ENTRY.methods.groupBillTypeList,
            service: Service.ENTRY.name,
            args: args
        })
    },
    groupCreate(args){
        return axios({
            method: Service.ENTRY.methods.groupCreate,
            service: Service.ENTRY.name,
            args: args
        })
    },
    groupBatchCreate(args){
        return axios({
            method: Service.ENTRY.methods.groupBatchCreate,
            service: Service.ENTRY.name,
            args: args
        })
    },
    groupDelete(args){
        return axios({
            method: Service.ENTRY.methods.groupDelete,
            service: Service.ENTRY.name,
            args: args
        })
    },
    questionAnswerCreate(args){
        return axios({
            method: Service.ENTRY.methods.questionAnswerCreate,
            service: Service.ENTRY.name,
            args: args
        })
    },
    questionFindDetailById(args){
        return axios({
            method: Service.ENTRY.methods.questionFindDetailById,
            service: Service.ENTRY.name,
            args: args
        })
    },
    questionAnswerUpdate(args){
        return axios({
            method: Service.ENTRY.methods.questionAnswerUpdate,
            service: Service.ENTRY.name,
            args: args
        })
    },
    questionAuditStatus(args){
        return axios({
            method: Service.ENTRY.methods.questionAuditStatus,
            service: Service.ENTRY.name,
            args: args
        })
    },
    getCheckProject(args){
        return axios({
            method: Service.YANSHOU.methods.getCheckProject,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    checkCreate(args){
        return axios({
            method: Service.YANSHOU.methods.checkCreate,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    checkUpdate(args){
        return axios({
            method: Service.YANSHOU.methods.checkUpdate,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    checkGetHead(args){
        return axios({
            method: Service.YANSHOU.methods.checkGetHead,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    checkDetailGetDetail(args){
        return axios({
            method: Service.YANSHOU.methods.checkDetailGetDetail,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    checkSubmitOrUpdate(args){
        return axios({
            method: Service.YANSHOU.methods.checkSubmitOrUpdate,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    projectShutdownSave(args){
        return axios({
            method: Service.YANSHOU.methods.projectShutdownSave,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    projectShutdownRestart(args){
        return axios({
            method: Service.YANSHOU.methods.projectShutdownRestart,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    projectShutdownFindDetailByCode(args){
        return axios({
            method: Service.YANSHOU.methods.projectShutdownFindDetailByCode,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    projectShutdownFindDetailByProcessId(args){
        return axios({
            method: Service.YANSHOU.methods.projectShutdownFindDetailByProcessId,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    projectShutdownApprove(args){
        return axios({
            method: Service.YANSHOU.methods.projectShutdownApprove,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    projectDelayBillSave(args){
        return axios({
            method: Service.YANSHOU.methods.projectDelayBillSave,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    projectDetailList(args){
        return axios({
            method: Service.PLAN.methods.projectDetailList,
            service: Service.PLAN.name,
            args: args
        })
    },
    projectDelayBillFindDetailByCode(args){
        return axios({
            method: Service.YANSHOU.methods.projectDelayBillFindDetailByCode,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    projectDelayBillFindDetailByProcessId(args){
        return axios({
            method: Service.YANSHOU.methods.projectDelayBillFindDetailByProcessId,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    projectDelayBillApprove(args){
        return axios({
            method: Service.YANSHOU.methods.projectDelayBillApprove,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    queryTreeBySchduleModule(args) {
        return axios({
            method: Service.TEMPLATE.methods.listModuleNodeAsTree,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    queryEsmModelNameList(args) {
        return axios({
            method: Service.SYSESM.methods.queryModelBasic,
            service: Service.SYSESM.name,
            args: args
        })
    },
}
