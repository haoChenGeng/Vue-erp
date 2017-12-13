import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    queryTreeByType(args) {
        return axios({
            method: Service.ORGANIZATION.methods.queryTreeByType,
            service: Service.ORGANIZATION.name,
            args: args
        })
    },
    queryItem(args) {
        return axios({
            method: Service.MEASURE.methods.queryItem,
            service: Service.MEASURE.name,
            args: args
        })
    },
    queryList(args) {
        return axios({
            method: Service.MEASURE.methods.queryList,
            service: Service.MEASURE.name,
            args: args
        })
    },
    queryDetail(args) {
        return axios({
            method: Service.MEASURE.methods.queryDetail,
            service: Service.MEASURE.name,
            args: args
        })
    },
    queryPage(args) {
        return axios({
            method: Service.MEASURE.methods.queryPage,
            service: Service.MEASURE.name,
            args: args
        })
    },
    verify(args) {
        return axios({
            method: Service.MEASURE.methods.verify,
            service: Service.MEASURE.name,
            args: args
        })
    },
    submitLine(args) {
        return axios({
            method: Service.MEASURE.methods.submitLine,
            service: Service.MEASURE.name,
            args: args
        })
    },
    submit(args) {
        return axios({
            method: Service.MEASURE.methods.submit,
            service: Service.MEASURE.name,
            args: args
        })
    },
    createOrder(args) {
        return axios({
            method: Service.MEASURE.methods.createOrder,
            service: Service.MEASURE.name,
            args: args
        })
    },
    queryProject(args) {
        return axios({
            method: Service.MEASURE.methods.queryProject,
            service: Service.MEASURE.name,
            args: args
        })
    },
    queryItemList(args) {
        return axios({
            method: Service.MEASURE.methods.queryItemList,
            service: Service.MEASURE.name,
            args: args
        })
    },
    getDetailByProcessId(args) {
        return axios({
            method: Service.MEASURE.methods.getDetailByProcessId,
            service: Service.MEASURE.name,
            args: args
        })
    },
    queryProperty(args) {
        return axios({
            method: Service.MEASURE.methods.queryProperty,
            service: Service.MEASURE.name,
            args: args
        })
    }
}
