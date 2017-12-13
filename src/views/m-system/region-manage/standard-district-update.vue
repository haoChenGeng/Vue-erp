<template>

    <div>
        <el-dialog class="el-dialog2" title="修改标准区域数据" v-model="updateVisible" size="small" @close="cancelButton()">
            <el-form :model="standardForm" ref="ruleForm" :rules="rules" :label-width="formLabelWidth">
                <el-row>
                    <el-form-item label="重命名" prop="districtName">
                        <el-input v-model="standardForm.districtName"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelButton()">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
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
                formLabelWidth: '80px',
                updateVisible: true,
                standardForm: {
                    districtName: this.standardName,
                    pid: this.standardPid
                },
                rules: {
                    districtName: [
                        {validator: this.validateDistrictName, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            validateDistrictName (rule, value, callback) {
                if (value === null || value === '' || !this.checkName(value)) {
                    callback(new Error('区域名称不合法'))
                }
                callback()
            },
            cancelButton () {
                this.updateVisible = false
                this.$emit('close')
            },
            checkName (name) {
                var strExp = new RegExp(/^[\u4E00-\u9FA5]+$/)
                return strExp.test(name)
            },
            checkId (id) {
                var strExp = new RegExp(/^[0-9]\d*$/)
                return strExp.test(id)
            },
            submit () {
                this.$refs['ruleForm'].validate((isValid) => {
                    if (!isValid) return false
                    let args = {
                        district: {
                            cid: this.standardCid,
                            districtName: this.standardForm.districtName
                        }
                    }
                    RegionService.updateStandardDistrict(args).then((res) => {
                        if (res.status === 200 && res.data.result !== null) {
                            this.updateVisible = false
                            this.$msgbox(mb('修改成功', 'success'))
                            this.$emit('reloadTable')
                        } else {
                            this.$message.error(res.data.message)
                            return false
                        }
                    })
                })
            }
        },
        props: ['standardCid', 'standardPid', 'standardName']
    }
</script>

<style lang="css" scoped>

    .el-row {
        width: 280px;
        margin-left: 50px;
    }

    .el-dialog2 {
        height: 400px;
    }

</style>
