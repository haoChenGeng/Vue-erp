<template>
    <div>

        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <div class="form-area">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="版本名称" prop="">
                    <el-input
                        :value="procName"
                        :disabled="true">
                    </el-input>
                </el-form-item>
                <el-form-item label="标识键" prop="symbol">
                    <el-input v-model="ruleForm.symbol" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="流程图" prop="code">
                    <div class="list-container">
                        <el-upload
                            v-model="ruleForm.filePath"
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
                <el-form-item label="说明" prop="desc">
                    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item>
                <el-form-item class="submit-area">
                    <el-button type="primary" @click="submitForm('ruleForm')" :disabled="submitButton">提交</el-button>
                    <el-button type="primary" @click="backToPreUrl()">返回</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-dialog title="用户提示" v-model="dialogVisible" size="tiny">
            <span>{{dialogMessage}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="backToPreUrl()">确认</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import workflow from 'src/services/procenter/workflow'
    import Utils from 'src/utils/Utils'

    export default {
        data() {
            return {
                submitButton: true,
                uploadingButton: false,
                dialogVisible: false,
                dialogMessage: '',
                procName: '',
                modelId: '',
                download: '',
                fileName:'',
                breadcrumbData: [
                    {title: '系统管理'},
                    {title: '流程管理后台'},
                    {title: '流程管理'},
                    {title: '版本管理'},
                    {title: '新建'}
                ],
                params: {
                    bucket: 'scm',
                    module: 'workflow/designer'
                },
                uploadURL: Utils.getUploadURL(),
                ruleForm: {
                    symbol: '',
                    filePath: '',
                    desc: ''
                },
                rules: {
                    symbol: [
                        { required: true, message: '请输入版本唯一标识键!', trigger: 'blur' }
                    ],
                    filePath: [
                        { required: true, message: '请上传版本文件!', trigger: 'change' },
                        { min: 1, message: '上传无路径返回!', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请对本版本修改作必要说明!', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            backToPreUrl(){
                this.dialogVisible = false;
                this.$router.go(-1)
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
                if(response.status == 200) {
                    let result = response.result;
                    this.ruleForm.filePath = result.filePath;
                } else {
                    this.ruleForm.filePath = '';
                }
            },
            handleRemove(){
                this.ruleForm.filePath = '';
            },
            submitForm(formName) {
                let checkOk = false;
                this.$refs[formName].validate((valid) => {
                    checkOk = valid
                });
                if(!checkOk){
                    this.$message("无文件名或文件名正在上传！");
                    return false;
                }
                if(!this.formData.filePath){
                    return false
                }
                let args = {
                    req: {
                        modelId: this.modelId,
                        status: 0,
                        bpmUrl: this.ruleForm.filePath,
                        description: this.ruleForm.desc,
                        fileName:this.fileName
                    }
                };
                workflow.createProcBpmInfo(args)
                    .then((res)=>{
                        let data = res.data;
                        if(data){
                            let result = data.result == 1 && data.status == 200;
                            if (result){
                                this.dialogMessage = "新建版本成功！";
                                this.dialogVisible = true;
                            } else {
                                let message = data.message;
                                this.$message(message);
                            }
                        } else {
                            this.$message("服务请求失败！");
                        }
                    });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            handleChange(value) {
                console.log(value);
            }
        },
        created(){
            let query = this.$route.query;
            if ('modelId' in query){
                this.modelId = query.modelId;
            }
            if ('procName' in query){
                this.procName = query.procName;
            }
            if ('key' in query){
                this.ruleForm.symbol = query.key;
            }
        },
        computed: {
            classification: function () {
                return ruleForm.desc
            }
        },
        components: {},
        name: 'create-bpm'
    }
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
