<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
            >
        </t8t-search>
        <t8t-toolbar
            @RECEIPT="receiptBtnClick"
            @VIEW="viewBtnClick"
            @ONLINERECEIPT="onlineReceipt"
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



        <receipt-channel-dialog
            v-if="dialogVisible"
            :rowId="rowId"
            :editType="editType"
            :channelOptions="channelOptions"
            @close="dialogVisible=false"
            @getTableData="getTableData"
            :commonOptionsConfig="selectSource"
        >
        </receipt-channel-dialog>
    </div>
</template>

<script>
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/finance/Service.js'
    import receiptChannelDialog from './receipt-channel-dialog.vue'

    export default {
        name: 'page-pay-plan',

        components: {
            receiptChannelDialog
        },
        data() {
            return {
                //搜索表单项配置
                fields: [
                    {type: 'select',label: '业务类型',name: 'bizId', selectSourceKey:'businessTypeCode'},
                    {type: 'select',label: '收款对象',name: 'receiptRoleId',selectSourceKey:'debitObjectCode'},
                    {type: 'select',label: '款项用途',name: 'fundPurposeId',selectSourceKey:'fundPurpose'},
                    {type: 'input',label: '单据编号',name: 'code_like'},
                    {type: 'input',label: '项目ID',name: 'projectId_like'},
                    {type: 'select',label: '核销状态',name:'verifyStatus', selectSourceKey:'verifyStatusSource'}
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    businessTypeCode: [],
                    debitObjectCode: [],
                    fundPurpose: [],
                    verifyStatusSource:[
                        {
                            value:1,
                            text:'未核销'
                        },
                        {
                            value:2,
                            text:'部分核销'
                        },
                        {
                            value:3,
                            text:'已核销'
                        }

                    ]
                },

                //面包屑
                breadcrumbData: [
                    { title: '财务' },
                    { title: '资金管理' },
                    { title: '收款计划单' }],

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
                editType: 'add',
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
            this.getCommonOptions('11008','businessTypeCode')
            this.getCommonOptions('61004','debitObjectCode')
            this.getCommonOptions('61003','fundPurpose')
        },
        methods: {
            //搜索，提交搜索并且发起刷新表格数据的请求
            submitSearch(data) {
                this.args = {
                    search: data,
                    sort: ['id_desc']
                }
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
                apiCommon.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            };
                        })
                        this.selectSource[selectName] = list
                    }
                })
            },
            //工具条按钮 线下收款按钮
            receiptBtnClick: function(){
                this.$TCS.addTag('erp_finance_007005001001')
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选收款计划单后再试。')
                }
                else {
                    var selectIds = []
                    if (selections.length>1) {
                        var sameOrganization = true

                        var organization = selections[0].finOrgId
                        for(let i = 0;i < selections.length; i++){
                       //已核销状态不能收款
                            if (selections[i].verifyStatus===3) {
                                this.$message.error('已核销的计划单不能再进行收款。')
                                return
                            };
                            // 已作废状态不能收款
                            if (selections[i].orderStatus===2) {
                                this.$message.error('已作废的计划单不能再进行收款。')
                                return
                            };
                            if (selections[i].finOrgId!==organization) {
                                sameOrganization = false
                                break;
                            };
                        }
                        if (!sameOrganization) {
                            this.$message.error('请勾选相同组织的收款计划单后再试。')
                        }
                        else {
                            //多行
                            for(let i = 0;i < selections.length; i++){
                                selectIds.push(selections[i].id)
                            }
                            this.$router.push({
                                path:'/tochat-finance/page-pay-plan/pay',
                                query:{selectIds:selectIds,organization:selections[0].finOrgId}
                            })
                        }
                    }
                    else {
                        //单行
                        //已核销状态不能收款
                        if (selections[0].verifyStatus===3) {
                            this.$message.error('已核销的计划单不能再进行收款。')
                            return
                        };
                        if (selections[0].orderStatus===2) {
                            this.$message.error('已作废的计划单不能再进行收款。')
                            return
                        };
                        selectIds.push(selections[0].id)
                        this.$router.push({path:'/tochat-finance/page-pay-plan/pay',
                            query:{
                                selectIds:selectIds,
                                organization: selections[0].finOrgId
                            }
                        })
                    }
                }
            },
            // 线上收款按钮
            onlineReceipt:function () {
                this.$TCS.addTag('erp_finance_007005001003')
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选收款计划单后再试。')
                }
                else {
                    var selectIds = []
                    if (selections.length>1) {
                        this.$message.error('请对单条数据进行操作。')
                        return
                    }
                    else {
                        // 单行
                        // 已核销状态不能收款
                        if (selections[0].verifyStatus===3) {
                            this.$message.error('已核销的计划单不能再进行收款。')
                            return
                        };
                        if (selections[0].orderStatus===2) {
                            this.$message.error('已作废的计划单不能再进行收款。')
                            return
                        };
                        selectIds.push(selections[0].id)
                            this.editType = 'add',
                            this.dialogVisible = true,
                            this.rowId = selectIds
                    }
                }
            },
            viewBtnClick: function(){
                this.$TCS.addTag('erp_finance_007005001002')
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选收款计划单后再试。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                }else{
                    this.$router.push({path:'/tochat-finance/page-pay-plan/see',query:{rowId:selections[0].id}})
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
