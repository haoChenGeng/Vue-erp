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

        <accAccountConfig-dialog
            v-if="dialogVisible"
            :rowId="rowId"
            :editType="editType"
            :isHasAccount="isHasAccount"
            @close="dialogVisible=false"
            @getTableData="getTableData">
        </accAccountConfig-dialog>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import Service from 'src/services/finance/Service.js'
    import Cookie from 'js-cookie'
    import * as config from './config'
    import AccAccountConfigDialog from './accAccountConfig-dialog.vue'
    import apiAccAccountConfig from 'src/services/finance/accAccountConfig.js'
    import commonApi from 'src/services/commonApi/commonApi.js'

    export default {
        components: { AccAccountConfigDialog },
        watch: {
//            $route: function () {
//                this.$refs['list-view'].getTableInstance().reloadTable()
//            },
        },
        activated () {
            this.$refs['t8tTable'].reloadTable()
        },
        data () {
            return {
                // 面包屑
                breadcrumbData: config.breadcrumbData,
                // 详情页路由地址
                detailRoute: '/test/resume/view',
                // service 和 method 目前需要加密
                service: Service.ACC_ACCOUNT_CONFIG.name,
                method: Service.ACC_ACCOUNT_CONFIG.methods.QUERYPAGE,
                tableArgs: {
                    search:{
                        aa: null
                    },
                    sort: ["createTime_desc"],
                    size: 100,
                    page:1
                },

                isLoading: false,
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                //当前账户类型下是否已经有账户
                isHasAccount: null,

                // 表头描述
                tableColumns: [
                    {prop: 'id', label: 'ID', show: true},
                    {prop: 'userTypeName', label: '用户类型', show: true},
                    {prop: 'accountTypeName', label: '账户类型', show: true},
                    {prop: 'accountLevel', label: '账户层级', list: 'accountLevel', show: true},
                    {prop: 'unitName', label: '单位', show: true},
                    {prop: 'parentUserTypeName', label: '上级用户类型', show: true},
                    {prop: 'parentAccountTypeName', label: '上级账户类型', show: true},
                    {prop: 'isOverdraft', label: '是否透支', list: 'isOverdraft', show: true},
                    {prop: 'overdraftType', label: '透支额度类型', list: 'overdraftType', show: true},
                    {
                        prop: 'overdraftCredit',
                        label: '透支额度',
                        align: 'right',
                        show: true,
                        formatter: function (val, row) {
                            return row.overdraftType === 0 ? "" : val
                        }
                    },
                    {prop: 'status', label: '状态', list: 'status', show: true},
                    {prop: 'createName', label: '创建人', show: true},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser', show: true},
                    {prop: 'updateName', label: '修改人', show: true},
                    {prop: 'updateTime', label: '修改时间', formatter: 'dateParser', show: true}
                ],
                // 搜索项对应值
                commonData: {
                    accountLevel: [
                        {value: 1, text: '一级'},
                        {value: 2, text: '二级'}
                    ],
                    isOverdraft: [
                        {
                            text: '是',
                            value: 1
                        },
                        {
                            text: '否',
                            value: 2
                        }
                    ],
                    status: [
                        {value: 1, text: '启用'},
                        {value: 2, text: '禁用'}
                    ],
                    overdraftType: [
                        {value: 1, text: '个性额度'},
                        {value: 2, text: '统一额度'}
                    ]
                }
            }
        },
        created() {
            //读取辅助资料
            //用户类型
            //this.getCommonOptions('6!610!61016!', 'userTypeCode')
            //this.getCommonOptions('6!610!61016!', 'parentUserTypeCode')
            //单位类型
            //this.getCommonOptions('6!610!61018!', 'unitCode')
        },
        methods: {
            getCommonOptions: function (fatherCode, selectName) {
                let arg = {
                    fields: [
                        "id",
                        "propertyName",
                        "propertyCode",
                        "propertyStatus",
                        "wholeCode"
                    ],
                    page: 1,
                    search: {
                        wholeCode_like: fatherCode
                    },
                    size: 1000
                }
                let list = []
                commonApi.queryPage(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.rows.forEach((item) => {
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.wholeCode,
                                        text: item.propertyName
                                    })
                                }
                            })
                            this.commonData[selectName] = list
                        }
                    })
            },
            //点击新增按钮
            btnAddClick() {
                this.editType = 'add'
                this.dialogVisible = true
                this.rowId = null
                this.isHasAccount = false
            },
            //点击编辑按钮
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
                    //判断当前选择的账户类型是否已经有账户
                    var accArgs = {
                        accountConfigId: this.rowId
                    }
                    this.isHasAccountFunc(accArgs)
                }
            },

            //启用
            btnEnableClick(){
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作。')
                } else {
                    for (let i = 0; i < selections.length; i++) {
                        if (selections[i].status === 1) {
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
                        apiAccAccountConfig.enbleConfig(params).then((res) => {
                            if (res.data.status === 200) {
                                let msg = ''
                                if(res.data.result.fail>0){
                                    msg = res.data.result.reasons
                                }
                                this.$msgbox({
                                    title: '消息',
                                    type: 'warning',
                                    message: '成功' + res.data.result.success + '条，失败' + res.data.result.fail + '条'+msg,
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
                } else {
                    for (let i = 0; i < selections.length; i++) {
                        if (selections[i].status === 2) {
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
                        apiAccAccountConfig.disableConfig(params).then((res) => {
                            if (res.data.status === 200) {
                                let msg = ''
                                if(res.data.result.fail>0){
                                    msg = '。原因: '+ res.data.result.reasons
                                }
                                this.$msgbox({
                                    title: '消息',
                                    type: 'warning',
                                    message: '成功' + res.data.result.success + '条，失败' + res.data.result.fail + '条'+msg,
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
                //判断当前选择的账户类型是否已经有账户
                var accArgs = {
                    accountConfigId: row.id
                }
                this.isHasAccountFunc(accArgs)
            },

            isHasAccountFunc(accArgs){
                apiAccAccountConfig.isHasAccountFunc(accArgs)
                    .then((res) => {
                        if (res.data.status === 200) {
                            debugger
                            this.isHasAccount =  res.data.result
                        }
                    })
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
