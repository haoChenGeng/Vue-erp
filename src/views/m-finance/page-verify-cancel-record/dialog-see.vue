<template>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog">
        <div class="t8t-full-dialog-container">
            <!-- 顶部按钮区 -->
            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                </div>
            </div>
            <!-- 表单区 -->
            <div class="full-dialog-form-container container-center">
                <el-form :model="formData" ref="formRef" label-position="right" label-width="120px">
                     <div class="form-item-container">
                        <el-form-item label="核销编号：">
                            <el-input v-model="formData.code" disabled></el-input>
                        </el-form-item>
                    </div>
                     <div class="form-item-container">
                        <el-form-item label="核销人：">
                            <el-input v-model="formData.verifyName" disabled></el-input>
                        </el-form-item>
                    </div>
                     <div class="form-item-container">
                        <el-form-item label="核销日期：">
                            <el-input :value="formData.verifyTime | toDate" disabled></el-input>
                        </el-form-item>
                    </div>
                     <div class="form-item-container">
                        <el-form-item label="核销金额：">
                            <el-input v-model="formData.verifyAmount" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="核销状态：">
                            <el-select v-model="formData.verifyStatus" placeholder="--请选择--" disabled>
                                <el-option v-for="item in commonFormData.verifyStatus" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <!-- 标签页区 -->
            <div class="full-dialog-tabs-container">
                <el-tabs v-model="activeTabName">
                    <el-tab-pane label="核销详情" name="one">
                       <div class="full-dialog-tabs-wrapper">
                           <t8t-table
                                ref="seeTable"
                                :columns="columns"
                                :isLoading ="isLoading"
                                :selectCol="selectCol"
                                :service="service"
                                :method="method"
                                :args="args"
                                :pageBar="false"
                                :commonData="commonData"
                                :indexCol="indexCol"
                            >
                            </t8t-table>
                           <div class="footer">
                                <div class="left">合计</div>
                                <div class="right1">{{sumPlan}}</div>
                                <div class="right2">{{sumBill}}</div>
                            </div>
                       </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import apiReceiptPlanOrder from 'src/services/finance/receiptPlanOrder.js'
import apiVerifyCancelRecord from 'src/services/finance/verifyCancelRecord.js'
import Service from 'src/services/finance/Service.js'
export default {
    name: 'verify-cancel-see-dialog',
    data () {
        return {
            isLoading: false,
            isDialogShow: true,
            activeTabName: 'one',
            formData: {},
            commonFormData: {
                verifyStatus: [
                        {
                            text: "未核销",
                            value: 1
                        },
                        {
                            text: "部分核销",
                            value: 2
                        },
                        {
                            text: "已核销",
                            value: 3
                        },
                        {
                            text: "作废",
                            value: 4
                        }
                    ]
            },
            //表格
            columns: [{
                prop: 'sourceOrderType',
                label: '类型',
                list: 'sourceOrderType'
            }, {
                prop: 'sourceCode',
                label: '单据编号'
            }, {
                prop: 'orderStatusName',
                label: '单据状态'
            }, {
                prop: 'planVerifyAmount',
                label: '收款计划单核销金额'
            }, {
                prop: 'receiptVerifyAmount',
                label: '收款单核销金额'
            }],
            commonData: {
                sourceOrderType: [
                    {
                        text: '收款计划单',
                        value: 1
                    },
                    {
                        text: '收款单',
                        value: 2
                    }
                ]
            },
            //table
            service: Service.VERIFYCANCELRECORD.name,
            method: Service.VERIFYCANCELRECORD.methods.VERIFY_ORDER_LEFT_JOIN_SOURCE,
            args: {
                verifyOrderId: null
            },
            selectCol: false,
            indexCol: true,
            sumPlan: 0,
            sumBill: 0
        }
    },
    created() {
        let id = parseInt(this.$route.query.rowId)
        this.getFormData(id)
        //获取表格数据
        this.args.verifyOrderId = id
        //提前列表请求合计字段
        this.getSums(this.args)
    },
    methods: {
        submitForm(formRef) {
            this.$refs[formRef].validate((isValid) => {
                if (!isValid) return false
                    this.isLoading = true
                    // 模拟请求
                    setTimeout(() => {
                        this.isLoading = false
                    }, 2000)
            })
        },
        closeDialog() {
            this.$router.go(-1)
        },
        getFormData(rowId) {
            let args = {
                search: {
                    id: rowId
                }
            }
            apiReceiptPlanOrder.verifyOrderQuery(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        this.formData = res.data.result.rows[0]
                    }
                })
        },
        getSums(args) {
            apiVerifyCancelRecord.verifyOrderLeftJoinSource(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        this.sumPlan = res.data.result.totalPlanVerifyAmount
                        this.sumBill = res.data.result.totalReceiptVerifyAmount
                    }
                })
        }
    }
};
</script>

<style lang="css" scoped>
    .footer{
        display: flex;
        height: 50px;
        -ms-align-items: center;
        align-items: center;
    }
    .footer .left{
        font-size: 14px;
        width: 46px;
        text-align: center;
        margin-right: 60%;
    }
    .footer .right1{
        font-size: 14px;
        width: 20%;
        padding-right: 46px;
        text-align: center;
    }
    .footer .right2{
        font-size: 14px;
        width: 20%;
        text-align: center;
    }
</style>
<style>
    .t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .t8t-full-dialog .t8t-table .table-container{
        margin-left: 0
    }
    .t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }
    .t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .t8t-full-dialog .toolbar-container .toolbar-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog .toolbar-container .toolbar-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
    }
    .t8t-full-dialog .form-item-container{
        width: 25%;
    }
    .t8t-full-dialog .full-dialog-form-container{
        margin-top: 22px;
    }
    .t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
/*        width: 1220px;
        margin: 0 auto;*/
    }
    .t8t-full-dialog .el-tab-pane{
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        overflow: auto;
    }
    /* 弹窗tab里面的表格定位 */
    .full-dialog-tabs-wrapper {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }
</style>
