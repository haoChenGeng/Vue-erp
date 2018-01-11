<template>
    <!-- 标签页区 -->
    <div class='full-dialog-tabs-container'>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search :fields="searchFields"
            @change="onChange"
            @submit="submitSearch"
            :selectSource="searchOptions"
            ref="searchBar"></t8t-search>
        <t8t-toolbar ref="toolbar"
            @ASSIGN_SETTING="assignSetting"
            @ASSIGN_ITEM_MANAGER="assignItemManager">
        </t8t-toolbar>

        <t8t-grid :columns="tableColumns"
            :service="service"
            :method="method"
            :commonData="searchOptions"
            :args="tableArgs"
            ref="assign-table"
            :pageSize="50"
            :pageSizes="[5,10,20,50,100]">
        </t8t-grid>
        <el-dialog title="派单配置"
            class="edit-dialog"
            v-model="editDialogVisible"
            @close="closeEditDialog">
            <el-form :model="formData"
                :rules="assignRules"
                class="assignPrincipalRuleClass"
                ref="assignForm" label-width="120px">
                <el-form-item label="下单人员："
                    prop="assignName">
                    <el-select filterable  placeholder="请选择下单人员"
                        v-model="formData.assignName">
                        <!-- todo: get the dealer -->
                        <el-option v-for="(item,sk) in searchOptions.checkmanList"
                            :label="item.text"
                            :value="item.value"
                            :key="sk">
                        </el-option>
                    </el-select>
                    <el-button @click="doAdd">新建</el-button>
                </el-form-item>
                <el-form-item label="是否审核：">
                    <el-radio-group v-model="formData.isCheck">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审核人员："
                    v-if="formData.isCheck"
                    prop="checkMan">
                    <el-select filterable  placeholder="请选择审核人员"
                        v-model="formData.checkMan">
                        <!-- todo: get the dealer -->
                        <el-option v-for="(item,sk) in searchOptions.checkmanList"
                            :label="item.text"
                            :value="item.value"
                            :key="sk">
                        </el-option>
                    </el-select>
                    <el-button @click="doAdd">新建</el-button>

                </el-form-item>
                <el-form-item label="审核人员："
                    v-show="false">
                </el-form-item>
            </el-form>
            <div slot="footer"
                class="dialog-footer">
                <el-button @click="btnOKClick"
                    type="primary"
                    :loading="edit_isLoading">确定</el-button>
                <el-button @click="closeEditDialog">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import commonApi from 'src/services/commonApi/commonApi.js'
import Cookie from 'js-cookie'
import itemAssignApi from 'src/services/itemAssign/API.js'
import itemAssignService from 'src/services/itemAssign/Service.js'
import Service from 'src/services/salemanager/Service.js'

let projectId
export default {
    created() {
        // 派工类型
        this.getCommonOptions('82301', 'assignTypes')
        // 加载派工原因
        /*this.getCommonOptions('42102', 'assignReasons')*/
        this.loadProjectMainStatus()
    },
    activated() {
        this.$refs['assign-table'].reloadTable()
    },
    data() {
        return {
            formData: {
                assignName: null,
                checkMan: null,
                isCheck: true,
            },
            editDialogVisible: false,
            assignRules: {
                assignName: [
                    {
                        required: true,
                        message: '请选择下单员',
                        trigger: 'change',
                        type: 'number',
                    },
                ],
                checkMan: [
                    {
                        type: 'number',
                        trigger: 'change',
                        validator: (rule, value, callback, source, options) => {
                            if (value ==undefined || value == '') {
                                callback(false)
                            }
                            callback()
                        },
                        message: '请选择审核员',
                    },
                ],
            },
            // 列表服务配置
            service: itemAssignService.ITEM_ASSIGN.name,
            method: itemAssignService.ITEM_ASSIGN.methods.LIST_ASSIGN_PROJECT,
            tableArgs: {
                search: { assignBy: +Cookie.get('t8t-tc-uid') },
            },
            // 表头描述
            tableColumns: [
                { prop: 'sourceProjectId', label: '项目ID' },
                { prop: 'address', label: '地址' },
                { prop: 'ownerName', label: '业主' },
                {
                    prop: 'firstPayment',
                    label: '首期款',
                    formatter(v, r, e) {
                        if (v === 1) {
                            return '已交'
                        } else {
                            return "<span style='color: red'>未交</span>"
                        }
                    },
                },
                { prop: 'itemManager', label: '项目经理' },
                { prop: 'projectState', label: '项目状态' },
                { prop: 'partOrder', label: '下单员' },
                { prop: 'verifyUser', label: '审核员' },
                { prop: 'deliveryManager', label: '交付经理' },
                { prop: 'projectManager', label: '工程管家' },
            ],
            // 搜索项配置
            searchFields: [
                { type: 'input', label: '项目ID', name: 'sourceProjectId' },
                {
                    type: 'select',
                    label: '配置下单员',
                    name: 'isAssignPartOrder',
                    selectSourceKey: 'assignPartOrder',
                },
                {
                    type: 'select',
                    label: '项目主状态',
                    name: 'orderMainStatus',
                    selectSourceKey: 'search_mainStatusCode',
                },
                {
                    type: 'select',
                    label: '项目子状态',
                    name: 'orderSubStatus',
                    selectSourceKey: 'search_subStatusCode',
                    disabled: true,
                },
                { type: 'input', label: '楼盘名称', name: 'estateName' },
                { type: 'input', label: '项目经理', name: 'itemManagerName' },
                { type: 'input', label: '业主', name: 'ownerName' },

                // {type: 'input', label: '楼盘', name: 'estate'},
                // 以下是隐藏的部分
                {
                    type: 'input',
                    name: 'assignBy',
                    inputType: 'hidden',
                    defaultValue: +Cookie.get('t8t-tc-uid'),
                },
            ],
            // 面包屑
            breadcrumbData: [
                { title: '交付管理' },
                { title: '派单' },
                { title: '工程派单' },
            ],
            // 搜索项对应值
            searchOptions: {
                search_mainStatusCode: [],
                search_subStatusCode: [],
                assignPartOrder: [
                    { value: null, text: '全部' },
                    { value: 'true', text: '是' },
                    { value: 'false', text: '否' },
                ],
                // 弹窗编辑配置信息
                productPkgs: [], // 产品包
                assignReasons: [], // 派工原因
                checkmanList: [],
            },
        }
    },
    methods: {
        closeEditDialog() {
            this.editDialogVisible = false
            this.btnCancleClick()
        },
        onSearchSubmit: function() {
            //console.log('点击搜索。。。')
            //console.log(this.service + ' -- ' + this.method)
        },
        loadProjectMainStatus: function() {
            itemAssignApi
                .queryPropertyUnion({
                    page: 1,
                    size: 200,
                    search: { pPropertyCode: '810' },
                })
                .then(res => {
                    if (res.data.status === 200) {
                        let searchList = []
                        let rows = res.data.result
                        for (let i in rows) {
                            searchList.push({
                                text: rows[i]['propertyName'],
                                value: rows[i]['propertyCode'],
                            })
                        }
                        this.searchOptions.search_mainStatusCode = searchList
                    }
                })
        },
        btnOKClick() {
            this.$refs['assignForm'].validate(isPass => {
                if (isPass) {
                    if (!this.formData.isCheck){
                        this.formData.checkMan = null;
                    }
                    let args = {
                        projectId: projectId,
                        verifyUser: this.formData.checkMan,
                        partOrder: this.formData.assignName,
                        assignUser: +Cookie.get('t8t-tc-uid'),
                    }
                    itemAssignApi.assignConfig(args).then(res => {
                        var msgType = ''
                        var msg = ''
                        if (res.data.status === 200) {
                            msgType = 'success'
                            if (res.data.result > 0) {
                                msg = '操作成功！'
                            } else {
                                msg = '操作失败！'
                            }
                            this.editDialogVisible = false
                            this.$refs['assign-table'].reloadTable()

                        } else {
                            msgType = 'error'
                            msg = res.data.message
                        }
                        this.showMsg(msgType, msg)
                    })
                }
            })
        },
        doAdd() {
            window.open('http://www.to8to.com/my/designer.php?act=addmember')
        },
        btnCancleClick() {
            this.formData = {
                assignName: null,
                checkMan: null,
                isCheck: true,
            }
            this.editDialogVisible = false
        },
        assignItemManager: function() {
            //派单-项目经理
            this.$router.push({
                path: '/tuchat-itemAssign/assign-principal-item-page',
                query: {
                    id: this.getSelectRowData().projectId,
                    mode: 'view',
                },
            })
        },
        assignSetting() {
            let selectRow = this.getSelectRowData()
            if (selectRow == null) return
            let yid = selectRow.projectId
            projectId = selectRow.projectId
            this.loadPrincipal(yid, _ => {
                debugger
                this.formData = {
                    ...{
                        assignName: null,
                        checkMan: null,
                        isCheck: true,
                    },
                    ...{
                        assignName: selectRow.partOrderId,
                        checkMan: selectRow.verifyUserId,
                    },
                }
            })
            this.editDialogVisible = true
        },
        getSelectRowData: function() {
            let rows = this.$refs['assign-table'].getSelectRows()
            if (rows.length !== 1) {
                this.$message.error('请勾选一行数据后再试。')
                return
            }
            return rows[0]
        },
        // 加载接单人信息
        loadPrincipal: function(val, cb) {
            itemAssignApi
                .getMember({ projectId: val })
                .then(res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach(item => {
                            list.push({
                                value: item.accountId,
                                text: item.name,
                            })
                        })
                        this.searchOptions['checkmanList'] = list
                        cb()
                    }
                })
        },
        onChange(val, name) {
            let formData = this.$refs['searchBar'].getFormData()
            if (name == 'orderMainStatus') {
                if (val) {
                    this.searchFields.find(
                        item => item.name === 'orderSubStatus'
                    ).disabled = false
                } else {
                    this.searchFields.find(
                        item => item.name === 'orderSubStatus'
                    ).disabled = true
                }
                this.$refs['searchBar'].setFormData({ orderSubStatus: null })
                this.searchOptions.search_subStatusCode = []
                if(val){
                    itemAssignApi
                        .queryPropertyUnion({
                            page: 1,
                            size: 200,
                            search: { pPropertyCode: val },
                        })
                        .then(res => {
                            let searchList = []
                            if (res.data.status === 200) {
                                let rows = res.data.result
                                for (let i in rows) {
                                    searchList.push({
                                        text: rows[i]['propertyName'],
                                        value: rows[i]['propertyCode'],
                                    })
                                }
                            }
                            this.searchOptions.search_subStatusCode = searchList
                        })
                }

            }
        },
        // 调用辅助资料接口
        getCommonOptions: function(fatherCode, selectName) {
            let arg = {
                page: 1,
                search: {
                    pPropertyCode: fatherCode,
                },
                size: 100,
            }
            let list = []
            commonApi.queryUnionParent(arg).then(res => {
                if (res.data.status === 200) {
                    res.data.result.forEach(item => {
                        if (item.propertyStatus === 1) {
                            list.push({
                                value: item.id,
                                text: item.propertyName,
                                code: item.propertyCode,
                            })
                        }
                    })

                    this.searchOptions[selectName] = list
                }
            })
        },
        // 弹窗提示抽离方法
        showMsg: function(state, msg) {
            this.$msgbox({
                title: '消息',
                type: state,
                message: msg,
                showCancelButton: false,
                confirmButtonText: '知道了',
                confirmButtonClass: 'is-plain',
            })
        },
        submitSearch(obj) {
            this.tableArgs = { ...this.tableArgs, ...{ search: { ...obj } } }
        },
    },
}
</script>

<style lang="css">
.main-div .edit-dialog .el-dialog {
    width: 450px;
}
edit-dialog .assignPrincipalRuleClass .el-form-item__error {
    margin-left: 0% !important;
}
.main-div .el-select-dropdown__wrap {
    max-height: 180px !important;
}

.main-div .edit-dialog .el-form-item__content {
    width: 350px;
}

.main-div .edit-dialog .el-select {
    width: 60%;
}

.main-div .el-input--small {
    width: 60%;
}

.main-div .el-form-item__label {
    width: 30%;
}
</style>
