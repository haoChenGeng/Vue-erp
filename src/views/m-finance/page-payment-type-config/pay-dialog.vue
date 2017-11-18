<template>
    <div>
        <el-dialog title="付款方式配置" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition"
                     :model="formData"
                     :label-width="formLabelWidth"
                     :rules="rules"
                     ref="payForm"
                     @keyup.enter.native="btnOKClick()">
                <el-form-item label="编码">
                    <el-input v-model="formData.remitTypeCode" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="付款类型" prop="remitTypeId">
                    <el-select v-model="formData.remitTypeId" :disabled="rowId!==null" placeholder="--请选择--" @change="changeRemitType">
                        <el-option v-for="item in remitTypeList" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessTypeId">
                    <el-select v-model="formData.businessTypeId" :disabled="editable" placeholder="--请选择--" >
                        <el-option v-for="item in businessTypeIdList" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款对象" prop="payObjectId">
                    <el-select v-model="formData.payObjectId" :disabled="editable" placeholder="--请选择--" >
                        <el-option v-for="item in payObjectIdList" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
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
    import apiPayMethod from 'src/services/finance/payTypeConfig.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import * as config from './config'
    export default {
        name: 'pay-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: config.rules,
                //辅助资料配置
                businessTypeIdList: [],
                remitTypeList: [],
                payObjectIdList: [],
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
            this.formData.remitTypeCode = null;
            //请求所选行的数据
            if (this.rowId) {
                var args = {
                    id : this.rowId
                }
                this.loadPayMethodsFormData(args)
            };
            //请求辅助资料配置
            this.getCommonOptions('61006','remitTypeList');//付款类型
            this.getCommonOptions('11008','businessTypeIdList');//付款类型
            this.getCommonOptions('61004','payObjectIdList');//浮夸计划
        },
        methods: {
            changeRemitType(value) {
                for(let i = 0; i < this.remitTypeList.length;i++) {
                    if (value === this.remitTypeList[i].value) {
                        this.formData.name = this.remitTypeList[i].label
                        this.formData.remitTypeCode = this.remitTypeList[i].propertyCode
                    }
                }
            },
            btnOKClick() {
                this.$refs['payForm'].validate(valid=>{
                    if (valid) {
                        var formData = Object.assign({},this.formData)
                        var editType = this.editType
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
                var remitType = formData
                this.isLoading = true
                //发起请求,提交表单
                apiPayMethod.create({remitType})
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
                var remitType = formData
                this.isLoading = true
                //发起请求,提交表单
                apiPayMethod.update({remitType})
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
                }else {
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
