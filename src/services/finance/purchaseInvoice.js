import axios from 'src/utils/axios.js'
import Service from './Service.js'
import supplyService from '../supply/Service.js'

export default {
    //采购发票分页查询
    invoiceQuery(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_QUERY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //采购发票单项查询
    invoiceItemQuery(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_ITEM_QUERY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //根据单个ID查询发票信息
    invoiceFindById(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_FIND_BY_ID,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //查询发票单的头跟项
    invoiceDetailQuery(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_DETAIL_QUERY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //采购发票暂存（手动新增）
    invoiceManualTransit(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_MANUAL_TRANSIT,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //采购发票提交接口（手动新增）
    invoiceManualSubmit(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_MANUAL_SUBMIT,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //采购发票暂存（参照对账单新增）
    invoiceDependTransit(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_DEPEND_TRANSIT,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //采购发票提交接口（参照对账单新增）
    invoiceDependSubmit(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_DEPEND_SUBMIT,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },

    //采购发票作废接口
    invoiceDisuse(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_DISUSE,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },

    //采购发票审核接口
    invoiceStartAudit(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_START_AUDIT,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },

    //批量提交
    invoiceBatchSubmit(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_BATCH_SUBMIT,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },

    //采购发票反审核接口
    invoiceAntiAudit(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_ANTI_AUDIT,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },

    //采购发票红冲接口
    invoiceNeutralize(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_NEUTRALIZE,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },

    //手动核销查询对账单信息
    reconBeforeVerifyQuery(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.RECON_BEFORE_VERIFY_QUERY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //手动核销
    manualVerify(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.MANUAL_VERIFY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //判断采购发票是否可以核销
    invoiceCanNeutralize(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_CAN_NEUTRALIZE,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //参照对账单新增查询
    invoiceCreateByReconQuery(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_CREATE_BY_RECON_QUERY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },

    //参照对账单新增查询
    invoiceWorkFlowQuery(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_WORK_FLOW_QUERY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },

    sendPurchaseInvoiceToCloud(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.INVOICE_SEND_TO_CLOUD,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },

    /****************采购核销单****************/
    //采购核销单
    verifyOrderQuery(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.VERIFY_ORDER_QUERY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //采购核销单根据ID查询单据信息
    verifyOrderFindById(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.VERIFY_ORDER_FIND_BY_ID,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //采购核销单查询单项信息
    verifyOrderFindItemQuery(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.VERIFY_ORDER_FIND_ITEM_QUERY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //采购核销单反核销
    andiVerify(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.ANTI_VERIFY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //查询核销单项细节接口
    verifyDetailQuery(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.VERIFY_DETAIL_QUERY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },

    /****************入库调整单****************/
    //入库调整单
    adjustOrderQuery(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.ADJUST_ORDER_QUERY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //入库调整单根据ID查询单据信息
    adjustOrderFindById(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.ADJUST_ORDER_FIND_BY_ID,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },
    //入库调整单查询单项信息
    adjustOrderItemQuery(args) {
        return axios({
            method: Service.PURCHASE_INVOICE.methods.ADJUST_ORDER_ITEM_QUERY,
            service: Service.PURCHASE_INVOICE.name,
            args: args
        })
    },


}
