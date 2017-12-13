<template>
    <div v-bind="accAccountBalance-detail">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="searchFields"
            :selectSource="searchOptions"
            @submit="onSearchSubmit"
        >
        </t8t-search>
        <t8t-grid
            :indexCol="true"
            :selectCol="false"
            :customColumn="true"
            :columns="tableColumns"
            :service="service"
            :args="tableArgs"
            :method="method"
            :isLoading="isLoading"
            :commonData="searchOptions"
            ref="t8tTable"
            @row-double-click="handleRowDbClick"
        >
        </t8t-grid>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/finance/Service.js'
    import Cookie from 'js-cookie'
    import axios from 'src/utils/axios.js'

    let accountId
    let accountLevel
    export default {
        components: {},
        watch: {
//            $route: function () {
//                this.$refs['list-view'].getTableInstance().reloadTable()
//            },
        },
        data () {
            return {
                // 面包屑
                breadcrumbData: [{ title: '财务' },{ title: '资金管理' },{ title: '账户余额明细' }],
                // 详情页路由地址
                detailRoute: '/tuchat-finance/accAccountBalance-detail',
                // service 和 method 目前需要加密
                service: Service.ACC_ACCOUNT_CONFIG.name, // /biz/t8t-fi-acc/app
                method: Service.ACC_ACCOUNT_CONFIG.methods.TRANSACTION_FINDBYID, // views.transaction.record.findById
                tableArgs: {
                    id: accountId,
                    sort: ["createTime_desc"],
                    size: 100,
                    page: 1
                },
                // 表头描述
                tableColumns: [
                    {prop: accountLevel===1 ? 'userTypeName': 'childUserTypeName', label: '用户类型', show: true},
                    {prop: accountLevel===1 ? 'userId': 'childUserId', label: '用户ID', show: true},
                    {prop: accountLevel===1 ? 'userName' : 'childUserName', label: '用户名称', show: true},
                    {prop: accountLevel===1 ? 'accountTypeName' : 'childAccountTypeName', label: '账户类型', show: true},
                    {prop: accountLevel===1 ? 'balance' : 'childBalance', label: '余额', show: accountLevel===1 ? true : false},
                    {prop: 'childUserTypeName', label: '二级用户类型', show: accountLevel===1 ? true : false},
                    {
                        prop: 'childUserId',
                        label: '二级用户ID',
                        show: accountLevel===1 ? true : false,
                        formatter: function (val) {
                            return val === 0 ? "": val
                        }
                    },
                    {prop: 'childUserName', label: '二级用户名称', show: accountLevel===1 ? true : false},
                    {prop: 'childAccountTypeName', label: '二级账户类型', show: accountLevel===1 ? true : false},
                    {prop: 'recordChildTypeName', label: '收支类型', show: true},
                    {
                        prop: 'amount',
                        label: '收支金额',
                        show: true,
                        formatter: function (val, row) {
                            return row.recordType === 1 ? "+" + val.toString() : "-" + val.toString()
                        }
                    },
                    {prop: 'childBalance', label: '二级账户余额', show: true},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser', show: true},
                    {prop: 'createName', label: '创建人', show: false},
                    {prop: 'updateName', label: '修改人', show: false},
                    {prop: 'updateTime', label: '修改时间', formatter: 'dateParser', show: false}
                ],
                searchCache: {
                    "id":null,
                    "createTime_gte": null,
                    "createTime_lte": null
                },
                // 搜索项配置
                searchFields: [
                    {
                        type: 'datepicker',
                        label: '创建时间',
                        name: 'createTime',
                        pickertype: 'daterange',
                        startField: 'createTime_gte',
                        endField: 'createTime_lte'
                    }
                ]
            }
        },
        created() {

        },
        beforeCreate() {
            accountId = this.$route.query.accountId
            accountLevel = this.$route.query.accountLevel
        },

        methods: {
            onSearchSubmit (obj) {
                if(obj.createTime_lte != undefined) {
                    //把创建时间的结束日期变为当天的23::59:59秒
                    obj.createTime_lte = obj.createTime_lte + 24*3600 - 1
                }
                this.searchCache.createTime_gte = obj.createTime_gte
                this.searchCache.createTime_lte = obj.createTime_lte
                this.searchCache.id = accountId
                axios({
                    service: Service.ACC_ACCOUNT_CONFIG.name, // /biz/t8t-fi-acc/app
                    method: Service.ACC_ACCOUNT_CONFIG.methods.TRANSACTION_QUERYPAGE, // views.transaction.record.queryPage
                    args: {
                        search:{
                            "id":this.searchCache.id,
                            "createTime_gte": this.searchCache.createTime_gte,
                            "createTime_lte": this.searchCache.createTime_lte
                        },
                        sort: ["createTime_desc"],
                        size: 100,
                        page: 1
                    },
                }).then((res)=>{
                    if(res.data.status === 200){
                        this.$refs["t8tTable"].dataSource = res.data.result.rows
                    }else{
                    }
                }).catch((res)=>{
                })
            },
            onchange (val) {

            }
        }
    }
</script>

<style lang="css" scoped>

</style>
