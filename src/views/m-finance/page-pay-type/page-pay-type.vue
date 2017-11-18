<template>
    <div class="page-pay-type">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-toolbar
            @ADD="handleBtnAddClick()"
            @EDIT="handleBtnEditClick()"
            @VOID="handleBtnVoidClick()"
        ></t8t-toolbar>
        <t8t-table
            ref="t8tTable"
            :columns="columns"
            :service="service"
            :method="method"
            :commonData="commonOptionsConfig"
            @row-double-click="ontableDBclick"
        ></t8t-table>
        <my-dialog
            v-if="dialogVisible"
            :editable="dialogEditable"
            :businessTypes="businessTypes"
            :debitObjects="debitObjects"
            :nameTypes="nameTypes"
            @close="dialogVisible=false"
            @success="getTableData"
            :status="dialogStatus"
            :rowID="rowID"
        ></my-dialog>
    </div>
</template>

<script>
    import MyDialog from './dialog.vue'
    import Cookie from 'js-cookie'
    import columns from './tableColumns.json'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import api from 'src/services/finance/debitType.js'
    import Service from 'src/services/finance/Service.js'
    export default {
        name: 'page-pay-type',
        components: {
            MyDialog
        },
        data() {
            return {
                //面包屑
                dialogVisible: false,
                dialogEditable: false,
                dialogStatus: 'create',
                businessTypes: [],
                debitObjects: [],
                nameTypes: [],
                rowID: 0,
                breadcrumbData: [
                    { title: '财务' },
                    { title: '财务基础配置' },
                    { title: '收款类型配置' }],
                //table
                columns: columns,
                service: Service.DEBITCHANNEL.name,
                method: Service.DEBITCHANNEL.methods.DEBITTYPE_QUERYPAGE,
                commonOptionsConfig: {
                    aOptions: [
                        { text: '必填', value: 1 },
                        { text: '非必填', value: 0 },
                    ],
                    statusOptions: [
                        { text: '作废', value: 0 },
                        { text: '有效', value: 1 },
                    ]
                }
            }
        },
        computed: {

        },
        methods: {
            //form
            handleBtnOKClick() {
                this.dialogVisible = false
            },
            handleBtnCancleClick() {
                this.dialogVisible = false
            },
            //点击添加按钮
            handleBtnAddClick() {
                // 显示新增弹窗
                this.dialogVisible = true
                this.dialogEditable = true
                this.dialogStatus = 'create'
                this.getMyData()
            },
            //点击编辑按钮
            handleBtnEditClick() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条数据进行操作')
                } else {
                    // 显示编辑弹窗
                    this.dialogVisible = true
                    this.dialogEditable = true
                    this.dialogStatus = 'update'
                    this.getMyData()
                    this.rowID = selections[0].id
                }
            },
            //点击作废按钮
            handleBtnVoidClick() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再操作')
                } else {
                    this.$confirm('确认对所选数据进行作废处理？', '作废确认', {
                        type: 'warning',
                        confirmButtonText: '作废'
                    }).then(() => {
                        selections.forEach((item) => {
                            item.status = 0
                            item.updateUser = Cookie.get('t8t-tc-uid')
                        })
                        let requestData = {
                            debitTypes: selections
                        }
                        api.batchupdate(requestData)
                            .then(res => {
                                if (res.data.status === 200 && res.data.result === 1) {
                                    // 成功弹窗
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '已作废',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    this.getTableData()
                                } else {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: res.data.message,
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    this.getTableData()
                                }
                            })
                    })
                }
            },
            ontableDBclick(row) {
                this.dialogVisible = true
                this.dialogEditable = false
                this.dialogStatus = 'update'
                this.rowID = row.id
            },
            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },
            //辅助资料
            getCommonData: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            };
                        })
                        this[selectName] = list
                    }
                })
            },
            getMyData() {
                // 业务类型
                this.getCommonData('11008', 'businessTypes')
                // 收款对象
                this.getCommonData('61004', 'debitObjects')
                // 收款类型
                this.getNameTypes('61002', 'nameTypes')
            },
            //辅助资料,收款类型
            getNameTypes: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName,
                                    code: item.propertyCode
                                })
                            };
                        })
                        this[selectName] = list
                    }
                })
            }
        },
        //table
        created() {
            this.getMyData()
        }
    }

</script>

<style
    lang="css"
    scoped
>
    .g-main-container {
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow: auto;
    }
</style>


<style>

</style>
