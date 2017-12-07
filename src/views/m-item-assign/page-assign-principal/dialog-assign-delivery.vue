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
                        @CANCEL="cancel"
                        ref="toolbar"
                    >
                    </t8t-toolbar>
                </div>
            </div>
            <!-- 表单区 -->
            <div class="full-dialog-form-container container-center">
                <el-form :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                    <div class="form-item-container">
                        <el-form-item label="项目ID：" prop="objId">
                            <el-input v-model="viewData.projectId"  :readonly="true">
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="项目经理：" prop="objId">
                            <el-input v-model="viewData.itemManager" :readonly="true" >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="新旧房：" prop="objId">
                            <el-input v-model="viewData.houseStatus" :readonly="true" >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="房屋类型：" prop="objId">
                            <el-input v-model="viewData.houseType" :readonly="true" >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="装修面积：" prop="objId">
                            <el-input v-model="viewData.houseArea" :readonly="true" >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="产品包：" prop="objId">
                            <el-input v-model="viewData.productPkg"  :readonly="true">
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="签约日期：" prop="objId">
                            <el-input v-model="viewData.signDate" :readonly="true" >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="量房时间：" prop="objId">
                            <el-input v-model="viewData.expectMeasureTime" :readonly="true" >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="销售主管：" prop="objId">
                            <el-input v-model="viewData.sellManager" :readonly="true" >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="客户经理：" prop="objId">
                            <el-input v-model="viewData.customerManager" :readonly="true" >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="设计主管：" prop="objId">
                            <el-input v-model="viewData.designerMan" :readonly="true" >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="设计师：" prop="objId">
                            <el-input v-model="viewData.chiefDesigner" :readonly="true" >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="交付经理：" prop="objId">
                            <el-input v-model="viewData.deliveryManager" :readonly="true" >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="工程管家：" prop="objId">
                            <el-input v-model="viewData.projectManager" :readonly="true" >
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
                        <div class="container-center">
                            <el-form>
                                <div class="form-item-container">
                                    <el-form-item label="派单原因：" ref="reasonSelect" prop="reason" v-if="viewData.deliveryManager != '未分配'">
                                        <el-select v-model="reason" placeholder="--请选择--">
                                            <el-option v-for="item in commonOptionsConfig.assignReasons" :label="item.text" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </div>
                        <t8t-table
                            ref="t8ttable"
                            :columns="columns"
                            :selectCol="true"
                            :indexCol="true"
                            :editable="true"
                            :pageBar="false"
                            :radioCol="true"
                            :dataSource="principals"
                            @current-row-change="principalSelectRow"
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
    import itemAssignServiceApi from 'src/services/itemAssign/API.js'
    import DateUtils from 'src/utils/DateUtils.js'

    let mode
    let projectId

    export default {
        name: 'dialog-assigin-delivery',
        data () {
            return {
                isLoading: false,
                isDialogShow: true,
                viewData: {deliveryManager: ''},
                principals: [],
                reason: '',
                principalRow: '',
                columns: [
                    {
                        prop: 'accountId',
                        label: '交付经理ID'
                    },
                    {
                        prop: 'name',
                        label: '姓名'
                    },
                    {
                        prop: 'organization',
                        label: '门店'
                    }
                ],
                // 辅助资料配置
                commonOptionsConfig: {
                    assignReasons: []   // 派单原因
                },
                // 点击关闭后的返回route
                goBackRoute: '/tuchat-itemAssign/assign-principal-list',
            }
        },
        beforeCreate () {
            mode = this.$route.query.mode
            projectId = this.$route.query.id
        },
        created () {
            // 辅助资料初始化
            // this.getCommonOptions('42101', 'assessObjcts')
            this.getCommonOptions('42102', 'assignReasons')
            // 加载项目数据,加载负责人列表
            this.loadData(projectId)
            // 加载接单人列表
            this.loadPrincipal(projectId)
        },
        methods: {
            // 负责人选择记录
            principalSelectRow: function (curRow, oldRow) {
                this.principalRow = curRow
            },
            // 提交接口
            submitForm: function (symbol) {
                if (this.principalRow == null || this.principalRow['accountId'] == null) {
                    this.$message.error('请选择交付经理后再试！')
                    return
                }

                if (this.viewData['deliveryManager'] !== '未分配' && this.reason <= 0) {
                    this.showMsg('error', '请选择重新派单原因！')
                    return
                }

                var rowId = this.principalRow['accountId']
                var projejctId = this.viewData['projectId']
                var args = {
                    'assignPrincipal': {
                        'projectId': projejctId,
                        'principalId': rowId,
                        'typeCode': '05',
                        'reason': this.reason,
                        'assignUser': +Cookie.get('t8t-tc-uid')
                    }
                }
                this.isLoading = true
                itemAssignServiceApi.principalAssign(args).then((res) => {
                    var msgType = ''
                    var msg = ''
                    if (res.data.status === 200) {
                        msgType = 'success'
                        if (res.data.result > 0) {
                            msg = '操作成功！'
                        } else {
                            msg = '操作失败！'
                        }
                    } else {
                        msgType = 'error'
                        msg = res.data.message
                    }
                    this.showMsg(msgType, msg)
                    this.isLoading = false
                    this.$router.push({path: this.goBackRoute})

                })

            },
            closeDialog: function () {
                this.$router.push({path: this.goBackRoute})
            },
            // 辅助资料
            getCommonOptions: function (fatherCode,selectName) {
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
                                if (item['propertyStatus']===1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                };
                            })
                            this.commonOptionsConfig[selectName] = list
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
                itemAssignServiceApi.assignPage(args).then((res) => {
                    if (res.data.status === 200) {
                        this.viewData = res.data.result

                        // 把时间戳转换一下
                        this.viewData['signDate'] = DateUtils(+this.viewData['signDate'] * 1000, 'yyyy-mm-dd HH:MM:ss')
                        this.viewData['expectMeasureTime'] = DateUtils(+this.viewData['expectMeasureTime'] * 1000, 'yyyy-mm-dd HH:MM:ss')
                    } else {
                        this.showMsg('error', res.data.message + '\n' + 'assignPage')
                    }
                    this.isLoading = false
                })
            },
            // 加载负责人列表
            loadPrincipal: function (projectId) {
                this.principals = []
                var args = {
                    projectId: projectId,
                    assignCode: '05'
                }
                itemAssignServiceApi.listPrincipal(args).then((res) => {
                    if (res.data.status === 200) {
                        this.principals = res.data.result
                    } else {
                        this.showMsg('error', res.data.message + '\n' + 'listPrincipal')
                    }
                })
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
        margin: auto;
        width: 1200px;

    }
</style>
