<template>
    <div class="t8t-datetime-picker">
        <el-date-picker
            v-model="value"
            :readonly="readonly"
            :disabled="disabled"
            :editable="editable"
            :clearable="clearable"
            :size="size"
            :placeholder="placeholder"
            :type="type"
            :align="align"
            :popper-class="popperClass"
            :picker-options="pickerOptions"
            :range-separator="rangeSeparator"
            :bindValue="bindValue"
            :endFormater="endFormater"
            @change="onChange"
        >
        </el-date-picker>
        <input type="hidden" ref="input" v-bind:value="selectTime" v-on:input="updateValue($event.target.value)">
    </div>
</template>

<script>
    import DateUtils from 'src/utils/DateUtils.js'
    export default {
        name: 't8t-datetime-picker',
        data () {
            return {
                value: '',
                selectTime: ''
            }
        },
        props: {
            endFormater: {
                type: String,
                default: "yyyy-mm-dd HH:MM:ss"
            },
            bindValue: String,
            rangeSeparator: String,
            type: String,
            disabled: {
                type: Boolean,
                default: false
            },
            readonly: {
                type: Boolean,
                default: false
            },
            editable:{
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: true
            },
            size: String,
            placeholder: String,
            align: String,
            poperClass: String,
            pickerOptions: Object
        },
        created () {
            this._init()
        },
        watch: {
            bindValue: function () {
                this._init()
            }
        },
        methods: {
            _init () {
                if (this.bindValue) {
                    this.value = this.format(this.bindValue);
                } else {
                    this.value = null
                }

                this.updateValue(this.value)
            },
            isTimestamp (date) {
                if (typeof date === 'string') {
                    return date.match(/^\d{10}$/)
                } else if (typeof date === 'number') {
                    return (date + "").match(/^\d{10}$/)
                }

                return false
            },
            updateValue (value) {
                this.$emit('input', this.formatString(value))
            },
            formatString (defaultDate) {
                if (!defaultDate) return this.formatEmpty()
                if (typeof defaultDate === 'object') {
                    return this.endFormater === 'timestamp'
                        ? Math.round(defaultDate / 1000)
                        : DateUtils(defaultDate, this.endFormater)
                } else if ( (defaultDate + "").match(/^\d{10}$/)) {
                    let _dateObj = new Date( parseInt(defaultDate) * 1000 )
                    return this.endFormater === 'timestamp' ? defaultDate : DateUtils(_dateObj, this.endFormater)
                } else {
                    return this.endFormater === 'timestamp'
                        ? this.formatTimestamp(defaultDate)
                        : defaultDate
                }
            },
            formatEmpty () {
                return (this.endFormater === 'timestamp') ? null : ""
            },
            formatTimestamp (date) {
                if(date == undefined) {
                    return null;
                }
                date = date.replace(/-/g, '/');
                return Math.round((new Date(date) / 1000))
            },
            format (defaultDate) {
                // 空处理
                if (!defaultDate) return this.formatEmpty()
                // 时间戳处理
                if (this.isTimestamp(defaultDate)) return new Date( parseInt(defaultDate) * 1000 )

                return new Date(defaultDate)
            },
            onChange (date) {
                let formateDate
                if (this.endFormater === 'timestamp') {
                    formateDate = this.formatTimestamp(date)
                } else {
                    formateDate = DateUtils( new Date(date), this.endFormater )
                }

                this.updateValue(formateDate)
                this.$emit('change', date, formateDate)
            }
        }
    }
</script>

<style lang="css" scoped>
    .cell .t8t-datetime-picker .el-date-editor.el-input {
        width: 100%
    }
</style>
