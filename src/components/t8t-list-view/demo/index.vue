<template>
    <t8t-list-view
        ref="list-view"
        :breads="breadcrumbData"
        :searchFields="searchFields"
        :searchOptions="searchOptions"
        :showSearchToggleBtn="true"
        :treeData="treeData"
        showTree="true"
        :tableColumns="tableColumns"
        :tableService="service"
        :tableMethod="method"
        @list-view="onView"
        @search-submit="onSearchSubmit"
        :beforeSearchSubmit="beforeSubmit"
        :treeArgs="treeArgs"
        :refreshOnTreeClick="true"
    >
    </t8t-list-view>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import trees from 'src/components/t8t-list-view/demo/tree.json'
    import Service from 'src/services/finance/Service.js'
    export default {
        components: { T8tListView },
        data () {
            return {
                treeArgs: {
                    test: 1
                },
                service: Service.FINA_BILLS.name,
                method: Service.FINA_BILLS.methods.QUERYFLAT,
                tableColumns: [
                    { "prop": "verifyStatus", "label": "核销状态" },
                    { "prop": "code", "label": "单据编号" },
                    { "prop": "receiptOrgName", "label": "组织" },
                    { "prop": "receiptModeName", "label": "收款方式" },
                    { "prop": "totalArriveAmount", "label": "到账金额" }
                ],
                treeData: trees,
                breadcrumbData: [
                    {title: '系统管理'},
                    {title: '主数据'},
                    {title: '组织机构'}
                ],
                searchFields: [
                    {type: 'input',label: '单据编号',name: 'code'},
                    {type: 'select',label: '业务类型',name: 'bizId', selectSourceKey:'bizOptions'},
                    {type: 'select',label: '收款类型',name: 'receiptTypeId', selectSourceKey:'receiptTypeOptions'},
                    {type: 'input',label: '项目ID',name: 'projectId'},
                    {type: 'select',label: '单据状态',name: 'orderStatus', selectSourceKey:'orderStatusOptions'},
                    {type: 'select',label: '核销状态',name: 'verifyStatus', selectSourceKey:'verifyStatusOptions'}
                ],
                searchOptions: {
                    bizOptions: [],
                    receiptTypeOptions: [],
                    orderStatusOptions: [
                        {
                            text: '审核中',
                            value: 1
                        },
                        {
                            text: '已审核',
                            value: 2
                        },
                        {
                            text: '重新审核',
                            value: 3
                        }],
                    verifyStatusOptions: [
                        {
                            text: '未核销',
                            value: 1
                        },
                        {
                            text: '部分核销',
                            value: 2
                        },
                        {
                            text: '已核销',
                            value: 3
                        }
                    ]
                }
            }
        },
        methods: {
            beforeSubmit (data) {
                return true
            },
            onView (symbol, event) {
                this.$refs['list-view'].disableBySymbol(symbol)
            },
            onSearchSubmit (formData) {

            }
        }
    }
</script>

<style lang="css" scoped>

</style>
