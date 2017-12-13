<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="selectSource"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="selectSource"
            :tableEditable="editable"
            @list-view="doView"
            @list-submit="doSubmit"
            @list-edit="btnEditClick"
            @list-import="btnImportClick"
            @list-export="onExport"
            @list-add="doAdd"
            @list-delete="doDelete"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
            :toolbarDisabledSymbols="disabledSymbols"
            v-loading.body.lock="barLoading"
        >

        </t8t-list-view>
        <div>
            <el-dialog class="source-list-import" title="导入" v-model="importDialog" @close="closeimportDialog"
                       ref="importDialogRef"
                       v-loading.body.lock="importLoading"
                       element-loading-text="加载中">
                <div class="textarea-container">
                    <el-upload
                        ref="importSource"
                        :data="params"
                        class="upload-demo"
                        :action="importURL"
                        :on-preview="handlePreview"
                        :file-list="fileList"
                        :on-success="importDeal"
                        :on-progress="importing"
                        :on-remove="removing"
                        accept=".xlsx,.xls"
                        :multiple=false
                    >
                        <div slot="tip" class="el-uplad__tip">
                            请选择要导入的数据文件




                        </div>
                        <div>
                            <el-button
                                size="small" type="primary">上传文件

                            </el-button>
                            <el-button size="small" type="primary" @click="downloadTemplate">模板下载</el-button>
                        </div>

                        <div slot="tip" class="el-uplad__tip">
                            请选择Excel文件,.xls、.xlsx格式
                            说明：
                            1、数据文件需符合模板要求，若无模板请下载
                            2、引入失败的数据，可下载修改后重新引入




                        </div>
                    </el-upload>
                </div>
                <div slot="footer">
                    <el-button type="primary" @click="inputConfirm">确认导入</el-button>
                    <el-button @click="closeimportDialog">取消</el-button>
                </div>
                <t8t-table
                    v-if="importTable"
                    :dataSource="importTableData"
                    ref="checkTable"
                    :pageBar=false
                    :selectCol="false"
                ></t8t-table>
            </el-dialog>
        </div>
    </div>


</template>


<script>
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import depositAPI from 'src/services/finance/deposit.js'
    import exportUtils from 'src/utils/export.js'
    import col from './indexColumns.json'
    import Cookie from 'js-cookie'
    import Utils from 'src/utils/Utils.js'


    export default {
        components: {T8tListView},
        data () {
            return {
                col: col,
                importURL: Utils.getImportURL('tXktEsxeCsUy5oFDH-4HhVsRg-rhO_e','mxevoxK4rTzWAawabxaQVxWfPvTAKDzXXlykBQ9'),
                importDialog: false,
                importRadio: "add",
                importTable: false,
                importTableData: [],
                importLoading: false,
                barLoading: false,
                createUser:parseInt(Cookie.get('t8t-tc-uid')),
                createName:Cookie.get('t8t-tc-username'),
                templateData: {
                    sourceTypeId: null,
                    sourceId: null,
                    sourceName: null,
                    mapTypeId:null,
                    mapId:null,
                    mapName:null
                },
                disabledSymbols: ['ADD','DELETE','submit'],
                //设置是否可编辑
                editable:false,

                // service 和 method 目前需要加密
                service: 'VVhBo_VSoRa0vx_D3tb9CxqOd65Yeza', // /biz/t8t-fi-fds/app
                method: 'FCaZYS8AeAjMIrk9g3pL78e', // views.map.query
                tableArgs: {
                    search: {
                        id: null
                    },
                    sort: ["id_desc"]
                },
                // 表头描述
                tableColumns: [
                    {
                      prop: 'sourceTypeId', label: '初始类型',list:'sourceTypeIds', editor:{type:'select',"rules": [{"required": true, "message": "初始类型不能为空"}]},
                    },
                    {prop: 'sourceId', label: '初始ID/编码', editor:{type:'input',"rules": [{"required": true, "message": "初始ID/编码必填"}]}},
                    {prop: 'sourceName', label: '初始名称', editor:{type:'input',"rules": [{"required": true, "message": "初始名称必填"}]}},
                    {prop: 'mapTypeId', label: '对照类型', list:'sourceTypeIds',editor:{type:'select',"rules": [{"required": true, "message": "初始类型不能为空"}]}},

                    {prop: 'mapId', label: '对照ID/编码', editor:{type:'input',"rules": [{"required": true, "message": "对照ID/编码必填"}]}},
                    {prop: 'mapName', label: '对照名称', editor:{type:'input',"rules": [{"required": true, "message": "对照名称必填"}]}},
                    {prop: 'createName', label: '创建人'},
                    {prop: 'createTime', label: '创建时间', "formatter": "dateParser" },
                    {prop: 'updateName', label: '修改人'},
                    {prop: 'updateTime', label: '修改时间', "formatter": "dateParser" }
                ],

                // 搜索项配置
                searchFields: [
                    {type: 'select', label: '初始类型', name: 'sourceTypeId', selectSourceKey:'sourceTypeIds'},
                    {type: 'input', label: '初始ID/编码', name: 'sourceId_like'},
                    {type: 'input', label: '初始名称', name: 'sourceName_like'},
                    {type: 'select', label: '对照类型', name: 'mapTypeId', selectSourceKey:'sourceTypeIds'},
                    {type: 'input', label: '对照ID/编码', name: 'mapId_like'},
                    {type: 'input', label: '对照名称', name: 'mapName_like'},

                ],
                exportParams:{
                    search: {
                    },
                    sort: ["id_desc"],
                    page:1,
                    size:10000
                },
                //下拉搜索类型
                selectSource:{
                    sourceTypeIds:[],
                },
                SelRows:[],
                pageType:null,
                // 面包屑
                breadcrumbData: [
                    {
                        title: '财务'
                    },
                    {
                        title: '财务基础配置'
                    },
                    {
                        title: '数据对照表'
                    }
                ]
            }
        },

        created(){
            //获取搜索框下拉列表数据
            this.getCommonOptions('61102','sourceTypeIds')
            //this.selectSource['sourceTypeIds'] = [{"value":1554,"text":"组织"},{"value":1555,"text":"法人组织"},{"value":1569,"text":"K3-Cloud组织"},{"value":1570,"text":"K3-Cloud部门"},{"value":1571,"text":"K3-Cloud事业部"},{"value":1572,"text":"K3-Cloud业务类型"},{"value":1623,"text":"IT4.0商品属性"},{"value":1624,"text":"K3-Cloud费用项目"},{"value":1672,"text":"K3-Cloud供应商分组"}]
        },

        methods: {
             //导入模版
            downloadTemplate(){
                let exportArgs = this.tableArgs
                exportArgs.page = 1
                exportArgs.size = 1

                exportUtils({
                    service: 'VVhBo_VSoRa0vx_D3tb9CxqOd65Yeza',
                    method: 'FCaZYS8AeAjMIrk9g3pL78e',
                    title:'k3cloud对照模表导入模板',
                    args: exportArgs,
                    headers: '初始类型,ID,名称,对照类型,ID,名称',
                    sorts: 'sourceTypeId,sourceId,sourceName,mapTypeId,mapId,mapName'
                })
            },

            btnImportClick(){
               this.barLoading = true
               this.$refs['list-view'].disableBySymbol("IMPORT")
                if (this.$refs['importSource']) {
                    this.$refs['importSource'].clearFiles()
                }
                this.importTable = false
                this.importDialog = true
                this.barLoading = false
                this.$refs['list-view'].unDisableBySymbol("IMPORT")
            },
            closeimportDialog(){
                this.importDialog = false
            },
            importing(event, file, fileList) {
                let list = []
                list.push(file)
                this.fileList = list
                this.importLoading = true
            },
            importDeal(response, file, fileList) {
                this.importTable = false
                this.importTableData = []
                this.importLoading = false
                if (!response.status) {
                    this.$message.error('上传失败')
                    this.importTable = true
                    this.importTableData = response.result
                    return false
                }
                if (response.status != 200) {
                    this.$message.error(response.data.message)
                    this.$refs['importSource'].clearFiles()
                    return false
                }
                else {
                   if(response.result.message!=="")
                   {
                       this.errorAlert(response.result.message, "message")
                   }else {
                       this.importTable = true
                       this.importTableData = response.result.mapCreateDTOs
                   }
                }
            },
            errorAlert(data, method = "msg") {
                if (method == "msg") {
                    this.importDialog = false
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: data,
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                } else {
                    this.importDialog = false
                    this.$msgbox({
                        title: '消息',
                        type: 'error',
                        message: data,
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                }
                return false
            },
            // 导入逻辑
            inputConfirm() {
                let reqArr = []
                if (this.importTableData.length < 1) {
                    this.$message.error('请上传文件后重试')
                    return false
                }

                this.importTableData.forEach((item) => {
                    reqArr.push({
                        "sourceTypeId": item.sourceTypeId,
                        "sourceId": item.sourceId,
                        "sourceName": item.sourceName,
                        "mapTypeId": item.mapTypeId,
                        "mapId": item.mapId,
                        "mapName": item.mapName
                    })
                })
                this.importLoading = true
                let _this = this
                let args = {
                    mapCreateDTOs: reqArr,
                    createUser:this.createUser
                }
                depositAPI.batchAddMap(args)
                    .then((res) => {
                        _this.importLoading = false
                        if (res.data.status === 200) {
                               this.$msgbox({
                                   title: '消息',
                                   type: 'success',
                                   message: '导入成功',
                                   showCancelButton: false,
                                   confirmButtonText: '知道了',
                                   confirmButtonClass: 'is-plain'
                               })
                            this.importDialog = false
                            this.$refs['list-view'].getTableInstance().reloadTable()
                        } else {
                            this.$message.error(res.data.message)
                            _this.importLoading = false
                        }
                    })
            },
            removing() {
                this.importTableData = []
                this.$refs['importSource'].clearFiles()
                this.importTable = false
            },
            //编辑按钮
            btnEditClick()
            {
              //'submit'
                this.disabledSymbols=[]
                // 点击编辑按钮
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows()
                    if (this.editable !== true) {
                        this.editable = true;
                }
            },
            //新增按钮
            doAdd(){
                this.disabledSymbols=[]
                this.$refs['list-view'].getTableInstance().addNewRow()
                if (this.editable !== true) {
                    this.editable = true;
                }
            },
            //删除按钮 K3-Cloud
            doDelete(){
                let deleteArgs=[]
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows()
                if(selections.length === 0)
                {
                    this.$message.error('请勾选数据后再进行删除操作')
                    return false
                }
                selections.forEach((item) => {
                    deleteArgs.push(item.id)
                })

                let deleteArg={
                  ids:deleteArgs
                }
                depositAPI.deleteK3CloudMap(deleteArg).then((res)=>{
                    if (res.data.status === 200) {
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '删除成功',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.$refs['list-view'].getTableInstance().reloadTable()
                    }else {
                        this.$message.error(res.data.message)
                        return false
                    }
                })
            },
            // 搜索时将导出的条件筛选出来
            onSearchSubmit(obj){
                this.getExportArgs(obj)
            },
            //提交按钮()
            doSubmit(){
                this.$refs['list-view'].getTableInstance().validate((valid) =>{
                  if(valid)
                  {
                      // addNewRow valid
                      this.disabledSymbols= ['ADD','DELETE','submit']
                      let editArray=this.$refs['list-view'].getTableInstance().getActionLog(false, true)
                      let addRows=editArray.addedRows
                      let editedRows=editArray.editedRows
                      //新增的列不为0
                      let flag=false
                      if(addRows.length>0)
                      {
                          flag=true
                          let addArgs={
                              mapCreateDTOs:addRows,
                              createUser:this.createUser
                          }
                          depositAPI.batchAddMap(addArgs).then((res)=>{
                              if (res.data.status === 200) {
                                  this.$msgbox({
                                      title: '消息',
                                      type: 'success',
                                      message: '新增成功',
                                      showCancelButton: false,
                                      confirmButtonText: '知道了',
                                      confirmButtonClass: 'is-plain'
                                  })
                                  this.$refs['list-view'].getTableInstance().reloadTable()
                              } else {
                                  this.$message.error(res.data.message)
                              }
                          })
                      }
                      //修改
                      if(editedRows.length>0)
                      {
                          flag=true
                          let editArgs={
                              MapUpdateDTOs:editedRows,
                              operId:this.createUser
                          }
                          depositAPI.batchUpdateK3CloudMap(editArgs).then((res)=>{
                              if (res.data.status === 200) {
                                  this.$msgbox({
                                      title: '消息',
                                      type: 'success',
                                      message: '修改成功',
                                      showCancelButton: false,
                                      confirmButtonText: '知道了',
                                      confirmButtonClass: 'is-plain'
                                  })
                                  this.$refs['list-view'].getTableInstance().reloadTable()
                              } else {
                                  this.$message.error(res.data.message)
                              }
                          })
                      }

                      if(flag===false)
                      {
                          this.$message.error('没有做任何变更')
                          return false
                      }
                  }
                })

            },
            getExportArgs(param){
                let exportP = {...param}

                for (let i in exportP) {
                    if (exportP[i] === null) {
                        delete exportP[i]
                    }
                }
                this.exportParams = {
                    search: exportP,
                    page: 1,
                    size: 10000,
                    sort: ["id_desc"]
                }
            },
            onExport() {
                this.$msgbox({
                    title:'消息',
                    message: '正在导出中,请注意左下方,稍后有导出的文件',
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                exportUtils({
                    service: 'VVhBo_VSoRa0vx_D3tb9CxqOd65Yeza',
                    method: 'FCaZYS8AeAjMIrk9g3pL78e',
                    title:"K3-Cloud对照表",
                    args:  this.exportParams,
                    headers: '初始类型,初始ID/编码,初始名称,对照类型,对照ID/编码,对照名称',
                    sorts: 'sourceTypeCode,sourceId,sourceName,mapTypeCode,mapId,mapName'
                })
            },
            readLoad(){
                this.dialogVisible = false
                this.$refs['list-view'].getTableInstance().reloadTable()

            },
            //辅助资料
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
                                };
                            })
                            this.selectSource[selectName] = list
                        }
                    })
            },
        }
    }
</script>
