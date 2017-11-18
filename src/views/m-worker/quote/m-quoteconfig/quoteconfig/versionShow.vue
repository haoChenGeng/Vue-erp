<template>
    <!-- 新增 -->
    <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog">
        <div class="t8t-full-dialog-container">
            <!-- 顶部按钮区 -->
            <!-- <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                <t8t-toolbar
                        class="t8t-dark"
                        @EDIT-SUBMIT="handleClick"
                        :loading="saveLoad"
                    >
                    </t8t-toolbar>
                </div>
            </div> -->
            <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
            <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
            
           >
           </t8t-search>
            <div class="pd bt">
                <t8t-table
                    ref="refTable"
                    :columns="columns"
                    :editable="true"
                    :service="service"
                    :method="method"
                    :args="args"
                    :selectCol="false"
                    :commonData="commonData"
                    @cell-form-item-change="rowChange"
                    >
                </t8t-table>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import Cookie from 'js-cookie'
import Service from 'src/services/worker/quoteconfig/Service.js'
import axios from 'src/utils/axios.js'
export default {

    name: 'ref-dialog',
    data () {
        return {

            breadcrumbData:[{title:'工模售前'},{title:'配置管理'},{title:'报价字典'},{title:'查看小计'}],

            //搜索表单项配置
            fields: [
                {type: 'datetime',label: '修改日期',name: 'operTime_gte'},
                {type: 'datetime',label: '修改日期至',name: 'operTime_lt'},
                {type: 'input',label: '报价项编号',name: 'itemCode'},
                {type: 'input',label: '报价项名称',name: 'itemName_like'},                

            ],

            isDialogShow: true,
            service:Service.TEMPLATE.name,
            method:Service.TEMPLATE.methods.VERSIONSHOW,
            args:{},
            columns: [
                        { "prop": "itemCode", "label": "报价项编号" },
                        { "prop": "itemName", "label": "报价项名称" },
                        { "prop": "updateDetail", "label": "修改内容" },
                        { "prop": "operUserVO",  "label": "修改人" },
                        { "prop": "operTime", "label": "操作日期" , "formatter": "dateParser" }
            ],

            saveLoad:false

        }
    },
    created() {

    },
    methods: {


        submitSearch(obj) {
                    this.args = { search: obj }

                },

        closeDialog() {
            this.$router.go(-1)
        },



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
    .t8t-full-dialog .toolbar-container .el-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog .toolbar-container .el-button:hover{
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
    .t8t-full-dialog .full-dialog-form-container{
        margin-top: 0px;
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
        flex: 1;
        overflow: auto;
    }
    .t8t-full-dialog .t8t-table .table-container {
        margin-left: 0;
    }

</style>
