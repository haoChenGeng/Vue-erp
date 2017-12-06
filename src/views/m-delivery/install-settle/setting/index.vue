<template>
    <t8t-list-view
        ref="list-view"
        :breadcrumbData="breadcrumbData"
        :searchFields="searchFields"
        :searchOptions="searchOptions"
        :showSearchToggleBtn="false"
        :toolbarDisabledSymbols="disabledSymbols"
        :tableColumns="tableColumns"
        :tableService="tableService"
        :tableMethod="tableMethod"
        :tableArgs="tableArgs"
        :tableCommonData="tableCommonData"
        :tableRadioCol="false"
        :tableEditable="true"
        :tableIndexCol="true"
        @table-row-click="tableRowClick"
        @table-cell-click="tableCellClick"
        @table-row-dobule-click="view"
        @table-selection-change="selectionChange"
        @list-addrow="addRow"
        @list-delrow="delRow"
        @list-save="save"
        @list-void="disable"
        @list-logdetail="logDetail"
        @search-submit="onSearchSubmit"
    >
    </t8t-list-view>

</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    import TemplateOperator from 'src/services/delivery/pcm.js'
    export default {
        data(){
            let validateUnitPrice = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error('单价不能为空！'));
                }
                if(false === /^\d+$|(^\d+\.\d{1,2}$)/.test(value) || !(value > 0 && value <= 100000)){
                    return callback(new Error('单价必须是大于0且小于等于100000的数字，且最多只能两位小数'));
                }
                callback();
            }
            return {
                breadcrumbData: [{title: '功能设置'}, {title: '结算管理'}, {title: '安装定额配置'}],
                searchFields: [
                    {type: 'select', label: '组织', name: 'organizationId', selectSourceKey: 'userOrganizationList'},
                    {
                        type: 'popup',
                        label: '产品包模板',
                        name: 'pkgTempId',
                        textValue: 'tempName',
                        triggerOnFocus: false,
                        filedValue: 'id',
                        remote: true,
                        service: Service.PRSPQM.name,
                        method: Service.PRSPQM.methods.productPkgTempBaseQueryPage,
                        remoteArgs: {page: 1, size: 20},
                        remoteQueryKey: "tempName_like",
                        dialog: {
                            title: '产品包模板',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '产品包模板名称', name: 'tempName_like'},
                                ]
                            },
                            table: {
                                service: Service.PRSPQM.name,
                                method: Service.PRSPQM.methods.productPkgTempBaseQueryPage,
                                args: {search: {tempStatus: 2}},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'id',
                                        label: 'ID',
                                    },
                                    {
                                        prop: 'tempName',
                                        label: '产品包模板名称'
                                    }
                                ]
                            }
                        }
                    },
                    {type: 'select', label: '计价方式', name: 'valuateWay', selectSourceKey: 'valuateWayList'},
                    {type: 'select', label: '价格类型', name: 'priceType', selectSourceKey: 'priceTypeList'},
                    {type: 'select', label: '状态', name: 'quotaStatus', selectSourceKey: 'quotaStatusList'},
                    {
                        type: 'datetime',
                        pickertype: 'datetimerange',
                        label: '生效时间',
                        startField: 'effectiveTime_gte',
                        endField: 'effectiveTime_lte',
                        name: 'effectiveTime'
                    },
                ],
                searchOptions: {
                    userOrganizationList: [],
                    quotaStatusList: [
                        {
                            value: 1,
                            text: '已启用'
                        },
                        {
                            value: 2,
                            text: '已作废'
                        }
                    ],
                    valuateWayList: [
                        {
                            value: 1,
                            text: '平米'
                        },
                        {
                            value: 2,
                            text: '单品'
                        }
                    ],
                    priceTypeList: []
                },
                tableColumns: [
                    {
                        prop: 'organizationId', label: '组织', required: true, list: 'userOrganizationList', editor: {
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
                        prop: 'pkgTempName',
                        label: '产品包模板',
                        required: true,
                        onChange(val,row,column){
                            row.pkgTempId = val.id;
                            row.pkgTempName = val.tempName;
                            row.organizationId = val.orgId;
                        },
                        onClick(val,row,column,table){ // 重置表格参数
                            // table.columns[0].editor.args = { search: { tempStatus: 2 } };
                        },
                        editor:{
                            type: 'lookup',
                            service: Service.PRSPQM.name,
                            method: Service.PRSPQM.methods.productPkgTempBaseQueryPage,
                            args:{ search: { tempStatus: 2 } },
                            columns: [
                            {
                                prop: 'id',
                                label: 'ID',
                            },
                            {
                                prop: 'tempName',
                                label: '产品包模板名称'
                            }
                            ],
                            placeholder: '搜索产品包模板名称',
                            searchExpr: ['tempName'],
                            rules:[
                                {
                                    required: true,
                                    message: '不能为空'
                                }
                            ]
                        }
                    },
                    {
                        prop: 'valuateWay', label: '计价方式', required: true, list: 'valuateWayList', editor: {
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
                        prop: 'priceType', label: '价格类型', required: true, list: 'priceTypeList', editor: {
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
                        prop: 'installUnit', label: '单位', required: true, list: 'installUnitList', editor: {
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
                        prop: 'unitPrice', label: '单价', required: true, editor: {
                        type: 'input',
                        rules: [
                            {
                                validator: validateUnitPrice
                            }

                        ]
                    }
                    },
                    {
                        prop: 'effectiveTime', label: '生效日期', formatter: this.dateParser, required: true, editor: {
                        type: 'date',
                        endFormater: 'timestamp',
                        rules: [
                            {
                                required: true,
                                message: '生效日期不能为空'
                            }
                        ]
                    }
                    },
                    {prop: 'quotaStatus', label: '状态', list: 'quotaStatusList', readonly: true},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser', readonly: true},
                    {prop: 'createName', label: '创建人', readonly: true},
                    {prop: 'cancelTime', label: '作废时间', formatter: 'dateParser', readonly: true},
                    {prop: 'cancelName', label: '作废人', readonly: true}
                ],
                tableService: 'SEUxFoqLBIOf1YPTnkuk-7ZBN6kONU6',///biz/t8t-ps-set/app
                tableMethod: '8HYGMj9KMS0j-5kC-aSgN9qyQH3NB51sViLF5WkRD0TR2wNKSEc',//views.settle.installQuota.queryPage
                tableArgs: {sort: ['quotaStatus_asc', 'effectiveTime_desc']},
                tableCommonData: {
                    userOrganizationList: [],
                    quotaStatusList: [
                        {
                            value: 1,
                            text: '已启用'
                        },
                        {
                            value: 2,
                            text: '已作废'
                        }
                    ],
                    valuateWayList: [
                        {
                            value: 1,
                            text: '平米'
                        },
                        {
                            value: 2,
                            text: '单品'
                        }
                    ],
                    priceTypeList: [],
                    installUnitList: []
                },
                selectedRows: [],
                selIds: [],
                logDialogVisible: false,
                fullscreenLoading: false,
                disabledSymbols: ['DELROW'],
            }
        },
        created(){
            this.getOrganization();
            this.getPriceType();
            this.getInstallUnit();
        },
        methods: {
            onSearchSubmit(obj){
                this.$refs['list-view'].getTableInstance().resetActionLog();
                this.initDisabledSymbols();

                this.tableArgs = {search: obj,sort: ['quotaStatus_asc', 'effectiveTime_desc']};
            },
            dateParser(text) {
                let dateString;
                if (!text) {
                    dateString = ""
                } else if(text == 0){
                    dateString = "";
                }else {
                    let objDate = new Date(text * 1000);
                    dateString = DateUtils(objDate, 'yyyy-mm-dd')
                }
                return dateString
            },
            addRow(){
                this.$refs['list-view'].$refs['list-table'].addNewRow();
            },
            delRow(){
                let flag = true;
                this.selectedRows.forEach((item, index) => {
                    if (item.id > 0) {
                        flag = false;
                        this.$message.error('不能删除已保存的行！');
                    }
                });
                flag && this.$refs['list-view'].$refs['list-table'].delRows();
            },
            save(){
                this.$refs['list-view'].getTableInstance().validate((isValid) => {
                    if (isValid) {
                        let rows = this.$refs['list-view'].getTableInstance().getActionLog(false, true);
                        let createDTOs = [];
                        let createUser = +Cookie.get('t8t-tc-uid');
                        let createUserName = Cookie.get('t8t-tc-username');
                        rows.addedRows.forEach(function (item, index) {
                            createDTOs.push({
                                valuateWay:item.valuateWay,
                                unitPrice:item.unitPrice,
                                quotaStatus: 1,
                                priceType: item.priceType,
                                pkgTempId: item.pkgTempId,
                                organizationId: +item.organizationId,
                                installUnit: item.installUnit,
                                effectiveTime:item.effectiveTime,
                                createUser: createUser,
                                createName: createUserName
                            })
                        });
                        if (createDTOs.length === 0) {
                            this.$message.error('没有作出任何修改！');
                            return;
                        }
                        this.fullscreenLoading = true;
                        TemplateOperator.saveInstallQuota({
                            installQuotas:createDTOs
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
            disable(){
                let flag = true;
                if (this.selIds.length == 0) {
                    this.$message.error('请选择需要操作的行！');
                    return false;
                }
                this.$confirm('是否确认作废', '提示', {
                    type: 'warning'
                }).then(() => {
                        let updateDTOs = [];
                        let cancelUser = +Cookie.get('t8t-tc-uid');
                        let cancelName = Cookie.get('t8t-tc-username');
                        this.selIds.forEach(function (id, index) {
                            updateDTOs.push({
                                id: id,
                                cancelUser: cancelUser,
                                cancelName: cancelName,
                                quotaStatus: 2//作废
                            })
                        });
                    TemplateOperator.invalidInstallQuota({
                        installQuotas: updateDTOs
                    }).then((res) => {
                            if (res.data.status === 200) {
                                this.reloadTable();
                                this.$message.success('作废成功！');
                            } else {
                                this.$message.error(res.data.message ? res.data.message : '作废失败！');
                            }
                        }
                    ).catch()
                })
            },
            selectionChange(rows, selIds){
                //已选择行
                this.selectedRows = rows;
                this.selIds = selIds;
                //按钮作废
                let disableStatus = false;
                let delStatus = false;
                if (rows.length > 0) {
                    for (let i in rows) {
                        if (!rows[i].id) { //新增行
                            disableStatus = true;
                        }
                        else
                        {
                            delStatus = true;
                            if (rows[i].quotaStatus == 2) {
                                disableStatus = true;
                            }
                        }
                    }
                } else {
                    delStatus = true;
                }
                if (disableStatus) {
                    this.$refs['list-view'].disableBySymbol('VOID');
                } else {
                    this.$refs['list-view'].unDisableBySymbol('VOID');
                }
                if (delStatus) {
                    this.$refs['list-view'].disableBySymbol('DELROW');
                } else {
                    this.$refs['list-view'].unDisableBySymbol('DELROW');
                }
            },
            tableCellClick(row, column, cell, event){
                if(typeof row.id !== 'undefined' && row.id > 0){
                    this.$refs['list-view'].getTableInstance().handleFormItemBlur()
                }
            },
            reloadTable() {
                this.$refs['list-view'].getTableInstance().resetActionLog();
                this.$refs['list-view'].getTableInstance().reloadTable();
                this.initDisabledSymbols();
            },
            getPriceType(){
                this.searchOptions.priceTypeList = Model.getCommonOptionsByWholeCode('4!427!42707');
                this.tableCommonData.priceTypeList = Model.getCommonOptionsByWholeCode('4!427!42707');
            },
            getInstallUnit(){
                this.searchOptions.installUnitList = Model.getCommonOptionsByWholeCode('1!110!11003');
                this.tableCommonData.installUnitList = Model.getCommonOptionsByWholeCode('1!110!11003');
            },
            getOrganization(){
                let args = {page: 1, size: 150, search: {typeCode: '001003010', isDel: 0}};
                commonApi.queryAll(args).then((res) => {
                    let list = [];
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                            list.push({
                                text: item.name,
                                value: item.id
                            });
                        })
                        this.searchOptions['userOrganizationList'] = list
                        this.tableCommonData['userOrganizationList'] = list
                    } else {

                    }
                }).catch()
            },
            beforeUpload(file){
            },
            handleChange(file, fileList){
                let len = fileList.length;
                if (len > 1) {
                    this.$refs.upload.uploadFiles = fileList.slice(len - 1, len);
                }
            },
            initDisabledSymbols(){
                this.$refs['list-view'].disableBySymbol('DELROW');
            },
            closeUploadDialog(){
                this.importDialogVisible = false
                this.$refs.upload.clearFiles();
            }
        }
    }
</script>
