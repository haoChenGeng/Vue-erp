import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    voucherCreate (args) {
        return axios({
            method: Service.VOUCHER_ORDER.methods.ORDER_CREATE,
            service: Service.VOUCHER_ORDER.name,
            args: args
        })
    },
    exportItem (args) {
        return axios({
            method: Service.VOUCHER_ORDER.methods.ITEM_EXPORT,
            service: Service.VOUCHER_ORDER.name,
            args: args
        })
    },
    voucherInvalid(args){
        return axios({
            method: Service.VOUCHER_ORDER.methods.ORDER_INVALID,
            service: Service.VOUCHER_ORDER.name,
            args: args
        })
    },
    //凭证记账
    keepAccount(args){
        return axios({
            method: Service.VOUCHER_ORDER.methods.KEEP_ACCOUNT,
            service: Service.VOUCHER_ORDER.name,
            args: args
        })
    },
    // 创建凭证模板
    templateCreate(args){
        return axios({
            method: Service.VOUCHER_ORDER.methods.TEMPLATE_CREATE,
            service: Service.VOUCHER_ORDER.name,
            args: args
        })
    },
    //TEMPLATE_UPDATE 更新凭证模板
    templateUpdate(args){
        return axios({
            method: Service.VOUCHER_ORDER.methods.TEMPLATE_UPDATE,
            service: Service.VOUCHER_ORDER.name,
            args: args
        })
    },
    //查询模板分录
    templateEntryQuery(args){
        return axios({
            method: 'ZRfQQb0HZZHWBYVveK2YBQBUS8wbNkteXArHCqcUxQ5',
            service: Service.VOUCHER_ORDER.name,
            args: args
        })
    },
    // 查询凭证分录
    voucherEntryQuery(args){
        return axios({
            method: 'y-77GM5VB8niBdLMzc7K_D1dfigUsZdvB2i7ws-_6VY',
            service: Service.VOUCHER_ORDER.name,
            args: args
        })
    },
    // 查询模板辅助核算项
    templateAssistantQuery(args){
        return axios({
            method: 'KAwKSJhjWJ7Jy8TFuV2Kw-uyb6bHthg8-zcC7ihC_mOwUxfw_1l7suP9ltq',
            service: Service.VOUCHER_ORDER.name,
            args: args
        })
    },
    // 查询凭证辅助核算项
    voucherAssistantQuery(args){
        return axios({
            method: 'wpYr4xKTCEIyADHbO0tk7e2b8QJuunW29fs0KZpyAjxiqp4j96qeog9',
            service: Service.VOUCHER_ORDER.name,
            args: args
        })
    },

}
