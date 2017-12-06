import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {

    shutConfigQueryPage(args){
        return axios({
            method: Service.PSCONFIG.methods.shutConfigQueryPage,
            service: Service.PSCONFIG.name,
            args: args
        })
    },
    shutConfigSave(args) {
        return axios({
            method: Service.PSCONFIG.methods.shutConfigSave,
            service: Service.PSCONFIG.name,
            args: args
        })
    },
    queryProperty(args) {
        return axios({
            method: Service.PROPERTY.methods.propertyQueryPage,
            service: Service.PROPERTY.name,
            args: args
        })
    },
    queryPropertyUnion(args) {
        return axios({
            method: Service.PROPERTY.methods.queryPropertyUnion,
            service: Service.PROPERTY.name,
            args: args
        })
    },
    listNextLevelUnforbidden(args) {
        return axios({
            method: Service.CONFIGURE.methods.listNextLevelUnforbidden,
            service: Service.CONFIGURE.name,
            args: args
        })
    },
    saveNodeProjectStatus(args){
        return axios({
            method: Service.TEMPLATE.methods.saveNodeProjectStatus,
            service: Service.TEMPLATE.name,
            args: args
        })
    },

    saveInstallQuota(args){
        return axios({
            method: Service.PSSET.methods.saveInstallQuota,
            service: Service.PSSET.name,
            args: args
        })
    },
    invalidInstallQuota(args){
        return axios({
            method:Service.PSSET.methods.invalidInstallQuota,
            service: Service.PSSET.name,
            args: args
        })
    }

}
