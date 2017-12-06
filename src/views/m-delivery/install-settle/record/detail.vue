<template>
<div>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
        <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
             <div class="full-dialog-toolbar-container">
                 <div class="toolbar-container">
                     <t8t-toolbar
                         @APPROVAL-FLOW="approvalFlow"
                         class="t8t-dark"
                     >
                     </t8t-toolbar>
                 </div>
             </div>
             <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                <!-- 表单区 -->

                <div class="full-dialog-form-container">
                         <el-tabs v-model="tab_info">
                             <el-tab-pane label="基本信息" name="basic">
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
	                  	  <el-tab-pane label="结算明细" name="template">
                            <t8t-grid
                                class="list-container"
                                :columns="columns"
                                :dataSource="amountData"
                                :selectCol="false"
                                :pageBar="false"
                                ref="t8tTable"
                            >
                            </t8t-grid>
                          </el-tab-pane>
                          <el-tab-pane label="结算凭证" name="pic">
                                <div class="delivery-settle-record-install-detail-view">
                                    <el-upload
                                        :style="{marginTop: '15px'}"
                                        list-type="picture-card"
                                        :file-list="imgList"
                                        :on-preview="handlePictureCardPreview"
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
</div>
</template>

<script>
    import Utils from 'src/utils/Utils.js'
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import axios from 'src/utils/axios.js'
	export default {
		data(){
            let that = this;
			return {
                isTopHide: false,
                tab_info: 'basic',
                type: 'view',
				isDialogShow: true,
				tab_detail: 'template',
                info: {},
                imgList: [],
                dialogImageUrl: '',
                dialogVisible: false,
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
                        label: '金额'
                    }
                ],
                amountData:[]
			}
		},
        created(){
            this.getInfo();
        },
        methods: {
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                this.$router.go(-1)
            },
            approvalFlow(){
                this.$router.push({
                    path: '/delivery/settle-record/flow',
                    query: { id: this.$route.query.id }
                })
            },
            getInfo(){
                axios({
                    service: Service.PSSET.name,
                    method: Service.PSSET.methods.settleInstallBillFindDetailById,
                    args: {id: this.$route.query.id}
                }).then((res)=>{
                    if(res.data.status === 200){
                        this.info = res.data.result;
                        let amountData = [];
                        let incomeData = [];
                        let incomeSum = 0;
                        let expendData = [];
                        let expendSum = 0;
                        let settleSum = 0;
                        this.info.settleBillItemVOs.forEach((item,index)=>{
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
                        }
                        this.imgList = imgList;
                    }else{
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
                        message: '获取信息失败，请重试！'
                    })
                })
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
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
    .my-table thead td{
        background-color: #eff9ff;
        font-weight: bold;
    }
    .list-container{
        margin-top: 20px;
    }
</style>
<style>
    .delivery-settle-record-install-detail-view .el-upload{
        display: none;
    }
    .delivery-settle-record-install-detail-view .el-upload-list__item-actions .el-upload-list__item-delete{
        display: none;
        opacity: 0;
        position: absolute;
    }
</style>