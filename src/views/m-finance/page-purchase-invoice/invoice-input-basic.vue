<template>
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
                <el-form-item label="财务组织：" prop="orgId">
                    <el-select v-model="formData.orgId" placeholder="--请选择--" :disabled="!editForm || createWay">
                        <el-option v-for="item in commonData.orgOptions" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialog2-form-item-container">
                <el-form-item label="发票日期：" prop="invoiceTime">
                    <!--<t8t-datetime-picker endFormater="timestamp" :bindValue="formData.invoiceTime" v-model="formData.invoiceTime" type="date" :disabled="!editForm">-->
                    <!--</t8t-datetime-picker>-->
                    <el-date-picker
                        type="date"
                        :disabled="!editForm"
                        :value="(formData.invoiceTime===null||formData.invoiceTime===0)?null:formData.invoiceTime*1000"
                        placeholder="选择日期"
                        @input="handleEditorChangeInvoiceTime(Date.parse(arguments[0])/1000)"
                    >
                    </el-date-picker>
                </el-form-item>
            </div>
            <div class="dialog2-form-item-container">
                <el-form-item label="记账日期：" prop="recordTime">
                    <!--<t8t-datetime-picker endFormater="shortDate" :bindValue="formData.recordTime" v-model="formData.recordTime" type="date" :disabled="!editForm">-->
                    <!--</t8t-datetime-picker>-->
                    <el-date-picker
                        type="date"
                        :disabled="!editForm"
                        :value="(formData.recordTime===null||formData.recordTime===0)?null:formData.recordTime*1000"
                        placeholder="选择日期"
                        @input="handleEditorChangeRecordTime(Date.parse(arguments[0])/1000)"
                    >
                    </el-date-picker>

                </el-form-item>
            </div>
            <div class="dialog2-form-item-container">
                <el-form-item label="发票号：" prop="invoiceNo">
                    <el-input v-model="formData.invoiceNo" :disabled="!editForm"></el-input>
                </el-form-item>
            </div>
            <div class="dialog2-form-item-container">
                <el-form-item label="发票类型：" prop="invoiceType">
                    <el-select v-model="formData.invoiceType" placeholder="--请选择--" :disabled="!editForm">
                        <el-option v-for="item in commonData.invoiceTypeOption" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialog2-form-item-container">
                <t8t-supplier-popup
                    :item="item"
                    :formData="formData"
                    :prop="shopId"
                >
                </t8t-supplier-popup>
            </div>
            <div class="dialog2-form-item-container">
                <el-form-item label="单据状态：">
                    <el-select v-model="formData.orderStatus" placeholder="--请选择--" :disabled="true">
                        <el-option v-for="item in commonData.orderStatus" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialog2-form-item-container">
                <el-form-item label="业务用途：" prop="bizPurpose">
                    <el-select v-model="formData.bizPurpose" placeholder="--请选择--" :disabled="!editForm">
                        <el-option v-for="item in commonData.bizPurpose" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialog2-form-item-container">
                <el-form-item label="记账状态：">
                    <el-select v-model="formData.recordStatus" placeholder="--请选择--" :disabled="true">
                        <el-option v-for="item in commonData.recordStatus" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialog2-form-item-container">
                <el-form-item label="核销状态：">
                    <el-select v-model="formData.verifyStatus" placeholder="--请选择--" :disabled="true">
                        <el-option v-for="item in commonData.verifyStatus" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialog2-form-item-container">
                <el-form-item label="价税合计：">
                    <el-input v-model="formData.totalTaxAmount" :disabled="true"></el-input>
                </el-form-item>
            </div>
            <div class="dialog2-form-item-container">
                <el-form-item label="来源单据编号：">
                    <el-input v-model="formData.sourceCode" :disabled="true"></el-input>
                </el-form-item>
            </div>
            <div class="dialog2-form-item-container">
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="formData.remark" :autosize="{ minRows: 2, maxRows: 4}" :disabled="!editForm"></el-input>
                </el-form-item>
            </div>
        </el-form>
</template>
<script>
    import Cookie from 'js-cookie';
    import * as Config from './config'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import PurchaseInvoice from 'src/services/finance/purchaseInvoice.js'
    import Supply from 'src/services/supply/Service.js'
    import T8tSupplierPopup from './t8t-supplier-popup.vue'
    export default {
        name: 'invoice-input-basic',
        components: {
            T8tSupplierPopup,
        },
        created(){
            //财务组织（付款组织，付款主体）（001004013-法人职能，001004014-利润中心）
            commonApi.queryByFunctionCode({"funcCodes":["001004013","001004014"]})
                .then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.isDel===0) {
                                list.push({
                                    value: item.id,
                                    text: item.name
                                })
                            }
                        })
                        this.commonData.orgOptions = list

                    }
                }))
        },
        data() {
            return {
                //辅助资料配置
                commonData: {
                    invoiceTypeOption: Config.selectSource.invoiceType,
                    orderStatus: Config.selectSource.orderStatus,
                    bizPurpose: Config.selectSource.bizPurpose,
                    recordStatus: Config.selectSource.recordStatus,
                    verifyStatus: Config.selectSource.verifyStatus,
                    list: [],
                    orgOptions: [],
                },
                formRule: Config.detailFormRules,
                item: {
                    disabled: !this.editForm || this.createWay,
                    label: '供应商',
                    prop: 'shopId',  //需要验证的参数
                    name: 'shopId',
                    textValue: 'shopName',
                    filedValue: 'id',
                    onIconClick: !this.editForm || this.createWay ? function(){} : false,  //是否显示可用放大镜搜索
                    defaultValue: {
                        filedValue: this.formData.shopId,
                        textValue: this.formData.shopName
                    },
                    dialog: {
                        dialogWidth: '780px',
                        title: "供应商搜索",
                        size: 'large',
                        searchForm: {
                            fields: [
                                {
                                    type: 'input',
                                    label: '供应商编码',
                                    name: 'shopCode_like'
                                },
                                {
                                    type: 'input',
                                    label: '供应商名称',
                                    name: 'shopName_like'
                                },
                            ],
                            resetBtnVisible: true,
                            showToggleBtn: false,
                            labelWidth: '100px'
                        },
                        table: {
                            //表格
                            columns: [{
                                prop: 'shopCode',
                                label: '供应商编码'
                            }, {
                                prop: 'shopName',
                                label: '供应商名称'
                            }],
                            radioCol: true,
                            //请求参数配置
                            service: Supply.SUPPLY.name,
                            method: Supply.SUPPLY.methods.SHOP_QUERY,
                            args: {
                                sort: ['id_desc'],
                            }
                        }
                    },

                    //自动补全
                    remote: true,
                    service: Supply.SUPPLY.name,
                    method: Supply.SUPPLY.methods.SHOP_QUERY,
                    remoteQueryKey: "shopName_like"
                }
            };
        },

        watch: {
            formData: function (val) {
                this.formData = val
            },
            createWay: function (val) {
                this.createWay = val
                this.item.disabled = !this.editForm || this.createWay
                this.item.onIconClick = !this.editForm || !this.editForm || this.createWay ? function(){} : false
//                this.$set(this.item,'disabled',!this.editForm || this.createWay)
//                this.$set(this.item,'onIconClick',!this.editForm || this.createWay ? function(){} : false)
            },
        },

        props: {
            formData:Object,
            editForm: {
                type: Boolean,
                default: false
            },
            createWay: {
                type: Boolean,
                default: false
            },
        },
        methods:{
            setTotalTaxAmount(totalTaxAmount){
                this.formData.totalTaxAmount = totalTaxAmount;
            },
            handleEditorChangeInvoiceTime(val){
                this.formData.invoiceTime = val
            },
            handleEditorChangeRecordTime(val){
                this.formData.recordTime = val
            },
        }
    }


</script>
