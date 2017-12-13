<template>
    <div>
    <el-dialog
            @close="closeDialog"
            v-model="isDialogShow"
            size="full"
            class="discount-add-t8t-full-dialog"
    >
    <div class="t8t-full-dialog-container">
        <!-- 顶部按钮区 -->
        <div class="full-dialog-toolbar-container">
            <div class="toolbar-container">
                <t8t-toolbar
                    class="t8t-dark"
                    @SAVE="tempsave"
                    @EDIT-SUBMIT="submit"
                    :disabledSymbols="disabledSymbols"
                >
                </t8t-toolbar>
            </div>
        </div>
        <el-form :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
        <div class="full-dialog-form-container container-center">
            <el-tabs v-model="activeTabTop" class="basicTab">
            <el-tab-pane
                label="基本信息"
                class="tableDebitType"
                name="one"
            >
                    <div class="form-item-container">
                         <el-form-item label="现金优惠ID:"  prop="id">
                            <el-input v-model="formData.id" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="现金优惠名称："  prop="name">
                            <el-input v-model="formData.name"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                            <el-form-item label="优惠状态：">
                                <el-select v-model="formData.status" placeholder="--请选择--" disabled>
                                    <el-option v-for="item in commonOptionsConfig.status" :label="item.text" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    <div class="form-item-container">
                         <el-form-item label="可支付款项类型：" prop="effectivePayment">
                            <el-select v-model="formData.effectivePayment"  multiple placeholder="--请选择--">
                                <el-option v-for="item in commonOptionsConfig.effectivePayment" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item>
                        </el-form-item>
                    </div>
            </el-tab-pane>
            </el-tabs>
        </div>
        <div class="full-dialog-form-container container-center">
            <el-tabs v-model="activeTabTop" class="basicTab">
                <el-tab-pane
                    label="优惠金额"
                    class="tableDebitType"
                    name="one"
                >
                        <div class="form-item-container">
                            <el-form-item label="面值类型：" prop="parValueType">
                                <el-select v-model="formData.parValueType" placeholder="--请选择--" v-on:change = "clearNum">
                                    <el-option v-for="item in commonOptionsConfig.parValueType" :label="item.text" :value="item.value"  >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-container" v-if="formData.parValueType==1">
                            <el-form-item label="单个面值：" prop="parValue">
                                <el-input  v-model ="formData.parValue" v-on:blur="getPrivilegeRental"></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container" v-if="formData.parValueType==2">
                            <el-form-item label="单个面值上限："  prop="maxParValue">
                                <el-input  v-model ="formData.maxParValue"></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                             <el-form-item label="发行限量：" prop="quantityLimit">
                                <el-input  v-model ="formData.quantityLimit" v-on:blur="getPrivilegeRental" ></el-input>
                            </el-form-item>
                        </div>

                        <div class="form-item-container">
                             <el-form-item label="优惠总额：" prop="privilegeRental" >
                                <el-input  v-model ="formData.privilegeRental"  disabled ></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item>

                            </el-form-item>
                        </div>
                        <div class="form-item-container">
                            <el-form-item>

                            </el-form-item>
                        </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="full-dialog-form-container container-center">
            <el-tabs v-model="activeTabTop" class="basicTab">
                <el-tab-pane
                    label="限制条件"
                    class="tableDebitType"
                    name="one"
                >
                    <div class="form-item-container">
                         <el-form-item label="发行开始时间：">
                            <el-date-picker v-model="formData.beginTime" type="datetime" placeholder="请选择发行开始时间"></el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="发行结束时间：">
                            <el-date-picker v-model="formData.endTime" type="datetime" placeholder="请选择发行结束时间"></el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="使用截止时间：">
                            <el-date-picker v-model="formData.effectiveTime" type="datetime" placeholder="请选择使用截止时间"></el-date-picker>
                        </el-form-item>
                    </div>
                    <!-- <div class="form-item-container">
                         <el-form-item label="绑定限制：">
                            <el-select v-model="formData.bindLimit" placeholder="--请选择--">
                                <el-option v-for="item in commonOptionsConfig.bindLimit" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div> -->
                    <div class="form-item-container">
                         <el-form-item label="可使用组织范围：">
                            <!-- <el-input  v-model="formData.effectiveOrgNames" icon="search" readonly @click="showOrg"></el-input> -->
                            <el-select v-model="formData.effectiveOrg" multiple placeholder="--请选择--">
                                <el-option v-for="item in commonOptionsConfig.effectiveOrg" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                </el-tab-pane>
            </el-tabs>
        </div>
        </el-form>
    </div>
    </el-dialog>
   <!--  <el-dialog class="orgDialog" title="可使用组织范围" v-model="orgDialog" @close="closeOrgDialog" ref="orgDialogRef">
            <div class="tree-box">
                <t8t-tree
                    ref="my-tree"
                    :data="treeData"
                    :props="treeProps"
                    @node-click="onTreeClick"
                    :hideArrow="hide"
                    show-checkbox="true"
                    :default-checked-keys="choseNode"
                >
                </t8t-tree>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="onOrgDialog" :loading="isLoading">确认</el-button>
                <el-button @click="closeOrgDialog">关闭</el-button>
            </div>
    </el-dialog> -->
    </div>
</template>
<script>
    import api from 'src/services/system/organization.js'
    import Cookie from 'js-cookie'
    import cashDiscountApi from 'src/services/salemanager/cashDiscount.js'
    import commonApi from 'src/services/commonApi/commonApi.js'

    export default{
        data(){
            return{
                disabledSymbols:[],
                isDialogShow: true,
                activeTabName: 'one',
                activeTabTop: 'one',
                orgDialog:false,
                choseNode:[],
                hide:true,
                id:0,
                orgName:'',
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                formData:{
                    name:null,
                    status:null,
                    parValueType:null,
                    parValue:null,
                    maxParValue:null,
                    quantityLimit:null,
                    privilegeRental:null,
                    beginTime:null,
                    endTime:null,
                    effectiveTime:null,
                    effectivePayment:[],
                    bindLimit:null,
                    effectiveOrg:null,
                    effectiveOrgNames:null,
                },
                commonOptionsConfig: {
                    status:[{
                            text: '暂存',
                            value: 0
                        },{
                            text: '发放中',
                            value: 1
                        }],
                    parValueType:[{
                            text: '固定面值',
                            value: 1
                        },{
                            text: '随机面值',
                            value: 2
                        }],
                    effectivePayment:[],
                    bindLimit:[],
                    effectiveOrg:[],

                },
                formRule: {
                    name: [{ required: true, message: '请输入现金优惠名称'}],
                    status: [{ required: true, message: '请选择优惠状态'}],
                    effectivePayment:[{type:"array",required: true, message: '请选择可支付款项类型'}],
                    parValueType:[{required: true, message: '请选择面值类型'}],
                    parValue: [
                    {required: true,pattern: /^[1-9](\d+)?(\.\d?[0-9])?$|^0\.\d?[0-9]$/,message: "请输入正整数或者两位小数"}
                    ],
                    maxParValue: [
                    {required: true,pattern: /^[1-9](\d+)?(\.\d?[0-9])?$|^0\.\d?[0-9]$/,message: "请输入正整数或者两位小数"}
                    ],
                    quantityLimit: [
                    {required: true,pattern: /^[1-9]$|^[1-9]\d+$/,message: "请输入正整数"}
                    ],
                    privilegeRental: [{pattern:/^[1-9](\d+)?(\.\d?[0-9])?$|^0\.\d?[0-9]$/,message: "请输入正整数或者两位小数"}],
                },
                defaultExpandedKeys: [0],

            }
        },
        watch: {
        },
        created() {
            // 款项类型
            this.getCommonOptions('61003','effectivePayment')
            this.getCommonOptions('30201','bindLimit')
            this.initTree()
            this.getEffectiveOrg('effectiveOrg');
        },
        methods:{
            clearNum()
            {

                this.formData['parValue'] = ''
                this.formData['maxParValue'] = ''
                this.formData['quantityLimit'] = ''
                this.formData['privilegeRental'] = ''
            },
            getPrivilegeRental()
            {
                if(this.formData['parValue']!==''&&this.formData['quantityLimit']!=='')
                {
                    this.formData['privilegeRental']=this.formData['parValue']*this.formData['quantityLimit']
                    this.formData['privilegeRental'] = this.formData['privilegeRental'].toFixed(2)

                }else if(this.formData['maxParValue']!==''&&this.formData['quantityLimit']!==''){

                    this.formData['privilegeRental']=this.formData['maxParValue']*this.formData['quantityLimit']
                    this.formData['privilegeRental'] = this.formData['privilegeRental'].toFixed(2)
                }
            },
            initTree() {
                api.queryTree({isAll:1})
                    .then((res) => {
                        this.treeData = [res.data.result]
                    })
            },
            closeDialog() {
                this.$router.go(-1)
                this.$emit('close')
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
            /*showOrg()
            {
               this.orgDialog = true;
               this.orgName = ''
            },
            closeOrgDialog()
            {
                this.orgDialog = false;
            },*/
            changeString(array)
            {
                var str = ''
                if(array instanceof Array)
                {
                    for(let i=0 ; i < array.length ; i++ )
                    {
                        str = str + array[i] + ','
                    }

                }
                if(str!=='')
                {
                    str = str.substr(0,str.length-1);
                }
                return str

            },
            changeTime(time)
            {
                if(time){
                    if(typeof time !==  'number')
                    {
                        time =  time ? Date.parse(time).toString().substr(0,10) : ''
                    }else if(time.toString().length === 13){

                        time =  time/1000
                    }
                }
                return time
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
            changeEmpty(zero)
            {
                if(zero === 0 )
                {
                    zero = ''
                }

                return zero
            },
            timeMultiply(time)
            {
                if(time === 0 )
                {
                    time = ''
                }else{
                    time = time*1000
                }
                return time
            },
            /*onOrgDialog()
            {
                let selectedNodes =  this.$refs['my-tree'].getCheckedKeys()

                if(selectedNodes.length == 0){
                    this.$message.error("请选择组织")
                    return
                }else{
                    var selectedNodesStr = this.changeString(selectedNodes)

                    var effectiveOrgNameStr
                    for(let i=0 ; i < selectedNodes.length ; i++ )
                    {

                        let args = {
                            id: selectedNodes[i]
                        }
                        cashDiscountApi.findOrgById(args)
                            .then((res) => {
                            if (res.data.status === 200) {
                                    this.orgName = this.orgName + res.data.result.name + ','
                                    this.formData['effectiveOrgNames']  = this.orgName.substr(0,this.orgName.length-1);
                            }
                        })
                    }
                    this.formData['effectiveOrg'] = selectedNodesStr
                    this.closeOrgDialog()
                }
            },*/
            submit()
            {
                var formFlag = false;
                this.$refs['formRef'].validate((isValid) => {
                if(isValid)
                {
                        this.disabledSymbols = this.disabledSymbols.concat('EDIT-SUBMIT')
                        formFlag = true;
                        var formData =  this.formData
                        if(formData['beginTime']>=formData['endTime'])
                        {
                            this.$message({
                                    type: 'error',
                                    message: '发放结束时间必须大于发放开始时间'
                            });
                            this.disabledSymbols.pop()
                            return
                        }
                        if(formData['endTime']>=formData['effectiveTime'])
                        {
                            this.$message({
                                    type: 'error',
                                    message: '使用截止时间必须大于发放结束时间'
                            });
                            this.disabledSymbols.pop()
                            return
                        }
                        let effectivePayment = this.changeString(formData['effectivePayment'])
                        let effectiveOrg = this.changeString(formData['effectiveOrg'])
                        let beginTime = this.changeTime(formData.beginTime)
                        let endTime = this.changeTime(formData.endTime)
                        let effectiveTime = this.changeTime(formData.effectiveTime)
                        /*formData.effectivePayment = this.changeString(formData.effectivePayment)
                        formData.effectiveOrg = this.changeString(formData.effectiveOrg)
                        formData.beginTime = this.changeTime(formData.beginTime)
                        formData.endTime = this.changeTime(formData.endTime)
                        formData.effectiveTime = this.changeTime(formData.effectiveTime)*/
                         var args = {
                            'templateCreateDto':{
                                'id' : this.id,
                                'name' : formData.name,
                                'status' : formData.status,
                                'parValueType' : formData.parValueType,
                                'parValue' : formData.parValue,
                                'maxParValue' : formData.maxParValue,
                                'quantityLimit' : formData.quantityLimit,
                                'privilegeRental' : formData.privilegeRental,
                                'beginTime' : beginTime,
                                'endTime' :  endTime,
                                'effectiveTime' : effectiveTime,
                                'effectivePayment' : effectivePayment,
                                'bindLimit' : formData.bindLimit,
                                'effectiveOrg' : effectiveOrg,
                                },
                                'createUserId':+ Cookie.get('t8t-tc-uid'),
                            }
                            cashDiscountApi.createSubmit(args)
                                .then((res) => {
                                    if(res.data.status === 200){
                                        // 新增成功
                                        this.isLoading = false
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'success',
                                            message: '提交成功',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        }).then(()=>{

                                             this.$router.push({path: '/salemanager/cash-discount'})

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
            tempsave()
            {
                var formFlag = false;
                this.$refs['formRef'].validate((isValid) => {
                if(isValid)
                {
                        this.disabledSymbols = this.disabledSymbols.concat('SAVE')
                        formFlag = true;
                        var formData =  this.formData
                        if(formData['beginTime']>=formData['endTime'])
                        {
                            this.$message({
                                    type: 'error',
                                    message: '发放结束时间必须大于发放开始时间'
                            });
                            this.disabledSymbols.pop()
                            return
                        }
                        if(formData['endTime']>=formData['effectiveTime'])
                        {
                            this.$message({
                                    type: 'error',
                                    message: '使用截止时间必须大于发放结束时间'
                            });
                            this.disabledSymbols.pop()
                            return
                        }
                       /* formData['effectivePayment'] = this.changeString(formData['effectivePayment'])
                        formData['effectiveOrg'] = this.changeString(formData['effectiveOrg'])
                        formData.beginTime = this.changeTime(formData.beginTime)
                        formData.endTime = this.changeTime(formData.endTime)
                        formData.effectiveTime = this.changeTime(formData.effectiveTime)*/
                        let effectivePayment = this.changeString(formData['effectivePayment'])
                        let effectiveOrg = this.changeString(formData['effectiveOrg'])
                        let beginTime = this.changeTime(formData.beginTime)
                        let endTime = this.changeTime(formData.endTime)
                        let effectiveTime = this.changeTime(formData.effectiveTime)

                         var args = {
                            'templateCreateDto':{
                                'name' : formData.name,
                                'status' : formData.status,
                                'parValueType' : formData.parValueType,
                                'parValue' : formData.parValue,
                                'maxParValue' : formData.maxParValue,
                                'quantityLimit' : formData.quantityLimit,
                                'privilegeRental' : formData.privilegeRental,
                                'beginTime' : beginTime,
                                'endTime' : endTime,
                                'effectiveTime' : effectiveTime,
                                'effectivePayment' :  effectivePayment,
                                'bindLimit' : formData.bindLimit,
                                'effectiveOrg' : effectiveOrg,
                                },
                                'createUserId':+ Cookie.get('t8t-tc-uid'),
                            }
                            cashDiscountApi.createSave(args)
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        this.isLoading = false
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'success',
                                            message: '保存成功',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        }).then(()=>{

                                             this.$router.push({path: '/salemanager/cash-discount'})

                                        })
                                        /*this.$message({
                                            type: 'success',
                                            message: '保存成功！'
                                        });
                                        this.disabledSymbols.pop()
                                        this.id = res.data.result
                                        this.getData(res.data.result)*/
                                    }else{
                                        this.$message({
                                            type: 'error',
                                             message: res.data.message
                                        })
                                        this.disabledSymbols.pop()
                                    }


                                })
                    }else {
                        return false
                    }


                })
            },
            getData(rowId) {
                let args = {
                        templateId: rowId
                }
                cashDiscountApi.getOne(args)
                    .then((res) => {
                    if (res.data.status === 200) {
                            res.data.result.bindLimit = this.changeEmpty(res.data.result.bindLimit)
                            res.data.result.parValue = this.changeEmpty(res.data.result.parValue)
                            res.data.result.maxParValue = this.changeEmpty(res.data.result.maxParValue)
                            res.data.result.privilegeRental = this.changeEmpty(res.data.result.privilegeRental)
                            res.data.result.quantityLimit = this.changeEmpty(res.data.result.quantityLimit)
                            res.data.result.beginTime = this.timeMultiply(res.data.result.beginTime)
                            res.data.result.endTime = this.timeMultiply(res.data.result.endTime)
                            res.data.result.effectiveTime = this.timeMultiply(res.data.result.effectiveTime)
                            res.data.result.effectivePayment = this.changeInt(res.data.result.effectivePayment)
                            res.data.result.effectiveOrg = this.changeInt(res.data.result.effectiveOrg)
                            this.formData = res.data.result
                    }

                })
            },
            getEffectiveOrg(selectName)
            {
                let arg =  {
                    search:{
                        typeCode_eq:'001003010',
                        isDel:'0'
                    }
                }
                let list = []
                cashDiscountApi.queryOrg(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                                list.push({
                                    value: item.id,
                                    text: item.name
                                })
                        })
                        this.commonOptionsConfig[selectName] = list
                    }
                })
            },

        }

    }


</script>
<style
    lang="css"
    scoped
>


    .discount-add-t8t-full-dialog .my-container{
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }
    .discount-add-t8t-full-dialog .my-toolbar{
        margin-bottom: 15px;
    }
    .orgDialog
    {
        width: 100%;

    }
    .tree-box
    {
        height: 500px;
    }



</style>
<style>
    .tree-box .t8t-tree-container .t8t-tree
    {
        height: 500px;
        padding-left: 40px;
        width: 350px;
    }
    .discount-add-t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .discount-add-t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .discount-add-t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .discount-add-t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        display: flex;
        margin-bottom: 20px;
    }
    .discount-add-t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .discount-add-t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: -ms-flexbox;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .discount-add-t8t-full-dialog .toolbar-container .toolbar-button{
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
    .discount-add-t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .discount-add-t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
    }

    .discount-add-t8t-full-dialog .form-item-container{
         width: 25%;
    }
    .discount-add-t8t-full-dialog .full-dialog-form-container{
        margin-top: 22px;
    }
    .discount-add-t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .discount-add-t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .discount-add-t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .discount-add-t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .discount-add-t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .discount-add-t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .discount-add-t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .discount-add-t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .discount-add-t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
/*        width: 1220px;
        margin: 0 auto;*/
    }
    .discount-add-t8t-full-dialog .el-tab-pane{
        display: flex;
        flex: 1;
        flex-wrap: wrap;
    }
    /* 顶部tab */
    .discount-add-t8t-full-dialog .full-dialog-form-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .discount-add-t8t-full-dialog .full-dialog-form-container .el-tabs__header {
        border-top: 0;
        border-bottom: 0;
    }
    /* 弹窗tab里面的表格定位 */
    .discount-add-t8t-full-dialog .full-dialog-tabs-container .wordTab .el-tabs__content{
        flex: 1;
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
    }
    .discount-add-t8t-full-dialog .full-dialog-tabs-container .wordTab .el-tab-pane {
        flex: none !important;
        width: 100% !important;
        height: 100% !important;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .discount-add-t8t-full-dialog .el-tab-pane
    .t8t-toolbar {
        position: absolute;
        left: 30px;
        right: 30px;
        padding: 10px 0!important;
        margin: 0 auto!important;
    }

    .discount-add-t8t-full-dialog .full-dialog-form-container .el-tabs .el-tabs__content .el-date-editor.el-input
    {
        width: 180px;
    }


</style>
