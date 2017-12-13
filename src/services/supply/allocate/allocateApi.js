import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
  queryList(args){
    return axios({
      method:Service.allocate.methods.queryList,
      service:Service.allocate.name,
      args:args
    })
  },
  createSave(args){
    return axios({
      method:Service.allocate.methods.createSave,
      service:Service.allocate.name,
      args:args
    })
  },
  createCommit(args){
    return axios({
      method:Service.allocate.methods.createSubmit,
      service:Service.allocate.name,
      args:args
    })
  },
  commitOrder(args){
    return axios({
      method:Service.allocate.methods.submitOrder,
      service:Service.allocate.name,
      args:args
    })
  },
  cancelOrder(args){
    return axios({
      method:Service.allocate.methods.cancelOrder,
      service:Service.allocate.name,
      args:args
    })
  },
  findManagerByGroupId(id){
    return axios({
      method:Service.allocate.methods.findManagerByGroupId,
      service:Service.allocate.name,
      args:{orgId:id}
    })
  },
  findOrderById(args){
    return axios({
      method:Service.allocate.methods.findOrderById,
      service:Service.allocate.name,
      args:args
    })
  },
  updateSaving(args){
    return axios({
      method:Service.allocate.methods.updateSaving,
      service:Service.allocate.name,
      args:args
    })
  },
   updateSubmit(args){
    return axios({
      method:Service.allocate.methods.updateSubmit,
      service:Service.allocate.name,
      args:args
    })
  },
   cancelItems(args){
    return axios({
      method:Service.allocate.methods.cancelItems,
      service:Service.allocate.name,
      args:args
    })
  },
  completeWorkFlow(args) {
        return axios({
            method: Service.allocate.methods.completeWorkFlow,
            service: Service.allocate.name,
            args: args
        })
  },
  showFlow(args) {
        return axios({
            method: Service.allocate.methods.showFlow,
            service: Service.allocate.name,
            args: args
        })
    },
  deleteOrder(args) {
        return axios({
            method: Service.allocate.methods.deleteOrder,
            service: Service.allocate.name,
            args: args
        })
    },
  start(args) {
        return axios({
            method: Service.allocate.methods.start,
            service: Service.allocate.name,
            args: args
        })
    },
  singleStart(args) {
        return axios({
            method: Service.allocate.methods.singleStart,
            service: Service.allocate.name,
            args: args
        })
    },
  queryAcceptanceDetail(args) {
        return axios({
            method: Service.allocate.methods.queryAcceptanceDetail,
            service: Service.allocate.name,
            args: args
        })
    },
    acceptanceUpdate(args) {
        return axios({
            method: Service.allocate.methods.acceptanceUpdate,
            service: Service.allocate.name,
            args: args
        })
    },
    cancelPick(args) {
        return axios({
            method: Service.allocate.methods.cancelPick,
            service: Service.allocate.name,
            args: args
        })
    },


}