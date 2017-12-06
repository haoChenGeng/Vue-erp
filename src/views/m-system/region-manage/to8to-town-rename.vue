<template>
    <div>
        <el-dialog class="el-dialog1" title="修改土巴兔区域" v-model="modifiedT8tVisible" @close="cancelButton()">
            <el-form :model="t8tRename" ref="ruleForm" :rules="rules" :label-width="formLabelWidth">
                    <el-form-item label="重命名" prop="districtName">
                        <el-input v-model="t8tRename.districtName" auto-complete="off"></el-input>
                    </el-form-item>
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
                formLabelWidth: '120px',
                modifiedT8tVisible: true,
                t8tRename: {
                    districtName: this.townname
                },
                rules: {
                    districtName: [
                        {validator: this.validateDistrictName, trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            validateDistrictName (rule, value, callback) {
                if (value === '' || !this.checkName(value)) {
                    callback(new Error('区域名称不合法'))
                }
                callback()
            },
            cancelButton () {
                this.modifiedT8tVisible = false
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
                        town: {
                            townId: this.id,
                            townName: this.t8tRename.districtName
                        }
                    }
                    RegionService.updateLocalTown(args).then((res) => {
                        if (res.status === 200 && res.data.result !== null) {
                            this.modifiedT8tVisible = false
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
        props: ['id', 'cityid', 'townname']
    }
</script>

<style lang="css" scoped>

    .el-dialog .el-dialog{
        width: 450px;
    }
    .el-dialog  .el-input {
        width: 250px;
    }
</style>
