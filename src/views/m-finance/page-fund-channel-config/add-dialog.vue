<template>
    <div>
        <el-dialog :title="dialogTitle" class="add-dialog" v-model="dialogVisible" @close="btnCancelClick()">
            <el-form
                :label-position="labelPosition"
                :model="formData"
                :label-width="formLabelWidth"
                :rules="rules"
                ref="addForm"
                @keyup.enter.native="btnOKClick()"
            >
                <el-form-item label="编码" prop="channelNo">
                    <el-input v-model="formData.channelNo" :disabled="editType=='edit'"></el-input>
                </el-form-item>
                <el-form-item label="收付类型" prop="channelType">
                    <el-select v-model="formData.channelType" placeholder="--请选择--" @change="channelChange">
                        <el-option v-for="item in channelTypeOptions" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资金渠道" prop="channelId">
                    <el-select v-model="formData.channelId" placeholder="--请选择--" @visible-change="channelIdClick">
                        <el-option v-for="item in channelOptions" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级渠道" prop="secondChannelId">
                    <el-select v-model="formData.secondChannelId" placeholder="--请选择--" :clearable="true" @visible-change="channelIdClick">
                        <el-option v-for="item in secondChannelOptions" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商户编号" prop="partnerNo">
                    <el-input v-model="formData.partnerNo"></el-input>
                </el-form-item>
                <el-form-item label="商户账号" prop="account">
                    <el-input v-model="formData.account"></el-input>
                </el-form-item>
                <el-form-item label="公众号ID" prop="wechatPublic">
                    <el-input v-model="formData.wechatPublic"></el-input>
                </el-form-item>
                <el-form-item label="密钥类型" prop="secretKeyType">
                    <el-select v-model="formData.secretKeyType" placeholder="--请选择--">
                        <el-option v-for="item in secretKeyTypeOption" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 上传MD5密钥/与密钥类型联动 begin -->
                <el-form-item label="上传密钥" prop="md5Key" v-if="formData.secretKeyType == 1">
                    <input type="file" class="el-upload__input" @change="fileChange" accept="text/plain" name="MD5FileName" ref="MD5File"/>
                    <el-button size="small" type="primary" @click="uploadClick(1)">点击上传MD5密钥</el-button>
                    <span ref="MD5FileName">只能上传txt文件</span>
                </el-form-item>
                <!-- end -->
                <!-- 上传RSA公私钥 begin -->
                <el-form-item label="上传密钥" prop="rsaPublicKey" v-if="formData.secretKeyType == 2">
                    <input type="file" class="el-upload__input" @change="fileChange" accept="text/plain" name="RSAPubFileName" ref="RSAPubFile"/>
                    <el-button size="small" type="primary" @click="uploadClick(2)">点击上传RSA公钥</el-button>
                    <span ref="RSAPubFileName">只能上传txt文件</span>
                </el-form-item>
                <el-form-item label="" prop="rsaPrivateKey" v-if="formData.secretKeyType == 2">
                    <input type="file" class="el-upload__input" @change="fileChange" accept="text/plain" name="RSAPriFileName" ref="RSAPriFile"/>
                    <el-button size="small" type="primary" @click="uploadClick(3)">点击上传RSA私钥</el-button>
                    <span ref="RSAPriFileName">只能上传txt文件</span>
                </el-form-item>
                <!-- end -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="btnCancelClick()">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import * as config from './config'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    import fundChannelApi from 'src/services/finance/fundChannelConfig.js'
    import Utils from 'src/utils/Utils.js'
    import Service from 'src/services/finance/Service.js'
    import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    export default {
        name: 'add-dialog',
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                channelTypeOptions: [],
                channelOptions: [],
                receiptChannelOptions: [],
                payChannelOptions: [],
                secondChannelOptions: [],
                secretKeyTypeOption: [],
                dialogTitle: '新增渠道管理配置',
                // 校验规则
                rules: {},
                // 表单数据
                formData: config.formData,
                isLoading: false,
                // 是否初始进入编辑页面
                isFirstEdit: true,
                // 存储未修改的表单的值
                oldFormData: {}
            }
        },
        props: [
            'dialogTitle',
            'rowId',
            'editType',
            'selectSource'
        ],
        computed: {
            dialogVisible() {
                return true
            }
        },
        created() {
            this.rules = JSON.parse(JSON.stringify(config.rules))
            this.channelTypeOptions = this.selectSource.channelTypeOptions
            this.secretKeyTypeOption = this.selectSource.secretKeyTypeOption
            // 如果是修改，根据id获取数据
            if(this.editType === 'edit' && this.rowId) {
                let args = {
                    search: {
                        id: this.rowId
                    }
                }
                fundChannelApi.getDataBySearch(args)
                    .then((res) => {
                        if(res.data.status === 200) {
                            this.oldFormData = {...res.data.result[0]}
                            if(res.data.result[0].secondChannelId == 0) {
                                res.data.result[0].secondChannelId = ''
                            }
                            this.formData = {...res.data.result[0]}
                        }
                    })
            } else if(this.editType === 'add') {
                this.rules.channelNo.push({
                    validator: this.checkUnique,
                    trigger: 'blur'
                })
                this.rules.channelType.push({
                    validator: this.checkUnique,
                    trigger: 'change'
                })
                this.rules.partnerNo.push({
                    validator: this.checkUnique,
                    trigger: 'blur'
                })
            }
        },
        methods: {
            //取消
            btnCancelClick() {
                this.$refs['addForm'].resetFields()
                this.$emit('close')
                this.formData = {}
            },
            //确认
            btnOKClick() {
                this.$refs['addForm'].validate(valid=>{
                    if(valid) {
                        this.isLoading = true
                        let formData = {...this.formData}
                        let oldFormData = {...this.oldFormData}
                        if(formData.secondChannelId == '') {
                            formData.secondChannelId = 0
                        }
                        let self = this
                        // MD5密钥
                        if(formData.secretKeyType == 1) {
                            delete formData.rsaPublicKey
                            delete formData.rsaPrivateKey

                            delete oldFormData.rsaPrivateKey
                            delete oldFormData.rsaPrivateKey
                        } else if(formData.secretKeyType == 2){ // RSA密钥
                            delete formData.md5Key

                            delete oldFormData.md5Key
                        }
                        if(this.editType === 'add') {
                            let args = {
                                channelConfig: formData
                            }
                            fundChannelApi.create(args)
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        self.$msgbox(mb('新增成功', 'success'))
                                        this.btnCancelClick()
                                        this.$emit('getTableData')
                                    } else {
                                        self.$msgbox(mb(res.data.message, 'error'))
                                    }
                                    this.isLoading = false
                                })
                        } else if(this.editType === 'edit'){
                            if(!this.checkFormChange(oldFormData, formData)) {
                                this.btnCancelClick()
                            } else {
                                // 修改人
                                formData.updateUser = parseInt(Cookie.get('t8t-tc-uid'))
                                // 编辑成功状态变为待启用
                                formData.status = 0
                                let args = {
                                    channelConfig: formData
                                }
                                fundChannelApi.update(args)
                                    .then((res) => {
                                        if (res.data.status === 200) {
                                            self.$msgbox(mb('编辑成功', 'success'))
                                            this.btnCancelClick()
                                            this.$emit('getTableData')
                                        } else {
                                            self.$msgbox(mb(res.data.message, 'error'))
                                        }
                                        this.isLoading = false
                                    })
                            }
                        }
                    }
                })
            },
            // 选择收付类型
            channelChange() {
                let value = this.formData.channelType
                if(!this.isFirstEdit) {
                    this.formData.channelId = null
                    this.formData.secondChannelId = null
                }
                this.getChannelOptions(value)
                if(this.formData.partnerNo) {
                    this.$refs['addForm'].validateField('partnerNo')
                }
            },
            // 点击资金渠道
            channelIdClick(value) {
                if(value == true && !this.formData.channelType) {
                    this.$message.error('请先选择收付类型')
                }
            },
            // 获取资金渠道数据
            getChannelOptions(value) {
                this.isFirstEdit = false
                let list = []
                let args = {
                    page: 1,
                    size: 1000,
                    search: {
                        status: 1 // 启用的配置
                    }
                }
                switch (value) {
                    case 1:
                        fundChannelApi.getReceiptChannelData(args)
                            .then((res) => {
                                if(res.data.status === 200 && res.data.result.rows) {
                                    res.data.result.rows.forEach((item) => {
                                        list.push({
                                            value: item.channelId,
                                            text: item.name
                                        })
                                    })
                                    this.channelOptions = list
                                }
                            })
                        // 收款二级渠道61009
                        this.getCommonData('61009', 'secondChannelOptions')
                        break
                    case 2:
                        fundChannelApi.getPayChannelData(args)
                            .then((res) => {
                                if(res.data.status === 200) {
                                    res.data.result.forEach((item) => {
                                        list.push({
                                            value: item.remitChannelId,
                                            text: item.name
                                        })
                                    })
                                    this.channelOptions = list
                                }
                            })
                        // 付款二级渠道61010
                        this.getCommonData('61010', 'secondChannelOptions')
                        break
                    default:
                        break
                }
            },
            // 文件上传
            fileChange($event) {
                let tagName = $event.target.name,
                    files = $event.target.files, //上传的文件引用
                    fieldName = '', // 字段名
                    _that = this
                if(files.length !== 0) {
                    let file = files[0]
                    if(/text+/.test(file.type)) {
                        //新建一个FileReader
                        let reader = new FileReader()
                        //读取文件
                        reader.readAsText(file)
                        //读取完文件之后会回来这里
                        reader.onload = function(evt){
                            // 读取文件内容
                            let fileString = evt.target.result
                            let flag = true
                            $event.target.value = ''
                            switch (tagName) {
                                case 'MD5FileName':
                                    fieldName = 'md5Key'
                                    if(fileString.length >100) {
                                        _that.$message.error('MD5密钥长度不超过100字符')
                                        flag = false
                                    }
                                    break
                                case 'RSAPubFileName':
                                    fieldName = 'rsaPublicKey'
                                    if(fileString.length >4000) {
                                        _that.$message.error('RSA公钥长度不超过4000字符')
                                        flag = false
                                    }
                                    break
                                case 'RSAPriFileName':
                                    fieldName = 'rsaPrivateKey'
                                    if(fileString.length >4000) {
                                        _that.$message.error('RSA私钥长度不超过4000字符')
                                        flag = false
                                    }
                                    break
                                default: break
                            }
                            if(flag) {
                                _that.$refs[tagName].innerText = file.name
                                if(fieldName) {
                                    _that.formData[fieldName] = fileString
                                }
                            }
                        }
                    }
                }
            },
            // 点击按钮触发文件上传
            uploadClick(value) {
                let refFile = ''
                switch (value) {
                    case 1:  refFile = 'MD5File'; break
                    case 2:  refFile = 'RSAPubFile'; break
                    case 3:  refFile = 'RSAPriFile'; break
                    default: break
                }
                this.$refs[refFile].click()
            },
            //辅助资料
            getCommonData: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
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
                            })
                            this[selectName] = list
                        }
                    })
            },
            // 校验重复
            checkUnique(rule, value, callback) {
                let field = rule.field
                let args = {
                    page: 1,
                    size: 10,
                    search: {}
                }
                switch (field) {
                    case 'channelNo':
                        args.search.channelNo = value
                        fundChannelApi.getList(args)
                            .then((res)=>{
                                if(res.data.status === 200) {
                                    if(res.data.result.rows.length>0) {
                                        return callback(new Error('编码已存在'))
                                    } else {
                                        return callback()
                                    }
                                } else {
                                    return callback()
                                }
                            })
                        break
                    case 'partnerNo' :
                        args.search.partnerNo = value
                        if(this.formData.channelType) {
                            args.search.channelType = this.formData.channelType
                            fundChannelApi.getList(args)
                                .then((res)=>{
                                    if(res.data.status === 200) {
                                        if(res.data.result.rows.length>0) {
                                            return callback(new Error('同一收付类型的商户编号已存在'))
                                        } else {
                                            return callback()
                                        }
                                    } else {
                                        return callback()
                                    }
                                })
                        } else {
                            return callback()
                        }
                        break
                    default:
                        return callback()
                        break
                }
            },
            // 判断表单是否修改
            checkFormChange(oldFormData, newFormData) {
                let flag = false
                for(let i in newFormData) {
                    if(oldFormData[i] !== newFormData[i]) {
                        flag = true
                    }
                }
                return flag
            }
        }
    }
</script>

<style lang="css" scoped>
    .add-dialog .el-dialog{
        width: 450px;
    }
    .add-dialog  .el-input {
        width: 250px;
    }
    .add-dialog .el-select {
        width: 250px;
    }
</style>
