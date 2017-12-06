<template>
    <div>
        <el-dialog title="授权/代理详情" class="devolution-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form :label-position="labelPosition"   :model="formData" :label-width="formLabelWidth"   ref="devolutionForm"   @keyup.enter.native="btnOKClick()">
                <el-form-item label="被授权人:" prop="userName">
                   {{formData.userName}}
                </el-form-item>       
                <el-form-item label="授权时间:">
                    {{formData.startTime | devolutionFliters}} 
                    至
                    {{formData.endTime | devolutionFliters}}
                </el-form-item>
                <el-form-item label="授权内容:" prop="ProcName">
                    {{formData.procName}}
                </el-form-item>          
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnCancleClick()">关闭</el-button>
            </div>
    </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'devolution-dialog',
        props:{
            detailData:[Array],
        },
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '100px',
                showCheckbox:true,

                //表单
                formData: {
                    userName: null,
                    startTime: null,
                    endTime: null,
                    procName:null
                },
                    
            }
        },
        created(){
            this.formData.userName = this.detailData.agencyName
            this.formData.startTime = this.detailData.startTime
            this.formData.endTime = this.detailData.endTime
            this.formData.procName = this.detailData.procName
        },

        filters:{
            devolutionFliters:function(val){
             
                    let daputtime = new Date(val*1000);
                    let Y = daputtime.getFullYear();
                    let m = daputtime.getMonth()+1;
                    let d = daputtime.getDate();
                    let H = daputtime.getHours();
                    let i = daputtime.getMinutes();
                    let s = daputtime.getSeconds()+1;
                    let finalValue = Y+'-'+ (m<10 ? '0'+m:m) +'-'+(d<10 ? '0'+d:d)+' '+(H<10 ? '0'+H:H)+':'+(i<10 ? '0'+i:i);
               

                return finalValue
            }
        },

        computed: {
            dialogVisible(){
                    return true
            },         
           
        },

        methods: {
            btnCancleClick() {
                this.$emit('close')
            },

        }
    }

</script>


<style lang="css" scoped>
</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
.devolution-dialog .el-dialog{
    width: 450px;
}
.devolution-dialog .el-select-dropdown__wrap {
    max-height: 185px !important;
}
.devolution-dialog .el-form-item__content {
    width: 250px;
}
.devolution-dialog .el-select {
    width: 100%;
}
</style>
