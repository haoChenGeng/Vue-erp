<template>
    <div id="measureLine">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog :title="title" v-loading.fullscreen.lock="fullscreenLoading" @close="closeDialog" v-model="isDialogShow" class="lineDialog">
            <div class="t8t-full-dialog2-container">
                <div class="dialog2-main-container">
                    <div class="full-dialog-form-container">
                        <t8t-table
                            ref="lineHeadT8tTable"
                            :columns="columns.lineHeadTable"
                            :dataSource="lineHeaderSource"
                            :pageBar="false"
                            :indexCol="false"
                            :commonData="selectSource"
                            :selectCol="false"
                            :editable="tableSet"
                            @selection-change="selectionChange"
                        >
                        </t8t-table>
                    </div>
                    <div class="full-dialog-form-container">
                        <el-tabs v-model="tabSelected">
                            <el-tab-pane label="配件列表" name="one">
                                <el-form class="dialog2-form-container" :model="detailInfo" ref="formRef" label-position="right" label-width="120px">
                                    <t8t-table
                                        ref="lineItemT8tTable"
                                        :columns="columns.lineItemTable"
                                        :dataSource="lineDetailSource"
                                        :pageBar="false"
                                        :indexCol="false"
                                        :selectCol="false"
                                        :commonData="selectSource"
                                        :editable="tableSet"
                                        @selection-change="selectionChange"
                                        @cell-click="handleFormItemBlur"
                                    ></t8t-table>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="full-dialog-form-container">
                        <el-tabs v-model="tabSelected">
                            <el-tab-pane label="测量数据" name="one">
                                <div class="checkItem_detail list-container">
                                    <table class="my-table" cellpadding="6" cellspacing="0">
                                        <tbody>
                                        <tr v-for="checkDetail in tablesInfo">
                                            <td>{{checkDetail.attributeContent}}</td>
                                            <td>
                                                <div v-if="checkDetail.widgetTypeCode == '1'" class="fsize">
                                                    <el-input class="table-row" v-for="measure in checkDetail.measureItemValueVOS" v-model="formData[measure.id]" :disabled="unEditAble">
                                                        <template slot="prepend">{{measure.attributeValue}}</template>
                                                    </el-input>
                                                </div>
                                                <div v-else-if="checkDetail.widgetTypeCode == '2'">
                                                    <el-radio
                                                        :disabled="unEditAble"
                                                        v-for="(measure,an_index) in checkDetail.measureItemValueVOS"
                                                        v-model="formData['radio-'+checkDetail.attributeId]"
                                                        class="radio"
                                                        :label="measure.id"
                                                    >
                                                        {{measure.attributeValue}}
                                                    </el-radio>
                                                </div>
                                                <div v-else-if="checkDetail.widgetTypeCode == '3'">
                                                    <el-checkbox-group  v-model="formData['checkbox-'+checkDetail.attributeId]">
                                                        <el-checkbox :disabled="unEditAble" v-for="(measure,an_index) in checkDetail.measureItemValueVOS" :label="measure.id"> {{measure.attributeValue}}</el-checkbox>
                                                    </el-checkbox-group>
                                                </div>
                                                <div v-else-if="checkDetail.widgetTypeCode == '4'">
                                                    <el-rate
                                                        :disabled="unEditAble"
                                                        v-for="measure in checkDetail.measureItemValueVOS"
                                                        v-model="formData[measure.id]"
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
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-form-container measure-item">
                        <el-tabs v-model="tabSelected">
                            <el-tab-pane label="上传图片（最多支持9张）" name="one">
                                <div class="checkItem_detail list-container">
                                    <el-upload
                                        :class="viewsType"
                                        :action="uploadURL"
                                        :data="uploadParams"
                                        :multiple="false"
                                        list-type="picture-card"
                                        :file-list="fileList"
                                        :on-change="fileChage"
                                        :on-success="handleSuccess"
                                        :on-preview="handlePictureCardPreview"
                                        :before-upload="beforeUpload"
                                        :on-remove="handleRemove"
                                        :on-error="handleError"
                                        accept=".jpg,.jpeg,.gif,.png,.bmp"
                                    >
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button v-if=" orderType == 'measure-edit' " @click="btnOKClick" type="primary" :loading="isLoading" :disabled="submitDisabled">提交</el-button>
                <el-button v-if=" orderType != 'measure-edit' " @click="btnCloseClick">关闭</el-button>
                <el-button v-if=" orderType == 'measure-edit' " @click="btnCloseClick">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog v-model="dialogVisible" size="large">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
    import Utils from 'src/utils/Utils.js'
    import Cookie from 'js-cookie'
    import COLUMNS from './columns'
    import Api from 'src/services/delivery/measure'

    import Server from 'src/config/server.js'
    export default {
        name:"lineView",
        props:["title","itemId","orderType"],
        data () {
            return {
                isLoading:false,
                viewsType: this.orderType == 'measure-edit' ? '' : 'el-upload-disabled',
                unEditAble: this.orderType == 'measure-edit' ? false : true,



                fullscreenLoading: false,
                tabSelected: "one",
                columns:COLUMNS,
                lineHeaderSource:[],
                lineDetailSource:[],
                test:0,
                tablesInfo:[],
                selectSource: {
                    selectedOption:[
                        {value: 0,text: "未选"},
                        {value: 1,text: "已选"}
                    ]
                },
                tableSet:true,
                isDialogShow: true,
                isTopHide: false,
                tab_info: 'basic',
                tab_detail: true,
                fileList:[],
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
                    orderCheckTime: '',
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

                uploadURL: Utils.getUploadURL(),
                uploadParams: {
                    bucket: 'scm',
                    module: 'delivery'
                },
                attachRelation:[],
                uploadImgList:{},
                dialogImageUrl: '',
                dialogVisible: false,
                formData: {},
                rateTexts:[],
                tabs:{},
                submitDisabled:false,
            }
        },
        created(){
            this.fileList = []
            if(this.orderType != "measure-edit") {
                this.tableSet = false
            }
            if(!this.itemId) {
                this.$message.error("物品ID获取失败！")
            }

            Api.queryItem({id:this.itemId}).then((resData) => {
                if(resData && resData.data.status == 200) {
                    this.lineDetailSource = resData.data.result.accessoriesVOList
                    this.lineHeaderSource.push(resData.data.result)
                    this.tablesInfo = resData.data.result.attributeVOList || []
                    let imgList = resData.data.result.attachVOList || []
                    this.dealCheck(this.tablesInfo)
                    this.imgDeal(imgList)
                    this.setViewType()
                }else{
                    this.$message.error("物品详情获取失败！")
                }
            })

        },
        watch:{
            fileList:function (){
                this.setViewType()
            }
        },
        methods: {
            setViewType() {
                this.viewsType = this.orderType == 'measure-edit' ? '' : 'el-upload-disabled'
                if( this.fileList.length >= 9 ) {
                    this.viewsType += " el-upload-full"
                }
            },
            btnOKClick(){
                let rows = this.$refs['lineHeadT8tTable'].dataSource[0]
                if(!rows.id) {
                    this.$message.error("物品信息读取错误")
                    return false
                }

                this.$refs['lineHeadT8tTable'].validate((validate) => {
                    if(validate) {
                        this.$refs.lineItemT8tTable.validate((vali) =>{
                            if(vali){
                                let submitOrderItemDTO = {
                                    "categoryId":this.lineHeaderSource[0].categoryId,
                                    "id": rows.id,
                                    "measureDosage": rows.measureDosage,//测量值
                                    "remark": rows.remark,
                                    "userId": Cookie.get('t8t-tc-uid'),
                                    "accessoriesDTOList": [],//Todo配件列表
                                    "attachDTOList": [],//附件列表
                                    "attributeValueDTOList": [],//测量数据列表
                                }
                                if(this.fileList.length > 0) {
                                    submitOrderItemDTO.attachDTOList = this.handleUploadFiles(this.fileList)
                                }
                                let accessoriesDTOList = this.$refs.lineItemT8tTable.dataSource.filter((item) =>{
                                        return item.chooseType == 1
                                })
                                submitOrderItemDTO.accessoriesDTOList = accessoriesDTOList
                                //测量信息
                                let measure = []
                                for(let key in this.formData){
                                    if(this.formData[key]){
                                        if(key.indexOf('radio-') > -1){ //单选框
                                            measure.push({
                                                id:this.formData[key],
                                                measureValue:this.formData[key]
                                            })
                                        }else if(key.indexOf('checkbox-') > -1){
                                            for(let i=0; i<this.formData[key].length; i++){
                                                measure.push({
                                                    id:this.formData[key][i],
                                                    measureValue:this.formData[key][i],
                                                })
                                            }
                                        }else{
                                            measure.push({
                                                id:+key,
                                                measureValue:this.formData[key],
                                            })
                                        }
                                    }else{
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'error',
                                            message: '请完善测量数据！',
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                        return false;
                                    }
                                }
                                submitOrderItemDTO.attributeValueDTOList = measure
                                this.submitDisabled = true
                                Api.submitLine({submitOrderItemDTO:submitOrderItemDTO}).then((res) => {
                                    this.submitDisabled = false
                                    if(res.data.status == 200) {
                                        this.$msgbox({
                                            title: '消息',
                                            type: 'success',
                                            message: '提交成功',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                        this.$emit("reloadTable")
                                        this.$emit("close")
                                    }else{
                                        this.$msgbox({
                                            title: '消息',
                                            message: res.data.message || '提交失败',
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                        return false
                                    }
                                })
                                .catch((error) => {
                                        this.submitDisabled = false
                                        this.$msgbox({
                                            title: '消息',
                                            message: error,
                                            type: 'error',
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                        return false
                                })
                            }
                        })
                    }
                },true)
            },
            btnCloseClick(){
                this.$emit("close")
            },

            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                this.$emit("close")
//                this.$router.go(-1)
            },
            handleCheckTimeChange(val){
                this.detailInfo.checkTime = val;
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


            //Todo  配件列表
            handleFormItemBlur(cell, val){
//                if((["supplierCode","supplierName"]).indexOf(column.property) >= 0) {
//                    this.$refs.lineItemT8tTable.handleFormItemBlur()
//                }
//                    this.$refs.lineItemT8tTable.handleFormItemBlur()
            },
            cancelSubmit(){
//                this.$confirm('是否放弃操作离开本页面？', '提示', {
//                    confirmButtonText: '确定',
//                    cancelButtonText: '取消',
//                    type: 'warning'
//                }).then(() => {
//                    this.closeDialog();
//                }).catch(() => {
//
//                });
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
            handleRemove(file, fileList) {
                this.uploadImgList = fileList;
                this.fileList = fileList
                if(typeof this.attachRelation[file.uid] !== 'undefined'){
                    delete(this.attachRelation[file.uid])
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            fileChage(file,fileList) {
                this.flieList = fileList
            },
            beforeUpload(file){
                //todo 上传
                if(this.fileList.length > 9){
                    this.$msgbox({
                            title: '消息',
                            type: 'error',
                            showCancelButton: false,
                            message: '最多只能上传9张图片！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                    this.fileList = this.fileList.slice(0,9);
                    this.detailInfo.imgList = this.fileList.slice(0,9);
                    return false
                }
                this.submitDisabled = true
            },
            handleSuccess(response,file,fileList){
                this.submitDisabled = false
                if(response.status == 200) {
                    this.fileList = fileList
                    this.attachRelation[file.uid] = response.result;
                    if(this.fileList.length > 9){
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            showCancelButton: false,
                            message: '最多只能上传9张图片！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                        this.fileList = this.fileList.slice(0,9);
                        this.detailInfo.imgList = this.fileList.slice(0,9);
                    }
                }else{
                    if(fileList.length > 0 ){
                        for(var i=0;i<fileList.length;i++) {
                            if(fileList[i].uid == file.uid) {
                                fileList.splice(i,1)
                            }
                        }
                    }
                    this.fileList = fileList
                    this.attachRelation[file.uid] = response.result;
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        showCancelButton: false,
                        message: response.message,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    return false
                }
            },
            handleError(err,file,fileList) {
                if(fileList.length > 0 ){
                    for(var i=0;i<fileList.length;i++) {
                        if(fileList[i].uid == file.uid) {
                            fileList.splice(i,1)
                        }
                    }
                }
                this.fileList = fileList
                this.detailInfo.imgList = fileList
                this.$msgbox({
                    title: '消息',
                    type: 'error',
                    showCancelButton: false,
                    message: err,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                });
            },
            //测量数据处理
            dealCheck(checkDetail){
                for(var j=0; j<checkDetail.length; j++){
                    if(checkDetail[j].widgetTypeCode == 2){ //单选框
                        this.$set(this.formData,'radio-' + checkDetail[j].attributeId,typeof checkDetail[j].measureItemValueIds[0] !== 'undefined'? checkDetail[j].measureItemValueIds[0] : null);

                    }else if(checkDetail[j].widgetTypeCode == 3){ //多选框
                        this.$set(this.formData,'checkbox-' + checkDetail[j].attributeId,checkDetail[j].measureItemValueIds);
                    }else if(checkDetail[j].measureItemValueVOS){
                        let measureItemValueVOS = checkDetail[j].measureItemValueVOS;
                        for(var k=0; k<measureItemValueVOS.length; k++){
                            if(checkDetail[j].widgetTypeCode == 1 || checkDetail[j].widgetTypeCode == 4){
                                this.$set(this.formData,measureItemValueVOS[k].id,measureItemValueVOS[k].measureValue);
                            }
                            if(checkDetail[j].maxScore > 0){ //评分控件处理
                                this.rateTexts = [1,2,3,4,5].map(function(item,index,array){
                                    return item * (parseInt(checkDetail[j].maxScore) / 5);
                                });
                            }
                        }
                        if(checkDetail[j].maxScore > 0) { //评分控件处理
                            this.rateTexts = [1,2,3,4,5].map(function(item,index,array){
                                return item * (parseInt(checkDetail[j].maxScore) / 5);
                            });
                        }
                    }
                }
            },
            //图片处理
            imgDeal(list) {
                    let attachVOList = list
                    let imgList = []
                    let fileList = []
                    let uid = Cookie.get('t8t-tc-uid');
                    let ticket = Cookie.get('t8t-tc-ticket')

                    for(let j=0; j<attachVOList.length; j++){

                        let temp = {
                            id: attachVOList[j].id,
                            attachName: attachVOList[j].attachName,
                            attachPath: attachVOList[j].attachPath,
                            filePath: attachVOList[j].filePath,
                            name: attachVOList[j].attachName,
                            url: Utils.getFullURL(attachVOList[j].filePath)
                        };
                        imgList.push(temp);
                        fileList.push(temp);
                    }
                    this.fileList = fileList
//                    this.$set(this.detailInfo.imgList,this.detailInfo.checkItemVOList[i].id,imgList)
            }
        }
    };
</script>

<style>
    #measureLine  .lineDialog .el-dialog{
        width: 1000px;
        min-height: 600px;
    }

    .lineDialog .full-dialog-tabs-container .el-tab-pane{
        display: block;
    }
    .lineDialog .my-table tbody td{
        max-width: 500px;
        line-height: 25px;
    }

    .measure-item div.el-upload-disabled>.el-upload--picture-card{
        display: none !important;
    }
    .measure-item div.el-upload-full>.el-upload--picture-card{
        display: none !important;
    }
    .measure-item div.el-upload-disabled span.el-upload-list__item-delete{
        display: none !important;
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
