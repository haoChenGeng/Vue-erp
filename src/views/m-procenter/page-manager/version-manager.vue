<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <div>
            <t8t-search
                ref="search"
                :fields="searchFields"
                :selectSource="selectSource"
                :showToggleBtn="false"
                @submit="onSearchSubmit"
            >
            </t8t-search>
        </div>

        <div class="g-main-container-column">
            <t8t-toolbar
                :dataSource="dataSource"
                @VIEW="onView"
                @IMPORT="onCreate"
                @EDIT="onEdit"
                @SEE="onCheck"
                @ENABLE="onEnable"
                @DISABLE="onDisable"
                @DESIGNER="onDesigner"
                @UPDATE_DESIGNER="onUpdateDesigner"
                @SET-MAIN="onSetMainVersion"
                @ATTRIBUTE="onAttribute"
                @START-PROCESS="startProcess"
            >
            </t8t-toolbar>

            <t8t-table
                :radioCol="true"
                :columns="tableColumns"
                :service="service"
                :method="method"
                :args="args"
                :commonData="selectSource"
                :indexCol="true"
                ref="wf-version-table"
                @current-row-change="onRowChange"
            ></t8t-table>
        </div>
        <start-dialog
            v-if="startDialogVisible"
            :idOrKey="idOrKey"
            @close="startDialogVisible=false"
            @getTableData="refreshTable"
        >
        </start-dialog>
        <inputbpm-dialog
            v-if="inputDialogVisible"
            :modelId="modelId"
            :procName="procName"
            :identityKey="identityKey"
            @close="inputDialogVisible=false"
            @getTableData="refreshTable"
        >
        </inputbpm-dialog>
        <editbpm-dialog
            v-if="editDialogVisible"
            :id="selectWFId"
            :procName="procName"
            :identityKey="identityKey"
            @close="editDialogVisible=false"
            @getTableData="refreshTable"
        >
        </editbpm-dialog>
        <seebpm-dialog
            v-if="seeDialogVisible"
            :id="selectWFId"
            :procName="procName"
            :identityKey="identityKey"
            @close="seeDialogVisible=false"
            @getTableData="refreshTable"
        >
        </seebpm-dialog>

    </div>
</template>

<script>
    import initWorkflow from './init-workflow.vue'
    import workflow from 'src/services/procenter/workflow'
    import Service from 'src/services/procenter/Service'
    import StartDialog from './start-dialog.vue'
    import InputbpmDialog from './inputbpm-dialog.vue'
    import EditbpmDialog from  './editbpm-dialog.vue'
    import SeebpmDialog from  './seebpm-dialog.vue'
    export default{
        data(){
            return {
                selectVersion: '',
                procName: '',
                args: {},
                identityKey: '',
                selectWFId: 0,      // 版本号
                modelId: 0,         // 流程编号
                pdfId:'',            //流程定义Id,
                bpmnUrl:'',         //流程图图片服务url
                modelId:'',         //基础信息id
                description:'',    //流程描述
                startDialogVisible:false,
                inputDialogVisible:false,
                editDialogVisible:false,
                seeDialogVisible:false,
                idOrKey:'',
                service:Service.WORKFLOW.name,
                method: Service.WORKFLOW.methods.GETPROCBPMINFOS,
                dataSource: [],
                tableColumns: [
                    {
                        prop: "procName",
                        label: "名称"
                    }, {
                        prop: "identityKey",
                        label: "标识键"
                    }, {
                        prop: "isRunBpm",
                        label: "是否为主版本",
                        formatter: this.checkIfMain
                    }, {
                        prop: "version",
                        label: "版本号",
                        formatter: this.formatVersion
                    }, {
                        prop: "status",
                        label: "状态",
                        formatter: this.checkProcStatus
                    }, {
                        prop: "createTime",
                        label: "创建时间",
                        formatter: "dateParser"
                    }
                ],
                treeData: [],
                treeArgs: {},
                treeProps:{
                    label: 'label',
                    children: 'subclass',
                    disabled: 'isDel',
                    symbol: 'label'
                },
                breadcrumbData: [
                    {title: '系统管理'},
                    {title: '流程管理后台'},
                    {title: '版本管理'}
                ],
                searchFields: [
                    {type: 'select', label: '版本', name: 'version', selectSourceKey: 'versionOptions', valueType: 'int'},
                    {type: 'select', label: '状态', name: 'status', selectSourceKey: 'entranceOptions', valueType: 'int'}
                ],
                selectSource:{
                    versionOptions: [],
                    entranceOptions: [
                        {
                            text: '全部',
                            value: 4
                        },
                        {
                            text: '发布',
                            value: 2
                        },
                        {
                            text: '挂起',
                            value: 3
                        },
                        {
                            text: '暂存',
                            value: 0
                        }]
                }
            }
        },
        activated() {
            // 初始化
            this.$refs['wf-version-table'].dataSource = [];
            this.initParams();
            // 更新版本
            this.updateVersions();
        },
        created() {
            // 初始化
            this.initParams();;
            // 更新版本
            this.updateVersions();
        },
        methods: {
            initParams(){
                let query = this.$route.query;
                if ('id' in query){
                    this.modelId = +query.id;
                }
                if ('procName' in query){
                    this.procName = query.procName;
                }
                if ('key' in query){
                    this.identityKey = query.key;
                }
                if('desc' in query){
                    this.description = query.desc
                }
                if('categoryId' in query)
                {
                    this.categoryId = query.categoryCode
                }

                let search = {};
                search.modelId = this.modelId;
                this.args = {
                    search: search
                }
            },
            updateVersions(){
                let $this = this;
                let args = {
                    modelId: this.modelId
                };
                workflow.getProcBpmInfoVersions(args)
                    .then((res) => {
                        if (res.data.status == 200 && res.data.result && res.data.result.length > 0){
                            let data = res.data.result;
                            let versions = [];
                            data.forEach(function(version){
                                version = +version;
                                if(versions.indexOf(version) == -1){
                                    versions.push(version);
                                }
                            });
                            versions = versions.sort(function(a,b){return a<b});

                            let obj, versionOptions = [];
                            versions.forEach(function (version) {
                                obj = {
                                    text: '版本' + version,
                                    value: version
                                };
                                versionOptions.push(obj);
                            });
                            $this.selectSource.versionOptions = versionOptions;
                        }
                    })
            },
            refreshTable(){
                this.$refs['wf-version-table'].reloadTable();
                this.selectWFId = '';
            },
            checkIfMain(val){
                if (val){
                    return '是'
                } else {
                    return '否'
                }
            },
            formatVersion(val){
                return '版本' + val;
            },
            checkProcStatus(val){
                switch (val){
                    case 0:
                        status = '暂存';
                        break;
                    case 1:
                        status = '测试';
                        break;
                    case 2:
                        status = '发布';
                        break;
                    case 3:
                        status = '挂起';
                        break;
                    default:
                        status = '-';
                }
                return status;
            },
            checkStatus(val){
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
                let search = obj;
                search.modelId = this.modelId;
                this.args = {
                    search: search
                }
            },
            onNodeClick: function (obj) {
                let id = obj.id;
                let args = {
                    path: '/tochat-procenter/version-workflow',
                    query: {
                        id: id
                    }
                };
                this.$router.push(args);
            },
            onRowChange(row){
                this.procName = row.procName;
                // 版本ID
                this.selectWFId = row.id;
                this.selectVersion = row.version;
                this.pdfId = row.procDefId;
                this.bpmUrl =  row.bpmUrl;
            },
            onDesigner(){
                //新建流程图
                var link = "http://wkd.to8to.com?";
                link = link+"modelId="+this.modelId;
                link = link+"&key="+this.identityKey;
                link = link+"&name="+this.procName;
                link = link+"&desp="+this.description;
                link = link+"&categoryId="+ this.categoryId;
//                location.href= link;
                window.open(link)
                }
            ,
            startProcess(){
                if(this.checkIfSelectWorkflow()){
                    this.startDialogVisible=true
                    this.idOrKey= this.identityKey
                }
            },
            onUpdateDesigner(){
                //编辑流程图
                if(this.checkIfSelectWorkflow())
                {
                    var link = "http://wkd.to8to.com?";
                    link = link + "dirname=" + encodeURIComponent(this.bpmUrl);
                    link = link+"&procDefId="+this.pdfId;
                    link = link+"&modelId="+this.modelId;
                    window.open(link)
                }
            },

            checkIfSelectWorkflow(){
                if (this.selectWFId == ''){
                    this.$message('请选择需要使用的版本！');
                    return false;
                } else {
                    return true;
                }
            },
            onView (symbol, event) {
                this.$refs['list-view'].disableBySymbol(symbol)
            },
            onCreate (symbol, event){
               /*let args = {
                    path: '/tochat-procenter/version-workflow/create',
                    query: {
                        modelId: this.modelId,
                        procName: this.procName,
                        key: this.identityKey
                    }
                };
                this.$router.push(args);*/
               this.inputDialogVisible=true;
            },
            onEdit (symbol, event){
               if(this.checkIfSelectWorkflow()){
                   /* let args = {
                        path: '/tochat-procenter/version-workflow/edit',
                        query: {
                            id: this.selectWFId,
                            procName: this.procName,
                            key: this.identityKey
                        }
                    };
                    this.$router.push(args);*/
                this.editDialogVisible=true;
                }
            },
            onCheck (symbol, event){
                if(this.checkIfSelectWorkflow()){
                    /*let args = {
                        path: '/tochat-procenter/version-workflow/see',
                        query: {
                            id: this.selectWFId,
                            procName: this.procName,
                            key: this.identityKey
                        }
                    };
                    this.$router.push(args);*/
                    this.seeDialogVisible=true
                }
            },
            onEnable (symbol, event){
                /* 发布 */
                if(this.checkIfSelectWorkflow()) {
                    let req = {
                        id: this.selectWFId,
                        status: 2
                    };
                    let args = {
                        req: req
                    };
                    /* 接口有问题 */
                    workflow.updateProcBpmInfo(args)
                        .then((res) => {
                            if (res.data.status == 200 && res.data.result == 1) {
                                this.$message('当前版本发布成功!');
                                this.refreshTable();
                            } else {
                                this.$message('当前版本发布失败!');
                            }
                        })
                }
            },
            onDisable (symbol, event){
                // 挂起
                if(this.checkIfSelectWorkflow()) {
                    let req = {
                        id: this.selectWFId,
                        status: 3
                    };
                    let args = {
                        req: req
                    };
                    /* 接口有问题 */
                    workflow.updateProcBpmInfo(args)
                        .then((res) => {
                            if (res.data.status == 200 && res.data.result == 1) {
                                this.$message('当前版本发布成功!');
                                this.refreshTable();
                            } else {
                                this.$message('当前版本发布失败!');
                            }
                        })
                }
            },
            onSetMainVersion (symbol, event){
                // 设置主版本号
                if(this.checkIfSelectWorkflow()) {
                    let args = {
                        runBpmId: this.selectWFId,
                    };
                    /* 接口有问题 */
                    workflow.updateRunBpm(args)
                        .then((res) => {
                            if (res.data.status == 200 && res.data.result == 1) {
                                this.$message('主版本设置成功!');
                                this.refreshTable();
                            } else {
                                let msg =  res.data.message;
                                this.$message('主版本设置失败:' + msg);
                            }
                        })
                }
            },
            onAttribute (symbol, event){
                // 属性配置
                if(this.checkIfSelectWorkflow()) {
                    let args = {
                        path: '/tochat-procenter/workflow-attribute',
                        query: {
                            vid: this.selectWFId,
                            mid: this.modelId,
                            key: this.identityKey
                        }
                    };
                    this.$router.push(args);
                }
            },
            beforeTreeSubmit () {
                return false
            }
        },
        name: 'version-manager',
        components: {
            StartDialog,
            InputbpmDialog,
            EditbpmDialog,
            SeebpmDialog
        }
    }
</script>

<style lang="css" scoped>
</style>
