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
                            @TEMP-SAVE="tempSaveClick"
                            @EDIT-SUBMIT="submitClick"
                            @VOID="voidClick"
                            @APPROVAL-FLOW="flowClick"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <!-- 收缩按钮 -->
                <div class="dialog2-main-container">
                    <!-- 驳回确认弹窗 -->
                    <div class="dialog2-toolbar-container">
                    </div>
                    <div class="full-dialog-form-container">
                        <t8t-audit
                            v-if="auditForm"
                            ref="t8tAudit"
                            :auditForm="auditFormDisable"
                        >

                        </t8t-audit>
                    </div>
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-tabs v-model="activeInputTabName">
                            <el-tab-pane label="基本信息" name="basic">
                                <invoice-input-basic
                                    ref="formBasic"
                                    :formData="formData"
                                    :editForm="editForm"
                                    :createWay="createWay"
                                >
                                </invoice-input-basic>
                            </el-tab-pane>
                            <el-tab-pane label="其他信息" name="other">
                                <invoice-input-other
                                    ref="formOther"
                                    :formData="formData"
                                >
                                </invoice-input-other>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <div class="dialog2-toolbar-container">
                            <el-button
                                type="primary"
                                size="small"
                                icon="plus"
                                @click="add()"
                                v-if="editForm && !createWay"
                            >新增行</el-button>
                            <el-button
                                type="danger"
                                size="small"
                                icon="close"
                                @click="del()"
                                v-if="editForm && !createWay"
                            >删除行</el-button>
                        </div>
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
        <t8t-step-page
            v-if="isShowFlow"
            :method="flowMethod"
            :service="flowService"
            :args="flowArgs"
            :dataSource="flowData"
            @close="isShowFlow=false"
        >
        </t8t-step-page>

        <!-- 另一个el-dialog放这里 -->
    </div>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'

    import * as Config from './config'

    import Cookie from 'js-cookie'
    import supplyService from 'src/services/supply/Service.js'

    //    import Utils from 'src/utils/Utils.js'
    //    import InvoiceInput from './invoice-input.vue'
    import T8tAudit from 'src/components/t8t-audit/t8t-audit.vue'
    import InvoiceInputBasic from './invoice-input-basic.vue'
    import InvoiceInputOther from './invoice-input-other.vue'
    import InvoiceTable from './invoice-table.vue'
    import Service from 'src/services/finance/Service.js'

    import PurchaseInvoice from 'src/services/finance/purchaseInvoice.js'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'

    export default {

        name: 'page-purchase-invoice-dialog',
        components: {
            InvoiceInputBasic,
            InvoiceInputOther,
            InvoiceTable,
            T8tAudit,
            T8tStepPage
        },
        beforeCreate() {
//            let routeNodes = this.$route.path.split('/')
//            pageType = routeNodes[routeNodes.length - 1]
        },
        mounted(){

        },
        created() {
            this.type = this.$route.query.type;
            let procInsId = this.$route.query.procInsId;
            let taskId = this.$route.query.taskId;
            if(this.type == 'edit') {
                this.editForm = true
            }
            if(procInsId && taskId) {
                this.auditForm = true
                this.getDefaultDataByFlow(procInsId);
            }else{
                this.invoiceId = parseInt(this.$route.query.id)
                this.getDefaultData(this.invoiceId);
            }

        },
        data () {
            return {
                isShowFlow:false, //是否显示审批流页面
                flowMethod: Service.PURCHASE_INVOICE.methods.INVOICE_WORK_FLOW_QUERY,
                flowService: Service.PURCHASE_INVOICE.name,
                flowArgs: {},
                type:null,
                radio:'1',
                isTopHide:false,
                invoiceId:null,
                proInsId:null,
                editForm: false,
                auditForm: false, //审批页面判断
                auditFormDisable: false, //审批页面判断
                createWay: false,
                isDialogShow: true,
                isLoading: false,
                activeInputTabName: 'basic',
                formData: {
                    //基本信息
                    code: null,
                    orgId: null,
                    invoiceTime: null,
                    recordTime: null,
                    invoiceNo: null,
                    invoiceType: null,
                    shopId: null,
                    shopName: null,
                    orderStatus: 1,  //单据状态：默认：暂存
                    bizPurpose: null,
                    recordStatus: 1, //记账状态 默认：未记账
                    verifyStatus: 1,//核销状态 默认：未核销
                    totalTaxAmount: null,
                    sourceCode: null,
                    remark: null,
                    createWay: null,
                    //其他信息
                    createName:null,
                    auditName:null,
                    createTime:null,
                    auditTime:null,
                    disuseName:null,
                    updateName:null,
                    disuseTime:null,
                    updateTime:null,
                },
                columns: this.getCreateColums(),
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
                    PurchaseInvoice.invoiceFindById(args)
                        .then((res) => {
                            if (res.data.status === 200) {
//                            Object.assign(_this.formData,res.data.result);
                                _this.formData = res.data.result;

                                _this.columns = _this.formData.createWay == 1 ? _this.getCreateColums() : Config.autoCreateColumns;
                                _this.createWay = _this.formData.createWay == 1 ? false : true;
                                _this.proInsId = _this.formData.proInsId;
                                this.getItemInfo(id)
                            }
                        })
                }

            },
            getCreateColums(){
                let _this = this
                return [
                    {
                        type:"index",
                        label:"行号",
                        summaryType: () => "合计"
                    },
                    {
                        prop: "goodsSku",
                        label: "商品SKU",
                        sortable: false,
                        required: true,
                        editor: {
                            rules:[{
                                type:"string",
                                required: true,
                                message: "请选择商品",
                            }],
                            type: "lookup",
                            selectable : (row,index)=>{
                                if(_this.$refs['t8tTable'].selectIdArray.includes(row.id)) {
                                    return false;
                                }
                                return true;
                            },
                            service:supplyService.SUPPLY.name,
                            method:supplyService.SUPPLY.methods.GOODS_QUERY_PAGE,
                            'columns': [
                                {
                                    'prop': 'skuId',
                                    'label': '商品SKUID'
                                },
                                {
                                    'prop': 'goodsCode',
                                    'label': '商品编码'
                                },
                                {
                                    'prop': 'goodsName',
                                    'label': '商品名称'
                                },
                                {
                                    'prop': 'model',
                                    'label': '型号'
                                },
                                {
                                    'prop': 'standard',
                                    'label': '规格'
                                },
                                {
                                    'prop': 'basicUnitName',
                                    'label': '基本单位'
                                },
                                {
                                    'prop': 'taxRate',
                                    'label': '税率',
                                    'formatter': function(val){
                                        return val * 100 + '%'
                                    }
                                },
                            ],
                            'filterMethod': function (val, args) {
                                args['search'] = {
                                    'goodsCode': val,
                                }
                                return args
                            },
                        }
                    },
                    {
                        prop: "goodsCode",
                        label: "商品编码",
                        sortable: false,
                        required: true,
                        editor: {
                            rules:[{
                                type:"string",
                                required: true,
                                message: "请选择商品",
                            }],
                            type: "lookup",
                            selectable : (row,index)=>{
                                if(_this.$refs['t8tTable'].selectIdArray.includes(row.id)) {
                                    return false;
                                }
                                return true;
                            },
                            service:supplyService.SUPPLY.name,
                            method:supplyService.SUPPLY.methods.GOODS_QUERY_PAGE,
                            'columns': [
                                {
                                    'prop': 'skuId',
                                    'label': '商品SKUID'
                                },
                                {
                                    'prop': 'goodsCode',
                                    'label': '商品编码'
                                },
                                {
                                    'prop': 'goodsName',
                                    'label': '商品名称'
                                },
                                {
                                    'prop': 'model',
                                    'label': '型号'
                                },
                                {
                                    'prop': 'standard',
                                    'label': '规格'
                                },
                                {
                                    'prop': 'basicUnitName',
                                    'label': '基本单位'
                                },
                                {
                                    'prop': 'taxRate',
                                    'label': '税率',
                                    'formatter': function(val){
                                        return val * 100 + '%'
                                    }
                                },
                            ],
                            'filterMethod': function (val, args) {
                                args['search'] = {
                                    'goodsCode': val,
                                }
                                return args
                            },
                        }
                    },
                    {
                        prop: "goodsName",
                        label: "商品名称",
                        sortable: false,
                        required: true,
                        editor: {
                            type: "lookup",
                            selectable : (row,index)=>{
                                if(_this.$refs['t8tTable'].selectIdArray.includes(row.id)) {
                                    return false;
                                }
                                return true;
                            },
                            service:supplyService.SUPPLY.name,
                            method:supplyService.SUPPLY.methods.GOODS_QUERY_PAGE,
                            'columns': [
                                {
                                    'prop': 'skuId',
                                    'label': '商品SKUID'
                                },
                                {
                                    'prop': 'goodsCode',
                                    'label': '商品编码'
                                },
                                {
                                    'prop': 'goodsName',
                                    'label': '商品名称'
                                },
                                {
                                    'prop': 'model',
                                    'label': '型号'
                                },
                                {
                                    'prop': 'standard',
                                    'label': '规格'
                                },
                                {
                                    'prop': 'basicUnitName',
                                    'label': '基本单位'
                                },
                                {
                                    'prop': 'taxRate',
                                    'label': '税率',
                                    'formatter': function(val){
                                        return val * 100 + '%'
                                    }
                                },
                            ],
                            'filterMethod': function (val, args) {
                                args['search'] = {
                                    'goodsName': val,
                                }
                                return args
                            },
                        }
                    },
                    {
                        prop: "baseUnitName",
                        label: "基本单位",
                        sortable: false,
                    },
                    {
                        prop: "taxRate",
                        label: "税率（%）",
                        required: true,
                        sortable: false,
                        formatter: function(val){
                            return parseInt(val) + '%';
                        },
                        editor: {
                            type: "input",
                            rules:[{
                                type:"integer",
                                required: true,
                                message: "请录入0-100的整数",
                                min:0,
                                max:100
                            }
                            ]
                        }
                    },
                    {
                        prop: "invoiceCount",
                        label: "数量",
                        required: true,
                        sortable: false,
                        editor: {
                            type: "input",
                            rules:[{
                                type:"number",
                                required: true,
                                message: "请录入-9999999.99-99999999.99之间的小数",
                                max:99999999.99,
                                min:-9999999.99
                            },
                                {
                                    pattern: /^(?:(?!0$))[\d\D]*/,message:'请录入非0的数值'
                                },
                                {
                                    pattern: /^[+-]?((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/,
                                    message: '请保留两位小数'
                                }
                            ]
                        },
                        formatter: function(val){
                            return parseFloat(val).toFixed(2);
                        },
                    },
                    {
                        prop: "taxPrice",
                        label: "含税单价",
                        required: true,
                        sortable: false,
                        editor: {
                            type: "input",
                            rules:[{
                                type:"number",
                                required: true,
                                message: "请输入0.01到9999999的数字",
                                max:9999999,
                                min:0.01
                            }
                            ]
                        },
                        formatter: function(val){
                            return parseFloat(val).toFixed(2);
                        },
                    },
                    {
                        prop: "noTaxPrice",
                        label: "不含税单价",
                        sortable: false,
                        formatter: function(val){
                            return parseFloat(val).toFixed(2);
                        }
                    },
                    {
                        prop: "noTaxAmount",
                        label: "不含税金额",
                        required: true,
                        sortable: false,
                        formatter: function(val){
                            return parseFloat(val).toFixed(2);
                        },
                        summaryType: function (data, prop) {
                            let sum = 0.00;
                            data.forEach((row) => {
                                sum += parseFloat(row[prop]);
                            });
                            return parseFloat(sum).toFixed(2);
                        },
                    },
                    {
                        prop: "taxDiff",
                        label: "税额",
                        sortable: false,
                        formatter: function(val){
                            return parseFloat(val).toFixed(2);
                        },
                        summaryType: function (data, prop) {
                            let sum = 0.00;
                            data.forEach((row) => {
                                sum += parseFloat(row[prop]);
                            });
                            return parseFloat(sum).toFixed(2);
                        },
                    },
                    {
                        prop: "taxAmount",
                        label: "含税金额",
                        sortable: false,
                        editor: {
                            type: "input",
                            rules:[
                                {
                                    type:"number",
                                    required: true,
                                    message: "请输入-9999999.99到99999999.99的数字",
                                    max:99999999.99,
                                    min:-9999999.99
                                },
                                {
                                    pattern: /^[+-]?((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/,
                                    message: '请保留两位小数'
                                }
                            ]
                        },
                        formatter: function(val){
                            return parseFloat(val).toFixed(2);
                        },
                        summaryType: function (data, prop) {
                            let sum = 0.00;
                            data.forEach((row) => {
                                sum += parseFloat(row[prop]);
                            });
                            return parseFloat(sum).toFixed(2);
                        },
                    }
                ]
            },
            //根据实例ID获取单据信息
            getDefaultDataByFlow(procInsId) {
                let args = {
                    search :{
                        proInsId:procInsId
                    }
                }
                let _this = this
                PurchaseInvoice.invoiceQuery(args)
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result.rows.length > 0) {
                            _this.formData = res.data.result.rows[0];

                            _this.columns = _this.formData.createWay == 1 ? _this.getCreateColums() : Config.autoCreateColumns;
                            _this.createWay = _this.formData.createWay == 1 ? false : true; //创建发票方法

                            _this.invoiceId = _this.formData.id
                            _this.proInsId = _this.formData.proInsId;
                            _this.getItemInfo(_this.formData.id);
                        }else{
                            _this.auditFormDisable = true;
                            this.$msgbox({
                                title: '消息',
                                type: 'warning',
                                message: '当前单据不符合审批状态',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            setTimeout(function () {
                                _this.$router.push({ path: '/tuchat-finance/page-purchase-invoice'})
                            }, 3000)

                        }
                    })


            },

            //获取单项信息
            getItemInfo(id){
                let itemArgs = {
                    search:{
                        invoiceId:id
                    },
                    page:0,
                    size:0
                }
                let _this = this
                PurchaseInvoice.invoiceItemQuery(itemArgs)
                    .then((res) => {
                        if (res.data.status === 200) {
                            _this.dataSource = res.data.result.rows;
                            _this.dataSource.forEach(function (item,key) {
                                _this.dataSource[key]['taxRate'] = parseInt(item['taxRate'] * 100)
                            })
                        }
                    })
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
                            args.remark = formData.idea ? formData.idea : "";
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
                                    this.closeDialog();
                                })
                        }
                    })
                }else{
                    this.dealSubmit('submit');
                }
            },
            dealSubmit(type){
                let _this = this
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
                        Form.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                        let rows = thisTable.getActionLog(false)
                        let submitRes;
                        //参照对账单新增 auto  1/手动新增  2/参照对账单新增
//                        let editedRowsData = rows.editedRows.map(function (item,key,array) {
//                            //editedRowsData[key]['taxRate'] = item['taxRate'] / 100
//                            //editedRowsData[key] = item;
//                            let it = array[key];
//                            it['taxRate'] /= 100
//                            return it;
//                        })

                        let editedRowsData = JSON.parse(JSON.stringify(rows.editedRows));
                        editedRowsData.forEach(function (item,key) {
                            editedRowsData[key]['taxRate'] = parseFloat(item['taxRate'] / 100).toFixed(2)
                        })
                        if(this.formData.createWay == 2) {
                            let args = {
//                                invoiceDependCreateDTO: Form,
                                invoiceDependUpdateDTO: Form,
//                                invoiceItemDependCreateDTOs: rows.addedRows,
                                invoiceItemDependUpdateDTOs: editedRowsData,
//                                deleteItemIds: rows.deletedIDs,
//                                reconIds:this.reconIds    // 参照对账单据新增特殊参数
                            }
                            if(type == 'temp'){
                                submitRes = PurchaseInvoice.invoiceDependTransit(args);
                            }
                            if(type == 'submit') {
                                submitRes = PurchaseInvoice.invoiceDependSubmit(args);
                            }
                        }else{ //手动新增
                            let addedRowsData = JSON.parse(JSON.stringify(rows.addedRows));
                            addedRowsData.forEach(function (item,key) {
                                addedRowsData[key]['taxRate'] = parseFloat(item['taxRate'] / 100).toFixed(2)
                            })
                            let args = {
                                invoiceManualUpdateDTO: Form,
                                invoiceItemManualCreateDTOs: addedRowsData,
                                invoiceItemManualUpdateDTOs: editedRowsData,
                                deleteItemIds: rows.deletedIDs
                            }
                            if(type == 'temp'){
                                submitRes = PurchaseInvoice.invoiceManualTransit(args);
                            }
                            if(type == 'submit') {
                                submitRes = PurchaseInvoice.invoiceManualSubmit(args);
                            }
                        }
                        submitRes.then((res) => {
                            if(res.data.status === 200){
                                // 新增成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '提交成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
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
                            }
                        })
                    }
                })
            },
            formatFormData(){
                var ret = Object.assign({}, this.formData)
                return ret
            },

            //审批流
            flowClick(){
                this.isShowFlow = true
                let proInsId = this.proInsId;
                if (proInsId) {
                    this.flowArgs = {
                        "proInsId": proInsId
                    }
                }
            },
            closeDialog() {
                this.$router.push({ path: '/tuchat-finance/page-purchase-invoice'})
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

<style lang="css">
    .t8t-form-popup-dialog .el-form-item__label:before {
        content: '' !important;
        color: transparent !important;
        margin-right: 0;
    }
</style>
