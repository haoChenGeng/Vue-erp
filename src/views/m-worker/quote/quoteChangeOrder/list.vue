<template>
    <div class="quoteChangeList">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <el-tabs v-model="activeName" @tab-click="handleClickTabs">
            <el-tab-pane v-for="item in tabs" :label="item.name" :name="item.symbol"></el-tab-pane>
        </el-tabs>

        <t8t-search
            :fields="this.activeName == 'quoteChangeList' ? fields2 : fields"
            @submit="submitSearch"
            :selectSource="formSelectSource"
            :showToggleBtn="false"
        >
        </t8t-search>

        <div class="g-main-container">
           <t8t-toolbar
               :symbolList="this.activeName == 'quoteList' ? ['CREATE','VIEW_QUOTE_ORDER']  : ['VIEW_CHANGE_ORDER','APPROVAL-FLOW']"
               @CREATE="jumpToQuoteChangeOrder()"
               @VIEW_CHANGE_ORDER="jumpToQuoteChangeOrder()"
               @VIEW_QUOTE_ORDER="jumpToQuoteOrder()"
               @APPROVAL-FLOW="showFlow()"
                ref="toolbar"
            >
            </t8t-toolbar>

            <t8t-table
                :columns="columns"
                :service="service"
                :method="method"
                :args="args"
                :pageBar="true"
                :commonData="commonData"
                ref="t8tTable"
                :radioCol="true"
                @selection-change="selectionChange"
                @row-double-click="jumpToQuoteChangeOrder"
                @current-row-change="handleCurrentRowChange"
            >
            </t8t-table>
        </div>

        <t8t-step-page
            v-if="isShowFlow"
            :method="flowMethod"
            :service="flowService"
            :args="flowArgs"
            :dataSource="flowData"
            @close="closeStepPage"
        >
        </t8t-step-page>
    </div>
</template>

<script>

    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    import quoteChangeOrderService from 'src/services/worker/quoteChangeOrder/Service.js'
    import methods from 'src/services/worker/quoteChangeOrder/methods.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import storages from 'src/services/storages/storages.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    import service from 'src/services/worker/quoteChangeOrder/Service.js'

    export default {
        components: {T8tStepPage},
        name: 'show',
        data(){
            return {

                //审核流相关
                flowArgs: {},
                flowService: service.workFlow.name, //获取审批流的服务 TODO补齐接口及服务
                flowMethod: service.workFlow.methods.getBusinessKeyDetail, //获取审批流的接口
                flowData: [],
                isShowFlow: false, //审批流是否展示

                currentRow:null,
                tabs: [
                    {name:'已签约报价单',symbol:'quoteList'},
                    {name:'变更单',symbol:'quoteChangeList'}
                ],
                activeName: 'quoteList',
                service: quoteChangeOrderService.workFlow.name,
                method:  quoteChangeOrderService.workFlow.methods.querySignedProjects,
                args: {
                    accountId: +Cookie.get('t8t-tc-uid'),
                },
                fullscreenLoading:false,

                // 搜索表单项配置
                fields: [
                    {type: 'input',label: '项目ID',name: 'yid'},
                    {type: 'select',label: '组织',name: 'orgId',selectSourceKey:'organizes'},
                ],
                fields2: [
                    {type: 'input',label: '项目ID',name: 'yid'},
                    {type: 'select',label: '组织',name: 'orgId',selectSourceKey:'organizes'},
                ],
                formSelectSource:{
                    'organizes':[]
                },
                columns:[
                ],
                quoteColumns:[
                    /*变更单ID	变更单金额	变更日期	变更状态	操作人	     项目ID 业主姓名 组织 计价面积 户型  */

                    { "prop": "yid", "label": "项目ID" },
                    { "prop": "ownerName", "label": "业主姓名" },
                    { "prop": "orgName", "label": "组织" },
                    { "prop": "area", "label": "计价面积" },
                    { "prop": "houseTypeName", "label": "户型" },

                    { "prop": "id", "label": "报价单ID"  },
                    { "prop": "totalPrice", "label": "合同金额" },
                    {
                        "prop": "updateTime",
                        "label": "更新日期" ,
                        formatter: function(updateTime) {
                            return updateTime ?  DateUtils(new Date(updateTime * 1000).getTime(), 'yyyy-mm-dd HH:MM'):'--'
                        }
                    },
                    { "prop": "orderStatus", "label": "报价状态",list: 'orderStatus' },

                ],

                quoteChangeColumns:[
                    /*报价单ID	变更单金额	变更日期	变更状态	操作人	     项目ID 业主姓名 组织 计价面积 户型  */

                    { "prop": "yid", "label": "项目ID" },
                    { "prop": "ownerName", "label": "业主姓名" },
                    { "prop": "orgName", "label": "组织" },
                    { "prop": "area", "label": "计价面积" },
                    { "prop": "houseTypeName", "label": "户型" },

                    { "prop": "id", "label": "变更单ID"  },
                    { "prop": "totalPrice", "label": "变更单金额" },
                    {
                        "prop": "updateTime",
                        "label": "更新日期" ,
                        formatter: function(updateTime) {
                            return updateTime ?  DateUtils(new Date(updateTime* 1000).getTime(), 'yyyy-mm-dd HH:MM'):'--'
                        }
                    },
                    { "prop": "orderStatus", "label": "变更单状态",list: 'orderStatus'},
                ],
                commonData: {
                    orderStatus: [
                        /*报价单状态 0-完成初稿 1-审核中 2-审核驳回 3-报价已出 4-核算中 5-核算驳回 6-报价完成 7-已签约 8-作废（变更单状态）   */
                        {
                            text: '完成初稿',
                            value: 0
                        },
                        {
                            text: '审核中',
                            value: 1
                        },
                        {
                            text: '审核驳回',
                            value: 2
                        },
                        {
                            text: '报价已出',
                            value: 3
                        },
                        {
                            text: '核算中',
                            value: 4
                        },
                        {
                            text: '核算驳回',
                            value: 5
                        },
                        {
                            text: '报价完成',
                            value: 6
                        },
                        {
                            text: '已签约',
                            value: 7
                        },
                        {
                            text: '作废',
                            value: 8
                        },
                    ],
                    forbiddenStatus: [
                        {
                            text: '否',
                            value: 0
                        },
                        {
                            text: '是',
                            value: 1
                        }
                    ],
                },
            }
        },
        activated (){
            this.$refs['t8tTable'].reloadTable()
        },
        methods:{
            handleClickTabs(event){
                this.args.dto=null
                let method = event.name
                this.activeName = event.name
                this[method]()
            },
            quoteList(){
                let tab = this.$refs['t8tTable']
                this.columns = this.quoteColumns
                this.method = tab.method =quoteChangeOrderService.workFlow.methods.querySignedProjects
                tab.reloadTable({page:1})
            },
            quoteChangeList(){
                let tab = this.$refs['t8tTable']
                this.columns = this.quoteChangeColumns
                this.method = tab.method = quoteChangeOrderService.workFlow.methods.variationOrderList
                tab.reloadTable({page:1})
            },
            //搜素
            submitSearch(objForm) {
                let obj = Object.assign({},objForm);
                let argsObj = Object.assign({},this.args)
                argsObj.dto = obj;
                this.args = argsObj;
            },
            jumpToQuoteChangeOrder: function (){
                let tableObj = this.$refs['t8tTable']
                let selections = tableObj.getSelectRows()
                let selectRows = tableObj.selectedRows

                selections = selections.length  ? selections : selectRows
                if( selections.length < 1 ){
                    return this.$message.error('未选择项目')
                }
                if( selections.length > 1 ){
                    return this.$message.error('仅可选择一项，请去掉多余的选项。')
                }
                let selection = selections[0]

                let query=null
                if(this.activeName=="quoteChangeList"){
                    this.$TCS.addTag('red_11732_018003010003')
                    query ={'orderId':selection.id}
                }else{
                    this.$TCS.addTag('red_11732_018003010002')
                    query={'yid':selection.yid}
                }

                this.$router.push({path:'/worker/quote-changeOrder-detail',query:query})

            },

            jumpToQuoteOrder: function (){
                let tableObj = this.$refs['t8tTable']
                let selections = tableObj.getSelectRows()
                let selectRows = tableObj.selectedRows

                selections = selections.length  ? selections : selectRows
                if( selections.length < 1 ){
                    return this.$message.error('未选择项目')
                }
                if( selections.length > 1 ){
                    return this.$message.error('仅可选择一项，请去掉多余的选项。')
                }
                let selection = selections[0]

                this.$router.push({path:'/worker/quote-order-detail',query:{yid:selection.yid}})

            },

            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },


            //展示审批流
            showFlow() {
                let tableObj = this.$refs['t8tTable']
                let selectedRow = tableObj.getSelectRow()

                if(selectedRow == null && this.currentRow == null){
                    return this.$message.error('未选择项目')
                }

                let selected = selectedRow || this.currentRow

                this.$TCS.addTag('red_11732_018003009008')
                this.flowArgs = {
                    "getBusinessKeyDetailDTO":{
                        "orderId":selected.id   //业务键（一般为业务Id
                    }
                }//其他信息通过后台拼接传递给工作流
                this.isShowFlow = true
            },
            //关闭审批流
            closeStepPage(){
                this.isShowFlow = false
            },

            handleCurrentRowChange: function(row,oldRow){
                this.currentRow = row
            },

        },
        created(){
            this.columns = this.quoteColumns
            //动态获取形态为分公司、门店的组织
            storages.getAllStore().then((res) => {
                let list = []
                if( res.data.status === 200 ){
                    res.data.result.rows.forEach((item) => {
                        list.push({
                            value: item.id,
                            text: item.name
                        })
                    })

                    this.formSelectSource.organizes = list
                }
            })
        }



    }


</script>

<style lang="css" scoped>

    .table-container {
        flex: 1;
        overflow: auto;
        margin-left: -1px;
    }
    .quoteChangeList .g-main-container{

        display: flex;
        flex-direction: column;

    }
    .hideToolbar{
        display: none;
    }
</style>
