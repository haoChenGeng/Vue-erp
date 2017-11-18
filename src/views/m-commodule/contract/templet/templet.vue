<template>
	<div>
		<t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
		<t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>
		<t8t-toolbar
            @VIEW = "view"
            @ADD = "add"
            @DISABLE = "disable"
            @ANTI-DISABLE = "antiDisable"
        >
		</t8t-toolbar>
		<t8t-table
			:columns="columns"
            :service="service"
            :method="method"
            :args="args"
            ref="t8ttable"
            @row-double-click="view"
		>
            <template slot="fatherContractName" scope="scope">
                    <span
                        v-if="scope.row['fatherContractName']===''"
                    >—— ——</span>
                    <span
                        v-else-if="scope.row['fatherContractName']!==''"
                    >{{scope.row['fatherContractName']}}</span>
            </template>
		</t8t-table>
	</div>
</template>
<script>
import commonApi from 'src/services/commonApi/commonApi.js'
import Service from 'src/services/commodule/Service.js'
import api from 'src/services/commodule/templet.js'
export default {
	name:'certification',
	data(){
		return{
			//面包屑
                breadcrumbData: [
                    { title: '工模售前' },
                    { title: '合同管理' },
                    { title: '模板管理' },
                ],
                //搜索表单字段初始化，对应searchFormConfig的searchValName
                searchValConfig:{
                	id:null,
                	businessTypeId:null,
                    state:null,
                },
                //搜索表单项配置
                fields:[
                    { type: 'select' , label: '模板ID&名称',name: 'id',selectSourceKey:'ContrctName',filterable: true},
                    { type: 'select' , label: '业务类型',name: 'businessTypeId',selectSourceKey:'TypeCode' },
                    { type: 'select' , label: '状态',name: 'state',selectSourceKey:'StatusCode' },
                ],
                //搜索select类型下拉列表数据，对应searchFormConfig的commonOptionsName
                selectSource: {
                    TypeCode:[],
                    ContrctName:[],
                    StatusCode: [{
                        text: '启用',
                        value: 1
                    },{
                        text: '禁用',
                        value: 2
                    }],
                },
                //表格

                columns: [{
                    prop: 'id',
                    label: '模板ID'
                }, {
                    prop: 'businessType',
                    label: '业务类型'
                }, {
                    prop: 'contractName',
                    label: '合同名称',
                    width:  250,
                },{
                    prop: 'billName',
                    label: '单据名称',
                    width:  250,
                }, {
                    prop: 'codeRule',
                    label: '编码规则',
                    width:  250,
                }, {
                    prop: 'contractKind',
                    label: '属性'
                }, {
                    prop: 'fatherContractName',
                    label: '关联主合同',
                    width: 250,
                }, {
                    prop: 'contractType',
                    label: '类型'
                },{
                    prop: 'firstRoleStr',
                    label: '甲方',
                    width:  250,
                }, {
                    prop: 'secondRoleStr',
                    label: '乙方',
                    width:  250,
                }, {
                    prop: 'thirdRoleStr',
                    label: '丙方',
                    width:  250,
                },{
                    prop: 'stateStr',
                    label: '状态'
                },{
                    prop: 'createTimeStr',
                    label: '添加时间'
                },{
                    prop: 'createUserStr',
                    label: '添加人'
                }],
                //请求参数配置
                service: Service.TEMPLETRECORD.name,
                method: Service.TEMPLETRECORD.methods.QUERYPAGE,
                args: null,


		}
	},
    created() {
        // 业务类型
        this.getCommonOptions('11008','TypeCode')
        //合同ID和名称
        this.getContent('ContrctName')

    },
    // watch: {
    //     $route: function () {
    //         this.$refs['t8ttable'].reloadTable()
    //     }
    // },
    activated() {
        this.$refs['t8ttable'].reloadTable()
    },
    methods:{
        //搜索，提交搜索并且发起刷新表格数据的请求
        submitSearch(data) {
            this.args = {
                search: data
            }
        },
        getCommonOptions: function(fatherCode,selectName) {
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
        getContent:function(selectName)
        {
            let arg =  {}
            let list = []
            api.queryModelBasic(arg)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        list.push({
                            value: item.id,
                            text: item.id+'|'+item.contractName
                        })
                    })
                    this.selectSource[selectName] = list
                }
            })

        },
        view(){
            // 单行判断
            let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            if(this.checkSelection() === false) return false
            this.$router.push({path: 'templet/see',query:{rowId:selectRow.id}})
        },
        add(){
            this.$router.push({path: 'templet/add'})
        },
        disable(){
            // 单行判断
            if(this.checkSelection() === false) return false
             let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            // 勾选数据不是启用

            if(selectRow.state !== 1){
                this.$msgbox({
                    title: '消息',
                    type: 'warning',
                    message: '启用状态才能进行禁用操作',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                return false
            }else {
                // 禁用状态弹窗确认审核
                this.$confirm('确认将所选模板禁用？', '禁用确认', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                .then(() => {
                    // 点击确定按钮
                    var idsArr = [] ;
                    idsArr.push(selectRow.id)
                    let args = {
                        ids: idsArr,
                        state:2,
                    }
                    api.forBid(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result === 1){
                            // 成功弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '禁用成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.$refs['t8ttable'].reloadTable()
                        } else {
                            // 失败弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '禁用失败，请重试。',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        }
                    })
                })
                .catch(() => {
                    // 关闭弹窗
                })
            }
        },
        antiDisable(){
              // 单行判断
            if(this.checkSelection() === false) return false
             let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            // 勾选数据不是禁用

            if(selectRow.state !== 2){
                this.$msgbox({
                    title: '消息',
                    type: 'warning',
                    message: '禁用状态才能进行启用操作',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                return false
            }else {
                // 待审核状态弹窗确认审核
                this.$confirm('确认将所选模板启用？', '启用确认', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                .then(() => {
                    // 点击确定按钮
                    var idsArr = [] ;
                    idsArr.push(selectRow.id)
                    let args = {
                        ids: idsArr,
                        state:1,
                    }
                    api.forBid(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result === 1){
                            // 成功弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '启用成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.$refs['t8ttable'].reloadTable()
                        } else {
                            // 失败弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '启用失败，请重试。',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        }
                    })
                })
                .catch(() => {
                    // 关闭弹窗
                })
            }
        },
        checkSelection() {
            let selections = this.$refs['t8ttable'].getSelectRows()
            if(selections.length===0){
                this.$message.error('请勾选记录后再试。')
                return false
            }else if(selections.length>1){
                this.$message.error('请对单条数据进行操作。')
                return false
            }
            return true
        },
    }
}
</script>
