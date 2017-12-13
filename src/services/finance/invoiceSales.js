/**
 * Created by luke.lv on 2017/7/29.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    sendSalesInvoiceToCloud(args){
        return axios({
            method: Service.RECEIVABLE.methods.sendSalesInvoiceToCloud,
            service: Service.RECEIVABLE.name,
            args: args
        })
    }
}
