<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <div class="g-main-container">
            <div class="dialog-tabs-left">
                <t8t-tree
                    :data="treeData"
                    :props="treeProps"
                    @node-click="treeClick"
                    :default-expanded-keys="[0]"
                    v-loading.body.lock="tabLoading"
                >
                </t8t-tree>
            </div>
            <div class="g-main-container-column">
                <t8t-toolbar
                    ref="toolbarList"
                    @ADD="addBtn"
                    @EDIT="editBtn"
                    @VIEW="viewBtn"
                    @ENABLE="updateStatus(1)"
                    @DISABLE="updateStatus(2)"
                >
                </t8t-toolbar>
                <t8t-table
                    :columns="columns"
                    @row-double-click="viewBtn"
                    :commonData="commonData"
                    ref="t8tTable"
                    :service="service"
                    :args="args"
                    :method="method"
                    @selection-change="selectionChange"
                >
                </t8t-table>
            </div>
        </div>

        <div>
            <el-dialog class="order-create-dialog"
                       :title="title"
                       v-model="createDialog"
                       v-loading.body.lock="dialogLoading"
                       element-loading-text="加载中"
                       @close="closeCreateDialog"
            >
                <div class="textarea-container">
                    <el-form :label-position="right" :model="formData" :rules="rules" label-width="100px"
                             ref="createForm">
                        <el-form-item label="产品包：" prop="productPkgId" label-width="120px">
                            <el-select v-model="formData.productPkgId" placeholder="--请选择--" :disabled="disabled">
                                <el-option v-for="item in commonData.productPkgOption" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="提升等级：" prop="levelId" label-width="120px">
                            <el-select v-model="formData.levelId" placeholder="--请选择--" :disabled="disabled">
                                <el-option v-for="item in commonData.levelOption" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="规则表达式：" prop="expressionId" label-width="120px">
                            <el-select v-model="formData.expressionId" placeholder="--请选择--" :disabled="disabled">
                                <el-option v-for="item in commonData.expressionOption" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" v-if="showBtn" class="createBtn">
                    <el-button type="primary" @click="submitBtn" :loading="submitLoading" :disabled="submitDisabled">确认</el-button>
                    <el-button @click="closeCreateDialog">取消</el-button>
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
                dealer: Cookie.get('t8t-tc-username'),
                breadcrumbData: [
                    {
                        title: '交付'
                    }, {
                        title: '交付基础配置'
                    },
                    {
                        title: '投诉升级配置'
                    }
                ],
                //表格
                columns: [{
                    prop: 'id',
                    label: 'ID'
                }, {
                    prop: 'productPkgId',
                    label: '产品包',
                    list: "productPkgOption"
                }, {
                    prop: 'levelId',
                    label: '提升等级',
                    formatter: function (v, r) {
                        return r.levelName
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
                    chargeTypeOption: [
                        {text: "城市", value: 1},
                        {text: "组织", value: 2}
                    ],
                    levelOption: [],
                    statusOption: [
                        {
                            text: '禁用',
                            value: 2
                        }, {
                            text: '启用',
                            value: 1
                        },
                    ],
                    expressionOption: [],
                    productPkgOption: [],
                },
                dialogLoading: false,
                createDialog: false,
                title: null,
                formData: {
                    productPkgId: null,
                    levelId: null,
                    expressionId: null
                },
                rules: {
                    productPkgId: [
                        {required: true, message: '请选择产品包'},
                    ],
                    levelId: [
                        {required: true, message: '请选择等级'}
                    ],
                    expressionId: [
                        {required: true, message: '请选择规则表达式'}
                    ],
                },

                showBtn: true,
                treeProps: {
                    label: 'pkgName',
                    children: 'children'
                },
                treeData: [],
                disabled: true,
                service: Service.COMPLAINT.name,
                method: Service.COMPLAINT.methods.COMPLAINTUPGRADEQUERYPAGE,
                args: {
                    size: 20,
                    page: 1
                },
                editType: null,
            }
        },
        created() {
            this.getConfigList()
            this.getPkg()
            this.getFormula()

        },
        methods: {
            getConfigList() {
                ComplaintApi.queryUnionParent({search: {pPropertyCode: 41301}, page: 1, size: 100}).then((res) => {
                    if (res.data.status != 200) {
                        this.$message.error("配置等级失败")
                        return
                    }
                    let _list = []
                    res.data.result.forEach((item) => {
                        _list.push({text: item.propertyName, value: item.id})
                    })
                    this.commonData.levelOption = _list
                }).catch(() => {
                    return
                })
            },
            getPkg() {
                ComplaintApi.productPackageQueryPage({page: 1, size: 100}).then((res) => {
                    if (res.data.status != 200) {
                        this.$message.error("产品包获取失败")
                        return
                    }
                    let _list = []
                    res.data.result.rows.forEach((item) => {
                        _list.push({text: item.pkgName, value: item.id})
                    })
                    this.commonData.productPkgOption = _list
                    this.treeData = [{
                        id: 0,
                        pkgName: "产品包",
                        children: res.data.result.rows
                    }]
                }).catch(() => {
                    return
                })
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
                    this.commonData.expressionOption = _list
                    }

                ).catch(error=>{
                    return
                })

            },
            treeClick(val) {
                if (val.id) {
                    this.args = {search: {productPackageId: val.id}}
                    this.$refs['t8tTable'].reloadTable()

                }else {
                    this.args = {
                        size: 20,
                        page: 1}
                }
            },
            addBtn() {
                this.formData= {
                    productPkgId: null,
                    levelId: null,
                    expressionId: null
                }
                this.editType = 'add'
                this.disabled = false
                this.createDialog = true
                this.title = "新增客服升级配置"

            },

            viewBtn(val) {
                if (typeof (val) === 'object') {
                    this.formData = {
                        productPkgId: val.productPkgId,
                        levelId: val.levelId,
                        expressionId: val.expressionId
                    }
                    this.disabled = true
                    this.title = "查看客服升级配置"
                    this.createDialog = true
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
                        productPkgId: selections[0].productPkgId,
                        levelId: selections[0].levelId,
                        expressionId: selections[0].expressionId
                    }
                    this.disabled = true
                    this.title = "查看客服升级配置"
                    this.createDialog = true
                } else {
                    this.$message.error("请选择单条配置后重试")
                    return
                }
            },
            editBtn() {
                this.editType = "edit"
                this.formData = {}
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条配置后重试")
                        return
                    }
                    this.formData = {
                        productPkgId: selections[0].productPkgId,
                        levelId: selections[0].levelId,
                        expressionId: selections[0].expressionId
                    }
                    this.disabled = false
                    this.title = "编辑客服升级配置"
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
                this.createDialog = false
            },
            submitBtn() {
                let _args = {}
                let _self = this
                this.$refs['createForm'].validate(isValid => {
                    if(isValid) {
                        if (this.editType === 'add') {
                            _args = {
                                "complaintUpgrade": {
                                    "productPackageId": this.formData.productPkgId,
                                    "levelId": this.formData.levelId,
                                    "expressionId": this.formData.expressionId,
                                    "status": 1,
                                    "createBy": this.dealer,
                                    "createName": this.dealer
                                }
                            }
                            _self.submitLoading = true
                            _self.submitDisabled = true
                            ComplaintApi.complaintUpgradeCreate(_args).then((res) => {
                                _self.submitLoading = false
                                _self.submitDisabled = false
                                if (res.data.status == 200) {
                                    _self.$msgbox({
                                        title: '消息',
                                        message: "操作成功",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain',
                                        callback: function () {
                                            _self.$refs['t8tTable'].reloadTable()
                                            _self.createDialog = false
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
                                _self.submitLoading = false
                                _self.submitDisabled = false
                                return
                            })
                        } else if (this.editType === 'edit') {
                            this.$refs['t8tTable'].validate((isValid) => {
                                if (isValid) {
                                    let selections = this.$refs['t8tTable'].getSelectRows();
                                    _args = {
                                        complaintUpgrade: {
                                            "updateName": this.dealer,
                                            "productPackageId": this.formData.productPkgId,
                                            "expressionId": this.formData.expressionId,
                                            "id": selections[0].id,
                                            "updateBy": this.dealer,
                                            "levelId": this.formData.levelId
                                        }
                                    }
                                    ComplaintApi.complaintUpgradeUpdate(_args).then((res) => {
                                        if (res.data.status == 200) {
                                            _self.$msgbox({
                                                title: '消息',
                                                message: "操作成功",
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain',
                                                callback: function () {
                                                    _self.$refs['t8tTable'].reloadTable()
                                                    _self.createDialog = false
                                                }
                                            })
                                        } else {
                                            _self.$msgbox({
                                                title: '消息',
                                                message:  res.data.message || "操作失败",
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
                            })
                        }
                    }
                })
            },
            updateStatus(status) {
                let _self = this
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length > 0) {
                    let _selectList = []
                    let _args = {}
                    selections.forEach((item) => {
                        _selectList.push(item.id)
                    })
                    _args = {
                        "ids": _selectList,
                        "status": status,
                        "updateBy": this.dealer,
                        "updateName": this.dealer
                    }
                    status === 1 ? this.$refs['toolbarList'].disableBySymbol('ENABLE') :this.$refs['toolbarList'].disableBySymbol('DISABLE')
                    ComplaintApi.complaintUpgradeStatusUpdate(_args).then(res => {
                        status === 1 ? this.$refs['toolbarList'].unDisableBySymbol('ENABLE') : this.$refs['toolbarList'].unDisableBySymbol('DISABLE')
                        if (res.data.status != 200) {
                            _self.$msgbox({
                                title: '消息',
                                message:  res.data.message || "操作失败",
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            return
                        }
                        _self.$msgbox({
                            title: '消息',
                            message: "操作成功",
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain',
                            callback: function () {
                                _self.$refs['t8tTable'].reloadTable()
                            }
                        })
                    }).catch(error => {
                        status === 1 ? this.$refs['toolbarList'].unDisableBySymbol('ENABLE') : this.$refs['toolbarList'].unDisableBySymbol('DISABLE')
                        return
                    })
                } else {
                    this.$message.error("请选择需要操作的配置")
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

<style
    lang="css"
    scoped
>
    .dialog-tabs-left {
        display: flex;
    }

    .textarea-container {
        text-align: center;
    }

    .dialog-tabs-left .el-tabs {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .dialog-tabs-left .el-tabs__header {
        margin-bottom: 0;
        margin-left: 10px;
        border-bottom: none;
        border-right: 1px solid #dfe6ec;
    }

    .dialog-tabs-left .el-tabs__item {
        height: 51px;
        line-height: 51px;
    }

    .dialog-tabs-left .el-tabs__content {
        display: flex;
        flex: 1;
    }

    .dialog-tabs-left .el-tab-pane {
        display: flex;
    }

    .dialog-tabs-left .t8t-tree-container {
        border: none;
        border-top: 1px solid #dfe6ec;
    }
</style>
<style lang="css">
</style>
