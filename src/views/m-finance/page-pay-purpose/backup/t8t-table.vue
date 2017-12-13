<template>
    <div class="t8t-table">
        <!--数据表-->
        <div class="table-container">
            <el-table
                ref="mainTable"
                height="theHeight"
                border
                stripe
                v-loading="isLoading"
                :data="dataSet"
                :style="{height:'100%'}"
                :row-class-name="tableRowClassName"
                @current-change="handleCurrentRowChange"
                @row-dblclick="handleRowDblclick"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
                @sort-change="handleSortChange"
            >
                <el-table-column
                    header-align="center"
                    align="center"
                    type="selection"
                    fixed
                    width="38"
                >
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    prop="code"
                    label="编码"
                    sortable="custom"
                    min-width="160"
                >
                </el-table-column>
                <el-table-column
                    header-align="center"
                    prop="name"
                    label="款项用途"
                    sortable="custom"
                    min-width="160"
                >
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    prop="businessTypeCode"
                    :formatter="fmtOrganizationCode"
                    label="业务类型"
                    sortable="custom"
                    min-width="160"
                >
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    prop="debitObjectCode"
                    label="收款对象"
                    sortable="custom"
                    :formatter="fmtChannelType"
                    min-width="160"
                >
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    prop="debitTypeCode"
                    label="收款类型"
                    sortable="custom"
                    :formatter="fmtStatus"
                    min-width="160"
                >
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    prop="status"
                    label="状态"
                    sortable="custom"
                    :formatter="fmtStatus"
                    min-width="160"
                >
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    prop="createUser"
                    label="创建人"
                    sortable="custom"
                    min-width="160"
                >
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    prop="createTime"
                    label="创建时间"
                    sortable="custom"
                    min-width="160"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    prop="updateUser"
                    label="修改人"
                    sortable="custom"
                    min-width="160"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    prop="updateTime"
                    label="修改时间"
                    sortable="custom"
                    min-width="160"
                    show-overflow-tooltip
                >
                </el-table-column>
            </el-table>
        </div>
        <!--分页栏-->
        <div class="pagenav-container">
            <t8t-el-pagination
                @current-change="handleCurrentPageChange"
                @size-change="handleSizeChange"
                :current-page="currentPage"
                :total="totalPages"
                layout="sizes, first, prev, jumper, next, last, refresh, ->, total"
                :page-sizes="[5,10,20,30,50]"
                :page-size="pageSize"
            >
            </t8t-el-pagination>
        </div>
    </div>
</template>

<script>
    import * as types from 'src/store/mutation-types'
    import 'src/components/t8t-table/t8t-table.css'
    import api from 'src/utils/api'
    export default {
        name: 'T8tTable',
        data() {
            return {
                dataSet: [],
                selection: [],
                currentRow: {},
                demoData: [
                    {
                        "code": "FP002",
                        "businessTypeCode": "BY003",
                        "debitTypeCode": "002",
                        "createUser": 587,
                        "debitObjectCode": "DO002",
                        "name": "二期款",
                        "status": 1,
                        "createUser": 21157,
                        "createTime": 1488864724,
                        "updateUser": 2585,
                        "updateTime": 1488868567
                    }
                ],
                requestCfg: {
                    service: "fundPurpose",
                    method: "queryPage"
                }
            }
        },
        props: {

        },
        beforeMount() {
            api.fundPurpose.queryPage()
        },
        computed: {
            //表格数据
            tableData: {
                get() {
                    return this.$store.state.common.tableData
                },
                set(value) {
                    this.$store.commit(types.COM_SET_TABLEDATA, value)
                }
            },
            //通用数据
            commonData() {
                return this.$store.state.payMethods.commonData
            },
            //表格状态
            tableStatus: {
                get() {
                    return this.$store.state.common.tableStatus
                },
                set(value) {
                    this.$store.commit(types.COM_SET_TABLESTATUS, value)
                }
            },
            //当前行数据对象
            currentRow: {
                get() {
                    return this.$store.state.common.tableStatus.viewStatus.currentRow
                },
                set(value) {
                    this.$store.commit(types.COM_SET_TAB_VIEW_CURRENTROW, value)
                }
            },
            //当前行序号
            currentIndex: {
                get() {
                    return this.$store.state.common.tableStatus.viewStatus.currentIndex
                },
                set(value) {
                    this.$store.commit(types.COM_SET_TAB_VIEW_CURRENTINDEX, value)
                }
            },
            //是否显示加载中画面
            isLoading: {
                get() {
                    return this.$store.state.common.tableStatus.viewStatus.isLoading
                },
                set(value) {
                    this.$store.commit(types.COM_SET_TAB_VIEW_ISLOADING, value)
                }
            },
            //当前页
            currentPage: {
                get() {
                    return this.$store.state.common.tableStatus.pageStatus.currentPage
                },
                set(value) {
                    this.$store.commit(types.COM_SET_TAB_PAGE_CURRENTPAGE, value)
                }
            },
            //每页条目数量
            pageSize: {
                get() {
                    return this.$store.state.common.tableStatus.pageStatus.pageSize
                },
                set(value) {
                    this.$store.commit(types.COM_SET_TAB_PAGE_PAGESIZE, value)
                }
            },
            //页码总数
            totalPages: {
                get() {
                    return this.$store.state.common.tableStatus.pageStatus.totalPages
                },
                set(value) {
                    this.$store.commit(types.COM_SET_TAB_PAGE_TOTAL, value)
                }
            },
            //排序状态
            sortStatus: {
                get() {
                    return this.$store.state.payMethods.tableStatus.sortStatus
                },
                set(value) {
                    this.$store.commit(types.COM_SET_TAB_SORT, value)
                }
            },
            // add by allen.yao
            SelectedRows: {
                get() {
                    return this.$store.state.payMethods.tableStatus.selectedRows
                },
                set(value) {
                    this.$store.commit(types.COM_SET_TAB_VIEW_SELECTEDROWS, value)
                }
            }
        },
        watch: {
            //state变化更新本地数据localData
            tableData: {
                handler: function (val, oldVal) {
                    this.localData = []
                    // let strTableData = JSON.stringify(val)
                    // this.localData = JSON.parse(strTableData)
                    this.localData = this.demoData

                }
            },
            //切换编辑状态
            isEditable: function (val, oldVal) {
                if (val && !oldVal) {
                    this.clearSelection()
                    this.localData.unshift(this.blankData)
                } else if (oldVal && !val) {
                    this.localData.shift()
                }
            },
            currentPage: function (val, oldVal) {
                this.$store.dispatch('comLoadTableData')
            },
            pageSize: function (val, oldVal) {
                this.$store.dispatch('comLoadTableData')
            }
        },
        methods: {
            /*事件回调函数*/
            //处理选中行变化
            handleSelectionChange(val) {
                this.selection = val
            },
            //处理页码变化
            handleCurrentPageChange(val) {
                this.$store.commit(types.COM_SET_TAB_PAGE_CURRENTPAGE, val)
                //this.$store.dispatch('comLoadTableData')
            },
            //处理每页行数变化
            handleSizeChange(val) {
                this.$store.commit(types.COM_SET_TAB_PAGE_PAGESIZE, val)
                //this.$store.dispatch('comLoadTableData')
            },
            //处理行双击事件
            handleRowDblclick(row, event) {
                this.showEditDialog('retrieve')
            },
            //处理行单击事件
            handleRowClick(row, event, column) {
                if (column.type !== 'selection' && !this.isEditable) {
                    this.$refs.mainTable.toggleRowSelection(row)
                }
            },
            //处理当前行改变
            handleCurrentRowChange(curRow, oldRow) {
                let index = this.localData.indexOf(curRow)
                this.currentRow = curRow
                this.currentIndex = index
            },
            //显示对话框
            showEditDialog(formData, editType) {
                var data = {}
                data.formData = formData
                data.editType = editType
                this.$store.commit('PAYMETHODS_SET_DIALOG', data)
            },
            //点击新增按钮
            btnInsertClick() {
                //this.localData.unshift(this.blankData)
                var formData = {
                    code: '003005',
                    name: null,
                    organizationCode: null,
                    channelType: null,
                    status: 1,
                    createUser: null
                }
                this.showEditDialog(formData, '新增')
            },
            btnEdit() {
                // 编辑
                if (this.selection.length === 0) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '请选择要处理的行。',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        confirmButtonClass: 'is-plain'
                    })
                    return
                } else {
                    var currentRow = this.currentRow;
                    var formData = {
                        code: currentRow.code,
                        name: currentRow.name,
                        organizationCode: currentRow.organizationCode,
                        channelType: currentRow.channelType,
                        updateUser: null,
                        createUser: currentRow.createUser,
                        status: currentRow.status
                    }
                    this.showEditDialog(formData, '编辑')
                }
            },
            btnLook() {
                // 查看
                if (this.selection.length === 0) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '请选择要处理的行。',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        confirmButtonClass: 'is-plain'
                    })
                    return
                } else {
                    this.showEditDialog('retrieve')
                }
            },
            btnInvalidClick() {
                let index
                let selectedIndex = []
                if (this.selection.length === 0) {
                    this.$message.error('请选择要处理的行。')
                } else {
                    this.$confirm('确认对所选数据进行作废处理？', '作废确认', {
                        type: 'warning'
                    }).then(() => {
                        this.selection.forEach((item) => {
                            selectedIndex.push(item.id)
                        })
                        this.$store.dispatch('invalidPayMethods', selectedIndex)
                            .then(() => {
                                if (this.$store.state.payMethods.invalidSuccess) {
                                    this.selection.forEach((item) => {
                                        item.status = 0
                                    })
                                    this.$store.commit(types.COM_SET_TAB_VIEW_SELECTEDROWS, this.selection)
                                    this.$message({ type: 'success', message: '已作废' })
                                } else {
                                    this.$message({ type: 'error', message: '操作失败' })
                                }
                            })


                    })
                }
            },
            //点击删除按钮
            btnDeleteClick() {
                let index
                let selectedIndex = []
                if (this.selection.length === 0) {
                    this.$message.error('请选择要处理的行。')
                } else {
                    this.$confirm('确定删除此项吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.selection.forEach((item) => {
                            selectedIndex.push(item.id)
                        })
                        if (!this.isEditable) {
                            this.$store.commit(types.COM_DEL_TAB_ROW, selectedIndex)
                        }
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        })
                    })
                }
            },
            //清除选区
            clearSelection() {
                this.$refs.mainTable.clearSelection()
            },
            //判断表格处于可编辑状态
            isSelectable(row, index) {
                if (this.isEditable) {
                    return false
                } else {
                    return true
                }
            },
            //判断行可编辑
            getRowEditable(row) {
                let isBlankRow = (row === this.localData[0])
                let isCurrentRow = (row === this.currentRow)
                if (this.isEditable && (isBlankRow || isCurrentRow)) {
                    return true
                } else {
                    return false
                }
            },
            //内嵌表单弹框编辑
            handleIconClick(row) {
                this.currentRow = row
                this.dialogData.typeCode = this.currentRow.typeCode
                this.$refs.codeSelector.open()
            },
            //提交内嵌表单
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isEditable = false
                        this.clearSelection()
                        this.$message.info('提交成功！')
                    } else {
                        this.$message.info('请完善表单信息。')
                    }
                })
            },
            //重置内嵌表单
            resetForm(formName) {
                this.$refs[formName].resetFields()
                this.isEditable = false
            },
            //切换选中行样式
            tableRowClassName(row, index) {
                const exsist = this.selection.indexOf(row)
                if (exsist !== -1) {
                    return 'selected-row'
                }
            },
            //格式化字段 - 收款方式
            fmtOrganizationCode(row, column) {
                let item = this.commonData.organizationCode.filter((item) => item.value === row.organizationCode)
                if (item[0]) { return item[0].text }
            },
            fmtChannelType(row, column) {
                let item = this.commonData.channelType.filter((item) => item.value === row.channelType)
                if (item[0]) { return item[0].text }
            },
            //格式化字段 - 联系人
            fmtStatus(row, column) {
                let item = this.commonData.status.filter((item) => item.value === row.status)
                if (item[0]) { return item[0].text }
            },
            //显示红色 '*' 必填列
            //<el-table-column :render-header="required">
            required(h, {
                column,
                $index
            }) {
                return h('span', {}, [h('span', {
                    attrs: {
                        class: 'required-tag'
                    }
                }, '* '), h('span', column.label)])
            },
            //处理表头排序
            handleSortChange({
                column,
                prop,
                order
            }) {
                switch (order) {
                    case 'ascending':
                        this.sortStatus = [prop + '_asc']
                        break
                    case 'descending':
                        this.sortStatus = [prop + '_desc']
                        break
                    default:
                        this.sortStatus = [prop + '_asc']
                }
                this.$store.dispatch('comLoadTableData', this.requestCfg)
            },
            //处理表头筛选
            handleFilterChange(filters) {
            }
        }
    }

</script>
