<template>
    <div class="org-dialog">
        <el-dialog title="修改密码"
            @close="closeDialog"
            v-model="isShow">

            <el-form :model="formData"
                        ref="dialogForm"
                        label-width="80px"
                        :rules="formRules"
                        class="form-container clearfix">
                        <el-form-item label="用户账号"
                            prop="username"
                            class="item-container">
                            <el-input v-model="formData.username"
                                :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item
                            label="密码"
                            prop="password"
                            class="item-container">
                            <el-input v-model.trim="formData.password" autofocus></el-input>
                        </el-form-item>
            </el-form>
            <span slot="footer"
                class="dialog-footer"
                v-if="status!=='view'">
                <el-button type="primary"
                    @click="onSave">保 存</el-button>
                <el-button @click="closeDialog">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from './api.js'
    import Cookie from 'js-cookie'
    import md5 from 'md5'
    export default {
        data() {
            return {
                isShow: true,
                formData: {
                    username: null,
                    password: null
                },
                formRules: {
                    password: [
                        { type: 'string', required: true, min: 6, max: 18, message: "密码6--18位", trigger: 'blur' }
                    ]
                },
            }
        },
        props: {
            id: {
                type: Number,
                default: 0
            },
            username: String
        },
        methods: {
            closeDialog() {
                this.$emit('close');
            },
            onSave() {
                this.$refs['dialogForm'].validate(valid => {
                    if (!valid) {
                        return
                    }

                    api.update({
                        id: this.id,
                        password: md5(this.formData.password),
                        operId: +Cookie.get('t8t-tc-uid')
                    }).then(res=>{
                        if(res.data.status === 200 && res.data.result === 1) {
                            this.$message.success('修改成功')
                            this.closeDialog()
                        }else{
                            this.$message.error('修改失败')
                        }
                    })
                })
            }
        },
        created() {
            this.formData.username = this.username
        }
    }
</script>

<style lang="css" scoped>
    .form-container {
        width: 275px;
        margin: 0 auto;
    }
</style>

