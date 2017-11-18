<template>
    <!-- 新增 -->
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog">
        <div class="t8t-full-dialog-container">
            <!-- 顶部按钮区 -->
            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                    <t8t-toolbar
                        class="t8t-dark"
                        @VERIFY="submitForm"
                    >
                    </t8t-toolbar>
                </div>
            </div>
            <!-- 表单区 -->
            <div class="full-dialog-form-container1 container-center">
                <t8t-search
                    :fields="fields"
                    :selectSource="selectSource"
                    @submit="submitSearch"
                    :showToggleBtn="false"
                    >
                </t8t-search>
            </div>
            <!-- 收款计划单 -->
            <div class="pd bt">
                <h2>收款计划单</h2>
                <t8t-table
                    ref="t8ttable1"
                    :columns="columns1"
                    :dataSource="dataSource1"
                    :editable="true"
                    :commonData="selectSource"
                    :selectCol="true"
                    :pageBar="false"
                    @selection-change="onSelect1"
                    @cell-form-item-change="onChange1"
                >
                    <!--用于自定义列模板-->
                    <template slot="verifyStatus" scope="scope">
                        <span
                            v-if="scope.row['verifyStatus']===1||scope.row['verifyStatus']===2"
                            style="color:red; font-size: 25px"
                        >●</span>
                        <span
                            v-else-if="scope.row['verifyStatus']===3"
                            style="color:green; font-size: 25px"
                        >●</span>
                    </template>
                </t8t-table>
                <div class="footer">
                    <div class="left">合计</div>
                    <div class="right">{{sum1}}</div>
                </div>
            </div>
            <!-- 收款单 -->
            <div class="pd bt">
                <h2>收款单</h2>
                <t8t-table
                    ref="t8ttable2"
                    :columns="columns2"
                    :dataSource ="dataSource2"
                    :editable="true"
                    :commonData="selectSource"
                    :selectCol="true"
                    :pageBar="false"
                    @selection-change="onSelect2"
                    @cell-form-item-change="onChange2"
                >
                    <!--用于自定义列模板-->
                    <template slot="verifyStatus" scope="scope">
                        <span
                            v-if="scope.row['verifyStatus']===1||scope.row['verifyStatus']===2"
                            style="color:red; font-size: 25px"
                        >●</span>
                        <span
                            v-else-if="scope.row['verifyStatus']===3"
                            style="color:green; font-size: 25px"
                        >●</span>
                    </template>
                </t8t-table>
                <div class="footer">
                    <div class="left">合计</div>
                    <div class="right">{{sum2}}</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import Cookie from 'js-cookie'
import commonApi from 'src/services/commonApi/commonApi.js'
import Service from 'src/services/finance/Service.js'
import api from 'src/services/finance/bills.js'
import columns from './dialog-verify.js'
export default {

    name: 'page-pay-bills-dialog',
    data () {
        return {
            isbtnLoading: false,
            isDialogShow: true,
            activeTabName: 'one',
            //表格
            tableData: [],
            columns: [],
            //搜索表单项配置
            fields: [
                {type: 'input',label: '项目ID:',name: 'projectId',valueType:'int'},
                {type: 'select',label: '收款对象:',name: 'receiptRoleId', selectSourceKey:'receiptRoleOptions'},
                {type: 'input',label: '收款对象ID:',name: 'receiptorId',valueType:'int'}
            ],
            //搜索select类型下拉列表数据，对应fields的selectSourceKey
            selectSource: {
                receiptRoleOptions: [],
                verifyStatus: [
                    {
                        text: "未核销",
                        value: 1
                    },
                    {
                        text: "部分核销",
                        value: 2
                    },
                    {
                        text: "已核销",
                        value: 3
                    },
                    {
                        text: "作废",
                        value: 4
                    }
                ]
            },
            dataSource1: [],
            dataSource2: [],
            columns1: columns.columns1,
            columns2: columns.columns2,
            sum1: '0.00',
            sum2: '0.00'
        }
    },
    created() {
        // 收款对象
        this.getCommonOptions('61004','receiptRoleOptions')
        //获取计划单和收款单表格数据
        let orOperDTO = {}
        let query = this.$route.query
        orOperDTO.projectId = +query.projectId
        orOperDTO.receiptRoleId = +query.receiptRoleId
        orOperDTO.receiptorId = +query.receiptorId
        orOperDTO.start = 1
        let args1 = {
            orOperDTO: orOperDTO
        }
        let args2 = {
            receiptLeftJoinQueryDTO: {
                code: query.code
            },
            page: 1,
            size: 100
        }
        this.getTable1Data(args1)
        this.getTable2Data(args2)
    },
    methods: {
        getTable1Data(args) {
            api.orQuery(args)
            .then((res) => {
                if(res.data.status === 200){
                   let data = res.data.result.rows
                   for(let i = 0;i<data.length;i++) {
                        data[i].planMoney = (data[i].oughtAmount - data[i].realAmount-data[i].pendAuditAmount).toFixed(2)
                   }
                   this.dataSource1 = data
                }
            })
        },
        getTable2Data(args) {
            api.queryFlat(args)
            .then((res) => {
                if(res.data.status === 200){
                   let data = res.data.result.rows
                   for(let i = 0;i<data.length;i++) {
                        data[i].rcvMoney = (data[i].arriveAmount - data[i].verifyAmount).toFixed(2)
                   }
                   this.dataSource2 = data
                }
            })
        },
        submitForm() {
                var args = {
                    createUser: +Cookie('t8t-tc-uid'),
                    planOrderDTOs: [],
                    receiptOrderDTOs: []
                }
                var arr1 = this.$refs['t8ttable1'].getSelectRows()
                var arr2 = this.$refs['t8ttable2'].getSelectRows()
                if(arr1.length===0 || arr2.length===0){
                    this.$message.error('请勾选计划单和收款单后再试。')
                    return false
                }
                var ret1 = []
                var ret2 = []
                this.sum1 = 0
                this.sum2 = 0
                for(let i=0; i<arr1.length; i++){
                    ret1[i] = {}
                    ret1[i]['id'] = arr1[i]['id']
                    ret1[i]['verifyAmount'] = +arr1[i]['planMoney']
                    this.sum1 += ret1[i]['verifyAmount']
                }
                for(let i=0; i<arr2.length; i++){
                    ret2[i] = {}
                    ret2[i]['id'] = arr2[i]['id']
                    ret2[i]['verifyAmount'] = +arr2[i]['rcvMoney']
                    this.sum2 += ret2[i]['verifyAmount']
                }
                if(this.sum1.toFixed(2) !== this.sum2.toFixed(2)) {
                    this.$msgbox({
                        title: '消息',
                        type: 'warning',
                        message: '核销金额不一致，请修改后再试。',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    return
                }
                this.isbtnLoading = true
                args.planOrderDTOs = ret1
                args.receiptOrderDTOs = ret2
                api.verify(args)
                .then((res) => {
                    if(res.data.status === 200 && res.data.result === 1){
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '核销成功',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.closeDialog()
                        this.isbtnLoading = false
                    }else{
                        this.$msgbox({
                            title: '消息',
                            type: 'warning',
                            message: res.data.message,
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.isbtnLoading = false
                    }
                })
        },
        closeDialog() {
            this.$router.go(-1)
        },
        //辅助资料
        getCommonOptions: function(fatherCode,selectName) {
            let arg =  {
                page: 1,
                search: {
                    pPropertyCode: fatherCode
                },
                size: 100
            }
            let list = []
            commonApi.queryUnionParent(arg)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        if (item.propertyStatus===1) {
                            list.push({
                                value: item.id,
                                text: item.propertyName
                            })
                        };
                    })
                    this.selectSource[selectName] = list
                }
            })
        },
        submitSearch(obj) {
            obj.start = 2
            let args1 = {
                orOperDTO: obj
            }
            this.getTable1Data(args1)
        },
        onSelect1(rows){
            this.sum1 = 0
            for(let i=0; i<rows.length; i++){
                this.sum1 += Number(rows[i]['planMoney'])
            }
            this.sum1 = this.sum1.toFixed(2)
        },
        onSelect2(rows){
            this.sum2 = 0
            for(let i=0; i<rows.length; i++){
                this.sum2 += Number(rows[i]['rcvMoney'])
            }
            this.sum2 = this.sum2.toFixed(2)
        },
        onChange1(cell, val){
            var rows = this.$refs['t8ttable1'].getSelectRows()
            this.sum1 = 0
            for(let i=0; i<rows.length; i++){
                this.sum1 += +rows[i]['planMoney']
            }
            this.sum1 = this.sum1.toFixed(2)
        },
        onChange2(cell, val){
            var rows = this.$refs['t8ttable2'].getSelectRows()
            this.sum2 = 0
            for(let i=0; i<rows.length; i++){
                this.sum2 += +rows[i]['rcvMoney']
            }
            this.sum2 = this.sum2.toFixed(2)
        }
    }
};
</script>

<style lang="css" scoped>
    .t8t-full-dialog{

    }
    .text-center{
        text-align: center;
    }
    .bt{
        border-top: 2px solid #eff7fa;
        margin: 0
    }
    .pd {
        padding: 0 30px;
        display: flex;
        flex: 1;
        flex-direction: column;
    }
    .footer{
        display: flex;
        height: 50px;
        -ms-align-items: center;
        align-items: center;
    }
    .footer .left{
        font-size: 14px;
        margin-left: 10px;
    }
    .footer .right{
        font-size: 14px;
        margin-left: 1415px;
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
        width: 1250px;
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
    .t8t-full-dialog .full-dialog-form-container1{
        margin-top: 0px;
    }
    .t8t-full-dialog .full-dialog-form-container1 .el-form-item__content{
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
        flex: 1;
        overflow: auto;
    }
    .t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }
</style>
