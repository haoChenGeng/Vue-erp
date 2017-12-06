import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default {
    concel(args) {
        return axios({
            method: Service.TRAFFICRECORD.methods.INVALID,
            service: Service.TRAFFICRECORD.name,
            args: args
        })
    },
    antiConcel(args){
         return axios({
            method: Service.TRAFFICRECORD.methods.VALID,
            service: Service.TRAFFICRECORD.name,
            args: args
        })
    },
    termination(args){
         return axios({
            method: Service.TRAFFICRECORD.methods.TERMINATION,
            service: Service.TRAFFICRECORD.name,
            args: args
        })
    },
    queryOne(args){
        return axios({
            method: Service.TRAFFICRECORD.methods.QUERYONE,
            service: Service.TRAFFICRECORD.name,
            args: args
        })
    },
    queryListWord(args)
    {
        return axios({
            method: Service.TRAFFICRECORD.methods.QUERY_LIST_WORD,
            service: Service.TRAFFICRECORD.name,
            args: args
        })
    },
    getContractUrl(args)
    {
        return axios({
            method: Service.TRAFFICRECORD.methods.GET_CONTRACT_URL,
            service: Service.TRAFFICRECORD.name,
            args: args
        })
    },
    getCode(args)
    {
        return axios({
            method: Service.SUPPLYSEVER.methods.CODEANDCODE,
            service: Service.SUPPLYSEVER.name,
            args: args
        })
    }

}