<template>
    <div class="project-detail-class">
        <el-dialog @close="closeDialog"
            v-model="isDialogShow"
            v-loading.fullscreen.lock="fullscreenLoading"
            size="full"
            class="t8t-full-dialog"
            :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog-container project-detail">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar ref="toolbar"
                            @SHOUQIANSLH="projectInitProjectNode(1)"
                            @JIAOFUSLH="projectInitProjectNode(2)"
                            class="t8t-dark">
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="full-dialog-form-container container-center">
                    <el-tabs v-model="top_info">
                        <el-tab-pane label="项目基础信息"
                            name="base"
                            class="top_basi_safasfnn">
                            <el-form class="dialog2-form-container"
                                :model="projectInfo"
                                ref="formRef"
                                label-position="right"
                                label-width="120px">
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="项目ID：">
                                        <el-input v-model="projectInfo.sourceProjectId"
                                            disabled></el-input>
                                    </el-form-item>
                                </div>
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="状态：">
                                        <el-input v-model="projectInfo.orderMainStatusName"
                                            disabled></el-input>
                                    </el-form-item>
                                </div>
                                <!-- <div class="dialog2-form-item-container">
                                    <el-form-item label="门店：">
                                        <el-input v-model="projectInfo.organizationName"
                                            disabled></el-input>
                                    </el-form-item>
                                </div> -->
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="子状态：">
                                        <el-input v-model="projectInfo.orderSubStatusName"
                                            disabled></el-input>
                                    </el-form-item>
                                </div>
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="业主姓名：">
                                        <el-input v-model="projectInfo.ownerName"
                                            disabled></el-input>
                                    </el-form-item>
                                </div>
                                <!-- <div class="dialog2-form-item-container">
                                    <el-form-item label="销售主管：">
                                        <el-input v-model="projectInfo.saleDirectorName" disabled></el-input>
                                    </el-form-item>
                                </div> -->
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="客户经理：">
                                        <el-input v-model="projectInfo.customerManagerName"
                                            disabled></el-input>
                                    </el-form-item>
                                </div>
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="设计主管：">
                                        <el-input v-model="projectInfo.designerDirectorName"
                                            disabled></el-input>
                                    </el-form-item>
                                </div>
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="首席设计师：">
                                        <el-input v-model="projectInfo.chiefDesignerName"
                                            disabled></el-input>
                                    </el-form-item>
                                </div>
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="项目经理：">
                                        <el-input v-model="projectInfo.projectManagerName"
                                            disabled></el-input>
                                    </el-form-item>
                                </div>
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="质检：">
                                        <el-input v-model="projectInfo.qualityControlName"
                                            disabled></el-input>
                                    </el-form-item>
                                </div>
                                <!-- <div class="dialog2-form-item-container">
                                    <el-form-item label="产品包：">
                                        <el-input v-model="projectInfo.productPkgName" disabled></el-input>
                                    </el-form-item>
                                </div> -->
                                <!-- <div class="dialog2-form-item-container">
                                    <el-form-item label="产品包ID：">
                                        <el-input v-model="projectInfo.projectPkgId" disabled></el-input>
                                    </el-form-item>
                                </div> -->
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="城市：">
                                        <el-input v-model="projectInfo.cityName"
                                            disabled></el-input>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="full-dialog-tabs-container">
                    <div class="top-hide el-icon-d-arrow-left"
                        @click="onTopHide"></div>
                    <el-tabs v-model="main_info"
                        @tab-click="main_tab_change"
                        style="width:100%">
                        <el-tab-pane label="树状"
                            name="tree">
                            <t8t-tree class="node-tree-list"
                                :data="treeData"
                                :props="treeProps"
                                :default-expanded-keys="[1]"
                                @node-click="onTreeClick">
                            </t8t-tree>
                            <div v-show="nodeDetail"
                                class="right-node-detail">
                                <h3>基本信息</h3>
                                <el-row :gutter="20">
                                    <el-col :span="2">
                                        <div class="grid-content">节点ID：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">{{nodeDetailInfo.projectNodeVO.id}}</div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="grid-content">节点类型：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">{{nodeDetailInfo.projectNodeVO.nodeTypeName}}</div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="grid-content">父节点ID：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">{{nodeDetailInfo.projectNodeVO.parentId}}</div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="grid-content">父节点类型：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">{{nodeDetailInfo.projectNodeVO.parentNodeTypeName}}
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="2">
                                        <div class="grid-content">父子关系类型：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">{{nodeDetailInfo.projectNodeVO.relationTypeName}}
                                        </div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="grid-content">是否为末级：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">
                                            {{nodeDetailInfo.projectNodeVO.lastNode | commonOptionsFilter(commonOptionsConfig.isLast)}}
                                        </div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="grid-content">单据类型：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">{{nodeDetailInfo.projectNodeVO.billTypeName}}</div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="grid-content">状态：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">
                                            {{nodeDetailInfo.projectNodeVO.nodeStatus | commonOptionsFilter(commonOptionsConfig.nodeStatusList)}}
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="2">
                                        <div class="grid-content">预计完成时间：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">
                                            {{nodeDetailInfo.projectNodeVO.predictCompleteTime | dateParser}}
                                        </div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="grid-content">实际完成时间：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">
                                            {{nodeDetailInfo.projectNodeVO.actualCompleteTime | dateParser}}
                                        </div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="grid-content">最近编辑时间：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">{{nodeDetailInfo.projectNodeVO.updateTime | dateParser}}</div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="grid-content">最近编辑人：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">{{nodeDetailInfo.projectNodeVO.updateUserName}}</div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="2">
                                        <div class="grid-content">创建时间：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">{{nodeDetailInfo.projectNodeVO.createTime | dateParser}}</div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="grid-content">创建人：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">{{nodeDetailInfo.projectNodeVO.createUserName}}</div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="grid-content">合同模板：</div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content">{{nodeDetailInfo.projectNodeVO.esmModelName}}</div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="grid-content"></div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="grid-content"></div>
                                    </el-col>
                                </el-row>
                                <h3>属性信息</h3>
                                <t8t-table ref="attributeTable"
                                    :columns="attributeColumns"
                                    :pageBar="false"
                                    :editable="false"
                                    :dataSource="nodeDetailInfo.nodePropertyBreifVOList"
                                    :selectCol="false">
                                </t8t-table>
                                <h3>前置条件</h3>
                                <t8t-table ref="attributeTable"
                                    :columns="conditionsColumns"
                                    :pageBar="false"
                                    :editable="false"
                                    :dataSource="nodeDetailInfo.nodeRelationBreifVOList"
                                    :selectCol="false"
                                    :commonData="commonOptionsConfig">
                                </t8t-table>
                                <h3>单据信息</h3>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="列表"
                            name="list">
                            <t8t-table :style="{width: '100%'}"
                                ref="NodeListTable"
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
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/delivery/Service.js'
    import AccountService from 'src/utils/Service.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    export default {
        name: 'project-detail',
        components: {},
        data() {
            return {
                fullscreenLoading: false,
                top_info: 'base',
                isDialogShow: true,
                isTopHide: false,
                main_info: 'tree',
                treeData: [],
                treeProps: {
                    label: 'nodeTypeName',
                    children: 'children',
                    symbol: 'nodeColor'
                },
                nodeDetail: false,
                projectInfo: {},
                nodeDetailInfo: { projectNodeVO: {}, nodeRelationBreifVOList: [], nodePropertyBreifVOList: [] },
                nodeId: 0,
                listMethod: null,
                listService: null,
                listArgs: null,
                listTableLoad: false,
                //this.$route.query.id
                listColumns: [
                    { "prop": "id", "label": "ID" },
                    { "prop": "nodeTypeName", "label": "节点类型" },
                    {
                        "prop": "nodeStatus", "label": "节点状态", "list": "nodeStatusList", "required": true, "editor": {
                            "type": 'select'
                        }, "onChange": (val, row, col, tab) => {
                            this.projectNodeStatusModify(row.id, val);
                        }
                    },
                    { "prop": "parentId", "label": "父节点ID" },
                    { "prop": "parentNodeTypeName", "label": "父节点类型" },
                    { "prop": "relationTypeName", "label": "父子关系类型" },
                    { "prop": "lastNode", "label": "是否为末级", "list": "isLast" },
                    { "prop": "esmModelName", "label": "合同模板" },
                    { "prop": "nodeRelationCount", "label": "前置条件" },
                    { "prop": "billTypeName", "label": "单据类型" },
                    { "prop": "billId", "label": "单据ID" },
                    { "prop": "billStatus", "label": "单据状态" },
                    { "prop": "nodePropertyCount", "label": "属性" },
                    { "prop": "headId", "label": "单据编码" },
                    { "prop": "predictCompleteTime", "label": "预计完成时间", "formatter": "dateParser" },
                    { "prop": "actualCompleteTime", "label": "实际完成时间", "formatter": "dateParser" },
                    { "prop": "actualCompleteTime", "label": "节点初始化时间", "formatter": "dateParser" },
                    { "prop": "updateUserName", "label": "编辑人" },
                    { "prop": "updateTime", "label": "编辑时间", "formatter": "dateParser" }
                ],
                attributeColumns: [
                    { "prop": "nodeTypeName", "label": "节点类型" },
                    { "prop": "assistCode", "label": "辅助资料编码" },
                    { "prop": "assistName", "label": "辅助资料名称" },
                    { "prop": "assistValueCode", "label": "辅助资料值编码" },
                    { "prop": "assistValueName", "label": "辅助资料值名称" }
                ],
                conditionsColumns: [
                    { "prop": "headId", "label": "前置节点ID" },
                    { "prop": "headTypeName", "label": "节点类型" },
                    { "prop": "advance", "label": "提前量" },
                    { "prop": "relationTypeName", "label": "关系类型" },
                    { "prop": "relationStatus", "label": "启用状态", "list": "relationStatus" }
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
                    ],
                    status: [
                        { value: 1, text: '进行中' },
                        { value: 0, text: '完成' }
                    ]
                },
                nodeListRefDataDialog: false,
                nodeListRefDialogService: null,
                nodeListRefDialogMethod: null,
                nodeListRefDialogArgs: {},
                nodeListAttrDataDialog: false,
                nodeListAttrDialogService: null,
                nodeListAttrDialogMethod: null,
                nodeListAttrDialogArgs: {},
                statusCode: {
                    41000: '系统异常',
                    41010: '报价模板未绑定排期模板',
                    41011: '报价模板绑定的排期模板不止一个',
                    41012: '报价模板绑定的排期模板不存在',
                    41013: '报价模板绑定的排期模板不合法,排期模板禁用或未到启用时间',
                    41014: '该排期模板在当前创建时机下，未配置有效节点',
                    41015: '创建节点异常，成功创建0条',
                    41028: '项目不存在',
                    41032: '实例化节点，查询项目产品包模板为空',
                    41033: '实例化节点失败，项目组织ID或产品包ID为空'
                }
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
            //节点树
            axios({
                method: Service.PLAN.methods.projectDetailTree,
                service: Service.PLAN.name,
                args: { projectId: this.$route.query.id }
            }).then((res) => {
                if (res.data.status === 200) {
                    this.treeData = res.data.result
                }
            }
                );

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
        watch: {
            nodeId: function (val) {
                if (val != 0) {
                    this.getNodeDetailInfo(val)
                }
            }
        },
        filters: {
            commonOptionsFilter: function (val, list) {
                var text = ''
                list.forEach((item) => {
                    if (item.value == val) text = item.text
                })
                return text
            },
            dateParser(text) {
                let dateString = '';
                if (text !== 0 && text !== null && text !== undefined) {
                    let objDate = new Date(text * 1000);
                    dateString = DateUtils(objDate, 'yyyy-mm-dd HH:MM:ss')
                }
                return dateString
            }

        },
        methods: {
            closeDialog() {
                this.$router.go(-1)
            },
            onTopHide() {
                this.isTopHide = !this.isTopHide
            },
            onTreeClick(data) {
                this.nodeId = data.id
            },
            main_tab_change(tab) {
                if (tab.name == 'list' && !this.listTableLoad) {
                    this.listMethod = Service.PLAN.methods.projectDetailList
                    this.listService = Service.PLAN.name
                    this.listArgs = { search: { projectId: this.$route.query.id } }
                    this.listTableLoad = true
                }
            },
            showNodeRef(nodeId) {
                this.nodeListRefDataDialog = true
                this.nodeListRefDialogService = Service.PLAN.name
                this.nodeListRefDialogMethod = Service.PLAN.methods.nodeRelationQueryPage
                this.nodeListRefDialogArgs = { search: { tailId: nodeId } }
            },
            showNodeAttr(nodeId) {
                this.nodeListAttrDataDialog = true
                this.nodeListAttrDialogService = Service.PLAN.name
                this.nodeListAttrDialogMethod = Service.PLAN.methods.nodePropertyQueryPage
                this.nodeListAttrDialogArgs = { search: { nodeId: nodeId } }
            },
            getCommonOptions: function (fatherCode, selectName) {
                let arg = {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            });
                            this.commonOptionsConfig[selectName] = list;
                            this.commonOptionsConfig[selectName].unshift({ value: null, text: '请选择' });
                        }
                    })
            },
            //获取节点详情
            getNodeDetailInfo(nodeId) {
                axios({
                    method: Service.PLAN.methods.findNodeDetail,
                    service: Service.PLAN.name,
                    args: { nodeId: nodeId }
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.nodeDetail = true
                        this.nodeDetailInfo.projectNodeVO = res.data.result.projectNodeVO
                        this.nodeDetailInfo.nodeRelationBreifVOList = res.data.result.nodeRelationBreifVOList
                        this.nodeDetailInfo.nodePropertyBreifVOList = res.data.result.nodePropertyBreifVOList
                    } else {
                        this.nodeDetail = false
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        })
                    }
                }
                    )
            },
            projectNodeStatusModify(id, status) {
                axios({
                    method: Service.PLAN.methods.projectNodeStatusModify,
                    service: Service.PLAN.name,
                    args: { nodeId: id, nodeStatus: status, operUser: +Cookie.get('t8t-tc-uid') }
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.$message.success('成功修改节点状态！');
                    }
                    else if (res.data.status === 200500) {
                        this.$msgbox({
                            title: '修改状态失败！',
                            type: 'error',
                            message: res.data.result.join('<br>')
                        })
                    }
                    else {
                        this.$msgbox({
                            title: '',
                            type: 'error',
                            message: '修改状态失败！'
                        })
                    }
                }).catch((error) => {
                    this.$msgbox({
                        title: '',
                        type: 'error',
                        message: '修改状态失败！'
                    })
                })
            },
            projectInitProjectNode(type) {
                console.log(type);
                let projectId = this.projectInfo.projectId;
                if (!projectId || !type) {
                    this.$message.error('参数错误！');
                    return;
                }
                //console.log(projectId);
                this.fullscreenLoading = true;
                axios({
                    method: Service.PLAN.methods.projectInitProjectNode,
                    service: Service.PLAN.name,
                    args: { projectId: projectId, type: type, operUser: +Cookie.get('t8t-tc-uid') }
                }).then((res) => {
                    this.fullscreenLoading = false;
                    if (res.data.status === 200) {
                        this.$msgbox({
                            title: '',
                            type: 'success',
                            message: '实例化成功！',
                            callback: () => {

                            }
                        })
                    } else if (typeof this.statusCode[res.data.status] !== 'undefined') {
                        this.$msgbox({
                            title: '',
                            type: 'error',
                            message: this.statusCode[res.data.status]
                        })
                    } else {
                        this.$msgbox({
                            title: '',
                            type: 'error',
                            message: '实例化失败！'
                        })
                    }
                }).catch((error) => {
                    this.$msgbox({
                        title: '',
                        type: 'error',
                        message: '请求失败！请重试'
                    })
                })
            }
        }
    }

</script>
<style type="text/css"
    scoped>
    .right-node-detail {
        flex: 1;
        overflow: auto;
    }

    .right-node-detail .t8t-table {
        height: 250px;
    }

    .project-detail-class .top_basi_safasfnn .el-row {
        padding-left: 20px;
        width: 100%;
    }

    & :last-child {
        margin-bottom: 0;
    }
</style>
<style>
    .project-detail-class .node-tre e-list [symbol='0'] {
        color: #000000;
    }

    .project-detail-class .node-tree-list [symbol='1'] {
        color: #228B22;
    }

    .project-detail-class .node-tree-list [symbol='2'] {
        color: #ea1010;
    }

    .project-detail-class .node-tree-list [symbol='3'] {
        color: #cccccc;
    }

    .project-detail-class .safsadacfac_node-dialog .table-container {
        height: 350px;
    }

    .project-detail-class .safsadacfac_node-dialog .el-dialog__body {
        height: 410px;
        display: flex;
    }

    .project-detail-class .safsasfsadffacfac_node-dialog .el-dialog__body {
        height: 410px;
        display: flex;
    }

    .project-detail-class .safsadacfac_node-dialog .el-dialog {
        width: 800px;
    }

    .project-detail-class .safsasfsadffacfac_node-dialog .el-dialog {
        width: 1091px;
    }

    .project-detail-class .safsasfsadffacfac_node-dialog .table-container {
        height: 350px;
    }

    .project-detail-class .t8t-full-dialog .el-dialog__header {
        padding: 0;
    }

    .project-detail-class .t8t-full-dialog .el-dialog__body {
        padding: 0;
        height: 100%;
    }

    .project-detail-class .t8t-full-dialog .t8t-full-dialog-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .project-detail-class .t8t-full-dialog .full-dialog-tabs-container {
        display: flex;
        flex: 1;
        margin: 0 30px;
        position: relative;
    }

    .project-detail-class .t8t-full-dialog .full-dialog-toolbar-container {
        height: 38px;
        background-color: #1e3046;
    }

    .project-detail-class .t8t-full-dialog .toolbar-container {
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }

    .project-detail-class .t8t-full-dialog .toolbar-container .toolbar-button {
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }

    .project-detail-class .t8t-full-dialog .toolbar-container .toolbar-button:hover {
        color: #1e3046;
        background-color: #d2deeb;
    }

    .project-detail-class .t8t-full-dialog .container-center {
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }

    .project-detail-class .t8t-full-dialog .el-form {
        display: flex;
        flex-wrap: wrap;
    }

    .project-detail-class .t8t-full-dialog .form-item-container {
        width: 25%;
    }

    .project-detail-class .t8t-full-dialog .full-dialog-form-container {
        margin-bottom: 10px;
    }

    .project-detail-class .t8t-full-dialog .full-dialog-form-container .el-form-item__content {
        width: 180px;
    }

    .project-detail-class .t8t-full-dialog .el-tabs {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .project-detail-class .t8t-full-dialog .full-dialog-tabs-container .el-tabs__item {
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }

    .project-detail-class .t8t-full-dialog .el-tabs__header {
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }

    .project-detail-class .t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar {
        height: 1px;
    }

    .project-detail-class .t8t-full-dialog .el-tabs__item+.el-tabs__item {
        border-left: 1px solid #d4dce7;
    }

    .project-detail-class .t8t-full-dialog .el-tabs__nav-wrap {
        width: 1220px;
        margin: 0 auto;
    }

    .project-detail-class .t8t-full-dialog .el-tabs__content {
        flex: 1;
        display: flex;
        /*        width: 1220px;
                margin: 0 auto;*/
    }

    .project-detail-class .t8t-full-dialog .el-tab-pane {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        overflow: auto;
    }
    /* 顶部tab */

    .project-detail-class .t8t-full-dialog .full-dialog-form-container .el-tabs__item {
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }

    .project-detail-class .t8t-full-dialog .full-dialog-form-container .el-tabs__header {
        border-top: 0;
        border-bottom: 0;
    }

    .project-detail-class .el-row {
        padding-left: 20px;
        width: 100%;
        margin-bottom: 20px;

        & :last-child {
            margin-bottom: 0;
        }
    }

    .project-detail-class .el-col {
        border-radius: 4px;
    }

    .project-detail-class .bg-purple-dark {
        background: #99a9bf;
    }

    .project-detail-class .bg-purple {
        background: #d3dce6;
    }

    .project-detail-class .bg-purple-light {
        background: #e5e9f2;
    }

    .project-detail-class .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .project-detail-class .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

    .project-detail-class .el-tabs__active-bar {
        height: 1px;
    }

    .project-detail-class .el-col .grid-content .el-button {
        margin-left: 10px;
    }

    .project-detail-class .project-detail .t8t-tree-container {
        margin: 0 30px;
        border-left: 1px solid #d4dce7;
        border-top: 1px solid #d4dce7;
    }

    .project-detail-class .t8t-full-dialog .top-hide {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1;
        transform: rotate(90deg);
        cursor: pointer;
    }

    .project-detail-class .t8t-full-dialog.isHide .top-hide {
        transform: rotate(-90deg);
    }

    .project-detail-class .t8t-full-dialog.isHide .full-dialog-form-container {
        height: 0;
        padding-top: 0;
        display: none;
    }
</style>