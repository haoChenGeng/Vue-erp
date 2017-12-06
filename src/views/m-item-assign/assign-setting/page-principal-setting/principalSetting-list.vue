<template>

    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"
            :tableEditable="false"
            @list-view="doView"
            @list-delete="doDelete"
            @list-add-row="doAdd"
            @list-edit-row="doEdit"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>

        <!-- 新增、编辑弹窗  @keyup.enter.native="btnOKClick()" -->
        <el-dialog title="服务类型配置" class="edit-dialog" v-model="editDialogVisible" @close="closeEditDialog">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" >
                <el-form-item label="ID：" prop="serviceTypeCode">
                    <el-input v-model="formData.id"  :disabled="true" size="small"></el-input>
                </el-form-item>
                <el-form-item label="项目经理ID：" v-show="false" prop="serviceTypeId">
                    <el-input v-model="formData.workerId" v-show="false" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item label="工号：" prop="serviceTypeId">
                    <t8t-form-popup
                        ref="select-popup"
                        :defaultValue="chooseItemMan.defaultValue"
                        :textValue="chooseItemMan.textValue"
                        :filedValue="chooseItemMan.filedValue"
                        :disabled="chooseItemMan.disabled"
                        :dialog="chooseItemMan.dialog"
                    >
                    </t8t-form-popup>
                </el-form-item>
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="formData.workerName" :disabled="true" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item label="组织：" prop="originate">
                    <el-input v-model="formData.organization" :disabled="true" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item label="交付经理：" prop="remark">
                    <el-input v-model="formData.deliveryMan" :disabled="true" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item label="承接区域：" prop="acceptArea">
                    <el-select
                        v-model="formData.acceptArea"
                        multiple
                        filterable="true"
                        placeholder="请选择业承接区域">
                        <el-option
                            v-for="item in searchOptions.listArea"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上限公式：" prop="limitFormula">
                    <el-select
                        v-model="formData.limitFormula"
                        filterable="true"
                        placeholder="请选择上限公式">
                        <el-option
                            v-for="item in searchOptions.limitFormulas"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="接单上限：" prop="acceptLimit">
                    <el-input v-model="formData.acceptLimit" size="small">
                    </el-input>

                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-input v-model="formData.remark" size="large">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="edit_isLoading">确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import Cookie from 'js-cookie'
    import itemAssignService from 'src/services/itemAssign/Service.js'
    import itemAssignAPI from 'src/services/itemAssign/API.js'
    import axios from 'src/utils/axios.js'

    export default {
        components: {
            T8tListView
        },
        created () {
            // 业务类型
            // this.getCommonOptions('11008','business')
            this.loadOrganizations('001003006')
            // this.loadBusinessInfo('11008')
            // 加载上限公式列表
            this.loadFormula()
        },
        data () {
            return {
                // service 和 method 目前需要加密
                service: itemAssignService.ITEM_ASSIGN.name,
                // principalSetting.listPage
                method: itemAssignService.ITEM_ASSIGN.methods.PRINCIPAL_SETTING_LIST_PAGE,
                // principalSetting.deleteByIds
                deleteMethod: itemAssignService.ITEM_ASSIGN.methods.PRINCIPAL_SETTING_DELETE_BY_IDS,
                tableArgs: {},
                // 表头描述
                tableColumns: [
                    {prop: 'id', label: '主键ID'},
                    {prop: 'workerId', label: '关联经理ID', show: false},
                    {prop: 'workerCode', label: '工号'},
                    {prop: 'workerName', label: '项目经理', },
                    {prop: 'organizationName', label: '组织'},
                    {prop: 'organization', label: '组织', show: false},
                    {prop: 'deliveryMan', label: '交付经理'},
                    {prop: 'acceptArea', label: '承接区域', show: false},
                    {prop: 'acceptAreaIds', label: '承接区域', show: false},
                    {prop: 'acceptAreaName', label: '承接区域'},
                    {prop: 'limitFormula', label: '上限计算公式', list: 'limitFormulas', editor: { type: 'select' }},
                    {prop: 'acceptLimit', label: '接单上限'},
                    {prop: 'remark', label: '备注'},
                    {prop: 'createName', label: '创建人名称'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                    {prop: 'updateName', label: '修改人名称'},
                    {prop: 'updateTime', label: '修改时间', formatter: 'dateParser'}
                ],
                // 面包屑
                breadcrumbData: [
                    {title: '交付管理'},
                    {title: '交付基础配置'},
                    {title: '项目经理接单配置'}
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'select', label: '组织', name: 'organizationId', selectSourceKey:'organizations'},
                    {type: 'input', label: '项目经理工号', name: 'workerCode'},
                    {type: 'input', label: '项目经理姓名', name: 'workerName'}
                ],
                // 搜索项对应值
                searchOptions: {
                    // 分公司组织
                    organizations: [],
                    // 上限公式
                    limitFormulas: [],
                    // 组织区域
                    listArea: []
                },
                // 弹窗编辑配置信息
                editDialogVisible:false,
                labelPosition: 'right',
                formLabelWidth: '120px',
                editType:'add',
                edit_isLoading:false,
                // 表单规则
                rules: {
                    acceptLimit: [
                        {
                            type:'number',
                            required: true,
                            min:1,
                            max:9999999,
                            message: '请输入1-9999999的整数',
                            transform(value) {
                                return Number(value)
                            },
                            trigger: 'blur',
                        }
                    ]
                },
                operMethod: null,   // 操作方法
                operMsg: null,      // 操作提示信息
                formData:{
                    id: 0,
                    workerId: null,
                    workerName: null,
                    workerCode: null,
                    organization: null,
                    deliveryMan: null,
                    acceptArea: null,
                    acceptLimit: null,
                    limitFormula: null,
                    remark: null
                },
                chooseItemMan: {
                    disabled: false,
                    remote: true,
                    name: 'demandOrderCode',
                    textValue: 'workerCode',  //需要展示出来的名称
                    filedValue: 'workerCode',    //选中那条数据的ID
                    disabled: false,
                    defaultValue: '',
                    dialog: {
                        title: "选择项目经理",
                        size: 'large',
                        dialogWidth: '900px',
                        searchForm: {
                            fields: [
                                {
                                    type: 'input',
                                    label: '工号',
                                    name: 'workerCode'
                                },
                                {
                                    type: 'input',
                                    label: '名字',
                                    name: 'workerName'
                                },
                                {
                                    type: 'select',
                                    label: '组织',
                                    name: 'subOrgId',
                                    selectSourceKey: 'organizations'
                                },
                                {
                                    type: 'select',
                                    label: '业务类型',
                                    name: 'business',
                                    selectSourceKey: 'business',
                                    defaultValue: '06,07'
                                }
                            ],

                            selectSource: {
                                // 业务类型
                                business: [
                                    {value: '06', text: '整装包'},
                                    {value: '07', text: '施工包'},
                                    {value: '06,07', text: '所有'},
                                ],
                                // 分公司组织
                                organizations: []
                            },
                            resetBtnVisible: true,
                            showToggleBtn: false
                        },
                        table: {
                            //表格
                            columns: [
                                {
                                    prop: 'workerId',
                                    label: 'ID'
                                },
                                {
                                    prop: 'workerCode',
                                    label: '工号'
                                },
                                {
                                    prop: 'name',
                                    label: '名字'
                                },
                                {
                                    prop: 'orgName',
                                    label: '组织'
                                },
                                {
                                    prop: 'deliveryManName',
                                    label: '交付经理'
                                }
                            ],
                            //请求参数配置
                            // /biz/t8t-prs-ass/app principalSetting.waitChooseItemManPage
                            service: 'QIZ8fnB3SHlAeKaKjrW4uCQihLcDEap',
                            method: 'qSWpC7IDuJ99nfOzAhU8QH8k_SX63FVxQDOlDtEc5fwotVD8FiCzYzK',
                            args: {
                                search: {abc: 1},
                                size:100,
                                page:1
                            },
                            radioCol: true
                        },
                        onConfirm: this.confirm
                    }
                },
            }
        },
        methods: {
            onSearchSubmit () {

            },
            doDelete () {
                let deletePromise = this.$refs['list-view'].doDelete()
                if (deletePromise) {
                    deletePromise.then((res) => {
                        if (res.data && res.data.status == 200 && res.data.result > 0) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.$refs['list-view'].getTableInstance().reloadTable()
                        } else {
                            this.$message({
                                message: '删除失败 ' + res.data.message,
                                type: 'error'
                            });
                        }
                    })
                }
            },
            doAdd () {
                this.formData.id = 0
                this.formData.workerId = 0
                this.formData.workerCode = ''
                this.formData.workerName = ''
                this.formData.organization = ''
                this.formData.deliveryMan = ''
                this.formData.acceptArea = []
                this.formData.acceptLimit = 0
                this.formData.limitFormula = ''
                this.formData.remark = ''
                this.formData.createUser = +Cookie.get('t8t-tc-uid')
                this.formData.updateUser = null

                if (this.$refs['select-popup'] != null)
                    this.$refs['select-popup'].setValue('')
                this.chooseItemMan.defaultValue = null
                this.chooseItemMan.textValue = ''
                this.chooseItemMan.filedValue = ''

                this.operMsg == '新增成功！'
                this.operMethod = itemAssignService.ITEM_ASSIGN.methods.PRINCIPAL_SETTING_ADD
                this.editDialogVisible = true
                if(this.$refs['form'])
                    this.$refs['form'].resetFields()

                this.chooseItemMan.disabled = false
            },
            doEdit () {
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if (rows.length < 1) {
                    this.$message({
                        type: 'error',
                        message: '请勾选数据后再操作'
                    });
                    return
                }
                if (rows.length > 1) {
                    this.$message({
                        type: 'error',
                        message: '请对单条数据进行操作'
                    });
                    return
                }
                if(this.$refs['form'])
                    this.$refs['form'].resetFields()

                let data = rows[0]
                this.formData.id = data['id']
                this.formData.workerId = data['accountId']
                this.formData.workerCode = data['workerCode']
                this.chooseItemMan.defaultValue = [{textValue: data['workerCode'], fieldValue: data['workerCode']}]
                this.formData.workerName = data['workerName']
                this.formData.organization = data['organizationName']
                this.formData.deliveryMan = data['deliveryMan']
                if(data['acceptAreaIds'] != null) {
                    this.formData.acceptArea = data['acceptAreaIds']
                } else {
                    this.formData.acceptArea = []
                }
                this.formData.acceptLimit = data['acceptLimit']
                this.formData.limitFormula = data['limitFormula']
                this.formData.remark = data['remark']
                this.formData.createUser = null
                this.formData.updateUser = +Cookie.get('t8t-tc-uid')

                this.operMethod =itemAssignService.ITEM_ASSIGN.methods.PRINCIPAL_SETTING_UPDATE
                this.operMsg == '编辑成功！'
                this.editDialogVisible = true
                this.chooseItemMan.disabled = true  // 设置不可以选择项目经理

                this.loadAreaByOrg(data['organization'])
            },
            // 查询组织信息
            loadOrganizations: function(typeCode) {
                commonApi.queryAll({'search':{'typeCode': typeCode}})
                    .then((res => {
                        let list = []
                        if (res.data.status === 200) {
                            res.data.result.rows.forEach((item) => {
                                if (item.isDel===0) {
                                    list.push({
                                        value: item.id,
                                        text: item.name
                                    })
                                };
                            })
                            this.chooseItemMan.dialog.searchForm.selectSource.organizations = list
                            this.searchOptions.organizations = list
                        }
                    }))
            },
            //辅助资料
            getCommonOptions: function(fatherCode, selectName) {
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
            // ------- 以下为弹窗操作处理方法 ---------------------------------------------
            btnCancleClick(){
                this.editDialogVisible = false
            },
            btnOKClick(){
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        var args = {principalSetting:this.formData}
                        this.edit_isLoading = true
                        axios({
                            method: this.operMethod,
                            service: itemAssignService.ITEM_ASSIGN.name,
                            args: args
                        }).then((res) => {
                            this.edit_isLoading = false
                            if (res.data.status === 200) {
                                this.showMsg('success', this.operMsg)
                                this.$refs['list-view'].getTableInstance().reloadTable()
                            } else {
                                this.showMsg('error', res.data.message)
                            }
                            this.editDialogVisible = false
                        })
                    }
                })
            },
            // 筛选项目经理-确认按钮事件
            confirm: function (selectRows) {
                if(selectRows.length != 1) {
                    this.$message.error('请请选择一个项目经理后再确认！')
                    return
                }

                this.formData.workerId = selectRows[0].workerId
                this.formData.workerName = selectRows[0].name
                this.formData.organization = selectRows[0].orgName
                this.formData.deliveryMan = selectRows[0].deliveryManName
                this.formData.workerCode = selectRows[0].workerCode
                this.chooseItemMan.defaultValue = [{textValue: selectRows[0].workerCode, fieldValue: selectRows[0].workerCode}]
                // 加载组织区域信息
                this.loadAreaByOrg(selectRows[0].orgId)
            },
            // 区域数据加载
            loadAreaByOrg: function (orgId) {
                var args = {orgId: orgId}
                itemAssignAPI.queryCityRelation(args).then((res => {
                    if (res.data.status === 200) {
                        if (res.data.result != null && res.data.result.length > 0) {
                            itemAssignAPI.standardDistrictGetByCidList({cidList: res.data.result}).then((res => {
                                let list = []
                                if (res.data.status === 200) {
                                    res.data.result.forEach((item) => {
                                        list.push({
                                            value: item.cid,
                                            text: item.districtName
                                        })
                                    })
                                    this.searchOptions['listArea'] = list
                                }
                            }))
                        }
                    }
                }))
            },
            loadArea: function (ids) {
                itemAssignAPI.standardDistrictGetByCidList({cidList: ids}).then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.cid,
                                text: item.districtName
                            })
                        })
                        this.searchOptions['listArea'] = list
                    }
                }))
            },
            // 上限公式加载
            loadFormula: function () {
                // 查询业务模块ID，再根据业务模块ID查询该模块的公式
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: '11602',
                        propertyCode: '20'
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
                                var args1 = {
                                    search: {moduleId: 748},
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
                                        this.searchOptions['limitFormulas'] = list
                                    }
                                }))
                            } else {
                                this.searchOptions['limitFormulas'] = []
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
    }
</script>

<style lang="css">
    .main-div .edit-dialog .el-dialog{
        width: 450px;
    }
    .main-div .el-select-dropdown__wrap {
        max-height: 185px !important;
    }
    .main-div .edit-dialog .el-form-item__content {
        width: 350px;
    }
    .main-div .edit-dialog .el-select {
        width: 60%;
    }
    .main-div .el-input--small{
        width: 60%;
    }
    .main-div .el-form-item__label{
        width: 30%;
    }
</style>
