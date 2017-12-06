<template>
    <div>
        <el-dialog :title="title" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form @validate="myValidate" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="单据类型：" prop="groupAssistId">
                    <el-select
                        v-model.number="formData.groupAssistId"
                        filterable
                        :allow-create="false"
                        @change="getQuotation"
                        placeholder="请选择单据类型">
                        <el-option
                            v-for="item in billType"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分组编码：" prop="groupCode">
                    <el-input v-model="formData.groupCode"></el-input>
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
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'group-dialog-top',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    groupAssistId: [
                        {type: 'integer',required: true , message: "请选择单据类型",trigger: 'change'}
                    ],
                    groupCode: [
                        {type: 'string',required: true , message: "请填写分组编码",trigger: 'change'}
                    ]
                },
                //表单
                formData: {
                    groupAssistId:  null,
                    groupCode:''
                },
                isLoading: false,
                billType: []
            }
        },
        props: ['editType','title'],
        computed: {
            dialogVisible() {
                return true
            }
        },
        created () {
            let _this = this;
            TemplateOperator.groupBillTypeList({})
                .then((res) => {
                    if(res.data.status === 200){
                        let rows = res.data.result;
                        rows.forEach(function(item){
                            _this.billType.push({label:item.propertyName, value:item.id });
                        });
                    }
                });
        },
        methods: {
            btnOKClick() {
                this.$refs['form'].validate(valid=>{
                    if (valid) {
                        let formData = Object.assign({},this.formData)
                        formData.createUser = +Cookie.get('t8t-tc-uid')
                        formData.parentId = 0;
                        TemplateOperator.groupCreate({group:formData})
                            .then((res) => {
                                if (res.data.status === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    })
                                    this.btnCancleClick()
                                    this.$emit('getTree')
                                }else{
                                    this.$message({
                                        type: 'error',
                                        message: res.data.message
                                    })
                                }
                            })
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$refs['form'].resetFields()
                this.$emit('close')
            },
            getQuotation (data){
                this.formData.groupAssistIdList = data;
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
