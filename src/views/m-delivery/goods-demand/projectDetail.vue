<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new receiptsDialog">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            ref="toolbar"
                            class="t8t-dark"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                    <div class="toggle-btn-container">
                        <div class="toggle-btn el-icon-d-arrow-left" @click="onTopHide"></div>
                    </div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center"
                         v-loading.body.lock="formLoading">
                            <el-tabs v-model="activeTab">
                                <el-tab-pane label="项目详情" name="one">
                                    <el-form ref="mainTable"
                                         label-position="right"
                                         label-width="120px"
                                         :model="dataSource"
                                    >
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="fields"
                                            :options="options || {}"
                                        ></base-panel>
                                    </el-form>
                                </el-tab-pane>
                            </el-tabs>
                    </div>

                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <div class="t8t-detail">
                            <el-tabs v-model="activeTab" class="t8t-detail">
                                <el-tab-pane label="要货单列表" name="one">
                                    <div class="sub-container">
                                        <div class="dialog2-toolbar-container">
                                            <el-button type="primary" size="small" icon="view" @click="doView">查看</el-button>
                                            <el-button type="danger" size="small" icon="close" @click="doCancel" :loading="cancelLoading">取消要货单</el-button>
                                            <el-button type="primary" size="small" @click="doflow">审批流</el-button>
                                            <el-button type="primary" size="small" @click="doReported">工长报备</el-button>
                                            <el-button type="primary" size="small" @click="doEdit">编辑</el-button>
                                        </div>
                                        <!--table-->
                                        <t8t-table
                                            :columns="columns"
                                            :service="service"
                                            :method="method"
                                            :args="args"
                                            ref="table"
                                            :commonData="options || {}"
                                            @row-double-click="handleTableDobuleClick"
                                        ></t8t-table>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <t8t-step-page
            :args="flowArgs"
            :service="flowService"
            :method="flowMethod"
            :dataSource="flowData"
            v-if="isShowFlow"
            @close="closeFlowShow"
        >
        </t8t-step-page>
            <el-dialog title="工长报备"  v-model="reportedDialog" v-if="reportedDialogVisible" @close="reportedDialogVisible = false">
                <el-form :model="reportedFormData" :rules="reportedFormRule" ref="reportedDialog" label-position="right" label-width="100px">
                    <div class="form-item-container">
                        <el-form-item label="工长需要的配送时间：" prop="goodsDemandTime">
                                <el-date-picker
                                    class="date-editor_time"
                                   v-model="reportedFormData.goodsDemandTime"
                                   type="date"
                                   placeholder="请选择需要配送的时间"
                                >
                                </el-date-picker>
                        </el-form-item>
                     </div>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="reportedDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveReported" :loading="reportedButtonLoading">确 定</el-button>
              </div>
            </el-dialog>
    </div>
</template>
<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import Service from 'src/services/delivery/Service.js'
    import api from 'src/services/delivery/demand.js'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    import { formatDate } from './dateLib.js'
    import Cookie from 'js-cookie'
	export default{
		name:"project_demand_list",
        components: {BasePanel, T8tStepPage},
		data(){
            var isTimestamp = function(date) {
                if (typeof date === 'string') {
                    return !date.match(/^\d{13}$/)
                } else if (typeof date === 'number') {
                    return !(date + "").match(/^\d{13}$/)
                }
                return true
            };
			return {
				fields:[
					{type: 'input',label: '项目ID',prop:"projectId",disabled:true},
					{type: 'input',label: '业主姓名',prop:"ownerName",disabled:true},
					{type: 'input',label: '组织',prop:"organizationName",disabled:true},
					{type: 'input',label: '业务类型',prop:"bizTypeName",disabled:true},
					{type: 'input',label: '工长姓名',prop:"workerName",disabled:true}
				],
                isDialogShow:true,
                goBackRoute:'/tochat-delivery/demand-list',
				isTopHide:false,
				activeTab:'one',
				dataSource:{
                    projectId:null,
                    ownerName:null,
                    organizationName:null,
                    bizTypeName:null,
                    workerName:null,
                },
                service: Service.DEMAND.name,
                method: Service.DEMAND.methods.QUERYPAGE,
                args:null,
                cancelLoading:false,
                tableDataSource:{},
                options:{
                    orderStatusOption: [
                        {text: "待发货", value: 0},
                        {text: "已发货", value: 1},
                        {text: "已收货", value: 2},
                        {text: "取消", value: 3},
                        {text: "待审核", value: 4},
                        {text: "已驳回", value: 5},
                        {text: "新建（暂存）", value: 6},
                        {text: "待报备", value: 7}
                    ]
                },
                columns:[
                    {prop:'orderCode', label:'要货单编号',width:'200'},
                    {prop:'materialTypeName', label:'材料类型',width:'200'},
                    {prop:'goodsDemandSourceName', label:'要货来源',width:'200'},
                    {prop:'orderStatus', label:'状态',list: 'orderStatusOption',width:'200'},
                    {prop:'detailAddress', label:'详细地址',width:'600'},
                    {prop:'goodsDemandTime', label:'要货日期',width:'200', formatter(text){
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
                    {prop:'createTime',width:'200', label:'创建时间', formatter:'dateParser'}
                ],
                flowArgs: {},
                flowService: Service.DEMAND.name,
                flowMethod: Service.DEMAND.methods.GETPROCESSDETAILBYID,
                flowData: [],
                isShowFlow:false,
                reportedFormData:{
                    goodsDemandTime:null,
                    id:null
                },
                reportedFormRule:{
                    goodsDemandTime:[
                        { type: 'date', required: true, message: '请选择需要配送的时间', trigger:"change"}
                    ]
                },
                reportedDialogVisible:false,
                reportedDialog:true,
                reportedButtonLoading:false
			}
		},
        created(){
            if(!this.$route.query.projectId){
                let _this = this
                this.$msgbox({
                    title: '消息',
                    type: 'error',
                    message: '参数错误！',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                }, function () {
                    _this.$router.go(-1)
                });
                return false;
            }
            this.args = {search:{"projectId_eq":this.$route.query.projectId}}
            api.queryProjectList({projectId:this.$route.query.projectId, page:1, size:1}).then((res) =>{
                if(res.data.status == 200 && res.data.result.rows.length > 0){
                    this.dataSource = res.data.result.rows[0]
                }
            })

        },
		methods:{
			onTopHide(){
				this.isTopHide = !this.isTopHide
			},
            closeDialog(){
                this.$router.push({path: this.goBackRoute})
            },
            doView(){
                let rows = this.$refs.table.getSelectRows()
                if(rows.length < 1){
                    this.$message.error("请选择单条数据进行操作！")
                    return
                }
                if(rows.length > 1){
                    this.$message.error("请选择单条数据进行操作！")
                    return
                }
                this.$router.push({ path: 'demand-view',query:{id: rows[0]['id']} })
            },
            doCancel(){
                let rows = this.$refs.table.getSelectRows()
                if(rows.length < 1){
                    this.$message.error("请选择单条数据进行操作！")
                    return
                }
                if(rows.length > 1){
                    this.$message.error("请选择单条数据进行操作！")
                    return
                }
                let row = rows[0]
                if(([1,2,3]).indexOf(row.orderStatus) > -1) {
                    this.$message.error("当前状态不能取消！")
                    return
                }
                this.$confirm('是否确认取消要货单？', '取消确认', {
                    type: 'warning',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then((confirm) => {
                            this.cancelLoading = true
                            let _this = this
                            api.cancelOrder({
                            id:row.id,
                            updateUser: Cookie.get('t8t-tc-uid')
                        }).then((res) => {
                            this.cancelLoading = false
                            if (res.data && res.data.status == 200) {
                                    this.$msgbox({
                                        title: '消息',
                                        message: '操作成功',
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    }).then(() =>{
                                        _this.$refs['table'].reloadTable()
                                    })
                                    return false
                        } else {
                            let message = ''
                            if(res.data && res.data.status == -2){
                                message = '该订单已经有部分商品已发货，无法取消'
                            }else{
                                message = res.data.message || '取消失败'
                            }
                            this.$msgbox({
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
                            this.cancelLoading = false
                            this.$msgbox({
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
            },
            doflow(){
                let rows = this.$refs.table.getSelectRows()
                if(rows.length < 1){
                    this.$message.error("请选择单条数据进行操作！")
                    return
                }
                if(rows.length > 1){
                    this.$message.error("请选择单条数据进行操作！")
                    return
                }
               this.flowArgs = {id: rows[0].id}
                this.isShowFlow = true
            },
            closeFlowShow() {
                this.isShowFlow = false
            },
            handleTableDobuleClick(row){
                this.$router.push({ path: 'demand-view',query:{id: row['id']} })
            },
            doReported(){
                let rows = this.$refs.table.getSelectRows()
                if(rows.length < 1){
                    this.$message.error("请选择单条数据进行操作！")
                    return
                }
                if(rows.length > 1){
                    this.$message.error("请选择单条数据进行操作！")
                    return
                }
                let row = rows[0]
                if(row.orderStatus != 7){
                    this.$message.error("请选择待报备的要货单进行操作！")
                    return
                }
                this.reportedFormData.id = row.id
                this.reportedDialog = true
                this.reportedFormData.goodsDemandTime = null
                this.reportedDialogVisible = true
            },
            saveReported(){
                this.$refs.reportedDialog.validate(isValid => {
                    if(isValid){
                        let args = {
                            workerId:Cookie.get('t8t-tc-uid'),
                            goodsDemandTime:+Date.parse(this.reportedFormData.goodsDemandTime).toString().slice(0, -3),
                            id:this.reportedFormData.id
                        }
                        this.reportedButtonLoading = true
                        api.goodsDemandReport(args).then(res => {
                            this.reportedButtonLoading = false
                           let _this = this
                            if(res.data.status == 200){
                                this.$msgbox({
                                    title: '消息',
                                    message: '操作成功',
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                }).then(() =>{
                                    _this.reportedDialogVisible = false
                                     _this.$refs['table'].reloadTable()
                                })
                            }else{
                                this.$msgbox({
                                    title: '消息',
                                    message: res.data.message || '提交失败',
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                        }).catch(res =>{
                            this.reportedButtonLoading = false
                            this.$msgbox({
                                title: '消息',
                                message: res || '提交失败',
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        })
                    }
                })
            },
            doEdit(){
                let rows = this.$refs.table.getSelectRows()
                if(rows.length < 1){
                    this.$message.error("请选择单条数据进行操作！")
                    return
                }
                if(rows.length > 1){
                    this.$message.error("请选择单条数据进行操作！")
                    return
                }
                let row = rows[0]
                if(!(row.orderStatus == 6 || (row.orderStatus == 5 && row.canEdit == 1))){
                    this.$message.error("不能进行此操作！")
                    return
                }
                if(row.replenishType == 1 && row.orderStatus == 5){
                    this.$router.push({
                        path: '/tochat-delivery/demand-edit',
                        query: {id: row.id}
                    })
                } else {
                    this.$router.push({
                        path: '/tochat-delivery/demand-receipts',
                        query: {mode:'edit',id: row.id}
                    })
                }
            }
		}
	}
</script>
