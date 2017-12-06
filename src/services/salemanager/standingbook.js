import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
    getClientManager (args) {
        return axios({
            service: Service.STANDINGBOOK.name,
            method: Service.STANDINGBOOK.methods.GETCLIENTMANAGER,
            args: args
        })
    }
}
