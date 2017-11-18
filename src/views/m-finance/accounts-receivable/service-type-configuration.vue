<template>
 	<div class="service-type-configuration">
 		<t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
    	 <t8t-toolbar
    	            @ADD="on_add"
                    @EDIT="on_edit"
                    @DISABLE="on_disable"
                    @ANTI-DISABLE="on_anti_disable"
                    ref="toolbar"
                >
        </t8t-toolbar>
       <t8t-table
            ref="listTable"
            :columns="columns"
            :service="service"
            :method="method"
            :args="args"
            :selectCol="true"
            :commonData="commonOptionsConfig"
        >
            <template slot="taxRate" scope="scope" >
                <span>{{scope.row['taxRate']}}%</span>
            </template>
        </t8t-table>
        <!-- 新增、编辑弹窗 -->
        <el-dialog title="服务类型配置" class="pay-dialog" v-model="editDialogVisible" @close="closeEditDialog">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="编码：" prop="serviceTypeCode">
                    <el-input v-model="formData.serviceTypeCode"  :disabled="true" size="small"></el-input>
                </el-form-item>
                <el-form-item label="服务类型：" prop="serviceTypeId">
                     <el-select
                        v-model="formData.serviceTypeId"
                        filterable
                        :allow-create="false"
                        :disabled="serviceTypeEditDisable"
                        placeholder="请选择服务类型">
                        <el-option
                            v-for="item in commonOptionsConfig.serviceTypeList"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务类型：" prop="bussinessTypeId">
                    <el-select
                        v-model="formData.bussinessTypeId"
                        filterable
                        :allow-create="false"
                        placeholder="请选择业务类型">
                        <el-option
                            v-for="item in commonOptionsConfig.bussinessTypeList"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户：" prop="customerTypeId">
                    <el-select
                        v-model="formData.customerTypeId"
                        filterable
                        :allow-create="false"
                        placeholder="请选择客户类型">
                        <el-option
                            v-for="item in commonOptionsConfig.customerTypeList"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="税率：" prop="taxRate">
                    <el-input v-model="formData.taxRate" size="small">
                    <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                 <el-form-item label="是否可传K3：" prop="isK3Cloud">
                    <el-radio class="radio" v-model="formData.isK3Cloud" label="1">是</el-radio>
                    <el-radio class="radio" v-model="formData.isK3Cloud" label="0">否</el-radio>
                </el-form-item>
                 <el-form-item label="是否可传金税：" prop="isGoldenTax">
                    <el-radio class="radio" v-model="formData.isGoldenTax" label="1">是</el-radio>
                    <el-radio class="radio" v-model="formData.isGoldenTax" label="0">否</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="edit_isLoading">确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Service from 'src/services/finance/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    export default {
          name: 'service-type-configuration',
          data(){
                var checkTaxRate = (rule, value, callback) => {
                      if(!value){
                          return callback(new Error('税率不能为空'));
                      }
                      if(Number(value) > 100){
                          return callback(new Error('税率不能大于100'));
                      }
                      if(Number(value) < 1){
                          return callback(new Error('税率不能小于1'));
                      }
                      console.info(value)
                      if(!/^\d+$/.test(value)){
                          return callback(new Error('税率格式错误只能为整数'));
                      }
                      // if(! /^\d{1,2}(\.\d{1,2})?$/.test(value)){
                      //     return callback(new Error('税率只能精确到小数点后两位'));
                      // }
                      callback();
                };
              return {
                  breadcrumbData:[{ title: '财务' },{ title: '财务基础配置' },{ title: '服务类型配置' }],
                  rules: {
                    serviceTypeId: [
                        {type:'number', required: true , message: "请选择服务类型",trigger: 'change'},
                    ],
                    bussinessTypeId: [
                        {type:'number', required: true , message: "请选择业务类型",trigger: 'change'},
                    ],
                    customerTypeId: [
                        {type:'number', required: true , message: "请选择客户类型",trigger: 'change'},
                    ],
                    taxRate: [
                        {validator: checkTaxRate, type:'number', required: true, trigger: 'blur'},
                    ],
                    isK3Cloud: [
                        {required: true , message: "请选择是否可传K3",trigger: 'change'},
                    ],
                    isGoldenTax: [
                        {required: true , message: "请选择是否可传金税",trigger: 'change'},
                    ]
                    },
                  editDialogVisible:false,
                  serviceTypeEditDisable:false,
                  labelPosition: 'right',
                  formLabelWidth: '120px',
                  editType:'add',
                  edit_isLoading:false,
                  columns:[
                        { "prop": "serviceTypeCode", "label": "编码" },
                        { "prop": "serviceTypeName", "label": "服务类型"},
                        { "prop": "bussinessTypeName", "label": "业务类型" },
                        { "prop": "customerTypeName", "label": "客户" },
                        { "prop": "taxRate", "label": "税率" },
                        { "prop": "isK3Cloud", "label": "是否可传K3", "list":"K3Cloud"},
                        { "prop": "isGoldenTax", "label": "是否可传金税", "list":"GoldenTax" },
                        { "prop": "isForbidden", "label": "禁用状态", "list":"Forbidden" },
                        { "prop": "createUserName", "label": "创建人" },
                        { "prop": "createTime", "label": "创建时间", "formatter": "dateParser" },
                        { "prop": "updateUserName", "label": "修改人" },
                        { "prop": "updateTime", "label": "修改时间", "formatter": "dateParser" }
                  ],
                  method:Service.RECEIVABLE.methods.listServiceTypeConfig,
                  service:Service.RECEIVABLE.name,
                  args:{search:null, sort:['createTime_desc']},
                  commonOptionsConfig:{
                      serviceTypeList:[],
                      bussinessTypeList:[],
                      customerTypeList:[],
                      K3Cloud:[
                        {value: 0, text: '否'},
                        {value: 1, text: '是'}
                      ],
                      GoldenTax:[
                        {value: 0, text: '否'},
                        {value: 1, text: '是'}
                      ],
                      Forbidden:[
                        {value: 0, text: '否'},
                        {value: 1, text: '是'}
                      ]
                  },
                  formData:{
                        serviceTypeCode:'',
                        serviceTypeId:'',
                        bussinessTypeId:'',
                        customerTypeId:'',
                        taxRate:'',
                        isK3Cloud:'',
                        isGoldenTax:'',
                        isForbidden:0
                  }
              }

          },
          created (){
           this.getCommonOptions('61008', 'serviceTypeList')
           this.getCommonOptions('11008', 'bussinessTypeList')
           this.getCommonOptions('61004', 'customerTypeList')
          },
          watch:{
              "formData.serviceTypeId":function(value){
                  this.commonOptionsConfig.serviceTypeList.forEach((item) => {
                          if(item.value == value){
                                this.formData.serviceTypeCode = item.code
                          }
                  })
              }
          },
          methods:{
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                return commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName,
                                        code: item.propertyCode
                                    })
                                }
                            });
                            this.commonOptionsConfig[selectName] = list;
                        }
                    })
            },
             on_add(){
                this.formData = {
                        serviceTypeCode:'',
                        serviceTypeId:'',
                        bussinessTypeId:'',
                        customerTypeId:'',
                        taxRate:'',
                        isK3Cloud:'',
                        isGoldenTax:'',
                        isForbidden:0
                  };
                this.editDialogVisible = true
                if(this.$refs['form']) this.$refs['form'].resetFields()
                this.editType = 'add'
            },
            closeEditDialog(){
                this.serviceTypeEditDisable = false
            },
            on_edit(){
                let rows = this.$refs['listTable'].getSelectRows()
                if(rows.length < 1){
                     this.$message({
                                type: 'error',
                                message: '请勾选数据后再操作'
                    });
                     return
                }
                if(rows.length > 1){
                    this.$message({
                                type: 'error',
                                message: '请对单条数据进行操作'
                    });
                    return
                }
                if(this.$refs['form']) this.$refs['form'].resetFields()
                let data = rows[0]
                this.formData = {
                            id:data['id'],
                            serviceTypeCode:data['serviceTypeCode'],
                            serviceTypeId:data['serviceTypeId'],
                            bussinessTypeId:data['bussinessTypeId'],
                            customerTypeId:data['customerTypeId'],
                            taxRate:data['taxRate'],
                            isK3Cloud:`${data['isK3Cloud']}`,
                            isGoldenTax:`${data['isGoldenTax']}`,
                            isForbidden:data['isForbidden']
                    }
                this.editType = 'edit'
                this.serviceTypeEditDisable = true
                this.editDialogVisible = true
            },
            on_disable(){
                let rows = this.$refs['listTable'].getSelectRows()
                if(rows.length < 1){
                     this.$message({
                                type: 'error',
                                message: '请勾选数据后再操作'
                    });
                     return
                }
                let args = {updateUserId:Cookie.get('t8t-tc-uid'), forbidIds:[]}
                let flage = true
                let msg = ''
                rows.forEach((item) =>{
                      if(item.isForbidden != 1){
                            args.forbidIds.push(item.id)
                      }else{
                          msg = '请对禁用状态为否的数据进行操作'
                          flage = false
                          return false
                      }
                })
                if(!flage){
                      this.$message({
                                type: 'error',
                                message: msg
                    });
                    return
                }
                this.$confirm('确认对所选数据进行禁用处理？', '禁用确认', {
                                    confirmButtonText: '禁用',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                             }).then(() => {
                               this.$refs['toolbar'].disableBySymbol('DISABLE');
                               axios({
                                method: Service.RECEIVABLE.methods.serviceTypeConfigForbid,
                                service: this.service,
                                args: args
                             }).then((res) => {
                                     this.$refs['toolbar'].unDisableBySymbol('DISABLE');
                                     if(res.data.status === 200){
                                           this.$msgbox({
                                                title: '已禁用',
                                                type: 'success',
                                                message: '',
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            },function(){
                                            });
                                           this.$refs['listTable'].reloadTable()
                                     }else{
                                         this.$msgbox({
                                                title: '禁用失败',
                                                type: 'error',
                                                message: res.data.message,
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            },function(){

                                            });
                                     }
                             })
                        })
            },
            on_anti_disable(){
                    let rows = this.$refs['listTable'].getSelectRows()
                if(rows.length < 1){
                     this.$message({
                                type: 'error',
                                message: '请勾选数据后再操作'
                    });
                     return
                }
                let args = {updateUserId:Cookie.get('t8t-tc-uid'), antiForbidIds:[]}
                let flage = true
                let msg = ''
                rows.forEach((item) =>{
                      if(item.isForbidden != 0){
                            args.antiForbidIds.push(item.id)
                      }else{
                          msg = '请对禁用状态为是的数据进行操作'
                          flage = false
                          return false
                      }
                })
                if(!flage){
                      this.$message({
                                type: 'error',
                                message: msg
                    });
                    return
                }
                this.$confirm('确认对所选数据进行反禁用处理？', '反禁用确认', {
                                    confirmButtonText: '反禁用',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                             }).then(() => {
                               this.$refs['toolbar'].disableBySymbol('ANTI-DISABLE');
                               axios({
                                method: Service.RECEIVABLE.methods.serviceTypeConfigAntiForbid,
                                service: this.service,
                                args: args
                             }).then((res) => {
                                     this.$refs['toolbar'].unDisableBySymbol('ANTI-DISABLE');
                                     if(res.data.status === 200){
                                           this.$msgbox({
                                                title: '已反禁用',
                                                type: 'success',
                                                message: '',
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            },function(){
                                            });
                                           this.$refs['listTable'].reloadTable()
                                     }else{
                                         this.$msgbox({
                                                title: '反禁用失败',
                                                type: 'error',
                                                message: res.data.message,
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            },function(){

                                            });
                                     }
                             })
                        })
            },
            btnCancleClick(){
               this.editDialogVisible = false
            },
            btnOKClick(){
                 this.$refs['form'].validate(valid=>{
                      if (valid) {
                            var data = Object.assign({},this.formData)
                            var method = ''
                            var args = {}
                            if(this.editType == 'add'){
                                   method = Service.RECEIVABLE.methods.typeConfigCeate
                                   var args = {serviceTypeConfigCreateDto:data, createUserId:Cookie.get('t8t-tc-uid')}
                            }else{
                                    method = Service.RECEIVABLE.methods.typeConfigUpdate
                                   var args = {serviceTypeConfigUpdateDto:data, updateUserId:Cookie.get('t8t-tc-uid')}
                            }
                            this.edit_isLoading = true
                           axios({
                            method: method,
                            service: this.service,
                            args: args
                        }).then((res) => {
                                this.edit_isLoading = false
                                if (res.data.status === 200) {
                                       let info = ''
                                       if(this.editType == 'add'){
                                           info = '新增成功！'
                                       }else{
                                           info = '编辑成功！'
                                       }
                                       this.$msgbox({
                                                title: info,
                                                type: 'success',
                                                message: '',
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            },function(){
                                            });
                                            this.editDialogVisible = false
                                            this.$refs['listTable'].reloadTable()
                                }else{
                                    this.$msgbox({
                                                title: '新增失败',
                                                type: 'error',
                                                message: res.data.message,
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            },function(){

                                            });
                                }

                         })
                      }
                 })
            }
          }
    }
 </script>

 <style lang="css" >
.service-type-configuration .pay-dialog .el-dialog{
    width: 450px;
}
.service-type-configuration .el-select-dropdown__wrap {
    max-height: 185px !important;
}
.service-type-configuration .pay-dialog .el-form-item__content {
    width: 350px;
}
.service-type-configuration .pay-dialog .el-select {
    width: 60%;
}
.service-type-configuration .el-input--small{
    width: 60%;
}
.service-type-configuration .el-form-item__label{
    width: 30%;
    }
 </style>

