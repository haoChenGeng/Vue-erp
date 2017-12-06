<template>
    <t8t-table
        ref="t8tTable"
        :columns="columns"
        :dataSource="dataSource"
        :templateData="templateData"
        @cell-click="handleFormItemBlur"
        @cell-editor-change="cellEditorChange"
        @data-loaded="handleDataLoaded"
        :selectCol="true"
        :indexCol="true"
        :editable="editable"
        :pageBar="false"
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
                    baseUnitId:0,
                    baseUnitName:null,
                    taxRate:0,
                    invoiceCount:0,
                    taxPrice:0.00,
                    noTaxAmount:0.00,
                    noTaxPrice:0.00,
                    taxDiff:0.00,
                    taxAmount:0.00,
                    createUser: parseInt(Cookie.get('t8t-tc-uid'))
                },
                selectIdArray : []
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
            handleDataLoaded(data){
                data.forEach(function (item,index) {
                    item._index = index+1
                })
            },
            addNewRow(){
                this.$refs['t8tTable'].addNewRow()
            },
            delRows() {
                let _this = this
                let selectedRows = this.$refs['t8tTable'].selectedRows;
                if(selectedRows.length > 0) {
                    selectedRows.forEach((item,key)=>{
                        if(item.goodsId > 0 && _this.selectIdArray.includes(item.goodsId)) {
                            if(_this.selectIdArray.length > 0) {
                                for (let i = 0;i<_this.selectIdArray.length; i++) {
                                    if(_this.selectIdArray[i] === item["goodsId"]) {
                                        _this.selectIdArray.splice(i, 1)
                                    }
                                }
                            }
                        }
                    })
                }
                this.$refs['t8tTable'].delRows()
                this.updateTotalTaxAmount();
            },

            handleFormItemBlur(row, column, cell, event) {
                let req = column.property;
                let priceArr = ["taxRate", "invoiceCount", "taxPrice", "taxAmount"];
                if(priceArr.includes(req))
                {
                    row[req] = parseFloat(row[req]);
                }
            },

            //编辑时验证方法
            cellEditorChange(cell, val){
                let req = cell.column.property
                let goodsArr = ["goodsSku", "goodsCode", "goodsName"]
                let queryRows = cell.row[req]

                let _this = this
                if(goodsArr.includes(req))
                {
                    if(cell.row["goodsId"] > 0 && queryRows.id !== undefined) {
                        let deleteIndex = -1;
                        if(_this.selectIdArray.length > 0) {
                            for (let i = 0;i<_this.selectIdArray.length; i++) {
                                if(_this.selectIdArray[i] === cell.row["goodsId"]) {
                                    deleteIndex = i;
                                }
                            }
                        }
                        deleteIndex >= 0 ? _this.selectIdArray.splice(deleteIndex, 1) : false;
                    }
//                    queryRows.id !== undefined ? _this.selectIdArray.push(queryRows.id) : false

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
                        cell.row["taxRate"] = parseInt(queryRows["taxRate"] * 100)
                    }
                }


                let priceArr = ["taxRate", "invoiceCount", "taxPrice","taxAmount"];
                if(priceArr.includes(req))
                {
                    if(Number.isNaN(parseFloat(cell.row[req]))) {
                        cell.row[req] = 0;
                        return false;
                    }
                    cell.row["taxRate"] = parseFloat(cell.row["taxRate"]);
                    cell.row["invoiceCount"] = parseFloat(cell.row["invoiceCount"]);
                    cell.row["taxPrice"] = parseFloat(cell.row["taxPrice"]);
                    cell.row["taxAmount"] = parseFloat(cell.row["taxAmount"]);
                    if(req == "taxAmount") {
                        if(parseFloat(cell.row["invoiceCount"]) == 0) {
                            cell.row["taxPrice"] = 0;
                        }else{
                            cell.row["taxPrice"] = parseFloat(parseFloat(cell.row["taxAmount"]) / parseFloat(cell.row["invoiceCount"]));
                        }
                    }else{
                        cell.row["taxAmount"] = parseFloat(parseFloat(parseFloat(cell.row["taxPrice"]) * parseFloat(cell.row["invoiceCount"])).toFixed(2));
                    }
                }
                let useTaxRate = parseFloat(parseFloat(cell.row["taxRate"]) / 100).toFixed(2);
                //含税金额（taxAmount） = 含税单价*数量（invoiceCount）
//                cell.row["taxAmount"] = parseFloat(parseFloat(cell.row["taxPrice"]) * parseFloat(cell.row["invoiceCount"])).toFixed(2);
//                cell.row["taxAmount"] = parseFloat(parseFloat(cell.row["taxPrice"]) * parseFloat(cell.row["invoiceCount"]));
                //不含税金额（noTaxAmount） = 含税金额/(1+税率（taxRate））
                cell.row["noTaxAmount"] = parseFloat(parseFloat(cell.row["taxAmount"]) / (1 + parseFloat(useTaxRate))).toFixed(2);
                //税额（taxDiff） = 含税金额-不含税金额
                cell.row["taxDiff"] = parseFloat(parseFloat(cell.row["taxAmount"]) - (parseFloat(cell.row["noTaxAmount"]))).toFixed(2);
                //不含税单价（noTaxPrice） = 含税单价（taxPrice）/（1+税率）
                cell.row["noTaxPrice"] = parseFloat(parseFloat(cell.row["taxPrice"]) / (1 + parseFloat(useTaxRate))).toFixed(2);

                //参照对账单新增  （如果有shouldSettleAmount，代表不是手动新增，可以更新  发票调整金额（不含税））
                //5、【发票调整金额不含税】根据公式=（发票含税单价*本次核销数量）/（1+发票税率）-对账单调整金额（不含税）
                if(cell.row["shouldSettleAmount"] !== undefined) {
//                    cell.row["invoiceAdjustAmount"] = parseFloat((cell.row["taxAmount"] - cell.row["shouldSettleAmount"])/(1+parseFloat(useTaxRate))).toFixed(2);
                    cell.row["invoiceAdjustAmount"] = parseFloat((parseFloat(cell.row["taxPrice"]) * parseFloat(cell.row["invoiceCount"]))/(1+parseFloat(useTaxRate)) - parseFloat(cell.row["reconAdjustAmount"])).toFixed(2);
                }
                this.updateTotalTaxAmount();
            },

            //计算价税合计
            updateTotalTaxAmount(){
                let totalTaxAmount = 0;
                this.dataSource.forEach(function (reg) {
                    totalTaxAmount += parseFloat(reg.taxAmount);
                })
                totalTaxAmount = parseFloat(totalTaxAmount).toFixed(2);

                this.$emit('totalTaxAmount', totalTaxAmount);
            }
        },

        watch:{
            //监听dataSource ,把选中的商品ID储存下来
            dataSource: function (val) {
                let _this = this
                if(val.length > 0) {
                    val.forEach((item,key)=>{
                        if(item.goodsId > 0 && !_this.selectIdArray.includes(item.goodsId)) {
                                _this.selectIdArray.push(item.goodsId)
                        }
                    })
                }

            }
        }
    }


</script>
