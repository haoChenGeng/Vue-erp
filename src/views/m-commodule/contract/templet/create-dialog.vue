<template>
    <div>
        <el-dialog title="创建编码规则" class="create-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :label-width="formLabelWidth" :rules="rules" ref="createForm" @keyup.enter.native="btnOKClick()">
                <el-form-item label="类型" prop="codeType">
                    <el-select v-model="formData.codeType " placeholder="--请选择--" @change="changeCodeDisabled">
                        <el-option >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别段" prop="codeTypeDuan">
                    <el-input v-model="formData.codeTypeDuan"></el-input>
                </el-form-item>
                <el-form-item label="时间段" prop="timeDuan">
                    <el-select v-model="formData.timeDuan" :disabled="editable" placeholder="--请选择--" @change="changeOrganizationName">
                        <el-option >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="初始值" prop="initalValue">
                    <el-input>  </el-input>
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
    import apiCommon from 'src/services/commonApi/commonApi.js'
    export default {
        name: 'create-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                isLoading: false,
                rules: {
                    codeType: [
                        {required: true , message: "请选择类型"}
                    ],
                    codeTypeDuan: [
                        {required: true , message: "请输入类别段"}
                    ],
                    timeDuan: [
                        {required: true , message: "请选择时间段"}
                    ],
                    initalValue: [
                        {required: true , message: "请输入类型"}
                    ]
                },
                //辅助资料配置
                organizationCode: [],
                //表单
                formData: {
                    codeType: null,
                    codeTypeDuan : null,
                    timeDuan: null,
                    initalValue: null,
                },
            }
        },
        computed: {
            dialogVisible() {
                return true
            },
        },
        created() {
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
            changeOrganizationName(value) {
                for(let i = 0; i < this.organizationCode.length;i++) {
                    if (value===this.organizationCode[i].value) {
                        this.formData.organizationName = this.organizationCode[i].text
                    };
                }
            },
            btnOKClick(createForm) {
                this.$refs['createForm'].validate(valid=>{
                    if (valid) {
                        this.isLoading = true
                        var formData = Object.assign({},this.formData)
                        var editType = this.editType
                        formData.channelType = parseInt(formData.channelType)
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$refs['createForm'].resetFields();
                this.$emit('close')
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

.create-dialog .el-dialog__header
{
    padding: 30px 20px 20px;
    text-align: center;
}
.create-dialog .el-dialog{
    width: 450px;
}
.el-dialog--small
{
}
.create-dialog .el-form-item__content {
    width: 250px;
}
.create-dialog .el-select {
    width: 100%;
}
.create-dialog .el-input {
    width: 100%;
}
</style>
