<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="false"
            :treeData="treeData"
            :showTree="true"
            :defaultTreeExpandedKeys="defaultTreeExpandedKeys"
            :tableColumns="tableColumns"
            :tableService="tableService"
            :tableMethod="tableMethod"
            :tableArgs="tableArgs"
            :tableCommonData="tableCommonData"
            @table-selection-change="selectionChange"
            @table-row-click="tableRowClick"
            @table-row-dobule-click="view"
            @list-view="view"
            @list-edit="edit"
            @list-add="add"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
            :treeArgs="treeArgs"
            @tree-node-click="onTreeClick"
        >
        </t8t-list-view>
        <el-dialog :title="dialogTitle" class="action-dialog" v-model="dialogVisible" @close="closeDialog">

            <el-tabs v-model="tabDefault" @tab-click="handleClick">
                <el-tab-pane label="动作信息" name="base">
                    <el-form :label-position="labelPosition" :model="formData" :rules="formRules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="saveForm">
                        <el-form-item label="业务模块：" prop="bizModule">
                            <el-select
                                :disabled="optType == 'view'"
                                v-model.number="formData.bizModule"
                                filterable
                                clearable
                                placeholder="请选择业务模块">
                                <el-option
                                    v-for="item in searchOptions.bizModule"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="动作类型：" prop="actType">
                            <el-select
                                :disabled="optType == 'view'"
                                v-model.number="formData.actType"
                                filterable
                                clearable
                                placeholder="请选择动作类型">
                                <el-option
                                    v-for="item in searchOptions.actType"
                                    :label="item.text"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="动作名称：" prop="defName">
                            <el-input :disabled="optType == 'view'" v-model="formData.defName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="描述：" prop="description">
                            <el-input  :disabled="optType == 'view'" :rows="4" type="textarea" v-model="formData.description"></el-input>
                        </el-form-item>
                        <el-form-item label="服务名：" prop="service">
                            <el-input :disabled="optType == 'view'" v-model="formData.service">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="接口名：" prop="method">
                            <el-input :disabled="optType == 'view'" v-model="formData.method">
                            </el-input>
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
                <el-button @click="saveForm" type="primary"  v-if="optType != 'view'" :loading="isLoading">确定</el-button>
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
        name: 'action-manager',
        data () {
            return {
                breadcrumbData: [{title: '系统管理'}, {title: '配置管理'}, {title: '动作管理'}],
                searchFields: [
                    {type: 'input', label: '动作', name: 'defName_like'},
                    {type: 'select', label: '动作类型', name: 'actType', selectSourceKey: 'actType', filterable: true},
                    {type: 'select', label: '业务模块', name: 'bizModule', selectSourceKey: 'bizModule', filterable: true}
                ],
                searchOptions: {
                    actType: [
                        {
                            text: '校验',
                            value: 0
                        },
                        {
                            text: '执行',
                            value: 1
                        }
                    ],
                    bizModule: []
                },
                tabDefault:'base',
                tableColumns: [
                    {prop: 'id', label: '序号'},
                    {prop: 'defName', label: '动作名称'},
                    {prop: 'actType', label: '动作类型',list: 'actType'},
                    {prop: 'bizModuleName', label: '业务模块'},
                    {prop: 'description', label: '描述'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                    {prop: 'createUserName', label: '创建人'}
                ],
                tableService: Service.EVENT.name,
                tableMethod: Service.EVENT.methods.actionDefQueryPage,
                tableArgs: {},
                tableCommonData:{
                    actType: [
                        {
                            text: '校验',
                            value: 0
                        },
                        {
                            text: '执行',
                            value: 1
                        }
                    ],
                },
                treeArgs: {},
                treeData: [],
                defaultTreeExpandedKeys:[0],
                labelPosition: 'right',
                formLabelWidth: '120px',
                dialogVisible: false,
                dialogTitle: '',
                formRules: {
                    bizModule: [
                        {type: "number",required: true,message: "请选择业务模块",trigger: 'change'}
                    ],
                    actType: [
                        {type: "number",required:true,message: "请选择动作类型", trigger: 'change'}
                    ],
                    defName:[
                        {type: 'string',required: true, message: "请填写动作名称", trigger:'change'}
                    ],
                    description:[
                        {type: 'string',required:true, message: "请填写描述", trigger: 'change'}
                    ]
                },
                formData:{
                    bizModule:null,
                    actType:null,
                    defName:'',
                    service:'',
                    method:'',
                    description:''
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
            getTree(){
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: '11602'
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    list.push({
                                        id:item.id,
                                        value: item.id,
                                        label: item.propertyName,
                                        text: item.propertyName
                                    })
                                }
                            });
                            this.treeData = [
                                {
                                    id: 0,
                                    label: '业务模块',
                                    children: list
                                }
                            ];
                            this.searchOptions.bizModule = list;
                        }
                    })
            },
            onTreeClick (nodeData){
                this.tableArgs = { search: { bizModule: nodeData.id } }
            },
            //行变化事件，获取已选择的行应选择此方法
            selectionChange (rows,ids){
                //已选择ID集合
                //this.selIDs = ids;
                //console.log(rows,ids);
            },
            tableRowClick(row){
                this.rowId = row.id;
            },
            add(){
                console.log(this.formData)
                this.dialogVisible = true;
                this.dialogTitle = '新增动作';
                this.optType = 'add';
            },
            edit(){
                let _this = this;
                this.loadFormData(this.rowId,function(){
                    _this.dialogVisible = true;
                    _this.dialogTitle = '修改动作';
                    _this.optType = 'edit';
                });
            },
            view(row){
                let _this = this;

                this.loadFormData(this.rowId ? this.rowId : row.id,function(){
                    _this.dialogVisible = true;
                    _this.dialogTitle = '查看动作';
                    _this.optType = 'view';
                });
            },
            closeDialog(){
                this.dialogVisible = false;
                this.$refs['form'].resetFields()
                this.tabDefault = 'base';
            },
            loadFormData(id,cb){
                if (!id) {
                    this.$message.error('请选择要处理的行！')
                    return
                }
                axios({
                    method: Service.EVENT.methods.actionDefFindById,
                    service: Service.EVENT.name,
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
            saveForm(){
                this.$refs['form'].validate(valid=>{
                    if(valid){
                        this.isLoading = true;
                        if(this.optType == 'add'){
                            this.formData.createUser = +Cookie.get('t8t-tc-uid');
                            this.formData.createUserName = Cookie.get('t8t-tc-username') ? Cookie.get('t8t-tc-username') : '';
                            axios({
                                method: Service.EVENT.methods.actionDefCreate,
                                service: Service.EVENT.name,
                                args: {actionDef:this.formData}
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
                            axios({
                                method: Service.EVENT.methods.actionDefUpdate,
                                service: Service.EVENT.name,
                                args: {actionDef:this.formData}
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
            this.getTree();
        },
    }

</script>

<style>
    .action-dialog .el-dialog{
        width: 450px;
    }
    .action-dialog .el-form-item__content {
        width: 250px;
    }
    .action-dialog .el-select {
        width: 100%;
    }
</style>
