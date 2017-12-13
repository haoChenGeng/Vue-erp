import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    // 列表查询
    queryPage (args) {
        return axios({
            method: Service.FUND_MANAGEMENT.methods.QUERY_PAGE,
            service: Service.FUND_MANAGEMENT.name,
            args: args
        })
    },
    // 导出
    exportExcel (args) {
        return axios({
            method: Service.FUND_MANAGEMENT.methods.EXPORTEXCEL,
            service: Service.FUND_MANAGEMENT.name,
            args: args
        })
    },
   // 手动拉取
    manuallyPull (args) {
        return axios({
            method: Service.FUND_MANAGEMENT.methods.MANUALLYPULL,
            service: Service.FUND_MANAGEMENT.name,
            args: args
        })
    }
}
