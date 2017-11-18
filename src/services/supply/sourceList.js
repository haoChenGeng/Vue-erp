import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    queryProperty(args) {
        return axios({
            method: Service.SOURCE.methods.QUERY_PROPERTY,
            service: Service.SOURCE.name,
            args: args
        })
    },
    queryPage(args) {
        return axios({
            method: Service.SOURCE.methods.QUERY_PAGE,
            service: Service.SOURCE.name,
            args: args
        })
    },
    submit(args){
        return axios({
            method:Service.SOURCE.methods.SRC_LIST_SERVICE_SUBMIT,
            service:Service.SOURCE.name,
            args:args
        })
    },
    query(args){
        return axios({
            method:Service.SOURCE.methods.SRC_LIST_SERVICE_QUERY,
            service:Service.SOURCE.name,
            args:args
        })
    },
    disable(args){
        return axios({
            method:Service.SOURCE.methods.SRC_LIST_SERVICE_DISABLE,
            service:Service.SOURCE.name,
            args:args
        })
    },
    antiDisable(args){
        return axios({
            method:Service.SOURCE.methods.SRC_LIST_SERVICE_ANTIDISABLE,
            service:Service.SOURCE.name,
            args:args
        })
    },
    addImport(args){
        return axios({
            method:Service.SOURCE.methods.SRC_LIST_SERVICE_ADD_IMPORT,
            service:Service.SOURCE.name,
            args:args
        })
    },
    updateImport(args){
        return axios({
            method:Service.SOURCE.methods.SRC_LIST_SERVICE_UPDATE_IMPORT,
            service:Service.SOURCE.name,
            args:args
        })
    },
    export(args){
        return axios({
            method:Service.SOURCE.methods.SRC_LIST_SERVICE_EXPORT,
            service:Service.SOURCE.name,
            args:args
        })
    },
    check(args){
        return axios({
            method:Service.SOURCE.methods.SRC_LIST_SERVICE_CHECK,
            service:Service.SOURCE.name,
            args:args
        })
    },
    autoBuild(args){
        return axios({
            method:Service.SOURCE.methods.SRC_LIST_SERVICE_AUTO_GENERATE,
            service:Service.SOURCE.name,
            args:args
        })
    },
    queryShops(args) {
        return axios({
            method:Service.SUPPLY.methods.SHOP_QUERY,
            service:Service.SUPPLY.name,
            args:args
        })
    },
    queryGoods(args) {
        return axios({
            method:Service.SUPPLY.methods.GOODS_QUERY_PAGE,
            service:Service.SUPPLY.name,
            args:args
        })
    },

}
