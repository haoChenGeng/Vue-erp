import axios from 'src/utils/axios.js'
import Service from './Service.js'
// 收款类型配置页
export default {
    queryPage(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.DEBITTYPE_QUERYPAGE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    create(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.DEBITTYPE_CREATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    update(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.DEBITTYPE_UPDATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    },
    batchupdate(args) {
        return axios({
            method: Service.DEBITCHANNEL.methods.BATCHDEBITTYPE_STATUS_UPDATE,
            service: Service.DEBITCHANNEL.name,
            args: args
        })
    }
}
