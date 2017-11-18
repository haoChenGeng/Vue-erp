<template>
    <div>
        <t8t-list-view
            ref="list-view"
            showTree="true"
            showToolbar="true"

            :showSearchToggleBtn="false"
            :refreshOnTreeClick="false"

            :breadcrumbData="breadcrumbData"
            :treeData="treeData"
            :treeArgs="treeArgs"
            :searchFields="searchFields"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableMethod="method"
            :tableArgs="tableArgs"
            :tableRadioCol="true"
            :tableHighlightCurrentRow="true"

            @search-submit="onSearchSubmit"
            @tree-node-click="onNodeClick"
            @list-view="onView"
            @list-add="onAdd"
            @list-edit="onEdit"
            @list-check="onCheck"
            @table-current-row-change="onTableRowClick"
        >
        </t8t-list-view>
        <my-dialog
            v-if="isShow"
            :dialogStatus="dialogStatus"
            :rowData="curRow"
            :commonData="commonData"
            :moduleOptions="moduleOptions"
            @close="isShow=false"
            @success="onSuccess"
        ></my-dialog>
    </div>
</template>
<script>
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/system/Service'
    import axios from 'src/utils/axios.js'
    import Cookie from 'js-cookie'
    import MyDialog from './config-dialog.vue'

    export default{
        components: {
          MyDialog
        },
        data(){
            return {
                service: Service.CONDITION.name,
                method: Service.CONDITION.methods.CONDITION_PAGE_QUERY,
                tableArgs: {},
                tableColumns: [
                    {
                        prop: "id",
                        label: "序号"
                    }, {
                        prop: "conditionName",
                        label: "条件变量名"
                    }, {
                        prop: "conditionVar",
                        label: "变量"
                    }, {
                        prop: "moduleName",
                        label: "业务模块"
                    }, {
                        prop: "description",
                        label: "描述"
                    }, {
                        prop: "createTime",
                        label: "创建时间",
                        formatter: "dateParser"
                    }, {
                        prop: "createUserName",
                        label: "创建人"
                    }

                ],
                treeData: [],
                breadcrumbData: [
                    {title: '系统管理'},
                    {title: '配置管理'},
                    {title: '条件管理'}
                ],
                searchFields: [
                    {type: 'input', label: '条件变量名', name: 'conditionName_like', placeholder: '条件变量名关键字'}
                ],
                isShow: false,
                curRow: null,
                dialogStatus: '',
                moduleOptions: []
            }
        },
        created() {
            this.initTree();
        },
        methods: {
            initTree(){
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: '11602'
                    },
                    size: 100
                }, list = []

                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    list.push({
                                        id:item.id,
                                        value: item.id,
                                        label: item.propertyName
                                    })

                                    this.moduleOptions = list;
                                }
                            });
                            this.treeData = [
                                {
                                    id: 0,
                                    label: '业务模块',
                                    children: list
                                }
                            ];
                        }
                    })
            },

            onSearchSubmit: function (obj) {

              console.log(obj);
                this.tableArgs = {
                    sort: ["id_desc"],
                    search: obj
                }

            },

            onNodeClick: function (nodeData) {

                this.tableArgs = {
                  sort: ["createTime_desc"],
                  search: { moduleId: nodeData.id }
                }

            },
            onView (symbol, event) {

                if (!this.curRow) {
                    return this.$message("请选择一行数据!");
                }

                this.showDialog('view');

            },
            onAdd (symbol, event){

                this.showDialog('create');

            },
            onEdit (symbol, event){

                if (!this.curRow) {
                    return this.$message("请选择一行数据!");
                }
                this.showDialog('edit');

            },
            showDialog(status) {

                this.dialogStatus = status;
                this.isShow = true;

            },
            onSuccess(data) {

                this.$refs['list-view'].getTableInstance().reloadTable();

            },
            beforeTreeSubmit(data) {

            },
            onTableRowClick(curRow) {

                this.curRow = curRow;
                console.log(curRow);

            },
            onTableRDC(row) {

                this.curRow = row;
                this.showDialog('view');

            }
        }
    }
</script>
