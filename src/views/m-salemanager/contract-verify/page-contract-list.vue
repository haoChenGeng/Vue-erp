<template>
    <div class="page-intention-owner-list">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <el-tabs v-model="activeName" @tab-click="handleClickTabs">
            <el-tab-pane
                         v-for="item in buttons"
                         :label="item.name"
                         :name="item.symbol"
            >
            </el-tab-pane>
        </el-tabs>

        <t8t-search :fields="fields" @submit="submitSearch" :selectSource="selectSource"></t8t-search>

        <t8t-toolbar
            ref="contractToolbar"
            @VIEW="viewBtn"
            @APPROVAL-FLOW="showFlow"
            @SUBMIT="submitBtn"
            @VERIFY="verifyBtn"
        >
        </t8t-toolbar>

        <t8t-table
            :columns="columns"
            :service="service"
            :method="method"
            :commonData="selectSource"
            :args="args"
            ref="contractTable"
            @row-double-click="viewBtn"
            :radioCol="true"
            @current-row-change="rowChanges"
        >
        </t8t-table>

        <t8t-step-page
            :args="flowArgs"
            :service="flowService"
            :method="flowMethod"
            :dataSource="flowData"
            v-if="isShowFlow"
            @close="closeFlowShow"
        >
        </t8t-step-page>
    </div>
</template>

<script>
    //todo
    import decorationOrderAPI from 'src/services/salemanager/salemanager.js'
    import Service from 'src/services/salemanager/Service.js'
    import exportUtils from 'src/utils/export.js'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'


    import Cookie from 'js-cookie'
    import Perm from 'src/services/permission/Perm.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import standingBookApi from 'src/services/salemanager/standingbook.js'

    export default {
        name: 'page-contract-list',
        components: {T8tStepPage},
        data() {
            return {
                buttons: [
                    {
                        name: "全部",
                        symbol: "all"
                    }, {
                        name: "待审核",
                        symbol: "waiting"
                    }, {
                        name: "已审核",
                        symbol: "verified"
                    }
                ],
                service: Service.CONTRACT.name,
                method: Service.CONTRACT.methods.QUERYPAGECONTRACTINFO,
                args: {
                    search: {
                        status: 'all'
                    },
                    page:1,
                    size:20
                },
                bizSearchType:"all",
                selectSource:{
                    statusList:[
                        {value:0,text:null},
                        {value:1,text:"待审核"},
                        {value:2,text:"审核通过"},
                        {value:3,text:"审核不通过"},
                    ],
                    clientManagerList:[]
                },
                activeName: 'all',
                isShowFlow:false,
                flowService: Service.CONTRACT.name,
                flowMethod: Service.CONTRACT.methods.GETPROCESSDETAILBYID,
                flowData: [],
                flowArgs:{id:null},

                fields: [
                    {type: 'input', label: '项目ID', name: 'projectId'},
                    {
                        type: 'popup',
                        label: '楼盘名称',
                        name: 'estateId', //需要传递给后台查询的数据
                        textValue: 'sname',  //需要展示出来的名称
                        filedValue: 'id',    //选中那条数据的ID
                        //自动补全
                        remote: true,
                        service: Service.SALES.name,
                        method: Service.SALES.methods.QUERY_ESTATE_PAGE,
                        remoteQueryKey: "estateName",
                        icon:"false",
                        onIconClick: function(){},  //是否显示可用放大镜搜索
                        remoteArgs: {
                            page: 1,
                            size: 10
                        }
                    },
                    {type: "oldarea", type:"oldarea",label: "城市",name: "city",subNames:["proId","cityId","townId"],clearable:true},
                ],
                breadcrumbData: [
                    {title: '销售管理'},
                    {title: '合同管理'},
                    {title: '合同审核'}
                ],
                columns: [
                    {
                        prop:"projectId",
                        label: "项目ID"
                    },
                    {
                        prop:"code",
                        label: "合同审核编码"
                    },
                    {
                        prop:"ownerName",
                        label: "业主称呼"
                    },
                    {
                        prop:"phoneId",
                        label: "业主电话ID"
                    },
                    {
                        width:"300px",
                        prop:"projectAddr",
                        label: "详细地址"
                    },
                    {
                        prop:"houseValuationArea",
                        label: "计价面积"
                    },
                    {
                        prop:"contractPrice",
                        label: "报价"
                    },
                    {
                        prop:"state",
                        label: "审核状态",
                        list:"statusList"
                    },
                    {
                        prop: "verifyTime",
                        label: "审核时间",
                        formatter: 'dateParser'
                    }
                    ],
                curRow:null,
            }
        },
        mounted () {
            const states = this.$refs['contractTable'].$refs.table.store.states
            this.$refs['contractTable'].states = states
        },
        activated() {
            this.getTableData()
        },
        methods: {
            handleClickTabs(event) {
                if(event.name != this.bizSearchType) {
                    this.args.search.status = event.name
                }
                this.bizSearchType = event.name
                this.getTableData()
            },
            //搜索提交
            submitSearch(obj) {
                this.searchCache = this.isEmptyObject(obj) ? {id_gt: 0}: obj;
                if(obj.cityId != undefined) {
                    this.searchCache.cityId = parseInt(obj.cityId);
                }
                if(obj.townId != undefined) {
                    this.searchCache.townId = parseInt(obj.townId);
                }
                this.searchCache.status = this.bizSearchType
                this.args = {
                    search: this.searchCache,
                }
            },
            isEmptyObject(obj){
                for (var key in obj) {
                    return false;
                }
                return true;
            },

            //表格刷新
            getTableData() {
                this.$refs['contractTable'].reloadTable();
            },
            viewBtn(obj){
                if(typeof (obj) === 'object') {
                    this.$router.push({ path: '/tuchat-sale-manage/contract-detail', query: { mode:'view', projectId: obj.projectId } })
                    return
                }
                if(this.$refs['contractTable'].states) {
                    let selectRow = this.$refs['contractTable'].states.currentRow
                    if (selectRow) {
                        this.$router.push({ path: '/tuchat-sale-manage/contract-detail', query: { projectId: selectRow.projectId } })
                    } else {
                        this.$message.error("请选中要查看的合同")
                        return
                    }
                }else{
                    this.$message.error("没有项目信息")
                    return
                }
            },
            showFlow(){
                if(this.$refs['contractTable'].states) {
                    let selectRow = this.$refs['contractTable'].states.currentRow
                    if (selectRow) {
                        if(selectRow.id) {
                            this.flowArgs={id:selectRow.id}
                            this.isShowFlow = true
                        }else{
                            this.$message.error("选中的合同没有提交")
                            return
                        }
                    }else {
                        this.$message.error("请选中合同后重试")
                        return
                    }
                }else{
                    this.$message.error("没有项目信息")
                    return
                }
            },
            submitBtn(){

                this.$TCS.addTag('erp_scm_018005004003');

                if(this.$refs['contractTable'].states) {
                    let selectRow = this.$refs['contractTable'].states.currentRow
                    if (selectRow) {
                        if(selectRow.state == 1 || selectRow.state == 2) {
                            this.$message.error("当前单据不能提交")
                            return
                        }
                        this.$router.push({ path: '/tuchat-sale-manage/contract-detail', query: { projectId: selectRow.projectId,mode:'create' } })
                    } else {
                        this.$message.error("请选中要提交的单据")
                        return
                    }
                }else{
                    this.$message.error("没有项目信息")
                    return
                }
            },
            verifyBtn(){
                this.$TCS.addTag('erp_scm_018005004004');
                if(this.$refs['contractTable'].states) {
                    let selectRow = this.$refs['contractTable'].states.currentRow
                    if (selectRow) {
                        if(selectRow.processId && selectRow.state == 1) {
                            this.$router.push({ path: '/tuchat-sale-manage/contract-detail', query: { procInsId: selectRow.processId,mode:'verify' } })
                        } else {
                            this.$message.error("选中的合同不能审核")
                            return
                        }
                    } else {
                        this.$message.error("没有项目信息")
                        return
                    }
                }


            },
            closeFlowShow(){
                this.isShowFlow = false
            },
            rowChanges(row) {
                let toolbar = this.$refs['contractToolbar']
                let flowShow = false,submitShow = false,verifyShow = false
                if(row) {
                    flowShow = row.id ? true : false
                    submitShow = row.state == 1 || row.state == 2 ? false : true
                    verifyShow = row.processId && row.state == 1 ? true : false
                }else{
                    flowShow = submitShow = verifyShow = true
                }
                flowShow ? toolbar.unDisableBySymbol('APPROVAL-FLOW') : toolbar.disableBySymbol('APPROVAL-FLOW')
                submitShow ? toolbar.unDisableBySymbol('SUBMIT') : toolbar.disableBySymbol('SUBMIT')
                verifyShow ? toolbar.unDisableBySymbol('VERIFY') : toolbar.disableBySymbol('VERIFY')
            }
        }
    }

</script>
<style scoped>
    .t8t-table {
        height: 350px
    }
</style>
<style>
    .page-intention-owner-list .intention-owner-a {
        text-decoration: none;
        color: #3396FB;
    }
</style>
