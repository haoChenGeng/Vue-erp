import axios from 'src/utils/axios.js'
import Service from './Service.js'

module.exports = {
    // 列表
    faqList(args)
    {
        return axios({
            service: Service.FAQ_MANAGE.name,
            method: Service.FAQ_MANAGE.methods.QUERY_PAGE,
            args: args
        })
    },
    // 获取辅助资料
    query_faq_property(args)
    {
        return axios({
            service: Service.FAQ_MANAGE.name,
            method: Service.FAQ_MANAGE.methods.QUERY_FAQ_PROPERTY,
            args: args
        })
    },
    // 获取详情
    getDetailById(args)
    {
        return axios({
            service: Service.FAQ_MANAGE.name,
            method: Service.FAQ_MANAGE.methods.DETAIL_BYID,
            args: args
        })
    }
}
