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
                                        <el-form-item label="配送时间：" prop="disPlanDeliverTime">
                                            <el-date-picker
                                                class="date-editor_time"
                                               v-model="formData.disPlanDeliverTime"
                                               type="date" placeholder="请选择配送时间"
                                               :picker-options="pickerOptions"
                                               :disabled="eidtType"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="工地地址：">
                                            <el-input v-model="formData.address" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="品类：">
                                            <el-select v-model="formData.categorys" multiple placeholder="--请选择--" :disabled="true">
                                                <el-option v-for="item in commonOptionsConfig.categoryList" :label="item.text" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="仓库分组：" prop="storageGroupId">
                                            <el-select v-model="formData.storageGroupId" placeholder="--请选择--" :disabled="editable">
                                                <el-option v-for="item in commonOptionsConfig.storageGroup" :label="item.text" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="仓库管理员：">
                                            <el-input v-model="formData.storekeeperName" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="activeTabName">
                            <el-tab-pane label="商品明细" name="one">
                                <t8t-table
                                    :service="goodsInfoServer"
                                    :columns="columns"
                                    :pageBar="true"
                                    :indexCol="true"
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
    </div>
</template>

<script>
import api from 'src/services/delivery/distribution.js'
import Utils from 'src/utils/Utils.js'
import Services from 'src/services/delivery/Service.js'
    export default {
        name:'formulate-distribution',
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
                activeTabName: "one",
                formData:{
                    address:'',
                    disPlanDeliverTime:null,
                    categorys:[],
                    storageGroupId:null
                },
                commonOptionsConfig:{
                    storageGroup:[],
                    categoryList:[]
                },
                formRule:{
                    storageGroupId:[
                         {type:'number', required: true,message: "请选择仓库组织", trigger:"change"}
                    ],
                    disPlanDeliverTime:[
                        {type: 'date', required: true,message: "请选择可安装日期", trigger:"blur"}
                    ]
                },
                columns:[
                    {prop: 'skuId', label: 'SKUID'},
                    {prop: 'name', label: '商品名称'},
                    {prop: 'specification', label: '商品规格'},
                    {prop: 'deliverAmount', label: '配送数量'},
                    {prop: 'stockNum', label: '仓库库存'}
                ],
                dataSource:[
                ],
                pickerOptions:{
                     disabledDate(time) {
                        return time.getTime() < Date.now();
                   }
                },
                storageVOS:[],
                goodsInfoArgs:null,
                goodsInfoMethod:null,
                goodsInfoServer:null,
                applyId:null,
                scheduleNodeId:null,
                saveLoading:false

            }
        },
        created(){
            this.initData(this.id)
        },
        watch:{
            "formData.storageGroupId":function(val){
                if(val){
                    let active = this.storageVOS.find(item => item.storageGroupId == val)
                    this.formData.storekeeperId = active.storekeeperId
                    this.formData.storekeeperName = active.storekeeperName
                }else{
                     this.formData.storekeeperId = null
                    this.formData.storekeeperName = null
                }
                this.setGoodsInfo(val);
            }
        },
        methods: {
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                // 填写对应的路由
                this.$parent.formulateDistributionShow = false
            },
            setGoodsInfo(storageGroupId ){
                if(!this.applyId || !this.scheduleNodeId)
                    return
                this.goodsInfoArgs = {applyId:this.applyId, scheduleNodeId:this.scheduleNodeId, invGroupId:storageGroupId}
                this.goodsInfoMethod =  Services.DISTRIBUTION.methods.getGoodsInfo
                this.goodsInfoServer = Services.DISTRIBUTION.name
            },
            save(){
                this.$refs.formRef.validate((isValid) =>{
                    if(isValid){
                        let disPlanDeliverTime = +Date.parse(this.formData.disPlanDeliverTime).toString().slice(0, -3)
                        let args = {deliverPlan:{id:this.id, invGroupId:this.formData.invGroupId, disPlanDeliverTime: disPlanDeliverTime, userId:Cookie.get('t8t-tc-uid')}}
                        this.saveLoading = true
                        this.$confirm('确认提交么？', '提交确认', {
                               confirmButtonText: '确定',
                               cancelButtonText: '取消',
                               type: 'warning'
                        }).then(() => {
                            api.makeDeliverPlan(args).then((res) =>{
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
                                                _this.$parent.$refs['list-view'].getTableInstance().reloadTable();
                                            })
                                }else{
                                    this.$msgbox({
                                            title: '提交失败',
                                            type: 'error',
                                            message: res.data.message,
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                }
                            }).catch(() =>{
                                this.this.saveLoading = false
                                this.$msgbox({
                                            title: '服务器异常',
                                            type: 'error',
                                            message: res.data.message,
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                            })
                        })
                    }
                })
            },
            initData(id){
                let args = {id:id}
                api.drawDeliverPlanView(args).then((res) =>{
                             if(res.data.status == 200){
                                    this.applyId = res.data.result.applyId
                                    this.scheduleNodeId = res.data.result.scheduleNodeId
                                   this.formData.address = res.data.result.address
                                   this.formData.categoryName = res.data.result.categoryName
                                   this.storageVOS = res.data.result.storageVOS
                                   this.commonOptionsConfig.storageGroup = []
                                   this.commonOptionsConfig.categoryList = []
                                   this.formData.categorys = []
                                   var _this = this
                                   res.data.result.storageVOS && res.data.result.storageVOS.forEach(function(item){
                                        _this.commonOptionsConfig.storageGroup.push({
                                             text:item.storageName,
                                             value:item.storageGroupId
                                        })
                                   })
                                   res.data.result.categoryVOs && res.data.result.categoryVOs.forEach(item =>{
                                         _this.commonOptionsConfig.categoryList.push({
                                             text:item.category,
                                             value:item.categoryId
                                        })
                                         _this.formData.categorys.push(item.categoryId)
                                   })
                             }
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
