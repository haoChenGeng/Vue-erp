import axios from 'src/utils/axios.js'
import Service from './Service.js'

module.exports = {
    // 合同列表
    contractList(args)
    {
        return axios({
            method: Service.SIGN_MANAGE.methods.CONTRACT_LIST,
            service: Service.SIGN_MANAGE.name,
            args: args
        })
    },
    // 提交电子签
    createContract(args)
    {
        return axios({
            method: Service.SIGN_MANAGE.methods.SUBMIT,
            service: Service.SIGN_MANAGE.name,
            args: args
        })
    },
    // 详情接口
    contractDetail(args)
    {
        return axios({
            method: Service.SIGN_MANAGE.methods.CONTRACT_DETAIL_BY_ID,
            service: Service.SIGN_MANAGE.name,
            args: args
        })
    },
    // 预览接口
    preview(args)
    {
        return axios({
            method: Service.SIGN_MANAGE.methods.PREVIEW,
            service: Service.SIGN_MANAGE.name,
            args: args
        })
    },
    
    // pdf获取接口
    getPreview(args)
    {
        return axios({
            method: Service.CONTRACT.methods.GETPREVIEW,
            service: Service.CONTRACT.name,
            args: args
        })
    },
    // 取消合同
    cancel(args)
    {
        return axios({
            method: Service.SIGN_MANAGE.methods.CANCEL_CONTRACT,
            service: Service.SIGN_MANAGE.name,
            args: args
        })
    },
    // 获取补充协议信息
    getComplementAgreementInfo(args)
    {
        return axios({
            method: Service.SIGN_MANAGE.methods.COMPLEMENT_AGREEMENT,
            service: Service.SIGN_MANAGE.name,
            args: args
        })
    },
    // 线下合同签署确认(上传合同图片)
    confirmOfflineSign(args)
    {
        return axios({
            method: Service.SIGN_MANAGE.methods.CONFIRM_OFFLINE_SIGN,
            service: Service.SIGN_MANAGE.name,
            args: args
        })
    },
    // 合同是否创建成功
    checkIsCreateContract(args)
    {
        return axios({
            method: Service.CONTRACT.methods.CONTRACT_IS_SUCC,
            service: Service.CONTRACT.name,
            args: args
        })
    },
    // 补录合同
    complementContractInfo(args)
    {
        return axios({
            method: Service.SIGN_MANAGE.methods.COMPLEMENT_CONTRACT_INFO,
            service: Service.SIGN_MANAGE.name,
            args: args
        })
    }
    //预览合同
}
