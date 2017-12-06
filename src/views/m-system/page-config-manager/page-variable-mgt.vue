<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="commonData"
            :showSearchToggleBtn="false"
            :treeData="treeData"
            :showTree="true"
            :defaultTreeExpandedKeys="defaultTreeExpandedKeys"
            :tableColumns="tableColumns"
            :tableService="tableService"
            :tableMethod="tableMethod"
            :tableArgs="tableArgs"
            :tableCommonData="commonData"
            @table-selection-change="selectionChange"
            @table-row-click="tableRowClick"
            @table-row-dobule-click="view"
            @list-view="view"
            @list-edit="edit"
            @list-add="add"
            @list-disable="disable"
            @list-enable="enable"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
            :treeArgs="treeArgs"
            @tree-node-click="onTreeClick"
            :toolbarDisabledSymbols="disabledSymbols"
        >
        </t8t-list-view>
        <el-dialog :title="dialogTitle" class="variable-dialog" v-model="dialogVisible" @close="closeDialog">

            <el-tabs v-model="tabDefault" @tab-click="handleClick">
                <el-tab-pane label="变量信息" name="base">
                    <el-form :label-position="labelPosition" :model="formData" :rules="formRules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="saveForm">
                        <el-form-item label="业务模块：" prop="moduleId">
                            <el-select
                                :disabled="optType == 'view'"
                                v-model.number="formData.moduleId"
                                filterable
                                clearable
                                placeholder="请选择业务模块">
                                <el-option
                                    v-for="item in commonData.moduleIdList"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="变量名称：" prop="variableName">
                            <el-input :disabled="optType == 'view' || optType == 'edit' " v-model="formData.variableName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="描述：" prop="description">
                            <el-input  :disabled="optType == 'view'" :rows="4" type="textarea" v-model="formData.description"></el-input>
                        </el-form-item>

                    </el-form>
                </el-tab-pane>
                <el-tab-pane v-if="optType != 'add'" label="其他信息" name="other">
                    <el-form :model="formData" label-width="120px">
                        <el-form-item label="创建人：">
                            <el-input v-model="formData.createUserName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间：">
                            <el-input :value="formData.createTime | toDate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="修改人：">
                            <el-input v-model="formData.updateUserName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="修改时间：">
                            <el-input :value="formData.updateTime | toDate" disabled></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>

            <div slot="footer" class="dialog-footer">
                <el-button @click="saveForm" type="primary"  v-if="optType != 'view'" :loading="isLoading">保存</el-button>
                <el-button @click="closeDialog" v-if="optType != 'view'">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Service from 'src/services/system/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'variable-manager',
        data () {
            return {
                mainType:"11602",
                breadcrumbData: [{title: '系统管理'}, {title: '配置管理'}, {title: '变量管理'}],
                searchFields: [
                    {type: 'select', label: '变量', name: 'id', selectSourceKey: 'variableList', filterable: true},
                    {type: 'select', label: '业务模块', name: 'moduleId', selectSourceKey: 'moduleIdList', filterable: true},
                    {type: 'select', label: '状态', name: 'status', selectSourceKey: 'status', filterable: true},
                ],
                commonData: {
                    status: [
                        {
                            text: '禁用',
                            value: 0
                        },
                        {
                            text: '启用',
                            value: 1
                        }
                    ],
                    moduleIdList: [],
                    variableList:[]
                },
                tabDefault:'base',
                tableColumns: [
                    {prop: 'id', label: '序号'},
                    {prop: 'moduleId', label: '业务模块',list: 'moduleIdList'},
                    {prop: 'variableName', label: '变量名称'},
                    {prop: 'description', label: '描述'},
                    {prop: 'status', label: '状态',list: 'status'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'}

                ],
                tableService: Service.EXPRESSION.name,
                tableMethod: Service.EXPRESSION.methods.variableQueryPage,
                tableArgs: {},
                treeArgs: {},
                treeData: [],
                disabledSymbols:[],
                defaultTreeExpandedKeys:[0],
                labelPosition: 'right',
                formLabelWidth: '120px',
                dialogVisible: false,
                dialogTitle: '',
                selectedRowsId:[],
                formRules: {
                    moduleId: [
                        {type: "number",required: true,message: "请选择业务模块",trigger: 'change'}
                    ],
                    variableName:[
                        {type: 'string',required: true, message: "请填写动作名称", trigger:'change'}
                    ],
                    description:[
                        {type: 'string',required:true, message: "请填写描述", trigger: 'change'}
                    ]
                },
                formData:{
                    moduleId:null,
                    variableName:'',
                    description:'',
                    serverName:"",
                    apiName:""
                },
                optType: '',
                isLoading: false,
                rowId:null
            }
        },

        methods:{
            onSearchSubmit(obj){
                this.tableArgs = { search: obj }
            },
            beforeSubmit(){},
//            initTree(){
//                let list = [];
//                list = this.getSupply(this.mainType);
//                this.commonData.moduleIdList = list;
//                this.treeData = [
//                    {
//                        id: 0,
//                        label: '业务模块',
//                        children: list
//                    }
//                ];
//            },
            getVariableData(){
                let list = [];
                axios({
                    method: Service.EXPRESSION.methods.variableQuery,
                    service: Service.EXPRESSION.name,
                    args: {}
                }).then((res)=>{
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                id:item.id,
                                value: item.id,
                                label: item.variableName,
                                text: item.variableName,
                                name:item.variableName,
                            })
                        });

                        this.commonData.variableList = list;
                    }else{
                        this.$message.error(res.data.message? res.data.message :'获取数据失败！');
                    }
                }).catch((res)=>{
                })
            },
            getSupply(pPropertyCode){
                let list = [];

                axios({
                    method: Service.SUPPLY_CONFIGURE.methods.queryUnionParent,
                    service: Service.SUPPLY_CONFIGURE.name,
                    args: {page: 1,size: 100,search:{"pPropertyCode":pPropertyCode}}//
                }).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                code:item.propertyCode,
                                id:item.id,
                                value: item.id,
                                name: item.propertyName,
                                text: item.propertyName,
                                fatherCode:pPropertyCode,
                                label:item.propertyName
                            })
                        });
                    }
                    this.commonData.moduleIdList = list;
                    this.treeData = [
                        {
                            id: 0,
                            label: '业务模块',
                            children: list
                        }
                    ];

                })
            },
            getUserData(userID,type){
                axios({
                    method: Service.ACCOUNT.methods.accountFindById,
                    service: Service.ACCOUNT.name,
                    args: {"id":userID}
                }).then((res)=>{
                    if (res.data.status === 200) {
                        if(type == 1){
                            this.formData.createUserName = res.data.result.name;
                        }else{
                            this.formData.updateUserName  = res.data.result.name;
                        }
                    }else{
                        this.$message.error(res.data.message? res.data.message :'获取数据失败！');
                    }
                }).catch((res)=>{
                })
            },
            onTreeClick (nodeData){
                this.tableArgs = { search: { moduleId: nodeData.id } }
            },
            //行变化事件，获取已选择的行应选择此方法
            selectionChange (rows,ids){
                //已选择ID集合
                //this.selIDs = ids;
                //console.log(rows,ids);
                this.selectedRowsId = ids;
                if(ids.length == 1){
                    this.disabledSymbols = [];
                }else if(ids.length >1|| ids.length <1){
                    this.disabledSymbols = ['EDIT', 'VIEW'];
                }
            },
            tableRowClick(row){
                this.rowId = row.id;
            },
            add(){
                console.log(this.formData)
                this.dialogVisible = true;
                this.dialogTitle = '新增变量';
                this.optType = 'add';
            },
            edit(){
                let _this = this;
                this.loadFormData(this.rowId,function(){
                    _this.dialogVisible = true;
                    _this.dialogTitle = '修改变量';
                    _this.optType = 'edit';
                    _this.formData.createUserName = _this.getUserData(_this.formData.createUser,1);
                    _this.formData.updateUser = _this.getUserData(_this.formData.updateUser,0);
                });
            },
            view(row){
                let _this = this;

                this.loadFormData(this.rowId ? this.rowId : row.id,function(){
                    _this.dialogVisible = true;
                    _this.dialogTitle = '查看变量';
                    _this.optType = 'view';
                    _this.formData.createUserName = _this.getUserData(_this.formData.createUser,1);
                    _this.formData.updateUser = _this.getUserData(_this.formData.updateUser,0);
                });
            },
            disable(row){
                if(this.selectedRowsId.length < 1){
                    this.$message.error('请选择要处理的行！')
                    return
                }
                this.enableOrdiaable(0);
            },
            enable(row){
                if(this.selectedRowsId.length < 1){
                    this.$message.error('请选择要处理的行！')
                    return
                }
                this.enableOrdiaable(1);
//                let _this = this;
//                this.loadFormData(this.rowId ? this.rowId : row.id,function(){
//                    _this.enableOrdiaable(1);
//                });
            },

            closeDialog(){
                this.dialogVisible = false;
                this.$refs['form'].resetFields();
                this.tabDefault = 'base';
                this.formData ={moduleId:null,constantValue:'',description:'',validTimeType:null,validTime:'',useRange:''};
            },
            loadFormData(id,cb){
                if (!id) {
                    this.$message.error('请选择要处理的行！')
                    return
                }
                axios({
                    method: Service.EXPRESSION.methods.variableFindById,
                    service: Service.EXPRESSION.name,
                    args: {id:id}
                }).then((res)=>{
                    if(res.data.status === 200){
                        this.formData = Object.assign(this.formData,res.data.result);
                        cb();
                    }else{
                        this.$message.error(res.data.message? res.data.message :'获取数据失败！');
                    }
                }).catch((res)=>{
                })
            },
            enableOrdiaable(opType){
                let tempStatus = 0;
                let message  = "禁用"
                if(opType == 1){
                    tempStatus = 1;
                    message = "启用";
                }
                let userId = +Cookie.get('t8t-tc-uid');
                let ids = '';
                this.selectedRowsId.forEach((item) => {
                    ids+=item+",";
                });
                axios({
                    method: Service.EXPRESSION.methods.variableUpdateStatus,
                    service: Service.EXPRESSION.name,
                    args: {"ids":ids.substring(0,ids.length-1),"status":tempStatus,"updateUserID":userId}
                }).then((res)=>{
                    this.isLoading = false;
                    if(res.data.status === 200){
                        this.$message.success(message+'成功！');
                        this.onSearchSubmit(this.tableArgs.search)
                    }else{
                        this.$message.error(res.data.message? res.data.message :message+'失败！');
                    }
                }).catch((res)=>{
                })
            },
            saveForm(){
                this.$refs['form'].validate(valid=>{
                    if(valid){
                        this.isLoading = true;
                        if(this.optType == 'add'){
                            this.formData.createUser = +Cookie.get('t8t-tc-uid');
                            this.formData.createUserName = Cookie.get('t8t-tc-username') ? Cookie.get('t8t-tc-username') : '';
                            axios({
                                method: Service.EXPRESSION.methods.variableCreate,
                                service: Service.EXPRESSION.name,
                                args: {variable:this.formData}
                            }).then((res)=>{
                                this.isLoading = false;
                                if(res.data.status === 200){
                                    this.$message.success('新增成功！');
                                    this.closeDialog()
                                    this.onSearchSubmit(this.tableArgs.search)
                                }else{
                                    this.$message.error(res.data.message? res.data.message :'新增失败！');
                                }
                            }).catch((res)=>{
                            })
                        }else if(this.optType == 'edit'){
                            this.formData.updateUser = +Cookie.get('t8t-tc-uid');
                            this.formData.updateUserName = Cookie.get('t8t-tc-username') ? Cookie.get('t8t-tc-username') : '';
                            this.formData.serverName = '';
                            this.formData.apiName = '';
                            axios({
                                method: Service.EXPRESSION.methods.variableUpdate,
                                service: Service.EXPRESSION.name,
                                args: {variable:this.formData}
                            }).then((res)=>{
                                this.isLoading = false;
                                if(res.data.status === 200){
                                    this.$message.success('修改成功！');
                                    this.closeDialog();
                                    this.onSearchSubmit(this.tableArgs.search)
                                }else{
                                    this.$message.error(res.data.message? res.data.message :'修改失败！');
                                }
                            }).catch((res)=>{
                            })
                        }else{
                            this.$message.error('操作非法');
                        }
                    }
                })
            }
        },
        created(){
            this.getSupply(this.mainType);
            this.getVariableData();
            this.disabledSymbols = ['EDIT', 'VIEW'];
        },
    }

</script>

<style>
    .variable-dialog .el-dialog{
        width: 450px;
    }
    .variable-dialog .el-form-item__content {
        width: 250px;
    }
    .variable-dialog .el-select {
        width: 100%;
    }
</style>
