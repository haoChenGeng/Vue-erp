<template>
    <div v-loading.fullscreen.lock="fullscreenLoading">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            :showToggleBtn="false"
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
                    @DELETE="del"
                    @SAVE="save"
                    @RESTART="restart"
                    :disabledSymbols="disabledSymbols"
                    ref="toolbar"
                >
                </t8t-toolbar>
                <t8t-table
                    :columns="columns"
                    :service="service"
                    :method="method"
                    :args="args"
                    :pageBar="true"
                    :editable="true"
                    :templateData="templateData"
                    :commonData="commonData"
                    ref="t8tTable"
                    @selection-change="selectionChange"
                    @cell-click="handleCellClick"
                    @cell-form-item-change="handleInfoItemChange"
                    @row-double-click="showDetail"
                    @data-loaded="dataLoaded"
                >
                    <template slot="billCode" scope="scope">
                        <a href="javascript:;" @click="showDetail(scope.row)">{{scope.row['billCode']}}</a>
                    </template>
                </t8t-table>
            </div>
        </div>
    </div>
</template>

<script>
    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    import commonApi from 'src/services/commonApi/commonApi.js'
    export default {
        name: 'template-base',
        components: {
        },
        data () {
            return {
                fullscreenLoading: false,
                breadcrumbData: [{ title: '交付' },{ title: '项目执行' },{ title: '延期单' }],
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                disabledSymbols:['DELETE','SAVE'],
                //搜索表单项配置
                fields: [
                    {type: 'input',label: '项目ID',name: 'projectId'},
                    {type: 'input',label: '业主姓名',name: 'name_like'},
                    {type: 'input',label: '单据编码',name: 'billCode'},
                    {type: 'select',label: '单据状态',name: 'delayStatus', selectSourceKey:'status_arr',filterable:true}
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    status_arr: [
                        {
                            text: '审核中',
                            value: 0
                        },
                        {
                            text: '已生效',
                            value: 1
                        },
                        {
                            text: '已驳回',
                            value: 2
                        }
                    ]
                },
                columns:
                    [
                        { "prop": "billCode", "label": "单据编码" , "readonly": true},
                        { "prop": "productPkgId", "label": "产品包" , "readonly": true},
                        { "prop": "organizationName", "label": "组织","readonly": true },
                        { "prop": "projectId", "label": "项目ID", "required":true , "editor": {
                            'type': 'lookup',
                            'dataSource':[
                                {
                                    id: 23333,
                                    organizationName:'默认数据1',
                                },
                                {
                                    id: 666666,
                                    organizationName:'默认数据2',
                                },
                                {
                                    id: 88888888,
                                    organizationName:'默认数据3',
                                },
                                {
                                    id: 123456789,
                                    organizationName:'默认数据4',
                                },
                                {
                                    id:Math.floor(Math.random()*1000000),
                                    organizationName:'随机数据1',
                                },
                                {
                                    id:Math.floor(Math.random()*1000000),
                                    organizationName:'随机数据2',
                                },
                                {
                                    id:Math.floor(Math.random()*1000000),
                                    organizationName:'随机数据3',
                                },
                                {
                                    id:Math.floor(Math.random()*1000000),
                                    organizationName:'随机数据4',
                                },
                                {
                                    id:Math.floor(Math.random()*1000000),
                                    organizationName:'随机数据5',
                                },
                            ],
                            'columns': [{
                                'prop': 'id',
                                'label': '业主姓名'
                            }, {
                                'prop': 'organizationName',
                                'label': '项目地址'
                            }],
                            'valueExpr': 'id',
                            "filterMethod":function(val,args){
                                args = {

                                }
                                return Object.assign({},args)
                            },
                            "args": {
                            },
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }},
                        { "prop": "moduleStatus", "label": "业主姓名","readonly": true},
                        { "prop": "effectTime", "label": "项目经理姓名", "formatter": "dateParser","readonly": true},
                        { "prop": "name", "label": "项目经理电话","readonly": true},
                        { "prop": "firstNodeId", "label": "延迟的第一个节点", "required": true,
                            "formatter": this.getCellVal2,
                            "editor":{
                            "list":"_nodeList",
                            "filterable":true,
                            "type": "select",
                            "rules":[
                                {
                                    "required": true,
                                    "message": "不能为空"
                                }
                            ]
                        }},
                        { "prop": "delayDays", "label": "延期天数" ,"required": true, "editor":{
                            "type": "input",
                            "rules":[
                                {
                                    "pattern":/^\d+$/,
                                    "required": true,
                                    "message": "请填写一个正整数"
                                }
                            ]
                        }},
                        { "prop": "delayReason", "label": "延期原因", "required": true,"list":"delayReason" ,"editor":{
                            "filterable":true,
                            "type": "select",
                            "rules":[
                                {
                                    "required": true,
                                    "message": "请选择延期原因"
                                }
                            ]
                        }},
                        { "prop": "reasonDetail", "label": "描述","editor": {
                            "type": "input",
                            "rules": []
                        }},
                        { "prop": "delayStatus", "label": "状态", "readonly": true, "list": "status_arr" },
                        { "prop": "createTime", "label": "创建时间", "readonly": true,"formatter": "dateParser"},
                        { "prop": "verifyTime", "label": "审核时间","readonly": true, "formatter": "dateParser"},
                        { "prop": "createUserName", "label": "提交人" ,"readonly": true},
                        { "prop": "verifyUserName", "label": "审核人" ,"readonly": true}
                    ],
                templateData:{
                    "id":null,
                    "organizationId": null,
                    "projectId": null,
                    "firstNodeId":null,
                    "shutdownReason":null,
                    "reasonDetail": null
                },
                commonData: {
                    delayReason: [],
                    status_arr: [
                        {
                            text: '审核中',
                            value: 0
                        },
                        {
                            text: '已生效',
                            value: 1
                        },
                        {
                            text: '已驳回',
                            value: 2
                        }
                    ],
                    nodeList:[],
                    _nodeList:[
                    ]
                },
                service: Service.YANSHOU.name,
                method:  Service.YANSHOU.methods.projectDelayBillQueryPage,
                args: { sort: ["id_desc"]},
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                dialogTitle : '',
                tableData: [],
                selectedRows:[],
                allNodeList:{}
            }
        },
        created (){

            let arg =  {
                page: 1,
                search: {
                    pPropertyCode: 41105
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
                        this.commonData.delayReason = list;
                    }
            });

            TemplateOperator.queryTreeByType({typeCodes:['001003006']}).then((res) => {
                if(res.data.status === 200){
                    this.treeData = [res.data.result];
                }
            })
        },
        methods: {
            //搜素
            submitSearch(obj) {
                //重置行记录状态
                this.args = { search: obj }
                this.$refs['t8tTable'].resetActionLog();
                this.initDisabledSymbols();
            },
            onTreeClick (nodeData){
                //重置行记录状态
                this.args = {page:1, size:20, search: { organizationId: nodeData.id }}
                this.$refs['t8tTable'].resetActionLog();
                this.initDisabledSymbols();
            },
            getCellVal2(val,row){
                if(row.id){
                    return row.firstNodeName;
                } else {
                    let projectId = row.projectId;
                    if(projectId){
                        let list = this.allNodeList[projectId] ? this.allNodeList[projectId] : [];
                        if(list.length > 0){
                            let item = list.filter((item) => item.value == val);
                            if(item.length > 0){
                                return item[0].text;
                            }
                        }
                    }
                }
            },
            getNode(projectId){
                if(!projectId){
                    return;
                }
                //this.commonData.nodeList = [];
                let args = {
                    "search": {
                        "projectId": projectId,
                        "nodeStatus_in":[0,1]
                    },
                    "sort": [
                        "predictCompleteTime_asc"
                    ],
                    "page": 1,
                    "size": 500
                };
                let list = [];
                TemplateOperator.projectDetailList(args).then((res)=>{
                    if(res.data.status === 200){
                        res.data.result.rows.forEach((item,index)=>{
                            list.push({
                                text: item.nodeTypeName,
                                value: item.id
                            })
                        });
                        //this.commonData.nodeList = list;
                    }
                })
                return list;
            },
            //查看详情
            showDetail: function(row){
                if(!row.id){
                    return false;
                }
                this.$router.push({
                    path: '/tuchat-delivery/delay-detail',
                    query:{
                        billCode: row.billCode
                    }
                })
            },
            add () {
                this.$refs['t8tTable'].addNewRow()
                this.$refs['toolbar'].unDisableBySymbol('SAVE');
            },
            del(){
                this.$refs['t8tTable'].delRows()
                let rows =  this.$refs['t8tTable'].getActionLog(false);
                if(rows.addedRows.length === 0){
                    this.$refs['toolbar'].disableBySymbol('SAVE');
                }
            },
            save(){
                this.$refs['t8tTable'].validate((isValid) => {
                   if(isValid){
                       let rows =  this.$refs['t8tTable'].getActionLog(false);
                       let createList = [];
                       let createUser = +Cookie.get('t8t-tc-uid');
                       rows.addedRows.forEach(function(item,index){
                           createList.push({
                               organizationId: 14, //todo 暂时硬编码
                               projectId: +item.projectId,
                               productPkgId: 1,
                               bizTypeId: 663,
                               firstNodeId: +item.firstNodeId,
                               delayDays: +item.delayDays,
                               delayReason: +item.delayReason,
                               reasonDetail: item.reasonDetail,
                               createUser:createUser
                           })
                       });
                       if(createList.length > 0){
                           this.fullscreenLoading = true;
                           TemplateOperator.projectDelayBillSave({createList: createList}).then((res) => {
                               this.fullscreenLoading = false;
                               if (res.data.status === 200) {
                                   this.$message({
                                       type: 'success',
                                       message: '保存成功！'
                                   });
                                   //重置行记录状态
                                   this.$refs['t8tTable'].getActionLog(true);
                                   this.getTableData();
                               }else{
                                   if(res.data.status == 41527){
                                       this.$message({
                                           type: 'error',
                                           message: '入库失败！'
                                       })
                                   }else{
                                       this.$message({
                                           type: 'error',
                                           message: res.data.message ? res.data.message : '保存失败！'
                                       })
                                   }
                               }
                           })
                       }else{
                           this.$message({
                               type: 'error',
                               message: '请先新增一行！'
                           });
                       }
                   }
                });
            },
            restart(){
                let selections =  this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择需要操作的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行操作！')
                } else{
                    TemplateOperator.projectShutdownRestart({id: selections[0].id, restartUser: +Cookie.get('t8t-tc-uid')}).then((res) => {
                        if(res.data.status === 200){
                            this.$message({
                                type: 'success',
                                message: '复工成功！'
                            })
                            this.getTableData();
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.data.message ? res.data.message : '复工失败！'
                            })
                        }
                    })
                }
            },
            //表格
            getTableData() {
                //按钮初始化
                this.initDisabledSymbols();
                this.$refs['t8tTable'].reloadTable()
            },
            //行变化事件
            selectionChange (rows){
                //已选择行
                this.selectedRows = rows;
                //启用禁用按钮交互
                let delStatus = false;
                if(rows.length > 0){
                    for(let i in rows){
                        if(rows[i].id > 0){
                            delStatus = true;
                        }
                    }
                }else{
                    delStatus = true;
                }
                if(delStatus){
                    this.$refs['toolbar'].disableBySymbol('DELETE');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('DELETE');
                }
            },
            handleCellClick(row, column, cell, event){
                if(typeof row.id !== 'undefined' && row.id > 0){
                    this.$refs['t8tTable'].handleFormItemBlur()
                }else if(column.property == 'firstNodeId'){
                    row.firstNodeId = null;
                    let projectId = row.projectId;
                    if(projectId){
                        //this.getNode(projectId);
                        this.commonData._nodeList = this.allNodeList[projectId] ? this.allNodeList[projectId] : [];
                    }else{
                        this.$refs['t8tTable'].handleFormItemBlur();
                        this.commonData._nodeList = [];
                        this.$message.error('请先选择项目ID！');
                    }
                }
            },
            handleInfoItemChange(cell,val){
                if(cell.column.property == "projectId"){
                    cell.row.projectId = typeof val === 'object' ? val.id : val;
                    val = cell.row.projectId;
                    cell.row.firstNodeId = null;
                    if(typeof this.allNodeList[val] === 'undefined'){
                        this.allNodeList[val] = this.getNode(val);
                    }
                }else if(cell.column.property == "firstNodeId"){
                    /*let res = this.commonData.nodeList.some((item)=>{
                        return item.value == val;
                    });
                    if(!res){
                        let result = this.allNodeList[cell.row.projectId].filter((item)=>{
                           return item.value == val;
                        });
                        this.commonData.nodeList.push({text:result[0].text,value:val})
                    }*/
                }
            },
            initDisabledSymbols(){
                this.$refs['toolbar'].disableBySymbol('DELETE');
                this.$refs['toolbar'].disableBySymbol('SAVE');
            }
        }
    }
</script>
