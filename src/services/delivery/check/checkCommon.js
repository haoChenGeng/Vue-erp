import axios from 'src/utils/axios.js'
import Service from '../Service.js'

export default {
    getCheckProject(args) {
        return axios({
            method: Service.YANSHOU.methods.getCheckProject,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    getOrderInfo(args) {
        return axios({
            method: Service.YANSHOU.methods.getOrderInfo,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    createCheck(args) {
        return axios({
            method: Service.YANSHOU.methods.createCheck,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    createStartCheck(args) {
        return axios({
            method: Service.YANSHOU.methods.createStartCheck,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    getCheckDetail(args) {
        return axios({
            method: Service.YANSHOU.methods.getCheckDetail,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    getAgainOrderInfo(args) {
        return axios({
            method: Service.YANSHOU.methods.getAgainOrderInfo,
            service: Service.YANSHOU.name,
            args: args
        })
    },
    againCreate(args) {
        return axios({
            method: Service.YANSHOU.methods.againCreate,
            service: Service.YANSHOU.name,
            args: args
        })
    }
}
