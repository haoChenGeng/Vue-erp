<template>
    <div class="page-pay-bills">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
            @change="onChange"
            ref="t8tsearch"
            @visible-change="visibleChange"
        >
        </t8t-search>
        <t8t-toolbar
            @EXPORT="onExport"
            v-loading.body.lock="toolbarLoading"
            element-loading-text="加载中"
        >
        </t8t-toolbar>
        <t8t-table
            :columns="tableColumns"
            :service="service"
            :method="method"
            :commonData="selectSource"
            :args="args"
            ref="t8ttable"
        >
        </t8t-table>
    </div>
</template>

<script>

    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/finance/Service.js'
    import exportUtils from 'src/utils/export.js'//导出
    import packageService from 'src/services/delivery/broadcast.js'


    export default {
        name: 'deposit-detail-page',
        components: {},

        data () {
            return {
                service:Service.DEPOSIT_MANAGEMENT.name,
                method:Service.DEPOSIT_MANAGEMENT.methods.ITEM_QUERY,
                args: {
                    search: {
                        id_gt: 0
                    },
                    sort: ["id_desc"]
                },
                exportParams: {
                    search: {id_gt: 0},
                    sort: ["id_desc"],
                    page: 1,
                    size: 10000
                },//导出传参
                breadcrumbData: [{title: '财务'}, {title: '质保金管理'}, {title: '余额明细'}],
                selectSource: {//业务类型和产品包
                    bizTypeOptions:[],
                    productPackageOptions:[]
                },
                //搜索表单项配置
                fields: [
                    {type: 'input', label: '项目经理ID', name: 'pmId'},
                    {type: 'input', label: '项目经理', name: 'pmName_like'},
                    {type: 'select', label: '业务类型', name: 'bizTypeId', selectSourceKey: 'bizTypeOptions'},
                    {type: 'select', label: '产品包', name: 'productPackageId',selectSourceKey:'productPackageOptions'}
                ],
                tableColumns: [
                    {prop: 'projectId', label: '项目ID'},
                    {prop: 'pmId', label: '项目经理ID'},
                    {prop: 'pmName', label: '项目经理'},
                    {prop: 'orgName', label: '组织'},
                    {prop: 'bizTypeName', label: '业务类型'},
                    {prop: 'productPackageName', label: '产品包'},
                    {prop: 'customerName', label: '业主姓名'},
                    {prop: 'projectAddress', label: '项目地址'},
                    {prop: 'depositTypeName', label: '质保金类型'},
                    {prop: 'balance', label: '金额'},
                ],
            }
        },
        created() {
            this.getCommonOptions('11008', 'bizTypeOptions')
        },
        methods: {
            visibleChange(value, name) {
                if (name === 'productPackageId') {
                    if (value) {
                        if (!this.$refs.t8tsearch.formData.bizTypeId) {
                            this.$message.error('请先选择业务类型')
                        }
                    }
                }
            },
            onChange(value, name) {
                // 如果业务类型的值改变
                if (name === 'bizTypeId') {
                    this.selectSource.productPackageOptions = []
                    let data = {
                        bizTypeId: value,
                        productPackageId: ''
                    }
                    this.$refs.t8tsearch.setFormData(data)
                    //获取产品包id
                    if(value){
                        this.getProductPackageOptions(value);
                    }
                }
            },
            getProductPackageOptions(bizTypeId){
                let args = {
                    search: {
                        bizType: bizTypeId
                    }
                }
                packageService.pkgQuery(args).then((res)=>{
                    if(res.data.status === 200) {
                        let list = []
                        let idArr = []
                        res.data.result.forEach((item) => {
                            if(item.id !== 0 && item.pkgName !== '' && idArr.indexOf(item.id) === -1) {
                                list.push({
                                    value: item.id,
                                    text: item.pkgName
                                })
                                idArr.push(item.id)
                            }
                        })
                        this.selectSource.productPackageOptions = list
                    }
                })
            },
            submitSearch(obj) {
                this.args = {
                    search: obj,
                    sort:['id_desc']
                }
                this.exportParams.search=obj;
            },
            //导出数据
            onExport() {
                this.$msgbox({
                    message: '正在导出中,请注意左下方,稍后有导出的文件',
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })

                let ids = []
                let checkArray = this.$refs['t8ttable'].getSelectRows()
                if (checkArray.length > 0) {
                    checkArray.forEach((item) => {
                        ids.push(item.id)
                    })
                    this.exportParams = {
                        search: {
                            id_in: ids
                        },
                        sort: ["id_desc"],
                        page: 1,
                        size: 10000
                    }
                }

                let paramsExport = this.exportParams.search
                let objectFlag = false
                objectFlag = this.isEmptyObjectParams(paramsExport)
                if (!objectFlag) {
                    this.exportParams = {
                        search: {
                            id_gt:0
                        },
                        sort: ["id_desc"],
                        page: 1,
                        size: 10000
                    }
                }
                exportUtils({
                    service: Service.DEPOSIT_MANAGEMENT.name,
                    method: Service.DEPOSIT_MANAGEMENT.methods.DEPOSIT_ITEM_EXPORT,
                    title:'质保金余额明细',
                    args: this.exportParams,
                    headers: '项目ID,项目经理ID,项目经理,组织,业务类型,产品包,业主姓名,项目地址,质保金类型,金额',
                    sorts: 'projectId,pmId,pmName,orgName,bizTypeName,productPackageName,customerName,projectAddress,depositTypeName,balance'
                })
            },

            isEmptyObjectParams(data)
            {
                let objectFlags = false
                for (let i in data) {
                    if(data[i]!=null){
                        objectFlags = true
                    }
                }
                return objectFlags
            },
            getCommonOptions: function (fatherCode, selectName) {
                let arg = {
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
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            })
                            this.selectSource[selectName] = list
                        }
                    })
            }
        }
    }
</script>
