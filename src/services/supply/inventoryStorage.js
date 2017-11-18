import axios from 'src/utils/axios.js'
import Service from './purchase.js'

export default {

    queryInventoryStorage(args){
        return axios({
            method:Service.InventoryStorage.methods.inventoryStorageQuery,
            service:Service.InventoryStorage.name,
            args:args
        })
    }

}
