import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default {

    /**
     * 变更单信息
     * @param projectId 项目id
     * @param accountId 用户id
     * @param id 变更单id 非必传， 比如变更单尚未第一次保存的时候
     */
    orderDetail: function (yid, accountId, id = null){
        return axios({
            service: Service.order.name,
            method: Service.order.methods.detailVerify,
            args: {
                "id": id,//变更单id
                "projectId":yid,//项目id
                "accountId": accountId
            }
        })
    },

    /**
     * 创建报价变更单
     * @param id 变更单头id
     * @param yid 项目ID
     * @param delVariationItemIds 变更单行删除id列表
     * @param variationOrderItemCreateDTOS 变更单上报数据list
     */
    create : function (id, yid, accountId, delVariationItemIds=[], variationOrderItems=[]){
        return axios({
            service: Service.order.name,
            method: Service.order.methods.create,
            args: {
                "dto":{
                    "id": id,
                    "yid":yid,
                    "delVariationItemIds": delVariationItemIds,
                    "variationOrderItems": variationOrderItems
                },
                "accountId": accountId

            }
        })
    },

    /**
     * 审核报价变更单
     * @param taskId
     * @param procInstId
     * @param accountId
     * @param comment
     * @param isPass 1同意， 2不同意
     */
    verify: function (taskId, procInsId, accountId, comment, isPass){
        let isPass_temp = isPass == 1 ? true : false
        let comment_temp = comment ? comment : ''
        return axios({
            service: Service.order.name,
            method: Service.order.methods.completeTask,
            args: {
                "req":{
                    "taskId":taskId,        //任务的id
                    "procInsId":procInsId,    //流程实例id
                    "executor":accountId,      //任务执行者id
                    "comment":comment_temp,        //流程处理过程中，对于该任务的评价，不仅限于同意/驳回
                    "biz":                  //业务数据
                        {
                            "deptLeaderApprove":isPass_temp,
                            "deptLeaderComment":comment_temp
                        },
                    "workflow":           //流程图内，需要用到的变量
                        {
                            "isPass":isPass_temp
                        }
                },

            }
        })
    },

    getQuoteOrderSpace: function (projectId){
        let list = []

        return new Promise((resolve, reject) => {
            axios({
                service: Service.order.name,
                method: Service.order.methods.getQuoteOrderSpace,
                args: {
                    "projectId": projectId,//变更单id
                }
            }).then(res => {
                if( res.data.status == 200 ){
                    res.data.result.forEach(item => {
                        list.push({
                            'text': item.spaceName+'/'+item.spaceAlias,
                            'value': item.id
                        })
                    })
                    resolve(list)
                }else{
                    reject(list)
                }
            }).catch(e => {
                reject(list)
            })
        })

    },

    /**
     * 提交变更单
     * @param id 变更单id
     * @returns {Promise}
     */
    submit: function (id, accountId){

        return new Promise((resolve, reject) => {
            axios({
                service: Service.order.name,
                method: Service.order.methods.submit,
                args: {
                    "id": id,//变更单id
                    "accountId": accountId
                }
            }).then(res => {

                //TODO 判断提交成功的逻辑
                if( res.data.status == 200 ){
                    resolve()
                }else{
                    reject(res.data.result || res.data.message || '提交失败')
                }
            }).catch(e => {
                reject('提交异常')
            })
        })

    },

    /**
     * 作废变更单
     * @param id 变更单id
     * @returns {Promise}
     */
    void: function (id, accountId){

        return new Promise((resolve, reject) => {
            axios({
                service: Service.order.name,
                method: Service.order.methods.VOID,
                args: {
                    "id": id,//变更单id
                    "accountId": accountId
                }
            }).then(res => {

                //TODO 判断提交成功的逻辑
                if( res.data.status == 200 ){
                    resolve()
                }else{
                    reject(res.data.result || res.data.message || '作废失败')
                }
            }).catch(e => {
                reject('作废出现异常')
            })
        })

    },

    /**
     * 反审核变更单
     * @param id 变更单id
     * @returns {Promise}
     */
    unSubmit: function (id, accountId){

        return new Promise((resolve, reject) => {
            axios({
                service: Service.order.name,
                method: Service.order.methods.unSubmit,
                args: {
                    "id": id,//变更单id
                    "accountId": accountId
                }
            }).then(res => {

                //TODO 判断提交成功的逻辑
                if( res.data.status == 200 ){
                    resolve()
                }else{
                    reject(res.data.result || res.data.message || '反审核失败')
                }
            }).catch(e => {
                reject('反审核出现异常')
            })
        })

    },

}
