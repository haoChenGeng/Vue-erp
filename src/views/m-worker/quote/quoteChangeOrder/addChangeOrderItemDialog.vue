/**
* Created by tomy.li on 2017/9/11.
*/
<template>
    <div class="addChangeOrderItemDialogMain">
        <el-dialog class="g-w-1000 my-el-dialog addChangeOrderItemDialog" :title="title" v-model="addItemDialogVisible" @close="closeAddItemDialog">
            <t8t-search
                ref="addChangeOrderItemDialogForm"
                :fields="fields"
                :selectSource="formData"
                :showToggleBtn="false"
                @submit="submitSearch"
            >
            </t8t-search>
            <t8t-grid
                :columns="mainTableColumns"
                :service="mainTableService"
                :method="mainTableMethod"
                :args="args"
                :radioCol="false"
                style="min-height: 300px;"
                ref="addChangeOrderItemTable"
                @row-double-click="handlerDoubleClick"
                @current-row-change="handleCurrentRowChange"
            ></t8t-grid>
            <div slot="footer">
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-button  size="small"  @click="addItemDialogVisible = false">取消</el-button>
                            <el-button  size="small"  type="primary" @click="submit()">确认</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import service from 'src/services/worker/quoteChangeOrder/Service.js'
    import config from 'src/views/m-worker/quote/quoteChangeOrder/config.js'
    export default {
        name: "addChangeOrderItemDialog",
        components: {},
        props:["addItemType","tempCode","orgId","yid",'spaces','places'],
        created() {
            this.initParams()

            this.formData.spaces = this.spaces
            this.formData.places = this.places

        },
        mounted(){},

        methods: {
            //初始化页面变量参数
            initParams: function (){

                switch (this.addItemType){
                    case 'plus':
                        this.mainTableMethod = service.order.methods.addList
                        this.fields = config.addPlusItemFormFields
                        this.mainTableColumns = this.columns1
                        this.title = '添加增项'
                        this.args = {
                            'dto':{
                                'orgId':this.orgId,
                                'tempCode':this.tempCode,
                            }
                        }
                        break;
                    case 'sub':
                        this.mainTableMethod = service.order.methods.subList
                        this.fields = config.addSubItemFormFields
                        this.mainTableColumns = this.columns2
                        this.title = '添加减项'
                        this.args = {
                            'dto':{
                                'yid':this.yid,
                            }
                        }
                        break;
                    default:
                        this.mainTableMethod = ''
                        break;

                }
            },

            //选择确认按钮
            submit: function (){
                let tabObj = this.$refs['addChangeOrderItemTable']
                let selectedRow = tabObj.getSelectRows()

                if(selectedRow.length == 0 && this.currentRow == null ){
                    return this.$message({
                        'type' : 'warning',
                        'message': '请选择报价项'
                    })
                }

                let datas = selectedRow || [this.currentRow] || []
                if( datas.length ){
                    datas.forEach(item => {
                        this.submitSelectRow(item);
                    })
                }

                this.closeAddItemDialog()
            },

            handlerDoubleClick: function (item){
                this.submitSelectRow(item)
                this.closeAddItemDialog()
            },

            //选择行确认提交
            submitSelectRow: function (item){
                let newItem = {
                    tempItemId: item.id,
                    itemPriceId: item.itemPriceId,
                    orderSpaceId: item.orderSpaceId || null,
                    qiName:item.qiName,
                    qiUnit:item.qiUnit,
                    price: item.price,
                    craftDetails: item.craftDetails,
                    upperLimit:item.upperLimit || item.amount || 0,
                    lowerLimit:item.lowerLimit || 0,
                    spaceId:item.spaceId || 0,
                    placeId:item.placeId || 0,
                }
                this.$parent.handlerAddItem(newItem)
            },

            //表单搜索
            submitSearch: function (objForm){
                let formData = Object.assign({},objForm);
                let args = Object.assign({},this.args);
                let dto = Object.assign(args.dto,formData);
                args.dto = dto
                this.args = args
            },

            //选中行事件
            handleCurrentRowChange: function(row,oldRow){
                this.currentRow = row
            },
            closeAddItemDialog: function (){
                this.$emit('close')
            }
        },
        data() {
            return {
                title:'',
                mainTableColumns:[],
                mainTableService:service.order.name,
                mainTableMethod:'',
                args:{
                    'dto':{
                        'orgId':this.orgId,
                        'tempCode':this.tempCode,
                    }
                },
                addItemDialogVisible: true,
                fields:[],
                formData:{
                    'places': [],
                    'spaces': [],
                },
                selectSource:{},

                columns1:[
                    {
                        prop:'qiName',
                        label:'报价项名'
                    },
                    {
                        prop:'qiUnit',
                        label:'单位'
                    },
                    {
                        prop:'price',
                        label:'单价'
                    },
                    {
                        prop:'craftDetails',
                        label:'工艺详情'
                    }
                ],
                columns2:[
                    {
                        prop:'qiName',
                        label:'报价项名'
                    },
                    {
                        prop:'qiUnit',
                        label:'单位'
                    },
                    {
                        prop:'price',
                        label:'单价'
                    },
                    {
                        prop:'spaceName',
                        label:'空间'
                    },
                    {
                        prop:'placeName',
                        label:'位置'
                    },
                ]
            }
        }

    }
</script>

<style lang="css" scoped>
    .addChangeOrderItemDialog{}
</style>
