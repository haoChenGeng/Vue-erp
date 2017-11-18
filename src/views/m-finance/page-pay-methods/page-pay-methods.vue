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
            @row-double-click="handleRowDbClick"
        >
        </t8t-table>
        <pay-dialog
        v-if="dialogVisible"
        :rowId="rowId"
        :editType="editType"
        @close="dialogVisible=false"
        @getTableData="getTableData">
        </pay-dialog>
    </div>
</template>

<script>
    import PayDialog from './pay-dialog.vue'
    import Cookie from 'js-cookie'
    import Service from 'src/services/finance/Service.js'
    import apiDebitChannel from 'src/services/finance/debitChannel.js'
    export default {
        name: 'pay-methods',
        components: {
            PayDialog
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
                    title: '收款方式配置'
                }
                ],
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                //表格
                columns: [{
                    prop: 'code',
                    label: '编码'
                }, {
                    prop: 'name',
                    label: '收款方式'
                }, {
                    prop: 'organizationName',
                    label: '组织'
                }, {
                    prop: 'channelType',
                    label: '渠道',
                    list: 'channelType'
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
                    channelType: [
                        {
                            text: '线上',
                            value: 1
                        },
                        {
                            text: '线下',
                            value: 2
                        }
                    ],
                    status: [
                        {
                            text: '作废',
                            value: 0
                        },
                        {
                            text: '有效',
                            value: 1
                        }
                    ]
                },
                isLoading: false,
                service: Service.DEBITCHANNEL.name,
                method: Service.DEBITCHANNEL.methods.PAYMETHOD_QUERY,
            }
        },
        methods: {
            //点击新增按钮
            btnAddClick() {
                this.editType = 'add'
                this.dialogVisible = true
                this.rowId = null
            },
            btnEditClick() {
                // 编辑
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作。')
                }else{
                    this.editType = 'edit'
                    this.dialogVisible = true
                    this.rowId = selections[0].id
                }
            },
            btnVoidClick() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else {
                     for(let i = 0;i<selections.length;i++) {
                        if (selections[i].status===0) {
                            this.$message.error('有效状态才能作废。')
                            return
                        }
                    }
                    this.$confirm('确认对所选数据进行作废处理？', '作废确认', {
                        type: 'warning',
                        confirmButtonText: '作废'
                    }).then(() => {
                        let data = [];
                        selections.forEach((item) => {
                            let p = {}
                            p.status = 0
                            p.id = item.id
                            p.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                            data.push(p)
                        })
                        this.setSelectedInvalidate(data);
                    })
                }
            },
            //作废
            setSelectedInvalidate(debitChannels) {
               apiDebitChannel.batchStatusUpdate({debitChannels})
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
            //双击行查看
            handleRowDbClick(row) {
                this.editType = 'see'
                this.dialogVisible = true
                this.rowId = row.id
            },
            //表格
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
