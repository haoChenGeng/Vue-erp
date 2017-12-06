import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
  queryList(args){
    return axios({
      method:Service.exhibition.methods.queryList,
      service:Service.exhibition.name,
      args:args
    })
  },
  commitOrder(args){
    return axios({
      method:Service.exhibition.methods.submitOrder,
      service:Service.exhibition.name,
      args:args
    })
  },
  cancelOrder(args){
    return axios({
      method:Service.exhibition.methods.cancelOrder,
      service:Service.exhibition.name,
      args:args
    })
  },
  findManagerByGroupId(id){
    return axios({
      method:Service.exhibition.methods.findManagerByGroupId,
      service:Service.exhibition.name,
      args:{orgId:id}
    })
  },
  findOrderById(args){
    return axios({
      method:Service.exhibition.methods.findOrderById,
      service:Service.exhibition.name,
      args:args
    })
  },
   cancelItems(args){
    return axios({
      method:Service.exhibition.methods.cancelItems,
      service:Service.exhibition.name,
      args:args
    })
  },
  deleteOrder(args) {
        return axios({
            method: Service.exhibition.methods.deleteOrder,
            service: Service.exhibition.name,
            args: args
        })
    },
  createSave(args) {
        return axios({
            method: Service.exhibition.methods.createSave,
            service: Service.exhibition.name,
            args: args
        })
  },
   createSubmit(args) {
        return axios({
            method: Service.exhibition.methods.createSubmit,
            service: Service.exhibition.name,
            args: args
        })
  },
  updateSave(args) {
        return axios({
            method: Service.exhibition.methods.updateSave,
            service: Service.exhibition.name,
            args: args
        })
  },
  updateSubmit(args) {
        return axios({
            method: Service.exhibition.methods.updateSubmit,
            service: Service.exhibition.name,
            args: args
        })
  },
  completeWorkFlow(args) {
        return axios({
            method: Service.exhibition.methods.completeWorkFlow,
            service: Service.exhibition.name,
            args: args
        })
  },
  showFlow(args) {
        return axios({
            method: Service.exhibition.methods.showFlow,
            service: Service.exhibition.name,
            args: args
        })
    },
  queryDispatchDetail(args) {
        return axios({
            method: Service.exhibition.methods.queryDispatchDetail,
            service: Service.exhibition.name,
            args: args
        })
    },
  queryUpDownDetail(args) {
        return axios({
            method: Service.exhibition.methods.queryUpDownDetail,
            service: Service.exhibition.name,
            args: args
        })
    },
  applyTransitionAllocate(args) {
        return axios({
            method: Service.exhibition.methods.applyTransitionAllocate,
            service: Service.exhibition.name,
            args: args
        })
    },
  downApplyDetail(args) {
        return axios({
            method: Service.exhibition.methods.downApplyDetail,
            service: Service.exhibition.name,
            args: args
        })
    },
  upApplyDetail(args) {
        return axios({
            method: Service.exhibition.methods.upApplyDetail,
            service: Service.exhibition.name,
            args: args
        })
    },
  upApply(args) {
        return axios({
            method: Service.exhibition.methods.upApply,
            service: Service.exhibition.name,
            args: args
        })
    },
  downApply(args) {
        return axios({
            method: Service.exhibition.methods.downApply,
            service: Service.exhibition.name,
            args: args
        })
    },

}