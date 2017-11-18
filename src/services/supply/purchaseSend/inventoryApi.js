import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
  query(args){
    return axios({
      method:Service.inventory.methods.orgQuery,
      service:Service.inventory.name,
      args:args
    })
  }
}