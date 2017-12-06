<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <div class="t8t-toolbar t8t-dark ">
                            <el-button class="el-button--toolbar" @click="save" :loading="saveLoading">提交</el-button>
                            <el-button class="el-button--toolbar" @click="closeDialog">取消</el-button>
                        </div>
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                                <el-form class="dialog2-form-container" :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="开始日期：" prop="insPlanStart">
                                            <el-date-picker
                                                class="date-editor_time"
                                                v-model="formData.insPlanStart"
                                                type="datetime"
                                                placeholder="请选择开始日期"
                                                format="yyyy-MM-dd HH:mm"
                                                :editable="false"
                                                :isZero="false"
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
                                               format="yyyy-MM-dd HH:mm"
                                               :editable="false"
                                               :isZero="false"
                                               type="datetime" placeholder="请选择结束时间"
                                               :picker-options="pickerOptions"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="工地地址：" prop="address">
                                            <el-input v-model="formData.address" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="安装人类型：" prop="installTypeId">
                                            <el-select v-model="formData.installTypeId"  placeholder="--请选择--" >
                                                <el-option v-for="item in commonOptionsConfig.installTypeList" :label="item.text" :value="item.value" >
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="安装人：" prop="installer">
                                            <el-select v-model="formData.installer" placeholder="--请选择--"  @visible-change="handleVisibleChange">
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
                                <div>
                                    <el-button
                                        type="primary"
                                        size="small"
                                        icon="plus"
                                        @click="addLine"
                                    >新增行
                                    </el-button>
                                    <el-button
                                        type="danger"
                                        size="small"
                                        icon="close"
                                        @click="delLine"
                                    >删除行
                                    </el-button>
                                </div>
                                <t8t-table
                                    :service="installServer"
                                    :columns="installColumns"
                                    :pageBar="true"
                                    :editable="true"
                                    :method="installMethod"
                                    :commonData="commonOptionsConfig"
                                    :args="installArgs"
                                    ref="installTaskTable"
                                ></t8t-table>
                            </el-tab-pane>
                            <el-tab-pane label="商品明细" name="goods">
                                <t8t-table
                                    :service="goodsInfoServer"
                                    :columns="columns"
                                    :pageBar="true"
                                    :indexCol="true"
                                    :selectCol="false"
                                    :method="goodsInfoMethod"
                                    :args="goodsInfoArgs"
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
import Utils from 'src/utils/Utils.js'
import {Service, methods} from 'src/services/delivery/installation-schedule/Service.js'
import GoodsList from './goodsList.vue'
import Cookie from 'js-cookie'
    export default {
        name:'installation-schedule',
        components: {GoodsList},
        props:{
                id: {
                    type: Number,
                    default: 0
                }

        },
        data () {
            return {
                isTopHide: false,
                isDialogShow: true,
                activeTabName: "install",
                formData:{
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
                    useSpeaceList:[]
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
                columns:[
                    {prop: 'skuId', label: 'SKUID'},
                    {prop: 'name', label: '商品名称'},
                    {prop: 'deliverAmount', label: '要货数量'},
                    {prop: 'basicUnitName', label: '单位'}
                ],
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
                dataSource:[
                ],
                pickerOptions:{
                     disabledDate(time) {
                        return time.getTime() < Date.now();
                   }
                },
                storageVOS:[],
                installServer:null,
                installArgs:{},
                goodsInfoArgs:null,
                goodsInfoMethod:Service.INSTALLATION.methods.listGoodsInfo,
                goodsInfoServer:Service.INSTALLATION.name,
                applyId:null,
                scheduleNodeId:null,
                saveLoading:false,
                installManAll:{},
                showGoodsSearchDialog:false

            }
        },
        created(){
            this.initData(this.id)
            this.getSpaceList()
            this.goodsInfoArgs = {id:this.id}
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
                this.$parent.installationScheduleShow = false
            },
            handleVisibleChange(type){
                if(type && !this.formData.installTypeId){
                      this.$message.error("请先选择安装人类型")
                }
            },
            addLine(){
                this.showGoodsSearchDialog = true
            },
            delLine(){
                let rows = this.$refs.installTaskTable.getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请先选择需要删除的行')
                    return
                }
                this.$refs.installTaskTable.delRows()
            },
            save(){
                this.$refs.formRef.validate((isValid) =>{
                    if(isValid){
                        if(this.$refs.installTaskTable.dataSource.length < 1){
                            this.$message.error("请添加一项安装任务")
                            return false
                        }
                        this.$refs.installTaskTable.validate((va) =>{
                            if(!va){
                                return false
                            }
                            this.$confirm('确认提交么？', '提交确认', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                             }).then(() => {
                                let insPlanStart = +Date.parse(this.formData.insPlanStart).toString().slice(0, -3)
                                let insPlanEnd = +Date.parse(this.formData.insPlanEnd).toString().slice(0, -3)
                                let args = {
                                        makeInstallationDTO:{
                                            id:this.id,
                                            installer:this.formData.installer,
                                            installName:this.formData.installName,
                                            installTypeId:this.formData.installTypeId,
                                            insPlanStart:insPlanStart,
                                            insPlanEnd:insPlanEnd,
                                            createUser:Cookie.get('t8t-tc-uid'),
                                            createName:Cookie.get('t8t-tc-username'),
                                            installTaskVOs:this.$refs.installTaskTable.dataSource
                                    }
                                }
                                this.saveLoading = true
                                methods.makeInstallation(args).then((res) =>{
                                    this.saveLoading = false
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
                                        this.$refs.installTaskTable.$refs.table.doLayout()
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
                                    this.$refs.installTaskTable.$refs.table.doLayout()
                                    this.this.saveLoading = false
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

                        })
                    }
                })
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
                this.$refs.installTaskTable.addNewRow({
                    id:data.id,
                    skuId:data.skuId,
                    goodsName:data.goodsName,
                    speaceName:null,
                    installNum:null,
                    basicUnitName:data.basicUnitName,
                    goodsCode:data.goodsCode
                })

            }
        }
    }
</script>

<style lang="css" scoped>
    .t8t-toolbar {
        padding: 13px;
        height: 24px;
    }

    .t8t-toolbar .el-button--toolbar:first-child {
        margin-left: 8px;
    }

    .t8t-toolbar .el-button--toolbar {
        padding: 5px 11px;
        font-size: 12px;
        border-radius: 2px;
        border-color: rgb(232, 237, 241);
        color: rgb(50, 139, 239);
        margin-right: 5px;
    }

    .t8t-toolbar .el-button--toolbar:focus {
        border-color: rgb(191, 201, 217)
    }

    .t8t-toolbar .el-button--toolbar:hover {
        border-color: rgb(50, 139, 239)
    }

    .t8t-toolbar .is-disabled {
        color: rgb(191, 203, 217);
        border-color: rgb(209, 219, 229);
    }

    .t8t-toolbar .is-disabled:hover {
        border-color: rgb(209, 219, 229);
    }

    .t8t-toolbar .el-button--success.is-plain {
        color: rgb(19, 206, 102)
    }

    .t8t-toolbar .el-button--danger.is-plain {
        color: rgb(255, 86, 97)
    }

    .t8t-toolbar .el-button + .el-button {
        margin-left: 0px;
    }
    /* 深色皮肤 */
    .t8t-toolbar.t8t-dark .el-button--toolbar{
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-toolbar.t8t-dark .el-button--toolbar:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
</style>
