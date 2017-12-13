<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            :formData="searchFormData"
            :ref="t8tSearch"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-toolbar
            @UPDATE="updateBtnClick"
            @CANCEL="cancelBtnClick"
        >
        </t8t-toolbar>
        <t8t-table
            :columns="columns"
            :commonData="commonData"
            :service="service"
            :method="method"
            :args="args"
            ref="t8tTable"
            @row-double-click="viewBtnClick"
        >
            <!--用于自定义列模板-->
            <template slot="verifyStatus" scope="scope">
                <span
                    v-if="scope.row['verifyStatus']===1||scope.row['verifyStatus']===2"
                    style="color:red; font-size: 25px"
                >●</span>
                <span
                    v-else-if="scope.row['verifyStatus']===3"
                    style="color:green; font-size: 25px"
                >●</span>
            </template>
        </t8t-table>


        <dialog-update
            v-if="dialogVisible"
            :dialogTitle="dialogTitle"
            :rowId="rowId"
            :editType="editType"
            :selectSource="selectSource"
            @close="dialogVisible=false"
            @getTableData="getTableData"
        >
        </dialog-update>
    </div>
</template>

<script>
    import DialogUpdate from './dialog-update.vue'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/finance/Service.js'
    import Cookie from 'js-cookie'
    import receiptChannelDialog from './receipt-channel-dialog.vue'
    import receiptPlanOrderApi from 'src/services/finance/receiptPlanOrder.js'
    import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
    export default {
        name: 'page-pay-plan-update',
        components: {
            DialogUpdate
        },
        data () {
            return {
                //搜索表单项配置
                fields: [
                    {type: 'select', label: '业务类型', name: 'bizId', selectSourceKey: 'businessTypeCode'},
                    {type: 'select', label: '收款对象', name: 'receiptRoleId', selectSourceKey: 'debitObjectCode'},
                    {type: 'select', label: '款项用途', name: 'fundPurposeId', selectSourceKey: 'fundPurpose'},
                    {type: 'input', label: '单据编号', name: 'code_like'},
                    {type: 'input', label: '项目ID', name: 'projectId_like'},
                    {type: 'select', label: '核销状态', name: 'verifyStatus', selectSourceKey: 'verifyStatusSource'}
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    businessTypeCode: [],
                    debitObjectCode: [],
                    fundPurpose: [],
                    verifyStatusSource: [
                        {
                            value: 1,
                            text: '未核销'
                        },
                        {
                            value: 2,
                            text: '部分核销'
                        },
                        {
                            value: 3,
                            text: '已核销'
                        }

                    ]
                },

                //面包屑
                breadcrumbData: [
                    {title: '设计管理'},
                    {title: '款项管理'},
                    {title: '收款计划单'}],

                //表格
                columns: [{
                    prop: 'verifyStatus',
                    label: '核销状态'
                }, {
                    prop: 'code',
                    label: '单据编号'
                }, {
                    prop: 'saleOrgName',
                    label: '销售组织'
                }, {
                    prop: 'finOrgName',
                    label: '财务组织'
                }, {
                    prop: 'bizName',
                    label: '业务类型'
                }, {
                    prop: 'receiptRoleName',
                    label: '收款对象'
                }, {
                    prop: 'receiptorId',
                    label: '收款对象ID'
                }, {
                    prop: 'receiptorName',
                    label: '收款对象名称'
                }, {
                    prop: 'fundPurposeName',
                    label: '款项用途'
                }, {
                    prop: 'projectId',
                    label: '项目ID'
                }, {
                    prop: 'oughtAmount',
                    label: '应收金额'
                }, {
                    prop: 'realAmount',
                    label: '已收金额'
                }, {
                    prop: 'orderStatus',
                    label: '单据状态',
                    list: 'orderStatus'
                }, {
                    prop: 'bizSourceName',
                    label: '业务来源'
                }, {
                    prop: 'createName',
                    label: '创建人'
                }, {
                    prop: 'createTime',
                    label: '创建时间',
                    formatter: "dateParser"
                }],
                dialogVisible: false,
                editType: 'edit',
                rowId: null,
                //请求参数配置
                service: Service.RECEIPTPLANORDER.name,
                method: Service.RECEIPTPLANORDER.methods.QUERYPAGE,
                args: {
                    sort: ['id_desc']
                },
                commonData: {
                    orderStatus: [
                        {
                            text: '作废',
                            value: 2
                        },
                        {
                            text: '有效',
                            value: 1
                        }
                    ]
                }
            }
        },
        created() {
            // 获取搜索项下拉列表数据
            this.getCommonOptions('11008', 'businessTypeCode')
            this.getCommonOptions('61004', 'debitObjectCode')
            this.getCommonOptions('61003', 'fundPurpose')
        },
        methods: {
            //搜索，提交搜索并且发起刷新表格数据的请求
            submitSearch(obj) {
                this.searchFormData = {...obj}
                this.args = {
                    search: obj,
                    sort: ['id_desc']
                }
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
                                        text: item.propertyName
                                    })
                                }
                                ;
                            })
                            this.selectSource[selectName] = list
                        }
                    })
            },
            // 收款计划单修改按钮
            updateBtnClick: function () {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选收款计划单后再试。')
                }
                else {
                    var selectIds = []
                    if (selections.length > 1) {
                        this.$message.error('请对单条数据进行操作。')
                        return
                    }
                    else {
                        // 单行
                        // 只有未核销的才能核销
                        if (selections[0].verifyStatus === 1) {
                            if (selections[0].orderStatus === 2) {
                                this.$message.error('已作废的计划单。')
                                return
                            }
                            // 组装参数调用update接口
                            selectIds.push(selections[0].id)
                            this.dialogTitle = '修改收款计划单应收金额'
                            this.editType = 'edit'
                            this.dialogVisible = true
                            this.rowId = selections[0].id
                            return
                        }
                        else {
                            this.$message.error('已有收款金额请取消核销!')
                            return
                        }
                    }
                }
            },
            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },
            // 收款计划单作废按钮
            cancelBtnClick: function () {
//                this.$TCS.addTag('erp_finance_007005001001')
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选收款计划单后再试。')
                }
                else {
                    var selectIds = []
                    if (selections.length > 1) {
                        this.$message.error('请对单条数据进行操作。')
                        return
                    }
                    else {
                        // 单行
                        // 只有未核销的才能作废
                        if (selections[0].verifyStatus === 1) {
                            if (selections[0].orderStatus === 2) {
                                this.$message.error('已作废的计划单。')
                                return
                            }
                            // 组装参数调用update接口
                            selectIds.push(selections[0].id)
                            //
                            if (selectIds.length > 0) {
                                let args = {
                                    receiptOrderPlanIds: selectIds,
                                    operId: parseInt(Cookie.get('t8t-tc-uid'))
                                }
                                receiptPlanOrderApi.receiptPlanOrderCancel(args)
                                    .then((res) => {
                                        if (res.data.status === 200) {
                                            this.$msgbox(mb('作废成功', 'success'))
                                            this.$refs['t8tTable'].reloadTable()
                                        }
                                        else {
                                            this.$message.error(res.data.message)
                                        }
                                    })
                            }
                            return
                        }
                        else {
                            this.$message.error('已有收款金额请取消核销!')
                            return
                        }
                    }
                }
            }
        }
    }

</script>

<style
    lang="css"
    scoped
>
</style>


<style>

</style>
