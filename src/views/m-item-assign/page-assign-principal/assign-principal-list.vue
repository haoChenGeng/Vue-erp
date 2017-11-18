<template>
    <!-- 标签页区 -->
    <div class='full-dialog-tabs-container'>
        <t8t-list-view
            ref='list-view'
            :deleteMethod='deleteMethod'
            :breadcrumbData='breadcrumbData'
            :searchFields='searchFields'
            :searchOptions='searchOptions'
            :showSearchToggleBtn='true'
            :tableColumns='tableColumns'
            :tableService='service'
            :tableArgs='tableArgs'
            :tableMethod='method'
            :tableCommonData='searchOptions'
            @list-assign-delivery='assignDelivery'
            @list-assign-project='assignProject'
            @list-assign-item='assignItemManager'
            @list-assign-customer-service='assignCustomerService'
            @search-submit='onSearchSubmit'
        >
        </t8t-list-view>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    import itemAssignApi from 'src/services/itemAssign/API.js'
    import itemAssignService from 'src/services/itemAssign/Service.js'
    import Service from 'src/services/salemanager/Service.js'

    export default {
        components: { T8tListView },
        created () {
            // 组织加载
            // this.loadOrganizations('001003010') // 门店CODE
            this.loadOrganizations('001003006')     // 分公司CODE
            // 派工类型
            this.getCommonOptions('42101', 'assignTypes')
            // 加载派工原因
            /*this.getCommonOptions('42102', 'assignReasons')*/
            // 加载产品包信息
            this.loadProductInfo()
        },
        activated() {
            this.$refs['list-view'].getTableInstance().reloadTable()
        },
        data () {
            return {
                // 列表服务配置
                service: itemAssignService.ITEM_ASSIGN.name,
                method: itemAssignService.ITEM_ASSIGN.methods.LIST_ASSIGN_PROJECT,
                tableArgs: {
                    search:{assignBy: +Cookie.get('t8t-tc-uid')}
                },
                // 表头描述
                tableColumns: [
                    {prop: 'projectId', label: '项目ID'},
                    {prop: 'subCompany', label: '分公司'},
                    {prop: 'address', label: '地址'},
                    {prop: 'ownerName', label: '业主称呼'},
                    {prop: 'contractStatus', label: '合同状态'},
                    {prop: 'projectState', label: '项目状态'},
                    {prop: 'productPage', label: '产品包'},
                    {prop: 'deliveryManager', label: '交付经理'},
                    {prop: 'projectManager', label: '工程管家'},
                    {prop: 'itemManager', label: '项目经理'},
                    {prop: 'customerService', label: '售后客服'}
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'input', label: '项目ID', name: 'projectId'},
                    {type: 'select', label: '分公司', name: 'subCompanyId', selectSourceKey: 'organizations'},
                    {type: 'select', label: '分配负责人', name: 'waitAssignTypeCode', selectSourceKey: 'waitAssignTypes'},
                    /*{type: 'select', label: '派单原因', name: 'assignReason', selectSourceKey: 'assignReasons'},*/
                    {type: 'select', label: '产品包', name: 'productPkg', selectSourceKey: 'productPkgs'},
                    {type: 'oldarea', label: '城市',name: 'city', subNames : [ 'proId', 'cityId', 'townId'] , clearable: true },
                    {type: 'input', label: '楼盘名称', name: 'estate'},
                    {type: 'input', label: '业主称呼', name: 'ownerName'},

                    // {type: 'input', label: '楼盘', name: 'estate'},
                    // 以下是隐藏的部分
                    {type: 'input', name: 'assignBy', inputType: 'hidden', defaultValue: +Cookie.get('t8t-tc-uid')}
                ],
                // 面包屑
                breadcrumbData: [
                    {title: '交付管理'},
                    {title: '派单'},
                    {title: '工程派单'}
                ],
                // 搜索项对应值
                searchOptions: {
                    organizations: [],        // 分公司
                    productPkgs: [],       // 产品包
                    assignReasons: [],      // 派工原因
                    waitAssignTypes: [      // 待派单类型
                        {value: '05', text: '未分交付经理'},
                        {value: '06', text: '未分工程管家'},
                        {value: '01', text: '未分项目经理'}
                    ]
                }
            }
        },
        methods: {
            onSearchSubmit: function () {
                //console.log('点击搜索。。。')
                //console.log(this.service + ' -- ' + this.method)
            },
            assignDelivery: function () {
                let selectRow = this.getSelectRowData()
                if (selectRow == null)
                    return
                // 派单-交付经理
                this.$refs['list-view'].doView('/itemAssign/assign-principal-delivery-page', 'projectId')
            },
            assignProject: function (row, abc) {
                // 判断是否已分配交付经理
                let selectRow = this.getSelectRowData()
                if (selectRow == null)
                    return
                if (selectRow['deliveryManager'] === '待派单') {
                    this.$message.error('请先分配【交付经理】')
                    return
                }
                // 派单-工程管家
                this.$refs['list-view'].doView('/itemAssign/assign-principal-project-page', 'projectId')
            },
            assignItemManager: function () {
                // 判断是否分配交付经理、工程管家
                let selectRow = this.getSelectRowData()
                if (selectRow == null)
                    return
                if (selectRow['deliveryManager'] === '待派单') {
                    this.$message.error('请先分配【交付经理】')
                    return
                } else if (selectRow['projectManager'] === '待派单') {
                    this.$message.error('请先分配【工程管家】')
                    return
                }
                // 派单-项目经理
                this.$refs['list-view'].doView('/itemAssign/assign-principal-item-page', 'projectId')
            },
            assignCustomerService: function () {
                // 判断合同审核是否审核通过
                let selectRow = this.getSelectRowData()
                if (selectRow == null)
                    return
                if (selectRow['contractStatus'] === '审核通过') {
                } else {
                    this.$message.error('请先进行合同审核')
                    return
                }
                // 派单-项目经理
                this.$refs['list-view'].doView('/itemAssign/assign-principal-customer-service-page', 'projectId')
            },
            getSelectRowData: function () {
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if (rows.length !== 1) {
                    this.$message.error('请勾选一行数据后再试。')
                    return
                }
                return rows[0]
            },
            // 查询组织信息
            loadOrganizations: function(typeCode) {
                commonApi.queryAll({'search': {'typeCode': typeCode}})
                    .then((res => {
                        let list = []
                        if (res.data.status === 200) {
                            res.data.result.rows.forEach((item) => {
                                if (item.isDel===0) {
                                    list.push({
                                        value: item.id,
                                        text: item.name
                                    })
                                };
                            })
                            this.searchOptions['organizations'] = list
                        }
                    }))
            },
            loadProductInfo: function () {
                var args = {}
                itemAssignApi.loadProductInfo(args).then((res) => {
                    let list = []
                    if (res.data.status === 200) {
                        res.data['result'].forEach((item) => {
                            list.push({
                                value: item.id,
                                text: item.pkgName
                            })
                        })
                        this.searchOptions['productPkgs'] = list
                    } else {
                        this.showMsg('error', '加载产品包信息失败！')
                    }
                })
            },
            // 调用辅助资料接口
            getCommonOptions: function(fatherCode, selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg).then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName,
                                        code: item.propertyCode
                                    })
                                };
                            })

                            this.searchOptions[selectName] = list
                        }
                    })
            },
            // 弹窗提示抽离方法
            showMsg: function (state, msg) {
                this.$msgbox({
                    title: '消息',
                    type: state,
                    message: msg,
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
            }
        }
    }
</script>

<style lang='css' scoped>

</style>
