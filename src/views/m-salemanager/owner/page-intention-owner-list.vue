<template>
    <div class="page-intention-owner-list">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <el-tabs v-model="activeName" @tab-click="handleClickTabs">
            <el-tab-pane v-if="symbolListTop.indexOf(item.symbol) > -1"
                         v-for="item in buttons" :label="item.name" :name="item.symbol"></el-tab-pane>
        </el-tabs>

        <t8t-search ref="t8tSearch" :fields="fields" @submit="submitSearch" :selectSource="selectSource"></t8t-search>

        <div class="t8t-toolbar">
            <el-button
                v-for="item in buttons"
                v-if=" symbolListDown === undefined || symbolListDown.length < 1 || symbolListDown.indexOf(item.symbol) > -1"
                size="toolbar"
                :symbol="item.symbol"
                @click="handleClick(item.symbol, $event)"
                onkeydown="return false"
            >{{item.name}}</el-button>
        </div>

        <t8t-table
            :radioCol="true"
            :columns="columns"
            :service="service"
            :method="method"
            :commonData="selectSource"
            :args="args"
            ref="t8tTable"
            @current-row-change="handleCurrentRowChange"
            @row-click="handleRowClick"
            @row-double-click="viewClick()"
        >
        </t8t-table>
    </div>
</template>

<script>
    import decorationOrderAPI from 'src/services/salemanager/salemanager.js'
    import Service from 'src/services/salemanager/Service.js'
    import Cookie from 'js-cookie'
    import AddDialog from './add-dialog.vue'
    import ImportDialog from './import-dialog.vue'
    import Perm from 'src/services/permission/Perm.js'
    import exportUtils from 'src/utils/export.js'

    import apiCommon from 'src/services/commonApi/commonApi.js'

    export default {
        name: 'page-pay-plan',
        components: {
        },
        data() {
            return {
                symbolListTop: [
                    'ALL-LIST',
                    'TO-BE-MET',
                    'HAVE-MET',
                    'HAS-SIGNED-UP'
                ],
                symbolListDown: [
                    'EXPORT'
                ],
                symbolListDownClick: {
                    'ALL-LIST': "allList",
                    'TO-BE-MET': "toBeMet",
                    'HAVE-MET': "haveMet",
                    'HAS-SIGNED-UP': "hasSignedUp",
                    'EXPORT': "doExport"
                },
                bizSearchTypeArray: {
                    'ALL-LIST': "TYPE_ALL",
                    'TO-BE-MET': "TYPE_NOTMEET",
                    'HAVE-MET': "TYPE_MEET",
                    'HAS-SIGNED-UP': "TYPE_PAYED"
                },
//                意向业主管理：
//                使用人员：产品、高级运营人员；无数据隔离控制，所有人可查看所有项目，具体可使用人员为产品、高级运营人员；
//                全部：项目状态为【意向】、【见面】、【交订】、
//                待见面：项目主状态为【意向】，及主状态为【见面】是子状态为【已分客户经理】【已邀约待到店】
//                已见面：项目主状态为【见面】时，子状态为【已到店】、【已量房待到店】、【已量房已到店】；
//                已下定：项目主状态为【交订】；
                statusListSonArray: {
                    'ALL-LIST': [],
                    'TO-BE-MET': [1090201,1090202,1090203,1090301,1090302],//意向
                    'HAVE-MET': [1090303,1090304,1090305],//见面
                    'HAS-SIGNED-UP': [] //交订
                },
                statusListFatherArray: {
                    'ALL-LIST': [10902,10903,10904],
                    'TO-BE-MET': [],//意向
                    'HAVE-MET': [],//见面
                    'HAS-SIGNED-UP': [10904] //交订
                },
                buttons: [],
                service: Service.SALES.name,
                method: Service.SALES.methods.QUERY_INTENTIAL_ORDER_BY_PAGE,
                args: {
                    search: {
                        id_gt: 0
                    },
                    bizSearchType:"TYPE_NOTMEET",
                    sort:[
                        "id_desc"
                    ]
                },
                bizSearchType:"TYPE_NOTMEET",
                selectSource:{
                    flowUserList:[],
                    statusList:[]
                },
                createOwnerVisible: false,
                assignDialogVisible: false,
                activeName: 'TO-BE-MET',
                searchCache: {
                    "id_eq":null,
                    "phone_eq":null,
                    "estateName_like":null,
                    "cityId_eq":null,
                    "townId_eq":null,
                    "stage":null,
                    "auditId_eq":null,
                    "updateTime_gte":null,
                    "updateTime_lte":null
                },
                fields: [
                    {type: 'input', label: '电话', name: 'phone_eq'},
                    {type: 'input', label: '楼盘名称', name: 'estateName_like'},

                    {type: "oldarea", type:"oldarea",label: "城市",name: "city_eq",subNames:["provinceId_eq","cityId_eq","townId_eq"],clearable:true},
                    {type: 'input', label: '项目ID', name: 'id_eq'},
                    {type: 'select', label: '状态', name: 'orderSubStatus_eq', selectSourceKey:'statusList'},
                    {type: 'select', label: '跟进人', name: 'auditId_eq', selectSourceKey:'flowUserList'},
                    {
                        type: 'datetime', label: '最后跟进时间', name: 'checkTime', pickertype: 'daterange',
                        startField: 'updateTime_gte',
                        endField: 'updateTime_lte',
                        inputWidth:'200'
                    },

                ],
                breadcrumbData: [
                    {title: '销售管理'},
                    {title: '意向业主管理'}
                ],
                columns: [
                    {
                        prop: "appellation",
                        label: "业主称呼",
                        show: true,
                        formatter: function (val, row) {
                            if (val != undefined) {
                                return '<a href="#/sale-manage/page-intention-owner-list/view?id=' + row.id + '" class="intention-owner-a">' + val + '</a>'
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        prop: "phoneId",
                        label: "业主电话",
                        show: true
                    },
                    {
                        prop: "estateName",
                        label: "楼盘名称",
                        show: true
                    },
                    {
                        prop: "orderSubStatusName",
                        label: "状态",
                        show: true
                    },
                    {
                        prop: "area",
                        label: "区域",
                        show: true
                    },
                    {
                        prop: "id",
                        label: "项目ID",
                        show: true
                    },
                    {
                        prop: "auditor",
                        label: "跟进人",
                        show: true
                    },
                    {
                        prop: "auditPassedTime",
                        label: "审核通过时间",
                        show: true,
                        formatter: 'dateParser'
                    },
                    {
                        prop: "updateTime",
                        label: "最后操作时间",
                        show: true,
                        formatter: 'dateParser'
                    }],
                ownerList: [],
                dialogFormVisible: false,  //导入弹窗
                assignAccountId: null,
                curRow:{}
            }
        },
        created () {
            this.getCommonOptions([],this.statusListSonArray["TO-BE-MET"],'statusList');//分配状态 （意向业主）
            this.getFollowUser();//跟进人
            this.reload() //获取按钮权限
        },
//        watch: {
//            // 如果路由有变化，会再次执行该方法
//            '$route': 'routeReload'
//        },
        activated() {
            this.routeReload()
        },
        methods: {//路由改变时更新
            routeReload(){
                this.reload();
                this.getTableData();
            },

            reload () {
                let _this = this
                Perm.buttons('#' + this.$route.path)
                    .then((res) => {
                        _this.buttons = res.data.result
                    })
            },
            handleClick(event, sourceEvent) {
                let method = this.symbolListDownClick[event];
                this[method]()
            },
            handleClickTabs(event) {
                this.$refs['t8tSearch'].resetForm();
                this.getCommonOptions(this.statusListFatherArray[event.name],this.statusListSonArray[event.name],'statusList');//分配状态 （意向业主）
                let method = this.symbolListDownClick[event.name];
                this.bizSearchType = this.bizSearchTypeArray[event.name];
                this.args = {
                    search: {
                        id_gt: 0
                    },
                    bizSearchType:this.bizSearchType,
                    sort: [
                        "id_desc"  //根据id倒序排序
                    ]
                }
            },
            getFollowUser:function(){
                let arg = {
                    page: 1,
                    size: 100
                }
                let _this = this;
                decorationOrderAPI.listAccountByRoleCode(arg).then((res) => {
                    if (res.data.status === 200) {
                        let list = []
                        res.data.result.rows.forEach((item) => {
                            list.push({
                                value: item.accountId,
                                text: item.nickname
                            })
                        });
                        _this.selectSource.flowUserList = list;
                    }else{
                        this.$message.error("数据获取失败，请重新刷新页面");
                    }
                })
            },
            //辅助资料
            getCommonOptions: function(fatherCode,sonCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCodes: fatherCode,
                        propertyCodes: sonCode
                    },
                    size: 100
                }
                let list = []
                let _this = this
                apiCommon.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.propertyCode,
                                        text: item.propertyName
                                    })
                                };
                            });
                            _this.selectSource[selectName] = list;
                        }
                    })
            },
            handleCurrentRowChange(curRow, oldRow) {
                this.curRow = curRow
            },
            handleRowClick (row, event, column){
            },

            showOrderDetail(id){
                this.$router.push({
                    path: '/tochat-sale-manage/page-potential-owner-list/view',
                    query: {id: id,}
                })
            },
            //查看
            viewClick() {
                this.$router.push({ path: '/tochat-sale-manage/page-intention-owner-list/view', query: { id: this.curRow.id } })
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
                if(obj.provinceId_eq != undefined) {
                    this.searchCache.provinceId_eq = parseInt(obj.provinceId_eq);
                }
                if(obj.updateTime_lte != undefined) {
                    //把最后更新时间的结束日期变为当天的23::59:59秒
                    obj.updateTime_lte = obj.updateTime_lte + 24*3600 - 1
                }
                this.args = {
                    search: this.searchCache,
                    bizSearchType:this.bizSearchType,
                    sort:[
                        "id_desc"  //根据id倒序排序
                    ]
                }
            },

            //导出
            doExport(){
                let _this = this
                exportUtils({
                    method:Service.SALES.methods.EXPORT_INTENTIAL_ORDER,
                    service:Service.SALES.name,
                    args: _this.args,
                    headers: '业主称呼,楼盘名称,区域,状态,跟进人,审核通过时间,最后操作时间',
                    sorts: "appellation,estateName,area,orderSubStatusName,auditor,auditPassedTimeStr,updateTimeStr"
                })
            },

            //全部
//            allList(){
//                this.args = {
//                    search: {
//                        id_gt: 0
//                    },
//                    bizSearchType:this.bizSearchType,
//                    sort: [
//                        "id_desc"  //根据id倒序排序
//                    ]
//                }
//            },
//
//            //未见面
//            toBeMet(){
//                this.args = {
//                    search: {
//                        id_gt: 0
//                    },
//                    bizSearchType:this.bizSearchType,
//                    sort: [
//                        "id_desc"  //根据id倒序排序
//                    ]
//                }
//            },
//
//            //已见面
//            haveMet(){
//                this.args = {
//                    search: {
//                        id_gt: 0
//                    },
//                    bizSearchType:this.bizSearchType,
//                    sort: [
//                        "id_desc"  //根据id倒序排序
//                    ]
//                }
//            },
//
//            //已交订
//            hasSignedUp(){
//                this.args = {
//                    search: {
//                        id_gt: 0
//                    },
//                    bizSearchType:this.bizSearchType,
//                    sort: [
//                        "id_desc"  //根据id倒序排序
//                    ]
//                }
//            },

            //判断是否为空
            isEmptyObject(obj){
                for(var key in obj){
                    return false;
                }
                return true;
            },

            //表格刷新
            getTableData() {
                this.$refs['t8tTable'].reloadTable();
            },
        }
    }

</script>
<style scoped>
    .t8t-table {
        height: 350px
    }
</style>
<style lang="css" scoped>

    .t8t-toolbar {
        padding: 13px;
        height: 24px;
    }

    .t8t-toolbar .el-button--toolbar:first-child {
        margin-left: 8px;
    }

    .t8t-toolbar .el-button--toolbar {
        padding: 5px 11px;
        font-size: 12px;
        border-radius: 2px;
        border-color: rgb(232, 237, 241);
        color: rgb(50, 139, 239);
        margin-right: 5px;
    }

    .t8t-toolbar .el-button--toolbar:focus {
        border-color: rgb(191, 201, 217)
    }

    .t8t-toolbar .el-button--toolbar:hover {
        border-color: rgb(50, 139, 239)
    }

    .t8t-toolbar .is-disabled {
        color: rgb(191, 203, 217);
        border-color: rgb(209, 219, 229);
    }

    .t8t-toolbar .is-disabled:hover {
        border-color: rgb(209, 219, 229);
    }

    .t8t-toolbar .el-button--success.is-plain {
        color: rgb(19, 206, 102)
    }

    .t8t-toolbar .el-button--danger.is-plain {
        color: rgb(255, 86, 97)
    }

    .t8t-toolbar .el-button + .el-button {
        margin-left: 0px;
    }
    /* 深色皮肤 */
    .t8t-toolbar.t8t-dark .el-button--toolbar{
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-toolbar.t8t-dark .el-button--toolbar:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }

</style>
<style>
    .page-intention-owner-list .intention-owner-a {
        text-decoration: none;
        color: #3396FB;
    }
</style>
