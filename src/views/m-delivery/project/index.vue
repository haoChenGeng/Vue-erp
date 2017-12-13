<template>
	<div v-loading.fullscreen.lock="fullscreenLoading">
		<t8t-breadcrumb></t8t-breadcrumb>
		<t8t-search
            ref="t8t-search"
            :fields="fields"
            :selectSource="commonData"
            @change="onChange"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-toolbar
            @VIEW="view"
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
            :customColumn="true"
            :commonData="commonData"
            ref="t8tTable"
            @selection-change="selectionChange"
            @row-double-click="onView"
            @data-loaded="dataLoaded"
        >
        </t8t-table>
	</div>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import exportUtils from 'src/utils/export.js'
    import TemplateOperator1 from 'src/services/delivery/pcm.js'
	export default {
		data(){
			return {
                fullscreenLoading: false,
                fields: [
                    {type: 'input',label: '项目ID',name: 'id'},
                    {type: 'input',label: '业主姓名',name: 'ownerName_eq'},
                    {type: 'input',label: '业主电话',name: 'phone_eq'},
                    {type: 'input',label: '楼盘',name: 'estateName_like'},
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
                    {type: 'select',label: '负责人',name: 'roleType',selectSourceKey:'roleTypes',filterable:true},
                    {
                        type: 'popup',
                        label: '负责人名称',
                        name: 'charge-form-popup',
                        disabled: true,
                        textValue: 'name',
                        filedValue: 'accountId',
                        triggerOnFocus: false,
                        remote: true,
                        service: Service.PRSMDM.name,
                        method: Service.PRSMDM.methods.decorationOrderQueryAccountByRole,
                        remoteArgs:{ page: 1, size: 20, roleType: 0 },
                        remoteQueryKey:"name_like",
                        dialog: {
                            title: '账号搜索',
                            size: 'large',
                            dialogWidth: '850px',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '中文名', name: 'name_like'},
                                    {type: 'input', label: '英文名', name: 'enName_like'}
                                ]
                            },
                            table: {
                                service: Service.PRSMDM.name,
                                method: Service.PRSMDM.methods.decorationOrderQueryAccountByRole,
                                args: {roleType: 0},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'name',
                                        label: '中文名'
                                    },
                                    {
                                        prop: 'enName',
                                        label: '英文名'
                                    },
                                    {
                                        prop: 'nick',
                                        label: '昵称'
                                    }
                                ]
                            }
                        }
                    },
                    {type: 'select',label: '主管',name: 'leaderType',selectSourceKey:'leaderTypes',filterable:true},
                    {
                        type: 'popup',
                        label: '主管名称',
                        name: 'leader-form-popup',
                        disabled: true,
                        textValue: 'name',
                        filedValue: 'accountId',
                        triggerOnFocus: false,
                        remote: true,
                        service: Service.PRSMDM.name,
                        method: Service.PRSMDM.methods.decorationOrderQueryAccountByRole,
                        remoteArgs:{ page: 1, size: 20, roleType: 0 },
                        remoteQueryKey:"name_like",
                        dialog: {
                            title: '账号搜索',
                            size: 'large',
                            dialogWidth: '850px',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '中文名', name: 'name_like'},
                                    {type: 'input', label: '英文名', name: 'enName_like'}
                                ]
                            },
                            table: {
                                service: Service.PRSMDM.name,
                                method: Service.PRSMDM.methods.decorationOrderQueryAccountByRole,
                                args: {roleType: 0},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'name',
                                        label: '中文名'
                                    },
                                    {
                                        prop: 'enName',
                                        label: '英文名'
                                    },
                                    {
                                        prop: 'nick',
                                        label: '昵称'
                                    }
                                ]
                            }
                        }
                    },
                    {type: 'select',label: '门店',name: 'organizationId', selectSourceKey:'org',filterable:true},
                    {type: 'select',label: '时间类型选择',name: 'timeType',selectSourceKey:'dateTypes',filterable:true},
                    {type: 'datetime',label: '开始时间',name: 'startTime', disabled: true},
                    {type: 'datetime',label: '结束时间',name: 'endTime', disabled: true},
                    {type: 'select',label: '时间类型选择',name: 'timeType1',selectSourceKey:'dateTypes',filterable:true},
                    {type: 'datetime',label: '开始时间',name: 'startTime1', disabled: true},
                    {type: 'datetime',label: '结束时间',name: 'endTime1', disabled: true},
                    {type: 'select', label: '项目主状态', name: 'orderMainStatus', selectSourceKey: 'search_mainStatusCode'},
                    {type: 'select', label: '项目子状态', name: 'orderSubStatus', selectSourceKey: 'search_subStatusCode', disabled: true},
                ],
                commonData:{
                    org: [],
                    roleTypes:[
                        {
                            text: '客户经理',
                            value: 'customerManagerId'
                        },
                        {
                            text: '首席设计师',
                            value: 'chiefDesignerId'
                        },
                        {
                            text: '量房设计师',
                            value: 'measureDesignerId'
                        },
                        {
                            text: '木作设计师',
                            value: 'woodDesignerId'
                        },
                        {
                            text: '工程管家',
                            value: 'projectManagerId'
                        },
                        {
                            text: '项目经理',
                            value: 'chiefWorkerId'
                        }
                    ],
                    leaderTypes: [
                        {
                            text: '设计主管',
                            value: 'designLeaderId'
                        },
                        {
                            text: '销售主管',
                            value: 'salesLeaderId'
                        }
                    ],
                    dateTypes: [
                        {
                            text: '分配门店时间',
                            value: 'allotStoreTime'
                        },
/*                        {
                            text: '预计量房时间',
                            value: 'expectMeasureTime'
                        },
                        {
                            text: '实际量房时间',
                            value: 'actualMeasureTime'
                        },*/
                        {
                            text: '到店时间',
                            value: 'visitTime'
                        },
                        {
                            text: '下定时间',
                            value: 'depositTime'
                        },
                        {
                            text: '预售时间',
                            value: 'advanceTime'
                        },
                        {
                            text: '签约时间',
                            value: 'contractTime'
                        },
                        {
                            text: '实际开工时间',
                            value: 'startTime'
                        },
                        {
                            text: '实际竣工时间',
                            value: 'completedTime'
                        },
                        {
                            text: '最后更新时间',
                            value: 'updateTime'
                        },
                    ],
                    search_mainStatusCode: [],
                    search_subStatusCode: [],
                },
                columns:[
                	{prop: 'id', label: '项目ID',show: true},
                    {prop: 'ownerName', label: '业主姓名',show: true},
                	{prop: 'address', label: '地址',show: true, width:300, formatter:function(val, row, col, table){
                            return (row.decorationOrderVO.cityName || '') + (row.decorationOrderVO.standardTownName || '') + (row.decorationOrderVO.estateName || '') + (row.decorationOrderHouseVO.houseAddress || '')
                    }},
                	{prop: 'productPkgName', label: '产品包',show: true},
                	{prop: 'houseArea', label: '面积',show: true},
                    {prop: 'contractTotalAmount', label: '合同总金额',show: true},
                	{prop: 'projectStatus', label: '项目状态',show: true, formatter:function(val, row, col, table){
                            return row.decorationOrderVO.orderMainStatusName + '/' + row.decorationOrderVO.orderSubStatusName
                    }},
                	{prop: 'organizationName', label: '门店',show: true},
                    /*{prop: 'salesLeaderName', label: '销售主管',show: true},
                    {prop: 'designLeaderName', label: '设计主管',show: true},*/
                	{prop: 'customerManagerName', label: '客户经理',show: true},
                	{prop: 'chiefDesignerName', label: '首席设计师',show: true},
                	{prop: 'projectManagerName', label: '工程管家',show: true},
                	{prop: 'chiefWorkerName', label: '项目经理',show: true},
                	/*{prop: 'allotStoreTime', label: '分配门店时间',show: true},
                	{prop: 'expectMeasureTime', label: '预计量房时间',show: true, formatter: 'dateParser'},
                    {prop: 'actualMeasureTime', label: '实际量房时间',show: true,formatter: 'dateParser'},
                    {prop: 'visitTime', label: '到店时间',show: true,formatter: 'dateParser'},*/
                    {prop: 'depositTime', label: '下定时间',show: true,formatter: 'dateParser'},
                    {prop: 'advanceTime', label: '预售时间',show: true,formatter: 'dateParser'},
                    {prop: 'contractTime', label: '签约时间',show: true,formatter: 'dateParser'},
                    {prop: 'contractStartTimeString', label: '合同开工时间',show: true},
                    {prop: 'contractCompletedTimeString', label: '合同竣工时间',show: true},
                    {prop: 'startTime', label: '实际开工时间',show: true,formatter: 'dateParser'},
                    {prop: 'completedTime', label: '实际竣工时间',show: true,formatter: 'dateParser'},
                    {prop: 'updateTime', label: '最近更新时间',show: true,formatter: 'dateParser'},
                ],
                service: Service.PRSMDM.name,
                method: Service.PRSMDM.methods.decorationOrderQuerySheetPage,
                args: {
                    fields: ["id", "bizTypeId", "productPkgId", "orderPriceId", "decoratePattern", "decorateRange", "decorateType", "needExpedite", "phoneId", "ownerId", "cityId", "townId", "estateId", "houseStatus", "transferStatus", "organizationId", "orderMainStatus", "orderSubStatus", "activityId", "auditId", "auditGroup","createTime","createUser","updateTime","updateUser","customerManagerId","chiefDesignerId","measureDesignerId","woodDesignerId","chiefWorkerId","projectManagerId","orderId", "budget", "preferStyleId", "remarks", "expectMeasureTime", "expectDecorateTime", "expectTransferTime","orderId", "houseAddress", "houseType", "houseStyle", "houseStruct", "houseArea", "houseValuationArea", "houseCoordinate","orderId", "isPrimary", "appellation", "wechatId", "qqId","startTime","completedTime","ownerName","estateName"]
                },
                roleTypeRelation:{
                    'designLeaderId': 1,
                    'salesLeaderId': 2,
                    'customerManagerId': 10,
                    'chiefDesignerId': 11,
                    'measureDesignerId': 12,
                    'woodDesignerId': 13,
                    'projectManagerId': 14,
                    'chiefWorkerId': 15
                }
			}
		},
        created(){
            this.getOrg();
            //主状态
            TemplateOperator1.queryPropertyUnion({page: 1, size: 200, search: {pPropertyCode: "109"}}).then((res) => {
                if (res.data.status === 200) {
                    let searchList = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        searchList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                    }
                    this.commonData.search_mainStatusCode = searchList;
                }
            });
        },
		methods:{
            dataLoaded(dataSource){
                dataSource.forEach((item,index)=>{
                    item.decorationOrderVO = item.decorationOrderVO || {};
                    item.decorationOrderHouseVO = item.decorationOrderHouseVO || {};
                    item.decorationOrderExtVO = item.decorationOrderExtVO || {};
                    item.decorationOrderOtherVO = item.decorationOrderOtherVO || {};
                    dataSource[index].id = item.decorationOrderVO.id;
                    dataSource[index].ownerName = item.decorationOrderVO.ownerName;
                    dataSource[index].productPkgName = item.decorationOrderVO.productPkgName;
                    dataSource[index].houseArea = item.decorationOrderHouseVO.houseArea;
                    dataSource[index].contractTotalAmount = item.decorationOrderOtherVO.contractTotalAmount;
                    dataSource[index].organizationName = item.decorationOrderVO.organizationName;
                    dataSource[index].salesLeaderName = item.decorationOrderOtherVO.salesLeaderName;
                    dataSource[index].designLeaderName = item.decorationOrderOtherVO.designLeaderName;
                    dataSource[index].customerManagerName = item.decorationOrderVO.customerManagerName;
                    dataSource[index].chiefDesignerName = item.decorationOrderVO.chiefDesignerName;
                    dataSource[index].projectManagerName = item.decorationOrderVO.projectManagerName;
                    dataSource[index].chiefWorkerName = item.decorationOrderVO.chiefWorkerName;
                    dataSource[index].allotStoreTime = item.decorationOrderOtherVO.allotStoreTime;
                    dataSource[index].expectMeasureTime = item.decorationOrderVO.expectMeasureTime;
                    dataSource[index].actualMeasureTime = item.decorationOrderOtherVO.actualMeasureTime;
                    dataSource[index].visitTime = item.decorationOrderOtherVO.visitTime;
                    dataSource[index].depositTime = item.decorationOrderOtherVO.depositTime;
                    dataSource[index].advanceTime = item.decorationOrderOtherVO.advanceTime;
                    dataSource[index].contractTime = item.decorationOrderOtherVO.contractTime;
                    dataSource[index].startTime = item.decorationOrderVO.startTime;
                    dataSource[index].completedTime = item.decorationOrderVO.completedTime;
                    dataSource[index].contractStartTimeString = item.decorationOrderOtherVO.contractStartTimeString;
                    dataSource[index].contractCompletedTimeString = item.decorationOrderOtherVO.contractCompletedTimeString;
                    dataSource[index].updateTime = item.decorationOrderVO.updateTime;
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
            onChange(val,name){
                let formData = this.$refs['t8t-search'].getFormData();
                let key = formData.roleType;
                if(name == 'roleType'){
                    if(val == ''){
                        this.fields[6].disabled = true;
                    }else{
                        this.fields[6].disabled = false;
                    }
                    this.fields[6].remoteArgs = {page:1, size: 20,roleType: this.roleTypeRelation[key]};
                    this.$refs['t8t-search'].$refs['charge-form-popup'][0].setTableArgs({roleType: this.roleTypeRelation[key]});
                    this.$refs['t8t-search'].setFormData({'charge-form-popup': ''}); //清空名称输入框
                }
                key = formData.leaderType;
                if(name == 'leaderType'){
                    if(val == ''){
                        this.fields[8].disabled = true;
                    }else{
                        this.fields[8].disabled = false;
                    }
                    this.$set(this.fields[8], 'remoteArgs' , {page:1, size: 20,roleType: this.roleTypeRelation[key]});
                    this.$refs['t8t-search'].$refs['leader-form-popup'][0].setTableArgs({roleType: this.roleTypeRelation[key]})
                    this.$refs['t8t-search'].setFormData({'leader-form-popup': ''}); //清空名称输入框
                }
                if(name == 'timeType'){
                    if(val == ''){
                        this.fields[11].disabled = true;
                        this.fields[12].disabled = true;
                    }else{
                        this.fields[11].disabled = false;
                        this.fields[12].disabled = false;
                    }
                    this.$refs['t8t-search'].setFormData({'startTime': ''});
                    this.$refs['t8t-search'].setFormData({'endTime': ''});
                }
                if(name == 'timeType1'){
                    if(val == ''){
                        this.fields[14].disabled = true;
                        this.fields[15].disabled = true;
                    }else{
                        this.fields[14].disabled = false;
                        this.fields[15].disabled = false;
                    }
                    this.$refs['t8t-search'].setFormData({'startTime1': ''});
                    this.$refs['t8t-search'].setFormData({'endTime1': ''});
                }
                if(name == 'orderMainStatus'){
                    if(val == ''){
                        this.$refs['t8t-search'].setFormData({'orderSubStatus': null});
                        this.fields[17].disabled = true;
                    }else{
                        this.fields[17].disabled = false;
                    }
                    this.commonData.search_subStatusCode = []
                    this.$refs['t8t-search'].setFormData({orderSubStatus:null})
                    TemplateOperator1.queryPropertyUnion({page: 1, size: 200, search: {pPropertyCode: val}}).then((res) => {
                    if (res.data.status === 200) {
                        let searchList = [];
                        let rows = res.data.result;
                        for (let i in rows) {
                            searchList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                        }
                        this.commonData.search_subStatusCode = searchList;
                    }
                    }).catch(() =>{

                    })
                }
            },
			submitSearch(obj){
                if(obj['roleType'] && obj['charge-form-popup'])
                    obj[obj['roleType'] + '_eq'] = obj['charge-form-popup'];
                if(obj['leaderType'] && obj['leader-form-popup'])
                    obj[obj['leaderType'] + '_eq'] = obj['leader-form-popup'];
                if(obj['timeType'] && obj['startTime'])
                    obj[obj['timeType'] + '_gt'] = obj['startTime'];
                if(obj['timeType'] && obj['endTime'])
                    obj[obj['timeType'] + '_lt'] = obj['endTime'];
                if(obj['timeType1'] && obj['startTime1'])
                    obj[obj['timeType1'] + '_gt'] = obj['startTime1'];
                if(obj['timeType1'] && obj['endTime1'])
                    obj[obj['timeType1'] + '_lt'] = obj['endTime1'];
                delete obj['charge-form-popup'];
                delete obj['roleType'];
                delete obj['leader-form-popup'];
                delete obj['leaderType'];
                delete obj['timeType'];
                delete obj['startTime'];
                delete obj['endTime'];
                delete obj['timeType1'];
                delete obj['startTime1'];
                delete obj['endTime1'];
                let fields = this.args.fields;
                this.args = { search: obj, fields: fields };
			},
            onView(row){
                this.$router.push({
                    path: '/tuchat-delivery/project/detail',
                    query: { projectId: row.id, type: 'view' }
                })
            },
			view(){
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length === 0) {
                    this.$message.error('请选择要操作的行！')
                }else if(selections.length > 1){
                    this.$message.error('只能选择一行进行操作！')
                } else{
                    this.$router.push({
                        path: '/tuchat-delivery/project/detail',
                        query: { projectId: selections[0].decorationOrderVO.id, type: 'view' }
                    })
                }
			},
            exportData(){
                let args = {
                    fields : this.args.fields
                };
                let formData = this.$refs['t8t-search'].getFormData();
                if(JSON.stringify(formData) !== '{}'){
                    var obj = formData;
                    if(obj['roleType'] && obj['charge-form-popup'])
                        obj[obj['roleType'] + '_eq'] = obj['charge-form-popup'];
                    if(obj['leaderType'] && obj['leader-form-popup'])
                        obj[obj['leaderType'] + '_eq'] = obj['leader-form-popup'];
                    if(obj['timeType'] && obj['startTime'])
                        obj[obj['timeType'] + '_gt'] = obj['startTime'];
                    if(obj['timeType'] && obj['endTime'])
                        obj[obj['timeType'] + '_lt'] = obj['endTime'];
                    if(obj['timeType1'] && obj['startTime1'])
                        obj[obj['timeType1'] + '_gt'] = obj['startTime1'];
                    if(obj['timeType1'] && obj['endTime1'])
                        obj[obj['timeType1'] + '_lt'] = obj['endTime1'];
                    delete obj['charge-form-popup'];
                    delete obj['roleType'];
                    delete obj['leader-form-popup'];
                    delete obj['leaderType'];
                    delete obj['timeType'];
                    delete obj['startTime'];
                    delete obj['endTime'];
                    delete obj['timeType1'];
                    delete obj['startTime1'];
                    delete obj['endTime1'];
                    args.search = obj;
                    obj = null;
                }
                exportUtils({
                    service: Service.PRSMDM.name,
                    method: Service.PRSMDM.methods.decorationOrderExportSheet,
                    args: args,
                    headers: "项目ID,业主姓名,地址,产品包,面积,合同总金额,项目状态,门店,客户经理,首席设计师,工程管家,项目经理,下定时间,预售时间,签约时间,合同开工时间,合同竣工时间,实际开工时间,实际竣工时间,最新更新时间",
                    sorts: "id,ownerName,wholeAddress,productPkgName,houseArea,contractTotalAmount,orderStatusName,organizationName,customerManagerName,chiefDesignerName,projectManagerName,chiefWorkerName,depositTimeString,advanceTimeString,contractTimeString,contractStartTimeString,contractCompletedTimeString,startTimeString,completedTimeString,updateTimeString",
                    title: "项目列表"
                })
            },
		}
	}
</script>
