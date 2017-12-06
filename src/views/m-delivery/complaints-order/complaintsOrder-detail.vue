<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            :symbolList="complaintsToolbarList"
                            class="t8t-dark"
                            ref="complaintsToolbar"
                            @EDIT="edit"
                            @FOLLOW="follow"
                            @COMPLETE="complete"
                            @AUDITING="auditing"
                            @OPERATION-RECORD="showRecord"
                            @APPROVAL-FLOW="showFlow"
                            @TEMP-SAVE="addSubmit('temp')"
                            @ADD-SUBMIT="addSubmit('submit')"
                            @FOLLOW-SUBMIT="followSubmit"
                            @EDIT-SAVE="editSubmit('temp')"
                            @EDIT-SUBMIT="editSubmit('submit')"
                            @COMPLETE-SUBMIT="completeSubmit"
                            @AUDITING-SUBMIT="auditingSubmit"
                            @CALLOWNER="callOwnerBtn"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">

                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">
                        <el-form v-if="showAppendForm"
                                 :model="appendForm.form"
                                 :rules="appendForm.rules"
                                 ref="appendForm"
                                 label-width="120px"
                                 style="margin-top: 10px">
                            <el-form-item v-for="field in appendForm.fields" :label="field.label" :prop="field.prop"
                                          class="append-form-container">
                                <el-radio-group v-if="field.type === 'radio'" :prop="field.prop"
                                                v-model="appendForm.form[field.prop]"
                                                :disabled="appendForm.form[field.disabled] || false"
                                                @change="changeRadio">
                                    <el-radio v-for="item in appendForm.radioOption" :label="item.value">{{item.text}}
                                    </el-radio>
                                </el-radio-group>
                                <el-input
                                    v-else-if="field.type === 'textarea'"
                                    type="textarea"
                                    v-model="appendForm.form[field.prop]"
                                    :disabled="appendForm.form[field.disabled] || false"
                                    :placeholder="appendForm.form[field.placeholder] || ''"
                                    :autosize="{ minRows: field.minRows || 5, maxRows: field.maxRows || 8}"
                                ></el-input>
                                <t8t-datetime-picker
                                    v-else-if="field.type === 'datetime'"
                                    v-model="appendForm.form[field.prop]"
                                    :picker-options="setMinDate"
                                    :disabled="appendForm.form[field.disabled] || false">
                                </t8t-datetime-picker>
                            </el-form-item>
                        </el-form>

                        <el-form ref="mainTable"
                                 label-position="right"
                                 label-width="120px"
                                 :model="dataSource"
                                 :show-message="mode !== 'view'"
                        >
                            <el-tabs v-model="mainActiveTab">
                                <el-tab-pane :label="mainTable.tabs[0].label" :name="mainTable.tabs[0].name">
                                    <div class="field_container" @keyup.enter="enter">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="mainTable.tabs[0].fields"
                                            :mode="editmode"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[0].name"
                                            @blur="handleBlur"
                                            v-loading.body.lock="addFormLoading"
                                        ></base-panel>
                                    </div>
                                    <div class="dialog-form-item-container set-form-container">
                                        <el-form-item label="详细内容：" prop="details" style="width:50%;float: left;">
                                            <el-input type="textarea"
                                                      :disabled="mode!='add'&& mode!='edit' ? true : false"
                                                      v-model="dataSource.details"
                                                      :autosize="{ minRows: 5, maxRows: 12 }"
                                                      style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="期望结果：" prop="expectedResult"
                                                      style="width:50%;float: left;">
                                            <el-input type="textarea"
                                                      :disabled="mode!='add'&& mode!='edit' ?  true : false"
                                                      v-model="dataSource.expectedResult"
                                                      :autosize="{ minRows: 5, maxRows: 12 }"
                                                      style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="处理结果：" prop="handleResult" style="width:50%;float: left;"
                                                      v-if="mode!='add'&& mode!='edit'">
                                            <el-input type="textarea" disabled="true" v-model="dataSource.handleResult"
                                                      :autosize="{ minRows: 5, maxRows: 12 }"
                                                      style="width: 100%"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane v-if="mode!='add'" :label="mainTable.tabs[1].label"
                                             :name="mainTable.tabs[1].name">
                                    <div class="field_container">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="mainTable.tabs[1].fields"
                                            :mode="editmode"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[1].name"
                                            @blur="handleBlur"
                                        ></base-panel>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane v-if="mode!='add'" :label="mainTable.tabs[2].label"
                                             :name="mainTable.tabs[2].name">
                                    <div class="field_container">
                                        <base-panel
                                            :class="viewsType"
                                            :dataSource="dataSource"
                                            :fields="mainTable.tabs[2].fields"
                                            :mode="editmode"
                                            :disabled="disabled"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[2].name"
                                            @blur="handleBlur"
                                        ></base-panel>
                                    </div>

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
                                <el-tab-pane :label="subTables[0].label" :name="subTables[0].name">
                                    <div class="sub-container">
                                        <!-- 新增和编辑模式才出现按钮 -->
                                        <div class="my-toolbar" v-if="(mode === 'add' || mode == 'edit')">
                                            <el-button
                                                type="primary"
                                                size="small"
                                                icon="plus"
                                                @click="addLine(subTables[0].name)"
                                            >新增行
                                            </el-button>
                                            <el-button
                                                type="danger"
                                                size="small"
                                                icon="close"
                                                @click="delLine(subTables[0].name)"
                                            >删除行
                                            </el-button>
                                        </div>
                                        <!--table-->
                                        <t8t-table
                                            :dataSource="subdataSource"
                                            :templateData="templateData"
                                            :preLoad="false"
                                            :columns="subTables[0].fields"
                                            :service="subTables[0].service"
                                            :method="subTables[0].method"
                                            :args="subTables[0].args"
                                            :editable="(mode === 'edit') ? true : (mode !== 'view' && !disabled)"
                                            :ref="subTables[0].name"
                                            :commonData="options || {}"
                                            @cell-editor-change="onEditorChange"
                                            @cell-click="onCellClick"
                                            v-loading.body.lock="addTableLoading"
                                        ></t8t-table>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane :label="subTables[1].label" :name="subTables[1].name" v-if="mode!='add'" v-loading.body.lock="fileLoading">
                                    <div class="sub-container">
                                        <div class="pic-container list-container">
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
                                    </div>
                                </el-tab-pane>

                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <record-table-dialog
            v-if="recordTableDialogShow"
            :orderCode="dataSource.orderCode"
            @close="closeRecordDialog"
        >
        </record-table-dialog>
        <t8t-step-page
            :args="flowArgs"
            :service="flowService"
            :method="flowMethod"
            :dataSource="flowData"
            v-if="isShowFlow"
            @close="closeFlowShow"
        >
        </t8t-step-page>

        <el-dialog v-model="dialogVisible" size="large">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import axios from 'src/utils/axios.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import Utils from 'src/utils/Utils.js'
    import Cookie from 'js-cookie'

    import schema from './complaintsOrder-schema'
    import RecordTableDialog from './recordDialog.vue'
    import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
    import ComplaintApi from 'src/services/delivery/complaint.js'
    import Service from 'src/services/delivery/Service.js'

    export default {
        name: 't8t-dt-view',
        components: {BasePanel, RecordTableDialog, T8tStepPage},
        watch: {
            $route: function () {
                this.initPage()
            },
        },
        data () {
            return {
                setMinDate:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                addFormLoading:false,
                addTableLoading:false,
                fileLoading:false,
                dialogVisible: false,
                dialogImageUrl: '',
                processId: null,
                fileList: [],
                attachRelation: [],
                uploadImgList: {},
                imgList: [],
                dialogImageUrl: '',
                dialogVisible: false,
                uploadURL: Utils.getUploadURL(),
                uploadParams: {
                    bucket: 'scm',
                    module: 'delivery'
                },
                editmode: '',
                disabled: false,
                showAppendForm: true,
                appendForm: {},
                recordTableDialogShow: false,
                flowArgs: {},
                flowService: Service.COMPLAINT.name,
                flowMethod: Service.COMPLAINT.methods.COMPLAINTORDERGETPROCESSDETAILBYID,
                flowData: [],
                isShowFlow: false,
                viewsType: '',
                complaintsToolbarList: [],
                id: null,
                mode: "",
                orderCode: null,
                // 主表绑定数据源
                dataSource: {},
                // 附表绑定数据源，只有panel（一对一）形式展示的需要绑定，table（一对多）的不需要
                subDataSource: {},
                // 所有配置全部初始化在这里
                options: {
                    complaintObjOption: [],
                    selectOption: [{value: 1, text: "aa"},],
                    specificNameOption: [],
                    specificNameOptions: [],//已选总具体名称列表
                    visitorOption: [],//当前回访人列表
                    visitorOptions: [],//已选回访人列表
                    handlerOption: [],//当前处理人列表
                    handlerOptions: [],//已选处理人列表
                    bizTypeId: [],
                    complaintSource: [],
                    complaintObjectId: [],
                    complaintType: [
                        {value: 1, text: "正式投诉"},
                        {value: 2, text: "潜在投诉"}
                    ],
                    statusOption: [
                        {value: 0, text: "无状态"},
                        {value: 1, text: "暂存"},
                        {value: 2, text: "待受理"},
                        {value: 3, text: "投诉中"},
                        {value: 4, text: "待关闭"},
                        {value: 5, text: "已关闭"}],
                    visitorId: [],
                    handlerId: [],
                    complaintLevel: [],
                    upgradeReason: [],
                    complaintPhase: [],
                    complaintsContentOpt: []
                },
                schema: schema,
                subTables: JSON.parse(JSON.stringify(schema.subTables)),
                mainTable: schema.mainTable,
                // 控制主表区域收缩
                isTopHide: false,
                isDialogShow: true,
                // 主表tab默认激活页
                mainActiveTab: '',
                // 附表tab默认激活页
                subActiveTab: '',
                // 点击关闭后的返回route
                goBackRoute: '/delivery/complaints-order-list',
                sourceMap: {},
                columns: {},
                count: 1,
                selectedList: [],
                templateData: {
                    createName: null,
                    text: null,
                    createBy: null,
                    createTime: null,
                    updateName: null,
                    updateBy: null,
                    updateTime: null,
                    complaintsOrderId: null,
                    complaintsConfigOrderId: null,
                    complaintsConfigItemId: null,
                    complaintsConfigItemIds: [],
                    complaintObjectId: null,
                    specificNameId: null,
                    handlerId: null,
                    visitorId: null
                },

                //数据暂存区
                listTemp: {
                    complaintsContentOptList: [],//投诉内容列表
                    specificOptList: [],//具体名称列表
                    handlerList: [],//回访人列表
                    visitorList: [],//处理人总列表
                },
                dealer: Cookie.get('t8t-tc-username'),
                dealerId: Cookie.get('t8t-tc-uid'),
                complaintTypeList: [],
                errorCode:[
                    {value:43101,text:"获取配置的呼叫中心URL异常"},
                    {value:43102,text: "用户坐席为空"},
                    {value:43103,text: "请求呼叫中心异常"},
                    {value:43105,text: "用户不存在"},
                ]

            }
        },
        created () {
            this.commonInfoGet()
            this.initPage()
        },
        methods: {
            //获取负责资料信息
            commonInfoGet() {
                ComplaintApi.queryUnionParent({
                    search: {pPropertyCodes: [41301, 41302, 41303, 41304]},
                    page: 1,
                    size: 100
                }).then((res) => {
                    if (res.data.status != 200) {
                        this.$message.error("配置获取失败")
                        return
                    }
                    let _list = {
                        "41301": [],
                        "41302": [],
                        "41303": [],
                        "41304": [],
                    }
                    res.data.result.forEach((item) => {
                        _list[item.pPropertyCode].push({text: item.propertyName, value: item.id})
                    })
                    this.options.complaintSource = _list["41303"]
                    this.options.complaintLevel = _list["41301"]
                    _list["41304"].push({text:' ',value:0})
                    this.options.upgradeReason = _list["41304"]
                }).catch(() => {
                    return
                })
            },
            //获取投诉对象信息
            getcomplaintObj(){
                this.addTableLoading = true
                ComplaintApi.complaintManaQueryPage({
                    search: {
                        status: 1,
                        productPackageId: this.dataSource.productPkgId
                    }, page: 1, size: 100
                }).then((res) => {
                    this.addTableLoading = false
                    if (res.data.status != 200) {
                        this.$message.error("投诉对象获取失败")
                        return
                    }
                    let _list = []
                    let _objType = []//记录投诉对象类型
                    res.data.result.rows.forEach(item => {
                        _list.push({text: item.objectName, value: item.objectConfigId})
                        _objType[item.objectConfigId] = item.objectType
                    })
                    this.options.complaintObjOption = _list
                    this.complaintTypeList = _objType
                }).catch(() => {
                    this.addTableLoading = false
                    return
                })
            },
            //获取具体名称
            getSpecificOptList(val){
                this.addTableLoading = true
                ComplaintApi.complaintsOrderspecificName({
                    "yid": this.dataSource.projectId,
                    "objectId": val
                }).then((res) => {
                    this.addTableLoading = false
                    if (res.data.status != 200) {
                        this.$message.error("具体名称获取失败")
                        return
                    }
                    let _list = []
                    res.data.result.forEach((item) => {
                        _list.push({text: item.name || '', value: item.id})
                    })
                    this.listTemp.specificOptList[this.dataSource.projectId + '' + val] = _list
                }).catch((error) => {
                    this.addTableLoading = false
                    return
                })
            },
            //获取投诉内容
            getComplaintsContentOptList(val){
                let _self = this
                let _args
                if (this.mode === 'add') {
                    _args = {"pkgId": this.dataSource.productPkgId, "objectId": val}
                } else {
                    _args = {"pkgId": this.dataSource.productPkgId, "objectId": this.dataSource.complaintObjectId}
                }
                this.addTableLoading = true
                ComplaintApi.complaintContentFindContent(_args).then((res) => {
                    this.addTableLoading = false
                    if (res.data.status != 200) {
                        this.$message.error("投诉内容获取失败")
                        return
                    }
                    let _list = []
                    res.data.result.rows.forEach((item) => {
                        _list.push({text: item.complaintContentName, value: item.id})
                    })
                    if (this.mode === 'add') {
                        this.$nextTick(() => {
                            _self.listTemp.complaintsContentOptList[this.dataSource.productPkgId + '' + val] = _list
                        })
                    } else {
                        this.$nextTick(() => {
                            _self.options.complaintsContentOpt = _list
                        })
                    }
                }).catch((error) => {
                    this.addTableLoading = false
                    return
                })
            },
            //获取回访人、处理人
            getVisitorAndHandler(row = {}) {
                let _arg
                let _self = this
                if (this.mode === 'add') {
                    if (!row.complaintObjectId) {
                        _self.$message.error("请选择投诉对象")
                        return
                    }
                    if (!row.specificNameId) {
                        _self.$message.error("请选择具体名称")
                        return
                    }
                    _arg = {
                        "objectId": row.complaintObjectId,
                        "pkgId": _self.dataSource.productPkgId,
                        "specificId": row.specificNameId || null,
                        "yid": parseInt(_self.dataSource.projectId),
                        "staffType": null
                    }
                    this.addTableLoading = true
                } else {
                    _arg = {
                        "objectId": _self.dataSource.complaintObjectId,
                        "pkgId": _self.dataSource.productPkgId,
                        "specificId": _self.dataSource.specificNameId,
                        "yid": parseInt(_self.dataSource.projectId),
                        "staffType": null
                    }
                }
                ComplaintApi.vistorOrHandleQuery(_arg).then(res => {
                    this.addTableLoading = false
                    if (res.data.status != 200) {
                        _self.$message.error("回访人/处理人获取失败")
                        return
                    }else{
                        let _list = res.data.result
                        if (_self.mode === 'add') {
                            let _visitorList = []
                            let _handlerList = []
                            let _index
                            _list.sort((a, b) => {return a.type > b.type})
                                .map(i => ({text: i.name || i.accountId, value: i.accountId, type: i.distributionType, staffType:i.staffType,isDefault:i.isDefault}))
                                .forEach((item) => {
                                if (item.staffType === 1) {
                                    if(item.isDefault) row.visitorId = item.value
                                    _visitorList.push({
                                        text: item.text,
                                        value: item.value,
                                        type: 1,
                                    })
                                }
                                if (item.staffType === 2){
                                    if(item.isDefault) row.handlerId = item.value
                                    _handlerList.push({
                                        text: item.text,
                                        value: item.value,
                                        type: 2,
                                    })
                                }
                            })
                            if(_visitorList.length > 0) {
                                _visitorList.splice(0, 0, {text: '上级', disabled: true})
                                _index = _visitorList.indexOf(_visitorList.filter(i => i.type === 2)[0])
                                if(_index > -1) _visitorList.splice(_index, 0, {text: '项目负责人', disabled: true,value:0})
                            }
                            if(_handlerList.length > 0) {
                                _handlerList.splice(0, 0, {text: '上级', disabled: true})
                                _index = _handlerList.indexOf(_visitorList.filter(i => i.type === 2)[0])
                                if(_index > -1) _handlerList.splice(_index, 0, {text: '项目负责人', disabled: true,value:0})
                            }
                            _self.listTemp.handlerList[_self.dataSource.projectId + '' + row.complaintObjectId + _self.dataSource.productPkgId + row.specificNameId] = _handlerList
                            _self.listTemp.visitorList[_self.dataSource.projectId + '' + row.complaintObjectId + _self.dataSource.productPkgId + row.specificNameId] = _visitorList

                        } else {
                            let handlerList = [{label: '上级', options: []}, {label: '项目负责人', options: []}]
                            let visitorList = [{label: '上级', options: []}, {label: '项目负责人', options: []}]
                            _list.forEach((item) => {
                                if (item.staffType === 1) visitorList[item.distributionType - 1].options.push({
                                    value: item.accountId,
                                    label: item.name
                                })
                                if (item.staffType === 2) handlerList[item.distributionType - 1].options.push({
                                    value: item.accountId,
                                    label: item.name
                                })
                            })
                            _self.options.visitorId = visitorList
                            _self.options.handlerId = handlerList
                        }
                    }
                }).catch(error => {
                    this.addTableLoading = false
                    console.log(error)
                })
            },
            //页面初始化
            initPage() {
                this.resetDataSource()
                this.id = this.$route.query.id
                if(!this.mode) {
                    this.mode = this.$route.query.mode || 'add'
                }
                if(this.mode == "edit") this.mode = "view"
                this.buttonSet()
                this.mainTable.args.id = this.id
                if (this.mode === 'approve' || this.mode === 'complete') {
                    this.processId = this.$route.query.procInsId
                }
                // 初始化主附表
                this.initMainTable()
                this.initSubTable()
                this.viewsType = this.mode === 'view' ? 'el-upload-disabled' : ''  //图片不允许编辑
            },

            //按钮及附加表单获取
            buttonSet() {
                switch (this.mode) {
                    case 'add':
                        this.mainTable = schema.addTable
                        this.subTables = JSON.parse(JSON.stringify(schema.addSubTables))
                        this.editmode = this.mode
//                        this.complaintsToolbarList = ["TEMP-SAVE", "ADD-SUBMIT"]
                        this.complaintsToolbarList = ["ADD-SUBMIT","CALLOWNER"]
                        break;
                    case 'view':
//                        this.complaintsToolbarList = ["EDIT", "FOLLOW", "COMPLETE", "AUDITING", "OPERATION-RECORD", "APPROVAL-FLOW"]
                        this.complaintsToolbarList = ["CALLOWNER"]
                        this.editmode = this.mode
                        break;
                    case 'follow':
                        this.complaintsToolbarList = ["FOLLOW-SUBMIT", "OPERATION-RECORD","CALLOWNER"]
                        this.editmode = 'view'
                        this.appendForm = {
                            form: {
                                message: null,
                                followTime: null,
                            },
                            rules: {
                                message: [
                                    {
                                        required: true,
                                        message: '请输入跟进内容'
                                    }
                                ],
                                followTime: [
                                    {
                                        required: true,
                                        message: '请选择跟进时间'
                                    }
                                ],
                            },
                            fields: [
                                {
                                    label: '跟进内容',
                                    prop: 'message',
                                    type: 'textarea',
                                }, {
                                    label: '下次跟进时间',
                                    prop: 'followTime',
                                    type: 'datetime'
                                },]
                        }
                        this.showAppendForm = true
                        break;
                    case 'edit':
                        this.editmode = this.mode
//                        this.complaintsToolbarList = ["EDIT-SAVE", "EDIT-SUBMIT"]
                        this.complaintsToolbarList = [null]
                        break;
                    case 'complete':
                        this.complaintsToolbarList = ["COMPLETE-SUBMIT", "OPERATION-RECORD","CALLOWNER"]
                        this.editmode = 'view'
                        this.appendForm = {
                            form: {
                                message: null,
                            },
                            rules: {
                                message: [
                                    {
                                        required: true,
                                        message: '请填写处理结果'
                                    }
                                ],
                            },
                            fields: [
                                {
                                    label: '处理结果',
                                    prop: 'message',
                                    type: 'textarea',
                                }],
                        }
                        this.showAppendForm = true
                        break;
                    case 'approve':
                        this.complaintsToolbarList = ["AUDITING-SUBMIT", "OPERATION-RECORD","CALLOWNER"]
                        this.editmode = 'view'
                        this.appendForm = {
                            form: {
                                agree: 1,
                                message: null,
                                followTime: ''
                            },
                            rules: {
                                agree: [
                                    {
                                        required: true,
                                        message: '请选择审核意见'
                                    }
                                ]
                            },
                            fields: [
                                {
                                    label: '',
                                    prop: 'agree',
                                    type: 'radio'
                                },
                                {
                                    label: '审核意见',
                                    prop: 'message',
                                    type: 'textarea',
                                }],
                            radioOption: [
                                {value: 1, text: '同意'},
                                {value: 2, text: '不同意'},
                            ]
                        }
                        this.showAppendForm = true
                        break;
                    default:
                        this.complaintsToolbarList = []
                }


            },
            onTopHide () {
                this.isTopHide = !this.isTopHide
            },
            /**
             * 初始化附表
             */
            initSubTable () {
                let that = this, schema = this.subTables, fieldCache
                if (schema && schema.length > 0) {
                    schema.forEach((item, key) => {
                        // 附表页签初始化选中项
                        if (item.isActive || key === 0) {
                            that.subActiveTab = item.name
                        }


                        that.sourceMap[item.name] = {
                            type: item.type,
                            service: item.service,
                            method: item.method,
                            index: key,
                            name: item.name || null
                        }

                        if (!that.columns[item.name]) fieldCache = that.columns[item.name] = {}

                    })
                }
            },
            /**
             * 初始化主表
             */
            initMainTable () {
                let self = this
                // 初始化tab页中的激活选项
                if (this.mainTable.tabs && this.mainTable.tabs.length > 0) {
                    this.mainTable.tabs.forEach((item, key) => {
                        if (item.isActive || key === 0) {
                            this.mainActiveTab = item.name
                        }
                    })
                }

                // 在查看和修改模式下需要初始化加载数据
                if ((['view', 'edit', 'follow']).indexOf(this.mode) >= 0) this.loadMainTable()
                if (this.mode === 'approve' || this.mode === 'complete') {
                    if(this.dataSource.processId) this.processId=this.dataSource.processId
                    if (!this.processId) {
                        this.$message.error("获取流程信息失败")
                        return false
                    }
                    this.loading = true
                    ComplaintApi.complaintsOrderfindByProcessId({
                        processId: this.processId
                    }).then((res) => {
                        let response = res.data
                        // 数据加载成功
                        if (response && response.status === 200) {
                            this.dataSource = Object.assign({}, this.mainTable.dataSource, response.result)
                            this.id = response.result.id
                            self.imgDeal()
                            self.loadSubTable()
                            self.getVisitorAndHandler(null)
                            self.getComplaintsContentOptList()
                        }
                    })
                        .catch((res) => {
                            // TODO 数据加载失败
                            console.error("panel load data failed.", res)
                        })


                }
            },
            /**
             * 加载主表数据
             */
            loadMainTable () {
                let self = this
                let mainTableSchema = this.mainTable, args = mainTableSchema.args || {}

                if (mainTableSchema.service && mainTableSchema.method) {
                    this.loading = true
                    axios({
                        service: mainTableSchema.service,
                        method: mainTableSchema.method,
                        args: args
                    })
                        .then((res) => {
                            let response = res.data
                            // 数据加载成功
                            if (response && response.status == 200) {
                                this.dataSource = Object.assign({}, this.mainTable.dataSource, response.result)
                                self.loadSubTable()
                                self.imgDeal()
                                self.getVisitorAndHandler(null)
                                self.getComplaintsContentOptList()
                            }
                        })
                        .catch((res) => {
                            // TODO 数据加载失败
                            console.error("panel load data failed.", res)
                            // self.$message.error('表格数据加载失败')
                        })
                } else {
                    // TODO 没有传service和method参数处理
                }
            },
            /**
             * 加载附表数据
             */
            loadSubTable () {
                if (!this.mode == 'view' || !this.mode == 'edit') return

                let self = this
                let schema = this.subTables, args, service, method, temp, argsString

                schema.forEach((subSchema, key) => {

                    service = subSchema.service
                    method = subSchema.method

                    if (service && method) {
                        args = subSchema.args || {}
                        argsString = JSON.stringify(args)
                        argsString = argsString.replace(/\@([a-zA-Z]+)/g, function (word, $1) {
                            return self.dataSource[$1]
                        })
                        eval(' temp =  ' + argsString)
                        args = temp

                        // 列表查询模式
                        if (subSchema.type === 'table') {
                            args.page = subSchema.page || 1
                            args.size = subSchema.pageSize || 20
                            schema[key].args = args
                        } else {
                            args.page = 1;
                            args.size = 1;
                            axios({
                                service: service,
                                method: method,
                                args: args
                            })
                                .then((res) => {
                                    let response = res.data
                                    if (response && response.status == 200) {
                                        self.subDataSource[key] = response.result
//                                        self.schema[key].dataSource = response.result
                                    }
                                })
                                .catch((res) => {
                                    // TODO 数据加载失败
                                    console.error("load data failed.", res)
                                    // self.$message.error('表格数据加载失败')
                                })
                        }
                    }

                });
            },
            /**
             * 主表表单校验
             * @param callback
             */
            validateMainTable(callback) {
                this.$refs['mainTable'].validate((isValid) => {
                    callback && callback(isValid)
                })
            },
            /**
             * 新增行
             * @param tabName
             */
            addLine (tabName) {
                this.$refs[tabName].addNewRow()
            },
            /**
             * 删除行
             * @param tabName
             */
            delLine (tabName) {
                let rows = this.$refs[tabName].getSelectRows()
                let deleteAble = true
                rows.forEach(row => {
                    if (row.id) deleteAble = false
                })
                if (deleteAble) {
                    this.$refs[tabName].delRows()
                } else {
                    this.$message.error("不能删除已存在的行")
                    return
                }
            },
            /**
             * 关闭弹窗
             */
            closeDialog () {
                this.$router.push({path: this.goBackRoute})
                this.$emit('close')
            },
            /**
             * 通过不同的mode获取不同的方法，用于不同场景的提交数据
             * @returns {*}
             */
            getMethod () {
                if (this.mode === 'add') {
                    return this.mainTable.createMethod
                } else if (this.mode === 'edit') {
                    return this.mainTable.updateMethod
                } else {
                    return this.mainTable.method
                }
            },
            /**
             * 对整个页面数据进行校验
             * @param cb 校验完成后的回调函数，回调参数为校验结果（true|false）
             */
            validate (cb) {
                let that = this
                that.validateMainTable((isValid) => {
                    if (isValid) {
                        that.validateSubTables((isSubValid) => {
                            cb && cb(isSubValid)
                        })
                    } else {
                        cb && cb(isValid)
                    }
                })
            },
            /**
             * 附表参数校验
             * @param cb 回调函数
             * @param key
             */
            validateSubTables (cb, key) {
                let k = key || 0, that = this

                if (!this.subTables || !this.subTables.length) {
                    cb && cb(true)
                    return
                }

                // 通过schema中的定义的tab.name去递归遍历校验

                this.$refs[this.subTables[k].name].validate((isValid) => {
                    k++
                    if (k >= that.subTables.length || !isValid) {
                        cb(isValid)
                        return
                    }

                    that.validateSubTables(cb, k)
                })
            },
            getAddForm () {
                let key, map, formData = {}, actionLog, beanName

                for (key in this.sourceMap) {
                    map = this.sourceMap[key]
                    beanName = this.sourceMap[key].name

                    // 表格是一对多，有增删改
                    if (map.type == 'table') {
                        actionLog = this.$refs[key].getActionLog(false, true)
                        formData[beanName + 'List'] = actionLog.addedRows;
                    }
                    // 一对一只有改
                    else {
                        formData[beanName] = this.subDataSource[map.name]
                    }
                }

                return formData
            },
            getEditForm () {
                let key, map, formData = {}, actionLog, beanName
                for (key in this.sourceMap) {
                    map = this.sourceMap[key]
                    beanName = this.sourceMap[key].name

                    // 表格是一对多，有增删改
                    if (map.type == 'table') {
                        actionLog = this.$refs[key].getActionLog(false, true)
                        formData[beanName + 'List'] = [].concat(actionLog.addedRows, actionLog.editedRows);
                        formData[beanName + 'DeleteIds'] = actionLog.deletedIDs;
                    }
                    // 一对一只有改
                    else {
                        formData[beanName] = this.subDataSource[map.name]
                    }
                }

                return formData
            },


            onCellClick(row, column) {
                let _projectID = this.dataSource.projectId
                let _complaintObjectId = row.complaintObjectId
                if (!this.dataSource.projectId) {
                    this.$message.error("请输入项目ID")
                    this.$refs.complaintsItem.handleFormItemBlur()
                    return
                }
                if (!this.dataSource.productPkgId) {
                    this.$message.error("产品包获取失败")
                    this.$refs.complaintsItem.handleFormItemBlur()
                    return
                }
                if (this.mode === 'add') {
                    console.log()
                    switch (column.property) {
                        case "complaintObjectId":
                            break
                        case "specificNameId":
                            if (!row.complaintObjectId) {
                                this.$message.error("请选择投诉对象")
                                this.$refs.complaintsItem.handleFormItemBlur()
                                return
                            }
                            this.options.specificNameOption = this.listTemp.specificOptList[_projectID + '' + _complaintObjectId]

                            break
                        case "complaintsConfigItemId":
                            this.subTables[0].fields[3].editor.dataSource = this.listTemp.complaintsContentOptList[this.dataSource.productPkgId + '' + _complaintObjectId]
                            break
                        case "visitorId":
                            this.options.visitorOption = this.listTemp.visitorList[_projectID + '' + _complaintObjectId + this.dataSource.productPkgId + row.specificNameId]
                            break
                        case "handlerId":
                            this.options.handlerOption = this.listTemp.handlerList[_projectID + '' + _complaintObjectId + this.dataSource.productPkgId + row.specificNameId]
                            break
                        case "complaintLevel":
                            if(row.complaintType === 2) {
                                this.$refs.complaintsItem.handleFormItemBlur()
                            }
                            break;
                    }
                    return
                }
            },

            onEditorChange(cell, val, config, status) {
                if (this.mode == "add") {
                    let _index
                    switch (config.prop) {
                        case "complaintObjectId":
                            this.getComplaintsContentOptList(val)
                            this.getSpecificOptList(val)
                            cell.row.specificNameId = null
                            cell.row.complaintsConfigItemId = null
                            cell.row.complaintType = null
                            cell.row.visitorId = null
                            cell.row.handlerId = null
                            break
                        case "complaintsConfigItemId":
                            let _list = []
                            let _showList = []
                            if (typeof (val) === 'object' && val.length > 0) {
                                val.forEach((item) => {
                                    _list.push(item.value)
                                    _showList.push(item.text)
                                })
                            }
                            this.$nextTick(function () {
                                cell.row['complaintsConfigItemIds'] = _list
                                cell.row['complaintsConfigItemId'] = _showList.toString()
                            })
                            break
                        case "specificNameId":
                            cell.row.visitorId = null
                            cell.row.handlerId = null
                            this.getVisitorAndHandler(cell.row)
                            if (!cell.row.complaintObjectId) {
                                this.$message.error("请选择投诉对象！")
                                return
                            }
                            if (this.options.specificNameOption.length <= 0) return
                            for (let i = 0; i < this.options.specificNameOption.length; i++) {
                                if (this.options.specificNameOption[i].value === val) _index = i
                            }
                            this.options.specificNameOptions.push({
                                value: val,
                                text: this.options.specificNameOption[_index].text
                            })
                            break
                        case "complaintType":
                            cell.row.complaintLevel = null
                            break;
                        case "handlerId":
                            if (this.options.handlerOption.length <= 0) return
                            for (let i = 0; i < this.options.handlerOption.length; i++) {
                                if (this.options.handlerOption[i].value === val) _index = i
                            }
                            this.options.handlerOptions.push({
                                value: val,
                                text: this.options.handlerOption[_index].text
                            })
                            break
                        case "visitorId":
                            if (this.options.visitorOption.length <= 0) return
                            for (let i = 0; i < this.options.visitorOption.length; i++) {
                                if (this.options.visitorOption[i].value === val) _index = i
                            }
                            this.options.visitorOptions.push({
                                value: val,
                                text: this.options.visitorOption[_index].text
                            })
                            break
                    }
                }
            },
            showRecord() {
                if (this.dataSource.orderCode) {
                    this.recordTableDialogShow = true
                } else {
                    this.$message.error("单据编码获取失败")
                    return
                }


            },
            closeRecordDialog() {
                this.recordTableDialogShow = false
            },
            showFlow() {
//                if(this.dataSource.id)
                this.flowArgs = {id: this.dataSource.id}
                this.isShowFlow = true
            },
            closeFlowShow(){
                this.isShowFlow = false
            },
            setViewType() {
                this.viewsType = this.mode == 'edit' ? '' : 'el-upload-disabled'
                if (this.fileList.length >= 10) {
                    this.viewsType += " el-upload-full"
                }
            },


            changeRadio(val) {
                if (val === 1) {
                    this.appendForm.fields = [
                        {
                            label: '',
                            prop: 'agree',
                            type: 'radio'
                        },
                        {
                            label: '审核意见',
                            prop: 'message',
                            type: 'textarea',
                        }]
                    this.appendForm.rules = {
                        agree: [
                            {
                                required: true,
                                message: '请选择审核意见'
                            }
                        ]
                    }
                } else if (val === 2) {
                    this.appendForm.fields = [
                        {
                            label: '',
                            prop: 'agree',
                            type: 'radio'
                        },
                        {
                            label: '审核意见',
                            prop: 'message',
                            type: 'textarea',
                        }, {
                            label: '下次跟进时间',
                            prop: 'followTime',
                            type: 'datetime'
                        }]
                    this.appendForm.rules = {
                        agree: [
                            {
                                required: true,
                                message: '请选择审核意见'
                            }
                        ],
                        message: [
                            {
                                required: true,
                                message: '请输入跟进内容'
                            }
                        ],
                        followTime: [
                            {
                                required: true,
                                message: '请选择跟进时间',
                            }
                        ]
                    }
                }
            },


            handleUploadFiles(fileList){
                if (fileList.length === 0) {
                    return null;
                }
                let _this = this;
                return fileList.map(function (item, index, array) {
                    if (typeof item.id !== 'undefined' && item.id > 0) {
                        return item;
                    } else {
                        let obj = {
                            attachName: item.name,
                            attachPath: _this.attachRelation[item.uid].id,
                            filePath: _this.attachRelation[item.uid].filePath,
                        }
                        return obj;
                    }
                })
            },
            handleRemove(file, fileList) {
                this.uploadImgList = fileList;
                this.fileList = fileList
                if (typeof this.attachRelation[file.uid] !== 'undefined') {
                    delete(this.attachRelation[file.uid])
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },

            fileChage(file, fileList) {
                this.flieList = fileList
            },
            beforeUpload(file){
                if (this.fileList.length > 10) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        showCancelButton: false,
                        message: '最多只能上传10张图片！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.fileList = this.fileList.slice(0, 10);
                    this.imgList = this.fileList.slice(0, 10);
                    return false
                }
                this.submitDisabled = true
            },
            handleSuccess(response, file, fileList){
                this.submitDisabled = false
                if (response.status == 200) {
                    this.fileList = fileList
                    this.attachRelation[file.uid] = response.result;
                    if (this.fileList.length > 10) {
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            showCancelButton: false,
                            message: '最多只能上传10张图片！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                        this.fileList = this.fileList.slice(0, 10);
                        this.imgList = this.fileList.slice(0, 10);
                    }
                } else {
                    if (fileList.length > 0) {
                        for (var i = 0; i < fileList.length; i++) {
                            if (fileList[i].uid == file.uid) {
                                fileList.splice(i, 1)
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
            handleError(err, file, fileList) {
                if (fileList.length > 0) {
                    for (var i = 0; i < fileList.length; i++) {
                        if (fileList[i].uid == file.uid) {
                            fileList.splice(i, 1)
                        }
                    }
                }
                this.fileList = fileList
                this.imgList = fileList
                this.$msgbox({
                    title: '消息',
                    type: 'error',
                    showCancelButton: false,
                    message: err,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                });
            },
            //图片处理
            imgDeal() {
                if (this.mode != 'add') {
                    this.fileLoading = true
                    ComplaintApi.complaintsOrderPicture({orderId: parseInt(this.id)}).then(res => {
                        this.fileLoading = false
                        if (res.data.status != 200) {
                            this.$message.error("图片信息获取失败")
                            return
                        }
                        let list = res.data.result.rows
                        let attachVOList = list
                        let imgList = []
                        let fileList = []
                        let uid = Cookie.get('t8t-tc-uid');
                        let ticket = Cookie.get('t8t-tc-ticket')
                        for (let j = 0; j < attachVOList.length; j++) {

                            let temp = {
                                id: attachVOList[j].id,
                                attachName: attachVOList[j].attachName,
                                attachPath: attachVOList[j].attachPath,
                                filePath: attachVOList[j].filePath,
                                name: attachVOList[j].attachName,
                                url: Utils.getFullURL(attachVOList[j].filePath)
                            }
                            imgList.push(temp);
                            fileList.push(temp);
                        }
                        this.fileList = fileList
                    }).catch(error => {
                        this.fileLoading = false
                        console.log(error)
                    })
                }

//                    this.$set(this.detailInfo.imgList,this.detailInfo.checkItemVOList[i].id,imgList)
            },
            //新增暂存/提交
            addSubmit(type){
                this.validate(isValid => {
                    if (isValid) {
                        let _this = this
                        let _arg
                        let _formData = this.dataSource
                        let _tableData = this.$refs.complaintsItem.dataSource
                        let _tableList = []
                        if (!_tableData || _tableData.length < 1) {
                            _this.$message.error("请添加投诉内容")
                            return
                        }
                        _arg = {
                            "order": {
                                "createBy": _this.dealer,
                                "createName": _this.dealer,
                                "projectId": _formData.projectId,
                                "bizTypeId": _formData.bizTypeId,
                                "organizationId": _formData.organizationId,
                                "productPkgId": _formData.productPkgId,
                                "complaintSource": _formData.complaintSource,
                                "details": _formData.details,
                                "expectedResult": _formData.expectedResult,
                                "createUser": this.dealerId,
                                "complaintsList": [],
                                "complaintPhase": _formData.complaintPhase
                            }
                        }
                        _tableData.forEach((item) => {
                            _tableList.push({
                                "complaintObjectId": item.complaintObjectId,
                                "specificNameId": item.specificNameId,
                                "complaintType": item.complaintType,
                                "complaintLevel": item.complaintLevel,
                                "complaintObjectType": this.complaintTypeList[item.complaintObjectId],
                                "visitorId": item.visitorId,
                                "handlerId": item.handlerId,
                                "visitFollowTime": (new Date(item.visitFollowTime)).getTime() / 1000,
                                "detailList": item.complaintsConfigItemIds
                            })
                        })
                        _arg.order.complaintsList = _tableList
                        //新增暂存
                        if (type === 'temp') {
                            _this.$refs['complaintsToolbar'].disableBySymbol('TEMP-SAVE');
                            ComplaintApi.complaintOrderTempCreate(_arg).then(res => {
                                _this.$refs['complaintsToolbar'].unDisableBySymbol('TEMP-SAVE');
                                    if (res.data.status === 200) {
                                        _this.$msgbox({
                                            title: '消息',
                                            message: "操作成功 ",
                                            type: 'success',
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain',
                                            callback: function () {
                                                _this.closeDialog()
                                            }
                                        })
                                    } else {
                                        _this.$msgbox({
                                            title: '消息',
                                            message: res.data.message || "操作失败 ",
                                            type: 'error',
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                    }
                            }).catch(error => {
                                console.log(error)
                            })
                            return
                        }
                        //新增提交
                        if (type === 'submit') {
                            _this.$refs['complaintsToolbar'].disableBySymbol('ADD-SUBMIT');
                            ComplaintApi.complaintOrderSubmitCreate(_arg).then(res => {
                                _this.$refs['complaintsToolbar'].unDisableBySymbol('ADD-SUBMIT');
                                    if (res.data.status === 200) {
                                        _this.$msgbox({
                                            title: '消息',
                                            message: "操作成功 ",
                                            type: 'success',
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain',
                                            callback: function () {
                                                _this.closeDialog()
                                            }
                                        })
                                    } else {
                                        _this.$msgbox({
                                        title: '消息',
                                        message: res.data.message || "操作失败 ",
                                        type: 'error',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })

                                    }

                            }).catch(error => {
                                console.log(error)
                            })
                        }
                    }
                })

            },
            //编辑暂存/提交
            editSubmit(type){
                if(this.dataSource.orderStatus > 2) {
                    this.$message.error("当前状态不能编辑")
                    return
                }
                let _this = this
                this.$refs.mainTable.validate(isValid => {
                    this.$refs.complaintsItem.validate(isValids => {
                        if (isValid && isValids) {
                            let _arg
                            _arg = {
                                "order": {
                                    "id": this.dataSource.id,
                                    "complaintObjectId": this.dataSource.complaintObjectId,
                                    "complaintObjectType": this.dataSource.complaintObjectType,
                                    "complaintSource": this.dataSource.complaintSource,
                                    "complaintType": this.dataSource.complaintType,
                                    "details": this.dataSource.details,
                                    "expectedResult": this.dataSource.expectedResult,
                                    "handlerId": this.dataSource.handlerId,
                                    "specificNameId": this.dataSource.specificNameId,
                                    "updateBy": this.dealer,
                                    "updateName": this.dealer,
                                    "updateUser": this.dealerId,
                                    "visitorId": this.dataSource.visitorId,
                                    "complaintsItemList": [],
                                    "pictureLists": this.handleUploadFiles(this.fileList)
                                }
                            }
                            if (this.$refs.complaintsItem.dataSource.length < 1) {
                                this.$message.error("投诉内容不能为空")
                                return
                            }
                            let itemList = []
                            this.$refs.complaintsItem.dataSource.forEach((item) => {
                                itemList.push({
                                    complaintsConfigItemId: item.complaintsConfigItemId,
                                    id: item.id
                                })
                            })
                            _arg.order.complaintsItemList = itemList
                            if (type === 'temp') {
                                _this.$refs['complaintsToolbar'].disableBySymbol('EDIT-SUBMIT');
                                ComplaintApi.complaintOrderTempUpdate(_arg).then(res => {
                                    _this.$refs['complaintsToolbar'].unDisableBySymbol('EDIT-SUBMIT');
                                        if (res.data.status !== 200) {
                                            _this.$msgbox({
                                                title: '消息',
                                                message: res.data.message || "操作失败 ",
                                                type: 'error',
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            })
                                        } else {
                                            _this.$msgbox({
                                                title: '消息',
                                                message: "操作成功 ",
                                                type: 'success',
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain',
                                                callback: function () {
                                                    _this.closeDialog()
                                                }
                                            })
                                        }
                                    }
                                ).catch(error => {
                                    console.log(error)
                                })
                            }
                            if (type === 'submit') {
                                _this.$refs['complaintsToolbar'].disableBySymbol('ADD-SUBMIT');
                                _this.$refs['complaintsToolbar'].unDisableBySymbol('ADD-SUBMIT');
                                ComplaintApi.complaintOrderSubmitUpdate(_arg).then(res => {
                                        if (res.data.status !== 200) {
                                            _this.$msgbox({
                                                title: '消息',
                                                message: res.data.message || "操作失败 ",
                                                type: 'error',
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain'
                                            })
                                        } else {
                                            _this.$msgbox({
                                                title: '消息',
                                                message: "操作成功 ",
                                                type: 'success',
                                                confirmButtonText: '知道了',
                                                confirmButtonClass: 'is-plain',
                                                callback: function () {
                                                    _this.closeDialog()
                                                }
                                            })
                                        }
                                    }
                                ).catch(error => {
                                    console.log(error)
                                })
                            }
                        }
                    })

                })
            },
            edit(){
                if(this.dataSource.orderStatus > 2) {
                    this.$message.error("当前状态不能编辑")
                    return
                }
                this.$router.replace({path: '/delivery/complaints-order-detail', query: {mode: "edit", id: this.id}})

            },
            follow(){
                if(this.dataSource.orderStatus == 5 || rows[i].orderStatus == 0) {
                    this.$message.error("当前状态不能跟进")
                    return
                }
                this.$router.replace({path: '/delivery/complaints-order-detail', query: {mode: "follow", id: this.id}})
            },
            complete(){
                if(this.dataSource.orderStatus != 3) {
                    this.$message.error("当前状态不能处理完成")
                    return
                }
                this.$router.replace({
                    path: '/delivery/complaints-order-detail',
                    query: {mode: "complete", procInsId: this.dataSource.processId}
                })
                this.initPage()
                this.mode === 'complete'
            },
            auditing(){
                if(this.dataSource.orderStatus != 4) {
                    this.$message.error("当前状态不能处理完成")
                    return
                }
                this.$router.replace({
                    path: '/delivery/complaints-order-detail',
                    query: {mode: "approve", procInsId: this.dataSource.processId}
                })

            },


            //跟进提交
            followSubmit(){
                this.$refs.appendForm.validate(isValid => {
                    if (isValid) {
                        let _this = this
                        let _arg = {
                            "followDTO": {
                                "id": this.dataSource.id,
                                "pictureLists": this.handleUploadFiles(this.fileList),
                                "content": this.appendForm.form.message,
                                "followTime":(new Date(this.appendForm.form.followTime)).getTime() / 1000,
                                "updateBy": this.dealer,
                                "updateName": this.dealer,
                                "updateUser": this.dealerId
                            }
                        }
                        _this.$refs['complaintsToolbar'].disableBySymbol('FOLLOW-SUBMIT');
                        ComplaintApi.complaintsFollow(_arg).then(res => {
                            _this.$refs['complaintsToolbar'].unDisableBySymbol('FOLLOW-SUBMIT');
                                if (res.data.status !== 200) {
                                    _this.$msgbox({
                                        title: '消息',
                                        message: res.data.message || "操作失败 ",
                                        type: 'error',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                } else {
                                    _this.$msgbox({
                                        title: '消息',
                                        message: "操作成功 ",
                                        type: 'success',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain',
                                        callback: function () {
                                            _this.closeDialog()
                                        }
                                    })
                                }
                            }
                        ).catch(error => {
                            _this.$refs['complaintsToolbar'].unDisableBySymbol('FOLLOW-SUBMIT');
                            console.log(error)
                        })
                    }
                })

            },
            //处理完成
            completeSubmit(){
                this.$refs.appendForm.validate(isValid => {
                    if (isValid) {
                        let _this = this
                        let _arg = {
                            "handleDTO": {
                                "approve": 1,
                                "id": this.dataSource.id,
                                "orderCode": this.dataSource.orderCode,
                                "procInsId": this.dataSource.processId,
                                "pictureLists": this.handleUploadFiles(this.fileList),
                                "reason": this.appendForm.form.message,
                                "updateBy": this.dealer,
                                "updateName": this.dealer,
                                "updateUser": this.dealerId
                            }
                        }
                        _this.$refs['complaintsToolbar'].disableBySymbol('COMPLETE-SUBMIT');
                        ComplaintApi.complaintOrderHandle(_arg).then(res => {
                            _this.$refs['complaintsToolbar'].unDisableBySymbol('COMPLETE-SUBMIT');
                                if (res.data.status !== 200) {
                                    _this.$msgbox({
                                        title: '消息',
                                        message: res.data.message || "操作失败 ",
                                        type: 'error',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                } else {
                                    _this.$msgbox({
                                        title: '消息',
                                        message: "操作成功 ",
                                        type: 'success',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain',
                                        callback: function () {
                                            _this.closeDialog()
                                        }
                                    })
                                }
                            }
                        ).catch(error => {
                            console.log(error)
                        })
                    }
                })
            },
            //审批
            auditingSubmit(){
                this.$refs.appendForm.validate(isValid => {
                    if (isValid) {
                        let _this = this
                        let _arg = {
                            "vistorDTO": {
                                "approve": this.appendForm.form.agree,
                                "id": this.dataSource.id,
                                "orderCode": this.dataSource.orderCode,
                                "procInsId": this.dataSource.processId,
                                "pictureLists": this.handleUploadFiles(this.fileList),
                                "reason": this.appendForm.form.message,
                                "updateBy": this.dealer,
                                "updateName": this.dealer,
                                "updateUser": this.dealerId
                            }
                        }
                        _this.$refs['complaintsToolbar'].disableBySymbol('AUDITING-SUBMIT')
                        ComplaintApi.complaintOrderApprove(_arg).then(res => {
                            _this.$refs['complaintsToolbar'].unDisableBySymbol('AUDITING-SUBMIT')
                                if (res.data.status !== 200) {
                                    _this.$msgbox({
                                        title: '消息',
                                        message: res.data.message || "操作失败 ",
                                        type: 'error',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                } else {
                                    _this.$msgbox({
                                        title: '消息',
                                        message: "操作成功 ",
                                        type: 'success',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                }
                            }
                        ).catch(error => {
                            console.log(error)
                        })
                    }
                })

            },
            handleBlur(a, b) {
                if (b.prop === 'projectId') {
                    if (this.dataSource.projectId) {
                        this.getDataSource()
                    }
                }
            },
            enter(inputs) {
                inputs.target.blur()
            },
            getDataSource() {
                if (this.dataSource.projectId) {
                    let _args = {
                        yid: this.dataSource.projectId
                    }
                    this.addFormLoading = true
                    ComplaintApi.complaintsOrderProtect(_args).then(res => {
                        this.addFormLoading = false
                    if (res.data.status != 200) {
                        this.$message.error("项目信息获取错误！")
                        this.resetDataSource()
                        return
                    }
                    this.dataSource = Object.assign(this.dataSource,res.data.result)
                    this.$refs.complaintsItem.dataSource = []
                    this.getcomplaintObj()
                }).catch(error => {
                        console.log(error)
                    return
                })
                }
            },
            callOwnerBtn(){
                let _uid = parseInt(this.dealerId)
                let _phoneId = parseInt(this.dataSource.phoneId)
                if(!this.dataSource.projectId) {
                    this.$message.error("项目信息获取错误！")
                    return
                }
                if(!_phoneId) {
                    this.$message.error("主联系人电话ID获取错误！")
                    return
                }
                let _self = this
                this.$refs.complaintsToolbar.disableBySymbol('callOwnerBtn')
                ComplaintApi.makeCall({uid:_uid,phoneId:_phoneId})
                    .then((res) => {
                        _self.$refs.complaintsToolbar.unDisableBySymbol('callOwnerBtn')
                        if(res.data.status == 200) {
                            _self.$message({
                                type: 'success',
                                message: '操作成功'
                            })
                            return
                        }else{
                            let errorInfo = _self.errorCode.filter(item => {
                                return item.value === parseInt(res.data.status)
                            })
                            if(errorInfo.length > 0) {
                                _self.$message.error(errorInfo[0].text)
                            }else{
                                _self.$message.error("服务异常")
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        _self.$refs.complaintsToolbar.unDisableBySymbol('callOwnerBtn')
                        _self.$message.error("服务异常")
                    })
            },
            resetDataSource(){
                this.dataSource = {
                    bizTypeId: null,
                    bizTypeName: null,
                    cityName: null,
                    organizationName: null,
                    protectAddress: null,
                    productPkgId: null,
                    productPkgName: null,
                    nickName: null,
                    ownerName: null,
                    id: null,
                    createName: null,
                    createBy: null,
                    createTime: null,
                    updateName: null,
                    updateBy: null,
                    updateTime: null,
                    orderCode: null,
                    projectId: null,
                    organizationId: null,
                    complaintSource: null,
                    details: null,
                    expectedResult: null,
                    handleResult: null,
                    complaintObjectId: null,
                    specificNameId: null,
                    complaintType: null,
                    orderStatus: null,
                    visitorId: null,
                    handlerId: null,
                    complaintLevel: null,
                    upgradeReason: null,
                    complaintPhase: null,
                    complaintTime: null,
                    handlingTime: null,
                    closeTime: null,
                    upgradeTime: null,
                    visitFollowTime: null,
                    handleFollowTime: null,
                    processId: null,
                    phoneId:null
                }
            }
        }
    }
</script>

<style lang="css" scoped>
    /*.full-dialog-form-container {*/
    /*position: relative;*/
    /*}*/
    .sub-container .pic-container {
        width: 1220px;
        margin: 10px auto;
    }


</style>

<style>
    .t8t-detail-view .el-select-dropdown__item.is-disabled {
        font-size: 1px !important;
    }

    .append-form-container .el-form-item__content {
        width: 240px !important;
    }

    .set-form-container .el-form-item .el-form-item__content {
        width: 80% !important;
    }
    .set-form-container .el-form-item .el-form-item__content div.el-textarea textarea.el-textarea__inner{
        height: 70px !important;
    }

    .sub-container .pic-container div.el-upload-disabled > .el-upload--picture-card {
        display: none !important;
    }

    .sub-container .pic-container div.el-upload-full > .el-upload--picture-card {
        display: none !important;
    }

    .sub-container .pic-container div.el-upload-disabled span.el-upload-list__item-delete {
        display: none !important;
    }

</style>
