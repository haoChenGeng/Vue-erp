<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-toolbar
            @ADD="btnAddClick"
            @EDIT="btnEditClick"
            @VOID="btnVoidClick">
        </t8t-toolbar>
        <t8t-table
            :columns="columns"
            :service="service"
            :method="method"
            :isLoading="isLoading"
            :commonData="commonData"
            ref="t8tTable"
        >
        </t8t-table>
        <card-config-dialog
        v-if="dialogVisible"
        :rowId="rowId"
        :editType="editType"
        @close="dialogVisible=false"
        @getTableData="getTableData">
        </card-config-dialog>
    </div>
</template>

<script>
    import CardConfigDialog from './card-config-dialog.vue'
    import Cookie from 'js-cookie'
    import Service from 'src/services/finance/Service.js'
    import apiVirtualCardConfig from 'src/services/finance/virtualCardConfig.js'
    export default {
        name: 'virtual-card-config',
        components: {
            CardConfigDialog
        },
        watch: {
//            $route: function () {
//                this.$refs['t8tTable'].reloadTable()
//            }
        },
        activated () {
            this.$refs['t8tTable'].reloadTable()
        },
        data() {
            return {
                breadcrumbData: [{
                    title: '财务'
                },
                {
                    title: '财务基础配置'
                },
                {
                    title: '银行虚拟卡配置'
                }
                ],
                // 弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                //表格
                columns: [{
                    prop: 'code',
                    label: '编码'
                }, {
                    prop: 'orignizationName',
                    label: '财务组织'
                }, {
                    prop: 'bankAccount',
                    label: '主卡卡号'
                }, {
                    prop: 'bankName',
                    label: '银行类型'
                }, {
                    prop: 'bankBranch',
                    label: '开户支行'
                }, {
                    prop: 'channelName',
                    label: '关联收款方式'
                }, {
                    prop: 'bussinessName',
                    label: '适用业务类型'
                }, {
                    prop: 'orignizationApplyName',
                    label: '适用组织'
                }, {
                    prop: 'status',
                    label: '状态',
                    list: 'status'
                }, {
                    prop: 'createName',
                    label: '创建人'
                }, {
                    prop: 'createTime',
                    label: '创建时间',
                    formatter: "dateParser"
                }, {
                    prop: 'updateName',
                    label: '修改人'
                }, {
                    prop: 'updateTime',
                    label: '修改时间',
                    formatter: "dateParser"
                }],
                commonData: {
                    status: [
                        {
                            text: '无效',
                            value: 2
                        },
                        {
                            text: '有效',
                            value: 1
                        }
                    ]
                },
                isLoading: false,
                service: Service.VIRTUAL_CARD_CONFIG.name,
                method: Service.VIRTUAL_CARD_CONFIG.methods.QUERY_PAGE
            }
        },
        methods: {
            //点击新增按钮
            btnAddClick() {
                this.$router.push({path: '/finance/page-virtual-card-config/create', query: {editType: "add"}})
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
                        path: '/finance/page-virtual-card-config/edit',
                        query: {id: selectRow.id, editType: "edit"}
                    })

                }
            },
            btnVoidClick() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else {
                     for(let i = 0;i<selections.length;i++) {
                        if (selections[i].status===2) {
                            this.$message.error('有效状态才能作废。')
                            return
                        }
                    }
                    this.$confirm('确认对所选数据进行作废处理？', '作废确认', {
                        type: 'warning',
                        confirmButtonText: '作废'
                    }).then(() => {
                        let ids = [];
                        selections.forEach((item) => {
                            ids.push(item.id)
                        })
                        let data ={
                            ids: ids,
                            status: 2,
                            updateUser: parseInt(Cookie.get('t8t-tc-uid'))
                        }

                        this.setSelectedInvalidate(data);
                    })
                }
            },

            //作废
            setSelectedInvalidate(virtualCardConfigs) {
                apiVirtualCardConfig.updateStatus(virtualCardConfigs)
                .then((res) => {
                    if (res.data.status === 200) {
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '已作废',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.getTableData()
                    }
                    else{
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: res.data.message,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    }
                })
            },
            // 表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            }
        }
    }

</script>

<style
    lang="css"
    scoped
>

</style>


<style>

</style>
