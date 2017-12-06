import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    start(args) {
        return axios({
            method: Service.WKF.methods.startProcess,
            service: Service.WKF.name,
            args: args
        })
    },
    complete(args) {
        return axios({
            method: Service.WKF.methods.completeTask,
            service: Service.WKF.name,
            args: args
        })
    }
}
