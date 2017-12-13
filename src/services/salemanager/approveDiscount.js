import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default {
    /* 根据Yid获取项目信息 */
    findItemInfoByYid(args)
    {
        return axios({
            method: Service.DISCOUNT_APPROVE_BILLS.methods.GET_DECORATION_ORDERINFO,
            service: Service.DISCOUNT_APPROVE_BILLS.name,
            args: args
        })
    },
    /* 创建优惠审批单 */
    createApprove(args)
    {
        return axios({
            method: Service.DISCOUNT_APPROVE_BILLS.methods.CREATE,
            service: Service.DISCOUNT_APPROVE_BILLS.name,
            args: args
        })
    },
    /* 更新优惠审批单 */
    updateApprove(args)
    {
        return axios({
            method: Service.DISCOUNT_APPROVE_BILLS.methods.UPDATE_SAVE,
            service: Service.DISCOUNT_APPROVE_BILLS.name,
            args: args
        })
    },
    /* 获取单个优惠审批单信息 */
    findApproveOrderById(args)
    {
        return axios({
            method: Service.DISCOUNT_APPROVE_BILLS.methods.GET_ORDERINFO_BYID,
            service: Service.DISCOUNT_APPROVE_BILLS.name,
            args: args
        })
    },
    /* 编辑-提交审核、接入审核流程 */
    updateSubmit(args)
    {
        return axios({
            method: Service.DISCOUNT_APPROVE_BILLS.methods.UPDATE_SUBMIT,
            service: Service.DISCOUNT_APPROVE_BILLS.name,
            args: args
        })
    },
    /* 新增-提交审核、接入审核流程 */
    createSubmit(args)
    {
        return axios({
            method: Service.DISCOUNT_APPROVE_BILLS.methods.CREATE_SUBMIT,
            service: Service.DISCOUNT_APPROVE_BILLS.name,
            args: args
        })
    },
    /* 优惠审批单列表 */
    listApproveOrder(args)
    {
        return axios({
            method: Service.DISCOUNT_APPROVE_BILLS.methods.QUERY_PAGE,
            service: Service.DISCOUNT_APPROVE_BILLS.name,
            args: args
        })
    },
    /* 审批通过 */
    verifyProcess(args)
    {
        return axios({
            method: Service.DISCOUNT_APPROVE_BILLS.methods.VERIFY_PROCESS,
            service: Service.DISCOUNT_APPROVE_BILLS.name,
            args: args
        })
    },
    /* 审批驳回 */
    rejectProcess(args)
    {
        return axios({
            method: Service.DISCOUNT_APPROVE_BILLS.methods.REJECT_PROCESS,
            service: Service.DISCOUNT_APPROVE_BILLS.name,
            args: args
        })
    }
}
