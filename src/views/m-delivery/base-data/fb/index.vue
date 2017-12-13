<template>
    <div v-loading.fullscreen.lock="fullscreenLoading">
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="false"
            :toolbarDisabledSymbols="disabledSymbols"
            :showTree="true"
            :treeData="treeData"
            :treeProps="treeProps"
            :tableColumns="tableColumns"
            :tableService="tableService"
            :tableMethod="tableMethod"
            :tableArgs="tableArgs"
            :tableCommonData="tableCommonData"
            :tableRadioCol="false"
            :tableEditable="true"
            @table-row-click="tableRowClick"
            @table-cell-click="tableCellClick"
            @table-row-dobule-click="view"
            @table-selection-change="selectionChange"
            @list-addrow="addRow"
            @list-delrow="delRow"
            @list-save="save"
            @list-void="invalid"
            @list-import="importData"
            @list-export="exportData"
            @list-logdetail="logDetail"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
            @tree-node-click="onTreeClick"
        >
        </t8t-list-view>
        <el-dialog title="批量导入发包单价数据" v-model="importDialogVisible" @close="closeUploadDialog">
            <div :style="{padding:'0 30px'}">
                <div :style="{marginBottom:'15px'}"><el-button size="small" type="primary" @click="downloadTemplate">下载模板</el-button> <span>请先下载模板</span></div>
                <el-upload
                    ref="upload"
                    :data="uploadParams"
                    :action="importURL"
                    :on-preview="handlePreview"
                    :file-list="fileList"
                    :on-change="handleChange"
                    :on-success="importDeal"
                    :before-upload="beforeUpload"
                    accept=".xlsx,.xls"
                    :multiple="false"
                    :auto-upload="false"
                >
                    <el-button size="small" type="primary"><i class="el-icon-upload2"></i> 上传文件</el-button>
                    <span>请选择Excel文件,.xls、.xlsx格式</span>
                </el-upload>
            </div>
            <div slot="footer">
                <el-button @click="submitUpload" type="primary" :loading="importLoading">确定</el-button>
                <el-button @click="closeUploadDialog">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="日志详情" v-model="logDialogVisible" size="large">
            <t8t-table
                :style="{height:'350px'}"
                :columns="logColumns"
                :pageBar="true"
                :editable="false"
                :selectCol="false"
                :service="logService"
                :method="logMethod"
                :args="logArgs"
                @close="logDialogVisible=false"
            >
            </t8t-table>
        </el-dialog>
    </div>
</template>

<script>
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    import exportUtils from 'src/utils/export.js'
    import Utils from 'src/utils/Utils.js'
    import TemplateBase from 'src/services/delivery/template-base.js'
    export default {
        data(){
            let validateContractUnitPrice = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error('发包单价不能为空！'));
                }
                if(false === /^\d+$|(^\d+\.\d{1,2}$)/.test(value) || !(value > 0 && value <= 2000)){
                    return callback(new Error('发包单价必须是大于0且小于等于2000的数字，且最多只能两位小数'));
                }
                callback();
            }
            let validateArea = (rule,value,callback)=>{
                //console.log(this.$refs['list-view'].$refs['list-table'].$refs['form']);
                let fieldName = '';
                if(rule.field == 'minArea'){
                    fieldName = '面积下限';
                }else if(rule.field == 'maxArea'){
                    fieldName = '面积上限';
                }
                if(!value){
                    return callback(new Error(fieldName + '不能为空！'));
                }
                if(false === /^\d+$|(^\d+\.\d{1,2}$)/.test(value) || !(value > 0 && value <= 5000)){
                    return callback(new Error(fieldName + '必须是大于0且小于等于5000的数字，且最多只能两位小数'));
                }
                callback();
            }
            let that = this;
            return {
                breadcrumbData: [{title: '交付'}, {title: '交付基础数据'}, {title: '发包单价'}],
                searchFields: [
                    {
                        type: 'popup',
                        label: '产品包模板',
                        name: 'productPkgTempId',
                        textValue: 'tempName',
                        triggerOnFocus:false,
                        filedValue: 'id',
                        remote: true,
                        service: Service.PRSPQM.name,
                        method: Service.PRSPQM.methods.productPkgTempBaseQueryPage,
                        remoteArgs:{ page: 1, size: 20},
                        remoteQueryKey:"tempName_like",
                        dialog: {
                            title: '产品包',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '产品包模板名称', name: 'tempName_like'},
                                ]
                            },
                            table:{
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
                            }
                        }
                    },
                    {type: 'select', label: '状态', name: 'configStatus', selectSourceKey: 'status'},
                    {type: 'date', label: '生效日期自', name: 'effectTime_gt'},
                    {type: 'date', label: '生效日期至', name: 'effectTime_lt'}
                ],
                searchOptions:{
                    status:[
                        {
                            value: 0,
                            text: '启用'
                        },
                        {
                            value: 1,
                            text: '作废'
                        }
                    ],
                    productPkgs:[]
                },
                disabledSymbols:['DELROW','SAVE'],
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                tableColumns: [
                    {
                        prop: 'productPkgTempName',
                        label: '产品包模板',
                        required: true,
                        onChange(val,row,column){
                            row.productPkgTempId = val.id;
                            row.productPkgTempName = val.tempName;
                            row.productPkgId = val.pkgId;
                            row.organizationId = val.orgId;
                        },
                        onClick(val,row,column,table){ // 重置表格参数
                            table.columns[0].editor.args = { search: { tempStatus: 2 } };
                        },
                        editor:{
                            type: 'lookup',
                            service: Service.PRSPQM.name,
                            method: Service.PRSPQM.methods.productPkgTempBaseQueryPage,
                            args:{ search: { tempStatus: 2 } },
                            columns: [
                            {
                                prop: 'id',
                                label: 'ID',
                            },
                            {
                                prop: 'tempName',
                                label: '产品包模板名称'
                            }
                            ],
                            placeholder: '搜索产品包模板名称',
                            searchExpr: ['tempName'],
                            rules:[
                                {
                                    required: true,
                                    message: '不能为空'
                                }
                            ]
                        }
                    },
                    {
                        prop: 'minArea',
                        label: '面积下限',
                        required: true,
                        editor:{
                            type: 'input',
                            rules:[
                                {
                                    validator: validateArea
                                }
                            ],
                        },
                        /*onChange(val,row,column,table){
                            if(row.maxArea && Number(val) >= Number(row.maxArea)){
                                that.$message.error('面积下限只能小于面积上限');
                                //row.minArea = null;
                            }
                        }*/
                    },
                    {
                        prop: 'maxArea',
                        label: '面积上限',
                        required: true,
                        editor:{
                            type: 'input',
                            rules:[
                                {
                                    validator: validateArea
                                }
                            ]
                        },
                        /*onChange(val,row,column,table){
                            if(row.minArea && Number(val) <= Number(row.minArea)){
                                that.$message.error('面积上限只能大于面积下限');
                                //row.maxArea = null;
                            }
                        }*/
                    },
                    {prop: 'contractUnitPrice', label: '发包单价',required: true, editor:{
                        type: 'input',
                        rules:[
                            {
                                validator: validateContractUnitPrice
                            }
                        ]
                    }},
                    {prop: 'effectTime', label: '生效日期',formatter: this.dateParser,required: true, editor:{
                        type: 'date',
                        endFormater: 'timestamp',
                        rules:[
                            {
                                required: true,
                                message: '不能为空'
                            }
                        ]
                    }},
                    {prop: 'configStatus', label: '状态', list:'configStatus',readonly: true},
                    {prop: 'createUserName', label: '创建人',readonly: true},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser',readonly: true},
                    {prop: 'updateUserName', label: '作废人',readonly: true},
                    {prop: 'updateTime', label: '作废时间', formatter: 'dateParser',readonly: true}
                ],
                tableService: Service.TEMPLATE.name,
                tableMethod: Service.TEMPLATE.methods.contractUnitPriceQueryPage,
                tableArgs:{ sort: ['id_desc'] },
                tableCommonData:{
                    configStatus:[
                        {
                            text: '启用',
                            value: 0
                        },
                        {
                            text: '作废',
                            value: 1
                        }
                    ],
                    productPkgs:[]
                },
                logColumns:[
                    { "prop": "remark", "label": "修改内容" },
                    { "prop": "opTime", "label": "修改时间", "formatter": 'dateParser'},
                    { "prop": "username", "label": "修改人" },
                ],
                logService: Service.TEMPLATE.name,
                logMethod: Service.TEMPLATE.methods.unitPriceQueryOplog,
                logArgs:{},
                selectedRows:[],
                selIds:[],
                importDialogVisible: false,
                logDialogVisible: false,
                fullscreenLoading: false,
                uploadParams:{
                    otherArgs:JSON.stringify({createUser:+Cookie.get('t8t-tc-uid')}),
                    columns:"productPkgTempCode,minArea,maxArea,contractUnitPrice,effectTimeImport"
                },
                importURL: Utils.getImportURL(Service.TEMPLATE.name, Service.TEMPLATE.methods.unitPriceImport),
                importLoading: false
            }
        },
        created(){
            this.productPkgTempBaseQuery();
            //组织树
            TemplateBase.queryTreeByType({typeCodes: ['001003010']}).then((res) => {
                if (res.data.status === 200) {

                    this.treeData = [res.data.result];
                }
            })
        },
        methods:{
            onSearchSubmit(obj){
                this.$refs['list-view'].getTableInstance().resetActionLog();
                this.initDisabledSymbols();
                this.tableArgs = { search: obj };
            },
            dateParser(text) {
                let dateString;
                if (!text) {
                    dateString = ""
                } else {
                    let objDate = new Date(text * 1000);
                    dateString = DateUtils(objDate, 'yyyy-mm-dd')
                }
                return dateString
            },
            addRow(){
                this.$refs['list-view'].$refs['list-table'].addNewRow();
                this.$refs['list-view'].getToolbarInstance().unDisableBySymbol('SAVE');
            },
            delRow(){
                let flag = true;
                this.selectedRows.forEach((item,index) => {
                    if(item.id > 0){
                        flag = false;
                        this.$message.error('不能删除已保存的行！');
                    }
                });
                flag && this.$refs['list-view'].$refs['list-table'].delRows();
                let rows =  this.$refs['list-view'].getTableInstance().getActionLog(false,true);
                if(rows.addedRows.length === 0){
                    this.$refs['list-view'].getToolbarInstance().disableBySymbol('SAVE');
                }
            },
            save(){
                this.$refs['list-view'].$refs['list-table'].validate((isValid) => {
                    if(isValid){
                        let rows =  this.$refs['list-view'].$refs['list-table'].getActionLog(false,true);
                        let createList = [];
                        let createUser = +Cookie.get('t8t-tc-uid');
                        rows.addedRows.forEach(function(item,index){
                            createList.push({
                                productPkgTempId: +item.productPkgTempId,
                                contractUnitPrice:item.contractUnitPrice,
                                maxArea:item.maxArea,
                                minArea:item.minArea,
                                effectTime: +item.effectTime,
                                createUser:createUser
                            })
                        });
                        if(createList.length > 0){
                            this.fullscreenLoading = true;
                            Model.unitPriceSave({unitPrice: createList}).then((res) => {
                                this.fullscreenLoading = false;
                                if (res.data.status === 200) {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '保存成功！',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    });
                                    //重置行记录状态
                                    this.reloadTable();
                                }else if([40701,40702,40703].indexOf(res.data.status) > -1){
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
                                        message: res.data.message ? res.data.message : '保存失败！',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    });
                                }
                            })
                        }else{
                            this.$message({
                                type: 'error',
                                message: '请先新增一行！'
                            });
                        }
                    }
                });
            },
            invalid(){
                if(this.selIds.length == 0){
                    this.$message.error('请选择需要操作的行！');
                    return false;
                }
                this.$confirm('确定要作废所选发包单价配置？请谨慎操作，作废后的配置将无法再启用。','提示',{
                    type: 'warning'
                }).then(() =>{
                    Model.unitPriceSetExpire({ids:this.selIds,operateUser:+Cookie.get('t8t-tc-uid')}).then((res) => {
                        if(res.data.status === 200){
                            this.reloadTable();
                            this.$message.success('作废成功！');
                        }else{
                            this.$message.error(res.data.message? res.data.message :'作废失败！');
                        }
                    }
                ).catch()
                })
            },
            importData(){
                this.importDialogVisible = true;
            },
            exportData(){
                this.fullscreenLoading = true;
                let args = {
                        "page": 1,
                        "size": 10000
                    };
                let formData = this.$refs['list-view'].getSearchInstance().getFormData();
                if(JSON.stringify(formData) !== '{}'){
                    args.search = formData;
                }
                exportUtils({
                    service: Service.TEMPLATE.name,
                    method: Service.TEMPLATE.methods.unitPriceExport,
                    args: args,
                    headers: "序号,产品包模板,面积下限（不包含）,面积上限（包含）,发包单价,生效日期,状态,创建人,创建时间,最后更新人,更新时间",
                    sorts: "id,productPkgTempName,minArea,maxArea,contractUnitPrice,effectTimeExport,configStatusExport,createUserName,createTimeExport,updateUserName,updateTimeExport",
                    title: "发包单价数据"
                })
                setTimeout(()=>{
                    this.fullscreenLoading = false;
                },1000);
            },
            logDetail(){
                if(this.selIds.length == 0){
                    this.$message.error('请选择需要查看的行！');
                    return false;
                }else if(this.selIds.length > 1){
                    this.$message.error('不能选择多行查看！');
                    return false;
                }else if(this.selIds.length === 1){
                    this.logArgs = {unitPriceId: this.selIds[0]}
                }
                this.logDialogVisible = true;
            },
            selectionChange(rows,selIds){
                //已选择行
                this.selectedRows = rows;
                this.selIds = selIds;
                //按钮禁用/启用
                let invalidStatus = false;
                let showLogStatus = false;
                let delStatus = false;
                if(rows.length > 0){
                    for(let i in rows){
                        if(rows[i].configStatus != 0){
                            invalidStatus = true;
                        }
                        if(!rows[i].id){
                            showLogStatus = true;
                        }else{
                            delStatus = true;
                        }
                    }
                }else{
                    delStatus = true;
                }
                if(invalidStatus){
                    this.$refs['list-view'].disableBySymbol('VOID');
                }else{
                    this.$refs['list-view'].unDisableBySymbol('VOID');
                }
                if(showLogStatus){
                    this.$refs['list-view'].disableBySymbol('LOGDETAIL');
                }else{
                    this.$refs['list-view'].unDisableBySymbol('LOGDETAIL');
                }
                if(delStatus){
                    this.$refs['list-view'].disableBySymbol('DELROW');
                }else{
                    this.$refs['list-view'].unDisableBySymbol('DELROW');
                }
            },
            tableCellClick(row, column, cell, event){
                if(typeof row.id !== 'undefined' && row.id > 0){
                    this.$refs['list-view'].getTableInstance().handleFormItemBlur()
                }
            },
            reloadTable() {
                this.$refs['list-view'].getTableInstance().resetActionLog();
                this.$refs['list-view'].getTableInstance().reloadTable()
                this.initDisabledSymbols();
            },
            productPkgTempBaseQuery(){
                Model.productPkgTempBaseQuery({}).then((res) => {
                    if (res.data.status === 200) {
                        let list = [];
                        res.data.result.forEach((item,index)=>{
                            list.push({
                                text: item.tempName,
                                value: item.id
                            })
                        });
                        this.tableCommonData.productPkgs = list;
                        this.searchOptions.productPkgs = list;
                    }
                })
            },
            downloadTemplate(){
                this.fullscreenLoading = true;
                exportUtils({
                    service: Service.TEMPLATE.name,
                    method: Service.TEMPLATE.methods.unitPriceExport,
                    args: {
                        "page": 1,
                        "size": 10000,
                        "search":{
                            "id":-1
                        }
                    },
                    headers: "产品包模板,面积下限（不包含）,面积上限（包含）,发包单价,生效日期",
                    sorts: "productPkgTempCode,minArea,maxArea,contractUnitPrice,effectTime",
                    title: "发包单价导入模板"
                });
                exportUtils({
                    service: Service.PRSPQM.name,
                    method: Service.PRSPQM.methods.productPkgTempBaseQueryPage,
                    args: {
                        "search": {
                            "tempStatus": 2
                        },
                        "page": 1,
                        "size": 10000
                    },
                    headers: "产品包模板编码,产品包模板名称",
                    sorts: "tempCode,tempName",
                    title: "产品包模板数据"
                });
                setTimeout(()=>{
                    this.fullscreenLoading = false;
                },1000)
            },
            beforeUpload(file){

            },
            handleChange(file,fileList){
                let len = fileList.length;
                if(len > 1){
                    this.$refs.upload.uploadFiles = fileList.slice(len-1, len);
                }
            },
            importDeal(response, file, fileList) {
                this.importLoading = false
                if(!response.status) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: "上传文件失败！",
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.$refs['upload'].clearFiles();
                    return false
                }
                if(response.status == 200) {
                    this.$msgbox({
                        title: '消息',
                        type: 'success',
                        message: '导入成功！',
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.$refs['upload'].clearFiles();
                    this.reloadTable();
                    this.importDialogVisible = false;
                }else if([40701,40702,40703].indexOf(response.status) > -1){
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: response.result,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.$refs['upload'].clearFiles();
                    return false
                }else{
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: response.message,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.$refs['upload'].clearFiles();
                    return false;
                }
            },
            submitUpload() {
                if(this.$refs.upload.uploadFiles.length === 0){
                    this.$message.error('请先上传文件！');
                    return;
                }
                this.importLoading = true;
                this.$refs.upload.submit();
            },
            initDisabledSymbols(){
                this.$refs['list-view'].disableBySymbol('DELROW');
                this.$refs['list-view'].disableBySymbol('SAVE');
            },
            //组织树的click事件
            onTreeClick (nodeData){
                this.$refs['list-view'].getTableInstance().resetActionLog();
                this.initDisabledSymbols();
                this.tableArgs = {page: 1, size: 20, search: {organizationId: nodeData.id}}
            },
            closeUploadDialog(){
                this.importDialogVisible=false
                this.$refs.upload.clearFiles();
            }
        }
    }
</script>
