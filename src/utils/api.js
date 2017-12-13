import axios from './axios.js'
import Service from './Service.js'
// 历史文件，不要在这里加东西了 新接口写在src/services里
let account = {
    login(args) {
        return axios({
            method: Service.ACCOUNT.methods.LOGIN,
            service: Service.ACCOUNT.name,
            args: args
        })
    },
    checkPermission(args) {
        return axios({
            method: Service.PERM.methods.CHECK_PERMISSION,
            service: Service.PERM.name,
            args: args
        })
    },
    changePassword(args) {
        return axios({
            method: Service.ACCOUNT.methods.CHANGE_PASSWPRD,
            service: Service.ACCOUNT.name,
            args: args
        })
    },
    listMenuTree(args) {
        return axios({
            method: Service.PERM.methods.LIST_MENU_TREE,
            service: Service.PERM.name,
            args: args
        })
    },
}

let organization = {
    queryTree(args) {
        return axios({
            method: Service.ACCOUNT.methods.ORG_TREE,
            service: Service.ACCOUNT.name,
            args: args
        })
    },
    queryByParentId(args) {
        return axios({
            method: Service.ACCOUNT.methods.QUERY_BY_PID,
            service: Service.ACCOUNT.name,
            args: args
        })
    },
    update(args) {
        return axios({
            method: Service.ACCOUNT.methods.ORG_UPDATE,
            service: Service.ACCOUNT.name,
            args: args
        })
    },
    query(args) {
        return axios({
            method: Service.ACCOUNT.methods.ORG_QUERY,
            service: Service.ACCOUNT.name,
            args: args
        })
    },
    findById(id) {
        return axios({
            method: Service.ACCOUNT.methods.ORG_FIND_BY_ID,
            service: Service.ACCOUNT.name,
            args: {
                id: id
            }
        })
    }
}

let allSystemCode = {
    list(args) {
        return axios({
            method: Service.CONFIGURE.methods.SYS_CODE_LIST,
            service: Service.CONFIGURE.name,
            args: args
        })
    }
}

let debitChannel = {
    create(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.CREATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    queryPage(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.PAYMETHOD_QUERY,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    statusUpdate(args) {
         return axios({
            method: Service.DEBITCHANNEL.methods.STATUSUPDATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    }
}

let debitWayDistribution = {
    queryPage(args) {
        return axios({
            method: Service.DEBITWAYDISTRIBUTION.methods.QUERYPAGE,
            service: Service.DEBITWAYDISTRIBUTION.name,
            args: args
        })
    },
    statusUpdate(args){
        return axios({
            method: Service.DEBITWAYDISTRIBUTION.methods.STATUSUPDATE,
            service: Service.DEBITWAYDISTRIBUTION.name,
            args: args
        })
    },
    create(args){
        return axios({
            method: Service.DEBITWAYDISTRIBUTION.methods.CREATE_ALLOT,
            service: Service.DEBITWAYDISTRIBUTION.name,
            args: args
        })
    },
    update(args) {
        return axios({
            method: Service.DEBITWAYDISTRIBUTION.methods.UPDATE_ALLOT,
            service: Service.DEBITWAYDISTRIBUTION.name,
            args: args
        })
    }
}
// 财务--收款类型配置
let debitType = {
    queryPage(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.DEBITTYPE_QUERYPAGE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    create(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.DEBITTYPE_CREATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    update(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.DEBITTYPE_UPDATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    }
}

let batchDebitType = {
    status: {
        update(args) {
            return axios({
                method: Service.DEBITCHANNEL.methods.BATCHDEBITTYPE_STATUS_UPDATE,
                service: Service.DEBITCHANNEL.name,
                args: args
            })
        }
    }
}
// 款项用途
let fundPurpose = {
    // 新增款项用途
    create(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.FUNDPERPOSE_CREATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    // 查询收款用途
    queryPage(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.FUNDPERPOSE_QUERY_PAGE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    // 作废款项用途
    statusUpdate(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.FUNDPERPOSE_STATUS_UPDATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    // 作废款项用途
    batchStatusUpdate(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.FUNDPERPOSE_BATCH_STATUS_UPDATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    // 修改收款用途信息
    update(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.FUNDPERPOSE_UPDATE,
            service: Service.DEBITCHANNEL.name,
        })
    }
}

let employee = {
    queryFull(args) {
        return axios({
            method: Service.ACCOUNT.methods.EMP_QUERY_FULL,
            service: Service.ACCOUNT.name,
            args: args
        })
    }
}

let baseData = {
    queryShopTree(args) {
        return axios({
            method: Service.BASEDATA.methods.QUERYSHOPTREE,
            service: Service.BASEDATA.name,
            args: args
        })
    },
    queryGoodsTree(args) {
        return axios({
            method: Service.BASEDATA.methods.QUERYGOODSTREE,
            service: Service.BASEDATA.name,
            args: args
        })
    }
}

let api = {
    organization,
    account,
    allSystemCode,
    debitChannel,
    debitType,
    batchDebitType,
    debitWayDistribution,
    fundPurpose,
    employee,
    baseData
}

export default api
