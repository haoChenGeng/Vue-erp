<template>
    <div class="templateView">
        <el-dialog size="full" class="t8t-full-dialog2 dialog-new" v-model="dialogVisible" :show-close="false"
                   :close-on-press-escape="false" :class="{'isHide': isTopHide}">

            <div class="t8t-full-dialog2-container">
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <div>
                            <el-button @click="editDateTemplate()">编辑</el-button>
                            <el-button @click="cancel()">关闭</el-button>
                        </div>
                    </div>
                </div>

                <div class="dialog2-main-container">
                    <div class="full-dialog-form-container">
                        <t8t-form-panel
                            :dataSource="tempHeadFormData"
                            :fields="tempHeadFormFields"
                            :commonData="tempHeadFormCommonData"
                            :disabled="disabled"
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
                                    <t8t-table
                                        :columns="mainTableColumns"
                                        :service="mainTableService"
                                        :method="mainTableMethod"
                                        :commonData="mainSelectSource"
                                        :args="mainArgs"
                                        ref="mainTable"
                                        :pageBar="true"
                                        :radioCol="true"
                                        @row-click="mainTableClick"
                                        @row-dobule-click="mainTableClick"
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
                                    <t8t-table
                                        :columns="secondTableColumns"
                                        :service="secondTableService"
                                        :method="secondTableMethod"
                                        :commonData="secondSelectSource"
                                        :args="secondArgs"
                                        ref="secondTable"
                                        :pageBar="true"
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
        name: "templateView",
        components: {},
        data(){
            return {
                sourceItemRoute: '/finance/page-voucher-order/detail/sourceItem',
                id: null,
                editMode: 'cell',
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
                        disabled: true
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
                        disabled: true
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
                        prop: 'sequenceNumber'
                    },
                    {
                        type: 'select',
                        label: '辅助项',
                        prop: 'assistantItemId',
                        list: 'assistantItemId'
                    },
                    {
                        type: 'input',
                        label: '数值来源',
                        prop: 'numericSource',
                        list: 'numericSource'
                    }
                ],
                mainTableColumns: [
                    {
                        type: 'input',
                        label: '序号',
                        prop: 'sequenceNumber'
                    },
                    {
                        type: 'input',
                        label: '科目编码',
                        prop: 'accountCode'
                    },
                    {
                        type: 'input',
                        label: '科目名称',
                        prop: 'accountName'
                    },
                    {
                        type: 'select',
                        label: '借贷方向',
                        prop: 'cashFlow',
                        list: 'cashFlow',
                    },
                    {
                        type: 'select',
                        label: '金额来源',
                        prop: 'amountSource',
                        list: 'amountSource',
                    },
                    {
                        type: 'select',
                        label: '金额方向',
                        prop: 'amountDirect',
                        list: 'amountDirect',
                    },
                    {
                        type: 'input',
                        label: '摘要',
                        prop: 'entryAbstract',
                    },
                    {
                        type: 'select',
                        label: '行生成条件',
                        prop: 'formulaId',
                        list: 'formulaId',
                    }
                ],
                mainTable2Columns: [],

                lookupDataSource: [],
                tempCode: null,
                tempId: null,

                canEditOrg: false, //是否可编辑组织
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
                hotRow: [],
                actionModel: '',
                formulaId: null,
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
                }
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
            showItemDialog (data) {
                this.$router.push({path: this.sourceItemRoute, query: {voucherEntryId: data, voucherOrderId: this.id}})
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
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            cancel(){
                this.closeDialog()
            },
            // 编辑页面
            editDateTemplate(){
                this.dialogVisible = false
                this.$router.push({path: '/finance/page-voucher-template/edit', query: {id: this.id}})
            },
            mainTableClick(){
                let selections = this.$refs['mainTable'].getSelectRows()
                if (selections.length === 0) {
                    return false
                } else if (selections.length > 1) {
                    return false
                }
                let selectRow = selections[0]
                this.formulaId = selectRow.formulaId
                this.secondArgs = {
                    search: {
                        templateEntryId: selectRow.id
                    }
                }
            },
            isEmpty(str){
                return str == null || str == 0 || str == '' || str == undefined || str == '0'
            },
            isNull(str){
                return str == null || str == '' || str == undefined
            },

            closeDialog(){
                this.dialogVisible = false
                this.$router.push('/finance/page-voucher-template')
                //this.$router.push({ path: '/finance/page-voucher-template/edit' , query: { id:this.id}})
            },
        }
    }
</script>
<style lang="css" scoped>
    .g-main-container-column {
        /*min-height: 300px;*/
    }
</style>
<style>
    .templateView .t8t-form-panel {
        margin: 0 auto;
    }

    .templateView .t8t-form-panel .el-form .el-col {
        min-height: 50px;
    }

    .templateView {
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
