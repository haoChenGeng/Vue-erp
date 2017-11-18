<template>
    <div >
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">

                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @ANTI-VERIFICATION="antiVerificationClick"
                        >
                        </t8t-toolbar>
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
                                        <el-form-item label="财务组织：">
                                            <el-input v-model="formData.orgName" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <div class="dialog2-form-item-container">
                                            <el-form-item label="单据日期：">
                                                <t8t-datetime-picker :bindValue="formData.orderTime" type="date" :disabled="true">
                                                </t8t-datetime-picker>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="供应商：">
                                            <el-input v-model="formData.shopName" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="单据状态：">
                                            <el-select v-model="formData.verifyStatus" placeholder="--请选择--" :disabled="true">
                                                <el-option v-for="item in commonData.verifyStatus" :label="item.text" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="已核销数量：">
                                            <el-input v-model="formData.verifyCount" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="已核销金额（发票含税）：">
                                            <el-input v-model="formData.verifyAmount" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="核销方式">
                                            <el-select v-model="formData.verifyWay" placeholder="--请选择--" :disabled="true">
                                                <el-option v-for="item in commonData.verifyWay" :label="item.text" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-form>
                                </invoice-input-basic>
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
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="最后修改人：">
                                            <el-input v-model="formData.updateName" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="最后修改日期：">
                                            <t8t-datetime-picker :bindValue="formData.updateTime" type="datetime" :disabled="true">
                                            </t8t-datetime-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="失效人：">
                                            <el-input v-model="formData.disuseName" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="失效日期：">
                                            <t8t-datetime-picker :bindValue="formData.disuseTime" type="datetime" :disabled="true">
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
        <!-- 另一个el-dialog放这里 -->
    </div>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'

    import * as Config from './config'

    import Cookie from 'js-cookie'

    //    import Utils from 'src/utils/Utils.js'
    //    import InvoiceInput from './invoice-input.vue'
    import InvoiceTable from './invoice-table.vue'

    import PurchaseInvoice from 'src/services/finance/purchaseInvoice.js'

    export default {

        name: 'page-purchase-verification-sheet-dialog',
        components: {
            InvoiceTable
        },
        beforeCreate() {

        },
        mounted(){

        },
        created() {
            let type = this.$route.query.type;
            if(type == 'edit') {
                this.editForm = true
            }
            if(type == 'audit') {
                this.auditForm = true
            }
            this.invoiceId = this.$route.query.id
            this.getDefaultData(this.invoiceId);

        },
        data () {
            return {
                radio:'1',
                isTopHide:false,
                invoiceId:null,
                editForm: false,
                isDialogShow: true,
                isLoading: false,
                activeInputTabName: 'basic',
                //辅助资料配置
                commonData: {
                    verifyStatus: Config.selectSource.verifyStatus,
                    verifyWay: Config.selectSource.verifyWay,
                    list:[],
                    orgOptions:[],
                },
                formData: {
                    //基本信息
                    id: null,
                    code: null,
                    orgId: null,
                    orderTime: null,
                    shopId: null,
                    shopName: null,
                    verifyStatus: null,//核销状态 默认：未核销
                    verifyCount:null,
                    verifyAmount:null,
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
                    PurchaseInvoice.verifyDetailQuery(args)
                        .then((res) => {
                            _this.formData = res.data.result.verifyOrderVO;
                            _this.dataSource = res.data.result.verifyItemDetailVOs;
                        })
                }

            },

            antiVerificationClick (symbol, event) {
                if(this.formData.verifyStatus != 2) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '当前单据状态不是已核销',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                }

                this.$confirm('是否确定对所选单据做反核销？', '反核销确认', {
                    type: 'warning',
                    confirmButtonText: '反核销'
                }).then(() => {
                    let args = {
                        id : this.formData.id,
                        operId : parseInt(Cookie.get('t8t-tc-uid'))
                    }
                    PurchaseInvoice.andiVerify(args)
                        .then((res) => {
                            if(res.data.status === 200){
                                // 核销成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '反核销成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeDialog();
                            }else{
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                        })
                })

            },
            closeDialog() {
                this.$router.push({ path: '/finance/page-purchase-verification-sheet'})
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
            closeDialog() {
                // 填写对应的路由
                this.$router.push({ path: '/finance/page-purchase-verification-sheet' })
            }
        },

    };
</script>

<style lang="css" scoped>
</style>
