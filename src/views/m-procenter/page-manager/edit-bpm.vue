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

                <div class="download-section">
                    <label class="download-tag">
                        流程图
                    </label>
                    <div class="download-link">
                        <a :href="downloadLink">
                            版本下载
                            <svg class="icon" style="width: 12px; height: 12px; vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M891.008 360.064c-3.232-128.704-108.448-232.064-237.856-232.064-75.808 0-143.264 35.488-186.848 90.72-24.448-31.584-62.688-51.968-105.696-51.968-73.824 0-133.632 59.872-133.632 133.728 0 6.432 0.48 12.768 1.376 18.944-11.232-2.016-22.752-3.136-34.56-3.136-107.008 0-193.728 86.784-193.728 193.856s86.72 193.856 193.728 193.856l91.776 0 226.496 234.496 226.496-234.496 111.488 0c96.128-0.192 174.016-78.208 174.016-174.432 0-82.08-56.672-150.912-132.992-169.472zM512 832l-192-192 128 0 0-192 128 0 0 192 128 0-192 192z">
                                </path>
                            </svg>
                        </a>
                    </div>
                </div>

                <el-form-item label="说明" prop="desc">
                    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item>
                <el-form-item class="submit-area">
                    <el-button type="primary" class="submitButton" @click="submitForm('ruleForm')">更新</el-button>
                    <el-button type="primary" class="submitButton" @click="backToPreUrl()">返回</el-button>
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
                downloadLink: 'javascript:;',
                baseUrl: 'https://scmgw.to8to.com/?action=file&path=',
                resourceId: '',
                dialogVisible: false,
                dialogMessage: '',
                procName: '',
                id: '',
                userId: Cookie.get('t8t-tc-uid'),
                ticket: Cookie.get('t8t-tc-ticket'),
                breadcrumbData: [
                    {title: '系统管理'},
                    {title: '流程管理后台'},
                    {title: '流程管理'},
                    {title: '版本管理'},
                    {title: '编辑'}
                ],
                params: {
                    bucket: 'scm',
                    module: 'workflow'
                },
                uploadURL: Utils.getUploadURL(),
                ruleForm: {
                    symbol: '',
                    desc: ''
                },
                rules: {
                    symbol: [
                        { required: true, message: '请输入版本唯一标识键', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请对本版本修改作必要说明', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            backToPreUrl(){
                this.dialogVisible = false;
                this.$router.go(-1)
            },
            submitForm(formName) {
                let checkOk = false;
                this.$refs[formName].validate((valid) => {
                    checkOk = valid
                });
                if(!checkOk){
                    return false;
                }
                let args = {
                    req: {
                        id: this.id,
                        description: this.ruleForm.desc
                    }
                };
                workflow.updateProcBpmInfo(args)
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
            getCurrentVersionInfo(){
                /* 同步版本信息文件 */
                let that = this;
                let search = {
                    id: this.id,
                };
                let args = {
                    search: search,
                    page: 1,
                    size: 1
                };
                workflow.getProcBpmInfos(args)
                    .then((res) =>{
                        let data = res.data;
                        if(data.status == 200){
                            let row =  data.result.rows[0];
                            that.resourceId = row.bpmUrl;
                            that.downloadLink = that.baseUrl + that.resourceId
                            that.ruleForm.desc = row.description;
                        } else {
                            that.$message('版本信息获取失败!');
                        }
                    })
            }
        },
        created(){
            let query = this.$route.query;
            if ('id' in query){
                this.id = query.id;
            }
            if ('procName' in query){
                this.procName = query.procName;
            }
            if ('key' in query){
                this.ruleForm.symbol = query.key;
            }

            this.getCurrentVersionInfo();
        },
        computed: {
            classification: function () {
                return ruleForm.desc
            }
        },
        components: {},
        name: 'edit-bpm'
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
    .submitButton{
        width: 100px;
    }
    .el-form-item .el-form-item__content .el-textarea textarea{
        max-height: 100px;
    }

    .download-section{
        width: 100%;
        position: relative;
        height: 33.8px;
        margin-bottom: 18px;
    }
    .download-section .download-tag{
        width: 100px;
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 12px;
        color: #48576a;
        line-height: 1;
        padding: 11px 12px 11px 0;
        box-sizing: border-box;
    }
    .download-section .download-link{
        margin-left: 100px;
        line-height: 32px;
        position: relative;
        color: #48556a;
        font-family: "Helvetica Neue", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
        font-size: 12px;
    }
    .download-section .download-link a{
        text-decoration: none;
        color: white;
        padding: 7px 9px;
        border: 1px solid #20a0ff;
        border-radius: 4px;
        background-color: #20a0ff;
        opacity: 0.8;
    }

    .download-section{
        width: 100%;
        position: relative;
        height: 33.8px;
        margin-bottom: 18px;
    }
    .download-section .download-tag{
        width: 100px;
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 12px;
        color: #48576a;
        line-height: 1;
        padding: 11px 12px 11px 0;
        box-sizing: border-box;
    }
    .download-section .download-link{
        margin-left: 100px;
        line-height: 32px;
        position: relative;
        color: #48556a;
        font-family: "Helvetica Neue", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
        font-size: 12px;
    }
    .download-section .download-link a{
        text-decoration: none;
        color: white;
        padding: 7px 9px;
        border: 1px solid #20a0ff;
        border-radius: 4px;
        background-color: #20a0ff;
        opacity: 0.8;
    }
    .download-section .download-link a:hover{
        opacity: 1;
    }
</style>
