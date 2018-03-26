<template>
    <div class="console">
        <app-header></app-header>
        <div class="console-body">
            <app-sidebar :hide="sidebarHide"
                         @toggle-button-click="handleToggleButtonClick"></app-sidebar>
            <app-content :stretch="sidebarHide"></app-content>
        </div>
        <div class="phone-bind-dialog-mask"
		    v-if="showPhoneBindDialog">
			<div class="phone-bind-dialog">
				<i class="dialog-close" @click="showPhoneBindDialog=false"></i>
				<header class="dialog-header">您未绑定手机号，请及时绑定</header>
				<div class="form-container">
					<el-form ref="form"
					    :model="form"
					    :rules="rules"
					    label-width="90px">
						<el-form-item label="手机号："
						    prop="tel">
							<el-input v-model="form.tel"></el-input>
						</el-form-item>
						<el-form-item label="短信验证码："
						    prop="sms">
							<el-col :span="15">
								<el-input v-model="form.sms"></el-input>
							</el-col>
							<el-col :span="9">
								<el-button class="sms-btn"
								    @click="getSMSCode"
								    :disabled="disableSMS">{{smsBtnMsg}}</el-button>
							</el-col>
						</el-form-item>
					</el-form>
					<el-button class="bind-btn"
					    @click="bindPhone">立即绑定</el-button>
				</div>
				<div>
					<p>根据国家互联网信息办公室发布的《移动互联网应用程序信息 服务管理规定》，自2016年8月20日起，注册用户需基于移动 电话号码等真实身份信息进行实名认证；
					</p>
					<p class="note-emphasis">绑定手机可以提高账号的安全性，方便找回密码。</p>
				</div>
			</div>
		</div>
    </div>
</template>
<script>
import Cookie from 'js-cookie'
import AppHeader from '../../components/app-header/app-header.vue'
import AppSidebar from '../../components/app-sidebar/app-sidebar.vue'
import AppContent from '../../components/app-content/app-content.vue'
export default {
    name: 'console',
    components: {
        AppHeader,
        AppSidebar,
        AppContent
    },
    data() {
        let validateTel = (rule, value, callback) => {
			if (!this.form.tel.trim()) {
				callback(new Error('请输入手机号'));
			}
			if (!/^1[3-9]\d{9}$/.test(this.form.tel.trim())) {
				callback(new Error('请输入有效的手机号'));
			} else {
				callback();
			}
		};

		let valideSMS = (rule, value, callback) => {
			if (!this.form.sms.trim()) {
				callback(new Error('请输入验证码'));
			} else {
				callback();
			}
		};
        return {
            sidebarHide: false,
            showPhoneBindDialog: false,
            disableSMS: false,
			smsBtnMsg: '获取验证码',
			count: 59,
			timer: null,
            form: {
				tel: '',
				sms: ''
			},
			rules: {
				tel: [
					{
						validator: validateTel,
						trigger: 'blur'
					}
				],
				sms: [
					{
						validator: valideSMS,
						trigger: 'blur'
					}
				]
			}
        }
    },
    created() {
        if (Cookie.get('hasChecked')) return;
        this.$http
            .fetch('acc/views/user/profile', {
                id: +Cookie.get('t8t-tc-uid')
            })
            .then(res => {
                if (res.data && res.data.status === 200 && res.data.result.phoneId === 0) {
					Cookie.set('hasChecked', 1)
					setTimeout(() => {
						this.showPhoneBindDialog = true;
					}, 3000)
                }
            })
            .catch(err => {});
    },
    methods: {
        handleToggleButtonClick() {
            this.sidebarHide = !this.sidebarHide
        },
        getSMSCode() {
			this.disableSMS = true;
			this.countDown();
			this.$refs.form.validateField('tel', err => {
				if (!err) {
					this.$http
						.fetch('acc/sendSMSVerifyCodeForBind', {
							phoneNumbers: this.form.tel.trim()
						})
						.then(res => {
							if (res.data && res.data.result === 1) {
								
							}
						})
						.catch(err => {});
				}
			});
		},

		bindPhone() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$http
						.fetch('acc/bindPhoneNumbers', {
							phoneNumbers: this.form.tel.trim(),
							smsVerifyCode: this.form.sms.trim(),
							token: Cookie.get('t8t-tc-ticket')
						})
						.then(res => {
							if (res.data.status === 200 && res.data.result === 1) {
                                this.showPhoneBindDialog = false;
                                this.$message.success('绑定成功');
							} else if (res.data.status === 90116) {
								this.$message.error('该手机号已绑定账号');
							} else {
                                this.$message.error('绑定失败');
                            }
						});
				}
			});
		},

		countDown() {
			if (this.count <= 0) {
				this.count = 59;
				this.smsBtnMsg = '重新获取';
				this.disableSMS = false;
				clearTimeout(this.timer);
			} else {
				this.timer = setTimeout(() => {
					this.count--;
					this.smsBtnMsg = `重新发送(${this.count})`;
					this.countDown();
				}, 1000);
			}
		}
    }
}

</script>

<style>
.console {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.console-body {
    flex: 1;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    position: relative
}

.console .erp-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9999;
}

.console .el-progress-bar__outer {
    background-color: transparent;
    border-radius: 0;
}

.console .el-progress-bar__inner {
    border-radius: 0;
}

.console .app-header {
    width: 100%;
    height: 60px;
}
</style>
<style>
.phone-bind-dialog .el-form-item__label {
	font-size: 14px;
	color: #333333;
	text-align: left;
	padding-right: 0;
}
.phone-bind-dialog .el-input__inner {
	border-color: #d8d8d8;
	border-radius: 0;
	height: 36px;
}
.phone-bind-dialog .el-input__inner:focus {
	border-color: #06c792;
}
.el-form-item.is-error .el-input__inner:focus {
	border-color: #ff4949;
}
.phone-bind-dialog .el-button {
	border-color: #06c792;
}
.phone-bind-dialog .sms-btn {
	color: #17c692;
	font-size: 12px;
	border-color: #a2e8d3;
	border-radius: 0;
	width: 80px;
	height: 36px;
	padding: 9px 5px;
	float: right;
}
.phone-bind-dialog .sms-btn:hover {
	border-color: #06c792;
}
.is-disabled.sms-btn {
	color: #bfcbd9;
}
.is-disabled.sms-btn:hover {
	border-color: #a2e8d3;
}
.phone-bind-dialog .bind-btn {
	display: block;
	width: 110px;
	margin: 30px auto 0;
	background: #06c792;
	border-radius: 3px;
	color: #fff;
	font-size: 14px;
}
.phone-bind-dialog p {
	color: #999999;
	font-size: 12px;
	text-align: justify;
	margin: 0;
	line-height: 1.5;
}
.phone-bind-dialog .note-emphasis {
	color: #fe6969;
}
.phone-bind-dialog .dialog-close {
	position: absolute;
	right: 12px;
	top: 12px;
	width: 14px;
	height: 14px;
	color: #afafaf;
	cursor: pointer;
	background: url('./close.png') no-repeat;
	background-size: contain;
}
/* .phone-bind-dialog .dialog-close {
	position: absolute;
	display: block;
	height: 100%;
	width: 1px;
	background-color: #afafaf;
} */
</style>
<style scoped>
.phone-bind-dialog-mask {
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
}
.phone-bind-dialog {
	position: relative;
	padding: 40px;
	width: 400px;
	height: 400px;
	background-color: #fff;
	border-radius: 4px;
	box-sizing: border-box;
}
.dialog-header {
	font-size: 18px;
	color: #333333;
	text-align: center;
}
.form-container {
	margin: 32px 0;
}
</style>
