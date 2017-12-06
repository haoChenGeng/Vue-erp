import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
  cancel(args){
    return axios({
      method:Service.pickOrder.methods.cancel,
      service:Service.pickOrder.name,
      args:args
    })
  },
  cancel(args){
    return axios({
      method:Service.pickOrder.methods.cancel,
      service:Service.pickOrder.name,
      args:args
    })
  },
  queryShelvesDetail(args){
    return axios({
      method:Service.pickOrder.methods.queryShelvesDetail,
      service:Service.pickOrder.name,
      args:args
    })
  },
  confirmPickOrder(args){
    return axios({
      method:Service.pickOrder.methods.confirmPickOrder,
      service:Service.pickOrder.name,
      args:args
    })
  },
  confirmPick(args){
    return axios({
      method:Service.pickOrder.methods.confirmPick,
      service:Service.pickOrder.name,
      args:args
    })
  },
  
}