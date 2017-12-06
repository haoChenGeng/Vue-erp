<template>
    <div class="t8t-lookup">
        <el-popover ref="popover"
            placement="bottom"
            :width="size==='small'?530:660"
            :disabled="disabled"
            trigger="click"
            v-model="popoverVisible"
            @show="handleShow"
            @hide="handleHide">
            <div class="lookup-container"
                :class="{small:size==='small'}">
                <div class="search-box">
                    <slot name="searchEditor">
                        <el-input ref="searcher"
                            v-model="searchVal"
                            :placeholder="searchPlaceholder"
                            @input="handleSearch()"
                            @keyup.enter.native="handleSearch()">
                            <template slot="icon"> <i class="el-input__icon"
                                    :class="['el-icon-circle-close',onIconClick ? 'is-clickable' : '']"
                                    @click="handleClear()">
                                                        </i> <i class="el-input__icon"
                                    :class="['el-icon-search',onIconClick ? 'is-clickable' : '']"
                                    @click="handleSearch()">
                                                        </i> </template>
                        </el-input>
                    </slot>
                </div>
                <div class="table-box">
                    <t8t-table ref="table"
                        :radioCol="!multiple"
                        :selectCol="multiple"
                        :dataSource="dataSource"
                        :service="service"
                        :method="method"
                        :columns="columns"
                        :args="currentArgs"
                        :row-key="getRowKeys"
                        :current-row-key="currentValue"
                        :reserve-selection="true"
                        :selectable="selectable"
                        @current-row-change="handleCurrentRowChange"
                        @selection-change="handleSelectionChange"
                        @row-double-click="handleRowDoubleClick"> </t8t-table>
                </div>
                <div class="toolbar-box"
                    v-if="showToolbar()">
                    <el-button type="primary"
                        size="small"
                        :disabled="btnOkDisabled"
                        @click="handleBtnOKClick()"> 确定 </el-button>
                    <el-button type="toolbar"
                        size="small"
                        @click="handleBtnCancleClick()"> 取消 </el-button>
                </div>
            </div>
        </el-popover>
        <el-input v-model="currentValue"
            ref="mainInput"
            v-popover:popover
            icon="circle-close"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :on-icon-click="handleClearValue"></el-input>
    </div>
</template>

<script>
    // import T8tTable from '../t8t-table.vue'
    export default {
        name: 't8t-lookup',
        created() {
        },
        mounted() {
            this.currentRowKey = this.currentValue
        },
        data() {
            return {
                currentValue: this.value,
                currentArgs: this.args,
                searchVal: this.searchValue,
                popoverVisible: false,
                currentRow: null,
                selection: [],
                btnOkDisabled: true,
                currentRowKey: null
            }
        },
        props: {
            value: [String, Number],
            placeholder: String,
            searchPlaceholder: {
                type: String,
                default: '请输入搜索内容'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            readonly: {
                type: Boolean,
                default: true
            },
            size: {
                type: String,
                default: 'large'
            },
            dataSource: Array,
            service: String,
            method: String,
            columns: {
                type: Array,
                default() {
                    return [{
                        prop: 'id',
                        label: '编号'
                    }, {
                        prop: 'Name',
                        label: '名称'
                    }]
                }
            },
            searchValue: {
                type: [String, Number],
                default: null
            },
            searchExpr: Array,
            valueExpr: {
                type: String,
                default: ''
            },
            args: {
                type: Object,
                default() {
                    return {}
                }
            },
            multiple: Boolean,
            toolbar: Boolean,
            filterMethod: Function,
            selectable: Function
        },
        computed: {

        },
        watch: {
            value(val) {
                this.currentValue = val
            },
            args(val) {
                this.currentArgs = val
                this.$refs.table.reloadTable()
            },
            currentValue(val) {
                this.$emit('change', val)
            },
            currentRow(val) {
                if (val === null) {
                    this.btnOkDisabled = true
                } else {
                    this.btnOkDisabled = false
                }
            },
            selection(val) {
                if (val.length === 0) {
                    this.btnOkDisabled = true
                } else {
                    this.btnOkDisabled = false
                }
            }
        },
        methods: {
            handleShow() {
                let table = this.$refs.table
                table.columns = Array.from(table.columns)
                table.$refs.table.doLayout()
                this.$emit('show')
            },
            handleHide() {
                this.$emit('hide')
            },
            getRowKeys(row) {
                return row[this.valueExpr]
            },
            focus() {
                this.$refs.mainInput.$refs.input.click()
                this.$nextTick(function () {
                    this.$refs.searcher.$refs.input.focus()
                })
            },
            showToolbar() {
                if (typeof this.toolbar === 'undefined') {
                    return this.multiple
                } else {
                    return this.toolbar
                }
            },
            handleClear() {
                this.searchVal = ''
                this.handleSearch()
            },
            handleClearValue() {
                this.currentValue = null
            },
            handleSearch() {
                if (typeof this.filterMethod === 'function') {
                    this.currentArgs = this.filterMethod(this.searchVal, this.currentArgs)
                    this.$refs.table.reloadTable()
                } else {
                    if (typeof this.searchExpr !== 'undefined') {
                        let search = {}
                        this.searchExpr.forEach((item) => {
                            search[item + '_like'] = this.searchVal
                        })
                        this.currentArgs.search = search
                        this.$refs.table.reloadTable()
                    }
                }
            },
            setCurrentValue() {
                if (this.multiple) {
                    if (this.valueExpr === '') {
                        this.currentValue = this.selection
                    } else {
                        this.currentValue = this.selection.map((item) => {
                            return item[this.valueExpr]
                        })
                    }
                } else {
                    if (this.valueExpr === '') {
                        this.currentValue = this.currentRow
                    } else {
                        this.currentValue = this.currentRow[this.valueExpr]
                    }
                }
                this.$emit('input', this.currentValue)
            },
            handleRowDoubleClick(row, event, selectable) {
                if (selectable) {
                    this.setCurrentValue()
                    this.popoverVisible = false
                }
            },
            handleCurrentRowChange(row) {
                this.currentRow = row
            },
            handleSelectionChange(selection) {
                this.selection = selection
            },
            handleBtnOKClick() {
                this.setCurrentValue()
                this.popoverVisible = false;
            },
            handleBtnCancleClick() {
                this.popoverVisible = false;
            }
        }
    }

</script>

<style scoped>
    .lookup-container {
        display: flex;
        flex-direction: column;
        height: 400px;
    }

    .lookup-container.small {
        height: 320px;
    }

    .search-box {
        flex: content;
        margin-bottom: 10px;
    }

    .table-box {
        display: flex;
        flex: 1;
    }
</style>
<style>
    .lookup-container .t8t-table {
        width: 100%
    }

    .lookup-container .table-box th,
    .lookup-container .table-box td {
        height: 36px;
    }

    .lookup-container .table-box .el-table tr td div.cell,
    .lookup-container .table-box .t8t-table-container .table-container .el-table tr td div.cell {
        height: 36px;
        line-height: 36px;
    }

    .lookup-container .table-box .pagenav-container {
        padding: 3px 0;
    }

    .lookup-container.small .table-box .pagenav-container .el-pagination__jump {
        display: none
    }

    .lookup-container.small .table-box .pagenav-container .btn-refresh {
        margin-left: 0
    }

    .lookup-container.small .table-box th,
    .lookup-container.small .table-box td {
        height: 32px;
    }

    .lookup-container.small .table-box .el-table tr td div.cell,
    .lookup-container.small .table-box .t8t-table-container .table-container .el-table tr td div.cell {
        height: 32px;
        line-height: 32px;
    }

    .lookup-container .table-box .pagenav-container .el-pagination {
        padding: 0 3px;
    }

    .lookup-container .toolbar-box {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }

    .lookup-container .toolbar-box .el-button {
        padding: 7px 25px;
    }

    .lookup-container .toolbar-box .el-button+.el-button {
        margin-left: 10px;
    }

    .lookup-container .search-box .el-input__icon+.el-input__inner {
        padding-right: 60px;
    }

    .lookup-container .search-box .el-input__icon {
        cursor: pointer;
    }

    .lookup-container .search-box .el-icon-circle-close {
        width: 20px;
        right: 30px;
        color: #c1c2c3;
    }

    .lookup-container .search-box .el-icon-circle-close:hover {
        color: #d7d8d9;
    }

    .lookup-container .search-box .el-icon-search {
        width: 30px;
    }

    .lookup-container .search-box .el-icon-search::before {
        color: #6b6b6b;
    }

    .lookup-container .search-box .el-icon-search:hover::before {
        color: #3197FC;
    }
    /*.lookup-container ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
.lookup-container ::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
}*/
</style>
