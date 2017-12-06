<template>
    <div>
        <el-dialog title="新增土巴兔区域数据" v-model="dialogFormVisible" @close="cancelButton()">
            <el-form :model="t8tForm" :rules="rules" ref="ruleForm" :label-width="formLabelWidth" :label-position="labelPosition">
                    <el-form-item label="区域父级" class="el-form-item1" prop="t8tRegion">
                        <el-cascader
                            :options="options"
                            @active-item-change="handleItemChange"
                            :props="props"
                            :change-on-select="true"
                            @change="onChange"
                            :clearable="true"
                            v-model="t8tForm.t8tRegion"
                            :filterable="true"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="区域名" class="t8t-division-popup" prop="regionName">
                        <el-input v-model="t8tForm.regionName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="区域名拼音" class="t8t-division-popup" prop="regionPinyin">
                        <el-input v-model="t8tForm.regionPinyin" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="关联新区" prop="standardRegion" class="el-form-item2">
                        <t8t-division
                            :changeOnSelect="true"
                            :clearable="true"
                            @change="onChangeRelated"
                            filterable="true"
                            :value="value"
                            v-model="t8tForm.standardRegion"
                        ></t8t-division>
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

    export default{
        data () {
            return {
                options: [],
                newLDId: 0,
                isOk: false,
                t8tFatherId: 0,
                relatedId: 0,
                fatherSize: 0,
                relatedSize: 0,
                fatherId: 0,
                radio: 3,
                dialogFormVisible: true,
                labelPosition: 'right',
                formLabelWidth: '120px',
                t8tForm: {
                    t8tRegion: [],
                    regionName: '',
                    standardRegion: [],
                    regionPinyin: ''
                },
                rules: {
                    t8tRegion: [
                        {validator: this.validateTo8toRegion, trigger: 'change'}
                    ],
                    regionName: [
                        {validator: this.validateRegionName, trigger: 'blur'}
                    ],
                    standardRegion: [
                        {validator: this.validateStandardRegion, trigger: 'change'}
                    ],
                    regionPinyin: [
                        {validator: this.validateRegionPinyin, trigger: 'blur'}
                    ]
                },
                props: {
                    label: 'name',
                    value: 'id',
                    children: 'children'
                },
                t8tOptions: {
                    value: 'id',
                    label: 'name',
                    children: 'name'
                }
            }
        },
        created () {
            let args = {}
            RegionService.getLocalCityTree(args).then((res) => {
                if (res.status === 200 && res.data.result !== null) {
                    this.options = res.data.result
                } else {
                    this.$message.error('获取本地区域数据失败')
                }
            })
        },
        methods: {
            validateTo8toRegion (rule, value, callback) {
                if (value.length === 0) {
                    callback(new Error('请填写父级区域'))
                }
                callback()
            },
            validateRegionName (rule, value, callback) {
                if (!this.checkName(value)) {
                    callback(new Error('区域名称不合法'))
                }
                callback()
            },
            validateStandardRegion (rule, value, callback) {
                if (value.length === 0) {
                    callback(new Error('请填写关联区域'))
                }
                callback()
            },
            validateRegionPinyin (rule, value, callback) {
                if (value.length === 0 || !this.checkPinyin(value)) {
                    callback(new Error('区域名称拼音不合法'))
                }
                callback()
            },
            cancelButton () {
                this.dialogFormVisible = false
                this.$emit('close')
            },
            checkName (name) {
                var strExp = new RegExp(/^[\u4E00-\u9FA5]+$/)
                return strExp.test(name)
            },
            checkPinyin (pinyin) {
                var strExp = new RegExp(/^[a-z]+$/)
                return strExp.test(pinyin)
            },
            onChange (value) {
                this.fatherSize = value.length
                this.t8tFatherId = value[value.length - 1]
            },
            onChangeRelated (value) {
                this.relatedSize = value.length
                this.relatedId = value[value.length - 1]
            },
            handleItemChange () {
            },
            submit () {
                this.$refs['ruleForm'].validate((isValid) => {
                    if (!isValid) return false
                    if (this.fatherSize === 1 && this.relatedId !== 0) {
                        let args = {
                            cityName: this.t8tForm.regionName,
                            provinceId: this.t8tFatherId,
                            standardId: this.relatedId,
                            areaLevel: this.fatherSize + 1
                        }
                        RegionService.addLocalCity(args).then((res) => {
                            if (res.status === 200 && res.data.result !== null) {
                                this.dialogFormVisible = false
                                this.$msgbox(mb('添加成功', 'success'))
                                this.$emit('reloadTable')
                            } else {
                                this.$message.error(res.data.message)
                                return false
                            }
                        })
                    }
                    if (this.fatherSize === 2 && this.relatedId !== 0) {
                        let args = {
                            townName: this.t8tForm.regionName,
                            cityId: this.t8tFatherId,
                            standardId: this.relatedId,
                            areaLevel: this.fatherSize + 1
                        }
                        RegionService.addLocalTown(args).then((res) => {
                            if (res.status === 200 && res.data.result !== null) {
                                this.dialogFormVisible = false
                                this.$msgbox(mb('添加成功', 'success'))
                                this.$emit('reloadTable')
                            } else {
                                this.$message.error(res.data.message)
                                return false
                            }
                        })
                    }
                })
            }
        }
    }
</script>
<style lang="css" scope>

    .el-dialog .el-dialog{
        width: 450px;
    }
    .el-dialog  .el-input {
        width: 230px;
    }
    .el-dialog .el-select {
        width: 230px;
    }
</style>
