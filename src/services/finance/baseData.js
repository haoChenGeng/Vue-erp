import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    queryPage(args) {
        return axios({
            method: Service.FINA_BASEDATA.methods.QUERY_PAGE,
            service: Service.FINA_BASEDATA.name,
            args: args
        })
    },
    update(args) {
        return axios({
            method: Service.FINA_BASEDATA.methods.BANK_UPDATE,
            service: Service.FINA_BASEDATA.name,
            args: args
        })
    },
    batchUpdate(args) {
        return axios({
            method: Service.FINA_BASEDATA.methods.BANK_BATCH_UPDATE,
            service: Service.FINA_BASEDATA.name,
            args: args
        })
    },
    excelQuery(args) {
        return axios({
            method: Service.FINA_BASEDATA.methods.EXCEL_QUERY,
            service: Service.FINA_BASEDATA.name,
            args: args
        })
    }
}
