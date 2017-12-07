<template>
    <div class="templateEdit">
        <el-dialog size="full" class="t8t-full-dialog2 dialog-new" v-model="dialogVisible" :show-close="false"
                   :close-on-press-escape="false" :class="{'isHide': isTopHide}">

            <div class="t8t-full-dialog2-container">
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <div>
                            <el-button @click="editDate()" :loading="isLoading">保存</el-button>
                            <el-button @click="cancel()">取消</el-button>
                        </div>
                    </div>
                </div>

                <div class="dialog2-main-container">
                    <div class="full-dialog-form-container">
                        <t8t-form-panel
                            :dataSource="tempHeadFormData"
                            :fields="tempHeadFormFields"
                            :commonData="tempHeadFormCommonData"
                            ref="mainForm"
                        >
                        </t8t-form-panel>
                    </div>

                    <div class="full-dialog-tabs-container">
                        <!--行操作工具栏-->
                        <div class="g-main-container-column">
                            <el-tabs v-model="activeTabName" @tab-click="tabClick" ref="tabs1">
                                <el-tab-pane label="模板分录"
                                             class="tableDebitType"
                                             name="one">
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
                                        :columns="mainTableColumns"
                                        :service="mainTableService"
                                        :method="mainTableMethod"
                                        :commonData="mainSelectSource"
                                        :args="mainArgs"
                                        :dataSource="mainDataSource"
                                        ref="mainTable"
                                        :radioCol="true"
                                        :pageBar="false"
                                        :editable="true"
                                        @current-row-change="mainTableClick"
                                        @data-loaded="onDataLoadedMain"
                                    >
                                    </t8t-table>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                    <div class="full-dialog-tabs-container">
                        <!--行操作工具栏-->
                        <div class="g-main-container-column">
                            <el-tabs v-model="activeTabName2" @tab-click="tabClick" ref="tabs2">
                                <el-tab-pane label="辅助核算项"
                                             class="assiatant"
                                             name="one">
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
                                        :columns="secondTableColumns"
                                        :service="secondTableService"
                                        :method="secondTableMethod"
                                        :commonData="secondSelectSource"
                                        :args="secondArgs"
                                        :dataSource="assistantDataSource"
                                        ref="secondTable"
                                        :pageBar="false"
                                        :editable="true"
                                        @current-row-change="onSecondChange"
                                    >
                                    </t8t-table>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>

    import {M, mb, getTextById} from 'src/components/t8t-table/utils/utils.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    import axios from 'src/utils/axios.js'
    import voucherOrderApi from 'src/services/finance/voucherOrder.js'

    export default {
        name: "templateEdit",
        components: {},
        data(){
            return {
                templateName: null,
                isLoading: false,
                sourceItemRoute: '/tochat-finance/page-voucher-order/detail/sourceItem',
                id: null,
                createUser: parseInt(Cookie.get('t8t-tc-uid')),
                createName: Cookie.get('t8t-tc-username'),
                dialogVisible: true,
                activeTabName: 'one',
                activeTabName2: 'one',
                activeTableRef: 'mainTable', //展示中的reftable
                mainTableService: 'N7MleTA0MHTcaUUxIqAYpQ5BwNDA-dv',
                mainTableMethod: 'ZRfQQb0HZZHWBYVveK2YBQBUS8wbNkteXArHCqcUxQ5',//查询模板分录
                mainArgs: {},
                secondTableService: 'N7MleTA0MHTcaUUxIqAYpQ5BwNDA-dv',
                secondTableMethod: 'KAwKSJhjWJ7Jy8TFuV2Kw-uyb6bHthg8-zcC7ihC_mOwUxfw_1l7suP9ltq', //查询辅助核算项views.templateAccountAssistant.queryPage
                secondArgs: {},
                currentRow: {},
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
                    organizationId: []
                },
                isTopHide: false,
                // 表单
                tempHeadFormFields: [
                    {
                        type: 'select',
                        label: '财务组织',
                        prop: 'organizationName',
                        disabled: true
                    },
                    {
                        type: 'select',
                        label: '状态',
                        prop: 'status',
                        list: 'status',
                        rules: [{
                            required: true,
                            message: '状态不能为空'
                        }]
                    },
                    {
                        type: 'input',
                        label: '模板编码',
                        prop: 'code',
                        disabled: true
                    },
                    {
                        type: 'input',
                        label: '模板名称',
                        prop: 'name',
                        rules: [{
                            required: true,
                            message: '模板名称不能为空'
                        }]
                    },
                    {
                        type: 'select',
                        label: '数据来源',
                        prop: 'dataSource',
                        list: 'dataSource',
                        disabled: true
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
                formData: {},
                mainSelectSource: {
                    cashFlow: [
                        {value: 1, text: '借方'},
                        {value: 2, text: '贷方'}
                    ],
                    amountSource: [
                        {value: 1, text: '不含税金额合计'},
                        {value: 2, text: '含税金额合计'},
                        {value: 3, text: '税额合计'},
                        {value: 4, text: '工费实际金额合计'},
                        {value: 5, text: '劳动管理费实际金额合计'},
                        {value: 6, text: '材料领用实际金额合计'}
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
                        {value: 1, text: '项目ID'},
                        {value: 2, text: '客户'},
                        {value: 3, text: '供应商'},
                        {value: 4, text: '仓库分组'},
                        {value: 5, text: '业务类型'},
                        {value: 6, text: '项目ID'},
                    ]
                },
                nowRow: null,
                templateEntryDeleteIds: [],
                guid: null,
            }
        },

        created(){
            // 点击的数据的主键id
            this.id = this.$route.query.id
            this.getMainTableSource()
            this.getOrganizationOptions()
            this.getAssistantItem()
            this.getFormulaName()
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
                    })
                    .catch((res) => {
                        this.$message.error('加载公式数据失败')
                        return
                    })
            },
            // table加载完后触发
            onDataLoadedMain(){
                let firstRow = this.$refs['mainTable'].dataSource
                if (null == firstRow || firstRow.length <= 0) {
                    return false
                } else {
                    let row = firstRow[0]
                    this.$refs.mainTable.$refs.table.store.states.currentRow = row
                    row.guid = (Math.random() + '').split('.')[1]
                    this.guid = row.guid
                    this.secondArgs = {
                        search: {
                            templateEntryId: row.id
                        },
                        page: 1,
                        size: 100
                    }
                    voucherOrderApi.templateAssistantQuery(this.secondArgs).then((res) => {
                        let response = res.data
                        if (response && response.status == 200) {
                            row.accountAssistantList = response.result.rows
                        }
                    }).catch((res) => {
                        this.$message.error('加载数据失败')
                        return
                    })
                }
            },
            onSecondChange(row){
                if (this.isEmpty(this.guid)) {
                    this.$message.error('请先填写模板分录')
                    return false
                }
                let dataS = this.tempHeadFormData.dataSource
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
                this.$refs['mainTable'].dataSource.forEach((res) => {
                    if (res.guid === this.guid) {
                        res.accountAssistantList = this.$refs['secondTable'].dataSource
                    }
                })
            },
            // 编辑页面
            editDate(){
                // 保存的时候调用修改的按钮
                this.$refs['mainForm'].validate((formValid) => {
                    if (formValid) {
                        this.$refs['mainTable'].validate((isValid) => {
                            if (isValid) {
                                this.$refs['secondTable'].validate((assistantValid) => {
                                    if (assistantValid) {
                                        this.isLoading = true;
                                        let updateArgs = null
                                        if (this.templateName === this.tempHeadFormData.name) {
                                            //名称没有修改，所以不用传过去
                                            updateArgs = {
                                                voucherTemplate: {
                                                    id: this.tempHeadFormData.id,
                                                    status: this.tempHeadFormData.status,
                                                    updateBy: this.createName,
                                                    updateName: this.createName,
                                                    updateUser: this.createUser,
                                                    templateEntryList: this.$refs['mainTable'].dataSource,
                                                    templateEntryDeleteIds: this.templateEntryDeleteIds
                                                }
                                            }
                                        } else {
                                            updateArgs = {
                                                voucherTemplate: {
                                                    id: this.tempHeadFormData.id,
                                                    name: this.tempHeadFormData.name,
                                                    status: this.tempHeadFormData.status,
                                                    updateBy: this.createName,
                                                    updateName: this.createName,
                                                    updateUser: this.createUser,
                                                    templateEntryList: this.$refs['mainTable'].dataSource,
                                                    templateEntryDeleteIds: this.templateEntryDeleteIds
                                                }
                                            }
                                        }
                                        voucherOrderApi.templateUpdate(updateArgs).then((res) => {
                                            if (res.data.status === 200) {
                                                this.$msgbox({
                                                    title: '消息',
                                                    type: 'success',
                                                    message: '修改凭证模板成功',
                                                    showCancelButton: false,
                                                    confirmButtonText: '知道了',
                                                    confirmButtonClass: 'is-plain',
                                                })
                                                this.dialogVisible = false
                                                this.$router.push('/tochat-finance/page-voucher-template')
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
            // 模板分录新增
            add() {
                //position
                this.$refs['mainTable'].addNewRow()
            },
            // 模板分录删除
            del() {
                let delRowData = []
                delRowData.push(this.nowRow)
                if (delRowData.length <= 0 || null === this.nowRow) {
                    this.$message.error('请先选择数据然后进行删除操作')
                    return false
                }
                this.$refs['mainTable'].delRows(delRowData)
                // 如果删除的行id存在，那么添加进删除行的list中
                if (!this.isEmpty(this.nowRow.id)) {
                    this.templateEntryDeleteIds.push(this.nowRow.id)
                }
                this.$refs['secondTable'].dataSource = []
            },
            // 辅助核算项新增
            assistantAdd() {
                this.$refs['secondTable'].addNewRow()
            },
            // 辅助核算项删除
            assistantDel() {
                // 如果数据id存在那么将id存在分录中
                let selectRows = this.$refs['secondTable'].getSelectRows()
                if (selectRows.length <= 0) {
                    this.$message.error('请先选择数据然后进行删除操作')
                    return false
                }
                let deleteIds = []
                selectRows.forEach((delet) => {
                    if (!this.isEmpty(delet.id)) {
                        deleteIds.push(delet.id)
                    }
                })
                this.$refs['mainTable'].dataSource.forEach((res) => {
                    if (res.guid === this.guid) {
                        if (deleteIds.length > 0) {
                            if (null === res.accountAssistantDeleteIds || this.isEmpty(res.accountAssistantDeleteIds)) {
                                res.accountAssistantDeleteIds = deleteIds
                            } else {
                                res.accountAssistantDeleteIds.forEach((ids) => {
                                    deleteIds.push(ids)
                                })
                                res.accountAssistantDeleteIds = deleteIds
                            }
                        }
                    }
                })
                this.$refs['secondTable'].delRows()
            },
            //获取表单的数据
            getMainTableSource(){
                let args = {
                    id: this.id
                }
                axios({
                    service: 'N7MleTA0MHTcaUUxIqAYpQ5BwNDA-dv', //查询凭证的方法以及服务t8t-fi-fvg
                    method: 'Nnqah_RiflEpN6lrNYSbCVcc2wgcFinKtNefqXzRFVl',//views.voucherTemplate.findById
                    args: args
                })
                    .then((res) => {
                        let response = res.data
                        if (response && response.status == 200) {
                            this.tempHeadFormData = response.result
                            this.templateName = this.tempHeadFormData.name
                            this.mainArgs = {
                                search: {
                                    voucherTemplateId: this.id
                                },
                                page: 1,
                                size: 100
                            }
                            voucherOrderApi.templateEntryQuery(this.mainArgs).then((res) => {
                                if (res.data.status === 200) {
                                    let selectRowTemplate = res.data.result.rows
                                    if (selectRowTemplate.length > 0) {
                                        this.secondArgs = {
                                            search: {
                                                templateEntryId: selectRowTemplate[0].id
                                            },
                                            page: 1,
                                            size: 100
                                        }
                                    } else {
                                        this.$refs['secondTable'].dataSource = []
                                    }
                                } else {
                                    this.$refs['secondTable'].dataSource = []
                                }
                            })
                        }
                    })
                    .catch((res) => {
                        this.$message.error('加载数据失败')
                        return
                    })
            },
            getOrganizationOptions() {
                // 法人职能和利润中心
                let arg = {
                    funcCodes: ["001004013", "001004014"]
                }
                let list = []
                apiCommon.queryByFunctionCode(arg)
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
                apiCommon.queryUnionParent(arg)
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
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            cancel(){
                this.closeDialog()
            },

            mainTableClick(row){
                //根据数据来源判断金额来源
                let dataS = this.tempHeadFormData.dataSource
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
                //设置对应的数据
                if (this.isEmpty(row.guid)) {
                    row.guid = (Math.random() + '').split('.')[1]
                    this.guid = row.guid
                    this.nowRow = row
                    if (this.isEmpty(row.id)) {
                        //新增的行
                        this.$refs['secondTable'].dataSource = []
                        row.accountAssistantList = []
                    } else {
                        //已有的行
                        // 调服务
                        this.secondArgs = {
                            search: {
                                templateEntryId: row.id
                            },
                            page: 1,
                            size: 100
                        }
                        voucherOrderApi.templateAssistantQuery(this.secondArgs).then((res) => {
                            let response = res.data
                            if (response && response.status == 200) {
                                this.$refs['secondTable'].dataSource = response.result.rows
                                row.accountAssistantList = response.result.rows
                            }
                        }).catch((res) => {
                            this.$message.error('加载数据失败')
                            return
                        })
                    }
                } else {
                    this.guid = row.guid
                    this.nowRow = row
                    this.$refs['secondTable'].dataSource = row.accountAssistantList
                }
            },
            isEmpty(str){
                return str == null || str == 0 || str == '' || str == undefined || str == '0'
            },
            closeDialog(){
                this.dialogVisible = false
                this.$router.push({path: '/tochat-finance/page-voucher-template'})
            }
        }
    }
</script>
<style lang="css" scoped>
    .g-main-container-column {
        /*min-height: 300px;*/
    }
</style>
<style>
    .templateEdit .t8t-form-panel {
        margin: 0 auto;
    }

    .templateEdit .t8t-form-panel .el-form .el-col {
        min-height: 50px;
    }

    .templateEdit {
        width: 1200px;
        margin: 30px auto 5px;
        /*overflow: hidden;*/
    }

    .el-table__body-wrapper {
        /*display: flex;*/
    }

    .toolbar-white .full-dialog-toolbar-container {
        height: 38px;
        background-color: white !important;
    }

    .toolbar-white .toolbar-container {
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: white !important;
    }

    .toolbar-white .toolbar-container .el-button {
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: white !important;
        color: #d1dde9;
        border: 1px solid #09131d;
    }

    .toolbar-white .toolbar-container .el-button:hover {
        color: #1e3046;
        background-color: white !important;
    }

    /*定值风格*/
    .toolbar-white {
        background-color: white !important;
    }

    .t8t-full-dialog2 .toolbar-container .el-button {
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }

    .t8t-full-dialog2 .toolbar-container .el-button:hover {
        color: #1e3046;
        background-color: #d2deeb;
    }
</style>
