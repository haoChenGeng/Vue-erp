import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {

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
            method: Service.TEMPLATE.methods.QUERY,
            service: Service.TEMPLATE.name,
            args: args
        })
    },

    //产品包综合查询
    searchProductPackage(search = [], sort = [], fields = []){
        let args = {};
        if( search.length ){
            args['search'] = search
        }
        if( sort.length ){
            args['sort'] = sort
        }
        if( fields.length ){
            args['fields'] = fields
        }
        return axios({
            method: Service.TEMPLATE.methods.queryModuleQuotaionById,
            service: Service.TEMPLATE.name,
            args:args
        })
    }


}
