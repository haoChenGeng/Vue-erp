<template>
    <div class="page-pay-bills">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>
        <div class="g-main-container-column">
            <t8t-toolbar
                @ADD="onBtn1"
                @VIEW="onBtn2"
                @AUDITING-SUBMIT="onBtn3"
                @ANTI-AUDITING="onBtn4"
                @REJECT="onBtn5"
                @EDIT="onBtn6"
                @ACCEPTANCE="onBtn7"
                @SENDTOCLOUD="btnSendToCloud"
                @EXPORT="onExport"
				@E-RECEIPT="electronicReceipt"
            >
            </t8t-toolbar>
            <t8t-table
                :columns="columns"
                :service="service"
                :method="method"
                :commonData="selectSource"
                :args="args"
                ref="t8ttable"
                @row-double-click="onView"
            >
                <!--用于自定义列模板-->
                <template slot="verifyStatus" scope="scope">
                    <span
                        v-if="scope.row['verifyStatus']!==3"
                        style="color:red; font-size: 25px"
                    >●</span>
                    <span
                        v-else-if="scope.row['verifyStatus']===3"
                        style="color:green; font-size: 25px"
                    >●</span>
                </template>
                <template slot="receiptVoucherUrl" scope="scope">
                    <el-button type="small" @click.stop="showImgDialog(scope.row['receiptVoucherUrl'])">查看凭证</el-button>
                </template>
            </t8t-table>
        </div>
        <!-- 查看图片弹窗 -->
        <el-dialog v-model="imgDialog" @close="closeImgDialog" ref="imgDialogRef" size="full"
                   class="g-transparent-dialog">
            <div class="g-img-container">
                <img :src="imgSrc" alt="">
            </div>
        </el-dialog>
        <!-- 驳回确认弹窗 -->
        <el-dialog v-model="rejDialog" title="驳回确认" @close="closeRejDialog" ref="rejDialogRef">
            <div class="textarea-container">
                <el-input type="textarea" v-model="textareaText" :autosize="{minRows: 5, maxRows: 5}"
                          placeholder="请输入驳回原因"></el-input>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="onRejBtn">驳回</el-button>
                <el-button @click="closeRejDialog">关闭</el-button>
            </div>
        </el-dialog>

        <!-- 传K/3确认弹窗 -->
        <el-dialog title="传K/3确认" v-model="sendCloudDialog" @close="closeCloudDialog" ref="sendCloudDialogRef"
                   v-loading.body.lock="payingLoading" element-loading-text="上传中">
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
    // import T8tBreadcrumb from 'src/components/t8t-breadcrumb/t8t-breadcrumb.vue'
    // import T8tTable from 'src/components/t8t-table/t8t-table.vue'
    // import T8tToolbar from 'src/components/t8t-toolbar/t8t-toolbar.vue'
    // import T8tSearch from 'src/components/t8t-search/t8t-search.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import api from 'src/services/finance/bills.js'
    import Service from 'src/services/finance/Service.js'
    import columns from './indexColumns.json'
    import Cookie from 'js-cookie'
    import Utils from 'src/utils/Utils.js'
    import wkfApi from 'src/services/finance/hello.js'
    import exportUtils from 'src/utils/export.js'
    export default {

        name: 'page-pay-bills',

        data () {
            return {
                rejDialog: false,
                textareaText: '',
                imgDialog: false,
                imgSrc: '',
                breadcrumbData: [{title: '财务'}, {title: '资金管理'}, {title: '收款单'}],
                columns: columns,
                service: Service.FINA_BILLS.name,
                method: Service.FINA_BILLS.methods.QUERYFLAT,
                isLoading: false,
                payingLoading: false,
                totalCount: 0,
                k3CloudArgs: [],
                sendCloudDialog: false,//传K/3
                args: {
                    receiptLeftJoinQueryDTO: {
                        "code": ""
                    },
                    sort: ["id_desc"]
                },
                //导出参数
                exportParams:{
                    receiptLeftJoinQueryDTO: {
                    },
                    page:1,
                    size:10000
                },

                //搜索表单项配置
                fields: [
                    {type: 'input', label: '单据编号', name: 'code'},
                    {type: 'select', label: '业务类型', name: 'bizId', selectSourceKey: 'bizOptions'},
                    {type: 'select', label: '收款类型', name: 'receiptTypeId', selectSourceKey: 'receiptTypeOptions'},
                    {type: 'input', label: '项目ID', name: 'projectId'},
                    {type: 'select', label: '单据状态', name: 'orderStatus', selectSourceKey: 'orderStatusOptions'},
                    {type: 'select', label: '核销状态', name: 'verifyStatus', selectSourceKey: 'verifyStatusOptions'},
                    {type: 'select', label: '财务组织', name: 'receiptOrgId', selectSourceKey: 'receiptOrgOptions'},
                    {type: 'select', label: '添加方式', name: 'addType', selectSourceKey: 'addTypeOptions'},
                    {type: 'select', label: '传K3状态', name: 'isK3', selectSourceKey: 'isK3Options'},
                    {
                        type: 'datepicker',
                        label: '到账时间',
                        name: 'time',
                        pickertype: 'datetimerange',
                        startField: 'startTime',
                        endField: 'endTime'
                    },
                    {type: 'select', label:'收款方式', name:'receiptModeId', selectSourceKey:'receiptModeOptions'}
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    isK3Options: [{
                        text: '已传',
                        value: 1
                    }, {
                        text: '未传',
                        value: 0
                    }
                    ],
                    bizOptions: [],
                    receiptTypeOptions: [],
                    receiptOrgOptions: [],
                    orderStatusOptions: [{
                        text: '审核中',
                        value: 1
                    }, {
                        text: '已审核',
                        value: 2
                    }, {
                        text: '重新审核',
                        value: 3
                    }],
                    addTypeOptions: [{
                        text: '手动',
                        value: 1
                    }, {
                        text: '自动',
                        value: 2
                    }],
                    verifyStatusOptions: [{
                        text: '未核销',
                        value: 1
                    }, {
                        text: '部分核销',
                        value: 2
                    }, {
                        text: '已核销',
                        value: 3
                    }],
                    receiptModeOptions:[]
                },
                eReceipt: '/tochat-finance/page-pay-bills/e-receipt'
            }
        },
        created() {
            this.getOrganizationOptions()
            // 业务类型
            this.getCommonOptions('11008', 'bizOptions')
            // 收款类型
            this.getCommonOptions('61002', 'receiptTypeOptions')
            //收款方式
            this.getCommonOptions('61001', 'receiptModeOptions')
        },
        watch: {
            $route: function () {
                this.$refs['t8ttable'].reloadTable()
            }
        },
        methods: {
            //导出数据
            onExport() {
                this.$TCS.addTag('erp_finance_007005002009')
                this.$msgbox({
                    title:'消息',
                    message: '正在导出中,请注意左下方,稍后有导出的文件',
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                exportUtils({
                    service: Service.FINA_BILLS.name,
                    // receipt.order.left.join.export
                    method: 'MYWVUdJlidJ5zfXUqgsVscLWNK4-mbvhW8xKam0Oq5m',
                    title:"收款单",
                    args:  this.exportParams,
                    headers: '项目ID,单据编号,财务组织,收款方式,到账金额,到账时间,业务类型,收款类型,收款对象,收款对象ID,收款金额,核销金额,单据状态,核销状态,传K3状态,记账日期,添加方式,交易流水号,创建人,创建时间,修改人,修改时间',
                    sorts: 'projectId,code,receiptOrgName,receiptModeName,totalArriveAmount,arriveTime,bizName,receiptTypeName,receiptorName,receiptorId,arriveAmount,verifyAmount,orderStatus,verifyStatus,isK3,recordTime,addType,serialNumber,createName,createTime,updateName,updateTime'
                })
            },
            // 双击查看
            onView(row) {
                this.$router.push({
                    path: 'page-pay-bills/view',
                    query: {id: row.receiptOrderId, status: row.orderStatus}
                })
            },
            //新增
            onBtn1() {
                this.$TCS.addTag('erp_finance_007005002001')
                this.$router.push({path: '/tochat-finance/page-pay-bills/create'})
            },
            //查看
            onBtn2() {
                 this.$TCS.addTag('erp_finance_007005002002')
                // 单行判断
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                this.$router.push({
                    path: 'page-pay-bills/view',
                    query: {id: selectRow.receiptOrderId, status: selectRow.orderStatus}
                })
            },
            //审核
            onBtn3() {
                 this.$TCS.addTag('erp_finance_007005002003')
                // 单行判断
                if (this.checkSelection() === false) return false

                let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                // 勾选数据不是待审核
                if (selectRow.orderStatus !== 1) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '审核中状态才能进行审核操作',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                } else {
                    // 待审核状态弹窗确认审核
                    this.$confirm('确认将所选收款单审核通过？', '审核确认', {
                            confirmButtonText: '审核',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }
                    )
                        .then(() => {
                            // 点击确定按钮
                            let args = {
                                "req": {
                                    "taskId": selectRow.taskId,
                                    "procInsId": selectRow.wkfId,
                                    "executor": Cookie.get('t8t-tc-uid'),
                                    "workflow": {
                                        "isPass": true
                                    },
                                    "biz": {
                                        auditorId: +Cookie.get('t8t-tc-uid'),
                                        receiptOrderId: selectRow.receiptOrderId,
                                        auditResult: 1
                                    }
                                }
                            }
                            wkfApi.complete(args)
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        // 成功弹窗
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'success',
                                            message: '审核成功',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                        this.$refs['t8ttable'].reloadTable()
                                    } else {
                                        // 失败弹窗
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
                        .catch(() => {
                            // 关闭弹窗
                        })
                }

            },
            getOrganizationOptions() {
                // 法人职能和利润中心
                let arg = {
                    funcCodes: ["001004013", "001004014"]
                }
                let list = []
                commonApi.queryByFunctionCode(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.isDel !== 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.name
                                    })
                                }
                            })
                            this.selectSource.receiptOrgOptions = list
                        }
                    })
            },
            //反审核
            onBtn4() {
                this.$TCS.addTag('erp_finance_007005002004')
                // 单行判断
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                // 勾选数据不是审核通过状态
                if (selectRow.orderStatus !== 2) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '已审核状态才能进行反审核操作',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                }
                // 审核通过但不是未核销
                if (selectRow.orderStatus === 2 && selectRow.verifyStatus !== 1) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '未核销状态才能进行反审核操作',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                }
                // 审核通过并且是未核销 弹窗确认反审核
                this.$confirm('确认将所选收款单反审核通过？', '反审核确认', {
                        confirmButtonText: '反审核',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                    .then(() => {
                        // 点击确定按钮
                        // let args = {
                        //     auditorId: +Cookie.get('t8t-tc-uid'),
                        //     receiptOrderIds: [selectRow.receiptOrderId]
                        // }
                        var args = {
                            "req": {
                                "idOrKey": "financeReceiptCheck",
                                "startById": 0,
                                "businessKey": '' + selectRow.receiptOrderId,
                                "starter": Cookie.get('t8t-tc-uid'),
                                "workflow": {
                                    "url": '/biz/t8t-fi-rvm/app',
                                    "method": 'receipt.order.anti.audit',
                                    "formkey": "http://scm.to8to.com/#/finance/page-pay-bills"
                                },
                                "biz": {
                                    auditorId: +Cookie.get('t8t-tc-uid'),
                                    receiptOrderId: selectRow.receiptOrderId,
                                }
                            }
                        }
                        wkfApi.start(args)
                            .then((res) => {
                                if (res.data.status === 200) {
                                    // 反审核通过弹窗
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '反审核成功',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    this.$refs['t8ttable'].reloadTable()
                                } else {
                                    // 失败弹窗
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
                    .catch(() => {
                        // 关闭弹窗
                    })
            },
            //驳回
            onBtn5() {
                this.$TCS.addTag('erp_finance_007005002005')
                // 单行判断
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                // 不是待审核状态
                if (selectRow.orderStatus !== 1) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '审核中状态才能驳回',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                }
                // 弹窗驳回确认
                this.rejDialog = true
            },
            //调整
            onBtn6() {
                this.$TCS.addTag('erp_finance_007005002006')
                // 单行判断
                // if (this.checkSelection() === false) return false
                // let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                // this.$router.push({ path: 'page-pay-bills/update', query: { id: selectRow.receiptOrderId } })
                this.$router.push({path: '/tochat-finance/page-pay-bills/create', query: {mode: 'tz'}})
            },
            // 核销
            onBtn7() {
                this.$TCS.addTag('erp_finance_007005002007')
                // 单行判断
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                // 非审核通过状态
                if (selectRow.orderStatus !== 2) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '已审核状态才能进行核销',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                }
                // 如是审核通过但已核销状态
                if (selectRow.orderStatus === 2 && selectRow.verifyStatus === 3) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '已核销，请选择其它收款单',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                }
                // 审核通过状态并且非已核销
                this.$router.push({
                    path: '/tochat-finance/page-pay-bills/verify',
                    query: {
                        projectId: selectRow.projectId,
                        receiptRoleId: selectRow.receiptRoleId,
                        receiptorId: selectRow.receiptorId,
                        code: selectRow.code
                    }
                })

            },

            //收款单传K/3Cloud
            btnSendToCloud(){
                this.$TCS.addTag('erp_finance_007005002008')
                this.isLoading = false;
                this.k3CloudArgs = []
                let selections = this.$refs['t8ttable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选收款单后再操作！')
                    return false
                } else if (selections.length > 5) {
                    this.$message.error('一次勾选的收款单条数不能大于5！')
                    return false
                }
                let unAuditCount = 0
                selections.forEach((item) => {
                    //已经审核的
                    if (item.orderStatus === 2) {
                        this.k3CloudArgs.push(item.receiptOrderId)
                    }
                    //未审核的
                    if (item.orderStatus != 2) {
                        unAuditCount++
                    }
                })

                if (unAuditCount > 0) {
                    this.$message.error('已审核的收款单才能进行传K3操作!')
                    return false
                }

                if (null === this.k3CloudArgs || this.k3CloudArgs.length <= 0) {
                    this.$message.error('请选择单据状态为“已审核”的收款单进行操作!')
                    return false
                }
                this.totalCount = this.k3CloudArgs.length
                this.sendCloudDialog = true
            },

            onSendCloudConfirm(){
                this.payingLoading = true;
                this.isLoading = true;
                let args = {
                    orderIds: this.k3CloudArgs,
                    updateUser: parseInt(Cookie.get('t8t-tc-uid'))
                }
                api.sendRecToCloud(args).then((res) => {
                    if (res.data.status === 200) {
                        this.isLoading = false
                        this.sendCloudDialog = false
                        this.$msgbox({
                            title: '消息',
                            type: 'warning',
                            message: '上传成功' + res.data.result.successCount + '条，失败' + res.data.result.failedCount + '条,' + +res.data.result.failedBillMsg,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
                this.payingLoading = false;
            },

            checkSelection() {
                let selections = this.$refs['t8ttable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选收款单后再试。')
                    return false
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                    return false
                }
                return true
            },
            showImgDialog(src){
                this.imgSrc = Utils.getFullURL(src)
                this.imgDialog = true
            },
            closeImgDialog() {
                this.imgSrc = ''
                this.imgDialog = false
            },
            submitSearch(obj) {
                this.args = {receiptLeftJoinQueryDTO: obj, sort: ["id_desc"]}
                this.getExportArgs(obj)
            },
            //更新导出的参数
            getExportArgs(param){
                let exportP = {...param}

                for (let i in exportP) {
                    if (exportP[i] === null) {
                        delete exportP[i]
                    }
                }
                this.exportParams = {
                    receiptLeftJoinQueryDTO: exportP,
                    page: 1,
                    size: 10000,
                }
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
                                ;
                            })
                            this.selectSource[selectName] = list
                        }
                    })
            },
            onRejBtn(){
                if (this.textareaText === '') {
                    this.$message.warning('请输入驳回原因')
                } else {
                    // 驳回
                    let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                    let args = {
                        auditorId: +Cookie.get('t8t-tc-uid'),
                        receiptOrderIds: [selectRow.receiptOrderId],
                        remark: this.textareaText
                    }
                    api.reject(args)
                        .then((res) => {
                            if (res.data.status === 200 && res.data.result === 1) {
                                // 驳回成功
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '驳回成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeRejDialog()
                                this.$refs['t8ttable'].reloadTable()
                            } else {
                                // 驳回失败
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.closeRejDialog()
                            }
                        })
                }
            },
            closeRejDialog() {
                this.rejDialog = false
                this.textareaText = ''
            },
            closeCloudDialog(){
                this.sendCloudDialog = false
            },
            // 电子收据
            electronicReceipt()
            {
                 this.$TCS.addTag('erp_finance_007005002010')
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                if (selectRow.orderStatus !== 2) {
                    this.$message.error('请勾选已审核的单据。')
                    return false
                }
                // 不是待审核状态
                window.open('#' + this.eReceipt + '?code=' + selectRow.code)
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
        margin: 0 30px;
    }
</style>
