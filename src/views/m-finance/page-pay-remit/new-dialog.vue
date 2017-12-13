<template>
    <div>
        <el-dialog title="新建付款单" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="payForm" @keyup.enter.native="btnOKClick()">
                <el-form-item label="组织：" prop="organizationId">
                    <el-select v-model="formData.organizationId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.organizationCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务类型：" prop="businessTypeId">
                    <el-select v-model="formData.debitObjectId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.businessOptions" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款对象：" prop="payObjectId">
                    <el-select v-model="formData.payObjectId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.payObjOptions" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款对象ID：" prop="payObjectId">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="付款对象名称：" prop="debitTypeCodeId">
                    <el-input></el-input>
                </el-form-item>

                <el-form-item label="付款类型：" prop="payTypeCode">
                    <el-select v-model="formData.payTypeCode" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.payTypeCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="开户银行：" prop="bankId">
                    <el-select v-model="formData.bankId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.bankOptions" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="卡号：" prop="bankAccount">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="userName">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="付款金额：" prop="payAmount">
                    <el-input></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">提交</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
    </el-dialog>
    </div>
</template>
<script>
    import Cookie from 'js-cookie'
    import apiRemit from 'src/services/finance/payRemit.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'

    import payMethodCfg from 'src/services/finance/payMethodConfig.js'

    export default {
        name: 'pay-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    businessTypeId: [
                        {type: "number",required: true , message: "请选择业务类型",trigger: 'change'}
                    ],
                    debitObjectId: [
                        {type: "number",required: true , message: "请选择收款对象",trigger: 'change'}
                    ],
                    debitTypeCodeId: [
                        {type: "number",required: true , message: "请选择收款类型",trigger: 'change'}
                    ],
                    debitChannelId: [
                        {type: "number",required: true , message: "请选择收款方式",trigger: 'change'}
                    ],
                    organizationId: [
                        {type: "number",required: true , message: "请选择组织",trigger: 'change'}
                    ]
                },
                //辅助资料配置
//                commonOptionsConfig : {
//                    businessTypeCode: [],
//                    debitTypeCode: [],
//                    debitObjectCode: [],
//                    organizationCode: [],
//                    debitChannelCode: []
//                },
                //表单
                formData: {
                    id: null,
                    businessTypeId: null,
                    debitObjectId:  null,
                    debitTypeCodeId:  null,
                    organizationId:  null,
                    debitChannelId:  null,
                    status:  1,
                    createTime:  null,
                    createUser:  parseInt(Cookie.get('t8t-tc-uid')),
                    updateTime:  null,
                    updateUser:  null
                },
                isLoading: false
            }
        },
        props: ['rowId','editType','commonOptionsConfig'],
        computed: {
            dialogVisible() {
                return true
            },
            editable() {
                return this.editType === 'see'
            }
        },
        created () {
//            this.commonOptionsConfig.organizationCode = this.orgOptions
            this.getCommonOptions('11008','businessTypeCode')//业务类型


            //请求辅助资料配置
            this.getCommonOptions('61002','debitTypeCode')//收款类型
            this.getCommonOptions('61004','debitObjectCode')//收款对象



            // this.getCommonOptions('002002','organizationCode')//组织
            // 组织 allen.yao
//            commonApi.queryByFunctionCode({"funcCodes":["001004013","001004014"]})
//                .then((res => {
//                        let list = []
//                        if (res.data.status === 200) {
//                res.data.result.forEach((item) => {
//                    if (item.isDel===0) {
//                    list.push({
//                        value: item.id,
//                        text: item.name
//                    })
//                };
//            })
//                this.commonOptionsConfig['organizations'] = list
//            }
//        }))
            this.getCommonOptions('61001','debitChannelCode')//收款方式
        },
        methods: {
            btnOKClick() {
                let formData = Object.assign({},this.formData)
                this.addDebitWayAllot(formData)


                let args = {
                    auditorId: +Cookie.get('t8t-tc-uid'),
                    receiptOrderId: selectRow.receiptOrderId,
                    auditResult: 1
                }
                api.audit(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result === 1){
                            // 成功弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '审核成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        } else {
                            // 失败弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '审核失败，请重试。',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        }
                    })
            },
            btnCancleClick() {
                this.$refs['payForm'].resetFields()
                this.$emit('close')
            },
            addDebitWayAllot(debitWayDistribution) {
                this.isLoading = true
                apiRemit.addRemit({debitWayDistribution})
                .then((res) => {
                    this.isLoading = false
                    if (res.data.status === 200 && res.data.result ===1) {
                        this.$refs['payForm'].resetFields();
                        this.$emit('close')
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '新增成功',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.$emit('getTableData')
                    }
                    else {
                        this.isLoading = false
                        this.$message.error(res.data.message)
                    }
                })
            },
            updateDebitWayAllot(debitWayDistribution) {

                this.isLoading = true
                apiDebitWayDistribution.update({debitWayDistribution})
                .then((res) => {
                    this.isLoading = false
                    if (res.data.status === 200 && res.data.result ===1) {
                        this.$refs['payForm'].resetFields();
                        this.$emit('close')
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '编辑成功',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.$emit('getTableData')
                    }
                    else {
                        this.isLoading = false
                        this.$message.error(res.data.message)
                    }
                })
            },
            loadAllotFormData(args) {
                apiDebitWayDistribution.queryPage(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        this.formData =  res.data.result.rows[0]
                    }
                })
            },
            //辅助资料
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                apiCommon.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            };
                        })
                        this.commonOptionsConfig[selectName] = list
                    }
                })
            }
        }
    }

</script>

<style lang="css" scoped>
</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
.pay-dialog .el-dialog{
    width: 450px;
}
.pay-dialog .el-select-dropdown__wrap {
    max-height: 185px !important;
}
.pay-dialog .el-form-item__content {
    width: 250px;
}
.pay-dialog .el-select {
    width: 100%;
}
</style>
