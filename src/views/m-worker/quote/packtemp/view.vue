<template>
    <div class="packtempview">
        <el-dialog size="full" class="t8t-full-dialog2 dialog-new" v-model="dialogVisible" @close="closeDialog" :show-close="false" :close-on-press-escape="false"  :class="{'isHide': isTopHide}">

            <div class="t8t-full-dialog2-container">

                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <div>
                            <el-button @click="cancel()">返回</el-button>
                        </div>
                        <!--暂存-->
                        <t8t-toolbar :symbolList="['TEMP-SAVE']" class="t8t-dark"
                                     :disabledSymbols="disabledSymbolsTop"
                                     @TEMP-SAVE="tempSave()"
                                     ref="toolbartop"
                        ></t8t-toolbar><!--顶部工具栏-->
                        <div>
                            <el-button @click="preview()">预览</el-button>
                            <el-button @click="priceConfig()">产品包价格配置</el-button>
                        </div>
                    </div>
                </div>

                <!--
                    模板头
                -->
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <div class="full-dialog-form-container">
                        <t8t-form-panel
                            :dataSource="tempHeadFormData"
                            :fields="tempHeadFormFields"
                            :commonData="tempHeadFormCommonData"
                            ref="mainForm"
                        >
                            <template slot="effectTime"
                                      scope="scope">
                                <el-date-picker
                                    v-model="tempHeadFormData[scope.field.prop]"
                                    :picker-options="scope.field.pickerOptions"
                                    :format="scope.field.format"
                                    :disabled="!canEditEffectTime"
                                    type="datetime">
                                </el-date-picker>
                            </template>

                            <template slot="freezeTime"
                                      scope="scope">
                                <el-date-picker
                                    v-model="tempHeadFormData[scope.field.prop]"
                                    :picker-options="scope.field.pickerOptions"
                                    :format="scope.field.format"
                                    :disabled="!canFreezeTime"
                                    type="datetime">
                                </el-date-picker>
                            </template>

                            <template slot="forbiddenTime"
                                      scope="scope">
                                <el-date-picker
                                    v-model="tempHeadFormData[scope.field.prop]"
                                    :picker-options="scope.field.pickerOptions"
                                    :format="scope.field.format"
                                    :disabled="!canForbiddenTime"
                                    type="datetime">
                                </el-date-picker>
                            </template>

                            <template slot="wholeCode" scope="scope">
                                <el-select v-model="tempHeadFormData[scope.field.prop]" filterable placeholder="请选择">
                                    <el-option
                                        v-for="item in tempHeadFormCommonData.orderTypes"
                                        :label="item.text"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>

                        </t8t-form-panel>
                    </div>

                    <div class="full-dialog-tabs-container">
                        <t8t-toolbar :symbolList="['ROW-ADD','ROW-EDIT','ROW-SUBMIT','ROW-DISABLE','ROW-COPY','GROUP-MAP']"
                                     :disabledSymbols="disabledSymbolsBody"
                                     @ROW-ADD="addRow()"
                                     @ROW-EDIT="rowEdit()"
                                     @ROW-SUBMIT="rowCheck()"
                                     @ROW-DISABLE="rowForbidden()"
                                     @ROW-SORT="rowSort()"
                                     @ROW-COPY="rowCopy()"
                                     @GROUP-MAP="addGroupDosageMapping()"
                                     ref="toolbartable"
                        >
                        </t8t-toolbar>

                        <!--行操作工具栏-->

                        <t8t-search
                            :fields="searchFields"
                            :selectSource="selectSource"
                            @submit="submitSearch"
                            :showToggleBtn="false"
                        >
                        </t8t-search>
                        <div class="g-main-container-column">
                            <el-tabs v-model="activeTabName" @tab-click="tabClick" ref="tabs1">
                                <el-tab-pane label="标准套餐"
                                             class="tableDebitType"
                                             name="one">
                                    <t8t-table
                                        :columns="mainTableColumns"
                                        :edit-mode="editMode"
                                        :service="mainTableService"
                                        :method="mainTableMethod"
                                        :commonData="selectSource"
                                        :args="args"
                                        :indexCol="true"
                                        ref="mainTable"
                                        :templateData="templateData"
                                        :pageBar="true"
                                        :editable="editable"
                                        @data-loaded="dataLoaded"
                                        @cell-click="cellClick"
                                    >
                                    </t8t-table>
                                </el-tab-pane>
                                <el-tab-pane label="个性化"
                                             class="tableDebitType"
                                             name="two">
                                    <t8t-table
                                        :columns="mainTable2Columns"
                                        :edit-mode="editMode"
                                        :service="mainTableService"
                                        :method="mainTableMethod"
                                        :commonData="selectSource"
                                        :args="args2"
                                        :indexCol="true"
                                        ref="mainTable2"
                                        :templateData="templateData"
                                        :pageBar="true"
                                        :editable="editable"
                                        @data-loaded="dataLoaded"
                                        @cell-click="cellClick"
                                    >
                                    </t8t-table>
                                </el-tab-pane>
                                <el-tab-pane label="税费"
                                             class="tableDebitType"
                                             name="three">
                                    <t8t-table
                                        :columns="mainTable3Columns"
                                        :edit-mode="editMode"
                                        :service="mainTableService"
                                        :method="mainTableMethod"
                                        :commonData="selectSource"
                                        :args="args3"
                                        :indexCol="true"
                                        ref="mainTable3"
                                        :templateData="templateData"
                                        :pageBar="true"
                                        :editable="editable"
                                        @data-loaded="dataLoaded"
                                        @cell-click="cellClick"
                                    >
                                    </t8t-table>
                                </el-tab-pane>
                            </el-tabs>

                        </div>
                    </div>


                </div>

            </div>

        </el-dialog>
        <select-quote-item-dialog
            v-if="addRowDialogVisible"
            @close="closeSelectQuoteItemDialog"
            @open="addRowDialogVisible=true"
            :activeTableRef="activeTableRef"
            :currentQuoteCode="currentQuoteCode"
            :qiTypes="qiTypes"
        >
        </select-quote-item-dialog>


    </div>
</template>
<script>

    import DateUtils from 'src/utils/DateUtils.js'
    import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    // import T8tSearch from 'src/components/t8t-search/t8t-search.vue'
    import storages from 'src/services/storages/storages.js'
    import productPackage from 'src/services/worker/productpackage/base-method.js'
    import packtemp from 'src/services/worker/packtemp/packtemp.js'
    import packtempServices from 'src/services/worker/packtemp/Service.js'
    import spaceMethods from 'src/services/worker/apartmentspace/base-method.js'
    import selectQuoteItemDialog from './selectQuoteConfigDialog.vue'
    import priceConfigDialog from './priceConfig.vue'
    import formula from 'src/services/formula/methods.js'
    import formulaService from 'src/services/formula/Service.js'
    import config from './config.js'
    export default {
        name: "packtempview",
        components: {
            // T8tSearch,
            selectQuoteItemDialog,
            priceConfigDialog
        },
        data(){

            return {
                editMode:'cell',
                accountId:+Cookie.get('t8t-tc-uid'),
                dialogVisible:true,
                addRowDialogVisible:false,
                activeTabName:'one',
                activeTableRef:'mainTable', //展示中的reftable
                mainTableService: packtempServices.template.name,
                mainTableMethod: packtempServices.tempItem.methods.searchTempItemList,
                args: {},
                args2: {},
                args3: {},
                qiTypes:[],//报价项类型
                disabledSymbolsTop:['TEMP-SAVE'],
                disabledSymbolsBody:[],
                canEditEffectTime : true,
                canFreezeTime : true,
                canForbiddenTime : true,
                tempItemType:0,
                needEffectTime: true,
                currentRow:{},
                qiTypesMappging:{},
                tempHeadFormCommonData: {
                    organizes:[],
                    mould_status:config.datas.mould_status,
                    productPackages:[],
                    canEditOrg: !this.canEditOrg,
                    orderTypes:[],
                },
                isTopHide: false,
                tempHeadFormFields:[
                    {
                        prop: 'tempCode',
                        label: '产品包模板编码',
                        type: 'input',
                        disabled:true,
                    },
                    {
                        prop: 'tempName',
                        label: '产品包模板名',
                        type: 'input',
                        rules: [
                            {required: true ,message: "请正确填写产品包模板名称",trigger: 'change'},
                            {min: 1 ,max:20, message: "产品包模板名称最多50个字符",trigger: 'change'},
                        ]
                    },
                    {
                        prop: 'tempStatus',
                        label: '模板状态',
                        type: 'select',
                        disabled:true,
                        list:'mould_status',
                    },
                    {
                        prop: 'orgId',
                        label: '组织',
                        type: 'select',
                        list: 'organizes',
                        disabled: !this.canEditOrg,
                        rules: [
                            {
                                type: "number",
                                message: '请选择组织'
                            },
                            {type: "number",min: 0 ,max:1000000, message: "请选择组织",trigger: 'change'},
                        ]
                    },
                    {
                        prop: 'pkgId',
                        label: '产品包',
                        type: 'select',
                        list: 'productPackages',
                        disabled: true
                    },
                    {
                        prop: 'wholeCode',
                        label: '打印模板',
                        //type: 'select',
                        list: 'orderTypes',
                        disabled: false,
                        rules: [
                            {required: true ,message: "请选择打印模板",trigger: 'change'},
                        ]
                    },
                    /**
                     {
                         prop: 'scheduleModuleId',
                         label: '排期模板头ID',
                         type: 'input',
                         defaultValue: {
                         },
                         textValue: 'name',
                         filedValue: 'id',
                         disabled:true,
                         dialog: {
                             title: "查询排期模板",
                             size: 'large',
                             searchForm: {
                                 fields: [
                                     {type: 'input', label: '模板名', name: 'name_like'},
                                 ],
                                 resetBtnVisible: false,
                                 showToggleBtn: false
                             },
                             table: {
                                 //表格
                                 columns: [{
                                     prop: 'name',
                                     label: '模板名'
                                 }],
                                 radioCol: true,
                                 //请求参数配置
                                 service: packtempServices.schedule.name,
                                 method: packtempServices.schedule.methods.module,
                                 args: {}
                             },
                             onConfirm: function (){}
                         },
                         //自动补全
                         remote:true,
                         service:packtempServices.schedule.name,
                         method:packtempServices.schedule.methods.module,
                         remoteQueryKey:"name_like",
                         remoteArgs:{'page':1, 'size':20},
                         rules: [{
                             required: true,
                             message: '不能为空'
                         }]
                     },
                     */
                    {
                        //TODO 填写时，填写时间必须晚于等于当前时间，早于已填写的冻结时间和禁用时间；
                        prop: 'effectTime',
                        label: '生效时间',
                        //type: 'datetime',
                        pickerOptions: {
                            disabledDate: (time) => {
                                let form = this.$refs['mainForm']
                                let dataSource = form['dataSource']
                                let freezeTime = dataSource['freezeTime']
                                let forbiddenTime = dataSource['forbiddenTime']

                                //时间不能早于当前时间
                                return (
                                    time.getTime() < Date.now() ||
                                    ( freezeTime && time.getTime() > new Date(freezeTime).getTime() ) ||
                                    ( forbiddenTime && time.getTime() > new Date(forbiddenTime).getTime() )
                                )
                            }
                        },
                        format:'yyyy-MM-dd HH:mm',
                    },
                    {
                        //TODO 填写时，填写时间必须晚于等于当前时间，早于已填写的禁用时间；
                        prop: 'freezeTime',
                        label: '冻结时间',
                        //type: 'datetime',
                        pickerOptions: {
                            disabledDate: (time) => {
                                let form = this.$refs['mainForm']
                                let dataSource = form['dataSource']
                                let freezeTime = dataSource['freezeTime']
                                let forbiddenTime = dataSource['forbiddenTime']

                                //时间不能早于当前时间
                                return (
                                    time.getTime() < Date.now() ||
                                    ( forbiddenTime && time.getTime() > new Date(forbiddenTime).getTime() )
                                )
                            }
                        },
                        format:'yyyy-MM-dd HH:mm',
                    },
                    {
                        //TODO 填写时，填写时间必须晚于等于当前时间；
                        prop: 'forbiddenTime',
                        label: '禁用时间',
                        //type: 'datetime',
                        pickerOptions: {
                            disabledDate: (time) => {
                                let form = this.$refs['mainForm']
                                let dataSource = form['dataSource']
                                let freezeTime = dataSource['freezeTime']
                                let forbiddenTime = dataSource['forbiddenTime']

                                //时间不能早于当前时间, 禁用时间不能小于冻结时间
                                return ( time.getTime() < Date.now() ||
                                    (freezeTime && time.getTime() < new Date(freezeTime).getTime())
                                )
                            }
                        },
                        format:'yyyy-MM-dd HH:mm',
                    }
                ],
                tempHeadFormData:{},
                mainTableColumns:[
                    {
                        "prop": "itemCode",
                        "label": "模板行编码"
                    },
                    {
                        "prop": "spaceId",
                        "label": "使用空间",
                        list:'spaces',
                        "required":true,
                        width: 80,
                        editor:{
                            type:'select',
                            rules:[
                                {
                                    required: true, message: '请选择使用空间'
                                }
                            ]
                        },
                    },
                    {
                        "prop": "placeId",
                        "label": "位置",
                        list:'places',
                        "required":true,
                        width: 80,
                        editor:{
                            type:'select',
                            rules:[
                                {
                                  type:'number',required: true, message: '请选择位置',min:1
                                }
                            ]
                        },
                    },
                    {
                        "prop": "qiCodeVO",
                        "label": "报价项编码"
                    },
                    {
                        "prop": "qiIdVO",
                        "label": "报价项名称"
                    },
                    {
                        "prop": "qiUnitVO",
                        "label": "单位",
                        width: 80,
                    },
                    {
                        "prop": "amountEquationId",
                        "label": "数量公式名称",
                        list:'amountEquations',
                        "required":true,
                        editor:{
                            type:'lookup',
                            'service': formulaService.name,
                            'method': formulaService.formula.methods.queryPage,
                            'args':{},
                            searchValue:'',
                            'filterMethod': function (val, args) {

                                let newArgs = Object.assign({},args)

                                let search = {
                                    'moduleId': args.search.moduleId
                                }
                                if( val ){
                                    search['formulaName'] = val
                                }
                                newArgs['search'] = search

                                return newArgs
                            },
                            'columns': [
                                {
                                    'prop': 'id',
                                    'label': '公式ID'
                                },
                                {
                                    'prop': 'formulaName',
                                    'label': '公式名'
                                },
                                {
                                    'prop': 'expression',
                                    'label': '表达式'
                                }
                            ],
                            'valueExpr': 'id',
                            'searchExpr': [
                                'formulaName'
                            ],
                            rules:[
                                {
                                    required: true, message: '请选择数量公式'
                                }
                            ]
                        },
                    },
                    {
                        "prop": "lowerLimit",
                        "label": "数量下限",
                        width: 80,
                        editor:{
                            type:'input',
                            rules:[
                                {
                                    pattern: /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '必须为数字，最多保留两位小数'
                                },
                                {
                                    type:'number', max: 9999 ,message: "填写数量不可超过9999",transform(v){ return isNaN(+v) ? 0 : +v }
                                }
                            ]
                        },
                    },
                    {
                        "prop": "upperLimit",
                        "label": "数量上限",
                        width: 80,
                        editor:{
                            type:'input',
                            rules:[
                                {
                                   pattern: /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '必须为数字，最多保留两位小数'
                                },
                                {
                                    type:'number', min:0, max: 9999 ,message: "填写数量不可超过9999",transform(v){ return isNaN(+v) ? 0 : +v}
                                }
                            ]
                        },
                    },
                    {
                        "prop": "tempItemStatus",
                        "label": "行状态",
                        width: 80,
                        list:'temp_item_status'
                    },
                    {
                        "prop": "dosageMappingStatus",
                        "label": "用量关系状态",
                        width: 80,
                        list:'dosage_mapping_status'
                    },
                    {
                        "prop": "effectTime",
                        "label": "行生效时间",
                        /*editor:{
                            type:'datetime',
                            rules:[
                                {
                                    required: this.needEffectTime ,message: "请填写行生效时间"
                                }
                            ]
                        },*/
                        formatter: function(val) {
                            return val ? DateUtils(new Date(val).getTime(), 'yyyy-mm-dd HH:MM') : '--'
                        }
                    },
                    {
                        "prop": "forbiddenTime",
                        "label": "行禁用时间",
                        formatter: function(val) {
                            return val ? DateUtils(new Date(val).getTime(), 'yyyy-mm-dd HH:MM') : '--'
                        }
                    },
                ],
                mainTable2Columns:[
                    {
                        "prop": "itemCode",
                        "label": "模板行编码"
                    },
                    {
                        "prop": "placeId",
                        "label": "位置",
                        width: 80,
                        list:'places',
                        "required":true,
                        editor:{
                            type:'select',
                            rules:[
                                {
                                    type:'number',
                                    required: true,
                                    min: 1,
                                    message: '请选择位置'
                                }

                            ]
                        },
                    },
                    {
                        "prop": "settleType",
                        "label": "参与结算类型",
                        list:'settleTypes',
                        width: 90,
                        "required":true,
                        editor:{
                            type:'select',
                            rules:[
                                {
                                    type:'number',
                                    required: true,
                                    min: 0,
                                    message: '请选择结算类型'
                                }
                            ]
                        },
                    },
                    {
                        "prop": "qiCodeVO",
                        "label": "报价项编码"
                    },
                    {
                        "prop": "qiIdVO",
                        "label": "报价项名称"
                    },
                    {
                        "prop": "qiUnitVO",
                        "label": "单位",
                        width: 80,
                    },
                    {
                        "prop": "amountEquationId",
                        "label": "数量公式名称",
                        list:'amountEquations',
                        "required":true,
                        editor:{
                            type:'lookup',
                            'service': formulaService.name,
                            'method': formulaService.formula.methods.queryPage,
                            'args':{},
                            searchValue:'',
                            'filterMethod': function (val, args) {

                                let newArgs = Object.assign({},args)

                                let search = {
                                    'moduleId': args.search.moduleId
                                }
                                if( val ){
                                    search['formulaName'] = val
                                }
                                newArgs['search'] = search

                                return newArgs
                            },
                            'columns': [
                                {
                                    'prop': 'id',
                                    'label': '公式ID'
                                },
                                {
                                    'prop': 'formulaName',
                                    'label': '公式名'
                                },
                                {
                                    'prop': 'expression',
                                    'label': '表达式'
                                }
                            ],
                            'valueExpr': 'id',
                            'searchExpr': [
                                'formulaName'
                            ],
                            rules:[
                                {
                                    required: true, message: '请选择数量公式'
                                }
                            ]
                        },
                    },
                    {
                        "prop": "lowerLimit",
                        "label": "数量下限",
                        width: 80,
                        editor:{
                            type:'input',
                            rules:[
                                {
                                    pattern: /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '必须为数字，最多保留两位小数'
                                },
                                {
                                    type:'number', max: 9999 ,message: "填写数量不可超过9999",transform(v){ return isNaN(+v) ? 0 : +v }
                                }
                            ]
                        },
                    },
                    {
                        "prop": "upperLimit",
                        "label": "数量上限",
                        width: 80,
                        editor:{
                            type:'input',
                            rules:[
                                {
                                    pattern: /^((0|[1-9]\d{0,})((\.[0-9]{1,2})?))$/, message: '必须为数字，最多保留两位小数'
                                },
                                {
                                    type:'number', max: 9999 ,message: "填写数量不可超过9999",transform(v){ return isNaN(+v) ? 0 : +v }
                                }
                            ]
                        },
                    },
                    {
                        "prop": "tempItemStatus",
                        "label": "行状态",
                        width: 80,
                        list:'temp_item_status'
                    },
                    {
                        "prop": "price",
                        "label": "价格",
                        width: 80,
                        "required":true,
                        editor:{
                            type:'input',
                            rules: function (val, row , col, tab){

                                let exp = new RegExp('^((0|[1-9]\\d{0,6})((\\.[0-9]{1,2})?))$')
                                return [
                                    {
                                        type : 'number',
                                        'validator': (rule, value, callback, source, options) => {
                                            //最多精确到两位小数
                                            if( !exp.test(+value)){
                                                callback(false)
                                            }else{
                                                callback()
                                            }

                                        },
                                        message: '必须为数字，最大7位，最多保留两位小数'
                                    },
                                    {
                                        type : 'number',
                                        'validator': (rule, value, callback, source, options,a,b,c,d) => {
                                               if(!row.hasOwnProperty('id') && (value == null || value == '' || value == undefined)){
                                                   callback(false)
                                               }else{
                                                   callback()
                                               }
                                        },
                                        message: "请正确填写价格"
                                    }
                                ]
                            },
                        },
                    },
                    {
                        "prop": "currentPrice",
                        "label": "执行价格",
                        width: 80,
                    },
                    {
                        "prop": "priceEffectTime",
                        "label": "价格生效时间"
                    },
                    {
                        "prop": "gdMappingStatus",
                        "label": "价格状态",
                        width: 80,
                        list:'gd_mapping_status'
                    },
                    {
                        "prop": "dosageMappingStatus",
                        "label": "用量关系状态",
                        width: 80,
                        list:'dosage_mapping_status'
                    },
                    {
                        "prop": "effectTime",
                        "label": "行生效时间",
                        /*editor:{
                         type:'datetime',
                         rules:[
                         {
                         required: this.needEffectTime ,message: "请填写行生效时间"
                         }
                         ]
                         },*/
                        formatter: function(val) {
                            return val ? DateUtils(new Date(val).getTime(), 'yyyy-mm-dd HH:MM') : '--'
                        }
                    },
                    {
                        "prop": "forbiddenTime",
                        "label": "行禁用时间",
                        formatter: function(val) {
                            return val ? DateUtils(new Date(val).getTime(), 'yyyy-mm-dd HH:MM') : '--'
                        }
                    }
                ],
                mainTable3Columns:[
                    {
                        "prop": "itemCode",
                        "label": "模板行编码"
                    },

                    {
                        "prop": "qiCodeVO",
                        "label": "报价项编码"
                    },
                    {
                        "prop": "qiIdVO",
                        "label": "报价项名称"
                    },
                    {
                        "prop": "amountEquationId",
                        "label": "数量公式名称",
                        list:'amountEquations',
                        "required":true,
                        editor:{
                            type:'lookup',
                            'service': formulaService.name,
                            'method': formulaService.formula.methods.queryPage,
                            'args':{},
                            searchValue:'',
                            'filterMethod': function (val, args) {

                                let newArgs = Object.assign({},args)

                                let search = {
                                    'moduleId': args.search.moduleId
                                }
                                if( val ){
                                    search['formulaName'] = val
                                }
                                newArgs['search'] = search

                                return newArgs
                            },
                            'columns': [
                                {
                                    'prop': 'id',
                                    'label': '公式ID'
                                },
                                {
                                    'prop': 'formulaName',
                                    'label': '公式名'
                                },
                                {
                                    'prop': 'expression',
                                    'label': '表达式'
                                }
                            ],
                            'valueExpr': 'id',
                            'searchExpr': [
                                'formulaName'
                            ],
                            rules:[
                                {
                                    required: true, message: '请选择数量公式'
                                }
                            ]
                        },
                    },
                    {
                        "prop": "tempItemStatus",
                        "label": "行状态",
                        width: 80,
                        list:'temp_item_status'
                    },
                    {
                        "prop": "price",
                        "label": "价格",
                        width: 80,
                        "required":true,
                        editor:{
                            type:'input',

                            rules: function (val, row , col, tab){

                                let exp = new RegExp('^(0|((0\\.[0-9]{1,2})?))$')
                                return [
                                    {
                                        type : 'number',
                                        validator: (rule, value, callback, source, options) => {
                                            debugger
                                            //最多精确到两位小数
                                            if(!exp.test(+value)){
                                                callback(false)
                                            }else{
                                                callback()
                                            }

                                        },
                                        message: '必须为数字，不能大于等于1，最多保留2位小数'
                                    },
                                    {
                                        type : 'number',
                                        validator: (rule, value, callback, source, options,a,b,c,d) => {
                                            if(!row.hasOwnProperty('id') && (value == null || value == '' || value == undefined)){
                                                callback(false)
                                            }else{
                                                callback()
                                            }
                                        },
                                        message: "请正确填写价格"
                                    }
                                ]
                            },
                        },
                    },
                    {
                        "prop": "currentPrice",
                        "label": "执行价格",
                        width: 80,
                    },
                    {
                        "prop": "priceEffectTime",
                        "label": "价格生效时间"
                    },
                    {
                        "prop": "gdMappingStatus",
                        "label": "价格状态",
                        width: 80,
                        list:'gd_mapping_status'
                    },
                    {
                        "prop": "dosageMappingStatus",
                        "label": "用量关系状态",
                        width: 80,
                        list:'dosage_mapping_status'
                    },
                    {
                        "prop": "effectTime",
                        "label": "行生效时间",
                        /*editor:{
                         type:'datetime',
                         rules:[
                         {
                         required: this.needEffectTime ,message: "请填写行生效时间"
                         }
                         ]
                         },*/
                        formatter: function(val) {
                            return val ? DateUtils(new Date(val).getTime(), 'yyyy-mm-dd HH:MM') : '--'
                        }
                    },
                    {
                        "prop": "forbiddenTime",
                        "label": "行禁用时间",
                        formatter: function(val) {
                            return val ? DateUtils(new Date(val).getTime(), 'yyyy-mm-dd HH:MM') : '--'
                        }
                    }
                ],
                lookupDataSource:[],
                templateData:{
                    price:'',
                    currentPrice:'',
                    priceEffectTime:'',
                    qiId: null,  //报价项id
                    qiCodeVO: null, //报价项编码
                    qiIdVO: null, //报价项名称
                    qiUnitVO: null //单位
                },
                tempCode:null,
                tempId:null,
                commonData: config.datas,
                canEditOrg: false , //是否可编辑组织
                formData:{},
                searchFields:[
                    {
                        type: 'select',
                        name: 'spaceId',
                        label:'空间',
                        selectSourceKey:'spaces',
                        placeholder:'选择空间'
                    },
                    {
                        type: 'select',
                        name: 'placeId',
                        label:'位置',
                        selectSourceKey:'places',
                        placeholder:'选择位置'
                    },
                    /*{
                        type: 'input',
                        name: 'qiIdVO',
                        label:'报价项名称',
                    },*/
                    {
                        type: 'select',
                        name: 'dosageMappingStatus',
                        label:'用量关系状态',
                        selectSourceKey:'dosage_mapping_status'
                    },

                    //模板ID筛选、模板名称筛选、启用时间、冻结时间、禁用时间、修改时间
                ],
                selectSource:{
                    organizes:[],
                    mould_status:config.datas.mould_status,
                    dosage_mapping_status:config.datas.dosage_mapping_status,
                    temp_item_status:config.datas.temp_item_status,
                    gd_mapping_status:config.datas.gd_mapping_status,
                    productPackages:[],
                    spaces:[],
                    places:[],
                    settleTypes:config.datas.settle_type,
                    amountEquations:[],
                    qiTypes:[]
                },
                hotRow:[],
                actionModel:'',
                pickDateEffectTime:{
                    disabledDate:(time) =>{
                        console.log(time)
                        return time.getTime() < Date.now()
                    }
                },
            }
        },
        watch:{
            "tempHeadFormData.effectTime" : function (val, oldVal){
                if( val != '' ){
                    //this.canEditEffectTime =  this.isEffectTimeCanEdit(this.tempHeadFormData)

                    //冻结时间的可编辑状态校验
                    this.canFreezeTime = this.isFreezeTimeCanEdit(this.tempHeadFormData)

                    //禁用时间的可编辑状态校验
                    this.canForbiddenTime = this.isForbiddenTimeCanEdit(this.tempHeadFormData)
                }
               // this.initTempInfo()
            },
        },
        created(){
            //模板id
            this.tempCode = this.$route.query.tempCode

            this.args = {tempItem:{'tempCode':this.tempCode,'tempItemType':0,versionStatuses:[0,1]}}

            this.args2 = {tempItem:{'tempCode':this.tempCode,'tempItemType':1,versionStatuses:[0,1]}}

            this.args3 = {tempItem:{'tempCode':this.tempCode,'tempItemType':2,versionStatuses:[0,1]}}

            this.initTempInfo();

            this.selectSource['spaces'] = spaceMethods.getSpaceConfigList()
            this.getCommonOptions(30003,'places');

            //报价项类型
            let _this = this
            this.getQiTypes().then(function (res){
                //建立标配类型和报价项类型的映射 ， 便于根据报价项类型选择可用的报价项( 标配类型为： 0-标配 1-非标配 2-税费  辅助资料中报价项类型code：01 直接工程费 02 项目管理费 03税金)
                if( _this.selectSource['qiTypes'].length ){
                    let qiTypes = _this.selectSource['qiTypes']

                    //直接工程费类
                    let qiTypes0and1 = qiTypes.filter(i => { return i.code == '01' })

                    //税费类
                    let qiTypes2 = qiTypes.filter(i => { return i.code == '02' || i.code == '03' })

                    //标准和个性化没有区分报价项类型， 后期如果有区分， 需要分别映射
                    if(qiTypes0and1.length){
                        let thisQiTypes = []
                        qiTypes0and1.forEach(i => {
                            thisQiTypes.push(i.value)
                        })

                        _this.qiTypesMappging[0] = _this.qiTypesMappging[1] = thisQiTypes
                    }

                    if(qiTypes2.length){
                        let thisQiTypes1 = []
                        qiTypes2.forEach(i => {
                            thisQiTypes1.push(i.value)
                        })

                        _this.qiTypesMappging[2] = thisQiTypes1
                    }


                }
            })


            //动态获取形态为分公司的组织
            storages.getAllStore().then((res) => {
                let list = [{value:0,text:'--请选择--'}]
                if( res.data.status === 200 ){
                    res.data.result.rows.forEach((item) => {
                        list.push({
                            value: item.id,
                            text: item.name
                        })
                    })

                    this.selectSource['organizes'] = list
                    this.tempHeadFormCommonData['organizes'] = list
                }
            })

            //动态获取产品包
            productPackage.searchProductPackage().then((res) => {
                let list = []
                if( res.data.status === 200 ){
                    res.data.result.forEach((item) => {
                        list.push({
                            value: item.id,
                            text: item.pkgName
                        })
                    })

                    this.tempHeadFormCommonData['productPackages'] = this.selectSource['productPackages'] = list
                }
            })

            //请求公式
            apiCommon.queryUnionParent({

                page: 1,
                search: {
                    pPropertyCode: 11602,
                    propertyCode: 3001
                },
                size: 100
            }).then((res) => {
                if (res.data.status === 200) {
                    if(res.data.result.length > 0){
                        let formulaModuleId = res.data.result[0].id

                        //查找到公式字段
                        let formulaModuleFeild = this.mainTableColumns.filter((item) => {return item.prop=='amountEquationId'})
                        let formulaModuleFeild2 = this.mainTable2Columns.filter((item) => {return item.prop=='amountEquationId'})
                        let formulaModuleFeild3 = this.mainTable3Columns.filter((item) => {return item.prop=='amountEquationId'})

                        //公式模块id设置到搜索组件
                        if(formulaModuleFeild.length){
                            formulaModuleFeild[0].editor.args = {search:{moduleId:formulaModuleId}}
                        }
                        if(formulaModuleFeild2.length){
                            formulaModuleFeild2[0].editor.args = {search:{moduleId:formulaModuleId}}
                        }
                        if(formulaModuleFeild3.length){
                            formulaModuleFeild3[0].editor.args = {search:{moduleId:formulaModuleId}}
                        }

                        formula.selectFormulaByModuleId(formulaModuleId).then((res2) => {
                            if( res2.data.status == 200 ){
                                this.selectSource.amountEquations = formula.formatFormulaForView(res2.data.result)
                            }
                        })
                    }
                }
            })

            //动态获取辅助资料 单据类型
            apiCommon.queryUnionParent({
                page: 1,
                search: {
                    pPropertyCode: 11605, //辅助资料，供应链=》库存=》单据类型
                    propertyStatus:1,//状态：0不启用（默认值） 1启用
                },
                size: 1000
            }).then((res) => {
                if (res.data.status === 200) {
                    let list = []
                    if (res.data.result.length > 0) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.wholeCode,
                                text: item.propertyName,
                            })
                        })

                        this.tempHeadFormCommonData['orderTypes'] =list
                    }
                }else{
                    return this.$msgbox({
                        title:'',
                        type:'error',
                        message:'出错：没有查询到单据类型的辅助资料'
                    })
                }
            })

        },
        methods: {
            onTopHide(){
                this.isTopHide = !this.isTopHide
            },
            //是否为新增行
            isNewRow(tabObj, row){
                return tabObj.addedRows.indexOf(row) > -1
            },
            cancel(){
                this.closeDialog()
            },
            preview(){

                this.$message({
                    type: 'warning',
                    message: '功能开发中 o(╯□╰)o'
                })
                return
                this.$router.push({path:'quote-packtemp-preview',query:{'tempCode':this.tempCode}})
            },
            priceConfig(){

                let tableObj = this.$refs['mainTable']
                let tableObj2 = this.$refs['mainTable2']
                let tableObj3 = this.$refs['mainTable3']

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let addedRows2 = tableObj2.addedRows
                let editedRows2 = tableObj2.editedRows
                let addedRows3 = tableObj3.addedRows
                let editedRows3 = tableObj3.editedRows

                let flag = true

                if( addedRows.length > 0 || editedRows.length > 0 || addedRows2.length > 0 || editedRows2.length > 0 || addedRows3.length > 0 || editedRows3.length > 0 ) {



                    this.$confirm(
                        '当前页面的修改未暂存，点击暂存将暂存该页面所有数据后继续，点击取消将留在当前页面',
                        '提示',
                        {
                            type: 'warning',
                            confirmButtonText: '暂存',
                            cancelButtonText: '取消',
                        }
                    ).then(() => {
                        this.tempSave().then((res) => {
                            if(res){
                                this.$router.push({path:'quote-packtemp-priceconfig',query:{'tempCode':this.tempCode}})
                            }
                        })
                    }).catch(() => {
                        flag = false
                    })
                }else{
                    this.$router.push({path:'quote-packtemp-priceconfig',query:{'tempCode':this.tempCode}})
                }
            },
            //配置用量关系入口
            addGroupDosageMapping(){
                let selections = this.$refs[this.activeTableRef].getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'error',
                        message: '请选择一行！'
                    })
                    return false
                }
                let selection =  selections[0]

                if( this.isNewRow(this.$refs[this.activeTableRef], selection) ){
                    this.$message({
                        type: 'error',
                        message: '新增行保存后才能配置用量关系！'
                    })
                    return false
                }

                this.$router.push({path:'quote-packtemp-gdm',query:{'tempItemCode':selection.itemCode}})
            },
            tabClick(tab , event){


                let nowActiveTableRef = this.activeTableRef;
                let otherTabName = ''
                switch(tab.name){
                    case 'one':
                        this.activeTableRef = 'mainTable'
                        break;
                    case 'two':
                        this.activeTableRef = 'mainTable2'
                        break;
                    case 'three':
                        this.activeTableRef = 'mainTable3'
                        break;
                }

                return true; //标签页内容会一起提交， 暂时不需要后续的约束逻辑
                let tableObj = this.$refs[nowActiveTableRef]

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows

                let flag = true

                if( addedRows.length > 0 || editedRows.length > 0 ){
                    this.$confirm(
                        '当前页面的修改未暂存，点击暂存将暂存该页面后换页，点击取消将直接换页，当前页面的修改将丢失。',
                        '提示',
                        {
                            type: 'warning',
                            confirmButtonText: '暂存',
                            cancelButtonText: '取消',
                        }
                    ).then(() => {
                        //触发保存
                        //flag = this.tempSave()
                    }).catch(() => {
                        this.activeTabName = tab.name
                    })
                }

                if( flag ){

                }else{
                    this.activeTabName = tab.name
                }


            },

            //修改行
            rowEdit(){
                let tableObj = this.$refs[this.activeTableRef]

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs


                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '选择需要修改的报价项'
                    })
                    return false
                }


                //this.hotRow =   selections
                this.hotRow = Object.assign([],selections)

                //tableObj.activeRow = selections
                this.actionModel = 'edit'
//                this.editMode = 'selection'
            },

            //行提交
            rowCheck(){
                this.needEffectTime = true
                /*
                * 仅“待启用”状态可点击；
                 点击后，设置被选中的状态为“已启用”。
                 点击后，被选中项的状态不符，提示“仅可将状态为“待启用”的报价项提交。”
                * */
                let tableObj = this.$refs[this.activeTableRef]

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '选择需提交的行'
                    })
                    return false
                }
                let ids = []

                for(let i=0 ; i < selections.length; i++){
                    let item = selections[i]

                    //TODO 确认报价项行的生效时间是否允许必填 ， 如果是， 列表上也要放开编辑
                    /*if ( this.isEmpty(item.effectTime) ){

                        this.$message({
                            type: 'error',
                            message: '请填写行有效时间'
                        })
                        return false
                    }*/

                    if( !this.isRowCanSubmit(item) ){
                        this.$message({
                            type: 'error',
                            message: '仅可将状态为“待启用”的报价项提交'
                        })
                        return false
                    }
                    ids.push(item.id)
                }

                if( ids.length ){

                    tableObj.validate((isValid) => {
                        if(!isValid) {
                            return false
                        }

                        else{

                            this.disabledSymbolsBody.push('ROW-SUBMIT')
                            packtemp.checkTempItem(ids,1,this.accountId).then((res) => {
                                if( res.data.status == 200 ){
                                    this.$message({
                                        type: 'success',
                                        message: '提交成功'
                                    })
                                    this.disabledSymbolsBody.shift(this.disabledSymbolsBody.indexOf('ROW-SUBMIT'))
                                    tableObj.reloadTable()

                                }else{
                                    this.$message({
                                        type: 'error',
                                        message: res.data.result
                                    })
                                    this.disabledSymbolsBody.shift(this.disabledSymbolsBody.indexOf('ROW-SUBMIT'))
                                }
                            })
                        }
                    })


                }

            },

            //行禁用
            /**
             * 若未选择任意一项，提示“请选择需要禁用的报价项”
             点击后，提示“禁用报价项后将不可启用，请确定是否禁用。”，给“禁用”和“取消”按钮，点击“禁用”后，将选中的报价项的状态变更为已禁用；
             * @returns {boolean}
             */
            rowForbidden(){

                let that = this
                /*
                 * 仅“待启用”状态可点击；
                 点击后，设置被选中的状态为“已启用”。
                 点击后，被选中项的状态不符，提示“仅可将状态为“待启用”的报价项提交。”
                 * */
                let tableObj = this.$refs[this.activeTableRef]

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要禁用的报价项'
                    })
                    return false
                }
                let ids = []

                for(let i=0 ; i < selections.length; i++){
                    let item = selections[i]
                    if( !this.isRowCanForbidden(item) ){
                        this.$message({
                            type: 'error',
                            message: '选择的报价项不可禁用'
                        })
                        return false
                    }
                    ids.push(item.id)
                }

                if( ids.length ){
                    this.$confirm(
                        '禁用报价项后将不可启用，请确定是否禁用',
                        '提示',{
                            type: 'warning',
                            confirmButtonText: '禁用',
                            cancelButtonText: '取消'
                        }
                    ).then(() => {
                        this.disabledSymbolsBody.push('ROW-DISABLE')
                        packtemp.forbiddenTempItems(ids, that.accountId).then((res) => {
                            if( res.data.status == 200 ){
                                this.$message({
                                    type: 'success',
                                    message: '禁用成功'
                                })

                                this.disabledSymbolsBody.shift(this.disabledSymbolsBody.indexOf('ROW-DISABLE'))
                                tableObj.reloadTable()

                            }else{
                                this.$message({
                                    type: 'error',
                                    message: res.data.result
                                })
                                this.disabledSymbolsBody.shift(this.disabledSymbolsBody.indexOf('ROW-DISABLE'))
                            }
                        })

                    })

                }
            },

            //自动排序
            rowSort(){
                this.$message({
                    type: 'warning',
                    message: '功能开发中 o(╯□╰)o'
                })
            },
            //复制
            rowCopy(){
                let tablename = this.activeTableRef
                let tableObj = this.$refs[tablename]

                let selections = tableObj.getSelectRows()

                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要复制的报价项'
                    })
                    return false
                }

                if( selections.length > 1 ){
                    this.$message({
                        type: 'warning',
                        message: '仅可选择一个模板行并进行复制，请将多余模板行的选中项取消'
                    })
                    return false
                }

                if( this.isNewRow(tableObj,selections[0] ) ){
                    return this.$message({
                        type: 'warning',
                        message: '未保存的行不能复制'
                    })
                }

                let id = selections[0]['id']
                this.disabledSymbolsBody.push('ROW-COPY')
                packtemp.copyTempItem(id,this.accountId).then((res) => {
                    if( res.data.status == 200 ){
                        this.$message({
                            type: 'success',
                            message: '复制成功'
                        })
                        this.disabledSymbolsBody.shift(this.disabledSymbolsBody.indexOf('ROW-COPY'))
                        tableObj.reloadTable()

                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.result
                        })
                        this.disabledSymbolsBody.shift(this.disabledSymbolsBody.indexOf('ROW-COPY'))
                    }
                })

            },

            isRowCanSubmit: function (rowData) {
                //0-待启用
                return [0].indexOf(rowData['tempItemStatus']) > -1
            },

            isRowCanForbidden: function (rowData) {
                let tablename = this.activeTableRef
                let tableObj = this.$refs[tablename]
                return !this.isNewRow(tableObj, rowData);
            },

            //格式化时间转换为时间戳 精确到秒
            floorDateFromStr(str){
                return  this.isEmpty(str) ? str : Math.floor(new Date(str).getTime()/1000)
            },

            //TODO 优化返回结果，使异步请求结果能正常返回
            tempSave(successCallback = function () {

            }, errorCallBack = function (){}){
                this.needEffectTime = false
                //处理模板头信息
                let mainForm = this.$refs['mainForm']
                let tempData = this.tempHeadFormData

                //处理模板信息
                let table = this.$refs['mainTable']
                let table2 = this.$refs['mainTable2']
                let table3 = this.$refs['mainTable3']

                let createTempItems  = []
                let updateTempItems  = []

                mainForm.validate((isValid) => {

                    if (!isValid) {
                        return false
                    }

                    //获取空间‘全屋’的id
                    let allSpaceId = this.getAllSpaceId()
                    if( !allSpaceId ){
                        return false
                    }
                    table.validate((isValid) => {

                        if (!isValid) {
                            this.activeTabName = 'one'
                            return false
                        }
                        let tableData1 = this.formatTableData(table)


                        table2.validate((isValid2) => {
                            if(!isValid2) {
                                this.activeTabName = 'two'
                                return false
                            }

                            let tableData2 = this.formatTableData(table2, 1)
                            table3.validate((isValid3) => {
                                if(!isValid3) {
                                    this.activeTabName = 'three'
                                    return false
                                }

                                let tableData3 = this.formatTableData(table3, 2)

                                if( !tableData1 || !tableData2 || !tableData3 ){
                                    return false
                                }

                                createTempItems = [].concat(tableData1.createTempItems,tableData2.createTempItems,tableData3.createTempItems)
                                updateTempItems = [].concat(tableData1.updateTempItems,tableData2.updateTempItems,tableData3.updateTempItems)

                                let args = {
                                    id : this.tempId,
                                    tempName: tempData.tempName, //产品包模板名称
                                    effectTime: this.floorDateFromStr(tempData.effectTime), //生效时间
                                    orgId: tempData.orgId, //组织id，
                                    scheduleModuleId: tempData.scheduleModuleId, //排期模板头ID
                                    wholeCode: tempData.wholeCode, //属性全码，单据类型编码，用于报价产品包模板打印
                                    freezeTime: this.floorDateFromStr(tempData.freezeTime), //冻结时间
                                    forbiddenTime: this.floorDateFromStr(tempData.forbiddenTime), //禁用时间
                                    updateUser: this.accountId //修改人id
                                };
                                //debugger

                                this.disabledSymbolsTop.push('TEMP-SAVE')
                                packtemp.updateTemp(args, createTempItems, updateTempItems).then((res) => {


                                    if (res.data.status === 200) {

                                        this.$message({
                                            type: 'success',
                                            message: '暂存成功！'
                                        })
                                        //this.$refs[this.activeTableRef].reloadTable()
                                        table.reloadTable()
                                        table2.reloadTable()
                                        table3.reloadTable()
                                        table.resetActionLog()
                                        table2.resetActionLog()
                                        table3.resetActionLog()
                                        this.activeTabName = this.activeTabName
                                        this.disabledSymbolsTop.shift(this.disabledSymbolsTop.indexOf('TEMP-SAVE'))
                                        return true
                                        //this.closeDialog()
                                        /*this.$msgbox({
                                         title:'提示',
                                         message:'暂存成功',
                                         type:'success',
                                         callback:function (){
                                         this.$refs['maintable'].reloadTable()
                                         _this.closeDialog()
                                         }
                                         })*/
                                    } else {
                                        this.disabledSymbolsTop.shift(this.disabledSymbolsTop.indexOf('TEMP-SAVE'))
                                        this.$message({
                                            type: 'error',
                                            message: res.data.result
                                        })
                                        return false

                                    }
                                })
                            })
                        })


                    })
                })
                return true

            },

            // 标配类型 0-标配 1-非标配 2-税费类
            formatTableData(tab, tempItemType = 0){
                let addedRows = tab.addedRows
                let editedRows = tab.editedRows
                let deletedIDs = tab.deletedIDs
                let data = {'createTempItems':[],'updateTempItems':[]}

                let allSpaceId = this.getAllSpaceId()
                let flag = true
                //收集数据

                //新增加行
                addedRows.forEach((item) => {

                    if( !this.checkedTableData(item)){
                        flag = false
                    }

                    let addItems = {}

                    //个性化
                    if( tempItemType == 1 ){
                        addItems = {
                            tempCode: this.tempCode, //产品包模板ID，#取自pqm_product_pkg_temp.id
                            qiId: item.qiId, //报价项ID,#pqm_quote_item.id
                            spaceId: allSpaceId, //空间ID——辅助资料 个性化空间默认是全屋定制
                            placeId: item.placeId, //位置ID——辅助资料
                            settleType: item.settleType, //报价项参与结算类型 0-不结算 1-工长结算
                            tempItemType: tempItemType,
                            //effectTime: item.effectTime, //生效日期
                            //forbiddenTime: item.forbiddenTime, //禁用时间
                            upperLimit: item.upperLimit, //数量上限
                            lowerLimit: item.lowerLimit, //数量下限
                            amountEquationId: item.amountEquationId, //数量计算公式id--公式管理
                            createUser: this.accountId, //添加人id
                            priceDTO:{
                                itemCode: item.itemCode,
                                priceType:1,// 价格类型：增项价格/减项价格/正常价格 默认正常价格 TODO 价格类型id取辅助资料
                                price:item.price,
                                createUser:this.accountId
                            },

                        }
                    }


                    //标准品
                    else if( tempItemType == 0 ){
                        addItems = {
                            tempCode: this.tempCode, //产品包模板ID，#取自pqm_product_pkg_temp.id
                            qiId: item.qiId, //报价项ID,#pqm_quote_item.id
                            spaceId: item.spaceId, //空间ID——辅助资料
                            placeId: item.placeId, //位置ID——辅助资料
                            settleType: 0, //报价项参与结算类型 0-不结算 1-工长结算
                            tempItemType: tempItemType,
                            //effectTime: item.effectTime, //生效日期
                            //forbiddenTime: item.forbiddenTime, //禁用时间
                            upperLimit: item.upperLimit, //数量上限
                            lowerLimit: item.lowerLimit, //数量下限
                            amountEquationId: item.amountEquationId, //数量计算公式id--公式管理
                            createUser: this.accountId, //添加人id
                        }
                    }

                    //税费类
                    else if( tempItemType == 2 ){
                        addItems = {
                            tempCode: this.tempCode, //产品包模板ID，#取自pqm_product_pkg_temp.id
                            qiId: item.qiId, //报价项ID,#pqm_quote_item.id
                            spaceId: 0, //空间ID——辅助资料
                            placeId: 0, //位置ID——辅助资料
                            settleType: 0, //报价项参与结算类型 0-不结算 1-工长结算
                            tempItemType: tempItemType,
                            //effectTime: item.effectTime, //生效日期
                            //forbiddenTime: item.forbiddenTime, //禁用时间
                            upperLimit: item.upperLimit, //数量上限
                            lowerLimit: item.lowerLimit, //数量下限
                            amountEquationId: item.amountEquationId, //数量计算公式id--公式管理
                            createUser: this.accountId, //添加人id
                            priceDTO:{
                                itemCode: item.itemCode,
                                priceType:1,// 价格类型：增项价格/减项价格/正常价格 默认正常价格 TODO 价格类型id取辅助资料
                                price:item.price,
                                createUser:this.accountId
                            },
                        }
                    }

                    data.createTempItems.push(addItems)
                })

                //修改行
                editedRows.forEach((item) => {

                    if( !this.checkedTableData(item)){
                        flag = false
                    }

                    let editItems = {}

                    //个性化
                    if( tempItemType == 1 ){
                        editItems = {
                            id:item.id,
                            itemCode:item.itemCode,
                            qiId: item.qiId, //报价项ID,#pqm_quote_item.id
                            spaceId: allSpaceId, //空间ID——辅助资料 个性化空间默认是全屋定制
                            placeId: item.placeId, //位置ID——辅助资料
                            settleType: item.settleType, //报价项参与结算类型 0-不结算 1-工长结算
                            tempItemType: tempItemType,
                            //effectTime: item.effectTime, //生效日期
                            //forbiddenTime: item.forbiddenTime, //禁用时间
                            upperLimit: item.upperLimit, //数量上限
                            lowerLimit: item.lowerLimit, //数量下限
                            amountEquationId: item.amountEquationId, //数量计算公式id--公式管理
                            updateUser: this.accountId, //添加人id
                            priceDTO:{
                                itemCode: item.itemCode,
                                priceType:1,// 价格类型：增项价格/减项价格/正常价格 默认正常价格 TODO 价格类型id取辅助资料
                                price:item.price,
                                updateUser:this.accountId
                            },

                        }
                    }

                    //标准品
                    else if( tempItemType == 0 ){
                        editItems = {
                            id:item.id,
                            itemCode:item.itemCode,
                            qiId: item.qiId, //报价项ID,#pqm_quote_item.id
                            spaceId: item.spaceId, //空间ID——辅助资料
                            placeId: item.placeId, //位置ID——辅助资料
                            settleType: 0, //报价项参与结算类型 0-不结算 1-工长结算
                            tempItemType: tempItemType,
                            //effectTime: item.effectTime, //生效日期
                            //forbiddenTime: item.forbiddenTime, //禁用时间
                            upperLimit: item.upperLimit, //数量上限
                            lowerLimit: item.lowerLimit, //数量下限
                            amountEquationId: item.amountEquationId, //数量计算公式id--公式管理
                            updateUser: this.accountId //添加人id
                        }
                    }

                    //税费类
                    if( tempItemType == 2 ){
                        editItems = {
                            id:item.id,
                            itemCode:item.itemCode,
                            qiId: item.qiId, //报价项ID,#pqm_quote_item.id
                            spaceId: 0, //空间ID——辅助资料
                            placeId: 0, //位置ID——辅助资料
                            settleType: 0, //报价项参与结算类型 0-不结算 1-工长结算
                            tempItemType: tempItemType,
                            //effectTime: item.effectTime, //生效日期
                            //forbiddenTime: item.forbiddenTime, //禁用时间
                            upperLimit: item.upperLimit, //数量上限
                            lowerLimit: item.lowerLimit, //数量下限
                            amountEquationId: item.amountEquationId, //数量计算公式id--公式管理
                            updateUser: this.accountId, //添加人id
                            priceDTO:{
                                itemCode: item.itemCode,
                                priceType:1,// 价格类型：增项价格/减项价格/正常价格 默认正常价格 TODO 价格类型id取辅助资料
                                price:item.price,
                                updateUser:this.accountId
                            },

                        }
                    }


                    data.updateTempItems.push(editItems)
                })

                if( !flag ){
                    return false
                }

                return data
            },


            //校验表格数据
            checkedTableData(rowData){
                let lowerLimit = parseFloat(rowData['lowerLimit'])
                let upperLimit = parseFloat(rowData['upperLimit'])
                if( lowerLimit > 9999 || upperLimit > 9999){
                    this.$message({
                        type: 'error',
                        message: '数量不可超过9999'
                    })
                    return false
                }

                if( !this.isEmpty(lowerLimit) && !this.isEmpty(upperLimit) ){
                    if( lowerLimit >  upperLimit){
                        this.$message({
                            type: 'error',
                            message: '数量下限不能大于数量上限'
                        })
                        return false
                    }
                }

                return true
            },

            addRow(){
                this.addRowDialogVisible = true

                let qiTypes = []
                switch (this.activeTableRef){
                    case 'mainTable':
                        qiTypes = this.qiTypesMappging[0]
                        break
                    case 'mainTable2':
                        qiTypes = this.qiTypesMappging[1]
                        break
                    case 'mainTable3':
                        qiTypes = this.qiTypesMappging[2]
                        break
                }
                this.qiTypes = qiTypes

            },

            cellClick: function (row, column, cell, event) {

                //编辑行之前必须手动触发编辑状态
                if( !this.isNewRow(this.$refs[this.activeTableRef], row) ){
                    //up 非审核中、已启用的行才能编辑 2017-9-14 16:46:42
                    if( this.hotRow.indexOf(row) > -1 && ( this.actionModel == 'edit') && [1,2].indexOf(row.tempItemStatus) == -1 ){
                        if( column.property === 'qiCodeVO' || column.property === 'qiIdVO' ){
                            this.currentRow = row
                            this.currentQuoteCode = row.qiCodeVO
                            this.addRow()
                        }
                    }else{
                        this.$refs[this.activeTableRef].handleFormItemBlur()
                    }
                }else{
                    if( column.property === 'qiCodeVO' || column.property === 'qiIdVO' ){
                        this.currentRow = row
                        this.currentQuoteCode = row.qiCodeVO
                        this.addRow()
                    }
                }

                /*if( column.property == 'effectTimeVO' && !this.isCanEditEffectTime(row) ){
                 this.$refs['t8ttable'].handleFormItemBlur()
                 }*/
            },

            closeSelectQuoteItemDialog(){
                this.addRowDialogVisible = false
            },

            initParams: function (){

            },
            initTempInfo(){
                let _this = this
                packtemp.getTempInfoByCode(this.tempCode).then((res) => {
                    let _topToolbar = this.$refs['toolbartop']
                    if( res.data.status == 200 ){
                        _this.disabledSymbolsTop.shift(_this.disabledSymbolsTop.indexOf('TEMP-SAVE'))
                        if(res.data.result.rows[0]){
                            this.tempHeadFormData = Object.assign({},res.data.result.rows[0])

                            this.tempHeadFormData.effectTime = this.tempHeadFormData.effectTime || ''
                            this.tempHeadFormData.freezeTime = this.tempHeadFormData.freezeTime || ''
                            this.tempHeadFormData.forbiddenTime = this.tempHeadFormData.forbiddenTime || ''

                            this.tempId = this.tempHeadFormData.id


                            let formulaInfo = packtemp.queryModuleAndModuleItemById(this.tempHeadFormData.scheduleModuleId).then((res) => {
                                if( res.data.status == 200 ){
                                    let formulaInfo = res.data.result

                                    this.tempHeadFormData.scheduleModuleName = formulaInfo.name

                                    mainForm.fields[this.formIndexOfFields(mainForm,'scheduleModuleId')].defaultValue = {
                                        textValue:this.tempHeadFormData['scheduleModuleName'],
                                        filedValue: this.tempHeadFormData['scheduleModuleId'],
                                    }
                                }
                            })

                            this.canEditOrg = [0,3].indexOf(this.tempHeadFormData.tempStatus) > -1
                            let mainForm = this.$refs['mainForm'];
                            //组织的可编辑状态设置
                            mainForm.fields[this.formIndexOfFields(mainForm,'orgId')].disabled = !this.canEditOrg

                            /*
                             //生效时间的可编辑状态校验
                             mainForm.fields[this.formIndexOfFields(mainForm,'effectTime')].disabled =  !this.isEffectTimeCanEdit(this.tempHeadFormData)

                             //冻结时间的可编辑状态校验
                             mainForm.fields[this.formIndexOfFields(mainForm,'freezeTime')].disabled = !this.isFreezeTimeCanEdit(this.tempHeadFormData)

                             //禁用时间的可编辑状态校验
                             mainForm.fields[this.formIndexOfFields(mainForm,'forbiddenTime')].disabled = !this.isForbiddenTimeCanEdit(this.tempHeadFormData)*/
                            //生效时间的可编辑状态校验
                            this.canEditEffectTime =  this.isEffectTimeCanEdit(this.tempHeadFormData)

                            //冻结时间的可编辑状态校验
                            this.canFreezeTime = this.isFreezeTimeCanEdit(this.tempHeadFormData)

                            //禁用时间的可编辑状态校验
                            this.canForbiddenTime = this.isForbiddenTimeCanEdit(this.tempHeadFormData)

                        }
                    }
                })
            },

            /**
             * 生效时间的可编辑状态校验
             已填写内容复写，可修改；
             允许填写条件：
             若未填写，且当前时间早于已填写的冻结时间和禁用时间，则允许填写；-->未填写生效时间且未冻结未禁用，允许修改
             若已被填写，且生效日期晚于当前时间，且当前时间早于已填写的冻结时间和禁用时间，则允许修改；-->未生效且未冻结未禁用，允许修改
             若已被填写，且生效日期早于等于当前时间，且模板状态为“待启用”，则允许修改；
             若已被填写，且生效日期早于等于当前时间，且模板状态！！不为！！“待启用”，则！！不允许！！修改；  -->已生效且待启用， 允许修改, 反之则不允许修改
             */
            isEffectTimeCanEdit(data){
                let effectTime = data['effectTime'] //生效时间
                let freezeTime = data['freezeTime'] //冻结时间
                let forbiddenTime = data['forbiddenTime'] //禁用时间
                let now = new Date(DateUtils(new Date().getTime(), 'yyyy-mm-dd HH:MM')).getTime() //当前时间

                let hasFreezed = ( !this.isEmpty(freezeTime) ) && ( now >= new Date(freezeTime).getTime() ) //已冻结
                let hasForbiddened = ( !this.isEmpty(forbiddenTime) ) && ( now >= new Date(forbiddenTime).getTime() ) //已禁用
                let hasEffected = ( !this.isEmpty(effectTime) ) && ( now >= new Date(effectTime).getTime() ) //已生效

                //未冻结且未禁用且未启用
                return (!hasFreezed) && (!hasForbiddened) && ( data['tempStatus'] == 0 || !hasEffected )

            },

            /**
             * 冻结时间的可编辑状态校验
             * 已填写内容复写，可修改；
             允许填写条件：
             若未填写，且当前时间早于已填写的禁用时间，则允许填写；-->未填写且未禁用，则允许填写
             若已被填写，且当前时间早于冻结时间，且当前时间早于已填写的禁用时间，则允许修改；-->未冻结且未禁用，则允许修改
             若已被填写，且冻结时间早于等于当前时间，则！！不允许！！修改 -->已冻结, 则不允许修改
             */
            isFreezeTimeCanEdit(data){
                let effectTime = data['effectTime']
                let freezeTime = data['freezeTime']
                let forbiddenTime = data['forbiddenTime']
                let now = new Date(DateUtils(new Date().getTime(), 'yyyy-mm-dd HH:MM')).getTime()

                let hasFreezed = ( !this.isEmpty(freezeTime) ) && ( now >= new Date(freezeTime).getTime() ) //已冻结
                let hasForbiddened = ( !this.isEmpty(forbiddenTime) ) && ( now >= new Date(forbiddenTime).getTime() ) //已禁用
                let hasEffected = ( !this.isEmpty(effectTime) ) && ( now >= new Date(effectTime).getTime() ) //已生效

                //必须已启用
                if( data['tempStatus'] != 2 ){
                    return false
                }

                //未冻结且未禁用
                return (!hasFreezed) && (!hasForbiddened)
            },

            /**
             * 禁用时间的可编辑状态校验
             * 已填写内容复写，可修改；
             * 允许填写条件：
             若未填写，则允许填写；--> 未填写，则允许填写
             若已被填写，且当前时间早于禁用时间，则允许修改；--> 未禁用,则允许修改
             若已被填写，且禁用时间早于等于当前时间，则！！不允许！！修改 -->已禁用,则不允许修改
             */
            isForbiddenTimeCanEdit(data){
                let effectTime = data['effectTime']
                let freezeTime = data['freezeTime']
                let forbiddenTime = data['forbiddenTime']
                let now = new Date(DateUtils(new Date().getTime(), 'yyyy-mm-dd HH:MM')).getTime()

                let hasFreezed = ( !this.isEmpty(freezeTime) ) && ( now >= new Date(freezeTime).getTime() ) //已冻结
                let hasForbiddened = ( !this.isEmpty(forbiddenTime) ) && ( now >= new Date(forbiddenTime).getTime() ) //已禁用
                let hasEffected = ( !this.isEmpty(effectTime) ) && ( now >= new Date(effectTime).getTime() ) //已生效

                //必须已启用
                if( data['tempStatus'] != 2 ){
                    return false
                }

                //未禁用
                return !hasForbiddened
            },

            isEmpty(str){
                return str == null || str == 0 || str == '' || str == undefined || str == '0'
            },
            isNull(str){
                return str == null || str == '' || str == undefined
            },
            formIndexOfFields(formObj, propName){
                if( formObj.fields  ){
                    for (let i in formObj.fields){
                        if( formObj.fields[i].prop == propName ){
                            return i
                        }
                    }
                }
                return -1
            },

            closeDialog(){
                //this.$router.go(0)
                this.closeSelectQuoteItemDialog()
                this.dialogVisible = false
                //this.$router.push('/tuchat-worker/quote-packtemp-index')
                this.$router.push({path:'/tuchat-worker/quote-packtemp-index'})
            },
            submitSearch(objForm) {

                //多个table同时搜索

                let obj = Object.assign({},objForm)
                let argsObj = Object.assign({},this.args)
                argsObj.tempItem = Object.assign(this.args.tempItem,obj)
                this.args = argsObj;


                let obj2 = Object.assign({},objForm)
                let argsObj2 = Object.assign({},this.args2)
                argsObj2.tempItem = Object.assign(this.args2.tempItem,obj2)
                this.args2 = argsObj2

                let obj3 = Object.assign({},objForm)
                let argsObj3 = Object.assign({},this.args3)
                argsObj3.tempItem = Object.assign(this.args3.tempItem,obj3)
                this.args3 = argsObj3
            },

            //获取辅助资料
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                apiCommon.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName,
                                        code: item.propertyCode
                                    })
                                }
                            })
                            this.selectSource[selectName] = list
                            return true
                        }else{
                            return false
                        }
                    })
            },

            //获取辅助资料 Promise版本
            getCommonOptionsPromise: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                let _this = this
                return new Promise(function (resolve, reject){
                    apiCommon.queryUnionParent(arg)
                        .then((res) => {
                            if (res.data.status === 200) {
                                res.data.result.forEach((item) => {
                                    if (item.propertyStatus===1) {
                                        list.push({
                                            value: item.id,
                                            text: item.propertyName,
                                            code: item.propertyCode
                                        })
                                    }
                                })
                                _this.selectSource[selectName] = list
                                resolve()
                            }else{
                                reject()
                            }
                        })
                })

            },

            getQiTypes: function () {
                let _this = this
                return new Promise(function (resolve, reject) {

                    _this.getCommonOptionsPromise(30005,'qiTypes').then(function() {
                        resolve()
                    }).catch(function (){
                        reject()
                    })
                });
            },

            //设置table的可编辑行列表
            editable: function (v,r,c,t){
                return this.hotRow.indexOf(r) > -1 || this.isNewRow(t, r)
            },
            dataLoaded(data){
                data.map(item => {
                    if(!item.hasOwnProperty('price')){
                        this.$set(item,'price',0)
                    }
                    if(!item.hasOwnProperty('currentPrice')){
                        this.$set(item,'currentPrice',0)
                    }
                })

                return data
            },

            //全屋空间的id
            getAllSpaceId(){
                let spaceId = 0
                let allSpaces = this.selectSource['spaces'].filter(i => {
                    return i.text == '全屋'
                })

                if( allSpaces.length ){
                    spaceId = allSpaces[0].value
                }

                return spaceId
            }

        }
    }
</script>
<style lang="css" scoped>
    .g-main-container-column{
        /*min-height: 300px;*/
    }
</style>
<style>
    .packtempview .t8t-form-panel{
        margin:0 auto;
    }
    .packtempview .t8t-form-panel .el-form .el-col{
        min-height: 50px;
    }



    .packtempview {
        width: 1200px;
        margin: 30px auto 5px;
        /*overflow: hidden;*/
    }


    .el-table__body-wrapper{
        /*display: flex;*/
    }

    .toolbar-white .full-dialog-toolbar-container{
        height: 38px;
        background-color: white !important;
    }
    .toolbar-white .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: white !important;
    }
    .toolbar-white .toolbar-container .el-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: white !important;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .toolbar-white .toolbar-container .el-button:hover{
        color: #1e3046;
        background-color: white !important;
    }

    /*定值风格*/
    .toolbar-white{
        background-color: white !important;
    }

    .t8t-full-dialog2 .toolbar-container .el-button {
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog2 .toolbar-container .el-button:hover {
        color: #1e3046;
        background-color: #d2deeb;
    }
</style>
