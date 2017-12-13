<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            :ref="t8tSearch"
            @submit="submitSearch"
        ></t8t-search>
        <div class="g-main-container-column">
            <t8t-toolbar
                ref="indexToolbar"
                @AUTOADD="autoAdd"
                @ENABLE="enable"
                @DISABLE="disable"
                @IMPORT="btnImportClick"
                v-loading.body.lock="barLoading"
            ></t8t-toolbar>
            <t8t-table
                :columns="columns"
                :service="service"
                :method="method"
                :commonData="selectSource"
                :args="args"
                :templateData="templateData"
                :isLoading="isLoading"
                :editable="false"
                @cell-editor-change="cellEditorChange"
                ref="t8tTable"
            >
            </t8t-table>
            <div>
                <el-dialog class="source-list-import" title="手动导入汇款记录" v-model="importDialog" @close="closeimportDialog"
                           ref="importDialogRef"
                           v-loading.body.lock="importLoading"
                           element-loading-text="加载中">
                    <div class="textarea-container">
                        <el-upload
                            ref="importSource"
                            :data="params"
                            class="upload-demo"
                            :action="importURL"
                            :on-preview="handlePreview"
                            :file-list="fileList"
                            :on-success="importDeal"
                            :on-progress="importing"
                            :on-remove="removing"
                            accept=".xlsx,.xls"
                            :multiple=false
                        >
                            <div slot="tip" class="el-uplad__tip">
                                请选择要导入的数据文件

                            </div>
                            <div>
                                <el-button
                                    size="small" type="primary">上传文件
                                </el-button>
                                <el-button size="small" type="primary" @click="downloadTemplate">模板下载
                                </el-button>

                            </div>
                            <div slot="tip" class="el-uplad__tip">
                                请选择Excel文件,.xls、.xlsx格式
                                说明：
                                1、数据文件需符合模板要求，若无模板请下载
                                2、引入失败的数据，可下载修改后重新引入




                            </div>
                        </el-upload>
                    </div>
                    <div slot="footer">
                        <el-button type="primary" @click="inputConfirm">确认导入</el-button>
                        <el-button @click="closeimportDialog">取消</el-button>
                    </div>
                    <t8t-table
                        v-if="importTable"
                        :dataSource="importTableData"
                        ref="checkTable"
                        :pageBar=false
                        :selectCol="false"
                    ></t8t-table>
                </el-dialog>
            </div>
            <auto-add-dialog
                v-if="dialogVisible"
                :dialogTitle="dialogTitle"
                :editType="editType"
                :rowId="rowId"
                :selectSource="selectSource"
                @close="dialogVisible=false"
                @getTableData="getTableData"
            ></auto-add-dialog>
        </div>
    </div>
</template>

<script>
    import AutoAddDialog from './auto-add-dialog.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/finance/Service.js'
    import * as config from './config'
    import col from './indexColumns.json'
    import exportUtils from 'src/utils/export.js'
    import virtualCardApi from 'src/services/finance/virtualCard.js'
    import Cookie from 'js-cookie'
    import Utils from 'src/utils/Utils.js'

    export default {
        name: 'virtual-card-remit',
        components: {
            AutoAddDialog
        },
        watch: {
//            $route: function () {
//                this.$refs['t8tTable'].reloadTable()
//            }
        },
        activated () {
            this.$refs['t8tTable'].reloadTable()
        },
        data() {
            return {
                col: col,
                importURL: Utils.getImportURL(Service.VIRTUAL_CARD.name, Service.VIRTUAL_CARD.methods.INITIAL_CARD_REMIT_EXCEL),
                importDialog: false,
                importRadio: "add",
                importTable: false,
                importTableData: [],
                importLoading: false,
                barLoading: false,
                templateData: {
                    bankAccount: null,
                    virtualCard: null,
                    bankFlowNo: null,
                    payUsername:null,
                    payBank:null,
                    payAccount:null,
                    remitAmount:0.00,
                    payTime:0
                },
                // 面包屑
                breadcrumbData: config.breadcrumbData,
                // 搜索表单项配置
                fields: [
                    { type: 'select',label: '财务组织',name: 'orignizationId', selectSourceKey: 'financeOrganizationOptions' },
                    { type: 'input', label: '主卡卡号',name: 'bankAccount' },
                    { type: 'input', label: '虚拟卡卡号',name: 'virtualCard' },
                    { type: 'input', label: '银行流水号',name: 'bankFlowNo' },
                    { type: 'select', label: '时间类型',name: 'timeType', selectSourceKey:'timeTypeOptions'},
                    { type: 'datepicker', name: 'time',pickertype:'datetimerange',startField:'startTime',endField:'endTime'},
                    { type: 'select', label: '确认状态',name: 'status', selectSourceKey:'statusOptions' },
                    { type: 'select', label: '银行类型',name: 'bankId', selectSourceKey:'bankOptions'}
                ],
                selectSource: {
                    // 财务组织
                    financeOrganizationOptions: [],
                    // 银行类型
                    bankOptions: [],
                    // 状态
                    statusOptions: [
                        { text: '未确认', value: 0 },
                        { text: '已确认', value: 1}
                    ],
                    // 卡使用状态
                    timeTypeOptions: [
                        { text: '生成时间', value: 1 },
                        { text: '到账时间', value: 2},
                        { text: '确认时间', value: 3}
                    ]
                },
                service: Service.VIRTUAL_CARD.name,
                method: Service.VIRTUAL_CARD.methods.QUERY_REMIT_PAGE,
                args: {sort:["id_desc"]},
                // 表格列
                columns: config.columns,

                // 弹窗配置
                dialogTitle: '自动导入汇款记录',
                editType: 'autoAdd',
                dialogVisible: false,
                rowId: null,
            }
        },
        created() {
            // 银行主数据
            this.getOrganizationOptions()
            this.getCommonOptions('61101','bankOptions')
        },
        methods: {
            downloadTemplate(){
                let exportArgs = this.args
                exportArgs.page = 1
                exportArgs.size = 1

                exportUtils({
                    service: Service.VIRTUAL_CARD.name,
                    method: Service.VIRTUAL_CARD.methods.QUERY_REMIT_PAGE,
                    title:'虚拟卡汇款记录模版',
                    args: exportArgs,
                    headers: '主卡卡号,虚拟卡卡号,银行流水号,支付方名称,支付银行,支付卡号,到账金额,到帐时间',
                    sorts: 'bankAccount,virtualCard,bankFlowNo,payUsername,payBank,payAccount,remitAmount,payDate'
                })
            },
            closeimportDialog(){
                this.importDialog = false
            },
            importing(event, file, fileList) {
                let list = []
                list.push(file)
                this.fileList = list
                this.importLoading = true
            },
            importDeal(response, file, fileList) {
                this.importTable = false
                this.importTableData = []
                this.importLoading = false
                if (!response.status) {
                    this.$message.error('上传失败')
                    this.importTable = true
                    this.importTableData = response.result
                    return false
                }
                if (response.status != 200) {
                    this.errorAlert(response, "message")
                    this.$refs['importSource'].clearFiles()
                    return false
                }
                else {
                    this.importTable = true
                    this.importTableData = response.result
                }
            },
            errorAlert(data, method = "msg") {
                let errorMsg = ""
                let lineMsg = ""
                if (data.result) {
                    lineMsg = data.result.lineNo ? "第" + data.result.lineNo + "行" : ""
                }
                switch (data.status) {
                    case 50627:
                        errorMsg = lineMsg + "上传异常"
                        break
                    case 50628:
                        errorMsg = lineMsg + "参数错误"
                        break
                    case 50629:
                        errorMsg = lineMsg + "主卡卡号格式错误,请修改后重新导入"
                        break
                    case 50630:
                        errorMsg = lineMsg + "虚拟卡卡号格式错误,请修改后重新导入"
                        break
                    case 50632:
                        errorMsg = lineMsg + "到账金额格式错误,请修改后重新导入"
                        break

                    default:
                        errorMsg = data.message || "请求超时"
                }
                if (method == "msg") {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: errorMsg,
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                } else {
                    this.$message.error(errorMsg)
                }
                return false
            },
            inputConfirm() {
                let reqArr = []
                if (this.importTableData.length < 1) {
                    this.$message.error('请上传文件后重试')
                    return false
                }
                this.importTableData.forEach((item) => {
                    reqArr.push({
                        "bankAccount": item.bankAccount,
                        "virtualCard": item.virtualCard,
                        "bankFlowNo": item.bankFlowNo,
                        "payUsername": item.payUsername,
                        "payBank": item.payBank,
                        "payAccount": item.payAccount,
                        "remitAmount": item.remitAmount,
                        "payTime": item.payTime
                    })
                })
                this.importLoading = true
                let _this = this
                let args = {
                    virtualCardRemittances: reqArr
                }
                virtualCardApi.batchRemitCreate(args)
                    .then((res) => {
                        _this.importLoading = false
                        let addMessage=null
                        if (res.data.status === 200) {
                            let successSum = res.data.result.succNum
                            let failSum = res.data.result.failNum
                            let repeatNum=res.data.result.repeatNum
                            addMessage = '手动导入汇款记录,成功' + successSum + '条，重复' + repeatNum + '条，失败'+failSum+'条'
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: addMessage,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.importDialog = false
                            this.$refs["t8tTable"].reloadTable()
                        } else {
                            this.errorAlert(res.data)
                            _this.importLoading = false
                        }
                    })
            },
            removing() {
                this.importTableData = []
                this.$refs['importSource'].clearFiles()
                this.importTable = false
            },
            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },
            closeCreateDialog(){
                this.createDialog = false
            },
            btnImportClick(){
                this.barLoading = true
                this.$refs['indexToolbar'].disableBySymbol("IMPORT")
                if (this.$refs['importSource']) {
                    this.$refs['importSource'].clearFiles()
                }
                this.importTable = false
                this.importDialog = true
                this.barLoading = false
                this.$refs['indexToolbar'].unDisableBySymbol("IMPORT")
            },
            // 自动新增
            autoAdd() {
                this.dialogTitle = '自动导入汇款记录'
                this.editType = 'autoAdd'
                this.dialogVisible = true
                this.rowId = null
            },
            // 搜索
            submitSearch(obj) {
                this.args = { search: obj, sort:["id_desc"]}
            },
            // 辅助资料
            getCommonData: function(fatherCode,selectName) {
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
            getOrganizationOptions() {
                // 法人职能和利润中心
                let arg = {
                    funcCodes:["001004013", "001004014"]
                }
                let list = []
                commonApi.queryByFunctionCode(arg)
                    .then((res) => {
                        if(res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if(item.isDel !== 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.name
                                    })
                                }
                            })
                            this.selectSource.financeOrganizationOptions = list
                        }
                    })
            },
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
                                };
                            })
                            this.selectSource[selectName] = list
                        }
                    })
            },
            // 表格数据重新拉取
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            }
        }
    }
</script>

<style lang="css" scoped>
    .viewChannelKey {
        margin-top: -30px;
    }
    .source-list .upload-demo {
        width: 240px;
        margin: 10px auto 5px;
    }

    .source-list .upload-demo .el-upload {
        float: left;
    }

    .source-list .upload-demo .el-uplad__tip {
        line-height: 30px;
    }
</style>
