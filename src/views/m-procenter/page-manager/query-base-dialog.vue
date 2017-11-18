<template>
    <div>

        <el-dialog title="基本信息" class="workflow-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="payForm" @keyup.enter.native="btnOKClick()">
                <el-form-item label="流程名称：" prop="businessTypeId">
                    <el-select v-model="formData.businessTypeId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.businessTypeCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标识键：" prop="debitObjectId">
                    <el-select v-model="formData.debitObjectId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.debitObjectCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="流程编码：" prop="debitTypeCodeId">
                    <el-select v-model="formData.debitTypeCodeId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.debitTypeCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类：" prop="organizationId">
                    <el-select v-model="formData.organizationId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.organizationCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明：" prop="channelId">
                    <el-select v-model="formData.channelId" placeholder="--请选择--" :disabled="editable">
                        <el-option v-for="item in commonOptionsConfig.debitChannelCode" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!editable">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">提交</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import Cookie from 'js-cookie'
    export default{
        data(){
            return {
            }
        },
        components: {},
        name: 'workflow-dialog'
    }
</script>

<style>
</style>
