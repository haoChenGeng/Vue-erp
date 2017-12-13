<template>
    <div>
        <el-dialog :title="title" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form @validate="myValidate" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="产品包名称：" prop="pkgName">
                    <el-input
                    v-model="formData.pkgName"
                    maxlength="50"
                    minlength="1"
                    >
                    </el-input>
                </el-form-item>


                <el-form-item label="业务类型：" prop="bizType">
                    <el-select v-model="formData.bizType" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.bizType" :label="item.text" :value="item.value">
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
    import TemplateOperator from 'src/services/worker/productpackage/base-method.js'
    import Cookie from 'js-cookie'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    export default {
        name: 'edit',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    pkgName: [
                        {required: true ,whitespace:true, message: "请填写名称",trigger: 'change'},
                    ],
                    bizType: [
                        {type: "number", required: true , message: "请选择业务类型",trigger: 'change'},
                    ],

                },
                //辅助资料配置
                commonOptionsConfig : {
                    bizType: [],

                },

                //表单
                formData: {
                    id: null,
                    bizType: null,
                    pkgName:null,

                },
                isLoading: false,
                options5: []
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

            if (this.rowId) {
                this.queryQuoteList({page:1,size:20,search: { id : this.rowId }});
                var args = {
                    search: { id : this.rowId }
                };
                this.loadFormData(args)
                 //请求辅助资料配置
                this.getCommonOptions('11008','bizType')//业务类型

            }else{
                this.queryQuoteList({page:1,size:20});
                this.getCommonOptions('11008','bizType')//业务类型
            }
        },
        methods: {
            queryQuoteList(args){
                TemplateOperator.moduleItemQueryPage(args)
                    .then((res) => {
                        if(res.data.status === 200){
                            let rows = res.data.result.rows;
                            if(rows.length){
                                for(let i in rows){
                                    this.options5.push({label:rows[i].mouldName, value:rows[i].id });
                                }
                            }
                        }
                    });
            },
            btnOKClick() {
                this.$refs['form'].validate(valid=>{
                    if (valid) {
                        var formData = Object.assign({},this.formData)
                        //formData.effectTime = +Date.parse(formData.effectTime).toString().substr(0,10)
                        var editType = this.editType
                        if (editType==='add') {
                            formData.createUser = +Cookie.get('t8t-tc-uid')

                            TemplateOperator.create({productPackage:formData})
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
                            TemplateOperator.update({productPackage:formData})
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
