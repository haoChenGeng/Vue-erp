import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    getProcessDetailById(args){
        return  axios({
            method: Service.SURCHARGE.methods.GETPROCESSDETAILBYID,
            service: Service.SURCHARGE.name,
            args: args
        })
    },
    getDetailByProcessId(args){
        return  axios({
            method: Service.SURCHARGE.methods.GETDETAILBYPROCESSID,
            service: Service.SURCHARGE.name,
            args: args
        })
    },
    queryDetail(args){
        return  axios({
            method: Service.SURCHARGE.methods.QUERYDETAIL,
            service: Service.SURCHARGE.name,
            args: args
        })
    },
    queryPage(args){
        return  axios({
            method: Service.SURCHARGE.methods.QUERYPAGE,
            service: Service.SURCHARGE.name,
            args: args
        })
    },
    verify(args){
        return  axios({
            method: Service.SURCHARGE.methods.VERIFY,
            service: Service.SURCHARGE.name,
            args: args
        })
    },

}