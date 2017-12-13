<template>
    <div>

        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <div class="form-area">

            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="流程名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="标识键" prop="symbol">
                    <el-input v-model="ruleForm.symbol"></el-input>
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
                <el-button type="primary" @click="backToPreUrl()">确定</el-button>
                <!--<el-button type="primary" @click="createProcOk">确定</el-button>-->
                <!--<el-button @click="backToPreUrl()">返回</el-button>-->
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
                createFailure: true,
                dialogVisible: false,
                dialogMessage: '',
                breadcrumbData: [
                    {title: '系统管理'},
                    {title: '流程管理后台'},
                    {title: '流程管理'},
                    {title: '新建流程'}
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
                        { min: 1, max: 20, message: '流程名20字以内!', trigger: 'blur' }
                    ],
                    symbol: [
                        { required: true, message: '请输入标识键!', trigger: 'blur' }
                    ],
                    code: [
                        { required: false, message: '请输入流程编码!', trigger: 'blur' },
                        { len: 4, message: '请输入4位字符!', trigger: 'blur' }
                    ],
                    region: [
                        { required: true, message: '请选择流程所属分类!', trigger: 'change', type: 'array' },
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
        },
        methods: {
            createProcOk(){
                this.dialogVisible = false;
                this.$refs['ruleForm'].resetFields();
            },
            backToPreUrl(){
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
                        this.ruleForm.region = [16];
                    })
            },
            getCategoriesId(){
                /* 查询分类ID */
                let parent = this.options;
                let region = this.ruleForm.region;
                let tempNode = option;
                let level = 0;
                let name;
                region.forEach(function (name, i) {
                    parent.forEach(function (node) {
                        //
                    })
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
                        procName: this.ruleForm.name,
                        identifyKey: this.ruleForm.symbol,
                        procCode: this.ruleForm.code,
                        categoryId: this.currentClassifiedId,
                        description: this.ruleForm.desc,
                        createUser: Cookie.get('t8t-tc-uid')
                    }
                };
                workflow.createProcess(args)
                    .then((res) => {
                        let data = res.data;
                        if(data){
                            if (data.result == 1 && data.status == 200){
                                this.dialogMessage = "新建流程成功！";
                                this.createFailure = false;
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
        name: 'init-workflow'
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
