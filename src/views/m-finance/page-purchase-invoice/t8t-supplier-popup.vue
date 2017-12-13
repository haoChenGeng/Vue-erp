<template>
    <el-form-item :label="item.label" :prop="item.prop">
        <t8t-form-popup
            :disabled="item.disabled"
            :defaultValue="item.defaultValue"
            :ref="item.name"
            :bindValue="formData[item.name]"
            :textValue="item.textValue"
            :filedValue="item.filedValue"
            :name="item.name"
            :placeholder="item.placeholder"
            :dialog="item.dialog"
            :remote="item.remote"
            :service="item.service"
            :method="item.method"
            :remoteArgs="item.remoteArgs"
            :remoteQueryKey="item.remoteQueryKey"
            :autoText="item.autoText"
            :autoValue="item.autoValue"
            :icon="item.icon"
            :onIconClick="item.onIconClick"
            @change="onChange"
            @select="onSelect"
        ></t8t-form-popup>
    </el-form-item>
</template>
<script>
    export default {
        name: 't8t-supplier-popup',
        created(){

        },
        data() {
            return {

            }
        },

        props: {
            item:Object,
            formData: {
                type: Object,
                default: {}
            }
        },
        methods:{
            onChange: function(value,name) {
                this.formData[name] = value
                this.$emit('change', value, name)
            },
            onSelect: function(value,name){
                this.formData[name] = value;
                this.$emit('select', value,name)
            }
        },
        watch:{
            formData: function (val) {
                this.item.defaultValue = {
                    filedValue: val.shopId,
                    textValue: val.shopName
                }
            }
        }
    }


</script>
