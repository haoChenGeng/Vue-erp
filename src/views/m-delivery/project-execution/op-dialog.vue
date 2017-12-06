<template>
    <div>
        <el-dialog :title="title" class="pay-dialog" v-model="dialogVisible" @close="btnCancleClick()">
            <el-form v-loading.lock="formLoading" :label-position="labelPosition" :model="formData" :rules="rules" :label-width="formLabelWidth" ref="form" @keyup.enter.native="btnOKClick()">
                <el-form-item label="验收单编号：">
                    <el-input v-model="billCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="项目ID：" prop="projectId">
                    <el-input v-model="formData.projectId" disabled></el-input>
                </el-form-item>
                <el-form-item label="工长姓名：" prop="workerName">
                    <el-input v-model="formData.workerName" disabled></el-input>
                </el-form-item>
                <el-form-item label="工长电话：" prop="workerPhoneId">
                    <el-input v-model="formData.workerPhoneId" disabled></el-input>
                </el-form-item>
                <el-form-item v-if="editType == 'changeSteward'" label="交付管家：" prop="payAdvisorId">
                    <el-select
                        v-model="formData.payAdvisorId"
                        filterable
                        :allow-create="false"
                        placeholder="请选择交付管家">
                        <el-option
                            v-for="item in payAdvisorMap"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="editType == 'yuyue'" label="预约开始时间：" prop="orderStartTime">
                    <el-date-picker
                        :picker-options="pickerOptions"
                        :value="!formData.orderStartTime ? '' : formData.orderStartTime * 1000"
                        placeholder=""
                        type="datetime"
                        @input="handleCheckTimeChange(Date.parse(arguments[0]) / 1000, 'orderStartTime')"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="editType == 'yuyue'" label="预约结束时间：" prop="orderCheckTime">
                    <el-date-picker
                        :picker-options="pickerOptions"
                        :value="!formData.orderCheckTime ? '' : formData.orderCheckTime * 1000"
                        placeholder=""
                        type="datetime"
                        @input="handleCheckTimeChange(Date.parse(arguments[0]) / 1000, 'orderCheckTime')"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="editType == 'cancel'" label="撤销原因：" prop="repealReason">
                    <el-input type="textarea" :rows="3" v-model="formData.repealReason"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="btnCancleClick()">取消</el-button>
            </div>
    </el-dialog>
    </div>
</template>
<script>
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    export default {
        name: 'op-dialog',
        data() {
            let that = this;
            let validateOrderCheckTime = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error('请选择预约结束时间'));
                }
                if(this.formData.orderStartTime && +this.formData.orderStartTime >= +this.formData.orderCheckTime){
                    return callback(new Error('结束时间必须大于开始时间'));
                }
                callback();
            }
            return {
                labelPosition: 'right',
                formLabelWidth: '120px',
                rules: {
                    orderStartTime: [
                        { type: 'number', required: true , message: "请选择预约开始时间",trigger: 'change'},
                    ],
                    orderCheckTime: [
                        { type: 'number', required: true, trigger: 'change', validator: validateOrderCheckTime},
                    ]
                },
                //表单
                formData: {
                    id:null,
                    billCode: '',
                    projectId: null,
                    orderStartTime: '', // 预约开始时间
                    orderCheckTime: '', // 预约结束时间
                    payAdvisorId: '', //交付管家ID
                    repealReason: '', //撤销原因
                },
                isLoading: false,
                options5: [],
                payAdvisorMap:[],
                formLoading: false,
                pickerOptions:{
                    disabledDate(time){
                        if(typeof that !== 'undefined'){
                            let next3Month = that.getNextMonth(DateUtils(Date.now(), 'yyyy-mm-dd'),3);
                            return (time.getTime() < Date.now() - 8.64e7) || (time.getTime() > Date.parse(new Date(next3Month)));
                        }
                    }
                }
            }
        },
        props: ['id','billCode','rowId','editType','title'],
        computed: {
            dialogVisible() {
                return true
            },
            editable() {
                return this.editType === 'see'
            }
        },
        created () {
            this.formData.id = this.id;
            this.formData.projectId = this.rowId;
            //请求所选行的数据
            this.getProjectInfo();
        },
        methods: {
            handleCheckTimeChange(val,variable){
                this.formData[variable] = val;
            },
            getProjectInfo(){
                let params = {};
                if(this.billCode){
                    params = {billCode: this.billCode};
                }else{
                    params = {projectId: this.rowId}
                }
                this.formLoading = true;
                TemplateOperator.getCheckProject(params)
                    .then((res) => {
                        if (res.data.status === 200) {
                            this.formData =  Object.assign(this.formData,res.data.result);
                            let list = [];
                            for(let item in this.formData.payAdvisorMap){
                                list.push({label: this.formData.payAdvisorMap[item], value: item});
                            }
                            this.payAdvisorMap = list
                            this.$set(this.formData,'payAdvisorId','' + this.formData.payAdvisorId);
                        }
                        this.formLoading = false;
                });
            },
            btnOKClick() {
                this.$refs['form'].validate(valid=>{
                    if (valid) {
                        let formData = Object.assign({},this.formData)
                        formData.updateUser = +Cookie.get('t8t-tc-uid')
                        let optType = null;
                        switch(this.editType){
                            case 'yuyue':
                                optType = 1;
                                break;
                            case 'changeSteward':
                                optType = 2;
                                break;
                            case 'cancel':
                                optType = 3;
                                break;
                            default:
                        }
                        this.isLoading = true;
                        TemplateOperator.checkUpdate({check:formData,optType:optType})
                            .then((res) => {
                                if (res.data.status === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '编辑成功！'
                                    })
                                    this.btnCancleClick()
                                    this.$emit('getTableData')
                                }else{
                                    this.$message({
                                        type: 'error',
                                        message: res.data.message
                                    })
                                }
                                this.isLoading = false;
                            });
                    }
                    else {
                        return false
                    }
                })
            },
            btnCancleClick() {
                this.$refs['form'].resetFields()
                this.$emit('close')
            },
            getNextMonth (date, num) {
                var arr = date.split('-');
                var year = arr[0]; //获取当前日期的年份
                var month = arr[1]; //获取当前日期的月份
                var day = arr[2]; //获取当前日期的日
                var days = new Date(year, month, 0);
                days = days.getDate(); //获取当前日期中的月的天数
                var year2 = year;
                var month2 = parseInt(month) + num;
                if (month2 == 13) {
                    year2 = parseInt(year2) + 1;
                    month2 = 1;
                }
                var day2 = day;
                var days2 = new Date(year2, month2, 0);
                days2 = days2.getDate();
                if (day2 > days2) {
                    day2 = days2;
                }
                if (month2 < 10) {
                    month2 = '0' + month2;
                }
                if(day2 < 10){
                    day2 = '0' + day2;
                }

                var t2 = year2 + '-' + month2 + '-' + day2;
                return t2;
            }
        }
    }

</script>

<style lang="css" scoped>
</style>
<!-- 样式尽量写上边, 必要时写下边 -->
<style lang="css">
.pay-dialog .el-dialog{
    width: 450px;
}
.el-select-dropdown__wrap {
    max-height: 185px !important;
}
.pay-dialog .el-form-item__content {
    width: 250px;
}
.pay-dialog .el-select {
    width: 100%;
}
</style>
