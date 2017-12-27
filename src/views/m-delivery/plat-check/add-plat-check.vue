<template>
    <div>
        <el-dialog :title="title" class="add-plat-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form v-loading.lock="formLoading" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth"
                ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="项目ID：" prop="sourceProjectId">
                    <el-input @blur="getProjectInfo()" v-model="formData.sourceProjectId"></el-input>
                </el-form-item>
                <el-form-item label="业主姓名：" prop="ownerName">
                    <el-input v-model="formData.ownerName" disabled></el-input>
                </el-form-item>
                <el-form-item label="详细地址：" prop="addressDetail">
                    <el-input type="textarea" rows="3" v-model="formData.addressDetail" disabled></el-input>
                </el-form-item>
                <el-form-item label="验收节点：" prop="sheduleNodeId">
                    <el-select v-model="formData.sheduleNodeId" filterable :allow-create="false" placeholder="请选择验收节点">
                        <el-option v-for="item in projectNodeVOs" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请开始时间：" prop="expectStartTime">
                    <el-date-picker v-model="formData.expectStartTime" placeholder="" type="datetime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="申请结束时间：" prop="expectCheckTime">
                    <el-date-picker v-model="formData.expectCheckTime" placeholder="" type="datetime">
                    </el-date-picker>
                </el-form-item>
                <div v-if="reminder != ''" class='reminder'>
                    <span style="font:200 ">温馨提示:</span>
                    <div class="noteBox" v-html="reminder"></div>
                </div>
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
        name: 'add-start-bill',
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
                    sourceProjectId: [
                        { required: true, message: "请填写项目ID" },
                        {
                            // type: 'string', message: "请输入正确的项目ID", transform: function (varable) {
                            //     //checkNumber(varable);
                            //     return varable.length >= 1 && varable.length <= 64 ? varable : varable
                            // },
                            pattern: /^\d{1,64}$/,
                            message: '请输入正确的项目ID(项目id需为数字)'
                        }
                    ],
                    sheduleNodeId: [
                        { type: 'string', required: true, message: "请选择验收节点", trigger: 'change' },
                    ],
                    expectStartTime: [
                        { type: 'date', required: true, message: "请选择申请开始时间", trigger: 'change' },
                    ],
                    expectCheckTime: [
                        { type: 'date', required: true, trigger: 'change', validator: validateExpectCheckTime },
                    ],
                },
                //表单
                formData: {
                    sourceProjectId: null,
                    projectId: null,
                    ownerName: '',
                    addressDetail: '',
                    sheduleNodeId: null,
                    expectStartTime: '',
                    expectCheckTime: ''
                },
                isLoading: false,
                projectNodeVOs: [],
                formLoading: false,
                reminder: '',//温馨提示
            }
        },
        props: {
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
            // if (this.editType == 'add') {
            //     this.formData.projectId = this.projectId;
            //     this.getProjectInfo();
            // }
            //请求所选行的数据
        },
        methods: {
            getProjectInfo() {
                this.formData.ownerName = '';
                this.formData.addressDetail = '';
                this.formData.sheduleNodeId = null;
                this.formData.expectStartTime = '';
                this.formData.expectCheckTime = '';
                this.projectNodeVOs = [];
                this.reminder = '';
                let sourceProjectId = this.formData.sourceProjectId
                if (typeof sourceProjectId != 'string' || sourceProjectId.length < 1 || sourceProjectId.length > 64 || /^\d{1,64}$/.test(sourceProjectId) == false) {
                    // this.$message({
                    //     type: 'error',
                    //     message: '请输入正确的项目ID(项目id需为数字)'
                    // })
                    return;
                }
                this.formLoading = true;
                CheckCommon.getOrderInfo({ sourceProjectId: this.formData.sourceProjectId })
                    .then((res) => {
                        let resStatus = [211512, 211514, 211502];
                        let message = '';
                        if (res.data.status === 200) {
                            this.projectNodeVOs = [];
                            let list = [];
                            res.data.result.projectNodeVOs.forEach(function (item, i) {
                                list.push({ label: item.nodeTypeName, value: item.id });
                            });
                            this.projectNodeVOs = list;
                            this.formData.sheduleNodeId = list.length > 0 ? list[0].value : "";
                            this.formData = Object.assign(this.formData, res.data.result)
                        }
                        else if (resStatus.includes(res.data.status)) {
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
                        this.formLoading = false;
                    });
            },
            btnOKClick() {
                let that = this;
                that.$refs['form'].validate(valid => {
                    if (valid) {
                        let editType = that.editType;
                        if (editType === 'add') {
                            if (null == that.formData.projectId || 0 == that.formData.projectId) {
                                that.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: '此项目信息不存在！',
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                });
                                return;
                            }
                            that.isLoading = true;
                            let platCheckCreateDTO = {
                                projectId: that.formData.projectId,
                                sourceProjectId: that.formData.sourceProjectId,
                                sheduleNodeId: that.formData.sheduleNodeId,
                                expectStartTime: +Date.parse(that.formData.expectStartTime).toString().substr(0, 10),
                                expectCheckTime: +Date.parse(that.formData.expectCheckTime).toString().substr(0, 10),
                                createUser: +Cookie.get('t8t-tc-uid'),
                            }
                            CheckCommon.createCheck({ check: platCheckCreateDTO })
                                .then((res) => {
                                    let resStatus = [211514, 211501, 211502, 211503, 211509, 211507, 211511, 211500];
                                    let message = '';
                                    if (res.data.status === 200) {
                                        that.$message({
                                            type: 'success',
                                            message: '新增成功！'
                                        })
                                        that.btnCancleClick()
                                        that.$emit('getTableData')
                                    } else if (res.data.status === 211509) {
                                        let reminder = '';
                                        let result = res.data.result;
                                        if (typeof result == "object" && result.length > 0) {
                                            for (let index = 0; index < res.data.result.length; index++) {
                                                reminder = reminder.concat(index + 1).concat(".").concat(res.data.result[index]).concat("<br>");
                                            }
                                        }
                                        else {
                                            reminder = result == null ? res.data.message : result;
                                        }
                                        that.reminder = reminder
                                    } else if (resStatus.includes(res.data.status)) {
                                        message: res.data.result == null ? (res.data.message == null ? '系统异常,请稍后再试！' : res.data.message) : res.data.result;
                                    } else {
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
            },
            checkNumber(value) {
                var reg = /^\d{1,64}$/;
                if (reg.test(value)) {
                    return false;
                }
                return true;
            }
        }
    }

</script>

<style lang="css" scoped>
    .reminder {
        color: red;
        text-decoration: none;
        margin-left: 10px;
        line-height: 20px;
    }

    .noteBox {
        margin-left: 2em;
    }
</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
    .add-plat-dialog .el-dialog {
        width: 450px;
    }

    .el-select-dropdown__wrap {
        max-height: 185px !important;
    }

    .add-plat-dialog .el-form-item__content {
        width: 250px;
    }

    .add-plat-dialog .el-select {
        width: 100%;
    }
</style>