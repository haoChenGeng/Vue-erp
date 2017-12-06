<template>
    <div>
        <el-dialog title="请选择收款方式" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth"
                     ref="payForm" @keyup.enter.native="btnOKClick()">
                <el-form-item  prop="partnerNo">
                <el-button size="large" type="primary" @click="abcPayPage" >农行POS机扫码</el-button>
            </el-form-item>
                <el-form-item  prop="alipay">
                    <el-button class="alipay-pay" size="large" type="primary" @click="aliPayPage" >支付宝扫码</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import ElButton from '../../../../node_modules/t8t-element-ui/packages/button/src/button'
    export default {
        components: {ElButton}, name: 'pay-dialog',
        data() {
            return {
                //表单
                formData: {
                    partnerNo: null
                },
                dialogVisible:true,
                isLoading: false
            }

        },
        props: ['rowId', 'editType', 'commonOptionsConfig'],
        computed: {
            dialogVisible() {
                return true
            },
            editable() {
                return this.editType === 'see'
            }
        },
        created () {
        },

        methods: {
            abcPayPage()
            {
                this.dialogVisible=false
                this.$router.push({path:'/finance/page-pay-plan/abcPay',
                            query:{
                                rowId:this.rowId,
                            }
                        })
            },
            aliPayPage()
            {
                this.dialogVisible=false
                this.$router.push({path:'/finance/page-pay-plan/aliPay',
                    query:{
                        rowId:this.rowId,
                    }
                })
            },
            // 取消按钮
            btnCancleClick() {
                this.$refs['payForm'].resetFields()
                this.$emit('close')

            },

            // 辅助资料
            getCommonOptions: function (fatherCode, selectName) {
                let arg = {
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
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                                ;
                            })
                            this.commonOptionsConfig[selectName] = list
                        }
                    })
            }
        }
    }

</script>

<style lang="css" scoped>
    .timeRange {
        width: 250px;
    }

    .box-card {
        width: 346px;
        margin-left: 25px;
    }


</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
    .pay-dialog .el-dialog {
        width: 450px;
    }
    .alipay-pay{
        width: 150px;
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
