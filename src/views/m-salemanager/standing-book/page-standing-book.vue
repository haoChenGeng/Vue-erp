<template>
    <div class="page-intention-owner-list">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <el-tabs v-model="activeName" @tab-click="handleClickTabs">
            <el-tab-pane
                         v-for="item in buttons"
                         :label="item.name"
                         :name="item.symbol"
            >
            </el-tab-pane>
        </el-tabs>

        <t8t-search :fields="fields" @submit="submitSearch" :selectSource="selectSource"></t8t-search>

        <t8t-toolbar
            @EXPORT="doExport"
        >
        </t8t-toolbar>

        <t8t-table
            class="standingBookTable"
            :columns="columns"
            :service="service"
            :method="method"
            :commonData="selectSource"
            :args="args"
            ref="t8tTable"
        >
        </t8t-table>
    </div>
</template>

<script>
    //todo
    import decorationOrderAPI from 'src/services/salemanager/salemanager.js'
    import Service from 'src/services/salemanager/Service.js'
    import exportUtils from 'src/utils/export.js'


    import Cookie from 'js-cookie'
    import Perm from 'src/services/permission/Perm.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import standingBookApi from 'src/services/salemanager/standingbook.js'

    export default {
        name: 'page-stading-book',
        components: {
        },
        data() {
            return {
                buttons: [
                    {
                        value: null,
                        name: "全部",
                        symbol: "all"
                    }, {
                        value: 1,
                        name: "待到店",
                        symbol: "wait"
                    }, {
                        value: 2,
                        name: "已到店",
                        symbol: "arrived"
                    }, {
                        value: 3,
                        name: "订金/预售",
                        symbol: "paying"
                    }, {
                        value: 4,
                        name: "已签约",
                        symbol: "finished"
                    },
                ],
                service: Service.STANDINGBOOK.name,
                method: Service.STANDINGBOOK.methods.QUERYPAGE,
                args: {
                    search: {
                        status: 'all'
                    },
                    page:1,
                    size:20
                },
                bizSearchType:"all",

                selectSource:{
                    statusList:[],
                    clientManagerList:[]
                },
                activeName: 'all',

                searchCache: {
                },

                fields: [
                    {type: 'input', label: '业主电话', name: 'phone'},
                    {
                        type: 'input',
                        label: '楼盘名称',
                        name: 'estateName_like'
                    },
                    {type: "oldarea", type:"oldarea",label: "城市",name: "city_eq",subNames:["proId","cityId_eq","townId_eq"],clearable:true},
                    {type: 'input', label: '项目ID', name: 'projectId'},
                    {type: 'select', label: '阶段', name: 'orderSubStatus',selectSourceKey:'statusList'},
                    {type: 'select', label: '客户经理', name: 'clientManagerId',selectSourceKey:'clientManagerList'},
                    {type: 'datetime', label: '创建时间', name: 'checkTime', pickertype: 'daterange',
                        startField: 'createTime_gte',
                        endField: 'createTime_lte'
                    },
                ],
                breadcrumbData: [
                    {title: '销售管理'},
                    {title: '业主跟进管理'},
                    {title: '销售台账'}
                ],
                columns: [
                    {
                        prop: "createTime",
                        label: "记录时间",
                        formatter: 'dateParser'
                    },
                    {
                        prop: "clientManagerNames",
                        label: "客户经理",
                    },
                    {
                        prop: "assignTime",
                        label: "派客户经理时间",
                        formatter: 'dateParser'
                    },
                    {
                        prop: "areaName",
                        label: "区域"
                    },
                    {
                        prop: "estateName",
                        label: "楼盘"
                    },
                    {
                        prop: "appellation",
                        label: "业主称呼"
                    },
                    {
                        prop: "phoneId",
                        label: "业主电话ID"
                    },
                    {
                        prop: "projectId",
                        label: "项目ID"
                    },
                    {
                        prop: "orderSubStatusName",
                        label: "状态"
                    },
                    {
                        prop: "typeName",
                        label: "类型"
                    },
                    {
                        prop: "feedback",
                        label: "备注"
                    }
                    ],
                ownerList: [],
            }
        },
        created () {
            this.getCommonOptions(["10901","10902","10903","10904","10905"],'statusList');//分配状态
            this.getManager();
        },
        methods: {
            getManager() {
                standingBookApi.getClientManager({search:{uid:parseInt(Cookie.get('t8t-tc-uid'))}}).then(res=>{
                    let _list =[{text:Cookie.get('t8t-tc-username'),value:Cookie.get('t8t-tc-uid')}]
                    if(res.data.status != 200) {
                        this.$message.error("获取下级失败")
                        return
                    }
                    res.data.result.forEach(item => {
                        _list.push({text:item.name,value:item.id})
                    })
                    this.selectSource.clientManagerList = _list
                }).catch(error => {
                    console.log(error)
                })
            },
            handleClickTabs(event) {
                if(event.name != this.bizSearchType) {
                    this.args.search.status = event.name
                }
                this.bizSearchType = event.name
                this.getTableData()
            },
            //辅助资料
            getCommonOptions: function(fatherCodes,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCodes: fatherCodes
                    },
                    size: 100
                }
                let list = []
                let _this = this
                apiCommon.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                    list.push({
                                        value: item.propertyCode,
                                        text: item.propertyName
                                    })
                            })
                            _this.selectSource[selectName] = list;
                        }else{
                            this.$message.error("项目阶段获取失败")
                            return
                        }
                    })
            },
            //搜索提交
            submitSearch(obj) {
                this.searchCache = this.isEmptyObject(obj) ? {id_gt: 0}: obj;
                if(obj.cityId != undefined) {
                    this.searchCache.cityId = parseInt(obj.cityId);
                }
                if(obj.townId != undefined) {
                    this.searchCache.townId = parseInt(obj.townId);
                }
                this.searchCache.status = this.bizSearchType
                this.args = {
                    search: this.searchCache,
                }
            },
            isEmptyObject(obj){
                for (var key in obj) {
                    return false;
                }
                return true;
            },

            //表格刷新
            getTableData() {
                this.$refs['t8tTable'].reloadTable();
            },
            //导出
            doExport() {
                this.$TCS.addTag('erp_scm_015004001002');
                let exportArgs = this.args
                exportArgs.page = 1
                exportArgs.size = 1000
                exportUtils({
                    service: Service.STANDINGBOOK.name,
                    method: Service.STANDINGBOOK.methods.QUERYPAGE,
                    args: exportArgs,
                    headers: '记录时间,客户经理,派客户经理时间,区域,楼盘,业主称呼,业主电话ID,项目ID,状态,类型,备注',
                    sorts: "createDate,clientManagerNames,timeToVisitDate,areaName,estateName,appellation,phoneId,projectId,orderSubStatusName,typeName,feedback"
                })
            },
        }
    }

</script>
<style scoped>
    .t8t-table {
        height: 350px
    }
</style>
<style>
    .page-intention-owner-list .intention-owner-a {
        text-decoration: none;
        color: #3396FB;
    }
    .standingBookTable div.table-container  div.el-table table tr.el-table__row td div.cell {
        height: 32px;
        overflow: hidden;
    }
</style>
