import axios from 'src/utils/axios.js'
import Service from './purchase.js'

export default {

    queryGoodsList(args){
        return axios({
            method:Service.Goods.methods.goodsQueryList,
            service:Service.Goods.name,
            args:args
        })
    }

}
