<template>
    <div>
        <el-dialog title="收款方式配置" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :label-width="formLabelWidth" :rules="rules" ref="payForm" @keyup.enter.native="btnOKClick()">
                <el-form-item label="编码">
                    <el-input v-model="formData.codeDisabled" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="收款方式" prop="channelId">
                    <el-select v-model="formData.channelId " :disabled="rowId!==null" placeholder="--请选择--" @change="changeCodeDisabled">
                        <el-option v-for="item in debitChannel" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织" prop="organizationId">
                    <el-select v-model="formData.organizationId" :disabled="editable" placeholder="--请选择--" @change="changeOrganizationName">
                        <el-option v-for="item in organizationCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="channelType">
                    <el-select v-model="formData.channelType" :disabled="editable" placeholder="--请选择--">
                        <el-option label="线上" value="1">
                       </el-option>
                       <el-option label="线下" value="2">
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
    import apiDebitChannel from 'src/services/finance/debitChannel.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    export default {
        name: 'pay-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    codeDisabled: [
                        {required: true , message: "请输入编码",trigger: 'change'}
                    ],
                    channelId: [
                        {type:"number",required: true , message: "请选择收款方式",trigger: 'change'}
                    ],
                    organizationId: [
                        {type:"number",required: true , message: "请选择组织",trigger: 'change'}
                    ],
                    channelType: [
                        {required: true , message: "请选择渠道",trigger: 'change'}
                    ]
                },
                //辅助资料配置
                organizationCode: [],
                debitChannel: [],
                //表单
                formData: {
                    codeDisabled: null,
                    channelId : null,
                    name: 'test',
                    organizationId: null,
                    channelType: null,
                    status: 1,
                    createUser: parseInt(Cookie.get('t8t-tc-uid')),
                    createTime:  null,
                    updateTime:  null,
                    updateUser:  null,
                    organizationName: ''
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
        created() {
            //请求所选行的数据
            if (this.rowId) {
                var args = {
                    page: 1,
                    size: 10,
                    search: { id : this.rowId }
                }
                this.loadPayMethodsFormData(args)
            };

            //请求辅助资料配置
            this.getCommonOptions('61001','debitChannel')//收款方式
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
                    this['organizationCode'] = list
                }
            }))
        },
        methods: {
            changeCodeDisabled(value) {
                for(let i = 0;i<this.debitChannel.length;i++) {
                    if (this.debitChannel[i].value==value) {
                        this.formData.codeDisabled = this.debitChannel[i].propertyCode
                        return
                    }
                }
            },
            changeOrganizationName(value) {
                for(let i = 0; i < this.organizationCode.length;i++) {
                    if (value===this.organizationCode[i].value) {
                        this.formData.organizationName = this.organizationCode[i].text
                    };
                }
            },
            btnOKClick() {
                this.$refs['payForm'].validate(valid=>{
                    if (valid) {
                        var formData = Object.assign({},this.formData)
                        var editType = this.editType
                        formData.channelType = parseInt(formData.channelType)

                        if (editType==='add') {
                            this.addPayMethods(formData)
                        }
                        else if (editType==='edit') {
                            formData.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                            this.updatePayMethods(formData)
                        }
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$refs['payForm'].resetFields();
                this.$emit('close')
            },
            //提交新增
            addPayMethods(formData){
                var debitChannel = formData
                this.isLoading = true
                //发起请求,提交表单
                apiDebitChannel.create({debitChannel})
                .then((res) => {
                    if (res.data.status === 200 && res.data.result ===1) {
                        //隐藏正在加载
                        this.isLoading = false
                        //this.$refs['payForm'].resetFields();
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
            //提交编辑
            updatePayMethods(formData) {
                var debitChannel = formData
                this.isLoading = true
                //发起请求,提交表单
                apiDebitChannel.update({debitChannel})
                .then((res) => {
                    if (res.data.status === 200 && res.data.result ===1) {
                        //隐藏正在加载
                        this.isLoading = false
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
                       this.$message.error(res.data.message)
                    }
                })
            },
            //请求弹窗行的数据
            loadPayMethodsFormData(args) {
                apiDebitChannel.queryPage(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        var rowData = res.data.result.rows[0];
                        rowData.channelType = rowData.channelType.toString()
                        rowData.codeDisabled = rowData.code
                        this.formData =  rowData
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
                                    text: item.propertyName,
                                    propertyCode: item.propertyCode
                                })
                            };
                        })
                        this[selectName] = list
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
.pay-dialog .el-select-dropdown__wrap {
    max-height: 185px !important;
}
.pay-dialog .el-form-item__content {
    width: 250px;
}
.pay-dialog .el-select {
    width: 100%;
}
</style>
