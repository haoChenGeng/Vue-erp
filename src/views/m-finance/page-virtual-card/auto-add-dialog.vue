<template>
    <div>
        <el-dialog title="自动导入" class="card-config-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="cardForm" @keyup.enter.native="btnOKClick()">
                <el-form-item  prop="bankAccount">
                    <el-select v-model="formData.bankAccount" @change="onCardChange(arguments[0])"  placeholder="--请选择主卡卡号--"  class="my-input">
                        <el-option v-for="items in commonOptionsConfig" :label="items.text" :value="items.text">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="财务组织:" >
                    {{mainCardInfo.orignizationName}}
                </el-form-item>
                <el-form-item label="银行类型:" >
                    {{mainCardInfo.bankName}}
                </el-form-item>
                <el-form-item label="登  录 名:" >
                  {{mainCardInfo.loginName}}
                </el-form-item>
                <el-form-item label="开户支行:" >
                    {{mainCardInfo.bankBranch}}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!editable">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Cookie from 'js-cookie'
    import apiVirtualCard from 'src/services/finance/virtualCard.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    export default {
        name: 'auto-add-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {

                },
                // 辅助资料配置
                commonOptionsConfig: [],
                // 主卡信息
                mainCardInfos: [],
                // 主卡项目
                mainCardInfo: {
                },
                // 表单
                formData: {
                    bankAccount: null,
                    loginName: null
                },
                isLoading: false,
                test(cardNum){
                    this.formData.bankAccount = cardNum
                    this.mainCardInfo = this.mainCardInfos.filter((val)=>{
                        return val === cardNum
                    })[0]                }
            }
        },
        props: ['rowId','editType','dialogTitle'],
        computed: {
            dialogVisible() {
                return true
            },
            editable() {
                return this.editType === 'see'
            }
        },
        created () {
            this.getBankAccountOptions()// 获取主卡卡号
            this.getBankAccountInfo()// 获取主卡信息
        },
        methods: {
            onCardChange(cardNum){
                this.formData.bankAccount = cardNum
                this.mainCardInfo = this.mainCardInfos.filter((val)=>{
                  return val.bankAccount === cardNum
                })[0]
            },
            btnOKClick() {
                this.$refs['cardForm'].validate(valid=>{
                    if (valid) {
                        var formData = Object.assign({},this.formData)
                        formData.loginName=this.mainCardInfo.loginName
                        var editType = this.editType
                        if (editType==='autoAdd') {
                            this.requestCMBCard(formData)
                        }
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$refs['cardForm'].resetFields()
                this.$emit('close')
            },
            // 获取主卡卡号
            getBankAccountOptions() {
                let arg =  {
                }
                let list = []
                apiVirtualCard.requestQuery(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                    list.push({
                                        value: item.id,
                                        text: item.bankAccount
                                    })
                            })
                            this.commonOptionsConfig= list
                        }
                    })
            },
            requestCMBCard(virtualCardRequest) {
                this.isLoading = true
                let args = {
                    virtualCardRequest: virtualCardRequest
                }
                apiVirtualCard.requestCMB(args)
                    .then((res) => {
                        this.isLoading = false
                        let addMessage=null
                        if (res.data.status === 200) {
                            let successSum = res.data.result.succNum
                            let failSum = res.data.result.failNum
                            let repeatNum=res.data.result.repeatNum
                            addMessage = '自动导入虚拟卡,成功' + successSum + '条，重复' + repeatNum + '条，失败'+failSum+'条'
                            this.$refs['cardForm'].resetFields()
                            this.$emit('close')
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: addMessage,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.$emit('getTableData')
                        }
                        else {
                            this.isLoading = false
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: res.data.status ==null ? "后台正在导入数据，请刷新页面更新":res.data.message,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.$emit('close')
                        }
                    })
            },
            getBankAccountInfo() {
                let self = this
                let bankAccount = this.formData.bankAccount
                let arg =  {
                    search:{
                        bankAccount:bankAccount
                    }
                }
                apiVirtualCard.requestQuery(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            self.mainCardInfos = res.data.result
                        }
                    })
            }
        }
    }

</script>

<style lang="css" scoped>
    .my-input{
        width:250px;
    }
</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
    .pay-dialog .el-dialog{
        width: 250px;
    }
    .pay-dialog .el-form-item__content {
        width: 250px;
    }
    .pay-dialog .el-select {
        width: 100%;
    }
</style>
