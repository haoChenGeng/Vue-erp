import axios from 'src/utils/axios.js'
import goodsService from './goodsService.js'

export default {
    getDefault(args) {
        return axios({
            method: goodsService.goodsPack.methods.getDefault,
            service: goodsService.goodsPack.name,
            args: args
        })
    },
    isDuplicate(args) {
        return axios({
            method: goodsService.goodsPack.methods.isDuplicate,
            service: goodsService.goodsPack.name,
            args: args
        })
    },
    getVolume(args){
        return axios({
            method:goodsService.goodsPack.methods.getVolume,
            service:goodsService.goodsPack.name,
            args:args
        })
    },
    create(args){
        return axios({
            method:goodsService.goodsPack.methods.create,
            service:goodsService.goodsPack.name,
            args:args
        })
    },
    isUsedAsBarcode(args){
        return axios({
            method:goodsService.goodsPack.methods.isUsedAsBarcode,
            service:goodsService.goodsPack.name,
            args:args
        })
    },
    update(args){
        return axios({
            method:goodsService.goodsPack.methods.update,
            service:goodsService.goodsPack.name,
            args:args
        })
    },
    getById(args){
        return axios({
            method:goodsService.goodsPack.methods.getById,
            service:goodsService.goodsPack.name,
            args:args
        })
    },
    queryPage(args){
        return axios({
            method:goodsService.goodsPack.methods.queryPage,
            service:goodsService.goodsPack.name,
            args:args
        })
    },
    delete(args){
        return axios({
            method:goodsService.goodsPack.methods.delete,
            service:goodsService.goodsPack.name,
            args:args
        })
    },
    disable(args){
        return axios({
            method:goodsService.goodsPack.methods.disable,
            service:goodsService.goodsPack.name,
            args:args
        })
    },
    available(args){
        return axios({
            method:goodsService.goodsPack.methods.available,
            service:goodsService.goodsPack.name,
            args:args
        })
    },
    import(args){
        return axios({
            method:goodsService.goodsPack.methods.import,
            service:goodsService.goodsPack.name,
            args:args
        })
    },
    batchUpdate(args){
        return axios({
            method:goodsService.goodsPack.methods.batchUpdate,
            service:goodsService.goodsPack.name,
            args:args
        })
    },

}
