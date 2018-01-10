<template>
    <div class="login">
        <div class="login-container">
            <div class="login-inner">
                <div class="logo-container">
                    <!--<img src="./img/logo-login.png" class="login-logo">-->
                </div>
                <div class="login-res-msg" v-if="resMsg">{{resMsg}}</div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" @keyup.enter.native="submitForm('ruleForm')">
                    <el-form-item prop="username">
                        <div class="login-input-group">
                            <el-input placeholder="输入用户名" @focus="loginFocus('isFocus1')" @blur="loginBlur('isFocus1')" autofocus v-model="ruleForm.username"></el-input>
                            <div class="input-icon">
                                <i class="icon icon-user" :class="{'active': isFocus1}"></i>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item prop="password">
                        <div class="login-input-group">
                            <el-input type="password" placeholder="输入密码" @focus="loginFocus('isFocus2')" @blur="loginBlur('isFocus2')" v-model="ruleForm.password"></el-input>
                            <div class="input-icon">
                                <i class="icon icon-password" :class="{'active': isFocus2}"></i>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item prop="captcha">
                        <div class="login-input-group login-code-container">
                            <el-input placeholder="输入验证码" @focus="loginFocus('isFocus3')" @blur="loginBlur('isFocus3')" class="login-code-input" v-model="ruleForm.captcha"></el-input>
                            <div class="input-icon">
                                <i class="icon icon-code" :class="{'active': isFocus3}"></i>
                            </div>
                            <div class="login-code-img">
                                <img id="captcha" :src="captchaUrl"
                                     @click="refreshCaptcha($event)" alt="换一张" title="换一张">
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="login-input-group">
                            <el-button type="primary" class="login-submit" @click="submitForm('ruleForm')">登录</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>
<script>
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    import md5 from 'md5'
    import axios from 'axios'
    import qs from 'qs'
    import Utils from 'src/utils/Utils.js'
    import Client from 'vue-gateway-sdk'
    import Captcha from 'vue-gateway-sdk/src/core/Captcha'
    var captcha = new Captcha()
    let debug = process.env.NODE_ENV !== 'production'
    export default {
        name: 'login',
        data() {
            return {
                captchaUrl: '',
                isFocus1: false,
                isFocus2: false,
                isFocus3: false,
                resMsg: '',
                ruleForm: {
                    username: '',
                    password: '',
                    captcha: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, message: '密码必须在6位以上', trigger: 'blur' }
                    ],
                    captcha: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]
                },
            }

        },
        created(){},
        methods: {
            // 刷新验证码
            refreshCaptcha(event) {
                captcha.refresh()
            },
            onLogin() {
                Utils.redirectIndex()
            },
            submitForm(formName) {
                var client = new Client()
                let that = this
                let domain = debug ? 'localhost' : '.to8to.com'
                this.$refs[formName].validate((isValid) => {
                    if (!isValid) return false
                    var args = {
                        loginField: this.ruleForm.username,
                        password: md5(this.ruleForm.password),
                        appName:'tuchat-pc'
                    }
                    //client.login() TODO 接入新的登录SDK，其中字段名要改造
                    api.account.login(args)
                        .then((res) => {
                           if (res.data.status === 200) {
                               let comid = ( res.data.result.bounds.length >= 1 ? res.data.result.bounds[0].extId : 0 )
                                // 设置用户cookie
                                Cookie.set('t8t-tc-ticket', res.data.result.tickets['tuchat-pc'].value, { domain: domain })
                                Cookie.set('t8t-tc-uid', res.data.result.user.id, { domain: domain })
                                Cookie.set('t8t-tc-username', res.data.result.user.name, { domain: domain })
                                Cookie.set('t8t-tc-comid', comid, { domain: domain })
                                that.setComName(comid,domain,_=>{
                                    that.onLogin()
                                })
                            } else {
                                that.resMsg = res.data.message || 'no response!'
                            }
                        })
               })

            },
            loginFocus(arg) {
                this[arg] = true
            },
            loginBlur(arg) {
                this[arg] = false
            },
            getCaptCha(){
                /*let url =  'http://erp.to8to.com/index.php/admin/captcha?refresh=1&_='+new Date().getTime();
                return axios({
                    method: 'get',
                    url: url
                }).then(res => {
                    if( res.status == 200  ){
                        let text = JSON.parse(res.request.response)
                        this.captchaSrc = 'http://erp.to8to.com'+(text.url)
                    }
                }).catch(e => {

                })*/
            },
            setComName(comid,domain,cb){
                    this.$http.fetch(
                        'fcominfo/getbyId',{id:comid}
                    ).then((res) => {
                        if( res.data.status == 200 ){
                            Cookie.set('t8t-tc-comname', res.data.result && res.data.result.name || '', { domain: domain} )
                            cb()
                        }else{
                            cb()
                        }
                    }).catch(err => {
                        cb()
                    })
                }
        },
        mounted() {
            // 初始化绑定DOM
            captcha.setTarget(document.getElementById('captcha'), true)
        },
    }

</script>

<style scoped>
    .login {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url(./img/login-bg.jpg) repeat-x center bottom;
        background-color: #f6f6f6;
    }
    .login-container {
        width: 860px;
        height: 600px;
        background-color: #fff;
        border: 1px solid #eee;
        box-shadow: 15px 15px 30px #eee;
        display: flex;
        justify-content: center;
    }

    .login-inner {
        margin: auto;/*logo暂时不展示，设置表单顶部边距*/
        width: 320px;
        font-size: 14px;
    }

    .logo-container {
        text-align: center;
    }

    .login-logo {
        margin: 70px auto 30px;
        border-radius: 30px;
    }

    .input-group {
        position: relative;
    }

    .input-icon {
        position: absolute;
        width: 46px;
        height: 20px;
        top: 13px;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid #dae3eb;
    }

    .input-icon .icon {
        width: 20px;
        height: 20px;
        background-image: url(./img/login-icon.png);
        background-repeat: no-repeat;
    }

    .icon-user {
        background-position: -38px 0;
    }

    .icon-password {
        background-position: -38px -61px;
    }

    .icon-code {
        background-position: -38px -122px;
    }

    .icon-user.active {
        background-position: 1px 0;
    }

    .icon-password.active {
        background-position: 3px -61px;
    }

    .icon-code.active {
        background-position: 2px -122px;
    }

    .login-code-container {
        display: flex;
    }

    .login-code-input {
        width: 210px;
        margin-right: 10px;
    }

    .login-code-img {
        flex: 1;
        border: 1px solid #e5e8f1;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .login-submit {
        width: 100%;
        height: 50px;
        font-size: 16px;
    }

    .login-res-msg {

        color: #b94a48;
        background-color: #f2dede;
        height: 46px;
        border: 1px solid #eed3d7;
        margin-bottom: 15px;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<style>
    .login-input-group .el-input__inner {
        height: 46px;
        font-size: 14px;
        border-radius: 0;
        padding-left: 55px;
        /*border: 1px solid #e5e8f1;*/
    }

    .login-container .el-form-item__error:before {
        font-family: 'element-icons' !important;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        content: "\E60A";
        margin-left: 28px;
        margin-right: 5px;
    }
</style>
