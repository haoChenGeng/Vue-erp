<template>
    <div>
        <t8t-search :fields="fields" :selectSource="selectSource" @submit="submitSearch">
        </t8t-search>
        <div class="g-main-container">
            <div class="g-main-container-column">
                <t8t-toolbar :symbolList="symbolList" @CONFIRM="confirm" ref="toolbar">
                </t8t-toolbar>
                <t8t-table :radioCol=true :columns="columns" :service="service" :method="method" :args="args" :pageBar="true" :commonData="commonData"
                    ref="t8tTable" @current-row-change="selectionChange" @data-loaded="dataLoaded">
                </t8t-table>
            </div>
        </div>
        <add-start-bill v-if="addDialogVisible" :projectId="projectId" :editType="editType" :title="dialogTitle" @close="addDialogVisible=false"
            @getTableData="getTableData">
        </add-start-bill>
        <!-- <op-dialog v-if="dialogVisible" :id="id" :rowId="rowId" :billCode="billCode" :editType="editType" :title="dialogTitle" @close="dialogVisible=false"
            @getTableData="getTableData">
        </op-dialog> -->
    </div>
</template>

<script>
    import AddStartBill from './add-start-bill.vue'
    import Service from 'src/services/delivery/Service.js'
    import Cookie from 'js-cookie'
    //import commonApi from 'src/services/commonApi/commonApi.js'
    import DateUtils from 'src/utils/DateUtils.js'
    export default {
        name: 'confirm-list',
        components: {
            AddStartBill,//TODO 弹窗
            // OpDialog
        },
        data() {
            let that = this;
            return {
                symbolList: ['CONFIRM'],
                //搜索表单项配置
                fields: [
                    { type: 'input', label: '项目ID:', name: 'sourceProjectId' },
                    { type: 'input', label: '业主姓名:', name: 'ownerName_like' },
                    { type: 'input', label: '楼盘:', name: 'estateName_like' },
                    {
                        type: 'popup',
                        label: '工长姓名:',
                        name: 'projectManagerId',
                        textValue: 'name',
                        filedValue: 'accountId',
                        triggerOnFocus: false,
                        remote: true,
                        service: Service.ORGANIZATION.name,
                        method: Service.ORGANIZATION.methods.queryCorpMember,
                        remoteArgs: {sort: ['id_asc'], page: 1, size: 20 },
                        remoteQueryKey: "name_like",
                        dialog: {
                            title: '工长搜索',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    { type: 'input', label: '工长姓名', name: 'name_like' }
                                ]
                            },
                            table: {
                                service: Service.ORGANIZATION.name,
                                method: Service.ORGANIZATION.methods.queryCorpMember,
                                args: {},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'accountId',
                                        label: 'ID',
                                    },
                                    {
                                        prop: 'name',
                                        label: '工长姓名'
                                    },
                                    {
                                        prop: 'nickname',
                                        label: '昵称'
                                    }
                                ]
                            }
                        }
                    },
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {

                },
                columns:
                [
                    //{"prop": "projectId", "label": "ID",disabled},
                    { "prop": "sourceProjectId", "label": "项目ID", "width": 200 },
                    { "prop": "ownerName", "label": "业主姓名", "width": 250 },
                    {
                        "prop": "address", "label": "详细地址", "formatter": function (val, row, col, table) {
                            return row.decorationOrderVO.cityName + row.decorationOrderVO.standardTownName + row.decorationOrderVO.estateName + row.decorationOrderHouseVO.houseAddress
                        },
                        "width": 500, align: "left"
                    },
                    { "prop": "projectManagerName", "label": "工长姓名" },
                    { "prop": "orderSubStatusName", "label": "项目状态" }
                ],
                commonData: {

                },
                service: Service.PRSMDM.name,
                method: Service.PRSMDM.methods.decorationOrderQueryDetailPage,
                args: {
                    fields: ["id", "sourceProjectId", "ownerId", "ownerName", "projectManagerId", "projectManagerName", "orderMainStatus", "orderSubStatus", "houseAddress", "cityId", "cityName", "townId", "townName", "estateId", "estateName"],
                    search: { orderSubStatus: '8100602' },
                    sort: ['cityId_desc','townId_desc','estateId_desc'],
                },
                //TODO 过滤项目状态为"已签约" 8!810!81006!8100602
                filterData: {
                    orderSubStatus: '8100602'
                },
                editType: 'add',
                addDialogVisible: false,
                rowId: null,
                selectedRows: null,
            }
        },
        created() {

        },
        activated() {
            if (this.$route.path == '/delivery/confirm-list' && typeof this.$route.query.refresh !== 'undefined') {
                this.getTableData();
            }
        },
        methods: {
            dataLoaded(dataSource) {
                dataSource.forEach((item, index) => {
                    item.decorationOrderVO = item.decorationOrderVO || {};
                    //dataSource[index].projectId = item.decorationOrderVO.id;
                    dataSource[index].sourceProjectId = item.decorationOrderVO.sourceProjectId;
                    dataSource[index].ownerName = item.decorationOrderVO.ownerName;
                    dataSource[index].projectManagerName = item.decorationOrderVO.projectManagerName;
                    dataSource[index].orderSubStatusName = item.decorationOrderVO.orderSubStatusName;

                })
            },
            //搜素
            submitSearch(obj) {
                let fields = this.args.fields;
                this.args = {
                    search: Object.assign(obj, this.filterData), fields: fields
                    //search: obj, fields: fields
                }
            },
            confirm() {
                //集成点击流  TODO
                //this.$TCS.addTag('red_2928_010004001001');
                let selections = this.$refs['t8tTable'].getSelectRows();

                if (this.selectedRows === null) {
                    this.$message.error('请选择要操作的行！')
                } else {
                    this.dialogTitle = '开工确认'
                    this.editType = 'add'
                    this.addDialogVisible = true
                    this.projectId = this.selectedRows.decorationOrderVO.id
                }
            },
            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },
            //行变化事件
            selectionChange(curRow, oldRow) {
                //已选择行
                this.selectedRows = curRow;
                //启用禁用按钮交互

            },
            // closeAddDialog() {
            //     this.addDialogVisible = false;
            //    // this.selectedRows = null;

            // }
        }
    }

</script>

<style lang="css">
    .safsadacfa_node-dialog .table-container {
        height: 350px;
    }

    .safsadacfa_node-dialog .el-dialog__body {
        height: 410px;
        display: flex;
    }

    .safsadacfa_node-dialog .el-dialog {
        width: 800px;
    }
</style>