import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default {
    forBid(args) {
        return axios({
            method: Service.CERTIFICATIONRECORD.methods.UPDATE_STATUS_AUTHENTIC,
            service: Service.CERTIFICATIONRECORD.name,
            args: args
        })
    },

}