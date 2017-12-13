import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {

    query(args){
         return axios({
            method: Service.PHOTOSHOW.methods.QUERY,
            service: Service.PHOTOSHOW.name,
            args: args
        })
    },   
    
    queryPhotoInfosById(args) {
        return axios({
            method: Service.PHOTOSHOW.methods.queryPhotoInfosById,
            service: Service.PHOTOSHOW.name,
            args: args
        })
    }, 
   
    

}
