<template>
    <div class="packtempindex">
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="searchFileds"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>
        <div class="g-main-container-column">
            <t8t-toolbar
                @ADD="onAdd"
                @EDIT="onEdit"
                @EDIT-SUBMIT="onCheck"
                @DISABLE="onDisable"
                @COPY="onCopy"
                @PREVIEW="onPreview"
                @VERSON="onVersion"
            ></t8t-toolbar>
            <t8t-table
                :columns="mainTableColumns"
                :service="mainTableService"
                :method="mainTableMethod"
                :commonData="commonData"
                :args="args"
                :indexCol="true"
                ref="t8ttable"
                :pageBar="true"
            >
                <template slot="tempName" scope="scope">
                    <a :href="'#/worker/quote-packtemp-view?tempCode=' + scope.row['tempCode']" style="text-decoration: none;">{{ scope.row['tempName'] }}</a>
                </template>
            </t8t-table>
        </div>
        <addTemplateDialog
            v-if="dialogVisible"
            @close="closeAddTempDialog"
            @open="dialogVisible=true"
            :organizes="selectSource.organizesInUse"
            :productPackages="selectSource.productPackages"
        >
        </addTemplateDialog>
    </div>
</template>
<script>
    import DateUtils from 'src/utils/DateUtils.js'
    import Cookie from 'js-cookie'
    // import T8tSearch from 'src/components/t8t-search/t8t-search.vue'
    import storages from 'src/services/storages/storages.js'
    import productPackage from 'src/services/worker/productpackage/base-method.js'
    import packtemp from 'src/services/worker/packtemp/packtemp.js'
    import packtempServices from 'src/services/worker/packtemp/Service.js'
    import addTemplateDialog from './addTemplateDialog.vue'
    import config from './config.js'
    export default {
        name: "packtempindex",
        components: {
            // T8tSearch,
            addTemplateDialog
        },
        created(){

            //动态获取形态为分公司、门店的组织
            storages.getAllStore().then((res) => {
                let list = []
                if( res.data.status === 200 ){
                    res.data.result.rows.forEach((item) => {
                        list.push({
                            value: item.id,
                            text: item.name
                        })
                    })

                    this.selectSource['organizes'] = list
                    this.commonData['organizes'] = list
                }
            })

            storages.getAllStore(true).then((res) => {
                let list = []

                if( res.data.status === 200 ) {
                    res.data.result.rows.forEach((item) => {
                        list.push({
                            value: item.id,
                            text: item.name
                        })

                        this.selectSource['organizesInUse'] = list
                    })
                }
            })


           /* this.selectSource['productPackages'] = [
                {
                    value:1,
                    text:'模拟数据'
                }
            ]*/

            //动态获取产品包
            productPackage.searchProductPackage().then((res) => {
                let list = []
                if( res.data.status === 200 ){
                    res.data.result.forEach((item) => {
                        list.push({
                            value: item.id,
                            text: item.pkgName
                        })
                    })

                    this.selectSource['productPackages'] = list
                    this.commonData['productPackages'] = list
                }
            })

        },
        methods: {

            //格式化时间转换为时间戳 精确到秒
            floorDateFromStr(str){
                return  this.isEmpty(str) ? str : Math.floor(new Date(str).getTime()/1000)
            },
            onDisable(){

                let tableObj = this.$refs['t8ttable']

                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要禁用的报价模板'
                    })
                    return false
                }

                let ids = []

                for (let item in selections){
                    if( !this.isCanRowForbidden(selections[item]) ){
                        this.$message({
                            type: 'warning',
                            message: '不可禁用当前模板，请调整启用时间或冻结时间，须满足启用时间早于等于冻结时间，冻结时间早于等于禁用时间的条件。'
                        })
                        return false
                    }
                    ids.push(selections[item].id)
                }


                packtemp.disableTemp(ids, this.accountId).then((res) =>{
                    if( res.data.status === 200 ) {
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        })
                        this.$refs['t8ttable'].reloadTable()
                    }else {
                        this.$message({
                            type: 'error',
                            message: res.data.result
                        })
                    }
                })
            },
            onCopy(){

                let tableObj = this.$refs['t8ttable']

                let selections = tableObj.getSelectRows()

                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要复制的报价模板'
                    })
                    return false
                }

                if( selections.length > 1 ){
                    this.$message({
                        type: 'warning',
                        message: '仅可选择一个模板并进行复制，请将多余模板的选中项取消'
                    })
                    return false
                }

                let id = selections[0]['id']

                packtemp.copyTemp(id, this.accountId).then((res) =>{
                    if( res.data.status === 200 ) {
                        this.$message({
                            type: 'success',
                            message: '复制成功'
                        })
                        this.$refs['t8ttable'].reloadTable()
                    }else {
                        this.$message({
                            type: 'error',
                            message: res.data.result
                        })
                    }
                })

            },
            onPreview(){
                return this.$message({
                    type: 'warning',
                    message: '功能开发中 o(╯□╰)o'
                })

            },
            onVersion(){

                return this.$message({
                    type: 'warning',
                    message: '功能开发中 o(╯□╰)o'
                })

                let tableObj = this.$refs['t8ttable']

                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要查看的报价模板'
                    })
                    return false
                }
                if( selections.length > 1 ){
                    this.$message({
                        type: 'warning',
                        message: '仅可选择一个模板并查看版本记录，请将多余模板的选中项取消'
                    })
                    return false
                }

                let selection =  selections[0]

                let tempCode = selection.tempCode
                this.$router.push({path:'quote-packtemp-version', query: {tempCode: tempCode || null}})
            },

            //创建模板
            onAdd(){
                this.dialogVisible = true
            },

            //编辑模板
            onEdit(){
                let tableObj = this.$refs['t8ttable']

                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要修改的报价模板'
                    })
                    return false
                }
                if( selections.length > 1 ){
                    this.$message({
                        type: 'warning',
                        message: '仅可选择一个模板并进行修改，请将多余模板的选中项取消'
                    })
                    return false
                }

                let selection =  selections[0]

                if( !this.isRowCanEdit(selection) ){
                    this.$message({
                        type: 'warning',
                        message: '当前状态不可修改'
                    })
                    return false
                }

                this.$router.push({path:'quote-packtemp-view', query:{tempCode:selection['tempCode']}})
            },

            //提交
            onCheck(){

                let tableObj = this.$refs['t8ttable']

                let selections = tableObj.getSelectRows()
                if( selections.length < 1 ){
                    this.$message({
                        type: 'warning',
                        message: '请选择需要提交的报价模板'
                    })
                    return false
                }
                if( selections.length > 1 ){
                    this.$message({
                        type: 'warning',
                        message: '一次只能提交一个模板'
                    })
                    return false
                }

                let selection =  selections[0]

                if( !this.isRowCanCheck(selection) ){
                    this.$message({
                        type: 'warning',
                        message: '仅可将状态为“待启用”的报价模板提交'
                    })
                    return false
                }

                if(this.isEmpty(selection['effectTime'])){
                    this.$confirm(
                        '当前模板未填写生效时间，提交审核通过后，该模板将自动生效，是否继续',
                        '提示',
                        {
                            type: 'warning',
                            confirmButtonText: '继续',
                            cancelButtonText: '取消',
                        }
                    ).then(() => {
                        packtemp.checkTemp(selection.id, this.accountId, selection['effectTime'] ? this.floorDateFromStr(selection['effectTime']) : null).then((res) => {
                            if( res.data.status == 200 ){
                                this.$message({
                                    type: 'success',
                                    message: '提交成功'
                                })
                                tableObj.reloadTable()
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: res.data.result || '出错：服务错误'
                                })
                            }
                        })
                    }).catch(() => {

                    })
                }else{
                    packtemp.checkTemp(selection.id, this.accountId, selection['effectTime'] ? this.floorDateFromStr(selection['effectTime']) : null).then((res) => {
                        if( res.data.status == 200 ){
                            this.$message({
                                type: 'success',
                                message: '提交成功'
                            })
                            tableObj.reloadTable()
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.data.result || '出错：服务错误'
                            })
                        }
                    })
                }

            },

            isRowCanCheck(row){
                return row.tempStatus == 0
            },
            isRowCanEdit(row){
                return true
            },
            isCanRowForbidden(row){
                return true

                //若已选中模板的启用时间或冻结时间已存在，且晚于当前时间，不可禁用(前端数据非实时性，应交由后端校验)
                return !(( !this.isEmpty(row['effectTime']) && new Date(row['effectTime']).getTime() > new Date().getTime() ) ||
                    ( !this.isEmpty(row['freezeTime']) && new Date(row['freezeTime']).getTime() > new Date().getTime() ))
            },
            closeAddTempDialog (){
                this.dialogVisible = false
            },

            submitSearch(objForm) {
                let obj = Object.assign({},objForm);

                let argsObj = Object.assign({},this.args)
                argsObj.productPkgTemp = obj;


                this.args = argsObj;
            },
            isEmpty(str){
                return str == null || str == 0 || str == '' || str == undefined
            },
        },
        data(){

            return {
                breadcrumbData:[
                    {'title':'工模售前'},{'title':'配置管理'},{'title':'产品包模板'},
                ],
                mainTableService: packtempServices.template.name,
                mainTableMethod: packtempServices.template.methods.searchTemplate,
                mainTableColumns:config.columns,
                accountId:+Cookie.get('t8t-tc-uid'),
                args: {'productPkgTemp':null},
                commonData:{
                    organizes:[], //组织
                    organizesInUse:[], //启用中的组织
                    mould_status:config.datas.mould_status,
                    productPackages:[]
                },
                searchFileds:[
                    {
                        type: 'select',
                        name: 'orgId',
                        label:'组织',
                        selectSourceKey:'organizes'
                    },
                    {
                        type: 'select',
                        name: 'pkgId',
                        label:'产品包',
                        selectSourceKey:'productPackages'
                    },
                    {
                        type: 'select',
                        name: 'tempStatus',
                        label:'模板状态',
                        selectSourceKey:'mould_status'
                    },
                    {
                        type :'input',
                        name:'tempCode',
                        label: '产品包模板编码'
                    },
                    {
                        type :'input',
                        name:'tempName',
                        label: '产品包模板名称'
                    },
                    {
                        type :'datetime',
                        name:'effectTimeStime',
                        label: '生效时间起'
                    },
                    {
                        type :'datetime',
                        name:'effectTimeEtime',
                        label: '生效时间至'
                    },
                    {
                        type :'datetime',
                        name:'freezeTimeStime',
                        label: '冻结时间起'
                    },
                    {
                        type :'datetime',
                        name:'freezeTimeEtime',
                        label: '冻结时间至'
                    },
                    {
                        type :'datetime',
                        name:'forbiddenTimeStime',
                        label: '禁用时间起'
                    },
                    {
                        type :'datetime',
                        name:'forbiddenTimeEtime',
                        label: '禁用时间至'
                    },
                    {
                        type :'datetime',
                        name:'updateTimeStime',
                        label: '修改时间起',
                    },
                    {
                        type :'datetime',
                        name:'updateTimeEtime',
                        label: '修改时间至',
                    },

                ],
                selectSource:{
                    organizes:[], //组织
                    organizesInUse:[], //启用中的组织
                    mould_status:config.datas.mould_status,
                    productPackages:[]
                },
                dialogVisible: false,
                ///addRowDialogVisible:false
            }
        }
    }
</script>
