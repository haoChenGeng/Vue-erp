<template>
    <div class="page-potential-owner-list">
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
        <!--<t8t-table :radioCol="true"-->
        <!--fit="false"-->
        <!--:dataSource="ownerList"-->
        <!--:columns="columns"-->
        <!--:customColumn="true"-->
        <!--ref="ownerTable"-->
        <!--@current-row-change="handleCurrentRowChange"-->
        <!--@row-click="handleRowClick"-->
        <!--@row-double-click="viewClick"-->
        <!--&gt;-->
        <!--</t8t-table>-->

        <import-dialog
            v-if="dialogFormVisible"
            @close="importClose"
            @success="updateSuccess"
            :flowUserList="this.selectSource.flowUserList"
        >
        </import-dialog>
        <add-dialog
            v-if="createOwnerVisible"
            @close="addClose"
            @success="updateSuccess"
            :flowUserList="this.selectSource.flowUserList"
        >
        </add-dialog>
        <el-dialog title="分配跟进人" @close="closeAssignDialog" v-if="assignDialogVisible" size="large"
                   v-model="assignDialogVisible">
            <t8t-table
                :radioCol="true"
                :columns="followUpColumn"
                :service="assignService"
                :method="assignMethod"
                ref="assignTable"
                @row-click="handleAssignRowClick"
            ></t8t-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveFollowUp">保 存</el-button>
                <el-button @click="closeAssignDialog">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加跟进" @close="closeFollowDialog" v-if="addFollowDialogVisible" size="small"
                   v-model="addFollowDialogVisible" >
            <el-form :label-position="labelPosition"   :label-width="formLabelWidth" :model="formData" :rules="rules" ref="formData"  @keyup.enter.native="submitFollowUp()">
                <el-form-item label="跟进状态" prop="revisitType">
                    <el-select v-model="formData.revisitType" placeholder="--请选择--" style="width:250px;">
                        <el-option v-for="item in selectSource.revisitStatusList" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="情况记录" prop="remark">
                    <el-input type="textarea" style="width: 250px" v-model="formData.remark" :title="remark"  :autosize="{ minRows: 4, maxRows: 15}">
                    </el-input>
                </el-form-item>
                <el-form-item label="下次跟进时间" prop="revisitTime">
                    <!--<el-col :span="11">-->
                        <!--<el-date-picker type="date" placeholder="请选择日期" v-model="formData.getSelectDate" style="width: 100%;" :picker-options="pickerOptions0">-->
                        <!--</el-date-picker>-->
                    <!--</el-col>-->
                    <!--<el-col class="line" :span="2">-</el-col>-->
                    <!--<el-col :span="11">-->
                        <!--&lt;!&ndash; 设置时间返回为得到当前的时间(new Date()).toTimeString().substring(0,8) &ndash;&gt;-->
                        <!--<el-time-picker type="fixed-time" placeholder="请选择时间" v-model="formData.getSelectTime" style="width: 100%;" :picker-options="{-->
                                 <!--selectableRange: (new Date()).toTimeString().substring(0,8)+' - 23:59:59'}"></el-time-picker>-->
                    <!--</el-col>-->
                    <el-date-picker v-model="formData.revisitTime" style="width:250px;" type="datetime" placeholder="请选择日期时间" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFollowUp">提交</el-button>
                <el-button @click="closeFollowDialog">取消</el-button>
            </div>
        </el-dialog>

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
            AddDialog,
            ImportDialog
        },
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '100px',
                buttons: [],
                symbolListTop: [
                    'ALL-LIST',
                    'MY-LIST',
                    'PURPOSE-LIST'
                ],
                symbolListDown: [
                    'ADD-FOLLOW',
                    'ASSIGN-PEOPLE',
                    'ADD',
                    'IMPORT',
                    'EXPORT'
                ],
                symbolListDownClick: {
                    'ADD-FOLLOW': "addFollow",
                    'ADD': "addPeople",
                    'IMPORT': "importPeople",
                    'ALL-LIST': "allList",
                    'MY-LIST': "myList",
                    'PURPOSE-LIST': "purposeList",
                    'ASSIGN-PEOPLE': "assignPeople",
                    'EXPORT': "doExport",
                },
                symbolClickCode: {
                    'ADD-FOLLOW': "015002001009",
                    'ADD': "015002001002",
                    'IMPORT': "015002001003",
                    'ASSIGN-PEOPLE': "015002001001",
                    'EXPORT': "015002001008",

                },
                assignService: Service.SALES.name,
                assignMethod: Service.SALES.methods.LISTACCOUNTBYROLECODE,
                service: Service.SALES.name,
                method: Service.SALES.methods.QUERY_POTENTTIAL_ORDER_BY_PAGE,
                args: {
                    search: {
                        // auditId_eq:Cookie.get('t8t-tc-uid'),
                        id_gt: 0
                    },
                    sort: [
                        "id_desc"
                    ]
                },
                selectSource: {
                    flowUserList: [],
                    statusList: [],
                    revisitStatusList: []
                },
                createOwnerVisible: false,
                assignDialogVisible: false,
                addFollowDialogVisible:false,
                activeName: 'MY-LIST',
                searchCache: {
                    "id_eq": null,
                    "phone_eq": null,
                    "estateName_like": null,
                    "cityId": null,
                    "townId": null,
                    "stage": null,
                    "auditId_eq": null,
                    "createTime_gte": null,
                    "createTime_lte": null,
                    "updateTime_gte": null,
                    "updateTime_lte": null
                },
                fields: [
                    {type: 'input', label: '电话', name: 'phone_eq'},
                    {type: 'input', label: '楼盘名称', name: 'estateName_like'},
                    {
                        type: "oldarea",
                        label: "城市",
                        name: "city",
                        subNames: ["provinceId_eq", "cityId_eq", "townId_eq"],
                        clearable: true
                    },
                    {type: 'input', label: '项目ID', name: 'id_eq'},
                    {type: 'select', label: '状态', name: 'orderSubStatus', selectSourceKey: 'statusList'},
                    {type: 'select', label: '跟进人', name: 'auditId_eq', selectSourceKey: 'flowUserList',},
                    {
                        type: 'datetime', label: '创建时间', name: 'createTime', pickertype: 'daterange',
                        startField: 'createTime_gte',
                        endField: 'createTime_lte',
                        inputWidth:'200'
                    },
                    {
                        type: 'datetime', label: '最后操作时间', name: 'checkTime', pickertype: 'daterange',
                        startField: 'updateTime_gte',
                        endField: 'updateTime_lte',
                        inputWidth:'200'
                    },

                ],
                breadcrumbData: [
                    {title: '销售管理'},
                    {title: '潜在业主管理'}
                ],
                followUpColumn: [
                    {
                        prop: "accountId",
                        label: "账号id",
                        show: false
                    },
                    {
                        prop: "name",
                        label: "姓名",
                        show: true,
                        formatter: function (val, row, col, tab) {
                            return row.nickname + "/" + row.name;
                        }
                    },
                    {
                        prop: "jobNumber",
                        label: "工号",
                        show: true
                    }
                ],
                columns: [
                    {
                        prop: "appellation",
                        label: "业主称呼",
                        show: true,
                        formatter: function (val, row) {
                            if (val != undefined) {
                                return '<a href="#/sale-manage/page-potential-owner-list/view?id=' + row.id + '" class="potential-owner-a">' + val + '</a>'
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
                        prop: "orderSubStatusName",
                        label: "状态",
                        show: true
                    },
                    {
                        prop: "auditor",
                        label: "跟进人",
                        show: true
                    },
                    {
                        prop: "createTime",
                        label: "创建时间",
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
                formData: {
                    remark:'',
                    revisitType: '',
                    revisitTime:'',
                },
                curRow: {},
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    },
                },
                rules: {
                    revisitType:[
                        {
                            required: true,
                            message: '请选择跟进类型',
                        },
                    ],
                    remark:[
                        {
                            required: true,
                            message: '请填写记录情况',
                        },
                    ]
                }
            }
        },
        created () {
            this.getCommonOptions([10901], 'statusList');//状态（潜在业主）
            this.getCommonOptions([33101], 'revisitStatusList');//状态（潜在业主）
            this.getFollowUser();//跟进人
            this.reload() //获取按钮权限
        },
//        watch: {
//            $route: 'reload'
//        },
//        watch: {
//            // 如果路由有变化，会再次执行该方法
//            '$route': 'routeReload'
//        },
        activated() {
            this.routeReload()
        },
        methods: {
            reload () {
                let _this = this
                Perm.buttons('#' + this.$route.path)
                    .then((res) => {
                        _this.buttons = res.data.result
                    })
            },
            //路由改变时更新
            routeReload(){
                this.reload();
                this.getTableData();
            },
            //获取跟进人
            getFollowUser: function () {
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
                    } else {
                        this.$message.error("数据获取失败，请重新刷新页面");
                    }
                })
            },
            //辅助资料
            getCommonOptions: function (fatherCode, selectName) {
                let arg = {
                    page: 1,
                    search: {
                        pPropertyCodes: fatherCode
                    },
                    size: 100
                }
                let list = []
                let _this = this
                apiCommon.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.propertyCode,
                                        text: item.propertyName
                                    })
                                }
                                ;
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

            handleClick(event, sourceEvent) {
                this.$TCS.addTag('erp_scm_' + this.symbolClickCode[event]);
                this.$refs['t8tSearch'].resetForm();
                let method = this.symbolListDownClick[event];
                this[method]()
            },

            handleClickTabs(event) {
                this.handleClick(event.name)
            },

            //查看
            viewClick() {
                this.$router.push({path: '/tochat-sale-manage/page-potential-owner-list/view', query: {id: this.curRow.id}})
            },
            //搜索提交
            submitSearch(obj) {
                if(this.activeName == 'PURPOSE-LIST'){
                    this.method = Service.SALES.methods.QUERY_INTENTIAL_ORDER_BY_PAGE;
                }else{
                    this.method = Service.SALES.methods.QUERY_POTENTTIAL_ORDER_BY_PAGE;
                }
                this.searchCache = this.isEmptyObject(obj) ? this.searchCache : obj;
//                this.method = this.activeName == 'PURPOSE-LIST' ?
//                    Service.SALES.methods.QUERY_INTENTIAL_ORDER_BY_PAGE:Service.SALES.methods.QUERY_POTENTTIAL_ORDER_BY_PAGE;
                //默认是自己
                // this.searchCache.auditId_eq = this.searchCache.auditId_eq == null && this.activeName != 'ALL-LIST' ? Cookie.get('t8t-tc-uid') : this.searchCache.auditId_eq;
                if (obj.provinceId_eq != undefined) {
                    this.searchCache.provinceId_eq = parseInt(obj.provinceId_eq);
                }
                if (obj.cityId_eq != undefined) {
                    this.searchCache.cityId_eq = parseInt(obj.cityId_eq);
                }
                if (obj.townId_eq != undefined) {
                    this.searchCache.townId_eq = parseInt(obj.townId_eq);
                }
                if(obj.createTime_lte != undefined) {
                    //把创建时间的结束日期变为当天的23::59:59秒
                    obj.createTime_lte = obj.createTime_lte + 24*3600 - 1
                }
                if(obj.updateTime_lte != undefined) {
                    //把最后更新时间的结束日期变为当天的23::59:59秒
                    obj.updateTime_lte = obj.updateTime_lte + 24*3600 - 1
                }
                this.searchCache.orderSubStatus_eq = this.searchCache.orderSubStatus;
                delete this.searchCache.orderSubStatus
                this.args = {
                    bizSearchType:"TYPE_ALL", //我的意向业主需要这个参数，是代表全部状态的意向
                    search: this.searchCache,
                    sort: [
                        "id_desc"  //根据id倒序排序
                    ]
                }
            },
            isEmptyObject(obj){
                for (var key in obj) {
                    return false;
                }
                return true;
            },
            //分配跟进人
            assignPeople() {
                if(this.activeName == 'PURPOSE-LIST') {
                    this.$message.error("意向业主已分配跟进人");
                    return false;
                }
                if (this.curRow.id == undefined) {
                    this.$message.error("请选择一行数据后再操作");
                    return false;
                }
                this.assignDialogVisible = true;
            },
            //添加跟进
            addFollow() {
                if (this.curRow==null || this.curRow.id == undefined) {
                    this.$message.error("请选择一行数据后再操作");
                    return false;
                }
                this.addFollowDialogVisible = true;
            },
            //打开新建弹窗
            addPeople () {
                this.createOwnerVisible = true
            },
            //关闭新建弹窗
            addClose(){
                this.createOwnerVisible = false;
            },
            //批量创建业主
            importPeople(){
                this.dialogFormVisible = true;
            },
            //关闭导入窗口
            importClose(){
                this.dialogFormVisible = false;
            },
            //新建导入更新完成以后
            updateSuccess(){
                this.getTableData();
            },
            //表格刷新
            getTableData() {
                this.$refs['t8tTable'].reloadTable();
            },
            //取消跟进人的弹窗
            closeAssignDialog () {
                this.assignDialogVisible = false
            },
            //取消添加跟进的弹窗
            closeFollowDialog () {
                this.addFollowDialogVisible = false
                this.formData.revisitTime='',
                this.formData.remark='',
                this.formData.revisitType=''
            },

            //全部
            allList(){
                this.getCommonOptions([10901], 'statusList');//状态（潜在业主）
                this.method = Service.SALES.methods.QUERY_POTENTTIAL_ORDER_BY_PAGE,
                    this.args = {
                        search: {
                            id_gt: 0
                        },
                        sort: [
                            "id_desc"  //根据id倒序排序
                        ]
                    }
            },

            //我的
            myList(){
                this.getCommonOptions([10901], 'statusList');//状态（潜在业主）
                this.method = Service.SALES.methods.QUERY_POTENTTIAL_ORDER_BY_PAGE,
                this.args = {
                    search: {
                        // auditId_eq: Cookie.get('t8t-tc-uid'),
                        id_gt: 0
                    },
                    sort: [
                        "id_desc"  //根据id倒序排序
                    ]
                }
            },

            //我的意向
            purposeList(){
                this.getCommonOptions([10902,10903,10904], 'statusList');//状态（意向业主）
                this.method = Service.SALES.methods.QUERY_INTENTIAL_ORDER_BY_PAGE,
                this.args = {
                    bizSearchType:"TYPE_ALL",
                    search: {
                        // auditId_eq: Cookie.get('t8t-tc-uid'),
                        id_gt: 0
                    },
                    sort: [
                        "id_desc"  //根据id倒序排序
                    ]
                }
            },

            handleAssignRowClick (row, event, column) {
                this.assignAccountId = row.accountId;
            },

            //分配跟进人 保存按钮
            saveFollowUp () {
                if (this.assignAccountId <= 1) {
                    this.$message.error("请选择跟进人后再操作")
                    return false;
                }
                else {
                    let arg = {
                        assignAuditStaff: {
                            createId: Cookie.get('t8t-tc-uid'),
                            orderId: this.curRow.id,
                            auditId: this.assignAccountId
                        }
                    }
                    decorationOrderAPI.assignAuditStaff(arg).then((res) => {
                        if (res.data.status === 200) {
                            this.assignDialogVisible = false
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '操作成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.getTableData()
                        }
                        else {
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: res.data.message,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        }
                    })
                }
            },
            //添加跟进提交按钮
            submitFollowUp () {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                       // let getTimes=(new Date(this.formData.getSelectTime).getHours()*3600+new Date(this.formData.getSelectTime).getMinutes()*60+new Date(this.formData.getSelectTime).getSeconds())*1000;
                        let arg = {
                            revisitRecord: {
                                userId: Cookie.get('t8t-tc-uid'),
                                projectId: this.curRow.id,
                                revisitTypeCode: this.formData.revisitType,
                                remark: this.formData.remark,
                                revisitTime:this.formData.revisitTime,
                            }
                        }

                        decorationOrderAPI.addRevisited(arg).then((res) => {
                            if (res.data.status === 200) {
                                this.assignDialogVisible = false
                                this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '操作成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.getTableData()
                            }
                            else {
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                            this.closeFollowDialog();
                        })
                    } else {
                        this.$message.error("校验不通过，请按照要求填写信息");
                        return false;
                    }
                });
            },

            //导出
            doExport(){
                let _this = this
                let _method = this.activeName == 'PURPOSE-LIST' ?
                    Service.SALES.methods.EXPORT_INTENTIAL_ORDER:Service.SALES.methods.EXPORT_POTENTIAL_ORDER;
                exportUtils({
                    method:_method,
                    service:Service.SALES.name,
                    args: _this.args,
                    headers: '业主称呼,楼盘名称,区域,阶段,跟进人,创建时间,最后操作时间',
                    sorts: "appellation,estateName,area,orderSubStatusName,auditor,createTimeStr,updateTimeStr"
                })
            },
        }
    };

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
    .line{
        text-align: center;
    }

</style>
<style>
    .page-potential-owner-list .potential-owner-a {
        text-decoration: none;
        color: #3396FB;
    }
</style>
