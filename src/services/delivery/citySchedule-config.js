import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {


    cityScheduleBan(args) {
        return axios({
            method: Service.TEMPLATE.methods.cityScheduleBan,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    cityScheduleUse(args) {
        return axios({
            method: Service.TEMPLATE.methods.cityScheduleUse,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    cityScheduleCreate(args) {
        return axios({
            method: Service.TEMPLATE.methods.cityScheduleCreate,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    queryQuoteList(args) {
        return axios({
            method: Service.TEMPLATE.methods.queryPagePqmQuotaion,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    queryScheduleList(args) {
        return axios({
            method: Service.TEMPLATE.methods.scheduleReturnAllPs,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    getCity(args) {
        return axios({
            method: Service.dst.methods.city,
            service: Service.dst.name,
            args: args
        })
    },

}
