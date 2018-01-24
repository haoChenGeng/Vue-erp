<template>
    <div>
        <t8t-search :fields="fields" :selectSource="selectSource" @submit="submitSearch">
        </t8t-search>

        <div class="g-main-container">
            <div class="g-main-container-column">
                <t8t-toolbar :symbolList="symbolList" ref="toolbar">
                </t8t-toolbar>
                <t8t-table :columns="columns" :service="service" :method="method" :args="args" :pageBar="true" :commonData="commonData" :selectCol=false
                    ref="t8tTable">
                </t8t-table>
            </div>
        </div>
    </div>
</template>

<script>
    import Service from 'src/services/delivery/Service.js'
    //import Cookie from 'js-cookie'
    //import commonApi from 'src/services/commonApi/commonApi.js'
    import DateUtils from 'src/utils/DateUtils.js'
    export default {
        name: 'confirm-list',
        components: {

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
                    {
                        type: 'popup',
                        label: '工长姓名:',
                        name: 'projectManagerId',
                        textValue: 'name',
                        filedValue: 'accountId',
                        //triggerOnFocus: false,
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
                    { type: 'date', label: '开工时间自', name: 'checkTime_gte' },
                    { type: 'date', label: '开工时间至', name: 'checkTime_lte' },
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {

                },
                columns:
                [
                    { "prop": "sourceProjectId", "label": "项目ID", "width": 150 },
                    { "prop": "projectManagerName", "label": "工长姓名", "width": 200 },
                    { "prop": "ownerName", "label": "业主姓名", "width": 200 },
                    { "prop": "addressDetail", "label": "详细地址", "width": 450, align: "left" },
                    { "prop": "orderSubStatusName", "label": "项目状态", "width": 200 },
                    { "prop": "realSignedTime", "label": "签约时间", "formatter": "dateParserDate" },
                    { "prop": "checkTime", "label": "开工时间", "formatter": "dateParserDate" },
                    { "prop": "createTime", "label": "创建时间", "formatter": "dateParser" },
                ],
                commonData: {

                },
                service: Service.YANSHOU.name,
                method: Service.YANSHOU.methods.platCheckQueryPage,
                args: { sort: ['createTime_desc'], search: { checkTypeCode: '8!821!82101!1001', source: 3 } },
                filterData: {
                    checkTypeCode: '8!821!82101!1001',
                    source: 3
                }
            }
        },
        created() {

        },
        methods: {
            //搜素
            submitSearch(obj) {
                // let fields = this.args.fields;
                // this.args = {
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
            dateParserDate(text) {
                let dateString;
                let objDate = new Date(text * 1000);
                if (text === 0 || text === null) {
                    dateString = ""
                } else {
                    dateString = DateUtils(objDate, 'yyyy-mm-dd')
                }
                return dateString
            }
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