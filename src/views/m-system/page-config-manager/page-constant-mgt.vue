<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="commonData"
            :showSearchToggleBtn="true"
            :treeData="treeData"
            :treeProps="treeProps"
            :showTree="true"
            :tableColumns="tableColumns"
            :tableService="tableService"
            :tableMethod="tableMethod"
            :tableArgs="tableArgs"
            :tableCommonData="commonData"
            :showTreeCheckBox="true"
            @table-selection-change="selectionChange"
            @table-row-click="tableRowClick"
            @table-row-dobule-click="view"
            @list-view="view"
            @list-void="toVoid"
            @list-add="add"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
            :treeArgs="treeArgs"
            @tree-node-click="onTreeClick"
            :toolbarDisabledSymbols="disabledSymbols"
        >
        </t8t-list-view>
        <el-dialog :title="新增常量" class="constant-dialog" v-model="dialogVisible" @close="closeDialog">
            <el-tabs v-model="tabDefault" @tab-click="handleClick">
                <el-tab-pane label="常量信息" name="base">
                    <el-form :label-position="labelPosition" :model="formData" :rules="formRules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="saveForm"
                    :show-message="optType == 'add'">
                        <el-form-item label="常量类型：" prop="typeCode">
                            <el-select
                                :disabled="optType == 'view'"
                                v-model="formData.typeCode"
                                filterable
                                clearable
                                placeholder="请选常量类型">
                                <el-option
                                    v-for="item in commonData.typeIdList"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="常量值：" prop="constantValue">
                            <el-input v-model="formData.constantValue">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="有效期类型：" prop="validTimeTypeCode">
                            <el-select
                                v-model="formData.validTimeTypeCode"
                                filterable
                                clearable
                                placeholder="请选有效期类型">
                                <el-option
                                    v-for="item in commonData.validTimeTypeList"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生效日期：" prop="validTime">
                            <el-date-picker
                                :value="!formData.validTime ? '' : formData.validTime * 1000"
                                type="datetime"
                                :picker-options="pickerOptions"
                                @input="handleTimeChange(Date.parse(arguments[0]) / 1000)"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="描述：" prop="description">
                            <el-input :rows="4" type="textarea" v-model="formData.description"></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="分配适用范围" name="expression">
                    <el-form :model="formData" label-width="60px" :inline="true">
                        <el-form-item>
                            <t8t-tree
                                :data="treeData"
                                :props="treeProps2"
                                :hideArrow = "true"
                                :show-checkbox = "true"
                                ref="my-tree"
                                class="my-tree">
                            </t8t-tree>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>

            <div slot="footer" class="dialog-footer">
                <el-button @click="saveForm" type="primary"  v-if="optType != 'view'" :loading="isLoading">保存</el-button>
                <el-button @click="closeDialog" v-if="optType != 'view'">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="查看常量" class="constant-dialog" v-model="dialogViewVisible"  @close="closeDialogView">
            <el-tabs v-model="tabDefault" @tab-click="handleClick">
                <el-tab-pane label="常量信息" name="base">
                    <el-form :label-position="labelPosition" :model="formDataView" :label-width="formLabelWidth" ref="formView">
                        <el-form-item label="常量类型：" prop="typeCode">
                            <el-select
                                :disabled="true"
                                v-model="formDataView.typeCode"
                                filterable
                                clearable
                                placeholder="请选常量类型">
                                <el-option
                                    v-for="item in commonData.typeIdList"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="常量值：" prop="constantValue">
                            <el-input :disabled="true" v-model="formDataView.constantValue">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="有效期类型：" prop="validTimeTypeCode">
                            <el-select
                                :disabled="true"
                                v-model="formDataView.validTimeTypeCode"
                                filterable
                                clearable
                                placeholder="请选有效期类型">
                                <el-option
                                    v-for="item in commonData.validTimeTypeList"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生效日期：" prop="validTime">
                            <el-date-picker
                                :value="!formData.validTime ? '' : formData.validTime * 1000"
                                :disabled="true"
                                type="datetime"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="描述：" prop="description">
                            <el-input  :disabled="true" :rows="4" type="textarea" v-model="formDataView.description"></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="分配适用范围" name="expression">
                    <el-form :model="formData" label-width="60px" :inline="true">
                        <el-form-item>
                            <t8t-tree
                                :data="treeData"
                                :props="treeProps2"
                                :hideArrow = "true"
                                :show-checkbox = "true"
                                :default-expanded-keys="defaultTreeExpandedKeys"
                                ref="my-tree-view"
                                :defaultCheckedKeys="treeIdArray"
                                class="my-tree">
                            </t8t-tree>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane v-if="optType != 'add'" label="其他信息" name="other">
                    <el-form :model="formDataView" label-width="120px">
                        <el-form-item label="创建人：">
                            <el-input v-model="formDataView.createUserName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间：">
                            <el-input :value="formDataView.createTime | toDate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="修改人：">
                            <el-input v-model="formDataView.updateUserName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="修改时间：">
                            <el-input :value="formDataView.updateTime | toDate" disabled></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>



    import api from 'src/services/system/organization.js'
    import Service from 'src/services/system/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'constant-manager',
        data () {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                handleTimeChange(val){
                    this.formData.validTime = val;
                },
                mainType:"003001",
                validTimeTypeCode:"003002",
                breadcrumbData: [{title: '系统管理'}, {title: '配置管理'}, {title: '常量管理'}],
                searchFields: [
                    {type: 'select', label: '常量类型', name: 'typeCode', selectSourceKey: 'typeIdList', filterable: true},
                    {type: 'select', label: '有效期类型', name: 'validTimeTypeCode', selectSourceKey: 'validTimeTypeList', filterable: true},
                    {type: 'datetime',label: '生效日期（起）',name: 'startTime'},
                    {type: 'datetime',label: '生效日期（止）',name: 'endTime'},
                    {type: 'select', label: '状态', name: 'status', selectSourceKey: 'status', filterable: true},
                ],
                commonData: {
                    status: [
                        {
                            text: '废弃',
                            value: 0
                        },
                        {
                            text: '启用',
                            value: 1
                        }
                    ],
                    typeIdList: [],
                    validTimeTypeList:[],
                },
                tabDefault:'base',
                tableColumns: [
                    {prop: 'id', label: '序号'},
                    {prop: 'typeCode', label: '常量类型',list: 'typeIdList'},
                    {prop: 'constantValue', label: '常量值'},
                    {prop: 'description', label: '描述'},
                    {prop: 'status', label: '状态',list: 'status'},
                    {prop: 'validTimeTypeCode', label: '有效期类型',list: 'validTimeTypeList'},
                    {prop: 'validTime', label: '有效期', formatter: 'dateParser'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'}

                ],
                tableService: Service.EXPRESSION.name,
                tableMethod: Service.EXPRESSION.methods.constantQueryPage,
                tableArgs: {},
                treeProps: {
                    label: 'name',
                    children: 'children',
                    disabled: 'isDel'
                },
                treeProps2: {
                    label: 'name',
                    children: 'children',
                    disabled: 'isDel'
                },
                treeArgs: {
                },
                treeData: [],
                treeData2: [],
                defaultTreeExpandedKeys:[],
                disabledSymbols:[],
                treeIdArray:[],
                labelPosition: 'right',
                formLabelWidth: '120px',
                dialogVisible: false,
                dialogViewVisible: false,
                dialogTitle: '',
                selectedRowIdList:'',
                treeSearchArgs:null,
                barSearchArgs:null,
                defaultTreeCheckedKeys:[1,101,427],
                formRules: {
                    typeCode: [
                        {type: "string",required: true,message: "请选择常量类型",trigger: 'change'}
                    ],
                    constantValue:[
                        {type: 'string',required: true, message: "请填写常量值", trigger:'change'}
                    ],
                    description:[
                        {type: 'string',required:true, message: "请填写描述", trigger: 'change'}
                    ],
                    validTimeTypeCode: [
                        {type: "string",required: true,message: "请选择有效期类型",trigger: 'change'}
                    ],
//                    validTime:[
//                        {type: 'date',required:true, message: "请选择有效期", trigger: 'change'}
//                    ]
                },
                formData:{
                    typeCode:null,
                    constantValue:'',
                    description:'',
                    validTimeTypeCode:null,
                    validTime:'',
                    useRange:''
                },
                formDataView:{
                    typeCode:null,
                    constantValue:'',
                    description:'',
                    validTimeTypeCode:null,
                    validTime:'',
                    useRange:''
                },
                optType: '',
                isLoading: false,
                rowId:null
            }
        },

        methods:{
            onSearchSubmit(obj){
                this.barSearchArgs = obj;
                this.tableArgs = { search:this.getUseRange()};
            },
            beforeSubmit(){},

            getTree(){
                let list = [];
                axios({
                    method: Service.CONFIGURE.methods.SYS_CODE_QUERYALL,
                    service: Service.CONFIGURE.name,
                    args: {"fatherCode":this.validTimeTypeCode}//
                }).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.isDel===0) {
                                list.push({
                                    code:item.code,
                                    id:item.id,
                                    value: item.code,
                                    name: item.name,
                                    text: item.name,
                                    fatherCode:this.validTimeTypeCode,
//                                    children:this.getTree(item.code),
                                    label:item.name
                                })
                            }
                        });
                        this.commonData.validTimeTypeList = list;
                    }
                })
            },

            getSupply(){
              let list = [];
                axios({
//                    method: Service.SUPPLY_CONFIGURE.methods.queryUnionParent,
//                    service: Service.SUPPLY_CONFIGURE.name,
//                    args: {page: 1,size: 100,search:{pPropertyCode:this.mainType}}//
                    method: Service.CONFIGURE.methods.SYS_CODE_QUERYALL,
                    service: Service.CONFIGURE.name,
                    args: {"fatherCode":this.mainType}//
                }).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
//                                code:item.propertyCode,
//                                id:item.id,
//                                value: item.id,
//                                name: item.propertyName,
//                                text: item.propertyName,
//                                fatherCode:this.mainType,
//                                label:item.propertyName,
                                code:item.code,
                                id:item.id,
                                value: item.code,
                                name: item.name,
                                text: item.name,
                                fatherCode:this.mainType,
//                                    children:this.getTree(item.code),
                                label:item.name
                            })
                        });
//                        this.commonData.supplyList = list;
                        this.commonData.typeIdList= list;
                    }
                })
            },

            getAllTree(){
                axios({
                    method: Service.EXPRESSION.methods.constantQueryTree,
                    service: Service.EXPRESSION.name,
                    args: {}//
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.treeData = [
                            {
                                code:"1",
                                id: 101,
                                typeId:101,
                                isDel:0,
                                name:"业务类型",
                                parentId:0,
                                children: res.data.result[0].children
                            },
                            {
                                code:"2",
                                id: 102,
                                typeId:102,
                                isDel:0,
                                name:"产品包",
                                parentId:0,
                                children: res.data.result[1].children
                            },
                            {
                                code:"3",
                                id: 103,
                                isDel:0,
                                typeId:103,
                                name:"组织",
                                parentId:0,
                                children: res.data.result[2].children
                            },
                            {
                                code:"4",
                                id: 104,
                                isDel:0,
                                typeId:104,
                                name:"产品包模板",
                                parentId:0,
                                children: res.data.result[3].children
                            }
                        ];
                    }
                })
            },
            initTree(){
                this.getSupply();
                this.getTree();
            },

            getUserData(userID,type){
                axios({
                    method: Service.ACCOUNT.methods.accountFindById,
                    service: Service.ACCOUNT.name,
                    args: {"id":userID}
                }).then((res)=>{
                    if (res.data.status === 200) {
                        if(type == 1){
                            this.formDataView.createUserName = res.data.result.name;
                        }else{
                            this.formDataView.updateUserName  = res.data.result.name;
                        }
                    }else{
                        this.$message.error(res.data.message? res.data.message :'获取数据失败！');
                    }
                }).catch((res)=>{
                })
            },
            onTreeClick (nodeData){
                this.tableArgs = { search:this.getUseRange()};
            },
            getUseRange(){
                let userRangeStr = '';
                this.$refs['list-view'].getTreeInstance().getCheckedNodes(true).forEach((item) => {
                    userRangeStr+=item.typeId+"-"+item.id+","
                })
                var target = this.barSearchArgs;
                if(userRangeStr.length >0){
                    this.treeSearchArgs = {useRange:userRangeStr};
                    if(target !=null){
                        Object.assign(target,this.treeSearchArgs,this.barSearchArgs);
                    }else{
                        target = this.treeSearchArgs;
                    }
                }
                return target;
            },

            //行变化事件，获取已选择的行应选择此方法
            selectionChange (rows,ids){
                //已选择ID集合
                //this.selIDs = ids;
                this.selectedRowIdList ='';
                if(ids.length == 1){
                    this.disabledSymbols = [];
                }else if(ids.length >1 || ids.length ==0){
                    this.disabledSymbols = ['VOID', 'VIEW'];
                }
                if(rows.length >0){
                    rows.forEach((item) => {
                      if(item.status !=1){
                          this.selectedRowIdList+=item.id+',';
                      }
                    });
                }
                this.selectedRowIdList.substring(0,this.selectedRowIdList-1);
            },
            tableRowClick(row){
                this.rowId = row.id;
            },
            add(){
                console.log(this.formData)
                this.dialogVisible = true;
//                this.dialogTitle = '新增常量';
                this.optType = 'add';
            },
            toVoid(){
                if (!this.rowId) {
                    this.$message.error('请选择要处理的行！')
                    return
                }
                this.doVoid(this.rowId);
            },

            view(row){
                let _this = this;
                //打开窗口
                _this.dialogViewVisible = true;
                //请求数据
                this.loadFormData(this.rowId ? this.rowId : row.id,function(useRange){
//                    _this.dialogTitle = '查看常量';
                    _this.optType = 'view';
                    _this.getUserData(_this.formDataView.createUser,1);
                    _this.getUserData(_this.formDataView.updateUser,0);
                    _this.treeIdArray = useRange;//res.data.result.useRange.split(',');
                    _this.defaultTreeExpandedKeys = useRange;
                    setTimeout(()=>{
                        _this.$refs['my-tree-view'].setCheckedKeys(useRange);
                    },1000)
//                    this.$nextTick(()=>{
//                        _this.$refs['my-tree-view'].setCheckedKeys(useRange);
//                    })
                });
            },
            closeDialog(){
                this.dialogVisible = false;
                this.$refs['form'].resetFields();
//                console.log(this.formData)
                this.formData ={typeCode:null,constantValue:'',description:'',validTimeTypeCode:null,validTime:'',useRange:''};
                var checkedKeysInit = []
                this.$refs['my-tree'].setCheckedKeys(checkedKeysInit);
                this.tabDefault = 'base';
            },

            closeDialogView(){
                this.dialogVisible = false;
                this.$refs['formView'].resetFields();
//                console.log(this.formData)
                this.formDataView ={typeCode:null,constantValue:'',description:'',validTimeTypeCode:null,validTime:'',useRange:''};
                this.treeIdArray = [];
                this.$refs['my-tree-view'].setCheckedKeys(this.treeIdArray);
                this.tabDefault = 'base';
            },



            loadFormData(id,cb){
                if (!id) {
                    this.$message.error('请选择要处理的行！')
                    return
                }
                axios({
                    method: Service.EXPRESSION.methods.constantFindById,
                    service: Service.EXPRESSION.name,
                    args: {id:id}
                }).then((res)=>{

                    if(res.data.status === 200){
                        this.formDataView = Object.assign(this.formDataView,res.data.result);
                        cb(res.data.result.useRange.split(','));
                    }else{
                        this.$message.error(res.data.message? res.data.message :'获取数据失败！');
                    }
                }).catch((res)=>{
                })
            },
            doVoid(id){
                let updateUser = +Cookie.get('t8t-tc-uid');
                this.formData.status = 0;
                axios({
                    method: Service.EXPRESSION.methods.constantToVoid,
                    service: Service.EXPRESSION.name,
                    args: {"id":id,"updateUser":updateUser}
                }).then((res)=>{
                    this.isLoading = false;
                    if(res.data.status === 200){
                        this.$message.success('作废成功！');
                        this.onSearchSubmit(this.tableArgs.search);
                    }else{
                        this.$message.error(res.data.message? res.data.message :'作废失败！');
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
                            let userRangeStr = '';
                            this.$refs['my-tree'].getCheckedNodes(true).forEach((item) => {
                                    userRangeStr+=item.typeId+"-"+item.id+","
                                });
                            this.formData.useRange = userRangeStr;
                            if(this.formData.useRange.length==0){
                                this.$message.error('新增失败！必须选择适用范围！');
                                this.isLoading = false;
                                return;
                            }
                            axios({
                                method: Service.EXPRESSION.methods.constantCreate,
                                service: Service.EXPRESSION.name,
                                args: {constant:this.formData}
                            }).then((res)=>{
                                this.isLoading = false;
                                if(res.data.status === 200){
                                    this.$message.success('新增成功！');
                                    this.closeDialog();
                                    this.onSearchSubmit(this.tableArgs.search);
                                }else{
                                    this.$message.error(res.data.message? res.data.message :'新增失败！');
                                }
                            }).catch((res)=>{
                            })
                        }
                    }
                })
            }
        },

        created(){
            this.initTree();
            this.getAllTree();
            this.disabledSymbols = ['VOID', 'VIEW'];


        },
    }
</script>

<style>
    .constant-dialog .el-dialog{
        width: 450px;
    }
    .constant-dialog .el-form-item__content {
        width: 250px;
    }
    .constant-dialog .el-select {
        width: 100%;
    }.my-tree{
         height: 380px;
         margin: 0 auto;
         width: 150px;
     }
</style>
