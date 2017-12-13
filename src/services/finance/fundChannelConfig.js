import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    // 获取收款方式配置数据
    getReceiptChannelData(args) {
        return axios({
            service: Service.DEBITCHANNEL.name,
            method: Service.DEBITCHANNEL.methods.PAYMETHOD_QUERY,
            args: args
        })
    },
    // 获取付款方式配置数据
    getPayChannelData(args) {
        return axios({
            service: Service.FINA_PAY_METHOD_CONFIG.name,
            method: Service.FINA_PAY_METHOD_CONFIG.methods.QUERY,
            args: args
        })
    },
    // 新增资金渠道配置
    create(args) {
        return axios({
            service: Service.FUND_CHANNEL_CONFIG.name,
            method: Service.FUND_CHANNEL_CONFIG.methods.CREATE,
            args: args
        })
    },
    // 修改资金渠道配置
    update(args) {
        return axios({
            service: Service.FUND_CHANNEL_CONFIG.name,
            method: Service.FUND_CHANNEL_CONFIG.methods.UPDATE,
            args: args
        })
    },
    // 根据获取列表信息数据, 要传page、size分页
    getList(args) {
        return axios({
            service: Service.FUND_CHANNEL_CONFIG.name,
            method: Service.FUND_CHANNEL_CONFIG.methods.QUERY_PAGE,
            args: args
        })
    },
    // 获取数据，不需要传page、size，获取符合条件的所有数据
    getDataBySearch(args) {
        return axios({
            service: Service.FUND_CHANNEL_CONFIG.name,
            method: Service.FUND_CHANNEL_CONFIG.methods.QUERY,
            args: args
        })
    },
    // 批量更新状态
    batchUpdateStatus(args) {
        return axios({
            service: Service.FUND_CHANNEL_CONFIG.name,
            method: Service.FUND_CHANNEL_CONFIG.methods.UPDATE_STATUS,
            args: args
        })
    },
    // 获取密钥
    getChannelKey(args) {
        return axios({
            service: Service.FUND_CHANNEL_CONFIG.name,
            method: Service.FUND_CHANNEL_CONFIG.methods.QUERY_KEY,
            args: args
        })
    },
    // 添加支付订单
    payOrderCreate(args) {
        return axios({
            service: Service.FUND_CHANNEL_CONFIG.name,
            method: Service.FUND_CHANNEL_CONFIG.methods.PAYORDERCREATE,
            args: args
        })
    },
    // 查询支付订单
    queryPayOrderStatus(args) {
        return axios({
            service: Service.FUND_CHANNEL_CONFIG.name,
            method: Service.FUND_CHANNEL_CONFIG.methods.QUERY_ORDERSTATUS,
            args: args
        })
    },
    // 请求阿里
    queryAlipayCode(args) {
        return axios({
            service: Service.FUND_CHANNEL_CONFIG.name,
            method: Service.FUND_CHANNEL_CONFIG.methods.QUERY_ALIPAY_CODE,
            args: args
        })
    }

}
