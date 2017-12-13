import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
  check(args){
    return axios({
      method:Service.outStorage.methods.check,
      service:Service.outStorage.name,
      args:args
    })
  },
  cancel(args){
    return axios({
      method:Service.outStorage.methods.cancel,
      service:Service.outStorage.name,
      args:args
    })
  },
   delivery(args){
    return axios({
      method:Service.outStorage.methods.delivery,
      service:Service.outStorage.name,
      args:args
    })
  }, 
  delay(args){
    return axios({
      method:Service.outStorage.methods.delay,
      service:Service.outStorage.name,
      args:args
    })
  },
  updateDeliveryNum(args){
    return axios({
      method:Service.outStorage.methods.updateDeliveryNum,
      service:Service.outStorage.name,
      args:args
    })
  },
  queryOrderDetail(args){
    return axios({
      method:Service.outStorage.methods.queryOrderDetail,
      service:Service.outStorage.name,
      args:args
    })
  },
}