<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="commonOptionsConfig"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-toolbar
            @EXPORT="onExport"
            @VIEW="on_view"
            @VOID="on_void"
            @RED-DASHED="on_redDashed"
            @SENDTOCLOUD="btnSendToCloud"
            @GOLD-TAX="on_goldTax"
            @ADD="on_add"
            ref="toolbar"
        >
        </t8t-toolbar>
        <t8t-table
            ref="listTable"
            :columns="columns"
            :service="service"
            :method="method"
            :args="args"
            :pageBar="true"
            :commonData="commonOptionsConfig"
            @row-double-click="doubleClick"
        >
            <template slot="projectId" scope="scope">
                 <span>
                    {{scope.row.projectId != 0 ? scope.row.projectId : ''}}<br/>
                 </span>
            </template>
            <template slot="taxRate" scope="scope" >
                <span>{{parseFloat(scope.row['taxRate']*100).toFixed()}}%</span>
            </template>
        </t8t-table>
        <!-- 新增、编辑弹窗 -->
        <el-dialog title="销售发票新增" class="invoiceSales-edit-dialog" v-model="editDialogVisible"
                   @close="add_btnCancleClick">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth"
                     ref="addform" @keyup.enter.native="btnOKClick()">
                <el-form-item label="销售组织：" prop="bizOrgId">
                    <el-select
                        v-model="formData.bizOrgId"
                        filterable
                        :allow-create="false"
                        placeholder="请选择组织">
                        <el-option
                            v-for="item in commonOptionsConfig.origanizationList"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务类型：" prop="serviceTypeId">
                    <el-select
                        v-model="formData.serviceTypeId"
                        filterable
                        :allow-create="false"
                        placeholder="请选择服务类型">
                        <el-option
                            v-for="item in commonOptionsConfig.serviceTypeList"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务类型：" prop="bussinessTypeId">
                    <el-select
                        v-model="formData.bussinessTypeId"
                        filterable
                        :allow-create="false"
                        placeholder="请选择业务类型">
                        <el-option
                            v-for="item in commonOptionsConfig.businessTypeList"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户类型：" prop="customerTypeId">
                    <el-select
                        v-model="formData.customerTypeId"
                        filterable
                        :allow-create="false"
                        placeholder="请选择客户类型">
                        <el-option
                            v-for="item in commonOptionsConfig.customerTypeList"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单据类型：" prop="sourceOrderType">
                    <el-select
                        v-model="formData.sourceOrderType"
                        filterable
                        :allow-create="false"
                        placeholder="请选择客户类型">
                        <el-option
                            v-for="item in commonOptionsConfig.sourceOrderTypeList"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户名称：" prop="customerName">
                    <el-input v-model="formData.customerName" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item label="客户ID：" prop="customerId">
                    <el-input v-model="formData.customerId" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item label="项目ID：" prop="projectId">
                    <el-input v-model="formData.projectId" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item label="销售金额（含税）：" prop="beforeTaxAmount">
                    <el-input v-model="formData.beforeTaxAmount" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item label="未缴金额：" prop="unpaidAmount">
                    <el-input v-model="formData.unpaidAmount" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item label="单据编号：" prop="sourceOrderCode">
                    <el-input v-model="formData.sourceOrderCode" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item label="金额：" prop="amount">
                    <el-input v-model="formData.amount" size="small">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="add_btnOKClick()" type="primary" :loading="add_edit_isLoading">确定</el-button>
                <el-button @click="add_btnCancleClick()">取消</el-button>
            </div>
        </el-dialog>

        <!-- 传K/3确认弹窗 -->
        <el-dialog title="传K/3确认" v-model="sendCloudDialog" @close="closeCloudDialog" ref="sendCloudDialogRef">
            <ul class="payConfirm">
                <li style="list-style-type:none">此次选择共{{totalCount}}条数据</li>
            </ul>
            <div slot="footer">
                <el-button type="primary" @click="onSendCloudConfirm" :loading="isLoading">确认</el-button>
                <el-button @click="closeCloudDialog">取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import Service from 'src/services/finance/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Utils from 'src/utils/Utils.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    import invoiceSales from 'src/services/finance/invoiceSales.js'
    //导出
    import exportUtils from 'src/utils/export.js'
    export default {
        name: 'invoiceSales-list',
        data(){
            var checkBeforeTaxAmount = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('销售金额（含税）不能为空'));
                }
                if (Number(value) > 9999999) {
                    return callback(new Error('销售金额（含税）不能大于9999999'));
                }
                if (Number(value) < 0.01) {
                    return callback(new Error('销售金额（含税）不能小于0.01'));
                }
                if (!/^\d+\.\d+$|^\d+$/.test(value)) {
                    return callback(new Error('销售金额（含税）格式错误只能为数字'));
                }
                if (!/^\d{1,9}(\.\d{1,2})?$/.test(value)) {
                    return callback(new Error('销售金额（含税）只能精确到小数点后两位'));
                }
                callback();
            };
            var checkUnpaidAmount = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('未缴金额不能为空'));
                }
                if (Number(value) > 9999999) {
                    return callback(new Error('未缴金额不能大于9999999'));
                }
                if (!/^\d+\.\d+$|^\d+$/.test(value)) {
                    return callback(new Error('未缴金额格式错误只能为数字'));
                }
                if (!/^\d{1,9}(\.\d{1,2})?$/.test(value)) {
                    return callback(new Error('未缴金额只能精确到小数点后两位'));
                }
                callback();
            };
            var checkAmount = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('金额不能为空'));
                }
                if (Number(value) > 9999999) {
                    return callback(new Error('金额不能大于9999999'));
                }
                if (Number(value) < 0.01) {
                    return callback(new Error('金额不能小于0.01'));
                }
                if (!/^\d+\.\d+$|^\d+$/.test(value)) {
                    return callback(new Error('金额格式错误只能为数字'));
                }
                if (!/^\d{1,9}(\.\d{1,2})?$/.test(value)) {
                    return callback(new Error('金额只能精确到小数点后两位'));
                }
                callback();
            };
            return {
                exportParams: {
                    search: {id_gt: 0},
                    page: 1,
                    size: 10000,
                    sort: ['createTime_desc']
                },//导出传参
                sendCloudDialog: false,//传K/3
                isLoading: false,
                breadcrumbData: [{title: '财务'}, {title: '应收核算'}, {title: '销售发票'}],
                service: Service.RECEIVABLE.name,
                method: Service.RECEIVABLE.methods.salesInvoiceList,
                args: {search: null, sort: ['createTime_desc']},
                editDialogVisible: false,
                fields: [
                    {type: 'input', label: '项目ID', name: 'projectId_eq'},
                    {type: 'select', label: '客户', name: 'customerTypeId_eq', selectSourceKey: 'customerTypeList'},
                    {type: 'input', label: '客户ID', name: 'customerId_eq'},
                    {type: 'select', label: '业务类型', name: 'bussinessTypeId_eq', selectSourceKey: 'businessTypeList'},
                    {type: 'select', label: '发票类型', name: 'invoiceType_eq', selectSourceKey: 'invoiceTypeList'},
                    {type: 'select', label: '纳税人类型', name: 'taxPayerType_eq', selectSourceKey: 'taxpayerTypeList'},
                    {type: 'select', label: '传K3状态', name: 'isK3Cloud', selectSourceKey: 'isK3Options'},
                    {type: 'select',label:'服务类型',name:'serviceTypeId_eq',selectSourceKey:'serviceTypeList'},
                    {type: 'input',label:'单据编号',name:'invoiceCode_eq'},
                    {
                        type: 'datepicker',
                        label: '记账时间',
                        name: 'amounttingTime',
                        pickertype: 'daterange',
                        startField: 'amounttingTime_gte',
                        endField: 'amounttingTime_lte'
                    },
                ],
                commonOptionsConfig: {
                    isK3Options: [{
                        text: '已传',
                        value: 1
                    }, {
                        text: '未传',
                        value: 0
                    }
                    ],
                    customerTypeList: [],
                    businessTypeList: [],
                    origanizationList: [],
                    serviceTypeList: [],
                    invoiceTypeList: [
                        {
                            text: '增值税普通发票',
                            value: 1
                        },
                        {
                            text: '增值税专用发票',
                            value: 2
                        }
                    ],
                    taxpayerTypeList: [
                        {
                            text: '个人',
                            value: 1
                        },
                        {
                            text: '一般纳税人公司',
                            value: 2
                        },
                        {
                            text: '小规模纳税人公司',
                            value: 3
                        }
                    ],
                    statusList: [
                        {
                            text: '有效',
                            value: 0
                        },
                        {
                            text: '作废',
                            value: 1
                        }
                    ]
                },
                columns: [
                    {"prop": "invoiceCode", "label": "单据编号"},
                    {"prop": "bizOrgName", "label": "销售组织"},
                    {"prop": "origanizationName", "label": "财务组织"},
                    {"prop": "bussinessTypeName", "label": "业务类型"},
                    {"prop": "projectId", "label": "项目ID"},
                    {"prop": "customerTypeName", "label": "客户"},
                    {"prop": "customerId", "label": "客户ID"},
                    {"prop": "serviceTypeName", "label": "服务类型"},
                    {"prop": "beforeTaxAmount", "label": "销售金额（含税）"},
                    {"prop": "afterTaxAcmount", "label": "销售金额（不含税）"},
                    {"prop": "taxRate", "label": "税率"},
                    {"prop": "taxAmount", "label": "税额"},
                    {"prop": "status", "label": "销售发票状态", "list": "statusList"},
                    {"prop": "isK3Cloud", "label": "传K3状态", "list": "isK3Options"},
                    {"prop": "amounttingTime", "label": "记账时间", "formatter": "dateParser"},
                    {"prop": "createTime", "label": "创建时间", "formatter": "dateParser"},
                    {"prop": "createUserName", "label": "创建人"},
                    {"prop": "updateTime", "label": "修改时间", "formatter": "dateParser"},
                    {"prop": "updateUserName", "label": "修改人"},
                ],
                formData: {
                    bizOrgId: '',
                    origanizationId: '',
                    serviceTypeId: '',
                    bussinessTypeId: '',
                    customerTypeId: '',
                    customerId: '',
                    projectId: '',
                    beforeTaxAmount: '',
                    unpaidAmount: '',
                    amount: '',
                    sourceOrderCode: '',
                    sourceOrderType: '',
                    customerName: '',
                    details: [{                    //关联单据详情集合
                        sourceOrderType: '',              //单据类型id
                        sourceOrderCode: "",           //单据编号
                        systemCode: "fi",               //系统编码
                        submoduleCode: "rvm",           //子模块编码
                        amount: ""           //金额
                    }],
                    amounttingTime:'1504195200'
                },
                labelPosition: 'right',
                formLabelWidth: '120px',
                add_edit_isLoading: false,
                rules: {
                    bizOrgId: [
                        {type: 'number', required: true, message: "请选择组织", trigger: 'change'},
                    ],
                    serviceTypeId: [
                        {type: 'number', required: true, message: "请选择服务类型", trigger: 'change'},
                    ],
                    bussinessTypeId: [
                        {type: 'number', required: true, message: "请选择业务类型", trigger: 'change'},
                    ],
                    customerTypeId: [
                        {type: 'number', required: true, message: "请选择客户类型", trigger: 'change'},
                    ],
                    sourceOrderType: [
                        {type: 'number', required: true, message: "请选择单据类型", trigger: 'change'},
                    ],
                    customerId: [
                        {required: true, message: "请填写客户ID", trigger: 'blur'},
                        {"pattern": /^\d{1,9}$/, "message": "客户ID格式错误", "trigger": "blur"},
                    ],
                    customerName: [
                        {required: true, message: "请填写客户名称", trigger: 'blur'},
                        {min: 1, max: 50, message: "客户名称长度不能超过50个字符", trigger: "blur"}
                    ],
                    projectId: [
                        {"pattern": /^\d{1,9}$/, message: "项目ID格式错误", trigger: 'blur'},
                    ],
                    beforeTaxAmount: [
                        {validator: checkBeforeTaxAmount, type: 'number', required: true, trigger: 'blur'},
                    ],
                    unpaidAmount: [
                        {validator: checkUnpaidAmount, type: 'number', required: true, trigger: 'blur'},
                    ],
                    sourceOrderCode: [
                        {required: true, message: "请选择单据编号", trigger: 'blur'},
                        {"min": 1, "max": 50, "message": "单据编号不能超过50个字符", "trigger": "blur"}
                    ],
                    amount: [
                        {validator: checkAmount, type: 'number', required: true, trigger: 'blur'},
                    ]
                }
            }
        },
        created(){
            this.getCommonOptions('61004', 'customerTypeList')
            this.getCommonOptions('11008', 'businessTypeList')
            this.getCommonOptions('61008', 'serviceTypeList')
            this.getCommonOptions('11605', 'sourceOrderTypeList')
            this.getOriganizationList()
        },
        methods: {
            submitSearch(obj){
                if (obj.projectId_eq == 0 || obj.projectId_eq == '0') {
                    this.$message({
                        type: 'error',
                        message: '项目ID不能为0'
                    });
                    return
                }
                if (obj.customerId_eq && !obj.customerTypeId_eq) {
                    this.$message({
                        type: 'error',
                        message: '请先选择客户'
                    });
                    return
                }
                this.args = {search: obj, sort: ['createTime_desc']}
            },
            on_view(){
                let rows = this.$refs['listTable'].getSelectRows()
                if (rows.length < 1) {
                    this.$message({
                        type: 'error',
                        message: '请勾选数据后再操作'
                    });
                    return
                }
                if (rows.length > 1) {
                    this.$message({
                        type: 'error',
                        message: '请对单条数据进行操作'
                    });
                    return
                }
                this.$router.push({
                    path: '/tuchat-finance/invoice-sales/view',
                    query: {id: rows[0]['id']}
                })
            },
            doubleClick(row, event){
                this.$router.push({
                    path: '/tuchat-finance/invoice-sales/view',
                    query: {id: row.id}
                })
            },
            on_add(){
                this.editDialogVisible = true
            },
            on_redDashed(){
                let rows = this.$refs['listTable'].getSelectRows()
                if (rows.length < 1) {
                    this.$message({
                        type: 'error',
                        message: '请勾选数据后再操作'
                    });
                    return
                }
                if (rows.length > 1) {
                    this.$message({
                        type: 'error',
                        message: '请对单条数据进行操作'
                    });
                    return
                }
                let row = rows[0];
                if (row.isRedFlush == 1) {
                    this.$message({
                        type: 'error',
                        message: '此销售发票已红冲'
                    });
                    return
                }
                var args = {updateUserId: Cookie.get('t8t-tc-uid'), redFlushId: row['id']}
                this.$confirm('确认对所选销售发票进行红冲操作？', '红冲确认', {
                    confirmButtonText: '红冲',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs['toolbar'].disableBySymbol('RED-DASHED');
                    axios({
                        method: Service.RECEIVABLE.methods.salesInvoiceRedFlush,
                        service: this.service,
                        args: args
                    }).then((res) => {
                            this.$refs['toolbar'].unDisableBySymbol('RED-DASHED')
                            if (res.data.status === 200) {
                                this.$msgbox({
                                    title: '已红冲',
                                    type: 'success',
                                    message: '',
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                }, function () {
                                });
                                this.$refs['listTable'].reloadTable()
                                this.editDialogVisible = false
                            } else {
                                this.$msgbox({
                                    title: '红冲失败',
                                    type: 'error',
                                    message: res.data.message,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                }, function () {

                                });
                            }
                        }
                    )
                })
            },
            on_void(){
                let rows = this.$refs['listTable'].getSelectRows()
                if (rows.length < 1) {
                    this.$message({
                        type: 'error',
                        message: '请勾选数据后再操作'
                    });
                    return
                }
                if (rows.length > 1) {
                    this.$message({
                        type: 'error',
                        message: '请对单条数据进行操作'
                    });
                    return
                }
                let row = rows[0];
                let msg = ''
                let flage = true
                if (row.isGoldenTax == 1 && row.isK3Cloud == 1) {
                    msg = '已传K3和金税，不可进行作废操作'
                    flage = false
                } else if (row.isGoldenTax == 1) {
                    msg = '已传金税，不可进行作废操作'
                    flage = false
                } else if (row.isK3Cloud == 1) {
                    msg = '已传K3，不可进行作废操作'
                    flage = false
                }
                if (flage && row.status == 1) {
                    msg = '操作项已作废不能重复操作'
                    flage = false
                }
                if (!flage) {
                    this.$message({
                        type: 'error',
                        message: msg
                    });
                    return
                }
                var args = {updateUserId: Cookie.get('t8t-tc-uid'), salesInvoiceId: row['id']}
                this.$confirm('确认对所选销售发票进行作废处理？', '作废确认', {
                    confirmButtonText: '作废',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs['toolbar'].disableBySymbol('VOID');
                    axios({
                        method: Service.RECEIVABLE.methods.salesInvoiceCanceled,
                        service: this.service,
                        args: args
                    }).then((res) => {
                            this.$refs['toolbar'].unDisableBySymbol('VOID');
                            if (res.data.status === 200) {
                                this.$msgbox({
                                    title: '已作废',
                                    type: 'success',
                                    message: '',
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                }, function () {
                                });
                                this.$refs['listTable'].reloadTable()
                            } else {
                                this.$msgbox({
                                    title: '作废失败',
                                    type: 'error',
                                    message: res.data.message,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                }, function () {

                                });
                            }
                        }
                    )
                })
            },
            on_goldTax(){
                this.$message({
                    type: 'error',
                    message: '功能开发中，敬请期待'
                });
            },
            add_btnOKClick(){
                this.$refs['addform'].validate(valid => {
                    if (valid) {
                        this.formData.details[0]['sourceOrderCode'] = this.formData.sourceOrderCode
                        this.formData.details[0]['amount'] = this.formData.amount
                        this.formData.details[0]['sourceOrderType'] = this.formData.sourceOrderType
                        var args = {projectData: this.formData, createUserId: Cookie.get('t8t-tc-uid')}
                        this.$refs['toolbar'].disableBySymbol('ADD');
                        this.add_edit_isLoading = true
                        axios({
                            method: Service.RECEIVABLE.methods.salesInvoiceCreate,
                            service: this.service,
                            args: args
                        }).then((res) => {
                                this.$refs['toolbar'].unDisableBySymbol('ADD');
                                this.add_edit_isLoading = false
                                if (res.data.status === 200) {
                                    this.$msgbox({
                                        title: '新增成功',
                                        type: 'success',
                                        message: '',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    }, function () {
                                    });
                                    this.$refs['listTable'].reloadTable()
                                    this.initAddDioge()
                                    this.editDialogVisible = false
                                } else {
                                    this.$msgbox({
                                        title: '新增失败',
                                        type: 'error',
                                        message: res.data.message,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    }, function () {

                                    });
                                }
                            }
                        )
                    }
                })
            },
            add_btnCancleClick(){
                this.initAddDioge()
                this.editDialogVisible = false
            },
            initAddDioge(){
                this.formData = {
                    origanizationId: '',
                    serviceTypeId: '',
                    bussinessTypeId: '',
                    customerTypeId: '',
                    customerId: '',
                    projectId: '',
                    beforeTaxAmount: '',
                    amount: '',
                    sourceOrderCode: '',
                    unpaidAmount: '',
                    sourceOrderType: '',
                    customerName: '',
                    details: [{                    //关联单据详情集合
                        sourceOrderType: '',              //单据类型id
                        sourceOrderCode: "",           //单据编号
                        systemCode: "fi",               //系统编码
                        submoduleCode: "rvm",           //子模块编码
                        amount: ""           //金额
                    }],
                    amounttingTime:'1504195200'
                }
                if (this.$refs['addform']) this.$refs['addform'].resetFields()
            },
            getCommonOptions: function (fatherCode, selectName) {
                let arg = {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            });
                            this.commonOptionsConfig[selectName] = list;
                        }
                    })
            },
            getOriganizationList(){
                axios({
                    method: Service.ORGANIZATION.methods.organizationQuery,
                    service: Service.ORGANIZATION.name,
                    args: {search: {id_gt: 0}}
                }).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                            if (item.isDel != 1) {
                                this.commonOptionsConfig.origanizationList.push({
                                    value: item.id,
                                    text: item.name
                                })
                            }
                        })

                    }

                })
            },

            //销售发票（应收单）传K/3Cloud
            btnSendToCloud(){
                this.isLoading = false;
                this.k3CloudArgs = []
                // 判断是否选择
                let selections = this.$refs['listTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选销售发票后再操作！')
                    return false
                } else if (selections.length > 50) {
                    this.$message.error('一次勾选的销售发票条数不能大于50！')
                    return false
                }
                let unAuditCount = 0
                selections.forEach((item) => {
                    //状态为“有效”的
                    if (item.status === 0) {
                        this.k3CloudArgs.push(item.id)
                    }
                    //无效，作废
                    if (item.status === 1) {
                        unAuditCount++
                    }
                })

                if (unAuditCount > 0) {
                    this.$message.error('作废的销售发票不能上传K3!')
                    return false
                }

                if (null === this.k3CloudArgs || this.k3CloudArgs.length <= 0) {
                    this.$message.error('请选择已审核的销售发票进行操作!')
                    return false
                }
                this.totalCount = this.k3CloudArgs.length
                this.sendCloudDialog = true
            },

            onSendCloudConfirm(){
                this.isLoading = true;
                let args = {
                    orderIds: this.k3CloudArgs,
                    updateUser: parseInt(Cookie.get('t8t-tc-uid'))
                }

                invoiceSales.sendSalesInvoiceToCloud(args).then((res) => {
                    if (res.data.status === 200) {
                        this.isLoading = false
                        this.sendCloudDialog = false
                        this.$msgbox({
                            title: '消息',
                            type: 'warning',
                            message: '上传成功' + res.data.result.successCount + '条，失败' + res.data.result.failedCount + '条,' + res.data.result.failedBillMsg,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },

            closeCloudDialog(){
                this.sendCloudDialog = false
            },
            //导出数据
            onExport() {
                this.$msgbox({
                    message: '正在导出中,请注意左下方,稍后有导出的文件',
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })

                let ids = []
                let checkArray = this.$refs['listTable'].getSelectRows()
                if (checkArray.length > 0) {
                    checkArray.forEach((item) => {
                        ids.push(item.id)
                    })
                    this.exportParams = {
                        search: {
                            id_in: ids
                        },
                        page: 0,
                        size: 10000
                    }
                }

                let paramsExport = this.exportParams.search
                let objectFlag = false
                objectFlag = this.isEmptyObjectParams(paramsExport)
                if (!objectFlag) {
                    this.exportParams = {
                        search: {},
                        page: 1,
                        size: 10000,
                        sort: ['createTime_desc']
                    }
                }
                exportUtils({
                    service: Service.RECEIVABLE.name,
                    method: Service.RECEIVABLE.methods.salesInvoiceExcel,
                    args: this.exportParams,

                    headers: '单据编号,销售组织,财务组织,业务类型,项目ID,客户,客户ID,服务类型,销售金额（含税）,销售金额（不含税）,税率,税额,销售发票状态,传K3状态,记账时间,创建时间,创建人,修改时间,修改人',
                    sorts: 'invoiceCode,bizOrgName,origanizationName,bussinessTypeName,projectId,customerTypeName,customerId,serviceTypeName,beforeTaxAmount,afterTaxAcmount,taxRate,taxAmount,statusName,isK3CloudName,amounttingDate,createDate,createUserName,updateDate,updateUserName'
                })
            },
            isEmptyObjectParams(data)
            {
                let objectFlags = false
                for (let i in data) {
                    objectFlags = true
                }
                return objectFlags
            }
        }
    }
</script>
<style>
    .invoiceSales-edit-dialog .el-input__inner {
        width: auto;
    }
</style>
