<template>
	<el-dialog
			@close="closeDialog"
            v-model="isDialogShow"
            size="full"
            class="traffic-see-t8t-full-dialog"
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
			<el-tabs v-model="activeTabTop" class="basicTab">
			<el-tab-pane
                label="基本信息"
                class="tableDebitType"
                name="one"
            >
                <el-form :model="formData" ref="formRef" label-position="right" label-width="120px">
                    <div class="form-item-container">
                        <el-form-item label="合同编号：">
                            <el-input  v-model="formData.contractCode" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="合同名称：">
                            <el-input v-model="formData.contractName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="版本：">
                            <el-input v-model="formData.mvVersion" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="业务类型：">
                            <el-input v-model="formData.mbBusinessType" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="类别：">
                            <el-input v-model="formData.mbContractKind" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="类型：">
                            <el-input v-model="formData.mbContractType" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="状态：">
                            <el-input v-model="formData.stateStr" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="甲方：">
                            <el-input v-model="formData.firstName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="乙方：">
                            <el-input v-model="formData.secondName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="丙方：">
                            <el-input v-model="formData.thirdName" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-form>

            </el-tab-pane>
            
            <el-tab-pane
                label="其他信息"
                class="tableDebitType"
                name="two"
            >

            <div class="form-item-left">
                <el-form :model="formData" ref="formRef"  label-width="120px">
                    <div class="form-item-container">
                        <el-form-item label="创建人：">
                            <el-input v-model="formData.createUserName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                        <el-form-item label="发起时间：">
                            <el-input  :value ="formData.startTime | toDate " disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="失效时间：">
                            <el-input  :value ="formData.expirationTime | toDate" disabled></el-input>
                        </el-form-item>
                    </div>
                    
                    <div class="form-item-container">
                         <el-form-item label="修改人：">
                            <el-input  v-model="formData.updateUserName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="生效时间：">
                            <el-input  :value="formData.effectiveTime | toDate" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-item-container">
                         <el-form-item label="失效原因：">
                            <el-input  v-model="formData.expirationReason" disabled></el-input>
                        </el-form-item>
                    </div>
                    
                </el-form>
            </div>
            <div class="form-item-right">
                <el-form :model="formData" ref="formRef"  label-width="120px">
                    <div class="form-item-container">
                         <el-form-item label="备注：">
                            <el-input type="textarea" v-model="formData.remark" disabled :autosize="{minRows: 4, maxRows: 4}"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            </el-tab-pane>
			</el-tabs>
                  
        </div>
        <div class="full-dialog-tabs-container">
                <el-tabs v-model="activeTabName" class="wordTab">
                    <el-tab-pane label="替换字段" name="one" class = "wordLog">
                        <div class="my-container">
                            <t8t-table
                                ref="t8ttable"
                                :columns="wordColumns"
                                :pageBar="false"
                                :selectCol="false"
                                :args="argsWord"
                                :service="serviceWord"
                                :method="methodWord"
                                
                            >
                            </t8t-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="合同条款" name="two" class = "ruleTab">
                        <div class="my-container">
                            <t8t-table
                                ref="t8ttable"
                                :columns="columns3"
                                :pageBar="false"
                                :selectCol="false"
                                :indexCol="true"
                                :args="argsTreaty"
                                :service="serviceTreaty"
                                :method="methodTreaty"
                                class = "contractTable"
                            >
                            </t8t-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="附件信息" name="three">
                        <div class="attachInfo">
                            <div class="infoOne">附件名称</div>
                            <div class="infoTwo" > 
                                <a v-text="contractName"  v-on:click="uploadFile(formData.docId,formData.id)" ></a>   
                            </div>
                        </div>
                    </el-tab-pane>
                    

                </el-tabs>
            </div>
	</div>
	</el-dialog>
</template>
<script>
    import Service from 'src/services/commodule/Service.js'
    import ApiTraffic from 'src/services/commodule/traffic.js'
    import Cookie from 'js-cookie'
    import download from 'src/utils/download.js'
    export default{
    	name: 'trafficSee',
        data(){
        	return{
        		isDialogShow: true,
                activeTabName: 'one',
                activeTabTop: 'one',
                formData:{},
                wordColumns:[],
                contractName:null,
                commonFormData: {
                    trafficStatus:[{
                            text: '待签',
                            value: 1
                        },{
                            text: '生效',
                            value: 2
                        },{
                            text: '作废',
                            value: 3
                        },{
                            text: '终止',
                            value: 4
                        },{
                            text: '结束',
                            value: 5
                        },
                        ]
                },
                columns3:[{
                    prop: 'name',
                    label: '规则'
                },{
                    prop: 'parentName',
                    label: '规则内容'
                }
                ],
                argsWord:{
                    search:{
                        contractId_eq : parseInt(this.$route.query.rowId),
                    }
                },
                serviceWord: Service.TRAFFICRECORD.name,
                methodWord: Service.TRAFFICRECORD.methods.QUERY_LIST_WORD,
                argsTreaty:null,
                serviceTreaty:Service.TRAFFICRECORD.name,
                methodTreaty:Service.TRAFFICRECORD.methods.QUERY_RULES_LIST,
                versionId:null,
            
            }
        },
        created() {
            let id = parseInt(this.$route.query.rowId)
            this.getFormData(id)
            this.getWord()
        },
        methods:{
            closeDialog() {
                this.$router.push({path: '/commodule/traffic'})
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
                            this.versionId = res.data.result.versionId
                            this.argsTreaty = {
                                'versionId' : this.versionId,
                            }

                            let time = this.getTime(res.data.result.createTime)
                            this.contractName = res.data.result.contractName + '-' + time + '.pdf'
                        }
                    })
            },
            getWord()
            {
                let args = {
                    "page": 1 ,
                    'size' :20,
                    'search':{
                        contractId_eq : parseInt(this.$route.query.rowId),
                    }
                }
                let list = []
                ApiTraffic.queryListWord(args)
                .then((res) => {
                        if (res.data.status === 200) {
                            for(let k in  res.data.result.header)
                            {
                                list.push({
                                    prop: k,
                                    label: res.data.result.header[k],
                                })
                            }
                            this.wordColumns = list
                        }
                    })
                    
            },
            getTime(time)
            {
               
                    let daputtime = new Date(time*1000);
                    let Y = daputtime.getFullYear();
                    let m = daputtime.getMonth()+1;

                    let d = daputtime.getDate();
                    let H = daputtime.getHours();
                    let i = daputtime.getMinutes();
                    let s = daputtime.getSeconds()+1;
                    let finalValue = Y+'-'+ (m<10 ? '0'+m:m) +'-'+(d<10 ? '0'+d:d)+' '+(H<10 ? '0'+H:H)+':'+(i<10 ? '0'+i:i);
                    return finalValue
            

            },
            uploadFile(docId,id)
            {
                let args = {
                    docId: docId,
                    contractId:id
                }
                ApiTraffic.getContractUrl(args)
                    .then((res) => {
                        if (res.data.status === 200) {
                            download(res.data.result)
                        }
                })
            },
            processTraffic()
            {
                this.$router.push({ path: '/commodule/traffic/process',query:{rowId:this.$route.query.rowId}})
            }
            
        },
    }
  
	
</script>
<style
    lang="css"
    scoped
>


    .traffic-see-t8t-full-dialog .my-container{
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 0 30px;
    }
    .traffic-see-t8t-full-dialog .my-toolbar{
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



</style>
<style>
    
    .traffic-see-t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .traffic-see-t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .traffic-see-t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .traffic-see-t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        display: flex;
        margin-bottom: 20px;
    }
    .traffic-see-t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .traffic-see-t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: -ms-flexbox;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .traffic-see-t8t-full-dialog .toolbar-container .toolbar-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog .toolbar-container .toolbar-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .traffic-see-t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .traffic-see-t8t-full-dialog .form-item-left
    {
        width: 915px;
    }
    .traffic-see-t8t-full-dialog .form-item-left .form-item-container
    {
        width: 33.3%;
    }
    .traffic-see-t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
    }
    
    .traffic-see-t8t-full-dialog .form-item-container{
         width: 25%;
    }
    .traffic-see-t8t-full-dialog .full-dialog-form-container{
        margin-top: 22px;
    }
    .traffic-see-t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .traffic-see-t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .traffic-see-t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .traffic-see-t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .traffic-see-t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .traffic-see-t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .traffic-see-t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .traffic-see-t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .traffic-see-t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
/*        width: 1220px;
        margin: 0 auto;*/
    }
    .traffic-see-t8t-full-dialog .el-tab-pane{
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        overflow: auto;
    }
    /* 顶部tab */
    .traffic-see-t8t-full-dialog .full-dialog-form-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .traffic-see-t8t-full-dialog .full-dialog-form-container .el-tabs__header {
        border-top: 0;
        border-bottom: 0;
    }
    /* 弹窗tab里面的表格定位 */
    .traffic-see-t8t-full-dialog .full-dialog-tabs-container .wordTab .el-tabs__content{
        flex: 1;
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
    }
    .traffic-see-t8t-full-dialog .full-dialog-tabs-container .wordTab .el-tab-pane {
        flex: none !important;
        width: 100% !important;
        height: 100% !important;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .traffic-see-t8t-full-dialog .el-tab-pane 
    .t8t-toolbar {
        position: absolute;
        left: 30px;
        right: 30px;
        padding: 10px 0!important;
        margin: 0 auto!important;
    }

    .traffic-see-t8t-full-dialog .el-tab-pane .t8t-toolbar .el-button--small {
        padding: 7px 9px!important;
        font-size: 12px;
    }
    .traffic-see-t8t-full-dialog  .el-dialog .el-button--small {
        padding: 7px 9px!important;
        font-size: 12px;
    }

    .traffic-see-t8t-full-dialog .t8t-table {
        /*width: 1200px;*/
        flex: none !important;
        margin: 0 auto;
        position: absolute;
        left: 30px;
        bottom: 30px;
        right: 30px;
    }

    .traffic-see-t8t-full-dialog  .wordLog .t8t-table,
    .traffic-see-t8t-full-dialog  .ruleTab .t8t-table{
        top: 20px;
    }

    .traffic-see-t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }


</style>