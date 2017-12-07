<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
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
                <div slot="tree-header" class="tree-button">
                    <el-button @click="groupAdd"  size="toolbar">新增分组</el-button>
                    <el-button @click="groupDel" size="toolbar">删除分组</el-button>
                </div>
            </t8t-tree>
            <div class="g-main-container-column">
                <t8t-toolbar
                    @ENABLE="enabled"
                    @DISABLE="disabled"
                    @ADD="add"
                    @EDIT="edit"
                    @VIEW="view"
                    ref="toolbar"
                >
                </t8t-toolbar>
                <t8t-table
                    :columns="columns"
                    :service="service"
                    :method="method"
                    :args="args"
                    :pageBar="true"
                    :indexCol="false"
                    :commonData="commonData"
                    ref="t8tTable"
                    @selection-change="selectionChange"
                    @row-double-click="view"
                >
                </t8t-table>
            </div>
        </div>
        <entry-dialog
            v-if="dialogVisible"
            :data="groupData"
            :editType="editType"
            :rowId="rowId"
            :title="dialogTitle"
            @close="dialogVisible=false"
            @getTableData="getTableData">
        </entry-dialog>
        <group-dialog-top
            v-if="showTopGroupDialog"
            :title="groupDialogTitle"
            :rowId="rowId"
            :editType="editType"
            @close="showTopGroupDialog=false"
            @getTree="getTree"
        >
        </group-dialog-top>
        <group-dialog
            v-if="showGroupDialog"
            :title="groupDialogTitle"
            :data="groupData"
            :editType="editType"
            @close="showGroupDialog=false"
            @getTree="getTree"
        >
        </group-dialog>
    </div>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import EntryDialog from './entry-dialog.vue'
    import GroupDialog from './group-dialog.vue'
    import GroupDialogTop from './group-dialog-top.vue'
    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    export default {
        name: 'bills-entry',
        components: {
            EntryDialog,
            GroupDialog,
            GroupDialogTop
        },
        data () {
            return {
                breadcrumbData: [{ title: '交付' },{ title: '交付基础数据' },{ title: '单据条目管理' }],
                treeData: [],
                groupData:null,
                treeProps: {
                    label: 'groupName',
                    children: 'children'
                },
                //搜索表单项配置
                fields: [
                    {type: 'input',label: '条目问题',name: 'content_like'},
                    {type: 'select',label: '控件类型',name: 'widgetType',selectSourceKey:'widgetType',filterable:true},
                    {type: 'select',label: '状态',name: 'configStatus', selectSourceKey:'configStatus',filterable:true}
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    configStatus: [
                        {
                            text: '启用',
                            value: 0
                        },
                        {
                            text: '禁用',
                            value: 1
                        }
                    ],
                    widgetType: [] //报价模板list
                },
                columns:
                    [
                        { "prop": "id", "label": "序号" },
                        { "prop": "content", "label": "条目问题" },
                        { "prop": "detail", "label": "问题详细" },
                        { "prop": "widgetTypeName", "label": "控件类型" },
                        { "prop": "configStatus", "label": "状态" , "list":"configStatus"},
                        { "prop": "createTime", "label": "创建日期", "formatter": 'dateParser'}
                    ],
                commonData: {
                    configStatus: [
                        {
                            text: '启用',
                            value: 0
                        },
                        {
                            text: '禁用',
                            value: 1
                        }
                    ]
                },
                service: Service.ENTRY.name,
                method:  Service.ENTRY.methods.groupQuestionQueryPage,
                args: {sort: ['id_desc']},
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                showTopGroupDialog: false,
                showGroupDialog: false,
                rowId: null,
                dialogTitle : '',
                groupDialogTitle: '',
                tableData: [],
                selectedRows:[]
            }
        },
        created (){
            let arg =  {
                page: 1,
                search: {
                    pPropertyCode: 41701
                },
                size: 100
            }
            let list = [];
            commonApi.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            }
                        });
                        this.selectSource.widgetType = list;
                    }
            });
            this.getTree();
        },
        methods: {
            //搜素
            submitSearch(obj) {
                let searchData = Object.assign(obj,(this.groupData === null ? {} : {groupId: this.groupData.id}));
                this.args = { sort: ['id_desc'],search: searchData}
            },
            onTreeClick (nodeData){
                //this.searchData = Object.assign(this.searchData,{groupId: nodeData.id});
                this.groupData={id: nodeData.id, groupName: nodeData.groupName};
                this.args = {page:1, size:20, sort: ['id_desc'], search: {groupId: nodeData.id}}
            },
            getTree(){
                TemplateOperator.groupListAsTree({}).then((res) => {
                    if(res.data.status === 200){
                        this.treeData = res.data.result;
                    }
                })
            },
            groupAdd() {
                this.groupDialogTitle = '新增分组';
                if(this.groupData !== null){
                    this.showGroupDialog = true;
                }else{
                    this.showTopGroupDialog = true;
                }
            },
            groupDel() {
                if(this.groupData === null){
                    this.$message.error('请选择要删除的分组！');
                }else{
                    this.$confirm('删除分组将删除自身和所有子级分组，是否继续？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let args = {
                            id: this.groupData.id,
                            updateUser: +Cookie.get('t8t-tc-uid')
                        }
                        TemplateOperator.groupDelete(args).then((res) => {
                            if (res.data.status === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功！'
                                });
                                this.groupData = null;
                                this.getTree();
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: res.data.message
                                })
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'error',
                            message: '请求出错！'
                        })
                    });
                }
            },
            //查看详情
            showDetail: function(id, name){
                this.$router.push({
                    path: '/tochat-delivery/template-detail',
                    query:{id: id, name:name}
                })
            },
            //启用
            enabled: function(){
                let selections = this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择要启用的行！');
                } else{
                    let ids = [];
                    for(let i in selections){
                        selections[i].id && ids.push(selections[i].id);
                    }
                    if(ids.length == 0){
                        this.$message.error('请选择要启用的行！');
                    }
                    let data = {idList: ids, status:0 , updateUser: +Cookie.get('t8t-tc-uid')};
                    TemplateOperator.questionAuditStatus(data).then((res) => {
                        if (res.data.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '启用成功！'
                            });
                            this.getTableData();
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.data.message
                            })
                        }
                    })
                }
            },
            disabled: function(){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要禁用的行！')
                } else{
                    let ids = [];
                    for(let i in selections){
                        selections[i].id && ids.push(selections[i].id);
                    }
                    if(ids.length == 0){
                        this.$message.error('请选择要禁用的行！');
                    }
                    let data = {idList: ids, status:1 , updateUser: +Cookie.get('t8t-tc-uid')}
                    TemplateOperator.questionAuditStatus(data).then((res) => {
                        if (res.data.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '禁用成功！'
                            });
                            this.getTableData();
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.data.message
                            })
                        }
                    })
                }
            },
            add () {
                if(this.groupData !== null){
                    this.dialogTitle = '新增条目';
                    this.editType = 'add';
                    this.dialogVisible = true;
                    this.rowId = null;
                }else{
                    this.$message.error('请先选择分组！')
                }
            },
            edit (){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要编辑的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行编辑！')
                } else{
                    this.dialogTitle = '编辑条目'
                    this.editType = 'edit';
                    this.dialogVisible = true;
                    this.rowId = selections[0].id;
                }
            },
            view(){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择需要查看的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行查看！')
                } else{
                    this.dialogTitle = '查看条目';
                    this.editType = 'view';
                    this.dialogVisible = true;
                    this.rowId = selections[0].id;
                }
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
                if(rows.length > 0){
                    for(let i in rows){
                        if(rows[i].configStatus == 0){
                            enableStatus = true;
                        }
                        if(rows[i].configStatus == 1){
                            disableStatus = true;
                        }
                    }
                }
                if(enableStatus){
                    this.$refs['toolbar'].disableBySymbol('ENABLE');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('ENABLE');
                }
                if(disableStatus){
                    this.$refs['toolbar'].disableBySymbol('DISABLE');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('DISABLE');
                }
            }
        }
    }
</script>

<style lang="css" scoped>

    .tree-button {
        padding: 10px 0;
        text-align: center;
        border-bottom: 1px solid #d4dce7;
    }

    .tree-button .el-button--toolbar:first-child {
        margin-left: 8px;
    }

    .tree-button .el-button--toolbar {
        padding: 5px 11px;
        font-size: 12px;
        border-radius: 2px;
        border-color: rgb(232, 237, 241);
        color: rgb(50, 139, 239);
        margin-right: 5px;
    }

    .tree-button .el-button--toolbar:focus {
        border-color: rgb(191, 201, 217)
    }

    .tree-button .el-button--toolbar:hover {
        border-color: rgb(50, 139, 239)
    }

    .tree-button .is-disabled {
        color: rgb(191, 203, 217);
        border-color: rgb(209, 219, 229);
    }

    .tree-button .is-disabled:hover {
        border-color: rgb(209, 219, 229);
    }

    .tree-button .el-button--success.is-plain {
        color: rgb(19, 206, 102)
    }

    .tree-button .el-button--danger.is-plain {
        color: rgb(255, 86, 97)
    }

    .tree-button .el-button + .el-button {
        margin-left: 0px;
    }
    /* 深色皮肤 */
    .tree-button.t8t-dark .el-button--toolbar{
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .tree-button.t8t-dark .el-button--toolbar:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
</style>

