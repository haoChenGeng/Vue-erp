/**
 * Created by tomy.li on 2017/5/9.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default{
    createPrice() {
        return axios({
            method: Service.price.methods.createPrice,
            service: Service.price.name,
            args: {"excelData":{}}
        })
    },

    submitPrice(args) {
        return axios({
            method: Service.price.methods.submitPrice,
            service: Service.price.name,
            args: {"tempPrice":args}
        })
    },

    searchPrice(args) {
        return axios({
            method: Service.price.methods.searchPrice,
            service: Service.price.name,
            args: {"tempPrice":args}
        })
    }
}
