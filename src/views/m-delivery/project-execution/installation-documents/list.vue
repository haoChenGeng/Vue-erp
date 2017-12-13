<template>
    <div class="t8t-list-view">
        <!-- 面包屑 -->
        <t8t-breadcrumb ref="list-breadcrumb"></t8t-breadcrumb>
        <!-- 搜索区域 -->
        <t8t-search ref="list-search" :fields="searchFields" :selectSource="tableCommonData" @submit="searchSubmit">
        </t8t-search>

        <!-- 内容区 -->
        <div class="g-main-container">

            <!-- 树 -->
            <t8t-tree ref="list-tree" :props="treeProps" :data="treeData" @node-click="onTreeNodeClick">

            </t8t-tree>

            <div class="g-main-container-column">
                <!-- 工具条 -->
                <t8t-toolbar ref="list-toolbar" @VIEW="doView" @EDIT-SUBMIT="doSubmit" @SUBMIT-AGAIN="submitAgain" @EXPORT="doExport" @ADD-COST="addCost">
                </t8t-toolbar>

                <!-- table -->
                <t8t-table ref="list-table" :columns="tableColumns" :service="tableService" :method="tableMethod" :args="tableArgs" :commonData="tableCommonData"
                    @row-double-click="tableRowDobuleClick">

                </t8t-table>
            </div>

        </div>
    </div>
</template>
<script>
    import { Service, methods } from 'src/services/delivery/installation-schedule/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import exportUtils from 'src/utils/export.js'
    export default {
        name: "installation-documents-list",
        data() {
            return {
                searchFields: [
                    { type: "input", label: "安装单号", name: 'installBillCode_like' },
                    { type: "input", label: "项目ID", name: 'projectId' },
                    { type: "input", label: "安装人员", name: 'installPeopleName_like' },
                    { type: "select", label: "单据状态", name: 'installStatus', selectSourceKey: 'installStatus' },
                    { type: "datetime", label: "预计安装时间自", name: 'expectInstallStartTime_gte' },
                    { type: "datetime", label: "预计安装时间至", name: 'expectInstallStartTime_lte' },
                    { type: "select", label: "安装类型", name: 'installType', selectSourceKey: 'installType' },
                    { type: "datetime", label: "实际安装时间自", name: 'actualInstallStartTime_gte' },
                    { type: "datetime", label: "实际安装时间至", name: 'actualInstallStartTime_lte' },
                    { type: "input", label: "工长姓名", name: 'chiefWorkerName' }
                ],
                tableColumns: [
                    { prop: 'installBillCode', label: '安装单号' },
                    { prop: 'projectId', label: '项目ID' },
                    { prop: 'installPeopleTypeName', label: '安装人类型' },
                    { prop: 'installPeopleName', label: '安装人员' },
                    { prop: 'chiefWorkerName', label: '工长姓名' },
                    { prop: 'detailedAddress', label: '详细地址' },
                    { prop: 'installTypeName', label: '安装类型' },
                    { prop: 'installStatus', label: '单据状态', list: 'installStatus' },
                    { prop: 'createName', label: '创建人' },
                    { prop: 'createTime', label: '创建日期', "formatter": "dateParser" }
                ],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                treeData: [],
                tableArgs: { 'sort': ['createTime_desc'] },
                tableCommonData: {
                    installType: [],
                    installStatus: [
                        { text: '待安装', value: 0 },
                        { text: '未完成', value: 1 },
                        { text: '已完成', value: 2 },
                    ]
                },
                tableService: Service.INSTALLATION.name,
                tableMethod: Service.INSTALLATION.methods.queryInstallBillByPage,
                fullscreenLoading: false,
            }
        },
        created() {
            this.getTree()
            this.getInstallType('42601')
        },
        // watch:{
        //     "$route.path":function(val, oldVal){
        //         if(oldVal.endsWith('edit')){
        //             this.$refs["list-table"].reloadTable();
        //         }
        //     }
        // },
        activated() {
            this.$refs["list-table"].reloadTable();
        },
        methods: {
            getTree() {
                let _self = this
                methods.queryTreeByType({ typeCodes: ['001003010'] }).then((res) => {
                    if (res.data.status === 200) {
                        _self.treeData = [res.data.result];
                    }
                })
            },
            getInstallType: function (fatherCode) {
                let arg = {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.propertyCode,
                                        text: item.propertyName
                                    })
                                }
                            });
                            this.tableCommonData.installType = list;
                        }
                    })
            },
            tableRowDobuleClick(row) {
                this.$router.push({ path: "/delivery/installation-ducuments-view", query: { id: row['id'] } })
            },
            onTreeNodeClick(data) {
                let ids = this.getTreeChildrenId(data)
                let search = this.tableArgs.search || {}
                search.organizationId_in = ids
                this.tableArgs.search = search
                this.tableArgs = Object.assign({}, this.tableArgs)
            },
            getTreeChildrenId(data) {
                if (data.children) {
                    return data.children.reduce((acc, item) => acc.concat(this.getTreeChildrenId(item)), [])
                } else {
                    return [data.id]
                }
            },
            searchSubmit(obj) {
                let search = this.tableArgs.search || {}
                search = Object.assign(search, obj)
                this.tableArgs.search = search
                this.tableArgs = Object.assign({}, this.tableArgs)
            },
            doView() {
                let rows = this.$refs['list-table'].getSelectRows()
                if (rows.length < 1) {
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if (rows.length > 1) {
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = rows[0]
                this.$router.push({ path: "/delivery/installation-ducuments-view", query: { id: row['id'] } })
            },
            doSubmit() {
                let rows = this.$refs['list-table'].getSelectRows()
                if (rows.length < 1) {
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if (rows.length > 1) {
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = rows[0]
                if (row.installStatus > 0) {
                    this.$message.error('非待安装项不能进行提交')
                    return
                }
                this.$router.push({ path: "/delivery/installation-ducuments-edit", query: { id: row['id'] } })
            },
            submitAgain() {
                this.$TCS.addTag('red_12527_010006012004') //点击流
                let rows = this.$refs['list-table'].getSelectRows()
                if (rows.length < 1) {
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if (rows.length > 1) {
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = rows[0]
                if (row.installStatus === 0) {
                    this.$message.error('该安装单还未提交！')
                    return
                }
                else {
                    let args = { "id": row.id };
                    methods.checkSubmitAgain(args).then((res) => {
                        if (res.data.status == 200) {
                            if (res.data.result) {
                                this.$router.push({ path: "/delivery/installation-ducuments-edit", query: { id: row['id'] } })
                            } else {
                                this.$message.error('只有已完成或异常结束的安装调度才能再次提交安装单')
                            }
                        } else {
                            this.$message.error('验证是否可再次提交安装单失败')
                        }
                    }).catch(() => {
                        this.$message.error('验证是否可再次提交安装单异常')
                    })
                }
            },
            doExport() {
                this.fullscreenLoading = true;
                let args = {
                    "page": 1,
                    "size": 1000
                };
                let formData = this.tableArgs.search;
                args.search = formData;
                exportUtils({
                    service: Service.INSTALLATION.name,
                    method: Service.INSTALLATION.methods.exportInstallBill,
                    args: args,
                    headers: 'ID,安装单号,安装类型,业务类型,安装人类型,安装人,安装状态,产品包名称,安装调度ID,排期节点ID,SKUID,商品名称,预计安装数量,实际安装数量,项目ID,行状态,工地市,工地区域,详细地址,工长姓名,工长电话,调度开始时间,调度结束时间,实际开始时间,实际结束时间,创建人,创建时间,提交人,提交时间',
                    sorts: 'id,installBillCode,installTypeName,bizeTypeName,installPeopleTypeName,installPeopleName,installStatusName,productPkgName,installPlanId,scheduleId,skuId,goodsName,expectInstallNum,actualInstallNum,projectId,installItemStatusName,standardCity,standardTown,address,chiefWorkerName,phone,expectInstallStartTime,expectInstallEndTime,actualInstallStartTime,actualInstallEndTime,createUserName,createTime,updateUserName,updateTime',
                    title: "安装单数据"
                })
                setTimeout(() => {
                    this.fullscreenLoading = false;
                }, 1000);
            },
            addCost() {
                let rows = this.$refs['list-table'].getSelectRows()
                if (rows.length < 1) {
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if (rows.length > 1) {
                    this.$message.error('只能选择一行进行操作')
                    return
                }
                let row = rows[0]
                this.$router.push({ path: "/delivery/installation-ducuments-cost", query: { id: row['id'] } })
            }

        }
    }

</script>