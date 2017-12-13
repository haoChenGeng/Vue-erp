<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <div class="g-main-container">
            <div class="dialog-tabs-left">
                <t8t-tree
                    :data="treeData"
                    :props="treeProps"
                    @node-click="treeClick"
                    :default-expanded-keys="[0]"
                    v-loading.body.lock="tabLoading"
                >
                </t8t-tree>
            </div>
            <div class="g-main-container-column">
                <t8t-toolbar
                    ref="toolbarList"
                    @ADD="addBtn"
                    @EDIT="editBtn"
                    @VIEW="viewBtn"
                    @ENABLE="updateStatus(1)"
                    @DISABLE="updateStatus(2)"
                >
                </t8t-toolbar>
                <t8t-table
                    :columns="columns"
                    :service="service"
                    :args="args"
                    :method="method"
                    @row-double-click="viewBtn"
                    :dataSource="dataSource"
                    :commonData="commonData"
                    ref="t8tTable"
                    @selection-change="selectionChange"
                >
                </t8t-table>
            </div>
        </div>
    </div>
</template>

<script>
    import Cookie from 'js-cookie'

    import ComplaintApi from 'src/services/delivery/complaint.js'
    import Service from 'src/services/delivery/Service.js'

    export default {
        name: 'page-order-config',
        components: {},
        data() {
            return {
                breadcrumbData: [{
                    title: '交付'
                },
                    {
                        title: '交付基础配置'
                    },
                    {
                        title: '投诉管理配置'
                    }
                ],
                //表格
                columns: [
                    {
                        prop: 'id',
                        label: 'ID'
                    }, {
                        prop: 'productPackageId',
                        label: '产品包',
                        list: "productPkgOption"
                    },{
                        prop: 'objectConfigId',
                        label: '投诉对象',
                        formatter:(v,r) => {
                            return r.objectName
                        }
                    }, {
                        prop: 'status',
                        label: '状态',
                        list: "statusOption"
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
                    chargeTypeOption: [
                        {text: "城市", value: 1},
                        {text: "组织", value: 2}
                    ],
                    roleOption: [
                        {
                            text: '售后客服',
                            value: 1
                        }, {
                            text: '客服',
                            value: 2
                        },
                    ],
                    statusOption: [
                        {
                            text: '禁用',
                            value: 2
                        }, {
                            text: '启用',
                            value: 1
                        },
                    ],
                    productPkgOption:[]
                },


                service: Service.COMPLAINT.name,
                method: Service.COMPLAINT.methods.COMPLAINTMANAQUERYPAGE,
                args: {
                    size: 20,
                    page: 1
                },

                dialogLoading: false,

                dataSource: [],
                createDialog: false,
                title: null,
                detailInfo: {
                    role: 1,
                    rules: ""
                },
                showBtn: true,
                treeProps: {
                    label: 'pkgName',
                    children: 'children'
                },
                treeData: [],
                dealer: Cookie.get('t8t-tc-username'),
            }
        },
        // watch: {
        //     $route: function () {
        //         this.$refs['t8tTable'].reloadTable()
        //     },
        // },
        activated(){
            this.$refs['t8tTable'].reloadTable()
        },
        created() {
            ComplaintApi.productPackageQueryPage({page:1,size:100}).then((res) => {
                if(res.data.status != 200) {
                    this.$message.error("产品包获取失败")
                    return
                }
                let _list = []
                res.data.result.rows.forEach((item) => {
                    _list.push({text: item.pkgName, value: item.id})
                })
                this.commonData.productPkgOption = _list
                this.treeData = [{
                    id: 0,
                    pkgName: "产品包",
                    children: res.data.result.rows}]
            }).catch(()=>{
                return
            })
            this.$nextTick(() => {
                this.selectionChange()
            })
        },
        methods: {
            treeClick(val) {
                if (val.id) {
                    this.args = {search: {productPackageId: val.id}}
                    this.$refs['t8tTable'].reloadTable()
                }else {
                    this.args = {size: 20,page: 1}
                    this.$refs['t8tTable'].reloadTable()
                }
            },
            addBtn() {
                this.$router.push({
                    path: "/delivery/complaints-manage-config-detail",
                    query: {mode: "add"}
                })

            },
            viewBtn(val) {
                let _self = this
                let row
                if(typeof(val) === 'object') {
                    row = val
                }else{
                    let selections = this.$refs['t8tTable'].getSelectRows();
                    if(selections.length > 0){
                        if(selections.length > 1) {
                            _self.$message.error("请选择单条操作单据后重试")
                            return false
                        }
                        row = selections[0]
                    }else{
                        _self.$message.error("请选择操作单据后重试")
                        return false
                    }
                }
                this.$router.push({
                    path: "/delivery/complaints-manage-config-detail?mode=view",
                    query: {mode: "view",id:row.id}
                })
            },
            editBtn() {
                let row
                let selections = this.$refs['t8tTable'].getSelectRows();
                if(selections.length > 0){
                    if(selections.length > 1) {
                        this.$message.error("请选择单条操作单据后重试")
                        return false
                    }
                    row = selections[0]
                }else{
                    this.$message.error("请选择操作单据后重试")
                    return false
                }
                this.$router.push({
                    path: "/delivery/complaints-manage-config-detail",
                    query: {mode: "edit",id:row.id}})
            },
            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()

            },
            updateStatus(status) {
                //todo comfir
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length > 0) {
                    let _selectList = []
                    let _args = {}
                    selections.forEach((item) => {
                        _selectList.push(item.id)
                    })
                    _args = {
                        "ids":_selectList,
                        "status": status,
                        "updateBy": this.dealer,
                        "updateName":this.dealer
                    }
                    ComplaintApi.complaintManaStatusUpdate(_args).then(res => {
                            if(res.data.status != 200) {
                                this.$msgbox({
                                    title: '消息',
                                    message: res.data.message || "操作失败",
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                            else{
                                this.$msgbox({
                                    title: '消息',
                                    message: "操作成功",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.getTableData()
                            }
                        }
                    ).catch(error => {
                        return
                    })
                } else {
                    this.$message.error("请选择单条配置后重试")
                    return
                }
            },
            //rowsChange
            selectionChange (rows){
                let viewStatus = false,editStatus = false,enableStatus= false,disableStatus = false
                if( rows && rows.length > 0){
                    enableStatus= true
                    disableStatus = true
                    if(rows.length === 1) {
                        viewStatus = true
                        editStatus = true
                    }
                }else{
                    viewStatus = editStatus = enableStatus= disableStatus = true
                }
                viewStatus ? this.$refs['toolbarList'].unDisableBySymbol('VIEW') : this.$refs['toolbarList'].disableBySymbol('VIEW')
                editStatus ? this.$refs['toolbarList'].unDisableBySymbol('EDIT') : this.$refs['toolbarList'].disableBySymbol('EDIT')
                enableStatus ? this.$refs['toolbarList'].unDisableBySymbol('ENABLE') : this.$refs['toolbarList'].disableBySymbol('ENABLE')
                disableStatus ? this.$refs['toolbarList'].unDisableBySymbol('DISABLE') : this.$refs['toolbarList'].disableBySymbol('DISABLE')
            }
        }
    }

</script>

<style
    lang="css"
    scoped
>
    .dialog-tabs-left {
        display: flex;
    }

    .textarea-container {
        text-align: center;
    }

    .dialog-tabs-left .el-tabs {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .dialog-tabs-left .el-tabs__header {
        margin-bottom: 0;
        margin-left: 10px;
        border-bottom: none;
        border-right: 1px solid #dfe6ec;
    }

    .dialog-tabs-left .el-tabs__item {
        height: 51px;
        line-height: 51px;
    }

    .dialog-tabs-left .el-tabs__content {
        display: flex;
        flex: 1;
    }

    .dialog-tabs-left .el-tab-pane {
        display: flex;
    }

    .dialog-tabs-left .t8t-tree-container {
        border: none;
        border-top: 1px solid #dfe6ec;
    }
</style>
<style lang="css">
</style>
