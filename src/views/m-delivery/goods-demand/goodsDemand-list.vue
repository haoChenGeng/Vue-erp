<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :toolbarSymbolList="toolbarSymbolList"
            :toolbarDisabledSymbols="toolbarDisabledSymbols"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"
            :showTree="true"
            :treeData="treeData"
            :treeProps="treeProps"
            @tree-node-click="treeClick"
            :defaultTreeExpandedKeys="[0]"
            @list-view="doView"
            @list-delete="doDelete"
            @list-add="doAdd"
            @list-edit="doEdit"
            @list-supply="supplyBtn"
            @list-receive="receiveBtn"
            @list-close="closeBtn"
            @list-approval-flow="flowBtn"
            @list-cancel="cancelBtn"
            @search-submit="onSearchSubmit"
            @table-row-dobule-click="doView"
            @table-selection-change="selectionChange"
        >
        </t8t-list-view>
        <receipts-table-dialog
            v-if="receiptsTableDialogShow"
            :tableDialogSet="dialogSet"
            @close="closeDialog"
        >
        </receipts-table-dialog>
        <t8t-step-page
            :args="flowArgs"
            :service="flowService"
            :method="flowMethod"
            :dataSource="flowData"
            v-if="isShowFlow"
            @close="closeFlowShow"
        >
        </t8t-step-page>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import ReceiptsTableDialog from './tablesDialog.vue'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    import Service from 'src/services/delivery/Service.js'
    import DemandApi from 'src/services/delivery/demand.js'
    import { formatDate } from './dateLib.js'
    import Cookie from 'js-cookie'

    export default {
        components: {T8tListView, ReceiptsTableDialog, T8tStepPage},
        // watch: {
        //     $route: function () {
        //         this.$refs['list-view'].getTableInstance().reloadTable()
        //     },
        // },
        activated(){
            this.$refs['list-view'].getTableInstance().reloadTable()
        },
        data () {
            var isTimestamp = function(date) {
                if (typeof date === 'string') {
                    return !date.match(/^\d{13}$/)
                } else if (typeof date === 'number') {
                    return !(date + "").match(/^\d{13}$/)
                }
                return true
            };
            return {
                // 详情页路由地址
                detailRoute: '/delivery/demand-view',
                receiptsRoute: '/delivery/demand-receipts',
                editRoute: '/delivery/demand-receipts',

                // service 和 method 目前需要加密
                service: Service.DEMAND.name,
                method: Service.DEMAND.methods.QUERYPAGE,

                deleteMethod: 'M_zlRNDLhfZ7lirdb2h9XfiNHdWdsROiNQH',
                tableArgs: {
                    "search": {
                        "projectId_like": null,
                        "ownerName": null,
                        "workerName": null,
                        "orderCode_like": null,
                        "orderStatus_eq": null,
                        "materialType_eq": null,
                        "goodsDemandSource_eq": null
                    }
                },
                toolbarDisabledSymbols:[],
                // 表头描述
                tableColumns: [
                    {prop: 'orderCode', label: '要货单编号'},
                    {prop: 'organization', label: '组织'},
                    {prop: 'projectId', label: '项目ID'},
                    {prop: 'materialTypeName', label: '材料类型'},
                    {prop: 'goodsDemandSourceName', label: '要货来源'},
                    {prop: 'bizType', label: '业务线类型'},
                    {prop: 'workerName', label: '工长姓名'},
                    {prop: 'ownerName', label: '业主姓名'},
                    {prop: 'orderStatus', label: '状态', list: 'orderStatusOption'},
                    {prop: 'detailAddress', label: '详细地址'},
                    {prop: 'goodsDemandTime', label: '要货日期', formatter(text){
                         let dateString
                        if (text === 0 || text === null) {
                            dateString = ""
                        } else {
                             let objDate = new Date(text * 1000)
                            let _newObj = isTimestamp(text) ? objDate : new Date(text)
                            dateString = formatDate(objDate, 'yyyy-MM-dd')
                        }
                        return dateString
                    }},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'}
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'input', label: '项目ID', name: 'projectId_like'},
                    {type: 'input', label: '要货单号', name: 'orderCode_like'},
                    {type: 'select', label: '单据状态', name: 'orderStatus_eq', selectSourceKey: "orderStatusOption"},
                    {type: 'select', label: '材料类型', name: 'materialType_eq', selectSourceKey: "materialTypeOption"},
                    {type: 'select', label: '要货来源', name: 'goodsDemandSource_eq', selectSourceKey: "goodsDemandOption"}
                ],
                // 搜索项对应值
                searchOptions: {
                    orderStatusOption: [
                        {text: "待发货", value: 0},
                        {text: "已发货", value: 1},
                        {text: "已收货", value: 2},
                        {text: "取消", value: 3},
                        {text: "待审核", value: 4},
                        {text: "已驳回", value: 5},
                        {text: "新建（暂存）", value: 6},
                        {text: "待报备", value: 7}
                    ],
                    materialTypeOption: [],
                    goodsDemandOption: [],

                    installDispatch: [],
                    materialType: [],
                    goodsDemandSource: [],
                    bizTypeId: [],
                    status: []
                },
                receiptsTableDialogShow: false,
                dialogSet: {},
                flowArgs: {},
                flowService: Service.DEMAND.name,
                flowMethod: Service.DEMAND.methods.GETPROCESSDETAILBYID,
                flowData: [],
                isShowFlow: false,
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                sltOrg: 0,
                toolbarSymbolList:['ADD', 'VIEW', 'RECEIVE', 'APPROVAL-FLOW', 'SUPPLY', 'CLOSE', 'CANCEL', 'EDIT']
            }
        },
        created(){
            let _self = this
            DemandApi.queryProperty({}).then((res) => {
                if (!res.data || res.data.status != 200) {
                    _self.$message({
                        message: '参数获取失败！',
                        type: 'error'
                    })
                    return false
                } else {
                    _self.searchOptions.materialTypeOption = res.data.result.materialTypeList
                    _self.searchOptions.goodsDemandOption = res.data.result.demandSourceList
                }
            }).catch((error) => {
                _self.$message(error || "参数获取失败！")
                return false
            })
            this.$nextTick(function(){
                _self.selectionChange({})
            })
            this.getTree()
        },
        methods: {
            treeClick(data){
                this.sltOrg = data.id
                this.tableArgs = {search: {organizationId: data.id}}
            },
            getTree(){
                let _self = this
                DemandApi.queryTreeByType({typeCodes:['001003010']}).then((res) => {
                    if (res.data.status === 200) {
                        _self.treeData = [res.data.result];
                    }
                })
            },
            onSearchSubmit (obj) {
                obj.organizationId = this.sltOrg || null
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
            doView () {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    this.$router.push({
                        path: this.detailRoute,
                        query: {id: selections[0].id}
                    })
                } else {
                    this.$message.error("请选择操作单据后重试")
                }
            },
            doAdd () {
                this.$TCS.addTag('red_5216_010002001008') //点击流
                this.$refs['list-view'].doAdd(this.receiptsRoute)
            },
            doEdit () {
                this.$TCS.addTag('red_5216_010002001013') //点击流
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条要货单后重试！")
                        return false
                    }
                    if(selections[0].replenishType == 1 && selections[0].orderStatus == 5){
                        this.$router.push({path: '/delivery/demand-edit', query: {id:selections[0].id}})
                    }else{
                        this.$router.push({path: this.editRoute, query: {"mode": "edit",id:selections[0].id}})
                    }
                } else {
                    this.$message.error("请选择操作单据后重试")
                }
            },
            supplyBtn() {
                this.$TCS.addTag('red_5216_010002001005') //点击流
                this.$router.push({path: this.receiptsRoute, query: {"mode": "replenish"}})

            },
            closeBtn() {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条要货单后重试！")
                        return false
                    }
                    this.dialogSet = {
                        type: 'close',
                        args: {id: selections[0].id},
                    }
                    this.receiptsTableDialogShow = true
                } else {
                    this.$message.error("请选择操作单据后重试")
                }

            },
            receiveBtn(){
                this.$TCS.addTag('red_5216_010002001004') //点击流
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条要货单后重试！")
                        return
                    }
                    let _self = this
                    this.$confirm('是否确认确认收货？', '收货确认', {
                        type: 'warning',
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                    }).then((confirm) => {
                        this.toolbarDisabledSymbols.push('RECEIVE')
                        let args = {   "id":selections[0].id, "updateUser": Cookie.get('t8t-tc-uid')}
                         DemandApi.confirmReceipt(args).then((res) => {
                            this.toolbarDisabledSymbols.pop()
                            if (res.data && res.data.status == 200) {
                                _self.$msgbox({
                                    title: '消息',
                                    message: '操作成功',
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                _self.$refs['list-view'].getTableInstance().reloadTable()

                            } else {
                                _self.$msgbox({
                                    title: '消息',
                                    message: res.data.message || '操作失败',
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                return
                            }
                        }).catch((error) => {
                            this.toolbarDisabledSymbols.pop()
                            _self.$msgbox({
                                title: '消息',
                                message: error || '操作失败',
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        })
                    })
                } else {
                    this.$message.error("请选择操作单据后重试")
                }
            },
            closeDialog(){
                this.receiptsTableDialogShow = false
            },
            flowBtn() {
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条要货单后重试！")
                        return
                    }
                    if (!selections[0].processId) {
                        this.$message.error("该要货单没有启动流程")
                        return
                    }
                    this.flowArgs = {id: selections[0].id}
                    this.isShowFlow = true
                }else{
                    this.$message.error("请选择操作单据后重试")
                }
            },
            closeFlowShow() {
                this.isShowFlow = false
            },
            selectionChange(rows) {
                if(rows.length > 1){
                    this.toolbarDisabledSymbols = ['VIEW', 'CANCEL', 'APPROVAL-FLOW','EDIT']
                }else if(rows.length == 1){
                    this.toolbarDisabledSymbols = []
                    if(!rows[0]['processId']){
                        this.toolbarDisabledSymbols.push('APPROVAL-FLOW')
                    }
                    if(([1,2,3]).indexOf(rows[0]['orderStatus']) > -1){
                        this.toolbarDisabledSymbols.push('CANCEL')
                    }
                    if(!(rows[0]['orderStatus'] == 6 || (rows[0]['orderStatus'] == 5 && rows[0].canEdit == 1))) {
                        this.toolbarDisabledSymbols.push('EDIT')
                    }
                }else{
                    this.toolbarDisabledSymbols = []
                }
            },
            cancelBtn() {
                let _self = this
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条要货单后重试！")
                        return
                    }
                    if(([1,2,3]).indexOf(selections[0].orderStatus) > -1) {
                        this.$message.error("当前状态不能取消！")
                        return
                    }
                    this.$confirm('是否确认取消要货单？', '取消确认', {
                        type: 'warning',
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                    }).then((confirm) => {
                                this.toolbarDisabledSymbols.push('CANCEL')
                                DemandApi.cancelOrder({
                                id:selections[0].id,
                                updateUser: Cookie.get('t8t-tc-uid')
                            }).then((res) => {
                                this.toolbarDisabledSymbols.pop()
                                if (res.data && res.data.status == 200) {
                                _self.$msgbox({
                                    title: '消息',
                                    message: '操作成功',
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                 _self.$refs['list-view'].getTableInstance().reloadTable()
                                return false
                            } else {
                                let message = ''
                                if(res.data && res.data.status == -2){
                                    message = '该订单已经有部分商品已发货，无法取消'
                                }else{
                                    message = res.data.message || '取消失败'
                                }
                                _self.$msgbox({
                                    title: '消息',
                                    message: message,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                return false
                            }
                        })
                        .catch((error) => {
                                this.toolbarDisabledSymbols.pop()
                                _self.$msgbox({
                                title: '消息',
                                message: error || '取消失败',
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            return false
                        })

                }).catch(() => {
                        // 关闭弹窗
                        return
                    })

                }else{
                    this.$message.error("请选择单条要货单后重试！")
                }

            }
        }
    }
</script>

<style lang="css" scoped>

</style>
<style>

</style>
