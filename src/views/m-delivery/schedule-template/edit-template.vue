<template>
    <div>
        <el-dialog :title="title" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="内部工期：" prop="insideSchdule">
                    <el-input v-model.number="formData.insideSchdule">
                        <template slot="append">天</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="外部工期：" prop="outsideSchdule">
                    <el-input v-model.number="formData.outsideSchdule">
                        <template slot="append">天</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="报价模板：" prop="quotationIds">
                    <el-select
                        v-model="formData.quotationIds"
                        multiple
                        filterable
                        :allow-create="false"
                        @change="getQuotation"
                        placeholder="请选择报价模板">
                        <el-option
                            v-for="item in options5"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效日期：" prop="effectTime">
                    <el-date-picker
                        v-model="formData.effectTime"
                        placeholder="生效日期"
                        type="datetime"
                    >
                    </el-date-picker>
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
        name: 'edit-template',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    name: [
                        {required: true , message: "请填写名称",trigger: 'change'},
                    ],
                    insideSchdule: [
                        { type: 'number', required: true , message: "请填写内部工期",trigger: 'change'},
                    ],
                    outsideSchdule: [
                        {type: 'number',required: true , message: "请填写外部工期",trigger: 'change'},
                    ],
                    quotationIds: [
                        {type: 'array',required: true , message: "请选择报价模板",trigger: 'change'},
                    ],
                    effectTime: [
                        {type :'date' ,required: true , message: "请选择生效日期",trigger: 'change'},
                    ],
                },
                //表单
                formData: {
                    id: null,
                    name: '',
                    insideSchdule:  '',
                    outsideSchdule:  '',
                    quotationIds:  [],
                    effectTime:  '',
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
                this.queryQuoteList({page:1,size:200,moduleId:this.rowId});
                var args = {
                    page: 1,
                    size: 10,
                    //search: { id : this.rowId }
                    moduleId: this.rowId
                };
                this.loadFormData(args)
            }else{
                this.queryQuoteList({page:1,size:200});
            }
        },
        methods: {
            queryQuoteList(args){
                TemplateOperator.queryQuoteList(args)
                    .then((res) => {
                        if(res.data.status === 200){
                            let rows = res.data.result.rows;
                            if(rows.length){
                                for(let i in rows){
                                    this.options5.push({label:rows[i].tempName, value:rows[i].id });
                                }
                            }
                        }
                    });
            },
            btnOKClick() {
                this.$refs['form'].validate(valid=>{
                    if (valid) {
                        var formData = Object.assign({},this.formData)
                        formData.effectTime = +Date.parse(formData.effectTime).toString().substr(0,10)
                        var editType = this.editType
                        if (editType==='add') {
                            formData.createUser = +Cookie.get('t8t-tc-uid')
                            formData.moduleStatus = 1
                            TemplateOperator.create({module:formData})
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
                                            message: res.data.message
                                        })
                                    }
                                })
                        }
                        else if (editType==='edit') {
                            formData.updateUser = +Cookie.get('t8t-tc-uid')
                            TemplateOperator.update({module:formData})
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
                                            message: res.data.message
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
                        if(res.data.result.effectTime){
                            res.data.result.effectTime = new Date(res.data.result.effectTime * 1000);
                        }
                        this.formData =  res.data.result
                    }
                })
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
