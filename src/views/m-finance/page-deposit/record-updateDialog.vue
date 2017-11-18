<template>
    <div>
        <el-dialog  v-model="isDialogShow"
                    size="full"
                    @close="backRoute"
                    class="t8t-full-dialog dialog-edit" >
            <div class="t8t-full-dialog-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            ref="toolbar"
                            class="t8t-dark"
                            @SUBMIT="doSubmit">
                        </t8t-toolbar>
                    </div>
                </div>
                <!-- 表单区 -->
                <div class="full-dialog-form-container">
                    <t8t-form-panel ref="record"
                                    :dataSource="recordData"
                                    :fields="fields"
                    ></t8t-form-panel>
                </div>
                <div class="full-dialog-tabs-container">
                    <!-- 标签页区 -->
                    <el-tabs v-model="activeTabName">
                        <el-tab-pane label="收支明细" name="one" class="tableDebitType">
                            <t8t-table ref="t8tTable"
                                       :columns="tableColumns"
                                       :service="service"
                                       :method="method"
                                       :args="tableArgs"
                                       :selectCol="false"
                                       :indexCol="true"
                                       :pageBar="false"
                                       :editable="true"
                            ></t8t-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-dialog>
    </div>



</template>


<script>
    import dateUtils from 'src/utils/DateUtils.js'
    import financeService from 'src/services/finance/Service.js'
    import depositAPI from 'src/services/finance/deposit.js'
    import Cookie from 'js-cookie'

    export default{
        component: {},
        data(){
            return {
                recordData:'',
                record:'',
                activeTabName: 'one',
                isDialogShow: true,
                service: financeService.DEPOSIT_MANAGEMENT.name,
                method: financeService.DEPOSIT_MANAGEMENT.methods.RECORD_ITEM_QUERY,
                tableArgs: {
                    search: {
                        recordId: null
                    },
                },
                tableColumns: [
                    {prop: 'projectId', label: '项目ID',readonly:true},
                    {prop: 'orgName', label: '组织',readonly:true},
                    {prop: 'bizTypeName', label: '业务类型',readonly:true},
                    {prop: 'productPackageName', label: '产品包',readonly:true},
                    {prop: 'customerName', label: '业主姓名',readonly:true},
                    {prop: 'projectAddress', label: '项目地址',readonly:true},
                    {prop: 'depositTypeName', label: '质保金类型',readonly:true},
                    {prop: 'amount', label: '金额',required:true,
                        editor:{
                            type:'input',
                            rules:[{
                                required:true,
                                message: '请输入数字'
                            },{
                                type:'number',
                                min: -100000,
                                max: 100000,
                                transform (val) {
                                    return +val;
                                },
                                message: '请输入-10万至10万之间的数字'}]},
                        onChange:this.amountChange
                        },
                    {prop: 'useTypeName', label: '用途类型',readonly:true},
                    {prop: 'accidentProjectId', label: '事故项目id',readonly:true},
                    {prop: 'remark', label: '备注',editor:{type:'input',rules:{max:1000,message:'请输入1000字符以内的内容'}}}

                ],

                fields: [
                    {prop: 'orgName',type: 'input', label: '组织',disabled: true},
                    {prop: 'pmId',type: 'input', label: '项目经理ID', disabled: true},
                    {prop: 'pmName',type: 'input', label: '项目经理',disabled: true},
                    {prop: 'bizTypeName',type: 'input', label: '业务类型', disabled: true},
                    {prop: 'amount',type: 'input', label: '总金额', disabled: true},
                    {prop: 'createName',type: 'input', label: '创建人', disabled: true},
                    {prop: 'createTime',type: 'input', label: '创建时间', disabled: true},
                    {prop: 'remark',type: 'input', label: '说明',disabled: true}
                ]
            }
        },

        methods: {
            amountChange:function(val,row,col,tab){
                let data=this.$refs['t8tTable'].dataSource
                this.recordData.amount=data.map(item=>{return item.amount}).reduce(function(a,b){return Number(a)+Number(b)})
                debugger
            },
            backRoute(){
                this.$router.push({
                    path: '/finance/record-list'
                })
            },
            doSubmit(){
                this.$refs['t8tTable'].validate((valid) => {
                        if (valid) {
                            this.$message('正在提交，请稍后...')
                            let tableActionLog = this.$refs['t8tTable'].getActionLog(false,false)
                            let args = {
                                recordId: this.record.id,
                                recordItemTopDTOs:tableActionLog.editedRows,
                                operId: parseInt(Cookie.get('t8t-tc-uid'))
                            }
                            depositAPI.recordUpdate(args).then((result) => {
                                if (result.data.status === 200) {
                                    this.backRoute()
                                   this.$alert('操作成功', '信息', {
                                        confirmButtonText: '确定',
                                        callback: function () {
                                            this.$refs['t8ttable'].reloadTable()
                                        }
                                    })
                                }
                                else {
                                    this.$alert(result.data.message, '错误提示', {
                                        confirmButtonText: '确定'
                                    })
                                }
                            });
                        }
                })
            }
        },
        created(){
            this.record=this.$route.query
            this.tableArgs.search.recordId = this.record.id
            this.recordData=this.record
        }
    }

</script>
<style
    lang="css"
    scoped
>
    .dialog-edit.t8t-full-dialog {
        width: 100%;
        height: 100%
    }

    .dialog-edit.t8t-full-dialog .textarea-container {
        margin: 0 30px;
    }
</style>
<style>
    .dialog-edit.t8t-full-dialog .el-dialog__header {
        padding: 0;
    }

    .dialog-edit.t8t-full-dialog .el-dialog__body {
        padding: 0;
        height: 100%;
    }

    .dialog-edit.t8t-full-dialog .t8t-full-dialog-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-tabs-container {
        flex: 1;
        margin-bottom: 0px;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-toolbar-container {
        height: 38px;
        background-color: #1e3046;
    }

    .dialog-edit.t8t-full-dialog .toolbar-container {
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        background-color: #1e3046;
    }

    .dialog-edit.t8t-full-dialog .toolbar-container .toolbar-button {
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }

    .dialog-edit.t8t-full-dialog .toolbar-container .toolbar-button:hover {
        color: #1e3046;
        background-color: #d2deeb;
    }

    .dialog-edit.t8t-full-dialog .container-center {
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }

    .dialog-edit.t8t-full-dialog .el-form {
        display: flex;
        flex-wrap: wrap;
    }

    .dialog-edit.t8t-full-dialog .form-item-container {
        width: 25%;
        flex: 1;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-form-container {
        margin-top: 22px;
        margin-left: auto;
        margin-right: auto;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-form-container .el-form-item__content {
        width: 180px;
    }
    .dialog-edit.t8t-full-dialog .full-dialog-tabs-container {
        display: flex;
    }

    .dialog-edit.t8t-full-dialog .el-tabs {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-tabs-container .el-tabs__item {
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }

    .dialog-edit.t8t-full-dialog .el-tabs__header {
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
        margin-bottom: 0;
    }

    .dialog-edit.t8t-full-dialog .full-dialog-tabs-container .el-tabs__active-bar {
        height: 1px;
    }

    .dialog-edit.t8t-full-dialog .el-tabs__item+.el-tabs__item {
        border-left: 1px solid #d4dce7;
    }

    .dialog-edit.t8t-full-dialog .el-tabs__nav-wrap {
        width: 1220px;
        margin: 0 auto;
    }

    .dialog-edit.t8t-full-dialog .el-tabs__content {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .dialog-edit.t8t-full-dialog .el-tab-pane {
        flex: none !important;
        width: 100% !important;
        height: 100% !important;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .dialog-edit.t8t-full-dialog .el-tab-pane .t8t-toolbar {
        position: absolute;
        left: 30px;
        right: 30px;
        padding: 10px 0!important;
        margin: 0 auto!important;
    }

    .dialog-edit.t8t-full-dialog .el-tab-pane .t8t-toolbar .el-button--small {
        padding: 7px 9px!important;
        font-size: 12px;
    }

    .dialog-edit.t8t-full-dialog  .el-dialog .el-button--small {
        padding: 7px 9px!important;
        font-size: 12px;
    }

    .dialog-edit.t8t-full-dialog .t8t-table {
        /*width: 1200px;*/
        flex: none !important;
        margin: 0 auto;
        position: absolute;
        left: 30px;
        bottom: 30px;
        right: 30px;
    }

    .dialog-edit.t8t-full-dialog .t8t-table .pagenav-container {
        border: 1px solid #D3DDE6;
    }

    .dialog-edit.t8t-full-dialog .t8t-table .pagenav-container {
        border: 1px solid #D3DDE6;
    }

    .dialog-edit.t8t-full-dialog  .tableDebitType .t8t-table {
        top: 50px;
    }

    .dialog-edit.t8t-full-dialog  .removeLog .t8t-table,
    .dialog-edit.t8t-full-dialog  .operateLog .t8t-table {
        top: 30px;
    }

    .dialog-edit.t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }
</style>
