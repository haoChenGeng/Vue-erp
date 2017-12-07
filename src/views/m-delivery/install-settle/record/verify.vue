<template>
<div>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
        <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
             <div class="full-dialog-toolbar-container">
                 <div class="toolbar-container">
                     <t8t-toolbar
                         @EDIT-SUBMIT="save"
                         @APPROVAL-FLOW="showFlow"
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
                                <el-form class="dialog2-form-container" :model="info" label-position="right" label-width="120px">
                                        <div class="dialog2-form-item-container">
                                                <el-form-item label="单据编码：">
                                                    <el-input v-model="info.billCode" disabled></el-input>
                                                </el-form-item>
                                        </div>
                                        <div class="dialog2-form-item-container">
                                             <el-form-item label="项目ID：">
                                                 <el-input v-model="info.projectId" disabled></el-input>
                                             </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                             <el-form-item label="业主称呼：">
                                                 <el-input v-model="info.appellation" disabled></el-input>
                                             </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                             <el-form-item label="项目经理：">
                                                 <el-input v-model="info.chiefWorkerName" disabled></el-input>
                                             </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                             <el-form-item label="客户经理：">
                                                 <el-input v-model="info.customerManagerName" disabled></el-input>
                                             </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                             <el-form-item label="工程管家：">
                                                 <el-input v-model="info.projectManagerName" disabled></el-input>
                                             </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                                <el-form-item label="组织：">
                                                    <el-input v-model="info.organizationName" disabled></el-input>
                                                </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                                <el-form-item label="业务类型：">
                                                    <el-input v-model="info.bizTypeName" disabled></el-input>
                                                </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                                <el-form-item label="产品包：">
                                                    <el-input v-model="info.productPkgName" disabled></el-input>
                                                </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                             <el-form-item label="计价面积：">
                                                 <el-input v-model="info.signArea" disabled></el-input>
                                             </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                                <el-form-item label="结算对象：">
                                                    <el-input v-model="info.settleObjectTypeName" disabled></el-input>
                                                </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                                <el-form-item label="结算类型：">
                                                    <el-input v-model="info.settleTypeName" disabled></el-input>
                                                </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                                <el-form-item label="收款人：">
                                                    <el-input v-model="info.receiptorName" disabled></el-input>
                                                </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                                <el-form-item label="结算金额：">
                                                    <el-input v-model="info.settleAmount" disabled></el-input>
                                                </el-form-item>
                                         </div>
                                         <div class="dialog2-form-item-container">
                                             <el-form-item label="工程地址：">
                                                 <el-input type="textarea" v-model="info.addressDetail" disabled></el-input>
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
          		    		<!-- <table class="my-table" cellpadding="8" cellspacing="0" width="100%">
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
                            </table> -->
                            <t8t-grid
                                class="list-container"
                                :columns="columns"
                                :dataSource="amountData"
                                :selectCol="false"
                                :pageBar="false"
                                :editable="editable"
                                ref="t8tTable"
                            >
                            </t8t-grid>
	                  	</el-tab-pane>
                        <el-tab-pane label="结算凭证" name="certificate">
                            <div class="list-container" :class="{'settle-record-verify':!editable}">
                                <el-upload
                                    :action="uploadURL"
                                    :data="uploadParams"
                                    multiple
                                    list-type="picture-card"
                                    accept=".jpg,.png,.gif"
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
                        <el-tab-pane label="单据信息" name="billInfo">
                                <table class="my-table" cellpadding="8" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <td align="center" width="10%">序号</td>
                                            <td align="center" width="45%">结算项</td>
                                            <td align="center" width="45%">单据编号</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in info.settleItemOrderVOs">
                                            <td align="center">{{++index}}</td>
                                            <td align="center">{{item.settleItemWholeCodeName}}</td>
                                            <td align="center">{{item.orderCodeNameList.join(' , ')}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                          </el-tab-pane>
	              	</el-tabs>
	            </div>
            </div>
        </div>
    </el-dialog>
    <el-dialog v-model="dialogVisible" size="large">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <flow :flowId="info.id" v-if="flowDialogShow" @close="flowDialogShow=false"></flow>
</div>
</template>

<script>
    import Utils from 'src/utils/Utils.js'
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import T8tAudit from 'src/components/t8t-audit/t8t-audit.vue'
    import Cookie from 'js-cookie'
    import flow from './flow.vue'
	export default {
        components: {
            T8tAudit,flow
        },
		data(){
            let validateAmount = (rule,value,callback)=>{
                if(value === ''){
                    return callback(new Error('金额不能为空'));
                }
                if(false === /^(\-)?\d+$|(^(\-)?\d+\.\d{1,2}$)/.test(value) || !(value >= -100000 && value <= 100000)){
                    return callback(new Error('金额必须是大于等于-100000且小于等于100000的数字，且最多只能两位小数'));
                }
                callback();
            }
            let that = this;
			return {
                isTopHide: false,
                type: 'view',
				isDialogShow: true,
                tab_info: 'basic',
				tab_detail: 'template',
                info: {},
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
                editable: false,
                flowDialogShow: false,
                columns: [
                    {
                        prop: 'index',
                        label: '序号'
                    },
                    {
                        prop: 'type',
                        label: '收支类型'
                    },
                    {
                        prop: 'settleItemName',
                        label: '结算项'
                    },
                    {
                        prop: 'settleAmount',
                        label: '金额',
                        editor:{
                            type: 'input',
                            rules: [
                                {
                                    validator: validateAmount
                                }
                            ]
                        },
                        onClick(val,row,col,table){
                            if(!row.editable){
                                table.handleFormItemBlur();
                            }
                        },
                        onChange(val,row,col,table){
                            let incomeSum = 0;
                            let expendSum = 0;
                            let settleSum = 0;
                            //row.settleAmount = row.settleAmount && !isNaN(row.settleAmount) ? parseFloat(row.settleAmount) : 0;
                            table.dataSource.forEach((item)=>{
                                var settleAmount = item.settleAmount && !isNaN(item.settleAmount) ? parseFloat(item.settleAmount) : 0;
                                if(item.receiptsType == 1){
                                    incomeSum += settleAmount;
                                }
                                if(item.receiptsType == 2){
                                    expendSum += settleAmount;
                                }
                                if(typeof item.flag !== 'undefined'){
                                    if(item.flag == 'incomeSum'){
                                        item.settleAmount = incomeSum.toFixed(2);
                                    } else if (item.flag == 'expendSum'){
                                        item.settleAmount = expendSum.toFixed(2);
                                    } else if (item.flag == 'settleSum'){
                                        item.settleAmount = (incomeSum - expendSum).toFixed(2);
                                    }
                                }
                            })
                        }
                    }
                ],
                amountData:[]
			}
		},
        created(){
            Model.settleInstallBillFindByProcessId({processId: this.$route.query.processId ? this.$route.query.processId : this.$route.query.procInsId, assignee: +Cookie.get('t8t-tc-uid')}).then((res)=>{
                if(res.data.status === 200){
                    this.info = res.data.result;
                    if(res.data.result.currentVeirfyLevel == 2){
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
                    let amountData = [];
                    let incomeData = [];
                    let incomeSum = 0;
                    let expendData = [];
                    let expendSum = 0;
                    let settleSum = 0;
                    settleBillItemVOs.forEach((item,index)=>{
                        if(res.data.result.editSettleItemCodes.indexOf(item.settleItemWholeCode) > -1){
                            item.editable = true;
                        }else{
                            item.editable = false;
                        }
                        item.index = ++index;
                        if(item.receiptsType == 1){ //收入
                            item.type = '收入';
                            incomeData.push(item);
                            incomeSum += item.settleAmount;
                            item.settleAmount = parseFloat(item.settleAmount).toFixed(2);
                        }else if(item.receiptsType == 2){ //支出
                            item.type = '支出';
                            expendData.push(item);
                            expendSum += item.settleAmount;
                            item.settleAmount = parseFloat(item.settleAmount).toFixed(2);
                        }
                    })
                    settleSum = parseFloat((incomeSum - expendSum).toFixed(2));
                    this.amountData = amountData.concat(
                        incomeData,
                        [{type: '收入合计', settleAmount: incomeSum.toFixed(2), flag: 'incomeSum'}],
                        expendData,
                        [{type: '支出合计',  settleAmount: expendSum.toFixed(2), flag: 'expendSum'}],
                        [{type: '结算金额', settleAmount: settleSum.toFixed(2), flag: 'settleSum'}]
                    );
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
                } else {
                    this.$msgbox({
                        title: '',
                        type: 'warning',
                        message: res.data.message
                    })
                }
            }).catch((error)=>{
                this.$msgbox({
                    title: '',
                    type: 'warning',
                    message: '获取数据失败！请重试'
                })
            })
        },
        methods: {
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                this.$router.go(-1)
            },
            showFlow(){
                this.flowDialogShow = true;
            },
            save(){
                //集成点击流
                this.$TCS.addTag('red_13765_028004003002');
                this.$refs.t8tAudit.validate((isValid) => {
                    if(isValid){
                        //表格校验
                        let tableValid = this.$refs['t8tTable'].validate(()=>{},false,true);
                        if(!tableValid){
                            return;
                        }
                        let formData = this.$refs.t8tAudit.ruleForm;
                        //是否上传凭证
                        if(this.editable == true && formData.agree == 1 && this.fileList.length === 0){
                            this.$message.error('请先上传凭证！');
                            this.tab_detail = 'certificate';
                            return false;
                        }
                        let verifySettleDTO = {
                            id: this.info.id,
                            remarks: formData.idea,
                            verifyUser: +Cookie.get('t8t-tc-uid'),
                            verifyUserName: Cookie.get('t8t-tc-username'),
                            verifyStatus: formData.agree == 1 ? 2 : 3,
                            settleBillItemUpdateDTOList: [],
                            settleAttatchDTOs: this.handleUploadFiles(this.fileList),
                            currentVeirfyLevel: this.info.currentVeirfyLevel
                        }
                        let flag = true;
                        // this.incomeData.forEach((item)=>{
                        //     if(this.info.editSettleItemCodes.indexOf(item.settleItemWholeCode) > -1 && this.editable){
                        //         if(parseFloat(item.settleAmount) < -100000 || parseFloat(item.settleAmount) > 100000){
                        //             flag = false;
                        //         }
                        //         verifySettleDTO.settleBillItemUpdateDTOList.push({
                        //             id: item.id,
                        //             settleAmount: item.settleAmount
                        //         });
                        //     }
                        // })
                        // this.expendData.forEach((item)=>{
                        //     if(this.info.editSettleItemCodes.indexOf(item.settleItemWholeCode) > -1 && this.editable){
                        //         if(parseFloat(item.settleAmount) < -100000 || parseFloat(item.settleAmount) > 100000){
                        //             flag = false;
                        //         }
                        //         verifySettleDTO.settleBillItemUpdateDTOList.push({
                        //             id: item.id,
                        //             settleAmount: item.settleAmount
                        //         });
                        //     }
                        // })
                        this.amountData.forEach((item)=>{
                            if(typeof item.settleItemWholeCode !== 'undefined' && this.info.editSettleItemCodes.indexOf(item.settleItemWholeCode) > -1 && this.editable){
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
                        Model.settleInstallBillVerify({verifySettleDTO: verifySettleDTO}).then((res)=>{
                            if(res.data.status === 200){
                                this.$msgbox({
                                    title: '',
                                    type: 'success',
                                    message: '提交成功',
                                    callback:()=>{
                                        this.$router.push({
                                            path: '/tochat-delivery/settle-record/install-list',
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
                            this.$msgbox({
                                title: '',
                                type: 'error',
                                message: '提交出错，请重试！'
                            });
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
                if(len > 10) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '最多只能上传10张图片！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.imgList = this.fileList.slice(0,10);
                    return false;
                }
            },
            handleSuccess(response, file, fileList){
                let _this = this;
                _this.fileList = fileList;
                if(response.status != 200){
                    this.$msgbox({
                        title: '',
                        type: 'warning',
                        message: response.message + ' 请删除重新上传！文件名：' + file.name
                    })
                }
                _this.attachRelation[file.uid] = response.result;
                if(_this.fileList.length > 10){
                    _this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '最多只能上传10张图片！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    _this.fileList = _this.fileList.slice(0,10);
                    _this.imgList = _this.fileList.slice(0,10);
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
                            attachPath: _this.attachRelation[item.uid] ? _this.attachRelation[item.uid].id : '',
                            filePath: _this.attachRelation[item.uid] ? _this.attachRelation[item.uid].filePath : '',
                        }
                        return obj;
                    }
                })
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
        position: absolute;
    }
</style>
