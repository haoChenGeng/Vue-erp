<template>
    <div>
	  <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog dialog-new">
	  		 <div class="t8t-full-dialog-container">
	  		 		<!--顶部按钮区-->
	  		 		<div class="full-dialog-toolbar-container">
		                <div class="toolbar-container">
		                    <t8t-toolbar
		                        class="t8t-dark"
		                        @EDIT-SUBMIT="submitForm"
		                        ref="toolbar"
		                    >
		                    </t8t-toolbar>
		                </div>
	            	</div>
                    <!--表单区-->
                    <div class="full-dialog-form-container container-center">
                        <el-form :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                            <div class="form-item-container">
                                   <el-form-item label="被授权人:" prop="userName">
                                        <el-input
                                        v-model="formData.userName"
                                        icon="search"
                                        :on-icon-click="handleIconClick"
                                        :disabled="true"
                                        placeholder="被授权人">
                                        </el-input>
                                    </el-form-item>
                                </el-form-item>
                            </div>
                            <div class="form-item-container">
                                <el-form-item label="授权时间:" prop="startTime">
                                     <el-date-picker
                                      v-model="formData.startTime"
                                      type="date"
                                      placeholder="开始时间"
                                      :picker-options="pickerOptions0">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="form-item-container">
                                <el-form-item  prop="endTime">
                                  <el-date-picker
                                      v-model="formData.endTime"
                                      type="date"
                                      placeholder="结束时间"
                                      :picker-options="pickerOptions0">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                             <div class="form-item-container">

                            </div>
                        </el-form>
                    </div>
                    <div class="full-dialog-tabs-container container-center">
                        <div class="my-container">
                            <el-tabs v-model="activeTabName">
                                <el-tab-pane label="流程分类" name="one">
                                    <div class="my-container">
                                        <el-tree
                                          :data="treeData"
                                          :props="defaultProps"
                                          show-checkbox
                                          node-key="id"
                                          ref="tree"
                                          :expand-on-click-node="true"
                                          :render-content="renderContent">
                                        </el-tree>
                                    </div>
                                </el-tab-pane>
                        </el-tabs>
                        </div>
                    </div>
	  		 </div>
        </el-dialog>
        <user-list-dialog
        v-if="viewUserListVisible"
        @close = "viewUserListVisible = false"
        @get-assignee = "getAssignee"
        ></user-list-dialog>
    </div>
</template>
<script>
    import T8tDatetimePicker from 'src/components/t8t-form/dateTimePicker.vue'
    import Service from 'src/services/procenter/Service.js'
    import apiProCenter from 'src/services/procenter/proCenterApi.js'
    import UserListDialog from './user-list-dialog.vue'
    import Cookie from 'js-cookie'
	export default({
		name:'page-pro-devolution-create',
        components:{T8tDatetimePicker,UserListDialog},
		data(){
			return{
                defaultProps: {
                  children: 'children',
                  label: 'label'
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
				isDialogShow:true,
                formData:{
                    userName:null,
                    userId:null,
                    startTime:null,
                    endTime:null
                },
                formRule:{
                    userName:[{ required: true, message: '请选择被授权人'}],
                    startTime:[{ required: true, message: '请选择开始时间'}],
                    endTime:[{ required: true, message: '请选择结束时间'}]
                },
                options: {
                    showCheckbox: true,
                },
                viewUserListVisible:false,
                activeTabName:'one',
                treeData:JSON.parse(this.$route.query.treeData)

			}
		},
        methods:{
            submitForm(){
               this.$refs.formRef.validate((isvalid)=>{
                    if(isvalid){
                        let selectedNodes =  this.$refs['tree'].getCheckedNodes()
                        let formData = Object.assign({},this.formData)
                        let params = {}
                        if(formData.userId == null){
                            this.$message.error("请输入被授权人")
                            return
                        }
                         if(formData.startTime == "" || formData.endTime == ""){
                            this.$message.error("请输入授权时间")
                            return
                        }

                        if(formData.userName != null){
                            params.agency = parseInt(formData.userId)
                        }
                        if(formData.startTime != ""){
                            params.startTime = formData.startTime.getTime()/1000;
                        }
                        if(formData.endTime != ""){
                            params.endTime = formData.endTime.getTime()/1000;
                        }
                        if(params.endTime - params.startTime <= 0){
                            this.$message.error("请选择合理的授权时间范围！")
                            return
                        }

                        if(params.endTime - params.startTime >90*86400){
                             this.$message.error("请选择授权时间在3个月之内！")
                             return
                        }

                        if(selectedNodes.length == 0){
                            this.$message.error("请选择授权流程")
                            return
                        }

                        if(selectedNodes.length != 0){
                            params.processInf = []
                            selectedNodes.forEach((item)=>{
                                if(typeof item.children == 'undefined'){
                                    params.processInf.push({procKey:item.code,tenantId:item.tenantId})
                                }
                            })
                        }

                        params.principal = parseInt(Cookie.get('t8t-tc-uid'))

                        this.impowerByAssigneeId(params);
                    }
               })
            },
            handleIconClick(){
               this.viewUserListVisible = true
            },
            closeDialog(){
                this.$router.go(-1)
            },
            //获取授权人
            getAssignee(assigneeData){
                this.formData.userName = assigneeData.name
                this.formData.userId = assigneeData.id
            },
            //执行授权
            impowerByAssigneeId(params){
                let _this = this
                let args = {req:params}
                apiProCenter.impowerByAssigneeId(args).then((res)=>{
                        if(res.data.status == 200){
                          _this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '授权成功！',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain',
                                 }).then(action=>{
                                    if (action==='confirm') {
                                        this.$router.push({path:'/tochat-procenter/page-pro-devolution'})
                                    }
                                })
                          this.$emit('getTableData')
                        }else{
                            _this.$message.error('授权失败,请稍后再试！');
                        }
                })
            },
        }
	})
</script>
<style lang="css" scoped>
    .dialog-new.t8t-full-dialog .my-container{
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
        height: 100%;
    }
    .dialog-new.t8t-full-dialog .my-toolbar{
        margin-bottom: 15px;
    }
</style>
<style>
    .dialog-new.t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .dialog-new.t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .dialog-new.t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .dialog-new.t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }
    .dialog-new.t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .dialog-new.t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .dialog-new.t8t-full-dialog .toolbar-container .toolbar-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .dialog-new.t8t-full-dialog .toolbar-container .toolbar-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .dialog-new.t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .dialog-new.t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
    }
    .dialog-new.t8t-full-dialog .form-item-container{
        width: 25%;
    }
    .dialog-new.t8t-full-dialog .full-dialog-form-container{
        margin-top: 22px;
    }
    .dialog-new.t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .dialog-new.t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .dialog-new.t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .dialog-new.t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .dialog-new.t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .dialog-new.t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .dialog-new.t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .dialog-new.t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .dialog-new.t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
    }
    .dialog-new.t8t-full-dialog .el-tab-pane{
        display: flex;
        flex: 1;
        overflow: auto;
    }
    .dialog-new.t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }
</style>

