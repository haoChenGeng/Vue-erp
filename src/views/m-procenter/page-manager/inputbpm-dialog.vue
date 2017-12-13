<template>
    <div>
        <el-dialog title="导入流程" class="proc-inpuBpm-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :model="formData" label-width="100px" :rules="rules" ref="formData" :label-position="left" >
                <el-form-item  label="版本名称："  prop="name" >
                    <el-input  v-model="formData.name"  :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="标识键：" prop="symbol" >
                    <el-input    v-model="formData.symbol"  :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="流程图" prop="code">
                    <div class="list-container">
                        <el-upload
                            v-model="formData.filePath"
                            :data="params"
                             class="upload-demo"
                            :action="uploadURL"
                            multiple="false"
                            :before-upload="beforeUpload"
                            accept=".bpmn"
                            :on-change="onChange"
                            :on-remove="handleRemove"
                            :on-success="onSuccess"
                            :on-progress="onProgress"
                        >
                            <el-button size="small" type="primary" :disabled="uploadingButton">
                                点击上传
                                <svg class="icon" style="width: 12px; height: 12px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M796.2 466.4c0-2.4 0.4-4.8 0.4-7.2 0-130-103.6-235.2-231.4-235.2-92.2 0-171.4 54.8-208.6 134-16.2-8.2-34.4-13-53.6-13-59 0-108.2 43.8-117.6 101C114.6 470.4 64 538.2 64 618c0 100.4 80.2 182 179 182H448v-160h-96.4l160.4-167.4 160.4 167.2H576v160h220.6c90.4 0 163.4-75 163.4-166.8 0-91.8-73.4-166.4-163.8-166.6z">
                                </path>
                            </svg>
                            </el-button>
                            <div slot="tip" class="el-upload__tip">只能上传*.bpmn文件，且不超过500kb</div>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="说明：" prop="desc" >
                    <el-input type="textarea" placeholder="请输入流程说明" v-model="formData.desc"  ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitForm('formData')" type="primary" :loading="isLoading" :disabled="submitButton">提交</el-button>
                <!---     <el-button @click="btnCancleClick()" >返回</el-button> -->
            </div>

           </el-dialog>
       </div>
   </template>

   <script>
       import workflow from 'src/services/procenter/workflow'
       import Cookie from 'js-cookie'
       import APICommon from 'src/services/procenter/proCenterApi.js'
       import Utils from 'src/utils/Utils'

       export default({
           name:"inputBpm-dialog",
           data(){
               return {
                   submitButton: true,
                   uploadingButton: false,
                   dialogVisible: true,
                   labelPosition: 'right',
                   formLabelWidth: '120px',
                   userId: Cookie.get('t8t-tc-uid'),
                   formData: {
                       name: '',
                       symbol: '',
                       filePath: '',
                       desc: ''
                   },
                   params: {
                       bucket: 'scm',
                       module: 'workflow/designer'
                   },
                   uploadURL: Utils.getUploadURL(),
                   //typeList:config.commonData.type,
                   isLoading: false,

                   //表单验证
                   rules: {
                       filePath: [
                           { required: true, message: '请上传版本文件!', trigger: 'change' },
                           { min: 1, message: '上传无路径返回!', trigger: 'change' }
                       ],
                       desc: [
                           { required: true, message: '请对本版本修改作必要说明!', trigger: 'blur' }
                       ]
                   },
                   varCheck:false
               };
           },
           computed: {
               classification: function () {
                   return formData.desc
               }
          },
           props:['modelId','procName','identityKey'],
           created(){
               this.formData.name = this.procName;
               this.formData.symbol = this.identityKey;
           },
           methods: {
               btnCancleClick()
               {
                   this.$emit('close')
               },
               beforeUpload(file){
                   this.fileName = file.name;
                   this.uploadingButton = true;
                   this.submitButton = true;
               },
               onChange(){
                   this.uploadingButton = false;
                   this.submitButton = false;
               },
               onSuccess(res, file, fileList){
                   let response = file.response;
                   if (response.status == 200) {
                       let result = response.result;
                       this.formData.filePath = result.filePath;
                   } else {
                       this.formData.filePath = '';
                   }
               },
               handleRemove(){
                   this.formData.filePath = '';
                   this.submitButton=true;
                   this.uploadingButton=false;
               },
               submitForm(formName) {
                   let checkOk = false;
                   this.$refs[formName].validate((valid) => {
                       checkOk = valid
                   });
                   if(!checkOk){
                       this.$message.error("请对本版本修改作必要说明!");
                       return false;
                   }
                   if (!this.formData.filePath) {
                       return false
                   }
                   let args = {
                       req: {
                           modelId: this.modelId,
                           status: 0,
                           bpmUrl: this.formData.filePath,
                           description: this.formData.desc,
                           fileName: this.fileName
                       }
                   };
                   workflow.createProcBpmInfo(args)
                       .then((res) => {
                           let data = res.data;
                           if (data) {
                               let result = data.result == 1 && data.status == 200;
                               if (result) {
                                   this.isLoading = false
                                   this.$emit('close')
                                   this.$msgbox({
                                       title: '消息',
                                       type: 'success',
                                       message: '流程导入成功',
                                       showCancelButton: false,
                                       confirmButtonText: '知道了',
                                       confirmButtonClass: 'is-plain'
                                   })
                                   this.$emit('getTableData')
                               } else {
                                   let message = data.message;
                                   this.isLoading = false;
                                   this.$message.error(message)
                               }
                           } else {
                               this.$message("服务请求失败！");
                           }
                       });

               },
               check()
               {
                   if(this.formData.desc ==='')
                   {
                       this.varCheck = false
                       return
                   }
                   this.varCheck = true

               },

           }
       })
   </script>

<style scoped>
    .el-select .el-input {
        width: 110px;
    }
    .form-area{
        width: 40%;
        margin: 20px;
        padding: 20px 10px;
        border: 1px solid #d6d6d6;
    }
    .submit-area{
        text-align: center;
    }
</style>

