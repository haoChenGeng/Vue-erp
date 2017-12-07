<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">

                    </div>
                </div>
                <!-- 收缩按钮 -->
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-tabs v-model="activeInputTabName">
                            <el-tab-pane label="基本信息" name="basic">
                                <el-form
                                    class="dialog2-form-container"
                                    :model="formData"
                                    :rules="formRule"
                                    ref="formBasic"
                                    label-position="right"
                                    label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="单据编号：">
                                            <el-input v-model="formData.code" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <div class="dialog2-form-item-container">
                                            <el-form-item label="记账日期：">
                                                <t8t-datetime-picker :bindValue="formData.recordTime" type="date" :disabled="true">
                                                </t8t-datetime-picker>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="调整类型：">
                                            <el-select v-model="formData.adjustType" placeholder="--请选择--" :disabled="true">
                                                <el-option v-for="item in commonData.adjustType" :label="item.text" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>

                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="供应商：">
                                            <el-input v-model="formData.shopName" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="状态：">
                                            <el-select v-model="formData.orderStatus" placeholder="--请选择--" :disabled="true">
                                                <el-option v-for="item in commonData.orderStatus" :label="item.text" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="来源单据号：">
                                            <el-input v-model="formData.verifyOrderCode" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="调整金额(不含税）：">
                                            <el-input v-model="formData.notaxAdjustAmount" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="财务组织：">
                                            <el-input v-model="formData.orgName" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="其他信息" name="other">
                                <el-form
                                    class="dialog2-form-container"
                                    :model="formData"
                                    :rules="formRule"
                                    ref="formBasic"
                                    label-position="right"
                                    label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="创建人：">
                                            <el-input v-model="formData.createName" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="创建日期：">
                                            <t8t-datetime-picker :bindValue="formData.createTime" type="datetime" :disabled="true">
                                            </t8t-datetime-picker>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <invoice-table
                            :dataSource="dataSource"
                            :columns="columns"
                            ref="t8tTable"
                            :editable="editForm"
                            @totalTaxAmount="updateTotalTaxAmount"
                        >
                        </invoice-table>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>

    <!-- 另一个el-dialog放这里 -->
</template>

<script>
    import * as Config from './config'

    import Cookie from 'js-cookie'
    import InvoiceTable from './invoice-table.vue'

    import PurchaseInvoice from 'src/services/finance/purchaseInvoice.js'

    export default {

        name: 'page-purchase-invoice-dialog',
        components: {
            InvoiceTable
        },
        beforeCreate() {

        },
        mounted(){

        },
        computed: {
            dialogVisible() {
                return true
            },
            editable() {
                return this.editType === 'see'
            }
        },
        created() {
            this.getDefaultData(this.id);
        },
        data () {
            return {
                isTopHide:false,
                invoiceId:null,
                editForm: false,
                isDialogShow: true,
                isLoading: false,
                activeInputTabName: 'basic',
                //辅助资料配置
                commonData: {
                    adjustType: Config.selectSource.adjustType,
                    orderStatus: Config.selectSource.orderStatus,
                },
                formData: {
                    //基本信息
                    code: null,
                    recordTime: null,
                    adjustType:null,
                    shopName: null,
                    orderStatus: null,//单据状态|1-已审核 2-已作废
                    verifyOrderCode:null,
                    notaxAdjustAmount:null,
                    orgName:null,
                    //其他信息
                    createName:null,
                    auditName:null,
                    disuseStatus:null,
                    createTime:null,
                    auditTime:null,
                    disuseName:null,
                    updateName:null,
                    disuseTime:null,
                    updateTime:null,
                    createUser: parseInt(Cookie.get('t8t-tc-uid')),
                },
                columns: Config.createColumns,
                //辅助资料配置
                dataSource:[]
            };
        },
        props: {
            id:null
        },
        methods: {
            updateTotalTaxAmount(totalTaxAmount){
                this.$refs['formBasic'].setTotalTaxAmount(totalTaxAmount);
            },
            getDefaultData(id) {
                if(id > 0) {
                    let args = {
                        id:id,
                    };
                    let _this = this
                    PurchaseInvoice.adjustOrderFindById(args)
                        .then((res) => {
//                            Object.assign(_this.formData,res.data.result);
                            _this.formData = res.data.result;
                        })
                    let itemArgs = {
                        search:{
                            adjustOrderId:id
                        },
                        page:0,
                        size:0
                    }
                    PurchaseInvoice.adjustOrderItemQuery(itemArgs)
                        .then((res) => {
                            _this.dataSource = res.data.result.rows;
                        })
                }

            },

            //暂存方法
            tempSaveClick() {
                this.dealSubmit('temp');
            },
            //提交方法
            submitClick() {
                if(this.auditForm == true) {
                    //提交审批页面
                    var formFlag = false;
                    let _this = this
                    this.$refs.t8tAudit.validate((isValid) => {
                        let formData = _this.$refs.t8tAudit.ruleForm;
                        if (isValid) {
                            let args = {};
                            args.auditResult = formData.agree;
                            args.auditorId = parseInt(Cookie.get('t8t-tc-uid'));
                            args.invoiceId = this.invoiceId;
                            args.auditReson = this.idea;
                            //args.描述 = this.invoiceId;
                            PurchaseInvoice.invoiceStartAudit(args)
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'success',
                                            message: '操作成功',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                        this.$router.push({ path: '/tuchat-finance/page-purchase-invoice'})
                                        this.$emit('close')
                                    }
                                    else{
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'error',
                                            message: '操作失败，请重试',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                    }
                                })
                        }
                    })
                }else{
                    this.dealSubmit('submit');
                }
            },
            dealSubmit(type){
                var formFlag = false;
                var tableFlag = false;
                this.$refs.formBasic.$refs.formBasic.validate((isValid) => {
                    if (isValid){
                        formFlag = true
                    }
                })
                let thisTable = this.$refs['t8tTable'].$refs['t8tTable'];
                thisTable.validate((isValid) => {
                    if (isValid) {
                        tableFlag = true
                    }
                    if(formFlag && tableFlag) {
                        this.isLoading = true
                        let Form = this.formData
                        let rows = thisTable.getActionLog(false,true)
                        Form.invoiceTime /= 1000;

                        Form.recordTime /= 1000;
//                        if(rows.length == 0) {
//                            this.$msgbox({
//                                title: '消息',
//                                type: 'warning',
//                                message: '请点击新增行新增',
//                                showCancelButton: false,
//                                confirmButtonText: '知道了',
//                                confirmButtonClass: 'is-plain'
//                            })
//                            return false;
//                        }
                        let args = {
                            invoiceManualUpdateDTO: Form,
                            invoiceItemManualCreateDTOs: rows.addedRows,
                            invoiceItemManualUpdateDTOs: rows.editedRows,
                            deleteItemIds: rows.deletedIDs
                        }
                        let submitRes;
                        if(type == 'temp')
                        {
                            submitRes = PurchaseInvoice.invoiceManualTransit(args);
                        }
                        if(type == 'submit')
                        {
                            submitRes = PurchaseInvoice.invoiceManualSubmit(args);
                        }
                        submitRes.then((res) => {
                            if(res.data.status === 200){
                                // 新增成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '新增成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.isLoading = false
                                this.closeDialog()
                            }else{
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.isLoading = false
                            }
                        })
                    }
                })
            },
            formatFormData(){
                var ret = Object.assign({}, this.formData)
                return ret
            },
//            fromatRows(){
//                let rows = this.$refs['t8tTable'].getActionLog(false,true)
//                let addRows = [].concat(rows.addedRows)
//                let deleteRows = [].concat(rows.deletedRows)
//                let editRows = [].concat(rows.editedRows)
//                for(let i = 0; i < deleteRows.length; i++){
////                    rows[i]['arriveAmount'] = +rows[i]['arriveAmount']
////                    rows[i]['projectId'] = +rows[i]['projectId']
//                }
//                return rows
//            },
            closeDialog() {
                this.isDialogShow = !this.isDialogShow
                this.$emit('close')
            },
            //处理选择行变化
            add() {
                this.$refs['t8tTable'].addNewRow()
            },
            del() {
                this.$refs['t8tTable'].delRows()
            },
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
        },

    };
</script>

<style lang="css" scoped>
</style>
