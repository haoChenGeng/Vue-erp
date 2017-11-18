import axios from 'src/utils/axios.js'
import goodsService from './goodsService.js'

export default {
    queryPage(args) {
        return axios({
            method: goodsService.goodsBarcode.methods.queryPage,
            service: goodsService.goodsBarcode.name,
            args: args
        })
    },
     update(args) {
        return axios({
            method: goodsService.goodsBarcode.methods.update,
            service: goodsService.goodsBarcode.name,
            args: args
        })
    },
    importUpdate(args) {
        return axios({
            method: goodsService.goodsBarcode.methods.importUpdate,
            service: goodsService.goodsBarcode.name,
            args: args
        })
    },
    generate(args) {
        return axios({
            method: goodsService.goodsBarcode.methods.generate,
            service: goodsService.goodsBarcode.name,
            args: args
        })
    },
    delete(args) {
        return axios({
            method: goodsService.goodsBarcode.methods.delete,
            service: goodsService.goodsBarcode.name,
            args: args
        })
    }


}