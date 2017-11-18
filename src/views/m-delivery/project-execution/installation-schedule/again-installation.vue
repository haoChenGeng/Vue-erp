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
                                <el-form-item label="安装类型：" prop="installType">
                                    <el-input v-model="formData.installType" :disabled="true"></el-input>
                                </el-form-item>

                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="工地地址：" prop="address" >
                                    <el-input v-model="formData.address" :disabled="true"></el-input>
                                </el-form-item>

                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="开始时间：" prop="insPlanStart">
                                    <el-date-picker
                                        class="date-editor_time"
                                        v-model="formData.insPlanStart"
                                        type="datetime"
                                        :isZero="false"
                                        format="yyyy-MM-dd HH:mm"
                                        placeholder="请选择开始时间"
                                       :picker-options="pickerOptions"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="结束时间：" prop="insPlanEnd">
                                    <el-date-picker
                                        class="date-editor_time"
                                       v-model="formData.insPlanEnd"
                                       type="datetime"
                                       :isZero="false"
                                       format="yyyy-MM-dd HH:mm"
                                        placeholder="请选择开始时间"
                                       :picker-options="pickerOptions"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="安装人类型：" prop="installTypeId">
                                    <el-select v-model="formData.installTypeId"  placeholder="--请选择--" >
                                        <el-option v-for="item in commonOptionsConfig.installTypeList" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="安装人：" prop="installer">
                                    <el-select v-model="formData.installer" placeholder="--请选择--" @visible-change="handleVisibleChange">
                                        <el-option v-for="item in commonOptionsConfig.installManVos" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="activeTabName">
                            <el-tab-pane label="安装任务" name="install">
                                <div class="dialog2-toolbar-container">
                                    <el-button type="primary" size="small" icon="plus" @click="addInstallRow">新增行</el-button>
                                    <el-button type="danger" size="small" icon="close" @click="delInstallRow">删除行</el-button>
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
        >
        </goods-list>
    </div>
</template>

<script>
import {Service, methods} from 'src/services/delivery/installation-schedule/Service.js'
import GoodsList from './goodsList.vue'
import Cookie from 'js-cookie'
    export default {
        name:"again-installation",
        components: {GoodsList},
        data () {
            return {
                isTopHide: false,
                isDialogShow: true,
                id:null,
                activeTabName: "install",
                toolbarDisabledSymbols:[],
                formData:{
                    installType:'再次安装',
                    insPlanStart:null,
                    insPlanEnd:null,
                    address:null,
                    installTypeId:null,
                    installer:null,
                    installName:null
                },
                 commonOptionsConfig:{
                    installTypeList:[],
                    installManVos:[],
                    useSpeaceList:[],
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
                formRule:{
                    installTypeId:[
                         {type:'number', required: true,message: "请选择安装人类型", trigger:"change"}
                    ],
                    installer:[
                         {type:'number', required: true,message: "请选择安装人", trigger:"change"}
                    ],
                    insPlanStart:[
                        {type: 'date', required: true,message: "请选择可安装日期", trigger:"blur"}
                    ],
                    insPlanEnd:[
                        {type: 'date', required: true,message: "请选择可结束时间", trigger:"blur"}
                    ],
                },
                installColumns:[
                    {prop: 'skuId', label: 'SKUID'},
                    {prop: 'goodsName', label: '商品名称'},
                    {prop: 'speaceName', label: '空间', list:"useSpeaceList", required:true, editor:{
                       type:"select",
                       rules:[
                            {required: true, message: '请选择空间'}
                       ]
                    }},
                    {prop: 'installNum', label: '安装数量',required:true, editor:{
                       type:"input",
                       rules:[
                            {required: true, message: '请填写安装数量'},
                            {pattern: /^[1-9]\d{0,8}$|^([1-9]\d{0,8}|\d)\.\d?[1-9]$/, message: "安装数量格式错误"},
                       ]
                    }},
                    {prop: 'basicUnitName', label: '单位'},
                ],
                tableTemplateData:{
                    rpTypeAndRoleCode:null,
                    rpObjectId:null,
                    money:null,
                    remark:null,
                    rpObjectName:null
                },
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
                    {prop: 'money', label: '罚款金额',required:true, editor:{
                       type:"input",
                       rules:[
                            {required: true, message: '请填写罚款金额'},
                            {pattern: /^[1-9]\d{0,8}$|^([1-9]\d{0,8}|\d)\.\d?[1-9]$/, message: "安装数量格式错误"},
                       ]
                    }},
                    {prop: 'remark', label: '罚款原因', required:true, editor:{
                       type:"input",
                       rules:[
                            {required: true, message: '请选择空间'},
                            {max:200, min:1, message: '罚款原因最多填写200字符'}
                       ]
                    }}
                ],
                installManAll:{},
                showGoodsSearchDialog:false,
                pickerOptions:{
                     disabledDate(time) {
                        return time.getTime() < Date.now();
                   }
                }
            }
        },
        created(){
            if(this.$route.query.id){
                this.id = this.$route.query.id
            }else{
                let _this = this
                this.$msgbox({
                        title: '提示',
                        type: 'error',
                        message: '参数错误',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    }).then(()=>{
                        _this.$router.go(-1)
                    })
            }
            this.initData(this.id)
            this.getSpaceList()
        },
        watch:{
            "formData.installTypeId":function(val){
                this.commonOptionsConfig.installManVos = this.installManAll[val]
            },
            "formData.installer":function(val){
                 let installer = this.commonOptionsConfig.installManVos.find((item) => {
                     if(item.value == val){
                         return item
                     }
                })
                this.formData.installName = installer.text
            }
        },
        methods: {
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                // 填写对应的路由
                this.$router.push({ path: '/delivery/installtion-schedule-list' })
            },
            handleVisibleChange(type){
                if(type && !this.formData.installTypeId){
                      this.$message.error("请先选择安装人类型")
                }
            },
            initData(id){
                let args = {id:id}
                methods.makeInstallationView(args).then((res) =>{
                     if(res.data.status == 200){
                            this.formData.address = res.data.result.address || null
                           this.commonOptionsConfig.installTypeList = []
                           this.installManAll = {}
                           var _this = this
                           res.data.result.installManInfoVos && res.data.result.installManInfoVos.forEach(function(item){
                                _this.commonOptionsConfig.installTypeList.push({
                                     text:item.installTypeName,
                                     value:item.installTypeId
                                });
                               let installManVos = item.installManVos || [];
                               let list = [];
                               installManVos.forEach((val) =>{
                                    list.push({
                                         value:val.installer,
                                         text:val.installerName
                                    })
                               })
                               _this.installManAll[item.installTypeId] = list;
                           })
                     }
                })
            },
            getSpaceList(){
                let args = {}
                methods.spaceQuery(args).then((res) => {
                    if(res.data.status == 200 && res.data.result){
                        this.commonOptionsConfig.useSpeaceList = res.data.result.reduce((acc, cur) => {
                            acc.push({text:cur.name, value:cur.name})
                            return acc
                    }, [])
                    }
                })
            },
            setGoodsTableRowData(data){
                this.$refs.installTable.addNewRow({
                    id:data.id,
                    skuId:data.skuId,
                    goodsName:data.goodsName,
                    speaceName:null,
                    installNum:null,
                    basicUnitName:data.basicUnitName,
                    goodsCode:data.goodsCode
                })

            },
            delInstallRow(){
                let rows = this.$refs.installTable.getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请先选择需要删除的行')
                    return
                }
                this.$refs.installTable.delRows()
            },
            addInstallRow(){
                this.showGoodsSearchDialog = true
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
            submitForm(){
                this.$refs.formRef.validate((isValid) => {
                    if(isValid){
                          if(this.$refs.installTable.dataSource.length < 1){
                               this.$message.error('请先填写一项安装任务')
                               return
                          }
                          this.$refs.installTable.validate((installIsValid) => {
                                if(installIsValid){
                                    this.$refs.responsibilityTable.validate((responIsValid) =>{
                                        if(responIsValid){
                                            this.$confirm('确认提交么？', '提交确认', {
                                                    confirmButtonText: '确定',
                                                    cancelButtonText: '取消',
                                                    type: 'warning'
                                             }).then(() => {
                                                   let args = {
                                                        makeInstallAgainDTO: Object.assign({}, this.formData)
                                                   }
                                                   args.makeInstallAgainDTO.id = this.id
                                                   args.makeInstallAgainDTO.insPlanStart = +Date.parse(this.formData.insPlanStart).toString().slice(0, -3)
                                                   args.makeInstallAgainDTO.insPlanEnd =  +Date.parse(this.formData.insPlanEnd).toString().slice(0, -3)
                                                   args.makeInstallAgainDTO.createUser = Cookie.get('t8t-tc-uid')
                                                   args.makeInstallAgainDTO.createName = Cookie.get('t8t-tc-username')
                                                   args.makeInstallAgainDTO.installTaskVOs = this.$refs.installTable.dataSource
                                                   args.makeInstallAgainDTO.dutyInfos = this.$refs.responsibilityTable.dataSource
                                                   this.toolbarDisabledSymbols.push('EDIT-SUBMIT')
                                                   methods.makeInstallAgain(args).then((res)=>{
                                                        this.toolbarDisabledSymbols.pop()
                                                        if(res.data.status == 200){
                                                            let _this = this
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
                                                                title: '提交失败' ,
                                                                type: 'error',
                                                                message: error || '服务器异常',
                                                                showCancelButton: false,
                                                                confirmButtonText: '知道了',
                                                                confirmButtonClass: 'is-plain'
                                                            })
                                                   })
                                                })
                                            }
                                        })
                                    }
                              })
                        }
                    })

            }
        }
    }
</script>

<style lang="css" scoped>
</style>
