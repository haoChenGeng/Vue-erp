<template>
    <div class="assign-item-dialog">
        <!-- 新增 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog dialog-new">
            <div class="t8t-full-dialog-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar class="t8t-dark" @CANCEL="cancel" ref="toolbar">
                        </t8t-toolbar>
                    </div>
                </div>
                <!-- 表单区 -->
                <div class="full-dialog-form-container container-center">
                    <el-form :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                        <div class="form-item-container">
                            <el-form-item label="项目ID：" prop="objId">
                                <el-input v-model="viewData.sourceProjectId" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="项目经理：" prop="objId">
                                <el-input v-model="viewData.projectManagerName" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="装修面积：" prop="objId">
                                <el-input v-model="viewData.houseArea" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="签约日期：" prop="objId">
                                <el-input v-model="viewData.realSignedTime" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="量房时间：" prop="objId">
                                <el-input v-model="viewData.realMeasureTime" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="新旧房：" prop="objId">
                                <el-input v-model="viewData.houseStatusName" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="房屋类型：" prop="objId">
                                <el-input v-model="viewData.houseTypeName" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>

                        <div class="form-item-container">
                            <el-form-item label="派单员：" prop="objId">
                                <el-input v-model="viewData.orderUserName" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="设计师：" prop="objId">
                                <el-input v-model="viewData.designerName" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="首席设计师：" prop="objId">
                                <el-input v-model="viewData.chiefDesignerName" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="客户经理：" prop="objId">
                                <el-input v-model="viewData.customerManagerName" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="交付经理：" prop="objId">
                                <el-input v-model="viewData.engrManagerName" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="业主姓名：" prop="objId">
                                <el-input v-model="viewData.ownerName" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="工程管家：" prop="objId">
                                <el-input v-model="viewData.qualityControlName" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="详细地址：" prop="objId">
                                <el-input type="textarea" autosize v-model="viewData.address" :title="viewData.address" :readonly="true">
                                </el-input>
                            </el-form-item>
                        </div>

                    </el-form>
                </div>
                <!-- 标签页区 -->
                <div class="full-dialog-tabs-container">
                    <el-tabs v-model="activeTabName">
                        <div class="my-container">
                            <t8t-search class="my-search" ref="principal-search" :formData="searchForm" :fields="searchFields" :selectSource="commonOptionsConfig" :showToggleBtn="true"
                                @submit="searchSubmit">
                            </t8t-search>
                            <p></p>
                            <t8t-grid ref="t8ttable" :columns="columns" :selectCol="false" :pageBar="false" :editable="true" :dataSource="principals"
                                @current-row-change="principalSelectRow" @dealClick="confirmAssign">

                            </t8t-grid>
                        </div>
                    </el-tabs>
                </div>
            </div>

        </el-dialog>

        <el-dialog title="确认派工" class="assign-dialog" v-model="assignVisible" @close="closeAssignDialog">
            <el-form :model="assignComfirms" :rules="assingRules" ref="assignComfirm">
                <el-form-item label="更换原因："v-if="viewData.projectManagerId > 0"prop="reasonType">
                    <el-select placeholder="请选择更换原因" v-model="assignComfirms.reasonType">
                        <el-option v-for="item in commonOptionsConfig.assignReasons" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工长："  class="form-item-container" prop="name">
                    <el-input v-model="assignComfirms.name" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="电话："  class="form-item-container"  prop="phone">
                    <el-input v-model="assignComfirms.phone" :readonly="true"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick" type="primary" :loading="submitting" :disabled="submitting">确定</el-button>
                <el-button @click="closeAssignDialog">取消</el-button>
            </div>
        </el-dialog>

    </div>


</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    import axios from 'src/utils/axios.js'
    import itemAssignService from 'src/services/itemAssign/Service.js'
    import itemAssignServiceApi from 'src/services/itemAssign/API.js'
    import DateUtils from 'src/utils/DateUtils.js'

    let mode
    let projectId

    export default {
        components: {},
        name: 'dialog-assigin-delivery',
        data() {
            return {
                searchForm:{},
                assignComfirms: {},
                assignVisible: false,
                isLoading: false,
                isDialogShow: true,
                submitting:false,
                viewData: {},
                assingRules:{
                    reasonType:[
                        {required: true, message: '请选择重新派单原因'}
                    ]
                },
                principals: [],
                reason: '',
                principalRow: '',
                columns: [
                    {
                        prop: 'deal',
                        label: '操作',
                        editor: {
                            type: "button",
                            onClick(val, row, event, _self) {
                                _self.$emit("dealClick", row, event)
                            }
                        },
                        formatter() {
                            return "派单"
                        }
                    },
                    {
                        prop: 'name',
                        label: '姓名'
                    },
                    {
                        prop: 'phone',
                        label: '电话'
                    },
                    {
                        prop: 'orderNum',
                        label: '在建工地数'
                    },
                    {
                        prop: 'acceptLimit',
                        label: '接单上限'
                    }
                ],
                // 搜索信息
                searchFields: [
                    { type: 'input', label: '工长',placeholder:'姓名|电话', name: 'searchContent' },
                    { type: 'select', label: '状态',  name: 'state', selectSourceKey: 'acceptStates' }
                ],
                searchDataSource: {},
                // 辅助资料配置
                commonOptionsConfig: {
                    assessObjcts: [],
                    assignReasons: [],   // 派单原因
                    acceptStates: [
                        { value: 0, text: '生效'},
                    ],
                },
                // 点击关闭后的返回route
                goBackRoute: '/tuchat-itemAssign/assign-principal-list'
            }
        },
        beforeCreate() {
            mode = this.$route.query.mode
            projectId = this.$route.query.id
        },
        created() {
            // 辅助资料初始化
            this.getCommonOptions('82302', 'assignReasons')
            // 加载项目数据,加载接单人列表
            this.loadData(projectId)
            this.loadPrincipal(projectId)
            this.searchForm = {'state': 0}
        },
        methods: {
            confirmAssign(row, event) {
                // todo 要什么数据插进来
                let form = {
                    id:null,
                    name: null,
                    phone: null,
                    orderNum: null,
                    acceptLimit: null,
                    first: null,
                    reasonType: null,
                }

                this.assignComfirms = { ...form, ...row }

                this.assignVisible = true
            },




            // 负责人选择记录
            principalSelectRow: function (curRow, oldRow) {
                this.principalRow = curRow
            },
            searchSubmit: function (search) {
                if (JSON.stringify(search) !== '{}') {
                    if (search['state'] === '') {
                        search['state'] = null
                    }
                    this.loadPrincipal(projectId, search)
                } else {
                    this.loadPrincipal(projectId)
                }
            },
            closeDialog: function () {
                this.$router.push({ path: this.goBackRoute })
            },
            // 辅助资料
            getCommonOptions: function (fatherCode, selectName) {
                var arg = {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                var list = []
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
                            this.commonOptionsConfig['assignReasons'] = list
                        } else {
                            this.showMsg('error', res.data.message)
                        }
                    })
            },
            // 加载单据数据
            loadData: function (projectId) {
                if (projectId <= 0) {
                    this.showMsg('error', '加载数据失败！')
                    this.$router.go(-1) // 返回列表页
                }
                var args = {
                    projectId: projectId
                }
                this.isLoading = true
                itemAssignServiceApi.getDecorationInfo(args).then((res) => {
                    if (res.data.status === 200) {
                        this.viewData = res.data.result
                        // 把时间戳转换一下
                        this.viewData['realSignedTime'] = DateUtils(+this.viewData['realSignedTime'] * 1000, 'yyyy-mm-dd HH:MM:ss')
                        this.viewData['realMeasureTime'] = DateUtils(+this.viewData['realMeasureTime'] * 1000, 'yyyy-mm-dd HH:MM:ss')
                    } else {
                        this.showMsg('error', res.data.message + '\n' + 'assignPage')
                    }
                    this.isLoading = false
                })
            },
            // 加载负责人列表
            loadPrincipal: function (projectId, search) {
                this.principals = []
                var args={
                    'projectId': projectId,
                    'searchContent': search==null ? null : search['searchContent'],
                    'state': search == null ? null : search['state'],
                    'assignCode':'01'
                }
                // 加载接单人信息
                itemAssignServiceApi.getAssignPrincipalList(args)
                    .then((res => {
                        let list = []
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                list.push({
                                    name: item.name,
                                    phone: item.phone,
                                    id:item.accountId,
                                    orderNum: item.orderNum,
                                    acceptLimit: item.limitOrder,
                                    first: true
                                })

                            })
                            this.principals = list
                        }
                    }))

            },
            cancel: function () {
                this.$router.go(-1) // 返回列表页
            },
            // 弹窗提示抽离方法
            showMsg: function (state, msg) {
                this.$msgbox({
                    title: '消息',
                    type: state,
                    message: msg,
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
            },
            btnOKClick() {
                this.$refs["assignComfirm"].validate(isPass => {
                    if(isPass) {
                        this.submitting = true
                        var args= {
                            'assignPrincipal': {
                                'projectId': projectId,
                                'principalId': this.assignComfirms.id,
                                'assignCode': '01',//派项目经理，
                                'reason': this.assignComfirms.reasonType
                            }
                        }
                        //调用派单接口
                        itemAssignServiceApi.assign(args)
                            .then((res => {

                                var msgType = ''
                                var msg = ''
                                if (res.data.status === 200) {
                                    msgType = 'success'
                                    if (res.data.result > 0) {
                                        msg = '操作成功！'
                                    } else {
                                        msg = '操作失败！'
                                    }
                                    this.$router.push({path: this.goBackRoute})
                                } else {
                                    this.submitting = false
                                    msgType = 'error'
                                    msg = res.data.message
                                }
                                this.showMsg(msgType, msg)

                            }))
                    }
                })

            },
            closeAssignDialog() {
                this.assignVisible = false

            }


        }
    };

</script>

<style lang="css" scoped>
    .dialog-new.t8t-full-dialog .my-container {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }

    .dialog-new.t8t-full-dialog .my-toolbar {
        margin-bottom: 15px;
    }

    .my-search {
        margin: auto;
        width: 1200px;
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

    .dialog-new.t8t-full-dialog .select-container-center {
        width: 1180px;
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

    .dialog-new.t8t-full-dialog .el-tabs__item+.el-tabs__item {
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
        margin: auto;
        width: 1200px;
    }

    .assign-item-dialog .el-dialog--small{
        width: 320px !important
    }
    .assign-item-dialog .el-dialog--small .el-form-item__label {
        width: 96px;
    }
    .assign-item-dialog .el-dialog--small .el-form-item__content {
        float:right;
        width: 178px;

    }

</style>
