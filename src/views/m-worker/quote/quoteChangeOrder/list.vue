<template>
    <div class="quoteChangeList">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <t8t-search
            :fields="fields"
            @submit="submitSearch"
            :selectSource="formSelectSource"
            :showToggleBtn="false"
        >
        </t8t-search>

        <div class="g-main-container">
            <t8t-toolbar
                :symbolList="['CREATE','VIEW_CHANGE_ORDER']"
                @CREATE="createWaterAndElectricity()"
                @VIEW_CHANGE_ORDER="jumpToQuoteChangeOrder()"
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
                :commonData="formSelectSource"
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
    import commonApi from 'src/services/commonApi/commonApi.js'

    export default {
        components: {T8tStepPage},
        name: 'show',
        data(){
            return {

                //审核流相关
                flowArgs: {},
                flowData: [],
                isShowFlow: false, //审批流是否展示

                currentRow: null,
                tabs: [
                    {name: '未创建水电增项', symbol: 'quoteList'},
                    {name: '已创建水电增项', symbol: 'quoteChangeList'}
                ],
                service: quoteChangeOrderService.order.name,
                method: quoteChangeOrderService.order.methods.list,
                args: {
                    accountId: +Cookie.get('t8t-tc-uid'),
                    dto: {projectId: null, ownerName: null, chiefDesignerId: null, orderMainStatus: null},
                },
                fullscreenLoading: false,

                // 搜索表单项配置
                fields: [
                    {type: 'input', label: '项目ID', name: 'sourceProjectId'},
                    {type: 'input', label: '业主姓名', name: 'ownerName'},
                    {type: 'select', label: '项目状态', name: 'orderSubStatus', selectSourceKey: 'orderSubStatuses'},
                ],
                formSelectSource: {
                    'orderSubStatuses': [],
                    'organizes': [],
                    'statusConfirms': [
                        //0.待确认；1.已确认: 2.装修公司申请：3.业主驳回
                        { value: 0, text: '待确认' },
                        { value: 1, text: '已确认' },
                        { value: 2, text: '装修公司申请' },
                        { value: 3, text: '业主驳回' },
                    ],
                    orderStatus: [
                        /*报价单状态 0-完成初稿 1-审核中 2-审核驳回 3-报价已出 4-核算中 5-核算驳回 6-报价完成 7-已签约 8-作废（变更单状态）   */
                        { text: '完成初稿', value: 0 },
                        { text: '审核中', value: 1 },
                        { text: '审核驳回', value: 2 },
                        { text: '报价已出', value: 3 },
                        { text: '核算中', value: 4 },
                        { text: '核算驳回', value: 5 },
                        { text: '报价完成', value: 6 },
                        { text: '已签约', value: 7 },
                        { text: '作废', value: 8 },
                    ],
                    forbiddenStatus: [
                        { text: '否', value: 0 },
                        { text: '是', value: 1 }
                    ],
                },
                columns: [],
                quoteColumns: [
                    /*原项目ID、业主姓名、项目地址（城市+行政区+楼盘+详细地址）、套内面积、设计师姓名、项目状态、签约时间  */

                    {"prop": "sourceProjectId", "label": "项目ID"},
                    {"prop": "ownerName", "label": "业主姓名"},
                    {"prop": "projectAddress", "label": "项目地址"},
                    {"prop": "houseArea", "label": "套内面积"},
                    {"prop": "chiefDesignerName", "label": "首席设计师姓名"},
                    {"prop": "orderSubStatusName", "label": "项目状态"},
                    {"prop": "applyAbleName", "label": "是否可创建水电增项",},
                    {"prop": "lbfy", "label": "水电增项金额"},
                    {"prop": "statusConfirm", "label": '水电增项状态','list': 'statusConfirms'},
                    {
                        "prop": "realSignedTime",
                        "label": "签约时间",
                        formatter: function (updateTime) {
                            return updateTime ? DateUtils(new Date(updateTime * 1000).getTime(), 'yyyy-mm-dd HH:MM') : '--'
                        }
                    },
                ],

                quoteChangeColumns: [
                    /*原项目ID、业主姓名、项目地址（城市+行政区+楼盘+详细地址）、水电增项金额、签约日期、水电增项状态 设计师姓名 */
                    {"prop": "projectId", "label": "原项目ID"},
                    {"prop": "ownerName", "label": "业主姓名"},
                    {"prop": "projectAddress", "label": "项目地址"},
                    {"prop": "lbfy", "label": "水电增项金额"},
                    {
                        "prop": "realSignedTime",
                        "label": "签约时间",
                        formatter: function (updateTime) {
                            return updateTime ? DateUtils(new Date(updateTime * 1000).getTime(), 'yyyy-mm-dd HH:MM') : '--'
                        }
                    },
                    {type: 'select', label: '水电增项状态', name: 'statusConfirm', selectSourceKey: 'orderSubStatuses'},
                    {"prop": "chiefDesignerId", "label": "设计师姓名"},
                ],
            }
        },
        activated (){
            this.$refs['t8tTable'].reloadTable()
        },
        methods: {
            handleClickTabs(event){
                let method = event.name
                this[method]()
            },
            quoteList(){
                let tab = this.$refs['t8tTable']
                this.columns = this.quoteColumns
                this.method = tab.method = quoteChangeOrderService.order.methods.list
                tab.reloadTable({page: 1})
            },
            quoteChangeList(){
                let tab = this.$refs['t8tTable']
                this.columns = this.quoteChangeColumns
                this.method = tab.method = quoteChangeOrderService.order.methods.createdList
                tab.reloadTable({page: 1})
            },
            //搜素
            submitSearch(objForm) {
                let obj = Object.assign({}, objForm);
                let argsObj = Object.assign({}, this.args)
                argsObj.dto = obj;
                this.args = argsObj;
            },
            createWaterAndElectricity: function() {
                // debugger
                let tableObj = this.$refs['t8tTable']
                let selections = tableObj.getSelectRows()
                let selectRows = tableObj.selectedRows

                selections = selections.length ? selections : selectRows
                if (selections.length < 1) {
                    return this.$message.error('未选择项目')
                }
                if (selections.length > 1) {
                    return this.$message.error('仅可选择一项，请去掉多余的选项。')
                }
                let selection = selections[0]
                if(10 !== selection.projectStar)  {
                    return this.$message.error('此项目无需提交水电增项')
                }
                if("8100703" !== selection.orderSubStatus) {
                    return this.$message.error('水电验收成功状态的项目可添加水电增项')
                }
                // debugger
                if ([0,3].indexOf(selection.statusConfirm) < 0) {
                    return this.$message.error('水电增项状态为待确认、业主驳回可添加水电增项')
                }
                if (0 === selection.applyAble) {
                    return this.$message.error('此项目无需提交水电增项')
                }
                this.$TCS.addTag('red_11732_018003010003')
                let query = {'projectId': selection.projectId}

                this.$router.push({path: '/tuchat-worker/quote-changeOrder-detail', query: query})
            }
            ,
            jumpToQuoteChangeOrder: function () {
            //   debugger
                let tableObj = this.$refs['t8tTable']
                let selections = tableObj.getSelectRows()
                let selectRows = tableObj.selectedRows

                selections = selections.length ? selections : selectRows
                if (selections.length < 1) {
                    return this.$message.error('未选择项目')
                }
                if (selections.length > 1) {
                    return this.$message.error('仅可选择一项，请去掉多余的选项。')
                }
                let selection = selections[0]
                // debugger
                if("8100703" > selection.orderSubStatus || 10 !== selection.projectStar || selection.statusConfirm == 0) {
                    return this.$message.error('无水电增项详情')
                }

                this.$TCS.addTag('red_11732_018003010003')
                let query = {'projectId': selection.projectId}

                this.$router.push({path:'/tuchat-worker/quote-changeOrder-detail',query:query})

            },

            jumpToQuoteOrder: function () {
                let tableObj = this.$refs['t8tTable']
                let selections = tableObj.getSelectRows()
                let selectRows = tableObj.selectedRows

                selections = selections.length ? selections : selectRows
                if (selections.length < 1) {
                    return this.$message.error('未选择项目')
                }
                if (selections.length > 1) {
                    return this.$message.error('仅可选择一项，请去掉多余的选项。')
                }
                let selection = selections[0]

                this.$router.push({path:'/tuchat-worker/quote-order-detail',query:{yid:selection.yid}})

            },

            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },

            //展示审批流
            showFlow() {
                let tableObj = this.$refs['t8tTable']
                let selectedRow = tableObj.getSelectRow()

                if (selectedRow == null && this.currentRow == null) {
                    return this.$message.error('未选择项目')
                }

                let selected = selectedRow || this.currentRow

                this.$TCS.addTag('red_11732_018003009008')
                this.flowArgs = {
                    "getBusinessKeyDetailDTO": {
                        "orderId": selected.id   //业务键（一般为业务Id
                    }
                }//其他信息通过后台拼接传递给工作流
                this.isShowFlow = true
            },
            //关闭审批流
            closeStepPage(){
                this.isShowFlow = false
            },

            handleCurrentRowChange: function (row, oldRow) {
                this.currentRow = row
            },

        },
        created(){
            this.columns = this.quoteColumns
            //动态获取形态为分公司、门店的组织
            storages.getAllStore().then((res) => {
                let list = []
                if (res.data.status === 200) {
                    res.data.result.rows.forEach((item) => {
                        list.push({
                            value: item.id,
                            text: item.name
                        })
                    })

                    this.formSelectSource.organizes = list
                }
            })
            //获取装修公司项目主状态的辅助资料
//            debugger
            commonApi.queryChildrenByWholeCode("8!810", 3).then((res) => {
//                debugger
                if (res.data.status === 200) {
                    let searchList = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        searchList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                    }
                    this.formSelectSource.orderSubStatuses = searchList;
                }
            });
        }
    }


</script>

<style lang="css" scoped>

    .table-container {
        flex: 1;
        overflow: auto;
        margin-left: -1px;
    }

    .quoteChangeList .g-main-container {

        display: flex;
        flex-direction: column;

    }

    .hideToolbar {
        display: none;
    }
</style>
