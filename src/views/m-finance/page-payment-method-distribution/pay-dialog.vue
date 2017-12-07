<template>
    <div>
        <el-dialog class="t8t-full-dialog dialog-new" size="full" v-model="dialogVisible" @close="btnCancleClick()">
            <div class="t8t-full-dialog-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @EDIT-SUBMIT="btnOKClick()"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <!-- 表单区 -->
                <div class="full-dialog-form-container container-center">
                    <el-form :model="formData"
                             :rules="rules"
                             ref="payForm"
                             label-position="right" label-width="120px">
                        <div class="form-item-container">
                            <el-form-item label="业务类型" prop="businessTypeName">
                                <el-input v-model="formData.businessTypeName" :disabled="true"></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="付款对象" prop="payObjectName">
                                <el-input v-model="formData.payObjectName" :disabled="true"></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="付款类型" prop="payTypeId">
                                <el-select v-model="formData.payTypeId" :disabled="editable" placeholder="--请选择--"
                                           @change="changePayType">
                                    <el-option v-for="item in payTypeList" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="付款主体" prop="payOrganizationName">
                                <el-input v-model="formData.payOrganizationName" :disabled="true"></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="付款方式" prop="payChannelId">
                                <el-select v-model="formData.payChannelId" :disabled="editable" placeholder="--请选择--"
                                           @change="changePayMethod">
                                    <el-option v-for="item in payChannelList" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="优先级" prop="priority">
                                <el-input v-model="formData.priority" :disabled="false"></el-input>
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
                        :default-expanded-keys="defaultExpandedKeys"
                        :default-checked-keys="defaultCheckedKeys"
                        :check-strictly="true"
                    >
                    </t8t-tree>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Cookie from 'js-cookie';
    import apiPayMethodDistribution from 'src/services/finance/payMethodDistribution.js';
    import apiPayMethodConfig from 'src/services/finance/payMethodConfig.js';
    import apiPayTypeConfig from 'src/services/finance/payTypeConfig.js';
    import apiCommon from 'src/services/commonApi/commonApi.js';
    import * as config from './config';
    import apiVirtualCardConfig from 'src/services/finance/virtualCardConfig.js'

    let editType
    let id
    export default {
        name: 'pay-dialog',
        data() {
            return {
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
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: config.rules,
                //辅助资料配置
                organizationList: [],   // 组织列表
//                businessTypeList: [],   // 业务类型列表
//                payObjectList: [],      // 付款对象列表
                payTypeList: [],      // 付款类型列表
//                payOrganizationList: [],// 付款组织列表
                payChannelList: [],    // 付款方式列表
                //表单
                formData: config.formData,
                isLoading: false
            }
        },
        computed: {
            dialogVisible() {
                return true
            },
            editable() {
                return this.editType === 'see'
            }
        },
        beforeCreate() {
            editType = this.$route.query.editType
            id = this.$route.query.id
        },
        created() {
            this.initTree()
            //请求所选行的数据
            if (id) {
                var args = {
                    id: id
                };
                this.loadPayMethodsFormData(args)
            }
            ;
            //请求辅助资料配置
            //this.getFunOptions(["001004013", "001004014"], 'organizationList');//组织
            this.getAllOrganization();
//            this.getCommonOptions('11008','businessTypeList');//业务类型列表
//            this.getCommonOptions('61004','payObjectList');//付款对象列表
            this.getPayTypeConfigOption('payTypeList');//付款类型列表
//            this.getFunOptions(["001004013"], 'payOrganizationList');//付款组织
            this.getPayMethodConfigOption('payChannelList');//付款方式列表
        },
        methods: {
            initTree() {
                let args = {
                    isAll: 0
                }
                apiVirtualCardConfig.queryTree(args)
                    .then((res) => {
                        this.treeData = [res.data.result]
                    })
            },
            getAllOrganization(){
                let organizationArgs = {
                    search: {
                        id_gt: 0
                    }
                }
                apiCommon.queryAll(organizationArgs)
                    .then((res => {
                        let list = []
                        if (res.data.status === 200) {
                            res.data.result.rows.forEach((item) => {
                                if (item.isDel === 0) {
                                    list.push({
                                        value: item.id,
                                        label: item.name
                                    })
                                }
                                ;
                            })
                            this.organizationList = list
                        }
                    }))
            },
            changePayMethod(value){
                for (let i = 0; i < this.payChannelList.length; i++) {
                    if (value === this.payChannelList[i].value) {
                        this.formData.payOrganizationName = this.payChannelList[i].payOrganizationName
                    }
                }
            },
            changePayType(value){
                for (let i = 0; i < this.payTypeList.length; i++) {
                    if (value === this.payTypeList[i].value) {
                        this.formData.businessTypeName = this.payTypeList[i].businessTypeName;
                        this.formData.payObjectName = this.payTypeList[i].payObjectName
                    }
                }
            },
            btnOKClick() {
                this.$refs['payForm'].validate(valid => {
                    if (valid) {

                        let organizationIdsStr = ''
                        this.$refs["my-tree"].getCheckedKeys(false).forEach((item) => {
                                organizationIdsStr += item
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
                            var formData = Object.assign({}, this.formData)
                            formData.organizationIds = organizationIdsStr.substr(0, organizationIdsStr.length - 1);

                            if (editType === 'add') {
                                this.addPayMethods(formData)
                            }
                            else if (editType === 'edit') {
                                formData.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                                this.updatePayMethods(formData)
                            }
                            else {
                                console.log("aaa")
                            }
                        }

                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$router.push({path: '/tuchat-finance/page-payment-method-distribution'})
            },
            //新增提交
            addPayMethods(formData){
                var channelDistribution = formData;
                //发起请求,提交表单
                apiPayMethodDistribution.create({channelDistribution})
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result > 1) {
                            //隐藏正在加载
                            this.isLoading = false;
                            this.$refs['payForm'].resetFields();
                            this.$emit('close');
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '新增成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            });
                            this.btnCancleClick()
                        }
                        else {
                            this.isLoading = false;
                            this.$message.error(res.data.message)
                        }
                    })
            },
            //编辑提交
            updatePayMethods(formData) {
                var channelDistribution = formData
                this.isLoading = true
                //发起请求,提交表单
                apiPayMethodDistribution.update({channelDistribution})
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result === 1) {
                            //隐藏正在加载
                            this.isLoading = false
                            this.$refs['payForm'].resetFields();
                            this.$emit('close')
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '编辑成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.btnCancleClick()
                        }
                        else {
                            this.isLoading = false;
                            this.$message.error(res.data.message)
                        }
                    })

            },
            //请求弹窗行的数据
            loadPayMethodsFormData(args) {
                apiPayMethodDistribution.findByIdNames(args).then((res) => {
                    if (res.data.status === 200) {
                        var rowData = res.data.result;
                        var organizationIdsArr = rowData.organizationIds.split(',')
                        var organizationIdsInt = [];
                        //字符串数组转化为INT 数组
                        organizationIdsArr.forEach(function (data, index, arr) {
                            organizationIdsInt.push(+data)
                        });
                        rowData.organizationIds = organizationIdsInt;
                        this.formData = rowData

                        this.$refs['my-tree'].setCheckedKeys(organizationIdsInt)
                        setTimeout(() => {
                            this.defaultExpandedKeys = organizationIdsInt
                        }, 1000)
                    }
                })
            },
            //辅助资料
            getCommonOptions: function (fatherCode, selectName) {
                let arg = {
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
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        label: item.propertyName
                                    })
                                }
                                ;
                            });
                            this[selectName] = list;

                        }
                    })
            },
            //组织职能
            getFunOptions: function (codeArray, selectName) {
                apiCommon.queryByFunctionCode({"funcCodes": codeArray})
                    .then((res => {
                        let list = []
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.isDel === 0) {
                                    list.push({
                                        value: item.id,
                                        label: item.name
                                    })
                                }
                                ;
                            })
                            this[selectName] = list
                        }
                    }))
            },
            //可用付款方式
            getPayMethodConfigOption: function (selectName) {
                apiPayMethodConfig.query().then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.status === 1) {
                                list.push({
                                    value: item.id,
                                    label: item.name,
                                    payOrganizationName: item.organizationName,
                                })
                            }
                            ;
                        })
                        this[selectName] = list
                    }
                }))
            },
            //可用付款类型
            getPayTypeConfigOption: function (selectName) {
                apiPayTypeConfig.query().then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.status === 1) {
                                list.push({
                                    value: item.id,
                                    label: item.name,
                                    businessTypeName: item.businessTypeName,
                                    payObjectName: item.payObjectName,
                                })
                            }
                            ;
                        })
                        this[selectName] = list
                    }
                }))
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
