<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
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
            @list-delete="doDelete"
            @list-add="doAdd"
            @list-detail="routeDetail"
            @list-EXPORT="onExport"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
            @table-row-dobule-click="routeDetail()"
        >
        </t8t-list-view>

    </div>
</template>

<script>
//    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/commonApi/Service.js'
    import financeService from 'src/services/finance/Service.js'
    import exportUtils from 'src/utils/export.js'//导出

    export default{

        data(){
            return {
                service: financeService.DEPOSIT_MANAGEMENT.name,
                method: financeService.DEPOSIT_MANAGEMENT.methods.DEPOSIT_QUERY, //views.deposit.query
                tableArgs: {
                    search: {
                        id: null,
                    },
                    sort: ["id_desc"]
                },
                tableColumns: [
                    {prop: 'orgName', label: '组织'},
                    {prop: 'pmId', label: '项目经理ID'},
                    {prop: 'pmName', label: '项目经理'},
                    {prop: 'baseAmount', label: '固定保障金'},
                    {prop: 'projectAmount', label: '项目质保金'},
                    {prop: 'balance', label: '总额'},
                ],
                searchFields: [
                    {
                        type: 'popup', label: '组织', name: 'orgId', textValue: 'name', filedValue: 'id',
                        dialog: {
                            title: "组织查询",
                            size: 'large',
                            searchForm: {
                                fields: [
                                    {type: 'input', label: '组织', name: 'name_like'},
                                ],
                                resetBtnVisible: false,
                                showToggleBtn: false,
                                labelWidth: '50px'
                            },
                            table: {
                                radioCol: true,
                                //表格
                                columns: [{
                                    prop: 'code',
                                    label: '组织编号'
                                }, {
                                    prop: 'name',
                                    label: '组织'
                                }],
                                //请求参数配置
                                service: Service.ORGANIZATION.name,
                                method: Service.ORGANIZATION.methods.ORG_QUERY_WITHOUTDEL,
                                args: {
                                    search:{
                                        typeCode:'001003006'
                                    },
                                    sort: ['id_desc']
                                }
                            },
                            onConfirm: this.onPopupConfirm
                        },

                        //自动补全
                        remote: true,
                        service: Service.ORGANIZATION.name,
                        method: Service.ORGANIZATION.methods.ORG_QUERY_WITHOUTDEL,
                        remoteQueryKey: "name"
                    },
                    {type: 'input', label: '项目经理ID', name: 'pmId'},
                    {type: 'input', label: '项目经理', name: 'pmName_like'},
                ],
                breadcrumbData: [
                    {title: '财务'},
                    {title: '质保金管理'},
                    {title: '余额查询'}
                ],
                searchOptions: {
                    orgOptions: []
                },
                exportParams:{
                    search: {id_gt: 0},
                    sort: ["id_desc"],
                    page: 1,
                    size: 10000
                },

            }
        },

        doView () {
            this.$TCS.addTag('erp_finance_007010001001')
            this.$refs['list-view'].doView(this.detailRoute)
        },

        methods: {
            routeDetail(){
                //传入参数pmId
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再试')
                }
                else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作')
                }
                else {
                    let orgName = selections[0].orgName
                    let pmId = selections[0].pmId
                    let pmName = selections[0].pmName
                    this.$router.push({
                        path: '/tochat-finance/deposit-list/deposit-detail',
                        query: {
                            orgName: orgName,
                            pmId: pmId,
                            pmName: pmName
                        }
                    })
                }

            },
            onSearchSubmit(obj){
                this.tableArgs = {
                    search: obj,
                    sort:['id_desc']
                }
                this.exportParams.search=obj;
            },
            onExport(){
                this.$msgbox({
                    message: '正在导出中,请注意左下方,稍后有导出的文件',
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                let ids = []
                let checkArray = this.$refs['list-view'].getTableInstance().getSelectRows()
                if (checkArray.length > 0) {
                    checkArray.forEach((item) => {
                        ids.push(item.id)
                    })
                    this.exportParams = {
                        search: {
                            id_in: ids
                        },
                        sort: ["id_desc"],
                        page: 1,
                        size: 10000
                    }
                }
                let objectFlag = false
                objectFlag = this.isEmptyObjectParams(this.exportParams.search)
                if (!objectFlag) {
                    this.exportParams = {
                        search: {
                            id_gt:0
                        },
                        sort: ["id_desc"],
                        page: 1,
                        size: 10000
                    }
                }
                exportUtils({
                    service:financeService.DEPOSIT_MANAGEMENT.name,
                    method:financeService.DEPOSIT_MANAGEMENT.methods.DEPOSIT_EXPORT,
                    args: this.exportParams,
                    title:'质保金余额',
                    headers: '组织,项目经理ID,项目经理,固定保障金,项目质保金,总额',
                    sorts: 'orgName,pmId,pmName,baseAmount,projectAmount,balance'
                })
            },
            isEmptyObjectParams(data)
            {
                let objectFlags = false
                for (let i in data) {
                    if(data[i]!=null){
                        objectFlags = true
                    }
                }
                return objectFlags
            },
        }
    }



</script>
