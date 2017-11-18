<template>
    <div class="t8t-form-panel">
        <el-form ref="form"
            label-position="right"
            label-width="120px"
            :model="dataSource">
            <el-row :gutter="5">
                <el-col :span="6"
                    :md="6"
                    :sm="8"
                    :xs="12"
                    v-for="field in fields">
                    <el-form-item :label="field.label?field.label+'：':''"
                        :prop="field.prop"
                        :rules="field.rules || []">
                        <el-input v-if="field.type==='input'"
                            v-model="dataSource[field.prop]"
                            :disabled="disabled || field.disabled || false"></el-input>
                        <el-input v-if="field.type==='number'"
                            v-model.number="dataSource[field.prop]"
                            :disabled="disabled || field.disabled || false"></el-input>
                        <el-button v-else-if="field.type==='button'"
                            size="small"
                            @click="handleFieldButtonClick(field)"
                            :disabled="disabled || field.disabled || false">{{field.text}}</el-button>
                        <el-select v-else-if="field.type==='select'"
                            v-model="dataSource[field.prop]"
                            placeholder="请选择"
                            :disabled="disabled || field.disabled || false">
                            <el-option v-for="item in commonData[field.list]"
                                :label="item.text"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-date-picker v-else-if="field.type==='datetime'||field.type==='date'||field.type==='time'"
                            v-model="dataSource[field.prop]"
                            :style="{width:'100%'}"
                            placeholder="请选择"
                            :type="field.type || 'date'"
                            :disabled="disabled || field.disabled || false">
                        </el-date-picker>
                        <el-rate v-else-if="field.type==='rate'"
                            v-model="dataSource[field.prop]"
                            :disabled="field.disabled || false"></el-rate>
                        <el-input-number v-else-if="field.type==='input-number'"
                            v-model="dataSource[field.prop]"
                            :style="{width:'100%'}"
                            :disabled="disabled || field.disabled || false"></el-input-number>
                        <el-switch v-else-if="field.type==='switch'"
                            v-model="dataSource[field.prop]"
                            :disabled="disabled || field.disabled || false"></el-switch>
                        <el-slider v-else-if="field.type==='slider'"
                            v-model="dataSource[field.prop]"
                            :style="{width:'95%',margin:'0 auto'}"
                            :disabled="disabled || field.disabled || false"></el-slider>
                        <t8t-form-popup v-else-if="field.type==='popup'"
                            :bindValue="value"
                            :ref="field.prop"
                            :records="field.records"
                            :textValue="field.textValue"
                            :defaultValue="field.defaultValue"
                            :filedValue="field.filedValue"
                            :name="field.prop"
                            :placeholder="field.placeholder"
                            :disabled="field.disabled"
                            :icon="field.icon"
                            :onIconClick="field.onIconClick"
                            :dialog="field.dialog"
                            :style="{width:'100%',height:'100%'}"
                            @change="onChange"
                            >
                        </t8t-form-popup>
                        <t8t-lookup v-else-if="field.type==='lookup'"
                            :style="{width:'100%',height:'100%'}"
                            :value="value"
                            :size="field.size"
                            :placeholder="field.placeholder"
                            :searchPlaceholder="field.searchPlaceholder"
                            :disabled="field.disabled"
                            :readonly="field.readonly"
                            :service="field.service"
                            :method="field.method"
                            :dataSource="field.dataSource"
                            :args="field.args"
                            :columns="field.columns"
                            :searchExpr="field.searchExpr"
                            :valueExpr="field.valueExpr"
                            :toolbar="field.toolbar"
                            :multiple="field.multiple"
                            :filter-method="field.filterMethod"
                            :selectable="field.selectable">
                        </t8t-lookup>
                        <slot v-else-if="!field.type"
                            :name="field.prop"
                            :field="field">
                            {{dataSource[field.prop]}}
                        </slot>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    // import T8tLookup from 'src/components/t8t-table/src/t8t-lookup.vue'
    export default {
        name: 't8t-form-panel',
        components: {
            T8tLookup
        },
        data() {
            return {
                showDlgViewer: false
            }
        },
        props: {
            dataSource: Object,
            commonData: Object,
            fields: Array,
            disabled: {
                type: Boolean,
                default: false
            },
            rules: Object
        },
        created() {

        },
        methods: {
            submit() {
                console.log('submitting')
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
            onChange(val,name){
                if(typeof val !== 'undefined'){
                    this.dataSource[name] = val;
                }
            }
        }
    }

</script>

<style>
    /*form-panel*/
    .t8t-form-panel {
        max-width: 1200px;
        min-width: 600px;
        padding: 15px 15px 0;
        overflow: hidden;
        margin: 0 auto;
    }

    .t8t-form-panel .el-form {
        width: 100%;
    }

    .t8t-form-panel .el-form .el-row {
        width: 100%;
    }

    .t8t-form-panel .el-form .el-col {
        /*min-height: 60px;*/
    }

    .t8t-form-panel .el-form-item__label {
        color: #333;
        font-size: 12px;
    }

    .t8t-form-panel .el-input,
    .t8t-form-panel .el-select {
        width: 100%;
    }

    .t8t-form-panel .el-input .el-input__inner {
        color: #666;
        font-size: 12px;
    }

    .t8t-form-panel .el-form-item.is-required .el-form-item__label:before {
        font-family: "simsun";
        font-weight: bold;
        color: rgb(216, 0, 0);
        content: '*';
    }

    .t8t-form-panel .el-rate {
        text-align: center;
        padding: 6px 0;
    }

    .t8t-form-panel .el-rate__icon {
        font-size: 20px;
    }

    .t8t-form-panel .el-form-item__error {
        padding-top: 0;
    }

    .t8t-form-panel .el-form-item {
        margin-bottom: 15px;
    }

    .t8t-form-panel .el-date-editor.el-input {
        width: 175px;
    }
</style>
