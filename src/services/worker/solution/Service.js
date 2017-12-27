/* 服务接口 */

const Services = {
    /* 签约管理 */
    SIGN_MANAGE: {
        // /biz/t8t-prs-ctm/app
        name: 'uWDqK_1fRdtf2T7mnBZmdX7zeCvpdLP',
        methods: {
            // views.contract.queryPage 列表接口
            CONTRACT_LIST: 'UtYdn97SyQqDki89jh7GljKNvitRpIGMcTq',
            // views.contract.getContractDetailById 详情接口
            CONTRACT_DETAIL_BY_ID: 'BO74vexPvMiP0ptLrOsS3SBMoG3beFzsq46b7Xw-1JwpDpzD186',
            // views.contract.submit 提交接口
            SUBMIT: 'y4-9Nk8lDwRU0yVbh2fKTDuQtpgv6.M',
            // views.contract.preview 预览接口
            PREVIEW: 'x36b2xNPCoKSCtGLir2nCtca5zp5.1DxFUQ',
            // views.contract.cancelContract 取消合同接口
            CANCEL_CONTRACT: 'fmq9dOdOEsM-9wfJlwwMgwY7duv4rAmS3MB1HN5tHSA',
            // views.contract.getSupplementaryAgreementInfo 获取补充协议信息
            COMPLEMENT_AGREEMENT: 'hnInpi5_AzI7swc6HOoL6Dya4Z5Wragh1zkObchg5JzgYKpQrFqKYUhiLYxMq9C',
            // views.contract.addContractImgAndConfirm 提交合同图片并修改合同为已签署状态接口
            CONFIRM_OFFLINE_SIGN: 'zP54udfWD6TJlRzavJuNHkEBqk12JSQwvs3rd5fxqzqv5ipuLb5C6fA',
            // views.contract.addContractInfo 补录合同接口
            COMPLEMENT_CONTRACT_INFO: 'x34S-wIdxcJ_0zad1yj8TCppq3hHAywJP3rLsljgptA',
        }
    },
    // 合同接口
    CONTRACT: {
        // /biz/t8t-sys-esm/app
        name: 'ZaoMvDiDgkgR5WWIEqkkB_xJgy9sPOS',
        methods: {
            // views.esm.can.createContract  判断是否成功发起合同
            CONTRACT_IS_SUCC: '1b6jygJhuasf9oZ6NuAe2JhwkikvbVEwIJCwmSmxQ-U',
            //views.new.sign.getPreviewContract 获取预览pdf
            GETPREVIEW:'7M00-WfNCGs3YyNh59WfM_FkVzaoM9IGMDId4T7OvYnluTK',

            //views.new.sign.getEsmPdfByContractCode 根据合同编号获取合同pdf
            getEsmPdfByContractCode:'lCtE4QpG3AWySXxZziOW21-j0Pq0lJujsyazvtMzUBQkFg86cpJ2hgK',
        }
    }
}

module.exports = Services
