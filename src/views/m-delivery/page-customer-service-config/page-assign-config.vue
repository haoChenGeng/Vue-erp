<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-toolbar
            @ADD="addBtn"
            @EDIT="editBtn"
            @VIEW="viewBtn"
            @ENABLE="updateStatus(1)"
            @DISABLE="updateStatus(2)"
            ref="toolbarList"
        >
        </t8t-toolbar>

        <t8t-table
            :columns="columns"
            @row-double-click="viewBtn"
            :dataSource="dataSource"
            :commonData="commonData"
            :pageBar="false"
            ref="t8tTable"
            :service="service"
            :args="args"
            :method="method"
            @selection-change="selectionChange"
        >
        </t8t-table>

        <div>
            <el-dialog class="order-create-dialog"
                       :title="title"
                       v-model="createDialog"
                       v-loading.body.lock="dialogLoading"
                       element-loading-text="加载中"
                       @close="closeCreateDialog"
            >
                <div class="textarea-container">
                    <el-form :label-position="right" :model="formData" :rules="rules" label-width="120px"
                             ref="createForm">
                        <el-form-item label="回访角色：" prop="visitRoleCode">
                            <el-select v-model="formData.visitRoleCode" placeholder="--请选择--" :disabled="disabled">
                                <el-option v-for="item in commonData.roleOption" :label="item.text" :value="item.value" :disabled="item.disabled || false">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="规则表达式：" prop="formulaId" label-width="120px">
                            <el-select v-model="formData.formulaId" placeholder="--请选择--" :disabled="disabled">
                                <el-option v-for="item in commonData.formulaOption" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" v-if="showBtn" class="createBtn">

                    <el-button type="primary" @click="submitBtn" v-if="editType!='view'" :loading="submitLoading" :disabled="submitDisabled">确认</el-button>
                    <el-button @click="closeCreateDialog" v-if="editType!='view'">取消</el-button>
                    <el-button @click="closeCreateDialog" v-if="editType==='view'">关闭</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Cookie from 'js-cookie'
    import ComplaintApi from 'src/services/delivery/complaint.js'
    import Service from 'src/services/delivery/Service.js'

    export default {
        name: 'page-order-config',
        components: {},
        data() {
            return {
                submitLoading:false,
                submitDisabled:false,
                dataSource: [],
                breadcrumbData: [{
                    title: '交付'
                },
                    {
                        title: '交付基础配置'
                    },
                    {
                        title: '客服分配配置'
                    }
                ],
                //表格
                columns: [{
                    prop: 'id',
                    label: 'ID'
                }, {
                    prop: 'visitRoleCode',
                    label: '回访角色',
                    formatter:function(v,r) {
                        return r.visitRoleName
                    }
                }, {
                    prop: 'status',
                    label: '状态',
                    list: "statusOption"
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
                    formulaOption: [],
                    chargeTypeOption: [
                        {text: "城市", value: 1},
                        {text: "组织", value: 2}
                    ],
                    roleOption: [],
                    statusOption: [
                        {
                            text: '禁用',
                            value: 2
                        }, {
                            text: '启用',
                            value: 1
                        },
                    ]
                },

                dialogLoading: false,
                createDialog: false,
                title: null,
                formData: {
                    visitRoleCode: null,
                    formulaId: null
                },
                showBtn: true,
                disabled: true,
                rules: {
                    visitRoleCode: [
                        {required: true, message: '请选择回访角色'},
                    ],
                    formulaId: [
                        {required: true, message: '请选择规则表达式'}
                    ],
                },
                dealer: Cookie.get('t8t-tc-username'),
                editType:'',
                service: '',
                method: '',
                args: {
                    search: {},
                    size: 20,
                    page: 1
                },
                selectedList:[]

        }
        },
        created() {
            let _self = this
            this.getFormula()
            this.getConfigList( () => {
                ComplaintApi.queryUnionParent({search: {pPropertyCode: 42101}, page: 1, size: 100}).then((res) => {
                    if (res.data.status != 200) {
                        this.$message.error("角色信息获取失败！")
                        return
                    }
                    let _list = []
                    res.data.result.forEach((item) => {
                            _list.push({text: item.propertyName, value: item.propertyCode})
                    })
                    this.commonData.roleOption = _list
                    this.setSelected()
                }).catch((error) => {
                    return
                })
            })

        },
        methods: {
            setSelected() {
                let _list = []
                let properties = this.commonData.roleOption
                let _selectedList = []
                this.dataSource.forEach(item => {
                    _selectedList.push(item.visitRoleCode)
                })
                properties.forEach((item) => {
                    if(_selectedList.indexOf(item.value) >-1) {
                        _list.push({text: item.text, value: item.value, disabled:true})
                    }else{
                        _list.push({text: item.text, value: item.value})
                    }

                })
                this.commonData.roleOption = _list
                this.selectedList = _selectedList
            },
            getFormula() {
                //todo 条件
                ComplaintApi.accountsConfigQueryFormula({page:1,size:100}).then( res => {
                        if (res.data.status != 200 ) {
                            this.$message.error("公式获取失败")
                            return
                        }
                        let _list = []
                        res.data.result.rows.forEach(item => {
                            _list.push({
                                text:item.formulaName,
                                value:item.id
                            })
                        })
                    this.$nextTick(()=>{
                        this.commonData.formulaOption = _list
                    })

                    }
                ).catch(error=>{
                    return
                })

            },
            getConfigList(callback) {
                ComplaintApi.customerDistributionQueryList({}).then((res) => {
                    if (res.data.status != 200) {
                        this.$message.error("配置获取失败")
                        return
                    }
                    this.dataSource = res.data.result
                    this.getTableData()
                    callback()
                }).catch(() => {
                    return
                })
            },
            addBtn() {
                this.formData = {
                    visitRoleCode: null,
                    formulaId: null
                }
                this.disabled = false
                this.createDialog = true
                this.title = "新增客服分配配置"
                this.editType = 'add'
            },
            viewBtn(val) {
                if (typeof (val) === 'object') {
                    this.formData = {
                        visitRoleCode: val.visitRoleCode,
                        formulaId: val.formulaId
                    }
                    this.disabled = true
                    this.title = "查看客服分配配置"
                    this.createDialog = true
                    this.editType = 'view'
                    return
                }
                this.formData = {}
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条配置后重试")
                        return
                    }
                    this.formData = {
                        visitRoleCode: selections[0].visitRoleCode,
                        formulaId: selections[0].formulaId
                    }
                    this.disabled = true
                    this.title = "查看客服分配配置"
                    this.createDialog = true
                } else {
                    this.$message.error("请选择单条配置后重试")
                    return
                }
            },
            editBtn() {
                this.formData = {}
                let selections = this.$refs['t8tTable'].getSelectRows();
                let _selected = this.commonData.roleOption
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条配置后重试")
                        return
                    }
                    this.formData = {
                        visitRoleCode: selections[0].visitRoleCode,
                        formulaId: selections[0].formulaId
                    }
                    this.selectedList.splice(this.selectedList.indexOf(selections[0].visitRoleCode),1)
                    for(let i=0;i<_selected.length;i++) {
                        if(_selected[i].value == selections[0].visitRoleCode) _selected[i].disabled = false
                    }
                    this.disabled = false
                    this.title = "编辑客服分配配置"
                    this.createDialog = true
                    this.editType = 'edit'
                } else {
                    this.$message.error("请选择单条配置后重试")
                    return
                }

            },
            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()

            },
            closeCreateDialog() {
                this.setSelected()
                this.createDialog = false
            },
            submitBtn() {
                let _self = this
                if (_self.$refs['createForm'].validate((valid) => {
                        if (valid) {
                            let _args = {}
                            if (this.editType === 'add') {
                                if(this.selectedList.indexOf(this.formData.visitRoleCode) > -1) {
                                    this.$message.error("回访角色重复，请变更后提交")
                                    return
                                }
                                _args = {
                                    "customerDistribution":
                                        {
                                        "visitRoleCode": this.formData.visitRoleCode,
                                        "formulaId": this.formData.formulaId,
                                        "status": 1,
                                        "createBy": this.dealer,
                                        "createName": this.dealer
                                        }
                                }
                                this.submitLoading = true
                                this.submitDisabled = true
                                ComplaintApi.customerDistributionCreate(_args).then((res) => {
                                    this.submitLoading = false
                                    this.submitDisabled = false
                                    if (res.data.status == 200) {
                                        _self.$msgbox({
                                            title: '消息',
                                            message: "操作成功",
                                            type: 'success',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain',
                                            callback: function () {
                                                _self.getConfigList(_self.setSelected())
                                                _self.closeCreateDialog()
                                            }

                                        })
                                    } else {
                                        _self.$msgbox({
                                            title: '消息',
                                            message: res.data.message || "操作失败",
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                        return
                                    }
                                }).catch((error) => {
                                    this.submitLoading = false
                                    this.submitDisabled = false
                                    return
                                })
                            } else if (this.editType === 'edit') {
                                let selections = this.$refs['t8tTable'].getSelectRows();
                                if(this.selectedList.indexOf(this.formData.visitRoleCode) > -1) {
                                    this.$message.error("回访角色重复，请变更后提交")
                                    return
                                }
                                _args = {
                                    customerDistribution: {
                                        "visitRoleCode": this.formData.visitRoleCode,
                                        "formulaId": this.formData.formulaId,
                                        "id": selections[0].id,
                                        "updateName": this.dealer,
                                        "updateBy": this.dealer
                                    }
                                }
                                ComplaintApi.customerDistributionUpdate(_args).then((res) => {
                                    if (res.data.status == 200) {
                                        _self.$msgbox({
                                            title: '消息',
                                            message: "操作成功",
                                            type: 'success',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain',
                                            callback: function () {
                                                _self.closeCreateDialog()
                                                _self.getConfigList(_self.setSelected())
                                            }
                                        })
                                    } else {
                                        _self.$msgbox({
                                            title: '消息',
                                            message: res.data.message || "操作失败",
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                        return
                                    }
                                }).catch((error) => {
                                    return
                                })
                            }
                        }
                    }));
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
                    ComplaintApi.customerDistributionStatusUpdate(_args).then(res => {
                        status === 1 ? this.$refs['toolbarList'].unDisableBySymbol('ENABLE') : this.$refs['toolbarList'].unDisableBySymbol('DISABLE')
                        if(res.data.status != 200) {
                            this.$msgbox({
                                title: '消息',
                                message: res.data.message || "启用失败",
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
                            this.closeCreateDialog()
                            this.getConfigList(this.setSelected())
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
    .order-create-dialog .el-dialog--small {
        height: 500px !important;
    }

    /*.order-create-dialog .el-form-item__label{*/
    /*width:130px !important;*/
    /*}*/
</style>

<style>
</style>
