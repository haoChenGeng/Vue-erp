<template>
    <div>
        <t8t-search :fields="fields" :selectSource="selectSource" @submit="submitSearch">
        </t8t-search>
        <div class="g-main-container">
            <div class="g-main-container-column">
                <t8t-toolbar :symbolList="symbolList" ref="toolbar">
                </t8t-toolbar>
                <t8t-table :columns="columns" :service="service" :method="method" :args="args" :pageBar="true" :commonData="commonData" ref="t8tTable"
                    :preLoad=false :selectCol="false">
                </t8t-table>
            </div>
        </div>
        <!-- <add-plat-check v-if="addDialogVisible" :editType="editType" :title="dialogTitle" @close="closeAddDialog" @getTableData="getTableData">
        </add-plat-check> -->
        <!-- <op-dialog v-if="dialogVisible" :id="id" :rowId="rowId" :billCode="billCode" :editType="editType" :title="dialogTitle" @close="dialogVisible=false"
            @getTableData="getTableData">
        </op-dialog> -->
    </div>
</template>

<script>
    import AddPlatCheck from './add-plat-check.vue'
    import Service from 'src/services/delivery/Service.js'
    import Cookie from 'js-cookie'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import DateUtils from 'src/utils/DateUtils.js'
    export default {
        name: 'plat-check-list',
        components: {
            AddPlatCheck,//TODO 弹窗
            // OpDialog
        },
        data() {
            let that = this;
            return {
                symbolList: [''],
                //搜索表单项配置
                fields: [
                    { type: 'input', label: '项目ID:', name: 'sourceProjectId' },
                    { type: 'input', label: '业主姓名:', name: 'ownerName_like' },
                    {
                        type: 'popup',
                        label: '楼盘:',
                        name: 'estateId',
                        textValue: 'estateName',
                        filedValue: 'estateId',
                        //triggerOnFocus: false,
                        remote: true,
                        service: Service.PRSMDM.name,
                        method: Service.PRSMDM.methods.decorationOrderQueryOrderPage,
                        remoteArgs: {
                            fields: ["id", "sourceProjectId", "ownerId", "ownerName", "cityId", "townId", "estateId", "estateName"],
                            sort: ['cityId_desc', 'townId_desc', 'estateId_desc'],
                            page: 1, size: 20
                        },
                        remoteQueryKey: "estateName_like",
                        dialog: {
                            title: '楼盘搜索',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    { type: 'input', label: '楼盘名称', name: 'estateName_like' }
                                ]
                            },
                            table: {
                                service: Service.PRSMDM.name,
                                method: Service.PRSMDM.methods.decorationOrderQueryOrderPage,
                                args: { fields: ["id", "sourceProjectId", "ownerId", "ownerName", "estateId", "estateName"] },
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'sourceProjectId',
                                        label: '项目id',
                                    },
                                    {
                                        prop: 'ownerName',
                                        label: '业主姓名'
                                    },
                                    {
                                        prop: 'estateName',
                                        label: '楼盘名称'
                                    }
                                ]
                            }
                        }
                    },
                    { type: 'input', label: '验收单号:', name: 'billCode' },
                    { type: 'select', label: '验收类型:', name: 'checkTypeCode', selectSourceKey: 'checkTypeCodes', filterable: true },
                    {
                        type: 'popup',
                        label: '工长姓名:',
                        name: 'projectManagerId',
                        textValue: 'name',
                        filedValue: 'accountId',
                        // triggerOnFocus: false,
                        remote: true,
                        service: Service.YANSHOU.name,
                        method: Service.YANSHOU.methods.queryCorpMember,
                        remoteArgs: { sort: ['id_asc'], page: 1, size: 20 },
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
                                service: Service.YANSHOU.name,
                                method: Service.YANSHOU.methods.queryCorpMember,
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
                    // { type: 'date', pickertype: 'datetimerange', label: '申请验收时间:', startField: 'expectStartTime_gte', endField: 'expectCheckTime_lte', name: 'expectCheckTime', inputWidth: 330 },
                    // { type: 'date', pickertype: 'datetimerange', label: '实际验收时间:', startField: 'checkStartTime_gte', endField: 'checkTime_lte', name: 'checkTime', inputWidth: 330 },
                    { type: 'date', label: '申请验收时间自', name: 'expectStartTime_gte' },
                    { type: 'date', label: '申请验收时间至', name: 'expectCheckTime_lte' },
                    { type: 'select', label: '是否免检:', name: 'source', selectSourceKey: 'sources' },
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    checkTypeCodes: [],
                    sources: [
                        {
                            text: '是',
                            value: 4
                        },
                        {
                            text: '否',
                            value: 1
                        }
                    ]
                },
                columns:
                [
                    { "prop": "billCode", "label": "验收单号", "width": 150 },
                    { "prop": "sourceProjectId", "label": "项目ID", "width": 130 },
                    { "prop": "checkTypeName", "label": "验收类型", "width": 150 },
                    { "prop": "projectManagerName", "label": "工长姓名", "width": 130 },
                    { "prop": "ownerName", "label": "业主姓名", "width": 130 },
                    { "prop": "addressDetail", "label": "详细地址", "width": 400, align: "left" },
                    { "prop": "billStatus", "label": "验收状态", "list": "billStatuList", "width": 100 },
                    {
                        "prop": "expectCheckTime",
                        "label": "申请验收时间",
                        "formatter": function (val, row, col) {
                            return that.dateParser(row.expectStartTime) + ' - ' + that.dateParser(row.expectCheckTime);
                        },
                        width: '265px'
                    },
                    // {
                    //     "prop": "checkTime",
                    //     "label": "实际验收时间",
                    //     "formatter": function (val, row, col) {
                    //         return that.dateParser(row.checkStartTime) + ' - ' + that.dateParser(row.checkTime);
                    //     },
                    //     width: '265px'
                    // },
                    { "prop": "createTime", "label": "创建日期", "formatter": this.dateParser },
                    {
                        "prop": "source", "label": "备注", "formatter": function (val, row) { return row.source == 4 ? '免检' : '' }
                    }
                ],
                commonData: {
                    billStatuList: [
                        {
                            text: '待验收',
                            value: 1
                        },
                        {
                            text: '合格',
                            value: 2
                        },
                        {
                            text: '不合格',
                            value: 3
                        }]
                },
                service: Service.YANSHOU.name,
                method: Service.YANSHOU.methods.platCheckQueryPage,
                args: { sort: ['createTime_desc'], search: { checkTypeCode_ne: '8!821!82101!1001', billStatus_in: [0, 1], source_in: [1, 4] } },
                //editType: 'add',
                //addDialogVisible: false,
                selectedRows: null,
                filterData: {
                    checkTypeCode_ne: '8!821!82101!1001',
                    billStatus_in: [0, 1],
                    source_in: [1, 4],
                }
            }
        },
        created() {
            let list = [];
            commonApi.queryChildrenByWholeCode('8!821!82101')
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus === 1 && '8!821!82101!1001' != item.wholeCode) {
                                list.push({
                                    value: item.wholeCode,
                                    text: item.propertyName
                                })
                            }
                        });
                        this.selectSource.types = list;
                    }
                });
            this.selectSource.checkTypeCodes = list;
        },
        activated() {
            // if (this.$route.path == '/delivery/plat-check-list' && typeof this.$route.query.refresh !== 'undefined') {

            // }
            this.getTableData();
        },
        methods: {
            //搜素
            submitSearch(obj) {
                // let fields = this.args.fields;
                // this.args = {
                //     //search: Object.assign(obj,this.filterData), fields: fields
                //     search: obj, fields: fields
                // }

                this.args = { sort: ['createTime_desc'], search: Object.assign({}, this.filterData, obj) }
            },
            dateParser(text) {
                let dateString;
                let objDate = new Date(text * 1000);
                if (text === 0 || text === null) {
                    dateString = ""
                } else {
                    dateString = DateUtils(objDate, 'yyyy-mm-dd HH:MM:ss')
                }
                return dateString
            },
            // apply() {
            //     //集成点击流  TODO
            //     //this.$TCS.addTag('red_2928_010004001001');
            //     let selections = this.$refs['t8tTable'].getSelectRows();
            //     this.dialogTitle = '验收申请'
            //     this.editType = 'add'
            //     this.addDialogVisible = true

            // },
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
            //     this.addDialogVisible = false
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