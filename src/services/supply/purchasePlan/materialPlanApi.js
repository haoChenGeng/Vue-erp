import axios from 'src/utils/axios.js'
import Service from './materialPlanService.js'

export default {
    closeEnable(args) {
        return axios({
            method: Service.MATERIALPLAN.methods.closeEnable,
            service: Service.MATERIALPLAN.name,
            args: args
        })
    },
     startEnable(args) {
        return axios({
            method: Service.MATERIALPLAN.methods.startEnable,
            service: Service.MATERIALPLAN.name,
            args: args
        })
    },
    create(args) {
        return axios({
            method: Service.MATERIALPLAN.methods.create,
            service: Service.MATERIALPLAN.name,
            args: args
        })
    },
    update(args) {
        return axios({
            method: Service.MATERIALPLAN.methods.update,
            service: Service.MATERIALPLAN.name,
            args: args
        })
    },
    findById(args) {
        return axios({
            method: Service.MATERIALPLAN.methods.findById,
            service: Service.MATERIALPLAN.name,
            args: args
        })
    },
    getInventoryData(args) {
        return axios({
            method: Service.MATERIALPLAN.methods.getInventoryData,
            service: Service.MATERIALPLAN.name,
            args: args
        })
    },


}
