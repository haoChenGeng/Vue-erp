<template>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
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
                     <el-tabs v-model="tab_info" @tab-click="handleClick">
                         <el-tab-pane label="基本信息" name="base">
                             <el-row :gutter="20">
                                 <el-col :span="4">
                                     <div class="grid-content">ID：</div>
                                 </el-col>
                                 <el-col :span="8">
                                     <div class="grid-content">{{detailInfo.id}}</div>
                                 </el-col>
                                 <el-col :span="4">
                                     <div class="grid-content">名称：</div>
                                 </el-col>
                                 <el-col :span="8">
                                     <div class="grid-content">{{detailInfo.name}}</div>
                                 </el-col>
                                 <el-col :span="4">
                                     <div class="grid-content">内部工期：</div>
                                 </el-col>
                                 <el-col :span="8">
                                     <div class="grid-content">{{detailInfo.insideSchdule}}天</div>
                                 </el-col>
                                 <el-col :span="4">
                                     <div class="grid-content">外部工期：</div>
                                 </el-col>
                                 <el-col :span="8">
                                     <div class="grid-content">{{detailInfo.outsideSchdule}}天</div>
                                 </el-col>
                                 <el-col :span="4">
                                     <div class="grid-content">节点总数：</div>
                                 </el-col>
                                 <el-col :span="8">
                                     <div class="grid-content">{{detailInfo.nodeNumber}}个</div>
                                 </el-col>
                                 <el-col :span="4">
                                     <div class="grid-content">状态：</div>
                                 </el-col>
                                 <el-col :span="8">
                                     <div class="grid-content">{{detailInfo.moduleStatus == 1 ? '启用' : '禁用'}}</div>
                                 </el-col>
                             </el-row>
                         </el-tab-pane>
                         <el-tab-pane label="编辑信息" name="other">
                             <el-row :gutter="20">
                                 <el-col :span="5">
                                     <div class="grid-content">创建人：</div>
                                 </el-col>
                                 <el-col :span="7">
                                     <div class="grid-content">{{detailInfo.createUserName}}</div>
                                 </el-col>
                                 <el-col :span="5">
                                     <div class="grid-content">创建时间：</div>
                                 </el-col>
                                 <el-col :span="7">
                                     <div class="grid-content">{{detailInfo.createTime | dateParser}}</div>
                                 </el-col>
                                 <el-col :span="5">
                                     <div class="grid-content">最后变更人：</div>
                                 </el-col>
                                 <el-col :span="7">
                                     <div class="grid-content">{{detailInfo.updateUserName}}</div>
                                 </el-col>
                                 <el-col :span="5">
                                     <div class="grid-content">最后变更时间：</div>
                                 </el-col>
                                 <el-col :span="7">
                                     <div class="grid-content">{{detailInfo.updateTime | dateParser}}</div>
                                 </el-col>
                             </el-row>
                         </el-tab-pane>
                     </el-tabs>
                 </div>
                 <div class="full-dialog-tabs-container">
                     <el-tabs v-model="tab_list" @tab-click="handleClick">
                         <el-tab-pane label="节点信息" name="attr">

                                 <div class="g-main-container">
                                     <t8t-tree
                                         ref="my-tree"
                                         :data="treeData"
                                         :props="treeProps"
                                         :default-expanded-keys="[1]"
                                         @node-click="onTreeClick"
                                     >
                                     </t8t-tree>
                                     <div class="g-main-container-column">
                                         <div class="my-toolbar">
                                             <div class="btn-container">
                                                 <el-button
                                                     type="primary"
                                                     size="small"
                                                     icon="plus"
                                                     @click="addNode"
                                                 >新增节点
                                                 </el-button>
                                                 <el-button
                                                     type="danger"
                                                     size="small"
                                                     icon="close"
                                                     @click="delNode"
                                                 >删除节点
                                                 </el-button>
                                                 <el-button
                                                     type="primary"
                                                     size="small"
                                                     class="el-icon-check"
                                                     @click="saveNode"
                                                 > 保存
                                                 </el-button>
                                             </div>
                                         </div>
                                         <t8t-table
                                             ref="infoTable"
                                             :columns="infoColumns"
                                             :service="infoService"
                                             :method="infoMethod"
                                             :args="infoArgs"
                                             :isLoading="isLoading"
                                             :commonData="commonOptionsConfig"
                                             :templateData="infoTemplateData"
                                             :pageBar="true"
                                             :editable="true"
                                             @selection-change="selectionChange"
                                             @cell-form-item-change="handleInfoItemChange"
                                             @cell-click="handleCellClick"
                                         >
                                             <template slot="id" scope="scope">
                                                 <a href="javascript:;"
                                                    @click="showDetail(scope.row['id'],scope.row['nodeTypeName'])">{{scope.row['id']}}</a>
                                             </template>
                                         </t8t-table>
                                     </div>
                                 </div>

                         </el-tab-pane>
                         <el-tab-pane label="节点关系" name="relation">

                                 <div class="my-toolbar">
                                     <el-button
                                         type="primary"
                                         size="small"
                                         icon="plus"
                                         @click="addNodeRel"
                                     >新增关系


                                     </el-button>
                                     <el-button
                                         type="danger"
                                         size="small"
                                         icon="close"
                                         @click="delNodeRel"
                                     >删除关系


                                     </el-button>
                                     <el-button
                                         type="primary"
                                         size="small"
                                         class="el-icon-check"
                                         @click="saveNodeRel"
                                     >保存关系


                                     </el-button>
                                 </div>
                                 <t8t-table
                                     ref="relNodeTable"
                                     :columns="relationColumns"
                                     :templateData="relationTmpData"
                                     :service="relationService"
                                     :method="relationMethod"
                                     :args="relationArgs"
                                     :pageBar="true"
                                     :editable="true"
                                     :commonData="commonOptionsConfig"
                                     @cell-form-item-change="nodeRelRowChange"
                                 >
                                 </t8t-table>

                         </el-tab-pane>
                         <el-tab-pane label="引用关系" name="reference">
                             <t8t-table
                                 :style="{marginTop:'15px'}"
                                 :selectCol="false"
                                 ref="relationTable"
                                 :columns="referenceColumns"
                                 :service="referenceService"
                                 :method="referenceMethod"
                                 :args="referenceArgs"
                                 :pageBar="true"
                                 :commonData="commonOptionsConfig"
                             >
                             </t8t-table>
                         </el-tab-pane>
                     </el-tabs>
                 </div>
             </div>
         </div>
     </el-dialog>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    //import T8tDatePicker from 'src/components/t8t-form/dateTimePicker.vue'
    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    export default {
        name: 'template-detail',
        data() {
            return {
                tab_info: 'base',
                tab_list: 'attr',
                isDialogShow: true,
                isLoading: false,
                isTopHide: false,
                detailInfo: {
                    createTime: '',
                    createUser: '',
                    createUserName: '',
                    effectTime: '',
                    id: '',
                    insideSchdule: '',
                    moduleStatus: '',
                    name: '',
                    nodeNumber: '',
                    outsideSchdule: '',
                    updateTime: '',
                    updateUser: '',
                    updateUserName: ''
                },
                treeData: [],
                treeProps: {
                    label: 'nodeTypeName',
                    children: 'children'
                },
                infoColumns: [
                    {
                        "prop": "id",
                        "label": "ID"
                    },
                    {
                        "prop": "lineNo",
                        "label": "行号",
                        "editor": {
                            "type": "input",
                            "rules": [{
                                "pattern": /^\d+$/,
                                "required": true,
                                "message": "行号不能为空且只能是正整数"
                            }]
                        }
                    },
                    {
                        "prop": "nodeType",
                        "label": "类型",
                        "list": "nodeType",
                        "editor": {
                            "type": "select",
                            "filterable": true,
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "parentId",
                        "label": "父节点ID"
                    },
                    {
                        "prop": "parentId",
                        "label": "父节点类型",
                        "list": "nodeList",
                        "editor": {
                            "type": "select",
                            "filterable": true,
                            "showDetail": true,
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "relationType",
                        "label": "父子关系类型",
                        "list": "relationType",
                        "editor": {
                            "type": "select",
                            "filterable": true,
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "lastNode",
                        "label": "是否为末级",
                        "list": "isLast",
                        "editor": {
                            "type": "select",
                            "filterable": true,
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "billType",
                        "label": "单据类型",
                        "list": "billType",
                        "editor": {
                            "type": "select",
                            "filterable": true
                        }
                    },
                    {
                        "prop": "createMoment",
                        "label": "创建时机",
                        "list": "createMoment",
                        "editor": {
                            "type": "select",
                            "filterable": true,
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "esmModelId",
                        "label": "合同模板",
                        "list": "esmModelList",
                        "editor": {
                            "type": "select",
                            "filterable": true
                        }
                    },
                    {
                        "prop": "offset",
                        "label": "偏移量",
                        "editor": {
                            "type": "input",
                            "rules": [{
                                "pattern": /^\d+$/,
                                "required": true,
                                "message": "偏移量不能为空且只能是正整数"
                            }]
                        }
                    },
                    {
                        "prop": "itemStatus",
                        "label": "状态",
                        "list": "itemStatus",
                        "editor": {
                            "type": "select",
                            "filterable": true,
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "effectTime",
                        "label": "生效日期",
                        "formatter": this.dateParser,
                        "editor": {
                            "type": "date",
                            "endFormater": 'timestamp',
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "wkfCreateUrl",
                        "label": "处理页面url",
                        "editor": {
                            "type": "input",
                            "rules": [{
                                "type": 'url',
                                "message": "请输入合法的url"
                            }]
                        }
                    },
                    {
                        prop: "dutyRoleCode",
                        label: "责任角色编码",
                        show: false
                    },
                    {
                        prop: "dutyRoleName",
                        label: "责任角色",
                        editor:{
                            type: 'lookup',
                            service: 'S-QiYaG_GRJx7l-upQPNsZjZ2bUQLL4', // /biz/t8t-sys-pem/app
                            method: '4UaXLL-ZYHv0A.i', // role.list
                            args:{ page:1, size: 20, condition: { isDel: 0 } },
                            columns: [
                                {
                                    prop: 'code',
                                    label: '角色编码',
                                },
                                {
                                    prop: 'name',
                                    label: '角色名称'
                                }
                            ],
                            placeholder: '责任角色',
                            rules:[],
                            filterMethod:(val,args)=>{
                                args['condition'] = {
                                    'isDel': 0,
                                    'name': val
                                }
                                return args
                            }
                        },
                        onChange(val,row,col,table){
                            table.$nextTick(() => {
                                row.dutyRoleCode = val.code;
                                row.dutyRoleName = val.name;
                            })
                        }
                    },
                    {
                        "prop": "dutyType",
                        "label": "责任角色类型",
                        "list": "dutyType",
                        "editor": {
                            "type": "select",
                            "filterable": true,
                            "rules": [{
                                "required": false,
                                "message": "不能为空"
                            }]
                        }
                    }
                ],
                infoTemplateData: {
                    "id": null,
                    "nodeType": null,
                    "parentId": null,
                    "parentNodeTypeName": null,
                    "relationType": null,
                    "lastNode": null,
                    "billType": null,
                    "createMoment": null,
                    "esmModelList": null,
                    "offset": "",
                    "itemStatus": null,
                    "effectTime": null
                },
                relationColumns: [
                    {"prop": "id", "label": "ID"},
                    {"prop": "headId", "label": "头节点ID"},
                    {
                        "prop": "headId",
                        "label": "头节点类型",
                        "list": "refNodeList",
                        "editor": {
                            "type": "select",
                            "filterable": true,
                            "showDetail": true
                        }
                    },
                    {"prop": "tailId", "label": "尾节点ID"},
                    {
                        "prop": "tailId",
                        "label": "尾节点类型",
                        "list": "refNodeList",
                        "editor": {
                            "type": "select",
                            "filterable": true,
                            "showDetail": true
                        }
                    },
                    {
                        "prop": "advance", "label": "提前量", editor: {
                        type: 'input',
                        rules: [{
                            pattern: /^[0-9]*$/,
                            required: true,
                            message: "请填写正确的提前量"
                        }]
                    }
                    },
                    {
                        "prop": "relationType",
                        "label": "关系类型",
                        "list": "nodeRelTypes",
                        "editor": {
                            type: 'select',
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "关系类型不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "relationStatus", "label": "启用状态", "list": "nodeRelStatus", editor: {
                        type: 'select',
                        rules: [{
                            required: true,
                            message: "启用状态不能为空"
                        }]
                    }
                    }, {
                        "prop": "triggerType", "label": "触发类型", "list": "triggerTypes", editor: {
                            type: 'select',
                            rules: [{
                                required: true,
                                message: "触发类型不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "effectTime", "label": "生效日期", "formatter": this.dateParser, editor: {
                        type: 'date', endFormater: 'timestamp',
                        rules: [{
                            required: true,
                            message: "生效日期不能为空"
                        }]
                    }
                    }
                ],
                relationTmpData: {
                    id: null,
                    headId: null,
                    headNodeTypeName: null,
                    tailId: null,
                    tailNodeTypeName: null,
                    advance: null,
                    relationType: null,
                    relationStatus: null,
                    triggerType: null,
                    effectTime: null

                },
                referenceColumns: [
                    {"prop": "scheduleId", "label": "排期模板ID"},
                    {"prop": "scheduleId", "label": "排期模板名称", "list": "scheduleInfo"},
                    {"prop": "quotationId", "label": "报价模板ID"},
                    {"prop": "quotationName", "label": "报价模板名称"},
                    {"prop": "quotationStatus", "label": "报价模板状态", "list": "mouldStatus"},
                    {"prop": "quotationEffectime", "label": "报价模板生效日期", "formatter": this.dateParser}
                ],
                commonOptionsConfig: {
                    nodeType: [], // 类型
                    nodeList: [],
                    refNodeList: [],
                    relationType: [], //父子关系类型
                    isLast: [
                        {value: 1, text: '是'},
                        {value: 0, text: '否'}
                    ], //是否为末级
                    createMoment: [], //创建时机
                    esmModelList: [],//合同模板
                    billType: [], //单据类型
                    itemStatus: [
                        {value: 1, text: '启用'},
                        {value: 0, text: '禁用'}
                    ], //行状态
                    nodeRelStatus: [
                        {
                            value: 0,
                            text: '禁用',
                        }, {
                            value: 1,
                            text: '启用',
                        }
                    ],
                    triggerTypes: [
                        {
                            value: 0,
                            text: '手动',
                        }, {
                            value: 1,
                            text: '自动',
                        }
                    ],
                    nodeRelTypes: [],
                    scheduleInfo: [{
                        text: this.$route.query.name,
                        value: Number.parseInt(this.$route.query.id)
                    }
                    ],
                    dutyType:[], //责任角色类型
                    mouldStatus:[
                        {
                            text:'待启用',
                            value:0
                        },
                        {
                            text:'审核中',
                            value:1
                        },
                        {
                            text:'已启用',
                            value:2
                        },
                        {
                            text:'已驳回',
                            value:3
                        }
                    ]
                },
                infoService: Service.TEMPLATE.name,
                infoMethod: Service.TEMPLATE.methods.queryPageModeuleItemByNode,
                infoArgs: {moduleId: this.$route.query.id, sort:["lineNo_asc"]},
                infoSelectedRows: [],
                relationService: Service.TEMPLATE.name,
                relationArgs: {search: {moduleId_eq: this.$route.query.id}},
                relationMethod: Service.TEMPLATE.methods.NodeRelation,
                referenceService: Service.TEMPLATE.name,
                referenceMethod: Service.TEMPLATE.methods.referenceRelation,
                referenceArgs: {moduleId: this.$route.query.id},
                nodeList: []

            };
        },
        created (){
            TemplateOperator.queryTreeBySchduleModule({moduleId: this.$route.query.id}).then((res) => {
                if (res.data.status === 200) {
                    this.treeData = res.data.result;
                }
            });
            TemplateOperator.queryEsmModelNameList({search : {state: 1}}).then((res) => {
                if (res.data.status === 200) {
//                    this.esmModelList = res.data.result;
                    let list = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        list.push({text: rows[i]['contractName'], value: rows[i]['id']});
                    }
                    this.commonOptionsConfig.esmModelList = list;
                }
            });

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
            TemplateOperator.getById({id: this.$route.query.id})
                .then((res) => {
                    if (res.data.status === 200) {
                        this.detailInfo = res.data.result
                    }
                });
            this.getCommonOptions('41101', 'nodeType');
            this.getCommonOptions('41102', 'relationType');
            this.getCommonOptions('41103', 'createMoment');
            this.getCommonOptions('11605', 'billType');
            this.getCommonOptions('41104', 'nodeRelTypes');
            this.getCommonOptions('41107', 'dutyType');
            this.getNodeList(this.$route.query.id);
        },
        filters: {
            dateParser(text) {
                let dateString;
                if (!text) {
                    dateString = ""
                } else {
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
            handleClick(tab, event) {
            },
            onTopHide() {
                this.isTopHide = !this.isTopHide
            },
            dateParser(text) {
                let dateString;
                if (!text) {
                    dateString = ""
                } else {
                    let objDate = new Date(text * 1000);
                    dateString = DateUtils(objDate, 'yyyy-mm-dd')
                }
                return dateString
            },
            handleInfoItemChange(cell, val){
                if (cell.column.property == "lastNode") {
                    if (val == 0) {
                        cell.row.billType = null;
                    } else {
                        if (!cell.row.billType) {
                            cell.row.billType = 0;
                        }
                    }
                }
                if (cell.column.property == "parentId") {
                    if (val == 0) {
                        cell.row['relationType'] = null;
                    } else {
                        if (!cell.row['relationType']) {
                            cell.row['relationType'] = 0;
                        }
                    }
                }
            },
            handleCellClick(row, column, cell, event){
                if (column.property == "parentId") {
                    let id = row.id;
                    let nodeList = this.commonOptionsConfig.nodeList;
                    for (let i in nodeList) {
                        if (nodeList[i]['value'] == id) {
                            this.commonOptionsConfig.nodeList[i]['disabled'] = true;
                        } else {
                            this.commonOptionsConfig.nodeList[i]['disabled'] = false;
                        }
                    }
                }
                if (column.property == "billType" && !row.lastNode) {
                    this.$refs['infoTable'].handleFormItemBlur()
                }
                if (column.property == "relationType" && row.parentId == 0) {
                    this.$refs['infoTable'].handleFormItemBlur()
                }
            },
            //辅助资料
            getCommonOptions: function (fatherCode, selectName, default_options) {
                let arg = {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode,
                        propertyStatus: 1
                    },
                    size: 200
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                // if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                // }
                            });
                            this.commonOptionsConfig[selectName] = list;
                            this.commonOptionsConfig[selectName].unshift({value: 0, text: '请选择'});
                            let type = typeof default_options;
                            if (type !== undefined && type !== null && type === 'object') {
                                this.commonOptionsConfig[selectName].unshift(default_options);
                            }
                        }
                    })
            },

            //行变化事件
            selectionChange (rows){
                //已选择行
                this.infoSelectedRows = rows;
            },
            addNode() {
                this.$refs['infoTable'].addNewRow()
            },
            delNode() {
                if (this.infoSelectedRows.length > 0) {
                    for (let i in this.infoSelectedRows) {
                        if (this.infoSelectedRows[i].id) {
                            this.$message.error('已保存的节点不能被删除！')
                            return false;
                        }
                    }
                    this.$refs['infoTable'].delRows()
                } else {
                    this.$message.error('请选择需要删除的节点！')
                }
            },
            saveNode() {
                let rows = this.$refs['infoTable'].getActionLog(false,true);
                let data = {};
                data.addModuleItems = this.formatRowData(rows.addedRows);
                data.updateModuleItems = this.formatRowData(rows.editedRows);
                this.$refs['infoTable'].validate((isValid) => {
                    if (isValid && data.addModuleItems && data.updateModuleItems) {
                        this.isLoading = true;
                        TemplateOperator.moduleItemSave(data)
                            .then((res) => {
                                if (res.data.status === 200) {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '保存成功！',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    }, function () {
                                        //this.reloadTable('infoTable');

                                    });
                                    this.isLoading = false;
                                    //重置行记录状态
                                    this.$refs['infoTable'].getActionLog(true);
                                    //更新节点总数
                                    if (data.addModuleItems.length) {
                                        this.detailInfo.nodeNumber += data.addModuleItems.length;
                                    }
                                    //更新节点列表
                                    this.getNodeList(this.$route.query.id);
                                    this.$refs['infoTable'].reloadTable();

                                    TemplateOperator.queryTreeBySchduleModule({moduleId: this.$route.query.id}).then((res) => {
                                        if (res.data.status === 200) {
                                            this.treeData = res.data.result;
                                        }
                                    });

                                } else {
                                    let errorMessage = res.data.message;
                                    if (res.data.status == 40527) {
                                        errorMessage += "，" + res.data.result;
                                    }
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: errorMessage,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    });
                                    this.isLoading = false;
                                }
                            });
                    }
                });
            },
            formatRowData (rowData){

                for (let i in rowData) {
                    if (rowData[i].parentId == '') {
                        rowData[i].parentId = 0;
                    } else {
                        rowData[i].parentId = +rowData[i].parentId;
                    }
                    if (rowData[i].relationType == '') {
                        rowData[i].relationType = 0;
                    } else {
                        rowData[i].relationType = +rowData[i].relationType;
                    }
                    if (rowData[i].billType == '') {
                        rowData[i].billType = 0;
                    } else {
                        rowData[i].billType = +rowData[i].billType;
                    }
                    rowData[i].updateUser = +Cookie.get('t8t-tc-uid');
                    if (rowData[i].id) {

                    } else {
                        rowData[i].moduleId = this.$route.query.id;
                        rowData[i].createUser = +Cookie.get('t8t-tc-uid');
                    }
                    if (rowData[i].lastNode == 1 && !rowData[i].billType) {
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '末级节点必须添加单据类型！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                        return false;
                    }
                    if (rowData[i].lastNode == 0 && rowData[i].billType) {
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '非末级节点不能添加单据类型！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                        return false;
                    }
                }
                return rowData;
            },
            addNodeRel(){
                this.$refs['relNodeTable'].addNewRow()
            },
            delNodeRel(){
                if (this.$refs['relNodeTable'].selectedRows.length < 1) {
                    this.$message.error('请选择需要删除的关系！')
                }
                let flage = true;
                this.$refs['relNodeTable'].selectedRows.forEach((item) => {
                    if (typeof(item.id) !== 'undefined' && item.id > 0) {
                        this.$message.error('已保存的节点不能被删除！')
                        flage = false;
                    }
                })

                if (flage) this.$refs['relNodeTable'].delRows()
            },
            getNodeList(moduleId){
                let args = {
                    search: {moduleId_eq: Number.parseInt(moduleId)},
                    fields: ['id', 'nodeTypeName', 'nodeType', 'lastNode', 'esmModelId'],
                    page: 1,
                    size: 500
                }
                axios({
                    method: Service.TEMPLATE.methods.moduleItemQueryPage,
                    service: Service.TEMPLATE.name,
                    args: args
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.nodeList = [];
                        this.commonOptionsConfig.nodeList = [{value: 0, text: '无'}];
                        this.commonOptionsConfig.refNodeList = [{value: 0, text: '无'}];
                        let list = res.data.result.rows;
                        list.forEach((item) => {
                            let refNode = {
                                value: item.id,
                                text: item.nodeTypeName
                            };
                            this.commonOptionsConfig.refNodeList.push(refNode);
                            if (item.lastNode != 1) {
                                let node = {
                                    value: item.id,
                                    text: item.nodeTypeName
                                };
                                this.commonOptionsConfig.nodeList.push(node);
                            }
                        });
                    }
                })
            },
            nodeRelRowChange(cell, val){
            },
            saveNodeRel(){
                let list = this.$refs['relNodeTable'].dataSource
                let addItems = []
                let udpItems = []
                if (!Number.isFinite(Number(this.$route.query.id))) {
                    this.$message.error('模板排期不存在')
                    return
                }
                this.$refs['relNodeTable'].validate((isValid) => {
                    if (isValid) {
                        let flage = true
                        list.forEach((item, i) => {
                            if (Number.isNaN(Number(item.headId)) || item.headId === null) {
                                this.$message.error(`第${i + 1}行头结点不能为空！`)
                                flage = false
                                return
                            }
                            if (Number.isNaN(Number(item.tailId)) || item.tailId === null) {
                                this.$message.error(`第${i + 1}行尾结点不能为空！`)
                                flage = false
                                return
                            }
                            if (!flage) return
                            // item.effectTime = Number.isFinite(item.effectTime) ?
                            //      item.effectTime :
                            //      +Date.parse(item.effectTime).toString().substr(0,10);
                            if (item.id == null) {

                                addItems.push({     //新增列表
                                    "moduleId": this.$route.query.id,
                                    "headId": item.headId,
                                    "tailId": item.tailId,
                                    "advance": item.advance,
                                    "relationType": item.relationType,
                                    "createUser": Cookie.get('t8t-tc-uid'),
                                    "relationStatus": item.relationStatus,
                                    "triggerType": item.triggerType,
                                    "effectTime": item.effectTime,
                                })
                            } else {
                                udpItems.push({
                                    "moduleId": this.$route.query.id,
                                    "id": item.id,
                                    "headId": item.headId,
                                    "tailId": item.tailId,
                                    "advance": item.advance,
                                    "relationType": item.relationType,
                                    "updateUser": Cookie.get('t8t-tc-uid'),
                                    "relationStatus": item.relationStatus,
                                    "triggerType": item.triggerType,
                                    "effectTime": item.effectTime,
                                })
                            }


                        })
                        if (!flage || (udpItems.length < 1 && addItems.length < 1)) return;
                        let args = {
                            "addItemRelations": addItems,
                            "updateItemRelations": udpItems
                        }

                        axios({
                            method: Service.TEMPLATE.methods.NodeRelationSave,
                            service: Service.TEMPLATE.name,
                            args: args
                        }).then((res) => {
                            if (res.data.status === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功！'
                                });
                                this.$refs['relNodeTable'].reloadTable()
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.message
                                })
                            }
                        })
                    }
                })

            },
            //查看详情
            showDetail: function (id, nodeType) {
                this.$router.push({
                    path: '/delivery/node-attribute',
                    query: {id: id, nodeType: nodeType}
                })
            },
            //点击树节点
            onTreeClick(data) {
                this.nodeId = data.id;
                this.infoArgs = {moduleId: this.$route.query.id, nodeId: this.nodeId, sort:["lineNo_asc"]};
            }
        }
    };

</script>

<style lang="css" scoped>
    .t8t-full-dialog2 .my-toolbar {
        margin-bottom: 15px;
        margin-left: 30px;
        margin-top: 12px;
    }
    .el-row {
        padding-left: 20px;
        padding-top: 20px;
        width: 600px;

    &
    :last-child {
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

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
</style>

