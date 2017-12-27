/**
* Created by tomy.li on 2017/5/15.
*/
<template>
    <div class="groupDosageMapping">
        <el-dialog size="full" class="groupDosageMappingDialog t8t-full-dialog2 dialog-new" v-model="groupDosageMappingDialogVisible" @close="closeGroupDosageMappingDialog" :show-close="false" :close-on-press-escape="false">

            <div class="t8t-full-dialog2-container">

                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">

                        <div>
                            <el-button @click="cancel()">返回</el-button>
                        </div>

                        <!--暂存-->
                        <t8t-toolbar :symbolList="['TEMP-SAVE']" class="t8t-dark"
                                     @TEMP-SAVE="tempSave()"
                                     :disabledSymbols="disabledSymbolsTop"
                        ></t8t-toolbar><!--顶部工具栏-->

                    </div>
                </div>

                <div class="dialog2-main-container">

                    <div class="full-dialog-form-container">
                        <t8t-form-panel
                            :dataSource="formData"
                            :fields="formFields"
                            :commonData="formCommonData"
                            ref="groupDosageMappingForm"
                        >
                        </t8t-form-panel>
                    </div>


                    <div class="g-main-container-column">
                        <!--顶部工具栏-->
                        <t8t-toolbar :symbolList="['ROW-ADD','SKU-CONFIG','ROW-EDIT','ROW-SUBMIT','ROW-ENABLE','ROW-DISABLE']"
                                     @ROW-ADD="addRow()"
                                     @SKU-CONFIG="configSku()"
                                     @ROW-EDIT="editRow()"
                                     @ROW-SUBMIT="submitRows()"
                                     @ROW-ENABLE="effectRows()"
                                     @ROW-DISABLE="forbiddenRows()"
                                     :disabledSymbols="disabledSymbolsBody"
                        ></t8t-toolbar>
                        <t8t-table
                            :columns="mainTableColumns"
                            :service="mainTableService"
                            :method="mainTableMethod"
                            :commonData="commonData"
                            :edit-mode="editMode"
                            :args="args"
                            :indexCol="false"
                            ref="t8ttable"
                            :pageBar="true"
                            :editable="true"
                            :templateData="templateData"
                            @cell-click="cellClick"
                            @selection-change="selectionChange"
                            @cell-editor-change="cellEditorChange"
                            @data-loaded="dataLoaded"
                        >
                        </t8t-table>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import DateUtils from 'src/utils/DateUtils.js'
    import { M, mb, getTextById } from 'src/components/t8t-table/utils/utils.js'
    import Cookie from 'js-cookie'
    // import T8tSearch from 'src/components/t8t-search/t8t-search.vue'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import groupDosageMappingMethods from 'src/services/worker/groupDosageMapping/methods.js'
    import groupDosageMappingServices from 'src/services/worker/groupDosageMapping/Service.js'
    import priceConfigDialog from './groupDosageMapping.vue'
    import config from './config.js'
    import TemplateOperator from 'src/services/worker/categorysearch/base-method.js'
    import spaceMethods from 'src/services/worker/apartmentspace/base-method.js'
    import formula from 'src/services/formula/methods.js'
    import formulaService from 'src/services/formula/Service.js'
    import expense from 'src/services/delivery/expenseDictionary/methods.js'
    export default {
        name: "groupDosageMapping",
        components: {},
        data(){
            return {
                editMode:'cell',
                tempItemCode:'',
                tempCode:'',
                groupDosageMappingDialogVisible:true,
                expenseDictionariesUniq:[],//工费词典
                disabledSymbolsTop:[],
                disabledSymbolsBody:[],
                mainTableService: groupDosageMappingServices.default.name,
                mainTableMethod: groupDosageMappingServices.default.methods.searchGroupDosageMapping,
                mainTableColumns: [
                    //组合ID
                    {
                        "prop": "id",
                        "label": "组合ID"
                    },

                    //组合类型
                    {
                        "prop": "deliveryType",
                        "label": "交付项类型",
                        "list":'types',
                        "required":true,
                        editor:{
                            type:'select',
                            rules:[
                                {
                                    required: true, message: '请选择交付项类型'
                                }
                            ],
                        },

                    },
                    //组合名称
                    {
                        "prop": "gdmNameId",
                        "label": "组合名称",
                        "required":true,
                        'list':'goodCategories',
                        editor:{
                             select: true, type:'select',
                        },

                    },

                    //品类
                    {
                        "prop": "categoryId",
                        "label": "品类",
                        "required":true,
                        editor:{
                            type:'select',
                            rules:[
                                {
                                    required: true, message: '请选择品类'
                                }
                            ],
                            'list': 'goodsCategoryEditor'
                        },
                        formatter: this.formatterCateGoryId
                    },

                    //成本单价
                    {
                        "prop": "costUnitPrice",
                        "label": "成本单价",
                        editor:{
                            type:'input',
                            rules:[
                                {
                                    pattern: /^((0|[1-9]\d{0,6})((\.[0-9]{1,2})?))$/, message: '必须为数字，最大7位，最多保留两位小数'
                                },
                            ]
                        },
                    },

                    //用量比例
                    {
                        "prop": "dosagePercent",
                        "label": "用量比例",
                        "required":true,
                        editor:{
                            type:'input',
                            rules:[
                                {
                                    pattern: /^(0|[1-9]{1}[0-9]{0,3}|([1-9]{1}[0-9]{0,3}|0)\.[0-9]{1,2})$/, message: '0-9999，最多保留两位小数'
                                },
                                {
                                    required: true, message: '请填写用量比例'
                                }
                            ]
                        },
                    },

                    //用量公式名称
                    {
                        "prop": "dosageEquationId",
                        "label": "用量公式名称",
                        list:'dosageEquations',
                        "required":true,
                        editor:{
                            type:'lookup',
                            'service': formulaService.name,
                            'method': formulaService.formula.methods.queryPage,
                            'args':{},
                            searchValue:'',
                            'filterMethod': function (val, args) {

                                let newArgs = Object.assign({},args)

                                let search = {
                                    'moduleId': args.search.moduleId
                                }
                                if( val ){
                                    search['formulaName'] = val
                                }
                                newArgs['search'] = search

                                return newArgs
                            },
                            'columns': [
                                {
                                    'prop': 'id',
                                    'label': '公式ID'
                                },
                                {
                                    'prop': 'formulaName',
                                    'label': '公式名'
                                },
                                {
                                    'prop': 'expression',
                                    'label': '表达式'
                                }
                            ],
                            'valueExpr': 'id',
                            'searchExpr': [
                                'formulaName'
                            ],
                            rules:[
                                {
                                    required: true, message: '请选择用量公式'
                                }
                            ],
                            'list': 'dosageEquationsEditor'
                        },
                    },

                    //浮动比例
                    {
                        "prop": "floatPercent",
                        "label": "浮动比例",
                        "required":true,
                        editor:{
                            type:'input',
                            rules:[
                                {
                                    pattern: /^(0|((0\.[0-9]{1,4})?))$/, message: '必须为数字，不能大于等于1，最多保留四位小数'
                                },
                                {
                                    required: true, message: '请填写浮动比例'
                                }
                            ]
                        },
                    },

                    //生效时间
                    {
                        "prop": "effectTime",
                        "label": "生效时间",
                        "required":true,
                        editor:{
                            type:'datetime',
                            rules:[
                                {
                                    required: true, message: '生效时间必填'
                                }
                            ],
                            pickerOptions: {
                                disabledDate: (time) => {
                                    //时间不能早于当前时间
                                    return (
                                        time.getTime() < Date.now()
                                    )
                                }
                            },
                        },

                        formatter: function(val) {
                            return val ? DateUtils(new Date(val).getTime(), 'yyyy-mm-dd HH:MM') : '--'
                        }

                    },

                    //是否禁用
                    {
                        "prop":'forbiddenStatus',
                        "label":"是否禁用",
                        "list": "gd_mapping_forbidden_status"
                    },

                    //状态
                    {
                        "prop":'gdMappingStatus',
                        "label":"状态",
                        "list": "gd_mapping_status"
                    }

                ],
                args:{},
                commonData:{
                    'types': [],
                    'goodsCategory':[],
                    'gd_mapping_status':config.datas.gd_mapping_status,
                    'gd_mapping_forbidden_status':config.datas.gd_mapping_forbidden_status,
                    dosageEquations:[{
                        'text': '默认',
                        'value': 1
                    }]
                },

                templateData:{
                    categoryId:null,
                    skuId:null,
                    categoryName:null,
                    gdmNameId:null,
                },

                formData:{
                    places:[],
                },

                formFields:[
                    {
                        type : 'input',
                        prop:'itemCode',
                        label:'产品包模板行编码',
                        disabled:true
                    },
                    {
                        type : 'input',
                        prop:'qiName',
                        label:'报价项名称',
                        disabled:true
                    },
                    {
                        type: 'select',
                        prop: 'spaceName',
                        label:'空间',
                        disabled:true
                    },
                    {
                        type: 'select',
                        prop: 'placeId',
                        label:'位置',
                        list:'places',
                        placeholder:'选择位置',
                        disabled:true
                    },
                    {
                        type : 'input',
                        prop:'qiUnit',
                        label:'单位',
                        disabled:true
                    },
                    {
                        type : 'select',
                        prop:'tempItemStatus',
                        label:'行状态',
                        disabled:true,
                        list:'tempItemStatus'
                    },
                    {
                        type : 'input',
                        prop:'tempName',
                        label:'产品包模板名称',
                        disabled:true
                    },

                ],

                formCommonData:{
                    'tempItemStatus' : config.datas.temp_item_status,
                    'places':[]
                },

                selectSource:{
                    'types': [],
                    'goodsCategory':[]
                },
                goodsCategory:[],
                goodsCategoryEditor:[],
                allGoodsCategory:[],
                goodsCategoryMapping:{},
                gdTypeAndCateMapping:{},
                formatFormula1:[], //主材公式
                formatFormula2:[], //辅材、工费公式
                formulaModuleId:null,//主材公式模块id
                formulaModuleId2:null,//辅材、工费公式模块id
                headData:{},
                actionModel:'',
                accountId:+Cookie.get('t8t-tc-uid'),
                hotRow:[]

            }
        },

        created() {
            this.init()
            this.getCommonOptions('42202','types')
            this.getCategoryGoods()
            this.getGoodsCateGoryMapping()
            //获取辅助资料中的商品品类
            //11006

            this.getCommonOptions('31004','goodCategories')

            //获取辅助资料中业务模块为‘设计’的id
            apiCommon.queryUnionParent({
                page: 1,
                search: {
                    pPropertyCode: 11602,
                    propertyCode: 3001
                },
                size: 100
            }).then((res) => {
                if (res.data.status === 200) {
                    if(res.data.result.length > 0){
                        this.formulaModuleId = res.data.result[0].id //主材公式模块id
                        formula.selectFormulaByModuleId(res.data.result[0].id).then((res2) => {
                            if( res2.data.status == 200 ){
                                let formulas = this.formatFormula1 = formula.formatFormulaForView(res2.data.result)
                                this.commonData.dosageEquations = [].concat([],formulas)

                                //获取辅助资料中业务模块为‘交付’的id
                                apiCommon.queryUnionParent({
                                    page: 1,
                                    search: {
                                        pPropertyCode: 11602,
                                        propertyCode: 4000
                                    },
                                    size: 100
                                }).then((res3) => {
                                    if (res3.data.status === 200) {
                                        if(res3.data.result.length > 0){
                                            this.formulaModuleId2 = res3.data.result[0].id //辅材、工费公式模块id

                                            formula.selectFormulaByModuleId(res3.data.result[0].id).then((res4) => {
                                                if( res4.data.status == 200 ){
                                                    let formulas = this.formatFormula2 = formula.formatFormulaForView(res4.data.result)
                                                    this.commonData.dosageEquations = [].concat(this.commonData.dosageEquations,formulas)
                                                }
                                            })
                                        }
                                    }
                                })

                            }
                        })
                    }
                }
            })

            this.getExpenseDictionariesUniq()
        },

        methods: {

            isEmpty(str){
                return str == null || str == 0 || str == '' || str == undefined || str == '0'
            },
            //格式化时间转换为时间戳 精确到秒
            floorDateFromStr(str){
                return  this.isEmpty(str) ? str : Math.floor(new Date(str).getTime()/1000)
            },
            init: function (){
                this.tempItemCode = this.$route.query.tempItemCode
                this.tempCode = this.$route.query.tempCode

                this.args  = {groupDosageMapping:{itemCode:this.tempItemCode,'gdMappingId':0}}
                let that = this
                groupDosageMappingMethods.getGdmTitle(this.tempItemCode).then((res) => {
                    if(res.data.status == 200){
                        this.headData = this.formData = Object.assign({},res.data.result)
                    }

                })
                this.formCommonData['spaces'] = spaceMethods.getSpaceConfigList()

                this.getCommonOptions(30003,'places');
            },
            getCateGoryNameById: function(categoryId){
                this.getCategoryGoods()
                let cates = this.selectSource['goodsCategory']
                let name = '';
                cates.forEach((item) => {
                    if( item['value'] ==  categoryId){
                        name = item['text']
                    }
                })
                return name
            },
            cancel: function (){
                this.$router.go(-1)
            },
            isRowCanEdit: function (rowData) {
                //0-待启用, 2-已启用, 3-已驳回
                return [0,2,3].indexOf(rowData['gdMappingStatus']) > -1
            },
            isRowCanSubmit: function (rowData) {
                //0-待启用
                return [0].indexOf(rowData['gdMappingStatus']) > -1
            },

            isRowCanEffect: function (rowData) {
                //1-已禁用,
                return [1].indexOf(rowData['forbiddenStatus']) > -1
            },

            isRowCanForbidden: function (rowData) {
                //0-非禁用 和 已启用
                return [0].indexOf(rowData['forbiddenStatus']) > -1 && [2].indexOf(rowData['gdMappingStatus']) > -1
            },

            //是否可编辑生效时间
            /*
            * 若未填写，则允许填写；
             若已被填写，且生效日期晚于当前时间，则允许修改；
             若已被填写，且生效日期早于等于当前时间，且模板状态为“待启用”，则允许修改；
             若已被填写，且生效日期早于等于当前时间，且模板状态！！不为！！“待启用”，则！！不允许！！修改；
            * */
            isCanEditEffectTime(rowData){
                return rowData['effectTime'] == "" ||
                    (new Date(rowData['effectTime']).getTime() > new Date().getTime()) ||
                    ( rowData['gdMappingStatus'] == 0 && new Date(rowData['effectTime']).getTime() <= new Date().getTime() )
            },

            cleanHotRow: function(){
                this.hotRow = []
            },

            //是否为新增行
            isNewRow: function(row){
                return this.$refs['t8ttable'].addedRows.indexOf(row) > -1
            },
            isRowEdited(row){
                return this.$refs['t8ttable'].editedRows.indexOf(row) > -1
            },
            cellClick: function (row, column, cell, event) {

                //选择品类时动态的根据选择的组合类型获取数据源
//                debugger
                if( column.property == 'categoryId' ){
                    let deliveryType = row.deliveryType
                    if( !deliveryType ){
                        this.$refs['t8ttable'].handleFormItemBlur()
                    }else{
                        //row.categoryId = null;
                        let cateCode = this.gdTypeAndCateMapping[deliveryType]

                        let cates = []
                        //工费
                        if( cateCode == '03' ){
                            cates = this.expenseDictionariesUniq
                        }else{
                            cates = this.goodsCategoryMapping[cateCode]
                        }

                        this.commonData.goodsCategoryEditor = cates
                    }

                }

                //选择公式时动态的根据选择的组合类型获取数据源
                if( column.property == 'dosageEquationId' ){
                    let deliveryType = row.deliveryType
                    if( !deliveryType ){
                        this.$refs['t8ttable'].handleFormItemBlur()
                    }else{
                        let cateCode = this.gdTypeAndCateMapping[deliveryType]

                        let dosageEquationsEditor = []

                        let formulaModuleId = null

                        //主材
                        if( cateCode == '02' ){
                            dosageEquationsEditor = this.formatFormula1
                            formulaModuleId = this.formulaModuleId
                        }

                        //工费及辅材
                        else{
                            dosageEquationsEditor = this.formatFormula2
                            formulaModuleId = this.formulaModuleId2
                        }


                        let formulaModuleFeild = this.mainTableColumns.filter((item) => {return item.prop=='dosageEquationId'})
                        if(formulaModuleFeild.length && formulaModuleId){
                            formulaModuleFeild[0].editor.args = {search:{moduleId:formulaModuleId}}
                        }


                        this.commonData.dosageEquationsEditor = dosageEquationsEditor
                    }

                }



                //编辑行之前必须手动触发编辑状态
                if( !this.isNewRow(row) ){
                    if(this.hotRow.indexOf(row) > -1 && ( this.actionModel == 'edit')){

                    }else{
                        this.$refs['t8ttable'].handleFormItemBlur()
                    }

                    if( column.property == 'effectTime' && !this.isCanEditEffectTime(row) ){
                        this.$refs['t8ttable'].handleFormItemBlur()
                    }

                }

                if( column.property == 'categoryId' ){

                }

            },

            cellEditorChange:function (cell, val){
                let column = cell.column
                if( column.property == 'deliveryType' ){
                    let deliveryType = cell.row.deliveryType
                    cell.row.categoryId = null;
                   /* let cateCode = this.gdTypeAndCateMapping[deliveryType]
                    let cates = this.goodsCategoryMapping[cateCode]
                    this.commonData.goodsCategoryEditor = cates*/
                }
            },

            selectionChange: function(selRows, selIDs, selIndexes){

                //一次只允许修改一行
                /*if( selIDs.length < 1 ){
                    this.cleanHotRow()
                }*/
            },

            addRow: function (){
                let tableObj = this.$refs['t8ttable']

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                if( editedRows.length > 0 ){
                    this.$message({
                        type: 'warning',
                        message: '请先保存修改的行！'
                    });
                    return false
                }
                this.actionModel = 'add'
                this.$refs['t8ttable'].addNewRow()
            },

            editRow: function (){
                let tableObj = this.$refs['t8ttable']

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                if( addedRows.length > 0 ){
                    this.$message({
                        type: 'warning',
                        message: '请先保存新增的行！'
                    });
                    return false
                }

                //一次只能编辑一行


                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要修改的组合'
                    })
                    return false
                }

               /* if( selections.length > 1 ){
                    this.$message({
                        type: 'warning',
                        message: '一次只能修改一行'
                    })
                    return false
                }*/

                /*if( editedRows.length > 0 ){
                    if( !this.isRowEdited(selection) ){
                        this.$message({
                            type: 'warning',
                            message: '已经修改了其他数据行'
                        });
                        return false
                    }
                }*/


                for(let i=0 ; i < selections.length; i++){
                    let item = selections[i]
                    if( !this.isRowCanEdit(item) ){
                        this.$message({
                            type: 'warning',
                            message: '仅可修改组合状态为“待启用”、“已启用” 或　“已驳回”的组合'
                        })
                        return false
                    }
                }


                this.hotRow = Object.assign([],selections)
                this.actionModel = 'edit'
//                this.editMode = 'selection'
            },

            submitRows: function (){
                let tableObj = this.$refs['t8ttable']

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                let selections = tableObj.getSelectRows()

                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要提交的组合'
                    })
                    return false
                }
                let ids = []

                for(let i=0 ; i < selections.length; i++){
                    let item = selections[i]
                    if( this.isEmpty(item.effectTime) ){
                        this.$message({
                            type: 'warning',
                            message: '请先填写生效时间'
                        })
                        return false
                    }

                    if( !this.isRowCanSubmit(item) ){
                        this.$message({
                            type: 'warning',
                            message: '仅可将状态为“待启用”的组合提交'
                        })
                        return false
                    }
                    ids.push(item.id)
                }

                if( ids.length ){

                    this.disabledSymbolsBody.push('ROW-SUBMIT')
                   groupDosageMappingMethods.checkGdm({
                       'ids':ids,
                       'gdMappingStatus':2,
                       'updateUser': this.accountId
                   }).then((res) => {
                       if( res.data.status == 200 ){
                           this.$message({
                               type: 'success',
                               message: '提交成功'
                           })
                            this.disabledSymbolsBody.shift(this.disabledSymbolsBody.indexOf('ROW-SUBMIT'))
                           tableObj.reloadTable()
                           tableObj.resetActionLog()

                       }else{
                           this.$message({
                               type: 'error',
                               message: res.data.result
                           })
                            this.disabledSymbolsBody.shift(this.disabledSymbolsBody.indexOf('ROW-SUBMIT'))
                       }
                   })
                }
            },

            effectRows: function (){
                let tableObj = this.$refs['t8ttable']

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要启用的组合'
                    })
                    return false
                }
                let ids = []

                for(let i=0 ; i < selections.length; i++){
                    let item = selections[i]
                    if( !this.isRowCanEffect(item) ){
                        this.$message({
                            type: 'error',
                            message: '仅可启用已禁用的组合'
                        })
                        return false
                    }
                    ids.push(item.id)
                }

                if( ids.length ){
                    this.disabledSymbolsBody.push('ROW-ENABLE')
                    groupDosageMappingMethods.effectGdm({
                       'ids':ids,
                       'forbiddenStatus':0,
                       'updateUser': this.accountId
                   }).then((res) => {
                       if( res.data.status == 200 ){
                           this.$message({
                               type: 'success',
                               message: '提交成功'
                           })
                        this.disabledSymbolsBody.shift(this.disabledSymbolsBody.indexOf('ROW-ENABLE'))

                        tableObj.reloadTable()

                       }else{
                           this.$message({
                               type: 'error',
                               message: res.data.result
                           })
                        this.disabledSymbolsBody.shift(this.disabledSymbolsBody.indexOf('ROW-ENABLE'))

                    }
                   })
                }
            },

            forbiddenRows: function (){
                let tableObj = this.$refs['t8ttable']

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '选择需要禁用的组合'
                    })
                    return false
                }
                let ids = []

                for(let i=0 ; i < selections.length; i++){
                    let item = selections[i]
                    if( !this.isRowCanForbidden(item) ){
                        this.$message({
                            type: 'error',
                            message: '仅可禁用组合状态为“已启用” 且 禁用状态为‘否’的组合'
                        })
                        return false
                    }
                    ids.push(item.id)
                }

                if( ids.length ){
                    this.disabledSymbolsBody.push('ROW-DISABLE')

                    groupDosageMappingMethods.forbiddenGdm({
                       'ids':ids,
                       'forbiddenStatus':1,
                       'updateUser': this.accountId
                   }).then((res) => {
                       if( res.data.status == 200 ){
                           this.$message({
                               type: 'success',
                               message: '提交成功'
                           })
                        this.disabledSymbolsBody.shift(this.disabledSymbolsBody.indexOf('ROW-DISABLE'))

                        tableObj.reloadTable()

                       }else{
                           this.$message({
                               type: 'error',
                               message: res.data.result
                           })
                        this.disabledSymbolsBody.shift(this.disabledSymbolsBody.indexOf('ROW-DISABLE'))

                    }
                   })
                }
            },

            tempSave: function (){
                let tableObj = this.$refs['t8ttable']

                let addedRows = tableObj.addedRows
                let editedRows = tableObj.editedRows
                let deletedIDs = tableObj.deletedIDs

                tableObj.validate((isValid) => {

                    if (!isValid) {
                        return false
                    }else{
                        if(this.actionModel == 'add'){
                            if( addedRows.length > 0 ){
                                let rows = [];
                                addedRows.forEach((item) => {
                                    rows.push({
                                        itemCode: this.tempItemCode,
                                        deliveryType: item.deliveryType,
                                        gdmNameId: +item.gdmNameId,
                                        categoryId: item.categoryId,
                                        categoryName:this.getCategoryNameByIdAndGdTypefunction(item.deliveryType, item.categoryId),
                                        dosageTypeCode:'01',//用量关系类型, 此处类型为组合。
                                        dosageEquationId: item.dosageEquationId,
                                        dosagePercent: item.dosagePercent,
                                        floatPercent: item.floatPercent,
                                        costUnitPrice: item.costUnitPrice,
                                        effectTime:this.floorDateFromStr(item.effectTime),
                                        createUser:this.accountId
                                    })
                                })

                                this.disabledSymbolsTop.push('TEMP-SAVE')
                                groupDosageMappingMethods.createGdmBatch(rows).then((res) => {
                                    if( res.data.status == 200 ){
                                        this.$message({
                                            type: 'success',
                                            message: '暂存成功'
                                        })
                                        this.disabledSymbolsTop.shift(this.disabledSymbolsTop.indexOf('TEMP-SAVE'))
                                        tableObj.reloadTable()
                                        tableObj.resetActionLog()
                                    }else{

                                        this.$message({
                                            type: 'warning',
                                            message: res.data.result
                                        })
                                        this.disabledSymbolsTop.shift(this.disabledSymbolsTop.indexOf('TEMP-SAVE'))

                                    }
                                })

                            }else{
                                this.$message({
                                    type: 'warning',
                                    message: '没有新增的组合'
                                })
                            }

                        }

                        else if(this.actionModel == 'edit'){
                            if( editedRows.length > 0 ){
                                let rows = [];
                                editedRows.forEach((item) => {
                                    rows.push({
                                        id: item.id,
                                        deliveryType: item.deliveryType,
                                        gdmNameId: +item.gdmNameId,
                                        categoryId: item.categoryId,
                                        categoryName: this.getCategoryNameByIdAndGdTypefunction(item.deliveryType, item.categoryId),
                                        dosageTypeCode:'01',//用量关系类型, 此处类型为组合。
                                        dosageEquationId: item.dosageEquationId,
                                        dosagePercent: item.dosagePercent,
                                        floatPercent: item.floatPercent,
                                        costUnitPrice: item.costUnitPrice,
                                        //new Date('2017-10-11 13:40').getTime()/1000
                                        effectTime:this.floorDateFromStr(item.effectTime),
                                        updateUser:this.accountId
                                    })
                                })

                                this.disabledSymbolsTop.push('TEMP-SAVE')
                                groupDosageMappingMethods.updateGdmBatch(rows).then((res) => {
                                    if( res.data.status == 200 ){

                                    this.disabledSymbolsTop.shift(this.disabledSymbolsTop.indexOf('TEMP-SAVE'))

                                    tableObj.reloadTable()
                                        tableObj.resetActionLog()
                                    }else{

                                        this.$message({
                                            type: 'warning',
                                            message: res.data.result
                                        })
                                        this.disabledSymbolsTop.shift(this.disabledSymbolsTop.indexOf('TEMP-SAVE'))

                                    }
                                })

                            }else{
                                this.$message({
                                    type: 'warning',
                                    message: '没有新增的组合'
                                })
                            }
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '数据没有变化'
                            })
                        }
                    }
                })
            },

            //配置sku入口
            configSku(){
                let tableObj = this.$refs['t8ttable']
                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'error',
                        message: '请选择一行需要配置SKU的组合！'
                    })
                    return false
                }
                let selection =  selections[0]

                if( this.isNewRow(selection) ){
                    this.$message({
                        type: 'error',
                        message: '新增行保存后才能配置SKU！'
                    })
                    return false
                }

                if( selection['forbiddenStatus'] == 1 ){
                    return this.$message({
                        type: 'error',
                        message: '已禁用的组合不可配置SKU'
                    })
                }

                //选中行的组合类型的CODE
                let propertyCode = this.gdTypeAndCateMapping[selection['deliveryType']]
                this.$router.push({path:'quote-packtemp-gdmsku',query:{'gdMappingId':selection.id, 'tempCode':this.tempItemCode,'propertyCode':propertyCode}})
            },

            /*
            * cell-click(row, column, cell, event){
             event.target.blur()
             }*/
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
                        this.commonData[selectName] = list
                        this.formCommonData[selectName] = list
                    }
                })
            },

            getGoodsCateGoryMapping: function (){
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: 42202
                    },
                    size: 100
                }
                let that = this
                //获取辅助资料中的组合类型
                apiCommon.queryUnionParent(arg).then((res) => {
                    if (res.data.status === 200) {
                        let allGoodsCategory = []
                        //遍历组合类型
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus === 1) {


                                //更新：目前主辅材分组不做区分，统一取所有的3级商品分组。 2017-08-10 17
                                let arg =  {
                                    "depth": 1,
                                    "fields": ["id","groupName","parentId","groupCode"],
                                }

                                //获取分类
                                TemplateOperator.queryGroupsAndChilds(arg).then((res) => {

//                                    debugger
                                    if (res.data.status === 200) {
                                        let cates = []
                                        res.data.result.forEach((item) => {
                                            cates.push({
                                                value: item.id*1,
                                                text: item.groupName,
                                                code:item.groupCode
                                            });
                                        })

                                        this.goodsCategoryMapping[item.propertyCode] = cates
                                        this.allGoodsCategory = [].concat(this.allGoodsCategory,cates)
                                        this.selectSource['goodsCategory']  = this.allGoodsCategory
                                        this.commonData['goodsCategory']  = this.allGoodsCategory

                                    }
                                })

                            }
                            this.gdTypeAndCateMapping[item.id] = item.propertyCode

                        })


                    }
                })


            },
            getGoodsCateGoryMapping_back: function (){
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: 42202
                    },
                    size: 100
                }
                let that = this
                //获取辅助资料中的组合类型
                apiCommon.queryUnionParent(arg).then((res) => {
                    if (res.data.status === 200) {
                        let allGoodsCategory = []
                        //遍历组合类型
                        res.data.result.forEach((item) => {
                            if (item.propertyStatus === 1) {

                                let arg =  {
                                    queryGroupTreeOfOneDto:{
                                        fields:["id","groupName","parentId","groupCode"],
                                        groupCode: item.propertyCode //辅助资料code需要和商品分组code一致
                                    }
                                }

                                //获取分类
                                TemplateOperator.queryCategory(arg).then((res) => {

                                    if (res.data.status === 200) {
                                        let cates = []
                                        if( res.data.result.children ){
                                            res.data.result.children.forEach((item) => {
                                                cates.push({
                                                    value: item.id*1,
                                                    text: item.groupName,
                                                    code:item.groupCode
                                                });
                                            })
                                        }

                                        this.goodsCategoryMapping[item.propertyCode] = cates
                                        this.allGoodsCategory = [].concat(this.allGoodsCategory,cates)
                                        this.selectSource['goodsCategory']  = this.allGoodsCategory
                                        this.commonData['goodsCategory']  = this.allGoodsCategory

                                    }
                                })

                            }
                            this.gdTypeAndCateMapping[item.id] = item.propertyCode

                        })


                    }
                })


            },

            getCategoryGoods: function(groupCode = '02') {
                let arg =  {

                    queryGroupTreeOfOneDto:{

                        fields:["id","groupName","parentId","groupCode"],
                        groupCode: groupCode
                    }
                }
                let list = []
                TemplateOperator.queryCategory(arg).then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.children.forEach((item) => {
                            list.push({
                                value: item.id,
                                text: item.groupName,
                                code:item.groupCode
                            });

                        })

                        this.goodsCategory = list
                    }
                })
            },

            //获取工费词典数据(工种)
            getExpenseDictionariesUniq: function (){
                let list = []
                expense.getExpenseDictionariesUniq().then(res => {
                    if (res.data.status === 200) {
                        res.data.result.forEach((item) => {
                            list.push({
                                value: item.workType,
                                text: item.workTypeName,
                            });
                        })
                        this.selectSource['expenseDictionariesUniq'] = this.commonData['expenseDictionariesUniq'] = this.expenseDictionariesUniq = list
                        //console.log(1111,this.selectSource['expenseDictionariesUniq'],this.expenseDictionariesUniq ,list)
                    }
                })
            },

            formatterCateGoryId: function(val,row,col,tab) {
                if( row.hasOwnProperty('deliveryType') && row.hasOwnProperty('categoryId') ){
                    let deliveryType = row.deliveryType

                    let cate = this.getCategoryByIdAndGdType(deliveryType, val)

                    if( cate.length > 0 ){
                        return cate[0].text
                    }
                }

                return ''
            },

            //获取品类信息（兼容主辅材品类和工费中的工种）
            getCategoryByIdAndGdType: function (deliveryType, categoryId){
                let cateCode = this.gdTypeAndCateMapping[deliveryType]
                let cate = [{ "value": '', "text": "" }];

                if( ['01','02'].indexOf(cateCode) > -1 ){
                    cate = this.allGoodsCategory.filter(i => { return i.value == categoryId })
                }else if( ['03'].indexOf(cateCode) > -1 ){
                    cate = this.expenseDictionariesUniq.filter(i => { return i.value == categoryId })
                }

                return cate
            },

            getCategoryNameByIdAndGdTypefunction (deliveryType, categoryId){
                let name = ''
                let cate = this.getCategoryByIdAndGdType(deliveryType, categoryId)
                if(cate.length){
                    name = cate[0].text
                }
                return name
            },

            dataLoaded(data){
                data.map(item => {
                    if(!item.hasOwnProperty('deliveryType')){
                        this.$set(item,'deliveryType',0)
                    }
                    if(!item.hasOwnProperty('gdmNameId')){
                        this.$set(item,'gdmNameId',0)
                    }
                    if(!item.hasOwnProperty('categoryId')){
                        this.$set(item,'categoryId',0)
                    }
                    if(!item.hasOwnProperty('costUnitPrice')){
                        this.$set(item,'costUnitPrice','')
                    }
                    if(!item.hasOwnProperty('dosagePercent')){
                        this.$set(item,'dosagePercent','')
                    }
                    if(!item.hasOwnProperty('dosageEquationId')){
                        this.$set(item,'dosageEquationId',0)
                    }
                    if(!item.hasOwnProperty('floatPercent')){
                        this.$set(item,'floatPercent','')
                    }
                    if(!item.hasOwnProperty('effectTime')){
                        this.$set(item,'effectTime','')
                    }

                })

                return data
            },

        }

    }
</script>
<style lang="css" scoped>
    .g-main-container-column{
        min-height: 400px;
    }
</style>
<style>

    .t8t-full-dialog2 .toolbar-container .el-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .t8t-full-dialog2 .toolbar-container .el-button:hover{
        color: #1e3046;
        background-color: #d2deeb;
    }

</style>
