<template>
    <div>
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
                breadcrumbData: [{ title: '交付' },{ title: '项目执行' },{ title: '停工单' }],
                treeData: [],
                disabledSymbols:['DELETE','SAVE'],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                //搜索表单项配置
                fields: [
                    {type: 'input',label: '项目ID',name: 'projectId'},
                    {type: 'input',label: '业主姓名',name: 'name_like'},
                    {type: 'input',label: '单据编码',name: 'billCode'},
                    {type: 'select',label: '单据状态',name: 'shutdownStatus', selectSourceKey:'status_arr',filterable:true}
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    status_arr: [
                        {
                            text: '审核中',
                            value: 0
                        },
                        {
                            text: '已停工',
                            value: 1
                        },
                        {
                            text: '已驳回',
                            value: 2
                        },
                        {
                            text: '已复工',
                            value: 3
                        }
                    ],
                    quotations: [] //报价模板list
                },
                columns:
                    [
                        { "prop": "billCode", "label": "单据编码" , "readonly": true},
                        { "prop": "name", "label": "产品包", "readonly":true},
                        { "prop": "organizationName", "label": "组织", "readonly":true},
                        { "prop": "projectId", "label": "项目ID", "required":true ,"editor": {
                            'type': 'lookup',
                            'dataSource':[
                                {
                                    id:Math.floor(Math.random()*1000000),
                                    organizationName:'测试数据1',
                                },
                                {
                                    id:Math.floor(Math.random()*1000000),
                                    organizationName:'测试数据2',
                                },
                                {
                                    id:Math.floor(Math.random()*1000000),
                                    organizationName:'测试数据3',
                                },
                                {
                                    id:Math.floor(Math.random()*1000000),
                                    organizationName:'测试数据4',
                                },
                                {
                                    id:Math.floor(Math.random()*1000000),
                                    organizationName:'测试数据5',
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
                        { "prop": "moduleStatus", "label": "业主姓名","readonly":true},
                        { "prop": "effectTime", "label": "项目经理姓名", "formatter": "dateParser","readonly": true},
                        { "prop": "name", "label": "项目经理电话", "readonly":true},
                        { "prop": "shutdownReason", "label": "停工原因", "list": "shutdownReason","required":true, "editor": {
                            "type": "select",
                            "filterable":true,
                            "rules": [{
                                "required": true,
                                "message": "请选择停工原因"
                            }]
                        }},
                        { "prop": "reasonDetail", "label": "描述","editor": {
                            "type": "input",
                            "rules": []
                        }},
                        { "prop": "shutdownStatus", "label": "状态", "list": "status_arr","readonly":true },
                        { "prop": "createTime", "label": "创建时间", "formatter": "dateParser","readonly":true},
                        { "prop": "verifyTime", "label": "审核时间", "formatter": "dateParser","readonly":true},
                        { "prop": "restartTime", "label": "复工时间", "formatter": "dateParser","readonly":true},
                        { "prop": "createUserName", "label": "提交人", "readonly":true},
                        { "prop": "verifyUserName", "label": "审核人", "readonly":true},
                        { "prop": "restartUserName", "label": "复工人", "readonly":true},
                    ],
                templateData:{
                    "id":null,
                    "organizationId": null,
                    "projectId": null,
                    "shutdownReason":null,
                    "reasonDetail": null
                },
                commonData: {
                    shutdownReason: [],
                    status_arr: [
                        {
                            text: '审核中',
                            value: 0
                        },
                        {
                            text: '已停工',
                            value: 1
                        },
                        {
                            text: '已驳回',
                            value: 2
                        },
                        {
                            text: '已复工',
                            value: 3
                        }
                    ],
                },
                service: Service.YANSHOU.name,
                method:  Service.YANSHOU.methods.projectShutdownQueryPage,
                args: {},
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                dialogTitle : '',
                tableData: [],
                selectedRows:[]
            }
        },
        created (){

            let arg =  {
                page: 1,
                search: {
                    pPropertyCode: 41106
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
                        this.commonData.shutdownReason = list;
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
                this.args = { search: obj }
                this.$refs['t8tTable'].resetActionLog();
                this.initDisabledSymbols();
            },
            onTreeClick (nodeData){
                this.args = {page:1, size:20, search: { organizationId: nodeData.id }}
                this.$refs['t8tTable'].resetActionLog();
                this.initDisabledSymbols();
            },
            //查看详情
            showDetail: function(row){
                if(!row.id){
                    return false;
                }
                this.$router.push({
                    path: '/tuchat-delivery/lockout-detail',
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
                               shutdownReason: +item.shutdownReason,
                               reasonDetail: item.reasonDetail,
                               createUser:createUser
                           })
                       });
                       // console.log(createList);
                       if(createList.length > 0){
                           TemplateOperator.projectShutdownSave({createList: createList}).then((res) => {
                               if (res.data.status === 200) {
                                   this.$message({
                                       type: 'success',
                                       message: '保存成功！'
                                   });
                                   //重置行记录状态
                                   this.$refs['t8tTable'].getActionLog(true);
                                   this.getTableData();
                               }else{
                                   this.$message({
                                       type: 'error',
                                       message: res.data.message
                                   })
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
            initDisabledSymbols(){
                this.$refs['toolbar'].disableBySymbol('DELETE');
                this.$refs['toolbar'].disableBySymbol('SAVE');
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
                let restartStatus = false;
                if(rows.length > 0){
                    for(let i in rows){
                        if(rows[i].id > 0){
                            delStatus = true;
                        }
                        if(rows[i].shutdownStatus != 1){
                            restartStatus = true;
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
                if(restartStatus){
                    this.$refs['toolbar'].disableBySymbol('RESTART');
                    //this.disabledSymbols = ['DELETE', 'SAVE', 'RESTART'];
                }else{
                    //this.$refs['toolbar'].unDisableBySymbol('RESTART');
                     this.disabledSymbols = ['DELETE', 'SAVE'];
                }
            },
            handleCellClick(row, column, cell, event){
                if(typeof row.id !== 'undefined' && row.id > 0){
                    this.$refs['t8tTable'].handleFormItemBlur()
                }
            },
            handleInfoItemChange(cell,val){
                if(cell.column.property == "projectId") {
                    cell.row.projectId = typeof val === 'object' ? val.id : val;
                }
            },
        }
    }
</script>

<style>

</style>
