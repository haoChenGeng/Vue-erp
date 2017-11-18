<template>
    <el-form
        :model="ruleForm"
        :rules="rules"
        ref="t8tAudit"
        label-width="80px"
        class="t8t-audit-form">
        <el-form-item label="方案审核" prop="agree">
            <el-radio-group v-model="ruleForm.agree" :disabled="auditForm" @change="changeRadio">
                <el-radio label="1">同意</el-radio>
                <el-radio label="2">不同意</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见" prop="idea">
            <el-input type="textarea" v-model="ruleForm.idea" :rows="4" placeholder="请输入内容" :disabled="auditForm"></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
    import Cookie from 'js-cookie';
    export default {
        name: 't8t-audit',
        created(){

        },
        data() {
            return {
                radio:null,
                ruleForm:{
                    agree: null,
                    idea: null
                },
                rules:{
                    agree: [
                        {
                            required: true,
                            message: '请选择审核方案',
                            trigger: 'change'
                        }
                    ],
                    idea: [
                        {
                            required: true,
                            message: '请填写审批意见',
                            trigger: 'blur'
                        },
                        {
                            max: 200,
                            message: '审批意见最多200字',
                            trigger: 'blur'
                        }
                    ],
                }
            }
        },
        props: {
            auditForm:{
                type:Boolean,
                default:false
            },
        },
        methods:{
            //验证表格内嵌表单
            validate(callback) {
                this.$refs.t8tAudit.validate(callback)
            },
            changeRadio(value){
                let _this = this;
                if(value == 1) {
                    _this.$set(_this.rules,'idea',[
                        {
                            required: false,
                            message: '请填写审批意见',
                            trigger: 'blur'
                        },
                        {
                            max: 200,
                            message: '审批意见最多200字',
                            trigger: 'blur'
                        }
                    ])
                }else{
                    _this.$set(_this.rules,'idea',[
                        {
                            required: true,
                            message: '请填写审批意见',
                            trigger: 'blur'
                        },
                        {
                            max: 200,
                            message: '审批意见最多200字',
                            trigger: 'blur'
                        }
                    ])
                }
            }
        }
    }


</script>
<style>
    /*审核流头部样式*/
    .steps-review-bg-color-diy {
        background-color: #fffcf8;
    }
    .t8t-full-dialog2 .steps-top-review-confirm-dialog {
        background-color: #fffcf8;
        border-bottom: 1px solid #ffead1;
        min-height:150px;
    }
    .t8t-full-dialog2.isHide .steps-top-review-confirm-dialog .full-dialog-form {
        height: auto;
    }

    /*审批意见输入框大小*/
    .t8t-audit-form .el-textarea {
        width: 350px;
    }
</style>
