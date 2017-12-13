<template>
    <div class="t8t-form-select">
        <el-select
            v-model="value"
            :placeholder="placeholder"
            :filterable="filterable"
            :multiple="multiple"
            :disabled="disabled"
            :size="size"
            :clearable="clearable"
            :multiple-limit="multipleLimit"
            :allow-create="allowCreate"
            :filter-method="filterMethod"
            :remote="remote"
            :remote-method="remoteMethod?remoteMethod:queryRemote"
            :loading="loading"
            :loading-text="loadingText"
            :no-match-text="noMatchText"
            :no-data-text="noDataText"
            :popper-class="popperClass"
            :name="name"
            @change="onChange"
            @visible-change="onVisibleChange"
            >
            <el-option-group
                v-if="isGroup"
                v-for="group in options"
                :disabled="group.disabled"
                :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="remote?item.value:null"
                :label="item.text"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-option-group>
            <el-option
                v-if="!isGroup"
                v-for="p in realOptions"
                :key="remote?item.value:null"
                :label="p.text"
                :value="p.value"
                :disabled="p.disabled">
            </el-option>
        </el-select>
    </div>
</template>

<script>
import axios from 'src/utils/axios'
    export default {
        name: 't8t-form-select',
        data () {
            return {
                value: '',
                realOptions: []
            }
        },
        props: {
            bindValue: [Number, String],
            defaultValue: [Number, String],
            name: String,
            placeholder: {
                type: String,
                default: '--请选择--'
            },
            size: String,
            filterable: Boolean,
            multiple: Boolean,
            clearable:{
                type:Boolean,
                default: true
            },
            multipleLimit:Number,
            disabled: Boolean,
            options: {
                type: Array,
                default: []
            },
            allowCreate: Boolean,
            filterMethod: Function,
            remote: Boolean,
            remoteMethod: Function,
            service: String,
            method: String,
            remoteArgs: {
                type:Object,
                default: {}
            },
            remoteQueryKey: String,
            loading: Boolean,
            loadingText: String,
            noMatchText: String,
            noDataText: String,
            popperClass:String,
            isGroup: {
                type:Boolean,
                default: false
            },
            optionsService: String,
            optionsMethod: String,
            optionsArgs: Object,
            textField: String,
            valueField: String,
            remoteOptionsFilter: Function
        },
        created () {
            this._init()
        },
        watch: {
            bindValue: function () {
                this.value = this.bindValue;
            },
            options: function() {
                this.realOptions = this.options
            }
        },
        methods: {
            invalidOptions (options) {

            },
            _init: function() {
                // 暂时只支持非分组远程数据源, 且在已配置options不为null的情况下不会生效
                if (!this.isGroup && !this.options
                    && this.optionsService && this.optionsMethod
                    && this.textField && this.valueField) {
                    this.queryRemoteOptions()
                } else if (!this.isGroup) {
                    this.realOptions = this.options
                }

                if (this.defaultValue !== undefined) {
                    this.value = this.defaultValue
                }
                else {
                    this.value = this.bindValue;
                }
            },
            queryRemoteOptions: function() {
                let rows
                axios({
                    service: this.optionsService,
                    method: this.optionsMethod,
                    args: this.optionsArgs
                })
                .then((res) => {
                    if (res.data && res.data.status == 200) {
                        rows = res.data.result.rows
                        if (rows) {
                            this.realOptions = this.remoteOptionsFilter
                                ? this.remoteOptionsFilter.call(this, rows)
                                : rows.map((item) => {
                                    console.log(item)
                                    return {
                                        value: item[this.valueField],
                                        text: item[this.textField]
                                    }
                                })
                        }
                    }
                })
            },
            onChange: function(value) {
                this.$emit('change', value,this.name)
            },
            onVisibleChange: function(value) {
                this.$emit('visible-change', value,this.name)
            },
            queryRemote: function(query) {
                if (query !== '') {
                    if (this.service && this.method) {
                        if (this.remoteQueryKey) {
                            this.remoteArgs[this.remoteQueryKey] = query
                        };
                        this.loading = true
                        axios({
                            service: this.service,
                            method: this.method,
                            args: this.remoteArgs
                        })
                        .then((res) => {
                            this.loading = false
                            let response = res.data
                            if (response.status == 200) {
                                this.realOptions = response.result.rows
                            }

                        })
                        .catch((res) => {
                            // TODO 数据加载失败
                            this.loading = false
                            this.$message.error('数据加载失败')
                        })
                    } else {
                        // TODO 没有传service和method参数处理
                    }
               } else {
                     this.realOptions = [];
                }
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
