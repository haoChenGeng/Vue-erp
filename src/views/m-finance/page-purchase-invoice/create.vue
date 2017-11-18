<template>
    <div>
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
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-tabs v-model="activeInputTabName">
                            <el-tab-pane label="基本信息" name="basic">
                                <invoice-input-basic
                                    ref="formBasic"
                                    :formData="formData"
                                    :editForm="true"
                                    :createWay="createWay"
                                >
                                </invoice-input-basic>
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
                                v-if="!createWay"
                            >新增行</el-button>
                            <el-button
                                type="danger"
                                size="small"
                                icon="close"
                                @click="del()"
                                v-if="!createWay"
                            >删除行</el-button>
                        </div>
                        <invoice-table
                            :dataSource="dataSource"
                            :columns="columns"
                            :editable="true"
                            ref="t8tTable"
                            @totalTaxAmount="updateTotalTaxAmount"
                        >
                        </invoice-table>
                    </div>
                </div>
            </div>

        </el-dialog>
        <auto-create
            v-if="isDialogShowAuto"
            @getReconIds="getReconIds"
        >

        </auto-create>

        <!-- 另一个el-dialog放这里 -->
    </div>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'

    import * as Config from './config'

    import Cookie from 'js-cookie'

    //    import Utils from 'src/utils/Utils.js'
    //    import InvoiceInput from './invoice-input.vue'
    import InvoiceInputBasic from './invoice-input-basic.vue'
    import InvoiceInputOther from './invoice-input-other.vue'
    import InvoiceTable from './invoice-table.vue'
    import AutoCreate from './autoCreate.vue'

    import PurchaseInvoice from 'src/services/finance/purchaseInvoice.js'
    import supplyService from 'src/services/supply/Service.js'

    export default {

        name: 'page-purchase-invoice-dialog',
        components: {
            InvoiceInputBasic,
            InvoiceInputOther,
            InvoiceTable,
            AutoCreate
        },
        beforeCreate() {
//            let routeNodes = this.$route.path.split('/')
//            pageType = routeNodes[routeNodes.length - 1]
        },
        mounted(){

        },
        created() {
            this.type = this.$route.query.type
            if(this.type == "auto") {
                this.isDialogShowAuto = true
                this.createWay = true
                this.columns = Config.autoCreateColumns;
            }else{
                let _this = this
                this.columns = [
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
                            rules:[
                                {
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
                            rules:[{
                                type:"number",
                                required: true,
                                message: "请输入-9999999.99到99999999.99的数字",
                                max:99999999.99,
                                min:-9999999.99
                            },
                                {
                                    pattern: /^[+-]?((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '请输入两位小数'
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
                ];
            }
        },
        data () {
            return {
                isTopHide:false,
                type:null, //判断是自动新增还是手动新增 默认：手动 auto 自动
                invoiceId:null,
                createWay: false,
                isDialogShow: true,
                isDialogShowAuto: false,
                isLoading: false,
                activeInputTabName: 'basic',
                reconIds: [],//这个数组要作为新增采购发票的参数
                formData: {
                    //基本信息
                    code: null,
                    orgId: null,
//                    invoiceTime: (new Date()).toLocaleDateString(),
//                    recordTime: (new Date()).toLocaleDateString(),
                    invoiceTime: new Date((new Date()).toLocaleDateString()) / 1000,
                    recordTime: new Date((new Date()).toLocaleDateString()) /1000,
                    invoiceNo: null,
                    invoiceType: null,
                    shopId: null,
                    orderStatus: 1,  //单据状态：默认：暂存
                    bizPurpose: 1,  // 业务用途 默认材料费
                    recordStatus: 1, //记账状态 默认：未记账
                    verifyStatus: 1,//核销状态 默认：未核销
                    totalTaxAmount: null,
                    sourceCode: null,
                    remark: null,
                    //其他信息
                    createName:null,
                    auditName:null,
                    createTime:null,
                    auditTime:null,
                    disuseName:null,
                    updateName:null,
                    disuseTime:null,
                    updateTime:null,
                    createUser: parseInt(Cookie.get('t8t-tc-uid')),
                },
                columns: [],
                //辅助资料配置
                dataSource:[]
            };
        },
        methods: {
            getReconIds(ids){
                this.isDialogShowAuto = false;  //隐藏对账单查询页面
                let args = {
                    ids:ids,
                };
                args.operId = parseInt(Cookie.get('t8t-tc-uid'))
                let _this = this
                PurchaseInvoice.invoiceCreateByReconQuery(args)
                    .then((res) => {
                        if (res.data.status === 200) {
//                            Object.assign(_this.formData,res.data.result);
                            _this.formData.orgId = res.data.result.orgId;
                            this.$set(this.formData,'shopId',res.data.result.shopId)
                            this.$set(this.formData,'shopName',res.data.result.shopName)
//                            _this.formData.shopId = res.data.result.shopId;
//                            _this.formData.shopName = res.data.result.shopName;
                            //_this.formData.totalTaxAmount = res.data.result.totalTaxAmount;
                            _this.formData.totalTaxAmount = parseFloat(res.data.result.totalTaxAmount).toFixed(2);
                            _this.reconIds = res.data.result.reconIds;
                            _this.dataSource = res.data.result.invoiceItemCreateByReconVOList;
                            _this.dataSource.forEach(function (item,key) {
                                _this.dataSource[key]['taxRate'] = parseInt(item['taxRate'] * 100)
                                _this.dataSource[key]['taxAmount'] = parseFloat(parseFloat(item['taxAmount']).toFixed(2))
                            })
                        }
                    })
            },
            updateTotalTaxAmount(totalTaxAmount){
                this.$refs['formBasic'].setTotalTaxAmount(totalTaxAmount);
            },

            //暂存方法
            tempSaveClick() {
                this.dealSubmit('temp');
            },
            //提交方法
            submitClick() {
                this.dealSubmit('submit');
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
                        let rows = thisTable.getActionLog(false)
                        if(rows.addedRows.length == 0 && this.createWay == false) {
                            this.$msgbox({
                                title: '消息',
                                type: 'warning',
                                message: '请添加商品',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            return false;
                        }

                        let submitRes;
                        //参照对账单新增 auto
                        if(this.type == 'auto') {
                            let editedRowsData = JSON.parse(JSON.stringify(rows.editedRows));
                            editedRowsData.forEach(function (item,key) {
                                editedRowsData[key]['taxRate'] = parseFloat(item['taxRate'] / 100).toFixed(2)
                            })
                            let args = {
                                invoiceDependCreateDTO: Form,
//                                invoiceDependUpdateDTO: {},
                                invoiceItemDependCreateDTOs: editedRowsData,
//                                invoiceItemDependUpdateDTOs: rows.editedRows,
//                                deleteItemIds: rows.deletedIDs,
                                reconIds:this.reconIds    // 参照对账单据新增特殊参数
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
                                invoiceCreateDTO: Form,
                                invoiceItemManualCreateDTOs: addedRowsData,
//                                invoiceItemManualUpdateDTOs: rows.editedRows,
//                                deleteItemIds: rows.deletedIDs
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
            closeDialog() {
                this.$emit('close')
                this.$router.push({ path: '/finance/page-purchase-invoice'})
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
                this.$router.push({ path: '/finance/page-purchase-invoice' })
            }
        },
        watch:{
            watch: {
                formData: function (val) {
                    this.formData = val
                },
            }
        }

    };
</script>

<style lang="css">
    .t8t-form-popup-dialog .el-form-item__label:before {
        content: '' !important;
        color: transparent !important;
        margin-right: 0;
    }
</style>
