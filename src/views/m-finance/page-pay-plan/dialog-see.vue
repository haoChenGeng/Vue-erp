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
                <el-tabs v-model="activeTabTop">
                    <el-tab-pane label="基本信息" name="one">
                        <el-form :model="formData" ref="formRef" label-position="right" label-width="120px">
                            <div class="form-item-container">
                                <el-form-item label="财务组织：">
                                    <el-input v-model="formData.finOrgName" disabled></el-input>
                                </el-form-item>
                            </div>
                             <div class="form-item-container">
                                <el-form-item label="业务类型：">
                                    <el-input v-model="formData.bizName" disabled></el-input>
                                </el-form-item>
                            </div>
                             <div class="form-item-container">
                                <el-form-item label="款项用途：">
                                    <el-input v-model="formData.fundPurposeName" disabled></el-input>
                                </el-form-item>
                            </div>
                             <div class="form-item-container">
                                <el-form-item label="项目ID：">
                                    <el-input v-model="formData.projectId" disabled></el-input>
                                </el-form-item>
                            </div>
                             <div class="form-item-container">
                                <el-form-item label="应收金额：">
                                    <el-input v-model="formData.oughtAmount" disabled></el-input>
                                </el-form-item>
                            </div>
                             <div class="form-item-container">
                                <el-form-item label="已收金额：">
                                    <el-input v-model="formData.realAmount" disabled></el-input>
                                </el-form-item>
                            </div>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="其他信息" name="two">
                        <el-form :model="formData" ref="formRef2" label-position="right" label-width="120px">
                            <div class="form-item-container">
                                <el-form-item label="创建人：">
                                    <el-input v-model="formData.createName" disabled></el-input>
                                </el-form-item>
                            </div>
                             <div class="form-item-container">
                                <el-form-item label="创建时间：">
                                    <el-input :value="formData.createTime | toDate" disabled></el-input>
                                </el-form-item>
                            </div>
                             <div class="form-item-container">
                                <el-form-item label="修改人：">
                                    <el-input v-model="formData.updateName" disabled></el-input>
                                </el-form-item>
                            </div>
                             <div class="form-item-container">
                                <el-form-item label="修改时间：">
                                    <el-input :value="formData.updateTime | toDate" disabled></el-input>
                                </el-form-item>
                            </div>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <!-- 标签页区 -->
            <div class="full-dialog-tabs-container">
                <el-tabs v-model="activeTabName">
                    <el-tab-pane label="核销记录" name="one">
                       <div class="full-dialog-tabs-wrapper">
                           <t8t-table
                                :columns="columns"
                                :pageSize="pageSize"
                                :args="args"
                                :service="service"
                                :method="method"
                                :selectCol="selectCol"
                                :commonData="commonData"
                            >
                            <template slot="action" scope="scope">
                                <el-button type="mini" @click="viewDetail(scope.row['id'])">查看</el-button>
                            </template>
                            </t8t-table>
                       </div>
                    </el-tab-pane>
                    <el-tab-pane label="明细" name="two">
                        <div class="full-dialog-tabs-wrapper">
                            <t8t-table
                                :columns="columnsItem"
                                :pageSize="pageSize"
                                :args="argsItem"
                                :service="service"
                                :method="methodItem"
                                :selectCol="selectCol"
                            >
                            </t8t-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import api from 'src/utils/api'
import apiReceiptPlanOrder from 'src/services/finance/receiptPlanOrder.js'
import Service from 'src/services/finance/Service.js'
export default {
    name: 'page-pay-plan-see-dialog',
    data () {
        return {
            isLoading: false,
            isDialogShow: true,
            activeTabName: 'one',
            activeTabTop: 'one',
            formData: {},
            //表格
            columns: [{
                prop: 'code',
                label: '核销编号'
            }, {
                prop: 'verifyAmount',
                label: '核销金额'
            }, {
                prop: 'verifyStatus',
                label: '核销状态',
                list: 'verifyStatus'
            }, {
                prop: 'verifyName',
                label: '核销人'
            }, {
                prop: 'verifyTime',
                label: '核销日期',
                formatter: "dateParser"
            }, {
                prop: 'updateName',
                label: '修改人'
            }, {
                prop: 'updateTime',
                label: '修改日期',
                formatter: "dateParser"
            }, {
                prop: 'action',
                label: '操作'
            }],
            columnsItem: [{
                prop: 'sourceOrderName',
                label: '来源单据类型'
            }, {
                prop: 'sourceOrderCode',
                label: '来源单据号'
            }, {
                prop: 'oughtAmount',
                label: '应收金额',
            }, {
                prop: 'fundPurposeName',
                label: '款项用途'
            }],
            commonData: {
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
            pageSize: 20,
            //请求参数配置
            service: Service.RECEIPTPLANORDER.name,
            method: Service.RECEIPTPLANORDER.methods.VERIFY_ORDER_LEFT_JOIN_QUERY,
            args: {
                page:1,
                size:10,
                receiptPlanOrderId: null,
                sort: ['id_desc']
            },
            service: Service.RECEIPTPLANORDER.name,
            methodItem: Service.RECEIPTPLANORDER.methods.RECEIPT_PLAN_ORDER_ITEM_QUERY,
            argsItem: {
                page:1,
                size:10,
                receiptPlanOrderId: null,
                sort: ['id_desc']
            },
            selectCol: false
        }
    },
    created() {
        let id = parseInt(this.$route.query.rowId)
        this.getFormData(id)

        this.args.receiptPlanOrderId = id
        this.argsItem.receiptPlanOrderId = id
        this.args.sort = ['id_desc']
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
            apiReceiptPlanOrder.queryPage(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        this.formData = res.data.result.rows[0]
                    }
                })
        },
        //点击行的查看按钮
        viewDetail(id) {
            this.$router.push({path:'/finance/page-verify-cancel-record/see',query:{rowId:id}})
        }
    }
};
</script>

<style lang="css" scoped>
    .t8t-full-dialog{

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
    /* 顶部tab */
    .t8t-full-dialog .full-dialog-form-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .t8t-full-dialog .full-dialog-form-container .el-tabs__header {
        border-top: 0;
        border-bottom: 0;
    }
    /* 弹窗tab里面的表格定位 */
    .full-dialog-tabs-wrapper {
        display: flex;
        flex: 1;
        padding: 0 30px;
    }
</style>
