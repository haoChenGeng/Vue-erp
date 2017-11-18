<template>
    <div>
        <el-dialog title="发起流程" class="proc-startProcess-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :model="formData" label-width="100px" :rules="rules" ref="formRef" :label-position="left" >
                <el-form-item  label="流程key："  prop="idOrKey" >
                    <el-input placeholder="请输入名称" v-model="formData.idOrKey"  ></el-input>
                </el-form-item>
                <el-form-item label="发起方式：" prop="startById" >
                    <!--<el-input v-model="formData.isDel" ></el-input>-->
                    <el-select v-model="formData.startById" placeholder="--请选择--" @change="handleChange(value)">
                        <el-option v-for="item in typeList" :label="item.text" :value="item.value" >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="租赁Id：" prop="tenantId" >
                    <el-input placeholder="请输入租赁Id" v-model="formData.tenantId" :disabled="tenantIdEditable" ></el-input>
                </el-form-item>
                <el-form-item label="业务键：" prop="businessKey" >
                    <el-input placeholder="请输入业务键" v-model="formData.businessKey"  ></el-input>
                </el-form-item>
                <el-form-item label="流程数据：" prop="workflow" >
                <el-input placeholder="请输入流程数据" v-model="formData.workflow"  ></el-input>
               </el-form-item>
                <el-form-item label="业务数据：" prop="biz" >
                    <el-input placeholder="请输入业务数据" v-model="formData.biz"  ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">提交</el-button>
                <!---     <el-button @click="btnCancleClick()" >返回</el-button> -->
               </div>
           </el-dialog>
       </div>
   </template>

   <script>
       import APICommon from 'src/services/procenter/proCenterApi.js'
       import config from './config.json'

       export default({
           name:"proc-category-dialog",
           data(){
               return {
                   tenantIdEditable:true,
                   dialogVisible: true,
                   labelPosition: 'right',
                   formLabelWidth: '120px',
                   userId: Cookie.get('t8t-tc-uid'),
                   formData: {
                       idOrKey: '',
                       startById: '',
                       starter:'',
                       tenantId: '',
                       businessKey: '',
                       workflow: '',
                       biz:''
                   },
                   typeList:config.commonData.type,
                   isLoading: false,

                   //表单验证
                   rules: {
                       idOrKey: [
                           { required: true, message: '请输入流程key', trigger: 'blur' }
                       ],
                       startById: [
                           { required: true, message: '请输入发起方式', trigger: 'blur' },

                       ],
                   },
                   varCheck:false
               };
           },
           computed: {
               dialogVisible() {
                   return true
               }
          },

           created(){
               this.tenantIdEditable=true,
               this.formData={
                       startById:0,
                       starter:this.userId
               }
           },
           methods:{
               initformData()
               {
                   this.formData= {
                       idOrKey: '',
                       startById: '',
                       starter:this.userId,
                       tenantId: '',
                       businessKey: '',
                       workflow: '',
                       biz:'',
                   }
               },

               btnOKClick()
               {
                           this.check()
                           if(this.varCheck) {
                               this.startProcess();
                           }
                           else{
                               this.$msgbox({
                                   title: '消息',
                                   type: 'fail',
                                   message: '操作失败,缺少数据',
                                   showCancelButton: false,
                                   confirmButtonText: '知道了',
                               })
                           }


               },
               btnCancleClick()
               {
                   this.$emit('close')
               },

               check()
               {
                   if(this.formData.idOrKey ==='')
                   {
                       this.varCheck = false
                       return
                   }
                   if(this.formData. startById==='')
                   {
                       this.varCheck = false
                       return
                   }
                   this.varCheck = true

               },
               handleChange(value) {
                   console.log("---选择项发生改变---")
                   console.log(value)
                   // this.formData.startById= value[value.length-1]
                   if(this.formData.startById===1){
                      this.tenantIdEditable=false
                   }else{
                       this.tenantIdEditable=true
                   }
               },

               startProcess()
               {
                   var req = {
                           idOrKey: '',
                           startById: '',
                           starter:'',
                           tenantId: '',
                           businessKey: '',
                           workflow: '',
                           biz:''
                       }
                   req.idOrKey=this.formData.idOrKey;
                   req.startById=this.formData.startById;
                   req.starter=this.formData.starter;
                   req.tenantId=this.formData.tenantId;
                   req.businessKey=this.formData.businessKey;
                   if(this.formData.workflow!=null ){
                       console.log( "this.formData.workflow")
                       console.log( this.formData.workflow)
                       req.workflow=JSON.parse(this.formData.workflow);
                   }else{
                       req.workflow=null;
                   }
                   if(this.formData.biz !=null ){
                       console.log( "this.formData.biz")
                       console.log( this.formData.biz)
                       req.biz=JSON.parse(this.formData.biz);
                   }else{
                       req.biz=null;
                   }
                   console.log( req.biz)
                   APICommon.startProcess({req}).then((res) =>{
                       if(res.data.status===200)
                       {
                           //隐藏正在加载
                           this.isLoading = false
                           this.$emit('close')
                           this.$msgbox({
                               title: '消息',
                               type: 'success',
                               message: '发起成功',
                               showCancelButton: false,
                               confirmButtonText: '知道了',
                               confirmButtonClass: 'is-plain'
                           })
                       }
                       else {
                           this.isLoading = false;
                           this.$message.error(res.data.message)
                           console.log( res.data)
                       }
                   })
               }

           }
       })
   </script>
