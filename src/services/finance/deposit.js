import axios from 'src/utils/axios.js'
import Service from './Service.js'


export default {
    createDepositCredit(args){
        return axios({
            method: Service.DEPOSIT_MANAGEMENT.methods.CREATE_DEPOSIT_CREDIT,
            service: Service.DEPOSIT_MANAGEMENT.name,
            args: args
        })
    },

    disuseDepositCredit(args){
        return axios({
            method: Service.DEPOSIT_MANAGEMENT.methods.DEPOSIT_DISUSE,
            service: Service.DEPOSIT_MANAGEMENT.name,
            args: args
        })
    },

    auditRecord(args){
        return axios({
            method: Service.DEPOSIT_MANAGEMENT.methods.RECORD_AUDIT,
            service: Service.DEPOSIT_MANAGEMENT.name,
            args: args
        })
    },

    disuseRecord(args){
        return axios({
            method: Service.DEPOSIT_MANAGEMENT.methods.RECORD_DISUSE,
            service: Service.DEPOSIT_MANAGEMENT.name,
            args: args
        })
    },

    updateK3CloudMap(args){
        return axios({
            method: Service.K3_CLOUD_MANAGER.methods.K3_MAP_UPDATE,
            service: Service.K3_CLOUD_MANAGER.name,
            args: args
        })
    },

    batchAddMap(args){
        return axios({
            method: Service.K3_CLOUD_MANAGER.methods.K3_BATCH_ADD,
            service: Service.K3_CLOUD_MANAGER.name,
            args: args
        })
    },
    queryK3CloudMap(args){
        return axios({
            method: Service.K3_CLOUD_MANAGER.methods.K3_MAP_QUERY,
            service: Service.K3_CLOUD_MANAGER.name,
            args: args
        })
    },
    deleteK3CloudMap(args){
        return axios({
            method: 'gqof6v9RFgxeGOugzyOnrPpm3hLs50DpWAD',
            service: Service.K3_CLOUD_MANAGER.name,
            args: args
        })
    },
    batchUpdateK3CloudMap(args){
        return axios({
            method: 'jqvvm-U16SPP4Pq9on6Vu1Pxf5gORrpSaIE',
            service: Service.K3_CLOUD_MANAGER.name,
            args: args
        })
    },
    queryDeposit(args){
        return axios({
            method: Service.DEPOSIT_MANAGEMENT.methods.DEPOSIT_QUERY,
            service: Service.DEPOSIT_MANAGEMENT.name,
            args: args
        })
    },
    recordCancel(args){
        return axios({
            method: Service.DEPOSIT_MANAGEMENT.methods.RECORD_CANCEL,
            service: Service.DEPOSIT_MANAGEMENT.name,
            args: args
        })
    },
    recordCreate(args){
        return axios({
            method: Service.DEPOSIT_MANAGEMENT.methods.RECORD_CREATE,
            service: Service.DEPOSIT_MANAGEMENT.name,
            args: args
        })
    },
    recordUpdate(args){
        return axios({
            method: Service.DEPOSIT_MANAGEMENT.methods.RECORD_UPDATE,
            service: Service.DEPOSIT_MANAGEMENT.name,
            args: args
        })
    },
    recordQuery(args){
        return axios({
            method: Service.DEPOSIT_MANAGEMENT.methods.RECORD_QUERY,
            service: Service.DEPOSIT_MANAGEMENT.name,
            args: args
        })
    },
    recordImport(args){
        return axios({
            method: Service.DEPOSIT_MANAGEMENT.methods.RECORD_IMPORT,
            service: Service.DEPOSIT_MANAGEMENT.name,
            args: args
        })
    }

}
