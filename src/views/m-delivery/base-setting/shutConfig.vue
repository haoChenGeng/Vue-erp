<script src="../../../services/delivery/pcm.js"></script>
<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            :showToggleBtn="false"
            @submit="submitSearch"
        >
        </t8t-search>

        <div class="g-main-container">

            <div class="t8t-table">
                <t8t-toolbar
                    @ADD="add"
                    @EDIT="edit"
                    @DELETE="del"
                    @SAVE="save"
                    ref="toolbar"
                >
                </t8t-toolbar>
                <t8t-table
                    :columns="columns"
                    :service="service"
                    :method="method"
                    :args="args"
                    :pageBar="true"
                    :commonData="selectSource"
                    :editable="true"
                    ref="shutConfigTable"
                    @selection-change="selectionChange"
                >
                    <template slot="id" scope="scope">
                        <a href="javascript:;" @click="showDetail(scope.row['id'], scope.row['name'])">{{scope.row['id']}}</a>
                    </template>
                </t8t-table>
            </div>
        </div>
        <edit-template
            v-if="dialogVisible"
            :rowId="rowId"
            :editType="editType"
            :title="dialogTitle"
            @close="dialogVisible=false"
            @getTableData="getTableData">
        </edit-template>
    </div>
</template>

<script>
    // import T8tBreadcrumb from 'src/components/t8t-breadcrumb/t8t-breadcrumb.vue'
    // import T8tSearch from 'src/components/t8t-search/t8t-search.vue'
    // import T8tToolbar from 'src/components/t8t-toolbar/t8t-toolbar.vue'

    // import T8tTable from 'src/components/t8t-table/t8t-table.vue'
    import EditTemplate from '../schedule-template/edit-template.vue'
    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/pcm.js'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'kevin-ye',
        components: {
            // T8tBreadcrumb,
            // T8tSearch,
            // T8tToolbar,
            // T8tTable,
            EditTemplate
        },
        data () {
            return {
                breadcrumbData: [{title: '交付管理'}, {title: '交付基础配置'}, {title: '停工校验配置'}],

                //搜索表单项配置
                fields: [
                    {type: 'select', label: '业务类型', name: 'bizType', selectSourceKey: 'bizTypeList', filterable: true},
                    {
                        type: 'select',
                        label: '单据类型',
                        name: 'billType',
                        selectSourceKey: 'billTypeList',
                        filterable: true
                    },
                    {
                        type: 'select',
                        label: '状态',
                        name: 'configStatus',
                        selectSourceKey: 'configStatusList',
                        filterable: true
                    }
                ],
                columns: [
                    {"prop": "id", "label": "ID"},
                    {
                        "prop": "bizType", "label": "业务类型", "list": "bizTypeList",
                        "editor": {
                            "type": "select",
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "billType", "label": "单据类型", "list": "billTypeList",
                        "editor": {
                            "type": "select",
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "actionType", "label": "操作", "list": "actionTypeList",
                        "editor": {
                            "type": "select",
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "configStatus", "label": "状态", "list": "configStatusList",
                        "editor": {
                            "type": "select",
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }
                    },
                    {
                        "prop": "effectTime", "label": "生效日期", "formatter": "dateParser",
                        "editor": {
                            "type": "datetime",
                            "endFormater": 'timestamp',
                            "rules": [{
                                "required": true,
                                "message": "不能为空"
                            }]
                        }
                    },
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    bizTypeList: [], //业务类型list
                    billTypeList: [], //单据类型list
                    actionTypeList:[], //按钮操作类型list
                    configStatusList: [
                        {
                            text: '启用',
                            value: 0
                        },
                        {
                            text: '禁用',
                            value: 1
                        }
                    ]
                },
                service: Service.PSCONFIG.name,
                method: Service.PSCONFIG.methods.shutConfigQueryPage,
                args: {},
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                dialogTitle: '',
                tableData: [],
                selectedRows: [],
            }
        },
        created (){
            TemplateOperator.queryPropertyUnion({page: 1, size: 200, search: {pPropertyCode: "11605"}}).then((res) => {
                if (res.data.status === 200) {
                    let list = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        list.push({text: rows[i]['propertyName'], value: rows[i]['id']});
                    }
                    this.selectSource.billTypeList = list;
                }
            });

            TemplateOperator.queryPropertyUnion({page: 1, size: 200, search: {pPropertyCode: "11008"}}).then((res) => {
                if (res.data.status === 200) {
                    let list = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        list.push({text: rows[i]['propertyName'], value: rows[i]['id']});
                    }
                    this.selectSource.bizTypeList = list;
                }
            });

            TemplateOperator.listNextLevelUnforbidden({fatherCode: "001005"}).then((res) => {
                if (res.data.status === 200) {
                    let list = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        list.push({text: rows[i]['name'], value: rows[i]['id']});
                    }
                    this.selectSource.actionTypeList = list;
                }
            });
        },
        methods: {
            //搜素
            submitSearch(obj) {
                this.args = {search: obj}
            },
            add () {
                this.$refs['shutConfigTable'].addNewRow()
            },
            del () {
                if (this.selectedRows.length > 0) {
                    for (let i in this.selectedRows) {
                        if (this.selectedRows[i].id) {
                            this.$message.error('已保存的配置记录不能被删除！');
                            return false;
                        }
                    }
                    this.$refs['shutConfigTable'].delRows()
                } else {
                    this.$message.error('请选择需要删除的配置记录！')
                }
            },
            save (){

                let rows = this.$refs['shutConfigTable'].getActionLog(false);
                let _this = this
                let data = {};
                data.createList = this.formatRowData(rows.addedRows);
                data.updateList = this.formatRowData(rows.editedRows);
                this.$refs['shutConfigTable'].validate((isValid) => {
                    if (isValid && (data.createList || data.updateList)) {
                        this.isLoading = true;
                        TemplateOperator.shutConfigSave(data)
                            .then((res) => {
                                if (res.data.status === 200) {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '保存成功！',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain',
                                        callback:function (){
                                            _this.getTableData();
                                        }
                                    }, function () {
//                                        getTableData();
                                    });
                                    this.isLoading = false;
                                    //重置行记录状态
//                                    this.$refs['shutConfigTable'].getActionLog(true);


                                } else {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: res.data.message,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    });
                                    this.isLoading = false;
                                }
                            });
                    }
                });
            },
            formatRowData (rowData){
                for (let i in rowData) {
                    if (typeof rowData[i].effectTime == 'object') {
                        rowData[i].effectTime = +Date.parse(rowData[i].effectTime).toString().substr(0, 10);
                    }
                    rowData[i].updateUser = +Cookie.get('t8t-tc-uid');
                    if (rowData[i].id) {

                    } else {
                        rowData[i].createUser = +Cookie.get('t8t-tc-uid');
                    }
                    rowData[i].bizType = rowData[i]['bizType'];
                    rowData[i].billType = rowData[i]['billType'];
                    rowData[i].actionType = rowData[i]['actionType'];
                    rowData[i].configStatus = rowData[i]['configStatus'];
                    if (!rowData[i].bizType && !rowData[i].billType && !rowData[i].actionType && !rowData[i].configStatus) {
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '请填写完整记录！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                        return false;
                    }
                }
                return rowData;
            },
            //表格
            getTableData() {
                this.$refs['shutConfigTable'].reloadTable();
            },
            //行变化事件
            selectionChange (rows){
            }
        }
    }
</script>

<style>

</style>
