import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default {
    // 保险列表
    list(args)
    {
        return axios({
            method: Service.INSURANCE_MANAGE.methods.INSURANCE_LIST,
            service: Service.INSURANCE_MANAGE.name,
            args: args
        })
    },
    // 保险详情
    detail(args)
    {
        return axios({
            method: Service.INSURANCE_MANAGE.methods.INSURANCE_DETAIL_GET,
            service: Service.INSURANCE_MANAGE.name,
            args: args
        })
    }
}
