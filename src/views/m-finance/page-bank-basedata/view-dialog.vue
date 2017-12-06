<template>
    <div>
        <!-- 新增 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog">
            <div class="t8t-full-dialog-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <!-- <el-button @click="submitForm('formRef')" :loading="isLoading" class="toolbar-button">提交</el-button> -->
                    </div>
                </div>
                <!-- 表单区 -->
                <div class="full-dialog-form-container container-center">
                    <el-form :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px" class="myfrom">
                        <h2>基本信息</h2>
                        <div class="info-container">
                            <div class="col">
                                <el-form-item label="银行账号：" prop="bankAccount">
                                    <el-input v-model="formData.bankAccount" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <el-form-item label="账户名称：" prop="openingAccountName">
                                    <el-input v-model="formData.openingAccountName" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <el-form-item label="银行：" prop="bankName">
                                    <el-input v-model="formData.bankName" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <el-form-item label="开户支行：" prop="bankBranchName">
                                    <el-input v-model="formData.bankBranchName" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <el-form-item label="账户对象：" prop="roleTypeName">
                                    <el-input v-model="formData.roleTypeName" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <el-form-item label="关联对象：" prop="userName">
                                    <el-input v-model="formData.userName" :disabled="isDisabled"></el-input>
                                </el-form-item>
                            </div>
                            <div class="col">
                                <el-form-item label="状态：" prop="status">
                                    <el-select v-model="formData.status" :disabled="isDisabled">
                                        <el-option label="暂存" :value="0"></el-option>
                                        <el-option label="待审核" :value="1"></el-option>
                                        <el-option label="已审核" :value="2"></el-option>
                                        <el-option label="已作废" :value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="是否默认：" prop="isDefault">
                                    <el-select v-model="formData.isDefault" :disabled="isDisabled">
                                        <el-option label="是" :value="1"></el-option>
                                        <el-option label="否" :value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="省：" prop="bankName">
                                    <el-input v-model="formData.provinceName" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <el-form-item label="市：" prop="bankName">
                                    <el-input v-model="formData.cityName" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <el-form-item label="备注：" prop="remark">
                                    <el-input type="textarea" v-model="formData.remark" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <el-form-item label="附件：" prop="voucherUrl">
                                    <el-button size="small" @click="showImgDialog(formData.voucherUrl, formData.roleTypeName)">查看</el-button>
                                </el-form-item>
                            </div>
                        </div>
                        <h2>其它信息</h2>
                        <div class="info-container">
                            <div class="col">
                                <el-form-item label="创建人：" prop="createName">
                                    <el-input v-model="formData.createName" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <el-form-item label="审核人：" prop="verifyName">
                                    <el-input v-model="formData.verifyName" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <el-form-item label="修改人：" prop="updateName">
                                    <el-input v-model="formData.updateName" :disabled="isDisabled"></el-input>
                                </el-form-item>
                            </div>
                            <div class="col">
                                <el-form-item label="创建时间：" prop="createTime">
                                    <el-input :value="formData.createTime|toDate" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <el-form-item label="审核时间：" prop="verifyTime">
                                    <el-input :value="formData.verifyTime|toDate" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <el-form-item label="修改时间：" prop="updateTime">
                                    <el-input :value="formData.updateTime|toDate" :disabled="isDisabled"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
        </el-dialog>
        <!-- 查看图片弹窗 -->
        <el-dialog v-model="imgDialog" size="full" @close="closeImgDialog" ref="imgDialogRef" class="g-transparent-dialog">
            <div class="g-img-container">
                <img :src="imgSrc" alt="">
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import baseData from 'src/services/finance/baseData.js'
    import Utils from 'src/utils/Utils.js'
    export default {

        name: 'page-pay-bills-dialog',

        data() {
            return {
                isDisabled: true,
                isLoading: false,
                isDialogShow: true,
                imgDialog: false,
                activeTabName: 'one',
                formData: {
                    bankAccount: '',
                    openingAccountName: '',
                    bankName: '',
                    bankBranchName: '',
                    roleTypeName: '',
                    userName: '',
                    status: '',
                    isDefault: '',
                    remark: '',
                    voucherUrl: '',
                    createName: '',
                    verifyName: '',
                    updateName: '',
                    createTime: '',
                    verifyTime: '',
                    updateTime: '',
                    provinceName: '',
                    cityName: ''
                }
            }
        },

        methods: {
            submitForm(formRef) {
                this.$refs[formRef].validate((isValid) => {
                    if (!isValid) return false
                    this.isLoading = true
                        // 模拟请求
                    setTimeout(() => {
                        this.isLoading = false
                        this.closeDialog()
                    }, 2000)
                })
            },
            closeDialog() {
                this.$router.go(-1)
            },
            showImgDialog(src, userName) {
                if (userName === '供应商') {
                    this.imgSrc = 'http://pic.to8to.com' + src
                } else {
                    this.imgSrc = Utils.getFullURL(src)
                }
                this.imgDialog = true
            },
            closeImgDialog() {
                this.imgDialog = false
            }
        },
        mounted() {
            let args = {
                page: 1,
                size: 20,
                search: {
                    id: this.$route.query.id
                }
            }
            baseData.queryPage(args)
                .then((res) => {
                    this.formData = res.data.result.rows[0]
                })
        },
    };
</script>
<style lang="css" scoped>
    .t8t-full-dialog {}

    .t8t-full-dialog .myfrom {
        display: block;
    }

    .info-container {
        width: 650px;
        display: flex;
    }

    .info-container .col {
        flex: 1;
    }
</style>
<style>
    .t8t-full-dialog .el-dialog__header {
        padding: 0;
    }

    .t8t-full-dialog .el-dialog__body {
        padding: 0;
        height: 100%;
    }

    .t8t-full-dialog .t8t-full-dialog-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .t8t-full-dialog .full-dialog-tabs-container {
        flex: 1;
        margin-bottom: 20px;
    }

    .t8t-full-dialog .full-dialog-toolbar-container {
        height: 38px;
        background-color: #1e3046;
    }

    .t8t-full-dialog .toolbar-container {
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }

    .t8t-full-dialog .toolbar-container .toolbar-button {
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }

    .t8t-full-dialog .toolbar-container .toolbar-button:hover {
        color: #1e3046;
        background-color: #d2deeb;
    }

    .t8t-full-dialog .container-center {
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }

    .t8t-full-dialog .el-form {
        display: flex;
        flex-wrap: wrap;
    }

    .t8t-full-dialog .form-item-container {
        width: 25%;
    }

    .t8t-full-dialog .full-dialog-form-container {
        margin-top: 22px;
    }

    .t8t-full-dialog .full-dialog-form-container .el-form-item__content {
        width: 180px;
    }

    .t8t-full-dialog .full-dialog-tabs-container {
        display: flex;
    }

    .t8t-full-dialog .el-tabs {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__item {
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }

    .t8t-full-dialog .el-tabs__header {
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }

    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar {
        height: 1px;
    }

    .t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }

    .t8t-full-dialog .el-tabs__nav-wrap {
        width: 1220px;
        margin: 0 auto;
    }

    .t8t-full-dialog .el-tabs__content {
        flex: 1;
        display: flex;
        /*        width: 1220px;
        margin: 0 auto;*/
    }

    .t8t-full-dialog .el-tab-pane {
        flex: 1;
        overflow: auto;
    }
</style>
