import axios from 'src/utils/axios.js'
import goodsService from './goodsService.js'

export default {
    importTopcoatColor(args) {
        return axios({
            method: goodsService.goodsTopcatColor.methods.importTopcoatColor,
            service: goodsService.goodsTopcatColor.name,
            args: args
        })
    },
     queryPageTopcoatColor(args) {
        return axios({
            method: goodsService.goodsTopcatColor.methods.queryPageTopcoatColor,
            service: goodsService.goodsTopcatColor.name,
            args: args
        })
    },
    add(args) {
        return axios({
            method: goodsService.goodsToningFee.methods.add,
            service: goodsService.goodsToningFee.name,
            args: args
        })
    },
     del(args) {
        return axios({
            method: goodsService.goodsToningFee.methods.del,
            service: goodsService.goodsToningFee.name,
            args: args
        })
    },
    queryPageTongingFee(args) {
        return axios({
            method: goodsService.goodsToningFee.methods.queryPageTongingFee,
            service: goodsService.goodsToningFee.name,
            args: args
        })
    },
     update(args) {
        return axios({
            method: goodsService.goodsToningFee.methods.update,
            service: goodsService.goodsToningFee.name,
            args: args
        })
    }


}
