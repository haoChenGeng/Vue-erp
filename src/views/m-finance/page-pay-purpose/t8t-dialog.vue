<template>
    <el-dialog
        title="款项用途配置"
        class="pay-dialog"
        v-model="dialogVisible"
    >
        <el-form
            label-position="right"
            label-width="90px"
            ref="form"
            :model="privateData"
            :rules="rules1"
            @keyup.enter.native="btnOKClick()"
        >
            <el-form-item
                label="业务类型"
                prop="businessTypeId"
            >
                <el-select
                    v-model="privateData.businessTypeId"
                    placeholder="--请选择--"
                    :disabled="action==='view'"
                >
                    <el-option
                        v-for="item in commonData.businessTypes"
                        :label="item.text"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="收款对象"
                prop="debitObjectId"
            >
                <el-select
                    v-model="privateData.debitObjectId"
                    placeholder="--请选择--"
                    :disabled="action==='view'"
                >
                    <el-option
                        v-for="item in commonData.debitObjects"
                        :label="item.text"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="收款类型"
                prop="debitTypeCodeId"
            >
                <el-select
                    v-model="privateData.debitTypeCodeId"
                    placeholder="--请选择--"
                    :disabled="action==='view'"
                >
                    <el-option
                        v-for="item in commonData.debitTypeCodes"
                        :label="item.text"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="编码"
                prop="fundPurposeId"
            >
                <el-input
                    :disabled="true"
                    :value="fundPurposeCode"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="款项用途"
                prop="fundPurposeId"
            >
                <el-select
                    v-model="privateData.fundPurposeId"
                    placeholder="--请选择--"
                    :disabled="action!=='create'"
                >
                    <el-option
                        v-for="item in commonData.fundPurposes"
                        :label="item.text"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="是否唯一"
                prop="isRepeat"
            >
                <el-radio-group v-model="privateData.isRepeat" :disabled="editable===false">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                label="核销差额"
                prop="permittedDiffAmount"
            >
                <el-input
                    v-model="privateData.permittedDiffAmount"
                    :disabled="action==='view'"
                ></el-input>
            </el-form-item>
        </el-form>
        <div
            slot="footer"
            class="dialog-footer"
            v-if="action!=='view'"
        >
            <el-button
                @click="btnOKClick()"
                type="primary"
                :loading="isLoading"
            >确定</el-button>
            <el-button @click="btnCancleClick()">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
    import './style/t8t-dialog.css'
    import cookie from 'js-cookie'
    import request from 'src/services/finance/fundPurpose.js'
    import * as config from './config.js'

    const uid = +cookie.get('t8t-tc-uid')
    export default {
        name: 't8t-dialog',
        data() {
            return {
                isLoading: false,
                dialogVisible: false,
                privateData: {},
                rules1: config.dlgRules,
                radio: '1'
            }
        },
        props: {
            data: {
                type: Object,
                default: {}
            },
            action: {
                type: String,
                default: 'create'
            },
            commonData: {
                type: Object,
                default: []
            }
        },
        watch: {
            data: function (val) {
                this.privateData = Object.assign({}, val)
            }
        },
        computed: {
            fundPurposeCode() {
                return getTextById(this.commonData.fundPurposes, this.privateData.fundPurposeId, 'code')
            }
        },
        methods: {
            // 清除验证提示
            clearVerifyTips() {
                this.$nextTick(function () {
                    if(this.action==='create'){
                        this.$refs['form'].resetFields()
                    }
                })
            },
            // 显示对话框
            dialogShow() {
                this.clearVerifyTips()
                this.dialogVisible = true
                this.$emit('dialog-shown')
            },
            // 关闭对话框
            dialogClose() {
                this.clearVerifyTips()
                this.dialogVisible = false
                this.$emit('dialog-closed')
            },
            // 点击确定按钮
            btnOKClick() {
                let self = this
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        self.isLoading = true
                        self.privateData[self.action + 'User'] = uid
                        let args = { "fundPurpose": self.privateData }
                        request[self.action](args)
                            .then((res) => {
                                this.isLoading = false
                                if (res.data.status === 200 && res.data.result ===1) {
                                    self.$msgbox(mb(M[self.action] + '成功。', 'success'))
                                    self.dialogClose()
                                } else {
                                    self.$msgbox(mb(res.data.message, 'error'))
                                }
                            })
                    }
                })
            },
            // 点击取消按钮
            btnCancleClick() {
                this.dialogClose()
            },
        }
    }

</script>
