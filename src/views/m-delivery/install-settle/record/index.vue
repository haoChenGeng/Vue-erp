<template>
	<div>
		<t8t-breadcrumb></t8t-breadcrumb>
		<t8t-search
            :fields="fields"
            :selectSource="commonData"
            ref="t8tSearch"
            @change="onChange"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-toolbar
            @VIEW="view"
            @VERIFY="verify"
            @PRINT="print"
            @APPROVAL-FLOW="approvalFlow"
            @APPLY_PAY="repay"
            @EXPORT="exportData"
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
        <flow :flowId="flowId" v-if="flowDialogShow" @close="flowDialogShow=false"></flow>
	</div>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import printPDFUtils from 'src/utils/printPDF.js'
    import exportUtils from 'src/utils/export.js'
    import flow from './flow.vue'
	export default {
        components:{
            flow
        },
		data(){
			return {
                selectedRows: [],
                fields: [
                    {type: 'input',label: '项目ID',name: 'projectId'},
                    {type: 'input',label: '收款人',name: 'receiptorName'},
                    // {type: 'input',label: '结算单号',name: 'billCode'},
                    // {type: 'select',label: '结算对象',name: 'settleObjectType', selectSourceKey:'settleObject',filterable:true},
                    {type: 'select',label: '结算类型',name: 'settleTypeWholeCode', selectSourceKey:'settleType',filterable:true},
                    {type: 'select',label: '组织',name: 'organizationId', selectSourceKey:'org',filterable:true},
                    {
                        type: 'popup',
                        label: '产品包',
                        name: 'productPkgId',
                        textValue: 'pkgName',
                        filedValue: 'id',
                        triggerOnFocus:false,
                        remote: true,
                        service: Service.PRSPQM.name,
                        method: Service.PRSPQM.methods.productPackageQueryPage,
                        remoteArgs:{ page: 1, size: 20},
                        remoteQueryKey:"pkgName_like",
                        dialog: {
                            title: '产品包',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '产品包名称', name: 'pkgName_like'},
                                ]
                            },
                            table:{
                                service: Service.PRSPQM.name,
                                method: Service.PRSPQM.methods.productPackageQueryPage,
                                args:{},
                                radioCol:true,
                                columns:[
                                {
                                    prop: 'id',
                                    label: 'ID',
                                },
                                {
                                    prop: 'pkgName',
                                    label: '产品包名称'
                                }
                                ]
                            }
                        }
                    },
                    {type: 'select',label: '审核状态',name: 'verifyStatus', selectSourceKey:'verifyStatus',filterable:true},
                    {type: 'select',label: '付款状态',name: 'remitStatus', selectSourceKey:'remitStatus',filterable:true},
                    {type: 'select',label: '时间类型',name: 'timeType',selectSourceKey:'dateTypes',filterable:true},
                    {type: 'datetime',label: '开始时间',name: 'startTime', disabled: true},
                    {type: 'datetime',label: '截止时间',name: 'endTime', disabled: true},
                    // {type: 'datetime',label: '审核时间自',name: 'verifyTime_gt'},
                    // {type: 'datetime',label: '审核时间至',name: 'verifyTime_lt'},
                    // {type: 'datetime',label: '付款时间自',name: 'remitTime_gt'},
                    // {type: 'datetime',label: '付款时间至',name: 'remitTime_lt'},
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
                    ],
                    verifyStatus: [
                        {
                            text: '审核中',
                            value: 1
                        },
                        {
                            text: '审核通过',
                            value: 2
                        },
                        {
                            text: '审核不通过',
                            value: 3
                        }
                    ],
                    remitStatus: [
                        {
                            text: '待付款',
                            value: 1
                        },
                        {
                            text: '付款中',
                            value: 2
                        },
                        {
                            text: '已完成',
                            value: 3
                        },
                        {
                            text: '付款失败',
                            value: 4
                        }
                    ],
                    org: [],
                    bizType: [],
                    dateTypes: [
                        {
                            text: '创建时间',
                            value: 'createTime'
                        },
                        {
                            text: '审核时间',
                            value: 'verifyTime'
                        },
                        {
                            text: '付款时间',
                            value: 'remitTime'
                        }
                    ]
                },
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'childs'
                },
                columns:[
                    {prop: 'billCode', label: '单据编码'},
                    {prop: 'projectId', label: '项目ID'},
                    {prop: 'organizationName', label: '组织'},
                    {prop: 'bizTypeName', label: '业务类型'},
                    {prop: 'productPkgName', label: '产品包'},
                    {prop: 'settleObjectType', label: '结算对象', list: 'settleObject'},
                    {prop: 'settleTypeName', label: '结算类型'},
                    {prop: 'receiptorName', label: '收款人'},
                    {prop: 'receiptorId', label: '收款人ID'},
                    {prop: 'settleAmount', label: '结算金额', formatter: function(val, row, col, table){
                        return parseFloat(row.settleAmount).toFixed(2);
                    }},
                    // {prop: 'payType', label: '付款方式',list: 'payType'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                    {prop: 'verifyStatus', label: '审核状态', list: 'verifyStatus'},
                    {prop: 'verifyTime', label: '审核时间', formatter: 'dateParser'},
                    {prop: 'verifyUserName', label: '审核人'},
                    {prop: 'remitStatus', label: '付款状态', list: 'remitStatus'},
                    {prop: 'remitTime', label: '付款时间', formatter: 'dateParser'}
                ],
                service: Service.PSSET.name,
                method: Service.PSSET.methods.settleInstallBillQueryPage,
                args: {sort: ['verifyStatus_asc','createTime_desc']},
                flowDialogShow: false,
                flowId: null
			}
		},
        created(){
            this.commonData.settleType = Model.getCommonOptionsByWholeCode('4!427!42702');
            this.commonData.bizType = Model.getCommonOptions({ pPropertyCode: '11008'});
            this.getTree();
            this.getOrg();
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
            onChange(val,name){
                let formData = this.$refs['t8tSearch'].getFormData();
                if(name == 'timeType'){
                    if(val == ''){
                        this.fields[8].disabled = true;
                        this.fields[9].disabled = true;
                    }else{
                        this.fields[8].disabled = false;
                        this.fields[9].disabled = false;
                    }
                    this.$refs['t8tSearch'].setFormData({'startTime': ''});
                    this.$refs['t8tSearch'].setFormData({'endTime': ''});
                }
            },
			submitSearch(obj){
                if(obj['timeType'] && obj['startTime'])
                    obj[obj['timeType'] + '_gt'] = obj['startTime'];
                if(obj['timeType'] && obj['endTime'])
                    obj[obj['timeType'] + '_lt'] = obj['endTime'];
                delete obj['timeType'];
                delete obj['startTime'];
                delete obj['endTime'];
                this.args = { search: obj,sort: this.args.sort }
			},
            getTree(){
                Model.settleConfigListAsTree({isAll: 0}).then((res)=>{
                    this.treeData = res.data.result;
                }).catch((error)=>{

                })
            },
            getOrg(){
                let args = {page:1,size:150,search:{typeCode:'001003010',isDel: 0}};
                commonApi.queryAll(args).then((res)=>{
                    let list = [];
                    if(res.data.status === 200){
                        res.data.result.rows.forEach((item)=>{
                            list.push({
                                text:item.name,
                                value:item.id
                            });
                        })
                        this.commonData.org = list;
                    }else{

                    }
                }).catch()
            },
			onTreeClick(nodeData){

			},
			selectionChange(rows){
                this.selectedRows = rows;
                let verifyStatus = true;
                for(let i in rows){
                    if(rows[i].verifyStatus != 1){
                        verifyStatus = false;
                    }
                }
                if(false === verifyStatus){
                    this.$refs['toolbar'].disableBySymbol('VERIFY');
                }else{
                    this.$refs['toolbar'].unDisableBySymbol('VERIFY');
                }
            },
			verify(){
                let selections = this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！');
                } else if(selections.length > 1){
                    this.$message.error('只能选择一行进行审核！');
                } else if(selections[0].verifyStatus != 1){
                    this.$message.error('结算单审核状态错误！');
                }else{
                    this.$router.push({
                        path: '/tochat-delivery/settle-record/verify',
                        query: {processId: selections[0].processId}
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
                        path: '/tochat-delivery/settle-record/install-detail',
                        query: {id: selections[0].id, billCode: selections[0].billCode,type: 'view'}
                    })
                }
			},
			disabled(){
                let selections = this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！');
                } else{
                    let ids = [];
                    for(let i in selections){
                        selections[i].id && ids.push(selections[i].id);
                    }
                    if(ids.length == 0){
                        this.$message.error('请选择要操作的行！');
                    }
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
			},
            print(){
                //集成点击流
                this.$TCS.addTag('red_13765_028004001004');
                let selections = this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！');
                } else if(selections.length > 1){
                    this.$message.error('只能选择一行进行操作！');
                }else{
                    printPDFUtils({
                        method: Service.PSSET.methods.settleInstallBillPrintById,
                        service: Service.PSSET.name,
                        args: {
                            'id':selections[0].id
                        },
                    })
                }
            },
            approvalFlow(){
                let selections = this.selectedRows;
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！');
                } else if(selections.length > 1){
                    this.$message.error('只能选择一行进行操作！');
                }else{
                    this.flowId = selections[0].id;
                    this.flowDialogShow = true;
                }
            },
            repay(){
                //集成点击流
                this.$TCS.addTag('red_13765_028004001003');
                let selections = this.selectedRows;
                let ids = [];
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！');
                    return;
                }
                selections.forEach((item)=>{
                    ids.push(item.id);
                })
                Model.settleInstallBillApplyRemit({ applyRemit: {ids: ids, updateUser: +Cookie.get('t8t-tc-uid'), updateBy: Cookie.get('t8t-tc-username')}}).then((res) => {
                    if (res.data.status === 200) {
                        this.$message({
                            type: 'success',
                            message: '操作成功！'
                        });
                        this.$refs['t8tTable'].reloadTable();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.message ? res.data.message : '操作失败！'
                        })
                    }
                })

            },
            exportData(){
                let args = {
                        "page": 1,
                        "size": 5000
                    };
                let formData = this.$refs['t8tSearch'].getFormData();
                if(!formData.startTime || !formData.endTime){
                    this.$message.error('请先选择开始时间及截止时间！');
                    return;
                }
                if(JSON.stringify(formData) !== '{}'){
                    var obj = formData;
                    if(obj['timeType'] && obj['startTime'])
                        obj[obj['timeType'] + '_gt'] = obj['startTime'];
                    if(obj['timeType'] && obj['endTime'])
                        obj[obj['timeType'] + '_lt'] = obj['endTime'];
                    delete obj['timeType'];
                    delete obj['startTime'];
                    delete obj['endTime'];
                    args.search = obj;
                    obj = null;
                }
                exportUtils({
                    service: Service.PSSET.name,
                    method: Service.PSSET.methods.settleInstallBillExport,
                    args: args,
                    headers: "单据编码,项目ID,组织,业务类型,结算对象,结算类型,产品包,收款人,收款人ID,结算金额,创建时间,审核状态,审核时间,审核人,付款状态,付款时间",
                    sorts: "billCode,projectId,organizationName,bizTypeName,settleObjectTypeName,settleTypeName,productPkgName,receiptorName,receiptorId,settleAmount,createTimeString,verifyStatusString,verifyTimeString,verifyUserName,remitStatusString,remitTimeString",
                    title: "结算单数据"
                })
                exportUtils({
                    service: Service.PSSET.name,
                    method: Service.PSSET.methods.settleInstallBillExportItem,
                    args: args,
                    headers: "结算单编码,结算项,收支类型,金额,创建时间",
                    sorts: "billCode,settleItemName,receiptsTypeName,settleAmount,createTimeString",
                    title: "费用明细数据"
                })
            }
		}
	}
</script>
