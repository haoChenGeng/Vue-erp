<template>
    <div class="t8t-detail">
        <el-tabs v-if="schema && schema.length > 0" v-model="activeTab" class="t8t-detail">
            <el-tab-pane v-for="tab in schema" :label="tab.label" :name="tab.name">
                <div class="sub-container" v-if="tab.fields && tab.fields.length > 0">

                    <div class="my-toolbar" v-if="tab.type ==='table' && (mode === 'add' || mode == 'edit')">
                        <el-button
                            type="primary"
                            size="small"
                            icon="plus"
                            @click="addLine(tab.name)"
                        >新增行</el-button>
                        <el-button
                            type="danger"
                            size="small"
                            icon="close"
                            @click="delLine(tab.name)"
                        >删除行</el-button>
                    </div>

                    <!--table-->
                    <t8t-table
                        :preLoad="_return(tab.preLoad, false)"
                        v-if="tab.type ==='table'"
                        :columns="tab.fields"
                        :service="tab.service"
                        :method="tab.method"
                        :args="tab.args"
                        :editable="(mode === 'edit') ? true : (mode !== 'view' && !disabled)"
                        :ref="tab.name"
                        :commonData="tab.options || {}"
                        :indexCol="_return(tab.indexCol, true)"
                        :selectCol="_return(tab.selectCol, true)"
                        :radioCol="_return(tab.radioCol, false)"
                        :isLoading="_return(tab.isLoading, false)"
                        :pageBar="_return(tab.pageBar, true)"
                        :currentPage="tab.currentPage || 1"
                        :pageSize="tab.pageSize"
                        :customColumn="tab.customColumn"
                        :indexField="tab.indexField"
                        :templateData="tab.templateData"
                        :formatters="tab.formatters"
                        :expandCol="tab.expandCol"
                        @selection-change="selectionChange"
                        @row-double-click="rowDbClick"
                        @current-row-change="currentRowChange"
                        @current-page-change="currentPageChange"
                        @size-change="sizeChange"
                        @sort-change="sortChange"
                        @row-click="rowClick"
                        @cell-editor-change="onEditorChange"
                        @cell-click="onCellClick"
                        @data-loaded="tableLoaded(tab.name, arguments[0])"
                    ></t8t-table>

                    <!--panel-->
                    <div class="sub-panel" v-else-if="tab.type === 'panel' && tab.fields " >
                        <el-form :ref="tab.name"
                                 label-position="right"
                                 label-width="120px"
                                 :model="tab.dataSource"
                                 :show-message="mode !== 'view'"
                        >
                            <base-panel
                                :dataSource="tab.dataSource"
                                :fields="tab.fields"
                                :mode="mode"
                                :disabled="disabled"
                                :options="tab.options || {}"
                            ></base-panel>
                        </el-form>
                    </div>

                </div>

                <div class="sub-panel" v-if="tab.field_groups">
                    <el-form :ref="tab.name"
                             label-position="right"
                             label-width="120px"
                             :model="tab.dataSource"
                             :show-message="mode !== 'view'"
                    >
                        <div class="field_container" v-for="group in tab.field_groups">
                        <h2>{{group.label}}</h2>

                            <base-panel
                                :dataSource="tab.dataSource"
                                :fields="group.fields"
                                :mode="mode"
                                :disabled="disabled"
                                :options="tab.options || {}"
                            ></base-panel>

                    </div>
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    // import T8tFormPopup from 'src/components/t8t-form-popup/t8t-form-popup.vue'
    import T8tDatetimePicker from 'src/components/t8t-form/dateTimePicker.vue'
    import Utils from 'src/utils/Utils.js'
    import axios from 'src/utils/axios.js'
    import BasePanel from './panel.vue'
    import DateUtils from 'src/utils/DateUtils.js'
    export default {
        name: 't8t-sub-panel',
        components: {T8tDatetimePicker, BasePanel},
        data() {
            return {
                activeTab: '',
                sourceMap: {},
                columns: {}
            }
        },
        watch: {
        },
        props: {
            dataSource: Object,
            pSource: Object,
            schema: [Object, Array],
            disabled: {
                type: Boolean,
                default: false
            },
            rules: Object,
            service: String,
            method: String,
            args: Object,
            mode: {
                type: String,
                default: 'view'
            },
            endFormater: {
                type: String,
                default: 'timestamp'
            }
        },
        beforeCreate () {

        },
        created() {

            let that = this, schema = this.schema, fieldCache
            if (schema && schema.length > 0) {
                schema.forEach((item, key) => {
                    if (item.isActive || key === 0) {
                        that.activeTab = item.name
                    }

                    that.sourceMap[item.name] = {
                        type: item.type,
                        service: item.service,
                        method: item.method,
                        index: key,
                        name: item.name || null
                    }

                    if (!that.columns[item.name]) fieldCache = that.columns[item.name] = {}

                    if (item.field_groups) {
                        item.field_groups.forEach((group) => {

                            if (group.fields) {
                                group.fields.forEach((field) => {
                                    fieldCache[field.prop] = {
                                        labal: field.prop,
                                        type: field.type
                                    }
                                })
                            }

                        })
                    } else if (item.fields) {
                        item.fields.forEach((field) => {
                            fieldCache[field.prop] = {
                                labal: field.prop,
                                type: item.type === 'table' ? (field.editor.type || null) : field.type
                            }
                        })
                    }

                })
            }

        },
        methods: {
            tableLoaded (name, dataSource) {
                this.$emit('table-data-loaded', name, dataSource)
            },
            selectionChange (selRows, selIDs, selIndexes) {
                this.$emit('table-selection-change', this, selRows, selIDs, selIndexes)
            },
            rowDbClick (row, event) {
                this.$emit('table-row-dobule-click', this, row, event)
            },
            currentRowChange (currentRow, oldCurrentRow) {
                this.$emit('table-current-row-change', this, currentRow, oldCurrentRow)
            },
            currentPageChange (pageNum) {
                this.$emit('table-current-page-change', this, pageNum)
            },
            sizeChange (sizeNum) {
                this.$emit('table-size-change', this, pageNum)
            },
            sortChange (column, prop, order) {
                this.$emit('table-sort-change', this, column, prop, order)
            },
            rowClick (row, event, column) {
                this.$emit('table-row-click', this, row, event, column)
            },
            onEditorChange (cell, val) {
                this.$emit('table-cell-editor-change', this, cell, val)
            },
            onCellClick (cell, val) {
                this.$emit('table-cell-click', this, cell, val)
            },
            getTableInstance (ref) {
                return this.$refs[ref] ? this.$refs[ref][0] : null;
            },
            getPanelInstance (ref) {
                return this.$refs[ref] ? this.$refs[ref][0] : null;
            },
            addLine(ref) {
                this.$refs[ref][0].addNewRow()
            },
            delLine(ref) {
                this.$refs[ref][0].delRows()
            },
            getAddForm () {
                let key, map, formData = {}, actionLog, beanName

                for (key in this.sourceMap) {
                    map = this.sourceMap[key]
                    beanName = this.sourceMap[key].name

                    // 表格是一对多，有增删改
                    if (map.type == 'table') {
                        actionLog = this.$refs[key][0].getActionLog(false, true)
                        formData[beanName + 'List'] = this._format(actionLog.addedRows, key);
                    }
                    // 一对一只有改
                    else {
                        formData[beanName] = this.schema[map.index].dataSource
                    }
                }

                return formData
            },
            getEditForm () {
                let key, map, formData = {}, actionLog, beanName
                for (key in this.sourceMap) {
                    map = this.sourceMap[key]
                    beanName = this.sourceMap[key].name

                    // 表格是一对多，有增删改
                    if (map.type == 'table') {
                        actionLog = this.$refs[key][0].getActionLog(false, true)
                        formData[beanName+'List'] = [].concat(this._format(actionLog.addedRows, key), this._format(actionLog.editedRows, key));
                        formData[beanName+'DeleteIds'] = actionLog.deletedIDs;
                    }
                    // 一对一只有改
                    else {
                        formData[beanName] = this.schema[map.index].dataSource
                    }
                }

                return formData
            },
            formatTimestamp (date) {
                return Math.round((new Date(date) / 1000))
            },
            _format (formData, name) {
                let type, that = this, _copy = [], _temp

                if (formData) {
                    formData.forEach((data, key) => {
                        _temp = {}
                        for (let i in data) {
                            if (that.columns[name][i] !== undefined) {
                                type = that.columns[name][i].type;
                            } else {
                                type = "";
                            }

                            if (['date', 'datetime'].indexOf(type) !== -1) {
                                if (that.endFormater === 'timestamp') {
                                    _temp[i] = this.formatTimestamp(data[i])
                                } else {
                                    _temp[i] = DateUtils( new Date(data[i]), that.endFormater )
                                }
                            } else {
                                _temp[i] = data[i]
                            }
                        }

                        _copy.push(_temp)
                    })
                }

                return _copy
            },
            validate (cb, key) {
                let k = key || 0, that = this

                if (!this.schema || !this.schema.length) {
                    cb(true)
                    return
                }

                this.$refs[this.schema[k].name][0].validate((isValid) => {
                    k++
                    if (k >= that.schema.length || !isValid) {
                        cb(isValid)
                        return
                    }

                    that.validate(cb, k)
                })
            },
            merged (src, target) {
                for (let k in src) {
                    if (src[k]) {
                        src[k] = target[k]
                    }
                }

                return src
            },
            load () {

                if (!this.mode == 'view' || !this.mode =='edit') return

                let self = this
                let schema = this.schema, args, service, method, temp, argsString

                schema.forEach((subSchema, key) => {

                    service = subSchema.service
                    method = subSchema.method

                    if (service && method) {
                        args = subSchema.args || {}
                        argsString = JSON.stringify(args)

                        argsString = argsString.replace(/\@([a-zA-Z]+)/g, function(word, $1) {
                            return self.pSource[$1]
                        })

                        eval(' temp =  ' + argsString)
                        args = temp

                        // 列表查询模式
                        if (subSchema.type === 'table') {
                            args.page = subSchema.page || 1
                            args.size = subSchema.pageSize || 20
                            schema[key].args = args
                        } else {
                            args.page = 1;
                            args.size = 1;
                            axios({
                                service: service,
                                method: method,
                                args: args
                            })
                            .then((res) => {
                                let response = res.data
                                if (response && response.status == 200) {
                                    self.schema[key].dataSource = response.result
                                    this.$emit('data-loaded', key, self.schema[key].dataSource)
                                }
                            })
                            .catch((res) => {
                                // TODO 数据加载失败
                                console.log("load data failed.", res)
                                // self.$message.error('表格数据加载失败')
                            })
                        }
                    }

                });
            },
            _return(val, d) {
                if(val === true || val === false) {
                    return val
                }
                return d
            }
        }
    }

</script>

<style lang="css" scoped>
    .sub-panel {
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
        overflow: hidden;
    }
    .my-toolbar {
        margin-bottom: 10px;
    }
    .t8t-detail{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .sub-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-top: 10px;
    }
</style>
