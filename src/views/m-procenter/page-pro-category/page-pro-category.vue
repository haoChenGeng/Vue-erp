<template>
    <div class="page-pro-category">
        <t8t-breadcrumb :data="breadcrumb">
        </t8t-breadcrumb>



        <!--<t8t-search-->
            <!--:fields="fields"-->
            <!--:selectSource="selectSource"-->
            <!--@submit="submitSearch"-->
        <!--&gt;-->
        <!--</t8t-search>-->

        <div class="g-main-container">
            <t8t-tree
                :data="treeData"
                :props="treeProps"
                :default-expanded-keys="defaultExpandedKeys"
                @node-click="onTreeClick"
            >
            </t8t-tree>

                <div class="g-main-container-column">
                    <t8t-toolbar
                        @VIEW="getCategory"
                        @ADD="addCategory"
                        @UPDATE="updateCategory"
                        @START="startCategory"
                        @DISABLE="stopCategory">
                    </t8t-toolbar>
                <t8t-table
                    :columns="columns"
                    :service="service"
                    :method = "method"
                    :commonData = "commonData"
                    :args= "args"
                    ref="t8tTable"
                    @row-double-click="handleRowDbClick"
                ></t8t-table>
                </div>
        </div>

        <category-dalialogs
            v-if="dialogVisible"
            :rowId="rowId"
            :editType="editType"
            @close="dialogVisible=false"
            @getTableData="getTableData"
            @seachTree="seachTree"
        >
        </category-dalialogs>
    </div>
</template>

<script>
    import Service from 'src/services/procenter/Service.js'
    import apiProCenter from 'src/services/procenter/proCenterApi.js'
    import Cookie from 'js-cookie'
    import config from './config.json'
    import CategoryDalialogs from './dialog.vue'

    export default({
            name:'page-pro-category',

        components: {
            CategoryDalialogs
        },
         data(){
             return{
                        //面包屑
                        breadcrumb:config.breadcrumbData,

                        //列表参数
                        service: Service.CATEGORY.name,
                        method: Service.CATEGORY.methods.SEARCHCATEGORY,
                        columns:config.columns,
                        commonData:config.commonData,

                        //查询条件
                        fields:config.fields,
                        selectSource:config.selectSource,

                        //左树
                         treeData: [
                                     ],
                         treeProps: {
                             label: 'label',
                             children: 'subclass',
                         },

                        args:{
                        },
                        //弹窗页
                         dialogVisible:false,
                        rowId:null,
                        editType:"add"

                    }
        },
        created(){
            this.seachTree()
        },
        methods:{

            getTableData()
            {
                this.$refs['t8tTable'].reloadTable()
            },

            addCategory()
            {
                this.dialogVisible = true
                this.editType = "add"

            },

            updateCategory()
            {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if(selections.length ===0)
                {
                    this.$message.error("请勾选分类")
                }
                else if(selections.length>1)
                {
                    this.$message.error("只允许勾选单条数据")
                }
                else {
                    this.dialogVisible = true,
                    this.editType = "update",
                        this.rowId=selections[0].id
                }
            },

            getCategory()
            {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if(selections.length ===0)
                {
                    this.$message.error("请勾选分类")
                }
                else if(selections.length>1)
                {
                    this.$message.error("只允许勾选单条数据")
                }
                else {
                    this.dialogVisible = true,
                        this.rowId=selections[0].id
                    this.dialogVisible = true,
                        this.editType = "see"
                }

            },

            seachTree()
            {
                var search = {
                    flag:true
                }
                apiProCenter.getCategoryTree(search).then(res=> {
                    this.treeData = res.data.result
                })
            },

            startCategory()
            {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if(selections.length ===0)
                {
                    this.$message.error("请勾选分类")
                }
                else if(selections.length>1)
                {
                    this.$message.error("只允许勾选单条数据")
                }
                else {
                        this.rowId=selections[0].id
                        this.updateCategoryStatus(this.rowId,0)
                }
                this.getTableData()
            },
            stopCategory()
            {
                let selections = this.$refs['t8tTable'].getSelectRows()
                if(selections.length ===0)
                {
                    this.$message.error("请勾选分类")
                }
                else if(selections.length>1)
                {
                    this.$message.error("只允许勾选单条数据")
                }
                else {
                    this.rowId=selections[0].id
                    this.updateCategoryStatus(this.rowId,1)
                }
                this.getTableData()
            },

            onTreeClick(data, node, component){
                var clickId = data.id
                var search={
                    id:clickId
                }
                this.args = {
                    search:search
                }
            },

            updateCategoryStatus(updateId,status)
            {
                var args = {
                    id : updateId,
                    isDel : status
                }
                apiProCenter.updateStatusCategory(args).then((res)=>{
                    if(res.data.status===200) {
                        //隐藏正在加载
                        this.isLoading = false
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '操作成功',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.getTableData();
                    }
                    else {
                        this.isLoading = false;
                        this.$message.error(res.data.message)
                    }
                })
            }
        }
    })

</script>
