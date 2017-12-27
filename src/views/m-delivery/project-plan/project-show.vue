<template>
    <div>
        <el-dialog @close="closeDialog"
            v-model="isDialogShow"
            size="full"
            class="t8t-full-dialog"
            :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                    </div>
                </div>
                <div class="full-dialog-form-container container-center">
                    <el-tabs v-model="tab_info">
                        <el-tab-pane label="基础信息"
                            name="base">
                            <el-row :gutter="24">
                                <el-col :span="2">
                                    <div class="grid-content">业主姓名：</div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="grid-content">{{projectInfo.ownerName}}
                                        <!--<el-button size="small">拨打</el-button>-->
                                    </div>
                                </el-col>
                                <el-col :span="2">
                                    <div class="grid-content">装修产品：</div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="grid-content">{{projectInfo.productPkgName}}</div>
                                </el-col>
                                <el-col :span="2">
                                    <div class="grid-content">工地地址：</div>
                                </el-col>
                                <el-col :span="10">
                                    <div class="grid-content">{{projectInfo.cityName}}{{projectInfo.townName}}{{projectInfo.estateName}}{{projectInfo.houseAddress}}</div>
                                </el-col>
                                <!--<el-col :span="2">-->
                                <!--<div class="grid-content">转入日期：</div>-->
                                <!--</el-col>-->
                                <!--<el-col :span="4">-->
                                <!--<div class="grid-content">2017-01-01</div>-->
                                <!--</el-col>-->
                                <!--<el-col :span="2">-->
                                <!--<div class="grid-content">签约日期：</div>-->
                                <!--</el-col>-->
                                <!--<el-col :span="4">-->
                                <!--<div class="grid-content">2017-01-01</div>-->
                                <!--</el-col>-->
                                <!--<el-col :span="2">-->
                                <!--<div class="grid-content">开工日期：</div>-->
                                <!--</el-col>-->
                                <!--<el-col :span="10">-->
                                <!--<div class="grid-content">2017-01-01</div>-->
                                <!--</el-col>-->
                                <!--<el-col :span="2">-->
                                <!--<div class="grid-content">竣工日期：</div>-->
                                <!--</el-col>-->
                                <!--<el-col :span="4">-->
                                <!--<div class="grid-content">2017-01-01</div>-->
                                <!--</el-col>-->
                                <!--<el-col :span="3">-->
                                <!--<div class="grid-content">项目结束日期：</div>-->
                                <!--</el-col>-->
                                <!--<el-col :span="3">-->
                                <!--<div class="grid-content">2017-01-01</div>-->
                                <!--</el-col>-->
                                <!--<el-col :span="3">-->
                                <!--<div class="grid-content">项目完结类型：</div>-->
                                <!--</el-col>-->
                                <!--<el-col :span="9">-->
                                <!--<div class="grid-content">竣工</div>-->
                                <!--</el-col>-->
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="full-dialog-tabs-container">
                    <div class="top-hide el-icon-d-arrow-left"
                        @click="onTopHide"></div>
                    <el-tabs v-model="tab_list">
                        <el-tab-pane label="负责人信息"
                            name="charge">
                            <div class="my-container">
                                <t8t-table ref="chargeTable"
                                    :columns="chargeColumns"
                                    :service="chargeService"
                                    :method="chargeMethod"
                                    :args="chargeArgs"
                                    :isLoading="isLoading"
                                    :commonData="commonOptionsConfig"
                                    :pageBar="true">
                                </t8t-table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="进度信息">
                            <t8t-table ref="NodeListTable"
                                :columns="listColumns"
                                :service="listService"
                                :method="listMethod"
                                :args="listArgs"
                                :pageBar="true"
                                :editable="true"
                                :commonData="commonOptionsConfig">
                                <template slot="nodeRelationCount"
                                    scope="scope">
                                    <a href="javascript:;"
                                        @click="showNodeRef(scope.row.id)">{{scope.row['nodeRelationCount']}}</a>
                                </template>
                                <template slot="nodePropertyCount"
                                    scope="scope">
                                    <a href="javascript:;"
                                        @click="showNodeAttr(scope.row.id)">{{scope.row['nodePropertyCount']}}</a>
                                </template>
                            </t8t-table>
                        </el-tab-pane>
                        <el-tab-pane label="财务信息">
                            财务信息

                        </el-tab-pane>
                        <el-tab-pane label="发包信息">
                            发包信息

                        </el-tab-pane>
                        <el-tab-pane label="业主信息">
                            业主信息

                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="节点关系"
            v-model="nodeListRefDataDialog"
            size="large"
            class="safsadacfac_node-dialog">
            <t8t-table :columns="listRefColumns"
                :pageBar="true"
                :editable="false"
                :selectCol="false"
                :service="nodeListRefDialogService"
                :method="nodeListRefDialogMethod"
                :args="nodeListRefDialogArgs"
                :commonData="commonOptionsConfig">
            </t8t-table>
        </el-dialog>
        <el-dialog title="节点属性"
            v-model="nodeListAttrDataDialog"
            size="large"
            class="safsasfsadffacfac_node-dialog">
            <t8t-table :columns="listAttributeColumns"
                :pageBar="true"
                :editable="false"
                :selectCol="false"
                :service="nodeListAttrDialogService"
                :method="nodeListAttrDialogMethod"
                :args="nodeListAttrDialogArgs"
                :commonData="commonOptionsConfig">
            </t8t-table>
        </el-dialog>
    </div>
</template>

<script>
    import Service from 'src/services/delivery/Service.js'
    import axios from 'src/utils/axios.js'
    export default {
        name: 'project-show',
        data() {
            return {
                isDialogShow: true,
                isLoading: false,
                isTopHide: false,
                tab_info: 'base',
                tab_list: 'charge',
                detailInfo: {},
                chargeColumns: [
                    {
                        prop: 'role',
                        label: '角色'
                    },
                    {
                        prop: 'name',
                        label: '姓名'
                    },
                    {
                        prop: 'enName',
                        label: '英文名'
                    },
                    {
                        prop: 'assignDate',
                        label: '分配日期'
                    },
                    {
                        prop: 'assignUser',
                        label: '分配人'
                    },
                    {
                        prop: 'valid',
                        label: '有效'
                    }
                ],
                chargeService: '',
                chargeMethod: '',
                chargeArgs: {},
                commonOptionsConfig: {
                    isLast: [
                        { value: 1, text: '是' },
                        { value: 0, text: '否' }
                    ],
                    nodeStatusList: [
                        { value: 2, text: '已完成' },
                        { value: 1, text: '进行中' },
                        { value: 0, text: '待开始' }
                    ],
                    relationStatus: [
                        { value: 0, text: '禁用' },
                        { value: 1, text: '启用' }
                    ]
                },
                listColumns: [
                    { "prop": "id", "label": "ID" },
                    { "prop": "nodeTypeName", "label": "节点类型" },
                    { "prop": "parentId", "label": "父节点ID" },
                    { "prop": "parentNodeTypeName", "label": "父节点类型" },
                    { "prop": "relationTypeName", "label": "父子关系类型" },
                    { "prop": "lastNode", "label": "是否为末级", "list": "isLast" },
                    { "prop": "nodeRelationCount", "label": "前置条件" },
                    { "prop": "billTypeName", "label": "单据类型" },
                    { "prop": "nodePropertyCount", "label": "属性" },
                    { "prop": "headId", "label": "单据编码" },
                    { "prop": "predictCompleteTime", "label": "预计完成时间", "formatter": "dateParser" },
                    { "prop": "actualCompleteTime", "label": "实际完成时间", "formatter": "dateParser" },
                    { "prop": "nodeStatus", "label": "状态", "list": "nodeStatusList" },
                    { "prop": "updateUserName", "label": "编辑人" },
                    { "prop": "updateTime", "label": "编辑时间", "formatter": "dateParser" }
                ],
                listRefColumns: [
                    { "prop": "headId", "label": "前置节点ID" },
                    { "prop": "headTypeName", "label": "节点类型" },
                    { "prop": "advance", "label": "提前量" },
                    { "prop": "relationTypeName", "label": "关系类型" },
                    { "prop": "relationStatus", "label": "启用状态", "list": "relationStatus" }
                ],
                listAttributeColumns: [
                    { "prop": "id", "label": "ID" },
                    { "prop": "nodeId", "label": "节点ID" },
                    { "prop": "nodeTypeName", "label": "节点类型" },
                    { "prop": "assistCode", "label": "辅助资料编码" },
                    { "prop": "assistName", "label": "辅助资料名称" },
                    { "prop": "assistValueCode", "label": "辅助资料值编码" },
                    { "prop": "assistValueName", "label": "辅助资料值名称" }
                ],
                listMethod: Service.PLAN.methods.projectDetailList,
                listService: Service.PLAN.name,
                listArgs: { search: { projectId: this.$route.query.id } },
                nodeListRefDataDialog: false,
                nodeListRefDialogService: null,
                nodeListRefDialogMethod: null,
                nodeListRefDialogArgs: {},
                nodeListAttrDataDialog: false,
                nodeListAttrDialogService: null,
                nodeListAttrDialogMethod: null,
                nodeListAttrDialogArgs: {},
                projectInfo: {},
            }
        },
        created() {
            if (!this.$route.query.id) {
                this.$msgbox({
                    title: '消息',
                    type: 'error',
                    message: '参数错误！',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                }, function () {
                    //todo 没传参数的情况
                });
                return false;
            }
            axios({
                method: Service.PLAN.methods.findProjectDetail,
                service: Service.PLAN.name,
                args: { projectId: this.$route.query.id }
            }).then((res) => {
                if (res.data.status === 200) {
                    this.projectInfo = res.data.result;
                }
            }
                )
        },
        methods: {
            closeDialog() {
                this.$router.go(-1);
            },
            onTopHide() {
                this.isTopHide = !this.isTopHide
            },
            showNodeRef(nodeId) {
                this.nodeListRefDataDialog = true;
                this.nodeListRefDialogService = Service.PLAN.name;
                this.nodeListRefDialogMethod = Service.PLAN.methods.nodeRelationQueryPage;
                this.nodeListRefDialogArgs = { search: { tailId: nodeId } };
            },
            showNodeAttr(nodeId) {
                this.nodeListAttrDataDialog = true;
                this.nodeListAttrDialogService = Service.PLAN.name;
                this.nodeListAttrDialogMethod = Service.PLAN.methods.nodePropertyQueryPage;
                this.nodeListAttrDialogArgs = { search: { nodeId: nodeId } };
            }
        }
    }

</script>

<style lang="css"
    scoped>
    .t8t-full-dialog .my-container {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }

    .t8t-full-dialog .my-toolbar {
        margin-bottom: 15px;
    }
</style>

<style>
    .safsadacfac_node-dialog .table-container {
        height: 350px;
    }

    .safsadacfac_node-dialog .el-dialog__body {
        height: 410px;
        display: flex;
    }

    .safsasfsadffacfac_node-dialog .el-dialog__body {
        height: 410px;
        display: flex;
    }

    .safsadacfac_node-dialog .el-dialog {
        width: 800px;
    }

    .safsasfsadffacfac_node-dialog .el-dialog {
        width: 1091px;
    }

    .safsasfsadffacfac_node-dialog .table-container {
        height: 350px;
    }

    .t8t-full-dialog .el-dialog__header {
        padding: 0;
    }

    .t8t-full-dialog .el-dialog__body {
        padding: 0;
        height: 100%;
    }

    .t8t-full-dialog .t8t-full-dialog-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .t8t-full-dialog .full-dialog-tabs-container {
        flex: 1;
        margin-bottom: 20px;
    }

    .t8t-full-dialog .full-dialog-toolbar-container {
        height: 38px;
        background-color: #1e3046;
    }

    .t8t-full-dialog .toolbar-container {
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }

    .t8t-full-dialog .toolbar-container .toolbar-button {
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }

    .t8t-full-dialog .toolbar-container .toolbar-button:hover {
        color: #1e3046;
        background-color: #d2deeb;
    }

    .t8t-full-dialog .container-center {
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }

    .t8t-full-dialog .el-form {
        display: flex;
        flex-wrap: wrap;
    }

    .t8t-full-dialog .form-item-container {
        width: 25%;
    }

    .t8t-full-dialog .full-dialog-form-container {
        margin-bottom: 10px;
        min-height: 170px;
        position: relative;
    }

    .t8t-full-dialog .full-dialog-form-container .el-form-item__content {
        width: 180px;
    }

    .t8t-full-dialog .full-dialog-tabs-container {
        display: flex;
        position: relative;
    }

    .t8t-full-dialog .el-tabs {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__item {
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }

    .t8t-full-dialog .el-tabs__header {
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }

    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar {
        height: 1px;
    }

    .t8t-full-dialog .el-tabs__item+.el-tabs__item {
        border-left: 1px solid #d4dce7;
    }

    .t8t-full-dialog .el-tabs__nav-wrap {
        width: 1220px;
        margin: 0 auto;
    }

    .t8t-full-dialog .el-tabs__content {
        flex: 1;
        display: flex;
        /*        width: 1220px;
                margin: 0 auto;*/
    }

    .t8t-full-dialog .el-tab-pane {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        overflow: auto;
    }
    /* 顶部tab */

    .t8t-full-dialog .full-dialog-form-container .el-tabs__item {
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }

    .t8t-full-dialog .full-dialog-form-container .el-tabs__header {
        border-top: 0;
        border-bottom: 0;
    }

    .el-row {
        padding-left: 20px;
        width: 100%;

        & :last-child {
            margin-bottom: 0;
        }
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .el-col .grid-content .el-button {
        margin-left: 10px;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

    .el-tabs__active-bar {
        height: 1px;
    }

    .t8t-full-dialog .top-hide {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1;
        transform: rotate(90deg);
        cursor: pointer;
    }

    .t8t-full-dialog.isHide .top-hide {
        transform: rotate(-90deg);
    }

    .t8t-full-dialog.isHide .full-dialog-form-container {
        height: 0;
        padding-top: 0;
        display: none;
    }
</style>