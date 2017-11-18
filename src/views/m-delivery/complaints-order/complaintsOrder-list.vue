<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"

            @list-view="doView"
            @list-add="doAdd"

            @list-operation-record="showRecord"
            @list-handle="handleBtn"
            @list-approve="approveBtn"
            @list-upgrade="doUpgrade"
            @list-approval-flow="showFlow"
            @list-export="doExport"
            @list-export-detail="doExportDetail"
            @search-submit="onSearchSubmit"

            :beforeSearchSubmit="beforeSubmit"
            @table-row-dobule-click="doView"
            @table-selection-change="selectionChange"
        >
        </t8t-list-view>
        <record-table-dialog
            v-if="recordTableDialogShow"
            :orderCode="orderCode"
            @close="closeRecordDialog"
        >
        </record-table-dialog>
        <t8t-step-page
            :args="flowArgs"
            :service="flowService"
            :method="flowMethod"
            :dataSource="flowData"
            v-if="isShowFlow"
            @close="closeFlowShow"
        >
        </t8t-step-page>

        <el-dialog class="complaints-deal-dialog" :title="dialogFields.title" v-model="complaintsDialog"
                   @close="closeComplaintsDialog" ref="complaintsDialogRef"
                   v-loading.body.lock="complaintsLoading"
                   element-loading-text="加载中">
            <div class="textarea-container">
                <el-form ref="complaintsTable"
                         label-position="right"
                         label-width="80px"
                         :model="complaintsformData"
                         :rules="updataRule">
                    <el-form-item v-for="field in dialogFields.fields" :label="field.label" :prop="field.prop">
                        <el-select  v-if="field.type === 'select'" v-model="complaintsformData[field.prop]" placeholder="--请选择--">
                            <el-option v-for="item in searchOptions[field.list]" :label="item.text" :value="item.value"></el-option>
                        </el-select>
                        <el-input v-else-if="field.type === 'textarea'" type="textarea" v-model="complaintsformData[field.prop]" :autosize="{ minRows: 5, maxRows: 12 }"></el-input>
                        <el-select  v-if="field.type === 'select-option-group'" v-model="complaintsformData[field.prop]" placeholder="--请选择--">
                            <el-option-group
                                v-for="group in searchOptions[field.list]"
                                :label="group.label">
                                <el-option
                                    v-for="item in group.options"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="updataSubmit">确定</el-button>
                <el-button @click="closeComplaintsDialog">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import RecordTableDialog from './recordDialog.vue'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import exportUtils from 'src/utils/export.js'
    import ComplaintApi from 'src/services/delivery/complaint.js'
    import Service from 'src/services/delivery/Service.js'
    import Cookie from 'js-cookie'
    export default {
        components: {T8tListView, RecordTableDialog, T8tStepPage,BasePanel},
        // watch: {
        //     $route: function () {
        //         this.$refs['list-view'].getTableInstance().reloadTable()
        //     },
        // },
        activated(){
            this.$refs['list-view'].getTableInstance().reloadTable()
        },
        data () {
            return {
                dialogFields: {},
                complaintsDialog: false,
                complaintsLoading: false,
                orderCode:null,
                recordTableDialogShow: false,
                flowArgs: {},
                flowService: Service.COMPLAINT.name,
                flowMethod: Service.COMPLAINT.methods.COMPLAINTORDERGETPROCESSDETAILBYID,
                flowData: [],
                isShowFlow: false,
                // 面包屑
                breadcrumbData: [{title: '交付管理'}, {title: '客服管理'}, {title: '投诉管理'}],
                // 详情页路由地址
                detailRoute: '/delivery/complaints-order-detail?mode=add',
                // service 和 method 目前需要加密
                service: Service.COMPLAINT.name,
                method: Service.COMPLAINT.methods.COMPLAINTSORDERQUERYPAGE,
                tableArgs: {},
                // 表头描述
                tableColumns: [
                    {prop: 'orderCode', label: '投诉单号'},
                    {prop: 'projectId', label: '项目ID'},
                    {prop: 'organizationId', label: '组织',formatter:function(val,row){ return row.organizationName}},
                    {prop: 'bizTypeId', label: '业务类型', formatter:function(val,row){return row.bizTypeName}},
                    {prop: 'productPkgId', label: '产品包ID'},
                    {prop: 'complaintType', label: '投诉类型', list: 'complaintTypeList'},
                    {prop: 'complaintLevel', label: '投诉等级', list: 'complaintLevel'},
                    {prop: 'orderStatus', label: '投诉状态', list: 'statusOption'},
                    {prop: 'objectName', label: '投诉对象'},
                    {prop: 'specificName', label: '具体名称'},
                    {prop: 'visitorName', label: '回访人ID'},
                    {prop: 'handlerName', label: '处理人'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                    {prop: 'closeTime', label: '关闭时间', formatter: 'dateParser'},
                    {prop: 'upgradeTime', label: '升级时间', formatter: 'dateParser'},
                    {prop: 'handlingTime', label: '处理完成时间', formatter: 'dateParser'},
                    {prop: 'visitFollowTime', label: '回访跟进时间', formatter: 'dateParser'},
                    {prop: 'handleFollowTime', label: '处理跟进时间', formatter: 'dateParser'}
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'input', label: '投诉单号', name: 'orderCode'},
                    {type: 'input', label: '项目ID', name: 'projectId'},
                    {type: 'select',label: '状态',name: 'orderStatus',selectSourceKey: 'statusOption'},
                    {type: 'select', label: '投诉对象', name: 'complaintObjectId', selectSourceKey: 'complaintObjectOption'},
                    {type: 'select', label: '投诉等级', name: 'complaintLevel', selectSourceKey: 'complaintLevel'},
                    {
                        type: 'datepicker',
                        label: '创建时间',
                        name: 'createTime',
                        pickertype: 'daterange',
                        startField: 'createTime_gte',
                        endField: 'createTime_lte'
                    },
                    {
                        label: '投诉升级时间',
                        type: 'datepicker' ,
                        name: 'upgradeTime',
                        pickertype: 'daterange',
                        startField: 'upgradeTime_gte',
                        endField: 'upgradeTime_lte'
                    },
//                    {type: 'select', label: '组织', name: 'organizationId', selectSourceKey: 'organizationList'},
                    {
                        type: 'datepicker',
                        label: '处理完成时间',
                        name: 'handleFollowTime',
                        pickertype: 'daterange',
                        startField: 'handlingTime_gte',
                        endField: 'handlingTime_lte'
                    },
                    {
                        name: 'closeTime',
                        type: 'datepicker' ,
                        label: '关闭时间',
                        pickertype:'daterange',
                        startField: 'closeTime_gte',
                        endField: 'closeTime_lte'
                    },
                    {type: 'select', label: '业务类型', name: 'bizTypeId', selectSourceKey: 'bizTypeList'},
                    {type: 'select', label: '产品包', name: 'productPkgId', selectSourceKey: 'productPkgList'},
                ],
//                treeProps: {
//                    label: 'name',
//                    children: 'children'
//                },
//                treeData: {
//                    search:{
//
//                    },
//                    page:1,
//                    size:20
//                },
                // 搜索项对应值
                searchOptions: {
                    bizTypeId: [],
                    complaintSource: [],
                    complaintObjectOption: [],
                    complaintTypeList: [
                        {value: 1, text: "正式投诉"},
                        {value: 2, text: "潜在投诉"}
                    ],
                    complaintType: [
                        {text: '登录人组织', value: 1},
                        {text: '投诉人上级', value: 2},
                        {text: '项目负责人', value: 3},
                    ],
                    statusOption: [
                        {value:0,text:"无状态"},
                        {value:1,text:"暂存"},
                        {value:2,text:"待受理"},
                        {value:3,text:"投诉中"},
                        {value:4,text:"待关闭"},
                        {value:5,text:"已关闭"}
                        ],
                    visitPersonId: [],
                    handlerId: [],
                    complaintLevel: [],
                    upgradeReason: [],
                    complaintPhase: [],

                    visitorOption:[],
                    handlerOption:[],
                    organizationList:[],
                    bizTypeList:[],
                    productPkgList:[]
                },
                visitorFields: {
                    title: '变更回访人',
                    fields: [
                        {
                            type: 'select',
                            label: '分配类型',
                            prop: 'complaintType',
                            list: 'complaintType',
                            editor: {
                                type: 'select',
                            }
                        }, {
                            type: 'select-option-group',
                            label: '回访人',
                            prop: 'visitorId',
                            list: 'visitorOption',
                            editor: {
                                type: 'select',
                            }
                        }]
                },
                handlerFields: {
                    title: '变更处理人',
                    fields: [
                        {
                            type: 'select',
                            label: '分配类型',
                            prop: 'complaintType',
                            list: 'complaintType'
                        }, {
                            type: 'selectoption-group',
                            label: '处理人',
                            prop: 'handlerId',
                            list: 'handlerOption'
                        }]
                },
                updataFields: {
                    title: "投诉升级",
                    fields: [
                        {
                            type: 'select',
                            label: '变更等级',
                            prop: 'complaintLevel',
                            list: 'complaintLevel'
                        }, {
                            type: 'select',
                            label: '升级原因',
                            prop: 'upgradeReason',
                            list: 'upgradeReason'
                        }, {
                            type: 'textarea',
                            label: '备注',
                            prop: 'remark'
                        }
                    ]
                },
                updateType:null,
                updataRule:{},
                complaintsformData:{},
                dealer: Cookie.get('t8t-tc-username'),
                dealerId:Cookie.get('t8t-tc-uid'),
                sltOrg: 0
            }
        },
        created(){
//            let _self = this
//            ComplaintApi.queryTreeByType({}).then((res) => {
//                if(res.data.status === 200){
//                    this.treeData = [res.data.result];
//                }
//            })
            this.getPkgObj()
            this.getComplaintObj()
            this.getConfigList()
        },
        methods: {
            getPkgObj(){
                let _list = []
                ComplaintApi.productPackageQueryPage({page:1,size:100}).then((res) => {
                    if(res.data.status != 200) {
                        this.$message.error("产品包获取失败")
                        return
                    }
                    res.data.result.rows.forEach((item) => {
                        _list.push({text: item.pkgName, value: item.id})
                    })
                    this.searchOptions.productPkgList = _list
                }).catch(()=>{
                    return
                })
            },
            getConfigList() {
                ComplaintApi.queryUnionParent({search: {pPropertyCodes: [41301,41302,41303,41304,11008]}, page: 1, size: 100}).then((res) => {
                    if (res.data.status != 200) {
                        this.$message.error("配置获取失败")
                        return
                    }
                    let _list = {
                        "41301":[],
                        "41302":[],
                        "41303":[],
                        "41304":[],
                        "11008":[]
                    }
                    res.data.result.forEach((item) => {
                        _list[item.pPropertyCode].push({text: item.propertyName, value: item.id})
                    })
                    this.searchOptions.complaintSource =_list["41302"]
                    this.searchOptions.complaintLevel = _list["41301"]
                    this.searchOptions.upgradeReason = _list["41304"]
                    this.searchOptions.bizTypeList = _list["11008"]
                }).catch(() => {
                    return
                })
            },
            getComplaintObj() {
                ComplaintApi.complaintObjectQueryList({}).then((res) => {
                    if (res.data.status != 200) {
                        this.$message.error("投诉对象获取失败")
                        return
                    }
                    let _list = []
                    res.data.result.forEach(item => {
                        _list.push({value:item.id, text:item.complaintObjectName})
                    })
                    this.searchOptions.complaintObjectOption = _list
                }).catch(() => {
                    return
                })
            },
            onSearchSubmit (obj) {
//                if(this.sltOrg) {
//                    obj.organizationId = this.sltOrg
//                }
                this.tableArgs = {"search": obj}
            },
            onchange (val) {

            },
            doDelete () {
                let deletePromise = this.$refs['list-view'].doDelete()
                let that = this
                if (deletePromise) {
                    deletePromise.then((res) => {
                        if (res.data && res.data.status == 200 && res.data.result > 0) {
                            that.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            that.$refs['list-view'].getTableInstance().reloadTable()
                        }
                    })
                }
            },
            doView (val) {
                if(typeof (val) === 'object') {
                    this.$router.push({path: this.detailRoute, query: {"mode": "view",id:val.id}})
                    return
                }
                this.$refs['list-view'].doView(this.detailRoute)
            },
            doAdd () {
                this.$refs['list-view'].doAdd(this.detailRoute)
            },
            doEdit () {
                this.$refs['list-view'].doEdit(this.detailRoute)
            },
            doFollow() {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条单据后重试")
                        return
                    }
                    this.$router.push({path: this.detailRoute, query: {"mode": "follow",id:selections[0].id}})
                } else {
                    this.$message.error("请选择单条单据后重试")
                    return
                }
            },
            showRecord() {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条单据后重试")
                        return
                    }
                    if(selections[0].orderCode) {
                        this.orderCode = selections[0].orderCode
                        this.recordTableDialogShow = true
                    }else{

                        this.$message.error("单据编码获取失败")
                        return
                    }
                } else {
                    this.$message.error("请选择单条单据后重试")
                    return
                }

            },
            closeRecordDialog() {
                this.recordTableDialogShow = false
            },
            showFlow() {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条单据后重试")
                        return
                    }
                    this.flowArgs={id:selections[0].id}
                    this.isShowFlow = true
                } else {
                    this.$message.error("请选择单条单据后重试")
                    return
                }
            },
            closeFlowShow(){
                this.isShowFlow = false
            },
            doChangeViewer() {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条单据后重试")
                        return
                    }

                    this.complaintsformData = {
                        complaintType:null,
                        upgradeReason:null
                    }
                    this.dialogFields = this.visitorFields
                    this.updateType = "viewer"
                    this.updataRule = {
                        complaintType: [
                            {
                                required: true,
                                message: '请选择升级等级'
                            }
                        ],
                        upgradeReason: [
                            {
                                required: true,
                                message: '请填写升级原因'
                            }]
                    }
                    this.getVisitorAndHandler(selections[0],1)
                    this.complaintsDialog = true
                } else {
                    this.$message.error("请选择单条单据后重试")
                    return
                }
            },
            doChangeHandler() {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条单据后重试")
                        return
                    }
                    this.complaintsformData = {
                        complaintType: null,
                        upgradeReason: null
                    }
                    this.dialogFields = this.handlerFields
                    this.updateType = "viewer"
                    this.updataRule = {
                        complaintType: [
                            {
                                required: true,
                                message: '请选择升级等级'
                            }
                        ],
                        upgradeReason: [
                            {
                                required: true,
                                message: '请填写升级原因'
                            }]
                    }
                    this.getVisitorAndHandler(selections[0],2)
                    this.complaintsDialog = true
                } else {
                    this.$message.error("请选择单条单据后重试")
                    return
                }
            },
            doUpgrade() {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条单据后重试")
                        return
                    }
                    this.complaintsformData = {
                        upgradeReason:null,
                        complaintLevel:selections[0].complaintLevel,
                        remark:null
                    }
                    this.updataRule = {
                        complaintLevel: [
                            {
                                required: true,
                                message: '请选择升级等级'
                            }
                        ],
                        upgradeReason: [
                            {
                                required: true,
                                message: '请填写升级原因'
                            }]
                    }
                    this.updateType = 'upGrade'
                    this.dialogFields = this.updataFields
                    this.complaintsDialog = true
                } else {
                    this.$message.error("请选择单条单据后重试")
                    return
                }
            },
            closeComplaintsDialog() {
                this.complaintsDialog = false
            },
            //导出
            doExport() {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    let _list = []
                    selections.forEach(item => {
                        _list.push(item.id)
                    })
                    let exportArgs = {
                        page:1,
                        size:1000,
                        search:{
                            id_in:_list
                        },
                        sort:["id_desc"]
                    }
                    exportUtils({
                        service: Service.COMPLAINT.name,
                        method: Service.COMPLAINT.methods.COMPLAINTSORDERQUERYPAGE,
                        args: exportArgs,
                        headers: '投诉单号,项目ID,组织,业务类型,产品包,投诉类型,投诉等级,投诉状态,投诉来源,投诉对象,具体名称,投诉阶段,升级原因,回访人,处理人,创建人,创建时间,投诉时间,处理时间,关闭时间',
                        sorts: "orderCode,projectId,organizationName,bizTypeName,productPkgName,complaintTypeName,levelName,statusName,sourceName,objectName,specificName,phaseName,reasonName,visitorName,handlerName,createName,createDate,complaintDate,handlingDate,closeDate"
                    })
                }else{
                    this.$message.error("请选择要导出的单据")
                    return
                }
            },
            //详细导出
            doExportDetail(){
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    let _list = []
                    selections.forEach(item => {
                        _list.push(item.id)
                    })
                    let exportArgs = {
                        page:1,
                        size:1000,
                        search:{
                            id_in:_list
                        },
                        sort:["id_desc"]
                    }
                    exportUtils({
                        service: Service.COMPLAINT.name,
                        method: Service.COMPLAINT.methods.COMPLAINTSORDEREXPORTDETAIL,
                        args: exportArgs,
                        headers: '投诉单号,项目ID,组织,业务类型,产品包,投诉类型,投诉等级,投诉状态,投诉来源,投诉对象,具体名称,投诉内容,投诉阶段,升级原因,回访人,处理人,创建人,创建时间,投诉时间,处理时间,关闭时间',
                        sorts: "orderCode,projectId,organizationName,bizTypeName,productPkgName,complaintTypeName,levelName,statusName,sourceName,objectName,specificName,content,complaintPhase,upgradeReason,visitorName,handlerName,createBy,createDate,complaintDate,handlingDate,closeDate"
                    })
                }else{
                    this.$message.error("请选择要导出的单据")
                    return
                }
            },
            updataSubmit(){
                this.$refs["complaintsTable"].validate((validate) => {
                    if(validate) {
                        let selections = this.$refs['list-view'].getTableInstance().getSelectRows()
                        let _args = {updateDTO:{
                            "accountId": this.dealerId,
                            "id": selections[0].id,
                            "orderCode": selections[0].orderCode,
                            "updateBy": this.dealer,
                            "updateName": this.dealer,
                            "complaintLevel":this.complaintsformData.complaintLevel,
                            "upgradeReason":this.complaintsformData.upgradeReason,
                            "remark":this.complaintsformData.remark
                        }}
                        ComplaintApi.complaintsOrderhandUpgrade(_args).then(res=>{
                            if(res.data.status === 200) {
                                this.$msgbox({
                                    title: '消息',
                                    message:  "操作成功 ",
                                    type: 'success',
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.$refs['list-view'].getTableInstance().reloadTable()
                                this.closeComplaintsDialog()
                            }else{
                                this.$msgbox({
                                    title: '消息',
                                    message:  res.data.message || "操作失败",
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                return
                            }

                        }).catch(error => {
                            console.log(error)
                            return
                        })
                    }
                })
            },
//            treeClick(data){
//                this.sltOrg = data.id
//                if(this.sltOrg) {
//                    this.tableArgs = {search: {organizationId: data.id}}
//                }else{
//                    this.tableArgs = {search: {}}
//                }
//
//            },
            //获取回访人、处理人
            getVisitorAndHandler(row,type) {
                return false
//                let _arg
//                let _self = this
//                console.log(row)
//                _arg = {
//                    "objectId": row.complaintObjectId,
//                    "pkgId": row.productPkgId,
//                    "specificId": row.specificNameId || null,
//                    "yid": parseInt(row.projectId),
//                    "staffType":type
//                }
//                ComplaintApi.vistorOrHandleQuery(_arg).then( res =>{
////                    if(res.data.status != 200 ){
//                        _self.$message.error("回访人/处理人获取失败")
//                        console.log(res)
//                        let _list = [
//                            {"accountId": 1788,"distributionType": 1,"isDefault": 0,"name": "tealin3","staffType": 1},
//                            {"accountId": 20924,"distributionType": 1,"isDefault": 0,"name": "tealin3","staffType": 1},
//                            {"accountId": 20924,"distributionType": 2,"isDefault": 0,"name": "tony","staffType": 1},
//                            {"accountId": 20924,"distributionType": 2,"isDefault": 0,"name": "tealin3","staffType": 2},
//                            {"accountId": 4,"distributionType": 1,"isDefault": 0,"name": "tony","staffType": 2},
//                            {"accountId": 5,"distributionType": 1,"isDefault": 0,"name": "tealin3","staffType": 2},
//                            {"accountId": 6,"distributionType": 2,"isDefault": 0,"name": "tony","staffType": 2},
//                            {"accountId": 1788,"distributionType": 2,"isDefault": 0,"name": "tealin3","staffType": 1},
//                            {"accountId": 20924,"distributionType": 2,"isDefault": 0,"name": "tealin3","staffType": 2},
//                        ]
//                        let handlerList =  [{label: '上级',options: []}, {label: '项目负责人',options: []}]
//                        let visitorList =[{label: '上级',options: []},  {label: '项目负责人',options: []}]
//                        _list.forEach((item) => {
//                            if(item.staffType === 1) visitorList[item.distributionType - 1].options.push({value:item.accountId, label:item.name})
//                            if(item.staffType === 2) handlerList[item.distributionType - 1].options.push({value:item.accountId, label:item.name})
//                        })
//                        console.log(visitorList,handlerList)
//
//                        _self.searchOptions.visitorOption = visitorList
//                        _self.searchOptions.handlerOption = handlerList
//                        console.log(this.searchOptions)


//                        _self.handlerList[_self.dataSource.projectId + '' + row.complaintObjectId + _self.dataSource.productPkgId + row.specificNameId] = resultList
//                        _self.visitorList[_self.dataSource.projectId + '' + row.complaintObjectId + _self.dataSource.productPkgId + row.specificNameId] = resultList
//
//                            return
//                    }
//                    return
//                    let _visitorList = []
//                    let _handlerList = []
//                    res.data.result.forEach(item => {
//                        if(item.staffType === 1) _visitorList.push({text:item.name,value:item.accountId})
//                        if(item.staffType === 2) _handlerList.push({text:item.name,value:item.accountId})
//                    })
//                    this.searchOptions.visitorOption = _list
//                    this.searchOptions.handlerOption = _list
//                }).catch(error => {
//                    console.log(error)
//                })
            },
            selectionChange(rows) {
//                this.$refs['list-view'].getToolbarInstance().disableBySymbol('CHANGE-VIEWER')
//                this.$refs['list-view'].getToolbarInstance().disableBySymbol('CHANGE-HANDLER')
                let viewStatus = false,
                    flowStatus = false,
                    editStatus = false,
                    upgradeStatus = false,
                    recodeStatus = false,
                    followStatus = false,
                    handle = false,
                    approve = false
                if (rows.length > 0) {
                    if (rows.length === 1) {
                        viewStatus = true
                        recodeStatus = true
                        for (let i in rows) {
                            editStatus = rows[i].orderStatus < 3 ? true : false
                            flowStatus = rows[i].processId ? true : false
                            upgradeStatus = rows[i].orderStatus < 5 && rows[i].orderStatus > 0 ? true : false
                            followStatus = rows[i].orderStatus < 5 && rows[i].orderStatus > 0 ? true : false
                            handle = !rows[0].processId ||  rows[0].orderStatus != 3 ? false : true
                            approve = !rows[0].processId || rows[0].orderStatus != 4 ? false : true
                        }
                    }
                }else {
                    this.$refs['list-view'].getToolbarInstance().unDisableBySymbol('CHANGE-VIEWER')
                    this.$refs['list-view'].getToolbarInstance().unDisableBySymbol('CHANGE-HANDLER')
                    viewStatus = flowStatus = editStatus = upgradeStatus = recodeStatus = followStatus = true
                }
                viewStatus ? this.$refs['list-view'].getToolbarInstance().unDisableBySymbol('VIEW') : this.$refs['list-view'].getToolbarInstance().disableBySymbol('VIEW')
                recodeStatus ? this.$refs['list-view'].getToolbarInstance().unDisableBySymbol('OPERATION-RECORD') : this.$refs['list-view'].getToolbarInstance().disableBySymbol('OPERATION-RECORD')
                editStatus ? this.$refs['list-view'].getToolbarInstance().unDisableBySymbol('EDIT') : this.$refs['list-view'].getToolbarInstance().disableBySymbol('EDIT')
                upgradeStatus ? this.$refs['list-view'].getToolbarInstance().unDisableBySymbol('UPGRADE') : this.$refs['list-view'].getToolbarInstance().disableBySymbol('UPGRADE')
                flowStatus ? this.$refs['list-view'].getToolbarInstance().unDisableBySymbol('APPROVAL-FLOW') : this.$refs['list-view'].getToolbarInstance().disableBySymbol('APPROVAL-FLOW')
                followStatus ? this.$refs['list-view'].getToolbarInstance().unDisableBySymbol('FOLLOW') : this.$refs['list-view'].getToolbarInstance().disableBySymbol('FOLLOW')
                handle ? this.$refs['list-view'].getToolbarInstance().unDisableBySymbol('HANDLE') : this.$refs['list-view'].getToolbarInstance().disableBySymbol('HANDLE')
                approve ? this.$refs['list-view'].getToolbarInstance().unDisableBySymbol('APPROVE') : this.$refs['list-view'].getToolbarInstance().disableBySymbol('APPROVE')
            },
            handleBtn(){
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条单据后重试")
                        return
                    }
                    if(!selections[0].processId || selections[0].handlerId != this.dealerId || selections[0].orderStatus != 3) {
                        this.$message.error("不能处理选中的单据")
                        return
                    }
                    this.$router.push({path: this.detailRoute, query: {"mode": "complete",procInsId:selections[0].processId}})
                } else {
                    this.$message.error("请选择单条单据后重试")
                    return
                }
            },
            approveBtn(){
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条单据后重试")
                        return
                    }
                    if(!selections[0].processId || selections[0].visitorId != this.dealerId || selections[0].orderStatus != 4) {
                        this.$message.error("不能审核选中的单据")
                        return
                    }
                    this.$router.push({path: this.detailRoute, query: {"mode": "approve",procInsId:selections[0].processId}})
                } else {
                    this.$message.error("请选择单条单据后重试")
                    return
                }
            }
        }
    }
</script>

<style lang="css" scoped>



</style>
<style>
    .complaints-deal-dialog .t8t-form-panel{
        max-width:380px !important;
        min-width:300px
    }
    .complaints-deal-dialog .t8t-form-panel .el-form>.el-row>.el-col {
        width: 300px !important;
        float: none !important;
    }
</style>
