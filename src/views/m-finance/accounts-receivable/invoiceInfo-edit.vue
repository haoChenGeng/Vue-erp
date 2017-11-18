<template>
<div class="invoice-info-edit">
	<el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog">
	 <div class="t8t-full-dialog-container">
	 	<div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                	<t8t-toolbar
                	     v-if="staging && this.editFields.formData.status == 0"
                        class="t8t-dark"
                        @EDIT="beigin_edit"
                    >
                    </t8t-toolbar>
                    <div v-else>
                    	<el-button v-if="this.editFields.formData.status == 0"  @click="create_invoiceInfo" :disabled="create_button_dis">暂存</el-button>
                    	<el-button v-if="this.editFields.formData.status == 0" @click="sub_invoiceInfo" :disabled="sub_button_dis" >提交</el-button>
                    </div>
                </div>
        </div>
        <div class="pd bt">
            <h2>开票信息</h2>
            <div class="invoiceInfo-panel">
	                <el-form
	                    :inline="true"
	                    :model="editFields.formData"
	                    class="demo-form-inline"
	                    label-position="right"
	                    label-width="150px"
	                    :rules="editFields.rules"
	                    ref="form"
	                 >
		  			    <el-row :gutter="2">
		  					<el-col :span="10">
		            			<el-form-item label="开票类型：" prop="invoiceType">
		    						<el-select
		    							v-model="editFields.formData.invoiceType"
                        				filterable
                        				:allow-create="false"
                        			    placeholder="请选择"
                        			    :disabled="staging"
                        			>
                                           <el-option v-for="item in commonOptionsConfig.invoiceTypeList"
                            					:label="item.text"
                           						 :value="item.value">
                           				   </el-option>
                        			</el-select>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				<el-row :gutter="2">
		  					<el-col :span="10">
		            			<el-form-item label="纳税人类型：" prop="taxPayerType">
		    						<el-select
		    						    v-model="editFields.formData.taxPayerType"
                        				filterable
                        				:allow-create="false"
                        			    placeholder="请选择"
                        			    :disabled="staging"
		    						 >
                                           <el-option v-for="item in commonOptionsConfig.taxPayerTypeList"
                            					:label="item.text"
                           						 :value="item.value">
                           				   </el-option>
                        			</el-select>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
              <el-row :gutter="2">
                <el-col :span="10">
                      <el-form-item label="客户名称：" prop="customerName">
                                    <el-input :disabled="staging" v-model="editFields.formData.customerName" ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
		  				<el-row :gutter="2">
		  					<el-col :span="10">
		            			<el-form-item label="发票抬头：" prop="invoiceTitle">
                                    <el-input :disabled="staging" v-model="editFields.formData.invoiceTitle" ></el-input>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				<template v-if="this.editFields.formData.invoiceType == 2">
		  				<el-row :gutter="2">
		  					<el-col :span="10">
		            			<el-form-item label="纳税人识别号：" prop="registrationNumber">
		    						<el-input :disabled="staging" v-model="editFields.formData.registrationNumber" ></el-input>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				<el-row :gutter="2">
		  					<el-col :span="10">
		            			<el-form-item label="开户行：" prop="bankAddress">
		    						<el-input  :disabled="staging" v-model="editFields.formData.bankAddress" ></el-input>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				<el-row :gutter="2">
		  					<el-col :span="10">
		            			<el-form-item label="银行账号：" prop="bankAccount">
		    						<el-input  :disabled="staging" v-model="editFields.formData.bankAccount" ></el-input>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				<el-row :gutter="2">
		  					<el-col :span="10">
		            			<el-form-item label="注册地址：" prop="registeredAddress">
		    						<el-input  :disabled="staging" v-model="editFields.formData.registeredAddress" ></el-input>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				<el-row :gutter="2">
		  					<el-col :span="10">
		            			<el-form-item label="电话：" prop="registeredPhone_org">
		    						<input-phone
		    						    :disabled="staging"
		    						    v-model="editFields.formData.registeredPhone"
		    						    placeholder="请输入电话"
		    						    :defaultValue="registeredPhone_def"
		    						    @blur="registeredPhone_blur"
		    						>
		    						</input-phone>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				<el-row :gutter="2">
		  					<el-col :span="10" class="upload">
		            			<el-form-item label="一般纳税人公司证明：" prop="companyCertificationUrl">
		    						<el-button
		    						    v-if="staging && editFields.formData.companyCertificationUrl"
                                        size="small"
                                        @click="showImgDialog(0)"
                                    >查看</el-button>
                                    <span v-else-if="staging">未上传</span>
                                    <el-upload
                                        v-else
                                        ref="companyCertification"
                                		:action="uploadURL"
                                		:data="{bucket:'scm', module: 'finance'}"
                                		:show-file-list="true"
                                		:file-list="companyCertificationUrlList"
                                		:on-change="companyCertificationChange"
                                		:on-success="handleSuccess"
                                		:before-upload="beforeUpload"
                                		:on-remove="companyCertification_del"
                                		accept="image/*"
                                	    >
                                		<el-button  size="small">上传文件</el-button>
                            		</el-upload>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				<el-row :gutter="2">
		  					<el-col :span="10" class="upload">
		            			<el-form-item label="公司客户开票信息表：" prop="customerInvoiceInfoUrl">
		    						<el-button
		    						    v-if="staging && editFields.formData.customerInvoiceInfoUrl"
                                        size="small"
                                        @click="showImgDialog(1)"
                                    >查看</el-button>
                                    <span v-else-if="staging">未上传</span>
                                    <el-upload
                                        v-else
                                		ref="customerInvoiceInfo"
                                		:action="uploadURL"
                                		:data="{bucket:'scm', module: 'finance'}"
                                		:show-file-list="true"
                                		:file-list="customerInvoiceInfoUrlList"
                                		:on-change="customerInvoiceInfoChange"
                                		:on-success="handleSuccess"
                                		:before-upload="beforeUpload"
                                		:on-remove="customerInvoiceInfo_del"
                                		accept="image/*"
                                	    >
                                		<el-button size="small">上传文件</el-button>
                            		</el-upload>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				<el-row :gutter="2">
		  					<el-col :span="10" class="upload">
		            			<el-form-item label="公司营业执照复印件：" prop="businessLicenceUrl">
		    						<el-button
		    						    v-if="staging && editFields.formData.businessLicenceUrl"
                                        size="small"
                                        @click="showImgDialog(2)"
                                    >查看</el-button>
                                    <span v-else-if="staging">未上传</span>
                                    <el-upload
                                        v-else
                                		ref="businessLicence"
                                		:action="uploadURL"
                                		:data="{bucket:'scm', module: 'finance'}"
                                		:show-file-list="true"
                                		:file-list="businessLicenceUrlList"
                                		:on-change="businessLicenceChange"
                                		:on-success="handleSuccess"
                                		:before-upload="beforeUpload"
                                		:on-remove="businessLicence_del"
                                		accept="image/*"
                                	    >
                                		<el-button size="small" >上传文件</el-button>
                            		</el-upload>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				<el-row :gutter="2">
		  					<el-col :span="10" class="upload">
		            			<el-form-item label="公司委托个人付款证明：" prop="entrustedCertificateUrl">
		            				<el-button
		    						    v-if="staging && editFields.formData.entrustedCertificateUrl"
                                        size="small"
                                        @click="showImgDialog(3)"
                                    >查看</el-button>
                                    <span v-else-if="staging">未上传</span>
                                    <el-upload
                                        v-else
                                		ref="entrustedCertificate"
                                		:action="uploadURL"
                                		:data="{bucket:'scm', module: 'finance'}"
                                		:show-file-list="true"
                                		:file-list="entrustedCertificateUrlList"
                                		:on-change="entrustedCertificateChange"
                                		:on-success="handleSuccess"
                                		:before-upload="beforeUpload"
                                		:on-remove="entrustedCertificate_del"
                                		accept="image/*"
                                	    >
                                		<el-button size="small" >上传文件</el-button>
                            		</el-upload>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				</template>
		  				<el-row :gutter="2">
		  					<el-col :span="9">
		            			<el-form-item label="邮寄地址：" prop="townIdArr">
		    						 <t8t-division
		    						      v-model="editFields.formData.townIdArr"
		    						      :defaultValue="editFields.formData.townId"
		    						      @change="div_change"
		    						      :disabled="staging"
		    						      ref="division"
		    						      class="invoiceinfo_item_division"
									    ></t8t-division>
		  						</el-form-item>
		  					</el-col>
		  					<el-col :span="4">
		  					    <el-form-item prop="postAddress">
		  							<el-input v-model="editFields.formData.postAddress" :disabled="staging" ></el-input>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				<el-row :gutter="2">
		  					<el-col :span="10">
		            			<el-form-item label="联系人：" prop="contactPerson">
		    						 <el-input v-model="editFields.formData.contactPerson" :disabled="staging"></el-input>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  				<el-row :gutter="2">
		  					<el-col :span="9">
		            			<el-form-item label="联系电话：" prop="contactPhone_org">
		    						<input-phone
		    						  :disabled="staging"
		    						  v-model="editFields.formData.contactPhone"
		    						  :defaultValue="contactPhone_def"
		    						  @blur="contactPhone_blur"
		    						>
		    						</input-phone>
		  						</el-form-item>
		  					</el-col>
		  				</el-row>
		  			</el-form>
	  			</div>
        </div>
	 </div>
	</el-dialog>
	<t8t-gallery
      ref="gallery"
	    v-model="galleryVisible"
	    :data="galleryData"
	></t8t-gallery>
</div>
</template>
<script>
	import Service from 'src/services/finance/Service.js'
	// import T8tUpload from 'src/components/t8t-upload/t8t-upload.vue'
	import InputPhone from 'src/components/t8t-form/inputPhone.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import axios from 'src/utils/axios.js'
    import Utils from 'src/utils/Utils.js'
    import Cookie from 'js-cookie'
    import editFields from './edit_fields.json'
    export default {
          name: 'invoiceInfo-edit',
          components:{
             // T8tUpload,
             InputPhone
          },
          data(){
          	return{
          	  	isDialogShow:true,
          	  	service:Service.RECEIVABLE.name,
              	staging:true,
              	commonData:[],
              	uploadURL: '',
              	fields:[],
                editFields:editFields,
                commonOptionsConfig:{
                      invoiceTypeList:[
                            {value: 1, text: '增值税普通发票'},
                        	{value: 2, text: '增值税专用发票'}
                      ],
                      taxPayerTypeList:[
                       		{value: 1, text: '个人'},
                        	{value: 2, text: '一般纳税人公司'},
                          {value: 3, text: '小规模纳税人公司'}
                      ]
                },
                imgUrl:'',
                uploadURL:'',
                companyCertificationUrlList:[],
                customerInvoiceInfoUrlList:[],
                businessLicenceUrlList:[],
                entrustedCertificateUrlList:[],
                galleryVisible:false,
                galleryData:[],
                resList:[],
                uploadType:'',
                contactPhone_def:'',
                registeredPhone_def:'',
                create_button_dis: false,
                sub_button_dis:false,
          		}

          	},
          	created(){
                this.uploadURL = Utils.getUploadURL()
                if(this.$route.path.endsWith('edit')){
                	 this.staging = false
                }
                if(this.$route.path.endsWith('view')){
                	 this.staging = true
                }
                var checkPhone = (rule, value, callback) =>{
                	 if(!value){
                	 	return callback(new Error('手机号不能为空'));
                	 }
                     if(! /^1[34578]\d{9}$/.test(value)){
                          return callback(new Error('手机号格式错误'));
                      }
                      callback()
                };
                var checkTel = (rule, value, callback) =>{
                	if(!value){
                	 	return callback(new Error('电话不能为空'));
                	 }
                     if(! /^([\d]{3}\-?)?[\d]{5,9}$/.test(value)){
                          return callback(new Error('电话号码格式错误'));
                      }
                      callback()
                };
                var checkBankAccount = (rule, value, callback) => {
                     if(!value){
                	 	return callback(new Error('银行账号不能为空'));
                	 }
                	 if(! /^\d{16,20}$/.test(value)){
                	 	  return callback(new Error('银行账号格式错误'));
                	 }
                	 callback()
                };
                this.editFields.rules.contactPhone_org = [
           	    		{"validator": checkPhone, "type":"number", "required": true, }
           		]
           		this.editFields.rules.registeredPhone_org = [
           	    		{"validator": checkTel, "type":"number", "required": true, }
           		]
           		this.editFields.rules.bankAccount = [
           	    		{"validator": checkBankAccount, "type":"number", "required": true, }
           		]
           		this.editFields.rules.registrationNumber = [
           				{"required": true,"message": "请填写纳税人识别号", "trigger": "blur"},
           				{ "min": 1, "max": 50, "message": "纳税人识别号长度不能超过50 个字符", "trigger": "blur" },
           	    		{"pattern": /^\d+$/, "message": "纳税人识别号只能为数字", "trigger": "blur"}
           		]
           		if(this.$route.query.id){
           			this._init(this.$route.query.id)
           		}else{
           			this.viewInit()
           		}
          	},
          	watch:{
                       'editFields.formData.townIdArr':function(){
                            if(this.editFields.formData.townIdArr.length > 2)
                       	        this.editFields.formData.townId = this.editFields.formData.townIdArr[2]
                       }

          	},
          	methods:{
          		 closeDialog() {
            		this.$router.go(-1)
        		},
          		showImgDialog(index){
                this.galleryData = []
                let list = ['companyCertificationUrl', 'customerInvoiceInfoUrl', 'businessLicenceUrl', 'entrustedCertificateUrl']
                list.forEach((item) => {
                     if(this.editFields.formData[item]){
                            this.galleryData.push({
                                    title:item,
                                     src:Utils.getFullURL(this.editFields.formData[item])
                                })
                     }
                })
                this.$refs['gallery'].setActiveItem(index)
          			this.galleryVisible = true
          		},
          		companyCertificationChange(file, fileList){
                console.info(file)
          			if(fileList.length > 1) fileList.shift()
          		    if(file['status'] == 'success' && file['response']['status'] != 200){
          		    	this.$message({
                                type: 'error',
                                message: '上传失败'
                    	});
                    	fileList.shift()
          		    }else if(file['status'] == 'success'){
          		    	this.editFields.formData.companyCertificationUrl =  file['response']['result']['filePath']
          		    	this.$refs['form'].validateField('companyCertificationUrl')
          		    	this.companyCertificationUrlList = [{name:file.name, url:Utils.getFullURL(file['response']['result']['filePath'])}]
          		    }
          		},
              customerInvoiceInfoChange(file, fileList){
                if(fileList.length > 1) fileList.shift()
                  if(file['status'] == 'success' && file['response']['status'] != 200){
                    this.$message({
                                type: 'error',
                                message: '上传失败'
                      });
                      fileList.shift()
                  }else if(file['status'] == 'success'){
                    this.editFields.formData.customerInvoiceInfoUrl =  file['response']['result']['filePath']
                    this.$refs['form'].validateField('customerInvoiceInfoUrl')
                    this.customerInvoiceInfoUrlList = [{name:file.name, url:Utils.getFullURL(file['response']['result']['filePath'])}]
                  }
              },
              businessLicenceChange(file, fileList){
                if(fileList.length > 1) fileList.shift()
                  if(file['status'] == 'success' && file['response']['status'] != 200){
                    this.$message({
                                type: 'error',
                                message: '上传失败'
                      });
                      fileList.shift()
                  }else if(file['status'] == 'success'){
                    this.editFields.formData.businessLicenceUrl =  file['response']['result']['filePath']
                    this.$refs['form'].validateField('businessLicenceUrl')
                    this.businessLicenceUrlList = [{name:file.name, url:Utils.getFullURL(file['response']['result']['filePath'])}]
                  }
              },
              entrustedCertificateChange(file, fileList){
                if(fileList.length > 1) fileList.shift()
                  if(file['status'] == 'success' && file['response']['status'] != 200){
                    this.$message({
                                type: 'error',
                                message: '上传失败'
                      });
                      fileList.shift()
                  }else if(file['status'] == 'success'){
                    this.editFields.formData.entrustedCertificateUrl =  file['response']['result']['filePath']
                    this.$refs['form'].validateField('entrustedCertificateUrl')
                    this.entrustedCertificateUrlList = [{name:file.name, url:Utils.getFullURL(file['response']['result']['filePath'])}]
                  }
              },
          		beforeUpload(file){
		            if(file.size > 1024*1024*5){
		                this.$message.error('图片大小超过5M！')
		                this.$refs[this.uploadType].clearFiles()
		                return false
		            }
        		},
          		beigin_edit(){
          			this.staging = false
          		},
          		div_change(value, val){
          		},
          		registeredPhone_blur(value){
          			this.editFields.formData.registeredPhone_org = value
          			this.$refs['form'].validateField('registeredPhone_org')
                    return true
          		},
          		contactPhone_blur(value){
          			this.editFields.formData.contactPhone_org = value
          			this.$refs['form'].validateField('contactPhone_org')
                    return true
          		},
          		companyCertification_del(){
                     this.editFields.formData.companyCertificationUrl = ''
          		},
          		customerInvoiceInfo_del(){
                      this.editFields.formData.customerInvoiceInfoUrl = ''
          		},
          		businessLicence_del(){
                     this.editFields.formData.businessLicenceUrl = ''
          		},
          		entrustedCertificate_del(){
                     this.editFields.formData.entrustedCertificateUrl = ''
          		},
          		create_invoiceInfo(){
          			 this.$refs['form'].validate((isValid) =>{
          			 	  if(isValid){
          			 	  	    var method = ''
          			 	  	    var args = {}
                          var type = ''
          			 	  	    this.create_button_dis = true
                          		if(this.editFields.formData.id){
                                      type = 'update'
                                      method = Service.RECEIVABLE.methods.customerInvoiceInfoUpdateInfo
                                      args = {custormerInvoiceInfoUpdateDto:this.makeData(), updateUserId:Cookie.get('t8t-tc-uid')}
                          		}else{
                                  type = 'add'
                          			  method = Service.RECEIVABLE.methods.customerInvoiceInfoCreateInfo
                          			  args = {dedicatedInfoCreateDto:this.makeData(), createUserId:Cookie.get('t8t-tc-uid')}
                          		}
                          		axios({
			                            method: method,
			                            service: this.service,
			                            args: args
			                        }).then((res) => {
			                        	     this.create_button_dis = false
                                             if (res.data.status === 200) {
                                             	this.$message({
                                						type: 'success',
                                						message: '暂存成功！'
                           						     });
                                              if(type == 'add'){
                                                    this.editFields.formData.id = res.data.result
                                             }
                                             }else{
                                                this.$message({
                               							 type: 'error',
                                						 message: res.data.message
                            						})
                                             }
			                          	}
          			 			)
          			 		}
          			 	})
                    // this.editFields.formData.townId = this.
          	},
          	sub_invoiceInfo(){
                  this.$refs['form'].validate((isValid) =>{
          			 	  if(isValid){
          			 	  	    var method = ''
          			 	  	    var args = {}
                          var type = ''
          			 	  	    this.sub_button_dis = true
                          		if(this.editFields.formData.id){
                                      type = 'update'
                                      method = Service.RECEIVABLE.methods.customerInvoiceInfoUpdateSubmitInfo
                                      args = {custormerInvoiceInfoUpdateDto:this.makeData(), updateUserId:Cookie.get('t8t-tc-uid')}
                          		}else{
                                  type = 'add'
                          			  method = Service.RECEIVABLE.methods.customerInvoiceInfoCreateSubmitInfo
                          			  args = {dedicatedInfoCreateDto:this.makeData(), createUserId:Cookie.get('t8t-tc-uid')}
                          		}
                          		axios({
			                            method: method,
			                            service: this.service,
			                            args: args
			                        }).then((res) => {
			                        	      this.sub_button_dis = false
                                               if (res.data.status === 200) {
                                               	  this.$message({
                                  						      type: 'success',
                                  						      message: '提交成功！'
                             						           });
                                              this.editFields.formData.status = 1
                                              this.staging = true
                                              if(type == 'add'){
                                                    this.editFields.formData.id = res.data.result
                                              }
                                             }else{
                                                this.$message({
                               							 type: 'error',
                                						 message: res.data.message
                            						})
                                             }
			                          	}
          			 			)
          			 		}
          			 	})
          	},
                _init(id){
                    axios({
                            method: Service.RECEIVABLE.methods.customerInvoiceInfoGetInfo,
                            service: this.service,
                            args: {"custormerInvoiceInfoId":id}
                        }).then((res) => {
                             if(res.data.status === 200){
                                  let data = res.data.result
                                  this.editFields.formData.id = data.id
                                  this.editFields.formData.customerId = data.customerId
                                  this.editFields.formData.invoiceType = data.invoiceType
                                  this.editFields.formData.taxPayerType = data.taxPayerType
                                  this.editFields.formData.townId = data.townId
                                  this.editFields.formData.postAddress = data.postAddress
                                  this.editFields.formData.contactPerson = data.contactPerson
                                  this.editFields.formData.contactPhoneId = data.contactPhoneId
                                  this.editFields.formData.customerName = data.customerName
                                  this.contactPhone_def = data.contactPhone
                                  this.editFields.formData.contactPhone = data.contactPhone
                                  this.editFields.formData.contactPhone_org = data.contactPhone
                                  this.editFields.formData.status = data.status
                                  this.editFields.formData.invoiceTitle = data.invoiceTitle
                                  if(data.invoiceType == 2){
                                  	 this.editFields.formData.registrationNumber = data.registrationNumber
                                  	 this.editFields.formData.bankAddress = data.bankAddress
                                  	 this.editFields.formData.bankAccount = data.bankAccount
                                  	 this.editFields.formData.registeredAddress = data.registeredAddress
                                  	 this.editFields.formData.registeredPhoneId = data.registeredPhoneId
                                  	 this.registeredPhone_def = data.registeredPhone
                                  	 this.editFields.formData.registeredPhone = data.registeredPhone
                                     this.editFields.formData.registeredPhone_org = data.registeredPhone
                                  	 this.editFields.formData.companyCertificationUrl = data.companyCertificationUrl
                                  	 this.editFields.formData.customerInvoiceInfoUrl = data.customerInvoiceInfoUrl
                                  	 this.editFields.formData.businessLicenceUrl = data.businessLicenceUrl
                                  	 this.editFields.formData.entrustedCertificateUrl = data.entrustedCertificateUrl
                          	 	   if(data.companyCertificationUrl){
                          	 	   	    this.companyCertificationUrlList = [{
                          	 	   	    	       name:'companyCertification.jpg',
                          	 	   	    	       url:Utils.getFullURL(data.companyCertificationUrl)
                          	 	   	    	   }]
                          	 	   }
                          	 	   if(data.customerInvoiceInfoUrl){
                          	 	   	    this.customerInvoiceInfoUrlList = [{
                          	 	   	    	       name:'customerInvoiceInfo.jpg',
                          	 	   	    	       url:Utils.getFullURL(data.customerInvoiceInfoUrl)
                          	 	   	    	   }]
                          	 	   }
                          	 	   if(data.businessLicenceUrl){
                          	 	   	    this.businessLicenceUrlList = [{
                          	 	   	    	       name:'businessLicence.jpg',
                          	 	   	    	       url:Utils.getFullURL(data.businessLicenceUrl)
                          	 	   	    	   }]
                          	 	   }
                          	 	   if(data.entrustedCertificateUrl){
                          	 	   	    this.entrustedCertificateUrlList = [{
                          	 	   	    	       name:'entrustedCertificate.jpg',
                          	 	   	    	       url:Utils.getFullURL(data.entrustedCertificateUrl)
                          	 	   	    	   }]
                          	 	   }
                                  }
                             }else{
                             	this.$message({
                               			type: 'error',
                                		message: res.data.message
                            		})
                             }
                        })
                },
                makeData(){
                	let data = {
				            "customerTypeId": 662,
				            "customerId": 124,
				            "invoiceType":this.editFields.formData.invoiceType,
				            "taxPayerType":this.editFields.formData.taxPayerType,
				            "townId":this.editFields.formData.townId,
				            "postAddress":this.editFields.formData.postAddress,
				            "contactPerson":this.editFields.formData.contactPerson,
				            "contactPhoneStr":this.editFields.formData.contactPhone,
				            "invoiceTitle":this.editFields.formData.invoiceTitle,
                    "customerName":this.editFields.formData.customerName
                	 }

                	 if(this.editFields.formData.invoiceType == 2){
                	 	 Object.assign(data, {
						            "registrationNumber":this.editFields.formData.registrationNumber,
						            "bankAddress":this.editFields.formData.bankAddress,
						            "bankAccount":this.editFields.formData.bankAccount,
						            "registeredAddress":this.editFields.formData.registeredAddress,
						            "registeredPhoneStr":this.editFields.formData.registeredPhone,
						            "companyCertificationUrl":this.editFields.formData.companyCertificationUrl,
						            "customerInvoiceInfoUrl":this.editFields.formData.customerInvoiceInfoUrl,
						            "businessLicenceUrl":this.editFields.formData.businessLicenceUrl,
						            "entrustedCertificateUrl":this.editFields.formData.entrustedCertificateUrl
                	 	    })
                	  }
                	  if(this.editFields.formData.id){
                	  	  data['id'] = this.editFields.formData.id
                	  }
                	  return data
                },
               viewInit(){
               	   this.editFields.formData = {
										    "id":"",
								            "invoiceType":"",
								            "taxPayerType":"",
								            "invoiceTitle":"",
								            "registrationNumber":"",
								            "bankAddress":"",
								            "bankAccount":"",
								            "registeredAddress":"",
								            "registeredPhoneStr":"",
								            "registeredPhone":"",
								            "companyCertificationUrl":"",
								            "customerInvoiceInfoUrl":"",
								            "businessLicenceUrl":"",
								            "entrustedCertificateUrl":"",
								            "townId":"",
								            "townIdArr":[],
								            "postAddress":"",
								            "contactPerson":"",
								            "contactPhoneStr":"",
								            "contactPhone":"",
								            "status":"",
                            "customerName":""
							}
               }
          	}
          }
</script>

<style lang="css" scoped>
    .t8t-full-dialog{

    }
    .text-center{
        text-align: center;
    }
    .bt{
        border-top: 2px solid #eff7fa;
        margin: 0;
        overflow: auto;
    }
    .pd {
        padding: 0 30px;
        display: flex;
        flex: 1;
        flex-direction: column;
    }
    .pd h2{
    	width: 1200px;
    	margin: 30px auto 5px;
    }
    .footer{
        display: flex;
        height: 50px;
        -ms-align-items: center;
        align-items: center;
    }
    .footer .left{
        font-size: 14px;
        margin-left: 10px;
    }
    .footer .right{
        font-size: 14px;
        margin-left: 1415px;
    }
/*form-panel*/

.invoiceInfo-panel {
    width: 1200px;
    margin: 30px auto 5px;
    /*overflow: hidden;*/
}

.invoiceInfo-panel .el-form {
    width: 100%;
}

.invoiceInfo-panel .el-form .el-row {
    width: 100%;
}


.invoiceInfo-panel .el-input .el-input__inner {
    color: #666;
    font-size: 12px;
}

.invoiceInfo-panel .el-form-item.is-required .el-form-item__label:before {
    font-family: "sans-serif";
    font-weight: bold;
}

.invoiceInfo-panel .el-rate {
    text-align: center;
    padding: 6px 0;
}

.invoiceInfo-panel .el-rate__icon {
    font-size: 20px;
}
</style>


<style>
.invoiceInfo-panel .el-upload-list{
	margin: 0 10px;
    padding: 0;
    list-style: none;
    display: inline-block;
}
.invoiceInfo-panel .el-form-itemr .el-form-item__content {
    width: 180px;
}
.invoiceInfo-panel .el-form-item .el-form-item__label {
    color: #333;
    font-size: 12px;
}
    .t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }
    .t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .t8t-full-dialog .toolbar-container .el-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog .toolbar-container .el-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .t8t-full-dialog .container-center{
        width: 1250px;
        margin-left: auto;
        margin-right: auto;
    }
    .t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
    }
    .t8t-full-dialog .form-item-container{
        width: 25%;
    }
    .t8t-full-dialog .full-dialog-form-container{
        margin-top: 0px;
    }
    .t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
/*        width: 1220px;
        margin: 0 auto;*/
    }
    .t8t-full-dialog .el-tab-pane{
        flex: 1;
        overflow: auto;
    }
    .t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }


.t8t-toolbar {
    padding: 13px;
    height: 24px;
}

.t8t-toolbar .el-button--toolbar:first-child {
    margin-left: 8px;
}

.t8t-toolbar .el-button--toolbar {
    padding: 5px 11px;
    font-size: 12px;
    border-radius: 2px;
    border-color: rgb(232, 237, 241);
    color: rgb(50, 139, 239);
    margin-right: 5px;
}

.t8t-toolbar .el-button--toolbar:focus {
    border-color: rgb(191, 201, 217)
}

.t8t-toolbar .el-button--toolbar:hover {
    border-color: rgb(50, 139, 239)
}

.t8t-toolbar .is-disabled {
    color: rgb(191, 203, 217);
    border-color: rgb(209, 219, 229);
}

.t8t-toolbar .is-disabled:hover {
    border-color: rgb(209, 219, 229);
}

.t8t-toolbar .el-button--success.is-plain {
    color: rgb(19, 206, 102)
}

.t8t-toolbar .el-button--danger.is-plain {
    color: rgb(255, 86, 97)
}

.t8t-toolbar .el-button + .el-button {
    margin-left: 0px;
}
/* 深色皮肤 */
.t8t-toolbar.t8t-dark .el-button--toolbar{
    background-color: #1e3046;
    color: #d1dde9;
    border: 1px solid #09131d;
}
.t8t-toolbar.t8t-dark .el-button--toolbar:hover{
    color: #1e3046;
    background-color: #d2deeb;
}
</style>
<style>
    .invoiceinfo_item_division{
    	width: 280px;
    }
    .invoiceinfo_item_division .el-input{
    	width: 280px;
    }
    .invoice-info-edit .el-form--inline .el-form-item__content{
       width: 200px;
    }
     .invoice-info-edit .upload .el-form-item__content{
       width: 325px;
    }
    .invoice-info-edit .el-select{
      width: 200px;
    }
</style>
