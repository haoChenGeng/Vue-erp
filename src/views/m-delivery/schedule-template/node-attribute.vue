<template>
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog">
        <div class="t8t-full-dialog-container">
            <!-- 顶部按钮区 -->
            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                </div>
            </div>
            <div class="my-container">
                <div class="my-toolbar">
                    <el-button
                        type="primary"
                        size="small"
                        icon="plus"
                        @click="add"
                    >新增属性</el-button>
                    <el-button
                        type="danger"
                        size="small"
                        icon="close"
                        @click="del"
                    >删除属性</el-button>
                    <el-button
                        type="primary"
                        size="small"
                        class="el-icon-check"
                        @click="save"
                    > 保存</el-button>
                </div>
                <t8t-table
                    ref="infoTable"
                    :columns="infoColumns"
                    :dataSource="dataSource"
                    :templateData="templateData"
                    :commonData="commonOptionsConfig"
                    :pageBar="true"
                    :editable="true"
                    :isLoading="isLoading"
                    @selection-change="selectionChange"
                >
                    <template
                        slot="assist"
                        scope="scope"
                    >
                        <el-cascader
                            :expand-trigger="click"
                            :change-on-select="true"
                            filterable
                            @active-item-change="handleItemChange"
                            @change="handleChange"
                            :options="options"
                            :style="{width:'100%',height:'100%',textAlign:'left'}"
                            v-model="scope.row['assist']"
                        >
                        </el-cascader>
                    </template>
                </t8t-table>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import Cookie from 'js-cookie'
    export default {
        data(){
            return {
                isDialogShow:true,
                dataSource:[],
                infoColumns:
                    [
                        {
                            "prop": "id",
                            "label": "ID"
                        },
                        {
                            "prop": "nodeId",
                            "label": "节点ID",
                        },
                        {
                            "prop": "nodeType",
                            "label": "节点类型"
                        },
                        {
                            "prop": "assist",
                            "label": "辅助资料"
                        },
                        {
                            "prop": "billStatus",
                            "label": "启用状态",
                            "list": "billStatus",
                            "editor":{
                                "type":"select",
                                "rules": [{
                                    "required": true,
                                    "message": "不能为空"
                                }]
                            }
                        },
                        {
                            "prop": "effectTime",
                            "label": "生效日期",
                            "formatter": "dateParser",
                            "editor":{
                                "type":"datetime",
                                "endFormater": 'timestamp',
                                "rules": [{
                                    "required": true,
                                    "message": "不能为空"
                                }]
                            }
                        }
                    ],
                isLoading: false,
                rules: {type :'date' ,required: true , message: "请选择生效日期",trigger: 'change'},
                infoService: Service.TEMPLATE.name,
                infoMethod:  Service.TEMPLATE.methods.itemBillQueryPage,
                infoArgs: {page:1, size:200, search: {nodeId: this.$route.query.id}},
                selectedRows:[],
                templateData: {
                    "id": null,
                    "nodeId": this.$route.query.id,
                    "nodeType": this.$route.query.nodeType,
                    "assist": [],
                    "billStatus": null,
                    "effectTime": null
                },
                commonOptionsConfig: {
                    billStatus: [
                        { value: 1, text: '启用'},
                        { value:0, text: '禁用'}
                    ] //行状态
                },
                options: [],
                parentIds:{}
            }
        },
        created() {
            if(!this.$route.query.id){
                this.$msgbox({
                    title: '消息',
                    type: 'error',
                    message: '参数错误！',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                },function(){
                    //todo 没传参数的情况
                });
                return false;
            }
            TemplateOperator.propertyQueryPage({page:1,size:1000,search:{depth:2}}).then((res) => {
                if(res.data.status === 200){
                    let rows = res.data.result.rows;
                    for(let i in rows){
                        this.parentIds[rows[i]['id']] = i;
                        this.options.push({ value:rows[i]['id'],label:rows[i]['propertyCode'] + ' ' + rows[i]['propertyName'], children:[]})
                    }
                }
            });
            this.getTableData();
        },
        methods: {
            closeDialog() {
                this.$router.go(-1)
            },
            //行变化事件
            selectionChange (rows){
                //已选择行
                this.selectedRows = rows;
            },
            getTableData(){
                TemplateOperator.itemBillQueryPage({page:1, size:200, search: {nodeId: this.$route.query.id}}).then((res) => {
                    if(res.data.status === 200){
                        let rows = res.data.result.rows;
                        this.isLoading = false;
                        for(let i in rows){
                            this.handleItemChange([rows[i]['assistId']]);
                        }
                        this.dataSource = rows;
                    }
                })
            },
            handleItemChange(val) {
                if(val.length > 1){
                    return;
                }
                let arg =  {
                    page: 1,
                    search: {
                        parentId: val[0]
                    },
                    size: 1000
                };
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            let rows = res.data.result;
                            let list = [];
                            for(let i in rows){
                                list.push({value:rows[i]['id'],label:rows[i]['propertyCode'] + ' ' + rows[i]['propertyName']});
                            }
                            this.options[this.parentIds[val[0]]].children = list;
                        }
                    })
            },
            handleChange (val){
                this.handleItemChange(val);
            },
            add() {
                let firstRow = this.$refs['infoTable'].getRowByIndex(0);
                if(firstRow){
                    //this.templateData.id = firstRow['id'];
                    this.templateData.nodeId = firstRow['nodeId'];
                    this.templateData.nodeType = firstRow['nodeType'];
                }
                this.$refs['infoTable'].addNewRow()
            },
            del() {
                if(this.selectedRows.length > 0){
                    for(let i in this.selectedRows){
                        if(this.selectedRows[i].id){
                            this.$message.error('已保存的节点属性不能被删除！');
                            return false;
                        }
                    }
                    this.$refs['infoTable'].delRows()
                }else{
                    this.$message.error('请选择需要删除的节点属性！')
                }
            },
            save() {
                let rows =  this.$refs['infoTable'].getActionLog(false);
                let data = {};
                data.addItemBills = this.formatRowData(rows.addedRows);
                data.updateItemBills = this.formatRowData(rows.editedRows);
                this.$refs['infoTable'].validate((isValid) => {
                    if (isValid && data.addItemBills && data.updateItemBills) {
                        this.isLoading = true;
                        TemplateOperator.itemBillSave(data)
                            .then((res) => {
                                if (res.data.status === 200) {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '保存成功！',
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    },function(){
                                        //this.reloadTable('infoTable');

                                    });
                                    this.isLoading = false;
                                    //重置行记录状态
                                    this.$refs['infoTable'].getActionLog(true);
                                    this.getTableData();
                                }else{
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: res.data.message,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    });
                                    this.isLoading = false;
                                }
                            });
                    }
                });
            },
            formatRowData (rowData){
                for(let i in rowData){
                    /*if(typeof rowData[i].effectTime == 'object'){
                        rowData[i].effectTime = +Date.parse(rowData[i].effectTime).toString().substr(0,10);
                    }*/
                    rowData[i].updateUser = +Cookie.get('t8t-tc-uid');
                    if(rowData[i].id){

                    }else{
                        rowData[i].createUser = +Cookie.get('t8t-tc-uid');
                    }
                    rowData[i].assistId = rowData[i]['assist'][0];
                    rowData[i].assistValueId = rowData[i]['assist'][1];

                    if(!rowData[i].assistId || !rowData[i].assistValueId){
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '请选择辅助资料！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                        return false;
                    }
                }
                return rowData;
            },
        }
    }
</script>

<style lang="css" scoped>
    .t8t-full-dialog .my-container{
        display: flex;
        flex: 1;
        flex-direction: column;
        margin-top: 20px;
        padding: 0 30px;
    }
    .t8t-full-dialog .my-toolbar{
        margin-bottom: 15px;
    }
</style>

<style>
    .t8t-full-dialog .el-dialog__header{
        padding: 0;
    }
    .t8t-full-dialog .el-dialog__body{
        padding: 0;
        height: 100%;
    }
    .t8t-full-dialog .t8t-full-dialog-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }
    .t8t-full-dialog .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .t8t-full-dialog .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .t8t-full-dialog .toolbar-container .toolbar-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog .toolbar-container .toolbar-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }
    .t8t-full-dialog .container-center{
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }
    .t8t-full-dialog .el-form{
        display: flex;
        flex-wrap: wrap;
    }
    .t8t-full-dialog .form-item-container{
        width: 25%;
    }
    .t8t-full-dialog .full-dialog-form-container{
        margin-bottom: 10px;
        min-height: 240px;
    }
    .t8t-full-dialog .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .t8t-full-dialog .full-dialog-tabs-container{
        display: flex;
    }
    .t8t-full-dialog .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .t8t-full-dialog .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .t8t-full-dialog .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .t8t-full-dialog .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .t8t-full-dialog .el-tabs__content{
        flex: 1;
        display: flex;
        /*        width: 1220px;
                margin: 0 auto;*/
    }
    .t8t-full-dialog .el-tab-pane{
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        overflow: auto;
    }
    /* 顶部tab */
    .t8t-full-dialog .full-dialog-form-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .t8t-full-dialog .full-dialog-form-container .el-tabs__header {
        border-top: 0;
        border-bottom: 0;
    }
    .el-row {
        padding-left: 20px;
        width:600px;
        margin-bottom: 20px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>
