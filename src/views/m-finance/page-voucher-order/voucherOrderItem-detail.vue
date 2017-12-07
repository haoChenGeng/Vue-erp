<template>
    <div class="packtempview">
        <el-dialog size="full" class="t8t-full-dialog2 dialog-new" v-model="dialogVisible" @close="closeDialog" :show-close="false" :close-on-press-escape="false"  :class="{'isHide': isTopHide}">

            <div class="t8t-full-dialog2-container">
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <div>
                            <el-button @click="cancel()">关闭</el-button>
                        </div>
                    </div>
                </div>

                <div class="dialog2-main-container">
                    <div class="full-dialog-form-container">
                        <t8t-form-panel
                            :dataSource="tempHeadFormData"
                            :fields="tempHeadFormFields"
                            :commonData="tempHeadFormCommonData"
                            :disabled="disabled"
                            ref="mainForm"
                        >
                        </t8t-form-panel>
                    </div>

                    <div class="full-dialog-tabs-container">
                        <!--行操作工具栏-->
                        <div class="g-main-container-column">
                            <el-tabs v-model="activeTabName" @tab-click="tabClick" ref="tabs1">
                                <el-tab-pane label="分录行"
                                             class="tableDebitType"
                                             name="one">
                                    <t8t-table
                                        :columns="mainTableColumns"
                                        :service="mainTableService"
                                        :method="mainTableMethod"
                                        :commonData="mainSelectSource"
                                        :args="mainArgs"
                                        ref="mainTable"
                                        :pageBar="true"
                                        :radioCol="true"
                                        :indexCol="true"
                                        @cell-click="cellClick"
                                        @row-click="mainTableClick"
                                        @row-dobule-click="mainTableClick"
                                    >
                                        <template slot="voucherOrderId" scope="scope" >
                                            <el-button
                                                size="small"
                                                @click="showItemDialog(scope.row.id)"
                                            >联查明细</el-button>
                                        </template>
                                    </t8t-table>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                    <div class="full-dialog-tabs-container">
                        <!--行操作工具栏-->
                        <div class="g-main-container-column">
                            <el-tabs v-model="activeTabName2" @tab-click="tabClick" ref="tabs2">
                                <el-tab-pane label="辅助核算项"
                                             class="assiatant"
                                             name="one">
                                    <t8t-table
                                        :columns="secondTableColumns"
                                        :service="secondTableService"
                                        :method="secondTableMethod"
                                        :commonData="secondSelectSource"
                                        :args="secondArgs"
                                        ref="secondTable"
                                        :pageBar="true"
                                        :indexCol="true"
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
    </div>
</template>
<script>

    import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    import axios from 'src/utils/axios.js'
    import voucherOrderApi from 'src/services/finance/voucherOrder.js'
    export default {
        name: "packtempview",
        components: {
        },
        data(){

            return {
                sourceItemRoute: '/tuchat-finance/page-voucher-order/detail/sourceItem',
                id: null,
                editMode:'cell',
                accountId:+Cookie.get('t8t-tc-uid'),
                dialogVisible:true,
                addRowDialogVisible:false,
                activeTabName:'one',
                activeTabName2:'one',
                activeTableRef:'mainTable', //展示中的reftable
                mainTableService: 'N7MleTA0MHTcaUUxIqAYpQ5BwNDA-dv',
                mainTableMethod: 'y-77GM5VB8niBdLMzc7K_D1dfigUsZdvB2i7ws-_6VY',//查询凭证分录
                mainArgs: {
                },
                secondTableService:'N7MleTA0MHTcaUUxIqAYpQ5BwNDA-dv',
                secondTableMethod:'wpYr4xKTCEIyADHbO0tk7e2b8QJuunW29fs0KZpyAjxiqp4j96qeog9', //查询辅助核算项
                secondArgs: {
                    search: {
                        id: 0
                    }
                },
                disabledSymbolsTop:['TEMP-SAVE'],
                disabledSymbolsBody:[],
                canEditEffectTime : true,
                canFreezeTime : true,
                canForbiddenTime : true,
                tempItemType:0,
                needEffectTime: true,
                currentRow:{},
                qiTypesMappging:{},
                // 用于列表选项或绑定ID的列转为文字
                tempHeadFormCommonData: {
                    status: [
                        {value: 1, text: '有效'},
                        {value: 2, text: '作废'},
                        {value: 3, text: '记账'}
                    ],
                    dataSource:[
                        {value: 1, text: '库存明细账'},
                        {value: 2, text: '项目成本表'},
                        {value: 3, text: '工长质保金'}
                    ],
                    organizationId: [
                    ]
                },
                isTopHide: false,
                // 表单
                tempHeadFormFields:[
                    {
                        type: 'select',
                        label: '财务组织',
                        prop: 'organizationName',
                        disabled:true
                    },
                    {
                        type: 'input',
                        label: '会计期间',
                        prop: 'generatedAccountingTimeStr',
                        disabled:true
                    },
                    {
                        type: 'select',
                        label: '状态',
                        prop: 'status',
                        list: 'status',
                        disabled:true
                    },
                    {
                        type: 'input',
                        label: '凭证单据号',
                        prop: 'voucherCode',
                        disabled:true
                    },
                    {
                        type: 'input',
                        label: '模板名称',
                        prop: 'templateName',
                        disabled:true
                    },
                    {
                        type: 'input',
                        label: 'K3凭证号',
                        prop: 'k3No',
                        disabled:true
                    },
                    {
                        type: 'input',
                        label: '创建人',
                        prop: 'createName',
                        disabled:true
                    },
                    {
                        type: 'datetime',
                        label: '创建时间',
                        prop: 'createTime',
                        disabled:true
                    },
                    {
                        type: 'select',
                        label: '数据来源',
                        prop: 'dataSource',
                        list: 'dataSource',
                        disabled:true
                    },
                    {
                        type: 'input',
                        label: '借方合计',
                        prop: 'totalBorrowAmount',
                        disabled:true
                    },
                    {
                        type: 'input',
                        label: '贷方合计',
                        prop: 'totalLoanAmount',
                        disabled:true
                    }
                ],
                //时间特殊处理（*1000）
                tempHeadFormData:{
                  createTime:null
                },
                secondTableColumns:[
                    {
                        type: 'select',
                        label: '辅助项',
                        prop: 'assistantItemId',
                        list: 'assistantItemId'
                    },
                    {
                        type: 'input',
                        label: '辅助项值',
                        prop: 'assistantItemName'
                    }
                ],
                mainTableColumns:[
                    {
                        type: 'input',
                        label: '科目编码',
                        prop: 'accountCode'
                    },
                    {
                        type: 'input',
                        label: '科目名称',
                        prop: 'accountName'
                    },
                    {
                        type: 'input',
                        label: '借贷方向',
                        prop: 'cashFlow',
                        list: 'cashFlow',
                    },
                    {
                        type: 'input',
                        label: '金额',
                        prop: 'amount',
                        align: 'right',
                        formatter: function (val, a) {
                            return parseFloat(val).toFixed(2)
                        }
                    },
                    {
                        type: 'input',
                        label: '摘要',
                        prop: 'entryAbstract',
                    },
                    {
                        type: 'input',
                        label: '联查明细',
                        prop: 'voucherOrderId',
                        editor: {
                            type: 'input'
                        }
                    }
                ],
                mainTable2Columns:[

                ],

                lookupDataSource:[],
                tempCode:null,
                tempId:null,

                canEditOrg: false , //是否可编辑组织
                formData:{},
                mainSelectSource:{
                    cashFlow: [
                        {value: 1, text: '借方'},
                        {value: 2, text: '贷方'}
                    ]
                },
                secondSelectSource:{
                    assistantItemId:[
                    ]
                },
                hotRow:[],
                actionModel:'',
            }
        },

        created(){
            // 点击的数据的主键id
            this.id = this.$route.query.id
            this.getMainTableSource()
            this.getOrganizationOptions()
            this.getAssistantItem()
        },
        methods: {
            // table加载完后触发
//            onDataLoadedMain(){
//                let firstRow= this.$refs['mainTable'].dataSource
//                if(null==firstRow||firstRow.length<=0)
//                {
//                    this.$refs['secondTable'].dataSource=[]
//                    return
//                }else {
//                    let row=firstRow[0]
//                    this.$refs.mainTable.$refs.table.store.states.currentRow = row
//                    this.secondArgs={
//                        search: {
//                            voucherEntryId: row.id
//                        },
//                        page:1,
//                        size:20
//                    }
//                    voucherOrderApi.voucherAssistantQuery(this.secondArgs).then((res) => {
//                        let response = res.data
//                        if (response && response.status == 200) {
//                            this.$refs['secondTable'].dataSource=response.result.rows
//                        }
//                    }) .catch((res) => {
//                        this.$message.error('加载数据失败')
//                        return
//                    })
//                }
//            },
            //获取辅助核算项
            getAssistantItem() {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: '61014'
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
                                        text: item.propertyName
                                    })
                                }
                            })
                            this.secondSelectSource.assistantItemId = list
                        }
                    })
            },
            showItemDialog (data) {
                this.$router.push({ path: this.sourceItemRoute , query: { voucherEntryId: data ,voucherOrderId:this.id}})
            },
            //获取表单的数据
            getMainTableSource(){
               let args={
                    id: this.id
                }
                axios({
                    service: 'N7MleTA0MHTcaUUxIqAYpQ5BwNDA-dv', //查询凭证的方法以及服务t8t-fi-fvg
                    method: '2-OOzMyF26UOxO3Lb1NpLxv-BIgMXwCv9qb2qL9',
                    args: args
                })
                    .then((res) => {
                        let response = res.data
                        if (response && response.status == 200) {
                            this.tempHeadFormData = response.result
                            this.tempHeadFormData.createTime=response.result.createTime*1000
                            this.mainArgs={
                                search: {
                                    voucherOrderId: this.id
                                },
                                page:1,
                                size:20
                            }
                            voucherOrderApi.voucherEntryQuery(this.mainArgs).then((res) => {
                                if (res.data.status === 200) {
                                    let selectRowTemplate=res.data.result.rows
                                    this.$refs['mainTable'].dataSource=res.data.result.rows
//                                    if(selectRowTemplate.length>0)
//                                    {
//                                        this.secondArgs={
//                                            search: {
//                                                voucherEntryId: selectRowTemplate[0].id
//                                            },
//                                            page:1,
//                                            size:100
//                                        }
//                                        this.$refs['mainTable'].dataSource=res.data.result.rows
//                                    }else {
//                                        this.secondArgs={
//                                            search: {
//                                                id: 0
//                                            },
//                                            page:1,
//                                            size:20
//                                        }
//                                        this.$refs['mainTable'].dataSource=[]
//                                        this.$refs['secondTable'].dataSource=[]
//                                    }
                                }else {
//                                    this.secondArgs={
//                                        search: {
//                                            id: 0
//                                        },
//                                        page:1,
//                                        size:20
//                                    }
                                    this.$refs['mainTable'].dataSource=[]
                                  //  this.$refs['secondTable'].dataSource=[]
                                }
                            })
                        }
                    })
                    .catch((res) => {
                        this.$message.error('加载数据失败')
                        return
                    })

            },
            getOrganizationOptions() {
                // 法人职能和利润中心
                let arg = {
                    funcCodes: ["001004013", "001004014"]
                }
                let list = []
                apiCommon.queryByFunctionCode(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.isDel !== 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.name
                                    })
                                }
                            })
                            this.tempHeadFormCommonData.organizationIds = list
                        }
                    })
            },
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
            mainTableClick(){
                let selections = this.$refs['mainTable'].getSelectRows()
                if (selections.length === 0) {
                    return false
                } else if (selections.length > 1) {
                    return false
                }
                let selectRow=selections[0]
                this.secondArgs={
                    search: {
                        voucherEntryId: selectRow.id
                    }
                }
            },
            cellClick: function (row, column, cell, event) {

                //编辑行之前必须手动触发编辑状态
                if( !this.isNewRow(this.$refs[this.activeTableRef], row) ){
                    if( this.hotRow.indexOf(row) > -1 && ( this.actionModel == 'edit')){
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
            },
            isEmpty(str){
                return str == null || str == 0 || str == '' || str == undefined || str == '0'
            },
            isNull(str){
                return str == null || str == '' || str == undefined
            },
            closeDialog(){
                //this.$router.go(0)
                this.dialogVisible = false
                this.$router.push('/tuchat-finance/page-voucher-order')
            },

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
