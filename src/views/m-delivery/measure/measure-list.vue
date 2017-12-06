<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>

        <div class="g-main-container">
            <t8t-tree
                :data="treeData"
                :props="treeProps"
                :default-expanded-keys="[0]"
                @node-click="treeClick"
            >
            </t8t-tree>
            <div class="g-main-container-column">
                <t8t-toolbar
                    @ADD="add"
                    @VIEW="view"
                    @ASSIGN="assign"
                    @SUBMIT="submit"
                    @APPROVAL-FLOW="auditing"
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
                    :commonData="selectSource"
                    ref="t8tTable"
                    @selection-change="selectionChange"
                    @row-double-click="view"
                >
                </t8t-table>
            </div>
        </div>
        <new-dialog
            v-if="newDialogVisible"
            :title="dialogTitle"
            @close="newDialogVisible=false"
            @getTableData="getTableData">
        </new-dialog>
        <allot-dialog
            v-if="allotDialogVisible"
            :rowId="rowId"
            :title="dialogTitle"
            @close="allotDialogVisible=false"
            @getTableData="getTableData">
        </allot-dialog>
        <t8t-step-page
            :args="flowArgs"
            :service="flowService"
            :method="flowMethod"
            :dataSource="flowData"
            v-if="isShowFlow"
            @close="closeStepPage"
        >
        </t8t-step-page>
    </div>
</template>

<script>
    import NewDialog from './new-dialog.vue'
    import AllotDialog from './allot-dialog.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import pageColumns from './columns.js'
    import Cookie from 'js-cookie'
    import api from 'src/utils/api.js'
    import measureApi from 'src/services/delivery/measure.js'


    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'

    export default {
        name: 'measure-list',
        components: {
            NewDialog,
            AllotDialog,
            T8tStepPage
        },
        data () {
            return {
                flowArgs:{},
                flowService:Service.MEASURE.name,
                flowMethod:Service.MEASURE.methods.processDetail,
                flowData:[],
                isShowFlow:false,
                breadcrumbData: [{ title: '交付' },{ title: '项目执行' },{ title: '主材测量单' }],
                treeData: [],
                groupData:null,
                treeProps: {
                    label: 'name',
                    children: 'children'
                },


                //selectField
                fields: pageColumns.indexField,
                sltOrg:0,

                //selectSource
                selectSource: {
                    measurerTypeOption:[],
                    orderStatusOption: [
                        {
                            text: '无状态',
                            value: null
                        },
                        {
                            text: '待测量',
                            value: 1
                        },
                        {
                            text: '待审核',
                            value: 2
                        },
                        {
                            text: '已完成',
                            value: 3
                        }
                    ],
                    widgetType: [] //报价模板list
                },
                //table
                columns:pageColumns.indexTable,
                service: Service.MEASURE.name,
                method:  Service.MEASURE.methods.queryPage,
                args: {
                    search: {
                        organizationId:null,
                        projectId_like:null,
                        measurer:null,
                        foremanName:null,
                        planMeasureTime_gte:null,
                        planMeasureTime_lte:null,
                        orderStatus:null,
                        realMeasureTime_lte:null,
                        orderStatus:null,
                        createTime_lte:null,
                        foremanPhone:null
                    }
                },

                //dialog config
                newDialogVisible: false,
                allotDialogVisible: false,

                rowId: null,
                dialogTitle : '',
                groupDialogTitle: '',
                tableData: [],
                selectedRows:[]
            }
        },
        created (){
            measureApi.queryProperty()
                .then((res) => {
                    if (res.data.status === 200) {
                        if(res.data.result.measurerTypeList) {
                            this.selectSource.measurerTypeOption = res.data.result.measurerTypeList
                        }
                    }
            });
            this.getTree();
            if(this.$route.query.procInsId){
                this.newDialogVisible = true
            }
        },
        methods: {
            //search
            submitSearch(obj) {
                obj.planMeasureTime_lte = obj.planMeasureTime_lte ? obj.planMeasureTime_lte + 86399 : null
                obj.realMeasureTime_lte = obj.realMeasureTime_lte ? obj.realMeasureTime_lte + 86399 : null
                obj.createTime_lte = obj.createTime_lte ? obj.createTime_lte + 86399 : null
                obj.organizationId = this.sltOrg | null
                this.args = {"search": obj}
        },
            //treeDeal
            treeClick (data){
                //this.searchData = Object.assign(this.searchData,{groupId: nodeData.id});
//                this.groupData={id: nodeData.id, groupName: nodeData.groupName};
                this.sltOrg = data.id
                this.args = {search: {organizationId: data.id}}
            },
            getTree(){
                measureApi.queryTreeByType({typeCodes:['001003010']}).then((res) => {
                    if(res.data.status === 200){
                        this.treeData = [res.data.result];
                    }
                })
            },
            //create
            add () {
                    this.dialogTitle = '新增测量单';
                    this.newDialogVisible = true;
                    this.rowId = null;
            },
            assign() {
                this.dialogTitle = '分配测量人';
                this.allotDialogVisible = true;

                this.rowId = null;
            },
            view(){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if(selections.length > 0){
                    this.$router.push({
                        path: '/delivery/measure-view',
                        query:{id: selections[0].id}
                    })
                }else{
                    this.$message.error("请选择操作单据后重试")
                }

            },
            submit(){
                    let selections = this.$refs['t8tTable'].getSelectRows();
                    if (selections.length === 0) {
                        this.$message.error('请选择操作单据后重试')
                    } else if(selections.length > 1){
                        this.$message.error('只能选择一行进行编辑！')
                    } else{
                        if(selections[0].orderStatus > 1){
                            this.$message.error('选中行不能提交')
                            return false
                        }
                        this.$router.push({
                            path: '/delivery/measure-edit',
                            query:{id: selections[0].id}
                        })
                }
            },
            auditing(){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择操作单据后重试')
                }else if(selections.length > 1){
                    this.$message.error('只能选择单条单据查看审批流！')
                } else{
                    if(!selections[0].processId){
                        this.$message.error('选中行暂未启动流程')
                        return false
                    }
                    this.flowArgs = {id:parseInt(selections[0].id)}
                    this.isShowFlow = true
                }
            },
            closeStepPage(){
                this.isShowFlow = false
            },
            //tableReloadn
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },

            //rowsChange
            selectionChange (rows){
                let viewStatus = false;
                let submitStatus = false;
                let auditingStatus = false;
                if(rows.length > 0){
                    if(rows.length === 1) {
                        viewStatus = true
                        for(let i in rows){
                            auditingStatus = rows[i].processId ? true : false
                            submitStatus = rows[i].orderStatus > 1 ? false : true
                        }
                    }
                }
                if(!viewStatus){
                    this.$refs['toolbar'].disableBySymbol('VIEW');

                }else{
                    this.$refs['toolbar'].unDisableBySymbol('VIEW');
                }
                if(!submitStatus){
                    this.$refs['toolbar'].disableBySymbol('SUBMIT');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('SUBMIT');
                }
                if(!auditingStatus){
                    this.$refs['toolbar'].disableBySymbol('APPROVAL-FLOW');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('APPROVAL-FLOW');
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

