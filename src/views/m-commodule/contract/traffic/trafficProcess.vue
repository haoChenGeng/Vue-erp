<template>

	<el-dialog
			@close="closeDialog"
            v-model="isDialogShow"
            size="full"
            class="traffic-process-t8t-full-dialog"
	>
	<div class="t8t-full-dialog-container">
		<!-- 顶部按钮区 -->

        <div class="full-dialog-toolbar-container">
            <div class="toolbar-container">
                <t8t-toolbar
                    class="t8t-dark"
                    @PROCESS="processTraffic"
                >
                </t8t-toolbar>
            </div>
        </div>
		<div class="full-dialog-form-container container-center">
            <div class="listBox">
                        <h1>合同流程</h1>
                <div class="leftBox">
                    <el-steps :space="128" :active="6" finish-status="success" direction="vertical">
                      <el-step title="已完成"></el-step>
                      <el-step title="已完成" v-if="formData.firstTime > 0 "></el-step>
                      <el-step title="已完成" v-if="formData.secondTime >0 "></el-step>
                      <el-step title="已完成" v-if="formData.thirdTime >0 "></el-step>
                      <el-step title="已完成" v-if="formData.effectiveTime >0 "></el-step>
                      <el-step title="已完成" v-if="formData.expirationReasonId === styleValue "></el-step>
                    </el-steps>
                </div>
                <div class="processBox">
                        
                        <ul class="ulbox">
                            <div class="icon"></div>
                            <li>发起合同</li>
                            <li>发起人 : {{formData.createUserName}} </li>
                            <li>发起时间 : {{formData.startTime | toDate}}</li>
                        </ul>
                        <ul class="ulbox" v-if="formData.firstTime > 0 ">
                            <div class="icon"></div>
                            <li>甲方签署</li>
                            <li>签署人 : {{formData.firstName}}</li>
                            <li>签署时间 : {{formData.firstTime | toDate}}</li>
                        </ul>
                        <ul class="ulbox" v-if="formData.secondTime >0 ">
                            <div class="icon"></div>
                            <li>乙方签署</li>
                            <li>签署人 : {{formData.secondName}}</li>
                            <li>签署时间 : {{formData.secondTime | toDate}}</li>
                        </ul>
                        <ul class="ulbox" v-if="formData.thirdTime >0 ">
                            <div class="icon"></div>
                            <li>丙方签署</li>
                            <li>签署人 :{{formData.thirdName}}</li>
                            <li>签署时间 : {{formData.thirdTime | toDate}}</li>
                        </ul>
                        <ul class="ulbox" v-if="formData.effectiveTime >0 ">
                            <div class="icon"></div>
                            <li>合同生效</li>
                            <li>
                            <div v-if="formData.firstTime > 0 ">甲方 : {{formData.firstName}}</div>
                            <div v-if="formData.secondTime > 0 ">乙方 : {{formData.secondName}}</div>
                            <div v-if="formData.thirdTime > 0">丙方 : {{formData.thirdName}}</div>
                            </li>
                            <li>生效时间 : {{formData.effectiveTime | toDate}}</li>
                        </ul>
                        <ul class="ulbox" v-if="formData.expirationReasonId === styleValue ">
                            <div class="icon"></div>
                            <li>合同终止</li>
                            <li>操作人: {{formData.updateUserName}}</li>
                            <li>失效时间: {{formData.expirationTime | toDate}}</li>
                        </ul>
                </div>
            </div>          
        </div>
	</div>
	</el-dialog>
</template>
<script>
    import Service from 'src/services/commodule/Service.js'
    import ApiTraffic from 'src/services/commodule/traffic.js'
    export default{
    	name: 'trafficSee',
        data(){
        	return{
        		isDialogShow: true,
                formData:{},
                styleValue:null,
               
                
            
        	}
        },
        created() {
            let id = parseInt(this.$route.query.rowId)
            this.getFormData(id)
            this.getCode()
        },
        methods:{
        	closeDialog() {
                this.$router.push({path: '/tuchat-commodule/traffic/see'})
                this.$emit('close')
            },
            //获取业务合同详细信息
            getFormData(rowId) {
                let args = {
                    id: rowId 
                }

                ApiTraffic.queryOne(args)
                    .then((res) => {
                        if (res.data.status === 200) {
                            this.formData = res.data.result
                          
                        }
                    })
            },
           
            getCode(value)
            {
                let args = {
                    pPropertyCode: '39202',
                    propertyCode:'03'
                }
                ApiTraffic.getCode(args)
                    .then((res) => {
                       this.styleValue = res.data.result
                })
                
            }
            
        },
    }
  
	
</script>
<style
    lang="css"
    scoped
>
    .listBox h1
    {
        text-align: center;
        margin-bottom: 0px;
        margin-top: 10px;
    }
    
    .listBox
    {
        position: relative;
    }
    .leftBox
    {
        width: 130px;
        position: absolute;
        left: 90px;
        top:110px;

    }
    .processBox
    {
        position: absolute;
        left: 250px;
        top:50px;
    }
    .ulbox
    {
        width: 810px;
        height: 50px;
        list-style: none;
        border: 1px solid rgb(212,221,231);
        vertical-align: middle;
        padding-top: 30px;
        padding-bottom: 15px;
        position: relative;
        margin-bottom: 30px;
    }
    .icon
    {
        width: 13px;
        height: 18px;
        background-image: url(./global-ico.png);
        background-position: -85px 0px;
        position: absolute;
        background-color: #fff;
        left: -11px;
        top:50px;
    }
    .ulbox li
    {
        float: left;
        margin-right: 40px;
    }
    .ulbox li:nth-child(2)
    {
        width: 60px;
    }
    .ulbox li:nth-child(3)
    {
        width: 250px;
    }
    .traffic-process-t8t-full-dialog .my-container{
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }
    .traffic-process-t8t-full-dialog .my-toolbar{
        margin-bottom: 15px;
    }
    .attachInfo
    {
        width: 1220px;
        margin-left: auto;
        margin-right:auto;
        border: 1px solid rgb(212, 220, 231);
        height: 135px;
        text-align: center;
    }
    .attachInfo .infoOne
    {
        color:#1f2d3d;
        font-weight: bold;
        line-height: 20px;
        font-size: 13px;
        padding-top: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgb(212, 220, 231);
    }
    .attachInfo .infoTwo
    {
        padding-top:20px;
        color: rgb(0,51,255);
        cursor: pointer;
    }
    .el-steps .el-step:first-child{
        margin-right: 0px;
         height: 120px;
    }



</style>
<style>
    
    .traffic-process-t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .traffic-process-t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .traffic-process-t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .traffic-process-t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }
    .traffic-process-t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .traffic-process-t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
   
    .traffic-process-t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }

  

   


</style>