<template>
    <div>
        <el-dialog :title="title" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form @validate="myValidate" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="单据类型：" prop="name">
                    <el-input v-model="data.groupName" disabled></el-input>
                </el-form-item>
                <el-form-item label="分组维度1-类别：" prop="type">
                    <el-select
                        v-model="formData.type"
                        filterable
                        clearable
                        :allow-create="false"
                        @change="getQuotation"
                        placeholder="请选择类别">
                        <el-option
                            v-for="item in typeList"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分组维度1-值：" prop="groupAssistId">
                    <el-select
                        v-model.number="formData.groupAssistId"
                        filterable
                        :allow-create="false"
                        @change="changeValue"
                        placeholder="请选择">
                        <el-option
                            v-for="item in valueList"
                            :label="item.text"
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
    import commonApi from 'src/services/commonApi/commonApi.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'group-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    type: [
                        {type: 'string',required: true , message: "请选择类别",trigger: 'change'},
                    ],
                    groupAssistId: [
                        {type: 'integer',required: true , message: "请选择分组维度-值",trigger: 'change'},
                    ],
                    groupCode: [
                        {type: 'string',required: true , message: "请填写分组编码",trigger: 'change'}
                    ]
                },
                //表单
                formData: {
                    type: '',
                    groupAssistId: null,
                    groupCode:''
                },
                typeList:[],
                valueList:[],
                isLoading: false
            }
        },
        props: ['data','editType','title'],
        computed: {
            dialogVisible() {
                return true
            }
        },
        created () {
            let arg =  {
                page: 1,
                search: {
                    pPropertyCode: 416
                },
                size: 100
            }
            let list = []
            commonApi.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item.propertyCode,
                                    text: item.propertyName
                                })
                            }
                        });
                        this.typeList = list;
                        //this.commonOptionsConfig[selectName].unshift({value:0,text: '请选择'});
                    }
                })
        },
        methods: {
            btnOKClick() {
                this.$refs['form'].validate(valid=>{
                    if (valid) {
                        let formData = Object.assign({},this.formData)
                        formData.createUser = +Cookie.get('t8t-tc-uid')
                        formData.parentId = this.data.id;
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
            getQuotation (code){
                this.formData.groupAssistIdList = [];
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: code
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            });
                            this.valueList = list;
                            //this.commonOptionsConfig[selectName].unshift({value:0,text: '请选择'});
                        }
                    })
            },
            changeValue(data) {
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
