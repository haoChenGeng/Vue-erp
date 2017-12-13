<template>
    <div>
        <el-row :gutter="5">
        <el-col :span="6"
                :md="6"
                :sm="8"
                :xs="12"
                v-for="field in fields">
            <el-form-item :label="field.label?field.label+'：':''"
                          :prop="field.prop"
                          :rules="field.rules || []">
                <el-input v-if="field.type==='input' || field.type==='textarea'"
                          :type="field.type || 'input'"
                          :rows="field.rows || 2"
                          v-model="dataSource[field.prop]"
                          :disabled="(mode === 'view') ? true : (mode !== 'view' && !disabled && field.disabled)"
                          @click="handleClick(field, $event)"
                          @blur="handleBlur(field, $event)"
                          @focus="handleFocus(field, $event)"
                          @change="handleChange(field.prop)"
                ></el-input>
                <el-input
                    v-if="field.type === 'input' && field.inputType === 'textarea' "
                    :type="field.type || 'input'"
                    :rows="field.rows || 2"
                    v-model="dataSource[field.prop]"
                    :disabled="(mode === 'view') ? true : (mode !== 'view' && !disabled && field.disabled)"
                    @click="handleClick"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    @change="handleChange(field.prop)"
                >
                </el-input>
                <el-input v-if="field.type==='number'"
                          v-model.number="dataSource[field.prop]"
                          :disabled="(mode === 'view') ? true : (mode !== 'view' && !disabled && field.disabled)"
                          @click="handleClick"
                          @blur="handleBlur"
                          @focus="handleFocus"
                          @change="handleChange(field.prop)"
                ></el-input>
                <el-button v-else-if="field.type==='button'"
                           size="small"
                           @click="handleFieldButtonClick(field)"
                           :disabled="(mode === 'view') ? true : (mode !== 'view' && !disabled && field.disabled)">
                    {{field.text}}

                </el-button>
                <el-select v-else-if="field.type==='el-select'"
                           v-model="dataSource[field.prop]"
                           placeholder="请选择"
                           :disabled="(mode === 'view') ? true : (mode !== 'view' && !disabled && field.disabled)"
                           @change="onElSelectChange(arguments[0], field.prop)"
                           :name="field.prop"
                >
                    <el-option v-for="item in options[field.list]"
                               :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
                <!-- 这里要替换成t8t-form-select，但是因为参数校验问题还没解决，先暂时用这个 -->
                <el-select v-else-if="field.type==='select'"
                           v-model="dataSource[field.prop]"
                           placeholder="请选择"
                           :disabled="(mode === 'view') ? true : (mode !== 'view' && !disabled && field.disabled)"
                           @change="onElSelectChange(arguments[0], field.prop)"
                           :name="field.prop"
                >
                    <el-option v-for="item in options[field.list]"
                               :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
                <t8t-form-select
                    v-if="field.type==='t8t-select'"
                    :defaultValue="field.defaultValue"
                    :bindValue="dataSource[field.name]"
                    :name="field.prop"
                    :placeholder="field.placeholder"
                    :filterable="field.filterable"
                    :allowCreate="field.allowCreate"
                    :multiple="field.multiple"
                    :disabled="(mode === 'view') ? true : (mode !== 'view' && !disabled && field.disabled)"
                    :options="(field.list) ? options[field.list] : null"
                    :size="field.size"
                    :clearable="field.clearable"
                    :multipleLimit="field.multipleLimit"
                    :filterMethod="field.filterMethod"
                    :remote="field.remote"
                    :service="field.service"
                    :method="field.method"
                    :remoteArgs="field.remoteArgs"
                    :remoteQueryKey="field.remoteQueryKey"
                    :loading="field.loading"
                    :loadingText="field.loadingText"
                    :noMatchText="field.noMatchText"
                    :noDataText="field.noDataText"
                    :popperClass="field.popperClass"
                    :isGroup="field.isGroup"
                    :optionsService="field.optionsService"
                    :optionsMethod="field.optionsMethod"
                    :optionsArgs="field.optionsArgs"
                    :textField="field.textField"
                    :valueField="field.valueField"
                    @remoteOptionsFilter="field.remoteOptionsFilter"
                    @change="onSelectChange"
                    @visible-change="onVisibleChange"
                >
                </t8t-form-select>
                <t8t-datetime-picker
                    v-else-if="field.type==='datetime'||field.type==='date'||field.type==='time'"
                    v-model="dataSource[field.prop]"
                    :bindValue="(dataSource[field.prop]===null||dataSource[field.prop]===0)?'':dataSource[field.prop]"
                    :style="{width:'100%',height:'100%'}"
                    :placeholder="field.placeholder"
                    :type="field.type || 'date'"
                    :endFormater="field.endFormater || endFormater"
                    :clearable="field.clearable || true"
                    :align="field.align"
                    :poper-class="field.poperClass"
                    :range-separator="field.rangeSeparator"
                    :disabled="(mode === 'view') ? true : (mode !== 'view' && !disabled && field.disabled)"
                    :readonly="field.readonly"
                    :picker-options="field.pickerOptions"
                    @change="dateTimePickerChange"
                >
                </t8t-datetime-picker>
                <el-rate v-else-if="field.type==='rate'"
                         v-model="dataSource[field.prop]"
                         :disabled="(mode === 'view') ? true : (mode !== 'view' && !disabled && field.disabled)"></el-rate>
                <el-input-number v-else-if="field.type==='input-number'"
                                 v-model="dataSource[field.prop]"
                                 :style="{width:'100%'}"
                                 :disabled="(mode === 'view') ? true : (mode !== 'view' && !disabled && field.disabled)"
                ></el-input-number>
                <el-switch v-else-if="field.type==='switch'"
                           v-model="dataSource[field.prop]"
                           :disabled="(mode === 'view') ? true : (mode !== 'view' && !disabled && field.disabled)"></el-switch>
                <el-slider v-else-if="field.type==='slider'"
                           v-model="dataSource[field.prop]"
                           :style="{width:'95%',margin:'0 auto'}"
                           :disabled="(mode === 'view') ? true : (mode !== 'view' && !disabled && field.disabled)"></el-slider>
                <t8t-form-popup v-else-if="field.type==='popup'"
                                :bindValue="value"
                                :style="{width:'100%',height:'100%'}">
                </t8t-form-popup>
                <el-upload
                    v-model="dataSource[field.prop]"
                    v-else-if="field.type==='file' && (mode == 'add' || mode === 'edit')"
                    :action="uploadURL"
                    :headers="field.headers || {}"
                    :multiple="field.multiple || false"
                    :data="field.data ? getUploadData(field.data) : {bucket:'scm'}"
                    :name="field.formName || 'file'"
                    :show-file-list="field.showFileList || true"
                    :on-preview="field.onPreview || onPreview"
                    :on-remove="field.onRemove || onRemove"
                    :on-success="field.onSuccess || onSuccess"
                    :on-error="field.onError || onError"
                    :on-progress="field.onProgress || onProgress"
                    :on-change="field.onChange || onChange"
                    :before-upload="field.beforeUpload || null"
                    :accept="field.accept || 'image/*'"
                >
                    <el-button size="small">{{field.text || '上传文件'}}</el-button>
                </el-upload>
                <slot
                    slot="id"
                    scope="scope"
                    :name="field.prop"
                    v-if="field.type==='file' && (mode ==='view')"
                >
                    <el-button type="small"
                               @click.stop="handleFileView(field.onFileViewClick, dataSource[field.prop])">{{field.text || '查看'}}</el-button>
                </slot>
                <slot v-else-if="!field.type"
                      :name="field.prop">
                    {{dataSource[field.prop]}}
                </slot>

            </el-form-item>
        </el-col>
    </el-row>
        <t8t-gallery
            v-model="galleryVisible"
            :data="galleryData"
        ></t8t-gallery>
    </div>
</template>

<script>
    import T8tFormSelect from './t8t-form-select.vue'
    import T8tDatetimePicker from 'src/components/t8t-form/dateTimePicker.vue'
    import panelProps from './panel.props'
    import Utils from 'src/utils/Utils.js'
    export default {
        name: 'base-panel',
        components: {
            T8tDatetimePicker,
            T8tFormSelect
        },
        props: panelProps,
        data () {
            return {
                endFormater: 'timestamp',
                uploadURL: Utils.getUploadURL(),
                galleryVisible: false,
                galleryData: []
            }
        },
        created () {

        },
        methods: {
            getUploadData (data) {
                return Object.assign({}, data, {bucket: 'scm'})
            },
            handleFileView (onFileViewClick, id) {
                onFileViewClick && onFileViewClick.call(this, id)
            },
            onPreview (file) {
                this.$emit('on-upload-preview', this, file);
            },
            onRemove (file, fileList) {
                this.$emit('on-upload-remove', this, file, fileList)
            },
            onSuccess (response, fileList) {
                this.$emit('on-upload-success', this, response, fileList)
            },
            onError (err, file, fileList) {
                this.$emit('on-upload-error', this, err, file, fileList)
            },
            onProgress (event, file, fileList) {
                this.$emit('on-upload-progress', this, event, file, fileList)
            },
            onChange (file, fileList) {
                this.$emit('on-upload-change', this, file, fileList)
            },
            handleClick (field, event) {
                this.$emit('click', this, field, event)
            },
            handleBlur (field, event) {
                this.$emit("blur", this, field, event)
            },
            handleFocus (field, event) {
                this.$emit('focus', this, field, event)
            },
            handleChange (prop) {
                this.$emit('change', this, prop, event.target.value)
            },
            onSelectChange: function(value, name) {
                this.$emit('select-change', value, name)
            },
            onVisibleChange: function(value) {
                this.$emit('select-visible-change', value,this.name)
            },
            onElSelectChange (value, prop) {
                this.$emit('select-change', value, prop)
            },
            dateTimePickerChange (date, formartDate) {
                this.$emit('date-change', date, formartDate)
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
