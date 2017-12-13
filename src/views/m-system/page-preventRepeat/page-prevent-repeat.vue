<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-toolbar
            @ADD="btnAddClick"
            @EDIT="btnEditClick">
        </t8t-toolbar>
        <t8t-table
            :columns="columns"
            :service="service"
            :args="args"
            :method="method"
            :isLoading="isLoading"
            :commonData="commonData"
            ref="t8tTable"
            @row-double-click="handleRowDbClick"
        >
        </t8t-table>
        <prevent-repeat-dialog
            v-if="dialogVisible"
            :rowId="rowId"
            :editType="editType"
            @close="dialogVisible=false"
            @getTableData="getTableData">
        </prevent-repeat-dialog>
    </div>
</template>

<script>
    import PreventRepeatDialog from './prevent-repeat-dialog.vue'
    import Cookie from 'js-cookie'
    import Service from 'src/services/supply/Service.js'
    import preventRepeat from 'src/services/system/preventRepeat.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'

    export default {
        name: 'page-prevent-repeat',
        components: {
            PreventRepeatDialog
        },
        data() {
            return {
                breadcrumbData: [{
                    title: '系统管理'
                },
                    {
                        title: '配置管理'
                    },
                    {
                        title: '业务防重复配置'
                    }
                ],
                //表格
                columns: [{
                    prop: 'id',
                    label: 'ID'
                }, {
                    prop: 'bizId',
                    label: '业务系统',
                    list: 'bizOptions'
                }, {
                    prop: 'bizSubId',
                    label: '业务系统子模块',
                    list: 'bizSubOptions'
                }, {
                    prop: 'billId',
                    label: '单据类型',
                    list: 'billOptions'
                }, {
                    prop: 'bizDesc',
                    label: '业务描述'
                }, {
                    prop: 'secretKey',
                    label: '业务授权MD5密钥'
                }, {
                    prop: 'allowRepeat',
                    label: '业务场景下是否允许重复获取单号',
                    list: 'allowRepeat'
                },{
                    prop: 'createTime',
                    label: '创建时间',
                    formatter: "dateParser"
                }, {
                    prop: 'updateTime',
                    label: '修改时间',
                    formatter: "dateParser"
                }],
                commonData: {
                    allowRepeat: [
                        {
                            text: '不允许',
                            value: 1
                        },
                        {
                            text: '允许',
                            value: 2
                        }
                    ],
                    bizOptions: [],
                    bizSubOptions: [],
                    billOptions: []
                },
                service: Service.PREVENTREPEAT.name,
                method: Service.PREVENTREPEAT.methods.bizArgsLicenseServiceQueryPage,
                args: {
                    search: {
                        id_gt: 0
                    },
                    size: 20,
                    page: 1
                },
                isLoading: false,
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null
            }
        },
        created() {
            this.getCommonOptions(11010, 'bizOptions');
            this.getCommonOptions(11011, 'bizSubOptions');
            this.getCommonOptions(11605, 'billOptions');
    },
    methods: {
        //辅助资料
        getCommonOptions: function (fatherCode, selectName) {
            let arg = {
                page: 1,
                search: {
                    pPropertyCode: fatherCode
                },
                size: 1000
            }
            let list = []
            apiCommon.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus === 1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            }
                            ;
                        })
                        this.commonData[selectName] = list
                    }
                })
        },
        //点击新增按钮
        btnAddClick()
        {
            this.editType = 'add'
            this.dialogVisible = true
            this.rowId = null
        },
        btnEditClick()
        {
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
            }
        },
        //双击行查看
        handleRowDbClick(row)
        {
            this.editType = 'see'
            this.dialogVisible = true
            this.rowId = row.id
        },
        //表格
        getTableData()
        {
            this.$refs['t8tTable'].reloadTable()
        }
    }
    }

</script>

<style lang="css" scoped>

</style>


<style>
</style>
