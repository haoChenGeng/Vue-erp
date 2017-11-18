<template>
    <div class="add-tab-3">
	    <!-- 表单区 -->
	    <div class="full-dialog-form-container container-center">
	        <el-form :model="formData" :rules="formRule" ref="formRef" label-position="right" label-width="120px">
		        	<h3>联系信息</h3>
	        	     <el-row :gutter="2">
                        <el-col :span="6">
	                      <el-form-item label="微信号码：" prop="weixin">
	                      <el-input v-model="formData.weixin" placeholder="请输入微信号码" :disabled="eidtType"></el-input>
	                      </el-form-item>
                        </el-col>
                        <el-col :span="6">
    		                <el-form-item label="邮箱地址：" prop="email">
    		                    <el-input v-model="formData.email" placeholder="请输入邮箱地址" :disabled="eidtType"></el-input>
    		                </el-form-item>
                        </el-col>
                    </el-row>

		            <h3>地址信息</h3>
                      <el-row :gutter="2">
                        <el-col :span="7">
    		                <el-form-item label="居住地址：" prop="residenceAddress">
    		                    <t8t-division
    		                    	v-model="formData.residenceAddressArr"
                                    :defaultValue="formData.residenceAddress"
                                    class="foremanworker_addre"
                                    :disabled="eidtType"
    		                    ></t8t-division>
    		                </el-form-item>
                        </el-col>
                        <el-col :span="3">
    		                <el-form-item label="详细地址：" prop="address">
    		                    <el-input v-model="formData.address" placeholder="请输入详细地址" :disabled="eidtType"></el-input>
    		                </el-form-item>
                        </el-col>
                    </el-row>
		            <el-row :gutter="2">
                        <el-col :span="6">
    		                <el-form-item label="户籍地址：" prop="permanentAddress">
    		                    <t8t-division
                                    v-model="formData.permanentAddressArr"
    		                    	:defaultValue="formData.permanentAddress"
                                    class="foremanworker_addre"
                                    :disabled="eidtType"
    		                    ></t8t-division>
    		                </el-form-item>
		              </el-col>
		            </el-row>
		            <h3>备注信息</h3>
		            <el-row :gutter="2">
                        <el-col :span="6">
    		                <el-form-item label="备注：" prop="memo">
    		                    <el-input v-model="formData.memo" placeholder="请输入备注" type="textarea" :disabled="eidtType" :rows="4"></el-input>
    		                </el-form-item>
		              </el-col>
                    </el-row>
	        </el-form>
        </div>
    </div>
</template>

<script>
// import T8tToolbar from 'src/components/t8t-toolbar/t8t-toolbar.vue'
import ZZ from 'src/config/delivery/common-regular-expression.js'
import api from 'src/services/delivery/foremanworker.js'
import Cookie from 'js-cookie'
export default {
    name: 'add-tab-3',
    props:{
       eidtType: {
                type: Boolean,
                default: false
            }
    },
    data () {
        return {
            isLoading:false,
        	formData:{
        		weixin: '',
        		email: '',
        		residenceAddress: '',
                residenceAddressArr:[],
        		address: '',
        		permanentAddress: '',
                permanentAddressArr:[],
        		memo: '',
        	},
            ZZ:ZZ,
        	value: "",
        	formRule: {
                weixin: [
                        { max: 30, min:0, message: '微信号码长度不能超过30个字符', trigger:"blur"}
                ],
                email: [
                    {pattern: ZZ.email, message: '请输入正确的邮箱地址', trigger:"blur"},
                    { max: 30, min:0, message: '邮箱地址长度不能超过30个字符', trigger:"blur"}
                ],
                residenceAddress: [
                    { required: true, message: '请选择居住地址', trigger:"change"}
                ],
                address: [
                { required: true, message: '请输入详细地址', trigger:"blur" },
                { max: 50, min:1, message: '邮箱地址长度不能超过50个字符', trigger:"blur"}
                ],
                permanentAddress: [
                    { required: true, message: '请选择户籍地址', trigger:"change"}
                ],
                memo:[
                    { max: 100, min:0, message: '备注信息长度不能超过100个字符', trigger:"blur"}
                ]
            },
        }
    },
    created() {
        if(this.$route.query.id)
            this.iniData(this.$route.query.id)
    },
    watch:{
         "formData.residenceAddressArr":function(value){
            if(value.length > 0){
                this.formData.residenceAddress = value[value.length -1];
            }
        },
        "formData.permanentAddressArr":function(value){
            if(value.length > 0){
                this.formData.permanentAddress = value[value.length -1];
            }
        }
    },
    methods: {
        submitForm() {
            this.$refs['formRef'].validate((isValid) => {
                if (!isValid){
                	return false
                }
                this.isLoading = true
                let data = this.mkRquestData()
                let args = {baseRemain:data}
                api.saveWorkerBaseRemain(args).then((res) =>{
                     this.isLoading = false
                     if(res.data.status === 200){
                             this.$msgbox({
                                    title: '保存成功',
                                    type: 'success',
                                    message: '',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                     }else{
                           this.$msgbox({
                            title: '保存失败',
                            type: 'error',
                            message: res.data.message,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                          })
                    }
                })
            })

        },
        validate(func){
          this.$refs['formRef'].validate((isValid) => {
                func(isValid)
            })
        },
        getData(){
            return this.mkRquestData()
        },
        iniData(id){
           let args = {base:{id:id},page:1,size:2,sort:[]}
           api.getBaseInfoById(args).then((res) => {
                if(res.data.status == 200){
                        let data = res.data.result.rows[0] ? res.data.result.rows[0] : {}
                        this.formData = Object.assign(this.formData, data)
                        this.formData.weixin = this.formData.weixin ? this.formData.weixin : '';
                        this.formData.email = this.formData.email ? this.formData.email : '';
                        this.formData.address = this.formData.address ? this.formData.address : '';
                        this.formData.memo = this.formData.memo ? this.formData.memo : '';
                        this.formData.weixin = this.formData.weixin ? this.formData.weixin : '';
                        this.formData.residenceAddress = this.formData.areaId
                        this.formData.permanentAddress = this.formData.hAreaId
                }
           })
        },
        mkRquestData(){
         return {
                    id:this.$route.query.id,
                    weixin:this.formData.weixin,
                    email:this.formData.email,
                    provinceId:this.formData.residenceAddressArr[0],
                    cityId:this.formData.residenceAddressArr[1],
                    areaId:this.formData.residenceAddressArr[2],
                    hProvinceId:this.formData.permanentAddressArr[0],
                    hCityId:this.formData.permanentAddressArr[1],
                    hAreaId:this.formData.permanentAddressArr[2],
                    address:this.formData.address,
                    memo:this.formData.memo
             }
        },
        getCommonData1(pid, name) {
            let args = { "fatherCode": pid }
            let list = []
            api.allSystemCode.list(args)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                            list.push({
                                value: item.id,
                                text: item.name
                            })
                        })
                        this.commonData[name] = list
                    }
                })
        }
    }
};
</script>

<style lang="css" scoped>
    .info-container .col {
        flex: 1;
    }
    .el-form h3{
        width: 100%;
    }
    .el-form .el-row{
        width: 100%;
    }

</style>
<style lang="css">
 .foremanworker_addre .el-cascader .el-input{
    width: 250px;
}
</style>
