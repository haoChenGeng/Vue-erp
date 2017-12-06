/*
 * 获取流程分类树列表
 * @param 
 * @param string 
 * @return array
 */

import axios from 'src/utils/axios.js'
import Service from './ldm.js'

export default{


    //异常管理创建
    exceptionCreate(args){
        return axios({
            method:Service.EXCEPTION.methods.CREATE,
            service:Service.EXCEPTION.name,
            args:args
        })
    },

    //异常管理修改
    exceptionUpdate(args){
        return axios({
            method:Service.EXCEPTION.methods.UPDATE,
            service:Service.EXCEPTION.name,
            args:args
        })
    },

    //异常管理详情
    findById(args){
        return axios({
            method:Service.EXCEPTION.methods.FINDBYID,
            service:Service.EXCEPTION.name,
            args:args
        })
    },

    //异常管理详情-任务单信息
    findDetailById(args){
        return axios({
            method:Service.EXCEPTION.methods.FINDDETAILBYID,
            service:Service.EXCEPTION.name,
            args:args
        })
    },

    //异常管理详情-附件信息
    findFileById(args){
        return axios({
            method:Service.EXCEPTION.methods.FINDFILEBYID,
            service:Service.EXCEPTION.name,
            args:args
        })
    },

    //异常管理详情-关闭异常
    closeException(args){
        return axios({
            method:Service.EXCEPTION.methods.CLOSE,
            service:Service.EXCEPTION.name,
            args:args
        })
    },

    //获取运单详情
    proxyOrderFindByNo(args){
        return axios({
            method:Service.EXCEPTION.methods.FINDBYNO,
            service:Service.EXCEPTION.name,
            args:args
        })
    },

    //获取任务单费用
    calculateExpense(args){
        return axios({
            method:Service.EXCEPTION.methods.CALCULATEEXPENSE,
            service:Service.EXCEPTION.name,
            args:args
        })
    },


}
