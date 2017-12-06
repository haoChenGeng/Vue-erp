/**
 * Created by luke.lv on 2017/9/17.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    createConfig(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.INVOKE_CREATE,
            args: args
        })
    },
    updateConfig(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.INVOKE_UPDATE,
            args: args
        })
    },
    enbleConfig(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.INVOKE_ENABLE,
            args: args
        })
    },
    disableConfig(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.INVOKE_DISABLE,
            args: args
        })
    },
    findById(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.INVOKE_FINDBYID,
            args: args
        })
    }
}
