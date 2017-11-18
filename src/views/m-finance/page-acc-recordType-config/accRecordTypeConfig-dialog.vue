<template>
    <div>
        <el-dialog title="收支类型配置" class="accRecordTypeConfig-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="typeConfigForm" @keyup.enter.native="btnOKClick()">
                <el-form-item label="编码">
                    <el-input v-model="formData.recordTypeViewCode" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="收支类型" prop="recordTypeName">
                    <el-select v-model="formData.recordTypeName " placeholder="--请选择--" @change="changeCodeDisabled">
                        <el-option v-for="item in commonOptionsConfig.recordTypeName" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收支" prop="recordType">
                    <el-select v-model="formData.recordType" :disabled="editable" placeholder="--请选择--">
                        <el-option v-for="item in commonOptionsConfig.recordType" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="编码">
                    <el-input v-model="formData.reverseRecordTypeViewCode" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="收支反向类型" prop="reverseRecordTypeName">
                    <el-select v-model="formData.reverseRecordTypeName " placeholder="--请选择--" @change="changeReverseCodeDisabled">
                        <el-option v-for="item in commonOptionsConfig.reverseRecordTypeName" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否需传K3" prop="isK3">
                    <el-select v-model="formData.isK3" :disabled="editable" placeholder="--请选择--">
                        <el-option v-for="item in commonOptionsConfig.isK3" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
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
    import apiAccRecordTypeConfig from 'src/services/finance/apiAccRecordTypeConfig.js'

    export default {
        name: 'accRecordTypeConfig-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    recordTypeViewCode: [
                        {type:"string",required: true , message: "请输入编码",trigger: 'change'}
                    ],
                    recordTypeName: [
                        {type:"string",required: true , message: "请选择收支类型",trigger: 'change'}
                    ],
                    recordType: [
                        {type:"number",required: true , message: "请选择收支",trigger: 'change'}
                    ],
                    reverseRecordTypeViewCode: [
                        {type:"string",required: true , message: "请输入编码",trigger: 'change'}
                    ],
                    reverseRecordTypeName: [
                        {type:"string",required: true , message: "请选择收支反向类型",trigger: 'change'}
                    ],
                    isK3: [
                        {type:"number",required: true , message: "请选择是否需传K/3",trigger: 'change'}
                    ]
                },
                commonOptionsConfig: {
                    //辅助资料配置
                    recordTypeNameShortCode: [],
                    recordTypeName: [],
                    reverseRecordTypeName: [],
                    recordType: [
                        {value: 1, text: '收入'},
                        {value: 2, text: '支出'}
                    ],
                    isK3: [
                        {value: 1, text: '需传'},
                        {value: 2, text: '不传'}
                    ]
                },

                //表单
                formData: {
                    recordTypeViewCode: null,
                    recordTypeCode: null,
                    recordTypeName : null,
                    recordType: null,
                    reverseRecordTypeViewCode: null,
                    reverseRecordTypeCode: null,
                    reverseRecordTypeName: null,
                    status: 1,
                    isK3: null,
                    createUser: parseInt(Cookie.get('t8t-tc-uid')),
                    createName: Cookie.get('t8t-tc-username'),
                    createBy: Cookie.get('t8t-tc-username'),
                    createTime:  null,
                    updateTime:  null,
                    updateUser:  null,
                    updateBy: null,
                    updateName: null
                },
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
            //请求所选行的数据
            if (this.rowId) {
                var args = {
                    id : this.rowId
                }
                this.loadConfigsFormData(args)
            };

            //获取辅助资料配置 --- 收支类型编码
            this.getCommonOptions('6!610!61017!','recordTypeName')
        },
        methods: {
            //收支类型变更，触发编码显示
            changeCodeDisabled(value) {
                for(let i = 0;i<this.commonOptionsConfig['recordTypeName'].length;i++) {
                    if (this.commonOptionsConfig['recordTypeName'][i].value==value) {
                        this.formData.recordTypeCode = value;
                        let splitCode = []
                        splitCode = value.toString().split('!')
                        let length = splitCode.length
                        this.formData.recordTypeViewCode = splitCode[length - 1]
                        return
                    }
                }
            },
            //反向收支类型变更，触发编码显示
            changeReverseCodeDisabled(value) {
                for(let i = 0;i<this.commonOptionsConfig['reverseRecordTypeName'].length;i++) {
                    if (this.commonOptionsConfig['reverseRecordTypeName'][i].value==value) {
                        this.formData.reverseRecordTypeCode= value
                        let splitCode = []
                        splitCode = value.toString().split('!')
                        let length = splitCode.length
                        this.formData.reverseRecordTypeViewCode = splitCode[length - 1]
                        return
                    }
                }
            },
            btnOKClick() {
                this.$refs['typeConfigForm'].validate(valid=>{
                    if (valid) {
                        var formData = Object.assign({},this.formData)
                        var editType = this.editType

                        if (editType==='add') {
                            this.addConfigsMethods(formData)
                        }
                        else if (editType==='edit') {
                            formData.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                            formData.updateBy = Cookie.get('t8t-tc-username')
                            formData.updateName = Cookie.get('t8t-tc-username')
                            this.updatePayMethods(formData)
                        }
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$refs['typeConfigForm'].resetFields();
                this.$emit('close')
            },
            //提交新增
            addConfigsMethods(formData){
                var recordTypeConfigCreateDTO = formData
                this.isLoading = true
                //发起请求,提交表单
                apiAccRecordTypeConfig.createConfig({recordTypeConfigCreateDTO})
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result ===1) {
                            //隐藏正在加载
                            this.isLoading = false
                            //this.$refs['typeConfigForm'].resetFields();
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
                var recordTypeConfigUpdateDTO = formData
                //发起请求,提交表单
                apiAccRecordTypeConfig.updateConfig({recordTypeConfigUpdateDTO})
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result ===1) {
                            //隐藏正在加载
                            this.isLoading = false
                            this.$refs['typeConfigForm'].resetFields();
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
                apiAccRecordTypeConfig.findById(args)
                    .then((res) => {
                        if (res.data.status === 200) {
                            var rowData = res.data.result;
                            rowData.recordTypeViewCode = rowData.recordTypeViewCode
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
                let listShort = []
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
                                    listShort.push({
                                        value: item.wholeCode,
                                        text: item.propertyCode
                                    })
                                };
                            })
                            this.commonOptionsConfig[selectName] = list
                            this.commonOptionsConfig['reverseRecordTypeName'] = list
                            this.commonOptionsConfig['recordTypeNameShortCode'] = listShort
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
    .accRecordTypeConfig-dialog .el-dialog{
        width: 450px;
    }
    .el-select-dropdown__wrap {
        max-height: 185px !important;
    }
    .accRecordTypeConfig-dialog .el-form-item__content {
        width: 250px;
    }
    .accRecordTypeConfig-dialog .el-select {
        width: 100%;
    }
</style>
