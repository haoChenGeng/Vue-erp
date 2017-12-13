<template>
    <div class="page-pay-bills">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
            @change="onChange"
            ref="t8tsearch"
            @visible-change="visibleChange"
        >
        </t8t-search>
        <t8t-toolbar
            @EXPORT="onExport"
            @MANUALRECONCILIATION="manuallyReconciliationConfirm"
            v-loading.body.lock="toolbarLoading"
            element-loading-text="加载中"
        >
        </t8t-toolbar>
        <t8t-table
            :columns="columns.indexPage"
            :service="service"
            :method="method"
            :commonData="selectSource"
            :args="args"
            ref="t8ttable"
        >
        </t8t-table>

        <!-- 手工对账弹窗 -->
        <el-dialog title="手工对账" v-model="manuallyReconciliationDialog" @close="closeDialog"
                   ref="manuallyReconciliationRef">
            <ul class="payConfirm">
                <li style="list-style-type:none">确认手工对账？</li>
            </ul>
            <div slot="footer">
                <el-button type="primary" @click="manuallyReconciliation" :loading="reconciliationLoading">确认</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    import commonApi from 'src/services/commonApi/commonApi.js'


    //用到的
    import reconciliationApi from 'src/services/finance/receiptReconciliationQuery.js'
    import fundChannelApi from 'src/services/finance/fundChannelConfig.js'
    import Service from 'src/services/finance/Service.js'
    import columns from './indexColumns.json'
    import Cookie from 'js-cookie'

    //导出
    import exportUtils from 'src/utils/export.js'

    export default {

        name: 'page-pay-remit',
        components: {},

        data () {
            return {
                //日记账用到的
                manuallyReconciliationDialog: false,
                // search表单数据
                searchFormData: {
                    channelId: null
                },
                objectNullFlag: false,
                checkArray: [],
                ids: [],//导出和手工对账时id
                //其他页面的

                toolbarLoading: false,
                reconciliationLoading: false,


                payType: null,
                exportParams: {
                    search: {id_gt: 0},
                    page: 1,
                    size: 10000
                },//导出传参
                dealer: parseInt(Cookie.get('t8t-tc-uid')),
                breadcrumbData: [{title: '财务'}, {title: '资金管理'}, {title: '资金收款对账查询'}],
                columns: columns,
                service: Service.FUND_MANAGEMENT.name,
                method: Service.FUND_MANAGEMENT.methods.RECONCILIATION_QUERY_PAGE,
                args: {
                    search: {
                        id_gt: 0
                    }
                },
                //搜索表单项配置
                fields: [
                    {type: 'select', label: '财务组织', name: 'organizationId', selectSourceKey: 'orgOptions'},
                    {type: 'select', label: '资金渠道', name: 'channelId', selectSourceKey: 'channelOptions'},
                    {type: 'select', label: '二级渠道', name: 'secondChannelId', selectSourceKey: 'secondChannelOptions'},
                    {type: 'input', label: '外部交易流水号', name: 'serialNo_like'},
                    {type: 'input', label: '来源单据号', name: 'sourceOrderCode_like'},
                    {type: 'select', label: '客户', name: 'clientRoleId', selectSourceKey: 'clientRoleOptions'},
                    {type: 'input', label: '客户id', name: 'clientId_like'},
                    {type: 'input', label: '项目id', name: 'projectId_like'},
                    {type: 'input', label: '商户编号', name: 'partnerNo_like'},
                    {type: 'input', label: '到账账号', name: 'account_like'},
                    {type: 'select', label: '业务类型', name: 'businessTypeId', selectSourceKey: 'bizTypeOptions'},

                    {type: 'select', label: '对账情况', name: 'reconciliationCondition', selectSourceKey: 'conditionOptions'},
                    {
                        type: 'datepicker',
                        label: '创建时间',
                        name: 'createTime',
                        pickertype: 'daterange',
                        startField: 'createTime_gte',
                        endField: 'createTime_lte'
                    },
                    {
                        type: 'datepicker',
                        label: '到账时间',
                        name: 'accountTime',
                        pickertype: 'daterange',
                        startField: 'accountTime_gte',
                        endField: 'accountTime_lte'
                    }
                ],

                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    orgOptions: [],
                    channelOptions: [],
                    secondChannelOptions: [],
                    clientRoleOptions: [],
                    bizTypeOptions: [],
                    conditionOptions: [{
                        text: '对账正常',
                        value: 1
                    }, {
                        text: '对账异常',
                        value: 2
                    }, {
                        text: '对账调整',
                        value: 3
                    }],
                    reasonOptions: [{
                        text: '对账正常',
                        value: 1
                    }, {
                        text: '缺失本系统订单',
                        value: 2
                    }, {
                        text: '金额不一致',
                        value: 3
                    }, {
                        text: '缺失第三方或银行交易流水',
                        value: 4
                    }]
                },
                editType: 'add',
                dialogVisible: false
            }
        },
        created() {
            commonApi.queryByFunctionCode({"funcCodes": ["001004013", "001004014"]})
                .then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.isDel === 0) {
                                list.push({
                                    value: item.id,
                                    text: item.name
                                })
                            }
                        })
                        this.selectSource.orgOptions = list

                    }
                }))
            this.getChannelOptions()
            this.getCommonOptions('61007', 'payOrganizationOptions')
            this.getCommonOptions('11008', 'bizTypeOptions')
            this.getCommonOptions('61004', 'clientRoleOptions')
        },

        methods: {

            onChange(value, name) {
                // 如果资金渠道的值改变

                if (name === 'channelId') {
                    this.selectSource.secondChannelOptions = []
                    let data = {
                        channelId: value,
                        secondChannelId: ''
                    }
                    this.$refs.t8tsearch.setFormData(data)
                    //获取二级渠道
                    if (value) {
                        this.getSecondChannelOptions(value)
                    }
                }

            },

            //导出数据
            onExport() {
                this.$msgbox({
                    message: '正在导出中,请注意左下方,稍后有导出的文件',
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })

                this.ids = []
                this.checkArray = this.$refs['t8ttable'].getSelectRows()
                if (this.checkArray.length > 0) {
                    this.checkArray.forEach((item) => {
                        this.ids.push(item.id)
                    })
                    this.exportParams = {
                        search: {
                            id_in: this.ids
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
                        size: 10000
                    }
                }
                exportUtils({
                    service: Service.FUND_MANAGEMENT.name,
                    method: Service.FUND_MANAGEMENT.methods.RECONCILIATION_EXPORTEXCEL,
                    args: this.exportParams,

                    headers: '财务组织,资金渠道,二级渠道,商户编号,到账账号,客户,客户id,项目id,来源单据号,外部交易流水号,业务类型,交易金额,来源单据金额,对账情况,对账原因,到帐时间,创建时间',
                    sorts: 'organizationName,channelName,secondChannelName,partnerNo,account,clientRoleName,clientId,projectId,sourceOrderCode,serialNo,bizTypeName,tradeAmount,receiptAmount,reconciliationConditionName,reconciliationReasonName,accountDate,createDate'
                })
            },

            isEmptyObjectParams(data)
            {
                let objectFlags = false
                for (let i in data) {
                    objectFlags = true
                }
                return objectFlags
            },
            closeDialog(){
                this.manuallyReconciliationDialog = false;
            },
            //手动对账
            manuallyReconciliationConfirm()
            {
                this.checkArray = this.$refs['t8ttable'].getSelectRows()
                this.ids = []
                if (this.checkArray.length === 0) {
                    this.$message.error('请勾选异常对账单后再试！')
                    return false
                }
                try{
                    this.checkArray.forEach((item) => {
                        if (item.reconciliationCondition != 2) throw BreakException
                        else {
                            this.ids.push(item.id)
                        }
                    })
                }
                catch(e){ this.$message.error('请选择对账异常的对账单进行操作!') }
                if(this.ids.length <= 0){
                    this.$message.error('请选择对账异常的对账单进行操作!')
                    return false;
                }
                this.manuallyReconciliationDialog=true;
            },
            manuallyReconciliation()
            {
                this.reconciliationLoading = true;
                let args = {
                    reconciliationIds: this.ids,
                    updateUser: this.dealer
                }
                reconciliationApi.manuallyReconciliation(args).then((res) => {
                    this.reconciliationLoading = false;
                    if (res.data.status === 200) {
                        this.manuallyReconciliationDialog = false
                        this.$msgbox({
                            title: '消息',
                            type: 'warning',
                            message: '对账完毕',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain',

                        })
                    }
                    else {
                        this.$message.error(res.data.message)
                    }
                    this.getTableData()
                })

            },
            getTableData() {
                this.$refs['t8ttable'].reloadTable()
            },
            getExportArgs(param){
                let exportP = {...param}

                for (let i in exportP) {
                    if (exportP[i] === null) {
                        delete exportP[i]
                    }
                }
                this.exportParams = {
                    search: exportP,
                    page: 1,
                    size: 10000,
                }
            },

            // 获取资金渠道数据
            getChannelOptions() {
                let list = []
                let args = {
                    page: 1,
                    size: 1000,
                    search: {
                        status: 1 // 启用的配置
                    }
                }
                fundChannelApi.getReceiptChannelData(args)
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result.rows) {
                            res.data.result.rows.forEach((item) => {
                                list.push({
                                    value: item.channelId,
                                    text: item.name
                                })
                            })
                            this.selectSource.channelOptions = list
                        }
                    })
            },
            // select类型下拉框出现和隐藏时触发
            visibleChange(value, name) {
                if (name === 'secondChannelId') {
                    if (value) {
                        if (!this.$refs.t8tsearch.formData.channelId) {
                            this.$message.error('请先选择资金渠道')
                        }
                    }
                }
            },

            // 根据付款类型和资金渠道获取二级渠道筛选数据(获取现已添加的二级渠道数据)
            getSecondChannelOptions(channelId) {
                let channelType = 1
                let args = {
                    page: 1,
                    size: 100,
                    search: {
                        channelType: channelType,
                        channelId: channelId
                    }
                }

                fundChannelApi.getList(args)
                    .then((res) => {
                        if (res.data.status === 200) {
                            let list = []
                            let idArr = []
                            res.data.result.rows.forEach((item) => {
                                if (item.secondChannelId !== 0 && item.secondChannelName !== '' && idArr.indexOf(item.secondChannelId) === -1) {
                                    list.push({
                                        value: item.secondChannelId,
                                        text: item.secondChannelName
                                    })
                                    idArr.push(item.secondChannelId)
                                }
                            })
                            this.selectSource.secondChannelOptions = list
                        }
                    })
            },

            submitSearch(obj) {
                let paramArgs = obj
                for (let i in paramArgs) {

                    if (i === 'createTime_lte' && paramArgs[i] > 0) {
                        let p = paramArgs[i] + 86399
                        paramArgs[i] = p
                    }
                    if (i === 'accountTime_lte' && paramArgs[i] > 0) {
                        let s = paramArgs[i] + 86399
                        paramArgs[i] = s
                    }
                    if (i === 'reconciliationTime_lte' && paramArgs[i] > 0) {
                        let a = paramArgs[i] + 86399
                        paramArgs[i] = a
                    }
                }
                this.args = {
                    search: paramArgs
                }

                this.getExportArgs(paramArgs)
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
    .img-container {
        display: flex;
        justify-content: center;
    }

    .textarea-container {
        /*margin: 0 30px;*/
        text-align: center;
    }

    ul.payConfirm li {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
    }
</style>
