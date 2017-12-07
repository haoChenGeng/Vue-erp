<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :showToggleBtn="false"
            :selectSource="commonData"
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
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import TemplateOperator1 from 'src/services/delivery/pcm.js'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'template-base',
        components: {},
        data () {
            return {
                breadcrumbData: [{title: '交付'}, {title: '项目计划'}, {title: '项目进度管理'}],
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                //搜索表单项配置
                fields: [
                    {type: 'input', label: '项目ID', name: 'id'},
                    {type: 'select',label: '门店',name: 'organizationId',selectSourceKey:'organization',filterable:true},
                    {type: 'select',label: '状态',name: 'orderMainStatus',selectSourceKey:'search_mainStatusCode',filterable:true},
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
                    },
                    {
                        type: 'popup',
                        label: '设计师',
                        name: 'chiefDesignerId',
                        textValue: 'name',
                        filedValue: 'accountId',
                        triggerOnFocus: false,
                        remote: true,
                        service: Service.PLAN.name,
                        method: Service.PLAN.methods.accountQueryByRole,
                        remoteArgs:{ page: 1, size: 20, roleType: 1 },
                        remoteQueryKey:"name_like",
                        dialog: {
                            title: '设计师搜索',
                            size: 'large',
                            dialogWidth: '850px',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '中文名', name: 'name_like'},
                                    {type: 'input', label: '英文名', name: 'enName_like'}
                                ]
                            },
                            table: {
                                service: Service.PLAN.name,
                                method: Service.PLAN.methods.accountQueryByRole,
                                args: {roleType: 1},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'name',
                                        label: '中文名'
                                    },
                                    {
                                        prop: 'enName',
                                        label: '英文名'
                                    },
                                    {
                                        prop: 'nick',
                                        label: '昵称'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        type: 'popup',
                        label: '工长',
                        name: 'workerId',
                        textValue: 'workerName',
                        filedValue: 'accountId',
                        triggerOnFocus: false,
                        remote: true,
                        service: Service.TEMPLATE.name,
                        method: Service.TEMPLATE.methods.workerBaseServiceQueryPageInternal,
                        remoteArgs:{ page: 1, size: 20},
                        remoteQueryKey:"workerName_like",
                        dialog: {
                            title: '工长搜索',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '工长姓名', name: 'workerName_like'}
                                ]
                            },
                            table: {
                                service: Service.TEMPLATE.name,
                                method: Service.TEMPLATE.methods.workerBaseServiceQueryPageInternal,
                                args: {},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'accountId',
                                        label: 'ID',
                                    },
                                    {
                                        prop: 'workerName',
                                        label: '工长姓名'
                                    },
                                    {
                                        prop: 'address',
                                        label: '详细地址',
                                        formatter: function(val, row, col, tab){
                                            return row.address;
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    {
                        type: 'popup',
                        label: '质检',
                        name: 'projectManagerId',
                        textValue: 'name',
                        filedValue: 'accountId',
                        triggerOnFocus: false,
                        remote: true,
                        service: Service.PLAN.name,
                        method: Service.PLAN.methods.accountQueryByRole,
                        remoteArgs:{ page: 1, size: 20, roleType: 2 },
                        remoteQueryKey:"name_like",
                        dialog: {
                            title: '质检搜索',
                            size: 'large',
                            dialogWidth: '850px',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '中文名', name: 'name_like'},
                                    {type: 'input', label: '英文名', name: 'enName_like'}
                                ]
                            },
                            table: {
                                service: Service.PLAN.name,
                                method: Service.PLAN.methods.accountQueryByRole,
                                args: {roleType: 2},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'name',
                                        label: '中文名'
                                    },
                                    {
                                        prop: 'enName',
                                        label: '英文名'
                                    },
                                    {
                                        prop: 'nick',
                                        label: '昵称'
                                    }
                                ]
                            }
                        }
                    },
                ],
                columns: [
                    {"prop": "projectId", "label": "项目ID"},
                    {"prop": "orderMainStatusName", "label": "状态"},
                    {"prop": "organizationName", "label": "门店"},
                    {"prop": "estateName", "label": "楼盘"},
                    {"prop": "ownerName", "label": "客户姓名"},
                    {"prop": "productPkgName", "label": "产品包"},
                    {"prop": "createTime", "label": "发布日期", "formatter": "dateParser"},
                    {"prop": "customerManagerName", "label": "客户经理"},
                    {"prop": "chiefDesignerName", "label": "首席设计师"},
                    {"prop": "chiefWorkerName", "label": "工长"},
                    {"prop": "projectManagerName", "label": "质检"}
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
                    ],
                    organization:[],
                    search_mainStatusCode:[]
                },
                service: Service.PLAN.name,
                method: Service.PLAN.methods.projectQueryPage,
                args: {fields: ["id", "organizationId", "ownerId","orderMainStatus","ownerName","createTime","productPkgId", "estateId","customerManagerId","chiefDesignerId","chiefWorkerId","projectManagerId"]},
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
            });
            this.getOrg();
            this.getMainStatus();
        },
        methods: {
            getOrg(){
                let args = {page:1,size:150,search:{typeCode:'001003010',isDel: 0}};
                commonApi.queryAll(args).then((res)=>{
                    let list = [];
                    if(res.data.status === 200){
                        res.data.result.rows.forEach((item)=>{
                            list.push({
                                text:item.name,
                                value:item.id
                            });
                        })
                        this.commonData.organization = list;
                    }else{

                    }
                }).catch()
            },
            getMainStatus(){
                //主状态
                TemplateOperator1.queryPropertyUnion({page: 1, size: 200, search: {pPropertyCode: "109"}}).then((res) => {
                    if (res.data.status === 200) {
                        let searchList = [];
                        let rows = res.data.result;
                        for (let i in rows) {
                            searchList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                        }
                        this.commonData.search_mainStatusCode = searchList;
                    }
                });
            },
            //搜素
            submitSearch(obj) {
                let fields = this.args.fields;
                this.args = {
                    search: obj,
                    fields: fields
                }
            },
            onTreeClick (nodeData){
                let fields = this.args.fields;
                this.args = {
                    page: 1,
                    size: 20,
                    search: {organizationId: nodeData.id},
                    fields: fields
                }
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
            //查看详情
            showDetail: function (id, name) {
                this.$router.push({
                    path: '/tuchat-delivery/project-detail',
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
                    path: '/tuchat-delivery/template-ref',
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
