/**
 * Created by tomy.li on 2017年6月1日19:21:59.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default{
    /**
     * 获取可用的子空间
     * @param tempId 报价模板id
     */
    getChildSpaces(tempId) {
        return axios({
            method: Service.order.methods.getChildSpaces,
            service: Service.order.name,
            args: {"quoteOrderSpaceSelcetDTO":{'tempId':tempId}}
        })
    },

    /**
     * 报价单信息（初始化）
     * @param yid 项目id
     * @param tempId 报价模板id
     * @param area 计价面积
     * @param houseTypeId 户型id
     */
    quoteOrderInfo(yid, tempId, area, houseTypeId, accountId) {
        return axios({
            method: Service.order.methods.quoteOrderInfo,
            service: Service.order.name,
            args: {"quoteOrderShowDTO":{'tempId':tempId,'yid':yid,'area':area,'houseTypeId':houseTypeId},accountId:accountId}
        })
    },

    /**
     * 根据模板及空间获取标准报价项
     * @param spaceId
     * @param tempId
     */
    getQuoteTempItemBySpace(spaceId, tempId) {
        return axios({
            method: Service.order.methods.getQuoteTempItemBySpace,
            service: Service.order.name,
            args: {"quoteOrderSpaceTempItemListDTO":{'tempId':tempId,'spaceId':spaceId}}
        })
    },

    /**
     * 根据模板获取<b>非</b>标准报价项
     * @param spaceId
     * @param tempId
     */
    getQuoteTempItemUnstandardByTempId(tempId) {
        return axios({
            method: Service.order.methods.getQuoteTempItemUnstandardByTempId,
            service: Service.order.name,
            args: {"quoteOrderSpaceTempItemListDTO":{'tempId':tempId}}
        })
    },

    //暂存报价单(新增及编辑)
    saveQuoteOrder(data, accountId) {
        return axios({
            method: Service.order.methods.saveQuoteOrder,
            service: Service.order.name,
            args: {"quoteOrderCreateDTO":data, accountId:accountId}
        })
    },

    //搜索sku
    selectionSku(gdmId, categoryId, orgId, queryField = {}, bomGdmId = 0){
        let args = {
            "orgId":orgId,
            "gdmId":gdmId,//组合用量id
            "categoryId": categoryId, //品类id
            "bomGdmId" : bomGdmId //父bom组件组合用量关系id
        }

        if( JSON.stringify(queryField) === "{}" ){

        }else{
            args.queryField = queryField
        }

        return axios({
            method: Service.order.methods.selectionSku,
            service: Service.order.name,
            args: args
        })
    },
    getSkuInfo(skuId){
        return axios({
            //TODO 获取sku信息接口补齐
            method: Service.order.methods.getSkuInfo,
            service: Service.order.name,
            args: {skuid:skuId}
        })
    },

    //提交报价单
    submitQuoteOrder(orderId, uid) {
        return axios({
            method: Service.order.methods.submitOrder,
            service: Service.order.name,
            args: {"quoteOrderSubmitDTO":{"orderId":orderId,"updateUser":uid}}
        })
    },


    /**
     * 新建报价单(重置)
     * @param orderId 报价单id
     * @param tempId 模板id
     */
    newCreateQuoteOrder(orderId, updateUser) {
        return axios({
            method: Service.order.methods.newCreate,
            service: Service.order.name,
            args: {"quoteOrderNewCreateDTO":{
                orderId : orderId, updateUser: updateUser
            }}
        })
    },

    previewQuoteOrder(orderId){
        return axios({
            service: Service.order.name,
            method:Service.order.methods.previewOrder,
            args:{
                'orderId' : orderId
            }
        })
    },

    /**
     * 订单（项目）id批量查询订单（项目）信息, @TODO 项目模块未上线，代码临时挂靠
     * @param ids
     */
    findOrderDetailByIds(ids){
        return axios({
            service: Service.project.name,
            method:Service.project.methods.findOrderDetailByIds,
            args:{
                'ids' : ids
            }
        })
    },

    /*
    * 初始化报价项信息
     *  */
    initQuoteOrderDetail(yid, tempId, area, houseTypeId, accountId){
        return new Promise( (resolve, reject ) =>{
            this.quoteOrderInfo(yid, tempId, area, houseTypeId, accountId).then((res) => {
                if( res.data.status == 200 ){
                    let quoteOrder = res.data.result.quoteOrder
                    if(!quoteOrder.hasOwnProperty('pkgPrice') || quoteOrder.pkgPrice <= 0){
                        reject({
                            'status': 1,
                            'message' : '未获取到项目标配套餐价'
                        })
                    }
                    resolve(res.data.result)
                }else{
                    reject({
                        'status' : 2,
                        'message' : res.data.result || '系统异常，请稍后重试'
                    })
                }
            }).catch(e => {
                reject({
                    'status' : 3,
                    'message' : '查询报价模板信息失败，请重试'
                })
            })
        })
    },

    /*
    * 初始化选品单信息*/
    initQuoteSelectionList(yid, accountId){

        return new Promise((resolve, reject) => {
            axios({
                method: Service.order.methods.quoteSelectionInfo,
                service: Service.order.name,
                args: {"yid":yid,"accountId":accountId}
            }).then(res => {
                if( res.data.status == 200 ){
                    resolve(res.data.result)
                }else{
                    reject(res.data.result || res.data.message || '查询失败')
                }
            }).catch(e => {
                reject('查询出错')
            })
        })
    },

    //保存选品单
    saveSelectionList(data,accountId){
        //dto
        return axios({
            method: Service.order.methods.saveSelectionList,
            service: Service.order.name,
            args: {"dto":data,"accountId":accountId}
        })
    },
    //提交选品单
    submitSelectionList(yid,accountId){
        return axios({
            method: Service.order.methods.submitSelectionList,
            service: Service.order.name,
            args: {"yid":yid,"accountId":accountId}
        })
    },

    //反审核报价单
    recheckQuoteOrder(orderId, uid) {
        return axios({
            method: Service.order.methods.recheckQuoteOrder,
            service: Service.order.name,
            args: {"quoteOrderSubmitDTO":{"orderId":orderId,"updateUser":uid}}
        })
    },

    //报价单和选品单同步报价模板, ID :报价单id accountId：操作人id
    syncTempToQuoteAndSelection(id, accountId){
        return new Promise( (resolve, reject) => {
            axios({
                method: Service.order.methods.syncTempToQuoteAndSelection,
                service: Service.order.name,
                args: {"id":id,"accountId":accountId}
            }).then(res => {
                if( res.data.status == 200 && res.data.result == 1 ){
                    resolve(true)
                }else{
                    reject(res.data.result || '同步失败， 请重试')
                }
            }).catch(e => {
                reject('同步失败， 请重试')
            })
        })
    },

    // 查询标准报价项 orderId:报价单id, orderSpaceId:报价单空间id
    getStandardQuoteItem(orderId, orderSpaceId){
        return axios({
            service: Service.order.name,
            method: Service.order.methods.getStandardQuoteItem,
            args: {"orderId":orderId, "orderSpaceId":orderSpaceId}
        })
    },
    // 查询个性化报价项 orderId:报价单id, orderSpaceId:报价单空间id
    getUnStandardQuoteItem(orderId, orderSpaceId){
        return axios({
            service: Service.order.name,
            method: Service.order.methods.getUnStandardQuoteItem,
            args: {"orderId":orderId, "orderSpaceId":orderSpaceId}
        })
    },



    // 保存新增的组合和明细 dto：保存对象；accountId:操作人
    insertSingeQuoteItemAndDosageDetail(dto, accountId){
        return new Promise((resolve, reject) => {
            axios({
                service: Service.order.name,
                method: Service.order.methods.insertSingeQuoteItemAndDosageDetail,
                args: {"dto":dto, "accountId":accountId}
            }).then(res => {
                if( res.data.status == 200 ){
                    resolve(true)
                }else{
                    reject(res.data.result || res.data.message || '新增组合失败，请重试')
                }
            }).catch(e =>{
                reject('新增组合失败，请重试')
            })
        })
    },

    // 批量新增报价单行包括用量明细 dto：保存对象；accountId:操作人
    insertQuoteItemAndDosageDetails(dto, accountId){
        return new Promise((resolve, reject) => {
            axios({
                service: Service.order.name,
                method: Service.order.methods.insertQuoteItemAndDosageDetails,
                args: {"dto":dto, "accountId":accountId}
            }).then(res => {
                if ( res.data.status == 200 ){
                    resolve(true)
                } else {
                    reject(res.data.result || res.data.message || '新增报价单行失败，请重试')
                }
            }).catch(e =>{
                reject('新增报价单行失败，请重试')
            })
        })
    },

    // 删除组合和明细 id：报价项id；accountId:操作人
    deleteQuoteDelivery(id, accountId){
        return new Promise((resolve, reject) => {
            axios({
                service: Service.order.name,
                method: Service.order.methods.deleteQuoteDelivery,
                args: {"id":id, "accountId":accountId}
            }).then(res => {
                if( res.data.status == 200 ){
                    resolve(true)
                }else{
                    reject(res.data.result || res.data.message || '删除组合失败，请重试')
                }
            }).catch(e => {
                reject('删除组合失败，请重试')
            })
        })
    },

    //删除标准报价项 ID :报价单项id accountId：操作人id
    deleteStandardQuoteItem(id, accountId){
        return new Promise((resolve, reject) => {
            axios({
                service: Service.order.name,
                method: Service.order.methods.deleteStandardQuoteItem,
                args: {"id":id,"accountId":accountId}
            }).then(res => {
                if( res.data.status == 200 ){
                    resolve(true)
                }else{
                    reject(res.data.result || res.data.message || '删除失败，请重试')
                }
            }).catch(e => {
                reject('出错，请重试')
            })
        })
    },

    changeQuoteStatus(orderId, orderStatus, accountId){
        return axios({
            method: Service.order.methods.changeQuoteStatus,
            service: Service.order.name,
            args: {"orderId":orderId, "orderStatus":orderStatus, "accountId":accountId}
        })
    }
}
