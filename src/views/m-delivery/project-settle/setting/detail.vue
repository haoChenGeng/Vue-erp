<template>
<div>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
        <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
             <div class="full-dialog-toolbar-container">
                 <div class="toolbar-container">
                     <t8t-toolbar
                         v-if="type != 'view'"
                         @EDIT-SUBMIT="save"
                         class="t8t-dark"
                     >
                     </t8t-toolbar>
                 </div>
             </div>
             <div class="dialog2-main-container">
             	<!-- 收缩按钮 -->
                <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                <!-- 表单区 -->
                <div class="full-dialog-form-container">
                	<el-tabs v-model="tab_info">
                        <el-tab-pane label="基本信息" name="basic">
	                        <t8t-form-panel
	                            ref="form-panel"
	                            :dataSource="detailInfo"
	                            :commonData="commonData"
	                            :fields="fields"
	                        ></t8t-form-panel>
                        </el-tab-pane>
                    </el-tabs>
                </div>
	            <div class="full-dialog-tabs-container">
	                <el-tabs v-model="tab_detail">
	                  	<el-tab-pane label="产品包模板" name="template">
          		    		<div class="my-toolbar">
                                 <div class="btn-container">
                                     <el-button
                                         v-if="type != 'view'"
                                         type="primary"
                                         size="small"
                                         icon="plus"
                                         @click="selectTemplate"
                                     >选择产品包模板
                                     </el-button>
                                     <el-button
                                         v-if="type != 'view'"
                                         type="danger"
                                         size="small"
                                         icon="close"
                                         @click="delTemplate"
                                     >删除
                                     </el-button>
                                 </div>
                            </div>
                            <t8t-table
                                ref="productTemplateTable"
                                :columns="templateColumns"
                                :pageBar="false"
                            ></t8t-table>
	                  	</el-tab-pane>
	                  	<el-tab-pane label="结算项" name="settle-row">
                            <div class="my-toolbar">
                                 <div class="btn-container">
                                     <el-button
                                         v-if="type != 'view'"
                                         type="primary"
                                         size="small"
                                         icon="plus"
                                         @click="addItem"
                                     >新增结算项
                                     </el-button>
                                     <el-button
                                         v-if="type != 'view'"
                                         type="danger"
                                         size="small"
                                         icon="close"
                                         @click="delItem"
                                     >删除结算项
                                     </el-button>
                                 </div>
                            </div>
                            <t8t-table
                                ref="settleItemTable"
                                :service="settleService"
                                :method="settleMethod"
                                :args="settleArgs"
                                :columns="settleItemColumns"
                                :editable="type != 'view'"
                                :indexCol="true"
                                :commonData="commonData"
                                @data-loaded="settleDataLoaded"
                            ></t8t-table>
	                  	</el-tab-pane>
	              	</el-tabs>
	            </div>
            </div>
        </div>
    </el-dialog>
    <el-dialog title="选择产品包模板" v-model="dialogVisible" size="large">
        <t8t-search
            ref="templateSearch"
            :fields="templateFields"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-table
            ref="templateTable"
            :style="{height:'350px'}"
            :columns="templateColumns"
            :pageBar="true"
            :editable="false"
            :selectCol="true"
            :service="templateService"
            :method="templateMethod"
            :args="templateArgs"
        >
        </t8t-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="chooseTemplate">确 定</el-button>
            <el-button @click="dialogVisible=false">取 消</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
	export default {
		data(){
            let that = this;
			return {
                type: 'view',
				isDialogShow: true,
				isTopHide: false,
				tab_info: 'basic',
				tab_detail: 'template',
				detailInfo: {
                    id: null,
					bizTypeId: null,
                    settleObjectType: null,
                    settleTypeWholeCode: '',
                    payType: null,
                    effectTime: '',
                    expireTime: ''
				},
				fields:[
					{
                        type: 'select',
                        label: '业务类型',
                        prop: 'bizTypeId',
                        list: 'bizTypeList',
                        disabled: this.$route.query.type == 'view' ? true : false,
                        rules: [
                            {type: 'number',required: true , message: "请选择业务类型",trigger: 'change'},
                        ]
                    },
                    {
                        type: 'select',
                        label: '结算对象',
                        prop: 'settleObjectType',
                        list: 'settleObject',
                        disabled: this.$route.query.type == 'view' ? true : false,
                        rules: [
                            {type: 'number',required: true , message: "请选择结算对象",trigger: 'change'},
                        ]
                    },
                    {
                        type: 'select',
                        label: '结算类型',
                        prop: 'settleTypeWholeCode',
                        list: 'settleTypeWholeCode',
                        disabled: this.$route.query.type == 'view'? true : false,
                        rules: [
                            {type: 'string',required: true , message: "请选择结算类型",trigger: 'change'},
                        ]
                    },
                    {
                        type: 'select',
                        label: '付款方式',
                        prop: 'payType',
                        list: 'payType',
                        disabled: this.$route.query.type == 'view' ? true : false,
                        rules: [
                            {type: 'number',required: true , message: "请选择付款方式",trigger: 'change'},
                        ]
                    },
                    {
                        type: 'datetime',
                        label: '生效时间',
                        prop: 'effectTime',
                        disabled: this.$route.query.type == 'view' ? true : false,
                        rules: [
                            {type:'date',required: true , message: "请选择生效时间",trigger: 'change'},
                        ]
                    },
                    {
                        type: 'datetime',
                        label: '失效时间',
                        prop: 'expireTime',
                        disabled: this.$route.query.type == 'view' ? true : false,
                        rules: [
                            {type:'date',required: true , message: "请选择失效时间",trigger: 'change'},
                        ]
                    },
				],
				commonData:{
					bizTypeList: [],
                    settleObject: [
                        {
                            text: '项目经理',
                            value: 1
                        },
                        {
                            text: '装修公司',
                            value: 2
                        },
                        {
                            text: '安装公司',
                            value: 3
                        }
                    ],
                    settleTypeWholeCode: [],
                    payType: [
                        {
                            text: '银行卡付款',
                            value: 1
                        },
                        {
                            text: '账户付款',
                            value: 2
                        }
                    ],
                    receiptsType:[
                        {
                            text: '收入',
                            value: 1
                        },
                        {
                            text: '支出',
                            value: 2
                        }
                    ],
                    settleItemWholeCodes: [],
                    _settleItemWholeCodes: [],
                    itemFormulaType: [
                        {
                            text: '公式',
                            value: 1
                        },
                        {
                            text: '手动输入',
                            value: 2
                        }
                    ]
				},
                templateColumns:[
                    {
                        prop: 'pkgName',
                        label: '产品包'
                    },
                    {
                        prop: 'orgName',
                        label: '组织'
                    },
                    {
                        prop: 'tempName',
                        label: '产品包模板'
                    },
                    {
                        prop: 'tempCode',
                        label: '产品包模板编码'
                    }
                ],
                dialogVisible: false,
                templateFields: [
                    {type: 'input',label: '产品包模板名称',name: 'tempName_like'}
                ],
                templateService: Service.PSSET.name,
                templateMethod: Service.PSSET.methods.settleConfigListPkgTemps,
                templateArgs: {
                    search:{
                        bizTypeId: 0,
                        tempStatus: 2
                    }
                },
                settleService: Service.PSSET.name,
                settleMethod: Service.PSSET.methods.settleConfigItemQueryPage,
                settleArgs: { search: {settleConfigId: this.$route.query.id ? this.$route.query.id : 0 }},
                settleItemColumns: [
                    {
                        prop: 'receiptsType',
                        label: '收支类型',
                        list: 'receiptsType',
                        editor:{
                            type: 'select',
                            rules:[
                                {
                                    required: true,
                                    message: '不能为空'
                                }
                            ]
                        },
                        onChange(val,row,col,table){
                            table.$nextTick(()=>{
                                row.settleItemWholeCode = null;
                                if(val == 1){
                                    that.commonData._settleItemWholeCodes = that.settleItemWholeCodes['4!427!42703'];
                                }else if(val == 2){
                                    that.commonData._settleItemWholeCodes = that.settleItemWholeCodes['4!427!42704'];
                                }
                            })
                        }
                    },
                    {
                        prop: 'settleItemWholeCode',
                        label: '结算项',
                        list: 'settleItemWholeCodes',
                        editor:{
                            type: 'select',
                            list: '_settleItemWholeCodes',
                            rules:[
                                {
                                    required: true,
                                    message: '不能为空'
                                }
                            ]
                        }
                    },
                    {
                        prop: 'itemFormulaType',
                        label: '计算方式',
                        list: 'itemFormulaType',
                        editor:{
                            type: 'select',
                            rules:[
                                {
                                    required: true,
                                    message: '不能为空'
                                }
                            ]
                        },
                        onChange(val,row,col,table){
                            table.$nextTick(()=>{
                                row.itemFormula = null;
                                row.itemFormulaName = '';
                            })
                        }
                    },
                    {
                        prop: 'itemFormulaName',
                        label: '计算公式',
                        editor:{
                            type: 'lookup',
                            service: Service.ENTRY.name,
                            method: Service.ENTRY.methods.accountsConfigQueryFormula,
                            args:{},
                            columns: [
                            {
                                prop: 'id',
                                label: 'ID',
                            },
                            {
                                prop: 'formulaName',
                                label: '核算公式名称'
                            },
                            {
                                prop: 'expression',
                                label: '核算公式表达式'
                            }
                            ],
                            placeholder: '搜索核算公式名称',
                            searchExpr: ['formulaName']
                        },
                        onClick(val,row,col,table){
                            table.$nextTick(()=>{
                                if(row.itemFormulaType == 2){
                                    table.handleFormItemBlur();
                                }
                            })
                        },
                        onChange(val,row,column,table){
                            table.$nextTick(()=>{
                                if(val){
                                    row.itemFormula = val.id;
                                    row.itemFormulaName = val.formulaName;
                                }else{
                                    row.accountsFormula = null;
                                    row.itemFormulaName = '';
                                }
                            })
                        },
                    }
                ],
                settleItemLength: 0,
                settleItemWholeCodes:{}
			}
		},
        created(){
            this.type = this.$route.query.type;
            if(this.type != 'add'){
                Model.settleConfigGetDetail({id: this.$route.query.id}).then((res)=>{
                    this.detailInfo = res.data.result;
                    this.detailInfo.effectTime = new Date(res.data.result.effectTime * 1000);
                    this.detailInfo.expireTime = new Date(res.data.result.expireTime * 1000);
                    this.$refs['productTemplateTable'].dataSource = res.data.result.pkgTempVOList;
                });
            }
            this.commonData.bizTypeList = Model.getCommonOptions({ pPropertyCode: '11008'});
            this.commonData.settleTypeWholeCode = Model.getCommonOptionsByWholeCode('4!427!42702');
            this.getSettleItemWholeCodes(['4!427!42703','4!427!42704']);
        },
        watch: {
            'detailInfo.bizTypeId': {
                handler: function(val,oldVal){
                    if(oldVal !== null){
                        this.$refs['productTemplateTable'].dataSource = [];
                    }
                }
            }
        },
		methods: {
            closeDialog() {
                this.$router.push({
                    path: '/tuchat-delivery/settle-setting/index'
                })
            },
            selectTemplate(){
                if(!this.detailInfo.bizTypeId){
                    this.$message.error('请选择业务类型！');
                    return;
                }
                this.templateArgs = {search: Object.assign(this.templateArgs.search,{bizTypeId: this.detailInfo.bizTypeId}) };
                this.dialogVisible = true;
            },
            chooseTemplate(){
                let dataSource = this.$refs['templateTable'].getSelectRows();
                let realDataSource = this.$refs['productTemplateTable'].dataSource;
                dataSource.forEach((item,index)=>{
                    if(realDataSource.indexOf(item) == -1){
                        realDataSource.push(item);
                    }
                })
                this.dialogVisible = false;
            },
            submitSearch(obj){
                this.templateArgs = {search: Object.assign(this.templateArgs.search,obj) };
            },
            delTemplate(){
                this.$refs['productTemplateTable'].delRows();
            },
            addItem(){
                this.$refs['settleItemTable'].addNewRow();
            },
            delItem(){
                this.$refs['settleItemTable'].delRows();
            },
            getSettleItemWholeCodes(wholeCodes){
                let args =  {
                    wholeCodes: wholeCodes,
                    depth : 3
                }
                axios({
                    method: Service.PROPERTY.methods.queryChildrenByWholeCodes,
                    service: Service.PROPERTY.name,
                    args: args
                }).then((res) => {
                    if (res.data.status === 200) {
                        let result = res.data.result;
                        for(let key in result){
                            this.settleItemWholeCodes[key] = [];
                            result[key].forEach((item)=>{
                                let eachItem = {
                                    value: item.wholeCode,
                                    text: item.propertyName
                                };
                                this.commonData.settleItemWholeCodes.push(eachItem);
                                this.settleItemWholeCodes[key].push(eachItem);
                            })
                        }
                    }
                });
            },
            settleDataLoaded(dataSource){
                this.settleItemLength = dataSource.length;
            },
            save(){
                this.$refs['form-panel'].validate((res)=>{
                    if(res){
                        //时间大小判断
                        if(this.detailInfo.effectTime && this.detailInfo.expireTime && +this.detailInfo.effectTime > +this.detailInfo.expireTime){
                            this.$msgbox({
                                title: '',
                                type: 'error',
                                message: '失效时间必须大于等于生效时间！'
                            });
                            return false;
                        }
                        this.$refs['settleItemTable'].validate((isValid)=>{
                            if(isValid){

                                let settleConfig = {
                                    bizTypeId: +this.detailInfo.bizTypeId,
                                    settleObjectType: +this.detailInfo.settleObjectType,
                                    settleTypeWholeCode: this.detailInfo.settleTypeWholeCode,
                                    payType: +this.detailInfo.payType,
                                    effectTime: +Date.parse(this.detailInfo.effectTime).toString().substr(0,10),
                                    expireTime: +Date.parse(this.detailInfo.expireTime).toString().substr(0,10),
                                    settleConfigItemList: [],
                                    pkgTempIds: []
                                }
                                //结算项
                                let rows = this.$refs['settleItemTable'].getActionLog(false,true);
                                let flag = true;
                                rows.addedRows.forEach((item)=>{
                                    if(item.itemFormulaType == 1 && !item.itemFormula){
                                        flag = false;
                                    }
                                    settleConfig.settleConfigItemList.push({
                                        id: 0,
                                        settleItemWholeCode: item.settleItemWholeCode, //结算项
                                        receiptsType: +item.receiptsType,
                                        itemFormulaType: +item.itemFormulaType,
                                        itemFormula: +item.itemFormula
                                    });
                                })
                                if(this.type == 'add'){
                                    settleConfig.createUser = +Cookie.get('t8t-tc-uid');
                                    settleConfig.createBy = Cookie.get('t8t-tc-username');
                                }else if(this.type == 'edit'){
                                    settleConfig.id = this.detailInfo.id;
                                    settleConfig.updateUser = +Cookie.get('t8t-tc-uid');
                                    settleConfig.updateBy = Cookie.get('t8t-tc-username');
                                    rows.editedRows.forEach((item)=>{
                                        if(item.itemFormulaType == 1 && !item.itemFormula){
                                            flag = false;
                                        }
                                        settleConfig.settleConfigItemList.push({
                                            id: item.id,
                                            settleItemWholeCode: item.settleItemWholeCode, //结算项
                                            receiptsType: +item.receiptsType,
                                            itemFormulaType: +item.itemFormulaType,
                                            itemFormula: +item.itemFormula
                                        });
                                    })
                                    settleConfig.settleConfigItemDeleteIds = rows.deletedIDs;
                                }
                                if(!flag){
                                    this.$message.error('计算方式为公式时计算公式必填！');
                                    return;
                                }
                                if(
                                    settleConfig.settleConfigItemList.length === 0 &&
                                    (
                                    (this.type == 'add') ||
                                    (this.type == 'edit' && this.settleItemLength === 0) ||
                                    (this.type == 'edit' && this.settleItemLength > 0 && this.settleItemLength == settleConfig.settleConfigItemDeleteIds.length)
                                    )
                                ){
                                    this.$message.error('结算项不能为空！');
                                    return;
                                }
                                let productTemps = this.$refs['productTemplateTable'].dataSource;
                                productTemps.forEach((item)=>{
                                    settleConfig.pkgTempIds.push(item.id);
                                })
                                if(settleConfig.pkgTempIds.length === 0){
                                    this.$message.error('请选择产品包模板！');
                                    return;
                                }
                                let result = null;
                                if(this.type == 'add'){
                                    result = Model.settleConfigCreate({settleConfig: settleConfig});
                                }else if(this.type == 'edit'){
                                    result = Model.settleConfigUpdate({settleConfig: settleConfig});
                                }
                                result.then((res)=>{
                                    if(res.data.status === 200){
                                        this.$msgbox({
                                            title: '',
                                            type: 'success',
                                            message: '提交成功！',
                                            callback: ()=>{
                                                this.$router.push({
                                                    path: '/tuchat-delivery/settle-setting/index',
                                                    query: { refresh: 1 }
                                                })
                                            }
                                        })
                                    }else if([42701,42702,41703,42704,42711].indexOf(res.data.status) > -1){
                                        this.$msgbox({
                                            title: '',
                                            type: 'error',
                                            message: res.data.result
                                        })
                                    }else{
                                        this.$msgbox({
                                            title: '',
                                            type: 'error',
                                            message: '提交失败！'
                                        })
                                    }
                                }).catch((error)=>{
                                    this.$msgbox({
                                        title: '',
                                        type: 'error',
                                        message: '提交失败！'
                                    })
                                })
                            }
                        })
                    }
                })
            }
        }
	}
</script>
<style scoped>
    .t8t-full-dialog2 .my-toolbar {
        margin-bottom: 15px;
        margin-left: 30px;
        margin-top: 12px;
    }
</style>
