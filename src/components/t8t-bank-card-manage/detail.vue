<template>
	<div>
	<el-dialog size="large" class="form-dialog" :title="title" v-model="dialogVisible" @close="btnCancleClick()">
		<el-form class="form-container clearfix" :model="formData" :rules="rules" label-width="100px" label-position="right" ref="form" @keyup.enter.native="btnOKClick()">
			<el-form-item class="item-container w100" label="银行账号：" prop="bankAccount">
			    <el-input :disabled="disabled" v-model="formData.bankAccount"></el-input>
			</el-form-item>
			<el-form-item class="item-container" label="账户名称：" prop="openingAccountName">
			    <el-input v-model="formData.openingAccountName" :disabled="disabled"></el-input>
			</el-form-item>
			<el-form-item class="item-container" label="是否默认：" prop="isDefault">
			    <el-select v-model="formData.isDefault" :disabled="disabled" placeholder="请选择">
			    	<el-option label="是" :value="1"></el-option>
			    	<el-option label="否" :value="0"></el-option>
			    </el-select>
			</el-form-item>
			<el-form-item class="item-container" label="银行：" prop="bankId">
			    <el-select :disabled="disabled" v-model="formData.bankId" placeholder="请选择">
			        <el-option
			          v-for="item in commonData.bankList"
			          :label="item.text"
			          :value="item.value">
			        </el-option>
			    </el-select>
			</el-form-item>
			<el-form-item class="item-container" label="开户支行：" prop="bankBranchName">
			    <el-input v-model="formData.bankBranchName" :disabled="disabled"></el-input>
			</el-form-item>
			<el-form-item class="item-container" label="省：" prop="provinceCode">
			    <el-select :disabled="disabled" v-model="formData.provinceCode" placeholder="请选择" @change="provinceChange">
			        <el-option
			          v-for="item in commonData.provinces"
			          :label="item.text"
			          :value="item.value"
			        >
			        </el-option>
			    </el-select>
			</el-form-item>
			<el-form-item class="item-container" label="市：" prop="cityCode">
			    <el-select :disabled="disabled" v-model="formData.cityCode" placeholder="请选择">
			        <el-option
			          v-for="item in commonData._cities"
			          :label="item.text"
			          :value="item.value">
			        </el-option>
			    </el-select>
			</el-form-item>
			<el-form-item class="item-container" label="账户对象：">
			    <el-input value="业主" disabled></el-input>
			</el-form-item>
			<el-form-item class="item-container" label="关联对象：" prop="userName">
			    <el-input :value="formData.userName" disabled></el-input>
			</el-form-item>
			<el-form-item class="item-container w100" label="备注：" prop="remark">
			    <el-input
			      :disabled="disabled"
			      type="textarea"
			      :rows="4"
			      v-model="formData.remark">
			    </el-input>
			</el-form-item>
			<el-form-item class="item-container w100" label="附件：" prop="voucherUrl">
			    <el-upload
			     	v-if="!disabled"
			        ref="upload"
			        :data="uploadParams"
			        :action="uploadURL"
			        :on-change="handleChange"
			        :on-success="handleSuccess"
			        :on-remove="handleRemove"
			        :before-upload="beforeUpload"
			        accept=".png,.jpg,.jpeg"
			        :multiple="false"
			        :auto-upload="true"
			        :file-list="fileList"
			    >
			        <el-button size="small" type="primary"><i class="el-icon-upload2"></i> 上传文件</el-button>
			        <span>请选择图片文件</span>
			    </el-upload>
			    <el-button v-if="disabled" @click="showAttach">查看</el-button>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer" v-if="!disabled">
		    <el-button @click="btnOKClick()" type="primary" :loading="isLoading">提交</el-button>
		    <el-button @click="btnCancleClick()">取消</el-button>
		</div>
	</el-dialog>
	<el-dialog v-model="attachVisible" size="large">
	    <!-- <img width="100%" :src="attachUrl" alt=""> -->
	    <div v-if="attachType == 'pdf'" id="pdf"></div>
	    <div v-else>
	    	<img width="100%" :src="attachUrl" alt="">
	    </div>
	</el-dialog>
	</div>
</template>

<script>
	import Service from 'src/services/delivery/Service.js'
	import Model from 'src/services/delivery/model.js'
	import axios from 'src/utils/axios.js'
	import {getDivisions, getProvinces} from './utils.js'
	import Cookie from 'js-cookie'
	import Utils from 'src/utils/Utils.js'
	import PDFObject from 'src/utils/pdfobject.js'

	export default {
		data(){
			return {
				isLoading: false,
				formData: {
					bankAccount: '',
					openingAccountName: '',
					isDefault: null,
					bankId: null,
					bankBranchName: '',
					provinceCode: '',
					cityCode: '',
					userId: null,
					userName: '',
					remark: '',
					roleTypeCode: '',
					voucherUrl: ''
				},
				division: [],
				commonData: {
					bankList: [],
					provinces: [],
					cities: [],
					_cities: []
				},
				rules: {
					bankAccount: [
	                    {
	                        required: true,
	                        message: "不能为空"
	                    },
	                    {
	                    	pattern: /^\d{16,20}$/,
	                    	message: '银行账号格式错误'
	                    }
                	],
                	openingAccountName:  [
	                    {
	                        required: true,
	                        message: "不能为空"
	                    },
	                    {
	                    	max: 20,
	                    	min:1,
	                    	message: '账户名称长度不能超过20个字符'
	                    }
                	],
                	isDefault: [
	                    {
	                        "required": true,
	                        "message": "不能为空"
	                    }
                	],
                	bankId: [
	                    {
	                        "required": true,
	                        "message": "不能为空"
	                    }
	                ],
	                bankBranchName:[
	                    {
	                        "required": true,
	                        "message": "不能为空"
	                    },
	                    {
	                    	max: 20,
	                    	min:1,
	                    	message: '开户支行长度不能超过20个字符'
	                    }
	                ],
	                provinceCode:[
	                    {
	                        "required": true,
	                        "message": "不能为空"
	                    }
	                ],
	                cityCode:[
	                    {
	                        "required": true,
	                        "message": "不能为空"
	                    }
	                ],
	                voucherUrl: [
	                	{
	                		required: true,
	                		message: '请上传附件'
	                	}
	                ],
	                remark: [
	                	{
	                		max: 200,
	                		message: '备注字符数不能超过200'
	                	}
	                ],
				},
				uploadParams: {
                    bucket: 'scm',
                    module: 'delivery'
                },
				uploadURL: Utils.getUploadURL(),
				fileList: [],
				attachVisible: false,
				attachUrl: '',
				attachType: ''
			}
		},
		computed: {
		    dialogVisible() {
		        return true
		    },
		    disabled() {
		    	return this.editType == 'view';
		    }
		},
		props: ['title','editType','rowId','additionalData'],
		created(){
			this.formData.userId = this.additionalData.userId;
			this.formData.userName = this.additionalData.userName;
			this.formData.roleTypeCode = this.additionalData.roleTypeCode;
			//银行卡列表
			this.commonData.bankList = Model.getCommonOptions({ pPropertyCode: '61101'});
			this.initDivisionData().then(res =>{
			    this.commonData.provinces = getProvinces(this.division)
			    this.commonData.cities = this.division.reduce((acc,i)=>{
			        if([11, 12, 31,50].indexOf(i.id) > -1){
			             return acc.concat([i])
			        }
			        return acc.concat(i.children)
			    },[])
			    this.commonData.cities.map((item) =>{
			        item.text = item.name
			        item.value = item.id.toString()
			    })
			    if(this.editType != 'add'){
					this.getCardInfo(this.rowId);
				}
			})

		},
		methods: {
			initDivisionData(){
			   return axios({
			            method: '9QcAm_g-pEd7h1maNn1y5_E2NYs0VOh6yyAaz2wpahZ',//standardDistrict.allTree.get
			            service: 'SAQyRkx8GNYji7u1QcT6nJGYUFe7I14',///biz/t8t-sys-dst/app
			            args: {}
			        }).then((res) => {
			            if(res.data.status === 200) {
			                this.division = res.data.result
			            }
			        })
			},
			btnCancleClick() {
			    this.$refs['form'].resetFields()
			    this.$emit('close')
			},
			getCardInfo(id){
				if(!id){
					return null;
				}
				axios({
					service: Service.PSSET.name,
					method: Service.PSSET.methods.bankManageQueryOne,
					args: {id: id}
				}).then((res)=>{
					if(res.data.status === 200){
						//this.provinceChange(res.data.result.provinceCode);
						this.formData = Object.assign(this.formData,res.data.result);
						if(this.formData.voucherUrl && this.formData.voucherUrl.substr(-4) == '.pdf'){
							this.attachType = 'pdf';
						} else {
							this.attachType = 'image';
						}
						this.fileList = [{
							name: this.formData.voucherUrl,
							url: Utils.getFullURL(this.formData.voucherUrl)
						}]
					}else{
						this.$message.error('获取信息失败！');
					}
				})
			},
			provinceChange(provinceCode){
				if(this.editType == 'add'){
					this.formData.cityCode = '';
				}
				this.commonData._cities=getDivisions(this.division, provinceCode);
			},
			handleChange(file,fileList){
			    let len = fileList.length;
			    if(len > 1){
			        this.$refs.upload.uploadFiles = fileList.slice(len-1, len);
			    }
			},
			handleSuccess(response, file, fileList){
				if(response.status === 200 && typeof response.result.filePath){
					this.formData.voucherUrl = response.result.filePath;
				}
			},
			handleRemove(file,fileList){
				this.formData.voucherUrl = '';
			},
			btnOKClick(){
				this.$refs['form'].validate(valid=>{
                    if (valid) {
                    	let formData = this.formData;
                    	formData.createUser = +Cookie.get('t8t-tc-uid');
                    	axios({
                    		service: Service.PSSET.name,
                    		method: Service.PSSET.methods.bankManageCreateOne,
                    		args: { bankManageCreateDTO: formData }
                    	}).then((res)=>{
                    		if(res.data.status === 200){
                    			this.$msgbox({
                    				title: '',
                    				type: 'success',
                    				message: '添加成功',
                    				callback: ()=>{
                    					this.btnCancleClick();
                    					this.$emit('after-edit');
                    				}
                    			})
                    		} else if(res.data.status == 50116){
								this.$msgbox({
                    				title: '',
                    				type: 'error',
                    				message: '当前无默认银行卡，请将银行卡默认状态设为是'
                    			})
							} else{
                    			this.$msgbox({
                    				title: '',
                    				type: 'error',
                    				message: res.data.message ? res.data.message : '添加失败'
                    			})
                    		}
                    	})
                    }
                })
			},
			showAttach(){
				this.attachVisible = true;
				this.attachUrl = Utils.getFullURL(this.formData.voucherUrl)
				if(this.attachType == 'pdf'){
					this.$nextTick(()=>{
					  PDFObject.embed(this.attachUrl, "#pdf");
					})
				}
			}
		}
	}
</script>

<style lang="css" scoped>
	.form-container {
        margin: 0 25px 0 0;
    }
	.item-container {
        float: left;
        width: 50%;
    }
    .w100 {
        width: 100%;
    }
</style>

<style lang="css">
	.form-dialog .el-select {
    	width: 100%;
	}
	.form-dialog .el-upload .el-upload-list{
		margin-bottom: 10px;
	}
</style>
