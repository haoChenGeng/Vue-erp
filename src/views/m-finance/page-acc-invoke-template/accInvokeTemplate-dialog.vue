<template>
    <div>
        <el-dialog title="业务调用模板" class="accInvokeTemplate-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="invokeTempForm" @keyup.enter.native="btnOKClick()">
                <el-form-item label="业务模块" prop="businessModuleCode">
                    <el-select v-model="formData.businessModuleCode" :disabled="editable" placeholder="--请选择--" >
                        <el-option v-for="item in commonOptionsConfig.businessModuleCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="有无单据" prop="hasOrder">
                    <el-select v-model="formData.hasOrder" :disabled="editable" placeholder="--请选择--">
                        <el-option v-for="item in commonOptionsConfig.hasOrder" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单据类型" prop="orderTypeCode">
                    <el-select v-model="formData.orderTypeCode" filterable :disabled="this.formData.hasOrder === 1 ? false : true" placeholder="--请选择--">
                        <el-option v-for="item in commonOptionsConfig.orderTypeCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户类型" prop="userTypeCode">
                    <el-select v-model="formData.userTypeCode" placeholder="--请选择--" :disabled="editable" @change="userTypeCodeChange">
                        <el-option v-for="item in commonOptionsConfig.userTypeCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账户类型" prop="accountTypeName">
                    <el-select v-model="formData.accountTypeName" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.accountTypeName" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收支类型" prop="recordChildTypeCode">
                    <el-select v-model="formData.recordChildTypeCode" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.recordChildTypeCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="来源单位" prop="sourceUnitCode">
                    <el-select v-model="formData.sourceUnitCode" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.sourceUnitCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转换比例">
                    <el-col :span="8">
                        <el-form-item prop="convertRateChildren">
                            <el-input v-model.number="formData.convertRateChildren" style="width:33%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="text-align: center;">:</el-col>
                    <el-col :span="8">
                        <el-form-item prop="convertRateParent">
                            <el-input v-model.number="formData.convertRateParent" style="width:33%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="用户类型" prop="userTypeCodeEty">
                    <el-select v-model="formData.userTypeCodeEty" placeholder="--请选择--" :disabled="editable"@change="userTypeCodeChangeEty">
                        <el-option v-for="item in commonOptionsConfig.userTypeCodeEty" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账户类型" prop="accountTypeNameEty">
                    <el-select v-model="formData.accountTypeNameEty" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.accountTypeNameEty" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收支类型" prop="recordChildTypeCodeEty">
                    <el-select v-model="formData.recordChildTypeCodeEty" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.recordChildTypeCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="来源单位" prop="sourceUnitCodeEty">
                    <el-select v-model="formData.sourceUnitCodeEty" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.sourceUnitCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转换比例">
                    <el-col :span="8">
                        <el-form-item prop="convertRateChildrenEty">
                            <el-input v-model.number="formData.convertRateChildrenEty" style="width:33%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="text-align: center;">:</el-col>
                    <el-col :span="8">
                        <el-form-item prop="convertRateParentEty">
                            <el-input v-model.number="formData.convertRateParentEty" style="width:33%"></el-input>
                        </el-form-item>
                    </el-col>
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
    import apiAccInvokeTemplate from 'src/services/finance/apiAccInvokeTemplate.js'
    import apiAccAccountConfig from 'src/services/finance/accAccountConfig.js'

    export default {
        name: 'accInvokeTemplate-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                //辅助资料配置
                commonOptionsConfig: {
                    //辅助资料配置
                    businessModuleCode:[],
                    userTypeCode:[],
                    orderTypeCode:[],
                    accountTypeName:[],
                    recordChildTypeCode:[],
                    sourceUnitCode:[],
                    userTypeCodeEty:[],
                    accountTypeNameEty:[],
                    recordChildTypeCodeEty:[],
                    sourceUnitCodeEty:[],

                    recordType: [
                        {value: 1, text: '收入'},
                        {value: 2, text: '支出'}
                    ],
                    hasOrder: [
                        {value: 1, text: '有'},
                        {value: 2, text: '无'}
                    ]
                },
                //表单
                formData: {
                    businessModuleCode: null,
                    hasOrder: null,
                    orderTypeCode: null,
                    userTypeCode: null,
                    accountTypeName: null,
                    recordChildTypeCode: null,
                    sourceUnitCode: null,
                    convertRateChildren: null,
                    convertRateParent: null,
                    userTypeCodeEty: null,
                    accountTypeNameEty: null,
                    recordChildTypeCodeEty: null,
                    sourceUnitCodeEty: null,
                    convertRateChildrenEty: null,
                    convertRateParentEty: null,
                    createUser: parseInt(Cookie.get('t8t-tc-uid')),
                    createBy: Cookie.get('t8t-tc-username'),
                    createName: Cookie.get('t8t-tc-username'),
                    createTime:  null,
                    updateTime:  null,
                    updateUser:  null
                },
                isLoading: false
            }
        },
        props: ['rowId','editType'],
        computed: {
            rules() {
                return {
                    businessModuleCode: [
                        {type: "string", required: true, message: "请选择业务模块", trigger: 'change'}
                    ],
                    hasOrder: [
                        {type: "number", required: true, message: "请选择有无单据", trigger: 'change'}
                    ],
                    orderTypeCode: [
                        {
                            type: "string",
                            required: this.formData.hasOrder === 1 ? true : false,
                            message: "请选择单据类型",
                            trigger: 'change'
                        }
                    ],
                    userTypeCode: [
                        {type: "string", required: true, message: "请选择用户类型", trigger: 'change'}
                    ],
                    accountTypeName: [
                        {type: "string", required: true, message: "请选择账户类型", trigger: 'change'}
                    ],
                    recordChildTypeCode: [
                        {type: "string", required: true, message: "请选择收支类型", trigger: 'change'}
                    ],
                    sourceUnitCode: [
                        {type: "string", required: true, message: "请选择来源单位", trigger: 'change'}
                    ],
                    convertRateChildren: [
                        {
                            type: 'integer',
                            required: true,
                            min: 1,
                            transform (val) {
                                return +val;
                            },
                            message: '请输入正整数'
                        }
                    ],
                    convertRateParent: [
                        {
                            type: 'integer',
                            required: true,
                            min: 1,
                            transform (val) {
                                return +val;
                            },
                            message: '请输入正整数'
                        }
                    ],

                    userTypeCodeEty: [
                        {type: "string", required: false, message: "请选择用户类型", trigger: 'change'}
                    ],
                    accountTypeNameEty: [
                        {type: "string", required: this.formData.userTypeCodeEty !== null ? true : false, message: "请选择账户类型", trigger: 'change'}
                    ],
                    recordChildTypeCodeEty: [
                        {type: "string", required: this.formData.userTypeCodeEty !== null ? true : false, message: "请选择收支类型", trigger: 'change'}
                    ],
                    sourceUnitCodeEty: [
                        {type: "string", required: this.formData.userTypeCodeEty !== null ? true : false, message: "请选择来源单位", trigger: 'change'}
                    ],
                    convertRateChildrenEty: [
                        {
                            required: this.formData.userTypeCodeEty !== null ? true : false,
                            message: '不能为空'
                        },
                        {
                            type: 'integer',
                            min: this.formData.userTypeCodeEty !== null ? 1 : 0,
                            transform (val) {
                                return +val;
                            },
                            message: '请输入正整数'
                        }
                    ],
                    convertRateParentEty: [
                        {
                            required: this.formData.userTypeCodeEty !== null ? true : false,
                            message: '不能为空'
                        },
                        {
                            type: 'integer',
                            min: this.formData.userTypeCodeEty !== null ? 1 : 0,
                            transform (val) {
                                return +val;
                            },
                            message: '请输入正整数'
                        }
                    ]
                }
            },
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
                    id : this.rowId
                }
                this.loadConfigsFormData(args)
            };

            //获取辅助资料配置
            // 业务模块
            this.getCommonOptions('1!110!11011!', 'businessModuleCode')
            //单据类型
            this.getCommonOptions('2!116!11605!', 'orderTypeCode')
            //用户类型
            this.getUseTypes()
            //单位类型
            this.getCommonOptions('6!610!61018!', 'sourceUnitCode')
            //收支类型
            this.getCommonOptions('6!610!61017!', 'recordChildTypeCode')
        },
        methods: {
            changeCodeDisabled(value) {
                for(let i = 0;i<this.recordTypeName.length;i++) {
                    if (this.recordTypeName[i].value==value) {
                        this.formData.recordTypeCode = this.recordTypeName[i].propertyCode
                        return
                    }
                }
            },
            changeReverseCodeDisabled(value) {
                for(let i = 0;i<this.reverseRecordTypeName.length;i++) {
                    if (this.reverseRecordTypeName[i].value==value) {
                        this.formData.reverseRecordTypeCode = this.reverseRecordTypeName[i].propertyCode
                        return
                    }
                }
            },
            userTypeCodeChange(val){
                this.getAccountTypeByUserType(val,'accountTypeName')
            },
            userTypeCodeChangeEty(val){
                this.getAccountTypeByUserType(val,'accountTypeNameEty')
            },
            btnOKClick() {
                this.$refs['invokeTempForm'].validate(valid=>{
                    if (valid) {
                        var formData = Object.assign({},this.formData)
                        var editType = this.editType

                        if (editType==='add') {
                            this.addConfigsMethods(formData)
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
                this.$refs['invokeTempForm'].resetFields();
                this.$emit('close')
            },
            //提交新增
            addConfigsMethods(formData){
                var recordTypeConfig = formData
                this.isLoading = true
                //发起请求,提交表单
                let InvokeTemplateRouteCreateDTO = []
                InvokeTemplateRouteCreateDTO.push({
                    userTypeCode: this.formData.userTypeCode,
                    accountTypeName: this.formData.accountTypeName,
                    recordChildTypeCode: this.formData.recordChildTypeCode,
                    sourceUnitCode: this.formData.sourceUnitCode,
                    convertRateChildren: this.formData.convertRateChildren,
                    convertRateParent: this.formData.convertRateParent
                });
                if(this.formData.userTypeCodeEty !== null){
                    InvokeTemplateRouteCreateDTO.push({
                        userTypeCode: this.formData.userTypeCodeEty,
                        accountTypeName: this.formData.accountTypeNameEty,
                        recordChildTypeCode: this.formData.recordChildTypeCodeEty,
                        sourceUnitCode: this.formData.sourceUnitCodeEty,
                        convertRateChildren: this.formData.convertRateChildrenEty,
                        convertRateParent: this.formData.convertRateParentEty
                    });
                }
                let addArgs={
                    invokeTemplateCreateDTO: {
                        businessModuleCode: this.formData.businessModuleCode,
                        orderTypeCode: this.formData.orderTypeCode,
                        createUser: this.formData.createUser,
                        createBy: this.formData.createBy,
                        createName: this.formData.createName,
                        invokeTemplateRouteDTOs: InvokeTemplateRouteCreateDTO
                    }
                }
                apiAccInvokeTemplate.createConfig(addArgs)
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result ===1) {
                            //隐藏正在加载
                            this.isLoading = false
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
                var recordTypeConfig = formData
                this.isLoading = true
                //发起请求,提交表单
                apiAccInvokeTemplate.updateConfig({recordTypeConfig})
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result ===1) {
                            //隐藏正在加载
                            this.isLoading = false
                            this.$refs['invokeTempForm'].resetFields();
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
            loadConfigsFormData(args) {
                apiAccInvokeTemplate.findById(args)
                    .then((res) => {
                        if (res.data.status === 200) {
                            var rowData = res.data.result.rows[0];
                            rowData.recordTypeCode = rowData.recordTypeCode
                            this.formData =  rowData
                        }
                    })
            },

            //辅助资料
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    fields: [
                        "id",
                        "propertyName",
                        "propertyCode",
                        "propertyStatus",
                        "wholeCode"
                    ],
                    page: 1,
                    search: {
                        wholeCode_like: fatherCode
                    },
                    size: 1000
                }
                let list = []
                apiCommon.queryPage(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.rows.forEach((item) => {
                                //启用
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.wholeCode,
                                        text: item.propertyName
                                    })
                                };
                            })
                            this.commonOptionsConfig[selectName] = list
                        }
                    })
            },

            getAccountTypeByUserType(parentUserTypeCode,selectName){
                let arg =  {
                    userTypeCode: parentUserTypeCode
                }
                let list = []
                apiAccAccountConfig.getAccountTypeByUserType(arg).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.name,
                                text: item.name
                            })
                        })
                        this.commonOptionsConfig[selectName] = list
                    }
                })
            },

            //用户类型
            getUseTypes(){
                let list = []
                apiAccAccountConfig.getUserType().then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.code,
                                text: item.name
                            })
                        })
                        this.commonOptionsConfig['userTypeCode'] = list
                        this.commonOptionsConfig['userTypeCodeEty'] = list
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
    .accInvokeTemplate-dialog .el-dialog{
        width: 450px;
    }
    .el-select-dropdown__wrap {
        max-height: 185px !important;
    }
    .accInvokeTemplate-dialog .el-form-item__content {
        width: 250px;
    }
    .accInvokeTemplate-dialog .el-select {
        width: 100%;
    }
</style>
