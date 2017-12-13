<template>
    <div>
        <el-dialog title="处理流程" class="proc-startProcess-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :model="formData" label-width="100px" :rules="rules" ref="formRef" :label-position="left" >
                <el-form-item  label="实例Id："  prop="procInsId" >
                    <el-input placeholder="请输入名称" v-model="formData.procInsId"  ></el-input>
                </el-form-item>

                <el-form-item label="任务Id：" prop="taskId" >
                    <el-input placeholder="请输入任务Id" v-model="formData.taskId"  ></el-input>
                </el-form-item>

                <el-form-item label="是否通过：" prop="isPass" >
                    <!--<el-input v-model="formData.isDel" ></el-input>-->
                    <el-select v-model="formData.isPass" placeholder="--请选择--" @change="handleChange(value)">
                       <el-option v-for="item in passList" :label="item.text" :value="item.value"   >
                       </el-option>
                    </el-select>
                    </el-form-item>
                <el-form-item label="流程数据：" prop="workflow" >
                    <el-input placeholder="请输入流程数据" v-model="formData.workflow"  ></el-input>
                </el-form-item>
                <el-form-item label="业务数据：" prop="biz" >
                    <el-input placeholder="请输入业务数据" v-model="formData.biz"  ></el-input>
                </el-form-item>
                    <el-form-item label="审批评论：" prop="comment" >
                        <el-input placeholder="审批评论" v-model="formData.comment"  ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="btnOKClick()" type="primary" :loading="isLoading" >提交</el-button>
                 <!---   <el-button @click="btnCancleClick()" v-show="editType=='see'">返回</el-button> --->
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
                    tenantIdEditable:false,
                    dialogVisible: true,
                    labelPosition: 'right',
                    formLabelWidth: '120px',
                    formData: {
                        procInsId: '',
                        taskId: '',
                        workflow:'{"isPass":true}',
                        biz:'',
                        executor:'',
                        isPass:'',
                        comment:''
                    },
                    workflow:{},
                    passList:config.commonData.pass,

                    isLoading: false,

                    //表单验证
                    rules: {
                        procInsId: [
                            { required: true, message: '请输入流程实例Id', trigger: 'blur' }
                        ],
                        taskId: [
                            { required: true, message: '请输入流程任务Id', trigger: 'blur' },
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
            props:['procInsId','taskId','executor'],

            created(){
                console.log(this.procInsId)
                console.log(this.taskId)
                console.log("123")
                console.log(this.executor)
                console.log("123")
                this.formData= {
                    procInsId: this.procInsId,
                    taskId:this.taskId,
                    workflow:'{"isPass":true}',
                    isPass:true,
                    executor:this.executor
                }
            },
            methods:{
                initformData()
                {
                    this.formData= {
                        procInsId: '',
                        taskId: '',
                        workflow: '',
                        executor:'',
                        biz:'',
                        isPass:'',
                        comment:''
                    }
                },
                btnOKClick()
                {
                            this.check()
                            if(this.varCheck) {
                                this.completeTask();
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
                    if(this.formData. procInsId ==='')
                    {
                        this.varCheck = false
                        return
                    }
                    if(this.formData.taskId==='')
                    {
                        this.varCheck = false
                        return
                    }
                    this.varCheck = true

                },
                handleChange(value) {
                    console.log("change select")
                    console.log(value)

                    if(this.formData.isPass==1){
                       // this.formData.workflow="{"isPass":true}";
                        this.formData.workflow='{"isPass":true}';
                    }else{
                        this.formData.workflow='{"isPass":false}';
                    }
                },
                completeTask()
                {

                    var req = {
                        executor:'',
                        procInsId: '',
                        taskId: '',
                        workflow: '',
                        biz:'',
                        isPass:'',
                        comment:''
                    }
                    req.executor=this.executor;
                    req.procInsId=this.formData.procInsId;
                    req.taskId=this.formData.taskId;
                    let parms = this.formData.workflow
                    if(this.formData.workflow!=null){
                        parms = JSON.parse( this.formData.workflow)
                    }
                    req.workflow=parms;
                    let parms2 = this.formData.biz
                    if(this.formData.biz!=null){
                        parms2 = JSON.parse( this.formData.biz)
                    }
                    req.biz=parms2;
                    req.isPass=this.formData.isPass;
                    req.comment=this.formData.comment;
                    APICommon.completeTask({req}).then((res) =>{
                        if(res.data.status===200)
                        {
                            //隐藏正在加载
                            this.isLoading = false
                            this.$emit('close')
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '处理成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        }
                        else {
                            this.isLoading = false;
                            this.$message.error(res.data.message)
                        }
                    })
                }

            }
        })
    </script>
