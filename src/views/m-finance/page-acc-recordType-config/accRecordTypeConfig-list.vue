<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-toolbar
            @ADD="btnAddClick"
            @EDIT="btnEditClick"
            @ENABLE="btnEnableClick"
            @DISABLE="btnDisableClick">
        </t8t-toolbar>
        <t8t-table
            :columns="tableColumns"
            :service="service"
            :args="tableArgs"
            :method="method"
            :isLoading="isLoading"
            :commonData="commonData"
            :customColumn="true"
            ref="t8tTable"
            @row-double-click="handleRowDbClick"
        >
        </t8t-table>

        <accRecordTypeConfig-dialog
            v-if="dialogVisible"
            :rowId="rowId"
            :editType="editType"
            @close="dialogVisible=false"
            @getTableData="getTableData">
        </accRecordTypeConfig-dialog>
    </div>
</template>

<script>
    import Service from 'src/services/finance/Service.js'
    import Cookie from 'js-cookie'
    import * as config from './config'
    import accRecordTypeConfigDialog from './accRecordTypeConfig-dialog.vue'
    import apiAccRecordTypeConfig from 'src/services/finance/apiAccRecordTypeConfig.js'

    export default {
        components: { accRecordTypeConfigDialog },
        data () {
            return {
                // 面包屑
                breadcrumbData: config.breadcrumbData,
                // 详情页路由地址
                detailRoute: '/test/resume/view',
                // service 和 method 目前需要加密
                service: Service.ACC_ACCOUNT_CONFIG.name,
                method: Service.ACC_ACCOUNT_CONFIG.methods.TYPE_QUERYPAGE,
                tableArgs: {
                    search:{
                        aa: null
                    },
                    sort: ["createTime_desc"],
                    size: 100,
                    page: 1
                },

                isLoading: false,
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,

                // 表头描述
                tableColumns: [
                    {prop: 'id', label: 'ID', show: true},
                    {prop: 'recordTypeViewCode', label: '编码', show: true},
                    {prop: 'recordTypeName', label: '收支类型', show: true},
                    {prop: 'recordType', label: '收支', list: 'recordType', show: true},
                    {prop: 'reverseRecordTypeViewCode', label: '编码', show: true},
                    {prop: 'reverseRecordTypeName', label: '收支反向类型', show: true},
                    {prop: 'isK3', label: '是否需传K3', list: 'isK3', show: true},
                    {
                        prop: 'status',
                        label: '状态',
                        show: true,
                        formatter: function (val,row,col,tab) {
                            return val===1 ? '启用' : '禁用'
                        }
                    },
                    {prop: 'createName', label: '创建人', show: true},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser', show: true},
                    {prop: 'updateName', label: '修改人', show: true},
                    {prop: 'updateTime', label: '修改时间', formatter: 'dateParser', show: true}
                ],
                // 搜索项对应值
                commonData: {
                    recordType: [
                        {value: 1, text: '收入'},
                        {value: 2, text: '支出'}
                    ],
                    isK3: [
                        {
                            text: '需传',
                            value: 1
                        },
                        {
                            text: '不传',
                            value: 2
                        }
                    ]
                }
            }
        },
        methods: {
            //点击新增按钮
            btnAddClick() {
                this.editType = 'add'
                this.dialogVisible = true
                this.rowId = null
            },
            //点击编辑按钮
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

            //启用
            btnEnableClick(){
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                }else {
                    for(let i = 0;i<selections.length;i++) {
                        if (selections[i].status===1) {
                            this.$message.error('禁用状态才能启用。')
                            return
                        }
                    }
                    this.$confirm('确认对所选数据进行启用处理？', '启用确认', {
                        type: 'warning',
                        confirmButtonText: '启用'
                    }).then(() => {
                        let ids = []
                        let params = {}
                        selections.forEach((item) => {
                            ids.push(item.id)
                        })
                        params.ids = ids
                        params.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                        params.updateName = Cookie.get('t8t-tc-username')
                        params.updateBy = Cookie.get('t8t-tc-username')
                        apiAccRecordTypeConfig.enbleConfig(params).then((res) => {
                            if (res.data.status === 200) {
                                let msg = ''
                                if(res.data.result.fail>0){
                                    msg = '。原因: '+ res.data.result.reasons
                                }
                                this.$msgbox({
                                    title: '消息',
                                    type: 'warning',
                                    message: '启用成功' + res.data.result.success + '条，失败' + res.data.result.fail + '条'+ msg,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.getTableData()
                            } else {
                                this.$message.error(res.data.message)
                            }
                        })
                    })
                }
            },

            //禁用
            btnDisableClick(){
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                }else {
                    for(let i = 0;i<selections.length;i++) {
                        if (selections[i].status !=1) {
                            this.$message.error('启用状态才能禁用。')
                            return
                        }
                    }
                    this.$confirm('确认对所选数据进行禁用处理？', '禁用确认', {
                        type: 'warning',
                        confirmButtonText: '禁用'
                    }).then(() => {
                        let ids = []
                        let params = {}
                        selections.forEach((item) => {
                            ids.push(item.id)
                        })
                        params.ids = ids
                        params.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                        params.updateName = Cookie.get('t8t-tc-username')
                        params.updateBy = Cookie.get('t8t-tc-username')
                        apiAccRecordTypeConfig.disableConfig(params).then((res) => {
                            if (res.data.status === 200) {
                                let msg = ''
                                if(res.data.result.fail>0){
                                    msg = '。原因: '+ res.data.result.reasons
                                }
                                this.$msgbox({
                                    title: '消息',
                                    type: 'warning',
                                    message: '禁用成功' + res.data.result.success + '条，失败' + res.data.result.fail + '条'+msg,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.getTableData()
                            } else {
                                this.$message.error(res.data.message)
                            }
                        })
                    })
                }
            },

            //双击行查看
            handleRowDbClick(row) {
                this.editType = 'edit'
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

<style lang="css" scoped>

</style>
