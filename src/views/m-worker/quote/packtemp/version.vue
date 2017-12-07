<template>
    <div class="packtempview">
        <el-dialog size="full" class="g-w-460 my-el-dialog t8t-full-dialog-packtemp-version" v-model="dialogVisible" @close="closeDialog" :show-close="false" :close-on-press-escape="false">

            <div class="full-dialog-toolbar-container">
                <div class="toolbar-container">
                    <div>
                        <el-button @click="cancel()">返回</el-button>
                    </div>
                    <!--顶部工具栏-->
                    <t8t-toolbar :symbolList="['fileDownload']" class="t8t-dark"
                    @fileDownload="downloadClick()"
                                 ref="toolbartop"
                    ></t8t-toolbar><!--顶部工具栏-->
                </div>
            </div>

            <!--行操作工具栏-->

            <t8t-search
                :fields="searchFields"
                :selectSource="selectSource"
                @submit="submitSearch"
                ref="mainSearch"
            >
            </t8t-search>

            <div class="g-main-container-column mg-top-20">
                <t8t-table
                    :columns="mainTableColumns"
                    :service="mainTableService"
                    :method="mainTableMethod"
                    :commonData="selectSource"
                    :args="args"
                    :indexCol="true"
                    ref="mainTable"
                    :pageBar="true"
                    :editable="false"
                    @data-loaded="dataLoaded"
                >
                    <!--用于自定义列模板-->
                    <template slot="updateUser" scope="scope">
                        <span>{{ scope.row['createUserVO'] + '/' + scope.row['createTime'] }}</span>
                    </template>
                </t8t-table>
            </div>
        </el-dialog>


    </div>
</template>
<script>

    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    // import T8tSearch from 'src/components/t8t-search/t8t-search.vue'
    import storages from 'src/services/storages/storages.js'
    import productPackage from 'src/services/worker/productpackage/base-method.js'
    import packtempServices from 'src/services/worker/packtemp/Service.js'
    export default {
        name: "packtempview",
        components: {
            // T8tSearch
        },
        data(){

            return {
                accountId:+Cookie.get('t8t-tc-uid'),
                dialogVisible:true,
                activeTabName:'one',
                activeTableRef:'mainTable', //展示中的reftable
                mainTableService: packtempServices.template.name,
                mainTableMethod: packtempServices.template.methods.tempRecordQuery,
                args: {},
                args2: {},
                tempItemType:0,
                needEffectTime: true,
                mainTableColumns:[
                    {
                        "prop": "tempCode",
                        "label": "产品包模板编码"
                    },
                    {
                        "prop": "tempName",
                        "label": "模板名称"
                    },
                    {
                        "prop": "orgId",
                        "label": "组织",
                        list:'organizes'
                    },
                    {
                        "prop": "pkgId",
                        "label": "产品包",
                        list:'productPackages'
                    },
                    {
                        "prop": "updateUser",
                        "label": "修改人/角色/日期"
                    },
                ],
                accountId:+Cookie.get('t8t-tc-uid'),
                tempCode:null,
                searchFields:[
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
                        type: 'date',
                        name: 'createTimeStime',
                        label:'修改日期自',
                    },
                    {
                        type: 'date',
                        name: 'createTimeEtime',
                        label:'修改日期至',
                    },
                    {
                        type: 'input',
                        name: 'tempCode',
                        label:'模板编码',
                    }
                ],
                selectSource:{
                    organizes:[],
                    productPackages:[],
                },
            }
        },
        created(){
            //模板id
            this.tempCode = this.$route.query.tempCode

            this.args = {tempRecord:{'tempCode':this.tempCode || null}}

            //动态获取形态为分公司的组织
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
                }
            })

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
                }
            })
        },
        methods: {
            dataLoaded() {
                if (this.tempCode) {
                    //初始化 模板编码的显示
                    this.$refs['mainSearch'].setFormData({'tempCode':this.tempCode});
                }
            },
            cancel(){
                this.closeDialog()
            },

            downloadClick(){
               /* this.$message({
                    type: 'warning',
                    message: '功能开发中 o(╯□╰)o'
                })*/
                this.$router.push({path:'quote-packtemp-preview',query:{'tempCode':this.tempCode}})
            },

            closeDialog(){
                this.dialogVisible = false
                this.$router.push('/tochat-worker/quote-packtemp-index')
            },
            submitSearch(objForm) {
                let obj = Object.assign({},objForm)
                let argsObj = Object.assign({},this.args)
                argsObj.tempRecord = Object.assign(this.args.tempRecord,obj)
                this.args = argsObj;
            },

            //获取辅助资料
            getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                apiCommon.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            })
                            this.selectSource[selectName] = list
                        }
                    })
            },

        }
    }
</script>
<style lang="css" scoped>
    .g-main-container-column{
        min-height: 400px;
    }
    .mg-top-20 {
        margin-top: 20px;
    }
</style>
<style>
    .t8t-full-dialog-packtemp-version{height: 100%}
    .t8t-full-dialog-packtemp-version .el-dialog__header{
        padding: 0;
    }
    .t8t-full-dialog-packtemp-version .el-dialog__body{
        padding: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog-packtemp-version .t8t-full-dialog-packtemp-version-container{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog-packtemp-version .full-dialog-tabs-container{
        flex: 1;
        margin-bottom: 20px;
    }


    .toolbar-white .full-dialog-toolbar-container{
        height: 38px;
        background-color: white !important;
    }
    .toolbar-white .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: white !important;
    }
    .toolbar-white .toolbar-container .el-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: white !important;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
    .toolbar-white .toolbar-container .el-button:hover{
        color: #1e3046;
        background-color: white !important;
    }

    /*定值风格*/
    .toolbar-white{
        background-color: white !important;
    }

    .t8t-full-dialog-packtemp-version .container-center{
        width: 1250px;
        margin-left: auto;
        margin-right: auto;
    }
    .t8t-full-dialog-packtemp-version .el-form{
        display: flex;
        flex-wrap: wrap;
    }
    .t8t-full-dialog-packtemp-version .form-item-container{
        width: 25%;
    }
    .t8t-full-dialog-packtemp-version .full-dialog-form-container{
        margin-top: 0px;
    }
    .t8t-full-dialog-packtemp-version .full-dialog-form-container .el-form-item__content{
        width: 180px;
    }
    .t8t-full-dialog-packtemp-version .full-dialog-tabs-container{
        display: flex;
    }
    .t8t-full-dialog-packtemp-version .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .t8t-full-dialog-packtemp-version .full-dialog-tabs-container .el-tabs__item{
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        margin-top: 13px;
        margin-bottom: 12px;
    }
    .t8t-full-dialog-packtemp-version .el-tabs__header{
        border-top: 2px solid #eff7fa;
        border-bottom: 2px solid #eff7fa;
    }
    .t8t-full-dialog-packtemp-version .full-dialog-tabs-container .el-tabs__active-bar{
        height: 1px;
    }
    .t8t-full-dialog-packtemp-version .el-tabs__item + .el-tabs__item {
        border-left: 1px solid #d4dce7;
    }
    .t8t-full-dialog-packtemp-version .el-tabs__nav-wrap{
        width: 1220px;
        margin: 0 auto;
    }
    .t8t-full-dialog-packtemp-version .el-tabs__content{
        flex: 1;
        display: flex;
        /*        width: 1220px;
                margin: 0 auto;*/
    }
    .t8t-full-dialog-packtemp-version .el-tab-pane{
        flex: 1;
        overflow: auto;
    }
    .t8t-full-dialog-packtemp-version .t8t-table .table-container {
        margin-left: 0;
    }
    .packtempview {
        width: 1200px;
        margin: 30px auto 5px;
    }

    /**/
    .t8t-full-dialog-packtemp-version .full-dialog-toolbar-container{
        height: 38px;
        background-color: #1e3046;
    }
    .t8t-full-dialog-packtemp-version .toolbar-container{
        width: 1220px;
        margin: 0 auto;
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #1e3046;
    }
    .t8t-full-dialog-packtemp-version .toolbar-container .el-button{
        padding: 0 12px;
        height: 26px;
        font-size: 12px;
        background-color: #1e3046;
        color: #d1dde9;
        border: 1px solid #09131d;
    }
</style>
