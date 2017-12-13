/**
 * Created by summer.gong on 2017/5/16.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    query(args) {
        return axios({
            method: Service.SET.M.CONFIG_LIST,
            service: Service.SET.S,
            args: args
        })
    },

    create(args) {
        return axios({
            method: Service.SET.M.CONFIG_CREATE,
            service: Service.SET.S,
            args: args
        })
    },

    update(args) {
        return axios({
            method: Service.SET.M.CONFIG_EDIT,
            service: Service.SET.S,
            args: args
        })
    },

    get(args) {
        return axios({
            method: Service.SET.M.CONFIG_GET,
            service: Service.SET.S,
            args: args
        })
    },

    forbid(args) {
        return axios({
            method: Service.SET.M.CONFIG_FORBID,
            service: Service.SET.S,
            args: args
        })
    },

    antiForbid(args) {
        return axios({
            method: Service.SET.M.CONFIG_ANTI_FORBID,
            service: Service.SET.S,
            args: args
        })
    },



}
