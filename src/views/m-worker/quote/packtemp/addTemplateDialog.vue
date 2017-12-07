/**
* Created by tomy.li on 2017/5/9.
*/
<template>
    <div>
        <el-dialog title="新建产品包模板" class="g-w-460 my-el-dialog" v-model="dialogVisible" @close="closeDialog">
            <el-form :model="formData" :label-position="left" label-width="150px" :rules="rules" ref="addTemplateForm">
                <el-form-item label="产品包模板名称：" prop="tempName" :size="small">
                    <el-input :size="small" v-model="formData.tempName"></el-input>
                </el-form-item>

                <el-form-item label="组织：" prop="orgId">
                    <el-select v-model="formData.orgId" placeholder="--请选择--">
                        <el-option v-for="item in commonData.organizes" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="产品包：" prop="pkgId">
                    <el-select v-model="formData.pkgId" placeholder="--请选择--">
                        <el-option v-for="item in commonData.productPackages" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <!--<el-form-item label="排期模板：" prop="scheduleModuleId">
                    <t8t-form-popup
                        v-model="formData.scheduleModuleId"
                        ref="formData.scheduleModuleId"
                        textValue="name"
                        filedValue="id"
                        name="scheduleModuleId"
                        placeholder="选择排期模板"
                        :disabled="true"
                        :dialog="searchScheduleModuleDialog"
                    >
                    </t8t-form-popup>
                </el-form-item>-->

            </el-form>

            <div slot="footer">
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-button  size="small"  type="primary" @click="submit()" :disabled="!canSubmit">下一步</el-button>
                            <el-button  size="small"  @click="cancel()">取消</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    // import T8tSearch from 'src/components/t8t-search/t8t-search.vue'
    import storages from 'src/services/storages/storages.js'
    import productPackage from 'src/services/worker/productpackage/base-method.js'
    import packtemp from 'src/services/worker/packtemp/packtemp.js'
    import packtempServices from 'src/services/worker/packtemp/Service.js'
    import config from './config.js'
    export default{
        props:['tempCode', "organizes", "productPackages"],
        name: 'addTemp',
        components: {
            // T8tSearch
        },
        data(){
            return {
                searchScheduleModuleDialog:{
                    title: "查询排期模板",
                    size: 'large',
                    searchForm: {
                        fields: [
                            {type: 'input', label: '模板名', name: 'name_like'},
                        ],
                        resetBtnVisible: false,
                        showToggleBtn: false
                    },
                    table: {
                        //表格
                        columns: [{
                            prop: 'name',
                            label: '模板名'
                        }],
                        radioCol: true,
                        //请求参数配置
                        service: packtempServices.schedule.name,
                        method: packtempServices.schedule.methods.module,
                        args: {}
                    },
                    onConfirm: function (row){

                    },
                },
                userId:+Cookie.get('t8t-tc-uid'),
                dialogVisible: true,
                commonData: {
                    organizes: this.organizes,
                    productPackages: this.productPackages,
                },
                formData:{
                    'tempName': '',
                    'orgId': null,
                    'pkgId': '',
                    'createUser':+Cookie.get('t8t-tc-uid'),
                    'scheduleModuleId':1,
                },
                rules: {
                    tempName: [
                        {type: "string",required: true ,message: "请正确填写产品包模板名称",trigger: 'change'},
                        {type: "string",min: 1 ,max:20, message: "产品包模板名称最多50个字符",trigger: 'change'},
                        //{type: "string",maxLength: 10 , message: "最多10个字符",trigger: 'change'}
                    ],
                    orgId: [
                        {type: "number",required: true , message: "请选择组织",trigger: 'change'}
                    ],
                    pkgId: [
                        {type: "number",required: true , message: "请选择产品包",trigger: 'change'}
                    ],
                    scheduleModuleId: [
                        {required: true, message: "请选择排期模板"}
                    ]
                },
                formCommonData:{
                    'storageIds':[]
                },
                selectSource: {
                },
                currentRowData:{},
                dataSource:{
                },
                fields:[
                    {
                        prop: 'tempName',
                        label: '产品包模板名称',
                        type: 'input',
                        rules: [{
                            required: true,
                            message: '不能为空'
                        }]
                    },
                    {
                        prop: 'orgId',
                        label: '组织',
                        type: 'select',
                        list: 'organizes',
                        rules: [{
                            required: true,
                            message: '不能为空'
                        }]
                    },
                    {
                        prop: 'pkgId ',
                        label: '产品包',
                        type: 'select',
                        list: 'productPackages',
                        rules: [{
                            required: true,
                            message: '不能为空'
                        }]
                    },
                ],
                canSubmit: true
            }
        },
        created() {
        },
        methods: {
            submitSearchDialog(obj) {
            },
            closeDialog() {
                this.$emit('close')
            },

            handleCellClick(cell, val){
                this.currentRowData = JSON.parse(JSON.stringify(cell));
            },

            submit(){
                this.$refs['addTemplateForm'].validate(valid=>{
                    if (valid) {
                        this.canSubmit = false
                        var formData = Object.assign({},this.formData)
                        packtemp.createTemp(formData).then((res) => {
                            if (res.data.status === 200) {
                                let tempCode = res.data.result // 创建的insertid()
                                this.$router.push({ path: '/tuchat-worker/quote-packtemp-view',query:{'tempCode':tempCode}})
                            } else {
                                this.canSubmit = true
                                this.$msgbox(mb(res.data.message, 'error'))
                            }
                        })
                    }
                    else {
                        return false
                    }
                })
            },

            cancel:function (){
                this.dialogVisible = false
            },

        }
    }

</script>

<style lang="css" scoped>
    .g-main-container-column{
        min-height: 300px;
    }
    .my-el-dialog .el-dialog{width:1200px  !important;}

</style>
<style>
    .el-select-dropdown__wrap {
        max-height: 185px !important;
    }
    .my-el-dialog .el-form-item__content {
        width: 180px;
    }
    .my-el-dialog .el-select {
        width: 100%;
    }
</style>

