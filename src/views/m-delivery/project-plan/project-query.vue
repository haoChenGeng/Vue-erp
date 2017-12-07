<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :showToggleBtn="false"
            @submit="submitSearch"
        >
        </t8t-search>

        <div class="g-main-container">
            <t8t-tree
                :data="treeData"
                :props="treeProps"
                :default-expanded-keys="[1]"
                @node-click="onTreeClick"
            >
            </t8t-tree>
            <div class="g-main-container-column">
                <t8t-toolbar
                    @ENABLE="enabled"
                    @DISABLE="disabled"
                    @ADD="add"
                    @EDIT="edit"
                    @SHOW_REF="showRef"
                    ref="toolbar"
                >
                </t8t-toolbar>
                <t8t-table
                    :columns="columns"
                    :service="service"
                    :method="method"
                    :args="args"
                    :pageBar="true"
                    :commonData="commonData"
                    ref="t8tTable"
                    @selection-change="selectionChange"
                >
                    <template slot="projectId" scope="scope">
                        <a href="javascript:;"
                           @click="showDetail(scope.row['projectId'], scope.row['name'])">{{scope.row['projectId']}}</a>
                    </template>
                </t8t-table>
            </div>
        </div>
    </div>
</template>

<script>
    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'template-base',
        components: {},
        data () {
            return {
                breadcrumbData: [{title: '交付'}, {title: '项目计划'}, {title: '项目综合查询'}],
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                //搜索表单项配置
                fields: [
                    {type: 'input', label: '项目ID', name: 'id'},
                    {
                        type: 'popup',
                        label: '业主姓名',
                        name: 'ownerId',
                        textValue: 'truename',
                        filedValue: 'id',
                        triggerOnFocus: false,
                        remote: true,
                        service: Service.SYSACC.name,
                        method: Service.SYSACC.methods.queryPageOwner,
                        remoteArgs:{ page: 1, size: 20},
                        remoteQueryKey:"truename_like",
                        dialog: {
                            title: '业主搜索',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '业主姓名', name: 'truename_like'}
                                ]
                            },
                            table: {
                                service: Service.SYSACC.name,
                                method: Service.SYSACC.methods.queryPageOwner,
                                args: {},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'id',
                                        label: 'ID',
                                    },
                                    {
                                        prop: 'truename',
                                        label: '业主姓名'
                                    },
                                    {
                                        prop: 'address',
                                        label: '业主地址',
                                        formatter: this.ownerAddressFormatter
                                    }
                                ]
                            }
                        }
                    }
                ],
                columns: [
                    {"prop": "projectId", "label": "项目ID", "width": 130},
                    {"prop": "ownerName", "label": "业主姓名", "width": 130},
                    {"prop": "organizationName", "label": "组织", "width": 150},
                    {"prop": "productPkgName", "label": "装修产品", "width": 150},
                    {"prop": "address", "label": "工地地址", "formatter": this.addressFormatter}
//                        { "prop": "moduleStatus", "label": "转入时间" ,"formatter": "dateParser"},
//                        { "prop": "effectTime", "label": "签约时间", "formatter": "dateParser"},
//                        { "prop": "effectTime", "label": "开工时间", "formatter": "dateParser"},
//                        { "prop": "effectTime", "label": "竣工时间", "formatter": "dateParser"},
//                        { "prop": "effectTime", "label": "项目结束时间", "formatter": "dateParser"},
//                        { "prop": "outsideSchdule", "label": "项目完结类型" }
                ],
                commonData: {
                    moduleStatus: [
                        {
                            text: '启用',
                            value: 1
                        },
                        {
                            text: '禁用',
                            value: 0
                        }
                    ]
                },
                service: Service.PLAN.name,
                method: Service.PLAN.methods.projectQueryPage,
                args: {fields: ["id", "organizationId", "ownerId", "productPkgId", "cityId", "townId", "estateId", "houseAddress"]},
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                dialogTitle: '',
                tableData: [],
                selectedRows: [],
            }
        },
        created (){
            TemplateOperator.queryTreeByType({typeCodes: ['001003010']}).then((res) => {
                if (res.data.status === 200) {
                    this.treeData = [res.data.result];
                }
            })
        },
        methods: {
            //搜素
            submitSearch(obj) {
                this.args = {
                    search: obj,
                    fields: ["id", "organizationId", "ownerId", "productPkgId", "cityId", "townId", "estateId", "houseAddress"]
                }
                this.$refs['t8tTable'].getTableInstance().resetActionLog();
            },

            addressFormatter(val, row, col, tab)
            {
                let address;
                address = (row.cityName || '') + (row.townName || '') + (row.estateName || '') + (row.houseAddress || '');
                return address;
            },

            ownerAddressFormatter(val, row, col, tab)
            {
                let address;
                address = (row.oshen || '') + (row.ocity || '') + (row.adds || '');
                return address;
            },
            onTreeClick (nodeData){
                this.args = {
                    page: 1,
                    size: 20,
                    search: {organizationId: nodeData.id},
                    fields: ["id", "organizationId", "ownerId", "productPkgId", "cityId", "townId", "estateId", "houseAddress"]
                }
            },
            //查看详情
            showDetail: function (id, name) {
                this.$router.push({
                    path: '/tochat-delivery/project-show',
                    query: {id: id}
                })
            },
            //启用
            enabled: function () {
                let selections = this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择要启用的行！');
                } else {
                    let ids = [];
                    for (let i in selections) {
                        selections[i].id && ids.push(selections[i].id);
                    }
                    if (ids.length == 0) {
                        this.$message.error('请选择要启用的行！');
                    }
                    let data = {ids: ids, status: 1, optType: 1, updateUser: +Cookie.get('t8t-tc-uid')};
                    TemplateOperator.setModuleStatus(data).then((res) => {
                        if (res.data.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '启用成功！'
                            });
                            this.getTableData();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.message
                            })
                        }
                    })
                }
            },
            disabled: function () {
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要禁用的行！')
                } else {
                    let ids = [];
                    for (let i in selections) {
                        selections[i].id && ids.push(selections[i].id);
                    }
                    if (ids.length == 0) {
                        this.$message.error('请选择要禁用的行！');
                    }
                    let data = {ids: ids, status: 0, optType: 2, updateUser: +Cookie.get('t8t-tc-uid')}
                    TemplateOperator.setModuleStatus(data).then((res) => {
                        if (res.data.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '禁用成功！'
                            });
                            this.getTableData();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.message
                            })
                        }
                    })
                }
            },
            add () {
                this.dialogTitle = '新增排期模板'
                this.editType = 'add'
                this.dialogVisible = true
                this.rowId = null
            },
            edit (){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要编辑的行！')
                } else if (selections.length > 1) {
                    this.$message.error('只能选择一行进行编辑！')
                } else {
                    this.dialogTitle = '编辑排期模板'
                    this.editType = 'edit'
                    this.dialogVisible = true
                    this.rowId = selections[0].id
                }
            },
            showRef (){
                let rows = this.$refs['t8tTable'].getSelectRows();
                if (rows.length < 1) {
                    this.$message.error('请选择要处理的行！')
                    return
                }
                if (rows.length > 1) {
                    this.$message.error('只能查看一行！')
                    return
                }
                this.$router.push({
                    path: '/tochat-delivery/template-ref',
                    query: {refId: rows[0]['id'], scheduleName: rows[0]['name']}
                })
                // this.$msgbox({
                //     title: '消息',
                //     type: 'success',
                //     message: '查看引用',
                //     confirmButtonText: '知道了',
                //     confirmButtonClass: 'is-plain'
                // })
            },
            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },
            //行变化事件
            selectionChange (rows){
                //已选择行
                this.selectedRows = rows;
                //启用禁用按钮交互
                let enableStatus = false;
                let disableStatus = false;
                if (rows.length > 0) {
                    for (let i in rows) {
                        if (rows[i].moduleStatus == 1) {
                            enableStatus = true;
                        }
                        if (rows[i].moduleStatus == 0) {
                            disableStatus = true;
                        }
                    }
                }
                if (enableStatus) {
                    this.$refs['toolbar'].disableBySymbol('ENABLE');
                } else {
                    this.$refs['toolbar'].unDisableBySymbol('ENABLE');
                }
                if (disableStatus) {
                    this.$refs['toolbar'].disableBySymbol('DISABLE');
                } else {
                    this.$refs['toolbar'].unDisableBySymbol('DISABLE');
                }
            }
        }
    }
</script>

<style>

</style>
