<template>
    <div v-loading.fullscreen.lock="fullscreenLoading">
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="tableCommonData"
            :showSearchToggleBtn="true"
            :toolbarDisabledSymbols="disabledSymbols"
            :showTree="true"
            :treeData="treeData"
            :treeProps="treeProps"
            :tableColumns="tableColumns"
            :tableService="tableService"
            :tableMethod="tableMethod"
            :tableArgs="tableArgs"
            :tableCommonData="tableCommonData"
            :tableTemplateData="tableTemplateData"
            :tableRadioCol="false"
            :tableEditable="true"
            @table-row-click="tableRowClick"
            @table-cell-click="tableCellClick"
            @table-row-dobule-click="view"
            @table-selection-change="selectionChange"
            @list-addrow="addRow"
            @list-delrow="delRow"
            @list-void="invalid"
            @list-save="save"
            @list-import="importData"
            @list-export="exportData"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
            @tree-node-click="onTreeClick"
        >
        </t8t-list-view>
        <el-dialog title="批量导入工费项定额数据" v-model="importDialogVisible" @close="closeUploadDialog">
            <div :style="{padding:'0 30px'}">
                <div :style="{marginBottom:'15px'}"><el-button size="small" type="primary" @click="downloadTemplate">下载模板</el-button> <span>请先下载模板</span></div>
                <el-upload
                    ref="upload"
                    :data="uploadParams"
                    :action="importURL"
                    :on-preview="handlePreview"
                    :on-change="handleChange"
                    :file-list="fileList"
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
    </div>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/delivery/Service.js'
    import Model from 'src/services/delivery/model.js'
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    import exportUtils from 'src/utils/export.js'
    import Utils from 'src/utils/Utils.js'
    import TemplateBase from 'src/services/delivery/template-base.js'
    export default {
        data(){
            let validateUnitQuota = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error('不能为空！'));
                }
                if(false === /^\d+$|(^\d+\.\d{1,2}$)/.test(value) || !(value > 0 && value < 10000)){
                    return callback(new Error('单位定额必须是大于0且小于10000的数字，且最多只能两位小数'));
                }
                callback();
            }
            return {
                breadcrumbData: [{title: '交付'}, {title: '交付基础数据'}, {title: '工费项定额'}],
                searchFields: [
                    {
                        type: 'popup',
                        label: '产品包',
                        name: 'productPkgId',
                        textValue: 'pkgName',
                        filedValue: 'id',
                        triggerOnFocus:false,
                        remote: true,
                        service: Service.PRSPQM.name,
                        method: Service.PRSPQM.methods.productPackageQueryPage,
                        remoteArgs:{ page: 1, size: 20},
                        remoteQueryKey:"pkgName_like",
                        dialog: {
                            title: '产品包',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '产品包名称', name: 'pkgName_like'},
                                ]
                            },
                            table:{
                                service: Service.PRSPQM.name,
                                method: Service.PRSPQM.methods.productPackageQueryPage,
                                args:{},
                                radioCol:true,
                                columns:[
                                {
                                    prop: 'id',
                                    label: 'ID',
                                },
                                {
                                    prop: 'pkgName',
                                    label: '产品包名称'
                                }
                                ]
                            }
                        }
                    },
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
                            title: '产品包模板',
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
                    {type: 'date', label: '生效日期自', name: 'effectTime_gt'},
                    {type: 'date', label: '生效日期至', name: 'effectTime_lt'},
                    {type: 'input', label: '工费项编码', name: 'itemCode_like'},
                    {type: 'input', label: '工费项名称', name: 'itemName_like'},
                ],
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                tableColumns: [
                    {prop: 'id', label: '序号'},
                    {
                        prop: 'organizationId',
                        label: '组织',
                        list: 'org',
                        required: true,
                        onChange(val,row){
                            row.productPkgId = null;
                            row.productPkgName = '';
                            row.productPkgTempId = null;
                            row.productPkgTempName = '';
                        },
                        editor:{
                        type: 'select',
                        list: 'org',
                        rules:[
                            {
                                required:true,
                                message: '不能为空'
                            }
                        ]
                    }},
                    {prop: 'productPkgId', label: '产品包id', show:false},
                    {
                        prop: 'productPkgName', label: '产品包',
                        onChange(val,row,column){
                            row.productPkgId = val.id;
                            row.productPkgName = val.pkgName;
                            row.productPkgTempId = null;
                            row.productPkgTempName = '';
                        },
                        editor:{
                            type: 'lookup',
                            service: Service.PRSPQM.name,
                            method: Service.PRSPQM.methods.productPackageQueryPage,
                            columns: [
                            {
                                prop: 'id',
                                label: 'ID',
                            },
                            {
                                prop: 'pkgName',
                                label: '产品包名称'
                            }
                            ],
                            placeholder: '搜索产品包名称',
                            searchExpr: ['pkgName'],
                            rules:[]
                        }
                    },
                    {prop: 'productPkgTempId', label: '产品包模板id', show:false},
                    {
                        prop: 'productPkgTempName', label: '产品包模板',
                        onChange(val,row,column){
                            row.productPkgTempId = val.id;
                            row.productPkgTempName = val.tempName;
                            row.productPkgId = val.pkgId;
                            row.productPkgName = val.pkgName;
                            row.organizationId = val.orgId;
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
                            rules:[]
                        }
                    },
                    {prop: 'expenseDictionaryId', label: '工费项词典id', show: false},
                    {
                        prop: 'itemCode', label: '工费项编码', required: true,
                        onChange(val,row,column){
                            row.itemCode = val.itemCode;
                            row.itemName = val.itemName;
                            row.workType = val.workType;
                            row.workTypeName = val.workTypeName;
                            row.expenseDictionaryId = val.id;
                        },
                        editor:{
                            type: 'lookup',
                            service: Service.TEMPLATE.name,
                            method: Service.TEMPLATE.methods.expenseDictionaryQueryPage,
                            args:{ search: {dictionaryStatus: 0} },
                            columns: [
                            {
                                prop: 'id',
                                label: 'ID',
                            },
                            {
                                prop: 'itemCode',
                                label: '工费项编码'
                            },
                            {
                                prop: 'itemName',
                                label: '工费项名称'
                            }
                            ],
                            placeholder: '搜索工费项编码',
                            searchExpr: ['itemCode'],
                            rules:[
                                {
                                    required: true,
                                    message: '不能为空'
                                }
                            ]
                        }
                    },
                    {prop: 'itemName', label: '工费项名称', readonly: true},
                    {prop: 'workType', label: '所属工种id', show: false},
                    {prop: 'workTypeName', label: '所属工种', readonly: true},
                    {prop: 'measureUnit', label: '计量单位', list:'unit' , required: true, editor:{
                        type: 'select',
                        rules:[
                            {
                                required: true,
                                message: '不能为空'
                            }
                        ]
                    }},
                    {prop: 'unitQuota', label: '单位定额', required: true, editor:{
                        type: 'input',
                        rules:[
                            {
                                validator: validateUnitQuota
                            }
                        ]
                    }},
                    {prop:'effectTime', label:'生效日期', required: true, formatter:this.dateParser , editor:{
                        type:'date',
                        endFormater: 'timestamp',
                        rules:[
                            {
                                required: true,
                                message: '不能为空'
                            }
                        ]
                    }},
                    {prop: 'memo', label: '备注',editor:{
                        type:'input'
                    }},
                    {prop: 'quotaStatus', label: '状态', list:'dictionaryStatus',readonly: true},
                    {prop: 'createUserName', label: '创建人',readonly: true},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser',readonly: true},
                    {prop: 'updateUserName', label: '最后更新人',readonly: true},
                    {prop: 'updateTime', label: '更新时间', formatter: 'dateParser',readonly: true}
                ],
                tableService: Service.TEMPLATE.name,
                tableMethod: Service.TEMPLATE.methods.expenseQuotaQueryPage,
                tableArgs:{sort: ['id_desc']},
                tableCommonData:{
                    dictionaryStatus:[
                        {
                            text: '启用',
                            value: 0
                        },
                        {
                            text: '作废',
                            value: 1
                        }
                    ],
                    org:[], // 组织列表
                    unit:[] //计量单位
                },
                tableTemplateData:{

                },
                selectedRows:[],
                selIds:[],
                importDialogVisible: false,
                fullscreenLoading: false,
                uploadParams:{
                    otherArgs:JSON.stringify({createUser:+Cookie.get('t8t-tc-uid')}),
                    columns:"organizationId,productPkgId,productPkgTempCode,itemCode,measureUnit,unitQuota,effectTimeImport,memo"
                },
                importURL: Utils.getImportURL(Service.TEMPLATE.name, Service.TEMPLATE.methods.expenseQuotaImport),
                importLoading: false,
                disabledSymbols:['DELROW','SAVE'],
            }
        },
        created(){
            //获取组织列表
            this.getOrg();
            this.getUnit();
            //组织树
            TemplateBase.queryTreeByType({typeCodes: ['001003010']}).then((res) => {
                if (res.data.status === 200) {

                    this.treeData = [res.data.result];
                }
            })
        },
        methods:{
            getOrg(){
                let args = {page:1,size:150,search:{typeCode:'001003010',isDel: 0}};
                commonApi.queryAll(args).then((res)=>{
                    let list = [];
                    if(res.data.status === 200){
                        res.data.result.rows.forEach((item)=>{
                            list.push({
                                text:item.name,
                                value:item.id
                            });
                        })
                        this.tableCommonData.org = list;
                    }else{

                    }
                }).catch()
            },
            getUnit(){
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: 11003
                    },
                    size: 100
                }
                let list = [];
                commonApi.queryUnionParent(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item.id,
                                    text: item.propertyName
                                })
                            }
                        });
                        this.tableCommonData.unit = list;
                    }
                });
            },
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
                this.$refs['list-view'].getTableInstance().validate((isValid) => {
                    if(isValid){
                        let rows =  this.$refs['list-view'].getTableInstance().getActionLog(false,true);
                        let createList = [];
                        let createUser = +Cookie.get('t8t-tc-uid');
                        rows.addedRows.forEach(function(item,index){
                            createList.push({
                                "organizationId":+item.organizationId,
                                "productPkgId":+item.productPkgId ? +item.productPkgId : 0,
                                "productPkgTempId":+item.productPkgTempId ? +item.productPkgTempId : 0,
                                "expenseDictionaryId":+item.expenseDictionaryId,
                                "itemCode": item.itemCode,
                                "itemName": item.itemName,
                                "workType": item.workType,
                                "measureUnit":+item.measureUnit,
                                "unitQuota":item.unitQuota,
                                "effectTime":+item.effectTime,
                                "memo":item.memo,
                                "createUser": createUser
                            })
                        });
                        if(createList.length > 0){
                            this.fullscreenLoading = true;
                            Model.expenseQuotaSave({expenseQuota: createList}).then((res) => {
                                this.fullscreenLoading = false;
                                if (res.data.status === 200) {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: "保存成功！",
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    });
                                    //重置行记录状态
                                    this.reloadTable();
                                }else if(res.data.status === 40702){
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: res.data.result,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    });
                                }else{
                                    this.$message({
                                        type: 'error',
                                        message: res.data.message ? res.data.message : '保存失败！'
                                    })
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
                this.$confirm('是否确认作废','提示',{
                    type: 'warning'
                }).then(() =>{
                    Model.expenseQuotaSetExpire({ids:this.selIds,operateUser:+Cookie.get('t8t-tc-uid')}).then((res) => {
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
                        "size": 10000,
                        "optType": 1
                    };
                let formData = this.$refs['list-view'].getSearchInstance().getFormData();
                if(JSON.stringify(formData) !== '{}'){
                    args.search = formData;
                }
                exportUtils({
                    "service": Service.TEMPLATE.name,
                    "method": Service.TEMPLATE.methods.expenseQuotaExport,
                    "args": args,
                    "headers": "序号,组织,产品包,产品包模板,工费项编码,工费项名称,所属工种,计量单位,单位定额,生效日期,状态,备注,创建人,创建时间,更新人,更新时间",
                    "sorts": "id,organizationName,productPkgName,productPkgTempName,itemCode,itemName,workTypeName,measureUnitName,unitQuota,effectTimeExport,quotaStatusExport,memo,createUserName,createTimeExport,updateUserName,updateTimeExport",
                    "title": '工费项定额'
                });
                setTimeout(()=>{
                    this.fullscreenLoading = false;
                },1000);
            },
            selectionChange(rows,selIds){
                //已选择行
                this.selectedRows = rows;
                this.selIds = selIds;
                //按钮禁用/启用
                let invalidStatus = false;
                let delStatus = false;
                if(rows.length > 0){
                    for(let i in rows){
                        if(rows[i].quotaStatus != 0){
                            invalidStatus = true;
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
                this.tableArgs = {sort: ['id_desc']}
                this.$refs['list-view'].getTableInstance().reloadTable();
                this.initDisabledSymbols();
            },
            downloadTemplate(){
                this.fullscreenLoading = true;
                exportUtils({
                    "service": Service.ORGANIZATION.name,
                    "method": Service.ORGANIZATION.methods.organizationQueryWithoutDel,
                    "args": {
                        "search": {
                            "typeCode": "001003010"
                        },
                        "page": 1,
                        "size": 150
                    },
                    "headers": "组织Id,组织名称",
                    "sorts": "id,name",
                    "title": '组织数据'
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
                exportUtils({
                    service: Service.PRSPQM.name,
                    method: Service.PRSPQM.methods.productPackageQueryPage,
                    args: {
                        "page": 1,
                        "size": 10000
                    },
                    headers: "产品包Id,产品包名称",
                    sorts: "id,pkgName",
                    title: '产品包数据'
                });
                exportUtils({
                    service: Service.TEMPLATE.name,
                    method: Service.TEMPLATE.methods.expenseDictionaryExport,
                    args: {
                        "search": {
                            "dictionaryStatus": 0
                        },
                        "page": 1,
                        "size": 10000,
                        "optType":1
                    },
                    headers: "工费项编码,工费项名称",
                    sorts: "itemCode,itemName",
                    title: '工费项编码'
                });
                exportUtils({
                    "service": Service.TEMPLATE.name,
                    "method": Service.TEMPLATE.methods.expenseQuotaExport,
                    "args": {
                        "page": 1,
                        "size": 10000,
                        "optType":2
                    },
                    "headers": "计量单位id,计量单位名称",
                    "sorts": "measureUnit,measureUnitName",
                    "title": '计量单位'
                });
                exportUtils({
                    "service": Service.TEMPLATE.name,
                    "method": Service.TEMPLATE.methods.expenseQuotaExport,
                    "args": {
                        "page": 1,
                        "size": 10000,
                        "search":{
                            "id": -1
                        },
                        "optType":1
                    },
                    "headers": "组织ID,产品包ID,产品包模板编码,工费项编码,单位,单位定额,生效日期,备注",
                    "sorts": "organizationId,productPkgId,productPkgTempCode,itemCode,measureUnit,unitQuota,effectTimeImport,memo",
                    "title": '工费项定额导入模板'
                });
                setTimeout(()=>{
                    this.fullscreenLoading = false;
                },2000)
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
                if(response.status == 200){
                    this.$msgbox({
                        title: '导入成功！',
                        type: 'success',
                        message: response.message,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.$refs['upload'].clearFiles();
                    this.reloadTable();
                    this.importDialogVisible = false;
                }else if([40701,40702,40712].indexOf(response.status) > -1){
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: response.result,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.$refs['upload'].clearFiles();
                    return false
                }else if(response.status != 200) {
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: response.message,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    });
                    this.$refs['upload'].clearFiles();
                    return false
                }
                else{
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
                this.$refs['list-view'].getToolbarInstance().disableBySymbol('DELROW');
                this.$refs['list-view'].getToolbarInstance().disableBySymbol('SAVE');
            },
            /*getProductPkgName(productPkgId){
                if(!productPkgId){
                    return '';
                }else{
                    Model.productPackageQueryPage({search:{ id: +productPkgId }}).then((res)=>{

                    }).catch()
                }
            }*/
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
