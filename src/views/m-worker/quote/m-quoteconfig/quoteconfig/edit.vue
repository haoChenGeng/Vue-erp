<template>
    <div>
        <el-dialog :title="title" class="pay-dialog g-w-640" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form @validate="myValidate" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="报价项名称：" prop="qiName">
                    <el-input
                    v-model="formData.qiName"
                    maxlength="50"
                    minlength="1"
                    ></el-input>
                </el-form-item>

                <el-form-item label="单位：" prop="qiUnit">
                    <el-select v-model="formData.qiUnit" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.qiUnit" :label="item.text" :value="item.text">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="报价项类型：" prop="qiType">
                    <el-select v-model="formData.qiType" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.qiTypes" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="工艺详情" prop="craftDetails">
                    <el-input
                      type="textarea"
                      :autosize="{minRows: 10, maxRows: 15}"
                      placeholder="请输入内容"
                      maxlength="300"
                      minlength="1"
                      v-model="formData.craftDetails">
                    </el-input>
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
    import TemplateOperator from 'src/services/worker/quoteconfig/base-method.js'
    import Cookie from 'js-cookie'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    export default {
        name: 'edit',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    qiName: [
                        {required: true ,whitespace:true, message: "请填写名称",trigger: 'change'},
                    ],
                    qiUnit: [
                        { required: true , message: "请填写单位",trigger: 'change'},
                    ],
                    qiType: [
                        { required: true , message: "请选择报价项类型",trigger: 'change', type:'number'},
                    ],
                    craftDetails: [
                        { required: true ,whitespace:true, message: "请填写工艺详情",trigger: 'change'},
                    ],

                },

                 //辅助资料配置
                commonOptionsConfig : {
                    qiUnit: [],
                    qiTypes:[],

                },
                //表单
                formData: {
                    id: null,
                    qiName: '',
                    qiUnit:  '',
                    qiType:  '',
                    craftDetails:  '',
                },
                isLoading: false,
            }
        },
        props: ['rowId','editType','title'],
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

            this.getCommonOptions('30002','qiUnit')//单位
            this.getCommonOptions('30005','qiTypes')//报价项类型
            if (this.rowId) {
                var args = {
                    search: { id : this.rowId }
                };
                this.loadFormData(args)
            }
        },
        methods: {
            btnOKClick() {
                this.$refs['form'].validate(valid=>{
                    if (valid) {
                        var formData = Object.assign({},this.formData)
                        //formData.effectTime = +Date.parse(formData.effectTime).toString().substr(0,10)
                        var editType = this.editType
                        if (editType==='add') {
                            formData.createUser = +Cookie.get('t8t-tc-uid')
                            formData.qiStatus = 0

                            debugger
                            TemplateOperator.create({quoteItem:formData})
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        this.$message({
                                            type: 'success',
                                            message: '新增成功！'
                                        })
                                        this.btnCancleClick()
                                        this.$emit('getTableData')
                                    }else{
                                        this.$message({
                                            type: 'error',
                                            message: res.data.result
                                        })
                                    }
                                })
                        }
                        else if (editType==='edit') {
                            formData.updateUser = +Cookie.get('t8t-tc-uid')
                            TemplateOperator.update({quoteItem:formData})
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        this.$message({
                                            type: 'success',
                                            message: '编辑成功！'
                                        })
                                        this.btnCancleClick()
                                        this.$emit('getTableData')
                                    }else{
                                        this.$message({
                                            type: 'error',
                                            message: res.data.result
                                        })
                                    }
                                })
                        }
                    }
                    else {
                        return false
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
            },


            btnCancleClick() {
                this.$refs['form'].resetFields()
                this.$emit('close')
            },
            loadFormData(args) {
                TemplateOperator.queryModuleQuotaionById(args)
                .then((res) => {
                    if (res.data.status === 200) {

                        this.formData =  res.data.result[0]
                    }
                })
            },
            myValidate () {
                alert(111);
            },
            getQuotation (data){
                this.formData.quotationIds = data;
            }
        }
    }

</script>

<style lang="css" scoped>
</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
.pay-dialog .el-dialog{
    /*width: 450px;*/
}
.el-select-dropdown__wrap {
    max-height: 185px !important;
}
.pay-dialog .el-form-item__content {
    width: 400px;
}
.pay-dialog .el-select {
    width: 100%;
}
</style>
