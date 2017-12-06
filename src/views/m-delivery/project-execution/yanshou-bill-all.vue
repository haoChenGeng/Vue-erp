<template>
    <div>
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
                :default-expanded-keys="[1]"
                @node-click="onTreeClick"
            >
            </t8t-tree>
            <div class="g-main-container-column">
                <t8t-toolbar
                    @ADD="add"
                    @EDIT="edit"
                    @VIEW="showDetail"
                    @YUYUE="yuyue"
                    @BIANGENGGUANJIA="changeSteward"
                    @UNDO="cancel"
                    @ACCEPTANCE="acceptance"
                    @OPLOG="showOpLog"
                    @SHARE="share"
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
        <el-dialog title="分享二维码" v-model="shareDialog" @close="shareDialog=false">
            <div id="qrcode"></div>
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
    import QRCode from 'src/utils/qrcode.js'
    export default {
        name: 'yanshou-bill',
        components: {
            AddBill,
            OpDialog
        },
        data () {
            let that = this;
            return {
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                //搜索表单项配置
                fields: [
                    {type: 'input',label: '项目ID',name: 'projectId'},
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
                                        formatter: function(val, row, col, tab){
                                            return (row.oshen || '') + (row.ocity || '') + (row.adds || '');
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    {
                        type: 'popup',
                        label: '工长姓名',
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
                    {type: 'select',label: '订单状态',name: 'status', selectSourceKey:'status_arr',filterable:true},
                    {type: 'select',label: '验收类型',name: 'checkTypeId',selectSourceKey:'types',filterable:true},
                    {type: 'select',label: '时间类型选择',name: 'timeType',selectSourceKey:'dateTypes',filterable:true},
                    {type: 'datetime',label: '开始时间',name: 'startTime'},
                    {type: 'datetime',label: '结束时间',name: 'endTime'},
                    {type: 'input',label: '工长电话',name: 'workerPhone'},
                    {type: 'input',label: '交付管家姓名',name: 'payAdvisorName'},
                    {type: 'input',label: '交付管家电话',name: 'payAdvisorPhoneCode'}
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    status_arr: [
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
                    ],
                    types: [], //验收类型
                    dateTypes: [
                        {
                            text: '申请开始时间',
                            value: 1
                        },
                        {
                            text: '申请结束时间',
                            value: 2
                        },
                        {
                            text: '预约开始时间',
                            value: 3
                        },
                        {
                            text: '预约结束时间',
                            value: 4
                        },
                        {
                            text: '实际开始时间',
                            value: 5
                        },
                        {
                            text: '实际结束时间',
                            value: 6
                        },
                        {
                            text: '创建时间',
                            value: 7
                        }
                    ]
                },
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
                args: { sort: ['id_desc'], search:{ payAdvisorId: +Cookie.get('t8t-tc-uid') } },
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
                },
                filterData: {
                    payAdvisorId: +Cookie.get('t8t-tc-uid')
                },
                shareDialog: false,
                qrcodeModel: null
            }
        },
        created (){
            utils.getPublicKey(function(res) {
                if(res.data.status == 200){
                    RSA.encrypt.setPublicKey(res.data.result.key)
                }
            });
            let arg =  {
                page: 1,
                search: {
                    pPropertyCode: 416001
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
                        this.selectSource.types = list;
                    }
            });
            TemplateOperator.queryTreeByType({typeCodes:['001003010']}).then((res) => {
                if(res.data.status === 200){
                    this.treeData = [res.data.result];
                }
            })
            let procInsId = this.$route.query.procInsId;
            if(procInsId){
                this.initCreateBill(procInsId);
            }
        },
        // watch:{
        //     '$route': function(route,oldRoute){
        //         if(route.path == '/delivery/yanshou-bill' && typeof route.query.refresh !== 'undefined'){
        //             this.getTableData();
        //         }
        //     }
        // },
        activated(){
            if(this.$route.path == '/delivery/yanshou-bill' && typeof this.$route.query.refresh !== 'undefined'){
                this.getTableData();
            }
        },
        methods: {
            initCreateBill(processId){
                Model.projectNodeGetByProcessId({processId: processId}).then((res)=>{
                    if(res.data.status === 200){
                        this.billData.projectId = res.data.result.projectId;
                        this.billData.sheduleNodeId = res.data.result.id;
                    }
                    this.add();
                })
            },
            //搜素
            submitSearch(obj) {
                obj.payAdvisorPhoneCode && (obj.payAdvisorPhoneCode = RSA.encryptfun(obj.payAdvisorPhoneCode))
                this.args = { sort: ['id_desc'], search: Object.assign({},this.filterData,obj) }
            },
            onTreeClick (nodeData){
                this.args = {page:1, size:20, sort: ['id_desc'], search: Object.assign({},this.filterData,{ organizationId: nodeData.id })}
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
                this.$TCS.addTag('red_2928_010004001001');
                this.dialogTitle = '新增验收单'
                this.editType = 'add'
                this.addDialogVisible = true
                this.rowId = null
                this.billData = {
                    projectId: null,
                    sheduleNodeId: null
                }
            },
            yuyue (){
                //集成点击流
                this.$TCS.addTag('red_2928_010004001004');
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
                let shareStatus = false;
                if(rows.length > 0){
                    for(let i in rows){
                        if(rows[i].status != 1){
                            yanshouStatus = true;
                        }
                        if(rows[i].status != 1 && rows[i].status != 0){
                            yuyueStatus = true;
                        }
                        if(rows[i].shareFlag != 2){
                            shareStatus = true;
                        }
                    }
                    if(rows.length > 1){
                        shareStatus = true;
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
                if(shareStatus){
                    this.$refs['toolbar'].disableBySymbol('SHARE');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('SHARE');
                }
            },
            share(){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行操作！')
                } else{
                    let url = "http://erp.to8to.com/index.php/Share/share/yanshouReport?id=" + selections[0].id;
                    this.shareDialog = true;
                    if(this.qrcodeModel == null){
                        this.$nextTick(()=>{
                            this.qrcodeModel = new QRCode(document.getElementById("qrcode"), {
                                text: url,
                                width: 128,
                                height: 128,
                                colorDark: "#000000",
                                colorLight: "#ffffff",
                                correctLevel: QRCode.CorrectLevel.H
                            });
                        })
                    } else {
                        this.qrcodeModel.makeCode(url)
                    }
                }
            }
        }
    }
</script>

<style scoped>
    #qrcode{
        width: 128px;
        margin: 0 auto;
    }
</style>
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
