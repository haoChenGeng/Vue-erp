<template>
    <div class="t8t-detail-view">
        <el-dialog @close="closeDialog" size="full" v-model="recordDialogVisible" class="t8t-full-dialog2 recordDialog">
            <div class="t8t-full-dialog2-container">
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">
                        <el-form ref="mainTable"
                                 label-position="right"
                                 label-width="120px"
                                 :model="dataSource">

                            <el-tabs v-model="mainActiveTab">
                                <el-tab-pane label="项目信息" name="detail" class="field_container">
                                    <base-panel
                                        :dataSource="baseSource"
                                        :fields="fields"
                                        :disabled="disabled"
                                        :options="options"
                                    ></base-panel>

                                </el-tab-pane>
                            </el-tabs>
                        </el-form>
                    </div>
                    <div class="toggle-btn-container">
                        <div class="toggle-btn el-icon-d-arrow-left" @click="onTopHide"></div>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <div class="t8t-detail">
                            <el-tabs v-model="subActiveTab" class="t8t-detail">
                                <el-tab-pane label="播报内容" name="item">
                                    <div class="sub-container" v-loading.body.lock="tableLoading">
                                        <div v-if="dataSource">
                                            <div class="record-detail">
                                                <div class="detail-rows" v-if="dataSource.broadcastRecordItemInfoVO" v-for="itemVo in dataSource.broadcastRecordItemInfoVO">
                                                    <label>
                                                        <span class="title">工序:</span>
                                                        <span :title="itemVo.durationItemName">{{itemVo.durationItemName}}</span>
                                                    </label>
                                                    <div class="radio">
                                                        <el-radio
                                                            disabled="true"
                                                            value="selected"
                                                            label="selected"
                                                            v-if="itemVo.durationItemStatus && duractionItemStatus[itemVo.durationItemStatus]"
                                                        >{{duractionItemStatus[itemVo.durationItemStatus]}}
                                                        </el-radio>
                                                    </div>
                                                    <div style="display: inline-block;width: 60%;overflow: hidden;" v-if="itemVo.pendingReason">
                                                        <label>延期原因：</label><el-input :disabled="true" style="width: 80%" v-model="itemVo.pendingReason">
                                                    </el-input>
                                                    </div>
                                                    <div class="pic-container list-container" style="margin-left: 100px" v-if="itemVo.files">
                                                        <el-upload
                                                            class="el-upload-disabled"
                                                            list-type="picture-card"
                                                            :file-list="itemVo.files"
                                                            :on-preview="handlePictureCardPreview"
                                                        ></el-upload>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="record-detail" v-if="dataSource.otherPics.length>0">
                                                <div class="detail-rows">
                                                    <label>
                                                        <span class="title">现场施工照片:</span>
                                                    </label>
                                                </div>
                                                <div class="pic-container list-container" style="margin-left: 100px">
                                                    <el-upload
                                                        class="el-upload-disabled"
                                                        list-type="picture-card"
                                                        :file-list="dataSource.otherPics"
                                                        :on-preview="handlePictureCardPreview"
                                                    ></el-upload>
                                                </div>
                                            </div>
                                            <div class="record-detail" v-if="dataSource.recordContent">
                                                <div class="detail-rows">
                                                    <label>
                                                        <span class="title">重点事项:</span>
                                                    </label>
                                                    <el-input
                                                        disabled="true"
                                                        style="display:block;margin-left: 10%;"
                                                        class="importInfo"
                                                        type="textarea"
                                                        :rows="5"
                                                        v-model="dataSource.recordContent">
                                                    </el-input>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
            <el-dialog :modal="false" v-model="dialogVisible" size="preview" class="view-pic-dialog">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>

    </el-dialog>
    </div>

</template>
<script>
    import Cookie from 'js-cookie'
    import CommonService from 'src/services/commonApi/Service.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import broadcastApi from 'src/services/delivery/broadcast.js'
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    export default {
        name: 'record-detail-dialog',
        components: {BasePanel},
        data() {
            return {
                recordDialog:true,
                id: null,
                mainActiveTab: "detail",
                subActiveTab: "item",
                dataSource: null,
                baseSource:{},
                TableLoading: false,
                fields: [
                    {
                        type: 'input',
                        label: '项目ID',
                        prop: 'id',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '项目经理',
                        prop: 'chiefWorkerName',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '工程管家',
                        prop: 'projectManagerNick',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '城市',
                        prop: 'standardCityName',
                        disabled: "disabled"
                    }, {
                        type: 'datetime',
                        label: '开工时间',
                        prop: 'startTime',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '业务类型',
                        prop: 'bizTypeName',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '产品包',
                        prop: 'productPkgName',
                        disabled: "disabled"
                    }, {
                        type: 'textarea',
                        label: '项目地址',
                        prop: 'wholeAddress',
                        disabled: "disabled"
                    },{
                        type: 'select',
                        label: '播报情况',
                        prop: 'recordStatus',
                        list:"broadcastStatus",
                        disabled: "disabled"
                    },{
                        type: 'datetime',
                        label: '播报时间',
                        prop: 'createTime',
                        disabled: "disabled"
                    },{
                        type: 'select',
                        label: '播报类型',
                        prop: 'recordType',
                        disabled: "disabled",
                        list:"broadcastType"
                    }],
                duractionItemStatus:{
                    1 : '开工',
                    2 :'施工中',
                    3 : '完工',
                    4 : '延期'
                },
                options: {
                    broadcastType: [
                        {value:null, text:""},
                        {value: 1, text: '早播'},
                        {value: 2, text: '晚播'},
                    ],
                    broadcastStatus: [
                        {value: null, text: ''},
                        {value: 1, text: '正常'},
                        {value: 2, text: '延期'},
                        {value: 3, text: '未播'},
                        {value: 4, text: '待播'},
                    ],
                },
                userName:Cookie.get('t8t-tc-username'),
                isTopHide:false,
                recordDialogVisible:true,
                dialogVisible:false,
                dialogImageUrl:'',
                tableLoading:false,
            }
        },
        props: ["projectInfo","recordInfo"],
        created() {
            if(!this.recordInfo.id) {
                this.$message.error("播报ID获取失败")
                return
            }
            this.id = this.recordInfo.id
            this.initMainInfo()
            this.initDetail()
        },

        methods: {
            initMainInfo(){
                let _mains = {
                    bizTypeName:null,
                    chiefWorkerName:null,
                    productPkgName:null,
                    projectId:null,
                    projectManagerNick:null,
                    standardCityName:null,
                    startTime:null,
                    wholeAddress:null,
                    recordStatus:null,
                    createTime:null,
                    recordType:null,
                    id:null
                }
                _mains = Object.assign(_mains,this.projectInfo)
                _mains.recordStatus = this.recordInfo.recordStatus
                _mains.recordType = this.recordInfo.recordType
                _mains.createTime = this.recordInfo.createTime
                this.baseSource = Object.assign({},_mains)
            },
            initDetail(){
                if(parseInt(this.id)) {
                    let self = this
                    self.setLoading()
                    broadcastApi.getBroadcastRecordInfoForPC({recordId:this.id})
                        .then((res) => {
                            self.setLoading()
                            if(res.data.status == 200) {
                                let dataSource =res.data.result
                                if(dataSource.broadcastRecordItemInfoVO) {
                                    for(let i = 0;i<dataSource.broadcastRecordItemInfoVO.length;i++){
                                        if(dataSource.broadcastRecordItemInfoVO[i].filePath) {
                                            let _files = []
                                            dataSource.broadcastRecordItemInfoVO[i].filePath.forEach(item=>{
                                                _files.push({url:item})
                                            })
                                            dataSource.broadcastRecordItemInfoVO[i].files = _files
                                        }
                                        else{
                                            dataSource.broadcastRecordItemInfoVO[i].files = [];
                                        }
                                    }
                                }else{
                                    dataSource.broadcastRecordItemInfoVO = []
                                }
                                let _pics = []
                                if(dataSource.otherPicList) {
                                    dataSource.otherPicList.forEach(item => {
                                        _pics.push({url:item})
                                    })
                                }else {
                                    dataSource.otherPicList = []
                                }
                                dataSource.otherPics = _pics
                                this.dataSource = dataSource
                            }else{
                                this.$message.error("播报详情获取失败")
                            }
                        }).catch((error) =>{
                        self.setLoading()
                        this.$message.error("播报详情获取失败")
                    })
                }else{
                    this.$message.error("记录ID获取错误");
                    this.closeDialog();
                }
            },
            closeDialog(){
                this.$emit('close')
            },
            handlePictureCardPreview(file) {
                this.dialogVisible = true
                this.dialogImageUrl = file.url;
            },
            onTopHide () {
                this.isTopHide = !this.isTopHide
            },
            setLoading(){
                this.tableLoading = !this.tableLoading
            }
        }
    };

</script>
<style>
    .sub-container .pic-container div.el-upload-disabled > .el-upload--picture-card {
        display: none !important;
    }
    .sub-container .pic-container div.el-upload-full > .el-upload--picture-card {
        display: none !important;
    }
    .sub-container .pic-container div.el-upload-disabled span.el-upload-list__item-delete {
        display: none !important;
    }
    .view-pic-dialog>.el-dialog--preview{
        min-width: 60% !important;
        max-width: 80% !important;
    }
</style>
<style lang="css" scoped>
    .recordDialog .full-dialog-tabs-container .sub-container {
        width: 1220px !important;
        margin: 0 auto !important;
    }

    .recordDialog .full-dialog-tabs-container .importInfo{
        width: 60%;
    }
    .recordDialog .full-dialog-tabs-container .record-detail{
        padding: 10px 20px 0px;
        letter-spacing:1px
    }
    .recordDialog .full-dialog-tabs-container .record-detail .detail-rows {
        line-height: 32px;
    }
    .recordDialog .full-dialog-tabs-container .record-detail .detail-rows label span{
        margin-left:10px;
        width: 10%;
        display: inline-block;
        overflow: hidden;
        text-align: left;
        height: 32px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .recordDialog .full-dialog-tabs-container .record-detail .detail-rows label span.title{
        text-align: right;
    }
    .recordDialog .full-dialog-tabs-container .record-detail .detail-rows .radio{
        width: 8%;display: inline-block;overflow: hidden;
    }
    .normal{
        color: #999;
    }
    .warning{
        color: #f5a623;
    }
    .error{
        color: #fa6969;
    }
</style>
