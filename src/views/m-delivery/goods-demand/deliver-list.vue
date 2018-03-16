<template>
    <div class="deliver-list">
        <t8t-search :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
            ref="tableSearch">
        </t8t-search>
        <div class="g-main-container deliver-list-class">
            <div class="g-main-container-column">
                <t8t-toolbar :symbolList="symbolList"
                    @VIEW="showDetail"
                    @RECEIVE="receive"
                    @EXPORT="exportOrder"
                    ref="toolbar">
                </t8t-toolbar>
                <t8t-table class="deliver_list"
                    :columns="columns"
                    :service="service"
                    :method="method"
                    :args="args"
                    :pageBar="true"
                    :commonData="commonData"
                    :preLoad=false
                    :indexCol=true
                    ref="t8tTable"
                    @row-double-click="doubbleShowDetail">
                </t8t-table>
            </div>
        </div>
        <div @click="updateTabNum"></div>
    </div>
</template>

<script>
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    import Service from 'src/services/delivery/goodsDemand/Service.js'
    import api from 'src/services/delivery/goodsDemand/surcharge.js'
    export default {
        name: 'deliver-list',
        components: {
            //嵌套页面如添加编辑详情
        },
        data() {
            let that = this;
            return {
                // opportunitiesAddRoute: 'sales-opportunities-add',
                symbolList: ['VIEW', 'RECEIVE', 'EXPORT'],
                //搜索表单项配置
                fields: [
                    { type: 'select', label: '订单类型', name: 'orderSource', selectSourceKey: 'orderSource_arr', filterable: true },
                    { type: 'input', label: '订单编号', name: 'orderCode' },
                    { type: 'input', label: '详细地址', name: 'receiveAddress' },
                    { type: 'datetime', label: '下单日期', name: 'createTime', pickertype: 'daterange', startField: 'createStartTime', endField: 'createEndTime' },
                    { type: 'input', label: '项目ID', name: 'sourceProjectId' },
                    { type: 'input', label: '业主名称', name: 'ownerName' },
                    { type: 'input', label: '收货人', name: 'receiveName' },
                    { type: 'datetime', label: '收货日期', name: 'consigneeTime', pickertype: 'daterange', startField: 'consigneeStartTime', endField: 'consigneeEndTime' },
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    orderSource_arr: [
                        {
                            text: '平台辅材',
                            value: 1
                        },
                        {
                            text: '非平台辅材',
                            value: 2
                        },
                        // {
                        //     text: '批量采购',
                        //     value: 3
                        // },
                    ],
                },
                columns:
                [
                    {
                        "prop": "orderSource", "label": "订单类型", list: 'source_arr',
                    },
                    { "prop": "orderCode", "label": "订单编号", "width": "230px" },
                    {
                        "prop": "orderStatus", "label": "订单状态", list: 'status_arr',
                    },
                    { "prop": "receiveName", "label": "收货人" },
                    { "prop": "receiveAddress", "label": "收货地址" },
                    {
                        "prop": "sourceProjectId", "label": "项目ID", "formatter": function (val, row, col) {
                            return val == 0 ? "" : val;
                        }
                    },
                    { "prop": "ownerName", "label": "业主名称" },
                    { "prop": "totalMoney", "label": "订单总金额" },
                    {
                        "prop": "createTime", "label": "下单时间", "formatter": function (val, row, col) {
                            return that.dateParser(row.createTime)
                        }, "width": "130px"
                    },
                    {
                        "prop": "verifyTime", "label": "审核时间", "formatter": function (val, row, col) {
                            return that.dateParser(row.verifyTime)
                        },
                    },
                    {
                        "prop": "firstSendTime", "label": "发货时间", "formatter": this.dateParser,
                    },
                    {
                        "prop": "deliveryTime", "label": "送达时间", "formatter": this.dateParser
                    },
                    {
                        "prop": "consigneeTime", "label": "收货时间", "formatter": this.dateParser
                    },
                ],
                commonData: {
                    source_arr: [
                        {
                            text: '批量采购',
                            value: 3
                        },
                        {
                            text: '平台辅材',
                            value: 4
                        },
                        {
                            text: '非平台辅材',
                            value: 5
                        },
                        {
                            text: '平台辅材',
                            value: 6
                        },
                        {
                            text: '非平台辅材',
                            value: 7
                        },
                    ],
                    status_arr: [
                        {
                            text: '待发货',
                            value: 0
                        },
                        {
                            text: '已发货',
                            value: 1
                        },
                        {
                            text: '已收货',
                            value: 2
                        },
                        {
                            text: '取消',
                            value: 3
                        },
                        {
                            text: '待审核',
                            value: 4
                        },
                        {
                            text: '已驳回',
                            value: 5
                        },
                        {
                            text: '新建（暂存）',
                            value: 6
                        },
                        {
                            text: '待报备',
                            value: 7
                        },
                        {
                            text: '已送达',
                            value: 8
                        }
                    ],
                },
                service: Service.DEMAND.name,
                method: Service.DEMAND.methods.OMQUERYPAGE,
                args: null,
                filterData: {}
                //弹窗dialog配置
            }
        },
        created() {
            this.initTableInfo();
            // this.initOpportunitiesList();
            // this.initSelectSource();
            //   this.initOpportunitiesList();
        },
        activated() {
            let tab = Cookie.get('demand_list_tab');
            if (tab == 'deliverList') {
                this.updateTabNum();
                this.$refs['t8tTable'].reloadTable();
            }
        },
        methods: {
            updateTabNum() {
                this.$emit('updateTabNum'); //主动触发updateTabNum方法
            },
            dateParser(text) {
                let dateString;
                let objDate = new Date(text * 1000);
                if (text === 0 || text === null) {
                    dateString = ""
                } else {
                    dateString = DateUtils(objDate, 'yyyy-mm-dd HH:MM')
                }
                return dateString
            },
            initTableInfo() {
                if (this.$refs.tableSearch != undefined) {
                    this.$refs.tableSearch.resetForm();
                }
                this.filterData = { orderStatus: 8 };
                let search = this.filterData;
                this.args = { search: search, sort: ["createTime_desc"] }
            },
            submitSearch(obj) {
                if (obj.sourceProjectId) {
                    if (!/^\d+$/.test(obj.sourceProjectId)) {
                        this.$message.error('请在项目ID框中输入数字！')
                        return
                    }
                }
                if (obj.orderSource != null) {
                    if (obj.orderSource == 1) {
                        obj.orderSource = [4, 6];
                    }
                    else if (obj.orderSource == 2) {
                        obj.orderSource = [5, 7];
                    }
                    else {
                        obj.orderSource = [3];
                    }
                }
                if (obj.createStartTime && obj.createEndTime) {
                    obj.createEndTime = obj.createEndTime + 86399
                }
                if (obj.consigneeStartTime && obj.consigneeEndTime) {
                    obj.consigneeEndTime = obj.consigneeEndTime + 86399
                }
                this.args = { search: Object.assign({}, this.filterData, obj), sort: ["createTime_desc"] }
                this.updateTabNum();
            },
            showDetail() {
                this.$TCS.addTag('red_20553_002003003001');
                let selections = this.$refs['t8tTable'].getSelectRows()
                let that = this
                if (selections.length < 1) {
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if (selections.length > 1) {
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = selections[0];
                this.$router.push({
                    path: '/tuchat-delivery/demand-view', query: {
                        id: row.id, status: 8
                    }
                })
            },
            doubbleShowDetail(row, event, selectable) {
                this.$router.push({
                    path: '/tuchat-delivery/demand-view', query: {
                        id: row.id, status: 8
                    }
                })
            },
            receive() {
                this.$TCS.addTag('red_20553_002003003005');
                let selections = this.$refs['t8tTable'].getSelectRows()
                let that = this
                if (selections.length < 1) {
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if (selections.length > 1) {
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = selections[0];
                if (row.orderStatus != 1 && row.orderStatus != 8) {
                    this.$message.error('请对已发货、已送达状态订单做收货操作')
                    return
                }
                else if (row.isReceiveUser != 1) {
                    this.$message.error('您无权限对此订单进行收货!')
                    return
                }
                else {
                    that.$confirm('确认完成收货？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let args = { goodsDemandId: row.id }
                        api.confirmReceiptOM(args)
                            .then((res) => {
                                if (res.data.status == 200) {
                                    var _this = this
                                    that.$msgbox({
                                        title: '提交成功',
                                        type: 'success',
                                        message: '',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    }).then(() => {
                                        that.updateTabNum();
                                        that.$refs['t8tTable'].reloadTable()
                                    })
                                } else {
                                    this.$msgbox({
                                        title: '提交失败',
                                        type: 'error',
                                        message: res.data.message,
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                }
                            }).catch((error) => {
                                this.$msgbox({
                                    title: '提交失败',
                                    type: 'error',
                                    message: error || '服务器异常',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            })
                    })
                }
            },
        }
    }

</script>