<template>
    <t8t-table
        ref="t8tTable"
        :columns="columns"
        :dataSource="dataSource"
        :templateData="templateData"
        @cell-click="handleFormItemBlur"
        @cell-editor-change="cellEditorChange"
        :selectCol="true"
        :indexCol="true"
        :editable="editable"
        :pageBar="false"
        :formatters = "{taxRateCallback:taxRateCallback}"
    >
    </t8t-table>
</template>
<script>
    import Cookie from 'js-cookie';
    import * as Config from './config'
    export default {
        name: 'invoice-table',
        created(){

        },
        data() {
            return {
                templateData: {
                    goodsCode:null,
                    goodsName:null,
                    goodsId:null,
                    baseUnitId:39,
                    baseUnitName:null,
                    taxRate:0.00,
                    invoiceCount:0,
                    taxPrice:0.00,
                    noTaxAmount:0.00,
                    noTaxPrice:0.00,
                    taxDiff:0.00,
                    taxAmount:0.00,
                    createUser: parseInt(Cookie.get('t8t-tc-uid'))
                }
            }
        },

        props: {
            columns:Array,
            dataSource:Array,
            editable: {
                type: Boolean,
                default: false
            },
        },

        methods:{
            //表格回调
            taxRateCallback(val){
                return parseFloat(val * 100).toFixed(0) + '%';
            },
            addNewRow(){
                this.$refs['t8tTable'].addNewRow()
            },
            delRows() {
                this.$refs['t8tTable'].delRows()
                this.updateTotalTaxAmount();
            },

            handleFormItemBlur(row, column, cell, event) {
                let req = column.property;
                let priceArr = ["taxRate", "invoiceCount", "taxPrice"];
                if(priceArr.includes(req))
                {
                    if(req == 'invoiceCount'){
                        row[req] = parseInt(row[req]);
                    }else{
                        row[req] = parseFloat(row[req]);
                    }
                }
            },

            //编辑时验证方法
            cellEditorChange(cell, val){
                let req = cell.column.property
                let goodsArr = ["skuId","goodsCode","goodsName"]
                let queryRows = cell.row[req]
                if(goodsArr.includes(req))
                {
                    goodsArr.forEach((item) => {
                        if(req != item)
                        {
                            if(queryRows[item]) cell.row[item] = queryRows[item]
                        }
                    })
                    if(queryRows[req]){
                        cell.row[req] = queryRows[req]
                    }

                    if(queryRows["id"]){
                        cell.row["goodsId"] = queryRows["id"]
                    }
                    if(queryRows["skuId"]){
                        cell.row["goodsSku"] = queryRows["skuId"]
                    }
                    if(queryRows["basicUnit"]){
                        cell.row["baseUnitId"] = queryRows["basicUnit"]
                    }
                    if(queryRows["basicUnitName"]){
                        cell.row["baseUnitName"] = queryRows["basicUnitName"]
                    }
                    if(queryRows["taxRate"]){
                        cell.row["taxRate"] = queryRows["taxRate"]
                    }
                }


                let priceArr = ["taxRate", "invoiceCount", "taxPrice"];
                if(priceArr.includes(req))
                {
                    if(req == 'invoiceCount'){
                        if(Number.isNaN(parseInt(cell.row[req]))) {
                            return false;
                        }
                    }else{
                        if(Number.isNaN(parseFloat(cell.row[req]))) {
                            return false;
                        }
                    }
                    cell.row["taxRate"] = parseFloat(cell.row["taxRate"]);

                    cell.row["invoiceCount"] = parseInt(cell.row["invoiceCount"]);
                    cell.row["taxPrice"] = parseFloat(cell.row["taxPrice"]);

                    //含税金额（taxAmount） = 含税单价*数量（invoiceCount）
                    cell.row["taxAmount"] = parseFloat(cell.row["taxPrice"]) * parseFloat(cell.row["invoiceCount"]);
                    //不含税金额（noTaxAmount） = 含税金额/(1+税率（taxRate））
                    cell.row["noTaxAmount"] = parseFloat(parseFloat(cell.row["taxAmount"]) / (1 + parseFloat(cell.row["taxRate"]))).toFixed(2);
                    //税额（taxDiff） = 含税金额-不含税金额
                    cell.row["taxDiff"] = parseFloat(parseFloat(cell.row["taxAmount"]) - (parseFloat(cell.row["noTaxAmount"]))).toFixed(2);
                    //不含税单价（noTaxPrice） = 含税单价（taxPrice）/（1+税率）
                    cell.row["noTaxPrice"] = parseFloat(cell.row["taxPrice"]) / (1 + parseFloat(cell.row["taxRate"]));

                    cell.row["taxAmount"] = parseFloat(cell.row["taxAmount"]).toFixed(2);
                    cell.row["noTaxAmount"] = parseFloat(cell.row["noTaxAmount"]).toFixed(2);
                    cell.row["taxDiff"] = parseFloat(cell.row["taxDiff"]).toFixed(2);
                    cell.row["noTaxPrice"] = parseFloat(cell.row["noTaxPrice"]).toFixed(2);


                    this.updateTotalTaxAmount();
                }
            },

            //计算价税合计
            updateTotalTaxAmount(){
                let totalTaxAmount = 0;
                this.dataSource.forEach(function (reg) {
                    totalTaxAmount += parseFloat(reg.taxAmount);
                })

                this.$emit('totalTaxAmount', totalTaxAmount);
            }
        }
    }


</script>
