<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new" >
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                        >
                        </t8t-toolbar>
                    </div>
                </div>

                <div class="dialog2-main-container">
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">

                        <el-form ref="mainTable"
                                 label-position="right"
                                 label-width="120px"
                                 :model="dataSource"
                        >
                            <el-tabs v-model="mainActiveTab">
                                <el-tab-pane :label="mainTable.tabs[0].label" :name="mainTable.tabs[0].name">
                                    <div class="field_container" v-loading.body.lock="loading">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="mainTable.tabs[0].fields"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[0].name"
                                        ></base-panel>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane :label="mainTable.tabs[1].label" :name="mainTable.tabs[1].name">
                                    <div class="field_container" v-loading.body.lock="loading">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="mainTable.tabs[1].fields"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[1].name"
                                        ></base-panel>
                                    </div>
                                </el-tab-pane>                               
                            </el-tabs>
                        </el-form>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import axios from 'src/utils/axios.js'
    import Service from 'src/services/delivery/surcharge/Service.js'
    import schema from './surcharge-schema.js'
    export default {
        name: 'surcharge-view',
        components: {BasePanel},
        data () {
            return {
                id: null,
                // 主表绑定数据源
                dataSource: {
                    applyAmount:null,
                    closeReason:null,
                    code:null,
                    createTime:null,
                    createUser:null,
                    currencyId:null,
                    currencyName:null,
                    id:null,
                    processId:null,
                    realAmount:null,
                    remark:null,
                    settleStatus:null,
                    sourceOrderCode:null,
                    sourceOrderLineNo:null,
                    sourceOrderType:null,
                    supplierId:null,
                    supplierName:null,
                    surchargeType:null,
                    surchargeTypeName:null,
                    updateTime:null,
                    updateUser:null,
                    verifyStatus:null,
                    verifyTime:null,
                    verifyUser:null,
                },
                // 附表绑定数据源，只有panel（一对一）形式展示的需要绑定，table（一对多）的不需要
                subDataSource: {
                },
                // 所有配置全部初始化在这里
                options: {
                    verifyStatusOpt:[
                        {value:0,text:"无状态"},
                        {value:1,text:"暂存(新生成)"},
                        {value:2,text:"审核中"},
                        {value:3,text:"暂存(重新审核)"},
                        {value:4,text:"已审核"},
                        {value:5,text:"已关闭"}
                    ],
                    settleStatusOpt:[
                        {value:0,text:"无状态"},
                        {value:1,text:"待结算"},
                        {value:2,text:"结算中"},
                        {value:3,text:"已结算"}                        
                    ],
                    sourceOrderTypeOpt:[
                        {value:0,text:''},
                        {value:1,text:'直运采购订单'},
                        {value:2,text:'安装单'},
                        {value:3,text:'测量单'},
                        {value:4,text:'标准采购订单'},
                    ]

                },
                schema: schema,
                mainTable: schema.mainTable,
                isDialogShow: true,
                // 主表tab默认激活页
                mainActiveTab: '',
                loading:false,
                // 点击关闭后的返回route
                goBackRoute: '/tuchat-delivery/surcharge-list',
                sourceMap: {},            
            }
        },

        created () {
            // 初始化通用query
            this.id = this.$route.query.id
            schema.mainTable.args.id = this.id
            // 初始化主附表
            this.initMainTable()
        },
        methods: {
            /**
             * 初始化主表
             */
            initMainTable () {
                // 初始化tab页中的激活选项
                if (schema.mainTable.tabs && schema.mainTable.tabs.length > 0) {
                    schema.mainTable.tabs.forEach((item, key) => {
                        if (item.isActive || key === 0) {
                            this.mainActiveTab = item.name
                        }
                    })
                }
                this.loadMainTable()
            },
            /**
             * 加载主表数据
             */
            loadMainTable () {
                let self = this
                let mainTableSchema = schema.mainTable, args = mainTableSchema.args || {}
                if (mainTableSchema.service && mainTableSchema.method) {
                    this.loading = true
                    axios({
                        service: mainTableSchema.service,
                        method: mainTableSchema.method,
                        args: args
                    })
                        .then((res) => {
                            self.loading = false
                            let response = res.data
                            // 数据加载成功
                            if (response && response.status == 200) {
                                self.dataSource = Object.assign(self.dataSource, schema.mainTable.dataSource, response.result)
                            }else{
                                self.$message.error("数据加载失败")
                            }
                        })
                        .catch((res) => {
                            self.loading = false
                            self.$message.error("数据加载失败")   
                            // TODO 数据加载失败
                            console.error("panel load data failed.", res)
                            // self.$message.error('表格数据加载失败')
                        })
                } else {
                    // TODO 没有传service和method参数处理
                }
            },      
            closeDialog(){
                this.$router.go(-1) 
            }
        }
    };
</script>