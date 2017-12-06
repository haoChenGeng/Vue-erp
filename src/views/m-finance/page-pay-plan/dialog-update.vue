<template>
    <div>
        <el-dialog :title="dialogTitle" class="dialog-update" v-model="dialogVisible" @close="btnCancelClick()">
            <el-form
                :label-position="labelPosition"
                :model="formData"
                :label-width="formLabelWidth"
                ref="addForm"
                @keyup.enter.native="btnOKClick()"
            >
                <el-form-item label="项目ID" prop="projectId">
                    <el-input v-model="formData.projectId" :disabled="editType=='edit'"></el-input>
                </el-form-item>
                <el-form-item label="单据编号" prop="code">
                    <el-input v-model="formData.code" :disabled="editType=='edit'"></el-input>
                </el-form-item>
                <el-form-item label="款项用途" prop="fundPurposeName">
                    <el-input v-model="formData.fundPurposeName" :disabled="editType=='edit'"></el-input>
                </el-form-item>
                <el-form-item label="应收金额" prop="oughtAmount">
                    <el-input v-model="formData.oughtAmount"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="btnCancelClick()">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    import receiptPlanOrderApi from 'src/services/finance/receiptPlanOrder.js'
    import Utils from 'src/utils/Utils.js'
    import Service from 'src/services/finance/Service.js'
    import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
    export default {
        name: 'dialog-update',
        data () {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                dialogTitle: '修改收款计划单应收金额',
                // 校验规则
                rules: {
                    oughtAmount: [
                        {
                            type: 'number',
                            required: true,
                            message: "请填写应收金额",
                            trigger: 'change'
                        },
                        {
                            max: 10,
                            message: '应收金额不应大于10位',
                            trigger: 'blur'
                        },
                        {
                            min: 0,
                            message: '应收金额应大于0',
                            trigger: 'blur'
                        }
                    ],
                },
                // 表单数据
                formData: {
                    id: '',
                    projectId: '',
                    code: '',
                    fundPurposeName: '',
                    oughtAmount: '',
                },
                isLoading: false,
                // 是否初始进入编辑页面
                isFirstEdit: true,
                // 存储未修改的表单的值
                oldFormData: {}
            }
        },
        props: [
            'dialogTitle',
            'rowId',
            'editType',
            'selectSource'
        ],
        computed: {
            dialogVisible() {
                return true
            }
        },
        created() {
            // 如果是修改，根据id获取数据
            if (this.editType === 'edit' && this.rowId) {
                let args = {
                    page: 1,
                    size: 1,
                    search: {
                        id: this.rowId
                    }
                }
                receiptPlanOrderApi.queryPage(args)
                    .then((res) => {
                        if (res.data.status === 200) {
                            this.oldFormData = {...res.data.result.rows[0]}
                            this.formData = {...res.data.result.rows[0]}
                        }
                    })
            }
        },
        methods: {
            //取消
            btnCancelClick() {
                this.$refs['addForm'].resetFields()
                this.$emit('close')
                this.formData = {}
            },
            //确认
            btnOKClick() {
                this.$refs['addForm'].validate(valid => {
                    if (valid) {
                        this.isLoading = true
                        let formData = {...this.formData}
                        let oldFormData = {...this.oldFormData}
                        if (this.editType === 'edit') {
                            // 修改人
                            let args = {
                                receiptPlanUpdateDTO: {
                                    Id: this.rowId,
                                    oughtAmount: formData.oughtAmount,
                                    operId: parseInt(Cookie.get('t8t-tc-uid'))
                                }
                            }
                            receiptPlanOrderApi.receiptPlanOrderUpdate(args)
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        this.$msgbox(mb('修改成功', 'success'))
                                        this.btnCancelClick()
                                        this.$emit('getTableData')
                                    } else {
                                        this.$msgbox(mb(res.data.message, 'error'))
                                    }
                                    this.isLoading = false
                                })
                        }
                    }
                })
            },
        }
    }
</script>

<style lang="css" scoped>
    .dialog-update .el-dialog {
        width: 450px;
    }

    .dialog-update .el-input {
        width: 250px;
    }

    .dialog-update .el-select {
        width: 250px;
    }
</style>
