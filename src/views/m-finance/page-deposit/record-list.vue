<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="searchFields"
            :selectSource="selectSource"
            @submit="onSearchSubmit"
            @change="onChange"
            ref="t8tsearch"
        >
        </t8t-search>
        <t8t-toolbar
            @ADD="onAdd"
            @VIEW="routeDetail"
            @EXPORT="onExport"
            @IMPORT="onImport"
            @VOID="onCancel"
            @APPROVAL-FLOW="onApproval"
            @EDIT="onEdit"
            @TEST="test"
            v-loading.body.lock="toolbarLoading"
            element-loading-text="加载中"
        >
        </t8t-toolbar>
        <t8t-table
            :columns="tableColumns"
            :service="service"
            :method="method"
            :commonData="selectSource"
            :args="tableArgs"
            @double-click="routeDetail()"
            ref="t8ttable"
        >
        </t8t-table>

        <el-dialog title="是否确认作废？" v-model="cancelDialogVisible" size="small">
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="cancel">作 废</el-button>
                <el-button @click="cancelDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <div>
            <el-dialog class="source-list-import" title="导入" v-model="importDialog" @close="closeimportDialog"
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
                    <el-button @click="closeImportDialog">取消</el-button>
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
    </div>

</template>


<script>
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/commonApi/Service.js'
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import dateUtils from 'src/utils/DateUtils.js'
    import depositAPI from 'src/services/finance/deposit.js'
    import Cookie from 'js-cookie'
    import financeService from 'src/services/finance/Service.js'
    import exportUtils from 'src/utils/export.js'//导出
    import Utils from 'src/utils/Utils.js'

    export default{
        components: {T8tListView},
        data(){
            return {
                importURL: Utils.getImportURL(financeService.DEPOSIT_MANAGEMENT.name, financeService.DEPOSIT_MANAGEMENT.methods.RECORD_EXCEL),
                importDialog: false,
                importRadio: "add",
                importTable: false,
                importTableData: '',
                importLoading: false,
                fileList: [],
                cancelDialogVisible: false,
                service: financeService.DEPOSIT_MANAGEMENT.name,
                method: financeService.DEPOSIT_MANAGEMENT.methods.RECORD_QUERY,
                tableArgs: {
                    search: {
                        id: null
                    },
                    sort: ["id_desc"]
                },
                exportParams: {
                    search: {id_gt: 0},
                    sort: ["id_desc"],
                    page: 1,
                    size: 10000
                },//导出传参
                tableColumns: [
                    {prop: 'code', label: '单据编码'},
                    {prop: 'orgName', label: '组织'},
                    {prop: 'bizTypeName', label: '业务类型'},
                    {prop: 'pmId', label: '项目经理ID'},
                    {prop: 'pmName', label: '项目经理'},
                    {prop: 'recordDirect', label: '收支类型', list: "recordDirectOptions"},
                    {prop: 'amount', label: '金额'},
                    {prop: 'remark', label: '备注'},
                    {
                        prop: 'status', label: '生效状态',
                        formatter: function (val, row) {
                            if (val === 1) {
                                return '已生效'
                            }
                            else if (val > 1) {
                                return '已作废'
                            }
                        }
                    },
                    {prop: 'auditStatus', label: '审核状态', "list": "auditStatusOptions"},
                    {prop: 'createName', label: '创建人'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                    {prop: 'auditName', label: '审核人'},
                    {prop: 'auditTime', label: '审核时间', formatter: 'dateParser'},
                    {prop: 'cancelName', label: '作废人'},
                    {prop: 'cancelTime', label: '作废时间', formatter: 'dateParser'}

                ],
                searchFields: [
                    {
                        type: 'popup', label: '组织', name: 'orgId', textValue: 'name', filedValue: 'id',
                        dialog: {
                            title: "组织查询",
                            size: 'large',
                            searchForm: {
                                fields: [
                                    {type: 'input', label: '组织', name: 'name_like'},
                                ],
                                resetBtnVisible: false,
                                showToggleBtn: false,
                                labelWidth: '50px'
                            },
                            table: {
                                radioCol: true,
                                //表格
                                columns: [{
                                    prop: 'code',
                                    label: '组织编号'
                                }, {
                                    prop: 'name',
                                    label: '组织'
                                }],
                                //请求参数配置
                                service: Service.ORGANIZATION.name,
                                method: Service.ORGANIZATION.methods.ORG_QUERY_WITHOUTDEL,
                                args: {
                                    search: {
                                        typeCode: '001003006'
                                    },
                                    sort: ['id_desc']
                                }
                            },
                            onConfirm: this.onPopupConfirm
                        },

                        //自动补全
                        remote: true,
                        service: Service.ORGANIZATION.name,
                        method: Service.ORGANIZATION.methods.ORG_QUERY_WITHOUTDEL,
                        remoteQueryKey: "name"

                    },
                    {type: 'input', label: '项目经理ID', name: 'pmId'},
                    {type: 'input', label: '项目经理', name: 'pmName_like'},
                    {type: 'select', label: '收支类型', name: 'recordDirect', selectSourceKey: 'recordDirectOptions'},
                    {type: 'input', label: '项目ID', name: 'projectId'},
                    {type: 'select', label: '审核状态', name: 'auditStatus', selectSourceKey: 'auditStatusOptions'},
                    {type: 'select', label: '生效状态', name: 'status', selectSourceKey: 'statusOptions'},
                    {type: 'select', label: '时间类型', name: 'timeType', selectSourceKey: 'timeTypeOptions'},
                    {
                        type: 'datepicker',
                        label: '起止时间',
                        name: 'time',
                        pickertype: 'daterange',
                        startField: 'time_gte',
                        endField: 'time_lte'
                    }
                ],
                selectSource: {
                    statusOptions: [{
                        text: '已生效',
                        value: 1
                    }, {
                        text: '已作废',
                        value: 2
                    }
                    ],
                    timeTypeOptions: [{
                        text: '创建时间',
                        value: 'create'
                    }, {
                        text: '审核时间',
                        value: 'audit'
                    }, {
                        text: '作废时间',
                        value: 'update'
                    }
                    ],
                    recordDirectOptions: [{
                        text: '收入',
                        value: 1
                    }, {
                        text: '支出',
                        value: 2
                    }
                    ],
                    auditStatusOptions: [{
                        text: '审核中',
                        value: 1
                    }, {
                        text: '审核通过',
                        value: 2
                    }, {
                        text: '已驳回',
                        value: 3
                    }]
                }
                ,
                breadcrumbData: [
                    {title: '财务'},
                    {title: '质保金管理'},
                    {title: '收支查询'}
                ],

            }
        },
        watch: {
            $route() {
                this.$refs['t8ttable'].reloadTable()
            }
        },

        methods: {
            onChange(value, name){
                if (name === 'timeType' && value === 'update' && this.$refs.t8tsearch.formData.status != 2) {
                    this.$message.error('请先选择状态为已作废')
                    this.$refs.t8tsearch.setFormData({timeType: null});
                }
                if (name === 'time' && !this.$refs.t8tsearch.formData.timeType) {
                    this.$message.error('请先选择时间类型')
                }
            },
            onSearchSubmit(obj){
                let paramArgs = obj
                if (paramArgs.timeType) {
                    let timeName = paramArgs.timeType + 'Time'
                    paramArgs[timeName + '_gte'] = paramArgs.time_gte
                    paramArgs[timeName + '_lte'] = paramArgs.time_lte
                    delete paramArgs.time_gte
                    delete paramArgs.time_lte
                    delete paramArgs.timeType
                }
                if (paramArgs.status === 2) {
                    let temp = 'status_gte'
                    paramArgs[temp] = paramArgs.status
                    delete paramArgs.status
                }
                this.tableArgs = {
                    search: paramArgs,
                    sort: ["id_desc"]
                }
                this.exportParams.search = paramArgs
            },
            test(){
                let selection = this.$refs['t8ttable'].getSelectRows()
                if (selection.length === 0) {
                    this.$message.error('请勾选数据后再试')
                }
                else if (selection.length > 1) {
                    this.$message.error('请对单条数据进行操作')
                }
                else {
                    this.$router.push({
                        path: '/tochat-finance/record-list/record-audit',
                        query: {
                            procInsId: selection[0].proInsId,
                            taskId: 1
                        }
                    })
                }
            },
            onApproval(){
                let selection = this.$refs['t8ttable'].getSelectRows()
                if (selection.length === 0) {
                    this.$message.error('请勾选数据后再试')
                }
                else if (selection.length > 1) {
                    this.$message.error('请对单条数据进行操作')
                }
                else if (selection[0].recordDirect != 2) {
                    this.$message.error('请对支出单进行操作')
                }
                else {
                    this.$router.push({
                        path: '/tochat-finance/record-list/approval',
                        query: {
                            id: selection[0].id
                        }
                    })
                }
            },
            onAdd(){
                this.$router.push({
                    path: '/tochat-finance/record-list/create',
                })
            },
            onEdit(){
                let selection = this.$refs['t8ttable'].getSelectRows()
                if (selection.length === 0) {
                    this.$message.error('请勾选数据后再试')
                }
                else if (selection.length > 1) {
                    this.$message.error('请对单条数据进行操作')
                }
                else {
                    if (selection[0].recordDirect === 1 && selection[0].status === 1) {
                        this.$router.push({
                            path: '/tochat-finance/record-list/update',
                            query: {
                                id: selection[0].id,
                                orgName: selection[0].orgName,
                                pmId: selection[0].pmId,
                                pmName: selection[0].pmName,
                                bizTypeName: selection[0].bizTypeName,
                                amount: selection[0].amount,
                                createName: selection[0].createName,
                                createTime: selection[0].createTime,
                                remark: selection[0].remark,
                            }
                        })
                    }
                    else
                        this.$message.error('请对生效的收入单进行操作')
                }
            },
            routeDetail(){
                this.$TCS.addTag('erp_finance_007010002001')
                //传入参数recordId
                let selections = this.$refs['t8ttable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再试')
                }
                else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作')
                }
                else {
                    let id = selections[0].id
                    let orgName = selections[0].orgName
                    let pmId = selections[0].pmId
                    let pmName = selections[0].pmName
                    this.$router.push({
                        path: '/tochat-finance/record-list/record-detail',
                        query: {
                            id: id,
                            code: selections[0].code,
                            bizTypeName: selections[0].bizTypeName,
                            orgName: orgName,
                            pmId: pmId,
                            pmName: pmName,
                            recordDirect: selections[0].recordDirect,
                            amount: selections[0].amount,
                            remark: selections[0].remark
                        }
                    })
                }

            },
            //作废按钮
            onCancel(){
                let selections = this.$refs['t8ttable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再试')
                }
                else if (selections.length > 1) {
                    this.$message.error('请勾选单条数据')
                }
                else {
                    let select = selections[0]
                    if (select.status === 1 && select.recordDirect === 1) {
                        this.cancelDialogVisible = true
                    }
                    else {
                        this.$message.error('选中数据必须为已生效的收入单才可作废')
                    }
                }
            },
            //作废确认按钮
            cancel(){
                let recordId = this.$refs['t8ttable'].getSelectRows()[0].id
                let args = {
                    recordId: recordId,
                    operId: parseInt(Cookie.get('t8t-tc-uid'))
                }
                depositAPI.recordCancel(args).then((res) => {
                    this.cancelDialogVisible = false
                    if (res.data.status === 200) {
                        this.$refs['t8ttable'].reloadTable()
                        this.$alert('作废成功', '信息', {
                            confirmButtonText: '确定'
                        })
                    }
                    else {
                        this.$alert(res.data.message, '错误提示', {
                            confirmButtonText: '确定'
                        })
                    }
                })
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
                let checkArray = this.$refs['t8ttable'].getSelectRows()
                if (checkArray.length > 0) {
                    checkArray.forEach((item) => {
                        ids.push(item.id)
                    })
                    this.exportParams = {
                        search: {
                            id_in: ids
                        },
                        sort: ["id_desc"],
                        page: 1,
                        size: 10000
                    }
                }

                let paramsExport = this.exportParams.search
                let objectFlag = false
                objectFlag = this.isEmptyObjectParams(paramsExport)
                if (!objectFlag) {
                    this.exportParams = {
                        search: {
                            id_gt:0
                        },
                        sort: ["id_desc"],
                        page: 1,
                        size: 10000
                    }
                }
                exportUtils({
                    service: financeService.DEPOSIT_MANAGEMENT.name,
                    method: financeService.DEPOSIT_MANAGEMENT.methods.RECORD_EXPORT,
                    title:'质保金收支单',
                    args: this.exportParams,
                    headers: 'ID,单据编码,项目ID,组织,业务类型,项目经理ID,项目经理,收支类型,产品包,业主姓名,项目地址,质保金类型,金额,用途类型,事故项目id,备注,生效状态,审核状态',
                    sorts: 'id,code,projectId,orgName,bizTypeName,pmId,pmName,recordDirect,productPackageName,customerName,projectAddress,depositTypeName,amount,useTypeName,accidentProjectId,remark,status,auditStatus'
                })
            },
            isEmptyObjectParams(data)
            {
                let objectFlags = false

                for (let i in data) {
                    if(data[i]!=null){
                        objectFlags = true
                    }
                }
                return objectFlags
            },
            onImport(){
                this.importDialog = true
            },
            closeImportDialog(){
                this.$refs['importSource'].clearFiles()
                this.importDialog = false
                this.importTableData = ''
            },
            inputConfirm() {
                let reqArr = []
                if (!this.importTableData) {
                    this.$message.error('请上传文件后重试')
                    return false
                }
                this.importLoading = true
                let _this = this
                let args = {
                    incomeOrderDTOs: this.importTableData,
                    operId: parseInt(Cookie.get('t8t-tc-uid'))
                }
                depositAPI.recordImport(args)
                    .then((res) => {
                        _this.importLoading = false
                        if (res.data.status === 200) {
                            let addMessage = res.data.result.reason
                            if(addMessage === '导入成功'){
                                this.closeImportDialog()
                                this.$refs["t8ttable"].reloadTable()
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: addMessage,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                            else{
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: addMessage,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                        } else {
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: res.data.message,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            _this.importLoading = false
                        }
                    })
            },
            removing() {
                this.importTableData = ''
                this.$refs['importSource'].clearFiles()
                this.importTable = false
            },
            importing(event, file, fileList) {
                let list = []
                list.push(file)
                this.fileList = list
                this.importLoading = true
            },
            importDeal(response, file, fileList) {
                this.importTable = false
                this.importLoading = false
                if (!response.status) {
                    this.$message.error('上传失败')
                    this.importTable = true
                    return false
                }
                if (response.status != 200) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: response.message,
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    this.$refs['importSource'].clearFiles()
                    return false
                }
                else if (response.result.message) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: response.result.message,
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    this.$refs['importSource'].clearFiles()
                    return false
                }
                else {
                    this.importTable = true
                    this.importTableData = response.result.incomeOrderDTOs
                }
            },
        }

    }

</script>

<style scoped>
    .my-span {
        text-align: center;
    }


</style>
