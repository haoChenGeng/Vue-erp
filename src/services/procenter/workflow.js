/**
 * Created by organo.xia on 2017/5/11.
 */

import axios from 'src/utils/axios.js'
import Service from './Service.js'


export default {
    obtainCategory(args) {
        return axios({
            method: Service.WORKFLOW.methods.LISTPROCESSCATEGORY,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    queryProcess(args) {
        return axios({
            method: Service.WORKFLOW.methods.QUERYPROCESS,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    editProcess(args) {
        return axios({
            method: Service.WORKFLOW.methods.UPDATEPROCESS,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    createProcess(args) {
        return axios({
            method: Service.WORKFLOW.methods.INSERTPROCESS,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    toggleProcess(args) {
        return axios({
            method: Service.WORKFLOW.methods.DELPROCESS,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    findProcess(args) {
        return axios({
            method: Service.WORKFLOW.methods.GETONEPROCESS,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    getAllCategories(args) {
        return axios({
            method: Service.WORKFLOW.methods.GETCATEGORIES,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    createProcBpmInfo(args) {
        return axios({
            method: Service.WORKFLOW.methods.CREATEPROCBPMINFO,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    updateProcBpmInfo(args) {
        return axios({
            method: Service.WORKFLOW.methods.UPDATEPROCBPMINFO,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    getProcBpmInfos(args) {
        return axios({
            method: Service.WORKFLOW.methods.GETPROCBPMINFOS,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    getProcBpmInfoVersions(args) {
        return axios({
            method: Service.WORKFLOW.methods.GETPROCBPMINFOVERSIONS,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    updateRunBpm(args) {
        return axios({
            method: Service.WORKFLOW.methods.UPDATERUNBPM,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    outputProcInfo(args) {
        return axios({
            method: Service.WORKFLOW.methods.OUTPUTPROCINFO,
            service: Service.WORKFLOW.name,
            args: args
        })
    },
    //获取流程实例
    getProcessInsts(args) {
        return axios({
            service: Service.ProcessInsService.name,
            method: Service.ProcessInsService.methods.getProcessInsts,
            args: args
        })
    },

    //根据实例id获取业务key值
    getBusinessKeyByProcInsId(procInsId){
        return new Promise((resolve, reject) => {
            this.getProcessInsts({
                'query':{
                    "procInsId":procInsId,
                    'page':1,
                    'size':1
                }
            }).then(res => {
                if(res.data.status == 200){
                    if( res.data.result && res.data.result.result && res.data.result.result.length > 0 ){
                        resolve(res.data.result.result[0].businessKey)
                    }
                }else{
                    reject(0)
                }
            }).catch(e => {
                reject(0)
            })
        })

    }
}
