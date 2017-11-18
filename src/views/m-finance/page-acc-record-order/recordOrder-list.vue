<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"
            :customColumn="true"
            :selectCol="false"
            @list-view="doView"
            @list-delete="doDelete"
            @list-add="doAdd"
            @list-edit="doEdit"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import apiAccAccountConfig from 'src/services/finance/accAccountConfig.js'
    import Service from 'src/services/finance/Service.js'

    export default {
        components: { T8tListView },
        watch: {
//            $route: function () {
//                this.$refs['list-view'].getTableInstance().reloadTable()
//            },
        },
        activated () {
            this.$refs['list-view'].getTableInstance().reloadTable()
        },
        data () {
            return {
                // 面包屑
                breadcrumbData: [{ title: '财务' },{ title: '资金管理' },{ title: '账户收支单' }],
                // 详情页路由地址
                detailRoute: '/test/resume/view',
                // service 和 method 目前需要加密
                service: Service.ACC_ACCOUNT_CONFIG.name, // /biz/t8t-fi-acc/app
                method: Service.ACC_ACCOUNT_CONFIG.methods.RECORD_QUERYPAGE, // views.record.order.queryPage
                tableArgs: {
                    search:{
                        aa: null
                    },
                    sort:["createTime_desc"],
                    size: 100,
                    page:1
                },
                // 表头描述
                tableColumns: [
                    {prop: 'code', label: '单据编号', show: true},
                    {prop: 'userTypeName', label: '用户类型', show: true},
                    {prop: 'userId', label: '用户ID', show: true},
                    {prop: 'userName', label: '用户名称', show: true},
                    {prop: 'accountTypeName', label: '账户类型', show: true},
                    {prop: 'recordChildTypeName', label: '收支类型', show: true},
                    {
                        prop: 'amount',
                        label: '金额',
                        show: true,
                        formatter: function (val, row) {
                            if(val !== undefined ){
                                return row.recordType === 1 ? "+" + val.toString() : "-" + val.toString()
                            }else{
                                
                            }
                        }
                    },
                    {prop: 'remark', label: '备注', show: true},
                    {prop: 'isK3', label: '传K3状态', show: false},
                    {prop: 'createName', label: '创建人名称', show: true},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser', show: true},
                    {prop: 'updateName', label: '修改人名称', show: true},
                    {prop: 'updateTime', label: '修改时间', formatter: 'dateParser', show: true}
                ],
                searchCache: {
                    "userTypeCode": null,
                    "userId": null,
                    "accountTypeName": null,
                    "recordChildTypeCode": null,
                    "status": null,
                    "isK3": null
                },
                // 搜索项配置
                searchFields: [
                    {type: 'select', label: '用户类型', name: 'userTypeCode', selectSourceKey: 'userTypeCodeOptions'},
                    {type: 'input', label: '用户ID', name: 'userId'},
                    {type: 'select', label: '账户类型', name: 'accountTypeName', selectSourceKey: 'accountTypeCodeOptions'},
                    {type: 'select', label: '收支类型', name: 'recordChildTypeCode', selectSourceKey: 'recordTypeOptions'},
                    {type: 'select', label: '单据状态', name: 'status', selectSourceKey: 'statusOptions'},
                    {type: 'select', label: '传K3状态', name: 'isK3', selectSourceKey: 'isK3Options'}
                ],
                // 搜索项对应值
                searchOptions: {
                    isK3Options: [{
                        text: '已传',
                        value: 1
                    }, {
                        text: '未传',
                        value: 0
                    }, {
                            text: '待传',
                            value: 2
                        }
                    ],
                    statusOptions:[
                        {
                            text: '有效',
                            value: 1
                        }
                    ],
                    userTypeCodeOptions: [],
                    accountTypeCodeOptions: [],
                    recordTypeOptions: []
                }
            }
        },
        created() {
            //读取辅助资料
            //用户类型
            this.getCommonOptions('6!610!61016!', 'userTypeCodeOptions')
            //账户类型
            this.getAccountTypeByUserType()
            //收支类型
            this.getCommonOptions('6!610!61017!', 'recordTypeOptions')
        },

        methods: {
            onSearchSubmit (obj) {
                this.searchCache = obj
                this.tableArgs = {search: obj}
            },
            onchange (val) {

            },
            getAccountTypeByUserType(){
                let arg =  {
                    userTypeCode:null
                }
                let list = []
                apiAccAccountConfig.getAccountTypeByUserType(arg).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.name,
                                text: item.name
                            })
                        })
                        this.searchOptions['accountTypeCodeOptions'] = list
                    }
                })
            },
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    fields: [
                        "id",
                        "propertyName",
                        "propertyCode",
                        "propertyStatus",
                        "wholeCode"
                    ],
                    page: 1,
                    search: {
                        wholeCode_like: fatherCode
                    },
                    size: 1000
                }
                let list = []
                commonApi.queryPage(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.rows.forEach((item) => {
                                //启用
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.wholeCode,
                                        text: item.propertyName
                                    })
                                };
                            })
                            this.searchOptions[selectName] = list
                        }
                    })
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
