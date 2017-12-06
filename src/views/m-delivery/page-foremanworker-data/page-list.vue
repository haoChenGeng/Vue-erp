<template>
    <div class="page-foremanworker-list">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            :showToggleBtn="true"
            @submit="submitSearch"
        >
        </t8t-search>

        <div class="g-main-container">
        	<t8t-tree
                :data="treeData"
                :props="treeProps"
                :default-expanded-keys="[1]"
                :defaultExpandAll="true"
                @node-click="onTreeClick"
            >
            </t8t-tree>
        	<div class="list-container">
	        	<t8t-toolbar
		            @ADD="onBtnAdd"
		            @EDIT="onBtnEdit"
                    @VIEW="onBtnView"
                    @EDIT-SUBMIT="onBtnSubmit"
                    @APPROVAL-FLOW="on_approval_flow"
                    @JIEDAN="on_jieDan"
                    @IMPORT="on_import"
                    @EXPORT="on_export"
                    @ANTI-AUDITING="on_anti_auditing"
                    ref="toolbar"
	            >
	            </t8t-toolbar>
		        <t8t-table
		            ref="listTable"
                    :service="service"
                    :method="method"
                    :columns="columns"
                    :args="args"
                    :commonData="selectSource"
		            @row-double-click="handleRowDblclick"
		        >
		        </t8t-table>
		    </div>
        </div>

        <t8t-step-page
            v-if="isShowFlow"
            :method="flowMethod"
            :service="flowService"
            :args="flowArgs"
            @close="isShowFlow=false"
        >
        </t8t-step-page>
    </div>
</template>

<script>
import api from 'src/services/delivery/foremanworker.js'
import service from 'src/services/delivery/Service.js'
import T8tStepPage from 'src/components/t8t-steps/t8t-step-page.vue'
import RSA from 'src/utils/RSA.js'
import utils from 'src/utils/Utils.js'
import Cookie from 'js-cookie'
export default {
    name: 'page-foremanworker-list',
     components: {
            T8tStepPage
    },
    data () {
        return {
            method:service.FOREMANWORKER.methods.workerInfoServiceQuery,
            service:service.FOREMANWORKER.name,
            args:{"info":null, "sort":["id_desc"]},
            //搜索表单项配置
            fields: [
            	{type: 'input',label: '工人ID',name: 'id'},
            	{type: 'input',label: '工人姓名',name: 'workerName'},
                {type: 'select',label: '是否是项目经理',name: 'isProjectManager', selectSourceKey:'ProjectManagerList'},
                {type: 'input',label: '工人手机',name: 'phone'},
                {type:'input', label:'工人编码', name:'workerCode'},
                {type:'select', label:'状态', name:'workerStatus', selectSourceKey:'workerStatusList'}
            ],
            //搜索select类型下拉列表数据，对应searchFormConfig的commonOptionsName
            selectSource: {
                ProjectManagerList: [
                    {text: '否', value: 0},
                    {text: '是', value: 1}
                ],
                WorkerBankAccountState:[
                    {text: '否', value: 0},
                    {text: '是', value: 1}
                ],
               workerStatusList:[
                    {
                        text: '暂存',
                        value: 0
                    },
                    {
                        text: '信息待审核',
                        value: 1
                    },
                    {
                        text: '信息审核通过',
                        value: 2
                    },
                    {
                        text: '信息审核被驳回',
                        value: 3
                    },
                    {
                        text: '合作中',
                        value: 4
                    },
                    {
                        text: '待清退',
                        value: 5
                    },
                    {
                        text: '已清退',
                        value: 6
                    },
                    {
                        text: '工长解约被驳回',
                        value: 7
                    }
               ],

            },
            //面包屑
            breadcrumbData: [{ title: '交付' },{ title: '交付基础数据' },{ title: '项目经理主数据' }],
            //列表数据
            tableData: [],
            //列表总数
            totalRows:50,
            //列表表头
            columns: [
                { prop: 'workerCode', label: '工人编码' },
                { prop: 'workerName', label: '姓名' },
                { prop: 'subOrgName', label: '组织' },
                { prop: 'phoneDecode', label: '手机号码' },
                { prop: 'isProjectManager', label: '是否有资格成为项目经理', list:"ProjectManagerList" },
                { prop: 'isWorkerBankAccount', label: '是否存在银行卡', list:"WorkerBankAccountState" },
                { prop: 'jcbzj', label: '基础保障金' },
                { prop: 'workerStatus', label: '状态', list:"workerStatusList"},
                { prop: 'createTime', label: '创建时间', "formatter": "dateParser"},
            ],
            selection: [],
            bindId:100,
            dialogVisible: false,
            showCheckbox: true,
            isShowFlow:false,
            flowMethod: null,
            flowService: null,
            flowArgs:null,
            treeProps: {
                    label: 'name',
                    children: 'children'
                },
            treeData:[]
        }
    },
    created() {
          this.treeSubOrg()
          utils.getPublicKey(function(res) {
                  if(res.data.status == 200){
                      RSA.encrypt.setPublicKey(res.data.result.key)
                  }
            })
    },
    // watch:{
    //     "$route.params":function(val, oldVal){
    //         if(oldVal.type && oldVal.type != 'view'){
    //             this.$refs.listTable.reloadTable()
    //         }
    //     }
    // },
    activated(){
        this.$refs.listTable.reloadTable()
    },
    methods: {
    	//搜素
    	submitSearch(obj) {
                if(obj.phone){
                    obj.phoneEncode = RSA.encryptfun(obj.phone)
                    delete obj.phone
                }
                this.args = { info: obj,  "sort":["id_desc"] }
         },
         onTreeClick(node){
            if(node.id == 0 && this.args.info){
                delete this.args.info.subOrgId
            }

            if(node.id != 0){
                this.args.info = this.args.info ? this.args.info : {}
                this.args.info.subOrgId = node.id
            }
             if(this.args.info && Object.values(this.args.info).length < 1){
                delete this.args.info
            }
            this.$refs.listTable.reloadTable()
         },
        treeSubOrg(){
             let args = {"search":{"typeCode":'001003006'}}
             var data = {id: 0, name: "全部组织", parentId: 0,children:[]}
            return api.organizationQuery(args).then((res) => {
                      if (res.data.status === 200) {
                              res.data.result.rows.forEach((item) => {
                                if(item.isDel != 1){
                                       data.children.push({
                                            id: item.id,
                                            name: item.name,
                                            parentId:0,
                                            children:[]
                                       })
                                  }
                              })

                          }
                        this.treeData = [data]
             })
       },
        //form
        handleBtnOKClick() {
            //this.dialogVisible = false
        },
        handleBtnCancleClick() {
            //this.dialogVisible = false
        },
        checkSelection() {
            let selections = this.$refs['listTable'].getSelectRows()
            if(selections.length===0){
                this.$message.error('请勾选收款单后再试。')
                return false
            }else if(selections.length>1){
                this.$message.error('请对单条数据进行操作。')
                return false
            }
            return true
        },
        //toolbar
        //点击添加按钮
        onBtnAdd() {
            this.$router.push({ path: 'foremanworker/add' })
        },
        //点击编辑按钮
        onBtnEdit() {
        	let selections = this.$refs['listTable'].getSelectRows()
            if(selections.length < 1){
                this.$message.error('请先勾选一条数据。')
                return false
            }
            if(selections.length > 1){
                this.$message.error('只能勾选一条数据进行编辑。')
                return false
            }
            let row = selections[0]
            if(row.workerStatus != 0 && row.workerStatus != 3 && row.workerStatus != 7){
                 this.$message.error('只有暂存或审核被驳回或解约驳回的工人、工长才能进行修改')
                return false
            }
            this.$router.push({ path: 'foremanworker/edit',query:{id: row['id']} })
        },
        onBtnView(){
            let selections = this.$refs['listTable'].getSelectRows()
            if(selections.length < 1){
                this.$message.error('请先勾选一条数据。')
                return false
            }
            if(selections.length > 1){
                this.$message.error('只能勾选一条数据进行查看。')
                return false
            }
            this.$router.push({ path: 'foremanworker/view',query:{id: selections[0]['id']} })
        },
        onBtnSubmit(){
            let selections = this.$refs['listTable'].getSelectRows()
            if(selections.length < 1){
                this.$message.error('请先勾选数据。')
                return false
            }
            var flage = true
            var ids = []
            selections.forEach((item) => {
                 if(item.workerStatus != 0 && item.workerStatus != 3){
                        flage = false
                        return false
                 }else{
                        ids.push(item.id)
                 }
            })
            if(!flage){
                this.$message.error('只有暂存或审核被驳回的工人、工长才能进行提交')
                return false
            }
            let args = {ids:ids, updateUser:Cookie.get('t8t-tc-uid')}
            this.$refs['toolbar'].disableBySymbol('EDIT-SUBMIT');
            api.submitBatch(args).then((res) =>{
                this.$refs['toolbar'].unDisableBySymbol('EDIT-SUBMIT');
                    if(res.data.status == 200){
                        var _this = this
                        this.$msgbox({
                                    title: '提交成功',
                                    type: 'success',
                                    message: '',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                }).then((val) =>{
                                    _this.$refs['listTable'].reloadTable()
                                })
                }else{
                    this.$msgbox({
                                title: '提交失败',
                                type: 'error',
                                message: res.data.result,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                              })
                }
            })
        },
        //工作流
        on_approval_flow(){
            let selections = this.$refs['listTable'].getSelectRows()
            if(selections.length < 1){
                this.$message.error('请先勾选一条数据。')
                return false
            }
            if(selections.length > 1){
                this.$message.error('只能勾选一条数据进行查看审批流')
                return false
            }
            this.isShowFlow = true
            if(selections[0].processId){
                this.flowMethod = service.FOREMANWORKER.methods.getProcessDetail
                this.flowService = this.service
                this.flowArgs = {workerId:selections[0].id}
            }
        },
        //开始接单
        on_jieDan(){
            let selections = this.$refs['listTable'].getSelectRows()
            if(selections.length < 1){
                this.$message.error('请先勾选数据。')
                return false
            }
             var flage = true
            var ids = []
            selections.forEach((item) => {
                 if(item.workerStatus != 2 || item.isProjectManager != 1  || item.isWorkerBankAccount != 1){
                        flage = false
                        return false
                 }else{
                        ids.push(item.id)
                 }
            })
            if(!flage){
                this.$message.error('只有审核通过、质保金已添加、银行卡已添加并且有资格成为项目经理的工人才能进行接单')
                return false
            }
            let args = {ids:ids, updateUser: Cookie.get('t8t-tc-uid')}
            this.$refs['toolbar'].disableBySymbol('JIEDAN');
            api.startWork(args).then((res) =>{
                this.$refs['toolbar'].unDisableBySymbol('JIEDAN');
                if(res.data.status == 200){
                        var _this = this
                        this.$msgbox({
                                    title: '开始接单成功',
                                    type: 'success',
                                    message: '',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                }).then((val) =>{
                                    _this.$refs['listTable'].reloadTable()
                                })
                }else{
                    this.$msgbox({
                                title: '开始接单失败',
                                type: 'error',
                                message: res.data.result,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                              })
                }
            })
        },
        //导入按钮
        on_import(){

        },
        //导出按钮
        on_export(){

        },
        //反审核
        on_anti_auditing(){
            let selections = this.$refs['listTable'].getSelectRows()
            if(selections.length < 1){
                this.$message.error('请先勾选数据。')
                return false
            }
            var flage = true
            var ids = []
            selections.forEach((item) => {
                 if(item.workerStatus != 2 && item.workerStatus != 4){
                        flage = false
                        return false
                 }else{
                    ids.push(item.id)
                 }
            })
            if(!flage){
                this.$message.error('只有审核通过或合作中的工人、工长才能进行反审核')
                return false
            }
            let args = {ids:ids, updateUser: Cookie.get('t8t-tc-uid')}
               this.$refs['toolbar'].disableBySymbol('ANTI-AUDITING');
              api.workerBaseServiceApprovalAnew(args).then((res) =>{
                    this.$refs['toolbar'].unDisableBySymbol('ANTI-AUDITING');
                   if(res.data.status == 200){
                            let _this = this
                              this.$msgbox({
                                        title: '反审核成功',
                                        type: 'success',
                                        message: '',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    }).then(() =>{
                                        _this.$refs['listTable'].reloadTable()
                                    })
                         }else{
                             this.$msgbox({
                                title: '反审核失败',
                                type: 'error',
                                message: res.data.result,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                              })
                        }
              })
        },
        //点击编辑按钮
        handleRowDblclick(row, event) {
            this.$router.push({ path: 'foremanworker/view',query:{id: row['id']} })
        }
    }
};
</script>

<style lang="css" scoped>
.list-container{
    display: flex;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-direction: column;
    flex-direction: column;
    overflow: auto;
}
</style>
