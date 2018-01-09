<template>
    <div>
        <el-dialog :title="title" class="again-plat-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form v-loading.lock="formLoading" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth"
                ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="项目ID：" prop="sourceProjectId">
                    <el-input v-model="formData.sourceProjectId" disabled></el-input>
                </el-form-item>
                <el-form-item label="业主姓名：" prop="ownerName">
                    <el-input v-model="formData.ownerName" disabled></el-input>
                </el-form-item>
                <el-form-item label="详细地址：" prop="addressDetail">
                    <el-input type="textarea" rows="3" v-model="formData.addressDetail" disabled></el-input>
                </el-form-item>
                <el-form-item label="验收节点：" prop="nodeTypeName">
                    <el-input v-model="formData.nodeTypeName" disabled></el-input>
                </el-form-item>
                <el-form-item label="申请开始时间：" prop="expectStartTime">
                    <el-date-picker v-model="formData.expectStartTime" placeholder="" type="datetime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="申请结束时间：" prop="expectCheckTime">
                    <el-date-picker v-model="formData.expectCheckTime" placeholder="" type="datetime">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import CheckCommon from 'src/services/delivery/check/checkCommon.js'
    import Utils from 'src/utils/Utils.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'again-plat-check',
        data() {
            let validateExpectCheckTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择申请结束时间'));
                }
                if (this.formData.expectStartTime && +this.formData.expectStartTime > +this.formData.expectCheckTime) {
                    return callback(new Error('结束时间必须大于等于开始时间'));
                }
                callback();
            }
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                dialogVisible: true,
                rules: {
                    expectStartTime: [
                        { type: 'date', required: true, message: "请选择申请开始时间", trigger: 'change' },
                    ],
                    expectCheckTime: [
                        { type: 'date', required: true, trigger: 'change', validator: validateExpectCheckTime },
                    ],
                },
                //表单
                formData: {
                    id: '',
                    sourceProjectId: null,
                    projectId: null,
                    ownerName: '',
                    addressDetail: '',
                    sheduleNodeId: null,
                    nodeTypeName: '',
                    expectStartTime: '',
                    expectCheckTime: ''
                },
                isLoading: false,
                formLoading: false,
            }
        },
        props: {
            id: {
                type: String,
                default: ''
            },
            editType: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            }
        },
        computed: {
            editable() {
                return this.editType === 'see'
            }
        },
        created() {
            if (this.id && this.editType == 'add') {
                this.formData.id = this.id;
                //请求所选行的数据
                CheckCommon.getAgainOrderInfo({ id: this.id })
                    .then((res) => {
                        let resStatus = [211514, 211502];
                        let message = '';
                        if (res.data.status === 200) {
                            this.formData = Object.assign(this.formData, res.data.result);
                        }
                        else if (resStatus.indexOf(res.data.status) != -1) {
                            message = res.data.result == null ? (res.data.message == null ? '系统异常,请稍后再试！' : res.data.message) : res.data.result
                        }
                        else {
                            message = '系统异常,请稍后再试！';
                        }
                        if (message != '') {
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: message,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            });
                        }
                        this.fullscreenLoading = false;
                    });
            }
        },
        methods: {
            btnOKClick() {
                let that = this;
                that.$refs['form'].validate(valid => {
                    if (valid) {
                        let editType = that.editType;
                        if (editType === 'add') {
                            that.isLoading = true;
                            let platCheckAgainCreateDTO = {
                                id: that.formData.id,
                                expectStartTime: +Date.parse(that.formData.expectStartTime).toString().substr(0, 10),
                                expectCheckTime: +Date.parse(that.formData.expectCheckTime).toString().substr(0, 10),
                                updateUser: +Cookie.get('t8t-tc-uid'),
                            }
                            CheckCommon.againCreate({ againCheck: platCheckAgainCreateDTO })
                                .then((res) => {
                                    let resStatus = [211514, 211501, 211502, 211516];
                                    let message = '';
                                    if (res.data.status === 200) {
                                        that.$message({
                                            type: 'success',
                                            message: '操作成功！'
                                        })
                                        that.btnCancleClick()
                                        that.$emit('getTableData')
                                    } else if (resStatus.indexOf(res.data.status) != -1) {
                                        message = res.data.result == null ? (res.data.message == null ? '系统异常,请稍后再试！' : res.data.message) : res.data.result
                                    }
                                    else {
                                        message = '系统异常,请稍后再试！';
                                    }
                                    if (message != '') {
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'error',
                                            message: message,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        });
                                    }
                                    that.isLoading = false;
                                })
                        }
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$refs['form'].resetFields()
                this.dialogVisible = false
                this.$emit('close')
            }
        }
    }

</script>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
    .again-plat-dialog .el-dialog {
        width: 450px;
    }

    .el-select-dropdown__wrap {
        max-height: 185px !important;
    }

    .again-plat-dialog .el-form-item__content {
        width: 250px;
    }

    .again-plat-dialog .el-select {
        width: 100%;
    }
</style>