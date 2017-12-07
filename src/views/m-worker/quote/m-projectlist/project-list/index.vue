<template>
    <div class="quoteconfig" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在校验项目报价的前置条件">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <el-tabs v-model="activeName" @tab-click="handleClickTabs">
            <el-tab-pane v-for="item in tabs" :label="item.name" :name="item.symbol"></el-tab-pane>
        </el-tabs>

        <t8t-search
            :fields="this.activeName == 'hasQuoteList' ? fields2 : fields"
            :selectSource="selectSource"
            :showToggleBtn="false"
            @submit="submitSearch"
        >
        </t8t-search>

        <div class="g-main-container">
                <t8t-toolbar
                    :symbolList="this.activeName == 'hasQuoteList' ? ['ITEM-CHOOSE','CHANGE-QUOTE-STATUS']: ['ITEM-CHOOSE']"
                    @ITEM-CHOOSE="jumpQuoteOrder()"
                    @CHANGE-QUOTE-STATUS="changeQuoteStatus()"
                    v-bind:class="{ hideToolbar:this.activeName == 'hasQuoteList'}"
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
                    :radioCol="false"
                    @selection-change="selectionChange"
                    @row-double-click="jumpQuoteOrder"
                >
                </t8t-table>
            </div>

        <select-quoteTemp
            v-if="dialogVisible"
            @close="dialogVisible=false"
            :yid="currentYid"
            :orgId="currentOrgId"
        >
        </select-quoteTemp>
        <changeQuoteStatus
            v-if="changeQuoteStatusVisible==true"
            @close="changeQuoteStatusVisible=false"
            :activeTableRef="changeQuoteStatusVisibleRef"
            :orderId=orderId
        >
        </changeQuoteStatus>

    </div>
</template>

<script>

    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    import selectQuoteTemp from 'src/views/m-worker/quote/m-projectlist/project-list/selectQuoteTemp.vue'
    import quoteOrderService from 'src/services/worker/quoteorder/Service.js'
    import projectNode from 'src/services/projectNode/methods.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import changeQuoteStatus from 'src/views/m-worker/quote/m-projectlist/project-list/changeQuoteStatus.vue'
    export default {
        name: 'show',
         components: {
             selectQuoteTemp,changeQuoteStatus
         },
        data(){
            return {
                tabs: [
                    {name:'未报价',symbol:'noQuoteList'},
                    {name:'已报价',symbol:'hasQuoteList'}
                ],
                orderId:null,
                activeName: 'noQuoteList',
                breadcrumbData:[{title:'工模售前'},{title:'方案'},{title:'项目列表'}],
                service: quoteOrderService.order.name,
                method:  quoteOrderService.order.methods.queryQuoteOrderProject,
                args: {accountId: +Cookie.get('t8t-tc-uid')},
                fullscreenLoading:false,
                changeQuoteStatusVisible:false,
                //项目静态数据
                projectDataSource:[
                    {
                        "id": 3,
                        "fromText": "项目来源",
                        "address": "楼盘地址",
                        "isReserved": "交定",
                        "lfTime": "量房时间" ,
                        "isQyed": "签约",
                        "type": "装修类型",
                        "htMoney": "合同金额",
                        "customer": "客户中心",
                        "designer": "设计中心",
                        "sendTime": "派单时间" ,
                        "updateTime": "最后更新时间",
                        "status": "方案状态",
                        "tempId" :19
                    },
                ],
                currentYid:null,
                currentOrgId:null,
                //搜索表单项配置
                fields: [
                    {type: 'input',label: '项目ID',name: 'id'},
                    /*{type: 'input',label: '楼盘地址',name: 'houseAddress'},*/
                ],
                fields2: [
                    {type: 'input',label: '项目ID',name: 'yid'},
                    /*{type: 'input',label: '楼盘地址',name: 'houseAddress'},*/
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {

                    moduleStatus: [

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
                 columns:[

                 ],
                 noQuoteColumns:[
                     /*项目ID	门店	订单状态	业主称呼	详细地址	装修类型
*/
                    { "prop": "id", "label": "项目ID"  },
                    { "prop": "orgName", "label": "门店" },
                    { "prop": "orderMainStatusName", "label": "订单状态"  },
                    { "prop": "ownerName", "label": "业主称呼" },
                    { "prop": "houseAddress", "label": "详细地址"  },
                    { "prop": "decoratePatternName", "label": "装修类型" },
                ],

                 hasQuoteColumns:[
                     /*报价单ID	计价面积	户型	产品包模板	报价单状态	项目ID	门店	业主称呼	详细地址
*/
                    { "prop": "yid", "label": "项目ID" },
                    { "prop": "orderMainStatusName", "label": "项目状态" },
                    { "prop": "orgName", "label": "门店" },
                     { "prop": "id", "label": "报价单ID"  },
                     { "prop": "tempName", "label": "产品包模板" },
                     { "prop": "area", "label": "计价面积" },
                     { "prop": "houseTypeName", "label": "户型" },
                     { "prop": "owner", "label": "业主称呼" },
                     { "prop": "projectAddress", "label": "详细地址" },
                     { "prop": "orderStatusName", "label": "报价单状态"},

                ],
                commonData: {
                    "qiStatus": [
                        /*报价单状态 0-完成初稿 1-审核中 2-审核驳回 3-报价已出 4-核算中 5-核算驳回 6-报价完成  */
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
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                dialogTitle : '',
                tableData: [],
                selectedRows:[]
            }
        },

        methods:{
            handleClickTabs(event){
                let method = event.name
                this.args.search = null
                this[method]()
            },
            noQuoteList(){
                let tab = this.$refs['t8tTable']
                this.columns = this.noQuoteColumns
                this.method = tab.method =quoteOrderService.order.methods.queryQuoteOrderProject
                tab.reloadTable()
            },
            hasQuoteList(){
                let tab = this.$refs['t8tTable']
                this.columns = this.hasQuoteColumns
                this.method = tab.method = quoteOrderService.order.methods.queryCompleteQuoteOrderProjectPage
                tab.reloadTable()
            },
            //搜素
            submitSearch(objForm) {
                let obj = Object.assign({},objForm);

                let argsObj = Object.assign({},this.args)
                argsObj.search = obj;
                this.args = argsObj;
            },
            //管理员权限--修改报价单状态
            changeQuoteStatus(){
                let tableObj = this.$refs['t8tTable']
                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    return this.$message.error('未选择项目')
                }
                if( selections.length > 1 ){
                    return this.$message.error('仅可选择一项，请去掉多余的选项。')
                }
                let selection = selections[0]
                this.orderId=selection.id
                this.changeQuoteStatusVisible=true
            },
            jumpQuoteOrder: function (){
                let tableObj = this.$refs['t8tTable']
                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    return this.$message.error('未选择项目')
                }
                if( selections.length > 1 ){
                    return this.$message.error('仅可选择一项，请去掉多余的选项。')
                }
                let selection = selections[0]
                let yid = selection.yid || selection.id //项目id 未报价、已报价字段名不一致
                let orgId = selection.orgId//项目中的组织id， 即门店id

                //判定项目尚未添加报价单, 则展示选择报价模板
                if(  selection.orderStatus == undefined || selection.orderStatus < 0){
                    this.fullscreenLoading = true

                    //获得报价单的单据类型ID
                    apiCommon.queryUnionParent({
                        page: 1,
                        search: {
                            pPropertyCode: 11605, //辅助资料，供应链=》库存=》单据类型
                            propertyCode: 3003 //单据类型code
                        },
                        size: 100
                    }).then((res) => {
                        if (res.data.status === 200) {
                            if(res.data.result.length > 0){
                                let billType = res.data.result[0].id;
                                projectNode.getProjectNodesByBillType(yid, billType).then(res2 => {
                                    if( res2.data.status == 200 ){
                                        if( res2.data.result.rows.length > 0 ) {
                                            let nodeId = res2.data.result.rows[0].id
                                            projectNode.projectNodeBillCreateVerify(yid, nodeId).then( res3 => {
                                                this.fullscreenLoading = false
                                                if(res3.data.status === 200 && res3.data.result === 1){
                                                    this.currentYid = yid
                                                    this.currentOrgId = orgId
                                                    this.dialogVisible  = true
                                                }else{
                                                    let msg = '';
                                                    switch(res3.data.status){
                                                        case 41000 :
                                                            msg = '系统异常'
                                                            break
                                                        case 41001 :
                                                            msg = '项目排期中没有报价节点'
                                                            break
                                                        case 41020 :
                                                            msg = '项目报价节点状态不为待开始'//创建单据，节点置为进行中校验不通过，节点状态不为待开始
                                                            break
                                                        case 41021 :
                                                            msg = '前置节点的状态不符合节点关系的要求，请检查'//创建单据，节点置为进行中校验不通过，前置节点的状态不符合节点关系表的FS、SS要求
                                                            break
                                                        default :
                                                            msg = '请检查项目排期'
                                                            break
                                                    }
                                                    return this.$msgbox({
                                                        title:'',
                                                        type:'error',
                                                        message:'当前项目不能进行报价：' + msg
                                                    })
                                                }
                                            } )

                                        }else{
                                            this.fullscreenLoading = false
                                            return this.$msgbox({
                                                title:'',
                                                type:'error',
                                                message:'当前项目不能进行报价：没有查询到创建报价单的任务节点'
                                            })
                                        }
                                    }else{
                                        this.fullscreenLoading = false
                                        return this.$msgbox({
                                            title:'',
                                            type:'error',
                                            message:'当前项目不能进行报价：查询任务节点失败'
                                        })
                                    }
                                })

                            }
                        }else{
                            this.fullscreenLoading = false
                            return this.$msgbox({
                                title:'',
                                type:'error',
                                message:'出错：没有查询到单据类型为报价单的辅助资料'
                            })
                        }
                    })

                }else{
                    this.$router.push({path:'/tochat-worker/quote-order-detail',query:{'yid':yid}})
                }
            },

            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            }

         },
     created(){
            this.columns = this.noQuoteColumns
     }



    }


</script>

<style lang="css" scoped>
    .table-container {
        flex: 1;
        overflow: auto;
        margin-left: -1px;
    }

    .quoteconfig .g-main-container{

        display: flex;
        flex-direction: column;

     }

    .hideToolbar{
        /*display: none;*/
    }
</style>
