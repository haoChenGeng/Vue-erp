<template>
    <!-- 新增 -->
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog dialog-new">
        <div class="t8t-full-dialog-container">
            <!-- 顶部按钮区 -->
            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                    <t8t-toolbar
                        class="t8t-dark"
                        @EDIT-SUBMIT="submitForm"
                    >
                    </t8t-toolbar>
                </div>
            </div>
            <!-- 表单区 -->
            <div class="full-dialog-form-container container-center">
                <el-form :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                    <div class="form-item-container">
                        <el-form-item label="业务组织：">
                            <el-select v-model="formData.organizationId" placeholder="--请选择--" :disabled="editable">
                                <el-option v-for="item in commonOptionsConfig.orgOptions" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="业务类型：">
                            <el-select v-model="formData.businessTypeCode" placeholder="--请选择--" :disabled="editable">
                                <el-option v-for="item in commonOptionsConfig.businessOptions" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="付款对象：">
                            <el-select v-model="formData.payObjectCode" placeholder="--请选择--" :disabled="editable">
                                <el-option v-for="item in commonOptionsConfig.payObjOptions" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="付款对象ID：">
                            <el-input v-model="formData.payObjectId"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="付款对象名称：">
                            <el-input v-model="formData.userName"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="开户银行：">
                            <el-select v-model="formData.bankCode" placeholder="--请选择--" :disabled="editable" v-on:change="getBankInfo">
                                <el-option v-for="item in commonOptionsConfig.bankOptions" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="卡号：">
                            <el-select v-model="formData.bankAccount" placeholder="--请选择--" :disabled="editable" v-on:change="setBankInfo">
                                <el-option v-for="item in commonOptionsConfig.bankAccountOptions" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="开户名：">
                            <el-input v-model="formData.openingAccountName"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="付款金额：">
                            <el-input v-model="formData.payAmount"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <!-- 标签页区 -->
            <div class="full-dialog-tabs-container">
                <el-tabs v-model="activeTabName">
                    <el-tab-pane label="收款类型" name="one">
                        <div class="my-container">
                            <div class="my-toolbar">
                                <el-button
                                    type="primary"
                                    size="small"
                                    icon="plus"
                                    @click="add()"
                                >新增行</el-button>
                                <el-button
                                    type="danger"
                                    size="small"
                                    icon="close"
                                    @click="del()"
                                >删除行</el-button>
                            </div>
                            <t8t-table
                                ref="t8ttable"
                                :columns="columns"
                                :commonData="commonOptionsConfig"
                                :templateData="templateData"
                                :selectCol="true"
                                :indexCol="true"
                                :editable="true"
                                :pageBar="false"
                            >
                            </t8t-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-dialog>
</template>

<script>

import commonApi from 'src/services/commonApi/commonApi.js'
import api from 'src/services/finance/payRemit.js'
import baseDate from 'src/services/finance/baseData.js'

import columns from './indexColumns.json'

import Cookie from 'js-cookie'



import Utils from 'src/utils/Utils.js'


import payMethodCfg from 'src/services/finance/payMethodConfig.js'



export default {

    name: 'page-pay-remit-dialog',
    data () {
        return {
            roleTypeArr: [],
            bankIdArr: [],
            bankInfoArr:[],
            isLoading: false,
            isDialogShow: true,
            activeTabName: 'one',
            formData: {
                organizationId:null,
                businessTypeCode:null,
                payObjectCode: null,
                payObjectId: null,
                userName: null,
                bankCode: null,
                payAmount: null,
                bankAccount: null,
                openingAccountName:null,
                createUser:  parseInt(Cookie.get('t8t-tc-uid')),
            },
            columns: columns.createList,
            //辅助资料配置
            commonOptionsConfig: {
                allPayCfg:[],
                orgOptions:[],
                businessOptions: [],
                payObjOptions: [],
                bankOptions: [],
                payOrganizationOptions: [],
                bankAccountOptions: [],
                sourceSystemModuleOption: [],
                sourceSystemOption:[],
                sourceOrderTypeOption: []

            },
            templateData: {
                "sourceOrderCode": null,
                "shouldRemitAmount": null,
                "createUser": parseInt(Cookie.get('t8t-tc-uid')),
                "projectId": null,
                "sourceSystemModuleCode": null,
                "sourceSystemCode": null,
                "sourceOrderTypeName": null,
                "prePayAmount":null,
                 "payTypeCode":null
            }
        }
    },
    methods: {
        submitForm(formRef) {
            let remitOrderItem = []
            this.isLoading = true
            let Form = this.formatFormData()
            let rows = this.fromatRows()
            if(rows.length > 0) {
            rows.forEach((item) => {
                remitOrderItem.push({
                    "createUser": parseInt(item.createUser),
                    "projectId":parseInt(item.projectId),
                    "shouldRemitAmount":parseFloat(item.shouldRemitAmount),
                    "sourceOrderCode": item.sourceOrderCode,
                    "sourceSystemModuleCode": item.sourceSystemModuleCode,
                    "sourceSystemCode": item.sourceSystemCode,
                    "sourceOrderTypeName": item.sourceOrderTypeName,
                    "prePayAmount":parseFloat(item.prePayAmount),
                    "payTypeCode":item.payTypeCode
                })
            })}
            Form.organizationId = parseInt(Form.organizationId)
            Form.payAmount = parseFloat(Form.payAmount)
            let args = {
                remitOrder: Form,
                remitOrderItem: remitOrderItem
            }
            api.remitSubmit(args)
                .then((res) => {
                    if(res.data.status === 200){
                        // 新增成功
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '新增成功',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.isLoading = false
                        this.closeDialog()
                    }else{
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: res.data.message,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.isLoading = false
                    }
                })
        },
        formatFormData(){
            var ret = Object.assign({}, this.formData)
            return ret
        },
        fromatRows(){
            let addedRows = this.$refs['t8ttable'].getActionLog(false).addedRows
            let rows = [].concat(addedRows)
            for(let i = 0; i < rows.length; i++){
                rows[i]['arriveAmount'] = +rows[i]['arriveAmount']
                rows[i]['projectId'] = +rows[i]['projectId']
            }
            return rows
        },
        closeDialog() {
            this.$router.push({ path: '/tochat-finance/page-pay-remit'})
            this.$emit('close')
        },
        //处理选择行变化
        add() {
            this.$refs['t8ttable'].addNewRow()
        },
        del() {
            this.$refs['t8ttable'].delRows()
        },
        //获取组织
        getAllOrganization(){
            let organizationArgs={
                search:{
                    id_gt: 0
                }
            }
            commonApi.queryAll(organizationArgs)
                .then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                            if (item.isDel===0) {
                                list.push({
                                    value: item.id,
                                    text: item.name
                                })
                            }
                            this.commonOptionsConfig.orgOptions = list
                        })
                    }
                }))
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
            commonApi.queryUnionParent(arg)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        if (item.propertyStatus===1) {
                            if(item.pPropertyCode == '61101') {
                                this.bankIdArr[item.propertyCode] = item.id
                            }
                            if(item.pPropertyCode == '61004') {
                                this.roleTypeArr[item.propertyCode] = item.id
                            }
                            if(item.pPropertyCode == "11605")
                            {
                                list.push({
                                    value: item.propertyName,
                                    text: item.propertyName
                                })
                            }else {
                                list.push({
                                    value: item.propertyCode,
                                    text: item.propertyName
                                })
                            }
                        };
                    })
                    this.commonOptionsConfig[selectName] = list
                }
            })
        },
        getBankInfo() {
            if(!this.formData.payObjectId)
            {
                this.$message.error('请输入付款对象ID')
                return false
            }
            if(!this.bankIdArr[this.formData.bankCode])
            {
                this.$message.error('请选择正确的开户银行')
                return false
            }
            if(!this.roleTypeArr[this.formData.payObjectCode])
            {
                this.$message.error('请选择正确的付款对象')
                return false
            }
            let args = {
                "page": 1,
                "size": 100,
                "search" : {
                    bankId : this.bankIdArr[this.formData.bankCode],
                    roleTypeId: this.roleTypeArr[this.formData.payObjectCode],
                    userId: this.formData.payObjectId,
                    status: 2
                }
            }
            baseDate.queryPage(args)
                .then((res => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                            list.push({
                                value: item.bankAccount,
                                text: item.bankAccount
                            })
                            this.bankInfoArr[item.bankAccount] = item
                        })
                        this.commonOptionsConfig.bankAccountOptions = list
                    }
                }))
        },
        setBankInfo() {
            this.formData.openingAccountName = this.bankInfoArr[this.formData.bankAccount].openingAccountName
        }
    },
    created() {
        this.getAllOrganization()
        this.getCommonOptions('11008', 'businessOptions')
        this.getCommonOptions('61101', 'bankOptions')

        this.getCommonOptions('61004', 'payObjOptions')//付款对象

        this.getCommonOptions('61006', 'allPayCfg')
        this.getCommonOptions('11011', 'sourceSystemModuleOption')
        this.getCommonOptions('11010', 'sourceSystemOption')
        this.getCommonOptions('11605', 'sourceOrderTypeOption')


    }
};
</script>

<style lang="css" scoped>
    .dialog-new.t8t-full-dialog .my-container{
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }
    .dialog-new.t8t-full-dialog .my-toolbar{
        margin-bottom: 15px;
    }
</style>
<style>
    .dialog-new.t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .dialog-new.t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .dialog-new.t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .dialog-new.t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }
    .dialog-new.t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .dialog-new.t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .dialog-new.t8t-full-dialog .toolbar-container .toolbar-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .dialog-new.t8t-full-dialog .toolbar-container .toolbar-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .dialog-new.t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .dialog-new.t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
    }
    .dialog-new.t8t-full-dialog .form-item-container{
        width: 25%;
    }
    .dialog-new.t8t-full-dialog .full-dialog-form-container{
        margin-top: 22px;
    }
    .dialog-new.t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .dialog-new.t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .dialog-new.t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .dialog-new.t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .dialog-new.t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .dialog-new.t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .dialog-new.t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .dialog-new.t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .dialog-new.t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
    }
    .dialog-new.t8t-full-dialog .el-tab-pane{
        display: flex;
        flex: 1;
        overflow: auto;
    }
    .dialog-new.t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }
</style>
