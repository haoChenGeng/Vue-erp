<template>
    <div v-bind="cost-domain-config">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-toolbar
            @ADD="btnAddClick"
            @EDIT="btnEditClick"
            @VIEW="btnView">
        </t8t-toolbar>
        <t8t-table
            :columns="columns"
            :commonData="commonData"
            :service="service"
            :args="args"
            :method="method"
            :isLoading="isLoading"
            ref="t8tTable"
            :indexCol="true"
            @row-double-click="btnView"
        >
        </t8t-table>

    </div>
</template>

<script>
    import costDomainDialog from './cost-domain-dialog.vue'
    import Service from 'src/services/finance/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import apiInventoryAccounting from 'src/services/finance/costDomainConfig.js'
    import apiInventoryAccountingCostDomainConfig from 'src/services/finance/costDomainConfig.js'
    import Cookie from 'js-cookie'
    import * as config from './config'

    export default {
        name: 'page-cost-domain-config',
        components: {
            costDomainDialog
        },
        watch: {
//            $route: function () {
//                this.$refs['t8tTable'].reloadTable()
//            }
        },
        activated(){
            this.$refs['t8tTable'].reloadTable()
        },
        methods: {
            submitSearch(obj) {
                this.searchCache = obj
                this.args = {search: obj}
            },
            //点击新增按钮
            btnAddClick() {
                this.$router.push({path: '/finance/page-cost-domain-config/create', query: {editType: "add"}})
            },
            btnEditClick() {
                // 点击编辑按钮
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                } else {
                    let selectRow = this.$refs['t8tTable'].getSelectRows()[0]
                    this.$router.push({
                        path: '/finance/page-cost-domain-config/edit',
                        query: {id: selectRow.id, editType: "edit"}
                    })

                }
            },
            btnView(){
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                } else {
                    let selectRow = this.$refs['t8tTable'].getSelectRows()[0]
                    this.$router.push({
                        path: '/finance/page-cost-domain-config/view',
                        query: {id: selectRow.id, editType: "view"}
                    })
                }
            }

        },
        computed: {},
        created() {
            apiInventoryAccountingCostDomainConfig.query()
                .then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.id,
                                text: item.name
                            })
                        })
                        this.selectSource.costDomainConfigOptions = list
                    }
                }))
        },
        data()
        {
            return {
                args: {
                    search: {
                        id_gt: 0
                    }
                },
                //搜索表单项配置
                fields: [
                    {
                        type: 'select',
                        label: '成本域',
                        name: 'id',
                        selectSourceKey: 'costDomainConfigOptions'
                    },
                    {
                        type: 'select',
                        label: '状态',
                        name: 'status',
                        selectSourceKey: 'statusOptions'
                    }

                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    costDomainConfigOptions: [],
                    statusOptions: [{
                        text: '启用',
                        value: 1
                    }, {
                        text: '停用',
                        value: 0
                    }]
                },
                breadcrumbData: config.breadcrumbData,
                //表格
                columns: config.columns,
                commonData: config.commonData,
                isLoading: false,
                service: Service.INVENTORY_ACCOUNTING.name,
                method: Service.INVENTORY_ACCOUNTING.methods.costDomainConfigQueryPage,
            }
        }
    }
    ;
</script>

<style>

</style>
