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
            :showTree="true"
            :treeData="treeData"
            :treeProps="treeProps"
            @tree-node-click="treeClick"

            @list-view="doView"
            @list-export="doExport"
            @list-reallocation="doReallocation"

            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
            @table-row-dobule-click="doView"
            @table-selection-change="selectionChange"
            :tableRadioCol="true"
            :tableSelectCol="false"
        >
        </t8t-list-view>
        <reallocation
            v-if="reallocationVisible"
            @close="closeReallocationDialog"
            @open="reallocationVisible===true"
            :selectionId="selectionId"
        >
        </reallocation>
    </div>

</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import exportUtils from 'src/utils/export.js'
    import allocationApi from 'src/services/salemanager/companyAllocation.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/salemanager/Service.js'
    import Cookie from 'js-cookie'
    import reallocation from 'src/views/m-salemanager/company-allocation/reallocation-dialog.vue'

    export default {
        components: {T8tListView,reallocation},
        data () {
            return {
                // 面包屑
                breadcrumbData: [{title: '销售管理'}, {title: '意向业主管理'}, {title: '分单记录'}],
                orderCode:null,

                // 详情页路由地址
                detailRoute: '/tochat-sale-manage/company-allocation-detail',
                // service 和 method 目前需要加密
                service: Service.COMPANYALLOCATION.name,
                method: Service.COMPANYALLOCATION.methods.COMPANYALLOCATIONVIEWSQUERYPAGE,
                tableArgs: {},
                // 表头描述
                tableColumns: [
                    {prop: 'projectId', label: '项目ID'},
                    {prop: 'id', label: '记录ID'},
                    {prop: 'bizTypeId', label: '业务类型', formatter:function(val,row){return row.bizTypeName || ''}},
                    {prop: 'allocationResult', label: '分配结果', list:"allocationResult"},
                    {prop: 'companyId', label: '装修公司', formatter:function(val,row){return row.companyName || ''}},
                    {prop: 'allotCompanyTime', label: '分配装修公司时间', formatter: 'dateParser'},
                    {prop: 'storeId', label: '门店',formatter:function(val,row){return row.storeName || ''}},
                    {prop: 'allotStoreTime', label: '分配门店时间', formatter: 'dateParser'},
                ],
                // 搜索项配置
                searchFields: [

                    {type: 'input', label: '项目ID', name: 'projectId'},
                    {type: 'select', label: '业务类型', name: 'bizTypeId', selectSourceKey: 'bizTypeId'},
                    {type: 'select', label: '分配结果', name: 'allocationResult', selectSourceKey: 'allocationResult'},
                    {
                        type: 'datepicker',
                        label: '派装修公司时间',
                        name: 'allotCompanyTime',
                        pickertype: 'daterange',
                        startField: 'allotCompanyTime_gte',
                        endField: 'allotCompanyTime_lte'
                    }, {
                        type: 'datepicker',
                        label: '分配门店时间',
                        name: 'allotStoreTime',
                        pickertype: 'daterange',
                        startField: 'allotStoreTime_gte',
                        endField: 'allotStoreTime_lte'
                    },
                ],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                treeData: {
                    search:{},
                    page:1,
                    size:20
                },
                // 搜索项对应值
                searchOptions: {
                    allocationResult:[
                        {value:1,text:"分配装修公司失败"},
                        {value:2,text:"分配门店失败"},
                        {value:3,text:"分配成功"},
                    ],
                    bizTypeId:[]
                },
                dealer: Cookie.get('t8t-tc-username'),
                dealerId:Cookie.get('t8t-tc-uid'),
                sltOrg: 0,
                selectionId:'',
                reallocationVisible:false
            }
        },
        created(){
            let _self = this
            this.getProperties()
            allocationApi.queryTreeByType({}).then((res) => {
                if(res.data.status === 200){
                    this.treeData = [res.data.result];
                }else{
                    this.$message.error("组织结构获取失败")
                }
            })
        },
        methods: {
            getProperties() {
                commonApi.queryUnionParent({search:{pPropertyCode:11008},page:1,size:100}).then(res=>{
                    if(res.data.status === 200) {
                        let _list = []
                        res.data.result.forEach(item => {
                            _list.push({text:item.propertyName,value:item.id})
                        })
                        this.searchOptions.bizTypeId = _list
                    }else {
                        this.$message.error("业务类型获取失败")
                        return
                    }
                }).catch(error => {
                    console.log(error)
                })
            },
            onSearchSubmit (obj) {
                if(this.sltOrg) {
                    obj.storeIdIn = this.sltOrg
                }
                this.tableArgs = {"search": obj}
            },
            doView (val) {
                if(typeof (val) === 'object') {
                    this.$router.push({path: this.detailRoute, query: {id:val.id}})
                    return
                }
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
            //导出
            doExport() {
                let exportArgs = this.tableArgs
                exportArgs.page = 1
                exportArgs.size = 1000
                exportUtils({
                    service: Service.COMPANYALLOCATION.name,
                    method: Service.COMPANYALLOCATION.methods.COMPANYALLOCATIONEXPORT,
                    args: exportArgs,
                    headers: '项目ID,记录ID,业务类型,分配结果,装修公司,分配装修公司时间,门店,分配门店时间',
                    sorts: "projectId,id,bizTypeName,allocationResultDetail,companyName,allotCompanyDate,storeName,allotStoreDate"
                })
            },
            treeClick(data){
                this.sltOrg = data.id
                if(this.sltOrg) {
                    this.tableArgs = {search: {storeIdIn: data.id}}
                }else{
                    this.tableArgs = {}
                }
            },
            doReallocation(val){
                this.$TCS.addTag('erp_scm_015003003003');
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    let selection = selections[0]
                    this.selectionId = selection.id
                    this.reallocationVisible = true
                } else {
                    this.$message.error("请选择操作单据后重试")
                }
            },
           closeReallocationDialog(){
                this.reallocationVisible = false
           }
        }
    }
</script>

<style lang="css" scoped>



</style>
<style>
    .complaints-deal-dialog .t8t-form-panel{
        max-width:380px !important;
        min-width:300px
    }
    .complaints-deal-dialog .t8t-form-panel .el-form>.el-row>.el-col {
        width: 300px !important;
        float: none !important;
    }
</style>
