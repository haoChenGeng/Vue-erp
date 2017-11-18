<template>
    <span class="t8t-division">
        <el-cascader
            v-model="defaultSelects"
            :options="cities"
            :props="props"
            :popper-class="popperClass"
            :placeholder="placeholder"
            :disabled="disabled"
            :clearable="clearable"
            :expand-trigger="expandTrigger"
            :show-all-levels="showAllLevels"
            :filterable="filterable"
            :debounce="debounce"
            :change-on-select="changeOnSelect"
            :size="size"
            @change="onChange"
            :defaultValue="defaultValue"
            @active-item-change="onActiveItemChange"
        >
        </el-cascader>
        <input type="hidden" ref="input" v-bind:value="defaultSelects" v-on:input="updateValue($event.target.value)">
    </span>
</template>

<script>
    import axios from 'src/utils/axios.js'
    export default {
        name: 't8t-division',
        props: {
            value: Array,
            popperClass: String,
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: true
            },
            expandTrigger: {
                type: String,
                default: 'click'
            },
            showAllLevels: {
                type: Boolean,
                default: true
            },
            placeholder: String,
            debounce: {
                type: Number,
                default: 300
            },
            filterable: {
                type: Boolean,
                default: true
            },
            changeOnSelect: {
                type: Boolean,
                default: false
            },
            size: String,
            defaultValue: String
        },
        data () {
            return {
                cities: [],
                defaultSelects: [],
                defaultValue: "",
                props: {
                    value: 'id',
                    label: 'name',
                    children: 'children'
                }
            }
        },
        created () {
            this._initDate();
            this._init()
        },
        methods: {
            _initDate () {
                axios({
                    method: '9QcAm_g-pEd7h1maNn1y5_E2NYs0VOh6yyAaz2wpahZ',//standardDistrict.allTree.get
                    service: 'SAQyRkx8GNYji7u1QcT6nJGYUFe7I14',///biz/t8t-sys-dst/app
                    args: {}
                }).then((res) => {
                    if(res.data.status === 200) {
                        this.cities = this.traverseArr(res.data.result)
                    }
                })
            },
            _init () {
                if (this.defaultValue) {
                    let defaults = this.getParentList(this.defaultValue);
                    this.defaultSelects = defaults
                    this.$emit('input', defaults)
                }
            },
            updateValue: function (value) {
                // 通过 input 事件发出数值
                this.$emit('input', value)
            },
            getParentList (code) {
                // 根据标准生成ParentList
                let _code = '' + code
                let a = _code.slice(0, 2)
                let b = _code.slice(2, 4)
                let c = _code.slice(4, 6)
                if(c !== '00') {
                    return [a, a + b + '00000000', _code]
                }
                if(b !== '00') {
                    return [a, a + b + '00000000']
                }
                if(a !== '00') {
                    return [a]
                }
            },
            onChange (value) {
                this.$emit('change', value, value[ value.length - 1 ])
                this.$emit('input', value)
            },
            onActiveItemChange (parents) {
                this.$emit('active-item-change', parents)
            },
            traverse(node) {
                let childNodes = node.children || []

                childNodes.forEach((child) => {
                    child.pid = '' + child.pid
                    child.id = '' + child.id
                    this.traverse(child);
                })
            },
            traverseArr(arr) {
                let tree = {
                    level: -1,
                    pid: -1,
                    id: -1,
                    children: arr
                }
                this.traverse(tree)
                return arr
            }
        },
        watch: {
            defaultValue: function () {
                this._init()
            },
            value: function(val,oldVal){
                this.defaultSelects = val
            }
        }
    }
</script>

<style lang="css">
    .t8t-division {
        display: inline-block;
        position: relative;
        background-color: #fff;
    }
    .el-cascader.is-disabled .el-cascader__label {
        z-index: 2;
        color: #bbb
    }
</style>
