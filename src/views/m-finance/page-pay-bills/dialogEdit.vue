<template>
    <div>
        <el-dialog @close="closeDialog"
                   v-model="isDialogShow"
                   size="full"
                   class="t8t-full-dialog dialog-edit">
            <div class="t8t-full-dialog-container">
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            v-if="$route.query.status!=2"
                            ref="toolbar"
                            class="t8t-dark"
                            @EDIT-SUBMIT="submitAll()"
                            @EDIT="gotoEdit()">
                        </t8t-toolbar>
                    </div>
                </div>
                <t8t-form-panel ref="fp"
                                :dataSource="formData"
                                :fields="fields"
                                :commonData="commonData"
                                @field-button-click="handleFieldButtonClick()"></t8t-form-panel>
                <div class="full-dialog-tabs-container">
                    <el-tabs v-model="activeTabName">
                        <el-tab-pane label="收款类型"
                                     class="tableDebitType"
                                     name="one">
                            <div class="t8t-toolbar" v-if="pageType!=='view'">
                                <el-button type="primary"
                                           size="small"
                                           icon="plus"
                                           @click="add()">新增行</el-button>
                                <el-button type="danger"
                                           size="small"
                                           icon="close"
                                           @click="del()">删除行</el-button>
                            </div>
                            <t8t-table ref="tableDebitType"
                                       :args="args"
                                       :service="service"
                                       :method="method"
                                       :columns="columns"
                                       :selectCol="true"
                                       :indexCol="true"
                                       :isLoading="isTabLoading"
                                       :commonData="commonData"
                                       :editable="pageType!=='view'"
                                       :pageBar="false"
                                       :currentPage="currentPage"
                                       :total="totalRows"
                                       :pageSize="pageSize"
                                       @selection-change="handleSelectionChange"
                                       @current-row-change="handleCurrentRowChange"
                                       @current-page-change="handleCurrentPageChange"
                                       @size-change="handleSizeChange"
                                       @sort-change="handleSortChange"
                                       @cell-form-item-change="onChange">
                            </t8t-table>
                        </el-tab-pane>
                        <el-tab-pane label="核销记录"
                                     class="removeLog"
                                     name="two">
                            <t8t-table ref="removeLog"
                                       :args="argsVerify"
                                       :service="serviceVerify"
                                       :method="methodVerify"
                                       :columns="columnsRmv"
                                       :isLoading="isTabLoadingRmv"
                                       :commonData="commonDataRmv"
                                       :currentPage="currentPageRmv"
                                       :total="totalRowsRmv"
                                       :pageSize="pageSizeRmv"
                                       @size-change="handleSizeChangeRmv">
                                <template slot="id"
                                          scope="scope">
                                    <el-button type="small"
                                               @click.stop="handleRowButtonClick(scope.row.id)">查看</el-button>
                                </template>
                            </t8t-table>
                        </el-tab-pane>
                        <el-tab-pane label="操作记录"
                                     class="operateLog"
                                     name="three"
                                     v-if="fasle && pageType==='view'">
                            <t8t-table ref="operateLog"
                                       :dataSource="tableDataOperate"
                                       :columns="columnsOperate"
                                       :isLoading="isTabLoadingOperate"
                                       :currentPage="currentPageOperate"
                                       :total="totalRowsOperate"
                                       :pageSize="pageSizeOperate"
                                       @size-change="handleSizeChangeOperate">
                            </t8t-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-dialog>
        <!-- 查看图片弹窗 -->
        <el-dialog ref="dlgViewer"
                   size="full"
                   class="g-transparent-dialog"
                   v-model="showDlgViewer">
            <div class="g-img-container">
                <img :src="getFullURL(formData.receiptVoucherUrl)"
                     alt="">
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
import request from 'src/services/finance/receiveOrder.js'
import service from 'src/services/finance/Service.js'
import tableConfig from './dialogEdit.js'
import apiCommon from 'src/services/commonApi/commonApi.js'
import Utils from 'src/utils/Utils.js'
import Cookie from 'js-cookie'
import demoData from './data.json'
import apiDebitChannel from 'src/services/finance/debitChannel.js'
import apiDebitType from 'src/services/finance/debitType.js'
let orderId
let pageType
export default {
    name: 'page-pay-bills-dialog',
    data() {
        return {
            pageType: pageType,
            service: service.FINA_BILLS.name,
            method: service.FINA_BILLS.methods.ITEM_QUERY,
            serviceVerify: service.FINA_BILLS.name,
            methodVerify: service.FINA_BILLS.methods.RECEIPT_ORDER_QUERY,
            serviceLog: '',
            methodLog: '',
            allData: {},
            //表格1
            tableData: [],
            args: {
                "page": 1,
                "search": {
                    "receiptOrderId_eq": orderId
                },
                "size": 10,
                "sort": [
                    "id"
                ]
            },
            argsVerify: {
                "page": 1,
                "receiptOrderId": orderId,
                "size": 20
            },
            columns: tableConfig.tableDebitType,
            selection: [],
            selectedIDs: [],
            currentRow: {},
            currentID: null,
            isTabLoading: false,
            currentPage: 1,
            pageSize: 20,
            totalRows: 20,
            //表格2
            tableDataRmv: [],
            columnsRmv: tableConfig.columnsRmv,
            commonDataRmv: tableConfig.commonDataRmv,
            isTabLoadingRmv: false,
            currentPageRmv: 1,
            totalRowsRmv: 0,
            pageSizeRmv: 20,
            //表格3
            tableDataOperate: [],
            columnsOperate: tableConfig.operateLog,
            isTabLoadingOperate: false,
            currentPageOperate: 1,
            totalRowsOperate: 0,
            pageSizeOperate: 20,
            //辅助资料配置
            commonData: {
                organizations: [], // 组织机构
                businessTypes: [], // 业务类型
                debitObjects: [], // 收款对象
                debitTypes: [], // 收款类型
                debitMode: []
            },
            //页面
            toolbarData: [
                { symbol: 'btn1', text: '新增' },
                { symbol: 'btn2', text: '查看' },
            ],
            isLoading: false,
            isDialogShow: true,

            activeTabName: 'one',
            formData: {},
            fields: [
                {
                    prop: 'receiptOrgId',
                    label: '收款组织',
                    type: 'select',
                    list: 'organizations',
                    rules: [{
                        required: true,
                        message: '请选择收款组织'
                    }],
                    disabled: this.formDisabled
                }, {
                    prop: 'receiptModeId',
                    label: '收款方式',
                    type: 'select',
                    list: 'debitMode',
                    rules: [{
                        required: true,
                        message: '请选择收款方式'
                    }],
                    disabled: this.formDisabled
                }, {
                    prop: 'arriveAmount',
                    label: '到账金额',
                    type: 'input',
                    rules: [{
                        required: true,
                        message: '请输入到账金额'
                    }, {
                        pattern: /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/,
                        message: '正数,最多保留两位小数'
                    },{ pattern: /^((0|[1-9]\d{0,7})((\.[0-9]{1,2})?))$/, message: '数额整数位不能超过8位数' }],
                    disabled: this.formDisabled
                }, {
                    prop: 'arriveTime',
                    label: '到账时间',
                    type: 'datetime',
                    rules: [{
                        required: true,
                        message: '请输入到账时间'
                    }],
                    disabled: this.formDisabled
                }, {
                    prop: 'cardNo',
                    label: '银行卡号',
                    type: 'input',
                    rules: [{
                        pattern: /^(\d{4})$/,
                        required: true,
                        message: '请输入银行卡号后4位'
                    }],
                    disabled: this.formDisabled
                }, {
                    prop: 'receiptVoucherUrl',
                    label: '收款凭证',
                    text: '查看',
                    type: 'button',
                }, {
                    prop: 'remark',
                    label: '备注',
                    type: 'input',
                    disabled: this.formDisabled
                }
            ],
            formDisabled: false,
            showDlgViewer: false,
            options: [
                { label: '是', value: 0 },
                { label: '否', value: 1 }
            ]
        }
    },
    beforeCreate() {
        let routeNodes = this.$route.path.split('/')
        pageType = routeNodes[routeNodes.length - 1]
        orderId = this.$route.query.id
        if(pageType==='view'){
            this.formDisabled = true
        }
    },
    created() {
        apiCommon.queryByFunctionCode({ "funcCodes": ["001004013", "001004014"] })
            .then((res => {
                let list = []
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        if (item.isDel === 0) {
                            list.push({
                                value: item.id,
                                text: item.name
                            })
                        };
                    })
                    this.commonData['organizations'] = list
                }
            }))
        this.getReceiptType('debitTypes')
        this.getCommonData('11008', 'businessTypes')
        this.getCommonData('61004', 'debitObjects')
        this.getFormData()
    },
    watch: {
        'formData.receiptOrgId': function (val) {
            // 收款方式
            let args = {
                page:1,
                search: {
                    organizationId: val,
                    status: 1,
                    channelType: 2
                },
                size: 100
            }
            this.getReceiptModeCode(args,'debitMode')
        }
    },
    methods: {
        getFullURL(url){
            return Utils.getFullURL(url)
        },
        closeImgDialog() {
            this.showDlgViewer = false
        },
        handleRowButtonClick(val) {
            this.$router.push({ path: '../page-verify-cancel-record/see', query: { rowId: val } })
        },
        formatFormData(formData) {
            var ret = Object.assign({}, formData)
            ret.arriveAmount = +ret.arriveAmount
            ret.arriveTime = typeof ret.arriveTime !== 'number' ? Date.parse(ret.arriveTime) / 1000 : ret.arriveTime / 1000
            ret.updateUser = +Cookie.get('t8t-tc-uid')
            return ret
        },
        gotoEdit() {
            // this.pageType = 'update'
            // this.formDisabled = false
            this.$router.push({ path: 'update', query: { id: orderId } })
            // this.$router.go(0)
        },
        getSumRows(){
            let tableActionLog = this.$refs['tableDebitType'].getActionLog(false)
            let sum = 0
            let rows = [].concat(tableActionLog.editedRows,tableActionLog.addedRows)
            for(let i = 0; i < rows.length; i++){
                rows[i]['arriveAmount'] = +rows[i]['arriveAmount']
                rows[i]['projectId'] = +rows[i]['projectId']
                sum += +rows[i]['arriveAmount']
            }
            return sum
        },
        submitAll() {
            let self = this
            let orderForm = true
            let itemForm = true
            let tableActionLog

            this.$refs['fp'].validate((isValid) => {
                if (isValid) {
                    orderForm = true
                } else {
                    orderForm = false
                }
            })
            this.$refs['tableDebitType'].validate((isValid) => {
                if (isValid) {
                    itemForm = true
                    tableActionLog = self.$refs['tableDebitType'].getActionLog(false)
                } else {
                    itemForm = false
                }
                if (orderForm && itemForm) {
                    let hForm = +self.formData.arriveAmount
                    let rows = self.getSumRows()
                    console.log(hForm, rows)
                    if(hForm.toFixed(2) !== rows.toFixed(2)){
                        this.$msgbox({
                            title: '消息',
                            type: 'warning',
                            message: '金额不一致，请修改',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        return false
                    }
                    for(let i = 0; i<tableActionLog.editedRows.length; i++){
                        if(tableActionLog.editedRows[i]['receiptorId']===''){
                            tableActionLog.editedRows[i]['receiptorId'] = 0
                        }
                    }
                    let args = {
                        "receiptOrderUpdateDTO": self.formatFormData(self.formData),
                        "receiptOrderItemUpdateDTO": {
                            "itemUpdateDTOs": tableActionLog.editedRows,
                            "itemUpdateInsertDTOs": tableActionLog.addedRows,
                            "itemDeleteIds": tableActionLog.deletedIDs
                        }
                    }
                    request.updateMS(args)
                        .then((res) => {
                            if (res.data.status === 200) {
                                self.$msgbox(mb('提交成功。', 'success'))
                                this.closeDialog()
                            } else {
                                self.$msgbox(mb(res.data.message, 'error'))
                            }
                        })
                }
            })

        },
        //辅助资料
        getCommonData: function (fatherCode, selectName) {
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
                            };
                        })
                        this.commonData[selectName] = list
                    }
                })
        },
        getFormData() {
            let self = this
            let args = {
                "page": 1,
                "search": {
                    "id": orderId
                },
                "size": 10,
                "sort": [
                    "id"
                ]
            }
            request.queryM(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        self.formData = res.data.result.rows[0]
                        self.formData.arriveTime *= 1000
                    }
                })
        },
        //表格
        test(cell, val) {
            console.log(cell, val)
        },
        test1() {
            console.log(this.formData)
            this.$refs['tableDebitType'].validate((isValid) => {
                if (isValid) {
                    console.log('ok')
                }
            })
        },
        //处理选择行变化
        add() {
            this.$refs['tableDebitType'].addNewRow()
        },
        del() {
            this.$refs['tableDebitType'].delRows()
        },
        handleSelectionChange(selRows, selIDs) {
            this.selection = selRows
            this.selectedIDs = selIDs
        },
        //处理行双击事件
        handleRowDblclick(row, event) {
            this.formAction = 'update'
            this.formData = Object.assign({}, this.currentRow)
            this.$refs['dlgMain'].dialogShow()
        },
        //处理当前行改变
        handleCurrentRowChange(curRow, oldRow) {
            this.currentRow = curRow
        },
        //处理页码变化
        handleCurrentPageChange(val) {
            this.currentPage = val
        },
        //处理每页行数变化
        handleSizeChange(val) {
            this.pageSize = val
        },
        //处理每页行数变化 - 核销记录
        handleSizeChangeRmv(val) {
            this.pageSize = val
        },
        //处理每页行数变化 - 操作记录
        handleSizeChangeOperate(val) {
            this.pageSize = val
        },
        //处理表头排序
        handleSortChange(sortStr) {
            console.log(sortStr)
        },
        //处理行内查看按钮点击
        handleViewBtnClick(row) {
            console.log(row)
        },
        handleFieldButtonClick(field) {
            this.$refs['dlgViewer'].open()
        },
        submitForm(formRef) {
            this.$refs[formRef].validate((isValid) => {
                if (!isValid) return false
                this.isLoading = true
                // 模拟请求
                setTimeout(() => {
                    this.isLoading = false
                }, 2000)
            })
        },
        closeDialog() {
            this.$router.push({ path: '/finance/page-pay-bills'})
            this.$emit('close')
        },
        getReceiptModeCode: function(args,selectName){
            let list = []
            apiDebitChannel.queryPage(args)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.rows.forEach((item) => {
                        list.push({
                            value: item.channelId,
                            text: item.name
                        })
                    })
                    this.commonData[selectName] = list
                }
            })
        },
        getReceiptType: function(selectName){
            let list = []
            let args = {
                page: 1,
                size: 100,
                search: {
                    status: 1
                }
            }
            apiDebitType.queryPage(args)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.rows.forEach((item) => {
                        list.push({
                            value: item.debitTypeId,
                            text: item.name
                        })
                    })
                    this.commonData[selectName] = list
                }
            })
        },
        onChange(cell, val){
            if(cell.column.property !== 'receiptTypeId')return
            let args = {
                page: 1,
                size: 100,
                search: {
                    debitTypeCodeId: val
                }
            }
            apiDebitType.queryPage(args)
            .then((res) => {
                if (res.data.status === 200) {
                    let myRow = res.data.result.rows[0]
                    cell.row.bizId = myRow.businessTypeId
                    cell.row.receiptRoleId = myRow.debitObjectId
                }
            })
            // let args = {
            //         page: 1,
            //         size: 100,
            //         search: {
            //             businessTypeId: cell.row.bizId,
            //             debitObjectId: cell.row.receiptRoleId,
            //             status: 1
            //         }
            //     }
            // if(cell.column.property === 'bizId'){
            //     args.search.businessTypeId = val
            //     cell.row.receiptTypeId = ''
            // }
            // if(cell.column.property === 'receiptRoleId'){
            //     args.search.debitObjectId = val
            //     cell.row.receiptTypeId = ''
            // }
            // if(cell.column.property === 'bizId' || cell.column.property === 'receiptRoleId'){
            //     apiDebitType.queryPage(args)
            //     .then((res) => {
            //         if (res.data.status === 200) {
            //             let list = []
            //             res.data.result.rows.forEach((item) => {
            //                 list.push({
            //                     value: item.debitTypeId,
            //                     text: item.name
            //                 })
            //             })
            //             this.commonData['debitTypes'] = list
            //         }
            //     })
            // }
        }
    }
};

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

.dialog-edit.t8t-full-dialog .el-tabs__item+.el-tabs__item {
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
    padding: 10px 0!important;
    margin: 0 auto!important;
}

.dialog-edit.t8t-full-dialog .el-tab-pane .t8t-toolbar .el-button--small {
    padding: 7px 9px!important;
    font-size: 12px;
}

.dialog-edit.t8t-full-dialog  .el-dialog .el-button--small {
    padding: 7px 9px!important;
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

.dialog-edit.t8t-full-dialog  .tableDebitType .t8t-table {
    top: 50px;
}

.dialog-edit.t8t-full-dialog  .removeLog .t8t-table,
.dialog-edit.t8t-full-dialog  .operateLog .t8t-table {
    top: 30px;
}

.dialog-edit.t8t-full-dialog .t8t-table .table-container {
    margin-left: 0;
}
</style>
