<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar class="t8t-dark" @EDIT-SUBMIT="onsubmit()" :symbolList="symbolList" :disabledSymbols="disabledSymbols">
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                    <div class="toggle-btn-container">
                        <div class="toggle-btn el-icon-d-arrow-left" @click="onTopHide"></div>
                    </div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-form class="dialog2-form-container" :model="dataSource" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
                            <div class="dialog2-form-item-container" v-if="mode=='view'">
                                <el-form-item label="退货单号">
                                    <el-input v-model="dataSource.refundOrderCode" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="要货单号">
                                    <t8t-form-popup :defaultValue="item.defaultValue" :textValue="item.textValue" :filedValue="item.filedValue" :disabled="item.disabled" :dialog="item.dialog" @change="onChange" readonly>
                                    </t8t-form-popup>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="项目ID">
                                    <el-input v-model="dataSource.projectId" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container" v-if="mode=='view'">
                                <el-form-item label="排期节点">
                                    <el-input v-model="dataSource.scheduleNodeName" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container" v-if="mode=='view'">
                                <el-form-item label="组织">
                                    <el-input v-model="dataSource.orgName" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container" v-if="mode=='view'">
                                <el-form-item label="单据状态">
                                    <el-select v-model="dataSource.status" :disabled="true">
                                        <el-option v-for="item in options.status1" :label="item.text" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container" v-if="mode=='view'">
                                <el-form-item label="退货人">
                                    <el-input v-model="dataSource.createBy" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container" v-if="mode=='view'">
                                <el-form-item label="退货完成时间">
                                    <div class="refundTime">{{dataSource.refundTime | toDate}}</div>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="项目经理姓名">
                                    <el-input :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="业主姓名">
                                    <el-input v-model="dataSource.ownerName" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="设计师姓名">
                                    <el-input v-model="dataSource.designerName" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container">
                                <el-form-item label="详细地址">
                                    <el-input type="textarea" :autosize="autosize" resize="none" v-model="dataSource.address" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                            <div class="dialog2-form-item-container" v-if="mode=='view'">
                                <el-form-item label="撤销原因">
                                    <el-input type="textarea" :autosize="autosize" resize="none" v-model="dataSource.cancelReason" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <div class="t8t-detail">
                            <el-tabs v-model="subActiveTab" class="t8t-detail">
                                <el-tab-pane label="退货商品" name="refundOrderItem">
                                    <div class="sub-container">
                                        <div id="refund-table">
                                        </div>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 图片上传弹窗 -->
        <el-dialog title="上传图片" v-if="isUpload" v-model="isUploadShow" @close="closeUpload">
            <el-upload list-type="picture-card" multiple :action="uploadURL" :data="{bucket:'scm', module: 'delivery'}" class="refundOrder-upload" :file-list="fileList" :on-remove="onRemove" :on-success="onSuccess" :before-upload="onBeforeUpload" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
                <i class="el-icon-plus"></i>
            </el-upload>
            <span slot="footer">
                <el-button type="primary" @click="saveUpload">保 存</el-button>
                <el-button @click="closeUpload">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 查看图片 -->
        <t8t-gallery v-model="galleryVisible" :data="galleryData"></t8t-gallery>
    </div>
</template>
<script>
    import dateUtils from 'src/utils/DateUtils.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import api from 'src/services/delivery/refundOrder.js';
    import Utils from 'src/utils/Utils.js'
    import Cookie from 'js-cookie'
    var treeData = [];
    var treeManager;
    export default {
        name: 't8t-dt-view',
        data() {
            return {
                uploadURL: Utils.getUploadURL(),
                id: null,
                mode: "",
                // 主表绑定数据源
                dataSource: {
                    id: null,
                    refundOrderCode: null,
                    demandOrderCode: null,
                    projectId: null,
                    status: null,
                    refundTime: null,
                    cancelReason: null,
                    orgId: null,
                    scheduleNodeId: null,
                    address: null,
                    ownerName: null,
                    pmName: null,
                    designerName: null,
                    createName: null,
                    createBy: null,
                    createTime: null,
                    updateName: null,
                    updateBy: null,
                    updateTime: null,
                    orgName: null,
                    scheduleNodeName: null
                },
                // 所有配置全部初始化在这里
                options: {
                    status: [],
                    status1: [{
                        value: 1,
                        text: '退货中'
                    }, {
                        value: 2,
                        text: '已撤销'
                    }, {
                        value: 3,
                        text: '已关闭'
                    }],
                    status2: [{
                        value: 1,
                        text: '退货中'
                    }, {
                        value: 2,
                        text: '已撤销'
                    }, {
                        value: 3,
                        text: '已驳回'
                    }, {
                        value: 4,
                        text: '已完成'
                    }]
                },
                // 控制主表区域收缩
                isTopHide: false,
                isDialogShow: true,
                // 附表tab默认激活页
                subActiveTab: 'refundOrderItem',
                // 点击关闭后的返回route
                goBackRoute: '/tuchat-delivery/refundOrder-index',
                // popup配置
                item: {
                    name: 'demandOrderCode',
                    disabled: true,
                    textValue: 'demandOrderCode',
                    filedValue: 'demandOrderCode',
                    defaultValue: null,
                    dialog: {
                        title: "选择要货单",
                        size: 'large',
                        dialogWidth: '900px',
                        searchForm: {
                            fields: [{
                                type: 'input',
                                label: '要货单号',
                                name: 'demandOrderCode'
                            }, {
                                type: 'input',
                                label: '项目ID',
                                name: 'projectId'
                            }],
                            resetBtnVisible: true,
                            showToggleBtn: false
                        },
                        table: {
                            //表格
                            columns: [{
                                prop: 'demandOrderCode',
                                label: '要货单号'
                            }, {
                                prop: 'statusText',
                                label: '状态'
                            }, {
                                prop: 'projectId',
                                label: '项目ID'
                            }, {
                                prop: 'demandTime',
                                label: '下单时间',
                                formatter(val) {
                                    return dateUtils(val * 1000, 'yyyy-mm-dd HH:MM:ss')
                                }
                            }, {
                                prop: 'materialType',
                                label: '材料类型',
                                list: 'status'
                            }],
                            commonData: {
                                status: [
                                    {value: 1, text: '主材'},
                                    {value: 2, text: '辅材'},
                                ]
                            },
                            //请求参数配置
                            service: "VqBhmkux_Up8X5gMW3lMq3_u92o0LEG", // /biz/t8t-ps-pim/app
                            method: "_4KFDXyRA68t3D6f20epGr8oU894JwO2288vG4GfE1WHPB4ax54X7RL-oaLzZbJ59pp-alM", // views.refundOrder.queryPageForChooseDemandOrderCode
                            args: {},
                            radioCol: true,
                            selectable: function(row) {
                                if (row.status == 1 || row.status == 2 || row.status == 0) {
                                    return true
                                }
                                return false
                            }
                        },
                        onBeforeConfirm: function(rows) {
                            let row = rows[0]
                            if (row.status == 1 || row.status == 2 || row.status == 0) {
                                return true
                            }
                            return false
                        }
                    }
                },
                symbolList: [''],
                disabledSymbols: [],
                isUploadShow: true,
                isUpload: false,
                galleryVisible: false,
                fileList: [],
                galleryData: [],
                __id: null,
                autosize: {
                    minRows: 2
                },
                selectSource: []
            }
        },
        mounted() {

            this.$nextTick(() => {
                this.mode = this.$route.query.mode || 'add'

                if (this.mode === 'add') {
                    this.symbolList = ['EDIT-SUBMIT']
                    this.item.disabled = false
                    this.getCommonOptions()
                        .then(() => {
                            this.initAddTreeTable()
                        })
                }

                if (this.mode === 'view') {
                    this.symbolList = ['']
                    this.initViewMainTable()
                    this.getCommonOptions()
                        .then(() => {
                            this.initViewSubTable()
                        })
                }
            })
        },
        destroyed() {
            $('#refund-table').off()
        },
        watch: {
            'dataSource.demandOrderCode': function(val) {
                if (this.mode !== 'add') return
                this.initAddMainTable(val)
                this.initAddSubTable(val)
            }
        },
        methods: {
            onTopHide() {
                this.isTopHide = !this.isTopHide
            },
            /**
             * 查看主表
             */
            initViewMainTable() {
                api.refundOrderFindById({
                        id: this.$route.query.id
                    })
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result) {
                            this.dataSource = res.data.result
                            this.item.defaultValue = {
                                textValue: res.data.result.demandOrderCode,
                                filedValue: res.data.result.demandOrderCode
                            }
                        }
                    })
            },
            /**
             * 查看副表
             */
            initViewSubTable() {
                api.queryByRefundOrderCode({
                        refundOrderCode: this.$route.query.refundOrderCode
                    })
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result) {
                            treeData = res.data.result
                        }
                    })
                    .then(() => {
                        this.initViewTreeTable()
                    })
            },
            /**
             * 新增主表
             */
            initAddMainTable(val) {
                api.refundOrderProjectDetail({
                    demandOrderCode: val
                }).then((res) => {
                    if (res.data.status === 200 && res.data.result) {
                        this.dataSource.address = res.data.result.address
                        this.dataSource.designerName = res.data.result.designerName
                        this.dataSource.ownerName = res.data.result.ownerName
                        this.dataSource.pmName = res.data.result.pmName
                        this.dataSource.projectId = res.data.result.projectId
                    }
                })
            },
            /**
             * 新增副表
             */
            initAddSubTable(val) {
                api.queryByDemandOrderCode({
                        demandOrderCode: val
                    })
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result) {
                            treeData = res.data.result
                            var tmp = {
                                items: treeData
                            }
                            traverse(tmp)

                            function traverse(node, value) {
                                let childNodes = node.items || []

                                childNodes.forEach((child) => {
                                    child.refundReasonType = ""
                                    traverse(child);
                                })
                            }
                        }
                    })
                    .then(() => {
                        treeManager.set('data', {
                            Rows: treeData
                        })
                    })
            },
            /**
             * 关闭弹窗
             */
            closeDialog() {
                this.$router.push({
                    path: this.goBackRoute
                })
                this.$emit('close')
            },
            // add树表格初始化
            initAddTreeTable() {
                let _this = this
                treeManager = $("#refund-table").ligerGrid({
                    columns: [{
                            display: '商品编码',
                            name: 'goodsCode',
                            id: 'index',
                            align: 'left'
                        }, {
                            display: '商品名称',
                            name: 'goodsName'
                        },

                        {
                            display: '单位',
                            name: 'basicUnitName'
                        },

                        {
                            display: '最大可退数量',
                            name: 'maxRefundableNum',
                            render: function(item) {
                                if (item.isBom) {
                                    return ''
                                }
                                return item.maxRefundableNum
                            }
                        },

                        {
                            display: '退货数量',
                            name: 'refundNum',
                            editor: {
                                type: 'int'
                            },
                            type: 'int',
                            render: function(item) {
                                if (item.isBom) {
                                    return ''
                                }
                                if (item.maxRefundableNum == 0) {
                                    return '<span class="g-placeholder">不可退</span>'
                                }
                                if (item.refundNum == 0) {
                                    return '<span class="g-placeholder">请输入退货数量</span>'
                                }
                                return item.refundNum
                            }
                        },

                        {
                            display: '退货原因',
                            name: 'refundReasonType',
                            editor: {
                                type: 'select',
                                data: _this.options.status,
                                valueField: 'value',
                                textField: 'text',
                                onChange: function(item) {
                                    // 值改变
                                    if (item.selected) {
                                        traverse(item.record, item.value)
                                    }

                                    function traverse(node, value) {
                                        let childNodes = node.items || []

                                        childNodes.forEach((child) => {
                                            child.refundReasonType = value
                                            traverse(child);
                                        })
                                    }
                                }
                            },
                            render: function(item) {
                                if (item.isBom) {
                                    return ''
                                }
                                if (item.refundReasonType == '') {
                                    return '<span class="g-placeholder">选择退货原因</span>'
                                }
                                for (var i = 0; i < _this.options.status.length; i++) {
                                    if (_this.options.status[i]['value'] == item.refundReasonType)
                                        return _this.options.status[i]['text']
                                }
                                return item.refundReasonType;
                            }
                        },


                        {
                            display: '备注',
                            name: 'refundRemark',
                            editor: {
                                type: 'text'
                            }
                        },

                        {
                            display: '操作',
                            render: function(row) {
                                let __id = row.__id
                                var html = ''
                                    //配件  无配件成品
                                if (_this.isType3(row)) {
                                    html = '<button href="javascript:;" data-id="' + __id + '" class="my-btn1 el-button el-button--default el-button--mini">上传图片</button>' +
                                        '<button href="javascript:;" data-id="' + __id + '" class="my-btn2 el-button el-button--default el-button--mini">查看图片</button>'
                                }

                                return html;
                            }
                        }
                    ],
                    fixedCellHeight: false,
                    width: '95%',
                    height: '97%',
                    data: {
                        Rows: []
                    },
                    tree: {
                        childrenName: 'items',
                        columnId: 'index'
                    },
                    rownumbers: true,
                    enabledSort: false,
                    checkbox: true,
                    usePager: false,
                    enabledEdit: true,
                    onBeforeEdit: onBeforeEdit
                });

                $("#refund-table").on("click", ".my-btn1", onUpload);
                $("#refund-table").on("click", ".my-btn2", onGallery);

                function onUpload() {
                    var __id = $(this).data('id')
                    if(_isZero(__id)) return false
                    if (!treeManager.isSelected(__id)) return _this.$message('勾选后编辑！')
                    _this.showUpload(__id)
                }

                function onGallery() {
                    var __id = $(this).data('id')
                    if(_isZero(__id)) return false
                    if (!treeManager.isSelected(__id)) return _this.$message('勾选后编辑！')
                    _this.showGallery(__id)
                }

                function onBeforeEdit(e) {
                    if(e.record.maxRefundableNum == 0) return false
                    if(e.record.isBom === true) {
                        _this.$message('bom数据！')
                        return false
                    }
                    if (treeManager.isSelected(e.rowindex)) {
                        if (e.column.name != 'refundNum') return true
                        if (e.column.name == 'refundNum' && _this.isType2(e.record)) {
                            return false
                        } else {
                            return true
                        }
                    }
                    _this.$message('勾选后编辑！')
                    return false;
                }

                function _isZero(id) {
                    let row = treeManager.getRow(id)
                    if(row.maxRefundableNum === 0) return true
                    return false
                }
            },
            // view树表格初始化
            initViewTreeTable() {
                let _this = this
                treeManager = $("#refund-table").ligerGrid({
                    columns: [{
                            display: '商品编码',
                            name: 'goodsCode',
                            id: 'index',
                            align: 'left'
                        }, {
                            display: '商品名称',
                            name: 'goodsName'
                        },

                        {
                            display: '单位',
                            name: 'basicUnitName'
                        },

                        {
                            display: '实际退货数量',
                            name: 'actualRefundNum'
                        },

                        {
                            display: '退货数量',
                            name: 'refundNum'
                        },

                        {
                            display: '退货状态',
                            name: 'status',
                            render: function(item) {
                                for (var i = 0; i < _this.options.status2.length; i++) {
                                    if (_this.options.status2[i]['value'] == item.status)
                                        return _this.options.status2[i]['text']
                                }
                                return item.status;
                            }
                        },

                        {
                            display: '退货原因',
                            name: 'refundReasonType',
                            editor: {
                                type: 'select',
                                data: _this.options.status,
                                valueField: 'value',
                                textField: 'text'
                            },
                            render: function(item) {
                                if (item.refundReasonType == '') {
                                    return '<span class="g-placeholder">选择退货原因</span>'
                                }
                                for (var i = 0; i < _this.options.status.length; i++) {
                                    if (_this.options.status[i]['value'] == item.refundReasonType)
                                        return _this.options.status[i]['text']
                                }
                                return item.refundReasonType;
                            }
                        },

                        {
                            display: '备注',
                            name: 'refundRemark',
                            render: function(item) {
                                return `<span title="${item.refundRemark}">${item.refundRemark}</span>`
                            }
                        },

                        {
                            display: '操作',
                            render: function(row) {
                                let __id = row.__id
                                var html = ''
                                if (row.imageUrlList) {
                                    html = '<button href="javascript:;" data-id="' + __id + '" class="my-btn3 el-button el-button--default el-button--mini">查看图片</button>'
                                }

                                return html;
                            }
                        }
                    ],
                    width: '95%',
                    height: '100%',
                    data: {
                        Rows: treeData
                    },
                    tree: {
                        childrenName: 'items',
                        columnId: 'index'
                    },
                    rownumbers: true,
                    enabledSort: false,
                    checkbox: false,
                    usePager: false,
                    pageSize: 20,
                    enabledEdit: true
                });

                $("#refund-table").on("click", ".my-btn3", onGallery);

                function onGallery() {
                    var __id = $(this).data('id')
                    _this.showGallery(__id)
                }

            },
            // 弹窗选择
            onChange(value) {
                this.dataSource.demandOrderCode = value
            },
            showUpload(__id) {
                this.__id = __id
                let row = treeManager.getRow(this.__id)
                this.fileList = row.fileList || []
                this.isUploadShow = true
                this.isUpload = true
            },
            closeUpload() {
                this.isUpload = false
                this.__id = null
                this.fileList = []
            },
            saveUpload() {
                if (this.fileList.length > 9) return this.$message('最多上传9张图片')
                let row = treeManager.getRow(this.__id)
                row.fileList = this.fileList
                let arr = []
                this.fileList.forEach(item => {
                    arr.push(item.response.result.filePath)
                })
                row.imageUrlList = arr
                this.$message('图片已保存')
                this.closeUpload()
            },
            showGallery(__id) {
                let _galleryData = []
                treeManager.getRow(__id).imageUrlList.forEach(function(item) {
                    let url = Utils.getFullURL(item)
                    _galleryData.push({
                        src: url
                    })
                })
                this.galleryData = _galleryData
                if(this.galleryData.length === 0){
                    return this.$message('没有图片！')
                }
                this.$nextTick(() => {
                    this.galleryVisible = true
                })
            },
            onRemove(file, fileList) {
                this.fileList = fileList
            },
            onSuccess(res, file, fileList) {
                if (res.status === 200) {
                    this.fileList = fileList
                }
            },
            onsubmit() {
                if (!treeManager) return
                let rows = treeManager.getSelectedRows()
                if (rows.length == 0) {
                    this.$message('请勾选数据！')
                    return
                }
                if (!this.validRows(rows)) return
                this.sendData(rows)
            },
            validRows(rows) {
                let isPass = true
                rows.forEach(item => {
                    if (item.refundNum > item.maxRefundableNum) {
                        isPass = false
                        treeManager.addErrorByName(item, 'refundNum', '多于最大可退数量')
                    }
                    if (item.refundNum <= 0) {
                        isPass = false
                        treeManager.addErrorByName(item, 'refundNum', '请填写正确退货数量')
                    }
                    if (!item.refundReasonType) {
                        isPass = false
                        treeManager.addErrorByName(item, 'refundReasonType', '选择退货原因')
                    }
                    if (item.refundReasonType == '07' && !item.refundRemark) {
                        isPass = false
                        treeManager.addErrorByName(item, 'refundRemark', '请填写备注')
                    }
                })
                return isPass
            },
            sendData(rows) {
                this.disabledSymbols = ['EDIT-SUBMIT']
                let _refundOrderItemList = []
                rows.forEach(item => {
                    let obj = {
                        refundNum: item.refundNum,
                        refundReasonType: +item.refundReasonType,
                        refundRemark: item.refundRemark,
                        imageUrlList: item.imageUrlList,
                        goodsId: item.goodsId,
                        goodsType: item.goodsType,
                        demandItemParentId: item.demandItemParentId,
                        demandItemId: item.demandItemId
                    }
                    _refundOrderItemList.push(obj)
                })

                let args = {
                    refundOrder: {
                        demandOrderCode: this.dataSource.demandOrderCode,
                        createUser: +Cookie.get('t8t-tc-uid'),
                        // orgId: +this.$route.query.orgId,
                        refundOrderItemCreateDTOList: _refundOrderItemList
                    }
                }

                api.refundOrderCreate(args)
                    .then(res => {
                        this.disabledSymbols = []
                        if (res.data.status === 200) {
                            this.closeDialog()
                        } else {
                            if (res.data.status === 41600) {
                                this.$message.error('要货单状态错误')
                            } else if (res.data.status === 41601) {
                                this.$message.error('获取退货单依赖数据失败')
                            } else if (res.data.status === 41602) {
                                this.$message.error('退货商品找不到对应的要货项')
                            } else if (res.data.status === 41603) {
                                this.$message.error('退货商品数量超过要货商品的可退数量')
                            } else {
                                this.$message.error(res.data.message)
                            }
                        }
                    })
            },
            getCommonOptions: function() {
                let arg = {
                    page: 1,
                    search: {
                        pPropertyCode: '11609'
                    },
                    size: 100
                }
                let list = []
                return commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.propertyCode,
                                        text: item.propertyName
                                    })
                                };
                            })
                            this.options.status = list
                        }
                    })
            },
            // 1  标准成品
            // 2  非标准成品
            // 3  配件和无配件成品
            isType1(row) {
                if (row.isNormative == true && row.goodsType == 1) return true;
                return false
            },
            isType2(row) {
                if (row.isNormative == false && row.goodsType == 1) return true;
                return false
            },
            isType3(row) {
                // 配件
                if (row.goodsType == 2) return true;
                // 无配件成品
                if (row.items == undefined || row.items.length == 0) {
                    return true
                }
                return false
            },
            isBom (row) {
                return row.isBom
            },
            onBeforeUpload(file) {
                if (this.fileList.length >= 9) {
                    this.$message('最多上传9张图片')
                    return false
                }
            }
        }
    }
</script>
<style lang="css" scoped>
    .dialog2-main-container.isHide .full-dialog-form-container {
        display: none;
    }

    #refund-table {
        margin: 0 auto;
    }

    .refundTime {
        width: 180px;
        height: 32px;
        background-color: #eef1f6;
        border-color: #d1dbe5;
        color: #bbb;
        cursor: not-allowed;
        border-radius: 2px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        padding: 0 10px;
    }
</style>
<style>
    .my-btn {
        margin: 5px;
    }

    .refundOrder-upload {
        width: 315px;
        margin: 0 auto;
    }
</style>
