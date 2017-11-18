<template>
    <div class="t8t-input-phone">
        <el-input
            :type="text"
            :maxlength="15"
            :minlength="11"
            :placeholder="placeholder"
            v-model="value"
            :show="show"
            @change="change"
            @click="click"
            @focus="focus"
            @blur="blur"
            :defaultValue="defaultValue"
            :size="size"
            :name="name"
            :readonly="readonly"
            :disabled="disabled"
        >
        </el-input>
        <input type="hidden" ref="input" v-bind:value="encryptPhone" v-on:input="updateValue($event.target.value)">
    </div>
</template>

<script>
    import RSA from 'src/utils/RSA.js'
    import utils from 'src/utils/Utils.js'
    export default {
        name: 't8t-input-phone',
        data () {
            return {
                encryptPhone: "",
                value: ""
            }
        },
        props: {
            defaultValue: String,
            placeholder: {
                type: String,
                default: "请输入手机号码"
            },
            show: Boolean,
            size: String,
            autosize: [Boolean, Object],
            name: String,
            readonly: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        created () {
            utils.getPublicKey(function(res) {
                  if(res.data.status == 200){
                      RSA.encrypt.setPublicKey(res.data.result.key)
                  }
            }).then((res) =>{
                this.init()
            })
        
        },
        watch: {
            "defaultValue": function() {
                this.init()
            }
        },
        methods: {
            init () {

                this.value = this.defaultValue
                this.encrypt(this.value)
            },
            updateValue (value) {
                this.$emit('input', value)
            },
            encrypt (phone) {
                this.encryptPhone = RSA.encryptfun(phone)
                this.updateValue(this.encryptPhone)
            },
            change (phone) {
                this.encrypt(phone)
                this.$emit('change', phone, this.encryptPhone)
            },
            click (event) {
                this.$emit('click', this.value, this.encryptPhone)
            },
            focus (event) {
                this.$emit('focus', this.value, this.encryptPhone)
            },
            blur (event) {
                this.$emit('blur', this.value, this.encryptPhone)
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
