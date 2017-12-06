import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    allSystemCode(args) {
        return axios({
            method: Service.CONFIGURE.methods.SYS_CODE_LIST,
            service: Service.CONFIGURE.name,
            args: args
        })
    },
    queryBatchSystemCode(args) {
      return axios({
          method: Service.CONFIGURE.methods.SYS_QUERY_BATCH,
          service: Service.CONFIGURE.name,
          args: args
      })
    },
    queryTree(args) {
        return axios({
            method: Service.ORG.methods.ORG_TREE,
            service: Service.ORG.name,
            args: args
        })
    },
    queryTreeV2 (args) {
        return axios({
            method: Service.ORG.methods.ORG_QUERY_TREE_V2,
            service: Service.ORG.name,
            args: args
        })
    },
    queryTreeByTypeAndFunction(args) {
        return axios({
            method: Service.ORG.methods.ORG_TREE_BY_TYPE_AND_FUNC,
            service: Service.ORG.name,
            args: args
        })
    },
    queryByParentId(args) {
        return axios({
            method: Service.ORG.methods.QUERY_BY_PID,
            service: Service.ORG.name,
            args: args
        })
    },
    update(args) {
        return axios({
            method: Service.ORG.methods.ORG_UPDATE,
            service: Service.ORG.name,
            args: args
        })
    },
    query(args) {
        return axios({
            method: Service.ORG.methods.ORG_QUERY,
            service: Service.ORG.name,
            args: args
        })
    },
    findById(id) {
        return axios({
            method: Service.ORG.methods.ORG_FIND_BY_ID,
            service: Service.ORG.name,
            args: {
                id: id
            }
        })
    },
    employeeQueryFull(args) {
        return axios({
            method: Service.ORG.methods.EMP_QUERY_FULL,
            service: Service.ORG.name,
            args: args
        })
    },
    assignCity(args) {
        return axios({
            method: Service.ORG.methods.ORG_ASSIGN_CITY,
            service: Service.ORG.name,
            args: args
        })
    },
    queryCityRelation(args) {
        return axios({
            method: Service.ORG.methods.ORG_QUERY_CITY_RELATION,
            service: Service.ORG.name,
            args: args
        })
    },
    createV2 (args) {
        return axios({
            method: Service.ORG.methods.ORG_CREATE_V2,
            service: Service.ORG.name,
            args: args
        })
    },
    queryPageV2 (args) {
        return axios({
            method: Service.ORG.methods.ORG_QUERY_V2,
            service: Service.ORG.name,
            args: args
        })
    },
    findByCorpId(args) {
        return axios({
            method: Service.ORG.methods.ORG_FIND_BY_CORP,
            service: Service.ORG.name,
            args: args
        })
    },
    sysGetByCode(code){
        return axios({
            method: Service.CONFIGURE.methods.getByCode,
            service: Service.CONFIGURE.name,
            args: {
                'code':code
            }
        })
    }
}

