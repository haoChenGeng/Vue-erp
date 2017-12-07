<template>
    <div>
        <t8t-search
            ref="t8tSearch"
            :fields="fields"
            :showToggleBtn="false"
            :selectSource="commonData"
            @submit="submitSearch"
            @change="handleSearchChange"
            @visible-change="handleVisibleChange"
        >
        </t8t-search>

        <div class="g-main-container">
            <t8t-tree
                :data="treeData"
                :props="treeProps"
                :default-expanded-keys="[1]"
                @node-click="onTreeClick"
            >
            </t8t-tree>
            <div class="g-main-container-column">
                <t8t-table
                    :columns="columns"
                    :service="service"
                    :method="method"
                    :args="args"
                    :pageBar="true"
                    :commonData="commonData"
                    ref="t8tTable"
                    @selection-change="selectionChange"
                    @data-loaded="dataLoaded"
                >
                    <template slot="id" scope="scope">
                        <a href="javascript:;"
                           @click="showDetail(scope.row['id'])">{{scope.row['id']}}</a>
                    </template>
                </t8t-table>
            </div>
        </div>
    </div>
</template>

<script>
    import Service from 'src/services/delivery/Service.js'
    import TemplateOperator from 'src/services/delivery/template-base.js'
    import TemplateOperator1 from 'src/services/delivery/pcm.js'
    import api from 'src/utils/api.js'
    import Cookie from 'js-cookie'
    export default {
        components: {},
        data () {
            return {
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                //搜索表单项配置
                fields: [
                    {type: 'input', label: '项目ID', name: 'id'},
                    {type: 'select', label: '项目主状态', name: 'orderMainStatus', selectSourceKey: 'search_mainStatusCode'},
                    {type: 'select', label: '项目子状态', name: 'orderSubStatus', selectSourceKey: 'search_subStatusCode', loading:false},
                    {
                        type: 'popup',
                        label: '业主姓名',
                        name: 'ownerId',
                        textValue: 'truename',
                        filedValue: 'id',
                        triggerOnFocus: false,
                        remote: true,
                        service: Service.SYSACC.name,
                        method: Service.SYSACC.methods.queryPageOwner,
                        remoteArgs:{ page: 1, size: 20},
                        remoteQueryKey:"truename_like",
                        dialog: {
                            title: '业主搜索',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '业主姓名', name: 'truename_like'}
                                ]
                            },
                            table: {
                                service: Service.SYSACC.name,
                                method: Service.SYSACC.methods.queryPageOwner,
                                args: {},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'id',
                                        label: 'ID',
                                    },
                                    {
                                        prop: 'truename',
                                        label: '业主姓名'
                                    },
                                    {
                                        prop: 'address',
                                        label: '业主地址',
                                        formatter: this.ownerAddressFormatter
                                    }
                                ]
                            }
                        }
                    },
                    {
                        type: 'popup',
                        label: '工长姓名',
                        name: 'chiefWorkerId',
                        textValue: 'workerName',
                        filedValue: 'accountId',
                        triggerOnFocus: false,
                        remote: true,
                        service: Service.TEMPLATE.name,
                        method: Service.TEMPLATE.methods.workerBaseServiceQueryPageInternal,
                        remoteArgs:{ page: 1, size: 20},
                        remoteQueryKey:"workerName_like",
                        dialog: {
                            title: '工长搜索',
                            size: 'large',
                            searchForm: {
                                showToggleBtn: false,
                                fields: [
                                    {type: 'input', label: '工长姓名', name: 'workerName_like'}
                                ]
                            },
                            table: {
                                service: Service.TEMPLATE.name,
                                method: Service.TEMPLATE.methods.workerBaseServiceQueryPageInternal,
                                args: {},
                                radioCol: true,
                                columns: [
                                    {
                                        prop: 'accountId',
                                        label: 'ID',
                                    },
                                    {
                                        prop: 'workerName',
                                        label: '工长姓名'
                                    },
                                    {
                                        prop: 'address',
                                        label: '详细地址',
                                        formatter: function(val, row, col, tab){
                                            return row.address;
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    {type: 'datetime',label: '开工时间自',name: 'startTime_gt'},
                    {type: 'datetime',label: '开工时间至',name: 'startTime_lt'},
                ],
                columns: [
                    {"prop": "id", "label": "项目ID", "width":130},
                    {"prop": "organizationName", "label": "组织", "width":130},
                    {"prop": "chiefWorkerName", "label": "工长姓名", "width":150},
                    {"prop": "ownerName", "label": "业主姓名", "width":150},
                    {"prop": "projectManagerName", "label": "交付管家"},
                    {"prop": "orderSubStatus", "label": "项目状态", "width":150, "formatter":function(val, row, col, table){
                            return row.decorationOrderVO.orderMainStatusName + '/' + row.decorationOrderVO.orderSubStatusName
                    }},
                    {"prop": "address", "label": "项目地址", "width":300, "formatter":function(val, row, col, table){
                            return row.decorationOrderVO.cityName + row.decorationOrderVO.standardTownName + row.decorationOrderVO.estateName + row.decorationOrderHouseVO.houseAddress
                    }},
                    { "prop": "startTime", "label": "开工日期" ,"formatter": "dateParser"},
                    { "prop": "completedTime", "label": "竣工时间" ,"formatter": "dateParser"},
                ],
                commonData: {
                    moduleStatus: [
                        {
                            text: '启用',
                            value: 1
                        },
                        {
                            text: '禁用',
                            value: 0
                        }
                    ],
                    search_mainStatusCode: [],
                    search_subStatusCode: [],
                },
                service: Service.PRSMDM.name,
                method: Service.PRSMDM.methods.decorationOrderQueryDetailPage,
                args: {
                    fields: ["id","organizationId", "chiefWorkerId", "chiefWorkerName","ownerId", "ownerName", "projectManagerId", "projectManagerName","orderMainStatus","orderSubStatus","startTime","completedTime","houseAddress","cityId","cityName","townId","townName","estateId","estateName"]
                },
                //弹窗dialog配置
                editType: 'add',
                dialogVisible: false,
                rowId: null,
                dialogTitle: '',
                tableData: [],
                selectedRows: [],
                filterData:{}
            }
        },
        created (){
            this.filterData = {projectManagerId: +Cookie.get('t8t-tc-uid')};
            let fields = this.args.fields;
            this.args = Object.assign({},{search: this.filterData,fields:fields});
            TemplateOperator.queryTreeByType({typeCodes: ['001003010'],random: Math.random()}).then((res) => {
                if (res.data.status === 200) {
                    this.treeData = [res.data.result];
                }
            });
            //主状态
            TemplateOperator1.queryPropertyUnion({page: 1, size: 200, search: {pPropertyCode: "109"}}).then((res) => {
                if (res.data.status === 200) {
                    let searchList = [];
                    let rows = res.data.result;
                    for (let i in rows) {
                        searchList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                    }
                    this.commonData.search_mainStatusCode = searchList;
                }
            });
        },
        methods: {
            dataLoaded(dataSource){
                dataSource.forEach((item,index)=>{
                    item.decorationOrderVO = item.decorationOrderVO || {};
                    dataSource[index].id = item.decorationOrderVO.id;
                    dataSource[index].organizationName = item.decorationOrderVO.organizationName;
                    dataSource[index].chiefWorkerName = item.decorationOrderVO.chiefWorkerName;
                    dataSource[index].ownerName = item.decorationOrderVO.ownerName;
                    dataSource[index].projectManagerName = item.decorationOrderVO.projectManagerName;
                    dataSource[index].startTime = item.decorationOrderVO.startTime;
                    dataSource[index].completedTime = item.decorationOrderVO.completedTime;
                })
            },
            //搜素
            submitSearch(obj) {
                let fields = this.args.fields;
                this.args = {
                    search: Object.assign(obj,this.filterData), fields: fields
                }
            },
            handleSearchChange(value, filed){
                if(filed == 'orderMainStatus'){
                        this.commonData.search_subStatusCode = []
                        this.$refs.t8tSearch.setFormData({orderSubStatus:null})
                        this.fields[2]['loading'] = true
                       TemplateOperator1.queryPropertyUnion({page: 1, size: 200, search: {pPropertyCode: value}}).then((res) => {
                        this.fields[2]['loading'] = false
                        if (res.data.status === 200) {
                            let searchList = [];
                            let rows = res.data.result;
                            for (let i in rows) {
                                searchList.push({text: rows[i]['propertyName'], value: rows[i]['propertyCode']});
                            }
                            this.commonData.search_subStatusCode = searchList;
                        }
                    }).catch(() =>{
                        this.fields[2]['loading'] = false
                    })
                }
            },
            handleVisibleChange(value, filed){
                let searchData = this.$refs.t8tSearch.getFormData()
                if(filed == 'orderSubStatus' && value && !searchData.orderMainStatus){
                        this.$message.error('请先选择项目主状态！')
                        return false
                }
            },
            onTreeClick (nodeData){
                let search = {}
                search.organizationId = nodeData.id
                this.args.search = Object.assign(search,this.filterData)
                this.args = Object.assign({}, this.args)
            },
            addressFormatter(val, row, col, tab)
            {
                let address;
                address = (row.cityName || '') + (row.townName || '') + (row.estateName || '') + (row.houseAddress || '');
                return address;
            },
            ownerAddressFormatter(val, row, col, tab)
            {
                let address;
                address = (row.oshen || '') + (row.ocity || '') + (row.adds || '');
                return address;
            },
            //查看详情
            showDetail: function (id, name) {
                this.$router.push({
                    path: '/tochat-delivery/yanshou-project-detail',
                    query: {projectId: id}
                })
            },
            //表格
            getTableData() {
                this.$refs['t8tTable'].reloadTable()
            },
            //行变化事件
            selectionChange (rows){
                //已选择行
                this.selectedRows = rows;
            }
        }
    }
</script>

<style>

</style>
