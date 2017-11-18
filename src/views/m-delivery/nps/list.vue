<template>
    <div>
        <!-- 面包屑 -->
        <t8t-breadcrumb></t8t-breadcrumb>
        <!-- 搜索区域 -->
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        ></t8t-search>

        <!-- 内容区 -->
        <div class="g-main-container">
            <div class="g-main-container-column">
                <!-- 工具条 -->
                <t8t-toolbar
                    @VIEW="doView"
                    @EDIT="doEdit"
                    @UNCLOSE="doUnclose"
                    @EXPORT="doExport"
                    :disabledSymbols="disabledSymbols"
                ></t8t-toolbar>

                <!-- table -->
                <t8t-table
                    ref="listTable"
                    :service="service"
                    :method="method"
                    :columns="columns"
                    :args="args"
                    :indexCol="true"
                    :commonData="selectSource"
                    @selection-change="handleSelectionChange"
                    @row-double-click="handleRowDblclick"
                ></t8t-table>
            </div>
        </div>
    </div>
</template>
<script>
    import {Service, methods} from 'src/services/delivery/nps.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import T8tTable from 't8t-element-ui/lib/t8t-grid'
    import exportUtils from 'src/utils/export.js'
    export default{
        name:'nps-list',
        data(){
            return {
                fields:[
                    {type: 'input',label: '项目ID',name: 'projectId'},
                    {type: 'division',label: '城市',name: 'cityIdArr', selectSourceKey:'citys', props:{
                         value:'id',
                         label:'name',
                         children:'children'
                    },defaultValue:[]},
                    {type: 'date', pickertype: 'datetimerange',label: '评分日期',startField: 'createTime_gte', endField:'createTime_lte', name: 'createTime'},
                    {type: 'date',pickertype: 'datetimerange',label: '实际竣工日期', startField: 'completedTime_gte', endField:'completedTime_lte', name: 'completedTime'},
                    {type: 'input',label: '单据编号',name: 'billCode'},
                    {type: 'select',label: '单据状态',name: 'billStatus', selectSourceKey:'billStatus'},
                    {type: 'select',label: '业务类型',name: 'bizTypeId', selectSourceKey:'bizType'},
                    {type: 'select',label: '是否自动关闭',name: 'autoClose', selectSourceKey:'autoClose'},
                    {type: 'date',pickertype: 'datetimerange',label: '关闭日期', startField: 'closeTime_gte', endField:'closeTime_lte', name: 'closeTime'}
                ],
                selectSource:{
                    autoClose:[
                        {text:'否', value:1},
                        {text:'是', value:2}
                    ],
                    billStatus:[
                        {text:'已关闭', value:1},
                        {text:'处理中', value:2}
                    ],
                    evaluateScore:[],
                    chosenReason:[],
                    bizType:[],
                    citys:[]
                },
                service:Service.NPS.name,
                method:Service.NPS.methods.queryPage,
                args:{sort:['createTime_desc']},
                columns:[
                    { prop: 'projectId', label: '项目ID' },
                    { prop: 'city', label: '城市'},
                    { prop: 'createTime', label: '评分日期', formatter: "dateParser"},
                    { prop: 'completedTime', label: '实际竣工日期', formatter: "dateParser"},
                    { prop: 'billCode', label: '单据编号' },
                    { prop: 'billStatus', label: '单据状态', list:"billStatus" },
                    { prop: 'bizTypeId', label: '业务类型', list:"bizType"},
                    { prop: 'organizationName', label: '销售组织' },
                    { prop: 'autoClose', label: '是否自动关闭', list:"autoClose"},
                    { prop: 'closeTime', label: '关闭日期', formatter: "dateParser"},
                    { prop: 'evaluateScoreT8T', label: '项目NPS评分' , list:"evaluateScore"},
                    { prop: 'chosenReason', label: '选择土巴兔原因', list:"chosenReason"},
                    { prop: 'evaluateTextT8T', label: '备注1' },
                    { prop: 'evaluateNameCustomerManager', label: '客户经理姓名' },
                    { prop: 'evaluateScoreCustomerManager', label: '客户经理评分', list:"evaluateScore" },
                    { prop: 'evaluateTextCustomerManager', label: '备注2' },
                    { prop: 'evaluateNameDesigner', label: '设计师姓名' },
                    { prop: 'evaluateScoreDesigner', label: '设计师评分', list:"evaluateScore"},
                    { prop: 'evaluateTextDesigner', label: '备注3' },
                    { prop: 'evaluateNameProjectManager', label: '项目经理姓名' },
                    { prop: 'evaluateScoreProjectManager', label: '项目经理评分', list:"evaluateScore"},
                    { prop: 'evaluateTextProjectManager', label: '备注4' },
                    { prop: 'evaluateNameProjectSteward', label: '项目管家姓名' },
                    { prop: 'evaluateScoreProjectSteward', label: '项目管家评分', list:"evaluateScore"},
                    { prop: 'evaluateTextProjectSteward', label: '备注5' },
                    { prop: 'evaluateNameAfterSale', label: '工模售后客服姓名' },
                    { prop: 'evaluateScoreAfterSale', label: '工模售后客服评分', list:"evaluateScore"},
                    { prop: 'evaluateTextAfterSale', label: '备注6' }

                ],
                disabledSymbols:['VIEW','EDIT','UNCLOSE']
            }
        },
        created(){
            this.getCommonData('11008', 'bizType')
           this.getCommonDataCode('42902', 'evaluateScore')
           this.getCommonDataCode('42903', 'chosenReason')
           this.initAreaInfo()
        },
        // watch:{
        //     "$route.path":function(val, oldVal){
        //         if(oldVal.endsWith('edit')){
        //             this.$refs.listTable.reloadTable()
        //         }
        //     }
        // },
        activated(){
            this.$refs.listTable.reloadTable()
        },
        methods:{
            submitSearch(obj){
                let nObj = Object.assign({}, obj);
                if(nObj.createTime_lte){
                    nObj.createTime_lte = nObj.createTime_lte + 3600*24 - 1
                }
                if(nObj.completedTime_lte){
                    nObj.completedTime_lte = nObj.completedTime_lte + 3600*24 -1
                }
                if(nObj.closeTime_lte){
                    nObj.closeTime_lte = nObj.closeTime_lte + 3600*24 -1
                }
                if(nObj.cityIdArr){
                    nObj.cityId = nObj.cityIdArr[1]
                }
                delete nObj.cityIdArr
                this.args.search = nObj
                this.args = Object.assign({}, this.args)
            },
            handleSelectionChange(rows, ids){
                if(rows.length > 1){
                    if(!this.disabledSymbols.includes('VIEW')){
                        this.disabledSymbols.push('VIEW')
                    }
                    if(!this.disabledSymbols.includes('EDIT')){
                        this.disabledSymbols.push('EDIT')
                    }
                    if(!this.disabledSymbols.includes('UNCLOSE')){
                        this.disabledSymbols.push('UNCLOSE')
                    }
                    return
                }
                if(rows.length < 1){
                    if(!this.disabledSymbols.includes('VIEW')){
                        this.disabledSymbols.push('VIEW')
                    }
                    if(!this.disabledSymbols.includes('EDIT')){
                        this.disabledSymbols.push('EDIT')
                    }
                    if(!this.disabledSymbols.includes('UNCLOSE')){
                        this.disabledSymbols.push('UNCLOSE')
                    }
                    return
                }
                let data = rows[0]
                if(data.billStatus == 1){
                      this.disabledSymbols = ['EDIT']
                      return
                }
                if(data.billStatus == 2){
                    this.disabledSymbols = ['UNCLOSE']
                      return
                }

            },
            doView(){
                let rows = this.$refs.listTable.getSelectRows()
                if(rows.length > 1){
                    this.$message.error('请选择单项进行操作')
                    return
                }
                if(rows.length < 1){
                    this.$message.error('请选择单项进行操作')
                    return
                }
                let row = rows[0]
                this.$router.push({ path: 'nps-view',query:{id: row['id']} })
            },
            doEdit(){
                let rows = this.$refs.listTable.getSelectRows()
                if(rows.length > 1){
                    this.$message.error('请选择单项进行操作')
                    return
                }
                if(rows.length < 1){
                    this.$message.error('请选择单项进行操作')
                    return
                }
                let row = rows[0]
                this.$router.push({ path: 'nps-edit',query:{id: row['id']} })
            },
            doUnclose(){
                this.$TCS.addTag('red_10654_016002001003') //点击流
                let rows = this.$refs.listTable.getSelectRows()
                if(rows.length > 1){
                    this.$message.error('请选择单项进行操作')
                    return
                }
                if(rows.length < 1){
                    this.$message.error('请选择单项进行操作')
                    return
                }
                let row = rows[0]
                if(row.billStatus == 2){
                    this.$message.error('关闭状态的项才能进行操作')
                    return
                }
                let args = {id:row.id}
                this.disabledSymbols.push('UNCLOSE')
                methods.autiClose(args).then((res) => {
                    this.disabledSymbols.pop()
                    if(res.data.status == 200 && res.data.result == 1){
                        let _this = this
                          this.$msgbox({
                                    title: '反关闭成功',
                                    type: 'success',
                                    message: '',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                }).then(() =>{
                                    _this.$refs.listTable.reloadTable()
                                })
                    }else{
                          this.$msgbox({
                                    title: '反关闭失败',
                                    type: 'error',
                                    message: res.data.message,
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                  })
                    }
                }).catch((error) =>{
                        this.disabledSymbols.pop()
                        this.$msgbox({
                                title: '反关闭失败',
                                type: 'error',
                                message: error || '服务器异常',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                              })
                })
            },
            doExport(){
                 this.$TCS.addTag('red_10654_016002001004') //点击流
                let exportArgs = this.args
                exportArgs.page = 1
                exportArgs.size = 4000
                exportUtils({
                    service: Service.NPS.name,
                    method: Service.NPS.methods.billExport,
                    args: exportArgs,
                    headers: '序号,评分日期,城市,项目ID,实际竣工日期,单据编号,业务类型,销售组织,修改人,修改时间,单据状态,是否自动关闭,关闭日期,NPS评分,选择土巴兔原因,备注1,客户经理姓名,客户经理评分,备注2,设计师姓名,设计师评分,备注3,项目经理姓名,项目经理评分,备注4,项目管家姓名,项目管家评分,备注5,工模售后客服姓名,工模售后客服评分,备注6',
                    sorts: "id,createTimeText,city,projectId,completedTimeText,billCode,bizTypeName,organizationName,updateName,updateTimeText,billStatusText,autoCloseText,closeTimeText,evaluateScoreT8T,chosenReasonText,teTextT8T,evaluateNameCustomerManager,evaluateScoreCustomerManager,evaluateTextCustomerManager,evaluateNameDesigner,evaluateScoreDesigner,evaluateTextDesigner,evaluateNameProjectManager,evaluateScoreProjectManager,evaluateTextProjectManager,evaluateNameProjectSteward,evaluateScoreProjectSteward,evaluateTextProjectSteward,evaluateNameAfterSale,evaluateScoreAfterSale,evaluateTextAfterSale"
                })
            },
            handleRowDblclick(row){
                this.$router.push({ path: 'nps-view',query:{id: row['id']} })
            },
            initAreaInfo(){
                let args = {}
                methods.pctreeGetConfig(args).then((res) => {
                    if(res.data.status == 200){
                          this.selectSource.citys = res.data.result
                    }
                })
            },
             //辅助资料
             getCommonData(fatherCode,selectName) {
                 let arg =  {
                     page: 1,
                     search: {
                         pPropertyCode: fatherCode
                     },
                     size: 100
                 }
                 let list = []
                 commonApi.queryUnionParent(arg)
                 .then((res) => {
                     if (res.data.status === 200) {
                         res.data.result.forEach((item) => {
                             if (item.propertyStatus===1) {
                                 list.push({
                                     value: item.id,
                                     text: item.propertyName
                                 })
                             };
                         })
                         this.selectSource[selectName] = list
                     }
                 })
             },
             getCommonDataCode(fatherCode,selectName){
                let arg =  {
                     page: 1,
                     search: {
                         pPropertyCode: fatherCode
                     },
                     size: 100
                 }
                 let list = []
                 methods.queryPropertyUnion(arg)
                 .then((res) => {
                     if (res.data.status === 200) {
                         res.data.result.forEach((item) => {
                             if (item.propertyStatus===1) {
                                 list.push({
                                     value: item.wholeCode,
                                     text: item.propertyName
                                 })
                             };
                         })
                         this.selectSource[selectName] = list
                     }
                 })
             }
        }
    }
</script>