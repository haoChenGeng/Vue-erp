import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
  queryTemp(args){
    return axios({
      method:Service.org.methods.queryTemp,
      service:Service.org.name,
      args:args
    })
   },
   queryRootId(args){
    return axios({
      method:Service.org.methods.queryRootId,
      service:Service.org.name,
      args:args
    })
  }
}