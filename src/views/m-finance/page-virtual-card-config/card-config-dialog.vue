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
                <el-form :model="formData" :rules="rules" ref="cardConfigForm" label-position="right" label-width="120px">
                    <div class="form-item-container">
                       <el-form-item label="编码：" prop="code">
                            <el-input v-model="formData.code" :disabled="this.editType==='edit'"></el-input>
                       </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="主卡卡号：" prop="bankAccount">
                            <el-input v-model="formData.bankAccount"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="银行类型：" prop="bankId">
                            <el-select v-model="formData.bankId" placeholder="--请选择--" :disabled="editable" >
                                <el-option v-for="items in commonOptionsConfig.bankCode" :label="items.text" :value="items.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="开户支行" prop="bankBranch">
                            <el-input v-model="formData.bankBranch" class="my-input"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="关联收款方式：" prop="channelId">
                            <el-select v-model="formData.channelId" placeholder="--请选择--" :disabled="editable" >
                                <el-option v-for="item in debitOptionsConfig.channelCode" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="登录名" prop="loginName">
                            <el-input v-model="formData.loginName" class="my-input"></el-input>
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
                    :show-checkbox="true"
                >
                </t8t-tree>
            </div>
        </div>
    </el-dialog>
</template>
<script>
    import Cookie from 'js-cookie'
    import apiVirtualCardConfig from 'src/services/finance/virtualCardConfig.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    export default {
        name: 'card-config-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    code: [
                        {
                            required: true ,
                            message: "请填写编码",
                            trigger: 'blur'
                        },
                        {
                            max: 50,
                            message: '编码最大不超过50个字符',
                            trigger: 'blur'
                        }
                    ],
                    loginName: [
                        {
                            required: true ,
                            message: "请填写登录名",
                            trigger: 'blur'
                        },
                        {
                            max: 50,
                            message: '登录名最大不超过50个字符',
                            trigger: 'blur'
                        }
                    ],
                    bankBranch: [
                        {
                            required: true ,
                            message: "请填写开户支行",
                            trigger: 'blur'
                        },
                        {
                            max: 150,
                            message: '编码最大不超过150个字符',
                            trigger: 'blur'
                        }
                    ],
                    bankAccount: [
                        {
                            required: true ,
                            message: "请填写主卡卡号",
                            trigger: 'blur'
                        },
                        {
                            max: 50,
                            message: '主卡卡号最大不超过50个字符',
                            trigger: 'blur'
                        },
                        { pattern: /^\d{1,}$/, message: '请输入数字' }
                    ],
                    bankId: [
                        {type: "number",required: true , message: "请选择银行类型",trigger: 'change'}
                    ],
                    channelId: [
                        {type: "number",required: true , message: "请选择关联收款方式",trigger: 'change'}
                    ]
                },
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children',
                    disabled: 'isDel'
                },
                //辅助资料配置
                commonOptionsConfig : {
                    bankCode: []
                },
                debitOptionsConfig : {
                    channelCode: []
                },
                //表单
                formData: {
                    id: null,
                    bankId: null,
                    code: null,
                    bankAccount:  null,
                    bankBranch:  null,
                    channelId:  null,
                    loginName:  null,
                    organzationIds:  null,
                    status:  1,
                    createTime:  null,
                    createUser:  parseInt(Cookie.get('t8t-tc-uid')),
                    updateTime:  null,
                    updateUser:  null
                },
                isLoading: false,
                isDialogShow: true,
            }
        },
        computed: {
            dialogVisible() {
                return true
            }
        },
        beforeCreate() {
            this.editType = this.$route.query.editType
            this.id = this.$route.query.id
        },
        created () {
            this.initTree()
            this.getFormDataByEditType()
            //请求辅助资料配置
            this.getCommonOptions('61101','bankCode')//银行类型
            this.getDebitOptios('channelCode')

            if(this.editType === 'add') {
                this.rules.code.push({
                    validator: this.checkUnique,
                    trigger: 'blur'
                })
                this.rules.bankAccount.push({
                    validator: this.checkUnique,
                    trigger: 'blur'
                })
            }
        },
        methods: {
            closeDialog(){
                this.$router.push({path: '/finance/page-virtual-card-config'})
            },
            getFormDataByEditType()
            {
                if (this.editType !== 'add') {
                    this.getFormData(this.id)
                }
            },
            getFormData(rowId) {
                let args = {
                    page: 1,
                    size: 10,
                    search: { id : rowId }
                }
                apiVirtualCardConfig.queryPage(args)
                    .then((res) => {
                        if (res.data.status === 200) {
                            this.formData =  res.data.result.rows[0]
                            // 获取组织ID
                            var bankIdsIntList = res.data.result.rows[0].organzationIds
                            this.$refs['my-tree'].setCheckedKeys(bankIdsIntList)
                            setTimeout(() => {
                                this.defaultExpandedKeys = bankIdsIntList
                            }, 1000)

                        }
                    })
            },
            initTree() {
                let args = {
                    isAll:0
                }
                apiVirtualCardConfig.queryTree(args)
                    .then((res) => {
                        this.treeData = [res.data.result]
                    })
            },
            submitForm() {

                this.$refs['cardConfigForm'].validate(valid => {
                    if (valid) {
                        this.isLoading = true
                        let organzationIds= []
                        this.$refs["my-tree"].getCheckedKeys(true).forEach((item) => {
                            organzationIds.push(item)
                            }
                        )
                        if (organzationIds.length<=0) {
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
                            this.formData.organzationIds = organzationIds

                            this.formData.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                            let args = {
                                virtualCardConfig: this.formData
                            }

                            if (this.editType === 'add') {
                                apiVirtualCardConfig.create(args)
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
                            else if (this.editType === 'edit') {
                                apiVirtualCardConfig.update(args)
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
            },
            // 校验重复
            checkUnique(rule, value, callback) {
                let field = rule.field
                let args = {
                    search: {}
                }
                switch (field) {
                    case 'code':
                        args.search.code = value
                        apiVirtualCardConfig.queryList(args)
                            .then((res)=>{
                                if(res.data.status === 200) {
                                    if(res.data.result.length>0) {
                                        return callback(new Error('编码已存在'))
                                    } else {
                                        return callback()
                                    }
                                } else {
                                    return callback()
                                }
                            })
                        break
                    case 'bankAccount' :
                        args.search.bankAccount = value
                        apiVirtualCardConfig.queryList(args)
                            .then((res)=>{
                                if(res.data.status === 200) {
                                    if(res.data.result.length>0) {
                                        return callback(new Error('虚拟卡主卡卡号已经存在'))
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
            },
            // 获取收款方式
            getDebitOptios: function(selectName) {
                let list = []
                let args = {
                    page: 1,
                    size: 1000,
                    search: {
                        status: 1 // 启用的配置
                    }
                }

                apiVirtualCardConfig.queryDebitMethod(args)
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result.rows) {
                            res.data.result.rows.forEach((item) => {
                                list.push({
                                    value: item.channelId,
                                    text: item.name
                                })
                            })
                            this.debitOptionsConfig[selectName] = list
                        }
                    })
            },
            //辅助资料
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
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
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            };
                        })
                        this.commonOptionsConfig[selectName] = list
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
