<template>
    <div>
        <t8t-list-view ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :toolbarSymbolList="toolbarSymbolList"
            :toolbarDisabledSymbols="toolbarDisabledSymbols"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"
            @tree-node-click="treeClick"
            :defaultTreeExpandedKeys="[0]"
            @list-view="doView"
            @search-submit="onSearchSubmit"
            @table-row-dobule-click="doView"
            @table-selection-change="selectionChange">
        </t8t-list-view>
    </div>
</template>

<script>
import T8tListView from 'src/components/t8t-list-view/index.vue'
import Service from 'src/services/delivery/goodsDemand/Service.js'
import { formatDate } from './dateLib.js'
import Cookie from 'js-cookie'
import commonApi from 'src/services/commonApi/commonApi.js'

export default {
    components: { T8tListView },
    activated() {
        this.$refs['list-view'].getTableInstance().reloadTable()
    },
    data() {
        var isTimestamp = function(date) {
            if (typeof date === 'string') {
                return !date.match(/^\d{13}$/)
            } else if (typeof date === 'number') {
                return !(date + '').match(/^\d{13}$/)
            }
            return true
        }
        return {
            // 详情页路由地址
            detailRoute: '/tuchat-delivery/demand-view',
            // service 和 method 目前需要加密
            service: Service.DEMAND.name,
            method: Service.DEMAND.methods.QUERYPAGE,
            tableArgs: {
                search: {
                    projectId_like: null,
                    ownerName: null,
                    workerName: null,
                    orderCode_like: null,
                    orderStatus_eq: null,
                    materialType_eq: null,
                    goodsDemandSource_eq: null,
                },
            },
            toolbarDisabledSymbols: [],
            // 表头描述
            tableColumns: [
                { prop: 'orderCode', label: '要货单编号' },
                { prop: 'organization', label: '组织' },
                { prop: 'sourceProjectId', label: '项目ID' },
                { prop: 'materialTypeName', label: '材料类型' },
                { prop: 'goodsDemandSourceName', label: '要货来源' },
                { prop: 'bizTypeName', label: '业务线类型' },
                { prop: 'workerName', label: '工长姓名' },
                { prop: 'ownerName', label: '业主姓名' },
                { prop: 'orderStatus', label: '状态', list: 'orderStatusOption' },
                { prop: 'receiveAddress', label: '收货地址' },
                {
                    prop: 'goodsDemandTime',
                    label: '要货日期',
                    formatter(text) {
                        let dateString
                        if (text === 0 || text === null) {
                            dateString = ''
                        } else {
                            let objDate = new Date(text * 1000)
                            let _newObj = isTimestamp(text)
                                ? objDate
                                : new Date(text)
                            dateString = formatDate(objDate, 'yyyy-MM-dd')
                        }
                        return dateString
                    },
                },
                { prop: 'createTime', label: '创建时间', formatter: 'dateParser' },
            ],
            // 搜索项配置
            searchFields: [
                { type: 'input', label: '项目ID', name: 'sourceProjectId_like' },
                { type: 'input', label: '要货单号', name: 'orderCode_like' },
                {
                    type: 'select',
                    label: '单据状态',
                    name: 'orderStatus_eq',
                    selectSourceKey: 'orderStatusOption',
                },
                {
                    type: 'select',
                    label: '材料类型',
                    name: 'materialType_eq',
                    selectSourceKey: 'materialTypeOption',
                },
                {
                    type: 'select',
                    label: '要货来源',
                    name: 'goodsDemandSource_eq',
                    selectSourceKey: 'goodsDemandOption',
                },
            ],
            // 搜索项对应值
            searchOptions: {
                orderStatusOption: [
                    { text: '待发货', value: 0 },
                    { text: '已发货', value: 1 },
                    { text: '已收货', value: 2 },
                    { text: '取消', value: 3 },
                    { text: '待审核', value: 4 },
                    { text: '已驳回', value: 5 },
                    { text: '新建（暂存）', value: 6 },
                    { text: '待报备', value: 7 },
                ],
                materialTypeOption: [],
                goodsDemandOption: [],

                installDispatch: [],
                materialType: [],
                goodsDemandSource: [],
                bizTypeId: [],
                status: [],
            },
            receiptsTableDialogShow: false,
            dialogSet: {},
            treeData: [],
            treeProps: {
                label: 'name',
                children: 'children',
            },
            sltOrg: 0,
            toolbarSymbolList: ['VIEW'],
        }
    },
    created() {
        let _self = this
        this.getConfigList()
        this.$nextTick(function() {
            _self.selectionChange({})
        })
    },
    methods: {
        //todo 辅助资料编码设置
        getConfigList() {
            let codeList = [42202,82402]
            let _list = {}
            codeList.forEach(item => {
                _list[item.toString()] = []
            })
            commonApi
                .queryUnionParent({
                    search: { pPropertyCodes: codeList },
                    page: 1,
                    size: 1000,
                })
                .then(res => {
                    if (res.data.status != 200) {
                        this.$message.error('配置获取失败')
                        return
                    }
                    res.data.result.forEach(item => {
                        _list[item.pPropertyCode].push({
                            text: item.propertyName,
                            value: item.id,
                        })
                    })
                    this.searchOptions.materialTypeOption = _list['42202']
                    this.searchOptions.goodsDemandOption = _list['82402']
                })
                .catch(() => {
                    return
                })
        },
        treeClick(data) {
            this.sltOrg = data.id
            this.tableArgs = { search: { organizationId: data.id } }
        },
        onSearchSubmit(obj) {
            obj.organizationId = this.sltOrg || null
            this.tableArgs = { search: obj }
        },
        doView() {
            let selections = this.$refs['list-view']
                .getTableInstance()
                .getSelectRows()
            if (selections.length > 0) {
                this.$router.push({
                    path: this.detailRoute,
                    query: { id: selections[0].id },
                })
            } else {
                this.$message.error('请选择操作单据后重试')
            }
        },
        selectionChange(rows) {
            this.toolbarDisabledSymbols = []
            if (rows.length > 1) {
                this.toolbarDisabledSymbols = ['VIEW']
            }
        },
    },
}
</script>
