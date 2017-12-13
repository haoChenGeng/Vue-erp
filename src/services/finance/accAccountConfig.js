/**
 * Created by luke.lv on 2017/9/13.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    createConfig(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.CREATE,
            args: args
        })
    },
    updateConfig(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.UPDATE,
            args: args
        })
    },
    enbleConfig(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.ENABLE,
            args: args
        })
    },
    disableConfig(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.DISABLE,
            args: args
        })
    },
    findById(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.FINDBYID,
            args: args
        })
    },
    getUserType(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.GET_USERTYPE,
            args: args
        })
    },
    getAccountTypeByUserType(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.GET_ACCOUNTTYPE,
            args: args
        })
    },
    isHasAccountFunc(args) {
        return axios({
            service: Service.ACC_ACCOUNT_CONFIG.name,
            method: Service.ACC_ACCOUNT_CONFIG.methods.IS_HASACCOUNT,
            args: args
        })
    }
}
