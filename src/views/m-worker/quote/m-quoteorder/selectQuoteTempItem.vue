/**
* Created by tomy.li on 2017/6/7.
*/
<template>
    <div class="selectQuoteTempItem">
        <el-dialog title="选择个性化报价项" class="g-w-1000 my-el-dialog selectQuoteItemdialog" v-model="selectQuoteTempItemVisible" @close="closeSelectQuoteDialog">
            <t8t-search
                ref="search"
                :fields="fields"
                :selectSource="selectSource"
                @submit="submitSearch"
            >
            </t8t-search>
            <div class="g-main-container">
                <t8t-table
                    :columns="selectQuoteTempItemColumns"
                    :service="selectQuoteTempItemService"
                    :method="selectQuoteTempItemMethod"
                    :commonData="commonData"
                    :args="args"
                    :indexCol="true"
                    :pageBar="false"
                    :selectable="selectable"
                    style="height: 300px;"
                    ref="selectQuoteItemTable"
                    @data-loaded="tableLoaded"
                >
                </t8t-table>
            </div>

            <div slot="footer">
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-button  size="small"  @click="selectQuoteTempItemVisible = false">取消</el-button>
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
        props:['orderId','orderSpaceId'],//报价单id：orderId，报价空间id：orderSpaceId
        name: "selectQuoteTempItem",
        components: {},
        created(){
            this.initData()
        },
        methods: {
            //搜索，提交搜索并且发起刷新表格数据的请求
            submitSearch(data) {
//                debugger
                let tabObj = this.$refs['selectQuoteItemTable']

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
                    if(data.price != null){
                        newDataSource = newDataSource.filter((item, index) => {
                            if(item.price.indexOf(data.price) > -1){
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
            isEmpty(str){
                return str == null || str == 0 || str == '' || str == undefined || str == '0'
            },
            tableLoaded: function (data){

                this.submitAble = true

                let data_temp = data
                data_temp = []
                data.map(i => {
                    i.dataType = 2
                    return i
                })
                let datas = []
                if( data.length ){
                    //1.把当前空间内所有的用量明细组合按照报价项分组
                    let dataMap = []
                    data.forEach(i => {
                        dataMap[i.tempItemId] = [].concat(dataMap[i.tempItemId] ? dataMap[i.tempItemId] : [],i)
                    })


                    //2.从组合中提取出组合对应的报价项信息,生成一个新的行, 组合排在报价项下面，形成视觉上的分组
                    dataMap.forEach(i => {

                        //提取新的行
                        let qiData = {}
                        let groups = []
                        qiData =  Object.assign({},i[0])
                        qiData.dataType =  1
                        qiData.groups = i
                        datas = [].concat(datas, qiData)

                    })
                }
                this.$refs['selectQuoteItemTable'].dataSource = datas
                this.oldDataSource = datas
                return datas

            },
            initData: function(){
            },
            closeSelectQuoteDialog: function (){
                this.$emit('close')
            },
            submit: function (){
                let tabObj = this.$refs['selectQuoteItemTable']
                let selectedRows = tabObj.getSelectRows()

                if(selectedRows.length == 0){
                    return this.$message({
                        'type' : 'warning',
                        'message': '请选择报价项'
                    })
                }
                this.rowSelected(selectedRows);
            },
            selectRow: function (curRows){
                this.rowSelected(curRows);
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
                this.$parent.handleCommandQuoteItem(data);
                this.closeSelectQuoteDialog()
            }
        },
        data(){
            return {
                orderId:null,
                orderSpaceId: null, //使用空间
                oldDataSource:[],
                selectQuoteTempItemVisible: true,
                selectQuoteTempItemService: service.order.name,
                selectQuoteTempItemMethod: service.order.methods.getUnStandardQuoteItem,
                args:{"orderId":this.orderId,"orderSpaceId":this.orderSpaceId},
                selectQuoteTempItemColumns: [
                    { "prop":'qiName', "label":'报价项名',resizable:false},
                    { "prop":'qiUnit', "label":'单位',resizable:false},
                    { "prop":'price', "label":'单价',resizable:false},
                    { "prop":'craftDetails', "label":'工艺详情',resizable:false},
                ],
                currentRow:[],
                submitAble:false,
                fields:[
                    {type: 'input',label: '报价项名称',name: 'qiName',},
                    {type: 'input',label: '单价',name: 'price', },
                    {type: 'input',label: '工艺详情',name: 'craftDetails',},
                ]
            }
        }

    }
</script>
<style>
    .selectQuoteTempItem .t8t-table-container .table-container{
        /*min-height: 350px;
        max-height: 350px;*/
    }
</style>
