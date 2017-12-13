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
                        ref="toolbar"
                    >
                    </t8t-toolbar>
                </div>
            </div>
            <!-- 表单区 -->
            <div class="full-dialog-form-container container-center">
                <el-form :model="hFormData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                    <div class="form-item-container">
                        <el-form-item label="收款组织：" prop="receiptOrgId">
                            <el-select v-model="hFormData.receiptOrgId" placeholder="--请选择--">
                                <el-option v-for="item in commonOptionsConfig.organizations" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="收款方式：" prop="receiptModeId">
                            <el-select v-model="hFormData.receiptModeId" placeholder="--请选择--">
                                <el-option v-for="item in commonOptionsConfig.type" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="到账金额：" prop="arriveAmount">
                            <el-input v-model="hFormData.arriveAmount" placeholder="最多保留两位小数"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="到账时间：" prop="arriveTime">
                            <el-date-picker v-model="hFormData.arriveTime" type="datetime" placeholder="请选择到账时间"></el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="银行卡号：" prop="cardNo">
                            <el-input v-model="hFormData.cardNo" placeholder="银行卡号后4位"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="收款凭证：" prop="receiptVoucherUrl">
                            <el-upload
                                ref="imgRef"
                                :action="uploadURL"
                                :data="{bucket:'scm', module: 'finance'}"
                                :show-file-list="true"
                                :on-remove="handleRemove"
                                :on-success="handleSuccess"
                                :before-upload="beforeUpload"
                                accept="image/*"
                                v-model="hFormData.receiptVoucherUrl">
                                <el-button size="small">上传文件</el-button>
                            </el-upload>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="备注：" prop="item7">
                            <el-input v-model="hFormData.remark" placeholder=""></el-input>
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
                                @cell-form-item-change="onChange"
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
import columns from './dialog.js'
import columns2 from './dialog2.js'
import demoData from './data.json'
import commonApi from 'src/services/commonApi/commonApi.js'
import Cookie from 'js-cookie'
import api from 'src/services/finance/bills.js'
import wkfApi from 'src/services/finance/hello.js'
import Utils from 'src/utils/Utils.js'
import apiDebitChannel from 'src/services/finance/debitChannel.js'
import apiDebitType from 'src/services/finance/debitType.js'
export default {

    name: 'page-pay-bills-dialog',
    data () {
        return {
            flag: true,
            isLoading: false,
            isDialogShow: true,
            activeTabName: 'one',
            hFormData: {
                receiptOrgId: '',
                receiptModeId: '',
                arriveAmount: '',
                arriveTime: '',
                cardNo: '',
                receiptVoucherUrl: '',
                remark: '',
                createUser: +Cookie.get('t8t-tc-uid')
            },
            formRule: {
                receiptOrgId: [{ required: true, message: '请选择收款组织'}],
                receiptModeId: [{ required: true, message: '请选择收款方式'}],
                arriveAmount: [{ required: true, message: '正数,最多保留两位小数' },{ pattern: /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '正数,最多保留两位小数' },{ pattern: /^((0|[1-9]\d{0,7})((\.[0-9]{1,2})?))$/, message: '数额整数位不能超过8位数' }],
                arriveTime: [{ type: 'date', required: true, message: '请输入到账时间' }],
                cardNo: [{ pattern: /^(\d{4})$/, required: true, message: '请输入银行卡号后4位'}],
                receiptVoucherUrl: [{ required: true, message: '请上传收款凭证'}]
            },
            options: [
                {label: '是', value: 0},
                {label: '否', value: 1}
            ],
            columns: columns,
            //辅助资料配置
            commonOptionsConfig: {
                organizations: [], // 组织机构
                businessTypes: [], // 业务类型
                debitObjects: [], // 收款对象
                debitTypes: [], // 收款类型
                type: [],
            },
            templateData: {
                "bizId": null,
                "receiptRoleId": null,
                "receiptorId": null,
                "receiptorName": null,
                "receiptTypeId": null,
                "arriveAmount": null,
                "projectId": null
            },
            uploadURL: Utils.getUploadURL()
        }
    },
    watch: {
        'hFormData.receiptOrgId': function (val) {
            // 收款方式
            let args = {
                page:1,
                search: {
                    organizationId: val,
                    status: 1,
                    channelType: 2
                },
                size: 100
            }
            this.getReceiptModeCode(args,'type')
        }
    },
    methods: {
        beforeUpload(file){
            if(file.size > 1024*1024*5){
                this.$message.error('图片大小超过5M！')
                this.$refs['imgRef'].clearFiles()
                return false
            }
        },
        submitForm(symbol) {
            var formFlag = false;
            var tableFlag = false;
            this.$refs['formRef'].validate((isValid) => {
                if (isValid){
                    formFlag = true
                }
            })
            this.$refs['t8ttable'].validate((isValid) => {
                if (isValid) {
                    tableFlag = true
                }
                if(formFlag && tableFlag){
                    this.isLoading = true
                    var hForm = this.formatFormData()
                    var rows = this.fromatRows()
                    if(!this.isSumEqu(hForm,rows)){
                        this.$msgbox({
                            title: '消息',
                            type: 'warning',
                            message: '金额不一致，请修改',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        return false
                    }
                    var args = {
                            "req":{
                                "idOrKey":"financeReceiptCheck",
                                "startById":0,
                                "starter": Cookie.get('t8t-tc-uid'),
                                "workflow": {
                                    "url": '/biz/t8t-fi-rvm/app',
                                    "method": 'receipt.order.item.create',
                                    "formkey": "http://scm.to8to.com/#/finance/page-pay-bills"
                                },
                                "biz":{
                                    receiptOrderCreateDTO: hForm,
                                    receiptOrderItemCreateDTOs: rows
                                }
                            }
                        }
                    this.$refs['toolbar'].disableBySymbol(symbol)
                    wkfApi.start(args)
                    .then((res) => {
                        this.$refs['toolbar'].unDisableBySymbol(symbol)
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
                                message: res.data.message.split('|||')[0],
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.isLoading = false
                        }
                    })
                }
            })

        },
        formatFormData(){
            var ret = Object.assign({}, this.hFormData)
            ret.arriveAmount = +ret.arriveAmount
            ret.arriveTime = +Date.parse(ret.arriveTime).toString().substr(0,10)
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
        isSumEqu(hForm,rows) {
            var sum = 0;
            for (let i = rows.length - 1; i >= 0; i--) {
                sum += rows[i]['arriveAmount']
            }
            if(hForm.arriveAmount.toFixed(2) === sum.toFixed(2)){
                return true
            }
            return false
        },
        closeDialog() {
            this.$router.go(-1)
        },
        handleSuccess(res, fileList) {
            if(res.status === 200){
                this.hFormData.receiptVoucherUrl = res.result.filePath
                this.$refs['formRef'].validateField('receiptVoucherUrl')
            }else if(res.status === 613){
                this.$refs['imgRef'].clearFiles()
                this.$message.error('请检查图片后缀(小写)！')
            }
        },
        //处理选择行变化
        add() {
            this.$refs['t8ttable'].addNewRow()
        },
        del() {
            // console.log(this.$refs['t8ttable'])
            this.$refs['t8ttable'].delRows()
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
                            list.push({
                                value: item.id,
                                text: item.propertyName
                            })
                        };
                    })
                    this.commonOptionsConfig[selectName] = list
                }
            })
        },
        getReceiptType: function(selectName){
            let list = []
            let args = {
                page: 1,
                size: 100,
                search: {
                    status: 1
                }
            }
            apiDebitType.queryPage(args)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.rows.forEach((item) => {
                        list.push({
                            value: item.debitTypeId,
                            text: item.name
                        })
                    })
                    this.commonOptionsConfig[selectName] = list
                }
            })
        },
        getReceiptModeCode: function(args,selectName){
            let list = []
            apiDebitChannel.queryPage(args)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.rows.forEach((item) => {
                        list.push({
                            value: item.channelId,
                            text: item.name
                        })
                    })
                    this.commonOptionsConfig[selectName] = list
                }
            })
        },
        onChange(cell, val){
            if(cell.column.property !== 'receiptTypeId')return
            let args = {
                page: 1,
                size: 100,
                search: {
                    debitTypeCodeId: val
                }
            }
            apiDebitType.queryPage(args)
            .then((res) => {
                if (res.data.status === 200) {
                    let myRow = res.data.result.rows[0]
                    cell.row.bizId = myRow.businessTypeId
                    cell.row.receiptRoleId = myRow.debitObjectId
                }
            })
            // let args = {
            //         page: 1,
            //         size: 100,
            //         search: {
            //             businessTypeId: cell.row.bizId,
            //             debitObjectId: cell.row.receiptRoleId,
            //             status: 1
            //         }
            //     }
            // if(cell.column.property === 'bizId'){
            //     args.search.businessTypeId = val
            //     cell.row.receiptTypeId = ''
            // }
            // if(cell.column.property === 'receiptRoleId'){
            //     args.search.debitObjectId = val
            //     cell.row.receiptTypeId = ''
            // }
            // if(cell.column.property === 'bizId' || cell.column.property === 'receiptRoleId'){
            //     apiDebitType.queryPage(args)
            //     .then((res) => {
            //         if (res.data.status === 200) {
            //             let list = []
            //             res.data.result.rows.forEach((item) => {
            //                 list.push({
            //                     value: item.debitTypeId,
            //                     text: item.name
            //                 })
            //             })
            //             this.commonOptionsConfig['debitTypes'] = list
            //         }
            //     })
            // }
        }
    },
    created() {
        let query = this.$route.query
        // 调整配置
        if(query.mode === 'tz') {
            this.columns = columns2
            this.formRule.arriveAmount = [{ required: true, message: '输入正确金额,最多保留两位小数' },{ pattern: /^(\-?(0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '输入正确金额,最多保留两位小数' },{ pattern: /^(\-?(0|[1-9]\d{0,7})((\.[0-9]{1,2})?))$/, message: '数额整数位不能超过8位数' }]
        }
        // 业务类型
        this.getCommonOptions('11008','businessTypes')
        // 收款类型
        this.getReceiptType('debitTypes')
        // 收款对象
        this.getCommonOptions('61004','debitObjects')
        // 组织
        commonApi.queryByFunctionCode({"funcCodes":["001004013","001004014"]})
        .then((res => {
            let list = []
            if (res.data.status === 200) {
                res.data.result.forEach((item) => {
                    if (item.isDel===0) {
                        list.push({
                            value: item.id,
                            text: item.name
                        })
                    };
                })
                this.commonOptionsConfig['organizations'] = list
            }
        }))

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
