<template>
    <div>
        <el-dialog title="查看流程" class="proc-seeProcess-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :model="formData" label-width="100px" :rules="rules" ref="formRef" :label-position="left" >
                <el-form-item  label="流程名称："  prop="name" >
                    <el-input placeholder="请输入流程名称" v-model="formData.name" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="标识键：" prop="symbol" >
                    <el-input placeholder="请输入标识键"   v-model="formData.symbol" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="流程编码：" prop="code" >
                    <el-input placeholder="请输入流程编码" v-model="formData.code" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="所属分类：" prop="region" >
                    <el-cascader
                        expand-trigger="hover"
                        :options="options"
                        :show-all-levels="false"
                        :change-on-select="true"
                        v-model="formData.region"
                        class="classified"
                        :disabled="true"
                        :props="cascaderProps"
                        :size="large"
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="说明：" prop="desc" >
                    <el-input type="textarea" placeholder="请输入流程说明" v-model="formData.desc" :disabled="true" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click=" backToPreUrl()" type="primary" :loading="isLoading">返回</el-button>
                <!---     <el-button @click="btnCancleClick()" >返回</el-button> -->
            </div>

           </el-dialog>
       </div>
   </template>

   <script>
       import workflow from 'src/services/procenter/workflow'
       import Cookie from 'js-cookie'
       import APICommon from 'src/services/procenter/proCenterApi.js'


       export default({
           name:"creteprocess-dialog",
           data(){
               return {
                   tenantIdEditable:true,
                   dialogVisible: true,
                   labelPosition: 'right',
                   formLabelWidth: '120px',
                   userId: Cookie.get('t8t-tc-uid'),
                   formData: {
                       name: '',
                       symbol: '',
                       code: '',
                       region: [],
                       desc: ''
                   },
                   //typeList:config.commonData.type,
                   isLoading: false,

                   //表单验证
                   rules: {
                       name: [
                           { required: true, message: '请输入流程名称!', trigger: 'blur' },
                           { min: 1, max: 20, message: '流程名20字以内!', trigger: 'blur' }
                       ],
                       region: [
                           { required: true, message: '请选择流程所属分类!', trigger: 'change', type: 'array' },
                       ],
                       desc: [
                           { required: false, message: '请对本流程进行必要说明!', trigger: 'blur' }
                       ]
                   },
                   varCheck:false,
                   options: [],
                   cascaderProps:{
                       label: 'label',
                       value: 'id',
                       children: 'subclass',
                       disabled: 'isDel',
                       symbol: 'label'
                   },
                   currentClassifiedId: ''
               };
           },
           computed: {
               dialogVisible() {
                   return true
               },
               classification: function () {
                   return formData.desc
               }
          },
           props:['id','identifyKey'],
           created(){
               this.getCategories();
               this.queryWorkflow(this.id);
               this.formData.symbol=this.identifyKey;
           },
           methods:{
               backToPreUrl(){
                   this.dialogVisible = false;
               },
               queryWorkflow(id){
                   let args = {
                       id: id
                   };
                   workflow.findProcess(args)
                       .then((res) => {
                           let data = res.data.result;
                           this.formData.name = data.procName;
                           this.formData.symbol = data.identifyKey;
                           this.formData.code = data.procCode;
                           this.formData.region = data.pids;
                           this.currentClassifiedId = data.pids[data.pids.length - 1]
                           this.formData.desc = data.description;
                       })
               },
               getCategories(){
                   let args = {
                       flag: false
                   };
                   workflow.obtainCategory(args)
                       .then((res) => {
                           this.options = res.data.result;
                           this.formData.region = [16];
                       })
               },

               getCategoriesId(){
                   /* 查询分类ID */
                   let parent = this.options;
                   let region = this.formData.region;
                   let tempNode = option;
                   let level = 0;
                   let name;
                   region.forEach(function (name, i) {
                       parent.forEach(function (node) {
                           //
                       })
                   })
               },
               btnCancleClick()
               {
                   this.$emit('close')
               },

               handleChange(value) {
                   this.currentClassifiedId = value[value.length - 1];
               },
               submitForm(formName) {
                   /* 查询分类ID */
                   let args = {
                       req: {
                           id: this.id,
                           procName: this.formData.name,
                           identifyKey: this.formData.symbol,
                           procCode: this.formData.code,
                           categoryId: this.currentClassifiedId,
                           description: this.formData.desc,
                           createUser: Cookie.get('t8t-tc-uid')
                       }
                   };
                   workflow.editProcess(args)
                       .then((res) => {
                           let data = res.data;
                           if(data){
                               if (data.result == 1 && data.status == 200){
                                   this.isLoading = false
                                   this.$emit('close')
                                   this.$msgbox({
                                       title: '消息',
                                       type: 'success',
                                       message: '流程新建成功',
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
    .classified{
        position: relative;
        font-size: 12px;
        display: inline-block;
        width: 100%;
    }
    .workflow-create{
        text-align: center;
    }
</style>
