<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-toolbar
            ref="toolbarList"
            @ADD="addBtn"
            @EDIT="editBtn"
            @SAVE="saveBtn"
            @VIEW="viewBtn"
            @ENABLE="updateStatus(1)"
            @DISABLE="updateStatus(2)"
        >
        </t8t-toolbar>

        <t8t-table
            ref="t8tTable"
            :templateData="templateData"
            :columns="columns"
            :dataSource="dataSource"
            :commonData="commonData"
            :editable="true"
            :pageBar="false"
            @cell-click="handleFormItemBlur"
            @row-double-click="viewBtn"
            @selection-change="selectionChange"
            @cell-editor-change="onEditorChange"
            v-loading.body.lock="tableLoading"

        >
        </t8t-table>

        <div>
            <el-dialog class="order-select-dialog"
                       :title="title"
                       v-model="choseDialog"
                       v-loading.body.lock="dialogLoading"
                       element-loading-text="加载中">
                <div class="textarea-container">
                    <t8t-tree
                        ref="choseTree"
                        :data="treeData"
                        :props="treeProps"
                        :default-expanded-keys="selecteds"
                        :hideArrow="true"
                        :show-checkbox = "showTreeCheck"
                    >
                    </t8t-tree>
                </div>
                <div slot="footer" v-if="showBtn" class="choseBtn">
                    <el-button type="primary" @click="submitBtn">确认</el-button>
                    <el-button @click="closeChoseDialog">取消</el-button>
                </div>
            </el-dialog>


        </div>
    </div>
</template>

<script>
    import Cookie from 'js-cookie'
    import ComplaintApi from 'src/services/delivery/complaint.js'

    export default {
        name: 'page-order-config',
        components: {},
        data() {
            return {
                tableLoading:false,
                dealer: Cookie.get('t8t-tc-username'),
                breadcrumbData: [{
                    title: '交付'
                },
                    {
                        title: '交付基础配置'
                    },
                    {
                        title: '客服接单配置'
                    }
                ],
                //表格
                columns: [{
                    prop: 'id',
                    label: 'ID'
                }, {
                    prop: 'visitRoleCode',
                    label: '回访角色',
                    list: "roleOption",
                    editor: {
                        "type": "select",
                        "rules": [{
                            "required": true,
                            "message": "请选择回访角色"
                        }]
                    }
                }, {
                    prop: 'visitPersonId',
                    label: '回访人',
                    editor: {
                        "type": "select",
                        "list": "visitorList",
                        "rules": [{
                            "required": true,
                            "message": "请选择回访人"
                        }]
                    },
                    formatter:function(val,row) {
                        return row.visitPersonName
                    }
                }, {
                    prop: 'responseType',
                    label: '负责类型',
                    list: "responseTypeOption",
                    editor: {
                        "type": "select",
                        "rules": [{
                            "required": true,
                            "message": "请选择负责类型"
                        }]
                    }

                }, {
                    prop: 'status',
                    label: '状态',
                    list:'statusOption'
                }, {
                    prop: 'responseids',
                    label: '负责明细',
                    formatter:function(val,row){
                        let _list = ''
                        if(row.resDetailNameVOs && row.resDetailNameVOs.length > 0) {
                            _list = row.resDetailNameVOs.toString()
                        }
                        return _list
                    }
                },{
                    prop: 'detailList',
                    show:false
                }, {
                    prop: 'createName',
                    label: '创建人'
                }, {
                    prop: 'createTime',
                    label: '创建时间',
                    formatter: "dateParser"
                }, {
                    prop: 'updateName',
                    label: '修改人'
                }, {
                    prop: 'updateTime',
                    label: '修改时间',
                    formatter: "dateParser"
                }],
                commonData: {
                    responseTypeOption: [
                        {text:"城市", value:1},
                        {text:"组织", value:2}
                    ],
                    roleOption: [],
                    visitorList: [
                        {
                            text: 'tony.huang',
                            value: 1
                        }, {
                            text: 'tony.test',
                            value: 2
                        },
                    ],
                    visitorDetailList:[],
                    statusOption: [
                        {
                            text: '启用',
                            value: 1
                        },
                        {
                            text: '禁用',
                            value: 2
                        }
                    ]
                },
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                treeData: {},
                title: "",
                choseDialog: false,
                dialogLoading: false,
                showTreeCheck:false,
                templateData:{
                    id: null,
                    status: null,
                    responseType:null,
                    createName: null,
                    createTime: null,
                    updateName: null,
                    updateTime: null,
                    editAble: true,
                    responseids:[],
                    resDetailNameVOs:[]
                },
                selecteds:[],
                dataSource:[],
                organiseTree:{
                },
                cityTree:{
                    name:"中国",
                    id:0,
                    children: []
                },
                editRows:{},
                editColumn:{},
                tempSelect:[]
            }
        },

        //todo 获取角色类型、回访人
        created() {
            ComplaintApi.queryUnionParent({search:{pPropertyCode:42101},page:1,size:100}).then((res) => {
                if(res.data.status != 200) {
                    this.$message.error("角色信息获取失败！")
                    return
                }
                let _list = []
                res.data.result.forEach((item) => {
                    _list.push({text:item.propertyName,value:item.propertyCode})
                })
                this.commonData.roleOption = _list
            }).catch((error)=>{return})
            this.getOrderList()
            this.getTree()
        },
        methods: {
            getTree() {
                ComplaintApi.queryTreeByType({}).then(res=>{
                    if(res.data.status !== 200) {
                        this.$message.error("组织架构获取失败")
                        return
                    }
                    this.organiseTree = res.data.result
                }).catch(error=>{return})
                ComplaintApi.CityTreeGet({}).then(res=>{
                    if(res.data.status !== 200) {
                        this.$message.error("城市信息获取失败")
                        return
                    }
                    this.cityTree = res.data.result
                }).catch(error=>{return})
            },
            getOrderList() {
                ComplaintApi.customerOrderqueryList({}).then((res) => {
                    if (res.data.status != 200) {
                        this.$message.error("配置获取失败")
                        return
                    }
                    let _list = res.data.result || []
                    for(let i=0;i<_list.length;i++) {
                        if(!_list[i].responseids) _list[i].responseids = []
                        if(!_list[i].resDetailNameVOs) _list[i].resDetailNameVOs = []
                        _list[i].edited = false
                    }
                    this.dataSource = _list
                }).catch(() => {
                    return
                })
            },
            addBtn() {
                this.$refs['t8tTable'].addNewRow()
            },
            viewBtn(val) {
                let _self = this
                let row
                if(typeof(val) === 'object') {
                    row = val
                }else{
                    let selections = this.$refs['t8tTable'].getSelectRows();
                    if(selections.length > 0){
                        if(selections.length > 1) {
                            _self.$message.error("请选择单条操作单据后重试")
                            return false
                        }
                        row = selections[0]
                    }else{
                        _self.$message.error("请选择操作单据后重试")
                        return false
                    }
                }
                if(!row.id || row.editAble) return false
                let _typeName = row.responseType === 1 ? "城市" : "组织"
                _self.title = "负责" + _typeName
                //todo 读取勾选信息
                _self.selecteds = row.responseids
                _self.treeData = row.responseType === 1 ? this.cityTree : this.organiseTree
                _self.showBtn = false
                _self.showTreeCheck = true
                _self.choseDialog = true
                if(row.responseids) {
                    if(row.responseids.length > 0 && _self.$refs.choseTree) {
                        _self.$refs.choseTree.setCheckedKeys(_self.selecteds, true)
                    }
                }
            },
            editBtn() {
                let selections = this.$refs['t8tTable'].getSelectRows();
                    if(selections.length > 0){
                        if(selections.length > 1) {
                            this.$message.error("请选择单条操作单据后重试")
                            return false
                        }
                        let row = selections[0]
                        row.editAble = true

                    }else{
                        this.$message.error("请选择操作单据后重试")
                        return false
                    }
            },
            saveBtn() {
                let editRow = this.$refs.t8tTable.getActionLog(false,true)
                let rowError = false
                if(editRow.addedRows.length || editRow.editedRows.length) {
                    this.$refs['t8tTable'].validate((isValid) => {
                        if (isValid) {
                            let _req = {
                                customerOrders: []
                            }
                            let _submitRows = editRow.addedRows.concat(editRow.editedRows)
                            _submitRows.forEach((item) => {
                                let _ordersList = {}
                                let _byteLength = item.responseType === 1 ? 12 : 8
                                if(item.id){
                                    _ordersList = {
                                        "id":item.id,
                                        "updateBy": "freed.guo",
                                        "updateName": "freed.guo",
                                        "responseType": item.responseType,
                                        "status": item.status,
                                        "visitPersonId": item.visitPersonId,
                                        "visitRoleCode": item.visitRoleCode
                                    }
                                    if(item.edited) {
                                        _ordersList.responsibleDetailList = item.responseids
                                    }
                                }else{
                                    _ordersList = {
                                        "createBy": this.dealer,
                                        "createName": this.dealer,
                                        "responseType": item.responseType,
                                        "responsibleDetailList": item.responseids,
                                        "status": 1,
                                        "visitPersonId": item.visitPersonId,
                                        "visitRoleCode": item.visitRoleCode
                                    }
                                }
                                _req.customerOrders.push(_ordersList)
                                item.responseids.forEach(item => {
                                    if(item.toString().length > _byteLength) {
                                        rowError = true
                                    }
                                })

                            })
                            if(rowError) {
                                this.$message.error("提交数据异常，请变更后重试")
                                return
                            }
                            this.$refs['toolbarList'].disableBySymbol('SAVE')
                            ComplaintApi.customerOrdersave(_req).then(res => {
                                this.$refs['toolbarList'].unDisableBySymbol('SAVE')
                                if(res.data.status != 200) {
                                    this.$msgbox({
                                        title: '消息',
                                        message: res.data.message || "操作失败",
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                }
                                else{
                                    this.$msgbox({
                                        title: '消息',
                                        message: "操作成功",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    this.getTableData()
                                }
                            }).catch(error=>{console.log(error)})
                        }
                    })
                } else {
                    this.$message.error("表格没有变动，不可保存")
                    return false
                }
            },
            //表格
            getTableData() {
                this.getOrderList()
                this.$refs['t8tTable'].reloadTable()
            },
            onEditorChange(cell, val, config, status) {
                //角色改变时清空回访人
                if(config.prop === "visitRoleCode") {
                    cell.row.visitPersonId = null
                    this.commonData.visitorList = []
                }
                //回写回访人
                if(config.prop === 'visitPersonId') {
                    let _name
                    for(let i=0;i<this.commonData.visitorList.length;i++) {
                        if(this.commonData.visitorList[i].value == val) {
                            _name = this.commonData.visitorList[i].text
                        }
                    }
                    cell.row.visitPersonName = _name
                }
                //类型变更时清空负责明细
                if(config.prop === 'responseType') {
                    cell.row.responseids = []
                    cell.row.resDetailNameVOs = []
                }
            },
            handleFormItemBlur(row, column, cell, event) {
                let _this = this
                if (!row.editAble) {
                    _this.$refs.t8tTable.handleFormItemBlur()
                    return false
                }
                _this.editRows = row
                _this.editColumn = column
                if(column.property === "visitPersonId") {
                    if(!row.visitRoleCode) {
                        _this.$message.error("请选择回访角色")
                        _this.$refs.t8tTable.handleFormItemBlur()
                        return
                    }
                    let _arg = {"assignCode":row.visitRoleCode}
                    if(this.tempSelect[row.visitRoleCode] && this.tempSelect[row.visitRoleCode].length >0) {
                        this.commonData.visitorList = this.tempSelect[row.visitRoleCode]
                    }
                    else {
                        _this.tableLoading = true
                        ComplaintApi.complaintsOrderAssignType(_arg).then(res => {
                            _this.tableLoading = false
                            if(res.data.status != 200 || res.data.result.length < 1) {
                                this.$message.error("回访人获取失败")
                                return
                            }
                            let _list = []
                            res.data.result.forEach((item => {
                                _list.push({text:item.name,value:item.id})
                            }))
                            this.tempSelect[row.visitRoleCode] = _list
                            this.commonData.visitorList = _list
                        }).catch(error => {
                            console.log(error)
                        })
                    }
                }
                if(column.property === "responseids") {
                    this.title = ""
                    this.showBtn = false
                    this.showTreeCheck = false
                    this.selecteds = []
                    if(row.responseType) {
                        let _typeName = row.responseType === 1 ? "城市" : "组织"
                        this.title = "负责" + _typeName
                        this.treeData = row.responseType === 1 ? this.cityTree : this.organiseTree
                        this.showBtn = true
                        this.showTreeCheck = true
                    }else{
                        this.$message.error("请选择负责类型")
                        return false
                    }
                    this.choseDialog = true

                    //todo 读取勾选信息
                    this.selecteds = row.responseids
                    if(row.responseids && row.responseids.length > 0 && this.$refs.choseTree) {
                        this.$refs.choseTree.setCheckedKeys(this.selecteds)
                    }
                }
            },
            closeChoseDialog() {
                this.treeData = {}
                this.selecteds = []
                this.choseDialog = false
            },
            submitBtn() {
                //todo submit tree
                let selectTree = this.$refs.choseTree.getCheckedNodes(true)
                let _list = []
                let _idList = []

                if(selectTree.length > 0) {
                    selectTree.forEach(item => {
                        _list.push(item.name)
                        _idList.push(item.id)
                    })
                }
                if(this.editRows.resDetailNameVOs) {
                    if(this.editRows.responseids.sort().toString() != _idList.sort().toString()) {
                        this.editRows.edited = true
                    }
                }else {
                    this.editRows.edited = true
                }
                this.editRows.resDetailNameVOs = _list
                this.editRows.responseids = _idList
                let _index = this.$refs.t8tTable.editedRows.indexOf(this.editRows)
                if(_index === -1) {
                    if(this.$refs.t8tTable.addedRows.indexOf(this.editRows) === -1)
                        this.$refs.t8tTable.editedRows.push(this.editRows)
                }else{
                    this.$refs.t8tTable.editedRows[_index] = this.editRows
                }
                this.closeChoseDialog()
            },
            updateStatus(status) {
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length > 0) {
                    let _selectList = []
                    let _args = {}
                    selections.forEach((item) => {
                        _selectList.push(item.id)
                    })
                    _args = {
                        "ids":_selectList,
                        "status": status,
                        "updateBy": this.dealer,
                        "updateName":this.dealer
                    }
                    status === 1 ? this.$refs['toolbarList'].disableBySymbol('ENABLE') : this.$refs['toolbarList'].disableBySymbol('DISABLE')
                    ComplaintApi.customerOrderstatusUpdate(_args).then(res => {
                        status === 1 ? this.$refs['toolbarList'].unDisableBySymbol('ENABLE') : this.$refs['toolbarList'].unDisableBySymbol('DISABLE')
                            if(res.data.status != 200) {
                                this.$msgbox({
                                    title: '消息',
                                    message: res.data.message || "操作失败",
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                return
                            }
                            else{
                                this.$msgbox({
                                    title: '消息',
                                    message: "操作成功",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.getTableData()
                            }
                        }
                    ).catch(error => {
                        return
                    })
                } else {
                    this.$message.error("请选择单条配置后重试")
                    return
                }
            },
            //rowsChange
            selectionChange (rows){
                let viewStatus = false,editStatus = false,enableStatus= false,disableStatus = false
                if( rows && rows.length > 0){
                    enableStatus= true
                    disableStatus = true
                    if(rows.length === 1) {
                        viewStatus = true
                        editStatus = true
                    }
                }else{
                    viewStatus = editStatus = enableStatus= disableStatus = true
                }
                viewStatus ? this.$refs['toolbarList'].unDisableBySymbol('VIEW') : this.$refs['toolbarList'].disableBySymbol('VIEW')
                editStatus ? this.$refs['toolbarList'].unDisableBySymbol('EDIT') : this.$refs['toolbarList'].disableBySymbol('EDIT')
                enableStatus ? this.$refs['toolbarList'].unDisableBySymbol('ENABLE') : this.$refs['toolbarList'].disableBySymbol('ENABLE')
                disableStatus ? this.$refs['toolbarList'].unDisableBySymbol('DISABLE') : this.$refs['toolbarList'].disableBySymbol('DISABLE')
            }
        }
    }

</script>

<style lang="css" scoped>
    .order-select-dialog .el-dialog--small{
        height: 500px !important;
    }
    .order-select-dialog .el-dialog--small .el-dialog__body .textarea-container .t8t-tree-container {
        width: 100%;
        height: 330px;
    }

</style>

<style>
</style>
