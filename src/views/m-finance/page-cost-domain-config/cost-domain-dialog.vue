<template>
    <!-- 新增 -->
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog dialog-new">
        <div class="t8t-full-dialog-container">
            <!-- 顶部按钮区 -->
            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                    <t8t-toolbar
                        class="t8t-dark"
                        @EDIT-SUBMIT="submitForm"
                    >
                    </t8t-toolbar>
                </div>
            </div>
            <!-- 表单区 -->
            <div class="full-dialog-form-container container-center">
                <el-form :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                    <div class="form-item-container">
                        <el-form-item label="成本域编码：" prop="code">
                            <el-input v-model="formData.code" :disabled="editType==='view'"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="状态：">
                            <el-select v-model="formData.status" :disabled="editType==='view'" placeholder="--请选择--">
                                <el-option label="启用" value="1">
                                </el-option>
                                <el-option label="停用" value="0">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="成本域名称：" prop="name">
                            <el-input v-model="formData.name" :disabled="editType==='view'"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="备注：">
                            <el-input v-model="formData.remark" :disabled="editType==='view'"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="创建人：" v-if="editType==='view'||editType==='edit'">
                            <el-input v-model="formData.createUserName"
                                      :disabled="editType==='view'||editType==='edit'"></el-input>
                        </el-form-item>

                    </div>
                    <div class="form-item-container">
                        <el-form-item label="创建时间：" v-if="editType==='view'||editType==='edit'">
                            <el-input :value="formData.createTime | toDate" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="修改人：" v-if="editType==='view'||editType==='edit'">
                            <el-input v-model="formData.updateUserName"
                                      :disabled="editType==='view'||editType==='edit'"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="修改时间：" v-if="editType==='view'||editType==='edit'">
                            <el-input :value="formData.updateTime | toDate" disabled></el-input>
                        </el-form-item>
                    </div>

                </el-form>
            </div>
            <!-- 组织架构 -->
            <div class="my-tree">
                <t8t-tree
                    ref="my-tree"
                    :data="treeData"
                    :props="treeProps"
                    :show-checkbox="editType==='add'||editType==='edit'"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-checked-keys="defaultCheckedKeys"
                >
                </t8t-tree>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import Cookie from 'js-cookie'
    import Service from 'src/services/finance/Service.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import apiInventoryAccounting from 'src/services/finance/costDomainConfig.js'
    import apiOrg from 'src/services/system/organization.js'

    let editType
    let id
    export default {
        name: 'cost-domain-dialog',
        data() {
            return {
                formRule: {
                    code: [
                        {
                            type: "string",
                            required: true,
                            message: "请输入成本域编码",
                            trigger: 'change'
                        },
                        {
                            max: 50,
                            message: '成本域编码最大不超过50个字符',
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            type: "string",
                            required: true,
                            message: "请输入成本域名称",
                            trigger: 'change'
                        },
                        {
                            max: 50,
                            message: '成本域名称最大不超过50个字符',
                            trigger: 'blur'
                        }
                    ]
                },
                editType: editType,
                id: id,
                defaultExpandedKeys: [],
                defaultCheckedKeys: [],
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children',
                    disabled: 'isDel'
                },
                activeTabName: 'one',
                isDialogShow: true,
                isLoading: false,

                //表单
                formData: {
                    id: id,
                    code: null,
                    name: null,
                    remark: null,
                    organizationIds: null,
                    status: "1",
                    createTime: null,
                    createUser: parseInt(Cookie.get('t8t-tc-uid')),
                    createUserName: null,
                    updateTime: null,
                    updateUser: null,
                    updateUserName: null,
                }
            }
        },
        beforeCreate() {
            editType = this.$route.query.editType
            id = this.$route.query.id
        },
        created() {
            this.initTree()
            this.getFormDataByEditType()
            this.setRules()
        },
        methods: {
            setRules(){
                if (editType == 'add') {
                    this.formRule.code.push({
                        validator: this.checkUnique,
                        trigger: 'blur'
                    }),
                        this.formRule.name.push({
                            validator: this.checkUnique,
                            trigger: 'blur'
                        })
                }
                else if (editType == 'edit') {
                    this.formRule.code.push({
                        validator: this.checkUnique,
                        trigger: 'blur'
                    }),
                        this.formRule.name.push({
                            validator: this.checkUnique,
                            trigger: 'blur'
                        })
                }
            },
            // 校验重复
            checkUnique(rule, value, callback) {
                if (value == null) {
                    return callback()
                }

                let field = rule.field
                let args = {
                    page: 1,
                    size: 10,
                    search: {}
                }

                if (editType == 'add') {
                    switch (field) {
                        case 'code':
                            args.search.code = value
                            apiInventoryAccounting.queryPage(args)
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        if (res.data.result.rows.length > 0) {
                                            return callback(new Error('编码已存在'))
                                        } else {
                                            return callback()
                                        }
                                    } else {
                                        return callback()
                                    }
                                })
                            break
                        case 'name' :
                            args.search.name = value
                            apiInventoryAccounting.queryPage(args)
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        if (res.data.result.rows.length > 0) {
                                            return callback(new Error('名称已存在'))
                                        } else {
                                            return callback()
                                        }
                                    } else {
                                        return callback()
                                    }
                                })
                            break
                        default:
                            return callback()
                            break
                    }
                }
                else {
                    var originCode;
                    var originName;
                    let originArgs = {
                        id: id
                    }

                    apiInventoryAccounting.findById(originArgs)
                        .then((res) => {
                            if (res.data.status === 200) {
                                originName = res.data.result.name
                                originCode = res.data.result.code

                                switch (field) {
                                    case 'code':
                                        if (value == originCode) {
                                            return callback()
                                        }
                                        else {
                                            args.search.code = value
                                            apiInventoryAccounting.queryPage(args)
                                                .then((res) => {
                                                    if (res.data.status === 200) {
                                                        if (res.data.result.rows.length > 0) {
                                                            return callback(new Error('编码已存在'))
                                                        } else {
                                                            return callback()
                                                        }
                                                    } else {
                                                        return callback()
                                                    }
                                                })
                                        }

                                        break
                                    case 'name' :
                                        if (value == originName) {
                                            return callback()
                                        }
                                        else {
                                            args.search.name = value
                                            apiInventoryAccounting.queryPage(args)
                                                .then((res) => {
                                                    if (res.data.status === 200) {
                                                        if (res.data.result.rows.length > 0) {
                                                            return callback(new Error('名称已存在'))
                                                        } else {
                                                            return callback()
                                                        }
                                                    } else {
                                                        return callback()
                                                    }
                                                })
                                        }
                                        break
                                    default:
                                        return callback()
                                        break
                                }
                            }
                        })
                }

            },
            closeDialog(){
                this.$router.push({path: '/tochat-finance/page-cost-domain-config'})
            },
            getFormDataByEditType()
            {
                if (this.editType !== 'add') {
                    this.getFormData(this.id)
                }
            },
            getFormData(rowId) {
                let args = {
                    id: rowId
                }

                apiInventoryAccounting.findById(args)
                    .then((res) => {
                        if (res.data.status === 200) {
                            this.formData = res.data.result
                            this.formData.status = '' + res.data.result.status
                            var bankIdsArr = res.data.result.organizationIds.split(',')

                            //将字符串数组转为整型数组
                            var bankIdsIntList = []
                            bankIdsArr.forEach((item) => {
                                var reaIltem = item.substr(1, item.length - 2)
                                bankIdsIntList.push(+reaIltem)
                            })
                            this.$refs['my-tree'].setCheckedKeys(bankIdsIntList)

                            setTimeout(() => {
                                this.defaultExpandedKeys = bankIdsIntList
                            }, 1000)
                        }
                    })
            },
            initTree() {
                let args = {
                    typeCodes: ['001003009', '001003013'],
                    functionCodes: ['001004014', '001004013']
                }
                apiOrg.queryTreeByTypeAndFunction(args)
                    .then((res) => {
                        this.treeData = res.data.result
                    })
            },
            submitForm() {
                this.$refs['formRef'].validate(valid => {
                    if (valid) {
                        this.isLoading = true

                        let organizationIdsStr = ''
                        this.$refs["my-tree"].getCheckedKeys(false).forEach((item) => {
                                organizationIdsStr += '|'
                                organizationIdsStr += item
                                organizationIdsStr += '|'
                                organizationIdsStr += ','
                            }
                        )
                        if (organizationIdsStr === '') {
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '没有勾选组织',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        }
                        else {
                            this.formData.organizationIds = organizationIdsStr.substr(0, organizationIdsStr.length - 1)

                            this.formData.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                            let args = {
                                costDomainConfig: this.formData
                            }

                            if (editType === 'add') {
                                apiInventoryAccounting.create(args)
                                    .then((res) => {
                                        if (res.data.status === 200) {
                                            // 新增成功
                                            this.$msgbox({
                                                title: '消息',
                                                type: 'success',
                                                message: '新增成功',
                                                showCancelButton: false,
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            })
                                            this.isLoading = false
                                            this.closeDialog()
                                        } else {
                                            this.$msgbox({
                                                title: '消息',
                                                type: 'error',
                                                message: res.data.message,
                                                showCancelButton: false,
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            })
                                            this.isLoading = false
                                        }
                                    })
                            }
                            else if (editType === 'edit') {
                                apiInventoryAccounting.update(args)
                                    .then((res) => {
                                        if (res.data.status === 200) {
                                            // 编辑成功
                                            this.$msgbox({
                                                title: '消息',
                                                type: 'success',
                                                message: '编辑成功',
                                                showCancelButton: false,
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            })
                                            this.isLoading = false
                                            this.closeDialog()
                                        } else {
                                            this.$msgbox({
                                                title: '消息',
                                                type: 'error',
                                                message: res.data.message,
                                                showCancelButton: false,
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            })
                                            this.isLoading = false
                                        }
                                    })
                            }
                        }
                    }
                    else {

                        return false;
                    }
                })
            }
        }
    }

</script>

<style lang="css" scoped>
    .my-tree {
        display: flex;
        flex: 1;
        width: 1220px;
        margin: 0 auto;
    }

    .dialog-new.t8t-full-dialog .my-container {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }

    .dialog-new.t8t-full-dialog .my-toolbar {
        margin-bottom: 15px;
    }
</style>
<style>
    .dialog-new.t8t-full-dialog .el-dialog__header {
        padding: 0;
    }

    .dialog-new.t8t-full-dialog .el-dialog__body {
        padding: 0;
        height: 100%;
    }

    .dialog-new.t8t-full-dialog .t8t-full-dialog-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .dialog-new.t8t-full-dialog .full-dialog-tabs-container {
        flex: 1;
        margin-bottom: 20px;
    }

    .dialog-new.t8t-full-dialog .full-dialog-toolbar-container {
        height: 38px;
        background-color: #1e3046;
    }

    .dialog-new.t8t-full-dialog .toolbar-container {
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }

    .dialog-new.t8t-full-dialog .toolbar-container .toolbar-button {
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }

    .dialog-new.t8t-full-dialog .toolbar-container .toolbar-button:hover {
        color: #1e3046;
        background-color: #d2deeb;
    }

    .dialog-new.t8t-full-dialog .container-center {
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }

    .dialog-new.t8t-full-dialog .el-form {
        display: flex;
        flex-wrap: wrap;
    }

    .dialog-new.t8t-full-dialog .form-item-container {
        width: 25%;
    }

    .dialog-new.t8t-full-dialog .full-dialog-form-container {
        margin-top: 22px;
    }

    .dialog-new.t8t-full-dialog .full-dialog-form-container .el-form-item__content {
        width: 180px;
    }

    .dialog-new.t8t-full-dialog .full-dialog-tabs-container {
        display: flex;
    }

    .dialog-new.t8t-full-dialog .el-tabs {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .dialog-new.t8t-full-dialog .full-dialog-tabs-container .el-tabs__item {
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }

    .dialog-new.t8t-full-dialog .el-tabs__header {
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }

    .dialog-new.t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar {
        height: 1px;
    }

    .dialog-new.t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }

    .dialog-new.t8t-full-dialog .el-tabs__nav-wrap {
        width: 1220px;
        margin: 0 auto;
    }

    .dialog-new.t8t-full-dialog .el-tabs__content {
        flex: 1;
        display: flex;
    }

    .dialog-new.t8t-full-dialog .el-tab-pane {
        display: flex;
        flex: 1;
        overflow: auto;
    }

    .dialog-new.t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }
</style>
