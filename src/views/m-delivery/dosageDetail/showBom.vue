/**
* Created by zack.liu on 2017/8/2.
*/
<template>
    <div class="selectQuoteTempItem">
        <el-dialog title="查看BOM组件" class="g-w-1000 my-el-dialog selectQuoteItemdialog" v-model="dialogVisible"  @close="closeSelectQuoteDialog">

            <t8t-table
                :columns="selectQuoteTempItemColumns"
                :service="selectQuoteTempItemService"
                :method="selectQuoteTempItemMethod"
                :commonData="commonData"
                :args="bomArgs"
                :indexCol="false"
                :radioCol="false"
                :selectable="selectable"
                :selectCol="false"
                style="height: 300px;"
                ref="selectQuoteItemTable"
                :pageBar="false"
            >
            </t8t-table>

            <div slot="footer">
                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-button  size="small"  @click="dialogVisible = false">返回</el-button>
                            <!-- <el-button  size="small"  type="primary" @click="submit()" :disabled="!submitAble">确认</el-button> -->
                        </div>
                    </el-col>
                </el-row>
            </div>


        </el-dialog>
    </div>
</template>
<script>
    import service from 'src/services/delivery/dosageDetail/Service.js'
    export default {
        props:['rowId'],
        name: "showBom",
        components: {},
        created(){
            //this.initData()

        },
        methods: {

            closeSelectQuoteDialog: function (){
                this.$emit('close')
            },

        },
        data(){
            return {
                rowId:null,
                selectQuoteTempItemService: service.home.name,
                selectQuoteTempItemMethod: service.home.methods.QUERY,
                bomArgs:{"dosageDetailDTO":{'detailId':this.rowId}},
                selectQuoteTempItemColumns: [
                    { "prop":'id', "label":'用量明细ID',resizable:false,width:85},
                    { "prop":'deliveryId', "label":'商品ID',resizable:false,width:100},
                    /*{ "prop":'', "label":'商家名称',resizable:false,width:100},*/
                    { "prop":'goodsName', "label":'商品名称',resizable:false,width:100},
                    { "prop":'model', "label":'商品型号',resizable:false},
                    { "prop":'standard', "label":'商品规格',resizable:false,width:100},
                    { "prop":'brandName', "label":'品牌',resizable:false,width:100},
                    { "prop":'estimateAmount', "label":'预计用量',resizable:false,width:100},
                    { "prop":'actualAmount', "label":'实际用量',resizable:false,width:80},
                    { "prop":'basicUnitName', "label":'单位',resizable:false,width:100},
                ],
                currentRow:null,
                submitAble:false,
                dialogVisible:true

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
