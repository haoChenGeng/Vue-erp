<template>
    <!-- 新增 -->
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog dialog-new">
        <div class="t8t-full-dialog-container">
            <!-- 顶部按钮区 -->
            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                    <div>
                        <el-button @click="editDate()" :loading="isLoading" type="primary">保存</el-button>
                        <el-button @click="cancel()" type="primary">取消</el-button>
                    </div>
                </div>
            </div>
            <!-- 表单区 -->
            <div class="full-dialog-form-container container-center">
                <el-form :model="formData" :rules="formRules" ref="formRef" label-position="right" label-width="120px">
                    <div class="form-item-container">
                        <el-form-item label="财务组织：" prop="organizationId">
                            <el-select v-model="formData.organizationId" placeholder="--请选择--" :disabled="editable">
                                <el-option v-for="item in tempHeadFormCommonData.organizationIds" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="状态：" prop="status">
                            <el-select v-model="formData.status" placeholder="--请选择--" :disabled="editable">
                                <el-option v-for="item in tempHeadFormCommonData.status" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="模板编码：" prop="code">
                            <el-input v-model="formData.code"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="模板名称：" prop="name">
                            <el-input v-model="formData.name"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="数据来源：" prop="dataSource">
                            <el-select v-model="formData.dataSource" placeholder="--请选择--" :disabled="editable">
                                <el-option v-for="item in tempHeadFormCommonData.dataSource" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <!-- 标签页区 -->
            <div class="full-dialog-tabs-container">
                <el-tabs v-model="activeTabName">
                    <el-tab-pane label="模板分录" name="one">
                        <div class="my-container">
                            <div class="my-toolbar">
                                <el-button
                                    type="primary"
                                    size="small"
                                    icon="plus"
                                    @click="add()"
                                >新增行

                                </el-button>
                                <el-button
                                    type="danger"
                                    size="small"
                                    icon="close"
                                    @click="del()"
                                >删除行

                                </el-button>
                            </div>
                            <t8t-table
                                ref="t8ttable"
                                :columns="mainTableColumns"
                                :commonData="mainSelectSource"
                                :templateData="mainTemplateData"
                                :dataSource="mainDataSource"
                                :radioCol="true"
                                :editable="true"
                                :pageBar="false"
                                :customColumn="true"
                                @current-row-change="onCurChange"
                                @row-click="rowClicka"
                                row-dobule-click="rowClicka"
                            >
                            </t8t-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="full-dialog-tabs-container">
                <el-tabs v-model="activeTabName2">
                    <el-tab-pane label="辅助核算项" name="one">
                        <div class="my-container">
                            <div class="my-toolbar">
                                <el-button
                                    type="primary"
                                    size="small"
                                    icon="plus"
                                    @click="assistantAdd()"
                                >新增行

                                </el-button>
                                <el-button
                                    type="danger"
                                    size="small"
                                    icon="close"
                                    @click="assistantDel()"
                                >删除行

                                </el-button>
                            </div>
                            <t8t-table
                                ref="assistantTable"
                                :columns="secondTableColumns"
                                :commonData="secondSelectSource"
                                :templateData="templateData"
                                :dataSource="assistantDataSource"
                                :selectCol="true"
                                :editable="true"
                                :pageBar="false"
                                @current-row-change="onSecondChange"
                                @row-click="rowClickAssistant"
                                row-dobule-click="rowClickAssistant"
                            >
                            </t8t-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-dialog>
</template>

<script>

    import commonApi from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    import Utils from 'src/utils/Utils.js'
    import voucherOrderApi from 'src/services/finance/voucherOrder.js'
    import axios from 'src/utils/axios.js'


    export default {
        name: 'voucherTemplate-add-dialog',
        data () {
            return {
                nowRow: null,
                guid: null,
                isDialogShow: true,
                mainEditable: false,
                isLoading: false,
                formData: {
                    organizationId: null,
                    status: 1,
                    code: null,
                    name: null,
                    dataSource: null,
                    createUser: parseInt(Cookie.get('t8t-tc-uid')),
                },
                formRules: {
                    organizationId: [
                        {type: "number", required: true, message: "请选择财务组织", trigger: 'change'}
                    ],
                    status: [
                        {type: "number", required: true, message: "请选择状态", trigger: 'change'}
                    ],
                    code: [
                        {type: 'string', required: true, message: "请填写模板编码", trigger: 'change'}
                    ],
                    name: [
                        {type: 'string', required: true, message: "请填写模板名称", trigger: 'change'}
                    ],
                    dataSource: [
                        {type: 'number', required: true, message: "请填写数据来源", trigger: 'change'}
                    ]
                },
                createUser: parseInt(Cookie.get('t8t-tc-uid')),
                createName: Cookie.get('t8t-tc-username'),
                sourceItemRoute: '/finance/page-voucher-order/detail/sourceItem',
                id: null,
                editMode: 'cell',
                accountId: +Cookie.get('t8t-tc-uid'),
                dialogVisible: true,
                addRowDialogVisible: false,
                activeTabName: 'one',
                activeTabName2: 'one',
                activeTableRef: 'mainTable', //展示中的reftable
                mainTableService: 'N7MleTA0MHTcaUUxIqAYpQ5BwNDA-dv',
                mainTableMethod: 'ZRfQQb0HZZHWBYVveK2YBQBUS8wbNkteXArHCqcUxQ5',//查询模板分录
                mainArgs: {},
                secondTableService: 'N7MleTA0MHTcaUUxIqAYpQ5BwNDA-dv',
                secondTableMethod: 'KAwKSJhjWJ7Jy8TFuV2Kw-uyb6bHthg8-zcC7ihC_mOwUxfw_1l7suP9ltq', //查询辅助核算项views.templateAccountAssistant.queryPage
                secondArgs: {},
                disabledSymbolsTop: ['TEMP-SAVE'],
                disabledSymbolsBody: [],
                mainDataSource: [],
                assistantDataSource: [],
                //新增的参数
                addArgs: [],
                // 用于列表选项或绑定ID的列转为文字
                tempHeadFormCommonData: {
                    status: [
                        {value: 1, text: '启用'},
                        {value: 2, text: '停用'}
                    ],
                    dataSource: [
                        {value: 1, text: '库存明细账'},
                        {value: 2, text: '项目成本表'}
                    ],
                    organizationIds: []
                },
                isTopHide: false,
                // 表单
                tempHeadFormFields: [
                    {
                        type: 'select',
                        label: '财务组织',
                        name: 'organizationId',
                        selectSourceKey: 'organizationId'
                    },
                    {
                        type: 'select',
                        label: '状态',
                        prop: 'status',
                        list: 'status',
                    },
                    {
                        type: 'input',
                        label: '模板编码',
                        prop: 'code'
                    },
                    {
                        type: 'input',
                        label: '模板名称',
                        prop: 'name',
                    },
                    {
                        type: 'select',
                        label: '数据来源',
                        prop: 'dataSource',
                        list: 'dataSource'
                    }
                ],

                tempHeadFormData: {},
                secondTableColumns: [
                    {
                        type: 'input',
                        label: '序号',
                        prop: 'sequenceNumber',
                        editor: {
                            type: 'input',
                            rules: [
                                {
                                    required: true, message: '序号不能为空'
                                },
                                {pattern: /^\+?[1-9][0-9]*$/, message: '只允许正整数'}
                            ]
                        }
                    },
                    {
                        type: 'select',
                        label: '辅助项',
                        prop: 'assistantItemId',
                        list: 'assistantItemId',
                        editor: {
                            type: 'select',
                            rules: [
                                {
                                    required: true, message: '辅助项不能为空'
                                }
                            ]
                        }
                    },
                    {
                        type: 'input',
                        label: '数值来源',
                        prop: 'numericSource',
                        list: 'numericSource',
                        editor: {
                            type: 'select',
                            rules: [
                                {
                                    required: true, message: '数值来源不能为空'
                                }
                            ]
                        }
                    }
                ],
                // 模板分录列
                mainTableColumns: [
                    {
                        type: 'input',
                        label: '序号',
                        prop: 'sequenceNumber',
                        editor: {
                            type: 'input',
                            rules: [
                                {
                                    required: true, message: '序号不能为空'
                                },
                                {pattern: /^\+?[1-9][0-9]*$/, message: '只允许正整数'}
                            ]
                        }
                    },
                    {
                        type: 'input',
                        label: '科目编码',
                        prop: 'accountCode',
                        editor: {
                            type: 'input',
                            rules: [
                                {
                                    required: true, message: '科目编码不能为空'
                                }
                            ]
                        }
                    },
                    {
                        type: 'input',
                        label: '科目名称',
                        prop: 'accountName',
                        editor: {
                            type: 'input',
                            rules: [
                                {
                                    required: true, message: '科目名称不能为空'
                                }
                            ]
                        }
                    },
                    {
                        type: 'select',
                        label: '借贷方向',
                        prop: 'cashFlow',
                        list: 'cashFlow',
                        editor: {
                            type: 'select',
                            rules: [
                                {
                                    required: true, message: '借贷方向不能为空'
                                }
                            ]
                        }
                    },
                    {
                        type: 'select',
                        label: '金额来源',
                        prop: 'amountSource',
                        list: 'amountSource',
                        editor: {
                            type: 'select',
                            rules: [
                                {
                                    required: true, message: '金额来源不能为空'
                                }
                            ]
                        }
                    },
                    {
                        type: 'select',
                        label: '金额方向',
                        prop: 'amountDirect',
                        list: 'amountDirect',
                        editor: {
                            type: 'select',
                            rules: [
                                {
                                    required: true, message: '金额方向不能为空'
                                }
                            ]
                        }
                    },
                    {
                        type: 'input',
                        label: '摘要',
                        prop: 'entryAbstract',
                        editor: {
                            type: 'input'
                        }
                    },
                    {
                        label: '行生成条件',
                        prop: 'formulaId',
                        list: 'formulaId',
                        editor: {
                            type: 'lookup',
                            rules: [
                                {
                                    required: true, message: '行生成条件不能为空'
                                }
                            ],
                            service: 'sU_ZURupR9l-OQWIS4G02Z64tXL41mv', ///biz/t8t-sys-exp/app
                            method: 'DQhney8tXt8iVz-rGCqqLDcaAwX', // formula.queryPage
                            args: {
                                search: {
                                    typeCode: '003003016'
                                }
                            },
                            'columns': [
                                {
                                    'prop': 'id',
                                    'label': '公式id'
                                },
                                {
                                    'prop': 'formulaName',
                                    'label': '公式名称'
                                },
                                {
                                    'prop': 'expression',
                                    'label': '计算表达式'
                                },
                                {
                                    'prop': 'description',
                                    'label': '描述'
                                }
                            ],
                            placeholder: '请按照公式名称查询',
                            'valueExpr': 'id',
                            'filterMethod': function (val, args) {
                                args['search'] = {
                                    'typeCode': '003003016',
                                    'formulaName_like': val,
                                }
                                return args
                            }
                        }
                    }
                ],
                mainTable2Columns: [],

                lookupDataSource: [],
                tempCode: null,
                tempId: null,

                canEditOrg: false, //是否可编辑组织
                mainSelectSource: {
                    cashFlow: [
                        {value: 1, text: '借方'},
                        {value: 2, text: '贷方'}
                    ],
                    amountSource: [
//                        {value: 1, text: '不含税金额合计'},
//                        {value: 2, text: '含税金额合计'},
//                        {value: 3, text: '税额合计'},
//                        {value: 4, text: '工费实际金额合计'},
//                        {value: 5, text: '劳动管理费实际金额合计'},
//                        {value: 6, text: '材料领用实际金额合计'}
                    ],
                    amountDirect: [
                        {value: -1, text: '反向'},
                        {value: 1, text: '正向'}
                    ],
                    formulaId: []
                },
                secondSelectSource: {
                    assistantItemId: [],
                    numericSource: [
//                        {value: 1, text: '项目ID'},
//                        {value: 2, text: '客户'},
//                        {value: 3, text: '供应商'},
//                        {value: 4, text: '仓库分组'},
//                        {value: 5, text: '业务类型'},
//                        {value: 6, text: '项目ID'},
                    ]
                },
                hotRow: [],
                actionModel: '',
            }
        },
        methods: {
            //获取公式
            getFormulaName(){
                let args = {
                    search: {
                        typeCode:'003003016'
                    }
                }
                let list = []
                axios({
                    service: 'sU_ZURupR9l-OQWIS4G02Z64tXL41mv', ///biz/t8t-sys-exp/app
                    method: '0gyU-i.GvzIiZWHkiv8ppfb', // formula.query
                    args: args
                })
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                list.push({
                                    value: item.id,
                                    text: item.formulaName
                                })
                            })
                            this.mainSelectSource.formulaId = list
                        }
                        console.log(this.mainSelectSource.formulaId)
                    })
                    .catch((res) => {
                        this.$message.error('加载公式数据失败')
                        return
                    })
            },
            rowClickAssistant(){
                let dataS = this.formData.dataSource
                if (this.isEmpty(dataS)) {
                    this.$message.error('请先填写数据来源')
                    return false
                } else {
                    if (dataS === 1) {
                        this.secondSelectSource.numericSource = [
                            {value: 1, text: '项目ID'},
                            {value: 2, text: '客户'},
                            {value: 3, text: '供应商'},
                            {value: 4, text: '仓库分组'},
                        ]
                    } else if (dataS === 2) {
                        this.secondSelectSource.numericSource = [
                            {value: 5, text: '业务类型'},
                            {value: 6, text: '项目ID'},
                        ]
                    }
                }
            },
            rowClicka(){
                let dataS = this.formData.dataSource
                if (this.isEmpty(dataS)) {
                    this.$message.error('请先填写数据来源')
                    return false
                } else {
                    if (dataS === 1) {
                        this.mainSelectSource.amountSource = [
                            {value: 1, text: '不含税金额合计'},
                            {value: 2, text: '含税金额合计'},
                            {value: 3, text: '税额合计'}
                        ]
                    } else if (dataS === 2) {
                        this.mainSelectSource.amountSource = [
                            {value: 4, text: '工费实际金额合计'},
                            {value: 5, text: '劳动管理费实际金额合计'},
                            {value: 6, text: '材料领用实际金额合计'}
                        ]
                    }
                }
            },
            onSecondChange(row){
                if (this.isEmpty(this.guid)) {
                    this.$message.error('请先填写模板分录')
                    return false
                }
            },
            // 点击事件
            onCurChange(row){
                if (this.isEmpty(row.guid)) {
                    row.guid = (Math.random() + '').split('.')[1]
                }
                this.guid = row.guid
                this.nowRow = row

                if (this.isEmpty(row.accountAssistantList)) {
                    this.assistantDataSource = []
                    row.accountAssistantList = this.assistantDataSource
                } else {
                    this.assistantDataSource = row.accountAssistantList
                }

            },
            //校验是否为空
            isEmpty(str){
                return str == null || str == 0 || str == '' || str == undefined || str == '0'
            },
            //获取组织
            getOrganizationOptions() {
                // 法人职能和利润中心
                let arg = {
                    funcCodes: ["001004013", "001004014"]
                }
                let list = []
                commonApi.queryByFunctionCode(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.isDel !== 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.name
                                    })
                                }
                            })
                            this.tempHeadFormCommonData.organizationIds = list
                        }
                    })
            },
            //获取辅助核算项
            getAssistantItem() {
                let arg = {
                    page: 1,
                    search: {
                        pPropertyCode: '61014'
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            })
                            this.secondSelectSource.assistantItemId = list
                        }
                    })
            },
            // 编辑页面
            editDate(){
                //封装参数
                this.$refs['formRef'].validate((isValid) => {
                    if (isValid) {
                        this.$refs['t8ttable'].validate((valid) => {
                            if (valid) {
                                this.$refs['assistantTable'].validate((assistantValid) => {
                                    if (assistantValid) {
                                        if (null === this.mainDataSource || this.mainDataSource.length <= 0) {
                                            this.$message.error('请填写模板分录')
                                            return false
                                        }
                                        this.isLoading = true;
                                        // 保存的时候调用新增的按钮
                                        //先调用接口生成模板 然后跳到列表页面
                                        let addArgs = {
                                            voucherTemplate: {
                                                createBy: this.createName,
                                                createName: this.createName,
                                                code: this.formData.code,
                                                name: this.formData.name,
                                                dataSource: this.formData.dataSource,
                                                createUser: this.createUser,
                                                status: this.formData.status,
                                                organizationId: this.formData.organizationId,
                                                templateEntryList: this.mainDataSource
                                            }
                                        }
                                        voucherOrderApi.templateCreate(addArgs).then((res) => {
                                            if (res.data.status === 200) {
                                                this.$msgbox({
                                                    title: '消息',
                                                    type: 'success',
                                                    message: '新增凭证模板成功',
                                                    showCancelButton: false,
                                                    confirmButtonText: '知道了',
                                                    confirmButtonClass: 'is-plain'
                                                })
                                                this.dialogVisible = false
                                                this.$router.push('/finance/page-voucher-template')
                                            } else {
                                                this.isLoading = false
                                                this.$message.error(res.data.message)
                                            }
                                        }).catch((res) => {
                                            this.isLoading = false
                                            this.$msgbox({
                                                title: '消息',
                                                type: 'warning',
                                                message: '网络超时',
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            })
                                        })
                                    } else {
                                        this.$message.error('请将必填数据填完')
                                        return false
                                    }
                                })
                            } else {
                                this.$message.error('请将必填数据填完')
                                return false
                            }
                        })
                    } else {
                        this.$message.error('请将必填数据填完')
                        return false
                    }
                })
            },
            //取消
            cancel(){
                this.dialogVisible = false
                this.$router.push('/finance/page-voucher-template')
            },
            closeDialog(){
                this.dialogVisible = false
                this.$router.push('/finance/page-voucher-template')
            },

            // 模板分录新增
            add() {
                //position
                this.$refs['t8ttable'].addNewRow()
            },
            // 模板分录删除
            del() {
                let delRowData = []
                delRowData.push(this.nowRow)
                if (delRowData.length <= 0 || null === this.nowRow) {
                    this.$message.error('请先选择数据然后进行删除操作')
                    return false
                }
                this.$refs['t8ttable'].delRows(delRowData)
            },
            // 辅助核算项新增
            assistantAdd() {
                this.$refs['assistantTable'].addNewRow()
            },
            // 辅助核算项删除
            assistantDel() {
                this.$refs['assistantTable'].delRows()
            }
        },
        created() {
            //获取组织
            this.getOrganizationOptions()
            this.getAssistantItem()
            this.getFormulaName()
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
