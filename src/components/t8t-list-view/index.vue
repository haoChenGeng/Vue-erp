<template>
    <div class="t8t-list-view">
        <!-- 面包屑 -->
        <t8t-breadcrumb ref="list-breadcrumb" v-if="breadcrumbData.length > 0" :data="breadcrumbData"></t8t-breadcrumb>
        <!-- 搜索区域 -->
        <t8t-search
            ref="list-search"
            v-if="searchFields.length > 0"
            :fields="searchFields"
            :selectSource="searchOptions"
            :formData="searchDataSource"
            :showToggleBtn="showSearchToggleBtn"
            @submit="searchSubmit"
            @change="searchChange"
            @changeDivision="searchChangeDivision"
            @visible-change="visibleChange"
            @click="searchIconClick"
            @blur="searchBlur"
            @focus="searchFocus"
            @select="searchSelect"
        >
        </t8t-search>

        <!-- 内容区 -->
        <div class="g-main-container">

            <!-- 树 -->
            <t8t-tree
                ref="list-tree"
                v-if="showTree"
                :data="treeData"
                :props="treeProps"
                :show-checkbox="showTreeCheckBox"
                :default-expanded-keys="defaultTreeExpandedKeys"
                @node-click="onTreeNodeClick"
            >

            </t8t-tree>

            <div class="g-main-container-column">
                <!-- 工具条 -->
                <t8t-toolbar
                    v-if="showToolbar"
                    :symbolList="toolbarSymbolList"
                    :disabledSymbols="toolbarDisabledSymbols"
                    @toolbar-click="onToolbarClick"
                    ref="list-toolbar"
                >

                </t8t-toolbar>

                <!-- table -->
                <t8t-table
                    v-if="showTable"
                    ref="list-table"
                    :columns="tableColumns"
                    :service="tableService"
                    :method="tableMethod"
                    :args="tableArgs"
                    :pageBar="tablePageBar"
                    :commonData="tableCommonData"
                    :selectCol="tableSelectCol"
                    :indexCol="tableIndexCol"
                    :templateData="tableTemplateData"
                    :editable="tableEditable"
                    :radioCol="tableRadioCol"
                    :customColumn="tableCustomColumn"
                    @selection-change="tableSelectionChange"
                    @row-double-click="tableRowDobuleClick"
                    @current-row-change="tableCurrentRowChange"
                    @row-click="tableRowClick"
                    @sort-change="tableSortChange"
                    @data-loaded="tableDataLoaded"
                    @size-change="tableSizeChange"
                    @rows-added="tableRowsAdded"
                    @rows-deleted="tableRowsDeleted"
                    @cell-click="tableCellClick"
                >

                </t8t-table>
            </div>

        </div>
    </div>
</template>

<script>
    import SearchBuilder from 'src/utils/builders/SearchConditionBuilder.js'
    import axios from 'src/utils/axios.js'

    export default {
        name: "t8t-list-view",
        props: {
            deleteMethod: String,
            showTable: {
                type: Boolean,
                default: true
            },
            breadcrumbData: {
                type: Array,
                default: []
            },
            searchFields: Array,
            searchOptions: Object,
            searchDataSource: Object,
            showSearchToggleBtn: Boolean,
            treeData: Array,
            showTree: {
                type: Boolean,
                default: false
            },
            treeProps: {
                type: Object,
                default() {
                    return {
                        label: 'label',
                        children: 'children'
                    }
                }
            },
            showTreeCheckBox: {
                type: Boolean,
                default: false
            },
            defaultTreeExpandedKeys: {
                type: Array,
                default () {
                    return [1]
                },
                required: false
            },
            treeArgs: {
                type: Object,
                default () {
                    return {}
                }
            },
            refreshOnTreeClick: {
                type: Boolean,
                default: false
            },
            showToolbar: {
                type: Boolean,
                default: true
            },
            toolbarSymbolList: {
                type: Array,
                default: []
            },
            toolbarDisabledSymbols: {
                type: Array,
                default: []
            },
            tableColumns: Array,
            tableService: String,
            tableMethod: String,
            tableCustomColumn: {
                type: Object,
                default: true
            },
            tableEditable: {
                type: Boolean,
                default: false
            },
            tableRadioCol: {
                type: Boolean,
                default: false
            },
            tableArgs: {
                type: Object,
                default: {}
            },
            tablePageBar: {
                type: Boolean,
                default: true
            },
            tableCommonData: Object,
            tableTemplateData: Object,
            tableSelectCol: {
                type: Boolean,
                default: true
            },
            tableIndexCol: {
                type: Boolean,
                default: false
            },
            tableAutoBuild: {
                type: Boolean,
                default: false
            },
            searchKey: {
                type: String,
                default: "search"
            },
            searchFilter: Function,
            treeSearchKey: {
                type: String,
                default: "search"
            },
            // 是否自动刷新表格（在点击查询之后）
            autoRefreshTable: {
                type: Boolean,
                default: true
            },
            // 以下是一些钩子函数
            beforeSearchSubmit: Function,
            beforeTreeSubmit: Function,
            deleteMethod: String
        },
        methods: {
            searchChange(value, name) {
                this.$emit('search-change', value, name)
            },
            searchChangeDivision (value, lastValue) {
                this.$emit('search-division-change', value, lastValue)
            },
            visibleChange (value, name) {
                this.$emit('search-visible-change', value, name)
            },
            searchIconClick (event, name) {
                this.$emit('search-icon-click', event, name)
            },
            searchBlur (event, name) {
                this.$emit('search-blur', event, name)
            },
            searchFocus (event, name) {
                this.$emit('search-focus', event, name)
            },
            searchSelect (event, name) {
                this.$emit('search-select', event, name)
            },
            getSearchInstance() {
                return this.$refs['list-search']
            },
            getBreadcrumbInstance() {
                return this.$refs['list-breadcrumb']
            },
            getTreeInstance() {
                return this.$refs['list-tree']
            },
            getToolbarInstance() {
                return this.$refs['list-toolbar']
            },
            getTableInstance() {
                return this.$refs['list-table']
            },
            disableBySymbol (symbol) {
                this.$refs['list-toolbar'].disableBySymbol(symbol)
            },
            unDisableBySymbol (symbol) {
                this.$refs['list-toolbar'].unDisableBySymbol(symbol)
            },
            onToolbarClick (symbol, event) {
                // 为了避免事件名冲突，加上list前缀
                let eventName = 'list-' + symbol.toLowerCase()
                this.$emit(eventName, symbol, event)
            },
            searchSubmit (formData) {
                this.$emit('search-submit', formData)
                let beforeHandler = this.beforeSearchSubmit
                let beforeHandlerType = typeof beforeHandler
                let flag = (beforeHandlerType !== 'function') ||
                    ( (beforeHandlerType === 'function') && (this.beforeSearchSubmit.call(this, formData) || false ) )

                // 不声明钩子或者钩子函数返回true才执行列表刷新操作
                if (flag === true && this.autoRefreshTable === true) {
                    // 后端DTO key统一叫search
                    // _args[this.searchKey] _

                    let _args = {}
                    let _buildParam = this.tableAutoBuild
                        ? SearchBuilder.build(formData, this.searchFields)
                        : formData

                    if (typeof this.searchFilter === 'function') {
                        _buildParam = this.searchFilter.call(this, formData, _buildParam)
                    }

                    if (!_buildParam || Object.keys(_buildParam) <= 0) {
                        _buildParam = null
                    }

                    _args[this.searchKey] = _buildParam;

                    this.tableArgs = _args
                }
            },
            onTreeNodeClick (data) {
                this.$emit('tree-node-click', data)

                let beforeSubmitHandler = this.beforeTreeSubmit
                let beforeSubmitHandlerType = typeof beforeSubmitHandler
                let flag = (beforeSubmitHandlerType !== 'function') ||
                    ( (beforeSubmitHandlerType === 'function') && (beforeSubmitHandler.call(this, data) || false ) )

                if (flag === true && this.refreshOnTreeClick === true) {
                    this.$nextTick(function(){
                        let _args = {}
                        _args[this.treeSearchKey] = this.treeArgs
                        this.tableArgs = _args
                    })
                }

            },
            tableSelectionChange (selRows, selIDs, selIndexes) {
                this.$emit('table-selection-change', selRows, selIDs, selIndexes)
            },
            tableRowDobuleClick (row, event) {
                this.$emit('table-row-dobule-click', row, event)
            },
            tableCurrentRowChange (currentRow, oldCurrentRow) {
                this.$emit('table-current-row-change', currentRow, oldCurrentRow)
            },
            tableRowClick (row, event, column) {
                this.$emit('table-row-click', row, event, column)
            },
            tableSortChange (column, prop, order) {
                this.$emit('table-sort-change', column, prop, order)
            },
            tableDataLoaded (dataSource) {
                this.$emit('table-data-loaded', dataSource)
            },
            tableSizeChange (size) {
                this.$emit('table-size-change', size)
            },
            tableRowsAdded (addRow) {
                this.$emit('table-rows-added', addRow)
            },
            tableRowsDeleted (deletedIDs) {
                this.$emit('table-rows-deleted', deletedIDs)
            },
            tableCellClick (row, column, cell, event, config) {
                this.$emit('table-cell-click', row, column, cell, event, config)
            },
            doDelete (primaryKey) {

                // 当做主键id的key名
                primaryKey = primaryKey || 'id'
                let that = this, deleteIds = []

                if (!that.deleteMethod) {
                    console.error('删除接口为空！')
                    return
                }

                let selectedRows = that.$refs['list-table'].getSelectRows()

                selectedRows.forEach((row) => {
                    if (row[primaryKey]) deleteIds.push(row[primaryKey])
                })

                if (!deleteIds.length > 0) {
                    let msg = '没有选中需要删除的行！';
                    this.$message.error(msg)
                    return
                }

                return axios({
                    service: that.tableService,
                    method: that.deleteMethod,
                    args: {
                        ids: deleteIds
                    }
                })
            },
            doView (routePath, primaryKey) {
                primaryKey = primaryKey || 'id'
                let selectedId = null;
                let selectedRows = this.$refs['list-table'].getSelectRows()

                selectedRows.forEach((row) => {
                    if (row[primaryKey]) selectedId = row[primaryKey]
                })

                if (!selectedId) {
                    let msg = '没有选中需要查看的行！';
                    this.$message.error(msg)
                    return
                }

                this.$router.push({
                    query: { id: selectedId, mode: 'view' },
                    path: routePath
                })
            },
            doEdit (routePath, primaryKey) {
                primaryKey = primaryKey || 'id'
                let selectedId = null;
                let selectedRows = this.$refs['list-table'].getSelectRows()

                selectedRows.forEach((row) => {
                    if (row[primaryKey]) selectedId = row[primaryKey]
                })

                if (!selectedId) {
                    let msg = '没有选中需要修改的行！';
                    this.$message.error(msg)
                    return
                }

                this.$router.push({
                    query: { id: selectedId, mode: 'edit' },
                    path: routePath
                })
            },
            doAdd (routePath) {
                this.$router.push({
                    query: { mode: 'add' },
                    path: routePath
                })
            }
        }
    }

</script>

<style lang="css" scoped>
    .t8t-list-view{
        display: flex;
        flex-direction: column;
        flex: 1;
    }
</style>
