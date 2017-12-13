<template>
    <div>
        <el-dialog title="选择处理人员" class="deploy-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form  :inline="true" class="demo-form-inline" :style="{textAlign:textAlign}" :rules="rules" ref="userlistForm" @keyup.enter.native="btnOKClick()">
                    <el-form-item  prop="typeCode">
                        <el-select  v-model="typeCode" @change="changeTypeCode" placeholder="--请选择人员类型--">
                            <el-option v-for="item in categoryPerson" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item> 
                     <el-form-item  prop="boundUserName">
                        <el-input  v-model="boundUserName" placeholder="请输入相关信息搜索"></el-input>
                    </el-form-item> 

                    <el-form-item>
                        <el-button @click="searchClick()" type="primary">搜索</el-button>
                    </el-form-item>
            </el-form>

            <!--数据表-->
            <div v-if="changeTable">
                <div class="table-container">
                    <el-table
                        ref="mainTable"
                        border
                        stripe
                        :data="localData"
                        :style="{height:'100%'}"
                        :row-class-name="tableRowClassName"
                        @cell-click="handleCellClick"
                        @current-change="currentRowChange"
                        @selection-change="selectionChange"
                        @sort-change="sortChange"
                        @row-click = "rowClick"
                        @row-dblclick="rowDblclick"
                     
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
                            v-for = "column in columndatas"
                            header-align="center"
                            align="center"
                            :prop="column.prop"
                            :label="column.label"
                            sortable="custom"
                            min-width="150"
                            show-overflow-tooltip

                        >
                        </el-table-column>
                      
                    </el-table>
                </div>
                <div class="pagenav-container">
                    <t8t-el-pagination
                        @size-change="sizeChange"
                        @current-change="currentPageChange"
                        :current-page="currentPage"
                        :total="totalPages"
                        :page-sizes="[5,10,20,30,50]"
                        :page-size="pageSize"
                    >
                    </t8t-el-pagination>

                </div>
            </div>
            <div v-else style="margin-top:50px;margin-left:200px">
                <span style="color:gray">暂时没有数据</span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
    </el-dialog>
    </div>
</template>
<script>
    import apiProCenter from 'src/services/procenter/proCenterApi.js' 
    import Service from 'src/services/procenter/Service.js'
    import config from './config.json'
    export default {
        name: 'user-list-dialog',
        data() {
            return {
                localData:[],
                totalPages:0,
                pageSize:10,
                currentPage:1,
                selection: [],
                columndatas:[],

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

                

                changeTable:false,
                labelPosition: 'right',
                formLabelWidth: '120px',
                textAlign:'center',
               
                //人员类型配置
                categoryPerson: [],
                //表单
               
                typeCode: null,
                boundUserName:null,
                
                isLoading: false,
                dialogVisibleTable:false,
                columndataConfig:{officePerson:config.officePerson,supShop:config.supShop},
                

                service: Service.PROCENTERDEPLOYLIST.name,
                method: Service.PROCENTERDEPLOYLIST.methods.FLOWLIST,
            }
        },
        computed: {
            dialogVisible() {
                return true
            },
           
        },
        watch:{
           boundUserName:function (val) {
               this.changeTypeCode({name:this.boundUserName})
            }
        },
        created() {
            
            //获取流程分类数据
            this.getSystemCode({'fatherCode':'001001'});  
        },
        props:{
            assigneeTaskId:String
        },
        methods: {
            btnOKClick() {
                if(this.typeCode == null){
                    this.$message.error("请选择人员类型")
                    return false
                }

                this.getAssignee()
            },
            searchClick(){
                 if(this.typeCode == null){
                    this.$message.error("请选择人员类型")
                    return false
                }
                if(this.boundUserName == null){
                    this.$message.error("请输入相关信息搜索")
                    return false
                }
               this.changeTypeCode({name:this.boundUserName})
            },
            btnCancleClick() {
                this.$emit('close')
            },

            //切换选中行样式
            tableRowClassName(row, index) {
                const exsist = this.selectedRows.indexOf(row)
                if (exsist !== -1) {
                    return 'selected-row'
                }
            },

            handleCellClick(row, column, event) {
                this.activeRow = row
                this.activeCol = column
            },
               //处理当前行改变
            currentRowChange(curRow, oldRow) {
                this.currentRow = curRow
                this.$emit('current-row-change', curRow, oldRow)
            },
             //处理行双击事件
            rowDblclick(row, event) {
                this.clearSelection()
                this.$refs.mainTable.toggleRowSelection(row)
                this.$emit('row-double-click', row, event)
                this.getAssignee()
            },
            //清空选择集
            clearSelection() {
                this.$refs.mainTable.clearSelection()
            },
            //处理行单击事件
            rowClick(row, event, column) {
                if (!this.editable && column.type !== 'selection') {
                    this.$refs.mainTable.toggleRowSelection(row)
                }
                this.$emit('row-click', row, event, column)
            },
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

            sizeChange(val) {
                this.pageSize = val
                this.changeTypeCode({pageSize: val})
                this.$emit('size-change', val)
            },
            //处理页码变化
            currentPageChange(val) {
                this.currentPage = val
                this.changeTypeCode({page: val})
                this.$emit('current-page-change', val)
            },
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
          

             //获取人员分类
            getSystemCode:function(args){
                apiProCenter.getSystemCode(args).then((res)=>{
                    let categoryPerson = [];
                   if(res.data.status == 200){
                         res.data.result.forEach((item)=>{
                            categoryPerson.push({value:item.code,text:item.name});
                         })
                    this.categoryPerson = categoryPerson;
                   }
                })
            },

            changeTypeCode(obj){
                let typeCode = this.typeCode
                let that = this
                let args = that.args || {}
                args.page = ((obj && obj.page) || that.currentPage)-1
                args.size = (obj && obj.pageSize) || that.pageSize
                if(typeCode == '001001001'){ // 职员
                    this.columndatas = this.columndataConfig.officePerson
                    this.changeTable = true
                    if(obj.name){
                        let search = {name_like:obj.name}
                        args.search = search
                    }

                     apiProCenter.getUserinfoName(args).then((res)=>{
                        if(res.data.status == 200){
                            this.localData = res.data.result.rows
                            this.totalPages = res.data.result.total
                        }
                    })
                }else if(typeCode == '001001003'){ // 供应商
                    this.columndatas = this.columndataConfig.supShop   
                    this.changeTable = true
                     if(obj.name){
                        let search = {shopName_like:obj.name}
                        args.search = search
                    }
                     apiProCenter.getSupperShop(args).then((res)=>{
                        if(res.data.status == 200){
                            this.localData = res.data.result.rows
                            this.totalPages = res.data.result.total
                        }
                    })
                }else{
                      this.changeTable = false
                } 
               
               
            },
            //获取处理人信息
            getAssignee:function(){
                let selection = this.getSelectRows();
                if(selection.length>1 || selection.length == 0){
                    this.$message.error("请勾选单条信息进行操作");
                    return false
                }
                let assigneeId = selection[0].id.toString()
                let assigneeName = selection[0].name || selection[0].shopName
                let assigneeData = {id:assigneeId,name:assigneeName}
                this.$emit('get-assignee',assigneeData)
                this.$emit('close')
            }

        }
    }

</script>

<style lang="css" scoped>
</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
.deploy-dialog .el-dialog{
    width: 800px;
}
.el-select-dropdown__wrap {
    max-height: 185px !important;
}
.deploy-dialog .el-form-item__content {
    width: 200px;
}
.deploy-dialog .el-select {
    width: 100%;
}
</style>
