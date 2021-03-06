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

    /*
    this.getPropertyByParentCodes([82301,42102]).then(res => {
            console.log(res)
        }).catch(e => {
            console.log(e)
        })
    * 根据多个分类code批量查询供应链辅助资料，
    * 适用于需要多次请求分类辅助资料的场景，
    * 不适用于结果总条数大于1000的场景（辅助资料的总数是可以预估的）
    * 参数：
    * codes  分类code集合 必传 如：[82301,42102]
    * size 查询的条数 非必传 不要大于1000， 不确定可以传-1
    * propertyStatus 辅助资料的状态 非必传
    * return 对象，如{82301:[{},{}],42102:[{},{}]}
    * */
    getPropertyByParentCodes (codes, ...args) {
        let properties = {}
        codes.forEach(item => {
            properties[item] = []
        })

        var serviceArgs = {
            page: 1,
            search: {
                pPropertyCodes: codes
            }
        }
        // 查询条数和状态，非必传
        let [size, propertyStatus] = (args)

        if (propertyStatus !== undefined) {
            serviceArgs.search.propertyStatus = propertyStatus
        }

        serviceArgs.size = (size === undefined || size < 1) ? (codes.length * 50) : size

        // console.log(serviceArgs)
        return new Promise((resolve, reject) => {
            if (serviceArgs.size > 1000) {
                reject('查询 size 大于 1000')
            }
            axios({
                method: Service.SUPPLY_CONFIGURE.methods.queryUnionParent,
                service: Service.SUPPLY_CONFIGURE.name,
                args: serviceArgs
            }).then(res => {
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        // 以父级code为key
                        properties[item.pPropertyCode].push({
                            value: item.id,
                            text: item.propertyName,
                            code: item.propertyCode,
                            propertyCode: item.propertyCode,
                            propertyStatus: item.propertyStatus,
                            wholeCode: item.wholeCode
                        })
                    })
                    resolve(properties)
                } else {
                    reject()
                }
            }).catch(e => {
                reject(e)
            })
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
