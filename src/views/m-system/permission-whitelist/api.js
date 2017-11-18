import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    insert(args) {
        return axios({
            method: Service.pem.methods.insert,
            service: Service.pem.name,
            args: args
        })
    },
    update(args) {
        return axios({
            method: Service.pem.methods.update,
            service: Service.pem.name,
            args: args
        })
    },
    delete(args) {
        return axios({
            method: Service.pem.methods.deleteById,
            service: Service.pem.name,
            args: args
        })
    },
}

