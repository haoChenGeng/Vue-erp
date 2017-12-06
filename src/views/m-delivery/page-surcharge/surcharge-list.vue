<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"
            @list-view="doView"
            @list-approval-flow="flowBtn"
            @table-row-dobule-click="doView"
            @search-submit="onSearchSubmit"
        >
        </t8t-list-view>          
        <t8t-step-page
            :args="flowArgs"
            :service="flowService"
            :method="flowMethod"
            :dataSource="flowData"
            v-if="isShowFlow"
            @close="closeStepPage">
        </t8t-step-page>
    </div>
</template>

<script>
    import Service from 'src/services/delivery/surcharge/Service.js'
    import Cookie from 'js-cookie'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    export default {
        components: {T8tStepPage},
        data () {
            return {                
                // 详情页路由地址
                detailRoute: '/delivery/page-surcharge-detail',
                // service 和 method 目前需要加密
                service: Service.SURCHARGE.name,
                method: Service.SURCHARGE.methods.QUERYPAGE,
                tableArgs: {
                    "search": {
                        "supplierName_like": null,
                        "verifyStatus": null,
                        "settleStatus": null,
                        "createTime_gte": null,
                        "createTime_lte": null
                    }
                },

                // 表头描述
                tableColumns: [
                    {prop: 'code', label: '单据编码'},
                    {prop: 'supplierName', label: '供应商名称'},
                    {prop: 'surchargeTypeName', label: '附加费类别'},
                    {prop: 'sourceOrderType', label: '关联单据类型'},
                    {prop: 'sourceOrderCode', label: '关联单据编码'},
                    {prop: 'applyAmount', label: '申请金额'},
                    {prop: 'realAmount', label: '实付金额'},
                    {prop: 'verifyStatus', label: '数据状态', list: 'verifyStatusOpt'},
                    {prop: 'settleStatus', label: '结算状态', list: 'settleStatusOpt'},
                    {prop: 'createUserName', label: '创建人'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'}
                ],

                // 搜索项配置
                searchFields: [
                    {type: 'input', label: '单据编码', name: 'code_like'},
                    {type: 'input', label: '商家名称', name: 'supplierName_like'},
                    {type: 'select', label: '数据状态', name: 'verifyStatus',selectSourceKey:"verifyStatusOpt"},
                    {type: 'select', label: '结算状态', name: 'settleStatus', selectSourceKey: "settleStatusOpt"},
                    { type: 'datepicker',
                        label: '创建时间',
                        pickertype: 'daterange',
                        startField: 'createTime_gte',
                        endField: 'createTime_lte'
                    }
                ],

                // 搜索项对应值
                searchOptions: {
                    verifyStatusOpt:[
                        {value:0,text:"无状态"},
                        {value:1,text:"暂存(新生成)"},
                        {value:2,text:"审核中"},
                        {value:3,text:"暂存(重新审核)"},
                        {value:4,text:"已审核"},
                        {value:5,text:"已关闭"}
                    ],
                    settleStatusOpt:[
                        {value:0,text:"无状态"},
                        {value:1,text:"待结算"},
                        {value:2,text:"结算中"},
                        {value:3,text:"已结算"}                        
                    ],
                    sourceOrderTypeOpt:[
                        {value:0,text:''},
                        {value:1,text:'直运采购订单'},
                        {value:2,text:'安装单'},
                        {value:3,text:'测量单'},
                        {value:4,text:'标准采购订单'},
                    ]
                },
                flowArgs: {},
                flowService: Service.SURCHARGE.name,
                flowMethod: Service.SURCHARGE.methods.GETPROCESSDETAILBYID,
                flowData: [],
                isShowFlow: false
            }
        },
        created(){
            // let _self = this
        },
        methods: {
            doView () {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    this.$router.push({
                        path: this.detailRoute,
                        query: {id: selections[0].id}
                    })
                } else {
                    this.$message.error("请选择操作单据后重试")
                }
            },
            onSearchSubmit (obj) {
                this.tableArgs = {"search": obj}
            },
            flowBtn(){
                this.$TCS.addTag('red_13937_010007009002') //点击流
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if(selections.length > 1) {
                         this.$message.error("请选择单条操作单据后重试")
                         return
                    }
                    if(!selections[0].processId) {
                        this.$message.error("该单据未启动流程")
                         return
                    }
                    this.flowArgs = {id: selections[0].id}
                    this.isShowFlow = true
                } else {
                    this.$message.error("请选择操作单据后重试")
                }
            },
            closeStepPage(){
                this.isShowFlow = false
            }
        }
    }
</script>
