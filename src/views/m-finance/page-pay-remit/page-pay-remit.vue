<template>
    <div class="page-pay-bills">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-toolbar
            @ADD="onBtn1"
            @VIEW="onBtn2"
            @REJECT="onBtn5"
            @PAY-ONLINE="onBtn3"
            @PAY-OFFLINE="onBtn4"
            @SENDTOCLOUD="btnSendToCloud"
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
            @row-double-click="onBtn2()"
        >
        </t8t-table>


        <!-- 驳回确认弹窗 -->
        <el-dialog title="驳回确认" v-model="rejDialog" @close="closeRejDialog" ref="rejDialogRef">
            <div class="textarea-container">
                <el-input type="textarea" v-model="textareaText" :autosize="{minRows: 5, maxRows: 5}"
                          placeholder="请输入驳回原因"></el-input>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="onRejBtn" v-loading.body.lock="rejectScreenLoading"
                           element-loading-text="驳回中">驳回




                </el-button>
                <el-button @click="closeRejDialog">关闭</el-button>
            </div>
        </el-dialog>

        <!-- 付款确认弹窗 -->
        <el-dialog title="付款确认" v-model="payDialog" @close="closePayDialog" ref="payDialogRef"
                   v-loading.body.lock="payingLoading" element-loading-text="付款中">
            <ul class="payConfirm">
                <li style="list-style-type:none">此次付款共{{totalPay}}元</li>
                <li style="list-style-type:none" v-for="item in remitedArr">
                    {{item.organizationName}}-{{item.name}}:{{item.totalAmount}}元





                </li>
            </ul>
            <div slot="footer">
                <el-button type="primary" @click="onPayBtn">付款</el-button>
                <el-button @click="closePayDialog">取消</el-button>
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

        <!-- 付款弹窗 -->
        <el-dialog title="付款确认" v-model="payingDialog" @close="closePayingDialog" ref="payingDialogRef">
            <div class="textarea-container">
                <el-select v-model="payType" :placeholder="payingType">
                    <el-option v-for="item in selectPayType" :label="item.text" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="onPayingBtn" v-loading.body.lock="payingScreenLoading"
                           element-loading-text="付款中">付款




                </el-button>
                <el-button @click="closePayingDialog">取消</el-button>
            </div>
        </el-dialog>

        <!--新建-->
        <new-dialog
            v-if="dialogVisible"
            :rowId="rowId"
            :editType="editType"
            :channelOptions="channelOptions"
            @close="dialogVisible=false"
            @getTableData="getTableData"
            :commonOptionsConfig="selectSource"
        >
        </new-dialog>

        <!--多条付款-->
        <remit-compare
            ref="remitCompareTable"
            v-if="remitCompareVisible"
            @close="remitCompareVisible=false"
            :checkArray="checkArray"
            :statusOptions="selectSource.statusOptions"
            @checkRemit="checkRemit"
            @rejectRemit="rejectRemit"
            v-loading.body.lock="compareLoading"
            @loadingcompare="compareLoading=true"
        >
        </remit-compare>


    </div>
</template>

<script>

    import commonApi from 'src/services/commonApi/commonApi.js'
    import api from 'src/services/finance/payRemit.js'

    import Service from 'src/services/finance/Service.js'
    import remitCompare from './remitCompare.vue'

    import columns from './indexColumns.json'
    import Cookie from 'js-cookie'
    import newDialog from './new-dialog.vue'
    import payMethodCfg from 'src/services/finance/payMethodDistribution.js'

    export default {

        name: 'page-pay-remit',
        components: {
            newDialog,
            remitCompare,

        },

        data () {
            return {
                payingLoading: false,
                compareLoading: false,
                rejectScreenLoading: false,
                payingScreenLoading: false,
                toolbarLoading: false,
                remitPayingArr: [],
                totalPay: 0,
                totalCount: 0,
                k3CloudArgs: [],
                payDialog: false,//付款
                sendCloudDialog: false,//传K/3
                selectPayType: [{'text': 1, 'value': 'sfds'}],
                payingDialog: false,//操作失败
                payFailType: '',//操作失败类型
                payOnlineType: [],
                rejDialog: false,//驳回
                remitCompareVisible: false,
                checkArray: [],
                textareaText: '',//驳回
                payType: null,
                payingType: '',
                payTypeSet: '',
                payRemitArr: [],//付款ID串
                dealer: parseInt(Cookie.get('t8t-tc-uid')),
                dealerName: Cookie.get('t8t-tc-username'),
                breadcrumbData: [{title: '财务'}, {title: '资金管理'}, {title: '付款单'}],
                columns: columns,
                service: Service.PAYREMIT.name,
                method: Service.PAYREMIT.methods.REMIT_ORDER_SERVICE_QUERYPAGE,
                args: {
                    search: {
                        id_gt: 0
                    }
                },
                searchCache: {
                    "batchNumber_like": null,
                    "code_like": null,
                    "organizationId": null,
                    "businessTypeId": null,
                    "payObjectId": null,
                    "status": null,
                    "bankId": null,
                    "payOrganizationId": null,
                    "channelDistributionId": null
                },
                //搜索表单项配置
                fields: [
                    {type: 'input', label: '批次号', name: 'batchNumber_like'},
                    {type: 'input', label: '单据编号', name: 'code_like'},
                    {type: 'select', label: '组织', name: 'organizationId', selectSourceKey: 'orgOptions'},
                    {type: 'select', label: '业务类型', name: 'businessTypeId', selectSourceKey: 'businessOptions'},
                    {type: 'select', label: '付款对象', name: 'payObjectId', selectSourceKey: 'payObjOptions'},
                    {type: 'select', label: '付款状态', name: 'status', selectSourceKey: 'statusOptions'},
                    {type: 'select', label: '开户银行', name: 'bankId', selectSourceKey: 'bankOptions'},
                    {
                        type: 'select',
                        label: '付款主体',
                        name: 'payOrganizationId',
                        selectSourceKey: 'payOrganizationOptions'
                    },
                    {type: 'select', label: '付款方式', name: 'remitChannelId', selectSourceKey: 'channelOptions'},
                    {type: 'select', label: '传K3状态', name: 'isK3', selectSourceKey: 'isK3Options'},
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
                    PayCfg: [],
                    orgOptions: [],
                    businessOptions: [],
                    payObjOptions: [],
                    bankOptions: [],
                    payOrganizationOptions: [],
                    statusOptions: [{
                        text: '待付款',
                        value: 2
                    }, {
                        text: '付款中',
                        value: 3
                    }, {
                        text: '付款成功',
                        value: 4
                    }, {
                        text: '付款失败',
                        value: 5
                    }, {
                        text: '已驳回',
                        value: 6
                    }]
                },

                editType: 'add',
                dialogVisible: false,
                rowId: null,
                isLoading: false
            }
        },
        created() {
            this.getAllOrganization('orgOptions')
            this.getCommonOptions('61005', 'channelOptions')
            this.getCommonOptions('11008', 'businessOptions')
            this.getCommonOptions('61004', 'payObjOptions')
            this.getCommonOptions('61101', 'bankOptions')
            this.getCommonOptions('61007', 'payOrganizationOptions')
        },
        methods: {
            getAllOrganization(selectName){
                let organizationArgs = {
                    search: {
                        id_gt: 0
                    }
                }
                commonApi.queryAll(organizationArgs)
                    .then((res => {
                        let list = []
                        if (res.data.status === 200) {
                            res.data.result.rows.forEach((item) => {
                                if (item.isDel === 0) {
                                    list.push({
                                        value: item.id,
                                        text: item.name
                                    })
                                }
                                this.selectSource[selectName] = list
                            })
                        }
                    }))
            },
            //选择符合条件的线上线下付款方式
            getPayType() {
                let list = []
                this.selectPayType = []
                let channelType = this.payTypeSet == 'on' ? 1 : 2
                let organizationId = this.checkArray[0].organizationId
                let payOrderId = this.checkArray[0].id
                let amount = this.checkArray[0].payAmount
                let bankId = this.checkArray[0].bankId
                //根据付款单id查询出对应的明细项
                let remitOrderArg = {
                    id: payOrderId
                }
                api.queryRemit(remitOrderArg).then((res) => {
                    if (res.data.status === 200) {
                        let typesAndAmounts = []
                        res.data.result.remitOrderItemVOs.forEach((remitTypeItem) => {
                            typesAndAmounts.push({
                                payAmount: remitTypeItem.shouldRemitAmount,
                                payTypeId: remitTypeItem.remitTypeId
                        })
                        })
                        let args = {
                            "channelDistribution": {
                                "organizationId": organizationId,
                                "amount": amount,
                                "channelType": channelType,
                                "businessTypeId": this.checkArray[0].businessTypeId,
                                "payObjectId": this.checkArray[0].configPayObjectId,
                                "typesAndAmounts": typesAndAmounts,
                                "bankId": bankId
                            }
                        }
                        payMethodCfg.getAllOptionals(args).then((res) => {
                            if (res.data.status === 200) {
                                res.data.result.forEach((item) => {
                                    list.push({
                                        value: item.id,
                                        text: item.payChannelName
                                    })
                                })
                                this.selectPayType = list
                                this.payingDialog = true
                                this.toolbarLoading = false
                            } else {
                                this.$message.error(res.data.message)
                                return false
                            }
                        })
                    } else {
                        this.$message.error(res.data.message)
                        return false
                    }
                })
            },
            //新增
            onBtn1() {
                this.$router.push({path: '/tuchat-finance/page-pay-remit/create'})
            },
            //查看
            onBtn2() {
                // 单行判断
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
                this.$router.push({path: 'page-pay-remit/view', query: {id: selectRow.id}})
            },
            //线上付款
            onBtn3() {
                this.payType = null
                this.payTypeSet = 'on'
                this.payingType = '线上付款方式选择'
                this.remitPayingArr = []
                this.payRemitArr = []
                if (this.checkSelections() === false) return false
                let selectRows = this.$refs['t8ttable'].getSelectRows()
                if (selectRows.length > 20) {
                    this.$message.error('单次批量操作不能超过20条')
                    return false
                }
                this.toolbarLoading = true
                //单条
                if (selectRows.length == 1) {
                    if (selectRows[0].status == 3 || selectRows[0].status == 4 || selectRows[0].status == 6) {
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '付款中、付款成功、已驳回状态的数据，不可进行操作。',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.toolbarLoading = false
                        return false
                    }
                    this.checkArray = this.$refs['t8ttable'].getSelectRows()
                    if (selectRows[0].channelType != 1) {
                        this.getPayType()
                        this.toolbarLoading = false
                        return false
                    }
                    this.payRemitArr.push({id: selectRows[0].id})
                    //付款失败重试
                    if (selectRows[0].status == 5) {
                        this.selectPayType = this.selectSource.PayCfg
                        this.getPayType()
                    }
                    //一次付款
                    else {
                        //校验重复
                        api.checkRepeat({remitOrder: this.payRemitArr})
                            .then((res => {
                                this.toolbarLoading = false
                                if (res.data.status === 200) {
                                    if (res.data.result.remitorderVO.length > 0) {
                                        this.remitCompareVisible = true
                                    } else {
                                        //统计
                                        this.checkRemit(this.payRemitArr)
                                    }
                                }
                                else {
                                    this.$message.error('服务超时，请重试')
                                }
                            }))
                        return false
                    }
                }
                //批量
                else {
                    let ErrorCount = 0
                    let rePayCount = 0
                    let offPayCount = 0
                    this.checkArray = this.$refs['t8ttable'].getSelectRows()
                    this.checkArray.forEach((item) => {
                        this.payRemitArr.push({id: item.id})
                        if (item.status == 3 || item.status == 4 || item.status == 6) {
                            ErrorCount++
                        }
                        if (item.status == 5) {
                            rePayCount++
                        }
                        if (item.channelType != 1) {
                            offPayCount++
                        }
                    })
                    if (ErrorCount) {
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '付款中、付款成功、已驳回状态的数据，不可进行操作。',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.toolbarLoading = false
                        return false
                    }
                    if (rePayCount == this.checkArray.length) {
                        this.$msgbox({
                            title: '消息',
                            type: 'warning',
                            message: '请对单条数据进行操作',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.toolbarLoading = false
                        return false
                    }
                    if (rePayCount || offPayCount) {
                        this.$msgbox({
                            title: '消息',
                            type: 'warning',
                            message: '请对单条数据进行操作',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.toolbarLoading = false
                        return false
                    }
//                if(offPayCount)
//                {
//                    this.$msgbox({
//                        title: '消息',
//                        type: 'warning',
//                        message: '所选数据的付款方式不能进行线上付款操作',
//                        confirmButtonText: '知道了',
//                        confirmButtonClass: 'is-plain'
//                    })
//                    this.toolbarLoading = false
//                    return false
//                }
                    //重复校验
                    api.checkRepeat({remitOrder: this.payRemitArr})
                        .then((res => {
                            this.toolbarLoading = false
                            if (res.data.status === 200) {
                                if (res.data.result.remitorderVO.length > 0) {
                                    this.remitCompareVisible = true
                                } else {
                                    //统计
                                    this.checkRemit(this.payRemitArr)
                                }
                            }
                            else {
                                this.$message.error('服务超时，请重试')
                            }
                        }))
                }
                return false
            },
            //线下付款
            onBtn4() {
                if (!this.$refs['t8ttable'].getSelectRows().length) {

                    this.$message.error('请勾选数据后再操作')
                    return false
                }
                if (this.$refs['t8ttable'].getSelectRows().length > 1) {

                    this.$message.error('请选择单条数据进行操作')
                    return false
                }
                let payRows = this.$refs['t8ttable'].getSelectRows()[0]
                if (payRows.status == 3 || payRows.status == 4 || payRows.status == 6) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '付款中、付款成功、已驳回状态的数据，不可进行操作。',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                }
//            if(payRows.channelType != 2 && payRows.status != 5)
//            {
//                this.$msgbox({
//                    title: '消息',
//                    type: 'error',
//                    message: '所选数据的付款方式不能进行线下付款操作。',
//                    confirmButtonText: '知道了',
//                    confirmButtonClass: 'is-plain'
//                })
//                return false
//            }
                this.checkArray = this.$refs['t8ttable'].getSelectRows()
                this.payType = null
                this.payTypeSet = 'off'
                this.payingType = '线下付款方式选择'
                this.selectPayType = this.selectSource.PayCfg
                this.getPayType()
                return false
            },
            //驳回
            onBtn5() {
                this.checkArray = []
                if (this.checkSelections() === false) return false
                let ErrorCount = 0
                let selectRow = this.$refs['t8ttable'].getSelectRows()
                if (selectRow.length > 20) {
                    this.$message.error('单次批量操作不能超过20条')
                    return false
                }
                selectRow.forEach((item) => {
                    if (item.status == 3 || item.status == 4 || item.status == 6) {
                        ErrorCount++
                    }
                })
                if (ErrorCount) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '付款中、付款成功、已驳回状态的数据，不可进行操作。',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return false
                }
                this.checkArray = selectRow
//             弹窗驳回确认
                this.rejDialog = true
            },

            //付款单传K/3Cloud
            btnSendToCloud(){
                this.isLoading = false;
                this.k3CloudArgs = []
                let selections = this.$refs['t8ttable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选付款单后再操作！')
                    return false
                } else if (selections.length > 50) {
                    this.$message.error('一次勾选的付款单条数不能大于50！')
                    return false
                }
                let unAuditCount = 0
                selections.forEach((item) => {
                    //已经付款成功的
                    if (item.status === 4) {
                        this.k3CloudArgs.push(item.id)
                    }
                    //未付款成功的
                    if (item.status != 4) {
                        unAuditCount++
                    }
                })

                if (unAuditCount > 0) {
                    this.$message.error('已审核的付款单才能进行传K3操作!')
                    return false
                }

                if (null === this.k3CloudArgs || this.k3CloudArgs.length <= 0) {
                    this.$message.error('请选择已经付款成功付款单进行操作!')
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

                api.sendToCloud(args).then((res) => {
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
                        this.isLoading = false
                        this.sendCloudDialog = false
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
            checkSelections() {
                let selections = this.$refs['t8ttable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选收款单后再试。')
                    return false
                }
                return true
            },
            submitSearch(obj) {
                this.searchCache = obj
                this.args = {search: obj}
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
            },
            onRejBtn(){
                if (this.textareaText === '') {
                    this.$message.warning('请输入驳回原因')
                } else {
                    let args = []
                    // 驳回
                    this.checkArray.forEach((item) => {
                        args.push({
                            biz: {
                                remitOrder: {
                                    id: item.id,
                                    updateUser: this.dealer,
                                    rejectReason: this.textareaText
                                }
                            },
                            comment: this.textareaText,
                            executor: this.dealer + '',
                            workflow: {
                                payWay: 4
                            }
                        })
                    })
                    this.rejectScreenLoading = true
                    api.remitFLow({remitOrder: args}).then((res) => {
                        let successCount = 0
                        let errorCount = 0
                        if (res.data.status === 200) {
                            this.rejectScreenLoading = false
                            if (res.data.result.length > 0) {
                                res.data.result.forEach((item) => {
                                    if (item.response.code == 200) {
                                        successCount++
                                    } else {
                                        errorCount++
                                    }
                                })
                                if (errorCount > 0) {
                                    if (errorCount == args.length) {
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'warning',
                                            message: '驳回失败',
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                    } else {
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'warning',
                                            message: '驳回成功' + successCount + '条，驳回失败' + errorCount + '条',
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                    }
                                    this.submitSearch(this.searchCache)
                                    this.closeRejDialog()
                                    return false
                                }
                                else {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '驳回成功',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                }
                            }
                            this.submitSearch(this.searchCache)
                            this.closeRejDialog()
                        } else if (res.data.status) {
                            this.rejectScreenLoading = false
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: res.data.message,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.closeRejDialog()
                            return false
                        } else {
                            this.rejectScreenLoading = false
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '超时，请刷新页面',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.submitSearch(this.searchCache)
                            this.closeRejDialog()
                        }
                    })
                }
            },
            //付款确认
            onPayBtn() {
                this.payType = null
                this.selectPayType = this.selectSource.PayCfg
                this.payTypeSet = 'on'
                this.payingType = '线上付款方式选择'
                if (this.checkArray.length == 1 && this.checkArray[0].status == 5) {
                    this.getPayType()
                    this.payDialog = false
                    this.onPayingBtn()
                }
                else {
                    this.payingLoading = true
                    this.onPayingBtn()
                }
            },
            //付款操作
            onPayingBtn() {
                let payType = null
                let args = []
                let req = []
                if (this.checkArray.length == 1 && (this.checkArray[0].status == 5 || this.payTypeSet == 'off' || this.checkArray[0].channelType == 2)) {
                    payType = this.payTypeSet
                    if (!this.checkArray.length || !(payType == 'on' || payType == 'off')) {
                        this.$message.error('异常错误')
                        return false
                    }
                    if (!this.payType) {
                        this.$message.warning('请选择付款方式')
                        return false
                    }
                    this.payingScreenLoading = true
                }
                this.checkArray.forEach((item) => {
                    req = {
                        "id": item.id,
                        "updateUser": this.dealer
                    }
                    if (payType) req["channelDistributionId"] = this.payType
                    args.push({
                        biz: {
                            remitOrder: req
                        },
                        comment: "",
                        executor: this.dealer + '',
                        workflow: {
                            payWay: this.payTypeSet == 'on' ? 1 : 2
                        }
                    })
                })
                api.remitFLow({remitOrder: args}).then((res) => {
                    this.payDialog = false
                    this.payingScreenLoading = false
                    this.payingLoading = false
                    if (res.data.status === 200) {
                        let errorCount = 0
                        let successCount = 0
                        if (res.data.result.length > 0) {
                            res.data.result.forEach((item) => {
                                if (item.response.code == 200) {
                                    successCount++
                                } else {
                                    errorCount++
                                }
                            })
                            if (errorCount > 0) {
                                if (errorCount == args.length) {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'warning',
                                        message: '操作失败',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                } else {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'warning',
                                        message: '操作成功' + successCount + '条，操作失败' + errorCount + '条',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                }
                                this.payingDialog = false
                                this.submitSearch(this.searchCache)
                                return false
                            }
                            else {
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '操作成功',
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                        }
                        this.submitSearch(this.searchCache)
                        this.payingDialog = false
                    } else if (res.data.status) {
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: res.data.message,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    } else {
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '超时，请刷新页面',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    }
                    this.submitSearch(this.searchCache)
                    this.payingDialog = false
                })
            },
            closeRejDialog() {
                this.rejDialog = false
                this.textareaText = ''
            },
            closePayDialog(){
                this.payDialog = false
            },
            closePayingDialog(){
                this.payingDialog = false
            },
            closeCloudDialog(){
                this.sendCloudDialog = false
            },
            //批量驳回
            rejectRemit(Arr){
                this.checkArray = Arr
                this.rejDialog = true
            },
            //批量付款
            checkRemit(Arr) {
                let dealIds = []
                this.remitedArr = []
                this.totalPay = 0
                if (Arr.length > 0) {
                    Arr.forEach((item) => {
                        dealIds.push({id: item.id})
                    })
                }
                this.getCount(dealIds)
            },
            getCount(dealIds) {
                api.checkCount({remitOrder: dealIds}).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.response.remitOnlineVOs.forEach((items) => {
                            this.remitedArr.push(items)
                            this.totalPay += items.totalAmount
                        })
                        this.remitCompareVisible = false
                        this.compareLoading = false
                        this.payDialog = true
                    }
                    else {
                        this.$message.error('付款信息获取失败')
                        this.compareLoading = false
                        return false
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
