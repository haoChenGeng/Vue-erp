import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {

    queryPage(args) {
        return axios({
            method: Service.INVENTORY_ACCOUNTING.methods.goodsCostPriceQueryPage,
            service: Service.INVENTORY_ACCOUNTING.name,
            args: args
        })
    }
}
