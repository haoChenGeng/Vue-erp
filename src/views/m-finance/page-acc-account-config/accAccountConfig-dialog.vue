<template>
    <div>
        <el-dialog title="基础账户配置" class="accAccountConfig-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="accConfigForm" @keyup.enter.native="btnOKClick()">
                <el-form-item label="用户类型" prop="userTypeCode">
                    <el-select v-model="formData.userTypeCode" placeholder="--请选择--" :disabled="this.isHasAccount===true">
                        <el-option v-for="item in commonOptionsConfig.userTypeCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账户类型" prop="accountTypeName">
                    <el-input v-model="formData.accountTypeName" :disabled="this.isHasAccount===true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="账户层级" prop="accountLevel">
                    <el-select v-model="formData.accountLevel" placeholder="--请选择--" :disabled="this.isHasAccount===true" @change="levelChange">
                        <el-option v-for="item in commonOptionsConfig.accountLevel" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单位" prop="unitCode">
                    <el-select v-model="formData.unitCode" placeholder="--请选择--" :disabled="this.isHasAccount===true">
                        <el-option v-for="item in commonOptionsConfig.unitCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上级用户类型" prop="parentUserTypeCode" v-if="this.formData.accountLevel === 2 ? true : false">
                    <el-select v-model="formData.parentUserTypeCode" placeholder="--请选择--" :disabled="this.isHasAccount===true ? true : (this.formData.accountLevel === 2 ? false : true)" @change="parentTypeChange">
                        <el-option v-for="item in commonOptionsConfig.parentUserTypeCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上级账户类型" prop="parentAccountTypeName" v-if="this.formData.accountLevel === 2 ? true : false">
                    <el-select v-model="formData.parentAccountTypeName" placeholder="--请选择--" :disabled="this.isHasAccount===true ? true : (this.formData.accountLevel === 2 ? false : true)">
                        <el-option v-for="item in commonOptionsConfig.parentAccountTypeName" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否透支" prop="isOverdraft" v-if="this.formData.accountLevel === 1 ? true : false">
                    <el-select v-model="formData.isOverdraft" :disabled="this.formData.accountLevel === 2 ? true : false" placeholder="--请选择--"  @change="draftChange">
                        <el-option v-for="item in commonOptionsConfig.isOverdraft" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="透支额度类型" prop="overdraftType" v-if="this.formData.isOverdraft === 1 ? true : false">
                    <el-select v-model="formData.overdraftType" :disabled="this.formData.accountLevel === 2 ? true : false" placeholder="--请选择--">
                        <el-option v-for="item in commonOptionsConfig.overdraftType" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="透支额度" prop="overdraftCredit" v-if="this.formData.isOverdraft === 2 ? false : (this.formData.overdraftType === 2 ? true : false)">
                    <el-input v-model.number="formData.overdraftCredit" placeholder="请输入透支额度" :disabled="this.formData.accountLevel === 2 ? true : (this.formData.overdraftType === 2 ? false : true)"></el-input>
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
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import apiAccAccountConfig from 'src/services/finance/accAccountConfig.js'

    export default {
        name: 'accAccountConfig-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                commonOptionsConfig : {
                    //辅助资料配置
                    //用户类型
                    userTypeCode: [],
                    //单位
                    unitCode:[],
                    parentUserTypeCode:[],
                    parentAccountTypeName:[],
                    //账户层级
                    accountLevel:[
                        {value: 1, text: '一级'},
                        {value: 2, text: '二级'}
                    ],
                    overdraftType:[
                        {value: 1, text: '个性'},
                        {value: 2, text: '统一'}
                    ],
                    isOverdraft:[
                        {value: 1, text: '是'},
                        {value: 2, text: '否'}
                    ]
                },
                accountConfigCreateDTO: [],
                //表单
                formData: {
                    id: null,
                    userTypeCode: null,
                    userTypeName: null,
                    accountTypeName:  null,
                    accountLevel:  null,
                    unitCode: null,
                    unitName:  null,
                    parentAccountTypeName: null,
                    parentUserTypeName: null,
                    parentUserTypeCode: null,
                    isOverdraft: null,
                    status:  1,
                    overdraftType: null,
                    overdraftCredit: null,
                    createName:  Cookie.get('t8t-tc-username'),
                    createBy: Cookie.get('t8t-tc-username'),
                    createTime:  null,
                    createUser:  parseInt(Cookie.get('t8t-tc-uid')),
                    updateName: null,
                    updateTime:  null,
                    updateUser:  null
                },
                isLoading: false
            }
        },
        props: ['rowId','editType','isHasAccount'],
        computed: {
            rules() {
                return {
                    userTypeCode: [
                        {type: "string", required: true, message: "请选择用户类型", trigger: 'change'}
                    ],
                    accountTypeName: [
                        {required: true, message: '不能为空'},
                        {type: 'string', message: '请填写字符串'},
                        {min: 1, message: '不能少于1个字符'},
                        {max: 10, message: '不能多于10个字符'}
                    ],
                    accountLevel: [
                        {type: "number", required: true, message: "请选择账户层级", trigger: 'change'}
                    ],
                    unitCode: [
                        {type: "string", required: true, message: "请选择单位", trigger: 'change'}
                    ],
                    parentUserTypeCode: [
                        {
                            type: "string",
                            required: this.formData.accountLevel === 2 ? true : false,
                            message: "请选择上级用户类型",
                            trigger: 'change',
                            disabled: true
                        }
                    ],
                    parentAccountTypeName: [
                        {
                            type: "string",
                            required: this.formData.accountLevel === 2 ? true : false,
                            message: "请选择上级账户类型",
                            trigger: 'change'
                        }
                    ],
                    isOverdraft: [
                        {type: "number", required: this.formData.accountLevel === 1 ? true : false, message: "请选择是否透支", trigger: 'change'}
                    ],
                    overdraftType: [
                        {type: "number", required: this.formData.isOverdraft === 1 ? true : false, message: "请选择透支额度", trigger: 'change'}
                    ],
                    overdraftCredit: [{
                        type: 'integer',
                        required: this.formData.overdraftType === 2 ? true : false,
                        min: 1,
                        max: 100000000,
                        transform (val) {
                            return +val;
                        },
                        message: '请输入1-100000000之间的正整数',
                        trigger: 'change'
                    }]
                }
            },
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
                var args = {
                     id : this.rowId
                }
                //根据所选行id加载数据
                this.loadConfigData(args)
            };
            //请求辅助资料配置
            //用户类型
            this.getCommonOptions('6!610!61016!','userTypeCode')
            //单位类型
            this.getCommonOptions('6!610!61018!','unitCode')
            this.getUseTypes()

        },
        methods: {
            levelChange(val){
                if(val === 2){
                    this.formData.isOverdraft = null
                    this.formData.overdraftType = null
                    this.formData.overdraftCredit = null
                }
                //一级账户时清空二级账户类型和二级账户用户类型
                if(val === 1){
                    this.formData.parentUserTypeCode = null
                    this.formData.parentAccountTypeName = null
                    this.formData.parentUserTypeName = null
                }
            },
            parentTypeChange(val){
                this.getAccountTypeByUserType(val)
            },
            draftChange(val){
                if(val === 1){
                    this.formData.overdraftType = 1
                }
            },
            btnOKClick() {
                this.$refs['accConfigForm'].validate(valid=>{
                    if (valid) {
                        var formData = Object.assign({},this.formData)
                        var editType = this.editType
                        var accountConfigCreateDTO = formData

                        if (editType==='add') {
                            this.addAccConfigs({accountConfigCreateDTO})
                        }
                        else if (editType==='edit') {
                            if(this.isHasAccount===true){
                                formData.userTypeCode=null
                                formData.accountTypeName=null
                                formData.accountLevel=null
                                formData.unitCode=null
                                formData.parentUserTypeCode=null
                                formData.parentAccountTypeName=null
                            }
                            formData.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                            formData.updateBy = Cookie.get('t8t-tc-username')
                            formData.updateName = Cookie.get('t8t-tc-username')
                            this.updateAccConfig(formData)
                        };
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$refs['accConfigForm'].resetFields()
                this.$emit('close')
            },
            addAccConfigs(accountConfigCreateDTO) {
                this.isLoading = true
                apiAccAccountConfig.createConfig(accountConfigCreateDTO)
                    .then((res) => {
                        this.isLoading = false
                        if (res.data.status === 200 && res.data.result ===1) {
                            this.$refs['accConfigForm'].resetFields();
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
            updateAccConfig(accountConfigUpdateDTO) {
                this.isLoading = true
                apiAccAccountConfig.updateConfig({accountConfigUpdateDTO})
                    .then((res) => {
                        this.isLoading = false
                        if (res.data.status === 200 && res.data.result ===1) {
                            this.$refs['accConfigForm'].resetFields();
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
                            this.isLoading = false
                            this.$message.error(res.data.message)
                        }
                    })
            },
            loadConfigData(args) {
                apiAccAccountConfig.findById(args)
                    .then((res) => {
                        if (res.data.status === 200) {
                            this.formData =  res.data.result
                        }
                    })
            },

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
                        this.commonOptionsConfig['parentUserTypeCode'] = list
                    }
                })
            },
            getAccountTypeByUserType(parentUserTypeCode){
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
                        this.commonOptionsConfig['parentAccountTypeName'] = list
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
            }
        }
    }

</script>

<style lang="css" scoped>
</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
    .accAccountConfig-dialog .el-dialog{
        width: 450px;
    }
    .el-select-dropdown__wrap {
        max-height: 185px !important;
    }
    .accAccountConfig-dialog .el-form-item__content {
        width: 250px;
    }
    .accAccountConfig-dialog .el-select {
        width: 100%;
    }
</style>
