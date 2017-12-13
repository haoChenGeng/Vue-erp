import axios from 'src/utils/axios.js'
import Service from './common.js'
export default {
    invOrganization(args) {
        return axios({
            method: Service.SALECOMMON.methods.INVORGANIZATION,
            service: Service.SALECOMMON.name,
            args: args
        })
    },

}

