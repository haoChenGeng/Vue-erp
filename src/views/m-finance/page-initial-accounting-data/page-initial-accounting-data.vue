<template>
    <div v-bind="initial-accounting-data">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-toolbar
            ref="indexToolbar"
            @ADD="btnAddClick"
            @EDIT="btnEditClick"
            @DELETE="btnDeleteClick"
            @SUBMIT="btnSubmitClick"
            @IMPORT="btnImportClick"
            v-loading.body.lock="barLoading"
        >
        </t8t-toolbar>
        <t8t-table
            :columns="columns"
            :commonData="selectSource"
            :service="service"
            :method="method"
            :args="args"
            :templateData="templateData"
            :isLoading="isLoading"
            :indexCol="true"
            :editable="false"
            @cell-click="handleFormItemBlur"
            @cell-editor-change="cellEditorChange"
            ref="t8tTable"
        >
        </t8t-table>
        <div>
            <el-dialog class="source-list-import" title="期初核算数据导入" v-model="importDialog" @close="closeimportDialog"
                       ref="importDialogRef"
                       v-loading.body.lock="importLoading"
                       element-loading-text="加载中">

                <div class="textarea-container">
                    <el-upload
                        ref="importSource"
                        :data="params"
                        class="upload-demo-damonwu"
                        :action="importURL"
                        :on-preview="handlePreview"
                        :file-list="fileList"
                        :on-success="importDeal"
                        :on-progress="importing"
                        :on-remove="removing"
                        accept=".xlsx,.xls"
                        :multiple=false
                    >
                        <div class="upload-button-damon">
                            <div slot="tip" class="el-uplad_tip">
                                请选择要导入的数据文件（仅支持.xls、.xlsx格式文件）:<br></div>
                            <el-button size="small" type="primary">上传文件</el-button>

                        </div>
                        <div slot="tip" class="el-uplad__tip">
                            <br>说明：<br>
                            1、数据文件需符合模板要求，若无模板请下载<br>
                            2、引入失败的数据，可下载修改后重新引入<br>
                        </div>
                    </el-upload>
                </div>
                <div slot="footer">
                    <el-button size="small" type="primary" @click="downloadTemplate">模板下载</el-button>
                    <el-button size="small" type="primary" @click="inputConfirm">确认导入</el-button>
                    <el-button size="small" @click="closeimportDialog">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Service from 'src/services/finance/Service.js'
    import supplyService from 'src/services/supply/purchase.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import apiInventoryAccountingInitialAccountingData from 'src/services/finance/initialAccountingData.js'
    import apiInventoryAccountingCostDomainConfig from 'src/services/finance/costDomainConfig.js'
    import col from './indexColumns.json'
    import apiInventoryStorage from 'src/services/supply/inventoryStorage.js'
    import apiGoods from 'src/services/supply/goods.js'
    import Cookie from 'js-cookie'
    import * as config from './config'
    import exportUtils from 'src/utils/export.js'
    import Utils from 'src/utils/Utils.js'

    export default {
        name: 'page-initial-accounting-data',
        components: {},
        methods: {
            downloadTemplate(){
                let exportArgs = this.args
                exportArgs.page = 1
                exportArgs.size = 1

                exportUtils({
                    service: Service.INVENTORY_ACCOUNTING.name,
                    method: Service.INVENTORY_ACCOUNTING.methods.initialAccountingDataQueryPage,
                    args: exportArgs,
                    title:"期初数据模板",
                    headers: '成本域,仓库编码,商品编码,期初数量,期初单价,备注',
                    sorts: 'costDomainName,warhouseName,goodsCode,goodsInitialCount,initialNoTaxPrice,remark'
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
                    case 50810:
                        errorMsg = lineMsg + "上传异常"
                        break
                    case 50811:
                        errorMsg = lineMsg + "参数错误"
                        break
                    case 50812:
                        errorMsg = lineMsg + "期初数量格式错误,请修改后重新导入"
                        break
                    case 50813:
                        errorMsg = lineMsg + "期初单价格式错误,请修改后重新导入"
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
                        "costDomainName": item.costDomainName,
                        "warhouseCode": item.warhouseCode,
                        "goodsCode": item.goodsCode,
                        "goodsInitialCount": item.goodsInitialCount,
                        "initialNoTaxPrice": item.initialNoTaxPrice,
                        "remark": item.remark
                    })
                })
                this.importLoading = true
                let _this = this
                let args = {
                    initialAccountingDataList: reqArr,
                    updateUser: parseInt(Cookie.get('t8t-tc-uid'))
                }
                apiInventoryAccountingInitialAccountingData.batchImport(args)
                    .then((res) => {
                        _this.importLoading = false
                        if (res.data.status === 200) {
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '导入成功' + res.data.result.successNum + '条，失败' + res.data.result.failNum + '条',
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
            btnSubmitClick(){

                this.$refs['t8tTable'].editable = true;
                this.$refs['t8tTable'].validate(valid => {
                    if (valid) {

                        var user = parseInt(Cookie.get('t8t-tc-uid'))
                        let actionLog = this.$refs['t8tTable'].getActionLog(false, true);
                        if (actionLog.editedRows.length === 0 && actionLog.addedRows.length === 0 && actionLog.deletedIDs.length === 0) {
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '无任何新增或者修改，无需提交',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            return
                        }
                        for (var i = 0; i < actionLog.editedRows.length; i++) {
                            actionLog.editedRows[i]['updateUser'] = user;
                        }

                        let args = {
                            "initialAccountingDataUpdateDTOs": actionLog.editedRows,
                            "initialAccountingDataInsertDTOs": actionLog.addedRows,
                            "initialAccountingDataDeleteIds": actionLog.deletedIDs
                        }

                        apiInventoryAccountingInitialAccountingData.batchDeleteInsertOrUpdate(args)
                            .then((res) => {
                                    if (res.data.status === 200) {
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'success',
                                            message: '成功',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                        this.isLoading = false
                                        this.$refs['t8tTable'].reloadTable()
                                    }
                                    else {
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
                                }
                            )
                    }
                    else {
                        return false;
                    }
                })

                this.$refs['t8tTable'].editable = false;
            },
            //编辑时验证方法
            cellEditorChange(cell, val)
            {
                if (cell.column.property === 'goodsId') {
                    cell.row.goodsName = val.goodsName
                    cell.row.goodsId = val.id
                    cell._self.handleFormItemBlur()
                }

                if (cell.column.property === 'warhouseId') {
                    cell.row.warhouseId = val.id
                    cell.row.warhouseOrgName = val.orgName
                    cell._self.handleFormItemBlur()
                }
            },
            handleFormItemBlur(row, column, cell, event)
            {
                var addIndex = this.$refs['t8tTable'].getActionLog(false).addedRows.indexOf(row)
                var editIndex = this.$refs['t8tTable'].getActionLog(false).editedRows.indexOf(row)

                if (addIndex === -1 && editIndex === -1) {
                    this.$refs['t8tTable'].handleFormItemBlur();
                }
                else if (addIndex !== -1 && editIndex === -1) {
                    this.$refs['t8tTable'].editable = true;
                }
                else {
                    let selections = this.$refs['t8tTable'].getSelectRows()
                    if (selections.length > 1) {

                    }
                    else if (selections.length === 1) {
                        let selectedRow = selections[0]

                        if (selectedRow.id !== row.id) {
                            this.$refs['t8tTable'].handleFormItemBlur();
                        }
                        else {
                            let req = column.property
                            let arr = ["costDomainId", "warhouseId", "goodsId", "initialNoTaxAmount"]
                            if (arr.indexOf(req) !== -1) {
                                this.$refs['t8tTable'].handleFormItemBlur();
                            }
                        }
                    }
                }
            },
            submitSearch(obj)
            {
                this.$refs['t8tTable'].resetActionLog()
                this.searchCache = obj
                this.args = {search: obj}
            }
            ,
            //点击新增按钮
            btnAddClick()
            {
                this.$refs['t8tTable'].addNewRow()
            },
            btnEditClick()
            {
                // 点击编辑按钮
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                } else {
                    if (this.$refs['t8tTable'].editable !== true) {
                        this.$refs['t8tTable'].editable = true;
                    }
                }
            },
            btnDeleteClick()
            {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else {
                    this.$refs['t8tTable'].delRows(selections)
                }
            }
        },
        computed: {}
        ,
        watch: {
            $route: function () {
                this.$refs['t8tTable'].resetActionLog()
                this.$refs['t8tTable'].reloadTable()
            }
        },
        data()
        {
            return {
                col: col,
                importURL: Utils.getImportURL(Service.INVENTORY_ACCOUNTING.name, Service.INVENTORY_ACCOUNTING.methods.initialAccountingDataUploadFile),
                importDialog: false,
                importRadio: "add",
                importTable: false,
                importTableData: [],
                importLoading: false,
                barLoading: false,
                dialogVisible: false,
                templateData: {
                    costDomainId: null,
                    warhouseOrgId: null,
                    warhouseId: null,
                    goodsId: null,
                    goodsInitialCount: 0.00,
                    initialNoTaxPrice: 0.00,
                    initialNoTaxAmount: 0,
                    remark: null,
                    createUser: parseInt(Cookie.get('t8t-tc-uid')),
                    updateUser: parseInt(Cookie.get('t8t-tc-uid'))
                },
                breadcrumbData: config.breadcrumbData,
                //表格
                columns: config.columns,
                selectSource: config.selectSource,
                isLoading: false,
                service: Service.INVENTORY_ACCOUNTING.name,
                method: Service.INVENTORY_ACCOUNTING.methods.initialAccountingDataQueryPage,
                args: {
                    search: {
                        id_gt: 0
                    }
                },
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                searchCache: {
                    "costDomainId": null
                },
                //搜索表单项配置
                fields: [
                    {
                        type: 'select',
                        label: '成本域',
                        name: 'costDomainId',
                        selectSourceKey: 'costDomainConfigOptions'
                    },
                    {
                        type: 'popup',
                        label: '仓库',
                        name: 'warhouseId',
                        textValue: 'name', filedValue: 'id',
                        dialog: {
                            dialogWidth: '780px',
                            title: "查询仓库",
                            size: 'large',
                            searchForm: {
                                fields: [
                                    {type: 'input', label: '仓库编码', name: 'code_like'},
                                    {type: 'input', label: '仓库名称', name: 'name_like'}
                                ],
                                resetBtnVisible: false,
                                showToggleBtn: false,
                                labelWidth: '100px'
                            },
                            table: {
                                //表格
                                columns: [{
                                    prop: 'code',
                                    label: '仓库编码'
                                }, {
                                    prop: 'name',
                                    label: '仓库名称'
                                }],
                                //请求参数配置
                                service: supplyService.InventoryStorage.name,
                                method: supplyService.InventoryStorage.methods.inventoryStorageQueryPage,
                                args: {}
                            }
                        },
                        //自动补全
                        remote: true,
                        service: supplyService.InventoryStorage.name,
                        method: supplyService.InventoryStorage.methods.inventoryStorageQueryPage,
                        remoteArgs: {
                            search: {},
                            page: 1,
                            size: 100
                        },
                        remoteQueryKey: "name_like"
                    },
                    {
                        type: 'popup',
                        label: '商品',
                        name: 'goodsId',
                        textValue: 'goodsName', filedValue: 'id',
                        dialog: {
                            dialogWidth: '780px',
                            title: "查询商品",
                            size: 'large',
                            searchForm: {
                                fields: [
                                    {type: 'input', label: '商品编码', name: 'goodsCode'},
                                    {type: 'input', label: '商品名称', name: 'goodsName'}
                                ],
                                resetBtnVisible: false,
                                showToggleBtn: false,
                                labelWidth: '100px'
                            },
                            table: {
                                //表格
                                columns: [{
                                    prop: 'goodsCode',
                                    label: '商品编码'
                                }, {
                                    prop: 'goodsName',
                                    label: '商品名称'
                                }],
                                //请求参数配置
                                service: supplyService.Goods.name,
                                method: supplyService.Goods.methods.goodsQueryPage,
                                args: {}
                            }
                        },
                        //自动补全
                        remote: true,
                        service: supplyService.Goods.name,
                        method: supplyService.Goods.methods.goodsQueryPage,
                        remoteArgs: {
                            search: {},
                            page: 1,
                            size: 200
                        },
                        remoteQueryKey: "goodsName"
                    }

                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
            }
        }
        ,
        created()
        {
            let args = {
                search: {
                    status: 1
                }
            };
            apiInventoryAccountingCostDomainConfig.query(args)
                .then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.id,
                                text: item.name
                            })
                        })
                        this.selectSource.costDomainConfigOptions = list
                    }
                }))

            apiInventoryStorage.queryInventoryStorage()
                .then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.id,
                                text: item.name
                            })
                        })
                        this.selectSource.inventoryStorageOptions = list
                    }
                }))

            apiGoods.queryGoodsList()
                .then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.id,
                                text: item.goodsCode
                            })
                        })
                        this.selectSource.goodsOptions = list
                    }
                }))
        }
    }

</script>

<style>
    .upload-demo-damonwu .el-upload{
        text-align: left;
    }
</style>
