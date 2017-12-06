<template>
    <el-dialog title="收款类型配置" v-model="myDialogVisible" @close="closeDialog('formRef')" class="page-pay-type-dialog" ref="dialogRef">
        <el-form :model="formData" label-width="125px" :rules="formRule" ref="formRef" >
            <el-form-item label="编码：" prop="code" >
                <el-input v-model="formData.code" disabled></el-input>
            </el-form-item>
            <el-form-item label="收款类型：" prop="debitTypeId">
                <el-select v-model="formData.debitTypeId" placeholder="--请选择--" :disabled="status === 'update'" @change="handleCode">
                    <el-option v-for="item in nameTypes" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="业务类型：" prop="businessTypeId">
                <el-select v-model="formData.businessTypeId" placeholder="--请选择--" :disabled="editable===false">
                    <el-option v-for="item in businessTypes" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="收款对象：" prop="debitObjectId">
                <el-select v-model="formData.debitObjectId" placeholder="--请选择--" :disabled="editable===false">
                    <el-option v-for="item in debitObjects" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="收款对象ID：" prop="containDebitObjectId">
                <el-radio-group v-model="formData.containDebitObjectId" :disabled="editable===false">
                    <el-radio :label="1" >必填</el-radio>
                    <el-radio :label="0">非必填</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="收款对象名称：" prop="containDebitObjectName">
                <el-radio-group v-model="formData.containDebitObjectName" :disabled="editable===false">
                    <el-radio :label="1">必填</el-radio>
                    <el-radio :label="0">非必填</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="项目ID：" prop="containProjectId">
                <el-radio-group v-model="formData.containProjectId" :disabled="editable===false">
                    <el-radio :label="1">必填</el-radio>
                    <el-radio :label="0">非必填</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" v-if="editable">
            <el-button type="primary" @click="submitForm('formRef')" :loading="isLoading">提交</el-button>
            <el-button @click="closeDialog('formRef')">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import Cookie from 'js-cookie'
    import api from 'src/utils/api.js'
    export default {
        name: 'dialog',
        data() {
            return {
                isLoading: false,
                formData: {
                    code:'',
                    debitTypeCodeId: '',
                    debitTypeId: '',
                    businessTypeId: '',
                    debitObjectId: '',
                    containDebitObjectId: '',
                    containDebitObjectName: '',
                    containProjectId: '',
                    createUser: +Cookie.get('t8t-tc-uid')
                },
                formRule: {
                    debitTypeId: [{ type: 'number', required: true, message: '请选择收款类型', trigger: 'change' }],
                    businessTypeId: [{ type: 'number', required: true, message: '请选择业务类型', trigger: 'change' }],
                    debitObjectId: [{ type: 'number', required: true, message: '请选择收款对象', trigger: 'change' }],
                    containDebitObjectId: [{ type: 'number', required: true, message: '请选择对象ID', trigger: 'change' }],
                    containDebitObjectName: [{ type: 'number', required: true, message: '请选择对象名称', trigger: 'change' }],
                    containProjectId: [{ type: 'number', required: true, message: '请选择项目ID', trigger: 'change' }]
                }
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            editable: {
                type: Boolean,
                default: false
            },
            businessTypes: Array,
            debitObjects: Array,
            nameTypes: Array,
            status: String,
            rowID: Number
        },
        computed: {
            myDialogVisible: function () {
                // return this.visible
                return true
            }
        },
        methods: {
            submitForm(formRef) {
                this.$refs[formRef].validate((isValid) => {
                    if (!isValid) return false
                        this.isLoading = true
                        // 编辑
                        this.formData.updateUser = +Cookie.get('t8t-tc-uid')
                        this.formData.debitTypeCodeId = this.formData.debitTypeId
                        let requestData = {
                            debitType: this.formData
                        }
                        let method = this.status
                        api.debitType[method](requestData)
                        .then((res) => {
                            if(res.data.status === 200 && res.data.result === 1){
                                this.isLoading = false
                                this.$emit('close')

                                var msg = ''
                                if(this.status === 'create'){
                                    msg = '新增成功'
                                }else if(this.status === 'update'){
                                    msg = '编辑成功'
                                }
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: msg,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.$emit('success')
                            }else{
                                this.isLoading = false
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                        })
                })
            },
            closeDialog(formRef) {
                this.$refs[formRef].resetFields()
                this.$emit('close')
            },
            handleCode(value){
                for(let i = 0;i<this.nameTypes.length;i++) {
                    if (value===this.nameTypes[i].value) {
                        this.formData.code = this.nameTypes[i].code
                    }
                }
            }
        },
        created() {
            if(this.status === 'create')return
            var requestData = {
                search: {
                    id: this.rowID
                },
                page: 1,
                size: 10
            }
            // 业务类型
            api.debitType.queryPage(requestData)
            .then((res) => {
              this.formData = res.data.result.rows[0]
              this.formData.code = res.data.result.rows[0].code
            })
        }
    }

</script>

<style lang="css" scoped>

</style>


<style>
    .page-pay-type-dialog .el-input__inner{
        width: 250px;
    }
</style>
