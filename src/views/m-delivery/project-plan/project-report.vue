<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search :fields="fields" :selectSource="searchSource" @submit="submitSearch">
        </t8t-search>
        <div class="g-main-container">
            <div class="g-main-container-column">
                <t8t-toolbar ref="indexToolbar" @EXPORT="exportData">
                </t8t-toolbar>
                <t8t-table width="2010px" ref="t8tTable" :editable="true" :commonData="searchSource" :indexCol="true" :selectCol="true" :columns="columns"
                    :service="service" :method="method" :args="args" :currentPage="setPage" @selection-change="selectionChange"
                    @row-click="onRowClick">
                </t8t-table>
            </div>
        </div>
    </div>

</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import TemplateOperator1 from 'src/services/delivery/pcm.js'
    import Service from 'src/services/delivery/Service.js'
    import ExportUtils from 'src/utils/export.js'
    import DateUtils from 'src/utils/DateUtils.js'
    export default {
        data() {//定义变量区
            return {
                //面包屑
                breadcrumbData: [
                    { title: '工程管理' },
                    { title: '工地进度' },
                    { title: '交付监控报表' }],
                fields: [
                    { type: 'input', label: '项目ID', name: 'projectId' },
                    { type: 'input', label: '业主姓名', name: 'ownerName_like' },
                    { type: 'input', label: '楼盘名称', name: 'estateName_like' },
                    { type: 'date', pickertype: 'datetimerange', label: '开工时间', startField: 'startTime_gte', endField: 'startTime_lte', name: 'startTime' },
                    {
                        //TODO 组织
                        type: 'select',
                        label: '门店',
                        name: 'organizationId',
                        selectSourceKey: 'organizationIds',
                        filterable: true
                    },
                    { type: 'input', label: '项目经理', name: 'chiefWorkerName_like' },
                    { type: 'input', label: '交付管家', name: 'projectManagerName_like' },
                    { type: 'input', label: '交付经理', name: 'payManagerName_like' },
                    {
                        //TODO 组织
                        type: 'select',
                        label: '公司',
                        name: 'organizationParentId',
                        selectSourceKey: 'organizationParentIds',
                        filterable: true
                    }

                ],
                searchSource: {
                    organizationParentIds: [],
                    organizationIds: [],

                },
                columns: [
                    {
                        "prop": "projectBase", "label": "项目基本信息",
                        "columns":
                        [
                            { "prop": "projectId", "label": "项目ID" },
                            { "prop": "ownerName", "label": "业主姓名" },
                            { "prop": "projectAddress", "label": "小区地址" },
                            { "prop": "productPkgName", "label": "产品包" },
                            { "prop": "area", "label": "计价面积" },
                            { "prop": "organizationParentName", "label": "公司" },
                            { "prop": "organizationName", "label": "门店" },
                            { "prop": "chiefWorkerName", "label": "项目经理" },
                            { "prop": "projectManagerName", "label": "交付管家" },
                            { "prop": "payManagerName", "label": "交付经理" },
                            { "prop": "chiefDesignerIdName", "label": "设计师" },
                            { "prop": "customerManagerName", "label": "客户经理" },
                            { "prop": "orderSubStatusName", "label": "项目状态" },
                            { "prop": "complaintsNumber", "label": "投诉次数" },
                            { "prop": "constructionPeriod", "label": "施工期限" },
                        ]
                    },
                    { "prop": "projectId", "label": "项目ID" },
                    { "prop": "ownerName", "label": "业主姓名" },
                    { "prop": "projectAddress", "label": "小区地址" },
                    { "prop": "productPkgName", "label": "产品包" },
                    { "prop": "area", "label": "计价面积" },
                    { "prop": "organizationParentName", "label": "公司" },
                    { "prop": "organizationName", "label": "门店" },
                    { "prop": "chiefWorkerName", "label": "项目经理" },
                    { "prop": "projectManagerName", "label": "交付管家" },
                    { "prop": "payManagerName", "label": "交付经理" },
                    { "prop": "chiefDesignerIdName", "label": "设计师" },
                    { "prop": "customerManagerName", "label": "客户经理" },
                    { "prop": "orderSubStatusName", "label": "项目状态" },
                    { "prop": "complaintsNumber", "label": "投诉次数" },
                    { "prop": "constructionPeriod", "label": "施工期限" },
                    {
                        "prop": "projectPrice", "label": "金额信息",
                        "columns":
                        [
                            { "prop": "projectTotalPrice", "label": "项目总金额" },
                            { "prop": "projectUnpaidPrice", "label": "项目总未收" },
                            { "prop": "totalPrice", "label": "合同金额" },
                            { "prop": "contractReceiptPrice", "label": "合同已收款金额" },
                            { "prop": "residueReceivablePrice", "label": "剩余应收金额" },
                            { "prop": "predictPayTime", "label": "应缴款时间" },
                            { "prop": "addReceivablePrice", "label": "增项应收金额" },
                            { "prop": "addReceiptPrice", "label": "增项实收金额" },
                            { "prop": "subPrice", "label": "减项应减金额" },
                        ]
                    },
                    { "prop": "projectTotalPrice", "label": "项目总金额" },
                    {
                        "prop": "projectUnpaidPrice", "label": "项目总未收", formatter: function (val) {
                            if (val < 0) {
                                return '<a style="color:red;text-decoration:none">' + val + '</a>';
                            }
                            else {
                                return val;
                            }
                        }
                    },
                    { "prop": "totalPrice", "label": "合同金额" },
                    { "prop": "contractReceiptPrice", "label": "合同已收款金额" },
                    { "prop": "residueReceivablePrice", "label": "剩余应收金额" },
                    { "prop": "predictPayTime", "label": "应缴款时间", formatter: this.dateParserDay },
                    { "prop": "addReceivablePrice", "label": "增项应收金额" },
                    { "prop": "addReceiptPrice", "label": "增项实收金额" },
                    { "prop": "subPrice", "label": "减项应减金额" },
                    {
                        "prop": "projectStart", "label": "开工",
                        "columns":
                        [
                            { "prop": "startTime", "label": "开工时间" },
                        ]
                    },
                    { "prop": "startTime", "label": "开工时间", formatter: this.dateParserDay },
                    {
                        "prop": "projectHidden", "label": "隐蔽验收",
                        "columns":
                        [
                            { "prop": "hiddenPredictTime", "label": "计划验收时间" },
                            { "prop": "hiddenCheckTime", "label": "实际验收时间" },
                        ]
                    },
                    { "prop": "hiddenPredictTime", "label": "计划验收时间", formatter: this.dateParserDay },
                    {
                        "prop": "hiddenCheckTime", "label": "实际验收时间", "formatter": function (val, row) {
                            let predictTime = row.hiddenPredictTime;
                            let _data = new Date(val * 1000);
                            let _val = DateUtils(_data, "yyyy-mm-dd");
                            if (val > 0 && predictTime > 0 && val > predictTime) {

                                return '<a style="color:red;text-decoration:none;">' + _val + '</a>';
                            }
                            else if (val === 0) {
                                return "";
                            }
                            else {
                                return _val;
                            }
                        }
                    },
                    {
                        "prop": "projectPave", "label": "铺贴验收",
                        "columns":
                        [
                            { "prop": "pavePredictTime", "label": "计划验收时间" },
                            { "prop": "paveCheckTime", "label": "实际验收时间" },
                        ]
                    },
                    { "prop": "pavePredictTime", "label": "计划验收时间", formatter: this.dateParserDay },
                    {
                        "prop": "paveCheckTime", "label": "实际验收时间", formatter: function (val, row) {
                            let predictTime = row.pavePredictTime;
                            let _data = new Date(val * 1000);
                            let _val = DateUtils(_data, "yyyy-mm-dd");
                            if (val > 0 && predictTime > 0 && val > predictTime) {

                                return '<a style="color:red;text-decoration:none;">' + _val + '</a>';
                            }
                            else if (val === 0) {
                                return "";
                            }
                            else {
                                return _val;
                            }
                        }
                    },
                    {
                        "prop": "projectMid", "label": "中期验收",
                        "columns":
                        [
                            { "prop": "midPredictTime", "label": "计划验收时间" },
                            { "prop": "midCheckTime", "label": "实际验收时间" },
                        ]
                    },
                    { "prop": "midPredictTime", "label": "计划验收时间", formatter: this.dateParserDay },
                    {
                        "prop": "midCheckTime", "label": "实际验收时间", "formatter": function (val, row) {
                            let predictTime = row.midPredictTime;
                            //return this.dealDelay(val,predictTime);
                            let _data = new Date(val * 1000);
                            let _val = DateUtils(_data, "yyyy-mm-dd");
                            if (val > 0 && predictTime > 0 && val > predictTime) {

                                return '<a style="color:red;text-decoration:none;">' + _val + '</a>';
                            }
                            else if (val === 0) {
                                return "";
                            }
                            else {
                                return _val;
                            }
                        }
                    },
                    {
                        "prop": "projectProduct", "label": "产品验收",
                        "columns":
                        [
                            { "prop": "productPredictTime", "label": "计划验收时间" },
                            { "prop": "productCheckTime", "label": "实际验收时间" },
                        ]
                    },
                    { "prop": "productPredictTime", "label": "计划验收时间", formatter: this.dateParserDay },
                    {
                        "prop": "productCheckTime", "label": "实际验收时间", formatter: function (val, row) {
                            let predictTime = row.productPredictTime;
                            let _data = new Date(val * 1000);
                            let _val = DateUtils(_data, "yyyy-mm-dd");
                            if (val > 0 && predictTime > 0 && val > predictTime) {

                                return '<a style="color:red;text-decoration:none;">' + _val + '</a>';
                            }
                            else if (val === 0) {
                                return "";
                            }
                            else {
                                return _val;
                            }
                        }
                    },
                    {
                        "prop": "projectComplete", "label": "工程竣工验收",
                        "columns":
                        [
                            { "prop": "completePredictTime", "label": "计划验收时间" },
                            { "prop": "completeCheckTime", "label": "实际验收时间" },
                        ]
                    },
                    { "prop": "completePredictTime", "label": "计划验收时间", formatter: this.dateParserDay },
                    {
                        "prop": "completeCheckTime", "label": "实际验收时间", formatter: function (val, row) {
                            let predictTime = row.completePredictTime;
                            let _data = new Date(val * 1000);
                            let _val = DateUtils(_data, "yyyy-mm-dd");
                            if (val > 0 && predictTime > 0 && val > predictTime) {

                                return '<a style="color:red;text-decoration:none;">' + _val + '</a>';
                            }
                            else if (val === 0) {
                                return "";
                            }
                            else {
                                return _val;
                            }
                        }
                    },

                ],
                service: Service.PLAN.name,
                method: Service.PLAN.methods.projectReportQueryPage,
                args: {},
            }
        },
        created() {//页面初始化
            this.getOrg();
            this.getCompanyOrg();
            this.getMainStatus();
        },
        methods: {//方法区
            getOrg() {//门店
                let args = { page: 1, size: 150, search: { typeCode: '001003010', isDel: 0 } };
                commonApi.queryAll(args).then((res) => {
                    let list = [];
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                            list.push({
                                text: item.name,
                                value: item.id
                            });
                        })
                        this.searchSource.organizationIds = list;
                    } else {

                    }
                }).catch()
            },
            getCompanyOrg()//分公司组织
            {
                let args = { page: 1, size: 150, search: { typeCode: '001003006', isDel: 0 } };
                commonApi.queryAll(args).then((res) => {
                    let list = [];
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                            list.push({
                                text: item.name,
                                value: item.id
                            });
                        })
                        this.searchSource.organizationParentIds = list;
                    } else {

                    }
                }).catch()
            },
            submitSearch(obj)//查询
            {
                this.args = { search: obj }
            },
            exportData() {//导出
                this.$refs['indexToolbar'].disableBySymbol("EXPORT")
                if (this.$refs['t8tTable'].totalRows <= 10000) {
                    let exportArgs = this.args
                    exportArgs.page = 1
                    exportArgs.size = 10000
                    ExportUtils({
                        service: Service.PLAN.name,
                        method: Service.PLAN.methods.projectReportExport,
                        args: exportArgs,
                        title: '交付监控报表',
                        headers: '项目ID,业主姓名,小区地址,产品包,计价面积,公司,门店,项目经理,交付管家,交付经理,设计师,客户经理,项目状态,投诉次数,施工期限,项目总金额,项目总未收,合同金额,合同已收款金额,剩余应收金额,应缴款时间,增项应收金额,增项实收金额,减项应减金额,开工时间,隐蔽验收计划时间,隐蔽验收实际时间,铺贴验收计划时间,铺贴验收实际时间,中期验收计划时间,中期验收实际时间,产品验收计划时间,产品验收实际时间,工程竣工验收计划时间,工程竣工验收实际时间',
                        sorts: "projectId,ownerName,projectAddress,productPkgName,area,organizationParentName,organizationName,chiefWorkerName,projectManagerName,payManagerName,chiefDesignerIdName,customerManagerName,orderSubStatusName,complaintsNumber,constructionPeriod,projectTotalPrice,projectUnpaidPrice,totalPrice,contractReceiptPrice,residueReceivablePrice,predictPayTimeExport,addReceivablePrice,addReceiptPrice,subPrice,startTimeExport,hiddenPredictTimeExport,hiddenCheckTimeExport,pavePredictTimeExport,paveCheckTimeExport,midPredictTimeExport,midCheckTimeExport,productPredictTimeExport,productCheckTimeExport,completePredictTimeExport,completeCheckTimeExport",
                    })
                }
                else {
                    this.$message.error('数据总条数超过10000条，请筛选后导出')
                }
                this.$refs['indexToolbar'].unDisableBySymbol("EXPORT")
            },
            dateParserDay(val) {
                let dateString;
                if (!val) {
                    dateString = "";
                }
                else if (val === 0) {
                    dateString = "";
                }
                else {
                    let objDate = new Date(val * 1000);
                    dateString = DateUtils(objDate, 'yyyy-mm-dd');
                }
                return dateString;
            }
        }
    }

</script>