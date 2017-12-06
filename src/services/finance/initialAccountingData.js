import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    query(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.initialAccountingDataQuery,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    queryPage(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.initialAccountingDataQueryPage,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    findById(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.initialAccountingDataFindById,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    create(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.initialAccountingDataCreate,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    update(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.initialAccountingDataUpdate,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    deleteById(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.initialAccountingDataDeleteById,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    batchDeleteByIdList(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.initialAccountingDataBatchDeleteByIdList,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    batchDeleteInsertOrUpdate(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.initialAccountingDataBatchDeleteInsertOrUpdate,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    },
    batchImport(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.initialAccountingDataBatchImport,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    }
}
