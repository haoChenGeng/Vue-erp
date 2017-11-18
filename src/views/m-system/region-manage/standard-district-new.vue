<template>
    <div>
        <el-dialog class="add-dialog" title="新增标准区域数据" v-model="dialogFormVisible" @close="cancelButton()">
            <el-form :model="standardForm" :rules="rules" ref="ruleForm" :label-width="formLabelWidth" :label-position="labelPosition">
                    <el-form-item label="区域父级">
                        <t8t-division
                            :changeOnSelect="true"
                            @change="onChange"
                            filterable="true"
                            :value="value"
                        ></t8t-division>
                    </el-form-item>
                    <el-form-item label="区域id" prop="standardId">
                        <el-input v-model="standardForm.standardId" auto-complete="off"> </el-input>
                    </el-form-item>
                    <el-form-item label="区域名" prop="districtName">
                        <el-input v-model="standardForm.districtName"></el-input>
                    </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelButton()">取 消</el-button>
                <el-button type="primary" @click="submit(standardForm)">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>

    import RegionService from 'src/services/region/region'
    import { mb } from 'src/components/t8t-table/utils/utils.js'
    export default {

        components: {},
        name: '',

        data () {
            return {
                resMsg: '',
                fatherSize: 0,
                isStandard: false,
                labelPosition: 'right',
                formLabelWidth: '120px',
                dialogFormVisible: true,
                standardForm: {
                    districtName: '',
                    standardId: '',
                    standardFatherId: 0
                },
                rules: {
                    districtName: [
                        {validator: this.validateDistrictName, trigger: 'blur'}
                    ],
                    standardId: [
                        {validator: this.validateStandardId, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            validateDistrictName (rule, value, callback) {
                if (value === null || value === '') {
                    callback(new Error('请输入区域名称'))
                }
                this.checkName(value) ? callback() : callback(new Error('区域名称不合法'))
            },
            validateStandardId (rule, value, callback) {
                if (value === null || value === '') {
                    callback(new Error('请输入区域id'))
                }
                if (!this.checkId(value)) {
                    callback(new Error('区域id不合法'))
                }
                if (this.fatherSize === 0 || this.fatherSize === 1 || this.fatherSize === 2) {
                    if (value.length !== 2) {
                        callback(new Error('区域id请填写两位数'))
                    }
                } else if (this.fatherSize === 3) {
                    if (value.length !== 3) {
                        callback(new Error('区域id请填写三位数'))
                    }
                } else {
                    callback(new Error('不支持所选父级区域'))
                }
                callback()
            },
            cancelButton () {
                this.dialogFormVisible = false
                this.$emit('close')
            },
            onChange (value) {
                this.fatherSize = value.length
                this.standardForm.standardFatherId = value[value.length - 1]
            },
            handleSelect (item) {
            },
            checkName (name) {
                var strExp = new RegExp(/^[\u4E00-\u9FA5]+$/)
                return strExp.test(name)
            },
            checkId (id) {
                var strExp = new RegExp(/^[0-9]*$/)
                return strExp.test(id)
            },
            submit (formName) {
                this.$refs['ruleForm'].validate((isValid) => {
                    if (!isValid) return false
                    let type = ''
                    let level = 0
                    let cid = '0'
                    if (!this.checkId(this.standardForm.standardId)) {
                        this.$message.error('区域id不合法!')
                        return false
                    }
                    switch (this.fatherSize) {
                        case 0:
                            level = 1
                            type = 'PROVINCE'
                            cid = this.standardForm.standardId
                            break
                        case 1:
                            level = 2
                            type = 'CITY'
                            cid = Number(this.standardForm.standardFatherId + this.standardForm.standardId + '00000000')
                            break
                        case 2:
                            level = 3
                            type = 'COUNTY'
                            cid = Number(this.standardForm.standardFatherId) + Number(this.standardForm.standardId + '000000')
                            break
                        case 3:
                            level = 4
                            type = 'TOWN'
                            cid = Number(this.standardForm.standardFatherId) + Number(this.standardForm.standardId + '000')
                            break
                        default:
                            this.$message.error('不支持所选取的父级区域')
                            return false
                    }
                    let args = {
                        district: {
                            cid: cid,
                            pid: this.standardForm.standardFatherId,
                            type: type,
                            level: level,
                            districtName: this.standardForm.districtName
                        }
                    }
                    RegionService.addStandardDistrict(args).then((res) => {
                        if (res.status === 200 && res.data.result !== null) {
                            this.dialogFormVisible = false
                            this.$msgbox(mb('修改成功', 'success'))
                            this.$emit('reloadTable')
                        } else {
                            this.$message.error(res.data.message)
                            return false
                        }
                    })
                })
            }
        }
    }
</script>

<style lang="css" scoped>

    .add-dialog .el-dialog{
        width: 450px;
    }
    .add-dialog  .el-input {
        width: 230px !important;
    }
    .add-dialog .el-select {
        width: 230px;
    }
</style>
<style>
    .t8t-division .el-input {
        width: 230px;
    }
</style>
