<template>
    <div class="t8t-detail-view">
        <el-dialog
            :title="dialogTitle"
            @close="closeDialog"
            v-model="dialogVisible"
            class="add-dialog" >
            <el-form
                ref="ruleForm"
                label-position="right"
                label-width="120px"
                :model="formData"
                :rules="rules"
                @keyup.enter.native="btnOKClick()"
            >
                <el-form-item label="活动编码" prop="code">
                    <el-input v-model="formData.code"></el-input>
                </el-form-item>
                <el-form-item label="活动类型" prop="name">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="closeDialog()">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import * as config from './activityType-schema'
    import Cookie from 'js-cookie'
    import activityApi from 'src/services/salemanager/activity.js'
    import { mb } from 'src/components/t8t-table/utils/utils.js'

    export default {
        name: 'activity-add',
        data () {
            return {
                dialogVisible: true,
                rules: config.formRules,
                formData: config.formData,
                isLoading: false
            }
        },
        props: [
            'editType',
            'rowId',
            'dialogTitle'
        ],
        created () {
            if (this.editType === 'edit') {
                this.getDataById(this.rowId)
            }
        },
        methods: {
            closeDialog() {
                this.$refs.ruleForm.resetFields()
                this.$emit('close')
                this.formData = {}
            },
            btnOKClick() {
                this.$refs.ruleForm.validate(valid => {
                    if(valid) {
                        this.loading = true
                        let formData = {...this.formData}
                        if (this.editType === 'add') {
                            formData.createName = Cookie.get('t8t-tc-username')
                            let args = {
                                activityType: formData
                            }
                            activityApi.activityTypeAdd(args)
                                .then(res => {
                                    if (res.data.status === 200) {
                                        this.$msgbox(mb('新增成功', 'success'))
                                        this.closeDialog()
                                        this.$emit('reloadTableData')
                                    } else {
                                        this.$msgbox(mb(res.data.message, 'error'))
                                    }
                                    this.isLoading = false
                                })
                        }
                        else if (this.editType === 'edit'){
                            formData.updateName = Cookie.get('t8t-tc-username')
                            let args = {
                                activityType: formData
                            }
                            activityApi.activityTypeUpdate(args)
                                .then(res => {
                                    if (res.data.status === 200) {
                                        this.$msgbox(mb('修改成功', 'success'))
                                        this.closeDialog()
                                        this.$emit('reloadTableData')
                                    } else {
                                        this.$msgbox(mb(res.data.message, 'error'))
                                    }
                                    this.isLoading = false
                                })
                        }
                    }
                })
            },
            getDataById(id) {
                let args = {
                    id: id
                }
                activityApi.activityTypeFindById(args)
                    .then(res => {
                        if (res.data.status === 200) {
                            this.formData = {...res.data.result}
                        }
                    })
            }
        }
    };
</script>

<style lang="css" scoped>
    /*.full-dialog-form-container {*/
        /*position: relative;*/
    /*}*/
</style>

<style>
    .add-dialog .el-dialog{
        width: 450px;
    }
    .add-dialog  .el-input {
        width: 250px;
    }
    .add-dialog .el-select {
        width: 250px;
    }
</style>
