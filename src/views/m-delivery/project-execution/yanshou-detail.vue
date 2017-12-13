<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog v-loading.fullscreen.lock="fullscreenLoading" @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 yanshou-detail-dialog dialog-new" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            @EDIT-SUBMIT="checkSubmit(1)"
                            @TEMP-SAVE="checkSubmit(2)"
                            @CANCEL="cancelSubmit"
                            class="t8t-dark"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-tabs v-model="tab_info">
                            <el-tab-pane label="基本信息" name="basic">
                                <el-form class="dialog2-form-container" :model="detailInfo" :rules="rules" ref="formRef" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="单据编号：">
                                            <el-input placeholder="提交时自动生成" v-model="detailInfo.billCode" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="单据类型：">
                                            <el-input v-model="detailInfo.billTypeName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="项目ID：">
                                            <el-input v-model="detailInfo.projectId" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="验收节点：">
                                            <el-input v-model="detailInfo.sheduleNodeName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="组织：">
                                            <el-input v-model="detailInfo.organizationName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="验收状态：">
                                            <el-input v-model="detailInfo.statusName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="详细地址：">
                                            <el-input v-model="detailInfo.addressDetail" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="申请验收开始时间：">
                                            <el-date-picker
                                                disabled
                                                :value="!detailInfo.expectStartTime ? '' : detailInfo.expectStartTime * 1000"
                                                placeholder=""
                                                type="datetime"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="申请验收结束时间：">
                                            <el-date-picker
                                                disabled
                                                :value="!detailInfo.expectCheckTime ? '' : detailInfo.expectCheckTime * 1000"
                                                placeholder=""
                                                type="datetime"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="预约验收开始时间：">
                                            <el-date-picker
                                                disabled
                                                :value="!detailInfo.orderStartTime ? '' : detailInfo.orderStartTime * 1000"
                                                placeholder=""
                                                type="datetime"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="预约验收结束时间：">
                                            <el-date-picker
                                                disabled
                                                :value="!detailInfo.orderCheckTime ? '' : detailInfo.orderCheckTime * 1000"
                                                placeholder=""
                                                type="datetime"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="实际验收开始时间：" prop="checkStartTime">
                                            <el-date-picker
                                                :value="!detailInfo.checkStartTime ? '' : detailInfo.checkStartTime * 1000"
                                                placeholder=""
                                                type="datetime"
                                                @input="handleCheckTimeChange(Date.parse(arguments[0]) / 1000, 'checkStartTime')"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="实际验收结束时间：" prop="checkTime">
                                            <el-date-picker
                                                :value="!detailInfo.checkTime ? '' : detailInfo.checkTime * 1000"
                                                placeholder=""
                                                type="datetime"
                                                @input="handleCheckTimeChange(Date.parse(arguments[0]) / 1000, 'checkTime')"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="其他信息" name="other">
                                <el-form class="dialog2-form-container" :model="detailInfo" ref="formRef" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业主ID：">
                                            <el-input v-model="detailInfo.ownerId" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业主姓名：">
                                            <el-input v-model="detailInfo.ownerName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业主电话ID：">
                                            <el-input v-model="detailInfo.ownerPhoneId" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="工长ID：">
                                            <el-input v-model="detailInfo.workerId" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="工长姓名：">
                                            <el-input v-model="detailInfo.workerName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="工长电话ID：">
                                            <el-input v-model="detailInfo.workerPhoneId" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="交付管家ID：">
                                            <el-input v-model="detailInfo.payAdvisorId" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="交付管家姓名：">
                                            <el-input v-model="detailInfo.payAdvisorName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="交付管家电话ID：">
                                            <el-input v-model="detailInfo.payAdvisorPhoneId" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="创建人：">
                                            <el-input v-model="detailInfo.createUserName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="验收单创建时间：">
                                            <el-date-picker
                                                disabled
                                                :value="!detailInfo.createTime ? '' : detailInfo.createTime * 1000"
                                                placeholder=""
                                                type="datetime"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="tab_detail" @tab-click="handleTabClick">
                            <el-tab-pane v-for="(item,index) in detailInfo.checkItemVOList" :label="item.checkTypeName" :name="'tab_' + item.id">
                                <div class="checkItem">
                                    <h3>是否合格</h3>
                                    <div class="checkItem_detail">
                                        <el-radio class="radio" v-model="item.status" :label="1">合格</el-radio>
                                        <el-radio class="radio" v-model="item.status" :label="2">不合格</el-radio>
                                    </div>
                                </div>
                                <div v-for="(group,i) in detailInfo.groupInfo[item.id]" class="an_detail">
                                    <div class="checkItem">
                                        <h3>{{group.groupVO.groupAssistName}}</h3>
                                        <div class="checkItem_detail">
                                            <table class="my-table" cellpadding="6" cellspacing="0">
                                                <tbody>
                                                <tr v-for="checkDetail in group.checkItemDetailVOs">
                                                    <td>{{checkDetail.questionContent}}</td>
                                                    <td>
                                                        <div v-if="checkDetail.answerWidgetTypeCode == '1'" class="fsize">
                                                            <el-input class="table-row" v-for="answer in checkDetail.checkAnswerVOs" v-model="formData[answer.id]">
                                                                <template slot="prepend">{{answer.answerContent}}</template>
                                                            </el-input>
                                                        </div>
                                                        <div v-else-if="checkDetail.answerWidgetTypeCode == '2'">
                                                            <el-radio
                                                                v-for="(answer,an_index) in checkDetail.checkAnswerVOs"
                                                                v-model="formData['radio-'+checkDetail.questionId]"
                                                                class="radio"
                                                                :label="answer.id"
                                                            >
                                                                {{answer.answerContent}}
                                                            </el-radio>
                                                        </div>
                                                        <div v-else-if="checkDetail.answerWidgetTypeCode == '3'">
                                                            <el-checkbox-group  v-model="formData['checkbox-'+checkDetail.questionId]">
                                                                <el-checkbox v-for="(answer,an_index) in checkDetail.checkAnswerVOs" :label="answer.id"> {{answer.answerContent}}</el-checkbox>
                                                            </el-checkbox-group>
                                                        </div>
                                                        <div v-else-if="checkDetail.answerWidgetTypeCode == '4'">
                                                            <el-rate
                                                                v-for="answer in checkDetail.checkAnswerVOs"
                                                                v-model="formData[answer.id]"
                                                                show-text
                                                                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                                                                :texts="rateTexts"
                                                                @change="handleRateChange"
                                                            >
                                                            </el-rate>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="checkItem">
                                    <h3>上传图片</h3>
                                    <div class="checkItem_detail list-container">
                                        <el-upload
                                            :action="uploadURL"
                                            :data="uploadParams"
                                            multiple
                                            list-type="picture-card"
                                            accept=".jpg,.jpeg,.png,.bmp"
                                            :file-list="detailInfo.imgList[item.id]"
                                            :on-success="handleSuccess(item.id)"
                                            :on-preview="handlePictureCardPreview"
                                            :before-upload="beforeUpload(item.id)"
                                            :on-remove="handleRemove(item.id)">
                                            <i class="el-icon-plus"></i>
                                        </el-upload>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
        <el-dialog v-model="dialogVisible" size="large">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
    import Utils from 'src/utils/Utils.js'
    import Cookie from 'js-cookie'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    export default {
        data () {
            let validateCheckTime = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error('请选择实际验收结束时间'));
                }
                if(this.detailInfo.checkStartTime && +this.detailInfo.checkStartTime >= +this.detailInfo.checkTime){
                    return callback(new Error('结束时间必须大于开始时间'));
                }
                callback();
            }
            return {
                isDialogShow: true,
                isTopHide: false,
                tab_info: 'basic',
                tab_detail: '',
                detailInfo: {
                    checkItemVOList:[],
                    imgList:{},
                    groupInfo: {},
                    billCode: '',
                    billTypeName: '',
                    projectId: '',
                    sheduleNodeName: '',
                    organizationName: '',
                    createUserName: '',
                    status: '',
                    statusName: '',
                    addressDetail:'',
                    expectStartTime: '',
                    expectCheckTime: '',
                    orderStartTime: '',
                    orderCheckTime: '',
                    checkStartTime: '',
                    checkTime: '',
                    ownerId: '',
                    ownerName: '',
                    ownerPhoneId: '',
                    workerId: '',
                    workerName: '',
                    workerPhoneId: '',
                    payAdvisorId: '',
                    payAdvisorName: '',
                    payAdvisorPhoneId: '',
                    createTime: ''
                },
                rules:{
                    /*checkStartTime: [
                        { type: 'number', required: true , message: "请选择实际验收开始时间",trigger: 'change'},
                    ],
                    checkTime: [
                        { type: 'number', required: true, trigger: 'change', validator: validateCheckTime},
                    ]*/
                },
                uploadURL: Utils.getPicUploadURL(),
                uploadParams: {
                    bucket: 'scm',
                    module: 'pic/delivery',
                    imgText: '土巴兔装修',
                    fontLocate : 5,//文字写入位置
                    fontColor:'#ffffff',//水印字体颜色 默认#00000
                    fontOpercity:0.6,//水印字体透明度 默认1
                    fontSize:64,//水印字体大小 默认20
                },
                dialogImageUrl: '',
                dialogVisible: false,
                fullscreenLoading: true,
                formData: {},
                rateTexts:[],
                tabs:{}, //动态tabs
                attachRelation:{}, //附件id及upload组件uid之前的关联关系，只为移除已上传的图片
                fileList:{}
            }
        },
        created(){
            //获取基本信息
            TemplateOperator.checkGetHead({billCode: this.$route.query.billCode})
                .then((res) => {
                    if (res.data.status === 200) {
                        this.detailInfo = Object.assign(this.detailInfo,res.data.result);
                        for(let i=0; i<this.detailInfo.checkItemVOList.length; i++){
                            let attachVOs = this.detailInfo.checkItemVOList[i].attachVOs;
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
                            this.fileList[this.detailInfo.checkItemVOList[i].id] = fileList;
                            this.$set(this.detailInfo.imgList,this.detailInfo.checkItemVOList[i].id,imgList)
                        }
                        //获取条目问题详情信息
                        this.detailInfo.checkItemVOList.length > 0 && this.getCheckDetail(this.detailInfo.checkItemVOList[0].id);
                    }
                    this.fullscreenLoading = false;
            });
        },
        methods: {
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                // 填写对应的路由
                //this.$router.push({ path: '/tuchat-delivery/yanshou-bill' })
                this.$router.go(-1)
            },
            handleCheckTimeChange(val,variable){
                this.detailInfo[variable] = val;
            },
            handleTabClick(tab,e){
                if(typeof this.tabs[this.tab_detail] === 'undefined' || true !== this.tabs[this.tab_detail]){
                    let checkItemId = this.tab_detail.substr(4);
                    if(this.getCheckDetail(checkItemId)){
                        this.tabs[this.tab_detail] = true;
                    }
                }
            },
            handleRateChange(val){

            },
            dateParser(text) {
                let dateString;
                let objDate = new Date(text * 1000);
                if (text === 0 || text === null) {
                    dateString = ""
                } else {
                    dateString = DateUtils(objDate, 'yyyy-mm-dd HH:MM')
                }
                return dateString
            },
            getCheckDetail(checkItemId){
                checkItemId = parseInt(checkItemId);
                this.tabs['tab_' + checkItemId] = true; //标识已切换过
                this.tab_detail = 'tab_' + checkItemId; //当前显示tab
                TemplateOperator.checkDetailGetDetail({checkItemId: checkItemId}).then((result) =>{ //获取条目问题答案详情
                    let checkDetail = result.data.result;
                    this.$set(this.detailInfo.groupInfo,checkItemId,checkDetail);
                    for(let i=0; i<checkDetail.length; i++){
                        let checkItemDetailVOs = checkDetail[i].checkItemDetailVOs;
                        for(var j=0; j<checkItemDetailVOs.length; j++){
                            if(checkItemDetailVOs[j].answerWidgetTypeCode == 2){ //单选框
                                this.$set(this.formData,'radio-' + checkItemDetailVOs[j].questionId,typeof checkItemDetailVOs[j].checkAnswerIds[0] !== 'undefined'? checkItemDetailVOs[j].checkAnswerIds[0] : null);
                            }else if(checkItemDetailVOs[j].answerWidgetTypeCode == 3){ //多选框
                                this.$set(this.formData,'checkbox-' + checkItemDetailVOs[j].questionId,checkItemDetailVOs[j].checkAnswerIds);
                            }
                            let checkAnswerVOs = checkItemDetailVOs[j].checkAnswerVOs;
                            for(var k=0; k<checkAnswerVOs.length; k++){
                                if(checkItemDetailVOs[j].answerWidgetTypeCode == 1 || checkItemDetailVOs[j].answerWidgetTypeCode == 4){
                                    this.$set(this.formData,checkAnswerVOs[k].id,checkAnswerVOs[k].checkAnswer);
                                }
                                if(checkItemDetailVOs[j].maxScore > 0){ //评分控件处理
                                    this.rateTexts = [1,2,3,4,5].map(function(item,index,array){
                                        return item * (parseInt(checkItemDetailVOs[j].maxScore) / 5);
                                    });
                                }
                            }
                        }
                    }
                    return true;
                }).catch((res) => {
                    return false;
                })
            },
            checkSubmit(optType){
                if(optType === 1){
                    //集成点击流
                    this.$TCS.addTag('red_2928_010004002001');
                }
                //时间大小判断
                if(this.detailInfo.checkStartTime && this.detailInfo.checkTime && +this.detailInfo.checkStartTime >= +this.detailInfo.checkTime){
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '结束时间必须大于开始时间！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    return false;
                }
                if(optType === 1){
                    if(!this.detailInfo.checkStartTime || !this.detailInfo.checkTime){
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '请填写实际验收时间！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                        return false;
                    }
                    for(let i in this.fileList){
                        if(this.fileList[i].length == 0){
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '请上传图片！',
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            });
                            return false;
                        }
                    }
                }
                let updateUser = +Cookie.get('t8t-tc-uid');
                let checkItemUpdateDTOs = [];
                let flag = true;
                for(let c=0; c<this.detailInfo.checkItemVOList.length; c++){
                    let checkItemId = this.detailInfo.checkItemVOList[c].id;
                    let checkStatus = this.detailInfo.checkItemVOList[c].status;
                    if(optType === 1 && !checkStatus){
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '请选择是否合格！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                        flag = false;
                        break;
                    }
                    let pimAttachDTOs = this.handleUploadFiles(this.fileList[checkItemId]);
                    pimAttachDTOs.forEach((item)=>{
                        if(!item.attachName){
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '图片信息有误！请删除重新上传',
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            });
                            flag = false;
                        }
                    })
                    checkItemUpdateDTOs.push({
                        id: checkItemId,
                        pimAttachDTOs:pimAttachDTOs,
                        //pimAttachDTOs:this.detailInfo.imgList[checkItemId],
                        status:checkStatus
                    })
                }
                if(!flag){
                    return;
                }
                let check ={
                    id:this.$route.query.id,
                    checkStartTime: +this.detailInfo.checkStartTime ? +this.detailInfo.checkStartTime : 0,
                    checkTime: +this.detailInfo.checkTime ? +this.detailInfo.checkTime : 0,
                    updateUser: +updateUser,
                    checkItemUpdateDTOs:checkItemUpdateDTOs
                };
                let answer = [];
                for(let key in this.formData){
                    if(this.formData[key]){
                        if(key.indexOf('radio-') > -1){ //单选框
                            answer.push({
                                id:this.formData[key],
                                checkAnswer:this.formData[key],
                                updateUser: updateUser
                            })
                        }else if(key.indexOf('checkbox-') > -1){
                            for(let i=0; i<this.formData[key].length; i++){
                                answer.push({
                                    id:this.formData[key][i],
                                    checkAnswer:this.formData[key][i],
                                    updateUser: updateUser
                                })
                            }
                        }else{
                            answer.push({
                                id:+key,
                                checkAnswer:this.formData[key],
                                updateUser: updateUser
                            })
                        }
                    }else if(optType === 1){
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '请完善答案信息！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        return false;
                    }
                }
                this.fullscreenLoading = true;
                TemplateOperator.checkSubmitOrUpdate({check: check, answer: answer, optType: optType}).then((res) =>{
                    this.fullscreenLoading = false;
                    if(res.data.status === 200){
                        let _this = this;
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: optType == 1 ? '提交成功！' : '暂存成功！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain',
                            callback:function(action,instance){
                                if(optType === 1){
                                    _this.$router.push({
                                        path: '/tuchat-delivery/yanshou-bill',
                                        query:{
                                            refresh:null
                                        }
                                    })
                                }
                            }
                        })
                    }else{
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: optType == 1 ? '提交失败！' : '暂存失败！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                    }
                })
            },
            cancelSubmit(){
                this.$confirm('是否放弃操作离开本页面？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.closeDialog();
                }).catch(() => {

                });
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
                            filePath:  _this.attachRelation[item.uid].appendFilePath,
                        }
                        return obj;
                    }
                })
            },
            handleSuccess(checkItemId){
                let _this = this;
                return function(response, file, fileList){
                    _this.fileList[checkItemId] = fileList;
                    _this.attachRelation[file.uid] = response.result;
                    if(_this.fileList[checkItemId].length > 9){
                        _this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '最多只能上传9张图片！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                        _this.fileList[checkItemId] = _this.fileList[checkItemId].slice(0,9);
                        _this.detailInfo.imgList[checkItemId] = _this.fileList[checkItemId].slice(0,9);
                    }
                }
            },
            handleRemove(checkItemId) {
                let _this = this;
                return function(file, fileList){
                    if(typeof _this.attachRelation[file.uid] !== 'undefined'){
                        delete(_this.attachRelation[file.uid]);
                    }
                    _this.fileList[checkItemId] = fileList;
                }
            },
            handlePictureCardPreview(file) {
                let fileUrl = '';
                if(typeof file.id === 'undefined'){
                    fileUrl = Utils.getFullURL(this.attachRelation[file.uid].appendFilePath);
                }
                this.dialogImageUrl = fileUrl ? fileUrl : file.url;
                this.$nextTick(()=>{
                    this.dialogVisible = true;
                })
            },
            beforeUpload(checkItemId){
                let _this = this;
                return function(file){
                    let len = _this.fileList[checkItemId].length;
                    if(len > 9) {
                        _this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '最多只能上传9张图片！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                        _this.detailInfo.imgList[checkItemId] = _this.fileList[checkItemId].slice(0,9);
                        return false;
                    }
                }
                /*if(this.detailInfo.imgList[this.currentCheckItemId].length >= 9){
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: '最多只能上传9张图片！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.detailInfo.imgList[this.currentCheckItemId] = this.detailInfo.imgList[this.currentCheckItemId].concat([]);
                    return false;
                }*/
            }
        }
    };
</script>

<style>
    .yanshou-detail-dialog .full-dialog-tabs-container .el-tab-pane{
        display: block;
    }
    .yanshou-detail-dialog .my-table tbody td{
        max-width: 500px;
        line-height: 25px;
    }
    .yanshou-detail-dialog .el-upload-list .el-progress__text{
        display: block;
    }
</style>

<style lang="css" scoped>
    .full-dialog-tabs-container{ width: 1600px; margin: 0 auto}
    .checkItem{
        margin-bottom: 30px;
    }
    .checkItem h3{
        margin-bottom: 15px;
        border-left: 4px solid #6b6b6b;
        padding-left: 6px;
        height: 20px;
        line-height: 20px;
    }
    .checkItem .checkItem_detail{
        padding-left: 20px;
    }
    .my-table{
        border-left: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
        font-size: 14px;
    }
    .my-table td{
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
    }
    .table-row{
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>
