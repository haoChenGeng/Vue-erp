<template>
    <div>
        <t8t-list-view
            ref="list-view"
            showTree="true"
            showToolbar="true"

            :showSearchToggleBtn="false"
            :refreshOnTreeClick="false"

            :breadcrumbData="breadcrumbData"
            :treeData="treeData"
            :treeProps="treeProps"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableMethod="method"
            :tableArgs="tableArgs"
            :tableRadioCol="true"
            :tableHighlightCurrentRow="true"

            @search-submit="onSearchSubmit"
            @tree-node-click="onNodeClick"
            @list-view="onView"
            @list-create="onCreate"
            @list-edit="onEdit"
            @list-check="onCheck"
            @list-start="onStart"
            @list-disable="onDisable"
            @list-viewversion="onVersionControl"
            @list-designer="onDesigner"
            @table-current-row-change="onRowChange"
            @beforeTreeSubmit="beforeTreeSubmit"
        >
        </t8t-list-view>
        <createprocess-dialog
            v-if="createDialogVisible"
            @close="createDialogVisible=false"
            @getTableData="reloadTableData"
        ></createprocess-dialog>
        <editprocess-dialog
            v-if="editDialogVisible"
            :id="selectWFId"
            :identifyKey="identifyKey"
            @close="editDialogVisible=false"
            @getTableData="reloadTableData"
        ></editprocess-dialog>
        <seeprocess-dialog
            v-if="seeDialogVisible"
            :id="selectWFId"
            :identifyKey="identifyKey"
            @close="seeDialogVisible=false"
            @getTableData="reloadTableData"
        ></seeprocess-dialog>

    </div>
</template>

<script>
    import initWorkflow from './init-workflow.vue'
    import workflow from 'src/services/procenter/workflow'
    import Service from 'src/services/procenter/Service'
    import CreateprocessDialog from './createprocess-dialog.vue'
    import EditprocessDialog from './editprocess-dialog.vue'
    import SeeprocessDialog from './seeprocess-dialog.vue'
    // listWorkflowCategories

    export default{
        data(){
            return {
                identifyKey: '',
                selectWFId: 0,
                desc:'',
                categoryId:'',
                categoryCode:'',
                createDialogVisible:false,
                editDialogVisible:false,
                seeDialogVisible:false,
                service: Service.WORKFLOW.name,
                method: Service.WORKFLOW.methods.QUERYPROCESS,
                tableArgs: {
                    req: {
                        isDel: 2
                    }
                },
                tableColumns: [
                    {
                        prop: "procName",
                        label: "名称"
                    }, {
                        prop: "identifyKey",
                        label: "标识键"
                    }, {
                        prop: "categoryName",
                        label: "类别"
                    }, {
                        prop: "isDel",
                        label: "入口状态",
                        formatter: this.checkStatus
                    }, {
                        prop: "createTime",
                        label: "创建时间",
                        formatter: "dateParser"
                    }
                ],
                treeData: [],
                treeProps:{
                    label: 'label',
                    children: 'subclass',
                    disabled: 'isDel',
                    symbol: 'label'
                },
                breadcrumbData: [
                    {title: '系统管理'},
                    {title: '流程管理后台'},
                    {title: '流程管理'},
                    {title: '流程管理'}
                ],
                searchFields: [
                    {type: 'select', label: '入口状态', name: 'isDel', selectSourceKey: 'entranceOptions'},
                    {type: 'input', label: '名称', name: 'procName', placeholder: '流程名称关键字'},
                ],
                searchOptions: {
                    bizOptions: [],
                    receiptTypeOptions: [],
                    entranceOptions: [
                        {
                            text: '全部',
                            value: 2
                        },
                        {
                            text: '禁用',
                            value: 1
                        },
                        {
                            text: '启用',
                            value: 0
                        }]
                }
            }
        },
        activated() {
            this.initLeftTree();
        },
        created() {
            this.initLeftTree();
        },
        methods: {
            initLeftTree(){
                let args = {
                    flag: true
                };
                workflow.obtainCategory(args)
                    .then((res) => {
                        this.treeData = res.data.result
                    })
            },
            checkStatus(val, row){
                let status;
                switch (val){
                    case 0:
                        status = '启用';
                        break;
                    case 1:
                        status = '禁用';
                        break;
                }
                return status
            },
            onSearchSubmit: function (obj) {
                this.tableArgs = {
                    req: obj
                }
            },
            onNodeClick: function (obj) {
                let id = obj.id;
                this.tableArgs = {
                    req: {
                        categoryId: id
                    }
                }
            },
            checkIfSelectWorkflow(){
                if (this.selectWFId == ''){
                    this.$message('请选择需要使用的流程！');
                    return false;
                } else {
                    return true;
                }
            },
            onView (symbol, event) {
                this.$refs['list-view'].disableBySymbol(symbol)
            },
            onCreate (symbol, event){
               // this.$router.push({path: '/procenter/create-workflow'})
                this.createDialogVisible=true
            },
            onEdit (symbol, event){
                if(this.checkIfSelectWorkflow()){
                    /*let args = {
                        path: '/procenter/workflow/edit',
                        query: {
                            id: this.selectWFId,
                            identifyKey: this.identifyKey
                        }
                    };
                   this.$router.push(args);*/
                   this.editDialogVisible=true;
                }
            },
            onCheck (symbol, event){
                if(this.checkIfSelectWorkflow()){
                   /* let args = {
                        path: '/procenter/see-workflow',
                        query: {
                            id: this.selectWFId
                        }
                    };
                    this.$router.push(args);*/
                    this.seeDialogVisible=true;
                }
            },
            onRowChange(row){
                this.selectWFId = row.id;
                this.procName = row.procName;
                this.identifyKey = row.identifyKey;
                this.desc = row.description;
                this.categoryId = row.categoryId
                this.categoryCode = row.categoryCode
            },
            cleanTempKey(){
                this.selectWFId = 0;
                this.procName = '';
                this.identifyKey = '';
            },
            reloadTableData(){
                this.cleanTempKey();
                this.$refs['list-view'].getTableInstance().reloadTable();
            },
            onStart (symbol, event){
                if(this.checkIfSelectWorkflow()){
                    let args = {
                        id: this.selectWFId,
                        isDel: 0
                    };
                    workflow.toggleProcess(args)
                        .then((res) => {
                            if (res.data.status == 200 && res.data.result == 1){
                                this.$message('开启成功！');
                                this.reloadTableData();
                            }
                        })
                }
            },
            onDisable (symbol, event){
                if(this.checkIfSelectWorkflow()){
                    let args = {
                        id: this.selectWFId,
                        isDel: 1
                    };
                    workflow.toggleProcess(args)
                        .then((res) => {
                            if (res.data.status == 200 && res.data.result == 1){
                                this.$message('禁用成功!');
                                this.reloadTableData();
                            }
                        })
                }
            },
            onVersionControl (symbol, event){
                if(this.checkIfSelectWorkflow()){
                    let args = {
                        path: '/procenter/version-workflow',
                        query: {
                            id: this.selectWFId,
                            procName: this.procName,
                            key: this.identifyKey,
                            desc:this.desc,
                            categoryId:this.categoryId,
                            categoryCode:this.categoryCode
                        }
                    };
                    this.$router.push(args);
                }
            },
            onDesigner(symbol, event){
                location.href="http://192.168.3.33:8000/dist/index.html?key=XXXX";
            },
            beforeTreeSubmit () {
                return false
            }
        },
        components: {
            CreateprocessDialog,
            EditprocessDialog,
            SeeprocessDialog
        }
    }
</script>

<style lang="css" scoped>

</style>
