<template>
    <div class="invoiceSales-view">
    	<el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog">
    		<div class="t8t-full-dialog-container">
    			<!-- 顶部按钮区 -->
	            <div class="full-dialog-toolbar-container">
	                <div class="toolbar-container">
	                </div>
	            </div>
	            <div class="full-dialog-form-container container-center">
	                <el-row :gutter="15">
	                    <el-col :span="3">
	                      组织：
	                    </el-col>
	                    <el-col :span="3">
								<el-input v-model="formData.origanizationName" :disabled="true" ></el-input>
							</el-col>
							<el-col :span="3">
	                      业务类型：
	                    </el-col>
	                    <el-col :span="3">
								<el-input v-model="formData.bussinessTypeName" :disabled="true" ></el-input>
							</el-col>
							<el-col :span="3">
	                      服务类型：
	                    </el-col>
	                    <el-col :span="3">
								<el-input v-model="formData.serviceTypeName" :disabled="true" ></el-input>
							</el-col>
	                </el-row>
	                <el-row :gutter="15">
	                    <el-col :span="3">
	                      客户：
	                    </el-col>
	                    <el-col :span="3">
								<el-input v-model="formData.customerTypeName" :disabled="true" ></el-input>
							</el-col>
							<el-col :span="3">
	                      客户ID：
	                    </el-col>
	                    <el-col :span="3">
								<el-input v-model="formData.customerId" :disabled="true" ></el-input>
							</el-col>
							<el-col :span="3">
	                      客户名称：
	                    </el-col>
	                    <el-col :span="3">
								<el-input v-model="formData.customerName" :disabled="true" ></el-input>
							</el-col>
	                </el-row>

            	</div>
                <div class="full-dialog-tabs-container invoiceSales">
	            	<el-tabs v-model="main_info" @tab-click="main_tab_change" style="width:100%">
	                    <el-tab-pane label="基本信息" name="baseInfo">
	                          <el-row :gutter="10">
				                    <el-col :span="3">
				                      是否传金税：
				                    </el-col>
				                    <el-col :span="3">
										<el-input :value="formData.isGoldenTax == 1 ? '是' : '否'" :disabled="true" ></el-input>
									</el-col>
									<el-col :span="3">
				                      发票号：
				                    </el-col>
				                    <el-col :span="3">
										<el-input v-model="formData.invoiceNumber" :disabled="true" ></el-input>
									</el-col>
				                </el-row>
				                <el-row :gutter="10">
				                    <el-col :span="3">
				                      是否红冲：
				                    </el-col>
				                    <el-col :span="3">
										<el-input :value="formData.isRedFlush == 1 ? '是' : '否'" :disabled="true" ></el-input>
									</el-col>
									<el-col :span="3">
				                      原单据编号：
				                    </el-col>
				                    <el-col :span="3">
										<el-input v-model="formData.oldInvoiceCode" :disabled="true" ></el-input>
									</el-col>
				                </el-row>
	                    </el-tab-pane>
	                    <el-tab-pane label="明细信息" name="detailInfo">
	                       <t8t-table
	                                ref="detailListTable"
	                                :columns="detailListColumns"
	                                :pageBar="false"
	                                :editable="false"
	                                :selectCol="false"
	                                :dataSource="detailListData"
	                        >
	                        </t8t-table>
	                    </el-tab-pane>
	                     <el-tab-pane label="开票信息" name="invoiceInfo">
	                         <el-form
			                    :inline="true"
			                    :model="formData"
			                    class="demo-form-inline"
			                    label-position="right"
			                    label-width="150px"
			                    :rules="rules"
			                    ref="form"
			                 >
				  			    <el-row :gutter="2">
				  					<el-col :span="8">
				            			<el-form-item label="开票类型：" prop="invoiceType">
				    						<el-select
				    							v-model="formData.invoiceType"
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
				  					<el-col :span="8">
				            			<el-form-item label="纳税人类型：" prop="taxPayerType">
				    						<el-select
				    						    v-model="formData.taxPayerType"
		                        				:allow-create="false"
		                        			    placeholder="请选择"
		                        			    :disabled="staging"
				    						 >
		                                           <el-option v-for="item in commonOptionsConfig.taxpayerTypeList"
		                            					:label="item.text"
		                           						 :value="item.value">
		                           				   </el-option>
		                        			</el-select>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				<el-row :gutter="2">
				  					<el-col :span="8">
				            			<el-form-item label="发票抬头：" prop="invoiceTitle">
		                                    <el-input :disabled="staging" v-model="formData.invoiceTitle" ></el-input>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				<template v-if="this.formData.invoiceType == 2">
				  				<el-row :gutter="2">
				  					<el-col :span="8">
				            			<el-form-item label="纳税人识别号：" prop="registrationNumber">
				    						<el-input :disabled="staging" v-model="formData.registrationNumber" ></el-input>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				<el-row :gutter="2">
				  					<el-col :span="8">
				            			<el-form-item label="开户行：" prop="bankAddress">
				    						<el-input  :disabled="staging" v-model="formData.bankAddress" ></el-input>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				<el-row :gutter="2">
				  					<el-col :span="8">
				            			<el-form-item label="银行账号：" prop="bankAccount">
				    						<el-input  :disabled="staging" v-model="formData.bankAccount" ></el-input>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				<el-row :gutter="2">
				  					<el-col :span="8">
				            			<el-form-item label="注册地址：" prop="registeredAddress">
				    						<el-input  :disabled="staging" v-model="formData.registeredAddress" ></el-input>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				<el-row :gutter="2">
				  					<el-col :span="8">
				            			<el-form-item label="电话：" prop="registeredPhone">
				    						<el-input v-model="formData.registeredPhone" :disabled="staging"></el-input>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				<el-row :gutter="2">
				  					<el-col :span="8" class="upload">
				            			<el-form-item label="一般纳税人公司证明：" prop="companyCertificationUrl">
				    						<el-button
				    						    v-if="staging && formData.companyCertificationUrl"
		                                        size="small"
		                                        @click="showImgDialog(0)"
		                                    >查看</el-button>
		                                    <span v-else-if="staging">未上传</span>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				<el-row :gutter="2">
				  					<el-col :span="8" class="upload">
				            			<el-form-item label="公司客户开票信息表：" prop="customerInvoiceInfoUrl">
				    						<el-button
				    						    v-if="staging && formData.customerInvoiceInfoUrl"
		                                        size="small"
		                                        @click="showImgDialog(1)"
		                                    >查看</el-button>
		                                    <span v-else-if="staging">未上传</span>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				<el-row :gutter="2">
				  					<el-col :span="8" class="upload">
				            			<el-form-item label="公司营业执照复印件：" prop="businessLicenceUrl">
				    						<el-button
				    						    v-if="staging && formData.businessLicenceUrl"
		                                        size="small"
		                                        @click="showImgDialog(2)"
		                                    >查看</el-button>
		                                    <span v-else-if="staging">未上传</span>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				<el-row :gutter="2">
				  					<el-col :span="8" class="upload">
				            			<el-form-item label="公司委托个人付款证明：" prop="entrustedCertificateUrl">
				            				<el-button
				    						    v-if="staging && formData.entrustedCertificateUrl"
		                                        size="small"
		                                        @click="showImgDialog(3)"
		                                    >查看</el-button>
		                                    <span v-else-if="staging">未上传</span>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				</template>
				  				<el-row :gutter="2">
				  					<el-col :span="9" class="invoiceSales_item_division">
				            			<el-form-item label="邮寄地址：" prop="townId">
				    						 <t8t-division
				    						      v-model="townIdArr"
				    						      :defaultValue="formData.townId"
				    						      :disabled="staging"
				    						      ref="division"
											    ></t8t-division>
				  						</el-form-item>
				  					</el-col>
				  					<el-col :span="3">
				  					    <el-form-item prop="postAddress">
				  							<el-input v-model="formData.postAddress" :disabled="staging" ></el-input>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				<el-row :gutter="2">
				  					<el-col :span="8">
				            			<el-form-item label="联系人：" prop="contactPerson">
				    						 <el-input v-model="formData.contactPerson" :disabled="staging"></el-input>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  				<el-row :gutter="2">
				  					<el-col :span="8">
				            			<el-form-item label="联系电话：" prop="contactPhone">
				    						<el-input v-model="formData.contactPhone" :disabled="staging"></el-input>
				  						</el-form-item>
				  					</el-col>
				  				</el-row>
				  			</el-form>
	                    </el-tab-pane>
	                    <el-tab-pane label="金额信息" name="amountInfo">
			                     <el-row :gutter="15">
				                    <el-col :span="3">
				                      销售金额（含税）：
				                    </el-col>
				                    <el-col :span="3">
										<el-input v-model="formData.beforeTaxAmount" :disabled="true" ></el-input>
									</el-col>
									<el-col :span="3">
				                      销售金额（不含税）：
				                    </el-col>
				                    <el-col :span="3">
										<el-input v-model="formData.afterTaxAcmount" :disabled="true" ></el-input>
									</el-col>
									<el-col :span="3">
				                      税额：
				                    </el-col>
				                    <el-col :span="3">
										<el-input v-model="formData.taxAmount" :disabled="true" ></el-input>
									</el-col>
				                </el-row>
				                <el-row :gutter="15">
				                    <el-col :span="3">
				                      未缴金额：
				                    </el-col>
				                    <el-col :span="3">
										<el-input v-model="formData.unpaidAmount" :disabled="true" ></el-input>
									</el-col>
				                </el-row>
	                    </el-tab-pane>
	                    <el-tab-pane label="操作记录" name="operRecoders">
	                      	<t8t-table
	                                ref="NodeListTable"
	                                :columns="operRecodersColumns"
	                                :service="operRecodersService"
	                                :method="operRecodersMethod"
	                                :args="operRecoderstArgs"
	                                :pageBar="true"
	                                :selectCol="false"
	                                :commonData="commonOptionsConfig"
	                        >
	                        </t8t-table>
	                    </el-tab-pane>
	                    <el-tab-pane label="其他信息" name="otherInfo">
	                      	<el-row :gutter="15">
				                    <el-col :span="3">
				                      创建人：
				                    </el-col>
				                    <el-col :span="3">
										<el-input v-model="formData.createUserName" :disabled="true" ></el-input>
									</el-col>
									<el-col :span="3">
				                      创建时间：
				                    </el-col>
				                    <el-col :span="3">
										<el-input :value="formData.createTime | dateParser" :disabled="true" ></el-input>
									</el-col>
									<el-col :span="3">
				                      记账时间：
				                    </el-col>
				                    <el-col :span="3">
										<el-input :value="formData.amounttingTime | dateParser" :disabled="true" ></el-input>
									</el-col>
				                </el-row>
				                <el-row :gutter="15">
				                    <el-col :span="3">
				                      修改人：
				                    </el-col>
				                    <el-col :span="3">
										<el-input v-model="formData.updateUserName" :disabled="true" ></el-input>
									</el-col>
									<el-col :span="3">
				                      修改时间：
				                    </el-col>
				                    <el-col :span="3">
										<el-input :value="formData.updateTime | dateParser" :disabled="true" ></el-input>
									</el-col>
				                </el-row>
	                    </el-tab-pane>
	                </el-tabs>
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
    import commonApi from 'src/services/commonApi/commonApi.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import Utils from 'src/utils/Utils.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    export default {
          name: 'invoiceSales-view',
          data(){
          	  return {
          	  	  info:'',
          	  	  isDialogShow:true,
          	  	  staging:true,
          	  	  main_info:'baseInfo',
          	  	  townIdArr:[],
          	  	  formData:{},
          	  	  service:Service.RECEIVABLE.name,
          	  	  operRecodersService:null,
          	  	  operRecodersMethod:null,
          	  	  operRecoderstArgs:{},
                  commonOptionsConfig:{
                    	customerTypeList:[],
                    	businessTypeList:[],
                        invoiceTypeList:[
                        		{
                            		text: '增值税普通发票',
                            		value: 1
                        		},
                        		{
                            		text: '增值税专用发票',
                            		value: 2
                        		}
                        ],
                        taxpayerTypeList:[
                        		{
                            		text: '个人',
                            		value: 1
                        		},
                        		{
                            		text: '一般纳税人公司',
                            		value: 2
                        		},
                        		{
                            		text: '小规模纳税人公司',
                            		value: 3
                        		}
                        ]
                    },
                    detailListColumns:[
                           { "prop": "sourceOrderTypeName", "label": "关联单据" },
                           { "prop": "sourceOrderCode", "label": "单据编号" },
                           { "prop": "amount", "label": "金额" }
                    ],
                    operRecodersColumns:[
                    	  { "prop": "opType", "label": "修改内容" },
                    	  { "prop": "opTime", "label": "修改时间" , "formatter": "dateParser" },
                    	  { "prop": "username", "label": "修改人" },
                    ],
                    rules:{
                    	invoiceType:{"required": true, "message": " "},
                    	taxPayerType:{"required": true, "message": " "},
                    	invoiceTitle:{"required": true, "message": " "},
                    	registrationNumber:{"required": true, "message": " "},
                    	bankAddress:{"required": true, "message": " "},
                    	bankAccount:{"required": true, "message": " "},
                    	registeredAddress:{"required": true, "message": " "},
                    	registeredPhone:{"required": true, "message": " "},
                    	companyCertificationUrl:{"required": true, "message": " "},
                    	customerInvoiceInfoUrl:{"required": true, "message": " "},
                    	businessLicenceUrl:{"required": true, "message": " "},
                    	townId:{"required": true, "message": " "},
                    	postAddress:{"required": true, "message": " "},
                    	contactPerson:{"required": true, "message": " "},
                    	contactPhone:{"required": true, "message": " "},
                    },
                    detailListData:[],
                    galleryVisible:false,
                    galleryData:[]
                }
              },
              created(){
    				this.getCommonOptions('61004', 'customerTypeList')
    				this.getCommonOptions('11008', 'businessTypeList')
    				this.iniData(this.$route.query.id)
              },
		        filters: {
		            dateParser(text) {
		                let dateString;
		                let objDate = new Date(text * 1000);
		                if (text === 0 || text === null || typeof(text) == 'undefined') {
		                    dateString = ""
		                } else {
		                    dateString = DateUtils(objDate, 'yyyy-mm-dd HH:MM:ss')
		                }
		                return dateString
		            }
		        },
              methods:{
              	closeDialog() {
            		this.$router.go(-1)
        		},
        		main_tab_change(tab, event){
        			if(tab.name == 'operRecoders' && this.operRecodersService === null){
                  			this.operRecodersService = Service.LOG_SERVICE.name
          	  	  			this.operRecodersMethod = Service.LOG_SERVICE.methods.QUERY_PAGE
          	  	  			this.operRecoderstArgs = {search:{recordNo:this.formData.invoiceCode, recordType:"XF"}, sort:["opTime_desc"]}
          	  	  	}
        		},
        		showImgDialog(index){
        			this.galleryData = []
          			 let list = ['companyCertificationUrl', 'customerInvoiceInfoUrl', 'businessLicenceUrl', 'entrustedCertificateUrl']
                    list.forEach((item) => {
                         if( this.formData[item]){
                              this.galleryData.push({
                                    title:item,
                                    src:Utils.getFullURL(this.formData[item])
                              })
                         }
                    })
                    this.$refs['gallery'].setActiveItem(index)
          			this.galleryVisible = true
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
            	},
            	iniData(id){
            		   axios({
                            method: Service.RECEIVABLE.methods.salesInvoiceGet,
                            service: this.service,
                            args: {salesInvoiceId:id}
                        }).then((res) => {
                                 if (res.data.status === 200) {
                                 	    let data = res.data.result
                                        this.formData = {
                                        	    origanizationName: data.origanizationName,
                                        	    bussinessTypeName: data.bussinessTypeName,
                                        	    serviceTypeName: data.serviceTypeName,
                                        	    customerTypeName: data.customerTypeName,
                                        	    customerId: data.customerId,
                                        	    customerName: data.customerName,
                                        	    isGoldenTax: data.isGoldenTax,
                                        	    invoiceNumber: data.invoiceNumber,
                                        	    isK3Cloud: data.isK3Cloud,
                                        	    k3VoucherNo: data.k3VoucherNo,
                                        	    isRedFlush: data.isRedFlush,
                                        	    oldInvoiceCode: data.oldInvoiceCode,
                                        	    invoiceCode:data.invoiceCode,
                                        	    invoiceType: Number(data.invoiceType),
                                        	    taxPayerType: Number(data.taxPayerType),
                                        	    invoiceTitle: data.invoiceTitle,
                                        	    registrationNumber: data.registrationNumber,
                                        	    bankAddress: data.bankAddress,
                                        	    bankAccount: data.bankAccount,
                                        	    registeredAddress: data.registeredAddress,
                                        	    registeredPhone: data.registeredPhone,
                                        	    companyCertificationUrl: data.companyCertificationUrl,
                                        	    customerInvoiceInfoUrl: data.customerInvoiceInfoUrl,
                                        	    businessLicenceUrl: data.businessLicenceUrl,
                                        	    entrustedCertificateUrl: data.entrustedCertificateUrl,
                                        	    townIdArr: [],
                                        	    townId: data.townId,
                                        	    postAddress: data.postAddress,
                                        	    contactPerson: data.contactPerson,
                                        	    contactPhone: data.contactPhone,
                                        	    beforeTaxAmount: data.beforeTaxAmount,
                                        	    afterTaxAcmount: data.afterTaxAcmount,
                                        	    taxAmount: data.taxAmount,
                                        	    unpaidAmount: data.unpaidAmount,
                                        	    createUserName: data.createUserName,
                                        	    createTime: data.createTime,
                                        	    amounttingTime: data.amounttingTime,
                                        	    updateUserName: data.updateUserName,
                                                updateTime: data.updateTime
                                        }
                                       this.detailListData = data.salesInvoiceItemVos
                                 }else{
                              		this.$message({
                                			type: 'error',
                                			message: res.data.message
                   					 });
                                 }
                            }
                        )
            	}
              }
      }
</script>
<style>
 .invoiceSales .el-tab-pane .t8t-table-container .table-container .el-table{
    margin: 0 50px;
    width: 50%;
 }
  .invoiceSales_item_division .el-form-item__content{
    	width: 280px !important;
    }
    .invoiceSales_item_division .el-form-item__content .el-cascader{
		width: 280px ;
    }
    .invoiceSales .el-tab-pane .el-form--inline .el-form-item__content{
             width: 200px;
             text-align: left;
    }
   .invoiceSales .el-tab-pane  .pagenav-container{
   			    margin: 0 50px;
    			width: 50%;
   }
    .invoiceSales .el-tab-pane .el-form--inline .el-form-item__content .el-select{
    	width: 200px;
    }
    .invoiceSales .el-tab-pane input{
    	text-align: center;
    }
    .invoiceSales-view .t8t-full-dialog .full-dialog-form-container{
    	margin-top:10px;
    }
    .invoiceSales-view .t8t-full-dialog .el-row{
    	line-height: 32px;
    	margin-top:10px;
    }
    .invoiceSales-view .t8t-full-dialog .el-row .el-col{
    	text-align: right;
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
    .t8t-full-dialog .toolbar-container .toolbar-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog .toolbar-container .toolbar-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .t8t-full-dialog .invoiceSales .el-form{
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
    }
    .t8t-full-dialog .form-item-container{
        width: 25%;
    }
    .t8t-full-dialog .full-dialog-form-container{
        margin-bottom: 10px;
        min-height: 170px;
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
    .t8t-full-dialog .invoiceSales .el-tab-pane{
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        overflow: auto;
       align-content: flex-start;
    }
    /* 顶部tab */
    .t8t-full-dialog .full-dialog-form-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .t8t-full-dialog .full-dialog-form-container .el-tabs__header {
        border-top: 0;
        border-bottom: 0;
    }
    .el-row {
        padding-left: 20px;
        width:100%;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .el-col .grid-content .el-button{
        margin-left: 10px;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .el-tabs__active-bar{
        height:1px;
    }
</style>
