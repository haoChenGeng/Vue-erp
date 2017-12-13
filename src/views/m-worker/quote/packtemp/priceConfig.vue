<template>
    <div class="packtemppriceconfig">
        <el-dialog  size="full" class="my-el-dialog t8t-full-dialog"  v-model="priceConfigDialogVisible" @close="closeDialog">
            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                    <!--暂存-->
                    <t8t-toolbar class="t8t-dark" :symbolList="['EXPORT','IMPORT','SUBMIT']"
                                 @EXPORT="exportFun()"
                                 @IMPORT="importFun()"
                                 @SUBMIT="submit()"
                                 :disabledSymbols="disabledSymbols"
                    ></t8t-toolbar><!--顶部工具栏-->
                </div>
            </div>

            <t8t-form-panel
                :dataSource="tempHeadFormData"
                :fields="tempHeadFormFields"
                :commonData="tempHeadFormCommonData"
                ref="mainForm"
            >
            </t8t-form-panel>
            <div class="g-main-container-column">
                <t8t-table
                    :columns="mainTableColumns"
                    :service="mainTableService"
                    :method="mainTableMethod"
                    :commonData="selectSource"
                    :args="args"
                    :indexCol="false"
                    :selectCol="false"
                    ref="mainTable"
                    :templateData="templateData"
                    :pageBar="false"
                    :editable="true"
                    style="min-height: 650px;"
                >
                </t8t-table>
            </div>
        </el-dialog>
        <importDialog
            v-if="importPriceVisible"
            @close="closeImportPriceDialog"
            @open="importPriceVisible=true"
            :tempCode="tempCode"
        >
        </importDialog>
    </div>
</template>
<script>
    import DateUtils from 'src/utils/DateUtils.js'
    import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
    import Cookie from 'js-cookie'
    // import T8tSearch from 'src/components/t8t-search/t8t-search.vue'
    import packtemp from 'src/services/worker/packtemp/packtemp.js'
    import priceMethods from 'src/services/worker/IProductPkgTempPrice/methods.js'
    import priceServices from 'src/services/worker/IProductPkgTempPrice/Service.js'
    import config from './config.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import importDialog from 'src/views/m-worker/quote/packtemp/importDialog.vue'
    import exportUtils from 'src/utils/export.js'
    export default {
        name: "packtemppriceconfig",
        components: {
            // T8tSearch,
            importDialog
        },
        data(){

            return {
                accountId:+Cookie.get('t8t-tc-uid'),
                priceConfigDialogVisible:true,
                importPriceVisible:false,
                mainTableService: priceServices.price.name,
                mainTableMethod: priceServices.price.methods.searchPrice,
                args: {},
                exportHeader:'',
                exportSorts:'',
                tempItemType:0,

                //列表列的配置
                mainTableColumns:[
                    {
                        label:'面积下限（包含）',
                        prop:'lowerArea',
                        width:150,
                        fixed:'left'
                    },
                    {
                        label:'面积上限（包含）',
                        prop:'upperArea',
                        width:150,
                        fixed:'left'
                    },
                ],
                tempHeadFormCommonData: {
                    organizes:[],
                    mould_status:config.datas.mould_status,
                    productPackages:[],
                    item_price_status:config.datas.item_price_status
                },
                tempHeadFormFields:[
                    {
                        prop: 'tempCode',
                        label: '产品包模板编码',
                        type: 'input',
                        disabled:true,
                    },
                    {
                        prop: 'tempName',
                        label: '产品包模板名',
                        type: 'input',
                        disabled:true,
                    },
                    {
                        prop: 'effectTime',
                        label: '生效时间',
                        type: 'datetime',
                        disabled:true,
                       /* rules: [{
                            required: true,
                            message: '不能为空'
                        }]*/
                    },
                    {
                        prop: 'priceStatus',
                        label: '状态',
                        type: 'select',
                        disabled:true,
                        list:'item_price_status',
                    },

                ],
                tempHeadFormData:{},
                accountId:+Cookie.get('t8t-tc-uid'),
                tempId:null,
                tempCode:null,
                commonData: config.datas,
                formData:{},
                selectSource:{
                    organizes:[],
                    mould_status:config.datas.mould_status,
                    dosage_mapping_status:config.datas.dosage_mapping_status,
                    temp_item_status:config.datas.temp_item_status,
                    item_price_status:config.datas.item_price_status,
                    productPackages:[],
                    spaces:[],
                    places:[],
                    amountEquations:[{
                        'text': '默认',
                        'value': 1
                    }],
                },
                disabledSymbols:['SUBMIT']
            }
        },
        created(){

            this.tempCode = this.$route.query.tempCode
            //模板id
            this.args = {
                tempPrice:{
                    'tempCode':this.tempCode,
                    "priceStatuses":[0,1,2],
                    "versionStatuses":[0,1]
                }
            }

            this.initTempInfo()
            this.initColumns()

            //动态获取形态为分公司的组织
        },
        methods: {

            //导出数据
            exportFun(){
                exportUtils({
                    service:priceServices.price.name,
                    method: priceServices.price.methods.searchPrice,
                    args:this.args,
                    headers:this.exportHeader,
                    sorts:this.exportSorts
                })
            },

            //下载导入模板
            downloadTemplate(){
                exportUtils({
                    service:priceServices.price.name,
                    method: priceServices.price.methods.searchPrice,
                    args:{tempPrice:{'tempCode':'MB201705221000',isTemp:'1'}},
                    headers:this.exportHeader,
                    sorts:this.exportSorts
                })
            },

            importFun(){
                this.importPriceVisible = true
            },

            submit(){

                if( this.tempHeadFormData['priceStatus'] == 0 ){

                    this.disabledSymbols.push('SUBMIT')

                    priceMethods.submitPrice({
                        'tempCode' :this.tempCode,
                        'updateUser': this.accountId
                    }).then((res) => {
                        if( res.data.status == 200 ){
                            this.$message({
                                type: 'success',
                                message: '提交成功'
                            })
                            this.disabledSymbols.shift(this.disabledSymbols.indexOf('SUBMIT'))
                            this.tempHeadFormData['priceStatus'] = 1
                            this.initTempInfo()
                            /*let router = this.$router
                             this.$router.push({path:router.history.current.path,query:router.history.current.query})*/
                        }else{

                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: res.data.result,
                            })
                            this.disabledSymbols.shift(this.disabledSymbols.indexOf('SUBMIT'))
                        }
                    })

                }else{
                    this.$message({
                        type: 'error',
                        message: '仅可将状态为“待启用”的价格提交'
                    })
                }
            },
            closeImportPriceDialog(){
                this.importPriceVisible = false
            },
            initTempInfo(){
                packtemp.getTempInfoByCode(this.tempCode).then((res) => {
                    if( res.data.status == 200 ){
                        if(res.data.result.rows.length > 0){
                            let tempHead = res.data.result.rows[0]

                            let headInfo = {tempCode:tempHead['tempCode'],tempName:tempHead['tempName']}

                            this.tempHeadFormData = Object.assign({},headInfo)

                            priceMethods.searchPrice({
                                'tempCode':this.tempCode,
                                "priceStatuses":[0,1,2],
                                "versionStatuses":[0,1]}
                            ).then((res1) => {
                                if( res1.data.status == 200 ){
                                    if(res1.data.result.rows.length > 0){
                                        let priceData = res1.data.result.rows[0]
                                        if( priceData.hasOwnProperty('priceStatus') ){
                                            priceData['priceStatus']  = parseInt(priceData['priceStatus'])
                                            priceData['effectTime'] = priceData['effectTime'] == 0 ? '' :   DateUtils(priceData['effectTime']*1000, 'yyyy-mm-dd HH:MM')
                                        }

                                        this.tempHeadFormData =  Object.assign(this.tempHeadFormData, priceData)

                                        this.tempHeadFormData = Object.assign({},this.tempHeadFormData)

                                        if( this.tempHeadFormData['priceStatus'] == 0 ){
                                            this.disabledSymbols.shift(this.disabledSymbols.indexOf('SUBMIT'))
                                        }
                                    }

                                }else{
                                    this.$message({
                                        type: 'error',
                                        message: '请求数据失败，请刷新页面重试'
                                    })
                                }
                                //console.log(this.tempHeadFormData)
                            })
                        }
                    }
                })


            },

            //初始化表格列
            initColumns(){

                //获得辅助资料的数据
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: 30004
                    },
                    size: 100
                }
                let list = []
                apiCommon.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            let header = ['面积下限（包含）','面积上限（不包含）']
                            let sorts = ['lowerArea','upperArea']
                            res.data.result.forEach((item) => {
                                this.mainTableColumns.push({
                                    prop: item.id+'_unit',
                                    label: item.propertyName,
                                    width:150,
                                })

                                this.mainTableColumns.push({
                                    prop: item.id+'_total',
                                    label: item.propertyName,
                                    width:150,
                                })

                                sorts.push(item.id+'_unit')
                                sorts.push(item.id+'_total')

                                header.push(item.propertyName)
                                header.push(item.propertyName)


                                /*this.mainTableColumns.push({
                                    prop: item.id+'_2',
                                    label: item.propertyName
                                })*/
                            })
                            this.exportHeader = header.join(',')
                            this.exportSorts = sorts.join(',')
                        }
                    })
            },
            closeDialog(){
                this.$emit('close')
                this.$router.go(-1)
            }
        }
    }
</script>
<style lang="css" scoped>
    .g-main-container-column{
        min-height: 300px;
    }
</style>
<style>
    .t8t-full-dialog{height: 100%}
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
    .packtempview {
        width: 1200px;
        margin: 30px auto 5px;
        /*overflow: hidden;*/
    }
</style>
