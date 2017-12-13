<template>
    <div v-loading.fullscreen.lock="fullscreenLoading">
        <t8t-list-view
            ref="list-view"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="false"
            :toolbarDisabledSymbols="disabledSymbols"
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
            @list-enable="enable"
            @list-disable="disable"
            @list-import="importData"
            @list-export="exportData"
            @list-logdetail="logDetail"
			@search-submit="onSearchSubmit"
        >
        </t8t-list-view>
        <el-dialog title="批量导入工费词典数据" v-model="importDialogVisible" @close="closeUploadDialog">
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
                @close="opLogDialog=false"
            >
            </t8t-table>
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
    export default {
        data(){
            let validateItemCode = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error('不能为空'));
                }
                if(false === /^[a-zA-Z]{1,10}$/.test(value)){
                    return callback(new Error('工费项编码为纯字母，长度最大为10位'));
                }
                callback();
            }
            return {
                breadcrumbData: [{title: '交付'}, {title: '交付基础数据'}, {title: '工费项词典'}],
                searchFields: [
                    {type: 'input', label: '工费项编码', name: 'itemCode_like'},
                    {type: 'input', label: '工费项名称', name: 'itemName_like'},
                    {type: 'select', label: '所属工种', name: 'workType', selectSourceKey:'workType'},
                ],
                searchOptions:{
                    status:[
                        {
                            value: 0,
                            text: '启用'
                        },
                        {
                            value: 1,
                            text: '禁用'
                        }
                    ],
                    workType:[]
                },
                tableColumns: [
                    {prop: 'itemCode', label: '工费项编码', required: true, editor:{
                        type: 'input',
                        rules:[
                            {
                                validator: validateItemCode
                            }
                        ]
                    }},
                    {prop: 'itemName', label: '工费项名称', required: true, editor:{
                        type: 'input',
                        rules:[
                            {
                                required: true,
                                message: '不能为空'
                            }
                        ]
                    }},
                    {prop: 'workType', label: '所属工种',required: true, list:'workType', editor:{
                        type: 'select',
                        filterable:true,
                        clearable:true,
                        rules:[
                            {
                                required: true,
                                message: '不能为空'
                            }
                        ]
                    }},
                    {prop: 'memo', label: '备注', required: false, editor:{
                        type: 'input',
                        rules:[
                            /*{
                                required: true,
                                message: '不能为空'
                            }*/
                        ]
                    }},
                    {prop: 'dictionaryStatus', label: '状态', list:'dictionaryStatus',readonly: true},
                    {prop: 'createUserName', label: '创建人',readonly: true},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser',readonly: true},
                    {prop: 'updateUserName', label: '最后更新人',readonly: true},
                    {prop: 'updateTime', label: '更新时间', formatter: 'dateParser',readonly: true}
                ],
                tableService: Service.TEMPLATE.name,
                tableMethod: Service.TEMPLATE.methods.expenseDictionaryQueryPage,
                tableArgs:{sort: ['id_desc']},
                tableCommonData:{
                    dictionaryStatus:[
                        {
                            text: '启用',
                            value: 0
                        },
                        {
                            text: '禁用',
                            value: 1
                        }
                    ],
                    workType:[]
                },
                logColumns:[
                    { "prop": "remark", "label": "修改内容" },
                    { "prop": "opTime", "label": "修改时间", "formatter": 'dateParser'},
                    { "prop": "username", "label": "修改人" },
                ],
                logService: Service.TEMPLATE.name,
                logMethod: Service.TEMPLATE.methods.unitPriceQueryOplog,
                logArgs:{unitPriceId:2}, //TODO
                selectedRows:[],
                selIds:[],
                importDialogVisible: false,
                logDialogVisible: false,
                fullscreenLoading: false,
                uploadParams:{
                    otherArgs:JSON.stringify({createUser:+Cookie.get('t8t-tc-uid')}),
                    columns:"itemCode,itemName,workType,memo"
                },
                importURL: Utils.getImportURL(Service.TEMPLATE.name, Service.TEMPLATE.methods.expenseDictionaryImport),
                importLoading: false,
                disabledSymbols:['DELROW'],
            }
        },
        created(){
            this.getWorkType();
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
            },
            save(){
                this.$refs['list-view'].getTableInstance().validate((isValid) => {
                    if(isValid){
                        let rows =  this.$refs['list-view'].getTableInstance().getActionLog(false,true);
                        let createDTOs = [];
                        let updateDTOs = [];
                        let createUser = +Cookie.get('t8t-tc-uid');
                        rows.addedRows.forEach(function(item,index){
                            createDTOs.push({
                                itemCode: item.itemCode,
                                itemName:item.itemName,
                                workType:+item.workType,
                                memo: item.memo,
                                createUser:createUser
                            })
                        });
                        rows.editedRows.forEach(function(item,index){
                            updateDTOs.push({
                                id: +item.id,
                                itemCode: item.itemCode,
                                itemName:item.itemName,
                                workType:+item.workType,
                                memo: item.memo,
                                updateUser:createUser
                            })
                        })
                        if(createDTOs.length === 0 && updateDTOs.length === 0){
                            this.$message.error('没有作出任何修改！');
                            return;
                        }
                        this.fullscreenLoading = true;
                        Model.expenseDictionarySave({expenseDictionary: { createDTOs: createDTOs, updateDTOs: updateDTOs }}).then((res) => {
                            this.fullscreenLoading = false;
                            if (res.data.status === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功！'
                                });
                                    //重置行记录状态
                                    this.reloadTable();
                                }else{
                                    this.$message({
                                        type: 'error',
                                        message: res.data.message ? res.data.message : '保存失败！'
                                    })
                                }
                        })
                    }
                });
            },
            enable(){
                if(this.selIds.length == 0){
                    this.$message.error('请选择需要操作的行！');
                    return false;
                }
                this.$confirm('是否确认启用','提示',{
                    type: 'warning'
                }).then(() =>{
                    Model.expenseDictionaryBatchSetStatus({ids:this.selIds,optType:1,operateUser:+Cookie.get('t8t-tc-uid')}).then((res) => {
                        if(res.data.status === 200){
                            this.reloadTable();
                            this.$message.success('启用成功！');
                        }else{
                            this.$message.error(res.data.message? res.data.message :'启用失败！');
                        }
                    }
                ).catch()
                })
            },
            disable(){
                if(this.selIds.length == 0){
                    this.$message.error('请选择需要操作的行！');
                    return false;
                }
                this.$confirm('是否确认禁用','提示',{
                    type: 'warning'
                }).then(() =>{
                    Model.expenseDictionaryBatchSetStatus({ids:this.selIds,optType:2,operateUser:+Cookie.get('t8t-tc-uid')}).then((res) => {
                        if(res.data.status === 200){
                            this.reloadTable();
                            this.$message.success('禁用成功！');
                        }else{
                            this.$message.error(res.data.message? res.data.message :'禁用失败！');
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
                    service: Service.TEMPLATE.name,
                    method: Service.TEMPLATE.methods.expenseDictionaryExport,
                    args: args,
                    headers: "工费项编码,工费项名称,所属工种,备注,状态,创建人,创建时间,最后更新人,更新时间",
                    sorts: "itemCode,itemName,workTypeName,memo,dictionaryStatusExport,createUserName,createTimeExport,updateUserName,updateTimeExport",
                    title: "工费项词典数据"
                })
                setTimeout(()=>{
                    this.fullscreenLoading = false;
                },1000);
            },
            logDetail(){
                this.logDialogVisible = true;
            },
            selectionChange(rows,selIds){
                //已选择行
                this.selectedRows = rows;
                this.selIds = selIds;
                //按钮禁用/启用
                let enableStatus = false;
                let disableStatus = false;
                let showLogStatus = false;
                let delStatus = false;
                if(rows.length > 0){
                    for(let i in rows){
                        if(!rows[i].id){ //新增行
                            enableStatus = true;
                            disableStatus = true;
                        }else if(rows[i].dictionaryStatus == 0){
                            enableStatus = true;
                        }else if(rows[i].dictionaryStatus == 1){
                            disableStatus = true;
                        }
                    }
                }else{
                    delStatus = true;
                }
                if(enableStatus){
                    this.$refs['list-view'].disableBySymbol('ENABLE');
                }else{
                    this.$refs['list-view'].unDisableBySymbol('ENABLE');
                }
                if(disableStatus){
                    this.$refs['list-view'].disableBySymbol('DISABLE');
                }else{
                    this.$refs['list-view'].unDisableBySymbol('DISABLE');
                }
                if(delStatus){
                    this.$refs['list-view'].disableBySymbol('DELROW');
                }else{
                    this.$refs['list-view'].unDisableBySymbol('DELROW');
                }
            },
            tableCellClick(row, column, cell, event){

            },
            reloadTable() {
                this.$refs['list-view'].getTableInstance().resetActionLog();
                this.$refs['list-view'].getTableInstance().reloadTable();
                this.initDisabledSymbols();
            },
            getWorkType(){
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: 41001
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
                        this.searchOptions.workType = list;
                        this.tableCommonData.workType = list;
                    }
                });
            },
            downloadTemplate(){
                this.fullscreenLoading = true;
                exportUtils({
                    service: Service.TEMPLATE.name,
                    method: Service.TEMPLATE.methods.expenseDictionaryExport,
                    args: {
                        "page": 1,
                        "size": 1000,
                        "optType": 2
                    },
                    headers: "所属工种id,所属工种名称",
                    sorts: "workType,workTypeName",
                    title: "工种数据"
                });
                exportUtils({
                    service: Service.TEMPLATE.name,
                    method: Service.TEMPLATE.methods.expenseDictionaryExport,
                    args: {
                        "page": 1,
                        "size": 10000,
                        "search":{
                            "id":-1
                        },
                        "optType": 1
                    },
                    headers: "施工工费项编码,施工工费项名称,所属工种id,备注",
                    sorts: "itemCode,itemName,workType,memo",
                    title: "工费项词典导入模板"
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
                }else if([40701,40702,40706,40707,40709,40710].indexOf(response.status) > -1){
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
                this.$refs['list-view'].disableBySymbol('DELROW');
            },
            closeUploadDialog(){
                this.importDialogVisible=false
                this.$refs.upload.clearFiles();
            }
        }
    }
</script>
