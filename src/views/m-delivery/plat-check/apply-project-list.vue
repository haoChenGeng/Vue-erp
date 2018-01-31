<template>
    <div>
        <t8t-search :fields="fields" :selectSource="selectSource" @submit="submitSearch">
        </t8t-search>
        <div class="g-main-container">
            <div class="g-main-container-column">
                <t8t-toolbar :symbolList="symbolList" @APPLY="apply" ref="toolbar">
                </t8t-toolbar>
                <t8t-table :radioCol=true :columns="columns" :service="service" :method="method" :args="args" :pageBar="true" :commonData="commonData"
                    :preLoad=false ref="t8tTable" @current-row-change="selectionChange" @data-loaded="dataLoaded" @row-double-click="jumpToProjectDetail">
                    <template scope="scope" slot="sourceProjectId"><span class="hand">{{scope.row.decorationOrderVO.sourceProjectId}}</span></template>
                </t8t-table>
            </div>
        </div>
        <add-plat-check v-if="addDialogVisible" :projectId="projectId" :editType="editType" :title="dialogTitle" @close="closeAddDialog"
            @getTableData="getTableData">
        </add-plat-check>
        <el-dialog class="apply-check-message" v-model="checkVisible" @close="cancleClick()">
            <div v-if="checkMessage != ''" class='checkMessage'>
                <span style="color:rgb(50, 139, 239);font-size: 16px;">温馨提示：</span>
                <div class="noteBox" v-html="checkMessage"></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="assignManagerClick()" v-if="assignManager">去派工长</el-button>
                <el-button @click="confirmCheckClick()" v-if="confirmCheck">去开工确认</el-button>
                <el-button @click="cancleClick()">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog class="insurance-dialog" v-model="insuranceVisible" @close="cycleClick()">
            <div v-if="fitMessage != ''" class='fitMessage'>
                <span style="color:blue;font-size: 16px;">温馨提示：</span>
                <div class="fitNoteBox" v-html="fitMessage"></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cycleClick()">我要自行购买</el-button>
                <el-button @click="onLineClick()">使用泰康在线</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import AddPlatCheck from './add-plat-check.vue'
    import Service from 'src/services/delivery/Service.js'
    import Cookie from 'js-cookie'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import CheckCommon from 'src/services/delivery/check/checkCommon.js'
    //import AddStartBill from './add-start-bill.vue'

    export default {
        name: 'plat-check-list',
        components: {
            AddPlatCheck,//TODO 弹窗
            //AddStartBill,//TODO 弹窗
            // OpDialog
        },
        data() {
            let that = this;
            return {
                symbolList: ['APPLY'],
                //搜索表单项配置
                //搜索表单项配置
                fields: [
                    { type: 'input', label: '项目ID:', name: 'sourceProjectId' },
                    { type: 'input', label: '业主姓名:', name: 'ownerName_like' },
                    { type: 'input', label: '楼盘:', name: 'estateName_like' },
                    {
                        type: 'popup',
                        label: '工长姓名:',
                        name: 'projectManagerId',
                        textValue: 'name',
                        filedValue: 'accountId',
                        //triggerOnFocus: false,
                        remote: true,
                        service: Service.YANSHOU.name,
                        method: Service.YANSHOU.methods.queryCorpMember,
                        remoteArgs: { sort: ['id_asc'], page: 1, size: 20 },
                        remoteQueryKey: "name_like",
                        dialog: {
                            title: '工长搜索',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    { type: 'input', label: '工长姓名', name: 'name_like' }
                                ]
                            },
                            table: {
                                service: Service.YANSHOU.name,
                                method: Service.YANSHOU.methods.queryCorpMember,
                                args: {},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'accountId',
                                        label: 'ID',
                                    },
                                    {
                                        prop: 'name',
                                        label: '工长姓名'
                                    },
                                    {
                                        prop: 'nickname',
                                        label: '昵称'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        // 设计师姓名搜索 queryPageAccountByRootId
                        type: 'popup',
                        label: '设计师姓名:',
                        name: 'designerId',
                        textValue: 'name',
                        filedValue: 'accountId',
                        //triggerOnFocus: false,
                        remote: true,
                        service: Service.YANSHOU.name,
                        method: Service.YANSHOU.methods.queryCorpMember,
                        remoteArgs: { roleType: 1, page: 1, size: 20 },
                        remoteQueryKey: "name_like",
                        dialog: {
                            title: '设计师搜索',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    { type: 'input', label: '设计师姓名', name: 'name_like' }
                                ]
                            },
                            table: {
                                service: Service.YANSHOU.name,
                                method: Service.YANSHOU.methods.queryCorpMember,
                                args: {},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'accountId',
                                        label: 'ID',
                                    },
                                    {
                                        prop: 'name',
                                        label: '设计师姓名'
                                    },
                                    {
                                        prop: 'nickname',
                                        label: '昵称'
                                    }
                                ]
                            }
                        }
                    },
                    { type: 'select', label: '项目状态:', name: 'orderSubStatus', selectSourceKey: 'orderSubStatusList', filterable: true },
                    { type: 'date', label: '签约时间自', name: 'realSignedTime_gte' },
                    { type: 'date', label: '签约时间至', name: 'realSignedTime_lte' },
                    { type: 'date', label: '开工时间自', name: 'startTime_gte' },
                    { type: 'date', label: '开工时间至', name: 'startTime_lte' },
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {

                },
                columns:
                [
                    //{"prop": "projectId", "label": "ID",disabled},
                    { "prop": "sourceProjectId", "label": "项目ID", "width": 150 },
                    { "prop": "projectManagerName", "label": "工长姓名", "width": 150 },
                    { "prop": "ownerName", "label": "业主姓名", "width": 150 },
                    {
                        "prop": "address", "label": "详细地址", "formatter": function (val, row, col, table) {
                            return row.decorationOrderVO.cityName + row.decorationOrderVO.standardTownName + row.decorationOrderVO.estateName + row.decorationOrderHouseVO.houseAddress
                        },
                        "width": 400, align: "left"
                    },
                    { "prop": "orderSubStatusName", "label": "项目状态" },
                    { "prop": "designerName", "label": "设计师姓名" },
                    { "prop": "realSignedTime", "label": "签约日期", "formatter": this.dateParser },
                    { "prop": "startTime", "label": "开工日期", "formatter": this.dateParser },
                    { "prop": "createTime", "label": "发布日期", "formatter": this.dateParser },
                ],
                commonData: {

                },
                service: Service.PRSMDM.name,
                method: Service.PRSMDM.methods.decorationOrderQueryDetailPage,
                args: {
                    fields: ["id", "sourceProjectId", "rootOrgId", "ownerId", "ownerName", "projectManagerId", "projectManagerName", "orderMainStatus", "orderSubStatus", "houseAddress", "cityId", "cityName", "townId", "townName", "estateId", "estateName", "designerId", "designerName", "realSignedTime", "startTime", "createTime"],
                    search: { orderSubStatus_gte: '8100602' },
                    sort: ['startTime_desc'],
                },
                //TODO 过滤项目状态为"已签约" 8!810!81006!8100602
                filterData: {
                    orderSubStatus_gte: '8100602'
                },
                editType: 'add',
                addDialogVisible: false,
                rowId: null,
                selectedRows: null,
                orderSubStatusList: [],
                checkVisible: false,
                checkMessage: '',
                confirmCheck: false,
                assignManager: false,
                insuranceVisible: false,

            }
        },
        created() {
            let list = [];
            //TODO 
            let wholeCodes = ["8!810!81006", "8!810!81007", "8!810!81008"];
            commonApi.queryChildrenByWholeCodes(wholeCodes)
                .then((res) => {
                    let result = res.data.result;
                    for (var index in result) {
                        let code = result[index];
                        code.forEach(function (item, i) {
                            if (item.wholeCode != "8!810!81006!8100601" && item.wholeCode != "8!810!81006!8100603") {
                                list.push({
                                    value: item.propertyCode,
                                    text: item.propertyName
                                })
                            }
                        });
                    }
                });
            //list.push({ value: '', text: '' });
            this.selectSource.orderSubStatusList = list;
        },
        activated() {
            setTimeout(() => {
                this.$refs['t8tTable'].doLayout();
            }, 0);
            setTimeout(() => {
                this.$refs['t8tTable'].doLayout();
            }, 0);
            this.getTableData();
        },
        methods: {
            dataLoaded(dataSource) {
                dataSource.forEach((item, index) => {
                    item.decorationOrderVO = item.decorationOrderVO || {};
                    //dataSource[index].projectId = item.decorationOrderVO.id;
                    dataSource[index].sourceProjectId = item.decorationOrderVO.sourceProjectId;
                    dataSource[index].ownerName = item.decorationOrderVO.ownerName;
                    dataSource[index].projectManagerName = item.decorationOrderVO.projectManagerName;
                    dataSource[index].orderSubStatusName = item.decorationOrderVO.orderSubStatusName;
                    dataSource[index].designerName = item.decorationOrderVO.designerName;
                    dataSource[index].realSignedTime = item.decorationOrderVO.realSignedTime;
                    dataSource[index].startTime = item.decorationOrderVO.startTime;
                    dataSource[index].createTime = item.decorationOrderVO.createTime;
                    //dateSource[index].orderSubStatus = item.decorationOrderVO.orderSubStatus;
                })
            },
            //搜素
            submitSearch(obj) {
                let fields = this.args.fields;
                this.args = {
                    sort: ['startTime_desc'],
                    search: Object.assign(obj, this.filterData), fields: fields
                    //search: obj, fields: fields
                }
            },
            dateParser(text) {
                let dateString;
                let objDate = new Date(text * 1000);
                if (text === 0 || text === null) {
                    dateString = ""
                } else {
                    dateString = DateUtils(objDate, 'yyyy-mm-dd')
                }
                return dateString
            },
            apply() {
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！')
                } else if (selections.length > 1) {
                    this.$message.error('只能选择一行进行操作！')
                } else {

                    //校验是否满足泰康保险
                    CheckCommon.verifyFit({ sourceProjectId: this.selectedRows.decorationOrderVO.sourceProjectId })
                        .then((res) => {
                            let reminder = '';
                            let fitMessage = '';
                            if (res.data.status === 211519)//泰康保险的条件
                            {
                                //弹框
                                fitMessage = '请参照土巴兔推广服务合作合同工地保障条款购买建筑工程意外险，自行购买请联系BD，在线购买建议使用泰康在线。';
                                this.fitMessage = fitMessage;
                            }
                            else if (res.data.status === 200) {
                                this.assignManager = false;
                                this.confirmCheck = false;
                                let message = '';
                                let checkMessage = '';
                                let orderSubStatus = selections[0].decorationOrderVO.orderSubStatus;
                                let projectManagerName = selections[0].projectManagerName;
                                if (orderSubStatus == "8100801" || orderSubStatus == "8100802")//已工程竣工,已财务竣工
                                {
                                    //项目已竣工
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: "该项目已竣工,不能申请验收!",
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    });
                                } else {
                                    if (!projectManagerName || projectManagerName == "") {
                                        checkMessage = "1.未派工长，点击“去派工长”按钮可链接至派工长界面".concat("<br>");
                                        this.assignManager = true;
                                    }
                                    if (orderSubStatus == "8100602")//已签约
                                    {
                                        if (checkMessage != '') {
                                            checkMessage = checkMessage.concat(2.);
                                        } else {
                                            checkMessage = checkMessage.concat(1.);
                                        }
                                        checkMessage = checkMessage.concat("该项目还未开工,请点击“去开工确认”按钮可链接至开工确认界面").concat("<br>");
                                        this.confirmCheck = true;
                                        //去开工确认
                                    }
                                    this.checkMessage = checkMessage;
                                    if (checkMessage != '') {
                                        this.checkVisible = true;
                                    } else {
                                        let projectId = selections[0].decorationOrderVO.id;
                                        if (projectId == null || projectId == '') {
                                            message = "未获取到数据,请稍后再试!";
                                        } else {
                                            //let selections = this.$refs['t8tTable'].getSelectRows();
                                            this.dialogTitle = '验收申请'
                                            this.editType = 'add'
                                            this.addDialogVisible = true
                                            this.projectId = projectId;
                                        }
                                    }
                                }

                                if (message != '') {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: message,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    });
                                }
                            }
                            else if (res.data.status != 200) {
                                reminder = '系统异常,请稍后再试！';
                            }
                            if (reminder != '') {
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: reminder,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                });
                            }
                            if (fitMessage != '') {
                                this.insuranceVisible = true;
                            }
                        })
                }
            },
            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },
            //行变化事件
            selectionChange(curRow, oldRow) {
                //已选择行
                this.selectedRows = curRow;
                //启用禁用按钮交互

            },
            closeAddDialog() {
                this.addDialogVisible = false;
                this.$refs['t8tTable'].reloadTable();
            },
            assignManagerClick() {
                let that = this;
                let projectId = this.selectedRows.decorationOrderVO.id
                this.checkVisible = false;
                //派单-项目经理
                this.$router.push({
                    path: '/tuchat-itemAssign/assign-principal-item-page',
                    query: {
                        id: projectId,
                        mode: 'view',
                        backUrl: '/tuchat-delivery/plat-check-list',
                    },
                })
                //this.$refs['t8tTable'].reloadTable();
            },
            cancleClick() {
                //this.$refs['t8tTable'].selection = [];
                this.checkVisible = false;
                this.$refs['t8tTable'].reloadTable();
            },
            confirmCheckClick() {
                this.checkVisible = false;
                this.$router.push({ path: '/tuchat-delivery/confirm-list' })
            },
            cycleClick()//取消
            {
                this.insuranceVisible = false
            },
            onLineClick() {//跳转泰康在线
                //var link = "http://ecuat.taikang.com/channel/coop_test/tbt/index.html";//test uat
                var link = "http://act.tk.cn/tbt/index.html";//线上url
                window.open(link);
            },
            jumpToProjectDetail: function (row) {
                this.$router.push({
                    path: '/tuchat-sale-manage/page-project-detail',
                    query: {
                        id: row.decorationOrderVO.id,
                        goBackRoute: '/tuchat-delivery/plat-check-list'
                    }
                })
            },
        }
    }

</script>
<style>
    .hand {
        cursor: pointer;
        color: #00a0e9;
    }
</style>
<style lang="css" scoped>
    .fitMessage {
        color: black;
        text-decoration: none;
        margin-left: 10px;
        line-height: 32px;
        font-size: 14px;
    }

    .fitNoteBox {
        margin-left: 2em;
    }
</style>
<style lang="css" scoped>
    .checkMessage {
        color: black;
        text-decoration: none;
        margin-left: 10px;
        line-height: 32px;
        font-size: 14px;
    }

    .noteBox {
        margin-left: 2em;
    }
</style>
<style lang="css">
    .safsadacfa_node-dialog .table-container {
        height: 350px;
    }

    .safsadacfa_node-dialog .el-dialog__body {
        height: 410px;
        display: flex;
    }

    .safsadacfa_node-dialog .el-dialog {
        width: 800px;
    }
</style>