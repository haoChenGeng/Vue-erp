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
                        @CANCEL="closeDialog"
                        @CLOSE="closeDialog"
                        ref="toolbar"
                    >
                    </t8t-toolbar>
                </div>
            </div>
            <!-- 表单区 -->
            <div class="full-dialog-form-container container-center">
                <el-form :model="hFormData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                    <div class="form-item-container">
                        <el-form-item label="考核对象：" prop="objId">
                            <el-select v-model="hFormData.objId" placeholder="--请选择--" :disabled="selectAvailable">
                                <el-option v-for="item in commonOptionsConfig.assessObjcts" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="执行频率：" prop="assessHz">
                            <el-select v-model="hFormData.assessHz" placeholder="--请选择--" :disabled="selectAvailable">
                                <el-option v-for="item in commonOptionsConfig.assessHzs" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="启用状态：" prop="state">
                            <el-select v-model="hFormData.state" placeholder="--请选择--" :disabled="selectAvailable">
                                <el-option v-for="item in commonOptionsConfig.states" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <!-- 标签页区 -->
            <div class="full-dialog-tabs-container">
                <el-tabs v-model="activeTabName">
                    <div class="my-container">
                        <div class="my-toolbar">
                            <el-button
                                type="primary"
                                size="small"
                                :disabled="butAvailable"
                                icon="plus"
                                @click="add()"
                            >新增行</el-button>
                            <el-button
                                type="danger"
                                :disabled="butAvailable"
                                size="small"
                                icon="close"
                                @click="del()"
                            >删除行</el-button>
                        </div>
                        <t8t-table
                            ref="t8ttable"
                            :columns="columns"
                            :commonData="commonOptionsConfig"
                            :selectCol="true"
                            :indexCol="true"
                            :editable="tableEditable"
                            :pageBar="false"
                            :dataSource="hFormData.listAssessItem"
                        >
                        </t8t-table>
                    </div>
                </el-tabs>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    import axios from 'src/utils/axios.js'
    import itemAssignService from 'src/services/itemAssign/Service.js'
    import itemAssignAPI from 'src/services/itemAssign/API.js'

    let mode
    let id

    export default {
        name: 'page-pay-bills-dialog',

        data () {
            return {
                isLoading: false,
                isDialogShow: true,
                activeTabName: 'one',
                tableEditable: true,
                butAvailable: false,
                selectAvailable: false,
                hFormData: {
                    id: 0,
                    objId: '',
                    assessHz: '',
                    state: '',
                    listAssessItem:[]
                },
                formRule: {
                    objId: [{ required: true, message: '请选择收考核对象'}],
                    assessHz: [{ required: true, message: '请选择执行频率'}],
                    state: [{required: true, message: '请输选择启用状态'}]
                },
                columns: [
                    {
                        prop: 'id',
                        label: 'ID',
                        show: false
                    },
                    {
                        prop: 'assessItem',
                        label: '考核项目',
                        list: 'assessItems',
                        editor: {
                            type: 'select',
                            rules: {
                                required: true,
                                message: "请选中考核项目"
                            }
                        }
                    },
                    {
                        prop: 'weightRatio',
                        label: '权重比例',
                        editor: {
                            type: 'input',
                            rules: {
                                required: true,
                                message: "请选中考核项目"
                            }
                        }
                    },
                    {
                        prop: 'formulaId',
                        label: '公式',
                        list: 'formulas',
                        editor: {
                            type: 'select',
                            rules: {
                                required: true,
                                message: "请选中考核项目"
                            }
                        }
                    },
                    {
                        prop: 'reference',
                        label: '参考依据',
                        editor: {
                            type: 'input',
                            rules: {
                                required: true,
                                message: "请选中考核项目"
                            }
                        }
                    }
                ],
                //辅助资料配置
                commonOptionsConfig: {
                    assessObjcts: [],
                    assessHzs: [],
                    assessItems: [],
                    formulas: [],
                    states: [
                        {
                            text: '启用',
                            value: 1
                        },
                        {
                            text: '作废',
                            value: 2
                        }
                    ]
                }
            }
        },
        beforeCreate() {
            mode = this.$route.query.mode
            id = this.$route.query.id
        },
        created() {
            // 辅助资料初始化
            this.getCommonOptions('42001', 'assessObjcts')
            this.getCommonOptions('42002', 'assessHzs')
            this.getCommonOptions('42003', 'assessItems')
            this.loadFormula()  // 上限公式

            if (id > 0 && (mode == 'edit' || mode == 'view')) {
                this.loadData(id)
            }

            // 设置页面是否可编辑
            if (mode == 'view') {
                this.editable(true)
            } else {
                this.editable(false)
            }
        },
        methods: {
            editable: function (isEdit) {
                this.tableEditable = !isEdit
                this.butAvailable = isEdit
                this.selectAvailable = isEdit
            },
            submitForm(symbol) {
                var formFlag = false;
                var tableFlag = false;
                this.$refs['formRef'].validate((isValid) => {
                    if (isValid){
                        formFlag = true
                    }
                    this.$refs['t8ttable'].validate((isValid) => {
                        if (isValid) {
                            tableFlag = true
                        }
                        if (formFlag && tableFlag) {
                            this.submit(symbol)
                        }
                    })
                })

            },
            submit: function (symbol) {
                this.hFormData.listAssessItem = this.fromatRows()

                if (this.hFormData['listAssessItem'] == null || this.hFormData['listAssessItem'].length < 1) {
                    this.$msgbox({
                        type: 'error',
                        message: '请添加考核项目行，添加后再提交！',
                    })
                    return
                }

                var weightRatioTotal = 0
                this.hFormData['listAssessItem'].forEach((item) => {
                    weightRatioTotal += +item['weightRatio']
                })
                if (weightRatioTotal != 100) {
                    this.$msgbox({
                        type: 'error',
                        message: '权重比例总数不够100%，请确认后再提交！',
                    })
                    return
                }

                this.isLoading = true
                this.$refs['toolbar'].disableBySymbol(symbol)

                let method, msg
                if(mode === 'add') {
                    method = itemAssignService.ITEM_ASSIGN.methods.ASSESS_OBJECT_CREATE
                    msg = '新增成功'
                    this.hFormData['createUser'] = +Cookie.get('t8t-tc-uid')
                } else if (id > 0) {
                    method = itemAssignService.ITEM_ASSIGN.methods.ASSESS_OBJECT_UPDATE
                    msg = '编辑成功'
                    this.hFormData['updateUser'] = +Cookie.get('t8t-tc-uid')
                }

                var args = {
                    assessObject: this.hFormData
                }
                axios({
                    service: itemAssignService.ITEM_ASSIGN.name,
                    method: method,
                    args: args
                }).then((res) => {
                    if (res.data.status === 200) {
                        // 新增成功
                        this.showMsg('success', msg)
                        this.isLoading = false
                        this.closeDialog()
                    } else {
                        this.showMsg('error', res.data.message)
                    }
                    this.isLoading = false
                })
            },
            fromatRows: function () {
                let tableRows = this.$refs['t8ttable'].dataSource;
                return tableRows
            },
            closeDialog: function () {
                this.$router.go(-1)
            },
            //处理选择行变化
            add: function () {
                this.$refs['t8ttable'].addNewRow()
            },
            del: function () {
                this.$refs['t8ttable'].delRows()
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
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data['result'].forEach((item) => {
                                if (item['propertyStatus'] === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                };
                            })
                            this.commonOptionsConfig[selectName] = list
                        }
                    })
            },
            loadData: function(id) {
                if(id <= 0)
                    return

                let args = {
                    id: id
                }
                axios({
                    service: itemAssignService.ITEM_ASSIGN.name,
                    method: itemAssignService.ITEM_ASSIGN.methods.ASSESS_OBJECT_GET,
                    args: args
                }).then((res) => {
                        if (res.data.status === 200) {
                            this.hFormData = res.data.result;
                        }
                        else {
                            this.showMsg('error', res.data.message)
                        }
                    this.isLoading = false
                    })
            },
            // 上限公式加载
            loadFormula: function () {
                // 查询业务模块ID，再根据业务模块ID查询该模块的公式
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: '11602',
                        propertyCode: '4000'
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item['propertyStatus'] === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                };
                            })
                            if (list != null && list.length > 0)
                            {
                                var moduleId = list[0]['value']
                                var args1 = {
                                    search: {moduleId: moduleId},
                                    size: 100, page: 1
                                }
                                itemAssignAPI.formulaQueryPage(args1).then((res => {
                                    let list = []
                                    if (res.data.status === 200) {
                                        res.data.result.rows.forEach((item) => {
                                            list.push({
                                                value: item.id,
                                                text: item.formulaName
                                            })
                                        })
                                        this.commonOptionsConfig['formulas'] = list
                                    }
                                }))
                            } else {
                                this.commonOptionsConfig['formulas'] = []
                            }
                        } else {
                            this.$message.error('加载上限公式列表失败！')
                        }
                    })
            },
            showMsg: function (state, msg) {
                this.$msgbox({
                    title: '消息',
                    type: state,
                    message: msg,
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
            }
        }
    };
</script>

<style lang="css" scoped>
    .dialog-new.t8t-full-dialog .my-container{
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }
    .dialog-new.t8t-full-dialog .my-toolbar{
        margin-bottom: 15px;
    }
</style>
<style>
    .dialog-new.t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .dialog-new.t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .dialog-new.t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .dialog-new.t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }
    .dialog-new.t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .dialog-new.t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .dialog-new.t8t-full-dialog .toolbar-container .toolbar-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .dialog-new.t8t-full-dialog .toolbar-container .toolbar-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .dialog-new.t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .dialog-new.t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
    }
    .dialog-new.t8t-full-dialog .form-item-container{
        width: 25%;
    }
    .dialog-new.t8t-full-dialog .full-dialog-form-container{
        margin-top: 22px;
    }
    .dialog-new.t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .dialog-new.t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .dialog-new.t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .dialog-new.t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .dialog-new.t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .dialog-new.t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .dialog-new.t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .dialog-new.t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .dialog-new.t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
    }
    .dialog-new.t8t-full-dialog .el-tab-pane{
        display: flex;
        flex: 1;
        overflow: auto;
    }
    .dialog-new.t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }
</style>
