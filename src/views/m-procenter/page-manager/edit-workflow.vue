<template>
    <div>

        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <div class="form-area">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="流程名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="标识键" prop="symbol">
                    <el-input v-model="ruleForm.symbol" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="流程编码" prop="code">
                    <el-input v-model="ruleForm.code" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="所属分类" prop="region">
                    <el-cascader
                        expand-trigger="hover"
                        :options="options"
                        :show-all-levels="false"
                        :change-on-select="true"
                        v-model="ruleForm.region"
                        class="classified"
                        :props="cascaderProps"
                        :size="large"
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="说明" prop="desc">
                    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item>
                <el-form-item class="workflow-create">
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="backToPreUrl()">返回</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-dialog title="用户提示" v-model="dialogVisible" size="tiny">
            <span>{{dialogMessage}}</span>
            <span slot="footer" class="dialog-footer">


                <el-button @click="backToPreUrl()">返回</el-button>

            </span>
        </el-dialog>

    </div>
</template>

<script>
    import workflow from 'src/services/procenter/workflow'
    import Cookie from 'js-cookie'

    export default {
        data() {
            return {
                id: 0,
                dialogVisible: false,
                dialogMessage: '',
                breadcrumbData: [
                    {title: '系统管理'},
                    {title: '流程管理后台'},
                    {title: '流程管理'},
                    {title: '编辑流程'}
                ],
                ruleForm: {
                    name: '',
                    symbol: '',
                    code: '',
                    region: [],
                    desc: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入流程名称!', trigger: 'blur' },
                        {max: 20, message: '字符数的字符个数不超过20!', trigger: 'blur' }
                    ],
                    symbol: [
                        { required: true, message: '请输入标识键!', trigger: 'blur' }
                    ],
                    region: [
                        { required: true, message: '请选择所属分类!', trigger: 'change', type: 'array' },
                    ],
                    desc: [
                        { required: false, message: '请对本流程进行必要说明!', trigger: 'blur' }
                    ]
                },
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
        created(){
            this.getCategories();

            let query = this.$route.query;
            if ('id' in query){
                this.id = query.id;
                this.queryWorkflow(this.id);
            }

            if ('identifyKey' in query){
                this.identifyKey = query.identifyKey;
            }
        },
        methods: {
            backToPreUrl(){
                this.dialogVisible = false;
                this.$router.go(-1)
            },
            queryWorkflow(id){
                let args = {
                    id: id
                };
                workflow.findProcess(args)
                    .then((res) => {
                        let data = res.data.result;
                        this.ruleForm.name = data.procName;
                        this.ruleForm.symbol = data.identifyKey;
                        this.ruleForm.code = data.procCode;
                        this.ruleForm.region = data.pids;
                        this.currentClassifiedId = data.pids[data.pids.length - 1]
                        this.ruleForm.desc = data.description;
                    })
            },
            createProcOk(){
                /* 新建流程成功 */
                this.dialogVisible = false;
                /* 重置 */
                this.ruleForm.resetFields();
            },
            backToPreUrl(){
                /* 返回上一个URL */
                this.dialogVisible = false;
                this.$router.go(-1)
            },
            getCategories(){
                let args = {
                    flag: false
                };
                workflow.obtainCategory(args)
                    .then((res) => {
                        this.options = res.data.result;
                    })
            },
            submitForm(formName) {
                let checkOk = false;
                this.$refs[formName].validate((valid) => {
                    checkOk = valid
                });
                if(!checkOk){
                    return false;
                }
                /* 查询分类ID */
                let args = {
                    req: {
                        id: this.id,
                        procName: this.ruleForm.name,
                        identifyKey: this.ruleForm.symbol,
                        procCode: this.ruleForm.code,
                        categoryId: this.currentClassifiedId,
                        description: this.ruleForm.desc,
                        createUser: Cookie.get('t8t-tc-uid')
                    }
                };
                workflow.editProcess(args)
                    .then((res) => {
                        let data = res.data;
                        if(data){
                            if (data.result == 1 && data.status == 200){
                                this.dialogMessage = "流程信息更新成功！";
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
                this.currentClassifiedId = value[value.length - 1];
            }
        },
        computed: {
            classification: function () {
                return ruleForm.desc
            }
        },
        components: {},
        name: 'eidt-workflow'
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
