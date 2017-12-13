<template>
    <div>
        <el-dialog title="收款方式分配" class="prevent-repeat-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="payForm" @keyup.enter.native="btnOKClick()">
                <el-form-item label="业务系统：" prop="bizId">
                    <el-select v-model="formData.bizId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.bizOptions" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务系统子模块：" prop="bizSubId">
                    <el-select v-model="formData.bizSubId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.bizSubOptions" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单据类型：" prop="billId">
                    <el-select v-model="formData.billId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.billOptions" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务场景下是否允许重复：" prop="allowRepeat">
                    <el-select v-model="formData.allowRepeat" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.allowRepeat" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务描述：" prop="bizDesc" >
                    <el-input v-model="formData.bizDesc" :disabled="editable"></el-input>
                </el-form-item>
                <el-form-item label="业务唯一性参数注册字段集合：" prop="bizArgs" >
                    <el-input v-model="formData.bizArgs" :disabled="editable"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!editable">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
    </el-dialog>
    </div>
</template>
<script>
    import Cookie from 'js-cookie'
    import apiPreventRepeat from 'src/services/system/preventRepeat.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    export default {
        name: 'pay-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    bizId: [
                        {type: "number",required: true , message: "请选择业务系统",trigger: 'change'}
                    ],
                    bizSubId: [
                        {type: "number",required: true , message: "请选择业务系统子模块",trigger: 'change'}
                    ],
                    billId: [
                        {type: "number",required: true , message: "请选择单据类型",trigger: 'change'}
                    ],
                    bizDesc: [
                        {type: "string",required: true , message: "请输入业务描述",trigger: 'change'}
                    ],
                    bizArgs: [
                        {type: "string",required: true , message: "请输入业务唯一性参数注册字段集合",trigger: 'change'}
                    ]
                },
                //辅助资料配置
                commonOptionsConfig : {
                    allowRepeat: [
                        {
                            text: '不允许',
                            value: 1
                        },
                        {
                            text: '允许',
                            value: 2
                        }
                    ],
                    bizOptions: [],
                    bizSubOptions: [],
                    billOptions: []
                },
                //表单
                formData: {
                    id: null,
                    bizId: null,
                    bizSubId:  null,
                    billId:  null,
                    bizDesc:  null,
                    bizArgs:  null,
                    allowRepeat:  1,
                    createTime:  null,
                    createUser:  parseInt(Cookie.get('t8t-tc-uid')),
                    updateTime:  null,
                    updateUser:  parseInt(Cookie.get('t8t-tc-uid'))
                },
                isLoading: false
            }
        },
        props: ['rowId','editType'],
        computed: {
            dialogVisible() {
                return true
            },
            editable() {
                return this.editType === 'see'
            }
        },
        created () {
            //请求所选行的数据
            if (this.rowId) {
                var args = {
                    page: 1,
                    size: 10,
                    search: { id : this.rowId }
                }
                this.loadAllotFormData(args)
            };
            this.getCommonOptions(11010, 'bizOptions');
            this.getCommonOptions(11011, 'bizSubOptions');
            this.getCommonOptions(11605, 'billOptions');
        },
        methods: {
            btnOKClick() {
                this.$refs['payForm'].validate(valid=>{
                    if (valid) {
                        var editType = this.editType
                        if (editType==='add') {
                            this.addDebitWayAllot()
                        }
                        else if (editType==='edit') {
                            this.updateDebitWayAllot()
                        };
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$refs['payForm'].resetFields()
                this.$emit('close')
            },
            addDebitWayAllot() {
                this.isLoading = true
                let args = {
                    bizArgsLicense :this.formData
                }
                apiPreventRepeat.insert(args)
                .then((res) => {
                    this.isLoading = false
                    if (res.data.status === 200 && res.data.result > 0) {
                        this.$refs['payForm'].resetFields();
                        this.$emit('close')
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '新增成功',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.$emit('getTableData')
                    }
                    else {
                        this.isLoading = false
                        this.$message.error(res.data.message)
                    }
                })
            },
            updateDebitWayAllot() {
                this.isLoading = true
                this.formData.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                let args = {
                    bizArgsLicense :this.formData
                }
                apiPreventRepeat.update(args)
                .then((res) => {
                    this.isLoading = false
                    if (res.data.status === 200 && res.data.result ===1) {
                        this.$refs['payForm'].resetFields();
                        this.$emit('close')
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '编辑成功',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.$emit('getTableData')
                    }
                    else {
                        this.isLoading = false
                        this.$message.error(res.data.message)
                    }
                })
            },
            loadAllotFormData(args) {
                apiPreventRepeat.queryPage(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        this.formData =  res.data.result.rows[0]
                    }
                })
            },
            //辅助资料
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 200
                }
                let list = []
                apiCommon.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            };
                        })
                        this.commonOptionsConfig[selectName] = list
                    }
                })
            }
        }
    }

</script>

<style lang="css" scoped>
</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
.prevent-repeat-dialog .el-dialog{
    width: 450px;
}
.el-select-dropdown__wrap {
    max-height: 185px !important;
}
.prevent-repeat-dialog .el-form-item__content {
    width: 250px;
}
.prevent-repeat-dialog .el-select {
    width: 100%;
}
</style>
