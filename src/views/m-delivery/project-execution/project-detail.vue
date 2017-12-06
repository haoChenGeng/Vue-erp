<template>
    <div>
        <el-dialog v-loading.fullscreen.lock="fullscreenLoading" @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 yanshou-detail-dialog dialog-new" :class="{'isHide': isTopHide}">
        <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                    </div>
                </div>
                 <div class="dialog2-main-container">
                
                <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                                                <el-tabs v-model="tab_info">
                            <el-tab-pane label="基本信息" name="basic">
                                <el-form class="dialog2-form-container" :model="detailInfo" ref="formRef" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="项目ID：">
                                            <el-input v-model="detailInfo.projectId" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="组织：">
                                            <el-input v-model="detailInfo.organizationName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="项目状态：">
                                            <el-input v-model="orderStatusName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业主：">
                                            <el-input v-model="detailInfo.ownerName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="项目经理：">
                                            <el-input v-model="detailInfo.workerName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="交付经理：">
                                            <el-input v-model="detailInfo.payManagerName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="工程管家：">
                                            <el-input v-model="detailInfo.payAdvisorName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="详细地址：">
                                            <el-input v-model="detailInfo.addressDetail" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>

                <t8t-toolbar
                    @ADD="add"
                    @EDIT="edit"
                    @VIEW="showDetail"
                    @YUYUE="yuyue"
                    @BIANGENGGUANJIA="changeSteward"
                    @UNDO="cancel"
                    @ACCEPTANCE="acceptance"
                    @OPLOG="showOpLog"
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
                    @row-double-click="showDetail"                    
                >
                </t8t-table>
                
                </div>
        </div>
        </el-dialog>
        <add-bill
            v-if="addDialogVisible"
            :rowId="rowId"
            :editType="editType"
            :title="dialogTitle"
            :billData="billData"
            @close="addDialogVisible=false"
            @getTableData="getTableData">
        </add-bill>
        <op-dialog
            v-if="dialogVisible"
            :id="id"
            :rowId="rowId"
            :billCode="billCode"
            :editType="editType"
            :title="dialogTitle"
            @close="dialogVisible=false"
            @getTableData="getTableData">
        </op-dialog>
        <el-dialog title="操作记录" v-model="opLogDialog" size="large">
            <t8t-table
                :style="{height:'350px'}"
                :columns="opLogColumns"
                :pageBar="true"
                :editable="false"
                :selectCol="false"
                :service="service"
                :method="opLogMethod"
                :args="opLogArgs"
                @close="opLogDialog=false"
            >
            </t8t-table>
        </el-dialog>
    </div>
</template>

<script>
    import RSA from 'src/utils/RSA.js'
    import utils from 'src/utils/Utils.js'
    import AddBill from './add-bill.vue'
    import OpDialog from './op-dialog.vue'
    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import Model from 'src/services/delivery/model.js'
    export default {
        name: 'yanshou-bill',
        components: {
            AddBill,
            OpDialog
        },
        data () {
            let that = this;
            return {
                //搜索表单项配置
                isDialogShow: true,
                isTopHide: false,
                detailInfo:{
                    projectId: null,
                    organizationName: '',
                    orderMainStatusName: '',
                    orderSubStatusName: '',
                    ownerName: '',
                    payAdvisorName: '',
                    payManagerName: '',
                    workerName: '',
                    addressDetail: '',
                },
                tab_info: 'basic',
                columns:
                    [
                        { "prop": "billCode", "label": "验收单号" },
                        { "prop": "projectId", "label": "项目ID" },
                        { "prop": "sheduleNodeName", "label": "验收节点" },
                        { "prop": "workerName", "label": "工长姓名" },
                        { "prop": "ownerName", "label": "业主姓名" },
                        { "prop": "payAdvisorName", "label": "交付管家"},
                        { "prop": "status", "label": "单据状态" , "list":"status"},
                        { 
                            "prop": "expectCheckTime",
                            "label": "申请验收时间",
                            "formatter": function(val,row,col){
                                return that.dateParser(row.expectStartTime) + ' - ' + that.dateParser(row.expectCheckTime);
                            },
                            width: '225px'
                        },
                        { 
                            "prop": "orderCheckTime",
                            "label": "预约验收时间",
                            "formatter": function(val,row,col){
                                return that.dateParser(row.orderStartTime) + ' - ' + that.dateParser(row.orderCheckTime);
                            },
                            width: '225px'
                        },
                        { 
                            "prop": "checkTime",
                            "label": "实际验收时间",
                            "formatter": function(val,row,col){
                                return that.dateParser(row.checkStartTime) + ' - ' + that.dateParser(row.checkTime);
                            },
                            width: '225px'
                        },
                        { "prop": "createTime", "label": "创建日期","formatter": this.dateParser}
                    ],
                commonData: {
                   status: [
                       {
                           text: '待预约工长',
                           value: 0
                       },
                       {
                           text: '待验收',
                           value: 1
                       },
                       {
                           text: '已撤销',
                           value: 2
                       },
                       {
                           text: '合格',
                           value: 3
                       },
                       {
                           text: '不合格',
                           value: 4
                       }
                   ]
                },
                service: Service.YANSHOU.name,
                method:  Service.YANSHOU.methods.checkQueryPage,
                args: { sort: ['id_desc'],search:{ projectId: this.$route.query.projectId } },
                opLogColumns:[
                    { "prop": "remark", "label": "修改内容" },
                    { "prop": "opTime", "label": "修改时间", "formatter": 'dateParser'},
                    { "prop": "username", "label": "修改人" },
                ],
                opLogMethod:Service.YANSHOU.methods.checkQueryOplog,
                opLogArgs:{},
                //弹窗dialog配置
                editType: 'add',
                addDialogVisible:false,
                dialogVisible: false,
                opLogDialog: false,
                rowId: null,
                dialogTitle : '',
                tableData: [],
                selectedRows:[],
                billData: {
                    projectId: null,
                    sheduleNodeId: null
                }
            }
        },
        created (){
            Model.checkGetProjectDetail({projectId: this.$route.query.projectId}).then((res)=>{
                this.detailInfo = Object.assign({},res.data.result);
            }).catch(()=>{
                this.$msgbox({
                    title: '',
                    type: 'error',
                    message: '没有查到项目相关信息！'
                });
            })
        },
        computed:{
            orderStatusName: function(){
                return this.detailInfo.orderMainStatusName + '/' + this.detailInfo.orderSubStatusName
            }
        },
        watch:{
        },
        methods: {
            closeDialog() {
                // 填写对应的路由
                this.$router.push({ path: '/delivery/yanshou-bill' })
            },
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            dateParser(text) {
                let dateString;
                let objDate = new Date(text * 1000);
                if (text === 0 || text === null) {
                    dateString = ""
                } else {
                    dateString = DateUtils(objDate, 'yyyy-mm-dd HH:MM')
                }
                return dateString
            },
            //查看详情
            showDetail: function(){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行操作！')
                } else{
                    this.$router.push({
                        path: '/delivery/yanshou-view',
                        query:{ billCode: selections[0].billCode,id: selections[0].id}
                    });
                }
            },
            add () {
                //集成点击流
                this.$TCS.addTag('red_2928_010004004001');
                this.dialogTitle = '新增验收单'
                this.editType = 'add'
                this.addDialogVisible = true
                this.rowId = null
                this.billData = {
                    projectId: this.detailInfo.projectId ? this.detailInfo.projectId :null,
                    sheduleNodeId: null
                }
            },
            yuyue (){
                //集成点击流
                this.$TCS.addTag('red_2928_010004004004');
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行操作！')
                } else{
                    this.dialogTitle = '预约工长验收'
                    this.editType = 'yuyue'
                    this.dialogVisible = true
                    this.id = selections[0].id
                    this.rowId = selections[0].projectId
                    this.billCode = selections[0].billCode
                }
            },
            acceptance (){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行操作！')
                } else{
                    this.$router.push({
                        path: '/delivery/yanshou-detail',
                        query:{ billCode: selections[0].billCode,id: selections[0].id}
                    });
                }
            },
            changeSteward (){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行操作！')
                } else{
                    this.dialogTitle = '变更交付管家'
                    this.editType = 'changeSteward'
                    this.dialogVisible = true
                    this.id = selections[0].id
                    this.rowId = selections[0].id
                    this.billCode = selections[0].billCode
                }
            },
            cancel (){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行操作！')
                } else{
                    this.dialogTitle = '撤销'
                    this.editType = 'cancel'
                    this.dialogVisible = true
                    this.id = selections[0].id
                    this.rowId = selections[0].id
                    this.billCode = selections[0].billCode
                }
            },
            showOpLog(){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行操作！')
                } else{
                    this.opLogArgs = {search:{ recordNo: selections[0].billCode}};
                    this.opLogDialog = true;
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
                let yanshouStatus = false;
                let yuyueStatus = false;
                if(rows.length > 0){
                    for(let i in rows){
                        if(rows[i].status != 1){
                            yanshouStatus = true;
                        }
                        if(rows[i].status != 1 && rows[i].status != 0){
                            yuyueStatus = true;
                        }
                    }
                }
                if(yanshouStatus){
                    this.$refs['toolbar'].disableBySymbol('ACCEPTANCE');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('ACCEPTANCE');
                }
                if(yuyueStatus){
                    this.$refs['toolbar'].disableBySymbol('YUYUE');
                    this.$refs['toolbar'].disableBySymbol('BIANGENGGUANJIA');
                    this.$refs['toolbar'].disableBySymbol('UNDO');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('YUYUE');
                    this.$refs['toolbar'].unDisableBySymbol('BIANGENGGUANJIA');
                    this.$refs['toolbar'].unDisableBySymbol('UNDO');
                }
            }
        }
    }
</script>

<style lang="css">
    .safsadacfa_node-dialog .table-container{
        height: 350px;
    }
    .safsadacfa_node-dialog .el-dialog__body{
        height: 410px;
        display: flex;
    }
    .safsadacfa_node-dialog .el-dialog{
        width:800px;
    }
</style>
