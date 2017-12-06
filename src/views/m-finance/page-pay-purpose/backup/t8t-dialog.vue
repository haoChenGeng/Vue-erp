<template>
    <div>
        <el-dialog
            title="收款方式使用配置"
            class="pay-dialog"
            v-model="dialogVisible"
            @close="btnCancleClick('payForm')"
        >
            <el-form
                :label-position="labelPosition"
                :model="formData"
                :rules="rules"
                ref="payForm"
                @keyup.enter.native="btnOKClick('payForm')"
            >
                <el-form-item
                    label="编码"
                    :label-width="formLabelWidth"
                    prop="code"
                >
                    <el-input
                        v-model="formData.code"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="名称"
                    :label-width="formLabelWidth"
                    prop="name"
                >
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item
                    label="组织"
                    :label-width="formLabelWidth"
                    prop="organizationCode"
                >
                    <el-select
                        v-model="formData.organizationCode"
                        placeholder="--请选择--"
                    >
                        <el-option
                            v-for="item in typeCodeOptions"
                            :label="item.name"
                            :value="item.code"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="渠道"
                    :label-width="formLabelWidth"
                    prop="channelType"
                >
                    <el-select
                        v-model="formData.channelType"
                        placeholder="--请选择--"
                    >
                        <el-option
                            v-for="item in channelType"
                            :label="item.text"
                            value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    @click="btnOKClick('payForm')"
                    type="primary"
                >确定</el-button>
                <el-button @click="btnCancleClick('payForm')">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'pay-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '90px',
                rules: {
                    code: [
                        { required: true, message: "请输入编码", trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: "请输入名称", trigger: 'blur' },
                        { min: 3, max: 50, message: "字符长度在3至50之间", trigger: 'blur' }
                    ],
                    organizationCode: [
                        { required: true, message: "请选择组织", trigger: 'change' }
                    ],
                    channelType: [
                        { required: true, message: "请选择渠道", trigger: 'change' }
                    ]
                }
            }
        },
        mounted() {
            this.$store.dispatch('getConfigData')
        },
        computed: {
            dialogVisible: {
                get() {
                    return this.$store.state.payMethods.dialogVisible
                },
                set(value) {
                    this.$store.commit('PAYMETHODS_SET_DIALOGVISIBLE', value)
                }
            },
            formData: {
                get() {
                    return this.$store.state.payMethods.formData
                },
                set(value) {
                    this.$store.commit('PAYMETHODS_SET_DIALOGFORM', value)
                }
            },
            typeCodeOptions() {
                return this.$store.state.payMethods.typeCodeOptions
            },
            channelType() {
                return this.$store.state.payMethods.commonData.channelType
            }
        },
        methods: {
            btnOKClick(payForm) {
                this.$refs[payForm].validate(valid => {
                    if (valid) {
                        var debitChannel = Object.assign({}, this.formData)
                        debitChannel.channelType = parseInt(debitChannel.channelType)
                        var editType = this.$store.state.payMethods.editType
                        var uid = Cookie.get('uid')
                        if (uid) {
                            if (editType === '新增') {
                                debitChannel.createUser = Cookie.get('uid')
                            }
                            else if (editType === '编辑') {
                                debitChannel.updateUser = Cookie.get('uid')
                            };
                            this.$store.dispatch('updatePayMethods', debitChannel)
                        }
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick(payForm) {
                this.$refs[payForm].resetFields();
                this.$store.commit('PAYMETHODS_SET_DIALOGVISIBLE', false)
            }
        }
    }

</script>

<style
    lang="css"
    scoped
>

</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
    .pay-dialog .el-dialog {
        width: 450px;
    }
    
    .el-select-dropdown__wrap {
        max-height: 185px !important;
    }
    
    .pay-dialog .el-form-item__content {
        width: 254px;
    }
    
    .pay-dialog .el-select {
        width: 100%;
    }
</style>