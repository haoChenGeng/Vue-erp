<template>
    <div v-loading.fullscreen.lock="fullscreenLoading">
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :toolbarDisabledSymbols="disabledSymbols"
            :tableTemplateData="listTmpData"
            :tableColumns="tableColumns"
            :tableService="tableService"
            :tableMethod="tableMethod"
            :tableArgs="tableArgs"
            :tableCommonData="tableCommonData"
            :tableRadioCol="false"
            :tableEditable="true"
            @table-row-click="tableRowClick"
            @table-row-dobule-click="view"
            @table-selection-change="selectionChange"
            @list-addrow="addRow"
            @list-delrow="delRow"
            @list-save="save"
            @search-submit="onSearchSubmit"
            @search-change="onSearchChange"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>

    </div>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    import exportUtils from 'src/utils/export.js'
    import Utils from 'src/utils/Utils.js'
    import TemplateOperator from 'src/services/delivery/pcm.js'

    export default {
        data(){
            let that = this;
            return {
                breadcrumbData: [{title: '交付'}, {title: '交付基础数据'}, {title: '项目状态管理'}],
                disabledSymbols: ['DELROW', 'SAVE'],
                searchFields: [
                    {type: 'select', label: '节点类型', name: 'nodeType', selectSourceKey: 'nodeType'},
                    {type: 'select', label: '状态主状态', name: 'mainStatusCode', selectSourceKey: 'search_mainStatusCode'},
                    {type: 'select', label: '状态子状态', name: 'subStatusCode', selectSourceKey: 'search_subStatusCode'},
                    {type: 'select', label: '数据状态', name: 'status', selectSourceKey: 'status'}
                ],
                // 搜索项对应值
                searchOptions: {
                    nodeType: [],
                    search_mainStatusCode: [],
                    search_subStatusCode: [],
                    status: [
                        {value: '0', text: '启用'},
                        {value: '1', text: '禁用'}
                    ]
                },
                tableColumns: [
                    {prop: 'id', label: '主键ID'},
                    {
                        prop: 'nodeType', label: '节点类型', required: true, list: 'nodeType', editor: {
                        type: 'select',
                        filterable: true,
                        clearable: true,
                        rules: [
                            {
                                required: true,
                                message: '不能为空'
                            }
                        ]
                    }
                    },
                    {
                        prop: 'mainStatusCode', label: '项目主状态', required: true, list: 'mainStatusCode',
                        editor: {
                            type: 'select',
                            filterable: true,
                            clearable: true,
                            rules: [
                                {
                                    required: true,
                                    message: '不能为空'
                                }
                            ]
                        },
                        onChange(value, row, column, table){

                            that.handleMainStatusCodeChange(row, value);
                        },
                    },
                    {
                        prop: 'subStatusCode', label: '项目子状态',
                        formatter: this.getCellVal2,
                        editor: {
                            type: 'select',
                            list: '_subStatusCode',
                            filterable: true,
                            clearable: true
                        }
                    },
                    {
                        prop: 'status', label: '记录状态', required: true, list: 'status', editor: {
                        type: 'select',
                        filterable: true,
                        clearable: true,
                        rules: [
                            {
                                required: true,
                                message: '不能为空'
                            }
                        ]
                    }
                    },
                    {
                        prop: 'effectTime', label: '生效日期', formatter: this.dateParser, required: true, editor: {
                        type: 'date',
                        endFormater: 'timestamp',
                        rules: [
                            {
                                required: true,
                                message: '不能为空'
                            }
                        ]
                    }
                    },
                    {prop: 'createName', label: '创建人名称'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                    {prop: 'updateBy', label: '最后修改人'},
                    {prop: 'updateTime', label: '最后修改时间', formatter: 'dateParser'}
                ],
                listTmpData: {
                    "id": null,
                    "nodeType": null,
                    "mainStatusCode": null,
                    "subStatusCode": null,
                    "status": null,
                    "effectTime": null,
                    "createName": null,
                    "createTime": null,
                    "updateBy": null,
                    "updateTime": null,
                },
                // service 和 method 目前需要加密
                tableService: 'BBMhUlyoTLH2oRV1jPpaW591mHf10XF', // /biz/t8t-ps-pmd/app
                tableMethod: '5Utznnf1xfY75lew49_gJH32YC0Ba5omhQTqwlWyjmX0RTHjZYL', // schduleNodeProjectStatus.queryPage
                tableArgs: {},
                selectedRows: [],
                selIds: [],
                tableCommonData: {
                    status: [
                        {
                            text: '启用',
                            value: 0
                        },
                        {
                            text: '禁用',
                            value: 1
                        }
                    ],
                    nodeType: [],
                    mainStatusCode: [],
                    subStatusCode: [],
                    _subStatusCode: []
                },
                allSubStatusCode: {}
            }
        },
        created(){
            //查询节点类型

            TemplateOperator.queryPropertyUnion({
                page: 1,
                size: 200,
                search: {pPropertyCode: "41101", propertyStatus: 1}
            }).then((res) => {
                if (res.data.status === 200) {
                    let list = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        list.push({text: rows[i]['propertyName'], value: rows[i]['id']});
                    }
                    this.tableCommonData.nodeType = list;
                    this.searchOptions.nodeType = list;
                }
            });
            //主状态
            TemplateOperator.queryPropertyUnion({page: 1, size: 200, search: {pPropertyCode: "109"}}).then((res) => {
                if (res.data.status === 200) {
                    let searchList = [];
                    let tableList = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        if (rows[i]['propertyStatus'] === 1) {
                            tableList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                        }
                        searchList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                    }
                    this.tableCommonData.mainStatusCode = tableList;
                    this.searchOptions.search_mainStatusCode = searchList;
                }
            });

        },
        methods: {
            onSearchSubmit(obj){
                this.$refs['list-view'].disableBySymbol('DELROW');
                this.$refs['list-view'].disableBySymbol('SAVE');
                this.$refs['list-view'].getTableInstance().resetActionLog();
                this.tableArgs = { search: obj };
            },
            onSearchChange(value, name){
//              alert(value+"--"+name);
                this.getSubStatusCodeForSearch(value);
            },
            dateParser(text) {
                let dateString;
                let objDate = new Date(text * 1000);
                if (text === 0 || text === null) {
                    dateString = ""
                } else {
                    dateString = DateUtils(objDate, 'yyyy-mm-dd')
                }
                return dateString
            },
            addRow(){
                this.$refs['list-view'].$refs['list-table'].addNewRow();
                this.$refs['list-view'].getToolbarInstance().unDisableBySymbol('SAVE');
            },
            delRow(){
                if (this.selIds.length == 0) {
                    this.$message.error('请选择需要操作的行！');
                    return false;
                }
                let flag = true;
                this.selectedRows.forEach((item, index) => {
                    if (item.id > 0) {
                        flag = false;
                        this.$message.error('不能删除已保存的行！');
                    }
                });
                flag && this.$refs['list-view'].$refs['list-table'].delRows();
                let rows = this.$refs['list-view'].getTableInstance().getActionLog(false);
                if (rows.addedRows.length === 0) {
                    this.$refs['list-view'].getToolbarInstance().disableBySymbol('SAVE');
                }

            },
            save(){

                this.$refs['list-view'].getTableInstance().validate((isValid) => {
                    if (isValid) {
                        let rows = this.$refs['list-view'].getTableInstance().getActionLog(false, true);

                        let createDTOList = [];
                        let updateDTOList = [];
                        let operUser = Cookie.get('t8t-tc-username');
                        rows.addedRows.forEach(function (item, index) {
                            createDTOList.push({
                                nodeType: item.nodeType,
                                mainStatusCode: item.mainStatusCode,
                                subStatusCode: +item.subStatusCode,
                                status: item.status,
                                effectTime: item.effectTime
                            })
                        });
                        rows.editedRows.forEach(function (item, index) {
                            updateDTOList.push({
                                id: +item.id,
                                nodeType: item.nodeType,
                                mainStatusCode: item.mainStatusCode,
                                subStatusCode: +item.subStatusCode,
                                status: item.status,
                                effectTime: item.effectTime
                            })
                        })
                        this.fullscreenLoading = true;
                        TemplateOperator.saveNodeProjectStatus({
                            createDTOList: createDTOList,
                            updateDTOList: updateDTOList,
                            operUser: operUser
                        }).then((res) => {
                            this.fullscreenLoading = false;
                            if (res.data.status === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功！'
                                });
                                //重置行记录状态
                                this.reloadTable();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.message ? res.data.message : '保存失败！'
                                })
                            }
                        })
                    }
                });
            },
            getTableData() {
                this.$refs['list-view'].reloadTable()
            },
            selectionChange(rows, selIds){
                //已选择行
                this.selectedRows = rows;
                this.selIds = selIds;
                let delStatus = false;
                if (rows.length > 0) {
                    for (let i in rows) {
                        if (rows[i].id > 0) {
                            delStatus = true;
                        }

                    }
                }
                if (delStatus) {
                    this.$refs['list-view'].disableBySymbol('DELROW');
                } else {
                    this.$refs['list-view'].unDisableBySymbol('DELROW');
                }

                this.$refs['list-view'].unDisableBySymbol('SAVE');
            },
            getCellVal2(val, row){
                if (row.id) { //
                    return row.subStatusName;
                } else {
                    let mainStatusCode = row.mainStatusCode;
                    if (mainStatusCode) {
                        let list = this.allSubStatusCode[mainStatusCode] ? this.allSubStatusCode[mainStatusCode] : [];
                        if (list.length > 0) {
                            let item = list.filter((item) => item.value == val);
                            if (item.length > 0) {
                                return item[0].text;
                            }
                        }
                    }
                }
            },

            handleMainStatusCodeChange(cell, val)
            {
                this.allSubStatusCode[val] = this.getSubStatusCode(val);
            },

            handleSubStatusCodeChange(cell, val)
            {

            },


            getSubStatusCode(mainStatusCode){
                if (!mainStatusCode) {
                    return;
                }
                let list = [];
                TemplateOperator.queryPropertyUnion({
                    page: 1,
                    size: 200,
                    search: {pPropertyCode: mainStatusCode}
                }).then((res) => {
                    if (res.data.status === 200) {
                        let tableList = [];
                        let rows = res.data.result;
                        for (let i in rows) {
                            if (rows[i]['propertyStatus'] === 1) {
                                tableList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                            }
                            list.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                        }
                        this.tableCommonData._subStatusCode = tableList;
                    }
                });
                return list;

            },

            getSubStatusCodeForSearch(mainStatusCode){
                if (!mainStatusCode) {
                    return;
                }
                let list = [];
                TemplateOperator.queryPropertyUnion({
                    page: 1,
                    size: 200,
                    search: {pPropertyCode: mainStatusCode}
                }).then((res) => {
                    if (res.data.status === 200) {
                        let searchList = [];
                        let rows = res.data.result;
                        for (let i in rows) {
                            searchList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                        }
                        this.searchOptions.search_subStatusCode = searchList;
                    }
                });

            },

            reloadTable() {
                this.$refs['list-view'].getTableInstance().resetActionLog();
                this.$refs['list-view'].getTableInstance().reloadTable();
                this.initDisabledSymbols();
            },

            initDisabledSymbols(){
                this.$refs['toolbar'].disableBySymbol('DELETE');
                this.$refs['toolbar'].disableBySymbol('SAVE');
//                let rows = this.$refs['list-view'].getTableInstance().getActionLog(false, true);
//                alert(rows.addedRows.length + "---" + rows.editedRows.length);
//                if(rows.addedRows.length == 0 && rows.editedRows.length == 0)
//                {
//
//                }
            },

            getCommonOptions: function (fatherCode, selectName, default_options) {
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
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            });
                            this.commonOptionsConfig[selectName] = list;
                            this.commonOptionsConfig[selectName].unshift({value: 0, text: '请选择'});
                            let type = typeof default_options;
                            if (type !== undefined && type !== null && type === 'object') {
                                this.commonOptionsConfig[selectName].unshift(default_options);
                            }
                        }
                    })
            },
        }
    }
</script>
