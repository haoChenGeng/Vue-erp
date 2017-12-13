<template>
    <div>
        <el-dialog title="收款方式分配" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="payForm" @keyup.enter.native="btnOKClick()">
                <el-form-item label="业务类型：" prop="businessTypeId">
                    <el-select v-model="formData.businessTypeId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.businessTypeCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款对象：" prop="debitObjectId">
                    <el-select v-model="formData.debitObjectId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.debitObjectCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款类型：" prop="debitTypeCodeId">
                    <el-select v-model="formData.debitTypeCodeId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.debitTypeCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织：" prop="organizationId">
                    <el-select v-model="formData.organizationId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.organizationCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款方式：" prop="channelId">
                    <el-select v-model="formData.channelId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.debitChannelCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
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
    import apiDebitWayDistribution from 'src/services/finance/debitWayDistribution.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    export default {
        name: 'pay-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    businessTypeId: [
                        {type: "number",required: true , message: "请选择业务类型",trigger: 'change'}
                    ],
                    debitObjectId: [
                        {type: "number",required: true , message: "请选择收款对象",trigger: 'change'}
                    ],
                    debitTypeCodeId: [
                        {type: "number",required: true , message: "请选择收款类型",trigger: 'change'}
                    ],
                    channelId: [
                        {type: "number",required: true , message: "请选择收款方式",trigger: 'change'}
                    ],
                    organizationId: [
                        {type: "number",required: true , message: "请选择组织",trigger: 'change'}
                    ]
                },
                //辅助资料配置
                commonOptionsConfig : {
                    businessTypeCode: [],
                    debitTypeCode: [],
                    debitObjectCode: [],
                    organizationCode: [],
                    debitChannelCode: []
                },
                //表单
                formData: {
                    id: null,
                    businessTypeId: null,
                    debitObjectId:  null,
                    debitTypeCodeId:  null,
                    organizationId:  null,
                    channelId:  null,
                    status:  1,
                    createTime:  null,
                    createUser:  parseInt(Cookie.get('t8t-tc-uid')),
                    updateTime:  null,
                    updateUser:  null
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
            //请求辅助资料配置
            this.getCommonOptions('11008','businessTypeCode')//业务类型
            this.getCommonOptions('61002','debitTypeCode')//收款类型
            this.getCommonOptions('61004','debitObjectCode')//收款对象
            // this.getCommonOptions('002002','organizationCode')//组织
            // 组织 allen.yao
            apiCommon.queryByFunctionCode({"funcCodes":["001004013","001004014"]})
            .then((res => {
                let list = []
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        if (item.isDel===0) {
                            list.push({
                                value: item.id,
                                text: item.name
                            })
                        };
                    })
                    this.commonOptionsConfig['organizationCode'] = list
                }
            }))
            this.getCommonOptions('61001','debitChannelCode')//收款方式
        },
        methods: {
            btnOKClick() {
                this.$refs['payForm'].validate(valid=>{
                    if (valid) {
                        var formData = Object.assign({},this.formData)
                        var editType = this.editType

                        if (editType==='add') {
                            this.addDebitWayAllot(formData)
                        }
                        else if (editType==='edit') {
                            formData.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                            this.updateDebitWayAllot(formData)
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
            addDebitWayAllot(debitWayDistribution) {
                this.isLoading = true
                apiDebitWayDistribution.create({debitWayDistribution})
                .then((res) => {
                    this.isLoading = false
                    if (res.data.status === 200 && res.data.result ===1) {
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
            updateDebitWayAllot(debitWayDistribution) {
                this.isLoading = true
                apiDebitWayDistribution.update({debitWayDistribution})
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
                apiDebitWayDistribution.queryPage(args)
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
                    size: 100
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
.pay-dialog .el-dialog{
    width: 450px;
}
.el-select-dropdown__wrap {
    max-height: 185px !important;
}
.pay-dialog .el-form-item__content {
    width: 250px;
}
.pay-dialog .el-select {
    width: 100%;
}
</style>
