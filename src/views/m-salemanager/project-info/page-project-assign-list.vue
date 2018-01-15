<template>
    <div class="page-project-list">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search :fields="fields"
            @change="selectChange"
            @submit="submitSearch"
            :selectSource="selectSource"
            ref="searchBar"></t8t-search>
        <t8t-toolbar ref="contractToolbar"
            @VIEW="viewBtn"
            @EXPORT="doExport">
        </t8t-toolbar>
        <t8t-grid :columns="columns"
            :service="service"
            :method="method"
            :commonData="selectSource"
            :args="args"
            ref="projectTable"
            @row-double-click="viewBtn"
            :radioCol="true"
            @current-row-change="rowChanges"
            :pgsize="pageSize"
            :pageSizes="[5,10,20,50,100]">
        </t8t-grid>
    </div>
</template>

<script>
import Service from 'src/services/salemanager/project/Service.js'
import exportUtils from 'src/utils/export.js'
import Cookie from 'js-cookie'
import CommonApi from 'src/services/commonApi/commonApi.js'

export default {
    name: 'page-project-assign-list',
    data() {
        return {
            detailPath:'/tuchat-sale-manage/project-assign-detail',
            service: Service.PROJECT.name,
            method: Service.PROJECT.methods.QUERYSHEETBYPAGE,
            args: {
                search: {
                    id_gt: 0,
                },
                sort:["createTime_desc"],
                page: 1,
                size: 20,
            },
            pageSize: null,
            selectSource: {
                orderStatus: [],
                roleType: [
                    { text: '设计师', value: 'designerId' },
                    { text: '首席设计师', value: 'chiefDesignerId' },
                    { text: '销售主管', value: 'saleLeaderId' },
                    { text: '设计主管', value: 'designLeaderId' },
                    { text: '客服', value: 'customerManagerId' },
                    { text: '项目经理', value: 'projectManagerId' },
                    { text: '质检', value: 'qualityControlId' },
                    { text: '工程经理', value: 'engrManagerId' },
                    { text: '工程部总监', value: 'engrLeaderId' },
                    { text: '下单员', value: 'orderUserId' },
                    { text: '审核员', value: 'checkUserId' },
                ],
                dateType: [
                    { text: '发布时间', value: 'createTime', disabled: false },
                    {
                        text: '首次派单时间',
                        value: 'firstAssignTime',
                        disabled: false,
                    },
                    {
                        text: '首次邀约时间',
                        value: 'firstInviteTime',
                        disabled: false,
                    },
                    {
                        text: '预计量房时间',
                        value: 'planMeasureTime',
                        disabled: false,
                    },
                    {
                        text: '实际量房时间',
                        value: 'realMeasureTime',
                        disabled: false,
                    },
                    {
                        text: '实际签约时间',
                        value: 'realSignedTime',
                        disabled: false,
                    },
                    { text: '实际开工时间', value: 'startTime', disabled: false },
                    { text: '实际竣工时间', value: 'completedTime', disabled: false },
                ],
            },
            fields: [
                { type: 'input', label: '项目ID', name: 'sourceProjectId' },
                {
                    type: 'select',
                    label: '项目状态',
                    name: 'orderSubStatus',
                    selectSourceKey: 'orderStatus',
                    filterable: true,
                },
                {
                    type: 'oldarea',
                    label: '区域',
                    name: 'city',
                    subNames: ['provinceId_eq', 'cityId_eq', 'townId_eq'],
                    clearable: true,
                },
                { type: 'input', label: '楼盘名称', name: 'estateName_like' },
                { type: 'input', label: '业主姓名', name: 'ownerName' },
                {
                    type: 'select',
                    label: '跟进人角色',
                    name: 'roleType',
                    selectSourceKey: 'roleType',
                    filterable: true,
                },
                // { type: 'input', label: '跟进人姓名', name: 'roleId' },
                {
                    type: 'popup',
                    label: '跟进人名称',
                    name: 'roleId', //需要传递给后台查询的数据
                    textValue: 'name', //需要展示出来的名称
                    filedValue: 'accountId', //选中那条数据的ID
                    //自动补全
                    remote: true,
                    service: Service.PROJECT.name,
                    method: Service.PROJECT.methods.QUERYACCOUNTBYCOMPANY,
                    remoteQueryKey: 'name_like',
                    icon: 'false',
                    onIconClick: function() {}, //是否显示可用放大镜搜索
                    remoteArgs: {
                        page: 1,
                        size: 10,
                    },
                },
                // { type: 'select', label: '托管款状态', name: 'projectId4', selectSourceKey: 'orderStatus1', filterable: true },
                // { type: 'select', label: '轮单费状态', name: 'dispatchFeeStatus', selectSourceKey: 'orderStatus1', filterable: true },
                {
                    type: 'select',
                    label: '时间类型',
                    name: 'timeType',
                    selectSourceKey: 'dateType',
                },
                {
                    type: 'datetime',
                    label: '时间查询',
                    name: 'times',
                    pickertype: 'daterange',
                    startField: 'time_gte',
                    endField: 'time_lte',
                    inputWidth: '200',
                },
                {
                    type: 'select',
                    label: '时间类型',
                    name: 'timeTypeExt',
                    selectSourceKey: 'dateType',
                },
                {
                    type: 'datetime',
                    label: '时间查询',
                    name: 'timeExt',
                    pickertype: 'daterange',
                    startField: 'timeExt_gte',
                    endField: 'timeExt_lte',
                    inputWidth: '200',
                },
            ],
            columns: [
                {
                    prop: 'sourceProjectId',
                    label: '项目ID',
                },
                {
                    prop: 'createTime',
                    label: '发布时间',
                    formatter: 'dateParser',
                },
                {
                    prop: 'cityTownName',
                    label: '区域',
                },
                {
                    prop: 'estateName',
                    label: '楼盘',
                },
                {
                    prop: 'appellation',
                    label: '业主称呼',
                },
                {
                    prop: 'ownerName',
                    label: '业主姓名',
                },
                {
                    prop: 'orderSubStatusName',
                    label: '项目状态',
                },
                {
                    prop: 'designLeaderName',
                    label: '设计师主管',
                },
                {
                    prop: 'designerName',
                    label: '设计师',
                },
                {
                    prop: 'projectManagerName',
                    label: '项目经理',
                },
                {
                    prop: 'qualityControlName',
                    label: '质检',
                },
                {
                    prop: 'firstInviteTime',
                    label: '首次邀约时间',
                    formatter: 'dateParser',
                },
                {
                    prop: 'realMeasureTime',
                    label: '实际量房时间',
                    formatter: 'dateParser',
                },
                {
                    prop: 'realSignedTime',
                    label: '签约时间',
                    formatter: 'dateParser',
                },
                {
                    prop: 'startTime',
                    label: '开工时间',
                    formatter: 'dateParser',
                },
                {
                    prop: 'completedTime',
                    label: '竣工时间',
                    formatter: 'dateParser',
                },
            ],
            curRow: null,
        }
    },
    created() {
        this.getConfigList()
    },
    activated() {
        this.getTableData()
    },
    methods: {
        getConfigList() {
            let codeList = [
                81001,
                81002,
                81003,
                81004,
                81005,
                81006,
                81007,
                81008,
            ]
            let _list = []
            CommonApi.queryUnionParent({
                search: { pPropertyCodes: codeList },
                page: 1,
                size: 1000,
            })
                .then(res => {
                    if (res.data.status == 200) {
                        this.selectSource.orderStatus = res.data.result.map(
                            item => ({
                                text: item.propertyName,
                                value: item.propertyCode,
                            })
                        )
                    }
                })
                .catch(() => {
                    return
                })
        },
        //表格刷新
        getTableData() {
            this.$refs['projectTable'].reloadTable()
        },
        viewBtn(obj) {
            if (typeof obj === 'object') {
                this.$router.push({
                    path: this.detailPath,
                    query: { id: obj.id },
                })
                return
            }
            let selectRow = this.$refs['projectTable'].states.currentRow
            if (selectRow) {
                this.$router.push({
                    path: this.detailPath,
                    query: { id: selectRow.id },
                })
            } else {
                this.$message.error('请选中要查看的项目')
                return
            }
        },
        doExport() {
            let _this = this
            exportUtils({
                method: Service.PROJECT.methods.EXPORTSHEET,
                service: Service.PROJECT.name,
                args: _this.args,
                headers:
                    '项目ID,区域,楼盘,业主称呼,业主姓名,项目状态,设计师主管,设计师,项目经理,质检,发布时间,首次邀约时间,实际量房时间,签约时间,开工时间,竣工时间,订单备注,合同金额,缴款状态,返款状态,轮单费,轮单费状态',
                sorts:
                    'sourceProjectId,cityTownName,estateName,appellation,ownerName,orderSubStatusName,designLeaderName,designerName,projectManagerName,qualityControlName,createTimeStr,firstInviteTimeStr,realMeasureTimeStr,realSignedTimeStr,startTimeStr,completedTimeStr,remarks,contractTotalAmount,trusteeFeeStatusName,trusteeFeeReturnStatusName,dispatchFee,dispatchFeeStatusName',
            })
        },
        selectChange(val, type) {
            let _self = this
            let _form = _self.$refs.searchBar.formData
            if (['timeType', 'timeTypeExt'].indexOf(type) > -1) {
                _self.selectSource.dateType.forEach(item => {
                    if (
                        item.value == _form.timeTypeExt ||
                        item.value == _form.timeType
                    ) {
                        item.disabled = true
                    } else {
                        item.disabled = false
                    }
                })
            }
        },
        submitSearch(obj) {
            let _search = {}
            let appendKeys = [
                'timeType',
                'timeTypeExt',
                'timeExt',
                'times',
                'timeExt_gte',
                'timeExt_lte',
                'time_lte',
                'time_gte',
                'roleType',
                'roleId',
                'provinceId_eq',
            ]
            if (obj.timeTypeExt && obj.timeExt_lte && obj.timeExt_gte) {
                obj[`${obj.timeTypeExt}_lte`] = obj.timeExt_lte + 24*3600-1
                obj[`${obj.timeTypeExt}_gte`] = obj.timeExt_gte
            }
            if (obj.timeType && obj.time_lte && obj.time_gte) {
                obj[`${obj.timeType}_lte`] = obj.time_lte + 24*3600-1
                obj[`${obj.timeType}_gte`] = obj.time_gte
            }
            if (obj.roleType && obj.roleId) {
                obj[obj.roleType] = obj.roleId
            }
            appendKeys.forEach(item => {
                delete obj[item]
            })
            _search = { ...obj }
            this.args = { ...this.args, ...{ search: _search } }
        },
    },
}
</script>
