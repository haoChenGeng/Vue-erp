<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog v-loading.fullscreen.lock="fullscreenLoading" @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 yanshou-detail-dialog dialog-new">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            v-if="type != 'view'"
                            @SAVE="save"
                            class="t8t-dark"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <div class="full-dialog-form-container">
                        <t8t-form-panel
                            ref="form-panel"
                            :dataSource="detailInfo"
                            :commonData="commonData"
                            :fields="fields"
                        ></t8t-form-panel>
                        <!-- <base-panel
                            :dataSource="detailInfo"
                            :fields="fields"
                            :options="options"
                            ref="t8t-base-panel"
                        ></base-panel> -->
                    </div>
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="tab_detail" @tab-click="handleTabClick">
                            <el-tab-pane :disabled="levelData['42403-01']['disabled']" :label="levelData['42403-01']['propertyName']" name="tab_42403-01">
                                <div :style="{padding:'20px 0'}">
                                    <el-button
                                        v-if="type != 'view'"
                                        type="primary"
                                        size="small"
                                        icon="plus"
                                        @click="addRow('42403-01')"
                                    >新增行</el-button>
                                    <el-button
                                        v-if="type != 'view'"
                                        type="danger"
                                        size="small"
                                        icon="close"
                                        @click="delRow('42403-01')"
                                    >删除行</el-button>
                                </div>
                                <t8t-table
                                    ref="table_42403-01"
                                    :columns="columnsList['base']"
                                    :service="service"
                                    :method="method"
                                    :args="args"
                                    :commonData="commonData"
                                    :editable="type != 'view' ? true : false"
                                    @cell-click="handleCellClick('42403-01',arguments[0],arguments[1],arguments[2],arguments[3])"
                                    @data-loaded="dataLoaded(arguments[0],'42403-01')"
                                >
                                </t8t-table>
                            </el-tab-pane>
                            <el-tab-pane :disabled="levelData['31003-02']['disabled']" :label="levelData['31003-02']['propertyName']" name="tab_31003-02">
                                <div :style="{padding:'20px 0'}">
                                    <el-button
                                        v-if="type != 'view'"
                                        type="primary"
                                        size="small"
                                        icon="plus"
                                        @click="addRow('31003-02')"
                                    >新增行</el-button>
                                    <el-button
                                        v-if="type != 'view'"
                                        type="danger"
                                        size="small"
                                        icon="close"
                                        @click="delRow('31003-02')"
                                    >删除行</el-button>
                                </div>
                                <t8t-table
                                    ref="table_31003-02"
                                    :columns="columnsList['other']"
                                    :service="contractService"
                                    :method="contractMethod"
                                    :args="zcArgs"
                                    :commonData="commonData"
                                    :templateData="templateData"
                                    :editable="type != 'view' ? true : false"
                                    @data-loaded="dataLoaded(arguments[0],'31003-02')"
                                    @cell-click="handleCellClick('31003-02',arguments[0],arguments[1],arguments[2],arguments[3])"
                                >
                                </t8t-table>
                            </el-tab-pane>
                            <el-tab-pane :disabled="levelData['31003-01']['disabled']" :label="levelData['31003-01']['propertyName']" name="tab_31003-01">
                                <div :style="{padding:'20px 0'}">
                                    <el-button
                                        v-if="type != 'view'"
                                        type="primary"
                                        size="small"
                                        icon="plus"
                                        @click="addRow('31003-01')"
                                    >新增行</el-button>
                                    <el-button
                                        v-if="type != 'view'"
                                        type="danger"
                                        size="small"
                                        icon="close"
                                        @click="delRow('31003-01')"
                                    >删除行</el-button>
                                </div>
                                <t8t-table
                                    ref="table_31003-01"
                                    :columns="columnsList['other']"
                                    :service="contractService"
                                    :method="contractMethod"
                                    :args="fcArgs"
                                    :commonData="commonData"
                                    :templateData="templateData"
                                    :editable="type != 'view' ? true : false"
                                    @data-loaded="dataLoaded(arguments[0],'31003-01')"
                                    @cell-click="handleCellClick('31003-01',arguments[0],arguments[1],arguments[2],arguments[3])"
                                >
                                </t8t-table>
                            </el-tab-pane>
                            <el-tab-pane :disabled="levelData['31003-03']['disabled']" :label="levelData['31003-03']['propertyName']" name="tab_31003-03">
                                <div :style="{padding:'20px 0'}">
                                    <el-button
                                        v-if="type != 'view'"
                                        type="primary"
                                        size="small"
                                        icon="plus"
                                        @click="addRow('31003-03')"
                                    >新增行</el-button>
                                    <el-button
                                        v-if="type != 'view'"
                                        type="danger"
                                        size="small"
                                        icon="close"
                                        @click="delRow('31003-03')"
                                    >删除行</el-button>
                                </div>
                                <t8t-table
                                    ref="table_31003-03"
                                    :columns="columnsList['other']"
                                    :service="contractService"
                                    :method="contractMethod"
                                    :args="gfArgs"
                                    :commonData="commonData"
                                    :templateData="templateData"
                                    :editable="type != 'view' ? true : false"
                                    @data-loaded="dataLoaded(arguments[0],'31003-03')"
                                    @cell-click="handleCellClick('31003-03',arguments[0],arguments[1],arguments[2],arguments[3])"
                                >
                                </t8t-table>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import axios from  'src/utils/axios.js'
    import Cookie from 'js-cookie'
    export default {
        components: {
            BasePanel
        },
        data(){
            let that = this;
            return {
                fullscreenLoading: false,
                isDialogShow: true,
                detailInfo:{
                    productTempId:null,
                    productPkgTempName: '',
                    effectTime: '',
                    contractObjectId: null
                },
                tab_detail:'tab_42403-01',
                columns:[],
                columnsList:{
                    'base':[
                        {
                            prop: "packageProject",
                            label: "发包项目",
                            list: 'packageProject',
                            required: true,
                            editor:{
                                type: 'select',
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空'
                                    }
                                ]
                            },
                            onChange(val,row,column,table){
                                let tmp = val.split('-');
                                if(tmp[1] == '01'){ //选择基础发报价，提点比例重置
                                    row.pointRate = null;
                                }else{
                                }
                            }
                        },
                        {
                            prop: "pointRate",
                            label: "提点比例",
                            editor: {
                                type: 'input',
                                rules: [
                                ]
                            },
                            onClick(val,row,column,table){
                                let packageProject = row.packageProject;
                                if(packageProject){
                                    let tmp = packageProject.split('-');
                                    if(tmp[1] == '01'){ //选择基础发报价，提点比例不能操作
                                        table.handleFormItemBlur();
                                    }
                                }else{
                                    table.handleFormItemBlur();
                                }
                            }
                        },
                        {
                            prop: 'accountsFormulaExpression',
                            label: '核算公式',
                            required: true,
                            onChange(val,row,column,table){
                                table.$nextTick(()=>{
                                    if(val){
                                        row.accountsFormula = val.id;
                                        row.accountsFormulaExpression = val.expression;
                                    }else{
                                        row.accountsFormula = null;
                                        row.accountsFormulaExpression = '';
                                    }
                                })
                            },
                            editor:{
                                type: 'lookup',
                                service: Service.ENTRY.name,
                                method: Service.ENTRY.methods.accountsConfigQueryFormula,
                                args:{},
                                columns: [
                                {
                                    prop: 'id',
                                    label: 'ID',
                                },
                                {
                                    prop: 'formulaName',
                                    label: '核算公式名称'
                                },
                                {
                                    prop: 'expression',
                                    label: '核算公式表达式'
                                }
                                ],
                                placeholder: '搜索核算公式名称',
                                searchExpr: ['formulaName'],
                                rules:[
                                    {
                                        required: true,
                                        message: '不能为空'
                                    }
                                ]
                            }
                        }
                    ],
                    'other':[
                        { "prop": "id", "label": "序号" },
                        {
                            prop: 'level1',
                            label: '一级',
                            show:false
                        },
                        {
                            prop: 'level1Name',
                            label: '一级',
                        },
                        {
                            prop: 'level2',
                            label: '二级',
                            editor: {
                                type: 'select',
                                clearable: true,
                                list: '_list',
                                loading: false
                            },
                            formatter: this.getCellVal2,
                            onChange(value, row, column){
                                row.level3 = null;
                            }
                        },
                        {
                            prop: 'level3',
                            label: '三级',
                            editor: {
                                type: 'select',
                                list: '_list',
                                loading: false
                            },
                            formatter: this.getCellVal3
                        },
                        {
                            "prop": "isAccounts",
                            "label": "是否核算",
                            "list": "isAccounts",
                            "required": true,
                            "editor":{
                                type: 'select',
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空'
                                    }
                                ]
                            }
                        },
                        {
                            prop: 'accountsFormulaExpression',
                            label: '核算公式',
                            onChange(val,row,column,table){
                                table.$nextTick(()=>{
                                    if(val){
                                        row.accountsFormula = val.id;
                                        row.accountsFormulaExpression = val.expression;
                                    }else{
                                        row.accountsFormula = null;
                                        row.accountsFormulaExpression = '';
                                    }
                                })
                            },
                            editor:{
                                type: 'lookup',
                                service: Service.ENTRY.name,
                                method: Service.ENTRY.methods.accountsConfigQueryFormula,
                                args:{},
                                columns: [
                                {
                                    prop: 'id',
                                    label: 'ID',
                                },
                                {
                                    prop: 'formulaName',
                                    label: '核算公式名称'
                                },
                                {
                                    prop: 'expression',
                                    label: '核算公式表达式'
                                }
                                ],
                                placeholder: '搜索核算公式名称',
                                searchExpr: ['formulaName'],
                                rules:[]
                            }
                        }
                    ]
                },
                templateData: {
                    id: null,
                    accountsItemDetailList:[],
                    isAccounts: null,
                    accountsFormula: null,
                    tabCode : '',
                    level1: null,
                    level1Name: ''
                },
                service: Service.ENTRY.name,
                method:  Service.ENTRY.methods.accountsContractDetailQueryPage,
                args: { search: {accountsConfigId:  this.$route.query.id ? this.$route.query.id : 0} },
                contractService: Service.ENTRY.name,
                contractMethod:Service.ENTRY.methods.accountsItemDetailQueryPage,
                zcArgs:{ search: {accountsConfigId:  this.$route.query.id ? this.$route.query.id : 0, accountsType: 0} },
                fcArgs:{ search: {accountsConfigId:  this.$route.query.id ? this.$route.query.id : 0, accountsType: 0} },
                gfArgs:{ search: {accountsConfigId:  this.$route.query.id ? this.$route.query.id : 0, accountsType: 0} },
                selectLoading: false,
                productTemps:[],
                commonData:{
                    contract:[],
                    isAccounts:[
                        {
                            text: '是',
                            value: 1
                        },
                        {
                            text: '否',
                            value: 0
                        }
                    ],
                    packageProject:[],
                    _list: []
                },
                fields: [
                    {
                        type: 'popup',
                        label: '产品包模板',
                        prop: 'productTempId',
                        textValue: 'tempName',
                        triggerOnFocus:false,
                        defaultValue: [],
                        filedValue: 'id',
                        disabled: this.$route.query.type == 'view' || this.$route.query.type == 'edit' ? true : false,
                        onIconClick: this.$route.query.type == 'view' ? function(){} : false,
                        dialog: {
                            title: '产品包模板',
                            size: 'large',
                            searchForm: {
                                ref: 'accounts-search',
                                labelWidth: '120px',
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '产品包模板名称', name: 'tempName_like'},
                                ]
                            },
                            table:{
                                ref: 'accounts-table',
                                service: Service.PRSPQM.name,
                                method: Service.PRSPQM.methods.productPkgTempBaseQueryPage,
                                args:{ search: { tempStatus: 2 } },
                                radioCol:true,
                                columns:[
                                {
                                    prop: 'id',
                                    label: 'ID',
                                },
                                {
                                    prop: 'tempName',
                                    label: '产品包模板名称'
                                }
                                ]
                            },
                            onBeforeConfirm(row){
                                if(!(row[0] instanceof Array)){
                                    return true;
                                }else{
                                    this.$message.error('请选择产品包模板！');
                                    return false;
                                }
                            },
                            onConfirm(row){
                                if(!(row[0] instanceof Array)){
                                    let tempId = row[0].id;
                                }
                            }
                        },
                        rules: [
                            {type: 'number',required: true , message: "请选择产品包模板",trigger: 'change'},
                        ]
                    },
                    {
                        type: 'date',
                        label: '生效日期',
                        prop: 'effectTime',
                        disabled: this.$route.query.type == 'view' || this.$route.query.type == 'edit' ? true : false,
                        rules: [
                            {type:'date',required: true , message: "请选择生效日期",trigger: 'change'},
                        ]
                    },
                    {
                        type: 'select',
                        label: '发包对象类型',
                        prop: 'contractObjectId',
                        list: 'contract',
                        disabled: this.$route.query.type == 'view' || this.$route.query.type == 'edit' ? true : false,
                        rules: [
                            {type: 'number',required: true , message: "请选择发包对象",trigger: 'change'},
                        ]
                    }
                ],
                levelData:{
                    '42403-01': {
                        list: []
                    },
                    '31003-01': {
                        list: []
                    },
                    '31003-02': {
                        list: []
                    },
                    '31003-03': {
                        list: []
                    },
                },
                type: 'view'
            }
        },
        created(){
            this.type = this.$route.query.type;
            this.getBaseInfo();
            var p = new Promise((resolve, reject) => {
                this.getAccountsType();
                resolve();
            }).then((value)=>{
                this.columns = this.columnsList['base'];
            })
            this.commonData.contract = Model.getCommonOptions({pPropertyCode: 42401});
        },
        watch: {
            "detailInfo.productTempId":{
                handler:function(val,oldVal){
                    if(this.type == 'add' && val && val != oldVal){
                        if(typeof this.$refs['table_42403-01'] !== 'undefined'){
                            this.$refs['table_42403-01'].resetActionLog();
                            this.$refs['table_42403-01'].reloadTable();
                        }
                        if(typeof this.$refs['table_31003-01'] !== 'undefined'){
                            this.$refs['table_31003-01'].resetActionLog();
                            this.$refs['table_31003-01'].reloadTable();
                        }
                        if(typeof this.$refs['table_31003-02'] !== 'undefined'){
                            this.$refs['table_31003-02'].resetActionLog();
                            this.$refs['table_31003-02'].reloadTable();
                        }
                        if(typeof this.$refs['table_31003-03'] !== 'undefined'){
                            this.$refs['table_31003-03'].resetActionLog();
                            this.$refs['table_31003-03'].reloadTable();
                        }
                    }
                    this.getPackageProject(val);
                }
            }
        },
        methods: {
            closeDialog(){
                this.$router.push({
                    path: '/delivery/base-setting/accounts-index'
                })
            },
            getBaseInfo(){
                let id = this.$route.query.id;
                if(id > 0){
                    Model.accountsConfigFindById({id: id}).then((res)=>{
                        if(res.data.status === 200){
                            this.detailInfo.productTempId = res.data.result.productPkgTempId;
                            this.detailInfo.productPkgTempName = res.data.result.productPkgTempName;
                            this.detailInfo.effectTime = new Date(res.data.result.effectTime * 1000);
                            this.detailInfo.contractObjectId = res.data.result.contractObjectId;
                            this.fields[0].defaultValue.push({
                                fieldValue: this.detailInfo.productTempId,
                                textValue: this.detailInfo.productPkgTempName,
                            })
                        }
                    })
                }
            },
            getCellVal2(val,row,col,table){
                if(this.levelData[row.tabCode]){
                    let list = this.levelData[row.tabCode].list;
                    if(list && list.length > 0){
                        let item = list.filter((item) => item.value == val);
                        if(item.length > 0){
                            return item[0].text;
                        }
                    }else{
                        let list = row.itemLevelDetails;
                        if(list && list.length > 0){
                            let item = list.filter((item) => item.itemLevel == 2);
                            if(item.length > 0){
                                return item[0].accountsItemName;
                            }
                        }
                    }
                }
            },
            getCellVal3(val,row){
                if(this.levelData[row.tabCode]){
                    let level2 = row.level2;
                    if(level2){
                        let list = this.levelData[row.tabCode][level2];
                        if(list && list.length > 0){
                            let item = list.filter((item) => item.value == val);
                            if(item.length > 0){
                                return item[0].text;
                            }
                        }else{
                            list = row.itemLevelDetails;
                            if(list && list.length > 0){
                                let item = list.filter((item) => item.itemLevel == 3);
                                if(item.length > 0){
                                    return item[0].accountsItemName;
                                }
                            }
                        }
                    }
                }
            },
            dataLoaded(data,tabCode){

                data.forEach((item,index)=>{
                    if(tabCode != '42403-01'){
                        let tempObj = {};
                        item.itemLevelDetails.forEach((item1)=>{
                            tempObj[item1.itemLevel] = item1;
                        });
                        data[index].level1 = +this.levelData[tabCode].id;
                        data[index].level1Name = this.levelData[tabCode].propertyName;
                        this.$set(data[index],'level2',(tempObj['2'] ? +tempObj['2']['accountsItem'] : null));
                        this.$set(data[index],'level3',(tempObj['3'] ? +tempObj['3']['accountsItem'] : null));
                        //data[index].level2 = tempObj['2'] ? +tempObj['2']['accountsItem'] : null;
                        //data[index].level3 = tempObj['3'] ? +tempObj['3']['accountsItem'] : null;
                        data[index].tabCode = tabCode;
                    }else{
                        data[index].packageProject = item.packageProject+ '-' + (item.source && item.source !== '0' ? item.source : '');
                    }
                })
            },
            handleCellClick(tabCode,row, column, cell, event){
                if(tabCode == '42403-01' && column.property == 'packageProject' && !this.detailInfo.productTempId){
                    this.$message.error('请先选择产品包模板！');
                    this.$refs['table_42403-01'].handleFormItemBlur();
                }else if(tabCode == '31003-02' || tabCode == '31003-01' || tabCode == '31003-03'){ //主材、辅材
                    if(column.property == 'level2' && !this.detailInfo.productTempId){
                        this.$message.error('请先选择产品包模板！');
                        this.$refs['table_' + tabCode].handleFormItemBlur();
                        return false;
                    }
                    if(column.property == 'level2'){
                        if(this.levelData[tabCode].list.length === 0){
                            column.editor.loading = true;
                            Model.accountsConfigQueryDosage({
                                optType: 1,
                                search: {
                                    "pkgTempId": this.detailInfo.productTempId,                      //产品包模板id
                                    "gdType": row.level1
                                }
                            }).then((res)=>{
                                column.editor.loading = false;
                                let list = [];
                                if(res.data.status === 200){
                                    res.data.result.forEach((item)=>{
                                        list.push({
                                            value: item.categoryId,
                                            text: item.categoryName
                                        })
                                    });
                                }
                                this.commonData._list = list;
                                this.levelData[tabCode].list = list;
                            }).catch((error)=>{
                                column.editor.loading = false;
                            })
                        }else{
                            this.commonData._list = this.levelData[tabCode].list;
                        }

                    }else if(column.property == 'level3'){
                        let key = row.level2;
                        if(!key){
                            this.$message.error('请先选择二级！');
                            this.$refs['table_' + tabCode].handleFormItemBlur();
                            return false;
                        }
                        if(typeof this.levelData[tabCode][key] === 'undefined'){
                            column.editor.loading = true;
                            Model.accountsConfigQueryDosage({
                                optType: tabCode == '31003-03' ? 3 : 2,
                                search: {
                                    "pkgTempId": this.detailInfo.productTempId,                      //产品包模板id
                                    "gdType": row.level1,
                                    "categoryId": row.level2
                                }
                            }).then((res)=>{
                                column.editor.loading = false;
                                let list = [];
                                if(res.data.status === 200){
                                    res.data.result.forEach((item)=>{
                                        list.push({
                                            value: item.goodsId,
                                            text: item.goodName
                                        })
                                    });
                                }
                                this.commonData._list = list;
                                this.levelData[tabCode][key] = list;
                            }).catch((error)=>{
                                column.editor.loading = false;
                            })
                        }else{
                            this.commonData._list = this.levelData[tabCode][key];
                        }
                    }
                }/*else if(tabCode == '31003-03'){
                    if(column.property == 'level2'){
                        if(this.levelData[tabCode].list.length === 0){
                            this.commonData._list = Model.getCommonOptions({pPropertyCode: 41001});
                            this.levelData[tabCode].list = this.commonData._list;
                        }else{
                            this.commonData._list = this.levelData[tabCode].list;
                        }
                    }else if(column.property == 'level3'){
                        let workType = row.level2;
                        if(!workType){
                            this.$message.error('请先选择二级！');
                            this.$refs['table_' + tabCode].handleFormItemBlur();
                            return false;
                        }
                        if(typeof this.levelData[tabCode][workType] === 'undefined'){
                            Model.expenseQuotaQueryPage({
                                page:1,
                                size:200,
                                search:{
                                    workType: workType
                                }
                            }).then((res)=>{
                                let list = [];
                                if(res.data.status === 200){
                                    res.data.result.rows.forEach((item)=>{
                                        list.push({
                                            value: item.id,
                                            text: item.itemName
                                        })
                                    })
                                }
                                this.commonData._list = list;
                                this.levelData[tabCode][workType] = list;
                            })
                        }else {
                            this.commonData._list = this.levelData[tabCode][workType];
                        }
                    }
                }*/
            },
            getAccountsType(){ //获取核算类别
                this.fullscreenLoading = true;
                axios({
                    service: Service.PROPERTY.name,
                    method: Service.PROPERTY.methods.propertyQueryBatchByCodeAndPcode,
                    args:{
                        codes: [
                            {
                                pcode: '31003',
                                code: '01'
                            },
                            {
                                pcode: '31003',
                                code: '02'
                            },
                            {
                                pcode: '31003',
                                code: '03'
                            },
                            {
                                pcode: '42403',
                                code: '01'
                            },
                        ]
                    }
                }).then((res)=>{
                    this.fullscreenLoading = false;
                    if(res.data.status === 200){
                        res.data.result.forEach((item)=>{
                            // if(item.propertyStatus == 1){
                                let tabCode = item.pPropertyCode + '-' + item.propertyCode;
                                this.levelData[tabCode].id = item.id;
                                this.$set(this.levelData[tabCode],'disabled', item.propertyStatus == 1 ? false : true);
                                this.$set(this.levelData[tabCode],'propertyName', item.propertyName);
                            // }
                        })
                    }
                })
            },
            getPackageProject(tempItemId){
                if(!tempItemId){
                    return [];
                }
                axios({
                    service: Service.ENTRY.name,
                    method: Service.ENTRY.methods.accountsConfigGetQuotaItem,
                    args:{page: 1, size:200, tempItemId: tempItemId}
                }).then((res)=>{
                    if(res.data.status === 200){
                        let list = [];
                        res.data.result.forEach((item)=>{
                            let idStr = item.tempItemId + '-';
                            if(item.source){
                                idStr = idStr + item.source;
                            }
                            list.push({
                                text: item.qiName,
                                value: idStr
                            })
                        })
                        this.commonData.packageProject = list;
                    }
                })
            },
            save(){
                this.$refs['form-panel'].validate((res)=>{
                    if(res){
                        let accountsConfig = {
                            productPkgTempId: +this.detailInfo.productTempId,
                            effectTime: +Date.parse(this.detailInfo.effectTime).toString().substr(0,10),
                            contractObjectId: +this.detailInfo.contractObjectId
                        }
                        let username = Cookie.get('t8t-tc-username') ? Cookie.get('t8t-tc-username') : '';
                        if(this.type == 'add'){
                            accountsConfig.createName =  username;
                            accountsConfig.createBy = username;
                        }else if(this.type == 'edit'){
                            accountsConfig.id = this.$route.query.id;
                            accountsConfig.updateName = username;
                            accountsConfig.updateBy = username;
                        }

                        let p = this.checkOther();
                        p.then(()=>{
                            //发包项
                            let accountsContractDetailList = [];
                            let accountsContractDetailDeleteIds = [];

                            let rows1 =  this.$refs['table_42403-01'].getActionLog(false,true);
                            let optRows1 = this.type == 'add' ? rows1.addedRows : rows1.editedRows.concat(rows1.addedRows);
                            accountsContractDetailDeleteIds = rows1.deletedIDs;
                            optRows1.forEach((item)=>{
                                let tmp = item.packageProject ? item.packageProject.split('-') : [];
                                accountsContractDetailList.push({
                                    id: item.id ? item.id : 0,
                                    accountsType: this.levelData['42403-01'].id,     //核算类别
                                    source: tmp[1] ? tmp[1] : 0,             //发包项目来源,0-报价项 其他值-辅助资料配置
                                    packageProject: tmp[0],     //发包项目
                                    pointRate: +item.pointRate ? +item.pointRate : 0,          //提点比例
                                    accountsFormula: item.accountsFormula ? +item.accountsFormula : 0    //核算公式id
                                })
                            })

                            //核算项列表
                            let accountsItemDetailList = [];
                            let accountsItemDetailDeleteIds = [];

                            let rows2 =  this.$refs['table_31003-02'].getActionLog(false,true);
                            let optRows2 = this.type == 'add' ? rows2.addedRows : rows2.editedRows.concat(rows2.addedRows);
                            accountsItemDetailDeleteIds = accountsItemDetailDeleteIds.concat(rows2.deletedIDs);

                            optRows2.forEach((item)=>{
                                let itemLevels = [item.level1];
                                item.level2 && itemLevels.push(item.level2);
                                item.level3 && itemLevels.push(item.level3);
                                accountsItemDetailList.push({
                                    id: item.id ? item.id : 0,
                                    "accountsType": this.levelData['31003-02'].id,           //核算类别
                                    "isAccounts": +item.isAccounts,             //是否核算
                                    "accountsFormula": +item.accountsFormula,       //核算公式id
                                    "itemLevels": itemLevels            //核算项值列表
                                })
                            })

                            let rows3 =  this.$refs['table_31003-01'].getActionLog(false,true);
                            let optRows3 = this.type == 'add' ? rows3.addedRows : rows3.editedRows.concat(rows3.addedRows);
                            accountsItemDetailDeleteIds = accountsItemDetailDeleteIds.concat(rows3.deletedIDs);
                            optRows3.forEach((item)=>{
                                let itemLevels = [item.level1];
                                item.level2 && itemLevels.push(item.level2);
                                item.level3 && itemLevels.push(item.level3);
                                accountsItemDetailList.push({
                                    id: item.id ? item.id : 0,
                                    "accountsType": this.levelData['31003-01'].id,           //核算类别
                                    "isAccounts": +item.isAccounts,             //是否核算
                                    "accountsFormula": +item.accountsFormula,       //核算公式id
                                    "itemLevels": itemLevels            //核算项值列表
                                });
                            });

                            let rows4 =  this.$refs['table_31003-03'].getActionLog(false,true);
                            let optRows4 = this.type == 'add' ? rows4.addedRows : rows4.editedRows.concat(rows4.addedRows);
                            accountsItemDetailDeleteIds = accountsItemDetailDeleteIds.concat(rows4.deletedIDs);
                            optRows4.forEach((item)=>{
                                let itemLevels = [item.level1];
                                item.level2 && itemLevels.push(item.level2);
                                item.level3 && itemLevels.push(item.level3);
                                accountsItemDetailList.push({
                                    id: item.id ? item.id : 0,
                                    "accountsType": this.levelData['31003-03'].id,           //核算类别
                                    "isAccounts": +item.isAccounts,             //是否核算
                                    "accountsFormula": +item.accountsFormula,       //核算公式id
                                    "itemLevels": itemLevels            //核算项值列表
                                })
                            })
                            accountsConfig.accountsContractDetailList = accountsContractDetailList;
                            accountsConfig.accountsItemDetailList = accountsItemDetailList;
                            let result = null;
                            if(this.type == 'add'){
                                this.fullscreenLoading = true;
                                result = Model.accountsConfigCreate({
                                    accountsConfig: accountsConfig
                                })
                            }else if(this.type == 'edit'){
                                this.fullscreenLoading = true;
                                accountsConfig.accountsContractDetailDeleteIds = accountsContractDetailDeleteIds;
                                accountsConfig.accountsItemDetailDeleteIds = accountsItemDetailDeleteIds;
                                result = Model.accountsConfigUpdate({
                                    accountsConfig: accountsConfig
                                })
                            }else{
                                this.$message.error('操作错误！');
                                return;
                            }
                            result.then((res)=>{
                                this.fullscreenLoading = false;
                                if(res.data.status === 200){
                                    this.$refs['table_42403-01'].resetActionLog();
                                    this.$refs['table_31003-01'].resetActionLog();
                                    this.$refs['table_31003-02'].resetActionLog();
                                    this.$refs['table_31003-03'].resetActionLog();
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '保存成功！',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain',
                                        callback: ()=>{
                                            this.$router.push({
                                                path: '/delivery/base-setting/accounts-index'
                                            })
                                        }
                                    });
                                }else if([40059,40060,40052,40061,40051].indexOf(res.data.status) > -1){
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: res.data.result,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    });
                                }else{
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: res.data.message,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    });
                                }
                            }).catch((error)=>{
                                this.fullscreenLoading = false;
                            })
                        }).catch((error)=>{
                            if(typeof error == 'string'){
                                this.$message.error(error);
                            }
                        })
                    }
                })
            },
            checkOther(){
                let promise1 = new Promise((resolve, reject) => {
                    this.$refs['table_42403-01'].validate((isValid)=>{
                        if(isValid){
                                let rows1 =  this.$refs['table_42403-01'].getActionLog(false,true);
                                let optRows1 = this.type == 'add' ? rows1.addedRows : rows1.editedRows.concat(rows1.addedRows);
                                optRows1.forEach((item)=>{
                                    let tmp = item.packageProject ? item.packageProject.split('-') : [];
                                    if(tmp[1] != '01' && !item.pointRate){
                                        reject('发包项部分提点比例必填！');
                                    }else if(tmp[1] != '01' && (false === /^\d+$|(^\d+\.\d{1,2}$)/.test(item.pointRate) || !(item.pointRate > 0 && item.pointRate < 100))){
                                        reject('提点比例必须在0-100之间,且最多只能两位小数！');
                                    }
                            });
                            resolve()
                        }else{
                            this.tab_detail = 'tab_42403-01';
                            setTimeout(()=>{
                                this.$refs['table_42403-01'].doLayout();
                            },100);
                            reject();
                        }
                    })
                });
                let promise2 = new Promise((resolve, reject) => {
                    this.$refs['table_31003-02'].validate((isValid)=>{
                        if(isValid){
                            let rows2 =  this.$refs['table_31003-02'].getActionLog(false,true);
                            let optRows2 = this.type == 'add' ? rows2.addedRows : rows2.editedRows.concat(rows2.addedRows);
                            optRows2.forEach((item)=>{
                                if(item.isAccounts == 1 && !item.accountsFormula && !item.level2 && !item.level3){
                                    reject('主材部分核算公式必填！');
                                }else if(item.level2 && item.level3 && item.isAccounts == null){
                                     reject('主材部分是否核算必填！');
                                }
                            });
                            resolve()
                        }else{
                            this.tab_detail = 'tab_31003-02';
                            setTimeout(()=>{
                                this.$refs['table_31003-02'].doLayout();
                            },100);
                            reject();
                        }
                    });
                });
                let promise3 = new Promise((resolve, reject) => {
                    this.$refs['table_31003-01'].validate((isValid)=>{
                        if(isValid){
                            let rows3 =  this.$refs['table_31003-01'].getActionLog(false,true);
                            let optRows3 = this.type == 'add' ? rows3.addedRows : rows3.editedRows.concat(rows3.addedRows);
                            optRows3.forEach((item)=>{
                                if(item.isAccounts == 1 && !item.accountsFormula){
                                    reject('辅材部分核算公式必填！');
                                }
                            });
                            resolve()
                        }else{
                            this.tab_detail = 'tab_31003-01';
                            setTimeout(()=>{
                                this.$refs['table_31003-01'].doLayout();
                            },100);
                            reject();
                        }
                    });
                });
                let promise4 = new Promise((resolve, reject) => {
                    this.$refs['table_31003-03'].validate((isValid)=>{
                        if(isValid){
                            let rows4 =  this.$refs['table_31003-03'].getActionLog(false,true);
                            let optRows4 = this.type == 'add' ? rows4.addedRows : rows4.editedRows.concat(rows4.addedRows);
                            optRows4.forEach((item)=>{
                                if(item.isAccounts == 1 && !item.accountsFormula && !item.level2 && !item.level3){
                                    reject('工费部分核算公式必填！');
                                }else if(item.level2 && item.level3 && item.isAccounts == null){
                                    reject('工费部分是否核算必填！');
                                }
                            });
                            resolve()
                        }else{
                            this.tab_detail = 'tab_31003-03';
                            setTimeout(()=>{
                                this.$refs['table_31003-03'].doLayout();
                            },100);
                            reject();
                        }
                    })
                });
                return Promise.all([promise4, promise3, promise2, promise1]);
            },
            handleTabClick(tab,e){
                let tabCode = tab.name.substr(4);
                this.$nextTick(()=>{
                    this.$refs['table_' + tabCode].doLayout();
                })
                if(this.type == 'add'){
                    return;
                }
                if(tabCode == '31003-02'){
                    if(this.zcArgs.search.accountsType == 0){
                        this.zcArgs = { search: {accountsConfigId:  this.$route.query.id ? this.$route.query.id : 0, accountsType: this.levelData['31003-02'].id} };
                    }
                }else if(tabCode == '31003-01'){
                    if(this.fcArgs.search.accountsType == 0){
                        this.fcArgs = { search: {accountsConfigId:  this.$route.query.id ? this.$route.query.id : 0, accountsType: this.levelData['31003-01'].id} };
                    }
                }else if(tabCode == '31003-03'){
                    if(this.gfArgs.search.accountsType == 0){
                        this.gfArgs = { search: {accountsConfigId:  this.$route.query.id ? this.$route.query.id : 0, accountsType: this.levelData['31003-03'].id} };
                    }
                }
            },
            addRow(tabCode){
                this.templateData.tabCode = tabCode;
                this.templateData.level1 = this.levelData[tabCode].id;
                this.templateData.level1Name = this.levelData[tabCode].propertyName;
                let addRowFlag = true;
                let rows = this.$refs['table_' + tabCode].getActionLog(false,true);
                rows.addedRows.forEach((item)=>{
                    if(!item.level2 && !item.level3 && tabCode != '42403-01'){
                        addRowFlag = false;
                    }
                })
                if(addRowFlag){
                    this.$refs['table_' + tabCode].addNewRow();
                }else{
                    this.$message.error('只能存在一行核算项为一级的数据！');
                }
            },
            delRow(tabCode){
                this.$refs['table_' + tabCode].delRows();
            }
        }
    }
</script>
