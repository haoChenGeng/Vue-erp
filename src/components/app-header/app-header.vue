<template>
    <div class="app-header">
        <div class="erp-header-left">
            <a href="javascript: void 0;" class="erp-logo">
                <img src="./img/logo.png">
            </a>
        </div>
        <div class="erp-header-right">
            <el-dropdown>
                <div class="erp-header-user-info">
                    <!--<img src="./img/icon1.png" height="200" width="200" class="erp-header-avatar">-->
                    <span class="erp-header-user-name">{{username}} ( {{comname}} )</span>
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu slot="dropdown" class="app-header-dropdown">
                    <!--<el-dropdown-item @click.native="navToProfile" class="img-container">
                        <img src="./img/icon1.png" width="13" class="img">
                        <span>个人信息</span>
                    </el-dropdown-item>-->
                    <el-dropdown-item @click.native="dialogVisible = true" class="img-container">
                        <img src="./img/icon2.png" width="13" class="img">
                        <span>修改密码</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="onLogout" class="img-container border-top">
                        <img src="./img/icon3.png" width="13" class="img">
                        <span>退出</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <!-- 修改密码弹出层 -->
        <el-dialog title="修改密码" v-model="dialogVisible" @close="closeDialog('formRef')" class="password-container">
            <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
                <el-form-item label="旧密码" prop="password">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password1">
                    <el-input type="password" v-model="form.password1"></el-input>
                </el-form-item>
                <el-form-item label="重复新密码" prop="password2">
                    <el-input type="password" v-model="form.password2"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('formRef')">确定</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    import md5 from 'md5'
    import Utils from 'src/utils/Utils.js'

    export default {

        name: 'app-header',

        data() {

            let username = Cookie.get('t8t-tc-username')
            let comname = Cookie.get('t8t-tc-comname')

            var checkPass2 = (rule, value, callback) => {
                if (value !== this.form.password1) {
                    callback(new Error('两次输入密码不一致'))
                }
                callback()
            }
            return {
                username: username,
                comname:comname,
                dialogVisible: false,
                form: {
                    password: '',
                    password1: '',
                    password2: ''
                },
                rules: {
                    password: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'},
                        {min: 6, message: '密码必须在6位以上', trigger: 'blur'}
                    ],
                    password1: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, message: '密码必须在6位以上', trigger: 'blur'}
                    ],
                    password2: [
                        {required: true, message: '请再次输入新密码', trigger: 'blur'},
                        {min: 6, message: '密码必须在6位以上', trigger: 'blur'},
                        {validator: checkPass2, trigger: 'blur'}
                    ]
                },
                tabs: []
            }
        },

        methods: {
            navToProfile() {
                window.location.href = 'http://erp.to8to.com/index.php/index/profile'
            },
            // 提交表单
            submitForm(formName) {
                this.$refs[formName].validate((isValid) => {
                    if (!isValid) return false
                    var args = {
                        id: Cookie.get('t8t-tc-uid'),
                        old: md5(this.form.password),
                        new: md5(this.form.password2)
                    }
                    api.account.changePassword(args)
                        .then((res) => {
                            if (res.data.status === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '修改密码成功'
                                })
                            } else {
                                // 修改密码失败
                                this.$message({
                                    type: 'error',
                                    message: res.data.message
                                })

                            }
                        })
                    this.dialogVisible = false
                })
            },
            closeDialog(formName) {
                // 关闭弹窗清空表单
                this.$refs[formName].resetFields()
            },
            onLogout(){
                Cookie.remove('t8t-tc-ticket')
                Cookie.remove('t8t-tc-uid')
                Cookie.remove('t8t-tc-username')
                Cookie.remove('t8t-tc-comname')
                Utils.redirectLoginPage()
            }
        }
    }

</script>

<style lang="css" scoped>
    .app-header {
        background: #1e3046;
        display: flex;
        justify-content: space-between;
    }

    .erp-header-left {
        width: 100px;
    }

    .erp-header-right {
        margin-right: 20px;
    }

    .erp-logo {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
    }

    .erp-header-user-info {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        cursor: pointer;
        color: #fff;
    }

    .erp-header-user-name {
        margin: 0 10px;
        color: #bcc8d6;
    }

    .erp-header-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }

    .erp-header-icon {
        width: 20px;
        margin-right: 5px;
    }

    .app-header .el-icon-caret-bottom {
        color: #9ea8b4;
        font-size: 12px;
        margin-top: 6px;
        transform: scale(0.8);
    }

    .app-header .erp-header-user-name {
        font-size: 14px;
    }

    .app-header-dropdown .img-container {
        display: flex;
        align-items: center;
    }

    .app-header-dropdown .img {
        display: inline-block;
        margin-right: 10px;
    }

    .app-header-dropdown .border-top {
        border-top: 1px solid #d1dbe5;
    }
</style>
<style>
    .app-header .el-input__inner {
        width: 250px;
    }

</style>
