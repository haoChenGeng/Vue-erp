/**
* Created by tomy.li on 2017年7月11日.
*/
<template>
    <div>
        <el-dialog title="选择工费项" class="g-w-1000 my-el-dialog selectQuoteItemdialog" v-model="addGoodsDialogVisible" @close="closeSelectQuoteDialog">
            <t8t-search
                ref="search"
                :fields="fields"
                :selectSource="selectSource"
                :showToggleBtn="true"
                @submit="submitSearch"
            >
            </t8t-search>

                    <t8t-table
                        :columns="mainTableColumns"
                        :service="mainTableService"
                        :method="mainTableMethod"
                        :commonData="commonData"
                        :args="args"
                        :indexCol="false"
                        :radioCol="false"
                        style="min-height: 300px;"
                        ref="t8ttable"
                        :pageBar="true"
                        @row-double-click="selectRow"
                        @row-click="onRowClick"
                        @selection-change="selectionChange"
                        :selectable="selectable"
                    >
                    </t8t-table>


            <div slot="footer">

                <el-row type="flex" justify="center">
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-button  size="small"  @click="addGoodsDialogVisible = false">取消</el-button>
                            <el-button  size="small"  type="primary" @click="submit()">确认</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    // import T8tSearch from 'src/components/t8t-search/t8t-search.vue'
    import quoteitem from 'src/services/worker/quoteitem/quoteitem.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import TemplateOperator from 'src/services/worker/categorysearch/base-method.js'
    import quoteitemServices from 'src/services/worker/quoteitem/Service.js'
    import packtempServices from 'src/services/worker/packtemp/Service.js'
    import config from './config.js'
    import expenseDictionary from 'src/services/delivery/expenseDictionary/Service.js'
    export default{
        // props:['activeTableRef'],
        name: 'selectQuoteItem',
        components: {
            // T8tSearch
        },
        props: {
            // getAddGoodsDialogVisible: {
            //     type: Boolean,
            //     default: true
            // }
            skuId: {
                type: String,
                default: ''
            },
            orgId: {
                type: String,
                default: ''
            },
            pkg: {
                type: String,
                default: ''
            },
            pkgTemp: {
                type: String,
                default: ''
            },
            workType: {
                type: String,
                default: ''
            },
            activeTableRef: {
                type: String,
                default: ''
            }
        },
        // watch: {
        //     getAddGoodsDialogVisible: function(val, old) {
        //         this.addGoodsDialogVisible = val
        //     }
        // },
        data(){
            return {
                addGoodsDialogVisible: true,
                activeTableRef:'',
                goodsGroups: [],
                userId:+Cookie.get('t8t-tc-uid'),
                mainTableColumns:[
                    {
                        "prop": "itemCode",
                        "label": "工费项编码"
                    },
                    {
                        "prop": "itemName",
                        "label": "工费项名称"
                    },
                    {
                        "prop": "unitQuota",
                        "label": "单位定额"
                    },
                   /* {
                        "prop": "shopName",
                        "label": "商家名称"
                    }*/
                ],
                mainTableService:expenseDictionary.TEMPLATE.name,
                mainTableMethod:expenseDictionary.TEMPLATE.methods.expenseMatchQuotaQueryPage,
                args:{search:{quotaStatus:0}},
                commonData: {
                },
                formData:{
                    'tempName': '',
                    'orgId': null,
                    'pkgId': '',
                    'createUser':+Cookie.get('t8t-tc-uid'),
                },
                formCommonData:{
                },
                selectSource: {
                },
                dataSource:{
                },
                fields:[
                    {
                        name: 'itemCode',
                        placeholder: '工费项编码',
                        type: 'input',
                    },
                    {
                        name: 'itemName',
                        placeholder: '工费项名称',
                        type: 'input',
                    },
                    {
                        name: 'unitQuota',
                        placeholder: '单位定额',
                        type: 'input',
                    },
                ],
                treedata:[],
                defaultProps: {
                  children: 'children',
                  label: 'label'
                }
            }
        },
        created() {
            this.args.search.organizationId = this.orgId
            this.args.search.pkg = this.pkg
            this.args.search.pkgTemp = this.pkgTemp
            this.args.search.workType = this.workType
        },
        methods: {

            //选中行
            selectRow(row, event){

                this.addRow(row)
                this.cancel()
            },

            closeSelectQuoteDialog() {
                this.$emit('close')
            },

            onRowClick(row){
            },
            selectionChange(selection){
                let tab = this.$refs['t8ttable']
                selection.forEach((row, index) => {
                    if( !this.isCanSkuSelection(row) ){
                        tab.toggleRowSelection(row, false)
                    }
                })
            },

            submit(){
                let tableObj = this.$refs['t8ttable']
                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '未选择商品'
                    })
                    return false
                }
                selections.forEach((item) => {
                    this.addRow(item)
                })
                this.cancel()

            },

            addRow(row){
                let tempdata =  {
                    expenseQuotaItemId: row.id,
                    expenseQuotaItemName: row.itemName,
                }
                let tableObj = this.$parent.$refs[this.activeTableRef]
                Object.assign(tableObj.templateData,tempdata);
                if (!this.skuId) {
                    tableObj.addNewRow()
                } else {
                    this.$parent.currentRow = Object.assign(this.$parent.currentRow, tempdata)
                    this.$parent.$refs[this.activeTableRef].editedRows.push(this.$parent.currentRow)
                }
            },

            cancel : function (){
                this.addGoodsDialogVisible = false
                this.$parent.closeSelectGoodsDialog()
            },

            submitSearch(objForm) {

                let obj = Object.assign({},objForm);

                let argsObj = Object.assign({},this.args)

                argsObj.search = obj;
                argsObj.search.quotaStatus = 0
                argsObj.search.organizationId = this.orgId
                argsObj.search.pkg = this.pkg
                argsObj.search.pkgTemp = this.pkgTemp
                argsObj.search.workType = this.workType

                this.args = argsObj;
            },

            selectable(row, index){
                return this.isCanSkuSelection(row)
            },
            isCanSkuSelection(row){
                return true
                return  row.salesPriceFlag == 3
            }

        }
    }

</script>

<style lang="css" scoped>
    .g-main-container-column{

    }
    .selectQuoteItemdialog{}
    .my-el-dialog .el-dialog{width:1300px  !important;}
    .worker-sku-goods-contain{margin-left: 10px!important;}
    .worker-sku-goods-tree{max-height: 340px; overflow: auto;font-size:12px !important;}
</style>

