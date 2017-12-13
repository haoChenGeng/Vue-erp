import axios from 'src/utils/axios.js'
import Service from './Service.js'
//工长主数据
export default {
    // 列表查询接口
    queryList(args) {
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.QUERY_LIST,
            args: args
        })
    },
    //新增接口
    create(args) {
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.CREATE,
            args: args
        })
    },
    //更新暂存工人、工长基础信息
    workerServiceUpdate(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerServiceUpdate,
            args: args
        })
    },
    //根据ID获取新增工人基础信息
    getBaseInfoById(args){
         return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerBaseServiceFind,
            args: args
        })
    },
    organizationQuery(args){
        return axios({
            service: Service.ORGANIZATION.name,
            method: Service.ORGANIZATION.methods.organizationQuery,
            args: args
        })
    },
    organizationQueryTreeByType(args){
        return axios({
            service: Service.ORGANIZATION.name,
            method: Service.ORGANIZATION.methods.queryTreeByType,
            args: args
        })
    },
    queryByRoleAndOrg(args){
        return axios({
            service: Service.PERMISSION.name,
            method: Service.PERMISSION.methods.queryByRoleAndOrg,
            args: args
        })
    },
    accountQuery(args){
        return axios({
            service: Service.ACCOUNT.name,
            method: Service.ACCOUNT.methods.accountQuery,
            args: args
        })
    },
    workerEmergencyServiceCancel(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerEmergencyServiceCancel,
            args: args
        })
    },
    workerIdentityServiceCancel(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerIdentityServiceCancel,
            args: args
        })
    },
    findWorkerOther(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.findWorkerOther,
            args: args
        })
    },
    workerBankAccountServiceCancel(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerBankAccountServiceCancel,
            args: args
        })
    },
    workerAttachServiceCancel(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerAttachServiceCancel,
            args: args
        })
    },
    workerFrozenServiceCancel(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerFrozenServiceCancel,
            args: args
        })
    },
    //冻结信息新增
    workerFrozenServiceSave(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerFrozenServiceSave,
            args: args
        })
    },
    //工长重新入职
    workerBaseServiceAnew(args){
         return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerBaseServiceAnew,
            args: args
        })
    },
    //工长信息反审核
    workerBaseServiceApprovalAnew(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerBaseServiceApprovalAnew,
            args: args
        })
    },
    //工长解约取消
    workerDimissionServiceCancel(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerDimissionServiceCancel,
            args: args
        })
    },
    //工长解约信息新增
    workerDimissionServiceCreate(args){
         return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerDimissionServiceCreate,
            args: args
        })
    },
    workerInfoServiceFindInfoProcess(args){
         return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.workerInfoServiceFindInfoProcess,
            args: args
        })
     },
     approvalCreate(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.approvalCreate,
            args: args
        })
     },
     //开始接单
     startWork(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.startWork,
            args: args
        })
     },
     submitBatch(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.submitBatch,
            args: args
        })
     },
     approvalDimission(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.approvalDimission,
            args: args
        })
     },
     //通过组织ID查交付经理
     queryUserBySubOrgAndRole(args){
        return axios({
            service: Service.FOREMANWORKER.name,
            method: Service.FOREMANWORKER.methods.queryUserBySubOrgAndRole,
            args: args
        })
     },
     //通过用户名查用户账号
     accountFindByName(args){
         return axios({
            service: Service.ACCOUNT.name,
            method: Service.ACCOUNT.methods.accountFindByName,
            args: args
        })
     }
}