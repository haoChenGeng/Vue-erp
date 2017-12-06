/**
 * Created by tomy.li on 2017/5/3.
 * 组织机构
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    orgQueryPage(args) {
        return axios({
            method: Service.INVORGS.methods.orgQueryPage,
            service: Service.INVORGS.name,
            args: args
        })
    },
    orgQuery(args) {
        return axios({
            method: Service.INVORGS.methods.orgQuery,
            service: Service.INVORGS.name,
            args: args
        })
    },
    storageQuery(args) {
        return axios({
            method: Service.INVORGS.methods.storageQuery,
            service: Service.INVORGS.name,
            args: args
        })
    },
    goodsRecordList(args) {
        return axios({
            method: Service.INVORGS.methods.goodsRecordList,
            service: Service.INVORGS.name,
            args: args
        })
    },
    storageBinQuery(args) {
        return axios({
            method: Service.INVORGS.methods.storageBinQuery,
            service: Service.INVORGS.name,
            args: args
        })
    },
    statusQuery(args={}) {
        return axios({
            method: Service.INVORGS.methods.statusQuery,
            service: Service.INVORGS.name,
            args: args
        })
    },
}
