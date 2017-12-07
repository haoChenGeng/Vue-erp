<template>
    <div v-bind="payment-method-config">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-toolbar
            @ADD="btnAddClick"
            @EDIT="btnEditClick"
            @DISABLE="btnDisableClick"
            @ANTI-DISABLE="btnEnableClick">
        </t8t-toolbar>
        <t8t-table
            :columns="columns"
            :commonData="commonData"
            :service="service"
            :method="method"
            :isLoading="isLoading"
            ref="t8tTable"
        >
            <!--用于自定义列模板-->
            <template slot="amount" scope="scope">
                <span>{{scope.row['amountLowerBound']}}＜X≤{{scope.row['amountUpperBound']}}</span>
            </template>
        </t8t-table>

    </div>
</template>

<script>
    // import T8tBreadcrumb from 'src/components/t8t-breadcrumb/t8t-breadcrumb.vue'
    // import T8tTable from 'src/components/t8t-table/t8t-table.vue'
    import Service from 'src/services/finance/Service.js'
    // import T8tToolbar from 'src/components/t8t-toolbar/t8t-toolbar.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import apiPayMethod from 'src/services/finance/payMethodDistribution.js'
    import Cookie from 'js-cookie'
    import * as config from './config'

    //    import * as types from 'src/store/mutation-types'
    //    import apiDebitWayDistribution from 'src/services/finance/debitWayDistribution.js'

    export default {
        name: 'payment-method-config',
        components: {
            // T8tBreadcrumb,
            // T8tTable,
            // T8tToolbar
        },
        methods: {
            //点击新增按钮
            btnAddClick() {
                this.$router.push({path: '/tuchat-finance/page-payment-method-distribution/create', query: {editType: "add"}})
            },
            btnEditClick() {
                // 编辑
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                } else {
                    this.editType = 'edit'
                    this.dialogVisible = true
                    this.rowId = selections[0].id

                    this.$router.push({
                        path: '/tuchat-finance/page-payment-method-distribution/create',
                        query: {id: this.rowId, editType: "edit"}
                    })
                }
            },
            btnDisableClick() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else {
                    for (let i = 0; i < selections.length; i++) {
                        if (selections[i].status === 0) {
                            this.$message.error('请对禁用状态为否的数据进行操作')
                            return
                        }
                    }
                    this.$confirm('确认对所选数据进行禁用处理？', '禁用确认', {
                        type: 'warning',
                        confirmButtonText: '禁用'
                    }).then(() => {
                        let data = [];
                        selections.forEach((item) => {
                            let p = {}
                            p.status = 0
                            p.id = item.id
                            p.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                            data.push(p)
                        })
                        this.setSelectedInvalidate(data, '禁用');
                    })
                }
            },
            btnEnableClick() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else {
                    for (let i = 0; i < selections.length; i++) {
                        if (selections[i].status === 1) {
                            this.$message.error('请对禁用状态为是的数据进行操作。')
                            return
                        }
                    }
                    this.$confirm('确认对所选数据进行反禁用处理？', '反禁用确认', {
                        type: 'warning',
                        confirmButtonText: '反禁用'
                    }).then(() => {
                        let data = [];
                        selections.forEach((item) => {
                            let p = {}
                            p.status = 1
                            p.id = item.id
                            p.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                            data.push(p)
                        })
                        this.setSelectedInvalidate(data, '反禁用');
                    })
                }
            },
            //作废
            setSelectedInvalidate(lisOfChannelDistribution, typeMsg) {
                apiPayMethod.updateStatusBatch({lisOfChannelDistribution})
                    .then((res) => {
                        if (res.data.status === 200) {
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '已' + typeMsg,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.getTableData()
                        }
                        else {
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: typeMsg + '失败，请重试',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        }
                    })
            },
            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            }

        },
        computed: {},
        watch: {
            $route: function () {
                this.$refs['t8tTable'].reloadTable()
            }
        },
        data() {
            return {
                breadcrumbData: config.breadcrumbData,
                //表格
                columns: config.columns,
                commonData: config.commonData,
                isLoading: false,
                service: Service.FINA_PAY_METHOD_DISTRIBUTION.name,
                method: Service.FINA_PAY_METHOD_DISTRIBUTION.methods.QUERY_PAGE,
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null
            }
        }
    };
</script>
