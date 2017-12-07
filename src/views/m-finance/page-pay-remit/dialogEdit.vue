<template>
    <div class="remit-view">
        <el-dialog
            @close="closeDialog"
            v-model="isDialogShow"
            size="full"
            class="t8t-full-dialog"
        >
            <div class="t8t-full-dialog-container">
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar></t8t-toolbar>
                    </div>
                </div>
                <t8t-form-panel
                    :dataSource="formData"
                    :fields="fields"
                    :commonData="commonData"
                ></t8t-form-panel>
                <div class="full-dialog-tabs-container">
                    <el-tabs v-model="activeTabName">
                        <el-tab-pane
                            label="付款详情"
                            class="tableDebitType"
                            name="one"
                        >
                            <t8t-table
                                class="dialogview"
                                ref="tableDebitType"
                                :dataSource="remitData"
                                :columns="columns"
                                :indexCol=true
                                :selectCol=false
                                :isLoading="isTabLoading"
                                :commonData="commonData"
                                :pageBar=false
                            >
                            </t8t-table>
                        </el-tab-pane>
                        <el-tab-pane
                            label="操作记录"
                            class="operateLog"
                            name="three"
                            v-if="pageType==='view'">
                            <t8t-table
                                ref="operateLog"
                                :selectCol=false
                                :dataSource="tableDataOperate"
                                :columns="columnsOperate"
                                :isLoading="isTabLoadingOperate"
                                :commonData="commonData"
                                :indexCol=false
                                :pageBar=false
                            >
                            </t8t-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import request from 'src/services/finance/payRemit.js'
    import service from 'src/services/finance/Service.js'
    import tableConfig from './indexColumns.json'

    import apiCommon from 'src/services/commonApi/commonApi.js'

    let orderId
    let pageType

    export default {
        name: 'page-pay-bills-dialog',
        data() {

            return {
                pageType: pageType,
                service: service.FINA_BILLS.name,
                method: service.FINA_BILLS.methods.ITEM_QUERY,
                serviceVerify: service.VERIFYCANCELRECORD.name,
                methodVerify: service.VERIFYCANCELRECORD.methods.VERIFYORDERQUERYITEM,
                allData: {},
                //表格1
                tableData: [],
                argsVerify: {
                    "page": 1,
                    "receiptPlanOrderId": orderId,
                    "size": 10
                },
                columns: tableConfig.remitList,
                selection: [],
                selectedIDs: [],
                currentRow: {},
                currentID: null,
                isTabLoading: false,
                remitData:[],
                //表格2
                tableDataOperate: [],
                columnsOperate: tableConfig.operateLog,
                isTabLoadingOperate: false,
                //辅助资料配置
                commonData: {
                    organizations: [], // 组织机构
                    businessTypes: [], // 业务类型
                    debitObjects: [], // 收款对象
                    debitTypes: [] // 收款类型
                },
                isLoading: false,
                isDialogShow: true,
                activeTabName: 'one',
                formData: {},
                fields: [
                    {
                        prop: 'code',
                        label: '单据编号',
                        type: 'input',
                        disabled: 'disabled'
                    }, {
                        prop: 'businessTypeName',
                        label: '业务类型',
                        type: 'input',
                        disabled: 'disabled'
                    }, {
                        prop: 'payObject',
                        label: '付款对象',
                        type: 'input',
                        disabled: 'disabled'
                    },  {
                        prop: 'payOrganizationName',
                        label: '付款主体',
                        type: 'input',
                        disabled: 'disabled'
                    },
                    {
                        prop: 'prePayAmount',
                        label: '预付金额',
                        type: 'input',
                        disabled: 'disabled'
                    }, {
                        prop: 'payAmount',
                        label: '付款金额',
                        type: 'input',
                        disabled: 'disabled'
                    }
                ]
            }
        },
        beforeCreate() {
            let routeNodes = this.$route.path.split('/')
            pageType = routeNodes[routeNodes.length - 1]
            orderId = this.$route.query.id
        },
        created() {
            // this.getCommonData('002002', 'organizations')
            apiCommon.queryByFunctionCode({"funcCodes":["001004013","001004014"]})
                .then((res => {
                        let list = []
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.isDel===0) {
                                    list.push({
                                        value: item.id,
                                        text: item.name
                                    })
                                };
                            })
                            ///tableDataOperate
                             this.commonData['organizations'] = list
                             }
                }))
            this.getCommonData('61001', 'debitTypes')
            this.getCommonData('11008', 'businessTypes')
            this.getCommonData('61004', 'debitObjects')
            this.getFormData()

        },
        methods: {
            handleRowButtonClick(val) {
                this.$router.push({ path: '../page-verify-cancel-record', query: { id: val } })
            },
            formatFormData(formData) {
                var ret = Object.assign({}, formData)
                ret.arriveAmount = +ret.arriveAmount
                ret.cardNo = +ret.cardNo
                ret.arriveTime = +Date.parse(ret.arriveTime).toString().substr(0, 10)
                return ret
            },
            //辅助资料
            getCommonData: function(fatherCode,selectName) {
                let arg =  {
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
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            };
                        })
                        this.commonData[selectName] = list
                    }
                })
            },
            getFormData() {
                let args = {
                    "id": orderId
                }
                request.queryRemit(args)
                    .then((res) => {
                    if (res.data.status === 200) {
                        this.formData = res.data.result.remitorderVO
                        this.remitData = res.data.result.remitOrderItemVOs
                        this.isTabLoadingOperate = true
                        this.getTaskData()
                    }
                })
            },
            getTaskData() {
                let args = {
                    "search": {
                        recordNo: this.formData.code
                    },
                    page: 1,
                    size: 200
                }
                request.getLogs(args)
                    .then((res) => {
                    this.isTabLoadingOperate = false
                        if (res.data.status === 200) {
                            this.tableDataOperate = res.data.result.rows
                        }
                    })
            },
            //处理每页行数变化 - 操作记录
            handleSizeChangeOperate(val) {
                this.pageSizeOperate = val
            },
            closeDialog() {
                this.$router.push({ path: '/tochat-finance/page-pay-remit'})
                this.$emit('close')
            },
            submitSearch(obj) {
                this.searchCache = obj
                this.args = { search: obj }
            },
        }
    };
</script>

<style
    lang="css"
    scoped
>
    .t8t-full-dialog {
        width: 100%;
        height: 100%
    }
    .img-container {
        display: flex;
        justify-content: center;
    }

    .textarea-container {
        margin: 0 30px;
    }
</style>
<style>
    .remit-view .t8t-full-dialog .el-dialog__header {
        padding: 0;
    }

    .remit-view .t8t-full-dialog .el-dialog__body {
        padding: 0;
        height: 100%;
    }

    .remit-view .t8t-full-dialog .t8t-full-dialog-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .remit-view .t8t-full-dialog .full-dialog-tabs-container {
        flex: 1;
        margin-bottom: 0px;
    }

    .remit-view .t8t-full-dialog .full-dialog-toolbar-container {
        height: 38px;
        background-color: #1e3046;
    }

    .remit-view .t8t-full-dialog .toolbar-container {
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

    .remit-view .t8t-full-dialog .toolbar-container .toolbar-button {
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }

    .remit-view .t8t-full-dialog .toolbar-container .toolbar-button:hover {
        color: #1e3046;
        background-color: #d2deeb;
    }

    .remit-view .t8t-full-dialog .container-center {
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }

    .remit-view .t8t-full-dialog .el-form {
        display: flex;
        flex-wrap: wrap;
    }

    .remit-view .t8t-full-dialog .form-item-container {
        width: 25%;
        flex: 1;
    }

    .remit-view .t8t-full-dialog .full-dialog-form-container {
        margin-top: 22px;
    }

    .remit-view .t8t-full-dialog .full-dialog-form-container .el-form-item__content {
        width: 180px;
    }

    .remit-view .t8t-full-dialog .full-dialog-tabs-container {
        display: flex;
    }

    .remit-view .t8t-full-dialog .el-tabs {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .remit-view .t8t-full-dialog .full-dialog-tabs-container .el-tabs__item {
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }

    .remit-view .t8t-full-dialog .el-tabs__header {
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
        margin-bottom: 0;
    }

    .remit-view .t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar {
        height: 1px;
    }

    .remit-view .t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }

    .remit-view .t8t-full-dialog .el-tabs__nav-wrap {
        width: 1220px;
        margin: 0 auto;
    }

    .remit-view .t8t-full-dialog .el-tabs__content {
        width: 100%;
        min-height: 500px;
        position: relative;
    }

    .remit-view .t8t-full-dialog .el-tab-pane {
        flex: none !important;
        width: 100% !important;
        height: 100% !important;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .remit-view .t8t-full-dialog .el-tab-pane .t8t-toolbar {
        position: absolute;
        left: 30px;
        right: 30px;
        padding: 10px 0!important;
        margin: 0 auto!important;
    }

    .remit-view .t8t-full-dialog .el-tab-pane .t8t-toolbar .el-button--small {
        padding: 7px 9px!important;
        font-size: 12px;
    }

    .remit-view .el-dialog .el-button--small {
        padding: 7px 9px!important;
        font-size: 12px;
    }

    .remit-view .t8t-full-dialog .t8t-table {
        /*width: 1200px;*/
        flex: none !important;
        margin: 0 auto;
        position: absolute;
        left: 30px;
        bottom: 30px;
        right: 30px;
    }

    .remit-view .t8t-full-dialog .t8t-table .pagenav-container {
        border: 1px solid #D3DDE6;
    }

    .remit-view .t8t-full-dialog .t8t-table .pagenav-container {
        border: 1px solid #D3DDE6;
    }

    .remit-view .tableDebitType .t8t-table {
        top: 30px;
    }

    .remit-view .removeLog .t8t-table,
    .remit-view .operateLog .t8t-table {
        top: 30px;
    }

    .remit-view .t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }
</style>
