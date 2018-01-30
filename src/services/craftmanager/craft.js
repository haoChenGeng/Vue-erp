import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    queryCraftList(args) {
        return axios({
            method: Service.CRAFT.methods.queryCraftList,
            service: Service.CRAFT.name,
            args: args
        })
    },
    createCraftModule(args) {
        return axios({
            method: Service.CRAFT.methods.createCraftModule,
            service: Service.CRAFT.name,
            args: args
        })
    }
}