<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 master-reported" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            ref="toolbar"
                            :disabledSymbols="toolbarDisabledSymbols"
                            @EDIT-SUBMIT="submitForm"
                            @CANCEL="closeDialog"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-form class="dialog2-form-container" :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                            <div class="dialog2-form-item-container">
                                <el-form-item label="安装类型：" prop="planType">
                                    <el-input v-model="formData.planType" :disabled="true"></el-input>
                                </el-form-item>

                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="工地地址：" prop="address">
                                    <el-input v-model="formData.address" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                             <div class="dialog2-form-item-container">
                                <el-form-item label="配送时间：" prop="disPlanDeliverTime">
                                    <el-date-picker
                                        class="date-editor_time"
                                        v-model="formData.disPlanDeliverTime"
                                        type="date"
                                        placeholder="请选择开始时间"
                                       :picker-options="pickerOptions"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="activeTabName">
                            <el-tab-pane label="补货商品" name="goods">
                                <div class="dialog2-toolbar-container">
                                    <el-button type="primary" size="small" icon="plus" @click="addGoodsRow">新增行</el-button>
                                    <el-button type="danger" size="small" icon="close" @click="delGoodsRow">删除行</el-button>
                                 </div>
                                <t8t-table
                                    ref="installTable"
                                    :columns="installColumns"
                                    :pageBar="false"
                                    :editable="true"
                                    :commonData="commonOptionsConfig"
                                    @cell-click="handleCellClick"
                                ></t8t-table>
                            </el-tab-pane>
                            <el-tab-pane label="责任方" name="responsibility">
                                <div class="dialog2-toolbar-container">
                                    <el-button type="primary" size="small" icon="plus" @click="addResponsibilityRow">新增行</el-button>
                                    <el-button type="danger" size="small" icon="close" @click="delResponsibilityRow">删除行</el-button>
                                 </div>
                                <t8t-table
                                    ref="responsibilityTable"
                                    :columns="responsibilityColumns"
                                    :indexCol="true"
                                    :pageBar="false"
                                    :editable="true"
                                    :commonData="commonOptionsConfig"
                                    :templateData="tableTemplateData"
                                    @cell-click="handleCellClick"
                                ></t8t-table>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
        <goods-list
            v-if="showGoodsSearchDialog"
            :projectId="installInfo.applyId"
            type="replenish"
        >
        </goods-list>
    </div>
</template>

<script>
    import {Service, methods} from 'src/services/delivery/installation-schedule/Service.js'
    import GoodsList from './goodsList.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import comServices from 'src/services/delivery/Service.js'
    import axios from 'src/utils/axios.js'
    export default {
        name:'replenish-installation',
        components: {GoodsList},
        data () {
            return {
                isTopHide: false,
                isDialogShow: true,
                activeTabName: "goods",
                id:null,
                installInfo:{},
                formData:{
                    planType:'返补安装',
                    address:null,
                    disPlanDeliverTime:null
                },
                formRule:{
                    disPlanDeliverTime:[
                        {type: 'date', required: true,message: "请选择配送时间", trigger:"blur"}
                    ]
                },
                commonOptionsConfig:{
                    replenishReasonList:[],
                    userOrganizationList:[
                        {value:"001001003", text:"供应商"},
                        {value:"001001008", text:"安装商"},
                        {value:"001001005", text:"工长"}
                    ],
                    allUserList:[],
                    gongying:[],
                    anzhuang:[],
                    gongzhang:[]
                },
                installColumns:[
                    {prop: 'skuId', label: 'SKUID'},
                    {prop: 'goodsName', label: '商品名称'},
                    {prop: 'basicUnitName', label: '单位'},
                    {prop: 'goodsDemandAmount', label: '补货数量', required:true, editor:{
                        type:'input',
                        rules:[
                            {required: true, message: '请填写补货数量'},
                            {pattern: /^[1-9]\d{0,8}$|^([1-9]\d{0,8}|\d)\.\d?[1-9]$/, message: "补货数量格式错误"}
                        ]
                    }},
                    {prop: 'replenishReason', label: '补货原因', list:'replenishReasonList', required:true, editor:{
                        type:'select',
                        rules:[
                           {required: true,message: "请选择补货原因"}
                        ]
                    }},
                ],
                responsibilityColumns:[
                    {prop: 'rpTypeAndRoleCode', label: '责任方', list:'userOrganizationList', required:true, onChange(val, row, col, table){
                        row.rpObjectId = null
                        row.rpObjectName = null
                    },editor:{
                        type:"select",
                        rules:[
                            {required: true, message: '请选择责任方'}
                       ]
                    }},
                    {prop: 'rpObjectId', label: '责任人', list:"allUserList", required:true,editor:{
                        type:"select",
                        loading:false,
                        filterable:true,
                        rules:[
                            {required: true, message: '请选择责任人'}
                       ]
                    },onChange(val, row, col, table){
                         let responer = table.commonData.allUserList.find((item) =>{
                            if(item.value == val){
                                 return item
                            }
                         })
                         row.rpObjectName = responer.text
                    }},
                    {prop: 'money', label: '罚款金额', required:true, editor:{
                       type:"input",
                       rules:[
                            {required: true, message: '请填写罚款金额'},
                            {pattern: /^[1-9]\d{0,8}$|^([1-9]\d{0,8}|\d)\.\d?[1-9]$/, message: "罚款金额格式错误"},
                       ]
                    }},
                    {prop: 'remark', label: '罚款原因',  required:true, editor:{
                       type:"input",
                       rules:[
                            {required: true, message: '请选择空间'},
                            {max:200, min:1, message: '罚款原因最多填写200字符'}
                       ]
                    }}
                ],
                tableTemplateData:{
                    rpTypeAndRoleCode:null,
                    rpObjectId:null,
                    money:null,
                    remark:null
                },
                installManAll:{},
                showGoodsSearchDialog:false,
                pickerOptions:{
                     disabledDate(time) {
                        return time.getTime() < Date.now();
                   }
                },
                toolbarDisabledSymbols:[]
            }
        },
        created(){
            this.id = this.$route.query.id || null
            if(this.id){
                this.initData()
            }
            this.getCommonOptions('42303', 'replenishReasonList')
        },
        watch:{
            "installInfo":function(val){
                 this.formData.address = val.address
            }
        },
        methods: {
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                // 填写对应的路由
                this.$router.push({ path: '/tuchat-delivery/installtion-schedule-list' })
            },
            addGoodsRow(){
                this.showGoodsSearchDialog = true
            },
            delGoodsRow(){
                let rows = this.$refs.installTable.getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请先选择需要删除的行')
                    return
                }
                this.$refs.installTable.delRows()
            },
            setGoodsTableRowData(data){
                this.$refs.installTable.addNewRow({
                    goodsId:data.goodsId,
                    skuId:data.skuId,
                    goodsName:data.goodsName,
                    goodsDemandAmount:null,
                    replenishReason:null,
                    basicUnitName:data.basicUnitName,
                    goodsCode:data.goodsCode,
                    categoryId:data.categoryId
                })

            },
            handleCellClick (row, column, cell, event, config){
                if(column.property == 'rpObjectId'){
                    if(!row.rpTypeAndRoleCode){
                        this.$message.error('请先选择责任方')
                        this.$refs.responsibilityTable.handleFormItemBlur()
                        return false;
                    }
                    if(row.rpTypeAndRoleCode == '001001003'){
                        config.editor.list = "gongying"
                    }
                    if(row.rpTypeAndRoleCode == '001001008'){
                        config.editor.list = "anzhuang"
                    }
                    if(row.rpTypeAndRoleCode == '001001005'){
                        config.editor.list = "gongzhang"
                    }
                    if(row.rpTypeAndRoleCode == '001001003' && this.commonOptionsConfig.gongying.length < 1){
                        config.editor.loading = true
                         this.setResponsibilityUser('gongying', row.rpTypeAndRoleCode).then(() => {
                             config.editor.loading = false
                         }).catch(()=>{
                             onfig.editor.loading = false
                         })
                    }
                    if(row.rpTypeAndRoleCode == '001001008' && this.commonOptionsConfig.anzhuang.length < 1){
                        config.editor.loading = true
                        this.setResponsibilityUser('anzhuang', row.rpTypeAndRoleCode).then(() => {
                             config.editor.loading = false
                         }).catch(()=>{
                             onfig.editor.loading = false
                         })
                    }
                    if(row.rpTypeAndRoleCode == '001001005' && this.commonOptionsConfig.gongzhang.length < 1){
                        config.editor.loading = true
                        this.setResponsibilityUser('gongzhang', row.rpTypeAndRoleCode).then(() => {
                             config.editor.loading = false
                         }).catch(()=>{
                             onfig.editor.loading = false
                         })
                    }
                }
            },
            setResponsibilityUser(type, code){
                let args = {applyId:this.id, code:code, page:1, size:1000}
               return methods.queryResponsibility(args).then((res) => {
                    if(res.data.status == 200 && res.data.result.rows){
                         this.commonOptionsConfig[type] = res.data.result.rows.reduce((acc, item) =>{
                              acc.push({
                                   text:item.name,
                                   value:item.id
                              })
                              return acc
                         }, [])
                        this.commonOptionsConfig.allUserList = this.commonOptionsConfig.allUserList.concat(this.commonOptionsConfig[type])
                    }
                })
            },
            initData(){
              return axios({
                    service: '2ut6bUIvrvApAgRqxlP3eQCn3mCy3Kh', // /biz/t8t-ps-pim/app
                    method: 'MUPP8Spbz10JKzzC6RQUddKh7A2jeqKIlienBiTGC4n-wkC29av', // views.deliverInstallPlan.queryPage
                    args: {search:{id:this.id}, page:1, size:1}
                }).then((res) => {
                    if(res.data.status == 200){
                        this.installInfo = res.data.result.rows[0]
                    }else{
                        this.$message.error('安装信息获取失败')
                    }
                }).catch((error) =>{
                    this.$message.error(error || '安装信息获取失败')
                })
            },
            addResponsibilityRow(){
                this.$refs.responsibilityTable.addNewRow()
            },
            delResponsibilityRow(){
                let rows = this.$refs.responsibilityTable.getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请先选择需要删除的行')
                    return
                }
                 this.$refs.responsibilityTable.delRows()
            },
            submitForm(){
                this.$refs.formRef.validate((isValid) =>{
                    if(isValid){
                        if(this.$refs.installTable.dataSource.length < 1){
                            this.$message.error("请添加一项补货任务")
                            return false
                        }
                        this.$refs.installTable.validate((va) =>{
                            if(!va){
                                return false
                            }
                            this.$refs.responsibilityTable.validate((isVa) => {
                                if(isVa){
                                    this.$confirm('确认提交么？', '提交确认', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                     }).then(() => {
                                        let disPlanDeliverTime = +Date.parse(this.formData.disPlanDeliverTime).toString().slice(0, -3)
                                        let args = {
                                                makeInstallReturnDTO:{
                                                    id:this.id,
                                                    disPlanDeliverTime:disPlanDeliverTime,
                                                    createUser:Cookie.get('t8t-tc-uid'),
                                                    createName:Cookie.get('t8t-tc-username'),
                                                    returnGoodsDemands:this.$refs.installTable.dataSource,
                                                    dutyInfos:this.$refs.responsibilityTable.dataSource
                                            }
                                        }
                                        this.toolbarDisabledSymbols.push('EDIT-SUBMIT')
                                        methods.makeInstallReturn(args).then((res) =>{
                                            this.toolbarDisabledSymbols.pop()
                                            if(res.data.status == 200){
                                                    var _this = this
                                                   this.$msgbox({
                                                            title: '提交成功',
                                                            type: 'success',
                                                            message: '',
                                                            showCancelButton: false,
                                                            confirmButtonText: '知道了',
                                                            confirmButtonClass: 'is-plain'
                                                        }).then(() =>{
                                                            _this.closeDialog()
                                                        })
                                            }else{
                                                this.$refs.installTable.$refs.table.doLayout()
                                                this.$refs.responsibilityTable.$refs.table.doLayout()
                                                this.$msgbox({
                                                        title: '提交失败',
                                                        type: 'error',
                                                        message: res.data.message,
                                                        showCancelButton: false,
                                                        confirmButtonText: '知道了',
                                                        confirmButtonClass: 'is-plain'
                                                    })
                                            }
                                        }).catch((error) =>{
                                            this.$refs.installTable.$refs.table.doLayout()
                                            this.$refs.responsibilityTable.$refs.table.doLayout()
                                            this.toolbarDisabledSymbols.pop()
                                            this.$msgbox({
                                                        title:  '提交失败',
                                                        type: 'error',
                                                        message:  error || '服务器异常',
                                                        showCancelButton: false,
                                                        confirmButtonText: '知道了',
                                                        confirmButtonClass: 'is-plain'
                                                    })
                                        })
                                     })

                                }
                            })
                        })
                    }
                })
            },
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
                                }
                            });
                            this.commonOptionsConfig[selectName] = list;
                        }
                    })
            }
        }
    }
</script>

<style lang="css" scoped>
</style>
