<template>
    <div class="page-pro-test">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-toolbar
            @STARTPROCESS="startProcess"
            @COMPLETETASK="completeTask"
            @APPROVAL-FLOW="approvalFlow"
        >
        </t8t-toolbar>
        <t8t-table
            :columns="columns"
            :service="service"
            :method = "method"
            :commonData = "commonData"
            :customColumn="true"
            :args = "args"
            ref="T8tTable"
            @select=" checkRepeal"
            @row-double-click="handleRowDbClick"
            @selection-change="checkRepeal"
            @cell-click="handleCeClick"
        ></t8t-table>
        <start-dialog
           v-if="startDialogVisible"
           @close="startDialogVisible=false"
           @getTableData="getTableData"

         >
        </start-dialog>
        <complete-dialog
            v-if="completeDialogVisible"
            :procInsId="procInsId"
            :taskId="taskId"
            :executor="executor"
            :customColumn="true"
            @close="completeDialogVisible=false"
            @getTableData="getTableData"

        >
        </complete-dialog>
    </div>
</template>
<script>
    import Service from 'src/services/procenter/Service.js'
    import apiProCenter from 'src/services/procenter/proCenterApi.js'
    import Cookie from 'js-cookie'
    import config from './config.json'
    import StartDialog from './start-dialog.vue'
    import CompleteDialog from './complete-dialog.vue'
    export default({
        name:'page-pro-test',
        components: {
            StartDialog ,
            CompleteDialog
        },
        data(){
            return{
                breadcrumbData:config.breadcrumbData, //面包屑
                columns:config.columns, //列表字段配置
                commonData:config.commonData, //过滤字字段配置
                //获取跳转数据
                //请求服务、接口配置
                service: Service.PROCENTERDEPLOYLIST.name,
                method: Service.PROCENTERDEPLOYLIST.methods.GETUSERTASKSWEB,
                args:{},//请求参数
                startDialogVisible:false,
                completeDialogVisible:false,
                taskId:this.$route.query.taskId,
                executor:Cookie.get('t8t-tc-uid'),
                procInsId:this.$route.query.procInsId
            }
        },
        created () {
            this.args.query = {procInsId: this.$route.query.procInsId , taskId: this.$route.query.taskId}
        },

        methods: {

            startProcess(){
               this.startDialogVisible=true
            },
            approvalFlow(){
                let selectDatas = this.checkSelection()
                var link = "http://erp.to8to.com/index.php/ProCenter/promanage/getApprovalProcess?";
                 link = link+"procInsId="+this.procInsId;
                 link = link+"&procDefId="+selectDatas.procDefId[0];
                 link = link+"&businessKey=";
                 link = link+"&tenantIds="+selectDatas.tenantId[0];
              window.open(link)
            },
            completeTask(){
                let selectDatas = this.checkSelection()
                this.completeDialogVisible=true
                this.taskId=selectDatas.taskId[0]
                this.procInsId=selectDatas.procInsId[0]
                this.executor=Cookie.get('t8t-tc-uid')
            },

            //获取选择的数据
            checkSelection(){
                let selections  = this.$refs['T8tTable'].getSelectRows()
                let selectDatas = {procInsId:[],taskId:[],procDefId:[],businessKey:[],tenantId:[]}
                selections.forEach(function(item){
                    selectDatas.procInsId.push(item.procInsId)
                    selectDatas.taskId.push(item.taskId)
                    selectDatas.procDefId.push(item.procDefId)
                    selectDatas.tenantId.push(item.tenantId)
                    console.log("---businessKey---"+item.businessKey)
                })
                return selectDatas
            },
            //获取表单数据
            getTableData(){
                this.$refs['T8tTable'].reloadTable()
            },
            //双击处理任务
            handleRowDbClick(){
            }
        }
    })
</script>
<style
    lang="css"
    scoped
>
</style>

