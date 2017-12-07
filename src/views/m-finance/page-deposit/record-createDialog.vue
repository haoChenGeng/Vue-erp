<template>
    <div>
        <el-dialog v-model="isDialogShow"
                   size="full"
                   @close="backRoute"
                   class="t8t-full-dialog dialog-edit">
            <div class="t8t-full-dialog-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            ref="toolbar"
                            class="t8t-dark"
                            @SUBMIT="doSubmit">
                        </t8t-toolbar>
                    </div>
                </div>
                <!-- 表单区 -->
                <div class="full-dialog-form-container">
                    <t8t-form-panel ref="record"
                                    :commonData="selectSource"
                                    :dataSource="recordData"
                                    :fields="fields"
                    ></t8t-form-panel>
                </div>
                <div class="full-dialog-tabs-container">
                    <!-- 标签页区 -->
                    <el-tabs v-model="activeTabName">
                        <el-tab-pane label="收支明细" name="one" class="tableDebitType">
                            <div class="dialog2-toolbar-container">
                                <el-button
                                    type="primary"
                                    size="small"
                                    icon="plus"
                                    @click="add()"
                                >新增行



                                </el-button>
                                <el-button
                                    type="danger"
                                    size="small"
                                    icon="close"
                                    @click="del()"
                                >删除行



                                </el-button>
                            </div>
                            <t8t-grid ref="t8tTable"
                                       :columns="tableColumns"
                                       :commonData="selectSource"
                                       :selectCol="true"
                                       :indexCol="true"
                                       :pageBar="false"
                                       :editable="true"
                            ></t8t-grid>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-dialog>
    </div>


</template>


<script>
    import dateUtils from 'src/utils/DateUtils.js'
    import financeService from 'src/services/finance/Service.js'
    import depositAPI from 'src/services/finance/deposit.js'
    import Cookie from 'js-cookie'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/commonApi/Service.js'

    export default{
        data(){
            return {
                recordData: {
                    pmId: '',
                    bizTypeId: '',
                    balance: '',
                    remark: '',
                    orgId: '',
                    amount: '',
                    createUser: ''
                },
                record: '',
                activeTabName: 'one',
                isDialogShow: true,
                tableColumns: [
                    {
                        type: "index",
                        label: "序号",
                        summaryType: () => "合计"
                    },
                    {
                        prop: 'projectId', label: '支出项目ID', required: true,
                        onChange: this.projectChange,
                        editor:(val,row,col,tab)=>{
                            return {
                            type: 'lookup',
                            service: financeService.DEPOSIT_MANAGEMENT.name,
                            method: financeService.DEPOSIT_MANAGEMENT.methods.ITEM_QUERY,
                            args:
                                {
                                search:{
                                    pmId:this.recordData.pmId,
                                    bizTypeId: this.recordData.bizTypeId
                                }
                            },
                            'columns': [
                                {
                                    'prop': 'projectId',
                                    'label': '项目id'
                                },
                                {
                                    'prop': 'orgName',
                                    'label': '组织'
                                },
                                {
                                    'prop': 'bizTypeName',
                                    'label': '业务类型'
                                },
                                {
                                    'prop': 'productPackageName',
                                    'label': '产品包'
                                },
                                {
                                    'prop': 'depositTypeName',
                                    'label': '质保金类型'
                                },
                                {
                                    'prop': 'balance',
                                    'label': '当前余额'
                                }],
                            'filterMethod': this.filterMethod,
                            multiple: false
                        }},
                        required: true,
                    },
                    {prop: 'orgName', label: '组织', readonly: true},
                    {prop: 'bizTypeName', label: '业务类型', readonly: true},
                    {prop: 'productPackageId', label: '产品包', list: 'productPackageOptions', readonly: true},
                    {prop: 'depositType', label: '质保金类型', list: 'depositTypeOptions', readonly: true},
                    {prop: 'balance', label: '当前余额', readonly: true},
                    {
                        prop: 'amount', label: '支出金额', required: true,
                        onChange: this.onChange,
                        editor: {
                            type: 'input',
                            rules: [{
                                required: true,
                                message: '请输入数字'
                            }, {
                                type: 'number',
                                min: 0,
                                max: 100000,
                                transform (val) {
                                    return Number(val);
                                },
                                message: '请输入0至10万之间的数字'
                            }]
                        },
                    },
                    {
                        prop: 'useTypeCode',
                        label: '支出用途',
                        required: true,
                        list: 'useTypeOptions',
                        editor: {type: 'select', rules:[{required: true,message: '请选择支出用途'}]}
                    },
                    {prop: 'accidentProjectId', label: '事故项目id', editor: {type: 'input'}},
                    {prop: 'remark', label: '备注', editor: {type: 'input',rules:[{max:1000,message:'请输入1000字符以内的内容'}]}}
                ],
                selectSource: {
                    depositTypeOptions: [],
                    productPackageOptions: [],
                    bizTypeOptions: [],
                    useTypeOptions: [],
                    pmNameOptions: []
                },

                fields: [
                    {
                        prop: 'orgId', required: true,
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
                                    search:{
                                        typeCode:'001003006'
                                    },
                                    sort: ['id_desc']
                                }
                            },
                            onConfirm: this.orgPopupConfirm
                        },
                        //自动补全
                        remote: true,
                        service: Service.ORGANIZATION.name,
                        method: Service.ORGANIZATION.methods.ORG_QUERY_WITHOUTDEL,
                        remoteQueryKey: "name",
                        rules: {required: true, message: '请选择组织'}
                    },
                    {prop: 'pmId', type: 'input', label: '项目经理ID', disabled: true},
                    {
                        prop: 'pmId', type: 'select', label: '项目经理', required: true, list: 'pmNameOptions',
                        rules: {required: true, message: '请选择项目经理'}
                    },
                    {
                        prop: 'bizTypeId',
                        type: 'select',
                        list: 'bizTypeOptions',
                        label: '业务类型',
                        rules: {required: true, message: '请选择业务类型'}
                    },
                    {prop: 'amount', type: 'input', label: '总金额', disabled: true},
                    {prop: 'createName', type: 'input', label: '创建人', disabled: true},
                    {prop: 'createTime', type: 'input', label: '创建时间', disabled: true},
                    {prop: 'remark', type: 'input', label: '说明',rules:{max:1000,message:'请输入1000字符以内的内容'}}
                ],
            }
        },
        created(){
            this.getCommonOptions('11008', 'bizTypeOptions')
            this.recordData.createUser = parseInt(Cookie.get('t8t-tc-uid'))
            let arg = {
                page: 1,
                search: {
                    pPropertyCode: '61019'
                },
                size: 100
            }
            let list = []
            apiCommon.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus === 1) {
                                list.push({
                                    value: item.wholeCode,
                                    text: item.propertyName
                                })
                            }
                        })
                        this.selectSource['useTypeOptions'] = list
                    }
                })
        },
        methods: {
            filterMethod:function (val, args) {
                args['search'] = {
                    'projectId_like': val,
                    pmId:this.recordData.pmId,
                    bizTypeId: this.recordData.bizTypeId
                }
                return args
            },
            //处理选择行变化
            add() {
                this.$refs['record'].validate((valid) => {
                    if (valid) {
                        this.$refs['t8tTable'].addNewRow()
                    }
                })
            },
            del() {
                this.$refs['t8tTable'].delRows()
            },
            backRoute(){
                this.$router.push({
                    path: '/tuchat-finance/record-list'
                })
            },
            onChange(val, row, col, tab){
                if (row.balance) {
                    if (val > row.balance) {
                        this.$message.error("支出金额不得大于余额")
                        row.amount =null
                    }
                    else if(val==0){
                        this.$message.error("支出金额不得为0")
                        row.amount =null
                    }
                    else{
                        let data=this.$refs['t8tTable'].dataSource
                        this.recordData.amount=data.map(item=>{return item.amount}).reduce(function(a,b){return Number(a)+Number(b)})
                    }
                } else {
                    this.$message.error("请先选择余额不为0项目")
                    row.amount = null
                }
            },
            orgPopupConfirm(rows){
                let args = {
                    search: {
                        orgId: rows[0].id
                    },
                    sort: ['id_desc']
                }
                depositAPI.queryDeposit(args).then((res) => {
                        if (res.data.status === 200) {
                            let list = []
                            res.data.result.rows.forEach((item) => {
                                list.push({
                                        value: item.pmId,
                                        text: item.pmName
                                    }
                                )
                            })
                            this.selectSource['pmNameOptions'] = list
                            this.recordData.pmId = ''
                        }
                    }
                )
            },
            doSubmit(){
                debugger
                this.$refs['t8tTable'].validate((valid1) => {
                    this.$refs['record'].validate((valid2) => {
                        if (valid1 && valid2) {
                            this.$message('正在提交，请稍后...')
                            let tableActionLog = this.$refs['t8tTable'].getActionLog(false, false)
                            if (tableActionLog.addedRows.length === 0) {
                                this.$message.error('请填写支出明细')
                            }
                            else {
                                let args = {
                                    recordCreateDTO: this.recordData,
                                    recordItemPayDTOs: tableActionLog.addedRows
                                }
                                depositAPI.recordCreate(args).then((result) => {
                                    if (result.data.status === 200 && result.data.result) {
                                        this.backRoute()
                                        this.$alert('操作成功', '信息', {
                                            confirmButtonText: '确定',
                                            callback: function () {
                                                this.$refs['t8ttable'].reloadTable()
                                            }
                                        })
                                    }
                                    else {
                                        this.$alert(result.data.message, '错误提示', {
                                            confirmButtonText: '确定',
                                        })
                                    }
                                })
                            }
                        }
                    })
                })
            },
            projectChange: function (val, row, col, tab) {
                tab.$nextTick(()=>{
                    row.projectId = val.projectId
                    row.productPackageId = val.productPackageId
                    this.selectSource.productPackageOptions.push({
                        text: val.productPackageName,
                        value: val.productPackageId
                    })
                    row.depositType = val.depositType
                    this.selectSource.depositTypeOptions.push({text: val.depositTypeName, value: val.depositType})
                    row.balance = val.balance
                    row.bizTypeName = val.bizTypeName
                    row.orgName = val.orgName
                    row.projectAddress = val.projectAddress
                    row.customerName = val.customerName
                    row.amount = null
                    })
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
                apiCommon.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            })
                            this.selectSource[selectName] = list
                        }
                    })
            }
        }
    }

</script>
<style
    lang="css"
    scoped
>
    .dialog-edit.t8t-full-dialog {
        width: 100%;
        height: 100%
    }

    .dialog-edit.t8t-full-dialog .textarea-container {
        margin: 0 30px;
    }
</style>
<style>
    .dialog-edit.t8t-full-dialog .el-dialog__header {
        padding: 0;
    }

    .dialog-edit.t8t-full-dialog .el-dialog__body {
        padding: 0;
        height: 100%;
    }

    .dialog-edit.t8t-full-dialog .t8t-full-dialog-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-tabs-container {
        flex: 1;
        margin-bottom: 0px;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-toolbar-container {
        height: 38px;
        background-color: #1e3046;
    }

    .dialog-edit.t8t-full-dialog .toolbar-container {
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        background-color: #1e3046;
    }

    .dialog-edit.t8t-full-dialog .toolbar-container .toolbar-button {
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }

    .dialog-edit.t8t-full-dialog .toolbar-container .toolbar-button:hover {
        color: #1e3046;
        background-color: #d2deeb;
    }

    .dialog-edit.t8t-full-dialog .container-center {
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }

    .dialog-edit.t8t-full-dialog .el-form {
        display: flex;
        flex-wrap: wrap;
    }

    .dialog-edit.t8t-full-dialog .form-item-container {
        width: 25%;
        flex: 1;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-form-container {
        margin-top: 22px;
        margin-left: auto;
        margin-right: auto;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-form-container .el-form-item__content {
        width: 180px;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-tabs-container {
        display: flex;
    }

    .dialog-edit.t8t-full-dialog .el-tabs {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-tabs-container .el-tabs__item {
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }

    .dialog-edit.t8t-full-dialog .el-tabs__header {
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
        margin-bottom: 0;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar {
        height: 1px;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-tabs-container .dialog2-toolbar-container {
        margin-top: 10px;
        margin-left: 100px;
    }

    .dialog-edit.t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }

    .dialog-edit.t8t-full-dialog .el-tabs__nav-wrap {
        width: 1220px;
        margin: 0 auto;
    }

    .dialog-edit.t8t-full-dialog .el-tabs__content {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .dialog-edit.t8t-full-dialog .el-tab-pane {
        flex: none !important;
        width: 100% !important;
        height: 100% !important;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .dialog-edit.t8t-full-dialog .el-tab-pane .t8t-toolbar {
        position: absolute;
        left: 30px;
        right: 30px;
        padding: 10px 0 !important;
        margin: 0 auto !important;
    }

    .dialog-edit.t8t-full-dialog .el-tab-pane .t8t-toolbar .el-button--small {
        padding: 7px 9px !important;
        font-size: 12px;
    }

    .dialog-edit.t8t-full-dialog .el-dialog .el-button--small {
        padding: 7px 9px !important;
        font-size: 12px;
    }

    .dialog-edit.t8t-full-dialog .t8t-table {
        /*width: 1200px;*/
        flex: none !important;
        margin: 0 auto;
        position: absolute;
        left: 30px;
        bottom: 30px;
        right: 30px;
    }

    .dialog-edit.t8t-full-dialog .t8t-table .pagenav-container {
        border: 1px solid #D3DDE6;
    }

    .dialog-edit.t8t-full-dialog .t8t-table .pagenav-container {
        border: 1px solid #D3DDE6;
    }

    .dialog-edit.t8t-full-dialog .tableDebitType .t8t-table {
        top: 50px;
    }

    .dialog-edit.t8t-full-dialog .removeLog .t8t-table,
    .dialog-edit.t8t-full-dialog .operateLog .t8t-table {
        top: 30px;
    }

    .dialog-edit.t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }
</style>
