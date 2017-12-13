<template>
	<div >
		        <!-- 新增、编辑弹窗 -->
        <el-dialog :title="title" class="function-detail" v-model="editDialogVisible" @close="closeEditDialog" size="large">
            <el-form label-position="right"  :model="formData" :rules="rules" label-width="120px" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="权限名：" prop="permissionCode">
                    <el-select
                        v-model="formData.permissionCode"
                        :allow-create="false"
                        placeholder="请选择权限名称"
                        :disabled="editType"
                        >
                        <el-option
                            v-for="item in commonOptionsConfig.permissionList"
                            :label="item.text"
                            :value="item.value"
                            :loading="permissionListLoading"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开发类型：" prop="developType">
                    <el-select
                        v-model="formData.developType"
                        :allow-create="false"
                        placeholder="请选择功能类型"
                        :disabled="editType"
                        >
                        <el-option
                            v-for="item in commonOptionsConfig.developType"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="功能类型：" prop="permissionType">
                    <el-select
                        v-model="formData.permissionType"
                        :allow-create="false"
                        placeholder="请选择功能类型">
                        <el-option
                            v-for="item in commonOptionsConfig.permissionType"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用：" prop="isDel">
                    <el-select
                        v-model="formData.isDel"
                        :allow-create="false"
                        placeholder="请选择是否启用">
                        <el-option
                            v-for="item in commonOptionsConfig.isDel"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否展示：" prop="isShow">
                    <el-select
                        v-model="formData.isShow"
                        :allow-create="false"
                        placeholder="请选择是否展示">
                        <el-option
                            v-for="item in commonOptionsConfig.isShow"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否为公共功能：" prop="isPublic">
                    <el-select
                        v-model="formData.isPublic"
                        :allow-create="false"
                        placeholder="请选择是否为公共功能">
                        <el-option
                            v-for="item in commonOptionsConfig.isPublic"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="启用组织：" prop="enableOrg" class="large-width">
                        <my-select
      						:selected="enableOrgSelected"
      						@select-click="showTreeDialog=true"
    					></my-select>
    					<tree-dialog
    						@close="close_tree_dialog"
    						v-if="showTreeDialog"
    						@confirm="confirmEnableOrg"
    						:defaultSelectedList="formData.enableOrg"
    					>
    					</tree-dialog>
                </el-form-item>
                 <el-form-item label="描述：" prop="memo" class="large-width">
                    <el-input v-model="formData.memo" type="textarea" size="small"></el-input>
                </el-form-item>
                <el-form-item label="上传icon：" prop="functionIcon" class="large-width">
                尺寸300*300
                    <el-upload
					  	class="avatar-uploader"
					  	v-loading="imgLoading"
					  	:action="uploadUrl"
					  	:data="{bucket:'scm', module: 'pic/yuntu'}"
					  	:show-file-list="false"
					  	:on-error="handUploadError"
					  	:on-success="handleAvatarSuccess"
					  	:before-upload="beforeAvatarUpload">
					  	<img v-if="icoPath" :src="icoPath" class="avatar">
					  	<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="edit_isLoading" v-if="type != 'view'">确定</el-button>
                <el-button @click="closeEditDialog()">取消</el-button>
            </div>
        </el-dialog>
	</div>
</template>
<script>
    import Utils from 'src/utils/Utils.js'
    import Cookie from 'js-cookie'
    import mySelect from './my-select.vue'
    import TreeDialog from './tree-popup-dialog.vue'
    import api from 'src/services/system/app.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
	export default{
		name:'function_dialog',
		 components: {
    		mySelect,
    		TreeDialog
  		},
		props:{
			id:{
				type:Number,
				default:null
			},
			title:{
				type:String,
				default:'新增权限'
			},
			type:{
				type:String,
				default:'view'
			}
		},
		data(){
			return {
				formData:{
					id:null,
					permissionCode:null,
					permissionName:null,
					functionIconUrl:null,
					developType:0,
					h5Link:'',
					permissionType:null,
					isDel:0,
					isShow:0,
					isPublic:1,
					enableOrg:[],
					enableOrgName:[],
					memo:'',
					functionIcon:null

				},
				rules:{
					permissionCode:[
						{required: true, message: '请选择权限名称', trigger:"change"}
					],
					developType:[
						{ type: 'number', required: true, message: '请选择开发类型', trigger:"change"}
					],
					permissionType:[
						{ type: 'number', required: true, message: '请选择功能类型', trigger:"change"}
					],
					isDel:[
						{ type: 'number', required: true, message: '请选择是否启用', trigger:"change"}
					],
					isShow:[
						{ type: 'number', required: true, message: '请选择是否展示', trigger:"change"}
					],
					isPublic:[
						{ type: 'number', required: true, message: '请选择是否为公共功能', trigger:"change"}
					],
					enableOrg:[
						{ type: 'array', required: true, message: '请选择启用组织', trigger:"blur"}
					],
					memo:[
						{ max: 500, min:0, message: '描述不能超过500个字符', trigger:"blur"}
					],
					functionIcon:[
						{required: true, message: '请上传功能icon', trigger:"blur"}
					]
				},
				enableOrgSelected:[
				],
				editDialogVisible:true,
				edit_isLoading:false,
				commonOptionsConfig:{
					developType:[
						{value: 0, text: '原生'},
                        {value: 1, text: 'H5'}
					],
					isDel:[
						{value: 0, text: '启用'},
                        {value: 1, text: '禁用'}
					],
					isShow:[
						{value: 0, text: '是'},
                        {value: 1, text: '否'}
					],
					isPublic:[
						{value: 0, text: '是'},
                        {value: 1, text: '否'}
					],
					permissionType:[],
					permissionList:[]
				},
				uploadUrl:Utils.getUploadURL(),
				icoPath:null,
				editType:false,
				imgLoading:false,
				showTreeDialog:false,
				permissionListLoading:true

			}
		},
		created(){
           if(this.id){
           		this.editType = true
           		this.initData(this.id).then(() =>{
           			this.getPermissionList({permissionCodeExt:this.formData.permissionCode})
           		})
           }else{
           		this.getPermissionList()
           		this.setDefaultPermissionType()
           }
           this.getCommonOptions('11013', 'permissionType')
		},
		watch:{
			enableOrgSelected:function(val){
				this.formData.enableOrg = val.reduce((acc, item) => {
					acc.push(item.value)
					return acc
				}, [])
				this.formData.enableOrgName = val.reduce((acc, item) => {
					acc.push(item.currentLabel)
					return acc
				}, [])
				this.$nextTick(() =>{
					this.$refs['form'].validateField('enableOrg')
				})

			},
			"formData.permissionCode":function(val){
				this.commonOptionsConfig.permissionList.forEach((item) => {
						if(item.value == val){
							this.formData.permissionName = item.text
						}
					})
			}
		},
		methods:{
			closeEditDialog(){
				this.editDialogVisible = false
				this.$parent.showDetail = false
			},
			handleAvatarSuccess(res, file){
				this.imgLoading = false
				if(res.status == 200){
                  this.icoPath = Utils.getFullURL(res.result.filePath)
                  this.formData.functionIconUrl= res.result.filePath
                  this.formData.functionIcon = res.result.id
                  this.$refs['form'].validateField('functionIcon')
             }else{
                this.$message.error('上传失败')
             }
			},
			close_tree_dialog(){
				this.showTreeDialog = false
			},
			 beforeAvatarUpload(file) {
			 	this.imgLoading = true

		        const isLt2M = file.size > 1024 * 1024 * 5;

		        if (isLt2M) {
		          this.$message.error('上传头像图片大小不能超过 5MB!');
		          this.imgLoading = false;
		           return false;
		        }
		        var _this = this
		       return  new Promise(function(resolve, reject){
			        var reader = new FileReader();
				 	 reader.readAsDataURL(file);
				 	 var img=new Image()
				 	 img.onload = function(e) {
				 	 	let height = e.path[0]['height']
				 	 	let width = e.path[0]['width']
				 	 	if(height != 300 || width !=300){
			 	 	  		_this.imgLoading = false;
			 	 	  		_this.$message.error('图片尺寸错误');
			 	 	  	    reject(new Error('图片尺寸错误'));
						 }else{
						 	resolve(true);
						 }
				 	 }
				 	 reader.onload = function(oFREvent){
				 	 		img.src = oFREvent.target.result
				 	 }
			      })
			  },
			  handUploadError(err, file, fileList){
			  	  this.$message.error('上传失败：服务器未知错误')
			  	  this.imgLoading = false;
			  },
			  confirmEnableOrg(list){
			  	  this.enableOrgSelected = []
			  	  list.forEach((item) =>{
			  	  	 this.enableOrgSelected.push({
			  	  	 	currentLabel:item.name,
			  	  	 	value:item.id
			  	  	 })
			  	  })
			  },
			  getPermissionList(args = {}){
			  		api.permissionExtServiceListPackPerm(args).then((res)=>{
			  			this.permissionListLoading = true
			  			if(res.data.status == 200){
			  				res.data.result.rows.forEach((item) =>{
			  					this.commonOptionsConfig.permissionList.push({
			  						  text: item.name,
			  						  value:item.code
			  					})
			  				})
			  			}
			  		})
			  },
			  setDefaultPermissionType(){
			  		let arg =  {
                    page: 1,
                    search: {
                        propertyCode: '1101301'
                    },
                    size: 1
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            let permissionType = res.data.result[0];
                            this.formData.permissionType = permissionType ? permissionType.id : null;
                        }
                    })
			  },

			  btnOKClick(){
			  		 this.$refs.form.validate((isValid) =>{
                          if(isValid){
                          	   this.edit_isLoading = true
                          	   if(this.id){
                          	   	  	this.formData.updateUser = Cookie.get('t8t-tc-uid')
                          	  		this.formData.updateName = Cookie.get('t8t-tc-username')
                          	   		this.formData.updateBy = Cookie.get('t8t-tc-username')
                          	   		let args = {permissionExt:this.formData}
                          	   		api.permissionExtServiceUpdate(args).then((res) =>{
	                          	   		this.edit_isLoading = false
	                          	   	    if(res.data.status == 200){
	                          	   	    	var _this = this
	                          	   	    	this.$msgbox({
		                                        title: '修改成功',
		                                        type: 'success',
		                                        message: '',
		                                        showCancelButton: false,
		                                        confirmButtonText: '知道了',
		                                        confirmButtonClass: 'is-plain'
		                                    }).then((res) =>{
		                                    	_this.closeEditDialog()
		                                    	_this.$parent.$refs['list-view'].getTableInstance().reloadTable()
		                                    })
	                          	   	    }else{
	                          	   	    	this.$msgbox({
				                                title: '修改失败',
				                                type: 'error',
				                                message: res.data.error || res.data.result,
				                                showCancelButton: false,
				                                confirmButtonText: '知道了',
				                                confirmButtonClass: 'is-plain'
				                              })
	                          	   	    }
	                          	   }).catch((res) =>{
	                          	   		this.edit_isLoading = false
	                          	   	   this.$msgbox({
				                                title: '修改失败',
				                                type: 'error',
				                                message: '服务器异常',
				                                showCancelButton: false,
				                                confirmButtonText: '知道了',
				                                confirmButtonClass: 'is-plain'
				                              })
	                          	   })
	                          	   return
                          	   }
                          	   this.formData.createUser = Cookie.get('t8t-tc-uid')
                          	   this.formData.createName = Cookie.get('t8t-tc-username')
                          	   this.formData.createBy = Cookie.get('t8t-tc-username')
                          	   let args = {permissionExt:this.formData}
                          	   api.permissionExtServiceCreate(args).then((res) =>{
                          	   		this.edit_isLoading = false
                          	   	    if(res.data.status == 200){
                          	   	    	var _this = this
                          	   	    	this.$msgbox({
	                                        title: '提交成功',
	                                        type: 'success',
	                                        message: '',
	                                        showCancelButton: false,
	                                        confirmButtonText: '知道了',
	                                        confirmButtonClass: 'is-plain'
	                                    }).then((res) =>{
	                                    	_this.closeEditDialog()
	                                    	_this.$parent.$refs['list-view'].getTableInstance().reloadTable()
	                                    })
                          	   	    }else{
                          	   	    	this.$msgbox({
			                                title: '提交失败',
			                                type: 'error',
			                                message: res.data.error || res.data.result,
			                                showCancelButton: false,
			                                confirmButtonText: '知道了',
			                                confirmButtonClass: 'is-plain'
			                              })
                          	   	    }
                          	   }).catch((res) =>{
                          	   		this.edit_isLoading = false
                          	   	   this.$msgbox({
			                                title: '提交失败',
			                                type: 'error',
			                                message: '服务器异常',
			                                showCancelButton: false,
			                                confirmButtonText: '知道了',
			                                confirmButtonClass: 'is-plain'
			                              })
                          	   })
                          }
			  		 })
			  },
			  initData(id){
			  		let args = {search:{id_eq:id},page:1,size:1}
			  		return api.permissionExtServiceQueryPage(args).then((res) =>{
			  			  if(res.data.status = 200){
			  			  		if(res.data.result.rows.length > 0){
			  			  			  this.formData = res.data.result.rows[0]
			  			  			  this.icoPath = Utils.getFullURL(this.formData.functionIconUrl)
			  			  			  this.formData.enableOrg = this.formData.enableOrg ? this.formData.enableOrg.split(',') : []
			  			  			  this.formData.enableOrgName = this.formData.enableOrgName ? this.formData.enableOrgName.split(',') : []
			  			  			  var enableOrgSelected = []
			  			  			  this.formData.enableOrg.forEach((item, index) => {
			  			  			  		enableOrgSelected.push({
			  			  			  			currentLabel: this.formData.enableOrgName[index],
			  			  			  			value:item
			  			  			  		})
			  			  			  })
			  			  			  this.enableOrgSelected  = enableOrgSelected
			  			  		}
			  			  }

			  		})
			  },
			  getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            });
                            this.commonOptionsConfig[selectName] = list;
                        }
                    })
            }
		}
	}

</script>
 <style lang="css" >

 .function-detail .el-form-item__content .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
 .function-detail .el-form-item__content .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.function-detail .el-form-item{
	width: 48%;
}
.function-detail .large-width{
width: 100%;
}
.function-detail .large-width .el-form-item__content{
	width: 72%;
}
.function-detail .el-form{
	    display: flex;
    flex-wrap: wrap;
}
.avatar-uploader img{
	max-width: 178px;
}
.function-detail  .el-dialog{
    width: 850px;
}
.function-detail .el-select-dropdown__wrap {
    max-height: 185px !important;
}
.function-detail  .el-form-item__content {
    width: 200px;
}
.function-detail  .el-select {
    width: 100%;
}
.function-detail .el-input--small{
    width: 100%;
}
.function-detail .el-form-item__label{
    width: 30%;
    }


 </style>
