<template>
    <div>
        <t8t-search :fields="fields" :selectSource="selectSource" @submit="submitSearch">
        </t8t-search>
        <div class="g-main-container">
            <div class="g-main-container-column">
                <t8t-toolbar :symbolList="symbolList" @CONFIRM="confirm" ref="toolbar">
                </t8t-toolbar>
                <t8t-table :radioCol=true :columns="columns" :service="service" :method="method" :args="args" :pageBar="true" :commonData="commonData"
                    :preLoad=false ref="t8tTable" @current-row-change="selectionChange" @data-loaded="dataLoaded">
                </t8t-table>
            </div>
        </div>
        <add-start-bill v-if="addDialogVisible" :projectId="projectId" :editType="editType" :title="dialogTitle" @close="addDialogVisible=false"
            @getTableData="getTableData">
        </add-start-bill>
        <!-- <op-dialog v-if="dialogVisible" :id="id" :rowId="rowId" :billCode="billCode" :editType="editType" :title="dialogTitle" @close="dialogVisible=false"
            @getTableData="getTableData">
        </op-dialog> -->
        <el-dialog class="insurance-dialog" v-model="insuranceVisible" @close="cycleClick()">
            <div v-if="fitMessage != ''" class='fitMessage'>
                <span style="color:blue;font-size: 16px;">温馨提示：</span>
                <div class="noteBox" v-html="fitMessage"></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cycleClick()">我要自行购买</el-button>
                <el-button @click="onLineClick()">使用泰康在线</el-button>
            </div>
        </el-dialog>
        <el-dialog class="assign-manager" v-model="assignManagerVisible" @close="cancleClick()">
            <div v-if="assignMessage != ''" class='assignMessage'>
                <span style="color:blue;font-size: 16px;">温馨提示：</span>
                <div class="noteBox" v-html="assignMessage"></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="assignManagerClick()">去派工长</el-button>
                <el-button @click="cancleClick()">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import AddStartBill from './add-start-bill.vue'
    import Service from 'src/services/delivery/Service.js'
    import Cookie from 'js-cookie'
    //import commonApi from 'src/services/commonApi/commonApi.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import CheckCommon from 'src/services/delivery/check/checkCommon.js'
    export default {
        name: 'confirm-list',
        components: {
            AddStartBill,//TODO 弹窗
            // OpDialog
        },
        data() {
            let that = this;
            return {
                symbolList: ['CONFIRM'],
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
                    { type: 'date', label: '签约时间自', name: 'realSignedTime_gte' },
                    { type: 'date', label: '签约时间至', name: 'realSignedTime_lte' },
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {

                },
                columns:
                [
                    //{"prop": "projectId", "label": "ID",disabled},
                    { "prop": "sourceProjectId", "label": "项目ID", "width": 200 },
                    { "prop": "projectManagerName", "label": "工长姓名", "width": 250 },
                    { "prop": "ownerName", "label": "业主姓名", "width": 250 },
                    {
                        "prop": "address", "label": "详细地址", "formatter": function (val, row, col, table) {
                            return row.decorationOrderVO.cityName + row.decorationOrderVO.standardTownName + row.decorationOrderVO.estateName + row.decorationOrderHouseVO.houseAddress
                        },
                        "width": 450, align: "left"
                    },
                    { "prop": "realSignedTime", "label": "签约时间", "formatter": "dateParser" },
                    { "prop": "orderSubStatusName", "label": "项目状态" }
                ],
                commonData: {

                },
                service: Service.PRSMDM.name,
                method: Service.PRSMDM.methods.decorationOrderQueryDetailPage,
                args: {
                    fields: ["id", "sourceProjectId", "ownerId", "ownerName", "projectManagerId", "projectManagerName", "orderMainStatus", "orderSubStatus", "houseAddress", "cityId", "cityName", "townId", "townName", "estateId", "estateName", "realSignedTime"],
                    search: { orderSubStatus: '8100602' },
                    sort: ['realSignedTime_desc'],
                },
                //TODO 过滤项目状态为"已签约" 8!810!81006!8100602
                filterData: {
                    orderSubStatus: '8100602'
                },
                editType: 'add',
                addDialogVisible: false,
                rowId: null,
                selectedRows: null,
                insuranceVisible: false,
                assignManagerVisible: false,
            }
        },
        created() {

        },
        activated() {
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
                    dataSource[index].realSignedTime = item.decorationOrderVO.realSignedTime;

                })
            },
            //搜素
            submitSearch(obj) {
                let fields = this.args.fields;
                this.args = {
                    sort: ['realSignedTime_desc'],
                    search: Object.assign(obj, this.filterData), fields: fields
                    //search: obj, fields: fields
                }
            },
            confirm() {
                //集成点击流  TODO
                //this.$TCS.addTag('red_2928_010004001001');
                let selections = this.$refs['t8tTable'].getSelectRows();

                if (this.selectedRows === null) {
                    this.$message.error('请选择要操作的行！')
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
                                let projectManagerName = this.selectedRows.decorationOrderVO.projectManagerName;
                                if (projectManagerName == null || projectManagerName == "") {
                                    //未派工长
                                    this.assignMessage = "该项目未派工长,请点击“去派工长”按钮可链接至派工长页面";
                                    this.assignManagerVisible = true;
                                } else {
                                    this.dialogTitle = '开工确认'
                                    this.editType = 'add'
                                    this.addDialogVisible = true
                                    this.projectId = this.selectedRows.decorationOrderVO.id
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
            cycleClick()//取消
            {
                this.insuranceVisible = false
            },
            onLineClick() {//跳转泰康在线
                //var link = "http://ecuat.taikang.com/channel/coop_test/tbt/index.html";//test uat
                var link = "http://act.tk.cn/tbt/index.html";//线上url
                window.open(link);
            },
            assignManagerClick() {
                let that = this;
                let projectId = this.selectedRows.decorationOrderVO.id
                this.assignManagerVisible = false;
                //派单-项目经理
                this.$router.push({
                    path: '/tuchat-itemAssign/assign-principal-item-page',
                    query: {
                        id: projectId,
                        mode: 'view',
                        backUrl: '/tuchat-delivery/confirm-list',
                    },
                });
            },
            cancleClick() {
                this.assignManagerVisible = false;
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
            }
        },
    }

</script>
<style lang="css" scoped>
    .fitMessage {
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
<style lang="css" scoped>
    .assignMessage {
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