/*
* 需求引入*/
import axios from 'src/utils/axios.js'
import Service from './needsManagementService.js'
export default {

    //引入需求
    importRequirement(operId) {
        return new Promise((resolve, reject) =>{
            axios({
                service: Service.name,
                method: Service.methods.importRequirement,
                args: {'operId':operId}
            }).then( res => {
                if( res.data.status == 200 ){
                    resolve(true)
                }else{
                    reject(res.data.result || res.data.message || '引入失败，请重试')
                }
            }).catch(e => {
                reject('引入失败，请重试')
            })
        })
    },

    //方案设置
    deleteRequirement(ids, operId) {
        return new Promise((resolve, reject) =>{
            axios({
                service: Service.name,
                method: Service.methods.deleteRequirement,
                args: {
                    ids:ids,
                    operId: operId
                }
            }).then( res => {
                if( res.data.status == 200 ){
                    resolve(true)
                }else{
                    reject(res.data.result || res.data.message || '删除失败，请重试')
                }
            }).catch(e => {
                reject('删除失败，请重试')
            })
        })
    },


    //方案设置
    materialPlanRequirementUpdate(orderBizTypes, updateUser) {
        return new Promise((resolve, reject) =>{
            axios({
                service: Service.name,
                method: Service.methods.materialPlanRequirementUpdate,
                args: {
                    "materialPlanRequirementDTO" :{
                        "orderBizTypes":orderBizTypes,
                        "updateUser":updateUser
                    }
                }
            }).then( res => {
                if( res.data.status == 200 ){
                    resolve(true)
                }else{
                    reject(res.data.result || res.data.message || '方案设置失败，请重试')
                }
            }).catch(e => {
                reject('方案设置失败，请重试')
            })
        })
    },

    getMaterialPlanRequirement(search){
        return new Promise((resolve, reject) =>{
            axios({
                service: Service.name,
                method: Service.methods.materialPlanRequirementQueryList,
                args: {search:search}
            }).then( res => {
                if( res.data.status == 200 ){
                    resolve(res.data.result)
                }else{
                    resolve([])
                }
            }).catch(e => {
                resolve([])
            })
        })
    }

}
