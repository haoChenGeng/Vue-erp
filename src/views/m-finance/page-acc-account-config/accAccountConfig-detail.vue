<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new" >
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @EDIT-SUBMIT="submit()"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                    <div class="toggle-btn-container">
                        <div class="toggle-btn el-icon-d-arrow-left" @click="onTopHide"></div>
                    </div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">

                        <el-form ref="mainTable"
                                 label-position="right"
                                 label-width="120px"
                                 :model="dataSource"
                                 :show-message="mode !== 'view'"
                        >
                            <div class="field_container">
                                <base-panel
                                    :dataSource="dataSource"
                                    :fields="mainTable.fields"
                                    :mode="mode"
                                    :disabled="disabled"
                                    :options="options || {}"
                                    ref="fields_panel"
                                    @click="handleClick"
                                    @blur="handleBlur"
                                    @focus="handleFocus"
                                    @change="handleChange"
                                ></base-panel>

                            </div>
                            
                        </el-form>
                    </div>

                    
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import axios from 'src/utils/axios.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import schema from './accAccountConfig-schema'

    export default {
        name: 't8t-dt-view',
        components: {BasePanel},
        data () {
            return {
                id: null,
                mode: "",
                // 主表绑定数据源
                dataSource: {
                    id: null,
                    userTypeCode: null,
                    accountTypeCode: null,
                    accountLevel: null,
                    unitCode: null,
                    parentAccountTypeCode: null,
                    parentUserTypeCode: null,
                    isOverdraft: null,
                    status: null,
                    overdraftType: null,
                    overdraftCredit: null,
                    createUser: null,
                    createName: null,
                    createBy: null,
                    createTime: null,
                    updateUser: null,
                    updateName: null,
                    updateBy: null,
                    updateTime: null
                },
                // 附表绑定数据源，只有panel（一对一）形式展示的需要绑定，table（一对多）的不需要
                subDataSource: {
                },
                // 所有配置全部初始化在这里
                options: {
                    userTypeCode: [
                    ],
                    accountLevel: [
                    ],
                    unitCode: [
                    ],
                    parentAccountTypeCode: [
                    ],
                    parentUserTypeCode: [
                    ],
                    isOverdraft: [
                    ],
                    status: [
                    ],
                    overdraftType: [
                    ]
                },
                schema: schema,
                subTables: schema.subTables,
                mainTable: schema.mainTable,
                // 控制主表区域收缩
                isTopHide: false,
                isDialogShow: true,
                // 主表tab默认激活页
                mainActiveTab: '',
                // 附表tab默认激活页
                subActiveTab: '',
                // 点击关闭后的返回route
                goBackRoute: '/test/resume',
                sourceMap: {},
                columns: {}
            }
        },
        created () {
            // 初始化通用query
            this.id = this.$route.query.id
            this.mode = this.$route.query.mode || 'add'
            schema.mainTable.args.id = this.id

            // 初始化主附表
            this.initMainTable()
            this.initSubTable()
        },
        methods: {
            onTopHide () {
                this.isTopHide = !this.isTopHide
            },
            /**
             * 初始化附表
             */
            initSubTable () {
                let that = this, schema = this.subTables, fieldCache
                if (schema && schema.length > 0) {
                    schema.forEach((item, key) => {
                        // 附表页签初始化选中项
                        if (item.isActive || key === 0) {
                            that.subActiveTab = item.name
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
            /**
             * 初始化主表
             */
            initMainTable () {
                // 初始化tab页中的激活选项
                if (schema.mainTable.tabs && schema.mainTable.tabs.length > 0) {
                    schema.mainTable.tabs.forEach((item, key) => {
                        if (item.isActive || key === 0) {
                            this.mainActiveTab = item.name
                        }
                    })
                }

                // 在查看和修改模式下需要初始化加载数据
                if (this.mode == 'view' || this.mode == 'edit') this.loadMainTable()
            },
            /**
             * 加载主表数据
             */
            loadMainTable () {
                let self = this
                let mainTableSchema = schema.mainTable, args = mainTableSchema.args || {}

                if (mainTableSchema.service && mainTableSchema.method) {
                    this.loading = true
                    axios({
                        service: mainTableSchema.service,
                        method: mainTableSchema.method,
                        args: args
                    })
                        .then((res) => {
                            let response = res.data
                            // 数据加载成功
                            if (response && response.status == 200) {
                                this.dataSource = Object.assign({}, schema.mainTable.dataSource, response.result)
                                self.loadSubTable()
                            }
                        })
                        .catch((res) => {
                            // TODO 数据加载失败
                            console.error("panel load data failed.", res)
                            // self.$message.error('表格数据加载失败')
                        })
                } else {
                    // TODO 没有传service和method参数处理
                }
            },
            /**
             * 加载附表数据
             */
            loadSubTable () {

                if (!this.mode == 'view' || !this.mode =='edit') return

                let self = this
                let schema = this.subTables, args, service, method, temp, argsString

                schema.forEach((subSchema, key) => {

                    service = subSchema.service
                    method = subSchema.method

                    if (service && method) {
                        args = subSchema.args || {}
                        argsString = JSON.stringify(args)
                        argsString = argsString.replace(/\@([a-zA-Z]+)/g, function(word, $1) {
                            return self.dataSource[$1]
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
                                        self.subDataSource[key] = response.result
//                                        self.schema[key].dataSource = response.result
                                    }
                                })
                                .catch((res) => {
                                    // TODO 数据加载失败
                                    console.error("load data failed.", res)
                                    // self.$message.error('表格数据加载失败')
                                })
                        }
                    }

                });
            },
            /**
             * 主表表单校验
             * @param callback
             */
            validateMainTable(callback) {
                this.$refs['mainTable'].validate((isValid) => {
                    callback && callback(isValid)
                })
            },
             /**
             * 新增行
             * @param tabName
             */
            addLine (tabName) {
                this.$refs[tabName].addNewRow()
            },
            /**
             * 删除行
             * @param tabName
             */
            delLine (tabName) {
                this.$refs[tabName].delRows()
            },
            /**
             * 关闭弹窗
             */
            closeDialog () {
                this.$router.push({ path: this.goBackRoute })
                this.$emit('close')
            },
            /**
             * 点击提交后的动作处理
             */
            submit () {
                let that = this
                that.validate((isValid) => {
                    // 校验通过 提交
                    let method = that.getMethod()

                    if (isValid) {
                        axios({
                            service: that.mainTable.service,
                            method: method,
                            args: that.formatParams()
                        })
                            .then((res) => {
                                // TODO 修改提交后处理
                                if (res.data && res.data.status === 200) {
                                    this.$message({
                                        type:'success',
                                        message: '提交成功'
                                    })
                                } else {
                                    // TODO 失败处理
                                    this.$message.error('操作失败')
                                }
                            })
                            .catch((err) => {
                                // TODO 提交错误处理
                            })
                    }
                })
            },
            /**
             * 通过不同的mode获取不同的方法，用于不同场景的提交数据
             * @returns {*}
             */
            getMethod () {
                if (this.mode === 'add') {
                    return this.mainTable.createMethod
                } else if (this.mode === 'edit') {
                    return this.mainTable.updateMethod
                } else {
                    return this.mainTable.method
                }
            },
            /**
             * 对整个页面数据进行校验
             * @param cb 校验完成后的回调函数，回调参数为校验结果（true|false）
             */
            validate (cb) {
                let that = this
                that.validateMainTable((isValid) => {
                    if (isValid) {
                        that.validateSubTables((isSubValid) => {
                            cb && cb(isSubValid)
                        })
                    } else {
                        cb && cb(isValid)
                    }
                })
            },
            /**
             * 附表参数校验
             * @param cb 回调函数
             * @param key
             */
            validateSubTables (cb, key) {
                let k = key || 0, that = this

                if (!this.subTables || !this.subTables.length) {
                    cb && cb(true)
                    return
                }

                // 通过schema中的定义的tab.name去递归遍历校验

                this.$refs[this.subTables[k].name].validate((isValid) => {
                    k++
                    if (k >= that.subTables.length || !isValid) {
                        cb(isValid)
                        return
                    }

                    that.validateSubTables(cb, k)
                })
            },
            /**
             * 组装提交参数（将主表和附表数据以后台标准协议组装）
             */
            formatParams () {
                let args = {}, subDto = {}
                let mainDto = this.dataSource

                if (this.mode === 'edit') {
                    subDto = this.getEditForm()
                } else if (this.mode === 'add') {
                    subDto = this.getAddForm()
                } else {

                }

                args[this.mainTable.name] = Object.assign({}, mainDto, subDto)

                return args
            },
            getAddForm () {
                let key, map, formData = {}, actionLog, beanName

                for (key in this.sourceMap) {
                    map = this.sourceMap[key]
                    beanName = this.sourceMap[key].name

                    // 表格是一对多，有增删改
                    if (map.type == 'table') {
                        actionLog = this.$refs[key].getActionLog(false, true)
                        formData[beanName + 'List'] = actionLog.addedRows;
                    }
                    // 一对一只有改
                    else {
                        formData[beanName] = this.subDataSource[map.name]
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
                        actionLog = this.$refs[key].getActionLog(false, true)
                        formData[beanName+'List'] = [].concat(actionLog.addedRows, actionLog.editedRows);
                        formData[beanName+'DeleteIds'] = actionLog.deletedIDs;
                    }
                    // 一对一只有改
                    else {
                        formData[beanName] = this.subDataSource[map.name]
                    }
                }

                return formData
            }
        }
    };
</script>

<style lang="css" scoped>
    /*.full-dialog-form-container {*/
        /*position: relative;*/
    /*}*/
</style>

<style>

</style>
