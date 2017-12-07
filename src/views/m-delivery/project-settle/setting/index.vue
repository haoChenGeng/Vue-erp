<template>
	<div>
		<t8t-breadcrumb></t8t-breadcrumb>
		<t8t-search
            :fields="fields"
            :selectSource="commonData"
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
                	@EDIT="edit"
                	@VIEW="view"
                	@VOID="disabled"
                    @VIEW_TEMPLATE="viewTemplate"
                    ref="toolbar"
                >
                </t8t-toolbar>
                <t8t-table
                    :columns="columns"
                    :service="service"
                    :method="method"
                    :args="args"
                    :pageBar="true"
                    :indexCol="true"
                    :commonData="commonData"
                    ref="t8tTable"
                    @selection-change="selectionChange"
                >
                </t8t-table>
            </div>
        </div>
        <el-dialog title="产品包模板" v-model="templateDialogVisible" size="large">
            <t8t-table
                :style="{height:'350px'}"
                :columns="templateColumns"
                :pageBar="true"
                :editable="false"
                :selectCol="false"
                :service="templateService"
                :method="templateMethod"
                :args="templateArgs"
                @close="templateDialogVisible=false"
            >
            </t8t-table>
        </el-dialog>
	</div>
</template>
<script>
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
	export default {
		data(){
			return {
                selectedRows: [],
                fields: [
                    {type: 'select',label: '结算对象',name: 'settleObjectType', selectSourceKey:'settleObject',filterable:true},
                    {type: 'select',label: '结算类型',name: 'settleTypeWholeCode', selectSourceKey:'settleType',filterable:true},
                    {type: 'select',label: '状态',name: 'settleConfigStatus', selectSourceKey:'settleStatus',filterable:true},
                    {type: 'datetime',label: '生效时间自',name: 'effectTime_gt'},
                    {type: 'datetime',label: '生效时间至',name: 'effectTime_lt'},
                ],
                commonData:{
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
                	settleType: [],
                	settleStatus: [
                        {
                            text: '启用',
                            value: 0
                        },
                        {
                            text: '作废',
                            value: 1
                        }
                    ],
                    payType: [
                        {
                            text: '银行卡付款',
                            value: 1
                        },
                        {
                            text: '账户付款',
                            value: 2
                        }
                    ]
                },
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'childs'
                },
                columns:[
                	{prop: 'bizTypeName', label: '业务类型'},
                	{prop: 'settleObjectType', label: '结算对象', list: 'settleObject'},
                	{prop: 'settleTypeName', label: '结算类型'},
                	{prop: 'payType', label: '付款方式', list: 'payType'},
                	{prop: 'settleConfigStatus', label: '状态', list: 'settleStatus'},
                	{prop: 'effectTime', label: '生效时间', formatter: 'dateParser'},
                    {prop: 'expireTime', label: '失效时间', formatter: 'dateParser'},
                	{prop: 'createBy', label: '创建人'},
                	{prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                    {prop: 'invalidBy', label: '作废人'},
                    {prop: 'invalidTime', label: '作废时间', formatter: 'dateParser'},
                ],
                service: Service.PSSET.name,
                method: Service.PSSET.methods.settleConfigQueryPage,
                args: {
                    sort: ['settleConfigStatus_asc','createTime_desc']
                },
                templateDialogVisible: false,
                templateService: Service.PSSET.name,
                templateMethod: Service.PSSET.methods.settleConfigPkgTempList,
                templateArgs: {},
                templateColumns: [
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
                    }
                ]
			}
		},
        created(){
            this.commonData.settleType = Model.getCommonOptionsByWholeCode('4!427!42702');
            this.getTree();
        },
        // watch:{
        //     $route(val){
        //         if(val.query.refresh == 1){
        //             this.$refs['t8tTable'].reloadTable();
        //         }
        //     }
        // },
        activated(){
            if(this.$route.query.refresh == 1){
                this.$refs['t8tTable'].reloadTable();
            }
        },
		methods:{
			submitSearch(obj){
                let args = this.args;
                if(typeof args.search === 'undefined'){
                    args.search = Object.assign({},obj);
                }else{
                    args.search = Object.assign({},args.search,obj);
                }
                this.args = Object.assign({},args);
			},
            getTree(){
                Model.settleConfigListAsTree({isAll: 0}).then((res)=>{
                    this.treeData = res.data.result;
                }).catch((error)=>{

                })
            },
			onTreeClick(nodeData){
                let args = this.args;
                if(typeof args.search === 'undefined'){
                    args.search = {
                        idCode: nodeData.idCode
                    };
                }else{
                    args.search.idCode = nodeData.idCode;
                }
                this.args = Object.assign({},args);
			},
			selectionChange(rows){
                this.selectedRows = rows;
                let editStatus = true;
                let voidStatus = true;
                for(let i in rows){
                    if(rows[i].updateFlag == false){
                        editStatus = false;
                    }
                    if(rows[i].settleConfigStatus == 1){
                        voidStatus = false;
                    }
                }
                if(false === editStatus){
                    this.$refs['toolbar'].disableBySymbol('EDIT');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('EDIT');
                }
                if(false === voidStatus){
                    this.$refs['toolbar'].disableBySymbol('VOID');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('VOID');
                }
            },
			add(){
				this.$router.push({
					path: '/tochat-delivery/settle-setting/detail',
                    query: {type: 'add'}
				})
			},
			edit(){
                let selections = this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！');
                } else if(selections.length > 1){
                    this.$message.error('只能选择一行进行编辑！');
                }else if(selections[0].settleConfigStatus == 1){
                    this.$message.error('已作废的配置不能编辑！');
                }else{
                    this.$router.push({
                        path: '/tochat-delivery/settle-setting/detail',
                        query: {id: selections[0].id,type: 'edit'}
                    })
                }
			},
			view(){
                let selections = this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！');
                } else if(selections.length > 1){
                    this.$message.error('只能选择一行进行查看！');
                }else{
                    this.$router.push({
                        path: '/tochat-delivery/settle-setting/detail',
                        query: {id: selections[0].id,type: 'view'}
                    })
                }
			},
			disabled(){
                let selections = this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！');
                } else if(selections.length > 1){
                    this.$message.error('一次只能作废一条数据！');
                } else{
                    let ids = [];
                    for(let i in selections){
                        selections[i].id && ids.push(selections[i].id);
                    }
                    if(ids.length == 0){
                        this.$message.error('请选择要操作的行！');
                    }
                    this.$confirm('是否确认作废选中结算配置单？','提示',{
                        type: 'warning'
                    }).then((res)=>{
                        if(res){
                            let data = {ids: ids, updateBy: Cookie.get('t8t-tc-username'), updateUser: +Cookie.get('t8t-tc-uid')};
                            Model.settleConfigSetStatus(data).then((res) => {
                                if (res.data.status === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '作废成功！'
                                    });
                                    this.$refs['t8tTable'].reloadTable();
                                }else{
                                    this.$message({
                                        type: 'error',
                                         message: '作废失败！'
                                    })
                                }
                            })
                        }
                    })
                }
			},
            viewTemplate(){
                let selections = this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择一条需查看的记录！');
                } else if(selections.length > 1){
                    this.$message.error('只能查看一条记录！');
                }else{
                    this.templateArgs = {id: selections[0].id};
                    this.templateDialogVisible = true;
                }
            },
		}
	}
</script>
