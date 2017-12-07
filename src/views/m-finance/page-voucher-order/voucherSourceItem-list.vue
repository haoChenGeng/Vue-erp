<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
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
            @list-edit="doEdit"
            @list-close="doClose"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
            :tableIndexCol="true"
        >
        </t8t-list-view>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import voucherOrderApi from 'src/services/finance/voucherOrder.js'
    import Service from 'src/services/finance/Service.js'
    // 导出
    import exportUtils from 'src/utils/export.js'

    export default {
        components: { T8tListView },
        watch: {
//            $route: function () {
//                this.$refs['list-view'].getTableInstance().reloadTable()
//            },
        },
        activated(){
            this.$refs['list-view'].getTableInstance().reloadTable()
        },
        data () {
            return {
                voucherOrderId:null,
                // 面包屑
                breadcrumbData: [{ title: 'a' },{ title: 'b' },{ title: 'c' }],
                // 详情页路由地址
                detailRoute: '/test/resume/view',
                // service 和 method 目前需要加密
                rou: this.$router,
                voucherEntryId:null,
                service: Service.VOUCHER_ORDER.name,
                method: Service.VOUCHER_ORDER.methods.ITEM_EXPORT,
                deleteMethod: 'nw49TyWvvodb7pfFqoGgc-jR68pVUf4RldxYjsYl-WK', // voucherSourceItem.deleteByIds
                tableArgs: {
                    search: {
                        // voucherEntryId: this.voucherEntryId
                        voucherEntryId:null
                    }
                },
                goBackRoute: '/tuchat-finance/page-voucher-order/detail',
                // 表头描述
                tableColumns: [
                    {prop: 'voucherCode', label: '凭证单据号'},
                    {prop: 'organizationName', label: '财务组织'},
                    {prop: 'accountingTime', label: '会计期间'},
                    {prop: 'dataSourceName', label: '数据来源'},
                    {prop: 'sourceOrderCode', label: '来源单据号'},
                    {prop: 'sourceOrderType', label: '来源单据类型'},
                    {prop: 'sourceOrderTime', label: '来源单据日期', formatter: 'dateParser'},
                    {prop: 'sourceOrderAmount', label: '金额'}
                ],
                // 搜索项配置
                searchFields: [
                ],
                // 搜索项对应值
                searchOptions: {
                },
            }
        },
        created () {
            this.voucherEntryId= this.$route.query.voucherEntryId
            this.voucherOrderId=this.$route.query.voucherOrderId
            this.tableArgs.search.voucherEntryId=this.$route.query.voucherEntryId
        },
        methods: {
            onSearchSubmit () {

            },
            onchange (val) {

            },
            doDelete () {
                let deletePromise = this.$refs['list-view'].doDelete()
                let that = this
                if (deletePromise) {
                    deletePromise.then((res) => {
                        if (res.data && res.data.status == 200 && res.data.result > 0) {
                            that.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            that.$refs['list-view'].getTableInstance().reloadTable()
                        }
                    })
                }
            },
            doView () {
                this.$refs['list-view'].doView(this.detailRoute)
            },
            doAdd () {
                this.$refs['list-view'].doAdd(this.detailRoute)
            },
            doClose(){
                this.$router.push({ path: this.goBackRoute,query: { id: this.voucherOrderId } })
                this.$emit('close')
            },
            doEdit () {
                this.$msgbox({
                    message: '正在导出中,请注意左下方,稍后有导出的文件',
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                exportUtils({
                    service: Service.VOUCHER_ORDER.name,
                    method: Service.VOUCHER_ORDER.methods.ITEM_EXPORT,
                    args:{
                        search: {
                            voucherEntryId: this.voucherEntryId
                        },
                        page: 1,
                        size: 10000
                    },
                    headers: '凭证单据号,财务组织,会计期间,数据来源,来源单据号,来源单据类型,来源单据日期,金额',
                    sorts: 'voucherCode,organizationName,accountingTime,dataSourceName,sourceOrderCode,sourceOrderType,sourceOrderTimeStr,sourceOrderAmount',
                    title: '凭证来源明细'
                })
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
