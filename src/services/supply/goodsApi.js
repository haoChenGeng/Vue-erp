import axios from 'src/utils/axios.js'
import goodsService from './goodsService.js'

export default {
    queryPage(args) {
        return axios({
            method: goodsService.goods.methods.queryPage,
            service: goodsService.goods.name,
            args: args
        })
    },
     queryPageGoodsUnion(args) {
        return axios({
            method: goodsService.goods.methods.queryPageGoodsUnion,
            service: goodsService.goods.name,
            args: args
        })
    },


}
