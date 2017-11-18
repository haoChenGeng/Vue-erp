<template>
    <div class="page-pay-purpose">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-toolbar ref="toolbar"
                     @ADD="handleBtnAddClick"
                     @EDIT="handleBtnEditClick"
                     @VOID="handleBtnVoidClick">
        </t8t-toolbar>
        <t8t-table ref="table"
                   :args="args"
                   :columns="columns"
                   :commonData="commonData"
                   :service="service"
                   :method="method"
                   :isLoading="isLoading"
                   @row-double-click="handleRowDbClick"
                   @selection-change="handleselectionChange">
        </t8t-table>
        <t8t-dialog ref="dlgMain"
                    :data="formData"
                    :commonData="commonData"
                    :action="formAction"
                    @dialog-closed="reloadTable()"></t8t-dialog>
    </div>
</template>

<script>
import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
import T8tDialog from './t8t-dialog.vue'
import service from 'src/services/finance/Service.js'
import request from 'src/services/finance/fundPurpose.js'
import apiCommon from 'src/services/commonApi/commonApi.js'
import cookie from 'js-cookie'
import * as config from './config.js'

const uid = +cookie.get('t8t-tc-uid')
export default {
    name: 'page-pay-purpose',
    components: {
        T8tDialog
    },
    data() {
        return {
            //面包屑
            breadcrumbData: config.breadcrumbData,
            //表格
            tableData: [],
            columns: config.columns,
            blankData: config.blankData,
            commonData: config.commonData,
            service: service.DEBITCHANNEL.name,
            method: service.DEBITCHANNEL.methods.FUNDPERPOSE_QUERY_PAGE,
            selection: [],
            selectedIDs: [],
            currentRow: {},
            currentID: null,
            isLoading: false,
            args: {
                "page": 1,
                "size": 20
            },
            //表单
            formData: {},
            formAction: 'create'
        }
    },
    created() {
        // this.getTableData()
        // this.tableData = mock.demoData
        this.reloadCommonData()
    },
    methods: {
        reloadCommonData() {
            this.getCommonData('61002', 'debitTypeCodes')
            this.getCommonData('11008', 'businessTypes')
            this.getCommonData('61004', 'debitObjects')
            this.getCommonData('61003', 'fundPurposes')
        },
        reloadTable() {
            this.$refs['table'].reloadTable()
        },
        //处理行双击事件
        handleRowDbClick(row, event) {
            this.formAction = 'view'
            this.formData = Object.assign({}, row)
            this.reloadCommonData()
            this.$refs['dlgMain'].dialogShow()
            // this.dialogVisible = true
        },
        handleselectionChange(selRows, selIDs) {
            this.selection = selRows
            this.selectedIDs = selIDs
        },
        //处理页码变化
        handleCurrentPageChange(val) {
            this.currentPage = val
        },
        //处理每页行数变化
        handleSizeChange(val) {
            this.pageSize = val
        },
        //点击添加按钮
        handleBtnAddClick() {
            this.formAction = 'create'
            this.formData = Object.assign({}, this.blankData)
            this.reloadCommonData()
            this.$refs['dlgMain'].dialogShow()
        },
        //点击编辑按钮
        handleBtnEditClick() {
            this.formAction = 'update'
            if (this.selection.length === 0) {
                this.$message.error('请勾选数据后再操作。')
            } else if (this.selection.length > 1) {
                this.$message.error('请对单条数据进行操作。')
            } else {
                this.formData = Object.assign({}, this.selection[0])
                this.reloadCommonData()
                this.$refs['dlgMain'].dialogShow()
            }
        },
        //点击作废按钮
        handleBtnVoidClick() {
            let args
            let self = this
            let actGroup = []
            if (this.$refs['table'].selectedRows.length === 0) {
                this.$message.error('请勾选数据后再操作。')
            } else {
                this.$confirm(
                    '确认对所选数据进行作废处理？',
                    '作废确认',
                    { type: 'warning' })
                    .then(() => {
                        self.selectedIDs.forEach((item) => {
                            actGroup.push({
                                "id": item,
                                "status": 0,
                                "updateUser": uid
                            })
                        })
                        args = { "fundPurposes": actGroup }
                        request.batchStatusUpdate(args)
                            .then((res) => {
                                if (res.data.status === 200) {
                                    self.$msgbox(mb('已作废。', 'success'))
                                    this.reloadTable()
                                } else {
                                    self.$msgbox(mb('作废失败，请重试。', 'error'))
                                }
                            })
                    })
            }
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
                                    code: item.propertyCode,
                                    value: item.id,
                                    text: item.propertyName
                                })
                            };
                        })
                        this.commonData[selectName] = list
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

</style>


<style>

</style>
