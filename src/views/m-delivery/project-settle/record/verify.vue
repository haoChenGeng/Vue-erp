<template>
<div>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
        <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
             <div class="full-dialog-toolbar-container">
                 <div class="toolbar-container">
                     <t8t-toolbar
                         @EDIT-SUBMIT="save"
                         class="t8t-dark"
                     >
                     </t8t-toolbar>
                 </div>
             </div>
             <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                <!-- 表单区 -->
                <div class="full-dialog-form-container">
                   <t8t-audit
                       v-if="auditForm"
                       ref="t8tAudit"
                   >
                   </t8t-audit>
                    <el-tabs v-model="tab_info">
                        <el-tab-pane label="项目信息" name="basic">
                            <el-form class="dialog2-form-container" :model="projectInfo" label-position="right" label-width="120px">
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="项目ID：">
                                        <el-input v-model="projectInfo.projectId" disabled></el-input>
                                    </el-form-item>
                                </div>
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="工程地址：">
                                        <el-input v-model="projectInfo.addressDetail" disabled></el-input>
                                    </el-form-item>
                                </div>
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="业主称呼：">
                                        <el-input v-model="projectInfo.appellation" disabled></el-input>
                                    </el-form-item>
                                </div>
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="项目经理：">
                                        <el-input v-model="projectInfo.chiefWorkerName" disabled></el-input>
                                    </el-form-item>
                                </div>
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="客户经理：">
                                        <el-input v-model="projectInfo.customerManagerName" disabled></el-input>
                                    </el-form-item>
                                </div>
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="工程管家：">
                                        <el-input v-model="projectInfo.projectManagerName" disabled></el-input>
                                    </el-form-item>
                                </div>
                                <div class="dialog2-form-item-container">
                                    <el-form-item label="计价面积：">
                                        <el-input v-model="projectInfo.signArea" disabled></el-input>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="toggle-btn-container">
                    <div class="toggle-btn el-icon-d-arrow-left" @click="onTopHide"></div>
                </div>
	            <div class="full-dialog-tabs-container full-dialog-form-container">
	                <el-tabs v-model="tab_detail">
	                  	<el-tab-pane label="收支明细" name="template">
          		    		<table class="my-table" cellpadding="8" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <td align="center" width="10%">序号</td>
                                        <td align="center" width="30%">收支类型</td>
                                        <td align="center" width="30%">结算项</td>
                                        <td align="center" width="30%">金额</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in incomeData">
                                        <td align="center">{{index+1}}</td>
                                        <td align="center">收入</td>
                                        <td align="center">{{item.settleItemName}}</td>
                                        <td class="no-padding" align="center" v-if="item.editable">
                                            <el-input :disabled="!editable" v-model.number="incomeData[index].settleAmount" @change="inputChange(arguments[0],'income',index)" type="text">

                                            </el-input>
                                        </td>
                                        <td align="center" v-else>{{item.settleAmount}}</td>
                                    </tr>
                                    <tr v-if="incomeData.length">
                                        <td></td>
                                        <td align="center">收入合计</td>
                                        <td></td>
                                        <td align="center">{{incomeSum}}</td>
                                    </tr>
                                    <tr v-for="(item,index) in expendData">
                                        <td align="center">{{index+incomeData.length+1}}</td>
                                        <td align="center">支出</td>
                                        <td align="center">{{item.settleItemName}}</td>
                                        <td align="center">{{item.settleAmount}}</td>
                                    </tr>
                                    <tr v-if="expendData.length">
                                        <td></td>
                                        <td align="center">支出合计</td>
                                        <td></td>
                                        <td align="center">{{expendSum}}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td align="center">结算金额</td>
                                        <td></td>
                                        <td align="center">{{settleSum}}</td>
                                    </tr>
                                </tbody>
                            </table>
	                  	</el-tab-pane>
                        <el-tab-pane label="结算凭证" name="certificate">
                            <div class="list-container" :class="{'settle-record-verify':!editable}">
                                <el-upload
                                    :action="uploadURL"
                                    :data="uploadParams"
                                    multiple
                                    list-type="picture-card"
                                    accept=".jpg,.jpeg,.png,.bmp"
                                    :file-list="imgList"
                                    :on-preview="handlePictureCardPreview"
                                    :on-success="handleSuccess"
                                    :on-remove="handleRemove"
                                    :before-upload="beforeUpload"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-tab-pane>
	              	</el-tabs>
	            </div>
            </div>
        </div>
    </el-dialog>
    <el-dialog v-model="dialogVisible" size="large">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
</div>
</template>

<script>
    import Utils from 'src/utils/Utils.js'
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import T8tAudit from 'src/components/t8t-audit/t8t-audit.vue'
    import Cookie from 'js-cookie'
	export default {
        components: {
            T8tAudit,
        },
		data(){
            let that = this;
			return {
                isTopHide: false,
                type: 'view',
				isDialogShow: true,
                tab_info: 'basic',
				tab_detail: 'template',
                incomeData: [],
                expendData: [],
                incomeSum: 0,
                expendSum: 0,
                projectInfo: {},
                uploadURL: Utils.getUploadURL(),
                uploadParams: {
                    bucket: 'scm',
                    module: 'delivery'
                },
                dialogImageUrl: '',
                dialogVisible: false,
                auditForm: true,
                fileList: [],
                imgList: [],
                attachRelation:{}, //附件id及upload组件uid之前的关联关系，只为移除已上传的图片
                editable: false
			}
		},
        created(){
            Model.settleBillFindDetailByProcessId({processId: this.$route.query.processId ? this.$route.query.processId : this.$route.query.procInsId, assignee: +Cookie.get('t8t-tc-uid')}).then((res)=>{
                if(res.data.status === 200){
                    this.projectInfo = res.data.result;
                    if(res.data.result.currentVeirfyLevel == 1){
                        this.editable = true;
                    }else if(res.data.result.currentVeirfyLevel == -1){
                        this.$msgbox({
                            title: '',
                            message: '没有该结算单审核权限！',
                            type: 'error',
                            callback: ()=>{
                                this.$router.go(-1);
                            }
                        })
                    }
                    let settleBillItemVOs = res.data.result.settleBillItemVOs;
                    settleBillItemVOs.forEach((item)=>{
                        if(res.data.result.editSettleItemCodes.indexOf(item.settleItemWholeCode) > -1){
                            item.editable = true;
                        }else{
                            item.editable = false;
                        }
                        if(item.receiptsType == 1){ //收入
                            this.incomeData.push(item);
                            this.incomeSum += item.settleAmount;
                        }else if(item.receiptsType == 2){ //支出
                            this.expendData.push(item);
                            this.expendSum += item.settleAmount;
                        }
                    })
                    this.incomeSum = parseFloat(this.incomeSum.toFixed(2));
                    this.expendSum = parseFloat(this.expendSum.toFixed(2));
                    let attachVOs = res.data.result.settleAttachVOs;
                    let imgList = [];
                    let fileList = [];
                    for(let j=0; j<attachVOs.length; j++){
                        let temp = {
                            id: attachVOs[j].id,
                            attachName: attachVOs[j].attachName,
                            attachPath: attachVOs[j].attachPath ? attachVOs[j].attachPath : '',
                            filePath: attachVOs[j].filePath,
                            name: attachVOs[j].attachName,
                            url: attachVOs[j].attachPath ? Utils.getFullURL(attachVOs[j].filePath) : 'http://pic.to8to.com/' + attachVOs[j].filePath
                        };
                        imgList.push(temp);
                        fileList.push(temp);
                    }
                    this.fileList = fileList;
                    this.imgList = imgList;
                }
            })
        },
        computed:{
            settleSum:function(){
                return parseFloat((this.incomeSum - this.expendSum).toFixed(2));
            }
        },
        methods: {
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                this.$router.go(-1)
            },
            save(){
                //集成点击流
                this.$TCS.addTag('red_10463_028001003002');
                this.$refs.t8tAudit.validate((isValid) => {
                    if(isValid){
                        let formData = this.$refs.t8tAudit.ruleForm;
                        //是否上传凭证
                        if(this.editable == true && formData.agree == 1 && this.fileList.length === 0){
                            this.$message.error('请先上传凭证！');
                            this.tab_detail = 'certificate';
                            return false;
                        }
                        let verifySettleDTO = {
                            id: this.projectInfo.id,
                            remarks: formData.idea,
                            verifyUser: +Cookie.get('t8t-tc-uid'),
                            verifyUserName: Cookie.get('t8t-tc-username'),
                            verifyStatus: formData.agree == 1 ? 2 : 3,
                            settleBillItemUpdateDTOList: [],
                            settleAttatchDTOs: this.handleUploadFiles(this.fileList)
                        }
                        let flag = true;
                        this.incomeData.forEach((item)=>{
                            if(this.projectInfo.editSettleItemCodes.indexOf(item.settleItemWholeCode) > -1 && this.editable){
                                if(parseFloat(item.settleAmount) < -100000 || parseFloat(item.settleAmount) > 100000){
                                    flag = false;
                                }
                                verifySettleDTO.settleBillItemUpdateDTOList.push({
                                    id: item.id,
                                    settleAmount: item.settleAmount
                                });
                            }
                        })
                        this.expendData.forEach((item)=>{
                            if(this.projectInfo.editSettleItemCodes.indexOf(item.settleItemWholeCode) > -1 && this.editable){
                                if(parseFloat(item.settleAmount) < -100000 || parseFloat(item.settleAmount) > 100000){
                                    flag = false;
                                }
                                verifySettleDTO.settleBillItemUpdateDTOList.push({
                                    id: item.id,
                                    settleAmount: item.settleAmount
                                });
                            }
                        })
                        if(false === flag){
                            this.$msgbox({
                                title: '警告',
                                type: 'error',
                                message: '金额范围必须在-100000 ~ 100000之间'
                            });
                            return;
                        }
                        Model.settleBillVerify({verifySettleDTO: verifySettleDTO}).then((res)=>{
                            if(res.data.status === 200){
                                this.$msgbox({
                                    title: '',
                                    type: 'success',
                                    message: '提交成功',
                                    callback:()=>{
                                        this.$router.push({
                                            path: '/delivery/settle-record/index',
                                            query: {refresh: 1}
                                        })
                                    }
                                });
                            }else{
                                this.$msgbox({
                                    title: '',
                                    type: 'error',
                                    message: res.data.message ? res.data.message : '提交失败'
                                });
                            }
                        }).catch((error)=>{

                        })
                    }
                })
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            beforeUpload(file){
                if(!this.editable){
                    this.$message.error('你不可以进行此操作！');
                    return false;
                }
                let len = this.fileList.length;
                if(len > 5) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '最多只能上传5张图片！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.imgList = this.fileList.slice(0,9);
                    return false;
                }
            },
            handleSuccess(response, file, fileList){
                let _this = this;
                _this.fileList = fileList;
                _this.attachRelation[file.uid] = response.result;
                if(_this.fileList.length > 5){
                    _this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '最多只能上传5张图片！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    _this.fileList = _this.fileList.slice(0,5);
                    _this.imgList = _this.fileList.slice(0,5);
                }
            },
            handleRemove(file, fileList) {
                if(file && typeof this.attachRelation[file.uid] !== 'undefined'){
                    delete(this.attachRelation[file.uid]);
                }
                this.fileList = fileList;
            },
            handleUploadFiles(fileList){
                if(fileList.length === 0){
                    return [];
                }
                let _this = this;
                return fileList.map(function(item,index,array){
                    if(typeof item.id !== 'undefined' && item.id > 0){
                        return item;
                    }else{
                        let obj = {
                            id:0,
                            attachName: item.name,
                            attachPath: _this.attachRelation[item.uid].id,
                            filePath:  _this.attachRelation[item.uid].filePath,
                        }
                        return obj;
                    }
                })
            },
            inputChange(val,type,index){
                if(type == 'income'){
                    /*if(isNaN(val)){
                        this.$message.error('请输入一个正确的数字');
                        this.incomeData[index].settleAmount = 0;
                    }else if(val < 0){
                        this.$message.error('必须大于等于0');
                        this.incomeData[index].settleAmount = 0;
                    }else if(val > 10000){
                        this.$message.error('必须小于等于10000');
                        this.incomeData[index].settleAmount = 10000;
                    }*/
                    this.incomeSum = 0;
                    this.incomeData.forEach((item)=>{
                        item.settleAmount = item.settleAmount && !isNaN(item.settleAmount) ? parseFloat(item.settleAmount) : 0;
                        this.incomeSum += item.settleAmount;
                    })
                    this.incomeSum = parseFloat(this.incomeSum.toFixed(2));
                }else if(type == 'expend'){
                    this.expendSum = 0;
                    this.expendData.forEach((item)=>{
                        item.settleAmount = item.settleAmount && !isNaN(item.settleAmount) ? parseFloat(item.settleAmount) : 0;
                        this.expendSum += item.settleAmount;
                    })
                    this.expendSum = parseFloat(this.expendSum.toFixed(2));
                }
            }
        }
	}
</script>
<style lang="css" scoped>
    .my-table{
        margin: 20px 20px 0 0;
        border-left: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
        font-size: 12px;
    }
    .my-table td{
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
    }
    .table-row{
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .list-container{
        margin-top: 20px;
    }
    .my-table thead td{
        background-color: #eff9ff;
        font-weight: bold;
    }
    .my-table .no-padding{
        padding: 0
    }
</style>
<style lang="css">
    .settle-record-verify .el-upload{
        display: none;
    }
    .settle-record-verify .el-upload-list__item-actions .el-upload-list__item-delete{
        display: none;
        opacity: 0;
    }
</style>
