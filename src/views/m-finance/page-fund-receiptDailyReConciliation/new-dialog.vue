<template>
    <div>
        <el-dialog title="手动拉取" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth"
                     ref="payForm" @keyup.enter.native="btnOKClick()">

                <el-form-item label="到账时间：" prop="reconciliationTimeRange" class="time">
                    <el-date-picker
                        v-model="formData.reconciliationTimeRange"
                        type="daterange"
                        placeholder="选择时间范围"
                        class="timeRange"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="商户编号：" prop="partnerNo">
                    <el-input v-model="formData.partnerNo" @blur="getChannelConfig"></el-input>
                </el-form-item>

                <el-card class="box-card">
                    <div>
                        财务组织：{{this.origanizationName}}



                    </div>
                    <br/>
                    <div>
                        资金渠道：{{this.channelName}}



                    </div>
                    <br/>
                    <div>
                        二级渠道：{{this.secondChannelName}}



                    </div>
                    <br/>
                    <div>
                        商户账号：{{this.account}}



                    </div>
                    <br/>
                    <div>
                        APPID：{{this.wechat_public}}



                    </div>

                </el-card>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>


        </el-dialog>
    </div>
</template>
<script>
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import  fundChannelConfig   from 'src/services/finance/fundChannelConfig.js'
    import   receiptDailyReConciliation  from 'src/services/finance/receiptDailyReConciliation.js'
    export default {
       name: 'pay-dialog',
        data() {
            return {
                maxTime: parseInt((new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()) / 1000) - 3600 * 24 + 86399,
                textDisplay: null,

                // reconciliationTimeRange: [new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime()-3600*1000*24,new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)-3600*1000*24],
                origanizationName: null,
                channelName: null,
                secondChannelName: null,
                account: null,
                wechat_public: null,
                textP: null,
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    partnerNo: [
                        {required: true, message: "请填写商户编号", trigger: 'change'}
                    ],
                    reconciliationTimeRange: [
                        {type: "array", required: true, message: "请填写到账时间", trigger: 'change'}
                    ],

                },

                descriptor: {
                    reconciliationTimeRange: {
                        type: "array", required: true, len: 2,
                        fields: {
                            0: {required: true, message: "请填写开始时间"},
                            1: {required: true, message: "请填写结束时间"}
                        }
                    }
                },
                //表单
                formData: {
                    partnerNo: null,
                    reconciliationTime_gte: null,
                    reconciliationTime_lte: null,
                    reconciliationTimeRange: [new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() - 3600 * 1000 * 24), new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() - 3600 * 1000 * 24)]
                },
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

            //点击确定后，发送参数去服务
            btnOKClick() {
                this.$refs['payForm'].validate(valid => {
                    if (valid) {
                        let formData = Object.assign({}, this.formData)
                        if (formData.reconciliationTimeRange[1] === null || formData.reconciliationTimeRange[0] === null) {
                            this.$message.error("时间区间不能为空")
                            return
                        } else {
                            formData.reconciliationTime_lte = parseInt(formData.reconciliationTimeRange[1].getTime() / 1000)
                            formData.reconciliationTime_gte = parseInt(formData.reconciliationTimeRange[0].getTime() / 1000)
                            let minusRe=formData.reconciliationTime_lte-formData.reconciliationTime_gte

                            if(minusRe>518400)
                            {
                                this.$message.error("时间区间请勿大于7天")
                                return
                            }
                            formData.reconciliationTime_lte = formData.reconciliationTime_lte + 86399
                        }

                        let bigtime = this.maxTime
                        if (formData.reconciliationTime_lte > bigtime) {
                            this.$message.error("请选择今日之前的日期")
                        } else {
                            let args = {
                                receiptDailyReConciliation: formData
                            }

                            this.isLoading = true
                            receiptDailyReConciliation.manuallyPull(args)
                                .then((res) => {

                                    let pullMessage = null
                                    if (res.data.status === 200) {

                                        let successSum = res.data.result.successSum
                                        let failSum = res.data.result.failNum
                                        pullMessage = '本次成功拉取记录' + successSum + '条，失败' + failSum + '条，'
                                        let showMessage = "失败的时间及原因如下："
                                        let firstMessage = null
                                        res.data.result.successResponse.forEach((item) => {
                                            console.log(item)
                                            if (item.failItem > 0) {
                                                firstMessage = firstMessage + item.time + "：" + item.message + '，'
                                            } else if (item.successItem === 0 && (item.message !== "成功" && item.message !== "入库解析失败")) {
                                                firstMessage = firstMessage + item.time + "：" + item.message + '，'
                                            }
                                        })

                                        if (firstMessage !== null) {
                                            firstMessage = firstMessage.toString().substring(4, firstMessage.toString().length - 1)
                                            pullMessage = pullMessage + showMessage + firstMessage
                                        }
                                        this.isLoading = false
                                        this.$msgbox({
                                            title: '拉取结果',
//                                                    type: 'success',
                                            message: pullMessage,
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                        this.$refs['payForm'].resetFields()
                                        this.$emit('close')
                                    } else {
                                        this.isLoading = false
                                        this.$message.error(res.data.message)
                                    }
                                })
                        }
                    }
                })
            },


            //取消按钮
            btnCancleClick() {
                this.$refs['payForm'].resetFields()
                this.$emit('close')
            },
            //获取渠道信息
            getChannelConfig()
            {
                let partnerNo = this.formData.partnerNo
                if (this.formData.partnerNo) {
                    let args = {
                        search: {
                            partnerNo: partnerNo,
                            channelType: 1
                        },
                        page: 1,
                        size: 10,
                        sort: ["id_desc"]
                    }
                    fundChannelConfig.getList(args)
                        .then((res) => {

                            if (res.data.status === 200 && res.data.result.rows) {
                                res.data.result.rows.forEach((item) => {
                                    this.origanizationName = item.origanizationName
                                    this.channelName = item.channelName
                                    this.secondChannelName = item.secondChannelName
                                    this.account = item.account
                                    this.wechat_public = item.wechatPublic
                                })
                            }
                        })
                } else {
                    this.origanizationName = null
                    this.channelName = null
                    this.secondChannelName = null
                    this.account = null
                    this.wechat_public = null
                }
            },

            //辅助资料
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
