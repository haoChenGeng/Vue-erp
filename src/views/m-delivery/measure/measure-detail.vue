<template>
    <div id="measure-detail">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog v-loading.fullscreen.lock="fullscreenLoading" @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            @EDIT="edit"
                            @SUBMIT="submit"
                            @APPROVAL-FLOW="approval"
                            ref="detailToolbar"
                            class="t8t-dark"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <div class="full-dialog-form-container">
                        <t8t-audit
                            v-if="auditShow"
                            :auditForm="auditform"
                            ref="t8taudit">
                        </t8t-audit>
                    </div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-tabs v-model="tab_info">
                            <el-tab-pane label="基本信息" name="basic">
                                <el-form class="dialog2-form-container" :model="detailInfo" ref="formRef" label-position="right" label-width="120px" :rules="formRefrules">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="编号：" prop="billCode">
                                            <el-input placeholder="提交时自动生成" v-model="detailInfo.billCode" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业主姓名：" prop="ownerName">
                                            <el-input v-model="detailInfo.ownerName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="项目ID：" prop="projectId">
                                            <el-input v-model="detailInfo.projectId" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="排期节点：" prop="scheduleNodeName">
                                            <el-input v-model="detailInfo.scheduleNodeName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="组织：" prop="organizationName">
                                            <el-input v-model="detailInfo.organizationName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="测量状态：" prop="orderStatus">
                                            <el-select v-model="detailInfo.orderStatus" placeholder="--请选择--" disabled>
                                                <el-option v-for="item in selectSource.orderStatusOption" :label="item.text" :value="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="测量人：" prop="measurer">
                                            <el-input v-model="detailInfo.measurer" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="测量人类型：" prop="measurerTypeName">
                                            <el-input v-model="detailInfo.measurerTypeName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <!--<div class="dialog2-form-item-container">
                                        <el-form-item label="测量人电话：" prop="measurerPhoneId">
                                            <el-input v-model="detailInfo.measurerPhoneId" disabled></el-input>
                                        </el-form-item>
                                    </div>-->
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="计划测量时间：" prop="planMeasureTime">
                                            <t8t-datetime-picker
                                                disabled
                                                :bindValue="!detailInfo.planMeasureTime ? '' : detailInfo.planMeasureTime * 1000"
                                                type="datetime"
                                            >
                                            </t8t-datetime-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="实际测量时间：" prop="realMeasureTime">
                                            <t8t-datetime-picker
                                                :disabled="pageType == 'measure-edit' ? false : true"
                                                :bindValue="detailInfo.realMeasureTime"
                                                v-model="detailInfo.realMeasureTime"
                                                type="datetime"
                                            >
                                            </t8t-datetime-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="驳回原因：" prop="rejectReason">
                                            <el-input type="textarea" v-model="detailInfo.rejectReason" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="其他信息" name="other">
                                <el-form class="dialog2-form-container" :model="detailInfo" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业主ID：">
                                            <el-input v-model="detailInfo.ownerId" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业主姓名：">
                                            <el-input v-model="detailInfo.ownerName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <!--<div class="dialog2-form-item-container">
                                        <el-form-item label="业主电话：">
                                            <el-input v-model="detailInfo.ownerPhoneId" disabled></el-input>
                                        </el-form-item>
                                    </div>-->
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="工长ID：">
                                            <el-input v-model="detailInfo.workerId" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="工长姓名：">
                                            <el-input v-model="detailInfo.workerName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <!--<div class="dialog2-form-item-container">
                                        <el-form-item label="工长电话：">
                                            <el-input v-model="detailInfo.workerPhoneId" disabled></el-input>
                                        </el-form-item>
                                    </div>-->
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="创建人ID：">
                                            <el-input v-model="detailInfo.createUser" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="创建人：">
                                            <el-input v-model="detailInfo.createUserName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="创建时间：">
                                            <el-date-picker
                                                disabled
                                                :value="!detailInfo.createTime ? '' : detailInfo.createTime * 1000"
                                                type="datetime"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="详细地址：">
                                            <el-input type="textarea" v-model="detailInfo.detailAddress" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-form-container">
                        <el-tabs v-model="tab_detail" @tab-click="handleTabClick">
                            <el-tab-pane v-for="(item,index) in tableList" :label="item.kind" :name="'tab_' + item.kindId">
                                <t8t-table
                                    :columns="columns.detailTable"
                                    :dataSource="item.orderItemVOS"
                                    :pageBar="false"
                                    :indexCol="true"
                                    :commonData="selectSource"
                                    :selectCol="false"
                                    ref="detailT8tTable"
                                    @row-double-click="showLine"
                                >
                                    <template slot="goodsCode" scope="scope">
                                        <a href="javascript:;" @click="showLine(scope.row)">{{scope.row['goodsCode']}}</a>
                                    </template>
                                </t8t-table>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-dialog>
        <lineView
            v-if="lineViewAble"
            :title="title"
            :itemId="itemId"
            :orderType="pageType"
            @close="lineViewAble=false"
            @submit="lineSubmit"
            @reloadTable="reloadItemTable"
        >
        </lineView>
        <t8t-step-page
            :args="flowArgs"
            :service="flowService"
            :method="flowMethod"
            :dataSource="flowData"
            v-if="isShowFlow"
            @close="closeStepPage"
        >
        </t8t-step-page>
    </div>
</template>

<script>
    import Utils from 'src/utils/Utils.js'
    import T8tAudit from 'src/components/t8t-audit/t8t-audit.vue'
    import Cookie from 'js-cookie'
    import COLUMNS from './columns'
    import LineView from './measure-lineView.vue'
    import T8tDatetimePicker from 'src/components/t8t-form/dateTimePicker.vue'
    import MeasureApi from 'src/services/delivery/measure'
    import Service from 'src/services/delivery/Service'

    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'

    let orderId
    let pageType
    let processId
    export default {
        components:{
            LineView,
            T8tAudit,
            T8tDatetimePicker,
            T8tStepPage
        },
        data () {
            return {
                orderId:null,
                flowArgs:{},
                flowService:Service.MEASURE.name,
                flowMethod:Service.MEASURE.methods.processDetail,
                flowData:[],
                isShowFlow:false,
                pageType:'',
                lineViewAble:false,
                title:'',
                tab_detail: '',
                tableList:[],
                columns:COLUMNS,
                isDialogShow: true,
                tab_info: 'basic',
                tabs:{},
                itemId:null,
                fullscreenLoading: false,
                selectSource: {
                    orderStatusOption:[
                        {value: 1,text: "待测量"},
                        {value: 2,text: "待审核"},
                        {value: 3,text: "已完成"}
                    ],
                    scheduleNodeOption:[]
                },
                formRefrules: {
                    realMeasureTime: [
                        {type:'string', required: true, message: "请选择实际测量时间"},
                    ]
                },
                auditForm:false,
                auditShow:false,
                detailInfo: {
                    code:null,
                    bizTypeId:null,
                    projectId:null,
                    scheduleNodeId:null,
                    organizationId:null,
                    orderStatus:null,
                    measurerId:null,
                    measurerType:null,
                    measurerType:null,
                    planMeasureTime:null,
                    realMeasureTime:null,
                    rejectReason:null,
                    ownerId:null,
                    ownerName:null,
                    ownerPhoneId:null,
                    foremanId:null,
                    foremanName:null,
                    foremanPhone:null,
                    createUserId:null,
                    createUser:null,
                    payAdvisorName:null,
                    createTime:null,
                    address:null
                }
            }
        },
        beforeCreate() {
            let routeNodes = this.$route.path.split('/')
            orderId = this.$route.query.id
            processId = this.$route.query.procInsId
            pageType = routeNodes[routeNodes.length - 1]
        },
        created(){
            if(pageType == "measure-approval") {
                this.auditShow = true
                this.fullscreenLoading = true
                MeasureApi.getDetailByProcessId({processId:processId}).then((res)=>{
                    if(res.data && res.data.status == 200) {
                        this.detailInfo = res.data.result
                        this.orderId = this.detailInfo.id
                        this.detailInfo['realMeasureTime'] = res.data.result['realMeasureTime'] * 1000
                        this.reloadItemTable()
                    }else{
                        this.$message.error("详情获取失败！")
                        this.fullscreenLoading = false
//                    history.back()
                        return false
                    }
                })
            }else{
                this.fullscreenLoading = true
                this.orderId = orderId
                this.pageType = pageType
                MeasureApi.queryDetail({id:this.orderId}).then((res)=>{
                    if(res.data && res.data.status == 200) {
                        this.detailInfo = res.data.result
                        if(this.detailInfo.orderStatus > 1) {
                            this.pageType = "measure-view"
                        }
                        this.detailInfo['realMeasureTime'] = res.data.result['realMeasureTime'] * 1000
                        this.reloadItemTable()
                    }else{
                        this.$message.error("详情获取失败！")
                        this.fullscreenLoading = false
//                    history.back()
                        return false
                    }
                })
            }
        },
        methods: {
            reloadDetails(){
                this.orderId = orderId
                this.fullscreenLoading = true
                if(this.pageType == "measure-approval") {
                    MeasureApi.getDetailByProcessId({processId:processId}).then((res)=>{
                        if(res.data && res.data.status == 200) {
                            this.detailInfo = res.data.result
                            this.orderId = this.detailInfo.id
                            this.detailInfo['realMeasureTime'] = res.data.result['realMeasureTime'] * 1000
                            this.reloadItemTable()
                        }else{
                            this.$message.error("详情获取失败！")
                            this.fullscreenLoading = false
                            return false
                        }
                    })
                }else{
                    MeasureApi.queryDetail({id:this.orderId}).then((res)=>{
                        if(res.data && res.data.status == 200) {
                            this.detailInfo = res.data.result
                            if(this.detailInfo.orderStatus > 1) {
                                this.pageType = "measure-view"
                            }
                            this.detailInfo['realMeasureTime'] = res.data.result['realMeasureTime'] * 1000
                            this.reloadItemTable()
                        }else{
                            this.$message.error("详情获取失败！")
                            this.fullscreenLoading = false
                            return false
                        }
                    })
                }
            },
            lineSubmit(){
                this.lineViewAble = false
            },
            showLine(val){
                this.itemId = val.id
                this.title= this.pageType == "measure-edit" ? "提交测量数据"  : "查看测量数据"
                this.lineViewAble = true
            },
            closeDialog() {
                if(pageType == "measure-approval") {
                    window.close()
                } else{
                    this.$router.push({ path: '/delivery/measure-list' })
                }
            },
            handleTabClick(tab,e){
                if(typeof this.tabs[this.tab_detail] === 'undefined' || true !== this.tabs[this.tab_detail]){
                    let checkItemId = this.tab_detail.substr(4);
                    if(this.getCheckDetail(checkItemId)){
                        this.tabs[this.tab_detail] = true;
                    }
                }
            },
            getCheckDetail(checkItemId){
                checkItemId = parseInt(checkItemId);
                this.tabs['tab_' + checkItemId] = true; //标识已切换过
                this.tab_detail = 'tab_' + checkItemId; //当前显示tab
            },
            edit(){
                if(this.detailInfo.orderStatus > 1) {
                    this.$message.error('该单据状态不能修改')
                    return false
                }
                this.pageType = "measure-edit"
                this.$router.replace({ path: '/delivery/measure-edit', query: {id: this.orderId } })
            },
            submit(){
                if(pageType == "measure-approval" && this.detailInfo.orderStatus == 2) {
                    let verifyForm = this.$refs['t8taudit'].ruleForm
                    let args = {
                        "verifyDTO" : {
                            "id" : this.orderId,
                            "disagreeReason" : verifyForm.idea,
                            "agreeType" : verifyForm.agree,
                            "verifyUser": Cookie.get('t8t-tc-uid')
                        }
                    }
                    if(this.$refs['t8taudit'].validate(validate => {
                            if(validate)
                            MeasureApi.verify(args).then((res) => {
                                if(res.data.status == 200) {
                                    this.$msgbox({
                                        title: '消息',
                                        message: "审批成功",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    },function(){
                                        window.close()
                                    })
                                }else {
                                    this.$msgbox({
                                        title: '消息',
                                        message: res.data.message,
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                }
                            }).catch((error) => {

                            })
                        }));
                    return false
                }else if(this.detailInfo.orderStatus < 2) {
                    let emptyList = []
                    if(this.tableList.length > 0) {
                        this.tableList.forEach((item) => {
                            for(let i=0;i<item.orderItemVOS.length;i++) {
                                if(item.orderItemVOS[i].measureDosage == 0 || item.orderItemVOS[i].measureDosage == 'undefined'){
                                    emptyList.push(item.orderItemVOS[i].id)
                                }
                            }
                        })
                        if(emptyList.length > 0) {
                            this.$message.error('单据还有未提交的测量用量，不能提交！')
                            return false
                        }
                    }else{
                        this.$message.error('该单据没有品类，不能提交！')
                        return false
                    }
                    this.$refs['formRef'].validate(valid=>{
                        if (valid) {
                            let args = {
                                "id":this.orderId,  //单头id
                                "realMeasureTime":this.dateFormate(this.detailInfo.realMeasureTime),
                                "userId":Cookie.get('t8t-tc-uid')
                            }
                            this.$refs['detailToolbar'].disableBySymbol("SUBMIT")
                            MeasureApi.submit({submitOrderDTO:args}).then((res)=>{
                                this.$refs['detailToolbar'].unDisableBySymbol("SUBMIT")
                               let _this = this
                                if(res.data.status == 200) {
                                    this.$msgbox({
                                        title: '消息',
                                        message: "提交成功",
                                        showCancelButton: false,
                                        type: 'success',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    }).then((res) =>{
                                        _this.$router.push({ path: '/delivery/measure-list'})
                                    })
                                }else{
                                    this.$msgbox({
                                        title: '消息',
                                        message: res.data.message,
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                }
                            }).catch((error) => {
                                this.$refs['detailToolbar'].unDisableBySymbol("SUBMIT")
                                this.$msgbox({
                                    title: '消息',
                                    message: error,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            })
                        }
                        else {
                            return false
                        }
                    })
                }else{
                    this.$message.error("该单据状态不可进行此操作")
                }
            },
            approval(){
                this.flowArgs = {id:parseInt(this.orderId)}
                this.isShowFlow = true
            },
            closeStepPage(){
                this.isShowFlow = false
            },
            dateFormate(timeStr){
                return Date.parse(timeStr).toString().substr(0,10)
            },
            reloadItemTable(){
                MeasureApi.queryItemList({id:this.orderId}).then((res)=>{
                    this.fullscreenLoading = false
                    if(res.data && res.data.status == 200) {
                        if(res.data.result.length > 0) {
                            this.tableList = res.data.result
                            if(!this.tabs[this.tab_detail] && this.getCheckDetail(this.tableList[0].kindId)){
                                this.tabs[this.tab_detail] = true;
                            }
                        }
                    }else{
                        this.$message.error("详情获取失败！")
//                        history.back()
                        return false
                    }
                })
            }
        }
    };
</script>

<style>
</style>

<style lang="css" scoped>
    .full-dialog-tabs-container{ width: 1600px; margin: 0 auto}
    .checkItem{
        margin-bottom: 30px;
    }
    .checkItem h3{
        margin-bottom: 15px;
        border-left: 4px solid #6b6b6b;
        padding-left: 6px;
        height: 20px;
        line-height: 20px;
    }
    .checkItem .checkItem_detail{
        padding-left: 20px;
    }
    .my-table{
        border-left: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
        font-size: 14px;
    }
    .my-table td{
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
        height: 32px;
        line-height: 32px;
    }
    .table-row{
        margin-top: 10px;
        margin-bottom: 10px;
    }
    #measure-detail .t8t-table-container {
        min-height: 400px;
        margin-top: 10px;
    }
    #measure-detail .full-dialog-form-container {
        overflow: visible;
    }
</style>
