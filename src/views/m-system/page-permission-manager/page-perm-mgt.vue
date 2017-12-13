<template>
    <div v-loading.fullscreen.lock="fullscreenLoading">
        <t8t-breadcrumb></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            :showToggleBtn=true
            @submit="submitSearch"
        >
        </t8t-search>

        <div class="g-main-container">
            <t8t-tree
                ref="t8ttree"
                :data="treeData"
                :props="treeProps"
                :default-expanded-keys="defaultExpandedKeys"
                :show-checkbox="true"
                @node-click="onTreeClick"
            >
                <div slot="tree-header" class="tree-button">
                    <el-button @click="groupAdd" size="toolbar">新增业务</el-button>
                    <el-button @click="groupEdit" size="toolbar">修改业务</el-button>
                    <el-button @click="groupDel" size="toolbar">删除业务</el-button>
                </div>
            </t8t-tree>

            <div class="g-main-container-column">
                <t8t-toolbar
                    @ADD="onAdd"
                    @EDIT="onEdit"
                    @VIEW="onView"
                    @DELETE="onDelete"
                    @VIEW-ROLE="onViewRole"
                    @VIEW-USER="onViewUser"
                    @IMPORT="onImport"
                    @EXPORT="onExport"
                >
                </t8t-toolbar>

                <t8t-table
                    :columns="columns.indexPage"
                    :service="service"
                    :method="method"
                    :args="args"
                    :preLoad="false"
                    :editable="false"
                    :commonData="commonData"
                    ref="t8ttable"
                    @row-dblclick="tableDblclick"
                    @selection-change="selectionChange"
                    @data-loaded="onDataLoaded"
                >
                </t8t-table>
            </div>

        </div>
        <group-dialog
            v-if="groupDialogVisible"
            :title="groupTitle"
            :data="nodeData"
            :rowId="groupId"
            :editType="groupEditType"
            @close="groupDialogVisible=false"
            @after-edit="afterModifyObject"
        >
        </group-dialog>
        <btn-dialog
            v-if="btnDialogVisible"
            :title="btnTitle"
            :data="nodeData"
            :rowId="btnId"
            :editType="btnEditType"
            @close="btnDialogVisible=false"
            @complete="btnSaved"
        >
        </btn-dialog>
        <el-dialog title="导入权限数据" v-model="importDialogVisible" @close="closeUploadDialog">
                <el-upload
                    ref="upload"
                    :data="uploadParams"
                    :action="importURL"
                    :on-change="handleChange"
                    :on-success="importDeal"
                    :before-upload="beforeUpload"
                    accept=".xlsx"
                    :multiple="false"
                    :auto-upload="false"
                >
                    <el-button size="small" type="primary"><i class="el-icon-upload2"></i> 上传文件</el-button>
                    <span>请选择Excel文件,.xlsx格式</span>
                </el-upload>
            <div slot="footer">
                <el-button @click="submitUpload" type="primary" :loading="importLoading">确定</el-button>
                <el-button @click="closeUploadDialog">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog class="view-role-dialog" title="权限已分配角色" v-model="roleDialogVisible" size="large">
            <t8t-table
                :style="{height:'450px'}"
                :columns="roleColumns"
                :pageBar="true"
                :editable="false"
                :selectCol="false"
                :service="roleService"
                :method="roleMethod"
                :args="roleArgs"
                :commonData="commonData"
                @close="roleDialogVisible=false"
            >
            </t8t-table>
        </el-dialog>
        <el-dialog class="view-user-dialog" title="权限已分配用户" v-model="userDialogVisible" size="large">
            <t8t-table
                :style="{height:'450px'}"
                :columns="userColumns"
                :pageBar="true"
                :editable="false"
                :selectCol="false"
                :service="userService"
                :method="userMethod"
                :args="userArgs"
                :commonData="commonData"
                @close="userDialogVisible=false"
            >
            </t8t-table>
        </el-dialog>
    </div>
</template>

<script>
    import Services from 'src/services/permission/Service.js'
    import columns from './permColumns.json'
    import axios from 'src/utils/axios.js'
    import permApi from 'src/services/permission/Perm.js'
    import GroupDialog from './group-dialog.vue'
    import BtnDialog from './btn-dialog.vue'
    import exportUtils from 'src/utils/export.js'
    import Utils from 'src/utils/Utils.js'

    export default {
        name: 'permission-management',
        components: {
            GroupDialog,
            BtnDialog
        },
        data () {
            return {
                columns: columns,
                // 搜索表单项配置
                fields: [
                    {type: 'input', label: '按钮编码', name: 'code'},
                    //{type: 'input', label: '权限名称', name: 'name_like'}
                ],
                listData: [],
                service: Services.PERM.name,
                method: Services.PERM.methods.QUERY_PAGE,
                args: {},
                // 树形结构数据
                treeData: [],
                treeProps: {
                    label: 'codeAndName',
                    children: 'children'
//                    disabled: 'isDel',
                    // symbol: 'name'
                },
                exportCodes:[],
                defaultExpandedKeys: [0],
                selectTreeNode: null,
                nodeData: null,
                groupTitle: '',
                groupDialogVisible: false,
                groupEditType: '',
                groupId: null,
                btnTitle: '',
                btnDialogVisible: false,
                btnEditType: '',
                btnId: null,
                selRows: [],
                selIds: [],
                rowData: null,
                fullscreenLoading: false,
                importDialogVisible: false,
                importLoading: false,
                uploadParams:{
                    //otherArgs:JSON.stringify({createUser:+Cookie.get('t8t-tc-uid')}),
                    columns:"code,parentCode,name,symbol,rangeTrigger,url,description,visible,tableName",
                },
                importURL: Utils.getImportURL(Services.PERM.name, Services.PERM.methods.permissionImportWithParentCodes),
                roleDialogVisible: false,
                roleService: Services.PERM.name,
                roleMethod: Services.PERM.methods.queryRoleDetailByPermissionId,
                roleArgs:{},
                roleColumns:[
                    {
                        prop: 'code',
                        label: '角色编码'
                    },
                    {
                        prop: 'name',
                        label: '角色名称'
                    },
                    {
                        type: 'select',
                        prop: 'type',
                        label: '角色分类',
                        list: 'roleType'
                    },
                    {
                        prop: 'roleTypeName',
                        label: '角色分组'
                    },
                    {
                        type: 'select',
                        prop: 'isDel',
                        label: '是否禁用',
                        list: 'isDel'
                    }
                ],
                userDialogVisible: false,
                userService: Services.PERM.name,
                userMethod: Services.PERM.methods.permissionListAccountRoleById,
                userArgs:{},
                userColumns:[
                    {
                        prop: 'roleName',
                        label: '角色名称'
                    },
                    {
                        prop: 'roleGroupName',
                        label: '角色分组'
                    },
                    {
                        type: 'select',
                        prop: 'isDel',
                        label: '角色是否禁用',
                        list: 'isDel'
                    },
                    {
                        prop: 'accountName',
                        label: '用户名称'
                    },
                    {
                        prop: 'accountTypeName',
                        label: '所属人员类型'
                    },
                    {
                        type: 'select',
                        prop: 'accountIsDel',
                        label: '用户是否禁用',
                        list: 'isDel'
                    }
                ],
                commonData: {
                    isDel:[
                        {
                            value: 1,
                            text: '是',
                        },
                        {
                            value: 0,
                            text: '否'
                        }
                    ],
                    visibleOptions: [{
                        text: '否',
                        value: 1
                    }, {
                        text: '是',
                        value: 0
                    }],
                    roleType: [{
                        text: '普通角色',
                        value: 0
                    }, {
                        text: '系统管理员',
                        value: 1
                    }, {
                        text: '特殊角色',
                        value: 2
                    }],

                }
            }
        },
        created () {
            this.getTree();
        },
        methods: {
            afterModifyObject(rs,type){
                let data = { id: rs.id, code: rs.code, name: rs.name , codeAndName: '('+rs.code+')'+rs.name, children:[] };
                let node = this.$refs['t8ttree'].$refs['treeRef'].store.getNode(this.nodeData);
                if(type == 'add'){ //动态添加节点
                    this.$refs['t8ttree'].$refs['treeRef'].store.append(data, this.nodeData);
                    if(node.expanded == false){
                        node.expand();
                    }
                }else{ //修改节点label
                    //console.log(node);
                    this.nodeData.code = data.code;
                    this.nodeData.name = data.name;
                    this.nodeData.codeAndName = data.codeAndName;
                    //node.setData(this.nodeData);
                    node.data.codeAndName = data.codeAndName;
                }
            },
            getTree(){
                permApi.getMemuTree2().then((res) => {
                    if (res.data.status === 200) {
                        this.treeData = [res.data.result]
                    }
                })
            },
            getList(args){
                this.tableLoading = true;
                permApi.permissionQueryPage({page: 1, size: 100, search: args}).then((res)=>{
                    this.tableLoading = false;
                    if(res.data.status === 200){
                        this.listData = res.data.result.rows;
                    }
                }).catch((error)=>{
                    this.tableLoading = false;
                })
            },
            submitSearch(obj){
                //let search = this.args.search;
                this.args = { search: Object.assign({isPerm: 1},obj) }
            },
            onTreeClick(nodeData){
                this.nodeData = nodeData;
                //this.getList({parentId: nodeData.id, isPerm: 1});
                this.args = { search: {parentId: nodeData.id, isPerm: 1} }
            },
            selectionChange(selRows,selIds){
                this.selRows = selRows;
                this.selIds = selIds;
            },
            tableDblclick(row){
                this.btnId = row.id;
                this.btnEditType = 'view';
                this.btnTitle = '查看按钮';
                this.btnDialogVisible = true;
            },
            btnSaved(){
                this.$refs['t8ttable'].reloadTable();
            },
            checkGroupSelect(){
                if(this.nodeData === null){
                    this.$message.error('请点击选择业务对象！');
                    return false
                }

                return true
            },
            groupAdd(){
                if(this.checkGroupSelect()) {
                    this.groupId = this.nodeData.id;
                    this.groupEditType = 'add';
                    this.groupTitle = '新增业务';
                    this.groupDialogVisible = true;
                }

            },
            groupEdit(){
                if(this.checkGroupSelect()) {
                    this.groupId = this.nodeData.id;
                    this.groupEditType = 'edit';
                    this.groupTitle = '修改业务';
                    this.groupDialogVisible = true;
                }
            },
            groupDel() {
                if (!this.checkGroupSelect()) {
                    return
                }
                this.$confirm('确定删除选中的业务对象吗', '提示', {
                    type: 'warning'
                }).then(() => {
                    permApi.permissionDelete({ id: this.nodeData.id }).then((res) => {
                        if (res.data.status === 200) {
                            this.$msgbox({
                                title: '',
                                type: 'success',
                                message: '删除业务对象成功',
                                callback: () => {
                                    //移除当前节点
                                    this.$refs['t8ttree'].$refs['treeRef'].store.remove(this.nodeData);
                                    this.nodeData = null;
                                }
                            })
                        } else {
                            this.$msgbox({
                                title: '',
                                type: 'error',
                                message: res.data.message
                            })
                        }
                    }).catch((error) => {

                    })
                })
            },
            onAdd() {
                if(!this.checkGroupSelect()) {
                    return
                }
                this.btnEditType = 'add';
                this.btnTitle = '新增按钮';
                this.btnDialogVisible = true;
            },
            onEdit() {
                if(this.selIds.length === 0){
                    this.$message.error('请选择需要修改的按钮！');
                    return;
                }else if(this.selIds.length > 1){
                    this.$message.error('只能操作一行！');
                    return;
                }else{
                    this.btnId = this.selRows[0].id;
                    this.btnEditType = 'edit';
                    this.btnTitle = '修改按钮';
                    this.btnDialogVisible = true;
                }
            },
            onView() {
                if(this.selIds.length === 0){
                    this.$message.error('请选择需要查看的按钮！');
                    return;
                }else if(this.selIds.length > 1){
                    this.$message.error('只能操作一行！');
                    return;
                }else{
                    this.btnId = this.selRows[0].id;
                    this.btnEditType = 'view';
                    this.btnTitle = '查看按钮';
                    this.btnDialogVisible = true;
                }
            },
            onDelete() {
                if(this.selIds.length === 0){
                    this.$message.error('请选择需要删除的按钮！');
                    return;
                }else{
                    this.$confirm('确定删除选中的权限按钮吗','提示',{
                        type: 'warning'
                    }).then(() =>{
                        permApi.permissionDeleteByIdList({idList:this.selIds}).then((res) => {
                            if(res.data.status === 200){
                                this.$refs['t8ttable'].reloadTable();
                                this.$message.success('删除成功！');
                            }else{
                                this.$message.error(res.data.message? res.data.message :'删除失败！');
                            }
                        }
                    ).catch()
                    })
                }
            },
            onViewUser(){
                if(this.selIds.length === 0){
                    this.$message.error('未选中业务权限按钮！');
                    return;
                }else if(this.selIds.length > 1){
                    this.$message.error('只能操作一行！');
                    return;
                }else{
                    this.userArgs = { permissionId:this.selRows[0].id };
                    this.userDialogVisible = true;
                }
            },
            onViewRole(){
                if(this.selIds.length === 0){
                    this.$message.error('未选中业务权限按钮！');
                    return;
                }else if(this.selIds.length > 1){
                    this.$message.error('只能操作一行！');
                    return;
                }else{
                    this.roleArgs = { permissionId: this.selRows[0].id };
                    this.roleDialogVisible = true;
                }
            },
            onImport() {
                this.importDialogVisible = true;
            },
            onExport() {
                let keys = this.$refs['t8ttree'].getCheckedKeys();
                if(keys.length === 0){
                    this.$message.error('请先勾选业务对象！');
                    return;
                }
                this.fullscreenLoading = true;
                let args = {
                    "parentIds":keys
                };
                exportUtils({
                    service: Services.PERM.name,
                    method: Services.PERM.methods.permissionExportWithParentIds,
                    args: args,
                    headers: "按钮编码,父级编码,按钮名称,英文字符,是否启用数据范围,url列表,描述,是否可见,对应表名",
                    sorts: "code,parentCode,name,symbol,rangeTrigger,url,description,visible,tableName",
                    title: "权限节点信息_"
                })
                setTimeout(()=>{
                    this.fullscreenLoading = false;
                },1000);
            },
            closeUploadDialog(){
                this.importDialogVisible=false
                this.$refs.upload.clearFiles();
            },
            submitUpload() {
                if(this.$refs.upload.uploadFiles.length === 0){
                    this.$message.error('请先上传文件！');
                    return;
                }
                this.importLoading = true;
                this.$refs.upload.submit();
            },
            handleChange(file,fileList){
                let len = fileList.length;
                if(len > 1){
                    this.$refs.upload.uploadFiles = fileList.slice(len-1, len);
                }
            },
            importDeal(response, file, fileList) {
                this.importLoading = false
                if(!response.status) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: "上传文件失败！",
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.$refs['upload'].clearFiles();
                    return false
                }
                if(response.status == 200 && response.result.length == 0) {
                    this.$msgbox({
                        title: '消息',
                        type: 'success',
                        message: '导入成功！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.$refs['upload'].clearFiles();
                    this.$refs['t8ttable'].reloadTable();
                    this.importDialogVisible = false;
                }else{
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: response.result == null ? 'Excel文件内容解析不合法！': response.result.join('<br>'),
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.$refs['upload'].clearFiles();
                    return false;
                }
            },
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
<style>
    .view-user-dialog .el-dialog {
        width: 850px;
    }
</style>
