<template>
    <div>
        <el-dialog title="付款方式配置" class="pay-method-config-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition"
                     :model="formData"
                     :label-width="formLabelWidth"
                     :rules="rules"
                     ref="payForm"
                     @keyup.enter.native="btnOKClick()">
                <el-form-item label="编码">
                    <el-input v-model="formData.remitChannelCode" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="付款方式" prop="remitChannelId">
                    <el-select v-model="formData.remitChannelId" :disabled="rowId!==null" placeholder="--请选择--" @change="changePayMethod">
                        <el-option v-for="item in remitChannelList" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款主体" prop="organizationId">
                    <el-select v-model="formData.organizationId" :disabled="editable" placeholder="--请选择--">
                        <el-option v-for="item in organizationCode" :label="item.label" :value="item.value">
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
                <el-form-item label="开户银行" prop="bankIds">
                    <el-select v-model="formData.bankIds" multiple :disabled="editable" placeholder="--请选择--">
                        <el-option v-for="item in bankList" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对公对私" prop="isPublic">
                    <el-select v-model="formData.isPublic" :disabled="editable" placeholder="--请选择--">
                        <el-option label="对公对私" value="1">
                        </el-option>
                        <el-option label="对公" value="2">
                        </el-option>
                        <el-option label="对私" value="3">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款金额">
                    <el-col :span="8">
                        <el-form-item prop="amountLowerBound">
                            <el-input v-model.number="formData.amountLowerBound" style="width:33%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="text-align: center;">＜X≤</el-col>
                    <el-col :span="8">
                        <el-form-item prop="amountUpperBound">
                            <el-input v-model.number="formData.amountUpperBound" style="width:33%"></el-input>
                        </el-form-item>
                    </el-col>
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
    import Cookie from 'js-cookie'
    import apiPayMethod from 'src/services/finance/payMethodConfig.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import * as config from './config'
    export default {
        name: 'pay-method-config-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: config.rules,
                //辅助资料配置
                organizationCode: [],
                remitChannelList: [],
                bankList: [],
                //表单
                formData: config.formData,
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
            //重置编码
            this.formData.remitChannelCode = null;
            //重置金额（如果填写0 再次新增时有缓存）
            this.formData.amountLowerBound = null;
            this.formData.amountUpperBound = null;
            //请求所选行的数据
            if (this.rowId) {
                var args = {
                    id : this.rowId
                }
                this.loadPayMethodsFormData(args)
            };
            //请求辅助资料配置
            this.getCommonOptions('61005','remitChannelList');//付款方式
            this.getCommonOptions('61101','bankList');//银行列表
            this.getCommonOptions('61007','organizationCode');//付款组织-付款主体
//            apiCommon.queryByFunctionCode({"funcCodes": ["001004013"]})//付款组织
//            .then((res => {
//                    let list = []
//                    if (res.data.status === 200) {
//                        res.data.result.forEach((item) => {
//                            if (item.isDel===0) {
//                                list.push({
//                                    value: item.id,
//                                    label: item.name
//                                })
//                            };
//                        })
//                        this['organizationCode'] = list
//                    }
//                }))
        },
        methods: {
            changePayMethod(value) {
                for(let i = 0; i < this.remitChannelList.length;i++) {
                    if (value === this.remitChannelList[i].value) {
                        this.formData.name = this.remitChannelList[i].label
                        this.formData.remitChannelCode = this.remitChannelList[i].propertyCode
                    }
                }
            },
            btnOKClick() {
                this.$refs['payForm'].validate(valid=>{
                    if (valid) {
                        var formData = Object.assign({},this.formData)
                        var editType = this.editType
                        formData.channelType = parseInt(formData.channelType)
                        formData.isPublic = parseInt(formData.isPublic)
                        formData.bankIds = formData.bankIds.toString();
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
                var remitChannel = formData
                this.isLoading = true
                //发起请求,提交表单
                apiPayMethod.create({remitChannel})
                .then((res) => {
                    if (res.data.status === 200 && res.data.result > 1) {
                        //隐藏正在加载
                        this.isLoading = false
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
            //提交编辑
            updatePayMethods(formData) {
                var remitChannel = formData
                this.isLoading = true
                //发起请求,提交表单
                apiPayMethod.update({remitChannel})
                .then((res) => {
                    if (res.data.status === 200 && res.data.result === 1) {
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
                        this.isLoading = false;
                        this.$message.error(res.data.message)
                    }
                })
            },
            //请求弹窗行的数据
            loadPayMethodsFormData(args) {
                apiPayMethod.findByIdNames(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        var rowData = res.data.result;
                        rowData.channelType = rowData.channelType.toString()
                        rowData.isPublic = rowData.isPublic.toString()
                        var bankIdsArr = rowData.bankIds.split(',')
                        var bankIdsInt = [];
                        //字符串数组转化为INT 数组
                        bankIdsArr.forEach(function(data,index,arr){
                            bankIdsInt.push(+data)
                        });
                        rowData.bankIds = bankIdsInt;
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
                                        propertyCode: item.propertyCode,
                                        label: item.propertyName
                                    })
                                };
                            });
                            this[selectName] = list;

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
.pay-method-config-dialog .el-dialog{
    width: 450px;
}
.el-select-dropdown__wrap {
    max-height: 185px !important;
}
.pay-method-config-dialog .el-form-item__content {
    width: 250px;
}
.pay-method-config-dialog .el-select {
    width: 100%;
}
</style>
