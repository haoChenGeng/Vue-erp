<template>
    <div class="t8t-panel" :class="{'isHide': isTopHide}">

        <!-- 收缩展开按钮 -->
        <div style="height: 13px;">
            <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
        </div>


        <el-form ref="form"
                 label-position="right"
                 label-width="120px"
                 :model="dataSource"
                 :show-message="mode !== 'view'"
        >
            <!-- 有页签 -->
            <el-tabs v-if="schema.tabs && schema.tabs.length > 0" v-model="activeTab">
                <el-tab-pane v-for="tab in schema.tabs" :label="tab.label" :name="tab.name">
                    <!-- 有页签加分组展示 -->

                    <div class="field_container" v-if="tab.fields && tab.fields.length > 0">

                        <base-panel
                            :dataSource="dataSource"
                            :fields="tab.fields"
                            :mode="mode"
                            :disabled="disabled"
                            :options="schema.options || {}"
                            :ref="tab.name"
                            @click="handleClick"
                            @blur="handleBlur"
                            @focus="handleFocus"
                            @change="handleChange"
                            @select-change="handleSelectChange"
                        ></base-panel>


                    </div>
                    <div class="field_container" v-else-if="tab.field_groups && tab.field_groups.length > 0" v-for="group in tab.field_groups">
                        <h2>{{group.label}}</h2>

                        <base-panel
                            :dataSource="dataSource"
                            :fields="group.fields"
                            :mode="mode"
                            :disabled="disabled"
                            :options="schema.options || {}"
                            :ref="tab.name"
                            @click="handleClick"
                            @blur="handleBlur"
                            @focus="handleFocus"
                            @change="handleChange"
                            @select-change="handleSelectChange"
                        ></base-panel>

                    </div>

                </el-tab-pane>
            </el-tabs>

            <div v-else-if="schema.field_groups && schema.field_groups.length > 0" v-for="group in schema.field_groups" class="field_container">
                <h2>{{group.label}}</h2>

                <base-panel
                    :dataSource="dataSource"
                    :fields="group.fields"
                    :mode="mode"
                    :disabled="disabled"
                    :options="schema.options || {}"
                    ref="groups_panel"
                    @click="handleClick"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    @change="handleChange"
                    @select-change="handleSelectChange"
                ></base-panel>

            </div>

            <div v-else-if="schema.fields && schema.fields.length > 0" class="field_container">

                <base-panel
                    :dataSource="dataSource"
                    :fields="schema.fields"
                    :mode="mode"
                    :disabled="disabled"
                    :options="schema.options || {}"
                    ref="fields_panel"
                    @click="handleClick"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    @change="handleChange"
                    @select-change="handleSelectChange"
                ></base-panel>

            </div>

        </el-form>
    </div>
</template>

<script>
    // import T8tFormPopup from 'src/components/t8t-form-popup/t8t-form-popup.vue'
    import BasePanel from './panel.vue'
    import T8tDatetimePicker from 'src/components/t8t-form/dateTimePicker.vue'
    import Utils from 'src/utils/Utils.js'
    import axios from 'src/utils/axios.js'

    export default {
        name: 't8t-panel',
        components: {
            // T8tFormPopup,
            T8tDatetimePicker,
            BasePanel
        },
        data() {
            return {
                showDlgViewer: false,
                uploadURL: Utils.getUploadURL(),
                activeTab: '',
                isTopHide: false,
                mode: '',
                endFormater: 'timestamp',

            }
        },
        props: {
            dataSource: Object,
            commonData: Object,
            schema: [Object, Array],
            disabled: {
                type: Boolean,
                default: false
            },
            rules: Object,
            // 展示模式，view表示查看模式，edit表示修改模式，默认修改模式
            service: String,
            method: String,
            args: Object,
            params: Object,
            beforeLoad: Function,
            mode: {
                type: String,
                default: 'view'
            }
        },
        beforeCreate () {

        },
        created() {
            let that = this, schema = this.schema
            if (schema.tabs && schema.tabs.length > 0) {
                schema.tabs.forEach((item, key) => {
                    if (item.isActive || key === 0) {
                        that.activeTab = item.name
                    }
                })
            }

            if (this.mode == 'view' || this.mode == 'edit') this.load()
        },
        methods: {
            load () {
                let self = this
                let schema = this.schema, args = schema.args || {}

                if (schema.service && schema.method) {
                    this.loading = true
                    axios({
                        service: schema.service,
                        method: schema.method,
                        args: args
                    })
                        .then((res) => {
                            let response = res.data
                            if (response && response.status == 200) {
                                self.merged(response.result)
                                self.$emit('loaded', self.dataSource)
                            }
                        })
                        .catch((res) => {
                            // TODO 数据加载失败
                            console.log("panel load data failed.", res)
                            // self.$message.error('表格数据加载失败')
                        })
                } else {
                    // TODO 没有传service和method参数处理
                }
            },
            merged (src) {
                let that = this
                for (let k in this.dataSource) {
                    if (src[k] !== undefined) {
                        that.dataSource[k] = src[k]
                    }
                }
            },
            getUploadData (data) {
                return Object.assign({}, data, {bucket: 'scm'})
            },
            submit() {

            },
            validate(callback) {
                let valid = true
                this.$refs['form'].validate((isValid) => {
                    if (isValid) {
                        valid = true
                    } else {
                        valid = false
                    }
                    callback(valid)
                })
            },
            resetFields() {
                this.$refs['form'].resetFields()
            },
            showViewer(prcUrl) {
                this.$refs['dlgViewer'].open()
            },
            handleFieldButtonClick(field) {
                this.$emit('field-button-click', field)
            },
            getInstance () {
                return this.$refs['form'];
            },
            onTopHide () {
                this.isTopHide = !this.isTopHide
            },
            handleEditorChange(val) {
                this.$emit('change', val)
            },
            getPanelInstance (ref) {
                return this.$refs[ref] ? this.$refs[ref][0] : null;
            },
            getFormInstance () {
                return this.$refs['form']
            },
            handleClick (context, field, event) {
                this.$emit('click', context, field, event)
            },
            handleBlur (context, field, event) {
                this.$emit("blur", context, field, event)
            },
            handleFocus (context, field, event) {
                this.$emit('focus', context, field, event)
            },
            handleChange (context, prop, value) {
                this.$emit('change', context, prop, value);
            },
            handleSelectChange (value, name) {
                this.$emit('select-change', value, name);
            }
        }
    }

</script>

<style
    lang="css"
    scoped
>

    .field_container {
        width: 100%;
        padding-top: 10px;
    }

    .field_container h2 {
        margin: 10px 0;
    }

    .detail-align-center {
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
        overflow: hidden;
        margin-top: 0 !important;
    }

    /*form-panel*/
    .t8t-panel {
        max-width: 1220px;
        min-width: 600px;
        overflow: hidden;
    }

    .t8t-detail-form {
        margin-top: 22px;
    }

    .group-form {
        margin-top: 0;
    }

    .t8t-panel .el-form {
        width: 100%;
    }

    .t8t-panel .el-form .el-row {
        width: 100%;
    }

    .t8t-panel .el-form .el-col {
        /*min-height: 60px;*/
    }

    .t8t-detail-form .el-form .el-col {
        min-height: 0;
    }

    .t8t-panel .el-form-item__label {
        color: #333;
        font-size: 12px;
    }

    .t8t-detail-form .el-form-item {
        margin-bottom: 12px;
    }

    .t8t-panel .el-input,
    .t8t-panel .el-select {
        width: 100%;
    }

    .t8t-panel .el-input .el-input__inner {
        color: #666;
        font-size: 12px;
    }

    .t8t-panel .el-form-item.is-required .el-form-item__label:before {
        font-family: "simsun";
        font-weight: bold;
        color: rgb(216, 0, 0);
        content: '*';
    }

    .t8t-panel .el-rate {
        text-align: center;
        padding: 6px 0;
    }

    .t8t-panel .el-rate__icon {
        font-size: 20px;
    }

    .t8t-panel .el-form-item__error {
        padding-top: 0;
    }

    .t8t-panel .el-form-item {
        margin-bottom: 20px;
    }

    .t8t-panel .el-date-editor.el-input {
        width: 175px;
    }

    .t8t-detail-form .el-form-item__error {
        padding-top: 0;
    }

    .top-hide {
        position: absolute;
        top: 0;
        right: 50%;
        z-index: 1;
        transform: rotate(90deg);
        cursor: pointer;
    }
    .t8t-panel.isHide {
        height: 13px;
        padding-top: 0;
        overflow: hidden;
    }
    .t8t-panel.isHide .top-hide{
        transform: rotate(-90deg);
    }
</style>


<style>
</style>
