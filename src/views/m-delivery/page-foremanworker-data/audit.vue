<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            ref="toolbar"
                            class="t8t-dark"
                            @SUBMIT="submitForm"
                            @APPROVAL-FLOW="on_approval_flow"
                            @DIMI-SUBMIT="dimiSubmit"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-form
                        	class="dialog2-form-container-column"
                        	:model="approvalFormData"
                        	:rules="approvalFormRule"
                        	ref="approvalForm"
                        	label-position="right"
                        	label-width="120px">
                             <div class="dialog2-form-item-container">
                                <el-form-item label="审批结果" prop="approve">
                                     <el-radio class="radio" v-model="approvalFormData.approve" label="1">通过</el-radio>
                                     <el-radio class="radio" v-model="approvalFormData.approve" label="0">不通过</el-radio>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="审批意见" prop="reason">
									<el-input v-model="approvalFormData.reason" placeholder="请输入审批意见" type="textarea" :rows="4"></el-input>
								</el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-form-container">
                        <el-form
                        	class="dialog2-form-container"
                        	:model="formData.workerUserTaskQueryVO"
                        	ref="formRef"
                        	label-position="right"
                        	label-width="120px"
                        >
                            <div class="dialog2-form-item-container">
                                <el-form-item label="任务ID" prop="id">
									<el-input v-model="formData.workerUserTaskQueryVO.taskId"  :disabled="true"></el-input>
								</el-form-item>
                            </div>
		    				<div class="dialog2-form-item-container">
                                <el-form-item label="流程名" prop="liuc">
									<el-input v-model="taskName" :disabled="true"></el-input>
			 					</el-form-item>
                            </div>
		    				<div class="dialog2-form-item-container">
                                <el-form-item label="发起人" prop="faqi">
									<el-input v-model="formData.workerUserTaskQueryVO.starterName" :disabled="true"></el-input>
			 					</el-form-item>
                            </div>
		    				<div class="dialog2-form-item-container">
                                <el-form-item label="发起时间" prop="time">
									<el-input v-model="formData.workerUserTaskQueryVO.createTime" :disabled="true"></el-input>
								</el-form-item>
                            </div>
                        </el-form>
                    </div>
		       		<div class="full-dialog-tabs-container">
                        <t8t-table
            				ref="tableDebitType"
                            :dataSource="formData.workerInfoVO"
            				:columns="columns"
            				:selectCol="true"
                            :pageBar="false"
            				:commonData="commonData"
                            @row-double-click="handleRowDblclick"
            				>
        				</t8t-table>
                    </div>
                </div>
            </div>
        </el-dialog>
          <t8t-step-page
            v-if="isShowFlow"
            :method="flowMethod"
            :service="flowService"
            :args="flowArgs"
            @close="isShowFlow=false"
        >
        </t8t-step-page>
    </div>
</template>
<script>
import service from 'src/services/delivery/Service.js'
import commonApi from 'src/services/commonApi/commonApi.js'
import api from 'src/services/delivery/foremanworker.js'
import DateUtils from 'src/utils/DateUtils.js'
import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
import Cookie from 'js-cookie'
export default {
    name: 'audit',
    components: {
            T8tStepPage
    },
    data() {
			return {
				formData:{
                    workerInfoVO:[],
                     workerUserTaskQueryVO:{}
                 },
				isDialogShow:true,
				isTopHide:false,
				columns:[
				        {"prop": "workerCode","label": "工号","sortable": false},
				        {"prop": "workerName","label": "姓名","sortable": false},
				        {"prop": "subOrgName","label": "从属组织","sortable": false},
				        {"prop": "phoneDecode","label": "手机号码","sortable": false},
				        {"prop": "isProjectManager","label": "是否有资格成为工长","sortable": false, "list":"isProjectManagerList"},
				        {"prop": "isWorkerBankAccount","label": "是否添加银行卡","sortable": false, "list":"isWorkerBankAccountList"},
				        {"prop": "jcbzj","label": "基础保障金","sortable": false},
				        {"prop": "createTime","label": "创建时间","sortable": false, "formatter": "dateParser"}
				],
                approvalFormRule:{
                        approve:[
                            {"required": true, "message": "请选择审核结果", trigger:"blur"}
                        ],
                        reason:[
                            {"required": true, "message": "请填写审批意见", trigger:"blur"},
                            { max:200, min:1, message: '审批意见最多填写200个字', trigger:"blur"}
                        ]
                },
                approvalFormData:{
                    approve:'',
                    reason:''
                },
                commonData:{
                    isWorkerBankAccountList:[
                        {
                            text: '无',
                            value: 0
                        },
                        {
                            text: '有',
                            value: 1
                        }
                     ],
                    isProjectManagerList:[
                        {text: '否', value: 0},
                        {text: '是', value: 1}
                    ],
                },
                taskName:'',
                flowArgs:null,
                flowMethod:null,
                flowService:null,
                isShowFlow:false
			}
    	},
        created(){
            let path = this.$route.path
            let type = 0
             if(path.endsWith('audit')){
                    this.taskName = '工人信息审核'
                    type = 0
             }else if(path.endsWith('termination')){
                    this.taskName = '工人解约审核'
                    type = 1
                    this.columns.push({"prop": "reason","label": "申请解约原因","sortable": false})
             }else{
                     this.$msgbox({
                        title: '路由错误！',
                        type: 'error',
                        message: '',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    }).then(() => {
                         this.$router.go(-1)
                    });
             }
              this.initData(type)
        },
    	methods:{
    		onTopHide(){
    			this.isTopHide = !this.isTopHide
    		},
            closeDialog() {
                window.location.href='http://scm.to8to.com/#/delivery/foremanworker-list'
            },
            dateParser(text) {
                let dateString;
                if (text === 0 || text === null || typeof(text) == 'undefined') {
                    dateString = ""
                } else {
                    let objDate = new Date(text * 1000);
                    dateString = DateUtils(objDate, 'yyyy-mm-dd HH:MM:ss')
                }
                return dateString
            },
            on_approval_flow(){
                this.isShowFlow = true
                if(this.formData.workerUserTaskQueryVO.taskId){
                    this.flowArgs = {workerId:this.formData.workerInfoVO[0]['id']}
                    this.flowMethod = service.FOREMANWORKER.methods.getProcessDetail
                    this.flowService = service.FOREMANWORKER.name
                }
            },
            submitForm(){
                this.$refs.approvalForm.validate((isValid) => {
                     if(isValid){
                        let args = {
                                id:this.formData.workerInfoVO[0]['id'],
                                 verifyUser:Cookie.get('t8t-tc-uid'),
                                  approve:this.approvalFormData.approve,
                                  reason:this.approvalFormData.reason,
                                  procInsId:this.formData.workerUserTaskQueryVO.procInsId,
                                  taskId:this.formData.workerUserTaskQueryVO.taskId
                            }
                        this.$refs.toolbar.disableBySymbol('SUBMIT');
                        api.approvalCreate(args).then((res) => {
                            this.$refs.toolbar.unDisableBySymbol('SUBMIT');
                              if(res.data.status == 200){
                                  this.$msgbox({
                                            title: '提交成功',
                                            type: 'success',
                                            message: '',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        }).then((res) =>{
                                            window.location.href='http://scm.to8to.com/#/delivery/foremanworker-list'
                                        })
                             }else{
                                 this.$msgbox({
                                    title: '提交失败',
                                    type: 'error',
                                    message: res.data.result,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                  })
                             }
                        })
                     }
                })
            },
            dimiSubmit(){
                this.$refs.approvalForm.validate((isValid) => {
                     if(isValid){
                        let args = {
                                id:this.formData.workerInfoVO[0]['id'],
                                 verifyUser:Cookie.get('t8t-tc-uid'),
                                  approve:this.approvalFormData.approve,
                                  reason:this.approvalFormData.reason,
                                  procInsId:this.formData.workerUserTaskQueryVO.procInsId,
                                  taskId:this.formData.workerUserTaskQueryVO.taskId
                            }
                        this.$refs.toolbar.disableBySymbol('SUBMIT');
                        api.approvalDimission(args).then((res) => {
                            this.$refs.toolbar.unDisableBySymbol('SUBMIT');
                              if(res.data.status == 200){
                                  this.$msgbox({
                                            title: '提交成功',
                                            type: 'success',
                                            message: '',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        }).then((res) =>{
                                            window.location.href='http://scm.to8to.com/#/delivery/foremanworker-list'
                                        })
                             }else{
                                 this.$msgbox({
                                    title: '提交失败',
                                    type: 'error',
                                    message: res.data.result,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                  })
                             }
                        })
                     }
                })
            },
            initData(type){
                let procInsId = this.$route.query.procInsId
                let args = {processId:procInsId, type:type}
                api.workerInfoServiceFindInfoProcess(args).then((res) =>{
                      if(res.data.status == 200){
                            this.formData.workerUserTaskQueryVO = res.data.result.workerUserTaskQueryVO
                            if(type == 1){
                                res.data.result.workerInfoVO.reason = res.data.result.workerDimissionVO.reason
                            }
                            this.formData.workerInfoVO = [res.data.result.workerInfoVO]
                            this.formData.workerUserTaskQueryVO.createTime = this.dateParser(this.formData.workerUserTaskQueryVO.createTime)
                      }
                })
            },
            handleRowDblclick(row, event) {
                this.$router.push({ path: 'foremanworker/view',query:{id: row['id']} })
            }
    	}
    }
</script>
<style scoped>

.t8t-full-dialog2 .dialog2-form-container-column {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 15px;
}
</style>
