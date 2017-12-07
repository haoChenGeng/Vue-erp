<template>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog">
        <div class="t8t-full-dialog-container">
            <!-- 顶部按钮区 -->
            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                    <t8t-toolbar
                        class="t8t-dark"
                        ref="toolbar"
                        @SUBMIT="submitForm()"
                    >
                    </t8t-toolbar>
                </div>
            </div>
            <!-- 表单区 -->
            <div class="full-dialog-form-container container-center">
                <el-form :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                    <div class="form-item-container">
                        <el-form-item label="财务组织：" prop="receiptOrgId">
                            <el-select v-model="formData.receiptOrgId" placeholder="--请选择--" :disabled="true">
                                <el-option v-for="item in commonData.organization" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="收款方式：" prop="receiptModeId">
                            <el-select v-model="formData.receiptModeId" placeholder="--请选择--">
                                <el-option v-for="item in commonData.receiptModeCode" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                     <div class="form-item-container">
                        <el-form-item label="到账金额：" prop="arriveAmount">
                            <el-input v-model="formData.arriveAmount" placeholder="最多保留两位小数" @change="handleArriveAmount"></el-input>
                        </el-form-item>
                    </div>
                     <div class="form-item-container">
                        <el-form-item label="到账时间：" prop="arriveTime">
                            <el-date-picker
                                v-model="formData.arriveTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                >
                            </el-date-picker>
                        </el-form-item>
                    </div>
                     <div class="form-item-container">
                        <el-form-item label="银行卡号：" prop="cardNo">
                            <el-input v-model="formData.cardNo" placeholder="银行卡号后4位"></el-input>
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
                                 v-model="formData.receiptVoucherUrl">
                                <el-button size="small">上传文件</el-button>
                            </el-upload>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <!-- 标签页区 -->
            <div class="full-dialog-tabs-container">
                <el-tabs v-model="activeTabName">
                    <el-tab-pane label="收款类型" name="one">
                       <div class="full-dialog-tabs-wrapper">
                            <t8t-table
                            ref="tablePay"
                            :columns="columns"
                            :editable="true"
                            :args="args"
                            :service="service"
                            :method="method"
                            :templateData="templateData"
                            :selectCol="selectCol"
                            :indexCol="indexCol"
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
// import PayTable from 'src/components/t8t-table/t8t-table.vue'
import apiCommon from 'src/services/commonApi/commonApi.js'
import Service from 'src/services/finance/Service.js'
import Cookie from 'js-cookie'
import apiReceiptPlanOrder from 'src/services/finance/receiptPlanOrder.js'
import Utils from 'src/utils/Utils.js'
import apiDebitChannel from 'src/services/finance/debitChannel.js'
import wkfApi from 'src/services/finance/hello.js'
export default {
    name: 'page-pay-plan-pay-dialog',
    components: {
        // PayTable
    },
    data () {
        return {
            isDialogShow: true,
            activeTabName: 'one',
            formData: {
                receiptModeId: null,
                receiptOrgId: null,
                arriveAmount: null,
                arriveTime: null,
                cardNo: null,
                receiptVoucherUrl: null,
                createUser: parseInt(Cookie.get('t8t-tc-uid')),
                remark: null
            },
            formRule: {
                receiptOrgId: [{ required: true, message: '请选择组织'}],
                receiptModeId: [{required: true, message: '请选择收款方式'}],
                arriveAmount: [
                    { required: true, message: '请输入收款金额' },
                    { pattern: /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '收款金额大于0，且至多保留2位小数' },
                    { pattern: /^((0|[1-9]\d{0,7})((\.[0-9]{1,2})?))$/, message: '数额整数位不能超过8位数' }
                ],
                arriveTime: [{required: true, message: '请输入到账时间' }],
                cardNo: [{ pattern: /^(\d{4})$/, required: true , message: "请输入银行卡号后4位"}],
                receiptVoucherUrl: [{ required: true, message: '请上传收款凭证'}]
            },
            //辅助资料配置
            commonData: {
                receiptModeCode: [],// 收款方式
                organization: []
            },
            //表格
            columns: [{
                prop: "bizName",
                label: "业务类型"
            }, {
                prop: "receiptRoleName",
                label: "收款对象"
            }, {
                prop: "receiptorId",
                label: "收款对象ID"
            }, {
                prop: "receiptorName",
                label: "收款对象名称"
            }, {
                prop:"receiptTypeName",
                label: "收款类型"
            }, {
                prop: "arriveAmount",
                label: "收款金额",
                editor: {
                    type: "input",
                    rules: [{
                        required: true,
                        message: "不能为空"
                    },{
                        pattern:  /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/,
                        message: "收款金额大于0，且至多保留两位小数"
                    },{
                        pattern: /^((0|[1-9]\d{0,7})((\.[0-9]{1,2})?))$/,
                        message: '数额整数位不能超过8位数'
                    }
                    ]
                }
            }, {
                prop: "projectId",
                label: "项目ID"
            }],
            templateData: {
                'arriveAmount': null
            },
            service: Service.RECEIPTPLANORDER.name,
            method: Service.RECEIPTPLANORDER.methods.QUERYPAGE,
            args: {
                search: {
                    id_in: []
                },
                sort: ['id_desc']
            },
            selectCol: false,
            indexCol: true,
            uploadURL: Utils.getUploadURL()
        }
    },
    created() {
        //获取搜索项下拉列表数据
        //收款方式
        let organizationId = this.$route.query.organization
        if (organizationId) {
            let args = {
                page:1,
                search: {
                    organizationId: organizationId,
                    status: 1,
                    channelType: 2
                },
                size: 100
            }
            this.getReceiptModeCode(args,'receiptModeCode')
        }
        //组织
        apiCommon.queryByFunctionCode({"funcCodes":["001004013","001004014"]})
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
                this.commonData['organization'] = list
            }
        }))
    },
    mounted() {
        //获取表格数据
        let ids = this.$route.query.selectIds
        let arr = []
        if(typeof(ids)==='string') {
            arr.push(ids)
        }
        else {
            arr = ids
        }
        this.args.search.id_in = arr
        this.args.sort = ['id_desc']
        //表单 组织
        this.formData.receiptOrgId = this.$route.query.organization
    },
    methods: {
        submitForm() {
            console.log('hello')
            this.$refs['formRef'].validate((isValid) => {
                if (!isValid){
                    console.log(0)
                    return false
                } else {
                    console.log("hhhf")
                    this.$refs['tablePay'].validate((isValid) => {
                        if (!isValid) {
                            console.log(1)
                            return false
                        }else {
                            console.log(2)
                            let tableEditRow = this.$refs['tablePay'].getActionLog(false).editedRows
                            let totalAmount = Number(this.formData.arriveAmount)
                            let itemsAmount = 0
                            for(let i=0;i<tableEditRow.length;i++) {
                                itemsAmount = itemsAmount + Number(tableEditRow[i].arriveAmount)
                            }
                            if (itemsAmount.toFixed(2)!==totalAmount.toFixed(2)) {
                                //金额不等验证
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: '金额不一致，请修改。',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                            else {
                                let tableData = []
                                for(let i=0;i<tableEditRow.length;i++) {
                                    let item = {}
                                    item.arriveAmount = tableEditRow[i].arriveAmount
                                    item.receiptPlanOrderId = tableEditRow[i].id
                                    item.receiptTypeId = tableEditRow[i].receiptTypeId
                                    tableData.push(item)
                                }

                                let args = {
                                    "req":{
                                        "idOrKey":"financeReceiptCheck",
                                        "startById":0,
                                        "starter": Cookie.get('t8t-tc-uid'),
                                        "workflow": {
                                            "url": '/biz/t8t-fi-rvm/app',
                                            "method": 'verify.order.item.create.by.receipt',
                                            "formkey": "http://scm.to8to.com/#/finance/page-pay-plan"
                                        },
                                        "biz":{
                                            "receiptOrderCreateDTO": this.formatFormData(),
                                            "receiptItemRelCreateDTOs": tableData
                                        }
                                    }
                                }

                               this.$refs['toolbar'].disableBySymbol('SUBMIT')
                                wkfApi.start(args)
                                .then((res) => {
                                    this.$refs['toolbar'].unDisableBySymbol('SUBMIT')
                                    if (res.data.status === 200) {
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'success',
                                            message: "提交成功",
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        }).then(action=>{
                                            if (action==='confirm') {
                                                this.$router.replace('/tochat-finance/page-pay-plan')
                                            }
                                        })
                                    }
                                    else{
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'error',
                                            message: res.data.message.split('|||')[0],
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                    }
                                });

                            }
                        }
                    })
                }
            })
            console.log('什么鬼')
        },
        closeDialog() {
            this.$router.go(-1)
        },
        //upload
        handleRemove(file, fileList) {
        },
        beforeUpload(file){
            if(file.size > 1024*1024*5){
                this.$message.error('图片大小超过5M！')
                this.$refs['imgRef'].clearFiles()
                return false
            }
        },
        handleSuccess(res, fileList) {
            if(res.status === 200){
                this.formData.receiptVoucherUrl = res.result.filePath
                this.$refs['formRef'].validateField('receiptVoucherUrl')
            }else if(res.status === 613){
                this.$refs['imgRef'].clearFiles()
                this.$message.error('请检查图片后缀(小写)！')
            }
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
            apiCommon.queryUnionParent(arg)
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
                    this.commonData[selectName] = list
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
                        this.commonData[selectName] = list
                    }
                })
        },
        //格式化表单
        formatFormData(){
            var ret = Object.assign({}, this.formData)
            ret.arriveAmount = +ret.arriveAmount
            ret.arriveTime = +Date.parse(ret.arriveTime).toString().substr(0,10)
            return ret
        },
        //根据到账金额自动填充单行的收款金额
        handleArriveAmount(value) {
            if (this.args.search.id_in.length===1) {
                let arr =  Object.assign({},this.$refs['tablePay'].dataSource)
                arr[0].arriveAmount=value
                this.$set(this.$refs['tablePay'].dataSource,0,arr[0])
            }
        }
    },
};
</script>

<style lang="css" scoped>
    .t8t-full-dialog{

    }
</style>
<style>
    .t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .t8t-full-dialog .t8t-table .table-container{
        margin-left: 0
    }
    .t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }
    .t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .t8t-full-dialog .toolbar-container .toolbar-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog .toolbar-container .toolbar-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
    }
    .t8t-full-dialog .form-item-container{
        width: 25%;
    }
    .t8t-full-dialog .full-dialog-form-container{
        margin-top: 22px;
    }
    .t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
/*        width: 1220px;
        margin: 0 auto;*/
    }
    .t8t-full-dialog .el-tab-pane{
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        overflow: auto;
    }
    /* 弹窗tab里面的表格定位 */
    .full-dialog-tabs-wrapper {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }
</style>
