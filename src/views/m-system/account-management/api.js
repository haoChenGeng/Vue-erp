import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default {
    get (args) {
        return axios({
            method: Service.USER.methods.get,
            service: Service.USER.name,
            args: args
        })
    },
    create (args) {
        return axios({
            method: Service.USER.methods.create,
            service: Service.USER.name,
            args: args
        })
    },
    update (args) {
        return axios({
            method: Service.USER.methods.update,
            service: Service.USER.name,
            args: args
        })
    },
    allSystemCodeList (args) {
        return axios({
            method: Service.CONFIGURE.methods.SYS_CODE_LIST,
            service: Service.CONFIGURE.name,
            args: args
        })
    },
    queryId (args) {
        return axios({
            method: Service.SUPPLY.methods.queryId,
            service: Service.SUPPLY.name,
            args: args
        })
    }
}
