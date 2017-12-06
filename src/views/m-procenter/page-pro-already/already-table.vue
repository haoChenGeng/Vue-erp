<template>
    <div class="t8t-table">
       <div class="table-container">
            <t8t-el-form
                :model="dataSource"
                :style="{height:'100%'}"
                ref="form"
            >
                <el-table
                    ref="table"
                    height="theHeight"
                    border
                    stripe
                    fit
                    v-loading="isLoading"
                    :data="dataSource"
                    :style="{height:'100%'}"
                    :row-class-name="tableRowClassName"
                    @cell-click="handleCellClick"
                    @current-change="currentRowChange"
                    @row-dblclick="rowDblclick"
                    @selection-change="selectionChange"
                    @row-click="rowClick"
                    @sort-change="sortChange"
                >
                    <el-table-column
                        v-if="selectCol"
                        header-align="center"
                        align="center"
                        type="selection"
                        fixed
                        width="38"
                    >
                    </el-table-column>
                    <el-table-column
                        v-if="indexCol"
                        label="序号"
                        header-align="center"
                        align="center"
                        type="index"
                        width="45"
                    >
                    </el-table-column>
                    <el-table-column
                        v-for="item in columns"
                        header-align="center"
                        align="center"
                        :prop="item.prop"
                        :label="item.label || ''"
                        :render-header="item.required?colRequired:colNormal"
                        :sortable="typeof item.sortable!=='undefined'?item.sortable:'custom'"
                        :min-width="item.width?item.width:150"
                    >
                        <template scope="scope">
                            <t8t-el-form-item
                                v-if="editable && item.editor && isActiceCell(scope)"
                                :prop="scope.column.property"
                                :row="scope.$index"
                                :rules="item.editor.rules || []"
                            >
                                <el-input
                                    v-if="item.editor.type==='input'"
                                    :value="scope.row[item.prop]"
                                    :placeholder="scope.column.label"
                                    @click.native.stop
                                    @change.native="scope.row[item.prop]=$event.target.value"
                                >
                                </el-input>
                                <el-select
                                    v-else-if="item.editor.type==='select'"
                                    v-model="scope.row[item.prop]"
                                    :placeholder="scope.column.label"
                                    @click.native.stop
                                >
                                    <el-option
                                        v-for="opt in commonData[item.list]"
                                        :label="opt.text"
                                        :value="opt.value"
                                    ></el-option>
                                </el-select>
                                <el-button
                                    v-else-if="item.editor.type==='button'"
                                    size="small"
                                    @click.stop="item.editor.action(scope.row)"
                                >
                                    {{item.editor.text}}
                                </el-button>
                            </t8t-el-form-item>
                            <slot
                                v-else-if="!editable || !isActiceCell(scope)"
                                :name="item.prop"
                                :row="scope.row"
                                :column="scope.column"
                            >
                                {{item.list? getText(item.list,scope.row[item.prop]): scope.row[item.prop]  | myFilter( typeof item.showtype =='undefined' ? '' :item.showtype,userIdAndName)   }}
                            </slot>
                        </template>
                    </el-table-column>
                </el-table>
            </t8t-el-form>
        </div>
        <!--分页栏-->
        <div
            class="pagenav-container"
            v-if="pageBar"
        >
            <t8t-el-pagination
                :current-page="currentPage"
                :total="totalRows"
                layout="sizes, first, prev, jumper, next, last, refresh, ->, total"
                :page-sizes="[5,10,20,30,50]"
                :page-size="pageSize"
                @current-change="currentPageChange"
                @size-change="sizeChange"
            >
            </t8t-el-pagination>

        </div>

    </div>

</template>

<script>
    // import { getBlankData, getTextById, getCommonData } from 'src/components/t8t-table/utils/utils.js'
    import apiProCenter from 'src/services/procenter/proCenterApi.js'
    // import Clickoutside from 'src/components/t8t-table/utils/clickoutside.js'
    // import 'src/components/t8t-table/t8t-table.css'
    import axios from 'src/utils/axios'
    import Cookie from 'js-cookie'
    export default {
        name: 'already-table',
        data() {
            return {
                blankData: {},
                selectedRows: [],
                selectedIndexes: [],
                deletedRows: [],
                addedRows: [],
                editedRows: [],
                activeRow: {},
                activeCol: {},
                dataSource:[],
                currentRow:[],
                loadingOverlay:true,
                userIdAndName:{},
                pageSize:20,
                currentPage:1,
                total:0,

            }
        },
        created() {
            this.reloadTable();

        },
        computed: {
            totalRows: function () {
                return this.total
            },

        },

        filters:{
            myFilter:function(val,type,userIdAndName){
                let that = this
                let finalValue = val
                if(type == "status"){
                    if(val == '1'){
                        finalValue =  "运行中"
                    }else{
                        finalValue =  "已挂起"
                    }
                }else if(type == 'time'){
                    let daputtime = new Date(val);
                    let Y = daputtime.getFullYear();
                    let m = daputtime.getMonth()+1;
                    let d = daputtime.getDate();
                    let H = daputtime.getHours();
                    let i = daputtime.getMinutes();
                    let s = daputtime.getSeconds()+1;
                    finalValue = Y+'-'+ (m<10 ? '0'+m:m) +'-'+(d<10 ? '0'+d:d)+' '+(H<10 ? '0'+H:H)+':'+(i<10 ? '0'+i:i);
                }else if(type == 'personName'){
                    return userIdAndName[val]
                }else if(type == 'personNames'){
                    let uid = Cookie.get('t8t-tc-uid')
                    let strfinalValues = ''
                    let index = val.indexOf(uid)
                    if(index != -1){
                        val.splice(index,1)
                    }
                    strfinalValues =
                    userIdAndName[uid] +","+(typeof userIdAndName[val[0]] == 'undefined' ?  (typeof val[0] == 'undefined' ? '' : val[0] ): userIdAndName[val[0]]) + ","+
                    (typeof userIdAndName[val[1]] == 'undefined' ? (typeof val[1] == 'undefined' ? '' : val[1] ): userIdAndName[val[1]])+",..."

                     finalValue = strfinalValues

                }else{
                    finalValue =  val
                }

                return finalValue
            }
        },



        directives: {
            Clickoutside
        },
        props: {
            service: String,
            method: String,
            args: Object,

            editable:{
                type: Boolean,
                default: false
            },

            commonData: Object,
            columns: Array,
            selectCol: {
                type: Boolean,
                default: true
            },
            indexCol: {
                type: Boolean,
                default: false
            },
            selection: Array,
            selectedIDs: Array,
            //currentRow: Object,
            currentID: [Number, String],
            isLoading: {
                type: Boolean,
                default: false
            },
            pageBar: {
                type: Boolean,
                default: true
            },

        },
        mounted() {
            this.blankData = getBlankData(this.dataSource)
        },
        watch: {
            args: function () {
                this.currentPage = 1
                this.reloadTable()
            }
        },
        methods: {
            test(a) {
                console.log(a)
            },
            isActiceCell(cell) {
                if (cell.row === this.activeRow && cell.column === this.activeCol) {
                    return true
                }
            },
            resetActiveCell() {
                debugger
                this.activeRow = ''
                this.activeCol = ''
            },
            handleCellClick(row, column, event) {
                this.activeRow = row
                this.activeCol = column
            },
            handleClose() {
                debugger
                this.activeRow = ''
                this.activeCol = ''
            },
            reloadTable(obj) {
                let params = {}
                let that = this
                let args = that.args || {}
                args.page = ((obj && obj.page) || that.currentPage)-1
                args.size = (obj && obj.pageSize) || that.pageSize
                args.involved = Cookie.get('t8t-tc-uid')
                params  = {query:args}
                that.loadingOverlay = true
                if (that.service && that.method) {
                    axios({
                        service: that.service,
                        method: that.method,
                        args: params
                    })
                    .then((res) => {
                        let response = res.data
                        if (response.status == 200) {
                            that.dataSource = response.result.result
                            that.total = response.result.total
                            //---将用户ID转化为用户名
                            let uids = []
                            console.log(response.result.result)
                            response.result.result.forEach((item)=>{
                                if(uids.indexOf(item.starterId) == -1){
                                    uids.push(item.starterId)
                                }
                                for(let p in item.executableUids){
                                    if(uids.indexOf(item.executableUids[p]) == -1){
                                        uids.push(item.executableUids[p])
                                    }
                                }

                            })
                            let args  = {'search':{id_in:uids}}
                            apiProCenter.getUserinfoName(args).then((res)=>{

                                    let userIdAndName  = {}
                                    if(res.data.status == 200){
                                        res.data.result.rows.forEach((d)=>{
                                            userIdAndName[d.id] = d.name
                                        })

                                    }
                                that.userIdAndName = userIdAndName

                            })
                            that.loadingOverlay = false
                            //---将用户ID转化为用户名结束
                        }
                    })
                    .catch((res) => {
                        // TODO 数据加载失败
                        that.$message.error('表格数据加载失败')
                        that.loadingOverlay = false
                    })
                } else {
                    // TODO 没有传service和method参数处理
                }
            },
            //表格事件处理
            //处理选择行变化
            selectionChange(selRows) {
                let selIDs = [] //数据库ID字段选择集
                let selIndexes = [] //行序号选择集
                selRows.forEach((item, index) => {
                    selIDs.push(item.id)
                    selIndexes.push(index)
                })
                this.selectedRows = selRows
                this.selectedIndexes = selIndexes
                //传入数据行、ID字段、行序号三个参数，模板页面可根据需要选用
                this.$emit('selection-change', selRows, selIDs, selIndexes)
            },
            //处理行双击事件
            rowDblclick(row, event) {
                this.clearSelection()
                this.$refs.table.toggleRowSelection(row)
                this.$emit('row-double-click', row, event)
            },
            //处理行单击事件
            rowClick(row, event, column) {
                if (!this.editable && column.type !== 'selection') {
                    this.$refs.table.toggleRowSelection(row)
                }
                this.$emit('row-click', row, event, column)
            },
            //处理当前行改变
            currentRowChange(curRow, oldRow) {
                this.currentRow = curRow
                this.$emit('current-row-change', curRow, oldRow)
            },
            //切换选中行样式
            tableRowClassName(row, index) {
                const exsist = this.selectedRows.indexOf(row)
                if (exsist !== -1) {
                    return 'selected-row'
                }
            },
            //处理表头排序
            sortChange({
                column,
                prop,
                order
            }) {
                let sortStr
                switch (order) {
                    case 'ascending':
                        sortStr = [prop + '_asc']
                        break
                    case 'descending':
                        sortStr = [prop + '_desc']
                        break
                    default:
                        sortStr = null
                }
                this.$emit('sort-change', sortStr, { column, prop, order })
            },
            colRequired(h, {
                column,
                $index
            }) {
                return h('span', {}, [h('span', {
                    attrs: {
                        class: 'required-tag'
                    }
                }, '* '), h('span', column.label)])
            },
            colNormal(h, {
                column,
                $index
            }) {
                return h('span', {}, [h('span', column.label)])
            },
            //分页部分
            //处理页码变化
            currentPageChange(val) {
                this.currentPage = val
                this.reloadTable({page: val})
                this.$emit('current-page-change', val)
            },
            //处理每页行数变化
            sizeChange(val) {
                this.pageSize = val
                this.reloadTable({pageSize: val})
                this.$emit('size-change', val)
            },
            getText(listName, value) {
                let list = this.commonData[listName]
                getTextById(list, value)
            },
            /*******************************get操作集合************************************** */
            getCurrentRow() {
                return this.currentRow
            },
            getSelectRows() {
                return this.selectedRows
            },
            getSelectRow(row) {
                // 如果要获取单个，默认获取多选中最后选择的一个
                let selLen = this.selectedRows.length
                return (selLen > 0) ? this.selectedRows[selLen - 1] : null
            },
            getRowByIndex(index) {
                return this.dataSource[index] || null
            },
            getSelectRowsWidthFormat(column, value) {
                let newObj = []
                this.selectedRows.forEach( (item, index) => {
                    item[column] = value
                    newObj[index] = item
                } )

                return newObj
            },
            /******************************************************************************* */
            //清空选择集
            clearSelection() {
                this.$refs.table.clearSelection()
            },
            //获取表格数据操作记录
            getActionLog() {
                let isAdded, isDeled
                let self = this
                let editedRows = []
                this.dataSource.forEach((item) => {
                    isAdded = self.addedRows.indexOf(item) === -1
                    isDeled = self.addedRows.indexOf(item) === -1
                    if (isAdded && isDeled) {
                        editedRows.push(item)
                    }
                })
                return {
                    "addedRows": this.addedRows,
                    "editedRows": editedRows,
                    "deletedRows": this.deletedRows
                }
            },
            //重置表格数据操作记录
            resetActionLog() {
                this.addedRows = []
                this.editedRows = []
                this.deletedRows = []
            },
            //添加新行
            addNewRow() {
                let newRow = Object.assign({}, this.blankData)
                this.dataSource.unshift(newRow)
                this.addedRows.push(newRow)
                console.log(this.addedRows)
                this.$emit('rows-added', this.addedRows)
            },
            //删除行
            delRows() {
                let self = this
                this.selectedRows.forEach((deletedItem) => {
                    let addedRowsIndex = self.addedRows.indexOf(deletedItem)
                    let dataSourceIndex = self.dataSource.indexOf(deletedItem)
                    if (addedRowsIndex !== -1) {
                        self.addedRows.splice(addedRowsIndex, 1)
                    } else {
                        self.deletedRows.push(deletedItem)
                    }
                    self.dataSource.splice(dataSourceIndex, 1)
                })
                console.log(this.deletedRows)
                this.$emit('rows-deleted', this.deletedRows)
            },
            //验证表格内嵌表单
            validate() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$message.info('成功！')
                    } else {
                        this.$message.error('请完善表单信息。')
                    }
                })
            },
            //重置表格内嵌表单
            reset() {
                this.$refs['form'].resetFields()
            },
            //控制正在加载界面显示、隐藏
            showLoading(locker) {
                this.isLoading = true
            },
            hideLoading(locker) {
                this.isLoading = false
            },
        }
    }

</script>
