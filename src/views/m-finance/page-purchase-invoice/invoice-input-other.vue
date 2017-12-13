<template>
    <el-form class="dialog2-form-container" :model="formData" label-position="right" label-width="120px">
        <div class="dialog2-form-item-container">
            <el-form-item label="创建人：">
                <el-input v-model="formData.createName" :disabled="true"></el-input>
            </el-form-item>
        </div>
        <div class="dialog2-form-item-container">
            <el-form-item label="创建日期：">
                <t8t-datetime-picker :bindValue="formData.createTime" type="datetime" :disabled="true">
                </t8t-datetime-picker>
            </el-form-item>
        </div>
        <div class="dialog2-form-item-container">
            <el-form-item label="审核人：">
                <el-input v-model="formData.auditName" :disabled="true"></el-input>
            </el-form-item>
        </div>
        <div class="dialog2-form-item-container">
            <el-form-item label="审核日期：">
                <t8t-datetime-picker :bindValue="formData.auditTime" type="datetime" :disabled="true">
                </t8t-datetime-picker>
            </el-form-item>
        </div>
        <div class="dialog2-form-item-container">
            <el-form-item label="失效人：">
                <el-input v-model="formData.disuseName" :disabled="true"></el-input>
            </el-form-item>
        </div>
        <div class="dialog2-form-item-container">
            <el-form-item label="失效日期：">
                <t8t-datetime-picker :bindValue="formData.disuseTime" type="datetime" :disabled="true">
                </t8t-datetime-picker>
            </el-form-item>
        </div>
        <div class="dialog2-form-item-container">
            <el-form-item label="最后修改人：">
                <el-input v-model="formData.updateName" :disabled="true"></el-input>
            </el-form-item>
        </div>
        <div class="dialog2-form-item-container">
            <el-form-item label="最后修改日期：">
                <t8t-datetime-picker :bindValue="formData.updateTime" type="datetime" :disabled="true">
                </t8t-datetime-picker>
            </el-form-item>
        </div>
    </el-form>
</template>
<script>
    import Cookie from 'js-cookie';
    import * as Config from './config'
    export default {
        name: 'invoice-input-other',
        created(){
//            this.formData = this.formDataSource
        },
        data() {
            return {
            }
        },

        props: {
            formData:Object,
        },
        methods:{

        }
    }


</script>
