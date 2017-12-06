<template>
    <div class="contract-wrapper">
        <el-form
            label-position="right"
            label-width="110px"
            :model="formData"
            :rules="formRule"
            :inline="true"
            ref="form"
        >
            <div class="field_container">
                <section>
                    <h1>基本信息</h1>
                    <el-form-item label="业主姓名:" prop="realName">
                        <el-input v-model.trim="formData.realName" :readonly="isReadonly"></el-input>
                    </el-form-item>
                    <el-form-item label="业主手机号码:" prop="reservedMobile">
                        <el-input v-model.trim="formData.reservedMobile" :readonly="isReadonly"></el-input>
                    </el-form-item>
                    <el-form-item label="业主身份证号码:" prop="identity">
                        <el-input v-model.trim="formData.identity" :readonly="isReadonly"></el-input>
                    </el-form-item>
                    <el-form-item label="业主邮箱:" prop="ownerEmail">
                        <el-input v-model.trim="formData.ownerEmail" :readonly="isReadonly"></el-input>
                    </el-form-item>
                    <el-form-item label="业主银行卡号:" prop="bankCardNumber">
                        <el-input v-model.trim="formData.bankCardNumber" :readonly="isReadonly"></el-input>
                    </el-form-item>
                </section>

                <section>
                    <h1>项目信息</h1>
                    <el-form-item label="甲方(业主)委派人:" prop="agentName">
                        <el-input v-model.trim="formData.agentName" :readonly="isReadonly"></el-input>
                    </el-form-item>
                    <el-form-item label="委派人手机号码:" prop="agentPhone">
                        <el-input v-model.trim="formData.agentPhone" :readonly="isReadonly"></el-input>
                    </el-form-item>
                    <el-form-item label="委派人身份证号:" prop="agentIdNumber">
                        <el-input v-model.trim="formData.agentIdNumber" :readonly="isReadonly"></el-input>
                    </el-form-item>
                    <el-form-item label="项目设计师:" prop="projectDesigner">
                        <el-input v-model.trim="formData.projectDesigner" :readonly="isReadonly"></el-input>
                    </el-form-item>
                    <el-form-item label="设计师联系电话:" prop="designerPhone">
                        <el-input v-model.trim="formData.designerPhone" :readonly="isReadonly"></el-input>
                    </el-form-item>
                    <el-form-item label="合同报价:" prop="contractOffer">
                        <el-input v-model.trim="formData.contractOffer" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="计价面积:" prop="valuationArea">
                        <el-input v-model.trim="formData.valuationArea" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="住所地址:" prop="address">
                        <el-tooltip class="item" effect="dark" :content="formData.address" placement="bottom">
                            <el-input v-model.trim="formData.address" :readonly="isReadonly"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="施工图纸采用方式:" prop="drawOption">
                        <el-select
                            v-model="formData.drawOption"
                            placeholder="--请选择--" clearable
                            @change="drawOptionChange"
                            :disabled="isReadonly"
                        >
                            <el-option label="a" value="1"></el-option>
                            <el-option label="b" value="2"></el-option>
                        </el-select>
                        <div class="el-form-item__error drawOptionTips" style="height: 20px">{{ drawOptionTips }}</div>
                    </el-form-item>
                    <el-form-item label="交图时间:" prop="picDueTime" v-if="formData.drawOption == 1">
                        <el-date-picker
                            v-model="formData.picDueTime"
                            type="date"
                            placeholder="--选择交图时间--"
                            :clearable="clearable"
                            :readonly="isReadonly"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="付款方式:" prop="paymentMode">
                        <el-select v-model="formData.paymentMode" placeholder="--请选择--" clearable :disabled="isReadonly">
                            <el-option label="全额付款" value="B"></el-option>
                            <el-option label="分期付款" value="A"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目地址:" prop="projectAddress" v-if="isReadonly">
                        <el-tooltip class="item" effect="dark" :content="formData.projectAddress" placement="bottom">
                            <el-input v-model.trim="formData.projectAddress" :readonly="isReadonly"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="区域" prop="townIdArray" v-if="!isReadonly">
                        <t8t-division-old
                            :changeOnSelect="true"
                            :filterable="true"
                            :clearable="true"
                            v-model="formData.townIdArray"
                            :placeholder="选择区域"
                        >
                        </t8t-division-old>
                    </el-form-item>
                    <el-form-item prop="estateId" class="owner-add-input" v-if="!isReadonly" label="楼 盘">
                        <el-select
                            v-model="formData.estateName"
                            filterable
                            remote
                            placeholder="请选择楼盘"
                            @change="handleSelect"
                            :remote-method="querySearchAsync">
                            <el-option
                                v-for="item in searchOptions"
                                :key="item.id"
                                :label="item.value"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <el-input v-model="formData.estateId" style="display: none"></el-input>
                    </el-form-item>
                    <el-form-item label="房号" prop="projectAddress" class="owner-add-input" v-if="!isReadonly">
                        <el-input v-model="formData.projectAddress" auto-complete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="施工期限:" prop="constructionPeriod">
                        <el-input v-model.trim="formData.constructionPeriod" :readonly="isReadonly"></el-input>
                    </el-form-item>
                    <el-form-item label="开工日期:" prop="startDate">
                        <el-date-picker
                            v-model="formData.startDate"
                            type="date"
                            placeholder="--选择开工日期--"
                            :clearable="clearable"
                            :readonly="isReadonly"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="竣工日期:" prop="completionDate">
                        <el-date-picker
                            v-model="formData.completionDate"
                            type="date"
                            placeholder="--选择竣工日期--"
                            :clearable="clearable"
                            :readonly="isReadonly"
                        >
                        </el-date-picker>
                    </el-form-item>
                </section>
            </div>
        </el-form>
    </div>
</template>

<script>
    import { checkPhone, checkIentityNumber } from './config'
    import ServiceApi from 'src/services/salemanager/Service.js'
    import Service from 'src/services/salemanager/salemanager.js'
    import axios from 'src/utils/axios.js'
    export default {
        name: 'contract-form',
        data() {
            return {
                // 表单数据
                formData: {
                    realName: null,
                    reservedMobile: null,
                    identity: null,
                    ownerEmail: null,
                    bankCardNumber: null,
                    agentName: null,
                    agentPhone: null,
                    agentIdNumber: null,
                    projectDesigner: null,
                    designerPhone: null,
                    contractOffer: null,
                    address: null,
                    drawOption: null,
                    picDueTime: null,
                    paymentMode: null,
                    projectAddress: null,
                    constructionPeriod: null,
                    startDate: null,
                    completionDate: null,
                    ownerId: null,
                    estateId : null,
                    estateName: '',
                    cityId : null,
                    townId : null,
                    townIdArray:[],
                },
                searchOptions:[],
                // 表单校验规则
                formRule: {
                    realName: [
                        { required: true , message: "请填写业主姓名", trigger: 'blur' },
                    ],
                    reservedMobile: [
                        { required: true , message: "请填写业主手机号码", trigger: 'blur' },
                        { validator: checkPhone, trigger: 'blur'}
                    ],
                    identity: [
                        { required: true , message: "请填写业主身份证号", trigger: 'blur' },
                        { validator: checkIentityNumber, trigger: 'blur'}
                    ],
                    ownerEmail: [
                        { required: true , message: "请填写业主邮箱", trigger: 'blur' }
                    ],
                    bankCardNumber: [
                        { required: true , message: "请填写业主银行卡号", trigger: 'blur' }
                    ],
                    projectDesigner: [
                        { required: true , message: "请填写项目设计师", trigger: 'blur' }
                    ],
                    designerPhone: [
                        { required: true , message: "请填写设计师联系电话", trigger: 'blur' },
                        { validator: checkPhone, trigger: 'blur'}
                    ],
                    paymentMode: [
                        { required: true , message: "请填写付款方式", trigger: 'blur' }
                    ],
                    address: [
                        { required: true , message: "请填写住所地址", trigger: 'blur' }
                    ],
                    projectAddress: [
                        { required: true , message: "请填写项目门牌号", trigger: 'blur' }
                    ],
                    estateId: [
                        {   type: 'number',
                            required: true,
                            message: '请选择楼盘',
                        },
                    ],
                    townIdArray:[
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                if(value.length > 2) {
                                    callback()
                                }else{
                                    callback(false)
                                }
                            },
                            message: '请选择业主所住区域',
                        },
                    ],
                    constructionPeriod: [
                        { required: true , message: "请填写施工期限", trigger: 'blur' }
                    ],
                    agentPhone: [
                        { validator: checkPhone, trigger: 'blur'}
                    ],
                    agentIdNumber: [
                        { validator: checkIentityNumber, trigger: 'blur'}
                    ],
                    startDate: [
                        { type: 'date', required: true , message: "请填写开工日期", trigger: 'change' }
                    ],
                    completionDate: [
                        { type: 'date', required: true , message: "请填写竣工日期", trigger: 'change' }
                    ],
                    picDueTime: [
                        { type: 'date', required: true , message: "请填写交图时间", trigger: 'change' }
                    ],
                    drawOption: [
                        { required: true , message: "请选择施工图纸采用方式", trigger: 'change' }
                    ],
                },
                // 选择施工图纸采用方式的提示
                drawOptionTips: '',
                isReadonly: false
            }
        },
        props: {
            isReadonly: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            isReadonly(val) {
                if (val) {
                    this.formRule = {}
                }
            }
        },
        methods: {
            /* 获取表单的引用 */
            getFormInstance()
            {
                return this.$refs.form
            },
            onChange(val){
                this.formData.estateId = null
                this.formData.estateId = parseInt(val)
            },
            // 施工方式的change事件
            drawOptionChange(value)
            {
                switch (value) {
                    case '1': this.drawOptionTips = '甲方自行设计并提供施工图纸,图纸一式三份，甲方一份，乙方二份'; break
                    case '2': this.drawOptionTips = '甲方委托乙方设计施工图纸，图纸一式三份，甲方、乙方、项目经理各执一份'; break
                    default: this.drawOptionTips = ''
                }
            },
            querySearchAsync(queryString) {
                let self = this
                queryString += ""
                let args = {
                    "page":1,
                    "size":20,
                    "search":{
                        "estateName":queryString,
                        "id_gt":0
                    },
                    "sort":[
                        "id_desc"
                    ]}
                axios({
                    service: ServiceApi.SALES.name,
                    method: ServiceApi.SALES.methods.QUERY_ESTATE_PAGE,
                    args: args
                }).then((res) => {
//                    console.log(res)
                    let response = res.data
                    if (response && response.status == 200) {
                        let list =[]
                        if(response.result.rows != undefined){
                            response.result.rows.forEach(item=>{
                                list.push({id:item.id,value:item.sname})
                            })
                            this.searchOptions = list
                        }

//                            cb(list)
                    }
                })
            },
            handleSelect(val){
                let _selected = this.searchOptions.filter((item) => {
                    return item.value === val
                })
                if(_selected.length>0){
                    this.formData.estateId = parseInt(_selected[0].id)
                }
            }
        }
    }
</script>

<style lang="css">
    .contract-wrapper .drawOptionTips {
        width: 335px;
        margin-left: -100px;
    }
    .contract-wrapper .el-input.is-disabled .el-input__inner {
        background-color: #FFFFFF;
        color: #48576a;
    }
</style>
