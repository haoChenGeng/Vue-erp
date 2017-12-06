<template>
    <div style="height: 100%">
        <div id="div_print"  style="width:750px; height: 100%;" >
            <div style="width:750px; border:1px solid gray; padding:20px; height: 80%">
                <div style="text-align: right;font-size:14px">
                    协议编号：
                    <label style="text-align: right;font-size:14px" id="agreement_num">{{this.contractCode}}</label>
                </div>
                <div style="font-weight:800;margin:10px auto;text-align: center;font-size:21px">补充协议</div>
                <table class="table" id="print_table"
                    style="padding: 20px; font-size: 14px; margin-bottom: 20px;display: table;border-collapse: collapse;border-spacing: 0;"
                >
                    <tr>
                        <td style="font-size:14px; padding: 20px; line-height: 25px;" colspan="2">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;经甲乙双方协商决定，甲方如通过转账方式支付主合同约定的相关款项，需支付至乙方以下银行账户。
                            甲方如未按协议约定，将款项支付至非乙方公司账户或乙方其他账户，造成损失的，乙方不承担任何责任。账户信息如有变更，乙方将提前知会甲方。
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-size:14px; padding: 20px;">乙方</td>
                    </tr>
                    <tr>
                        <td style="font-size:14px; padding: 20px;" colspan="2">
                            <span style="line-height: 25px;">收款账户：<label style="text-decoration: underline;font-size:14px;" id="subcompany2">{{complementAgreementInfo.orignizationName}}</label></span><br/>
                            <span style="line-height: 25px;">收款账号：<label style="text-decoration: underline;font-size:14px;" id="card_no">{{complementAgreementInfo.virtualCard}}</label></span><br/>
                            <span style="line-height: 25px;">开 户 行：<label style="text-decoration: underline;font-size:14px;" id="bank_addr">{{complementAgreementInfo.bankBranch}}</label></span><br/>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-size:14px; padding: 20px;">甲方</td>
                    </tr>
                    <tr>
                        <td style="font-size:14px; padding: 20px 20px 280px 20px;" colspan="2">
                            <span style="line-height: 25px;">项目ID：<label style="text-decoration: underline;font-size:14px;">{{complementAgreementInfo.projectId}}</label></span><br/>
                            <span style="line-height: 25px;">预留手机号：<label style="text-decoration: underline;font-size:14px;">{{ownerPhone}}</label></span><br/>
                            <span style="line-height: 25px;">项目地址：<label style="text-decoration: underline;font-size:14px;">{{projectAddress}}</label></span><br/>
                        </td>
                    </tr>
                    <tr>
                        <td style="width:50%;font-size:14px; padding: 20px;"><label style="margin-top: 25px;">甲方：</label></td>
                        <td style="width:50%;font-size:14px; padding: 20px;"><label style="margin-top: 25px;">乙方：</label><img style="position: absolute;z-index:50;" src="./img/finance.png" width="200px" height="142px"></td>
                    </tr>
                    <tr>
                        <td style="width:50%;font-size:14px; padding: 20px;">
                            日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
                        </td>
                        <td style="width:50%;font-size:14px; padding: 20px;">
                            日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
                        </td>
                    </tr>
                </table>
            </div>
        </div>

    </div>
</template>

<script>
    import Api from 'src/services/worker/solution/signManage.js'

    export default {
        name: 'complement-agreement',
        data() {
            return {
                complementAgreementInfo: {
                    bankBranch: null,
                    bussinessType: null,
                    customerId: null,
                    orignizationName: null,
                    projectId: null,
                    virtualCard: null,
                    flag: false
                }
            }
        },
        props: {
            projectId: {
                type: Number,
                default: 0
            },
            contractCode: {
                type: String,
                default: ''
            },
            ownerPhone: {
                type: String,
                default: ''
            },
            projectAddress: {
                type: String,
                default: ''
            },
        },
        watch: {
            flag(val) {
                if (val) {
                    this.getComplementAgreementInfo()
                }
            },
        },
        computed: {
            flag() {
                return this.projectId && this.contractCode
            }
        },
        methods: {
            getComplementAgreementInfo()
            {
                let args = {
                    projectId: this.projectId
                }
                Api.getComplementAgreementInfo(args)
                    .then(res => {
                        if (res.data.status === 200) {
                            this.complementAgreementInfo = res.data.result
                        }
                        else {
                            this.complementAgreementInfo = {}
                        }
                    })
            }
        }
    }
</script>

<style lang="css">

</style>
