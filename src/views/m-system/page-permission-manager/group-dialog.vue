<template>
	<el-dialog class="group-form-dialog" :title="title" v-model="dialogVisible" @close="btnCancleClick()">
	    <el-form :model="formData" :rules="rules" label-width="120px" label-position="right" ref="form" @keyup.enter.native="btnOKClick()">
	        <el-form-item :label="labelName">
	            <el-input disabled v-model="parent"></el-input>
	        </el-form-item>
	        <el-form-item label="编码：" prop="code">
	            <el-input v-model="formData.code" :disabled="editType !== 'add'"></el-input>
	        </el-form-item>
	        <el-form-item label="名称：" prop="name">
	            <el-input v-model="formData.name"></el-input>
	        </el-form-item>
	        <el-form-item label="url：" prop="url">
	            <el-input v-model="formData.url"></el-input>
	        </el-form-item>
	        <el-form-item label="是否隐藏：" prop="visible">
	            <el-checkbox v-model="formData.visible"></el-checkbox>
	        </el-form-item>
	        <el-form-item label="描述：" prop="description">
	            <el-input
	              type="textarea"
	              :rows="4"
	              v-model="formData.description">
	            </el-input>
	        </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	        <el-button @click="btnOKClick()" type="primary" :loading="isLoading">提交</el-button>
	        <el-button @click="btnCancleClick()">取消</el-button>
	    </div>
	</el-dialog>
</template>

<script>
	import permApi from 'src/services/permission/Perm.js'
	export default {
		data(){
            let validateCode = (rule, value, callback) => {
                if (/^[A-Za-z\d]+$/g.test(value)) {
                    callback()
                } else {
                    callback(new Error('编码只能为字母或数字'));
                }
            }

			return {
				labelName: '上级业务：',
                placeholder: '请输入编码',
				rules: {
					code: [
				        {type: 'string',required: true , message: "请填写编码",trigger: 'change'},
				        {max: 50, message: '长度必须在50个字符以内', trigger: 'change' },
                        {validator: validateCode, trigger: 'change' }
				    ],
				    name: [
				        {type: 'string',required: true , message: "请填写名称",trigger: 'change'},
				        {max: 20, message: '长度必须在20个字符以内', trigger: 'change' }
				    ],
				    description:[
				    	{max: 100, message: '长度必须在100个字符以内', trigger: 'change' }
				    ],
				    url: [
				        {max: 100, message: '长度必须在100个字符以内', trigger: 'change' }
				    ],
				},
				formData:{
					code: '',
					name: '',
					url: '',
					visible: false,
					description: ''
				}
			}
		},
		computed: {
		    dialogVisible() {
		        return true
		    },
		    parent(){
		    	return '(' + this.data.code + ')' + this.data.name
		    }
		},
		props: ['rowId','data','editType','title'],
		created(){
			if(this.editType === 'add'){
                permApi.genNewChildCode({parentId: this.rowId}).then((res)=>{
                    if(res.data.status === 200){
                        this.formData.code = res.data.result;
                    }
                })
			} else {
                this.labelName = '当前业务：';
                permApi.permissionGetById({id: this.rowId}).then((res)=>{
                    if(res.data.status === 200){
                        this.formData = res.data.result;
                        this.formData.visible = this.formData.visible === 0;
                    }
                })
            }
		},
		methods:{
			btnCancleClick() {
			    this.$refs['form'].resetFields()
			    this.$emit('close')
			},
			btnOKClick(){
				this.$refs['form'].validate(valid=>{
				    if (valid) {
				        let formData = Object.assign({},this.formData)
				        formData.visible = formData.visible ? 0 : 1;
				        let result = null;
				        if(this.editType == 'add'){
				        	formData.parentId = this.data.id;
				        	result = permApi.bizObjectAdd({bizObject:formData});
				        }else if(this.editType == 'edit'){
				        	result = permApi.bizObjectUpdate({bizObject:formData});
				        }else{
				        	this.$msgbox({
				        		title: '',
				        		type: 'success',
				        		message: '操作异常！'
				        	})
				        	return;
				        }
				        result.then((res) => {
				                if (res.data.status === 200) {
				                    this.$msgbox({
				                    	title: '',
				                    	type: 'success',
				                    	message: '提交成功！',
				                    	callback:()=>{
				                    		this.btnCancleClick()
				                    		let rs = this.editType == 'add' ? res.data.result : formData;
				                    		this.$emit('after-edit',rs,this.editType)
				                    	}
				                    })
				                }else{
				                    this.$msgbox({
				                    	title: '',
				                        type: 'error',
				                        message: res.data.message
				                    })
				                }
				        })
				    }
				})
			}
		}
	}
</script>

<style lang="css">
    .group-form-dialog .el-dialog{
    	width: 450px;
	}
	.group-form-dialog .el-form-item__content {
	    width: 250px;
	}
</style>
