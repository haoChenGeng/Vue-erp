/**
* Created by tomy.li on 2017/10/13.
*/
<template>
    <div class="selectQuoteDelivery">
        <el-dialog title="增加组合" class="g-w-1000 my-el-dialog selectQuoteDeliveryDialog"
                   v-model="selectQuoteDeliveryVisible"
                   @close="selectQuoteDeliveryDialogClose"
        >
            <t8t-search
                ref="search"
                :fields="fields"
                :selectSource="selectSource"
                :showToggleBtn="false"
                @submit="submitSearch"
            >
            </t8t-search>
            <t8t-table
                :service="service"
                :method="method"
                :args="args"
                :indexCol="true"
                :radioCol="true"
                :columns="selectQuoteTempItemColumns"
                :pageBar="false"
                ref="selectQuoteDeliveryTable"
                @data-loaded="tableLoaded"
                @row-double-click="selectRow"
                @current-row-change="handleCurrentRowChange"
            >

            </t8t-table>

            <div slot="footer">
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-button  size="small"  @click="selectQuoteDeliveryVisible = false">取消</el-button>
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
    //TODO import service from 'src/services/worker/quoteChangeOrder/Service.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import quoteConfigService from 'src/services/worker/quoteconfig/Service.js'
    export default {
        props:["yid"],
        name: "selectQuoteDelivery",
        components: {},
        data() {
            return {
                selectQuoteDeliveryVisible: true, //控制页面展示隐藏
                service: service.order.name,
                method:  service.order.methods.getQuoteDelivery,
                args:{"yid":this.yid},
                oldDataSource:[],
                submitAble:false,
                currentRow:{},//选中的行
                yid: null, //项目id
                selectQuoteTempItemColumns: [
                    { "prop":'gdmName', "label":'品类',resizable:false},
                    { "prop":'spaceName', "label":'空间',resizable:false},
                    { "prop":'placeName', "label":'位置',resizable:false},
                    { "prop":'qiName', "label":'报价项名',resizable:false},
                ],
                fields:[
                    {
                        name:'cateGoryId',
                        selectSourceKey:'goodCategories',
                        type:'select',
                        label: '品类'
                    },
                    {
                        name:'qiName',
                        type:'input',
                        label: '报价项'
                    },
//                    {
//                        name:'qiName',
//                        type:'popup',
//                        label:'报价项名称',
//                        textValue: 'qiName', filedValue: 'qiName',
//                        dialog: {
//                            title: "查询报价项",
//                            size: 'large',
//                            searchForm: {
//                                fields: [
//                                    {type: 'input',label: '报价项编号',name: 'qiCode'},
//                                    {type: 'input',label: '报价项名称',name: 'qiName'},
//                                    {type: 'input',label: '工艺详情',name: 'craftDetails'},
//                                ],
//                                resetBtnVisible: false,
//                                showToggleBtn: false
//                            },
//                            table: {
//                                //表格
//                                columns: [
//                                    {
//                                        prop: 'qiCode',
//                                        label: '报价项编号'
//                                    },
//                                    {
//                                        prop: 'qiName',
//                                        label: '报价项名称'
//                                    },
//                                    {label: '工艺详情',prop: 'craftDetails'},
//                                ],
//                                commonData:{
//                                },
//                                radioCol: true,
//                                //请求参数配置
//                                service: quoteConfigService.TEMPLATE.name,
//                                method:  quoteConfigService.TEMPLATE.methods.QUERY,
//                                args: {
//                                }
//                            },
//                        },
//                        //自动补全
//                        remote:true,
//                        service: quoteConfigService.TEMPLATE.name,
//                        method:  quoteConfigService.TEMPLATE.methods.QUERY,
//                        remoteQueryKey:"qiName_like",
//                        remoteArgs:{'page':1, 'size':200}
//
//                    }
                ],
                selectSource:{
                    'goodCategories':[],
                    moduleStatus: [
                        {
                            text: '待启用',
                            value: 0
                        },
                        {
                            text: '审核中',
                            value: 1
                        },
                        {
                            text: '已驳回',
                            value: 3
                        },
                        {
                            text: '已启用',
                            value: 2
                        },

                    ],
                    forbiddenStatus: [
                        {
                            text: '否',
                            value: 0
                        },
                        {
                            text: '是',
                            value: 1
                        }
                    ],
                }
            }
        },
        created() {
            this.args.yid = this.yid
            this.getCommonOptions('31004','goodCategories','propertyName','propertyName')
        },
        methods: {

            tableLoaded: function (data) {
                this.submitAble = true
                if(this.oldDataSource.length == 0){
                    this.oldDataSource = data
                }
            },

            submitSearch: function (obj){
                let tabObj = this.$refs['selectQuoteDeliveryTable']

                let dataSource = this.oldDataSource
                let newDataSource = []
                if(dataSource.length ){

                    //重新赋值
                    newDataSource=dataSource

                    //字段查询
                    if(obj.cateGoryId != null  ){
                        newDataSource = newDataSource.filter((item, index) => {
                            return item.gdmName == obj.cateGoryId
                        })
                    }

                    if(obj.qiName != null){
                        newDataSource = newDataSource.filter((item, index) => {
                            if(item.qiName.indexOf(obj.qiName) > -1){
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
                //TODO 发起搜索请求
            },

            submit: function (){
                let tabObj = this.$refs['selectQuoteDeliveryTable']
                let selectedRow = tabObj.getSelectRow()

                if(selectedRow == null && this.currentRow == null ){
                    return this.$message({
                        'type' : 'warning',
                        'message': '请选择组合'
                    })
                }
                this.rowSelected(selectedRow || this.currentRow);
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
                this.$parent.handleCommandQuoteItemForAddDosageDetail(data);
                this.selectQuoteDeliveryDialogClose()
            },

            //关闭窗口
            selectQuoteDeliveryDialogClose: function () {
                this.$emit('close')
//                this.selectQuoteDeliveryVisible = false
                //dosomthing....
            },

            //获取辅助资料
            getCommonOptions: function(fatherCode,selectName, valueKey='id', textKey='propertyName') {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                apiCommon.queryUnionParent(arg).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus===1) {
                                list.push({
                                    value: item[valueKey],
                                    text: item[textKey],
                                    code: item["propertyCode"]
                                })
                            };
                        })
                        this.selectSource[selectName] = list
                    }
                })
            },
        }
    }
</script>
<style>
    .selectQuoteDelivery .t8t-table-container{
        height: 450px;
    }
</style>
