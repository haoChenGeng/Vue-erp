<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableIndexCol="true"
            :autoRefreshTable="false"
            :tableCommonData="searchOptions"
            @list-view="doView"
            @list-delete="doDelete"
            @list-edit="doEdit"
            @list-add-android="addAndroid"
            @list-add-ios="addIos"
            @search-submit="onSearchSubmit"
            @table-row-dobule-click="handleTableDobuleClick"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>
    </div>
</template>

<script>
    import Services from 'src/services/system/Service.js'
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import { formatDate } from './dateLib.js'
    export default {
        components: { T8tListView },
        watch: {
            // $route: function () {
            //     this.$refs['list-view'].getTableInstance().reloadTable()
            // },
        },
        activated () {
            this.$refs['list-view'].getTableInstance().reloadTable()
        },

        data () {
           var isTimestamp  = function (date) {
                if (typeof date === 'string') {
                    return !date.match(/^\d{13}$/)
                } else if (typeof date === 'number') {
                    return !(date + "").match(/^\d{13}$/)
                }
                return true
            };
            return {
                // 详情页路由地址
                detailRoute: '/test/resume/view',
                // service 和 method 目前需要加密
                service: Services.APP.name, // /biz/t8t-app-pam/app
                method: Services.APP.methods.versionServiceQueryPage, // views.versionService.queryPage
                deleteMethod: 'uXwhtetzhpnd0flfvuYTSTogg1Zs6jM', // version.deleteByIds
                tableArgs: {sort:["createTime_desc"]},
                // 表头描述
                tableColumns: [
                    {prop: 'versionNumber', label: '版本号'},
                    {prop: 'versionPlat', label: '平台', list: 'versionPlat'},
                    {prop: 'versionValue', label: '版本值'},
                    {prop: 'versionType', label: '类型', list: 'versionType'},
                    {prop: 'updateTime', label: '更新时间', formatter(val, row, col, table){
                            if(val == 0 || val == '' || val==null){
                                val = row['createTime']
                            }
                            let dateString
                            if (val === 0 || val === null) {
                                dateString = ""
                            } else {
                                let objDate = new Date(val * 1000)
                                let _newObj = isTimestamp(val) ? objDate : new Date(val)
                                dateString = formatDate(_newObj, 'yyyy-MM-dd HH:mm:ss')
                            }
                            return dateString
                    }},
                    {prop: 'versionMemo', label: '版本说明'}

                ],
                // 搜索项配置
                searchFields: [
                    {type: 'input', label: '版本号', name: 'versionNumber'},
                    {type: 'input', label: '版本值', name: 'versionValue'},
                    {type: 'select', label: '更新平台', name: 'versionPlat', selectSourceKey: 'versionPlat'},
                    {type: 'select', label: '更新类型', name: 'versionType', selectSourceKey: 'versionType'},
                    {type: 'datetime', label: '创建时间自', name: 'createTime_gte'},
                    {type: 'datetime', label: '创建时间至', name: 'createTime_lte'}
                ],
                searchDataSource:{
                    versionNumber:'',
                    versionValue:'',
                    versionPlat:null,
                    versionType:null,
                    createTime_start:null,
                    createTime_end:null,
                },
                // 面包屑
                breadcrumbData: [
                    { title: '交付' },{ title: '业务APP' },{ title: '版本更新' }
                ],
                // 搜索项对应值
                searchOptions: {
                    versionPlat: [
                        {value: 0, text: 'android'},
                        {value: 1, text: 'ios'}
                    ],
                    versionType: [
                    ]
                }
            }
        },
        created(){
          this.getCommonOptions('11023', 'versionType')
        },
        methods: {
            onSearchSubmit () {

            },
            onchange (val) {

            },
            doDelete () {
                let deletePromise = this.$refs['list-view'].doDelete()
                let that = this
                if (deletePromise) {
                    deletePromise.then((res) => {
                        if (res.data && res.data.status == 200 && res.data.result > 0) {
                            that.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            that.$refs['list-view'].getTableInstance().reloadTable()
                        }
                    })
                }
            },
            doView () {
                this.$router.push({ path: 'app-version/detail',query:{type: row.versionPlat, id:row.id,mode:'view'} })
            },
            addAndroid () {
                this.$router.push({ path: 'app-version/detail',query:{versionPlat: 0,mode:'add'} })
            },
            addIos () {
                this.$router.push({ path: 'app-version/detail',query:{versionPlat: 1,mode:'add'} })
            },
            handleTableDobuleClick(row){
                this.$router.push({ path: 'app-version/detail',query:{versionPlat: row.versionPlat, id:row.id,mode:'view'} })
            },
            doEdit(){
                let rows = this.$refs['list-view'].getTableInstance().getSelectRows()
                if(rows.length < 1){
                    this.$message.error('请选择需要操作的行')
                    return
                }
                if(rows.length > 1){
                     this.$message.error('只能选择一行进行操作')
                     return
                }
               let row = rows[0]
                this.$router.push({ path: 'app-version/detail',query:{versionPlat: row.versionPlat, id:row.id,mode:'edit'} })
            },
            beforeSubmit(data){
                this.tableArgs = {search:data, sort:["createTime_desc"]}
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
                                }
                            });
                            this.searchOptions[selectName] = list;
                        }
                    })
            }
        }
    }
</script>

<style lang="css" scoped>

</style>
