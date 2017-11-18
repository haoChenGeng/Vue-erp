import axios from 'src/utils/axios.js'
import Service from './Service.js'

//配送调度
export default {

    getScheduleOptions(args) {
        return axios({
            service: Service.DISTRIBUTION.name,
            method: Service.DISTRIBUTION.methods.getScheduleOptions,
            args: args
        })
    },
    planWorkerCreate(args){
    	return axios({
            service: Service.DISTRIBUTION.name,
            method: Service.DISTRIBUTION.methods.planWorkerCreate,
            args: args
        })
    },
    drawDeliverPlanView(args){
    	return axios({
            service: Service.DISTRIBUTION.name,
            method: Service.DISTRIBUTION.methods.drawDeliverPlanView,
            args: args
        })
    },
    makeDeliverPlan(args){
        return axios({
            service: Service.DISTRIBUTION.name,
            method: Service.DISTRIBUTION.methods.makeDeliverPlan,
            args: args
        })
    },
    getDeliverDispatchView(args){
         return axios({
            service: Service.DISTRIBUTION.name,
            method: Service.DISTRIBUTION.methods.getDeliverDispatchView,
            args: args
        })
    },
    uploadImgs(args){
         return axios({
            service: Service.DISTRIBUTION.name,
            method: Service.DISTRIBUTION.methods.uploadImgs,
            args: args
        })
    },
    validateDeliverPlan(args){
         return axios({
            service: Service.DISTRIBUTION.name,
            method: Service.DISTRIBUTION.methods.validateDeliverPlan,
            args: args
        })
    },
    updateStatusById(args){
        return axios({
            service: 'xHrIx1dVvYUyA7nsNrXJTPcYkDvghKh', //// /biz/t8t-ps-pim/app
            method: '_KIF5S-o7ELFnKN855ZIUYb-X-CM1O887mQtHJcJ5yW5CulH09WRVrbyK8w',//views.deliverInstallPlan.updateStatusById
            args: args
        })
    },
    exportDeliverInstallPlan(args){
        return axios({
            service: 'xHrIx1dVvYUyA7nsNrXJTPcYkDvghKh', //// /biz/t8t-ps-pim/app
            method: 'xNN8IeiGCu8EBA_NFN-CDfozMCcJ5DtdV0M9phFfRZXFXrn',//views.deliverInstallPlan.export
            args: args
        })
    }
}
