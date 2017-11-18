<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new receiptsDialog">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar ref="receiptsToolbar" class="t8t-dark" @SUBMIT="replenishSubmit()" @CANCEL="closeDialog()">
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                    <div class="toggle-btn-container">
                        <div class="toggle-btn el-icon-d-arrow-left" @click="onTopHide"></div>
                    </div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">
                        <el-form ref="mainTable" label-position="right" label-width="120px" :model="dataSource">
                            <el-tabs v-model="mainActiveTab">
                                <el-tab-pane label="新增补货单" name="base">
                                    <div class="field_container">
                                        <base-panel :dataSource="dataSource" :fields="fields" :mode="mode" :options="options || {}"
                                            ref="base-panel">
                                        </base-panel>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form>
                    </div>

                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <div class="t8t-detail">
                            <el-tabs v-model="subActiveTab" class="t8t-detail">
                                <el-tab-pane label="补货明细" name="list">
                                    <div class="sub-container">
                                        <div class="my-toolbar">
                                            <el-button type="primary" size="small" icon="plus" @click="addLine">新增行
                                            </el-button>
                                            <el-button type="danger" size="small" icon="close" @click="delLine">删除行
                                            </el-button>
                                        </div>

                                        <t8t-grid
                                            :columns="columns"
                                            :commonData="options"
                                            :dataSource="tableData"
                                            :pageBar="false"
                                            :editable="true"
                                            ref="t8tTable"
                                            @cell-click="handleCellClick"
                                        >
                                        </t8t-grid>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="补货原因" class="replenish-reason-dialog" v-model="replenishReasonShow1" v-if="replenishReasonShow" @close="replenishReasonShow=false">
                <el-form :model="replenishReason" :rules="replenishReasonRule" ref="replenishReason" label-position="right" label-width="100px">
                    <div class="form-item-container">
                        <el-form-item label="补货原因：" prop="replenishReason">
                            <el-select
                                v-model="replenishReason.replenishReason"
                                placeholder="--请选择--"
                            >
                                    <el-option v-for="item in options.replenishReasonList" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                     </div>
                    <div class="form-item-container">
                        <el-form-item label="补货原因详情描述：" prop="replenishReasonDetail">
                            <el-input type="textarea" v-model="replenishReason.replenishReasonDetail"></el-input>
                        </el-form-item>
                     </div>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="replenishReasonShow = false">取 消</el-button>
                <el-button type="primary" @click="saveReplenishReason" >确 定</el-button>
              </div>
            </el-dialog>
            <goods-list v-if="showGoodsSearchDialog" :goodsArgs="goodsArgs" :activeRow="goodsActiveRow"></goods-list>
    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import schema from './goodsDemand-schema.js'
    import DemandApi from 'src/services/delivery/demand.js'
    import Service from 'src/services/delivery/Service.js'
    import axios from 'src/utils/axios.js'
    import GoodsList from './goodsList.vue'
    import Cookie from 'js-cookie'
    export default {
        components: { BasePanel,GoodsList },
        data(){
            return {
                isDialogShow: true,
                isTopHide: false,
                dealerId: parseInt(Cookie.get('t8t-tc-uid')),
                dataSource: {
                    projectId: null,
                    scheduleNodeId: null,
                    goodsDemandTime: null,
                    categoryId: [],
                    remark: '',
                    installDispatch: 1,
                    ownerName: '',
                    id: null
                },
                fields: schema.replenishFields.fields,
                mode: 'edit',
                options: {
                    categoryOption: [],
                    replenishReasonList: []
                },
                mainActiveTab: 'base',
                subActiveTab: 'list',
                columns: schema.replenishTable.fields,
                tableData: [],
                replenishReasonShow:false,
                replenishReason:{
                    replenishReason:null,
                    replenishReasonDetail:null,
                    activeRow:null
                },
                replenishReasonRule:{
                    replenishReason:[
                        { type: 'number', required: true, message: '请选择补货原因', trigger:"change"}
                    ],
                    replenishReasonDetail:[
                        { required: true, message: '请填写补货原因详情描述', trigger:"blur" },
                        { max:200, min:1, message: '描述最多填写200个字', trigger:"blur"}
                    ]
                },
                replenishReasonShow1:true,
                goodsActiveRow:null,
                showGoodsSearchDialog:false,
            }
        },
        created(){
            this.fields[0].disabled = true;
            this.getCategory();
            this.$route.query.id && this.getBaseInfo(this.$route.query.id);
            DemandApi.queryProperty({ type: 1 }).then((res) => {
                    if (res.data.status == 200) {
                        this.options.replenishReasonList = res.data.result.replenishReasonList
                    }
                })
            this.getList();
        },
        methods: {
            closeDialog(){
                this.$router.go(-1);
                this.$emit('close');
            },
            onTopHide() {
                this.isTopHide = !this.isTopHide
            },
            addLine(){
                this.$refs['t8tTable'].addNewRow();
            },
            delLine(){
                this.$refs['t8tTable'].delRows();
            },
            getBaseInfo(id){
                axios({
                    service: Service.DEMAND.name,
                    method: Service.DEMAND.methods.goodsDemandQueryReplenishOrder,
                    args: {id: id}
                }).then((res)=>{
                    if(res.data.status === 200){
                        let result = res.data.result
                        result.categoryId = [];
                        if(result.categoryList.length > 0){
                            result.categoryList.forEach((item)=>{
                                result.categoryId.push(item.categoryId);
                            })
                        }
                        this.fields[0].defaultValue = { filedValue: result.projectId, textValue: result.projectId }
                        this.dataSource = result;
                    }
                }).catch((error)=>{
                })
            },
            getCategory(){
                let _list = []
                let _req = {
                    page: 1,
                    search: { pPropertyCode: "11006" },
                    size: 1000
                }
                let _self = this;
                DemandApi.queryUnionParent(_req)
                    .then((res) => {
                        if (res.data.status == 200) {
                            res.data.result.forEach((item) => {
                                _list.push({ value: item.id, text: item.propertyName })
                            })
                            _self.options.categoryOption = _list
                        } else {
                            _self.$message.error("品类读取失败！")
                            return
                        }

                    })
                    .catch((error) => {
                        _self.$message.error("品类读取失败！")
                        return false
                    })
            },
            getList(){
                axios({
                    service: Service.DEMAND.name,
                    method: Service.DEMAND.methods.goodsDemandQueryReplenishOrderItem,
                    args: { id: this.$route.query.id }
                }).then((res)=>{
                    if(res.data.status === 200){
                        this.tableData = res.data.result;
                    }
                }).catch((error)=>{
                })
            },
            handleCellClick(row, column, cell, event){
                if(column.property == "replenishReason"){
                    this.replenishReasonShow = true
                    this.replenishReasonShow1 = true
                    this.replenishReason.activeRow = this.$refs['t8tTable'].dataSource.indexOf(row)
                    if(row.replenishReason){
                        this.replenishReason.replenishReason = row.replenishReason
                        this.replenishReason.replenishReasonDetail = row.replenishReasonDetail
                    }else{
                        this.replenishReason.replenishReason = null
                        this.replenishReason.replenishReasonDetail = null
                    }
                    this.$refs['t8tTable'].handleFormItemBlur()
                    return false;
                }
                if(column.property == "skuId" || column.property == "goodsName"){
                    if(this.dataSource.projectId && this.dataSource.categoryId.length > 0){
                        this.goodsArgs = {
                            "goodsSearchDTO": {
                                projectId: this.dataSource.projectId,
                                categoryIdList: this.dataSource.categoryId
                            }
                        }
                        this.goodsActiveRow = this.$refs['t8tTable'].dataSource.indexOf(row)
                        this.showGoodsSearchDialog = true
                    }else{
                        this.$refs['t8tTable'].handleFormItemBlur()
                        this.$message.error('请补充项目ID和品类信息')
                        return
                    }
                }
            },
            saveReplenishReason(){
                this.$refs.replenishReason.validate((isValid) =>{
                    if(isValid){
                            this.$refs['t8tTable'].dataSource[this.replenishReason.activeRow]['replenishReason'] = this.replenishReason.replenishReason
                            this.$refs['t8tTable'].dataSource[this.replenishReason.activeRow]['replenishReasonDetail'] = this.replenishReason.replenishReasonDetail
                            this.replenishReason = {
                                replenishReason:null,
                                replenishReasonDetail:null,
                                activeRow:null
                            }
                            this.replenishReasonShow = false
                    }
                })
            },
            setGoodsTableRowData(activeRow, val){
                this.$refs['t8tTable'].dataSource[activeRow].skuId = val.skuId || ''
                this.$refs['t8tTable'].dataSource[activeRow].goodsId = val.goodsId || ''
                this.$refs['t8tTable'].dataSource[activeRow].goodsName = val.goodsName || ''
                this.$refs['t8tTable'].dataSource[activeRow].standard = val.standard || ''
                this.$refs['t8tTable'].dataSource[activeRow].goodsTypeName = val.goodsTypeName || ''
                this.$refs['t8tTable'].dataSource[activeRow].goodsType = val.goodsType || ''
                this.$refs['t8tTable'].dataSource[activeRow].basicUnitName = val.basicUnitName || ''
                this.$refs['t8tTable'].dataSource[activeRow].dosageDetailId = val.dosageDetailId || ''
                this.$refs['t8tTable'].dataSource[activeRow].categoryId = val.categoryId || ''
                this.$refs['t8tTable'].dataSource[activeRow].goodsDosageDetailId = val.goodsDosageDetailId || ''
                this.$refs['t8tTable'].dataSource[activeRow].basicUnit = val.basicUnit || ''
                this.$refs['t8tTable'].dataSource[activeRow].isBom = val.isBom || ''
            },
            replenishSubmit(){
                this.$TCS.addTag('red_5216_010002003003') //点击流
                let _self = this
                _self.validate((validate) => {
                    if (validate) {
                        let createDTO = {
                            projectId: _self.dataSource.projectId,
                            installDispatch: _self.dataSource.installDispatch,
                            goodsDemandTime: _self.dataSource.goodsDemandTime,
                            remark: _self.dataSource.remark,
                            createUser: _self.dealerId,
                            createItemDTOS: [],
                            deleteIds: [],
                            id: this.$route.query.id
                        }
                        if (_self.tableData.length > 0) {
                            createDTO.createItemDTOS = _self.tableData
                        }else {
                            this.$message.error("请添加补货物品")
                            return false
                        }
                        let rows = this.$refs['t8tTable'].getActionLog(false,true);
                        createDTO.deleteIds = rows.deletedIDs;
                        _self.$refs['receiptsToolbar'].disableBySymbol('SUBMIT');
                        DemandApi.applyReplenishGoods({createDTO: createDTO})
                            .then((res) => {
                                _self.$refs['receiptsToolbar'].unDisableBySymbol('SUBMIT');
                                if (!res.data || res.data.status != 200) {
                                    _self.$msgbox({
                                        title: '消息',
                                        message: res.data.message || '操作失败',
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    return false
                                } else {
                                    _self.$msgbox({
                                        title: '消息',
                                        message: '操作成功',
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain',
                                        callback: ()=>{
                                            this.closeDialog()
                                        }
                                    })
                                }
                            })
                            .catch((error) => {
                                _self.$refs['receiptsToolbar'].unDisableBySymbol('SUBMIT');
                                return
                            })
                    }
                })

            },
            validate (cb) {
                let that = this
                that.validateMainTable((isValid) => {
                    if (isValid) {
                        this.$refs['t8tTable'].validate((isValid1) => {
                            cb(isValid1)
                        }, true)
                    }
                })
            },
            validateMainTable(callback) {
                this.$refs['mainTable'].validate((isValid) => {
                    callback && callback(isValid)
                })
            },
        }
    }
</script>
