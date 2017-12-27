<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"
            @click.native="onClick">
        </t8t-breadcrumb>
        <t8t-search :fields="fields"
            :selectSource="commonData"
            @submit="submitSearch">
        </t8t-search>

        <div class="g-main-container">
            <div class="g-main-container-column">
                <t8t-toolbar @ENABLE="onEnable"
                    @DISABLE="onDisable"
                    @ADD="onAdd"
                    @SAVE="onSave"
                    @DELETE="onDelete"
                    ref="toolbar"
                    :disabledSymbols="disabledSymbols">
                </t8t-toolbar>

                <t8t-grid ref="table"
                    id="grid1031"
                    :columns="columns"
                    :service="service"
                    :method="method"
                    :args="args"
                    :indexCol="true"
                    :radioCol="true"
                    :commonData="commonData"
                    :editable="onEditable"
                    :templateData="templateData"
                    @current-row-change="onTableCRC">
                </t8t-grid>
            </div>
        </div>

    </div>
</template>

<script>
    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/citySchedule-config.js'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    import _ from 'lodash'
    export default {
        name: 'schedule-config',

        data() {
            return {
                disabledSymbols: ['ENABLE', 'DELETE', 'DISABLE', 'SAVE'],
                breadcrumbData: [{ title: '功能管理' }, { title: '工程管理' }, { title: '城市排期模板配置关系' }],
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                //搜索表单项配置
                fields: [
                    { type: 'select', label: '报价模板', name: 'quotationTempId', selectSourceKey: 'quotationTemps', filterable: true },
                    { type: 'select', label: '城市', name: 'cityId', selectSourceKey: 'citys', filterable: true },
                    { type: 'select', label: '排期模板', name: 'scheduleId', selectSourceKey: 'schedules', filterable: true },

                    { type: 'datetime', label: '生效日期', name: 'effectiveTime_gt' },
                    { type: 'datetime', label: '生效日期至', name: 'effectiveTime_lte' }
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    quotationTemps: [],
                    citys: [],
                    schedules: []
                },
                columns:
                [
                    {
                        prop: 'quotationTempId',
                        label: '产品包模板',
                        required: 'true',
                        list: 'quotationTemps',
                        editor: {
                            type: 'select',
                            filterable: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择数据'
                                }
                            ]
                        }
                    },
                    {
                        prop: 'cityId',
                        label: '城市',
                        required: 'true',
                        list: 'citys',
                        editor: {
                            type: 'select',
                            filterable: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择数据'
                                }
                            ]
                        }
                    },

                    {
                        prop: 'scheduleId',
                        label: '排期模板',
                        list: 'schedules',
                        required: 'true',
                        editor: {
                            type: 'select',
                            filterable: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择数据'
                                }
                            ]
                        }
                    },
                    {
                        prop: "relationStatus",
                        label: "状态",
                        required: 'true',
                        list: "relationStatusList",
                        editor: {
                            type: 'select',
                            filterable: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择数据'
                                }
                            ]
                        }
                    },
                    {
                        prop: 'effectiveTime',
                        label: '生效时间',
                        required: 'true',
                        formatter: 'dateParser',
                        editor: {
                            type: 'datetime',
                            endFormater: 'timestamp',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择数据'
                                }
                            ]
                        }
                    }
                ],
                options: {
                    cityOptions: [],
                    baoOptions: [
                        { text: '半包', value: 1 },
                        { text: '全包', value: 2 },
                    ],
                    ratioOptions: []
                },

                commonData: {
                    quotationTemps: [],
                    citys: [],
                    schedules: [],
                    relationStatusList: [
                        {
                            text: '禁用',
                            value: 2
                        },
                        {
                            text: '启用',
                            value: 1
                        },
                    ]
                },
                service: Service.TEMPLATE.name,
                method: Service.TEMPLATE.methods.cityScheduleQuery,
                args: {},

                //弹窗dialog配置
                //editType: 'add',
                // _createRow = true,
                dialogVisible: false,
                rowId: null,
                dialogTitle: '',
                tableData: [],
                // dataSource: [],
                selectedRows: [],
                curRow: null,
                canCreate: true,
                templateData: {
                    _isNewRow: true,
                    cityId: null,
                    scheduleId: null,
                    quotationTempId: null,
                    relationStatus: null,
                    effectiveTime: '',
                },
            }
        },
        watch: {
            curRow(val) {
                this.changeDisable(val)
            }
        },
        created() {
            TemplateOperator.queryQuoteList({ page: 1, size: 200, optType: 1 }).then((res) => {
                if (res.data.status === 200) {
                    let list = [];
                    let rows = res.data.result.rows;
                    for (let i in rows) {
                        list.push({ text: rows[i]['tempName'], value: rows[i]['id'] });
                    }
                    //this.selectSource.quotationTemps = list;

                    this.commonData.quotationTemps = list;
                }
            }),
                TemplateOperator.queryScheduleList().then((res) => {

                    if (res.data.status === 200) {
                        let list = [];
                        let rows = res.data.result

                        for (let i in rows) {
                            list.push({ text: rows[i]['name'], value: rows[i]['id'] });
                        }
                        //this.selectSource.quotationTemps = list;

                        this.commonData.schedules = list;
                    }
                }),
                TemplateOperator.getCity().then((res) => {

                    if (res.data.status === 200) {
                        let list = [];
                        let rows = res.data.result
                        for (let i in rows) {
                            list.push({ text: rows[i]['townName'], value: rows[i]['townId'] });
                        }
                        //this.selectSource.quotationTemps = list;

                        this.commonData.citys = list;
                    }
                })

        },

        methods: {
            onAdd() {

                this.$refs.table.addNewRow()
                const newRow = this.$refs.table.dataSource[0]
                this.$refs.table.store.commit('setCurrentRow', newRow)
                this.$refs['toolbar'].disableBySymbol('ADD')


                //this.disabledSymbols.push('ADD')
            },

            onDelete() {
                if (this.curRow._isNewRow === true) {
                    this.$refs.table.delRows([this.curRow])
                    this.disabledSymbols = ['ENABLE', 'DELETE', 'DISABLE', 'SAVE'],
                        this.$refs['toolbar'].unDisableBySymbol('ADD')
                    //this.$refs['toolbar'].disableBySymbol('DELETE', 'SAVE')
                }
            },


            onSave() {
                // 新增数据
                if (this.curRow._isNewRow) {
                    this._createRow(this.curRow)

                }
            },
            _createRow(row) {
                this.$refs.table.validate((isValid) => {
                    if (isValid) {
                        let args = {
                            "moduleRelation": {
                                "scheduleId": row.scheduleId, // 城市ID
                                "cityId": row.cityId, //服务类型
                                "quotationTempId": row.quotationTempId, //城市比例
                                "relationStatus": row.relationStatus,    //生效时间
                                "effectiveTime": row.effectiveTime, //失效时间
                                "createUser": +Cookie.get('t8t-tc-uid')        //创建人id
                            }
                        }

                        this.disabledSymbols.push('SAVE')

                        TemplateOperator.cityScheduleCreate(args).then((res) => {
                            // this.disabledSymbols.pop()
                            // this.invalidTimeButtonLoading = false
                            if (res.data.status === 200 && res.data.result >= 1) {
                                this.$refs['toolbar'].unDisableBySymbol('ADD')
                                this.disabledSymbols.pop()
                                this.$msgbox({
                                    title: '新增成功',
                                    type: 'success',
                                    message: '',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                }).then(() => {
                                    //this._quitEdit(row)
                                    this.reloadTable()
                                })
                            } else {
                                this.disabledSymbols.pop()
                                this.$msgbox({
                                    title: '新增失败',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                            }
                        }).catch((error) => {
                            this.invalidTimeButtonLoading = false
                            this.disabledSymbols.pop()
                            this.$msgbox({
                                title: '新增设置失败',
                                type: 'error',
                                message: error || '服务器异常',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        })
                    }
                })
            },

            onEnable() {
                let row = this.curRow
                this.disabledSymbols.push('ENABLE')
                this.activeId = row.id
                this.updateUser = + Cookie.get('t8t-tc-uid')

                let args = {
                    id: this.activeId,
                    updateUser: this.updateUser
                }
                TemplateOperator.cityScheduleUse(args).then((res) => {
                    //console.log(args)
                    this.disabledSymbols.pop()
                    if (res.data.status === 200 && res.data.result >= 1) {
                        this.$msgbox({
                            title: '启用成功',
                            type: 'success',
                            message: '',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        }).then(() => {
                            this.reloadTable()
                        })
                    } else {
                        this.$msgbox({
                            title: '启用失败',
                            type: 'error',
                            message: res.data.message,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    }
                }).catch((error) => {
                    this.disabledSymbols.pop()
                    this.$msgbox({
                        title: '启用配置失败',
                        type: 'error',
                        message: error || '服务器异常',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                })
            },
            onDisable() {
                let row = this.curRow
                this.disabledSymbols.push('ENABLE')
                this.activeId = row.id
                this.updateUser = + Cookie.get('t8t-tc-uid')
                //console.log(this.activeId)
                let args = {
                    id: this.activeId,
                    updateUser: this.updateUser
                }
                TemplateOperator.cityScheduleBan(args).then((res) => {
                    //console.log(args)
                    this.disabledSymbols.pop()
                    if (res.data.status === 200 && res.data.result >= 1) {
                        this.$msgbox({
                            title: '禁用成功',
                            type: 'success',
                            message: '',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        }).then(() => {
                            this.reloadTable()
                        })
                    } else {
                        this.$msgbox({
                            title: '禁用失败',
                            type: 'error',
                            message: res.data.message,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    }
                }).catch((error) => {
                    this.disabledSymbols.pop()
                    this.$msgbox({
                        title: '禁用配置失败',
                        type: 'error',
                        message: error || '服务器异常',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                })
            },

            _quitEdit(row) {
                if (row._isNewRow) {
                    row._isNewRow = 'submit'
                }
                this.tableEditRow = _.pull(this.tableEditRow, row)
            },
            onEditable(val, row, col, table, index) {
                let _editable = row._isNewRow === true
                return _editable
            },
            onTableCRC(curRow) {
                this.curRow = curRow
            },

            changeDisable(row) {
                let _newRow = (row._isNewRow === true)
                let _canBan = (row.relationStatus === 1)

                // if (canCreate) {
                //     this.disabledSymbols = ['ADD']
                // }

                if (!_newRow) {
                    if (!_canBan) {
                        return this.disabledSymbols = ['DELETE', 'SAVE', 'DISABLE']
                    }
                    else {
                        return this.disabledSymbols = ['DELETE', 'SAVE', 'ENABLE']
                    }
                }
                this.disabledSymbols = ['ENABLE', 'DISABLE',]
            },



            //搜索
            submitSearch(obj) {
                // this.$refs['toolbar'].unDisableBySymbol('ADD'),
                this.disabledSymbols = ['ENABLE', 'DELETE', 'DISABLE', 'SAVE'],
                    this.$refs['toolbar'].unDisableBySymbol('ADD'),
                    //    this.$refs['toolbar'].disableBySymbol('DELETE', 'SAVE'),
                    this.args = { search: obj }
            },

            reloadTable() {
                this.$refs.table.reloadTable()
                this.curRow = null
                this.tableEditRow = []
                this.disabledSymbols = ['DELETE', 'ENABLE', 'DISABLE', 'SAVE']
            },
        },
    }

</script>

<style>
    #grid1031 .el-table__row .el-input__icon {
        display: none;
    }

    #grid1031 .editable .el-input__icon {
        display: flex;
    }
</style>