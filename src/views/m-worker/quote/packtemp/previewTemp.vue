/**
* Created by tomy.li on 2017/5/19.
*/
<template>
    <div>
        <el-dialog id="previewTemp" size="full" class="g-w-full my-el-dialog previewTemp" v-model="previewTempDialogVisible" >
            <t8t-table
                :columns="mainTableColumns"
                :service="mainTableService"
                :method="mainTableMethod"
                :args="args"
                :dataSource="tableData"
                :indexCol="false"
                :selectCol="false"
                :pageBar="false"
                ref="t8ttable"
            >
                <template slot="tempName" scope="scope">
                    <a :href="'#/tuchat-worker/quote-packtemp-view?tempCode=' + scope.row['tempCode']" style="text-decoration: none;">{{ scope.row['tempName'] }}</a>
                </template>
            </t8t-table>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "previewTemp",
        components: {},
        created: function(){
            this.tableData = this.initTableData()
        },
        mounted(){
            this.mergeTableRow()
        },
        /*watch: {
            tableData: function(val,oldVal){
                this.tableData = val
            }
        },*/
        data(){
            return {
                previewTempDialogVisible:true,
                tableData:[],
                mainTableColumns:[
                    {
                        "prop": "spaceId",
                        "label": "使用空间"
                    },
                    {
                        "prop": "placeId",
                        "label": "位置"
                    },
                    {
                        "prop": "rowNo",
                        "label": "序号"
                    },
                    {
                        "prop": "qiName",
                        "label": "报价项名称"
                    },
                    {
                        "prop": "skuId",
                        "label": "SKU"
                    },
                    {
                        "prop": "lowerLimit",
                        "label": "数量下限"
                    },
                    {
                        "prop": "upperLimit",
                        "label": "数量上限"
                    },
                    {
                        "prop": "qiUnit",
                        "label": "单位"
                    },
                    {
                        "prop": "pkgUnitPrice",
                        "label": "单价"
                    },
                    {
                        "prop": "tempItemType",
                        "label": "是否标准"
                    },
                    {
                        "prop": "amountEquationId",
                        "label": "数量公式名称"
                    },
                    {
                        "prop": "gdMappingStatus",
                        "label": "用量关系状态"
                    },
                ],
                mainTableService:'',
                mainTableMethod:'',
                args:{}
            }
        },
        methods: {

            initTableData: function()
            {
                let data = [
                    {
                        'spaceId':'a1',
                        'placeId':"b11",
                        'rowNo':1,
                        'qiName':"d1",
                        'skuId':"e1",
                        'lowerLimit':"f1",
                        'upperLimit':"g1",
                        'qiUnit':"g1",
                        'pkgUnitPrice':"g1",
                        'tempItemType':"g1",
                        'amountEquationId':"g1",
                        'gdMappingStatus':"ag1",
                    },
                    {
                        'spaceId':'a1',
                        'placeId':"b2",
                        'rowNo':1,
                        'qiName':"d1",
                        'skuId':"e1",
                        'lowerLimit':"f1",
                        'upperLimit':"g1",
                        'qiUnit':"g1",
                        'pkgUnitPrice':"g1",
                        'tempItemType':"g1",
                        'amountEquationId':"g1",
                        'gdMappingStatus':"ag1",
                    },
                    {
                        'spaceId':'a1',
                        'placeId':"b3",
                        'rowNo':1,
                        'qiName':"d1",
                        'skuId':"e1",
                        'lowerLimit':"f1",
                        'upperLimit':"g1",
                        'qiUnit':"g1",
                        'pkgUnitPrice':"g1",
                        'tempItemType':"g1",
                        'amountEquationId':"g1",
                        'gdMappingStatus':"ag1",
                    },
                    {
                        'spaceId':'c1',
                        'placeId':"b4",
                        'rowNo':1,
                        'qiName':"d1",
                        'skuId':"e1",
                        'lowerLimit':"f1",
                        'upperLimit':"g1",
                        'qiUnit':"g1",
                        'pkgUnitPrice':"g1",
                        'tempItemType':"g1",
                        'amountEquationId':"g1",
                        'gdMappingStatus':"cg1",
                    },
                    {
                        'spaceId':'a1',
                        'placeId':"b5",
                        'rowNo':1,
                        'qiName':"d1",
                        'skuId':"e1",
                        'lowerLimit':"f1",
                        'upperLimit':"g1",
                        'qiUnit':"g1",
                        'pkgUnitPrice':"g1",
                        'tempItemType':"g1",
                        'amountEquationId':"g1",
                        'gdMappingStatus':"ag1",
                    },
                    {
                        'spaceId':'c1',
                        'placeId':"b6",
                        'rowNo':1,
                        'qiName':"d1",
                        'skuId':"e1",
                        'lowerLimit':"f1",
                        'upperLimit':"g1",
                        'qiUnit':"g1",
                        'pkgUnitPrice':"g1",
                        'tempItemType':"g1",
                        'amountEquationId':"g1",
                        'gdMappingStatus':"cg1",
                    },
                ]

                //按spaceId排序
                data.sort(function (a,b){return a['spaceId'] > b['spaceId']})

                return data

            },
            mergeTableRow(){

                let tableData =   Object.assign([],this.tableData)

                let formatData = {}

                if( tableData ){

                    tableData.forEach((item) => {
                        formatData[item['spaceId']] = formatData[item['spaceId']] || []

                        //是否是重复的行:当spaceId值在其他行已经存在，就表示此列重复， 以此来实现合并行
                        item['repeatCell'] = formatData[item['spaceId']].length ?  true : false

                        //以使用空间为维度合并数据
                        formatData[item['spaceId']].push(item)

                    })

                    for (let item in tableData){
                        try {
                            let selectorTd = document.querySelectorAll('.t8t-table-container tbody tr')[item].querySelector('td')

                            if( tableData[item]['repeatCell'] == false ){
                                selectorTd.setAttribute('rowspan',formatData[tableData[item]['spaceId']].length)
                                selectorTd.style.lineHeight = (formatData[tableData[item]['spaceId']].length * selectorTd.style.lineHeight)
                            }else{
                                selectorTd.remove()
                            }
                        }catch (e){
                            console.log(e)
                            console.log(document.querySelectorAll('.t8t-table-container tbody'))
                        }

                    }


                }


            }
        },


    }
</script>
