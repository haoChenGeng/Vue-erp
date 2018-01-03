import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    // 辅助资料配置接口
    assignPage (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.GET_ASSIGN_PRINCIPAL_LIST,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    getDecorationInfo (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.GET_DECORATION_INFO,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    assignAddPage (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.ASSIGN_ADD_PAGE,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    principalAssign (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.PRINCIPAL_ASSIGN,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    principalAssignCustomer (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.REASSIGNKF,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },

    // 根据角色和组织查询用户信息
    searchPrincipalByRoleAndOrg: function (args) {
        return axios({
            method: Service.PERMISSION.methods.QUERY_BY_ROLE_AND_ORG,
            service: Service.PERMISSION.name,
            args: args
        })
    },
    // 根据账号ID查询名字
    findAccountById (args) {
        return axios({
            method: Service.ACCOUNTSERVER.methods.FIND_BY_ACCOUNTID,
            service: Service.ACCOUNTSERVER.name,
            args: args
        })
    },
    // 查询负责人列表
    listPrincipal (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.LIST_PRINCIPAL,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    // 查询负责人列表（项目经理）
    listItemPrincipal (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.LIST_ITEM_PRINCIPAL,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    // 查询负责人列表(根据项目ID查)（项目经理）
    listItemPrincipalByProjectId (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.LIST_ITEM_PRINCIPAL_BY_PROJECT,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    // 添加项目经理接单配置
    caretePrincipalSetting (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.PRINCIPAL_SETTING_ADD,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    // 编辑项目经理接单配置
    updatePrincipalSetting (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.PRINCIPAL_SETTING_UPDATE,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    // 公式查询接口
    formulaQueryPage (args) {
        return axios({
            method: Service.FORMULA_SERVER.methods.FORMULA_QUERY_PAGE,
            service: Service.FORMULA_SERVER.name,
            args: args
        })
    },
    // 查询组织绑定的城市
    queryCityRelation (args) {
        return axios({
            method: Service.ACCOUNTSERVER.methods.QUERY_CITY_RELATION,
            service: Service.ACCOUNTSERVER.name,
            args: args
        })
    },
    // 城市IDS查询城市名
    standardDistrictGetByCidList (args) {
        return axios({
            method: Service.SYS_DST.methods.GET_BY_CID_LIST,
            service: Service.SYS_DST.name,
            args: args
        })
    },
    // 查询产品包信息
    loadProductInfo (args) {
        return axios({
            method: Service.PRS_PQM.methods.LOAD_PRODUCT_INFO,
            service: Service.PRS_PQM.name,
            args: args
        })
    },
    queryPropertyUnion (args) {
        return axios({
            method: Service.PROPERTY.methods.QUERYP_ROPERTY_UNION,
            service: Service.PROPERTY.name,
            args: args
        })
    },
    getAssignPrincipalList (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.GET_ASSIGN_PRINCIPAL_LIST,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    assign (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.ASSIGN,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    assignConfig (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.ASSIGN_CONFIG,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    exportAssignRecord (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.EXPORT_ASSIGN_RECORD,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    },
    assessObjectVoid (args) {
        return axios({
            method: Service.ITEM_ASSIGN.methods.ASSESS_OBJECT_VOID,
            service: Service.ITEM_ASSIGN.name,
            args: args
        })
    }
}
