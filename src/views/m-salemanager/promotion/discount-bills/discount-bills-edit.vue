<template>
    <div>
    <el-dialog
            @close="closeDialog"
            v-model="isDialogShow"
            size="full"
            class="discount-bills-t8t-full-dialog"
    >
    <div class="t8t-full-dialog-container">
        <!-- 顶部按钮区 -->
        <div class="full-dialog-toolbar-container">
            <div class="toolbar-container">
                <t8t-toolbar
                    class="t8t-dark"
                    @SAVE="tempsave"
                    :disabledSymbols="disabledSymbols"
                >
                </t8t-toolbar>
            </div>
        </div>
        <div class="full-dialog-form-container container-center">
            <el-form :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">

                    <div class="form-item-container">
                         <el-form-item label="现金优惠单编码：" >
                            <el-input v-model="formData.code" disabled ></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                            <el-form-item label="现金优惠名称：">
                                <el-input v-model="formData.templateName" disabled></el-input>
                            </el-form-item>
                        </div>
                    <div class="form-item-container">
                         <el-form-item label="状态：">
                            <el-select v-model="formData.status"   placeholder="--请选择--" disabled>
                                <el-option v-for="item in commonOptionsConfig.status" :label="item.text" :value="item.value" >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="项目ID：" prop="bindId">
                            <el-input v-model="formData.bindId" icon="search" readonly @click="showProject"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container" >
                        <el-form-item label="使用组织：" prop="organizationName" >
                            <el-input v-model="formData.organizationName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="支付款项用途：" prop="payment" >
                            <el-select v-model="formData.payment"   placeholder="--请选择--">
                                <el-option v-for="item in commonOptionsConfig.effectivePayment" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="优惠金额：" prop="privilegeAmount">

                            <el-input v-model="formData.privilegeAmount" :disabled="formData.parValueType==1" ></el-input>
                        </el-form-item>
                    </div>
            </el-form>
        </div>
    </div>
    </el-dialog>
        <add-project
            v-if="versionVisible"
            @close="versionVisible=false"
            @select="selectProject"
            :projectId = "formData.bindId"
        >
        </add-project>
    </div>
</template>
<script>
    import AddProject from './add-project.vue'
    import Cookie from 'js-cookie'
    import cashDiscountApi from 'src/services/salemanager/cashDiscount.js'
    import Service from 'src/services/salemanager/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'

    export default{
        components: {
                AddProject
            },
        data(){
            return{
                validAmount:[],
                disabledSymbols:[],
                versionVisible:false,
                isDialogShow: true,
                formData:{
                    code:null,
                    templateId:null,
                    templateName:null,
                    status:null,
                    bindId:null,
                    organization:null,
                    organizationName:null,
                    payment:null,
                    privilegeAmount:null,
                    parValueType:null,

                },
                commonOptionsConfig: {
                    status:[{
                            text: '未使用',
                            value: 0
                        },{
                            text: '审核',
                            value: 1
                        },{
                            text: '已使用',
                            value: 2
                        },{
                            text: '无效',
                            value: 3
                        }],
                    effectivePayment:[],
                    bindLimit:[],
                    effectiveOrg:[],
                    fundUse:[],

                },
                formRule: {
                    bindId: [{required: true,message: "请选择项目"}],
                    payment: [{required: true,message: "请选择支付款项用途"}],
                    privilegeAmount: [{required: true,pattern: /^[1-9](\d+)?(\.\d?[0-9])?$|^0\.\d?[0-9]$/,message: "请输入正整数或者两位小数"}],
                },

            }
        },
        created() {
           this.getDiscountBillData(this.$route.query.rowId)
        },
        mounted () {
        },
        methods:{
            closeDialog() {
                this.$router.push({path: '/salemanager/discount-bills'})

            },

            showProject()
            {

                this.versionVisible = true
            },


            queryDetailPageById(id)
            {
                let arg = {
                    search:{
                        id:id,
                    },
                    fields:["id","ownerId","organizationId","organizationName",'ownerName','houseAddress',],
                    sort:["id_desc"],
                    page:1,
                    size:10
                }
                cashDiscountApi.queryDetailPage(arg).then((res) => {
                    if (res.data.status === 200) {
                        this.formData.organizationName = res.data.result.rows[0].decorationOrderVO.organizationName
                        this.formData.organization = res.data.result.rows[0].decorationOrderVO.organizationId
                    }
                })
            },
            changeInt(strCase)
            {
                let str = ''
                if(strCase)
                {
                    str = []
                    let strs= [] //定义一数组

                    if(strCase)
                    {
                        strs = strCase.split(","); //字符分割
                    }
                    for(let i = 0;i<strs.length;i++)
                    {
                        str[i] = parseInt(strs[i])
                    }
                }
                return str
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
                                if(this.validAmount.indexOf(item.id) !== -1){
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            };
                        })
                        this.commonOptionsConfig[selectName] = list
                    }
                })
            },
            getDiscountData(rowId) {
                let args = {
                        templateId: rowId
                }
                cashDiscountApi.getOne(args)
                    .then((res) => {
                    if (res.data.status === 200) {
                        this.$set(this.formData, 'parValueType', res.data.result.parValueType)
                        this.validAmount = this.changeInt(res.data.result.effectivePayment)
                        this.getCommonOptions('61003','effectivePayment')
                    }

                })
            },
            getDiscountBillData(rowId) {
                let args = {
                        orderId: rowId
                }
                cashDiscountApi.getOrder(args)
                    .then((res) => {
                    if (res.data.status === 200) {
                            this.formData = res.data.result
                            this.getDiscountData(res.data.result.templateId)
                    }

                })
            },
            tempsave()
            {
                var formFlag = false;
                this.$refs['formRef'].validate((isValid) => {
                if(isValid)
                {
                        this.disabledSymbols = this.disabledSymbols.concat('SAVE')
                        formFlag = true;
                        var formData =  this.formData

                         var args = {
                            'updateDto':{
                                'id':this.$route.query.rowId,
                                'templateId' : formData.templateId,
                                'organization' : formData.organization,
                                'payment' : formData.payment,
                                'bindId' : formData.bindId,
                                'privilegeAmount' : formData.privilegeAmount,
                                },
                                'updateUserId':+ Cookie.get('t8t-tc-uid'),
                            }
                            cashDiscountApi.updateOrder(args)
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        // 新增成功
                                        this.isLoading = false
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'success',
                                            message: '保存成功',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        }).then(()=>{

                                             this.$router.push({path: '/salemanager/discount-bills'})

                                        })

                                    }else{
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'error',
                                            message: res.data.message,
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                        this.disabledSymbols.pop()
                                        this.isLoading = false

                                    }


                                })
                    }else {
                        return false
                    }


                })
            },
            selectProject(row) {
                this.formData.bindId = row.id
                this.queryDetailPageById(row.id)
            }

        }

    }


</script>
<style
    lang="css"
    scoped
>


    .discount-bills-t8t-full-dialog .my-container{
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }
    .discount-bills-t8t-full-dialog .my-toolbar{
        margin-bottom: 15px;
    }


</style>
<style>

    .discount-bills-t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .discount-bills-t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .discount-bills-t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .discount-bills-t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        display: flex;
        margin-bottom: 20px;
    }
    .discount-bills-t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .discount-bills-t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: -ms-flexbox;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .discount-bills-t8t-full-dialog .toolbar-container .toolbar-button{
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
    .discount-bills-t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .discount-bills-t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
    }

    .discount-bills-t8t-full-dialog .form-item-container{
         width: 25%;
    }
    .discount-bills-t8t-full-dialog .full-dialog-form-container{
        margin-top: 22px;
    }
    .discount-bills-t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .discount-bills-t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .discount-bills-t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .discount-bills-t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .discount-bills-t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .discount-bills-t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .discount-bills-t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .discount-bills-t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .discount-bills-t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
/*        width: 1220px;
        margin: 0 auto;*/
    }
    .discount-bills-t8t-full-dialog .el-tab-pane{
        display: flex;
        flex: 1;
        flex-wrap: wrap;
    }
    /* 顶部tab */
    .discount-bills-t8t-full-dialog .full-dialog-form-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .discount-bills-t8t-full-dialog .full-dialog-form-container .el-tabs__header {
        border-top: 0;
        border-bottom: 0;
    }
    /* 弹窗tab里面的表格定位 */
    .discount-bills-t8t-full-dialog .full-dialog-tabs-container .wordTab .el-tabs__content{
        flex: 1;
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
    }
    .discount-bills-t8t-full-dialog .full-dialog-tabs-container .wordTab .el-tab-pane {
        flex: none !important;
        width: 100% !important;
        height: 100% !important;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .discount-bills-t8t-full-dialog .el-tab-pane
    .t8t-toolbar {
        position: absolute;
        left: 30px;
        right: 30px;
        padding: 10px 0!important;
        margin: 0 auto!important;
    }

    .discount-bills-t8t-full-dialog .full-dialog-form-container .el-tabs .el-tabs__content .el-date-editor.el-input
    {
        width: 180px;
    }


</style>
