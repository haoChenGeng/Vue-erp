/**
 * Created by tomy.li on 2017/5/9.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default{
    //根据id查询详情
    getTempInfoById(id) {
        return axios({
            method: Service.template.methods.searchTemplate,
            service: Service.template.name,
            args: {"productPkgTemp":{'tempId':id}}
        })
    },
    //根据Code查询详情
    getTempInfoByCode(code) {
        return axios({
            method: Service.template.methods.searchTemplate,
            service: Service.template.name,
            args: {"productPkgTemp":{'tempCode':code}}
        })
    },
    getTempInfoByIds(ids) {
        return axios({
            method: Service.template.methods.searchTemplate,
            service: Service.template.name,
            args: {"productPkgTemp":{'tempIds':ids}}
        })
    },
    createTemp(args){
        return axios({
            method: Service.template.methods.createTemplate,
            service: Service.template.name,
            args: {'productPkgTemp':args}
        })
    },

    //更新报价模板。 模板头和模板行一起变更
    updateTemp(args, createTempItems = [], updateTempItems = []){
        let newArgs = Object.assign({},args);
        newArgs['createTempItems'] = createTempItems
        newArgs['updateTempItems'] = updateTempItems
        return axios({
            method: Service.template.methods.updateTemplate,
            service: Service.template.name,
            args: {'productPkgTemp':newArgs}
        })
    },

    //模板提交操作
    checkTemp(id, updateUser, effectTime){
        return axios({
            method: Service.template.methods.checkTemplate,
            service: Service.template.name,
            args: {'productPkgTemp':{'id':id,'updateUser':updateUser,'effectTime':effectTime}}
        })
    },

    //模板禁用操作
    disableTemp(tempIds,updateUser){
        return axios({
            method: Service.template.methods.forbiddenTemplate,
            service: Service.template.name,
            args: {'productPkgTemp':{'tempIds':tempIds,'updateUser':updateUser}}
        })
    },

    //模板复制操作
    copyTemp(id,createUser){
        return axios({
            method: Service.template.methods.copyTemplate,
            service: Service.template.name,
            args: {'id':id,'createUser':createUser}
        })
    },

    ///////模板行操作

    //提交行
    checkTempItem(ids, tempItemStatus, updateUser){
        //checkTempItem
        return axios({
            method: Service.tempItem.methods.checkTempItem,
            service: Service.tempItem.name,
            args: {'tempItem':{'ids':ids,'tempItemStatus':tempItemStatus,'updateUser':updateUser}}
        })
    },

    //禁用行
    forbiddenTempItems(ids, updateUser){
        return axios({
            method: Service.tempItem.methods.forbiddenTempItem,
            service: Service.tempItem.name,
            args: {'tempItem':{ids:ids,updateUser:updateUser }}
        })
    },

    //复制行
    copyTempItem(id, createUser){
        return axios({
            method: Service.tempItem.methods.copyTempItem,
            service: Service.tempItem.name,
            args: {id:id,createUser:createUser}
        })
    },

    //更新行
    updateTempItem(args){
        return axios({
            method: Service.tempItem.methods.updateTempItem,
            service: Service.tempItem.name,
            args: {'tempItem':args}
        })
    },

    //根据模板id查询模板行
    getTempItemsByTempId(id){
        return axios({
            method: Service.tempItem.methods.searchTempItemList,
            service: Service.tempItem.name,
            args: {'tempItem':{'tempId':id}}
        })
    },
    //根据模板Code查询模板行
    getTempItemsByTempCode(code){
        return axios({
            method: Service.tempItem.methods.searchTempItemList,
            service: Service.tempItem.name,
            args: {'tempItem':{'tempCode':code}}
        })
    },


    //项目排期模板
    getInfoQuotaion(moduleId, size = 1, page = 1, search = {}, sort = [], fields = []){
        return axios({
            method: Service.schedule.methods.getInfoQuotaion,
            service: Service.schedule.name,
            args: {
                'moduleId':moduleId,
                'size': size,
                'page': page
            }
        })
    },

    //按id查询项目排期模板信息
    queryModuleAndModuleItemById(moduleId, size = 1, page = 1, sort = []){
        return axios({
            method: Service.schedule.methods.queryModuleAndModuleItemById,
            service: Service.schedule.name,
            args: {
                'moduleId':moduleId,
                'size': size,
                'page': page
            }
        })
    }
}
