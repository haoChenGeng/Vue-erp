/**
* Created by tomy.li on 2017/10/13.
*/
<template>
    <div class="selectStandardQuoteItem">
        <el-dialog title="增加标配报价项" class="g-w-1000 my-el-dialog selectStandardQuoteItemDialog"
                   v-model="selectStandardQuoteItemVisible"
                   @close="selectStandardQuoteItemDialogClose"
        >
            <t8t-search
                ref="search"
                :fields="fields"
                :selectSource="selectSource"
                @submit="submitSearch"
            >
            </t8t-search>
            <div class="g-main-container">
                <t8t-table
                    :service="service"
                    :method="method"
                    :args="args"
                    :indexCol="true"
                    :selectCol="true"
                    :pageBar="false"
                    :columns="selectQuoteTempItemColumns"
                    ref="selectStandardQuoteItemTable"
                    @data-loaded="tableLoaded"
                >
                </t8t-table>
            </div>

            <div slot="footer">
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-button  size="small"  @click="selectStandardQuoteItemVisible = false">取消</el-button>
                            <el-button  size="small"  type="primary" @click="submit()" :disabled="!submitAble">确认</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import service from 'src/services/worker/quoteorder/Service.js'
    export default {
        props:["orderId","orderSpaceId"],//报价单id：orderId，报价空间id：orderSpaceId
        name: "selectStandardQuoteItem",
        components: {},
        data() {
            return {
                orderId:null,
                orderSpaceId: null, //使用空间
                oldDataSource:[],
                selectStandardQuoteItemVisible: true, //控制页面展示隐藏
                service: service.order.name,
                method:  service.order.methods.getStandardQuoteItem,
                args:{"orderId":this.orderId,"orderSpaceId":this.orderSpaceId},
                selectQuoteTempItemColumns: [
                    { "prop":'qiName', "label":'报价项名',resizable:false},
                    { "prop":'qiUnit', "label":'单位',resizable:false},
                    { "prop":'craftDetails', "label":'工艺详情',resizable:false},
                    { "prop":'gdmName', "label":'选品名称',resizable:false},
                ],
                submitAble:false,
                currentRow:[],//选中的行
                fields:[
                    {type: 'input',label: '报价项名称',name: 'qiName',},
                    {type: 'input',label: '工艺详情',name: 'craftDetails',},
                ]
            }
        },
        created() {

        },
        methods: {
            //搜索，提交搜索并且发起刷新表格数据的请求
            submitSearch(data) {
                let tabObj = this.$refs['selectStandardQuoteItemTable']

                let dataSource = this.oldDataSource
                let newDataSource = []
                if(dataSource.length ){

                    //重新赋值
                    newDataSource=dataSource

                    //字段查询
                    if(data.qiName != null){
                        newDataSource = newDataSource.filter((item, index) => {
                            if(item.qiName.indexOf(data.qiName) > -1){
                                return 1;
                            }else{
                                return null;
                            }
                        })
                    }

                    if(data.craftDetails != null){
                        newDataSource = newDataSource.filter((item, index) => {
                            if(item.craftDetails.indexOf(data.craftDetails) > -1){
                                return 1;
                            }else{
                                return null;
                            }
                        })
                    }

                    if(newDataSource){
                        tabObj.dataSource = newDataSource
                    }
                }else{
                    tabObj.dataSource = this.oldDataSource
                }
            },
            tableLoaded: function (data) {
                this.submitAble = true
                if(this.oldDataSource.length == 0){
                    this.oldDataSource = data
                }
            },

            submit: function (){
                let tabObj = this.$refs['selectStandardQuoteItemTable']
                let selectedRows = tabObj.getSelectRows()

                if(selectedRows.length == 0){
                    return this.$message({
                        'type' : 'warning',
                        'message': '请选择报价项'
                    })
                }
                this.rowSelected(selectedRows);
            },

            selectRow: function (curRow){
                this.rowSelected(curRow);
            },
            cellClick: function (a,b,c,d,e,f){
                //debugger
            },
            handleCurrentRowChange: function(row,oldRow){
                this.currentRow = row
            },
            /*handleCurrentRowChange: function (curRow, oldRow){
                //debugger
            },*/
            rowSelected : function (data){
                this.$parent.handleCommandQuoteItemForStandard(data);
                this.selectStandardQuoteItemDialogClose()
            },

            //关闭窗口
            selectStandardQuoteItemDialogClose: function () {
                this.$emit('close')
//                this.selectStandardQuoteItemVisible = false
                //dosomthing....
            }
        }
    }
</script>
<style>
    .selectStandardQuoteItem .t8t-table-container{
        height: 450px;
    }
</style>
