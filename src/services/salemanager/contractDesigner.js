/**
 * 装修保合同相关
 */
import axios from 'src/utils/axios.js'
import Service from './contractDesigerService.js'
import contractServer from 'src/services/worker/solution/Service.js'
export default {
    //用户信息校验(三要素)
    validateUserInfo(projectId, uid, ownerName, ownerPhone, ownerIdNumber, ownerEmail, ownerBankNumber='', ownerId = ''){
        let args = {
            projectId:projectId,
            uid:+uid,
            ownerName: ownerName,
            ownerPhone: ownerPhone,
            ownerIdNumber: ownerIdNumber,
            ownerEmail: ownerEmail,
            ownerBankNumber: ownerBankNumber
        }
/*
        if( ownerBankNumber != '' ){
            args['ownerBankNumber'] = ownerBankNumber
        }*/
        if( ownerId != '' ){
            args['ownerId'] = ownerId
        }
        return new Promise((resolve,reject) => {
            //reject('校验失败')
            axios({
                service: Service.name,
                method: Service.methods.validateUserInfo,
                args:{checkOwnerDTO:args}
            }).then(res => {
                if( res.data.status == 200 ){
                    if( res.data.result == 1 ){
                        resolve(res.result)
                    }else{
                        reject('用户信息校验失败')
                    }

                }else{
                    reject(res.data.error || res.data.message || '用户信息校验出错')
                }
            }).catch(e => {
                reject('用户信息校验出错')
            })
        })
    },

    //用户信息校验(四要素)
    validateUserInfoFromBank(args) {
        return this.validateUserInfo(args)
    },

    //创建合同
    createContract(args){

        return new Promise((resolve,reject) => {
            //resolve('demotoken')
            axios({
                service: Service.name,
                method: Service.methods.createContract,
                args:{"contractCreateDTO":args}
            }).then(res => {
                if( res.data.status == 200 ){
                    resolve(res.data.result)
                }else{
                    reject(res.data.error || res.data.message || '保存合同出错')
                }
            }).catch(e => {
                reject('保存合同出错')
            })
        })
    },

    //获取合同详情
    getContractDetail(projectId){
        return new Promise((resolve,reject) => {
            axios({
                service: Service.name,
                method: Service.methods.getContractDetail,
                args:{projectId:projectId}
            }).then(res => {
                if( res.data.status == 200 ){
                    resolve(res.data.result)
                }else{
                    reject(res.data.error || res.data.message || '获取合同详情失败')
                }
            }).catch(e => {
                reject('获取合同详情失败')
            })
        })
    },

    //重新发起合同
    againCreateOrder(projectId, sourceProjectId, uid){
        return new Promise((resolve,reject) => {
            axios({
                service: Service.name,
                method: Service.methods.againCreateOrder,
                args:{
                    projectId:projectId,
                    sourceProjectId:sourceProjectId,
                    uid:uid
                }
            }).then(res => {
                if( res.data.status == 200 ){
                    //返回对象
                    resolve(res.data.result)
                }else{
                    reject(res.data.error || res.data.message || '重新发起合同失败')
                }
            }).catch(e => {
                reject('重新发起合同失败')
            })
        })
    },

    //合同图片综合获取 getImage
    getImage(projectId){
        return new Promise((resolve,reject) => {
            axios({
                service: Service.name,
                method: Service.methods.getImage,
                args:{projectId:projectId}
            }).then(res => {
                if( res.data.status == 200 ){
                    //返回对象
                    resolve(res.data.result)
                }else{
                    reject(
                        {
                            message: (res.data.error || res.data.message || '获取合同图片失败'),
                            //是否可以重新发起合同。 查询电子签合同异常,未发现有效的电子签合同时，允许重新发起，不然没法闭环
                            isCanReCreate: res.data.status == 205032
                        }
                    )
                }
            }).catch(e => {
                reject({
                    message: '获取合同图片失败',
                    isCanReCreate: false
                })
            })
        })
    },

    //合同预览
    preview(projectId){
        return new Promise((resolve,reject) => {
            axios({
                service: Service.name,
                method: Service.methods.preview,
                args:{projectId:projectId}
            }).then(res => {
                if( res.data.status == 200 ){
                    //返回图片相对地址
                    resolve(res.data.result)
                }else{
                    reject(res.data.error || res.data.message || '获取合同图片失败')
                }
            }).catch(e => {
                reject('获取合同图片失败')
            })
        })
    },

    //合同签署(装修公司)
    sign(sourceProjectId, projectId, uid){
        return new Promise((resolve,reject) => {
            axios({
                service: Service.name,
                method: Service.methods.sign,
                args:{sourceProjectId:sourceProjectId,projectId:projectId,uid:uid}
            }).then(res => {
                if( res.data.status == 200 ){
                    resolve()
                }else{

                    if( res.data.status == 200500 ){
                        reject(res.data.result || '合同签署失败')
                    }
                    if( res.data.status == 112007 ){
                        reject('装修公司实名认证有问题，请联系运营人员')
                    }
                    reject(res.data.error || res.data.message || '合同签署失败')
                }
            }).catch(e => {
                reject('合同签署失败')
            })
        })
    },

    //校验是否可发起合同
    checkCreate(projectId, sourceProjectId, uid){
        return new Promise((resolve,reject) => {
            axios({
                service: Service.name,
                method: Service.methods.checkCreate,
                args:{sourceProjectId:sourceProjectId,projectId:projectId,uid:uid}
            }).then(res => {
                if( res.data.status == 200 ){
                    resolve()
                }else{
                    if( res.data.status == 200500 ){
                        reject(res.data.result || '不能发起合同')
                    }
                    if( res.data.status == 112007 ){
                        reject('装修公司实名认证有问题，请联系运营人员')
                    }
                    reject(res.data.error || res.data.message || '不能发起合同')
                }
            }).catch(e => {
                reject('校验项目是否能发起合同失败')
            })
        })
    },

    //获得
    pingContractPdf(token){
            return axios({
                service: contractServer.CONTRACT.name,
                method: contractServer.CONTRACT.methods.GETPREVIEW,
                args:{token:token}
            })
    },

    //根据合同编号获取合同pdf
    getPdfByContractCode(code){
        return new Promise((resolve,reject) => {
            axios({
                service: contractServer.CONTRACT.name,
                method: contractServer.CONTRACT.methods.getEsmPdfByContractCode,
                args:{contractCode:code}
            }).then(res => {
                if( res.data.status == 200 ){
                    //返回的pdf，文件流？地址？
                    resolve(res.data.result)
                }else{
                    reject(res.data.error || res.data.message || '获取合同失败')
                }
            }).catch(e => {
                reject('获取合同失败')
            })
        })
    }


}
