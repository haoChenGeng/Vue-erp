import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    // 列表查询
    queryPage (args) {
        return axios({
            method: Service.FUND_MANAGEMENT.methods.RECONCILIATION_QUERY_PAGE,
            service: Service.FUND_MANAGEMENT.name,
            args: args
        })
    },
    // 导出
    exportExcel (args) {
        return axios({
            method: Service.FUND_MANAGEMENT.methods.RECONCILIATION_EXPORTEXCEL,
            service: Service.FUND_MANAGEMENT.name,
            args: args
        })
    },
    // 手动对账
    manuallyReconciliation (args) {
        return axios({
            method: Service.FUND_MANAGEMENT.methods.MANUALLYRECONCILIATION,
            service: Service.FUND_MANAGEMENT.name,
            args: args
        })
    }
}
