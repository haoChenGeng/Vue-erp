<template>
    <div class="config-dialog">
        <el-dialog :title="title" class="config-dialog" v-model="isShow"
                   @close="btnCancelClick()">
            <div class="dialog-tabs" v-if="dialogStatus==='view'">
                <button class="tab-btn active" @click="toggleTab(0)" ref="varDom">变量信息</button>
                <button class="tab-btn" @click="toggleTab(1)" ref="restDom">其他信息</button>
            </div>
            <el-form
                :model="formData"
                :label-width="formLabelWidth"
                :label-position="labelPosition"
                :rules="rules"
                ref="configForm_1"
                v-if="activeTab===0"
            >
                <el-form-item label="条件变量:" prop="conditionName">
                    <el-input v-model="formData.conditionName" :disabled="dialogStatus==='view'"></el-input>
                </el-form-item>
                <el-form-item label="业务模块:" prop="moduleName">
                    <el-select v-model="formData.moduleName" placeholder="请选择"
                               :disabled="dialogStatus!=='create'">
                        <el-option v-for="item in moduleOptions" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="变量类型:" prop="conditionType">
                    <el-select v-model="formData.conditionType" placeholder="请选择" @change="conditionTypeChange"
                               :disabled="dialogStatus!=='create'">
                        <el-option v-for="item in conditionTypeOptions" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="变量:" prop="conditionVar">
                    <el-input v-model="formData.conditionVar" :disabled="dialogStatus!=='create'"></el-input>
                </el-form-item>
                <el-form-item label="描述:" prop="description">
                    <el-input type="textarea" :rows="2" v-model="formData.description"
                              :disabled="dialogStatus==='view'"></el-input>
                </el-form-item>
            </el-form>

            <el-form
                :model="formData"
                :label-width="formLabelWidth"
                :label-position="labelPosition"
                :rules="rules"
                ref="configForm_2"
                v-if="activeTab===1"
            >
                <el-form-item label="创建人:" prop="createUserName">
                    <el-input v-model="formData.createUserName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="创建时间:" prop="createTime">
                    <el-input v-model="createTime" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="修改人:" prop="updateUserName">
                    <el-input v-model="formData.updateUserName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="修改时间:" prop="updateTime">
                    <el-input v-model="updateTime" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary">确定</el-button>
                <el-button @click="btnCancelClick()" v-if="dialogStatus!=='view'">取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import Service from 'src/services/system/Service.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'

    export default {

        name: 'config-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '110px',
                isShow: true,
                title: '查看',
                formData: {
                    conditionName: '',
                    moduleName: '',
                    conditionType: '',
                    conditionVar: '',
                    description: '',
                    createUser: '',
                    createTime: '',
                    updateUser: '',
                    updateDate: ''
                },
                rules: {
                    conditionName: [
                        {
                            required: true,
                            message: '请填写条件变量名',
                            trigger: 'blur'
                        },
                        {
                            max: 30,
                            message: '条件名称超长，请重新输入!',
                            trigger: 'blur'
                        }
                    ],
                    moduleName: [
                        {
                            required: true,
                            message: '请选择业务模块',
                            trigger: 'blur'
                        }
                    ],
                    conditionType: [
                        {
                            required: true,
                            message: '请选择变量类型',
                            trigger: 'blur'
                        }
                    ],
                    conditionVar: [
                        {
                            required: true,
                            message: '请填写条件变量值',
                            trigger: 'blur'
                        }
                    ],
                    createTime: [
                        {
                            formatter: 'dateparser'
                        }
                    ]
                },
                conditionTypeOptions: [
                    {text: '整数', value: 1},
                    {text: '字符串', value: 2},
                    {text: '布尔值', value: 3},
                    {text: '浮点数', value: 4}
                ]
            }
        },
        props: {
            dialogStatus: {
                type: String,
                default: 'view'
            },

            rowData: {
                type: Object,
                default: {}
            },

            commonData: {
                type: Array,
                default: []
            },

            activeTab: {
                type: Number,
                default: 0
            },

            moduleOptions: {
                type: Array,
                default: []
            }
        },
        computed: {

            createTime: function() {
                let date = new Date(this.formData.createTime * 1000),
                    year = date.getFullYear(),
                    month = date.getMonth() + 1,
                    day = date.getDate(),
                    hour = date.getHours(),
                    minu = date.getMinutes(),
                    sec = date.getSeconds();

                return year + '-' + month + '-' + day + ' ' + hour + ':' + minu + ':' + sec;
            },

            updateTime: function() {

                if (!this.formData.updateTime) {
                    return '';
                }

                let date = new Date(this.formData.updateTime * 1000),
                    year = date.getFullYear(),
                    month = date.getMonth() + 1,
                    day = date.getDate(),
                    hour = date.getHours(),
                    minu = date.getMinutes(),
                    sec = date.getSeconds();

                return year + '-' + month + '-' + day + ' ' + hour + ':' + minu + ':' + sec;

            }

        },
        methods: {
            closeDialog() {
                this.$emit('close');
            },

            btnOKClick() {

                switch (this.dialogStatus) {

                    case 'create':
                        if (!this.checkArgs()) {
                          return;
                        }

                        this.createCondition();
                        break;
                    case 'edit':
                        if (!this.checkArgs()) {
                            return;
                        }

                        this.updateCondition();
                        break;
                    case 'view':
                        this.$emit('close');
                        break;
                }
            },

            btnCancelClick() {
                this.$emit('close');
            },

            checkArgs() {
                if (!this.formData.conditionName || this.formData.conditionName.length > 30|| !this.formData.moduleName
                    || !this.formData.conditionType || !this.formData.conditionVar) {
                    return false;
                }

                return true;
            },

            toggleTab(tab) {

                this.activeTab = tab;

                if (tab) {
                    this.$refs.restDom.classList.add('active');
                    this.$refs.varDom.classList.remove('active');
                } else {
                    this.$refs.varDom.classList.add('active');
                    this.$refs.restDom.classList.remove('active');
                }

            },

            bnsModuleChange(value) {

                this.formData.moduleId = value;
            },

            conditionTypeChange(value) {

                this.formData.conditionType = value;
            },

            createCondition() {
                let args = {
                    "req":{
                        "conditionName": this.formData.conditionName,
                        "conditionVar": this.formData.conditionVar,
                        "conditionType": this.formData.conditionType,
                        "moduleId": this.formData.moduleName,
                        "description": this.formData.description,
                        "createUser": +Cookie.get('t8t-tc-uid')
                    }
                }
                this.submitLoading = true
                axios({
                    service: Service.CONDITION.name,
                    method: Service.CONDITION.methods.CONDITION_CREATE,
                    args: args
                }).then((res) => {
                        this.submitLoading = false
                        if (res.data.status === 200 && res.data.result === 1) {
                            this.closeDialog()
                            this.$emit('success')
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            })
                        } else {
                            this.$message.error(res.data.message)
                        }
                    });
            },

            updateCondition() {

                let args = {
                    "req":{
                        "id": this.formData.id,
                        "conditionName": this.formData.conditionName,
                        "conditionVar": this.formData.conditionVar,
                        "conditionType": this.formData.conditionType,
                        "moduleId": this.formData.moduleId,
                        "description": this.formData.description,
                        "updateUser": +Cookie.get('t8t-tc-uid')
                    }
                }
                this.submitLoading = true

                axios({
                    service: Service.CONDITION.name,
                    method: Service.CONDITION.methods.CONDITION_UPDATE,
                    args: args
                }).then((res) => {

                    this.submitLoading = false

                    if (res.data.status === 200 && res.data.result === 1) {

                        this.closeDialog()
                        this.$emit('success')
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        })

                    } else {
                        this.$message.error(res.data.message)
                    }

                });

            }
        },

        created() {
            if (this.dialogStatus === 'view') {

                this.title = '查看';
                this.formData = this.rowData;

            } else if (this.dialogStatus === 'create') {

                this.title = '新增';

            } else {

                this.title = '编辑';
                this.formData = this.rowData;

            }

            // 动态获取数据

        }
    }
</script>

<style lang="css" scoped>
    .config-dialog .el-input {
        width: 85%;
    }

    .config-dialog .el-textarea {
        width: 85%;
    }

    .el-select {
        width: 85%;
    }

    .dialog-tabs {
        margin-bottom: 29px;
        padding: 0 34px;
    }

    .tab-btn {
        width: 90px;
        height: 33px;
        border-width: 0 0 2px 0;
        border-style: solid;
        border-color: transparent;
        outline: none;
        cursor: pointer;
        background: #fff;
        font-size: 15px;
    }

    .tab-btn.active {
        border-color: deepskyblue;
    }
</style>
