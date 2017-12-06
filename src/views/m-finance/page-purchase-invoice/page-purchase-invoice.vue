<template>
    <div class="page-pay-bills">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="searchFields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-toolbar
            @ADD="addClick"
            @AUTO-ADD="autoAddClick"
            @EDIT="editClick"
            @VIEW="viewClick"
            @EDIT-SUBMIT="submitClick"
            @ANTI-AUDITING="antiAuditClick"
            @INVOCE-RED="invoiceRedClick"
            @WRITE-OFF="writeOffClick"
            @VOID="voidClick"
            @SENDTOCLOUD="btnSendToCloud"
            @LOG-LIST="showOpLog"
            @APPROVAL-FLOW="flowClick"
        >
        </t8t-toolbar>
        <t8t-table
            :columns="columns"
            :service="service"
            :method="method"
            :commonData="selectSource"
            :args="args"
            ref="t8tTable"
            @row-double-click="viewClick()"
        >
        </t8t-table>

        <!-- 驳回确认弹窗 -->
        <el-dialog title="反审核确认" v-model="rejDialog" @close="closeRejDialog" ref="rejDialogRef">
            <div class="antiAudit">是否确定反审核所选发票？</div>
            <div class="textarea-container">
                <el-input type="textarea" v-model="textareaText" :autosize="{minRows: 5, maxRows: 5}" placeholder="请输入反审核原因"></el-input>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="antiAuditFunction" element-loading-text="反审核中">反审核</el-button>
                <el-button @click="closeRejDialog">关闭</el-button>
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

        <!-- 驳回确认弹窗 -->
        <el-dialog title="红冲确认" v-model="redDialog" @close="closeRedDialog" ref="redDialogRef">
            <div class="antiAudit">是否确定对所选发票做红冲？</div>
            <span>记账日期</span>
            <!--<t8t-datetime-picker endFormater="timestamp" :bindValue="redFormData.recordTime" v-model="redFormData.recordTime" type="date">-->
            <!--</t8t-datetime-picker>-->
            <el-date-picker
                type="date"
                :value="(redFormData.recordTime===null||redFormData.recordTime===0)?null:redFormData.recordTime*1000"
                placeholder="选择日期"
                @input="handleEditorChange(Date.parse(arguments[0])/1000)"
            >
            </el-date-picker>

            <div class="red-textarea-container">
                <el-input type="textarea" v-model="redFormData.textareaText" :autosize="{minRows: 5, maxRows: 5}"
                          placeholder="请输入红冲原因"></el-input>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="runInvoiceRed" element-loading-text="红冲中">红冲</el-button>
                <el-button @click="closeRedDialog">关闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="日志详情" size="large" class="safsadacfa_node-dialog" v-model="opLogDialog" @close="closeDialog">
            <t8t-table
                :columns="opLogColumns"
                :pageBar="true"
                :editable="false"
                :selectCol="false"
                :service="opLogService"
                :method="opLogMethod"
                :args="opLogArgs"
                @close="opLogDialog=false"
            >
            </t8t-table>
        </el-dialog>

        <t8t-step-page
            v-if="isShowFlow"
            :method="flowMethod"
            :service="flowService"
            :args="flowArgs"
            :dataSource="flowData"
            @close="closeStepPage"
        >

        </t8t-step-page>
    </div>
</template>

<script>
    import * as Config from './config'
    import Cookie from 'js-cookie'
    import Service from 'src/services/finance/Service.js'
    import PurchaseInvoice from 'src/services/finance/purchaseInvoice.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    import Supply from 'src/services/supply/Service.js'

    export default {

        name: 'page-purchase-invoice',
        components: {
            T8tStepPage
        },

        data () {
            return {
                sendCloudDialog: false,//传K/3
                isLoading:false,
                opLogColumns:[
                    { "prop": "username", "label": "操作人账号" },
                    { "prop": "opTime", "label": "操作时间", "formatter": 'dateParser'},
                    { "prop": "opType", "label": "操作类别" },
                    { "prop": "remark", "label": "关键描述" }
                ],
                opLogService:Service.LOG_SERVICE.name,
                opLogMethod:Service.LOG_SERVICE.methods.QUERY_PAGE,
                opLogArgs:{},
                opLogDialog: false, //查看日志
                operId: 0,//当前用户ID
                isShowFlow: false,//是否显示审批流
                flowData: [],//审批流需要的数据
                flowMethod: Service.PURCHASE_INVOICE.methods.INVOICE_WORK_FLOW_QUERY,
                flowService: Service.PURCHASE_INVOICE.name,
                flowArgs: {},

                rejDialog: false,//反审核
                textareaText: '',//反审核描述
                redDialog: false,//红冲
                redFormData:{
                    recordTime: 0,//红冲记账日期
                    textareaText: '',//红冲描述
                },
                breadcrumbData: [{ title: '财务' },{ title: '应付核算' },{ title: '采购发票' }],
                columns: Config.queryPageColumns,
                service: Service.PURCHASE_INVOICE.name,
                method: Service.PURCHASE_INVOICE.methods.INVOICE_QUERY,
                args: {
                    search: {
                        code: null
                    },
                    sort:[
                        "createTime_desc"
                    ]
                },
                searchCache: {
                    "batchNumber_like":null,
                    "code_like":null,
                    "organizationId":null,
                    "businessTypeId":null,
                    "payObjectId":null,
                    "status":null,
                    "bankId":null,
                    "payOrganizationId":null,
                    "channelDistributionId":null
                },
                //搜索表单项配置
                searchFields: [
                    {type: 'input',label: '单据编号',name: 'code'},
                    {type: 'date',label: '发票日期',name: 'invoiceTime'},
                    {type: 'input',label: '发票号',name: 'invoiceNo_like'},
                    {type: 'select',label: '发票类型',name: 'invoiceType', selectSourceKey:'invoiceType'},
                    {type: 'popup',
                        label: '供应商',
                        name: 'shopId', //需要传递给后台查询的数据
                        textValue:'shopName',  //需要展示出来的名称
                        filedValue:'id',    //选中那条数据的ID
                        dialog:{
                            dialogWidth:'780px',
                            title: "供应商搜索",
                            size: 'large',
                            searchForm: {
                                fields:[
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
                                radioCol:true,
                                //请求参数配置
                                service: Supply.SUPPLY.name,
                                method: Supply.SUPPLY.methods.SHOP_QUERY,
                                args: {
                                    sort: ['id_desc'],
                                }
                            }
                        },

                        //自动补全
                        remote:true,
                        service: Supply.SUPPLY.name,
                        method: Supply.SUPPLY.methods.SHOP_QUERY,
                        remoteQueryKey:"shopName_like"
                    },
                    {type: 'select',label: '单据状态',name: 'orderStatus', selectSourceKey:'orderStatus'},
                    {type: 'select',label: '传K3状态',name: 'recordStatus', selectSourceKey:'recordStatus'},
                    {type: 'select',label: '财务组织',name: 'orgId', selectSourceKey:'orgOptions'},
                    {type: 'date',label: '记账日期',name: 'recordTime', selectSourceKey:'recordTime'},
                    {type: 'select',label: '核销状态',name: 'verifyStatus', selectSourceKey:'verifyStatus'},
                    {type: 'select',label: '业务用途',name: 'bizPurpose', selectSourceKey:'bizPurpose'},
                    {type: 'select',label: '红篮字',name: 'colorType', selectSourceKey:'colorType'}
                ],

                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: Config.selectSource,

                editType: 'add',
                dialogVisible: false,
                rowId: null
            }
        },
        created() {
            this.operId = parseInt(Cookie.get('t8t-tc-uid'));
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
                        this.selectSource.orgOptions = list

                    }
                }))
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'getTableData'
        },
        methods: {
            //新增
            addClick() {
                this.$TCS.addTag('erp_finance_007008001001')
                this.$router.push({path: '/finance/page-purchase-invoice/create'})
            },
            //参照对账单新增
            autoAddClick() {
                this.$TCS.addTag('erp_finance_007008001002')
                this.$router.push({path: '/finance/page-purchase-invoice/create', query: {type:'auto'}})
            },
            //修改
            editClick() {
                this.$TCS.addTag('erp_finance_007008001003')
                // 单行判断
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8tTable'].getSelectRows()[0]
                if(selectRow.orderStatus != 1) {
                    this.$message.error('发票单据状态为”暂存“，才允许修改！')
                    return false
                }
                //手动新增
                this.$router.push({path: '/finance/page-purchase-invoice/edit', query: {id: selectRow.id,type:'edit'}})
            },
            //查看
            viewClick() {
                this.$TCS.addTag('erp_finance_007008001004')
                // 判断是否选择
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8tTable'].getSelectRows()[0]
                this.$router.push({ path: '/finance/page-purchase-invoice/view', query: { id: selectRow.id } })
            },
            //作废
            voidClick(){
                this.$TCS.addTag('erp_finance_007008001009')
                // 判断是否选择
                if (this.checkSelections() === false) return false
                let selections = this.$refs['t8tTable'].getSelectRows()
                for(let i = 0;i<selections.length;i++) {
                    if (selections[i].orderStatus !== 1) {
                        this.$message.error('发票状单据态为”暂存“，才允许作废！')
                        return
                    }
                }
                this.$confirm('是否确定作废所选发票？', '作废确认', {
                    type: 'warning',
                    confirmButtonText: '作废'
                }).then(() => {
                    let ids = [];
                    let args = {}
                    selections.forEach((item) => {
                        ids.push(item.id)
                    })
                    args.ids = ids;
                    args.operId = parseInt(Cookie.get('t8t-tc-uid'));
                    PurchaseInvoice.invoiceDisuse(args)
                        .then((res) => {
                            if (res.data.status === 200) {
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '已作废',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.getTableData()
                            }
                            else{
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

            //采购发票（应付单）传K/3Cloud
            btnSendToCloud(){
                this.$TCS.addTag('erp_finance_007008001010')
                this.isLoading=false;
                this.k3CloudArgs = []
                // 判断是否选择
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选采购发票后再操作！')
                    return false
                } else if (selections.length > 50) {
                    this.$message.error('一次勾选的采购发票条数不能大于50！')
                    return false
                }
                let unAuditCount = 0
                selections.forEach((item) => {
                    //状态为“已审核”的
                    if (item.orderStatus === 3) {
                        this.k3CloudArgs.push(item.id)
                    }
                    //其他状态
                    if (item.orderStatus != 3) {
                        unAuditCount++
                    }
                })

                if (unAuditCount > 0) {
                    this.$message.error('已审核的采购发票才能进行传K3操作!')
                    return false
                }

                if (null === this.k3CloudArgs || this.k3CloudArgs.length <= 0) {
                    this.$message.error('请选择已审核的采购发票进行操作!')
                    return false
                }
                this.totalCount = this.k3CloudArgs.length
                this.sendCloudDialog = true
            },

            onSendCloudConfirm(){
                this.isLoading=true;
                let args = {
                    orderIds: this.k3CloudArgs,
                    updateUser: parseInt(Cookie.get('t8t-tc-uid'))
                }

                PurchaseInvoice.sendPurchaseInvoiceToCloud(args).then((res) => {
                    if (res.data.status === 200) {
                        this.isLoading=false
                        this.sendCloudDialog = false
                        this.$msgbox({
                            title: '消息',
                            type: 'warning',
                            message: '上传成功' + res.data.result.successCount + '条，失败' + res.data.result.failedCount + '条,'+ res.data.result.failedBillMsg,
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

            //批量提交
            submitClick(){
                this.$TCS.addTag('erp_finance_007008001005')
                // 判断是否选择
                if (this.checkSelections() === false) return false
                let selections = this.$refs['t8tTable'].getSelectRows()
                for(let i = 0;i<selections.length;i++) {
                    if (selections[i].orderStatus !== 1) {
                        this.$message.error('发票单据状态为”暂存“状态，才允许提交！')
                        return
                    }
                }
                this.$confirm('所选发票若提交成功将进入审核中状态，是否继续操作？', '提交确认', {
                    type: 'warning',
                    confirmButtonText: '提交'
                }).then(() => {
                    let ids = [];
                    let args = {}
                    selections.forEach((item) => {
                        ids.push(item.id)
                    })
                    args.ids = ids;
                    args.operId = this.operId;
                    PurchaseInvoice.invoiceBatchSubmit(args)
                        .then((res) => {
                            if (res.data.status === 200) {
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '提交成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.getTableData()
                            }
                            else{
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
            //反审核前置条件判断
            antiAuditClick() {
                this.$TCS.addTag('erp_finance_007008001006')
                // 单行判断
                if (this.checkSelection() === false) return false

                let selectRow = this.$refs['t8tTable'].getSelectRows()[0]

                if(selectRow.orderStatus != 3 || selectRow.verifyStatus != 1 || selectRow.recordStatus != 1) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '发票的单据状态为“已审核”且记账状态为“未记账”且发票核销状态为“未核销”，才允许反审核！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                }
//             弹窗驳回确认
                this.rejDialog = true
            },
            //反审核执行
            antiAuditFunction(){
                if(this.textareaText===''){
                    this.$message.warning('请输入反审核原因')
                }else{

                    // 单行判断
                    if (this.checkSelection() === false) return false
                    let selectRow = this.$refs['t8tTable'].getSelectRows()[0]
                    if(selectRow.orderStatus != 3 || selectRow.verifyStatus != 1 || selectRow.recordStatus != 1) {
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '发票的单据状态为“已审核”且传K3状态为“未传”且发票核销状态为“未核销”，才允许反审核！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        return false
                    }
                    let args = {
                        id:selectRow.id,
                        operId:parseInt(Cookie.get('t8t-tc-uid')),
                        remark:this.textareaText
                    }
                    PurchaseInvoice.invoiceAntiAudit(args)
                        .then((res) => {
                            if (res.data.status === 200) {
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '已反审核',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.getTableData()
                            }
                            else{
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: '反审核失败，请重试',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                            this.closeRejDialog()
                        })
                }
            },

            //反审核表单
            closeRejDialog() {
                this.rejDialog = false
                this.textareaText = ''
            },
            //红冲表单
            closeRedDialog() {
                this.redDialog = false
                this.redFormData.recordTime = 0
                this.redFormData.textareaText = ''
            },

            //审批流
            flowClick(){
                this.$TCS.addTag('erp_finance_007008001012')
                // 单行判断
                if (this.checkSelection() === false) return false

                let selectRow = this.$refs['t8tTable'].getSelectRows()[0]
                if(selectRow.proInsId) {
                    this.flowArgs = {
                        "proInsId": selectRow.proInsId
                    }
//                    let args = {
//                        "proInsId": selectRow.proInsId
//                    }
//                    PurchaseInvoice.invoiceWorkFlowQuery(args)
//                        .then((res) => {
//                            if (res.data.status === 200) {
//                                this.flowData = res.data.result;
//                            }
//                        })
                }
                this.isShowFlow = true


            },

            closeStepPage(){
                this.isShowFlow = false;
                this.flowArgs = {};
            },

            handleEditorChange(val){
                  this.redFormData.recordTime = val
            },
            //红冲
            invoiceRedClick(){
                this.$TCS.addTag('erp_finance_007008001007')
                // 单行判断
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8tTable'].getSelectRows()[0]
                if(selectRow['colorType'] == 2) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '请勿对红字发票做红冲！',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false;
                }

                //红冲
                let args = {
                    id : selectRow['id']
                }
                PurchaseInvoice.invoiceCanNeutralize(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result == 1){
                            this.redDialog = true
                        }else{
                            this.$msgbox({
                                title: '消息',
                                type: 'warning',
                                message: res.data.message,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.isLoading = false
                        }
                    })

            },

            runInvoiceRed(){
                if(isNaN(this.redFormData.recordTime)){
                    this.$message.warning('请选择记账日期')
                    return false;
                }
                if(this.redFormData.textareaText===''){
                    this.$message.warning('请输入红冲原因')
                    return false;
                }
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8tTable'].getSelectRows()[0]
                let args = {
                    id:selectRow.id,
                    operId:this.operId,
                    recordTime:this.redFormData.recordTime,
                    remark:this.redFormData.textareaText
                }
                //红冲
                PurchaseInvoice.invoiceNeutralize(args)
                    .then((res) => {
                        if(res.data.status === 200){
                            // 新增成功
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '红冲成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.isLoading = false
                            this.closeRedDialog();
                            this.getTableData()
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

            },

            //手动核销
            writeOffClick(){
                 this.$TCS.addTag('erp_finance_007008001008')
                // 单行判断
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8tTable'].getSelectRows()[0]
                if(selectRow['orderStatus'] == 3 && selectRow['verifyStatus'] != 3 ) {
                    if(selectRow['colorType'] == 2) {
                        this.$msgbox({
                            title: '消息',
                            type: 'warning',
                            message: '红字发票暂不支持核销功能',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    }else{
                        //手动新增
                        this.$confirm('是否确定对所选发票做核销？', '核销确认', {
                            type: 'warning',
                            confirmButtonText: '核销'
                        }).then(() => {
                            this.$router.push({path: '/finance/page-purchase-invoice/writeOff', query: {id: selectRow.id}})
                        })
                    }
                }else{
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '发票和对账单单据状态必须是“已审核”且非“已核销”，才允许核销！',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                }

            },

            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },

            //判断是否选中
            checkSelection() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if(selections.length===0){
                    this.$message.error('请勾选单据后再试。')
                    return false
                }else if(selections.length>1){
                    this.$message.error('请对单条数据进行操作。')
                    return false
                }
                return true
            },
            //判断是否选中多个
            checkSelections() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if(selections.length===0){
                    this.$message.error('请勾选单据后再试。')
                    return false
                }
                return true
            },
            //提交搜索
            submitSearch(obj) {
                this.searchCache = this.isEmptyObject(obj) ? {'code': null} : obj;
                this.args = {
                    search: this.searchCache,
                    sort:[
                        "createTime_desc"  //根据创建时间排序
                    ]
                }
            },

            showOpLog(){
                this.$TCS.addTag('erp_finance_007008001011')
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行操作！')
                } else{
                    this.opLogArgs = {
                        search:{
                            recordNo: selections[0].code
                        },
                        sort:["opTime_asc"]
                    };
                    this.opLogDialog = true;
                }
            },

            isEmptyObject(obj){
                for(var key in obj){
                    return false;
                }
                return true;
            },

            //获取配置信息
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
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
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            })
                            this.selectSource[selectName] = list
                        }
                    })
            },

        }
    }
</script>
<style
    lang="css"
    scoped
>
    .antiAudit{
        font-size:14px;
        margin-bottom: 10px;
    }
    .img-container{
        display: flex;
        justify-content: center;
    }
    .textarea-container{
        /*margin: 0 30px;*/
        text-align: center;
    }

    .red-textarea-container{
        margin-top:20px;
    }
    ul.payConfirm li{
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
    }
</style>
<style lang="css">
    .safsadacfa_node-dialog .table-container{
        height: 350px;
    }
    .safsadacfa_node-dialog .el-dialog__body{
        height: 410px;
        display: flex;
    }
    .safsadacfa_node-dialog .el-dialog{
        width:800px;
    }
</style>
