<template>
    <!-- 新增 -->
    <div>
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="templet-add-t8t-full-dialog">
            <div class="t8t-full-dialog-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @SUBMIT="submitForm"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <!-- 表单区 -->
                <div class="full-dialog-form-container container-center">
                    <el-form :model="hFormData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                        <div class="form-item-container">
                            <el-form-item label="业务类型：" prop="templetType">
                                <el-select v-model="hFormData.templetType" placeholder="--请选择--">
                                    <el-option v-for="item in commonOptionsConfig.businessTypes" :label="item.text" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="合同名称：" prop="templetName">
                                <el-select v-model="hFormData.templetName" placeholder="--请选择--" >
                                    <el-option v-for="item in commonOptionsConfig.templetName" :label="item.text" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="单据名称：" prop="billsName">
                                <el-select v-model="hFormData.billsName" placeholder="--请选择--" >
                                    <el-option v-for="item in commonOptionsConfig.billsName" :label="item.text" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="组织：" prop="templetOrganize">
                                <el-select v-model="hFormData.templetOrganize" placeholder="--请选择--">
                                    <el-option v-for="item in commonOptionsConfig.templetOrganize" :label="item.text" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <!-- <div class="form-item-container">
                            <el-form-item label="编码规则：" prop="templetCode">
                                <el-input v-model="hFormData.templetCode" ></el-input>
                            </el-form-item>
                        </div> -->
                        <div class="form-item-container">
                            <el-form-item label="属性：" prop="templetProperty">
                                <el-select v-model="hFormData.templetProperty" placeholder="--请选择--":change = "getTempletProperty(hFormData.templetProperty)">
                                    <el-option v-for="item in commonOptionsConfig.templetProperty" :label="item.text" :value="item.value" >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container" v-if="this.templetValue=='02'">
                            <el-form-item label="关联主合同：" prop="relatedContract">
                                <el-select v-model="hFormData.relatedContract" placeholder="--请选择--">
                                    <el-option v-for="item in commonOptionsConfig.relatedContract" :label="item.text" :value="item.value" >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item label="类型：" prop="receiptStyle">
                                <el-select v-model="hFormData.receiptStyle" placeholder="--请选择--" :change = "getCode(hFormData.receiptStyle)" >
                                    <el-option v-for="item in commonOptionsConfig.receiptStyle" :label="item.text" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>

                        <div class="form-item-container" v-if="(this.styleValue=='02')||(this.styleValue=='03')||(this.styleValue=='04')">
                            <el-form-item label="甲方：" prop="receiptFirst">
                                <el-select v-model="hFormData.receiptFirst" placeholder="--请选择--">
                                    <el-option v-for="item in commonOptionsConfig.receiptFirst" :label="item.text" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container" v-if="(this.styleValue=='03')||(this.styleValue=='04')">
                            <el-form-item label="乙方：" prop="receiptSecond">
                                <el-select v-model="hFormData.receiptSecond" placeholder="--请选择--">
                                    <el-option v-for="item in commonOptionsConfig.receiptFirst" :label="item.text" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container" v-if="(this.styleValue=='04')">
                            <el-form-item label="丙方：" prop="receiptThird">
                                <el-select v-model="hFormData.receiptThird" placeholder="--请选择--">
                                    <el-option v-for="item in commonOptionsConfig.receiptFirst" :label="item.text" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </div>
        </el-dialog>
    </div>

</template>

<script>

import CreateDialog from './create-dialog.vue'
import commonApi from 'src/services/commonApi/commonApi.js'
import Cookie from 'js-cookie'
import Service from 'src/services/commodule/Service.js'
import apiTempletSee from 'src/services/commodule/templet.js'
export default {

    name: 'templetAdd',
    data () {
        return {
            isLoading: false,
            isDialogShow: true,
            activeTabName: 'one',
            dialogVisible: false,
            templetCode:null,
            styleValue:null,
            templetValue:null,
            hFormData: {
                templetType: '',
                templetName: '',
                templetOrganize: '',
                templetCode: '',
                templetProperty: '',
                receiptStyle: '',
                receiptFirst: '',
                receiptSecond: '',
                receiptThird: '',
                billsName:'',
                relatedContract:'',
            },
            formRule: {
                templetType: [{ required: true, message: '请选择业务类型'}],
                templetName: [{ required: true, message: '请选择合同名称'}],
                billsName:[{required: true, message: '请选择单据名称'}],
                templetOrganize: [{ required: true, message: '请选择组织' }],
                templetProperty: [{ required: true, message: '请选择属性' }],
                relatedContract: [{ required: true, message: '请选择属性' }],
                receiptStyle: [{ required: true, message: '请选择类型'}],
                receiptFirst: [{ required: true, message: '请选择甲方'}],
                receiptSecond: [{ required: true, message: '请选择乙方'}],
                receiptThird: [{ required: true, message: '请选择丙方'}],

            },
            //辅助资料配置
            commonOptionsConfig: {
                businessTypes: [], // 业务类型
                templetProperty:[],//类别
                receiptStyle:[],//类型
                receiptFirst:[],//甲方、乙方、丙方
                templetName:[],//名称
                templetOrganize:[],//组织
                nameList:{},
                templetList:{},
                billsName:[],
                relatedContract:[],
            },

        }
    },
    created() {
        this.getContent('relatedContract')
        this.getNameList('39103','nameList')
        this.getNameList('39102','templetList')
        // 业务类型
        this.getCommonOptions('11008','businessTypes')
        //类别
        this.getCommonOptions('39102','templetProperty')
        //类型
        this.getCommonOptions('39103','receiptStyle')
        //甲方、乙方、丙方
        this.getCommonOptions('39001','receiptFirst')
        //合同名称
        this.getBillName()
        //单据名称
        this.getTempletName('11605','billsName')
        // 组织
        commonApi.queryAll({'search':{'typeCode':'001003004'}})
        .then((res => {
            let list = []
            if (res.data.status === 200) {
                res.data.result.rows.forEach((item) => {
                    if (item.isDel===0) {
                        list.push({
                            value: item.id,
                            text: item.name
                        })
                    };
                })
                this.commonOptionsConfig['templetOrganize'] = list
            }
        }))

    },
    methods: {
        submitForm(formRef) {
            var formFlag = false;
            var tableFlag = false;
            var hFormData =  this.hFormData
            var date =  Date.parse( new Date() ).toString()
            date = date.substr(0,10)


            this.$refs['formRef'].validate((isValid) => {
                if(isValid)
                {
                    formFlag = true;
                     var args = {
                        'modelbasic':{
                            'businessTypeId' : hFormData.templetType,
                            'contractBillId' : hFormData.billsName,
                            'organizeId' : hFormData.templetOrganize,
                            'contractKindId' : hFormData.templetProperty,
                            'contractTypeId' : hFormData.receiptStyle,
                            'contractNameId' : hFormData.templetName,
                            'firstRoleId' : hFormData.receiptFirst,
                            'secondRoleId' : hFormData.receiptSecond,
                            'thirdRoleId' : hFormData.receiptThird,
                            'fatherBasicId' : hFormData.relatedContract,
                            'createUser' : + Cookie.get('t8t-tc-uid'),
                            'createTime' : date,
                            }
                        }
                        apiTempletSee.createModelBasic(args)
                            .then((res) => {
                                if(res.data.status === 200){
                                    // 新增成功
                                    this.isLoading = false
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '新增成功',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    }).then(()=>{

                                         this.$router.push({path: 'see',query:{rowId:res.data.result}})

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
                                    this.isLoading = false
                                }
                            })
                }else {
                    return false
                }


            })
        },
        closeDialog() {
            this.$router.go(-1)
        },

        getContent:function(selectName)
        {
            let arg =  {}
            let list = []
            apiTempletSee.getAllContractName(arg)
            .then((res) => {
                console.log(res);
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        list.push({
                            value: item.id,
                            text: item.name
                        })
                    })
                    this.commonOptionsConfig[selectName] = list
                }
            })

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
                                text: item.propertyName,
                                code:item.propertyCode
                            })

                        };
                    })
                    this.commonOptionsConfig[selectName] = list
                }
            })
        },
        getNameList: function(fatherCode,selectList) {
            let arg =  {
                page: 1,
                search: {
                    pPropertyCode: fatherCode
                },
                size: 100
            }
            commonApi.queryUnionParent(arg)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        if (item.propertyStatus===1) {
                            this.commonOptionsConfig[selectList][item.id] = item.propertyCode
                        };
                    })

                }
            })
        },
        getBillName: function() {
            let arg =  {
            }
            let list = []
            apiTempletSee.getContractName(arg)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        list.push({
                                value: item.id,
                                text: item.name,
                            })
                    })
                    this.commonOptionsConfig.templetName = list

                }
            })
        },

        getTempletName:function(fatherCode,selectName){
            let arg =  {
                page: 1,
                search: {
                    pPropertyCode: fatherCode
                },
                size: 1000
            }
            let list = []
            commonApi.queryUnionParent(arg)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        if (item.propertyStatus===1) {
                            if(item.description === 'CONTRACT')
                            {
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
        create(){
             this.dialogVisible = true
        },
        getCode(value)
        {
            if(value){
                this.styleValue = this.commonOptionsConfig.nameList[value]
            }
        },
        getTempletProperty(value)
        {
            if(value){
                this.templetValue = this.commonOptionsConfig.templetList[value]
            }
        }

    },

};
</script>

<style lang="css" scoped>
    .add-t8t-full-dialog .my-container{
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }
    .add-t8t-full-dialog .my-toolbar{
        margin-bottom: 15px;
    }
</style>
<style>
    .templet-add-t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .templet-add-t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .templet-add-t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .templet-add-t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }
    .templet-add-t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .templet-add-t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .templet-add-t8t-full-dialog .toolbar-container .toolbar-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .templet-add-t8t-full-dialog .toolbar-container .toolbar-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .templet-add-t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .templet-add-t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
        position: relative;
    }
    .templet-add-t8t-full-dialog .form-item-container{
        width: 33%;
    }
    .templet-add-t8t-full-dialog .full-dialog-form-container{
        margin-top: 22px;
    }
    .templet-add-t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .templet-add-t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .templet-add-t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .templet-add-t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .templet-add-t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .templet-add-t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .templet-add-t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .templet-add-t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .templet-add-t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
    }
    .templet-add-t8t-full-dialog .el-tab-pane{
        display: flex;
        flex: 1;
        overflow: auto;
    }
    .templet-add-t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }
</style>
