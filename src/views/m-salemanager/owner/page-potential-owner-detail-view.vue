<template>
    <div class="owner-potential-detail-page">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new">
            <div class="t8t-full-dialog2-container">

                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="cost-reconciliation-toolbar t8t-dark"
                            @EDIT="doEdit"
                            @EDIT-SUBMIT="doEditSubmit"
                            @ANTI-AUDITING="doAntiAuditing"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <!-- 收缩按钮 -->
                <div class="dialog2-main-container">
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container full-dialog-tabs-container">
                        <el-tabs v-model="activeInputTabName" @tab-click="tabClick">
                            <el-tab-pane label="项目信息" name="project">
                                <el-form
                                    class="dialog2-form-container"
                                    :model="formData"
                                    :rules="formRule"
                                    ref="formBasic"
                                    label-position="right"
                                    label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="项目ID：">
                                            <el-input v-model="formData.id" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="创建时间：">
                                            <t8t-datetime-picker endFormater="timestamp"  :bindValue="formData.createTime"
                                                                 v-model="formData.createTime" type="date" :disabled="true">
                                            </t8t-datetime-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="最后跟进时间：">
                                            <t8t-datetime-picker endFormater="timestamp"  :bindValue="formData.updateTime"
                                                                 v-model="formData.updateTime" type="date" :disabled="true">
                                            </t8t-datetime-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="区域：" prop="townId">
                                            <t8t-division-old
                                                :changeOnSelect="true"
                                                :filterable="true"
                                                :clearable="true"
                                                v-model="townArr"
                                                :value="townArr"
                                                :defaultValue="formData.townId"
                                                :placeholder="选择区域"
                                                :disabled="!editForm"
                                                @change="onDivisionChange"
                                            >
                                            </t8t-division-old>
                                        </el-form-item>
                                    </div>
                                    <el-form-item class="dialog2-form-item-container" label="楼盘：" prop="estateId">
                                        <el-col :span="22">
                                            <t8t-form-popup
                                                :disabled="!editForm"
                                                :defaultValue="item.defaultValue"
                                                :ref="item.name"
                                                :bindValue="formData[item.name]"
                                                :textValue="item.textValue"
                                                :filedValue="item.filedValue"
                                                :name="item.name"
                                                :placeholder="item.placeholder"
                                                :dialog="item.dialog"
                                                :remote="item.remote"
                                                :service="item.service"
                                                :method="item.method"
                                                :remoteArgs="item.remoteArgs"
                                                :remoteQueryKey="item.remoteQueryKey"
                                                :autoText="item.autoText"
                                                :autoValue="item.autoValue"
                                                :icon="false"
                                                @change="onChange"
                                                @select="onSelect"
                                            ></t8t-form-popup>
                                        </el-col>
                                    </el-form-item>

                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="是否交房：" prop="transferStatus">
                                            <el-select v-model="formData.transferStatus" placeholder="--请选择--" :disabled="!editForm" @change="transferChange">
                                                <el-option v-for="item in propertyData[33007]" :label="item.name" :value="item.id" name="item.code">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="预计交房时间：" prop="expectTransferTime">
                                            <t8t-datetime-picker
                                                endFormater="timestamp"
                                                :bindValue="formData.expectTransferTime"
                                                v-model="formData.expectTransferTime"
                                                type="date"
                                                :disabled="!editTransfer"
                                                :picker-options="pickerOptions"
                                            >
                                            </t8t-datetime-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="房屋类型：" prop="houseType">
                                            <el-select v-model="formData.houseType" placeholder="--请选择--" :disabled="!editForm">
                                                <el-option v-for="item in propertyData[33009]" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="新旧房：" prop="houseStatus">
                                            <el-select v-model="formData.houseStatus" placeholder="--请选择--" :disabled="!editForm">
                                                <el-option v-for="item in propertyData[33006]" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="家装公装：" prop="decorateType">
                                            <el-select v-model="formData.decorateType" placeholder="--请选择--" :disabled="!editForm">
                                                <el-option v-for="item in propertyData[33004]" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="整改局改：" prop="decorateRange">
                                            <el-select v-model="formData.decorateRange" placeholder="--请选择--" :disabled="!editForm">
                                                <el-option v-for="item in propertyData[33003]" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="半包全包：" prop="decoratePattern">
                                            <el-select v-model="formData.decoratePattern" placeholder="--请选择--" :disabled="!editForm">
                                                <el-option v-for="item in propertyData[33002]" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="房屋结构：">
                                            <el-select v-model="formData.houseStruct" placeholder="--请选择--" :disabled="!editForm">
                                                <el-option v-for="item in propertyData[33011]" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="装修预算：" prop="orderPriceId">
                                            <el-select v-model="formData.orderPriceId" placeholder="--请选择--" :disabled="!editForm">
                                                <el-option v-for="item in propertyData[33012]" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="装修风格：">
                                            <el-select v-model="formData.preferStyleId" placeholder="--请选择--" :disabled="!editForm">
                                                <el-option v-for="item in propertyData[33008]" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="预计量房时间：" prop="expectMeasureTime">
                                            <t8t-datetime-picker endFormater="timestamp"  :bindValue="formData.expectMeasureTime"
                                                                 v-model="formData.expectMeasureTime" type="date" :disabled="!editForm"
                                                                 :picker-options="pickerOptions">
                                            </t8t-datetime-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="预计装修时间：" prop="expectDecorateTime">
                                            <el-select v-model="formData.expectDecorateTime" placeholder="--请选择--" :disabled="!editForm">
                                                <el-option v-for="item in propertyData[33013]" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="业主信息" name="owner">
                                <el-form class="dialog2-form-container" :model="formData" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业主ID：">
                                            <el-input v-model="formData.ownerId" :disabled="true"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                                <div class="dialog2-toolbar-container">
                                    <el-button
                                        type="primary"
                                        size="small"
                                        @click="add()"
                                        v-if="editForm"
                                    >新增行</el-button>
                                    <el-button
                                        type="primary"
                                        size="small"
                                        @click="setPrimary()"
                                    >设为主要联系人</el-button>
                                    <el-button
                                        type="danger"
                                        size="small"
                                        @click="del()"
                                        v-if="editForm"
                                    >删除行</el-button>
                                </div>
                                <t8t-table
                                    ref="t8tTable"
                                    :columns="columns"
                                    :dataSource="tableDataSource"
                                    :commonData="commonData"
                                    @cell-click="handleFormItemBlur"
                                    @row-click="handleAssignRowClick"
                                    @cell-editor-change="cellEditorChange"
                                    @data-loaded="handleDataLoaded"
                                    :selectCol="true"
                                    :indexCol="true"
                                    :editable="editForm"
                                    :pageBar="false"
                                    :radioCol="false"
                                >
                                </t8t-table>


                            </el-tab-pane>

                            <el-tab-pane label="跟进记录" name="follow">
                                <t8t-table
                                    ref="t8tTable2"
                                    :columns="followColumns"
                                    :dataSource="tableFollowDataSource"
                                    :commonData="commonData"
                                    :indexCol="true"
                                    :pageBar="false"
                                    :radioCol="false"
                                    :selectCol="false"
                                >
                                </t8t-table>
                            </el-tab-pane>

                        </el-tabs>
                    </div>

                    <!-- 标签页区 -->

                </div>
            </div>
        </el-dialog>

        <!-- 审核弹窗 -->
        <el-dialog title="审核结果" v-model="auditDialog" @close="closeRedDialog" ref="auditDialogRef">
            <el-form
                :model="auditFormData"
                :rules="auditRules"
                ref="t8tAudit"
                label-width="80px">
                <el-form-item label="审核状态" prop="radio">
                    <el-radio-group v-model="auditFormData.radio" @change="changeRadio">
                        <el-radio :label="2">可售</el-radio>
                        <el-radio :label="4">结束跟进</el-radio>
                        <el-radio :label="3">继续跟进</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="" prop="recordTime">
                    <t8t-datetime-picker endFormater="timestamp" :bindValue="auditFormData.recordTime"
                                         v-model="auditFormData.recordTime" type="datetime" :disabled="!auditFormData.editGoOn"
                                         :picker-options="pickerOptions">
                </t8t-datetime-picker>
                </el-form-item>
                <!--<el-form-item label="" prop="recordTime">-->
                    <!--<el-date-picker-->
                        <!--type="date"-->
                        <!--:value="(auditFormData.recordTime===null||auditFormData.recordTime===0)?null:auditFormData.recordTime*1000"-->
                        <!--placeholder="选择日期"-->
                        <!--:disabled="!auditFormData.editGoOn"-->
                        <!--@input="handleEditorChange(Date.parse(arguments[0])/1000)"-->
                    <!--&gt;-->
                    <!--</el-date-picker>-->
                <!--</el-form-item>-->
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="auditFormData.remark" :autosize="{minRows: 5, maxRows: 5}"
                              placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="runAudit" v-loading.body.lock="isLoading" element-loading-text="提交中">提交</el-button>
                <el-button @click="closeRedDialog">关闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    import Cookie from 'js-cookie'
    import Service from 'src/services/salemanager/salemanager.js'
    import ServiceApi from 'src/services/salemanager/Service.js'

    let editForm = false;
    export default {
        name: 'page-purchase-invoice-dialog',
        components: {
        },
        data () {
            return {
                pickerOptions: {
                    //禁用则返回true 非禁用返回false
                    disabledDate(time) {
                        let nowDate = new Date();
                        if(time < nowDate) {
                            return true;
                        }
                        return false;
                    }
                },
                isLoading:false,
                assignAccountId:0,
                type:null,
                isShowTable:false,
                disabledSymbols:[],
                id: null,
                activeName:"one",
                editForm:false,
                editTransfer:false,
                auditDialog: false,//审核弹窗
                auditFormData:{ //审核数据
                    radio: null,
                    recordTime: null,
                    remark: null,
                    editGoOn: false
                },
                formData: {
                    activityId: null,
                    auditGroup: null,
                    auditGroupName: null,
                    auditId: null,
                    auditName: null,
                    auditNick: null,
                    bizTypeId: null,
                    bizTypeName: null,
                    cityId: null,
                    cityName: null,
                    createTime: null,
                    createUser: null,
                    decoratePattern: null,
                    decoratePatternName: null,
                    decorateRange: null,
                    decorateRangeName: null,
                    decorateType: null,
                    decorateTypeName: null,
                    estateId: null,
                    estateName: null,
                    houseStatus: null,
                    houseStatusName: null,
                    id: null,
                    needExpedite: null,
                    needExpediteName: null,
                    orderMainStatus: null,
                    orderMainStatusName: null,
                    orderPriceId: null,
                    orderPriceName: null,
                    orderSubStatus: null,
                    orderSubStatusName: null,
                    organizationId: null,
                    organizationName: null,
                    ownerId: null,
                    ownerName: null,
                    phoneId: null,
                    productPkgId: null,
                    productPkgName: null,
                    townId: null,
                    townName: null,
                    transferStatus: null,
                    transferStatusName: null,
                    updateTime: Date.parse(new Date().toString()),
                    updateUser: Cookie.get('t8t-tc-uid'),
                    townArr:[],

                    expectTransferTime:null,
                    houseType:null,
                    houseStruct:null,
                    preferStyleId:null,
                    expectMeasureTime:null,
                    expectDecorateTime:null
                },
                formDataHouse:{
                    houseAddress:null,
                    houseArea:null,
                    houseCoordinate:null,
                    houseStruct:null,
                    houseStructName:null,
                    houseStyle:null,
                    houseType:null,//房屋类型
                    houseTypeName:null,
                    houseValuationArea:null,
                    orderId:null,
                },
                formDataExt:{
                    budget:null,
                    expectDecorateTime:null,
                    expectMeasureTime:null,
                    expectTransferTime:null,
                    orderId:null,
                    preferStyleId:null,//装修风格
                    remarks:null
                },
                formDataRevisit:{
                  visitType:null,
                  remark:null,
                  createTime:null,
                  createUser:null,
                  projectStatus:null,
                },
                item: {
                    label: '楼盘名称',
                    name: 'estateId', //需要传递给后台查询的数据
                    textValue: 'sname',  //需要展示出来的名称
                    filedValue: 'id',    //选中那条数据的ID
                    defaultValue: {
                        filedValue: null,
                        textValue: null
                    },
                    //自动补全
                    remote: true,
                    service: ServiceApi.SALES.name,
                    method: ServiceApi.SALES.methods.QUERY_ESTATE_PAGE,
                    remoteQueryKey: "estateName",
                    remoteArgs: {
                        page: 1,
                        size: 10
                    }
                },
                tableDataSource:[],
                tableFollowDataSource:[],
                activeInputTabName: 'project',
                isTopHide: false,
                isDialogShow: true,
                dialogVisible: false, //确认收款操作
                formRule:{
                    townId: [
                        {
                            required: true,
                            message: '请选择用户所在区域'
                        }
                    ],
                    estateId: [
                        {
                            required: true,
                            message: '请选择楼盘'
                        },
                    ],
                    transferStatus: [
                        {
                            required: true,
                            message: '请选择是否交房'
                        }
                    ],
                    expectTransferTime: [
                        {
                            required: false,
                            message: '请选择预计交房时间'
                        }
                    ],
                    houseType: [
                        {
                            required: true,
                            message: '请选择房屋类型'
                        }
                    ],
                    houseStatus: [
                        {
                            required: true,
                            message: '请选择新旧房'
                        }
                    ],
                    decorateType: [
                        {
                            required: true,
                            message: '请选择家装公装'
                        }
                    ],
                    decorateRange: [
                        {
                            required: true,
                            message: '请选择整改局改'
                        }
                    ],
                    decoratePattern: [
                        {
                            required: true,
                            message: '请选择半包全包'
                        }
                    ],
                    orderPriceId: [
                        {
                            required: true,
                            message: '请选择装修预算'
                        }
                    ],
                    expectMeasureTime: [
                        {
                            required: true,
                            message: '请选择预计量房时间'
                        }
                    ],
                    expectDecorateTime: [
                        {
                            required: true,
                            message: '请选择预计装修时间'
                        }
                    ],
                },
                auditRules:{
                    radio: [
                        {
                            required: true,
                            message: '请选择审核状态'
                        }
                    ],
                    recordTime:[
                        {
                            required: false,
                            message: '请选择跟进时间'
                        }
                    ],
                    remark: [
                        {
                            required: true,
                            message: '请选择备注'
                        }
                    ],
                },
                columns: [
                    {
                        prop: "appellationShow",
                        label: "称呼",
                        show: !editForm,
                        formatter: function (val, row, col, tab) {
                            let sex = '';
                            if(row.sex > 0) {
                                sex = row.sex == 1 ? '（先生）' : '（女士）'
                            }
                            return row.appellation + sex;
                        }
                    },
                    {
                        prop: "appellation",
                        label: "称呼",
                        show: editForm,
                        editor: {
                            type: "input",
                            rules:[
                                {
                                    required: true,
                                    message: '请填写业主称呼',
                                },
                                {
                                    pattern: /^.{1,20}$/,
                                    message: "请输入1-20个中英文字符"
                                }
                            ]
                        },
                        onClick(val, row, col, tab) {
                            if(row.id > 0) {
                                tab.handleFormItemBlur()
                            }
                        }
                    },
                    {
                        prop: "sex",
                        label: "性别",
                        show: editForm,
                        list: "sexList",
                        editor: {
                            type: "select",
                            rules: [
                                {
                                "required": true,
                                "message": "不能为空"
                                }
                            ]
                        },
                        onClick(val, row, col, tab) {
                            if(row.id > 0) {
                                tab.handleFormItemBlur()
                            }
                        }
                    },
                    {
                        prop: "phoneId",
                        label: "联系电话",
                        show: true,
                        editor:{
                            type: "input",
                            rules: function(val,row,col,tab) {
                                if(!row.id) {
                                    return [
                                        {
                                            required: true,
                                            message: '请填写业主手机号码',
                                        },
                                        {
                                            pattern: /^1[34578]\d{9}$/,
                                            message: '请填写正确的手机号码',
                                        }
                                    ]
                                }
                            }
                        },
                        formatter: function (val) {
                            return val == 0 ? '' : val;
                        },
                        onClick(val, row, col, tab) {
                            if(row.id > 0) {
                                tab.handleFormItemBlur()
                            }
                        }
                    },
                    {
                        prop: "wechatId",
                        label: "微信",
                        show: true,
                        editor:{
                            type: "input",
                            rules:[
                                {
                                    pattern: /^.{1,20}$/,
                                    message: "请输入1-20个中英文字符"
                                }
                            ]
                        },
                        formatter: function (val) {
                            return val == 0 ? '' : val;
                        },
                        onClick(val, row, col, tab) {
                            if(row.id > 0) {
                                tab.handleFormItemBlur()
                            }
                        }
                    },
                    {
                        prop: "qqId",
                        label: "QQ",
                        show: true,
                        editor: {
                            type: "input",
                            rules: [
                                {
                                    pattern: /^\d{1,20}$/,
                                    message: "请输入1-20位数字"
                                }
                            ]
                        },
                        formatter: function (val) {
                            return val == 0 ? '' : val;
                        },
                        onClick(val, row, col, tab) {
                            if(row.id > 0) {
                                tab.handleFormItemBlur()
                            }
                        }
                    }],
                followColumns:[
                    {
                        prop: "revisitTypeName",
                        label: "跟进状态"
                    },
                    {
                        prop: "remark",
                        label: "情况记录",
                        width: "350px"
                    },
                    {
                        prop:"projectStatus",
                        label:"项目状态",
                        formatter:function(val, row, col, table){
                            return row.projectMainStatusName + '/' + row.projectSubStatusName
                        }
                    },
                    {
                        prop: "createTime",
                        label: "操作时间",
                        formatter: 'dateParser'
                    },
                    {
                        prop: "createUserName",
                        label: "操作人"
                    }
                ],
                receiptRecordArgs:{},
                receiptRecordDialog: false, //查看收款记录
                commonData:{
                    sexList:[
                        {
                            text: "先生",
                            value: 1
                        },
                        {
                            text: '女士',
                            value: 2
                        }
                    ],

                },
                propertyData:{}
            };
        },
        beforeCreate(){
            this.id = this.$route.query.id;
            this.type = this.$route.query.type;
            if(this.type == 'edit') {
                editForm = true;
            }

        },
        created() {
            this.id = this.$route.query.id;
            this.type = this.$route.query.type;
            this.findOrderDetail(this.id);
            this.findRevisitedList(this.id);
            this.getQueryProperty()
            this.editForm = false
            this.editTransfer = false
            if(this.type == 'edit') {
                this.editForm = true
            }
        },
        methods: {
            doEdit(){
                this.$TCS.addTag('erp_scm_015002003001');
                editForm = true
                this.$router.push({
                    path: '/tochat-sale-manage/page-potential-owner-list/edit',
                    query: {id: this.formData.id,type:'edit'}
                })
            },
            changeRadio(val){
                if(val == 3) {
                    this.auditFormData.editGoOn = true;
                    let thisDate = new Date();
                    let ago3Day = new Date(Date.parse(new Date().toString()) + 86400000*3);
                    let ago3Day2 = new Date(ago3Day.getFullYear(), ago3Day.getMonth(), ago3Day.getDate());
                    let ago3Day3 = new Date(Date.parse(ago3Day2.toString()) + 3600*9*1000);

                    this.auditFormData.recordTime = ago3Day3;
                    this.auditRules.recordTime = [
                        {
                            required: true,
                            message: '请选择跟进时间'
                        }
                    ]
                }else{
                    this.auditFormData.recordTime = null;
                    this.auditFormData.editGoOn = false;
                    this.auditRules.recordTime = [
                        {
                            required: false,
                            message: '请选择跟进时间'
                        }
                    ]
                }
            },
            handleAssignRowClick (row, event, column) {
//                console.log(this.assignAccountId);
//                console.log(event);
//                this.assignAccountId = row.id;
            },
            //判断是否选中
            checkSelection() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if(selections.length===0){
                    this.$message.error('请选择联系人。')
                    return false
                }else if(selections.length>1){
                    this.$message.error('请对一个联系人进行操作。')
                    return false
                }
                return true
            },
            setPrimary(){
                // 单行判断
                if (this.checkSelection() === false) return false
                let selectRow = this.$refs['t8tTable'].getSelectRows()[0]
                if(selectRow.id == undefined) {
                    this.$message.error("请选择已存在的联系人");
                    return false;
                }
                let _this = this
                let args = {
                    "id": selectRow.id,
                    "updateUser":Cookie.get('t8t-tc-uid')
                }
                Service.setPrimaryContact(args).then((res) => {
                    if(res.data.status === 200){
                        // 新增成功
                        _this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '设置成功',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        _this.isLoading = false
                    }else{
                        _this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: res.data.message,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        _this.isLoading = false
                    }
                })
            },
            handleEditorChange(val){
                this.auditFormData.recordTime = val
            },
            //审核表单
            closeRedDialog() {
                this.auditDialog = false;
                this.auditFormData.radio = null;
                this.auditFormData.recordTime = null;
                this.auditFormData.remark = null;
            },
            doAntiAuditing(){
                this.$TCS.addTag('erp_scm_015002003002');
                this.auditDialog = true
            },
            //审核
            runAudit(){
                let _this = this;
                _this.isLoading = true
                this.$refs['t8tAudit'].validate((isValid) => {
                    if (isValid){
                        let formFlag = false;
                        let tableFlag = false;
                        this.$refs['formBasic'].validate((isValid) => {
                            if (isValid){
                                formFlag = true
                            }else{
                                this.activeInputTabName = "project";
                            }
                        })
                        let thisTable = this.$refs['t8tTable'];
                        thisTable.validate((isValid) => {
                            if (isValid) {
                                tableFlag = true
                            }else if(formFlag == true){
                                this.activeInputTabName = "owner";
                            }else if(formFlag == true){
                                this.activeInputTabName = "follow";
                            }
                            if(formFlag && tableFlag) {
                                let args = _this.getUpdateArgs(thisTable);
                                Service.updateDetail(args).then((res) => {
                                    if(res.data.status === 200){
                                        let args2 = {
                                            "auditBill" : {
                                                "orderId" : _this.formData.id,       // 项目订单id
                                                "billStatus" : _this.auditFormData.radio,    //  审核状态|0-缺省值，1-待审核，2-可售，3-继续跟进，4-结束跟进
                                                "auditId" : Cookie.get('t8t-tc-uid'),   // 审核人Id
                                                "nextFollowupTime":_this.auditFormData.recordTime, // 下次跟进时间
                                                "remarks":_this.auditFormData.remark, // 备注
                                            }
                                        }
                                        Service.createAuditBill(args2).then((res) => {
                                            if(res.data.status === 200){
                                                if(res.data.result == 2) {
                                                    _this.$msgbox({
                                                        title: '消息',
                                                        type: 'success',
                                                        message: '项目未找到可分配的门店',
                                                        showCancelButton: false,
                                                        confirmButtonText: '知道了',
                                                        confirmButtonClass: 'is-plain'
                                                    })
                                                }else{
                                                    _this.$msgbox({
                                                        title: '消息',
                                                        type: 'success',
                                                        message: '提交成功',
                                                        showCancelButton: false,
                                                        confirmButtonText: '知道了',
                                                        confirmButtonClass: 'is-plain'
                                                    })
                                                }
                                                _this.isLoading = false
                                                _this.closeDialog()
                                            }else{
                                                let dataMessage = res.data.message;
                                                if(res.data.status == 30010) {
                                                    dataMessage = '项目当前所处的状态不可审核';
                                                }
                                                res.data.status === 200
                                                _this.$msgbox({
                                                    title: '消息',
                                                    type: 'error',
                                                    message: dataMessage,
                                                    showCancelButton: false,
                                                    confirmButtonText: '知道了',
                                                    confirmButtonClass: 'is-plain'
                                                })
                                                _this.isLoading = false
                                            }
                                        })
                                    }else{
                                        _this.$msgbox({
                                            title: '消息',
                                            type: 'error',
                                            message: res.data.message,
                                            showCancelButton: false,
                                            confirmButtonText: '知道了',
                                            confirmButtonClass: 'is-plain'
                                        })
                                        _this.isLoading = false
                                    }
                                })
                            }else{
                                _this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: "请完善项目必要信息",
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                _this.isLoading = false
                            }
                        })

                    }else{
                        _this.isLoading = false
                    }
                })
            },
            //提交
            doEditSubmit(){
                this.$TCS.addTag('erp_scm_015002002001');
                let _this = this;
                let formFlag = false;
                let tableFlag = false;
                this.$refs['formBasic'].validate((isValid) => {
                    if (isValid){
                        formFlag = true
                    }else{
                        this.activeInputTabName = "project";
                    }
                })
                let thisTable = this.$refs['t8tTable'];
                thisTable.validate((isValid) => {
                    if (isValid) {
                        tableFlag = true
                    }else if(formFlag == true){
                        this.activeInputTabName = "owner";
                    }else if(formFlag == true){
                        this.activeInputTabName = "follow";
                    }
                    if(formFlag && tableFlag) {
                        this.isLoading = true
                        let args = _this.getUpdateArgs(thisTable);
//                        let rows = thisTable.getActionLog(false)
//                        rows.addedRows.forEach((res,key)=>{
//                                rows.addedRows[key]["phone"] = res.phoneId,
//                                rows.addedRows[key]["wechat"] = res.wechat,
//                                rows.addedRows[key]["qq"] = res.qqId
//                        })
////                        rows.addedRows.phone = rows.addedRows.phoneId
////                        rows.addedRows.wechat = rows.addedRows.wechatId
////                        rows.addedRows.qq = rows.addedRows.qqId
//                        let args = {
//                            decorationOrder:{
//                                decorationOrderUpdateDTO:this.formData,
//                                decorationOrderExtUpdateDTO:{
//                                    "expectMeasureTime": this.formData.expectMeasureTime, // 预期量房时间
//                                    "expectTransferTime": this.formData.expectTransferTime, // 预期交房时间
//                                    "expectDecorateTime": this.formData.expectDecorateTime, //预期装修时间
//                                    "preferStyleId": this.formData.preferStyleId //偏爱风格
//                                },
//                                decorationOrderHouseUpdateDTO:{
//                                    "houseType": this.formData.houseType,  //房屋类型
//                                    "houseStruct": this.formData.houseStruct   //房屋结构
//                                },
//                                decorationOrderContactCreateDTOList:rows.addedRows,
//                                deleteContactIdList:rows.deletedIDs
//                            }
//                        };
                        Service.updateDetail(args).then((res) => {
                            if(res.data.status === 200){
                                // 新增成功
                                _this.$msgbox({
                                    title: '消息',
                                    type: 'success',
                                    message: '提交成功',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                _this.isLoading = false
                                _this.closeDialog()
                            }else{
                                this.$msgbox({
                                    title: '消息',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                })
                                this.isLoading = false
                            }
                        })
                    }
                })
            },

            getUpdateArgs(thisTable){
                let _this = this
                let rows = thisTable.getActionLog(false)
                rows.addedRows.forEach((res,key)=>{
                        rows.addedRows[key]["phone"] = res.phoneId,
                        rows.addedRows[key]["wechat"] = res.wechatId,
                        rows.addedRows[key]["qq"] = res.qqId
                })
                let args = {
                    decorationOrder:{
                        decorationOrderUpdateDTO:_this.formData,
                        decorationOrderExtUpdateDTO:{
                            "expectMeasureTime": _this.formData.expectMeasureTime, // 预期量房时间
                            "expectTransferTime": _this.formData.expectTransferTime, // 预期交房时间
                            "expectDecorateTime": _this.formData.expectDecorateTime, //预期装修时间
                            "preferStyleId": _this.formData.preferStyleId //偏爱风格
                        },
                        decorationOrderHouseUpdateDTO:{
                            "houseType": _this.formData.houseType,  //房屋类型
                            "houseStruct": _this.formData.houseStruct   //房屋结构
                        },
                        decorationOrderContactCreateDTOList:rows.addedRows,
                        deleteContactIdList:rows.deletedIDs
                    }
                };
                return args;
            },

            add() {
                this.$refs['t8tTable'].addNewRow()
            },
            del() {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if(selections.length===0){
                    this.$message.error('请勾选需要删除的行。')
                    return false
                }
                this.$refs['t8tTable'].delRows()
            },
            //获取页面所需的辅助资料
            getQueryProperty:function(){
                let _this = this
                Service.queryProperty({}).then((res) => {
                    if (res.data.status == 200) {
                        _this.propertyData = res.data.result;

                    }
                });
            },
            //获取页面需要的跟进记录
            findRevisitedList:function (id) {
                let arg = {
                    search: {
                        projectId_eq:id ,
                    },
                };
               // debugger
                let _this = this
                Service.findRevisitedList(arg).then((res) => {
                   // console.log(res.data)
                    if (res.data.status == 200) {
                       _this.tableFollowDataSource =  Object.assign( _this.tableFollowDataSource,res.data.result);
                    }
                })
            },
            //获取页面详情
            findOrderDetail: function (id) {
                let arg = {
                    id: id
                };
                let _this = this
                Service.findOrderDetailById(arg).then((res) => {
                    if (res.data.status == 200) {
                        _this.tableDataSource = res.data.result.decorationOrderContactVOList;
                        _this.formDataHouse = Object.assign(_this.formDataHouse, res.data.result.decorationOrderHouseVO);
                        _this.formDataExt = Object.assign(_this.formDataExt, res.data.result.decorationOrderExtVO);
                        _this.formData = Object.assign(_this.formData, res.data.result.decorationOrderVO);
                        _this.formData.houseType = _this.formDataHouse.houseType;
                        _this.formData.houseStruct = _this.formDataHouse.houseStruct;
                        _this.formData.preferStyleId = _this.formDataExt.preferStyleId;
                        _this.formData.expectTransferTime = _this.formDataExt.expectTransferTime;
                        _this.formData.expectMeasureTime = _this.formDataExt.expectMeasureTime;
                        _this.formData.expectDecorateTime = _this.formDataExt.expectDecorateTime;
                        _this.formData.updateUser = Cookie.get('t8t-tc-uid');
                        _this.formData.updateTime = Date.parse(new Date().toString());

                        _this.formData.transferStatus = _this.formData.transferStatus > 0 ? _this.formData.transferStatus : null; //是否交房
                        _this.formData.houseType = _this.formData.houseType > 0 ? _this.formData.houseType : null; //房屋类型
                        _this.formData.houseStatus = _this.formData.houseStatus > 0 ? _this.formData.houseStatus : null;//新旧房
                        _this.formData.decorateType = _this.formData.decorateType > 0 ? _this.formData.decorateType : null;//家装公装
                        _this.formData.decorateRange = _this.formData.decorateRange > 0 ? _this.formData.decorateRange : null; //整改局改
                        _this.formData.decoratePattern = _this.formData.decoratePattern > 0 ? _this.formData.decoratePattern : null; //半包全包
                        _this.formData.orderPriceId = _this.formData.orderPriceId > 0 ? _this.formData.orderPriceId : null; //装修预算
                        _this.formData.houseStruct = _this.formData.houseStruct > 0 ? _this.formData.houseStruct : null; //房屋结构
                        _this.formData.preferStyleId = parseInt(_this.formData.preferStyleId) > 0 ? parseInt(_this.formData.preferStyleId) : null;  //装修风格

//                        _this.formData.transferStatus = _this.formData.transferStatus > 0 ? _this.formData.transferStatus : null; //是否交房
//                        _this.formDataHouse.houseType = _this.formDataHouse.houseType > 0 ? _this.formDataHouse.houseType : null; //房屋类型
//                        _this.formData.houseStatus = _this.formData.houseStatus > 0 ? _this.formData.houseStatus : null;//新旧房
//                        _this.formData.decorateType = _this.formData.decorateType > 0 ? _this.formData.decorateType : null;//家装公装
//                        _this.formData.decorateRange = _this.formData.decorateRange > 0 ? _this.formData.decorateRange : null; //整改局改
//                        _this.formData.decoratePattern = _this.formData.decoratePattern > 0 ? _this.formData.decoratePattern : null; //半包全包
//                        _this.formData.orderPriceId = _this.formData.orderPriceId > 0 ? _this.formData.orderPriceId : null; //装修预算
//                        _this.formDataHouse.houseStruct = _this.formDataHouse.houseStruct > 0 ? _this.formDataHouse.houseStruct : null; //房屋结构
//                        _this.formDataExt.preferStyleId = parseInt(_this.formDataExt.preferStyleId) > 0 ? parseInt(_this.formDataExt.preferStyleId) : null;  //装修风格

//                        _this.formData.townArr = [11,res.data.result.decorationOrderVO.standardCityId,res.data.result.decorationOrderVO.standardTownId];

                        _this.item.defaultValue = {
                                filedValue: this.formData.estateId,
                                textValue: this.formData.estateName
                        }
                    }
                });
            },
            transferChange(val){
                this.propertyData[33007].forEach((res,key)=>{
                    if(res.code == "02" && val == res.id) {
                        this.editTransfer = this.type == 'edit' ? true : false;
                        this.formRule.expectTransferTime = [
                            {
                                required: true,
                                message: '请选择预计交房时间'
                            }
                        ];
                    }else{
                        this.editTransfer = false;
                        this.formRule.expectTransferTime = [
                            {
                                required: false,
                                message: '请选择预计交房时间'
                            }
                        ];
                    }
                })
            },
            onChange(val){
                this.formData.estateId = val;
            },
            onDivisionChange(val){
                if(val.length == 3) {
                    this.formData.cityId = val[1] == undefined ? null : val[1];
                    this.formData.townId = val[2] == undefined ? null : val[2];
                }
                else{
                    this.formData.townId = null
                }

            },
            closeDialog() {
                this.$router.push({ path: '/tochat-sale-manage/page-potential-owner-list'})
                this.$emit('close')
            },

        },

    };
</script>

<style lang="css" scoped>
    .el-input.is-disabled .el-input__inner{
        width:180px !important;
    }
</style>
<style>
    .owner-potential-detail-page .t8t-form-popup .el-input {
        width: 180px;
        line-height: 32px;
    }
</style>
