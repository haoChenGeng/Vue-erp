<template>
	<el-dialog class="form-dialog" :title="title" v-model="dialogVisible" @close="btnCancleClick()">
	    <el-form :model="formData" :rules="rules" label-width="120px" label-position="right" ref="form" @keyup.enter.native="btnOKClick()">
	        <el-row>
	        	<el-col :span="12">
	        		<el-form-item label="业务对象：">
	        		    <el-input disabled v-model="parent"></el-input>
	        		</el-form-item>
	        	</el-col>
	        	<el-col :span="12">
	        		<el-form-item label="编码：" prop="code">
	        		    <el-input v-model="formData.code" :disabled="editType !== 'add'"></el-input>
	        		</el-form-item>
	        	</el-col>
	        </el-row>
	        <el-row>
		        <el-col :span="12">
		        	<el-form-item label="名称：" prop="name" >
		        	    <el-autocomplete
		        	      v-model="formData.name"
		        	      :fetch-suggestions="getBtnData"
		        	      @select="handleSelect"
	                      :disabled="!editalbe"
		        	    ></el-autocomplete>
		        	</el-form-item>
		        </el-col>
		        <el-col :span="12">
		        	<el-form-item label="英文字符：" prop="symbol">
		        	    <el-input v-model="formData.symbol" :disabled="!editalbe"></el-input>
		        	</el-form-item>
		        </el-col>
	        </el-row>
	        <el-form-item label="url列表：" prop="url">
	            <el-input
	              :disabled="!editalbe"
	              type="textarea"
	              :rows="4"
	              v-model="formData.url">
	            </el-input>
	        </el-form-item>
	        <el-form-item label="描述：" prop="description">
	            <el-input
	              :disabled="!editalbe"
	              type="textarea"
	              :rows="4"
	              v-model="formData.description">
	            </el-input>
	        </el-form-item>
	        <el-form-item label="是否隐藏：" prop="visible">
	            <el-checkbox :disabled="!editalbe" v-model="formData.visible"></el-checkbox>
	        </el-form-item>
	        <el-form-item label="启用数据范围限制：" prop="rangeTrigger">
	            <el-checkbox :disabled="!editalbe" v-model="formData.rangeTrigger"></el-checkbox>
	        </el-form-item>
	        <el-form-item class="w" v-show="formData.rangeTrigger" label="表名：" prop="tableName">
	            <el-input :disabled="!editalbe" v-model="formData.tableName"></el-input>
	        </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer" v-if="editalbe">
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
            let validateSymbol = (rule, value, callback) => {
                if (/^[-]+/g.test(value)) {
                    callback(new Error('不能以"-"作为起始'));
                } else if (/^[A-Za-z-_]+$/g.test(value)) {
                    callback()
                } else {
                    callback(new Error('只能为英文和"-"、"_"的组合'));
                }
            }

            let validateTableName = (rule, value, callback) => {
                if ((value === '') || /[\w]+\.[\w]+/g.test(value)) {
                    callback()
                } else {
                    callback(new Error('格式不正确，请参考"database.table"格式'));
                }
            }

			return {
				rules: {
					code: [
				        {type: 'string',required: true , message: "请填写编码",trigger: 'change'},
				        {max: 50, message: '长度必须在50个字符以内', trigger: 'change' },
                        {validator: validateCode, trigger: 'change' }
				    ],
					symbol: [
				        {type: 'string',required: true , message: "请填写英文字符",trigger: 'blur'},
				        {max: 20, message: '长度必须在20个字符以内', trigger: 'change' },
                        {validator: validateSymbol, trigger: 'change' }
				    ],
				    name: [
				        {type: 'string',required: true , message: "请填写名称",trigger: 'blur'},
				        {max: 20, message: '长度必须在20个字符以内', trigger: 'change' }
				    ],
				    url: [
//				        {type: 'string',required: true , message: "请填写url列表",trigger: 'change'},
				        {max: 5000, message: '长度必须在5000个字符以内', trigger: 'change' }
				    ],
				    description:[
				    	{max: 100, message: '长度必须在100个字符以内', trigger: 'change' }
				    ],
				    tableName: [
				    	{max: 100, message: '长度必须在100个字符以内', trigger: 'change' },
                        {validator: validateTableName, trigger: 'change' }
				    ]
				},
				formData:{
					code: '',
					name: '',
					symbol: '',
					url: '',
					visible: false,
					description: '',
					rangeTrigger: false,
					tableName: ''
				},
				editalbe: false,
				btnData: []
			}
		},
		watch: {
		    "formData.name":{
		        handler:function(val,oldVal){
		        	if(val === ''){
		        		this.formData.symbol = '';
		        	}
		        }
		    }
		},
		computed: {
		    dialogVisible() {
		        return true
		    },
		    parent(){
		    	return (this.data.code ? '(' + this.data.code + ')' : '') + this.data.name
		    }
		},
		props: ['rowId','data','editType','title'],
		created(){
			if(this.editType != 'add'){
				permApi.permissionGetById({id: this.rowId}).then((res)=>{
					if(res.data.status === 200){
						this.formData = res.data.result;
						this.formData.visible = this.formData.visible == 0 ? true : false;
						this.formData.rangeTrigger = this.formData.rangeTrigger == 1 ? true : false;
					}
				})
			} else {
                permApi.genNewChildCode({parentId: this.data.id}).then((res)=>{
                    if(res.data.status === 200){
                        this.formData.code = res.data.result;
                    }
                })
            }
			if(this.editType != 'view'){
				this.editalbe = true;
			}

			permApi.systemCodeSearchByPage({page: 1, size: 100, condition:{typeName: '权限按钮'}}).then((res)=>{
			    if(res.data.status === 200){
			        let list = [];
			        res.data.result.rows.forEach((item)=>{
			            list.push({
			                value: item.name,
			                symbol: item.description
			            })
			        })
			        this.btnData = list;
			    }
			})
		},
		methods:{
			btnCancleClick() {
			    this.$refs['form'].resetFields()
			    this.$emit('close')
			},
			getBtnData(queryString, cb){
				var results = queryString ? this.btnData.filter(this.createFilter(queryString)) : this.btnData;
				cb(results);
			},
			createFilter(queryString) {
			  	return (restaurant) => {
			    	return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
			  	};
			},
			btnOKClick(){
				this.$refs['form'].validate(valid=>{
                    if (valid) {
				        let formData = Object.assign({},this.formData)
				        formData.visible = formData.visible ? 0 : 1;
				        formData.rangeTrigger = formData.rangeTrigger ? 1 : 0;
				        if(formData.rangeTrigger == 1 && !formData.tableName){
				        	this.$message.error('请填写表名！');
				        	return;
				        }
				        let result = null;
				        if(this.editType == 'add'){
				        	formData.parentId = this.data.id;
				        	result = permApi.permissionAdd({permission:formData});
				        }else if(this.editType == 'edit'){
				        	result = permApi.permissionUpdate({permission:formData});
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
				                    	message: '提交成功！'
				                    })
				                    this.btnCancleClick()
				                    this.$emit('complete')
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
			},
			handleSelect(item){
				this.formData.symbol = item.symbol;
			}
		}
	}
</script>

<style lang="css">
    .form-dialog .el-dialog{
    	width: 650px;
	}
	.form-dialog .el-form-item__content {
	    width: 450px;
	}
	.form-dialog .el-form-item__content .el-input {
	    width: 32%;
	}
	.form-dialog .w .el-input {
	    width: 100%;
	}
	.form-dialog .el-dialog .el-autocomplete{
		display: block;
	}
</style>
