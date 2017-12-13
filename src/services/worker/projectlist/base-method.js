import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {

    query(args){
         return axios({
            method: Service.TEMPLATE.methods.QUERY,
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
    queryPageByIds(args) {
        return axios({
            method: Service.TEMPLATE.methods.queryPageByIds,
            service: Service.TEMPLATE.name,
            args: args
        })
    }, 
     testqueryPageByIds(args) {
        return axios({
            method: Service.TEMPLATE.methods.testqueryPageByIds,
            service: Service.TEMPLATE.name,
            args: args
        })
    }, 
    

}
