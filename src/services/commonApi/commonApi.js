import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    // 辅助资料配置接口
    allSystemCodeList(args) {
        return axios({
            method: Service.CONFIGURE.methods.SYS_CODE_LIST,
            service: Service.CONFIGURE.name,
            args: args
        })
    },
    // 辅助资料查询某个父节点的下一级非禁用节点集
    listNextLevelUnforbidden(args) {
        return axios({
            method: Service.CONFIGURE.methods.LIST_UNFORBIDDEN,
            service: Service.CONFIGURE.name,
            args: args
        })
    },
    // 供应链辅助资料
    queryUnionParent(args) {
        return axios({
            method: Service.SUPPLY_CONFIGURE.methods.queryUnionParent,
            service: Service.SUPPLY_CONFIGURE.name,
            args: args
        })
    },
    queryPage(args) {
        return axios({
            method: Service.SUPPLY_CONFIGURE.methods.QUERY_PAGE,
            service: Service.SUPPLY_CONFIGURE.name,
            args: args
        })
    },
    // 根据名字和类型查公司
    queryShopUnion(args) {
        return axios({
            method: Service.SUPPLY_MASTERDATA.methods.queryShopUnion,
            service: Service.SUPPLY_MASTERDATA.name,
            args: args
        })
    },
    // 查公司
    queryShop(args) {
        return axios({
            method: Service.SUPPLY_MASTERDATA.methods.queryShop,
            service: Service.SUPPLY_MASTERDATA.name,
            args: args
        })
    },
    // 通过组织职能查询组织，暂时只支持或的关系
    queryByFunctionCode(args) {
        return axios({
            method: Service.ORGANIZATION.methods.QUERY_BY_FUNCTIONCODE,
            service: Service.ORGANIZATION.name,
            args: args
        })
    },
    // 获取全部组织
    queryAll(args) {
        return axios({
            method: Service.ORGANIZATION.methods.ORG_QUERY,
            service: Service.ORGANIZATION.name,
            args: args
        })
    },
    queryTreeByTypeAndFunction(args) {
        return axios({
            method: Service.ORGANIZATION.methods.QUERY_TREE_FUNCTION,
            service: Service.ORGANIZATION.name,
            args: args
        })
    },
    queryTreeByType(args) {
        return axios({
            method: Service.ORGANIZATION.methods.QUERYTREEBYTYPE,
            service: Service.ORGANIZATION.name,
            args: args
        })
    },
    queryChildrenByWholeCode(wholeCode, depth = 3) {
        return axios({
            method: Service.SUPPLY_CONFIGURE.methods.queryChildrenByWholeCode,
            service: Service.SUPPLY_CONFIGURE.name,
            args: { wholeCode: wholeCode, depth: depth }
        })
    },
    queryChildrenByWholeCodes(wholeCodes, depth = 3) {
        return axios({
            method: Service.SUPPLY_CONFIGURE.methods.queryChildrenByWholeCodes,
            service: Service.SUPPLY_CONFIGURE.name,
            args: { wholeCodes: wholeCodes, depth: depth }
        })
    },
    getAllQueue() {
        return axios({
            method: Service.EDA.methods.QUERY_QUEUE_QUERYQUEUES,
            service: Service.EDA.name,
            args: {}
        })
    }

}
