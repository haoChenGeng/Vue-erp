<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new receiptsDialog">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            ref="receiptsToolbar"
                            class="t8t-dark"
                            :symbolList="receiptsToolbarList"
                            @ADD-SUBMIT="addSubmit()"
                            @REPLENISH-SUBMIT="replenishSubmit()"
                            @CANCEL="closeDialog()"
                            @TEMP-SAVE="tempBtn"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                    <div class="toggle-btn-container">
                        <div class="toggle-btn el-icon-d-arrow-left" @click="onTopHide"></div>
                    </div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center"
                         v-loading.body.lock="formLoading">
                        <el-form ref="mainTable"
                                 label-position="right"
                                 label-width="120px"
                                 :model="dataSource"
                                 :show-message="mode !== 'view'"
                        >

                            <el-tabs v-model="mainActiveTab">
                                <el-tab-pane :label="mainTable.label" :name="mainTable.name">

                                    <div class="field_container">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="mainTable.fields"
                                            :mode="mode"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="mainTable.name"
                                            @click="handleClick"
                                            @blur="handleBlur"
                                            @change="handleChange"
                                            @select-change="handleSelectChange"
                                            @popup-on-select="popupSelect"
                                            @popup-on-change="popupChange"
                                        ></base-panel>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form>
                    </div>

                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <div class="t8t-detail">
                            <el-tabs v-model="subActiveTab" class="t8t-detail" v-show="mode == 'replenish'">
                                <el-tab-pane :label="subTables.label" :name="subTables.name">
                                    <div class="sub-container">
                                        <!-- 新增和编辑模式才出现按钮 -->
                                        <div class="my-toolbar" v-if="this.mode == 'replenish' ? true : false">
                                            <el-button
                                                type="primary"
                                                size="small"
                                                icon="plus"
                                                @click="addLine(subTables.name)"
                                            >新增行
                                            </el-button>
                                            <el-button
                                                type="danger"
                                                size="small"
                                                icon="close"
                                                @click="delLine(subTables.name)"
                                            >删除行
                                            </el-button>
                                        </div>


                                        <!--table-->
                                        <t8t-grid
                                            :preLoad="false"
                                            :columns="subTables.fields"
                                            :dataSource="subTablesSource"
                                            :service="subTables.service"
                                            :method="subTables.method"
                                            :args="subTables.args"
                                            :pageBar="subTables.pageBar"
                                            :isLoading="subTableLoading"
                                            :templateData="templateData"
                                            :editable="(mode === 'replenish' || mode === 'add' || mode === 'edit') ? true : false"
                                            :selectCol="mode === 'replenish' ? true : false"
                                            :ref="subTables.name"
                                            :commonData="options || {}"
                                            @selection-change="selectionChange"
                                            @row-double-click="rowDbClick"
                                            @current-row-change="currentRowChange"
                                            @current-page-change="currentPageChange"
                                            @size-change="sizeChange"
                                            @sort-change="sortChange"
                                            @cell-editor-change="onEditorChange"
                                            @cell-click="handleCellClick"
                                        ></t8t-grid>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                            <el-tabs v-model="categoryActiveTab" class="t8t-detail">
                                <el-tab-pane v-for="(item,index) in categoryAndGoodsList" :label="item.categoryName" :name="'tab_'+index">
                                    <div class="sub-container">
                                        <div class="my-toolbar">
                                            <el-button
                                                v-if="delBtnShow"
                                                type="danger"
                                                size="small"
                                                icon="close"
                                                @click="delRow(index)"
                                            >删除行
                                            </el-button>
                                        </div>
                                        <t8t-grid
                                            :columns="subTables.fields"
                                            :dataSource="item.goodsMsgVOS"
                                            :pageBar="false"
                                            :editable="true"
                                            :ref="'goodsTable_'+index"
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
    import axios from 'src/utils/axios.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import schema from './goodsDemand-schema'
    import Service from 'src/services/delivery/Service.js'
    import mapi from 'src/services/delivery/model.js'
    import DemandApi from 'src/services/delivery/demand.js'
    import Cookie from 'js-cookie'
    import GoodsList from './goodsList.vue'
    export default {
        name: 't8t-dt-view',
        components: {BasePanel,GoodsList},
        data () {
            return {
                id: null,
                mode: "",
                // 主表绑定数据源
                dataSource: {
                    projectId: null,
                    scheduleNodeId: null,
                    goodsDemandTime: null,
                    categoryId: [],
                    remark: '',
                    installDispatch: 1,
                    ownerName:'',
                    id:null
                },
                // 附表绑定数据源，只有panel（一对一）形式展示的需要绑定，table（一对多）的不需要
                subDataSource: {},
                // 所有配置全部初始化在这里
                options: {
                    installDispatchOption: [
                        {text: "是", value: 1},
                        {text: "否", value: 2}
                    ],
                    categoryOption: [],
                    scheduleNodeOption: [],
                    installDispatch: [],
                    materialType: [],
                    goodsDemandSource: [],
                    bizTypeId: [],
                    status: [],
                    replenishReasonList:[]
                },
                schema: schema,
                mainTable: {},
                subTables: {},


                // 控制主表区域收缩
                isTopHide: false,
                isDialogShow: true,
                // 主表tab默认激活页
                mainActiveTab: '',
                // 附表tab默认激活页
                subActiveTab: '',
                // 点击关闭后的返回route
                goBackRoute: '/tuchat-delivery/demand-list',
                sourceMap: {},
                columns: {},
                receiptsToolbarList: [],
                subTablesSource: [],
                dealerId: parseInt(Cookie.get('t8t-tc-uid')),
                dealerName: Cookie.get('t8t-tc-username'),
                subTableLoading: false,
                formLoading: false,
                clearScheduleNodeId:true,
                templateData:{
                    skuId:null,
                    goodsName:null,
                    standard:null,
                    estimateAmount:null,
                    goodsDemandAmount:null,
                    basicUnitName:null,
                    replenishReason:null,
                    replenishReasonDetail:null
                },
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
                showGoodsSearchDialog:false,
                replenishReasonShow1:true,
                goodsArgs:null,
                goodsActiveRow:null,
                categoryActiveTab: 'tab_0',
                categoryAndGoodsList: [],
                delBtnShow: false
            }
        },
        created () {
            let _self = this
            // 初始化通用query
            this.id = this.$route.query.id
            this.mode = this.$route.query.mode || 'add'
            switch (this.mode) {
                case "add":
                    this.mainTable = schema.addFields
                    this.mainTable.fields[0].disabled = false //项目id
                    this.mainTable.fields[2].disabled = false //要货批次
                    this.subTables = schema.addTable
                    break
                case "replenish":
                    this.mainTable = schema.replenishFields
                    this.subTables = schema.replenishTable
                    break
                case "edit":
                    this.mainTable = schema.editFields
                    this.subTables = schema.addTable
                    break
                default:

            }
            this.$nextTick(function () {
                let _list
                let _req
                switch (_self.mode) {
                    case  'add':
                        _self.receiptsToolbarList = ['ADD-SUBMIT', 'CANCEL', 'TEMP-SAVE']
                        break
                    case 'edit':
                        _self.receiptsToolbarList = ['ADD-SUBMIT', 'CANCEL', 'TEMP-SAVE']
                        break
                    case 'replenish':
                        _list = []
                        _req = {
                            page: 1,
                            search: {pPropertyCode: "11006"},
                            size: 1000
                        }
                        _self.formLoading = true
                        DemandApi.queryUnionParent(_req)
                            .then((res) => {
                                _self.formLoading = false
                                if (res.data.status == 200) {
                                    res.data.result.forEach((item) => {
                                        _list.push({value: item.id, text: item.propertyName})
                                    })
                                    _self.options.categoryOption = _list
                                } else {
                                    _self.$message.error("品类读取失败！")
                                    return
                                }

                            })
                            .catch((error) => {
                                _self.formLoading = false
                                _self.$message.error("品类读取失败！")
                                return false
                            })
                        _self.receiptsToolbarList = ['REPLENISH-SUBMIT', 'CANCEL', 'CRM']
                        break
                }
            })
            if(this.$route.query.projectId){
                this.dataSource.projectId = this.$route.query.projectId
                this.mainTable.fields[0].defaultValue = {filedValue:this.$route.query.projectId, textValue:this.$route.query.projectId}
                if(this.mode == 'add'){
                    this.setScheduleList()
                }
            }else{
                this.mainTable.fields[0].defaultValue = null
            }
            schema.mainTable.args.id = _self.id
            if(this.mode == 'add' && this.$route.query.procInsId){
                this.clearScheduleNodeId = false
                mapi.projectNodeGetByProcessId({processId:this.$route.query.procInsId}).then((res) => {
                      if(res.data.status == 200){
                            if(!res.data.result.projectId || !res.data.result.projectId){
                                return
                            }
                            this.dataSource.projectId = res.data.result.projectId
                            this.dataSource.scheduleNodeId = res.data.result.id
                            this.mainTable.fields[0].defaultValue = {filedValue:res.data.result.projectId, textValue:res.data.result.projectId}
                            this.mainTable.fields[0].disabled = true
                            this.mainTable.fields[1].disabled = true
                            this.subTableLoading = true
                            DemandApi.queryNoTookGoods({projectId: this.dataSource.projectId, nodeId: this.dataSource.scheduleNodeId}).then((res) => {
                                    this.subTableLoading = false
                                    if (res.data && res.data.status == 200) {
                                        let _list = []
                                        let _selected = []
                                        if (res.data.result.categoryList.length > 0) {
                                            res.data.result.categoryList.forEach((item) => {
                                                _list.push({text: item.category, value: item.categoryId})
                                                _selected.push(item.categoryId)
                                            })
                                        }
                                        this.options.categoryOption = _list
                                        this.dataSource.categoryId = _selected
                                        if (res.data.result.goodsMsgVOS && res.data.result.goodsMsgVOS.length > 0) {
                                            this.subTablesSource = res.data.result.goodsMsgVOS
                                        }
                                    }
                                })
                      }
                })

            }
            //要货原因获取
            if(this.mode == 'replenish'){
                DemandApi.queryProperty({type:1}).then((res) => {
                        if(res.data.status == 200){
                             this.options.replenishReasonList = res.data.result.replenishReasonList
                        }
                })
            }
            if(this.mode == 'edit') {
                this.getTempHeadInfo(this.getTempItemHeadInfo)
            }
            // 初始化主附表
            this.initMainTable()
            this.initSubTable()
            //校验删除行权限
            this.checkDeletePermission();
        },
        watch:{
            "dataSource.projectId":function(val){
                if(val){
                    DemandApi.queryProjectId({search:{projectId:val}, page:1, size:1}).then((res) =>{
                        if(res.data.status == 200 && res.data.result.rows.length > 0){
                            this.dataSource.ownerName = res.data.result.rows[0].ownerName
                        }
                    })
                }else{
                    this.dataSource.ownerName = ''
                }
            }
        },
        methods: {
            onTopHide () {
                this.isTopHide = !this.isTopHide
            },
            checkDeletePermission(){
                axios({
                    service: Service.DEMAND.name,
                    method: Service.DEMAND.methods.goodsDemandCheckDeletePermission,
                    args: {
                        accountId: +Cookie.get('t8t-tc-uid'),
                        ticket: Cookie.get('t8t-tc-ticket')
                    }
                }).then((res)=>{
                    if(res.data.status === 200){
                        this.delBtnShow = res.data.result;
                    } else {
                        this.delBtnShow = false;
                    }
                }).catch((error)=>{
                    this.delBtnShow = false;
                })
            },
            /**
             * 初始化附表
             */
            initSubTable () {
                let that = this, schema = this.subTables, fieldCache
                that.subActiveTab = schema.name
            },
            /**
             * 初始化主表
             */
            initMainTable () {
                this.mainActiveTab = this.mainTable.name
            },
            /**
             * 主表表单校验
             * @param callback
             */
            validateMainTable(callback) {
                this.$refs['mainTable'].validate((isValid) => {
                    callback && callback(isValid)
                })
            },
            /**
             * 新增行
             * @param tabName
             */
            addLine (tabName) {
                if (this.dataSource.projectId && this.dataSource.categoryId.length > 0) {
                    this.$refs[tabName].addNewRow()
                } else {
                    this.$message.error("请补充项目ID和品类信息")
                    this.resetVal("TABLE")
                    return false
                }

            },
            /**
             * 删除行
             * @param tabName
             */
            delLine (tabName) {
                this.$refs[tabName].delRows()
            },
            delRow(index){
                let table = this.$refs['goodsTable_' + index][0];
                let rows = table.getSelectRows();
                if(rows.length == 0){
                    this.$message.error('请选择需要删除的行！');
                    return false;
                }
                let ids = [];
                rows.forEach((item)=>{
                    if(typeof item.id !== 'undefined' && item.id > 0){
                        ids.push(item.id)
                    }
                })
                if(ids.length > 0){
                    this.$confirm('是否确认删除行？','提示',{
			        	type: 'warning'
			        }).then(()=>{
                        axios({
                            service: Service.DEMAND.name,
                            method: Service.DEMAND.methods.goodsDemandItemDeleteByIds,
                            args: {
                                "ids": ids
                            }
                        }).then((res)=>{
                            if(res.data.status === 200){
                                //删除行操作
                                table.delRows();
                                this.$message.success('删除成功！');
                            }else if(res.data.status === 607){
                                this.$message.error('权限不足！');
                            } else {
                                this.$message.error('删除失败！');
                            }
                        }).catch((error)=>{
                            this.$message.error('请求失败，请重试！');
                        })
                    }).catch((error)=>{
                    })
                }else{
                    //删除行操作
                    table.delRows();
                }
            },
            /**
             * 关闭弹窗
             */
            closeDialog () {
//                let _self = this
//                if(this.id) {
//                    this.$confirm('是否确认取消要货单？', '取消确认', {
//                        type: 'warning',
//                        confirmButtonText: '确认',
//                        cancelButtonText: '取消',
//                    }).then((confirm) => {
//                        _self.$refs['receiptsToolbar'].disableBySymbol('CANCEL');
//                        DemandApi.cancelOrder({
//                            id: this.id,
//                            updateUser: Cookie.get('t8t-tc-uid')
//                        }).then((res) => {
//                            _self.$refs['receiptsToolbar'].unDisableBySymbol('CANCEL');
//                            if (res.data && res.data.status == 200) {
//                                _self.$msgbox({
//                                    title: '消息',
//                                    message: '操作成功',
//                                    type: 'success',
//                                    showCancelButton: false,
//                                    confirmButtonText: '知道了',
//                                    confirmButtonClass: 'is-plain'
//                                })
//                                _self.$refs['list-view'].getTableInstance().reloadTable()
//                                return false
//                            } else {
//                                let message = ''
//                                if (res.data && res.data.status == -2) {
//                                    message = '该订单已经有部分商品已发货，无法取消'
//                                } else {
//                                    message = res.data.message || '取消失败'
//                                }
//                                _self.$msgbox({
//                                    title: '消息',
//                                    message: message,
//                                    type: 'error',
//                                    showCancelButton: false,
//                                    confirmButtonText: '知道了',
//                                    confirmButtonClass: 'is-plain'
//                                })
//                                return false
//                            }
//                        }).catch((error) => {
//                            _self.$refs['receiptsToolbar'].unDisableBySymbol('CANCEL');
//                            _self.$msgbox({
//                                title: '消息',
//                                message: '取消失败',
//                                type: 'error',
//                                showCancelButton: false,
//                                confirmButtonText: '知道了',
//                                confirmButtonClass: 'is-plain'
//                            })
//                            return false
//                        })
//                    })
//                }
                //this.$router.push({path: this.goBackRoute})
                this.$router.go(-1);
                this.$emit('close')
            },
            /**
             * 对整个页面数据进行校验
             * @param cb 校验完成后的回调函数，回调参数为校验结果（true|false）
             */
            validate (cb) {
                let that = this
                that.validateMainTable((isValid) => {
                    if (isValid) {
                        that.validateSubTables((isSubValid) => {
                            cb && cb(isSubValid)
                        })
                    } else {
                        cb && cb(isValid)
                    }
                })
            },
            validate2(){
                var flag = true;
                for(var i = 0; i < this.categoryAndGoodsList.length; i++){
                    var name = 'goodsTable_'+ i;
                    var validResult = this.$refs[name][0].validate(()=>{},true,true);
                    if(!validResult){
                        this.categoryActiveTab = 'tab_' + i;
                        setTimeout(()=>{
                            this.$refs[name][0].doLayout();
                        },100);
                        flag = false;
                        break;
                    }
                }
                return flag;
            },
            /**
             * 附表参数校验
             * @param cb 回调函数
             * @param key
             */
            validateSubTables (cb, key) {
                let k = key || 0, that = this

                if (!this.subTables) {
                    cb && cb(true)
                    return
                }

                // 通过schema中的定义的tab.name去递归遍历校验

                this.$refs[this.subTables.name].validate((isValid) => {
                    cb(isValid)
                }, true)
            },
            handleChange(obj, field, event) {
                let _self = this
                if (field.prop === "projectId" && this.mode == "replenish") {
                    this.resetVal("TABLE")
                }

                if (field.prop === "projectId" && this.mode == 'add') {
                    _self.resetVal("ALL")
                    let _list = []
                    if (this.dataSource.projectId) {
                            this.setScheduleList()
                    }
                }
            },
            setScheduleList(){
                    let _self = this
                    let _list = []
                    _self.formLoading = true
                    DemandApi.queryNodeByProjectId({projectId: parseInt(this.dataSource.projectId)})
                        .then((res) => {
                            _self.formLoading = false
                            if (res.data && res.data.status == 200) {
                                if (res.data.result.length > 0) {
                                    res.data.result.forEach((item) => {
                                        _list.push({value: item.nodeId, text: item.nodeTypeName, installDispatch:item.installDispatch})
                                    })
                                } else {
                                    _self.$message.error('要货批次获取失败')
                                    return false
                                }
                                _self.options.scheduleNodeOption = _list
                            } else {
                                _self.dataSource.projectId = ''
                                _self.$msgbox({
                                    title: '消息',
                                    message: '无效的项目ID',
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                return false
                            }
                        })
                        .catch((error) => {
                            _self.formLoading = false
                            _self.$msgbox({
                                title: '消息',
                                message: error || '无效的项目ID',
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            return false
                        })
            },
            handleSelectChange(val, node) {
                let _self = this
                if (node === "scheduleNodeId" && val > 0 && this.mode == 'add') {
                    if (!_self.dataSource.projectId) {
                        _self.$message.error("请输入项目ID!")
                        _self.resetVal("ALL")
                        return false
                    }
                    _self.resetVal("TABLE")
                    _self.subTableLoading = true
                    DemandApi.queryNoTookGoods({projectId: Number.parseInt(_self.dataSource.projectId), nodeId: Number.parseInt(val)})
                        .then((res) => {
                            this.categoryAndGoodsList = [];
                            _self.subTableLoading = false
                            if (res.data && res.data.status == 200) {
                                let _list = []
                                let _selected = []
                                // if (res.data.result.categoryList.length > 0) {
                                //     res.data.result.categoryList.forEach((item) => {
                                //         _list.push({text: item.category, value: item.categoryId})
                                //         _selected.push(item.categoryId)
                                //     })
                                // } else {
                                //     _self.$msgbox({
                                //         title: '消息',
                                //         message: '商品详情获取失败',
                                //         type: 'error',
                                //         showCancelButton: false,
                                //         confirmButtonText: '知道了',
                                //         confirmButtonClass: 'is-plain'
                                //     })
                                //     return false
                                // }
                                _self.options.categoryOption = _list
                                if(res.data.result.length > 0){
                                    this.categoryAndGoodsList = res.data.result;
                                    //初始化tab位置
                                    this.categoryActiveTab = 'tab_0';
                                }else{
                                    _self.$msgbox({
                                        title: '消息',
                                        message: '商品详情获取失败',
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    return false
                                }
                                _self.dataSource.categoryId = _selected
                                // if (res.data.result.goodsMsgVOS.length > 0) {
                                //     _self.subTablesSource = res.data.result.goodsMsgVOS
                                // }
                            } else {
                                _self.$msgbox({
                                    title: '消息',
                                    message: '商品详情获取失败',
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                return false
                            }
                        })
                        .catch((error) => {
                            _self.subTableLoading = false
                            // console.log(error);
                            _self.$msgbox({
                                title: '消息',
                                message: '商品详情获取失败',
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            return false
                        })
                }
            },
            resetVal(type){
                switch (type) {
                    case 'ALL':
                        this.dataSource.categoryId.length > 0  ? this.dataSource.categoryId = [] : ''
                        this.dataSource.goodsDemandTime = null
                        this.clearScheduleNodeId ? this.dataSource.scheduleNodeId = null : ''
                        this.options.categoryOption = []
                    case 'TABLE':
                        this.subTablesSource = []
                        this.categoryAndGoodsList = []
                        break;
                    default:
                        return
                }
            },
            addSubmit() {
                this.$TCS.addTag('red_5216_010002003001') //点击流
                let _self = this
                this.validateMainTable((isValid) => {
                    if (isValid && this.validate2()) {
                        let createDTO = {
                            projectId: Number.parseInt(_self.dataSource.projectId),
                            scheduleNodeId: Number.parseInt(_self.dataSource.scheduleNodeId),
                            goodsDemandTime: _self.dataSource.goodsDemandTime,
                            remark: _self.dataSource.remark,
                            createUser: _self.dealerId,
                            createItemDTOS: [],
                            id: _self.dataSource.id || null
                        }
                        let list = [];
                        this.categoryAndGoodsList.forEach((item)=>{
                            list = list.concat(item.goodsMsgVOS);
                        })
                        if (list.length > 0) {
                            createDTO.createItemDTOS = list
                        } else {
                            this.$message.error("要货商品不能为空")
                            return false
                        }
                        _self.$refs['receiptsToolbar'].disableBySymbol('ADD-SUBMIT');
                        DemandApi.createNormalOrder({ createDTO: createDTO })
                            .then((res) => {
                                _self.$refs['receiptsToolbar'].unDisableBySymbol('ADD-SUBMIT');
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
                                            _self.closeDialog()
                                        }
                                    })
                                }
                            })
                            .catch((error) => {
                                _self.$refs['receiptsToolbar'].unDisableBySymbol('ADD-SUBMIT');
                                return
                            })
                    }
                })
                return;

                _self.validate((validate) => {
                    if (validate) {
                        let createDTO = {
                            projectId: Number.parseInt(_self.dataSource.projectId),
                            scheduleNodeId: Number.parseInt(_self.dataSource.scheduleNodeId),
                            goodsDemandTime: _self.dataSource.goodsDemandTime,
                            remark: _self.dataSource.remark,
                            createUser: _self.dealerId,
                            createItemDTOS: [],
                            id:_self.dataSource.id || null
                        }
                        if (_self.subTablesSource.length > 0) {
                            createDTO.createItemDTOS = _self.subTablesSource
                        }else{
                            this.$message.error("要货商品不能为空")
                            return false
                        }
                        _self.$refs['receiptsToolbar'].disableBySymbol('ADD-SUBMIT');
                        DemandApi.createNormalOrder({createDTO: createDTO})
                            .then((res) => {
                                _self.$refs['receiptsToolbar'].unDisableBySymbol('ADD-SUBMIT');
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
                                            _self.closeDialog()
                                        }
                                    })
                                }
                            })
                            .catch((error) => {
                                _self.$refs['receiptsToolbar'].unDisableBySymbol('ADD-SUBMIT');
                                return
                            })
                    }
                })
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
                            createItemDTOS: []
                        }
                        if (_self.subTablesSource.length > 0) {
                            createDTO.createItemDTOS = _self.subTablesSource
                        }else {
                            this.$message.error("请添加补货物品")
                            return false
                        }
                        _self.$refs['receiptsToolbar'].disableBySymbol('REPLENISH-SUBMIT');
                        DemandApi.applyReplenishGoods({createDTO: createDTO})
                            .then((res) => {
                                _self.$refs['receiptsToolbar'].unDisableBySymbol('REPLENISH-SUBMIT');
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
                                            _self.closeDialog()
                                        }
                                    })
                                }
                            })
                            .catch((error) => {
                                _self.$refs['receiptsToolbar'].unDisableBySymbol('REPLENISH-SUBMIT');
                                return
                            })
                    }
                })

            },
            popupChange(val, field) {
                let _self = this
                if (field === "projectId" && this.mode == "replenish") {
                    this.resetVal("TABLE")
                }

                if (field === "projectId" && this.mode == 'add') {
                    _self.resetVal("ALL")
                    let _list = []
                    _self.options.scheduleNodeOption = _list
                    if (val) {
                        _self.formLoading = true
                        DemandApi.queryNodeByProjectId({projectId: parseInt(this.dataSource.projectId)})
                            .then((res) => {
                                _self.formLoading = false
                                if (res.data && res.data.status == 200) {
                                    if (res.data.result.length > 0) {
                                        res.data.result.forEach((item) => {
                                            _list.push({value: item.nodeId, text: item.nodeTypeName})
                                        })
                                    } else {
                                        this.$message.error("项目要货批次获取失败")
                                        return false
                                    }
                                    _self.options.scheduleNodeOption = _list
                                }
                            })
                            .catch((error) => {
                                _self.formLoading = false
                                return false
                            })
                    }
                }
            },
            handleCellClick(row, column, cell, event){
                if(column.property == "replenishReason"){
                    this.replenishReasonShow = true
                    this.replenishReasonShow1 = true
                    this.replenishReason.activeRow = this.$refs[this.subTables.name].dataSource.indexOf(row)
                    if(row.replenishReason){
                        this.replenishReason.replenishReason = row.replenishReason
                        this.replenishReason.replenishReasonDetail = row.replenishReasonDetail
                    }else{
                        this.replenishReason.replenishReason = null
                        this.replenishReason.replenishReasonDetail = null
                    }
                    this.$refs[this.subTables.name].handleFormItemBlur()
                    return false;
                }

                if(this.mode == "replenish" && (column.property == "skuId" || column.property == "goodsName")){
                    if(this.dataSource.projectId && this.dataSource.categoryId.length > 0){
                        this.goodsArgs = {
                            "goodsSearchDTO": {
                                projectId: this.dataSource.projectId,
                                categoryIdList: this.dataSource.categoryId
                            }
                        }
                        this.goodsActiveRow = this.$refs[this.subTables.name].dataSource.indexOf(row)
                        this.showGoodsSearchDialog = true
                    }else{
                        this.$refs.replenishTable.handleFormItemBlur()
                        this.$message.error('请补充项目ID和品类信息')
                        this.resetVal("TABLE")
                        return
                    }
                }
            },
            saveReplenishReason(){
                this.$refs.replenishReason.validate((isValid) =>{
                    if(isValid){
                            this.$refs[this.subTables.name].dataSource[this.replenishReason.activeRow]['replenishReason'] = this.replenishReason.replenishReason
                            this.$refs[this.subTables.name].dataSource[this.replenishReason.activeRow]['replenishReasonDetail'] = this.replenishReason.replenishReasonDetail
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
                    this.$refs[this.subTables.name].dataSource[activeRow].goodsId = val.goodsId || ''
                    this.$refs[this.subTables.name].dataSource[activeRow].skuId = val.skuId || ''
                    this.$refs[this.subTables.name].dataSource[activeRow].goodsName = val.goodsName || ''
                    this.$refs[this.subTables.name].dataSource[activeRow].standard = val.standard || ''
                    this.$refs[this.subTables.name].dataSource[activeRow].goodsTypeName = val.goodsTypeName || ''
                    this.$refs[this.subTables.name].dataSource[activeRow].goodsType = val.goodsType || ''
                    this.$refs[this.subTables.name].dataSource[activeRow].basicUnitName = val.basicUnitName || ''
                    this.$refs[this.subTables.name].dataSource[activeRow].dosageDetailId = val.dosageDetailId || ''
                    this.$refs[this.subTables.name].dataSource[activeRow].categoryId = val.categoryId || ''
                    this.$refs[this.subTables.name].dataSource[activeRow].goodsDosageDetailId = val.goodsDosageDetailId || ''
                    this.$refs[this.subTables.name].dataSource[activeRow].basicUnit = val.basicUnit || ''
                    this.$refs[this.subTables.name].dataSource[activeRow].isBom = val.isBom || ''
            },
            tempBtn(){
                this.$TCS.addTag('red_5216_010002003005') //点击流
                let _error = false
                this.$refs['mainTable'].validateField("projectId",(isValid) => {
                    _error = isValid || false
                    if(this.mode === 'add') {
                        this.$refs['mainTable'].validateField("scheduleNodeId",(isValid) => {
                            _error = isValid || false
                            if(!_error) {
                                this.TempSaveReq()
                            }
                        })
                        return
                    }
                    if(!_error) {
                        this.TempSaveReq()
                    }
                })
            },
            TempSaveReq(){
                if(!this.validate2()){
                    return;
                }
                let _self = this
                let createDTO = {
                    projectId: Number.parseInt(_self.dataSource.projectId),
                    scheduleNodeId: Number.parseInt(_self.dataSource.scheduleNodeId) || 0,
                    goodsDemandTime: _self.dataSource.goodsDemandTime,
                    remark: _self.dataSource.remark,
                    createUser: _self.dealerId,
                    createItemDTOS: [],
                    id:_self.dataSource.id
                }
                // if (_self.subTablesSource.length > 0) {
                //     createDTO.createItemDTOS = _self.subTablesSource.filter(function(item){
                //         return item.goodsDemandAmount > 0
                //     })
                // }
                let list = [];
                this.categoryAndGoodsList.forEach((item)=>{
                    list = list.concat(item.goodsMsgVOS);
                })
                createDTO.createItemDTOS = list;
                _self.$refs['receiptsToolbar'].disableBySymbol('TEMP-SAVE');
                DemandApi.goodsDemandSave({createDTO: createDTO})
                    .then((res) => {
                        _self.$refs['receiptsToolbar'].unDisableBySymbol('TEMP-SAVE');
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
                                confirmButtonClass: 'is-plain'
                            })
                            //_self.mainTable = schema.editFields
                            _self.mainTable.fields[0].disabled = true //项目id
                            _self.mainTable.fields[2].disabled = true //要货批次
                            this.id = res.data.result
                            this.mode = 'edit'
                            _self.getTempHeadInfo(_self.getTempItemHeadInfo)
                        }
                    })
                    .catch((error) => {
                        _self.$refs['receiptsToolbar'].unDisableBySymbol('TEMP-SAVE');
                        return
                    })
            },
            getTempHeadInfo(cb){
                let _self = this
                //_self.formLoading = true
                DemandApi.querySaveOrder({id:this.id || null}).then(res => {
                    //_self.formLoading = false
                    if(res.data.status == 200) {
                        let _list =  Object.assign(this.dataSource, res.data.result)
                        // let _categoryId = []
                        // let _options = []
                        //_list.scheduleDemandTime = _list.goodsDemandTime
                        // _list.categoryList.forEach(item => {
                        //     _options.push({value: item.categoryId, text: item.category})
                        //     _categoryId.push(item.categoryId)
                        // })
                        this.$nextTick(_ => {
                            // _self.options.categoryOption = _options
                            // _list.categoryId = _categoryId
                            _self.dataSource =_list
                            cb()
                        })
                    }else{
                        this.$message.error("要货单信息获取失败!")
                    }
                }).catch(error => {
                    //_self.formLoading = false
                    this.$message.error("要货单信息获取失败!")
                })
            },
            getTempItemHeadInfo(){
                let _self = this
                _self.subTableLoading = true
                DemandApi.querySaveOrderItems({id:this.dataSource.id}).then(res => {
                    _self.subTableLoading = false
                    if(res.data.status == 200) {
                        //this.subTablesSource = res.data.result
                        this.categoryAndGoodsList = res.data.result;
                    }
                    else{
                        //this.subTablesSource = []
                        this.categoryAndGoodsList = []
                        this.$message.error("要货明细获取失败")
                    }
                }).catch(error => {
                    _self.subTableLoading = false
                    this.$message.error("要货明细获取失败")
                })
            },
        }
    };
</script>
