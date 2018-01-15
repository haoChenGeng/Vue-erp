/**
* Created by tomy.li on 2017/12/4.
*/
<template>
    <div class="contractDesignerList">
        <t8t-breadcrumb :originData="breadcrumbData"></t8t-breadcrumb>
         <el-tabs v-model="activeName">
            <el-tab-pane v-for="(item,keys) in tabList" :key="keys" :label="item.name" :name="item.symbol"></el-tab-pane>
        </el-tabs>

        <t8t-search
            :fields="fields"
            :selectSource="commonData"
            :showToggleBtn="false"
            @submit="submitSearch"
        ></t8t-search>

        <div class="g-main-container-column">

            <t8t-table
                :columns="columns"
                :service="service"
                :method="method"
                :args="args"
                :pageBar="true"
                :commonData="commonData"
                ref="t8tTable"
                :selectCol="false"
                @data-loaded="dataLoaded"
                @row-double-click="jumpToProjectDetail"
            >

                <template scope="scope" slot="sourceProjectId"><span class="hand">{{scope.row.sourceProjectId}}</span></template>

                <template scope="scope" slot="projectId">
                    <el-button v-if="[0,1,2,3,4].indexOf(scope.row.contractStatus) > -1"
                               @click.stop="contractButton(scope.row)"
                               type="primary"
                               size="small"
                               v-html="( [0,1,4].indexOf(scope.row.contractStatus)  > -1 ) ? (!scope.row.contractStatus && scope.row.orderSubStatus && parseInt(scope.row.orderSubStatus) >= 8100602 ? '合同详情' :'发起合同') : ( ([2,3].indexOf(scope.row.contractStatus)  > -1) ? '合同详情' : '')"></el-button>
                </template>
            </t8t-table>
        </div>
        <contract-info
            :projectId="currentProjectId"
            :sourceProjectId="currentsourceProjectId"
            v-if="contractInfoShow"
            @close="contractInfoShow = false"
        ></contract-info>
    </div>
</template>
<script>
    import contractDesigner from 'src/services/salemanager/contractDesigerService.js'
    import methods from 'src/services/salemanager/contractDesigner.js'
    import config from 'src/views/m-salemanager/contract-designer/config.js'
    import ServiceApi from 'src/services/dsp-prs-mdm/service.js'
    import contractInfo from 'src/views/m-salemanager/contract-designer/contractInfo.vue'
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import  DateUtils from 'src/utils/DateUtils.js'
    import Cookie from 'js-cookie'
  export default {
    name: "contractDesignerList",
      components:{contractInfo},
    data () {
      return {
          activeName:1,
          tabList:[
              {name:'待签',symbol:1},
              {name:'已签',symbol:2},

          ],
          breadcrumbData:[{title:'销售管理'},{title:'设计师签约'}],
          contractInfoShow:false,
          currentProjectId:'',
          currentsourceProjectId:'',
          commonData:{
              //table用的合同状态
              contractStatusFull:config.contractStatus,

            //   搜索用的合同状态
              contractStatus:[
                  {text:'未签',value:0},
                  {text:'待签',value:2},
                  {text:'作废',value:4},
                  {text:'终止',value:5}
              ],
              orderStatus:config.orderStatus,

          },
          columns:[
              { "prop": "sourceProjectId", "label": "项目ID"  },
              { "prop": "projectId", "label": "操作" },
              { "prop": "projectAddress", "label": "项目地址",width:250},
              { "prop": "owner", "label": "业主称呼" },
              { "prop": "contractStatusName", "label": "合同状态",width:80},
              { "prop": "decoratePatternName", "label": "装修方式 "  },
              { "prop": "houseStyle", "label": "房屋类型"  },
              { "prop": "contractOffer", "label": "合同金额"  },
              { "prop": "area", "label": "面积",width:100 },
              { "prop": "orderSubStatusName", "label": "项目状态",width:80  },
              { "prop": "contractUpdateTime", "label": "操作时间",formatter:function (value){
                  return value ? DateUtils(value * 1000, 'yyyy-mm-dd HH:MM:ss') : '--'
              }}
          ],
          fields:[
              {type: 'input',label: '项目ID',name: 'sourceProjectId'},
              {
                  name:'estateId',
                  label:'楼盘地址',
                  type:'popup',
                  placeholder:'请选择楼盘',
                  textValue: 'sname',  //需要展示出来的名称
                  filedValue: 'id',    //选中那条数据的ID
                  defaultValue:"",
                  remote: true,
                  service: ServiceApi.name,
                  method: ServiceApi.methods.queryEstatePage,
                  remoteQueryKey: "estateName",
                  /*fetchSuggestions:function (queryString,callback) {
                      callback()
                  },*/
                  remoteArgs: {
                      page: 1,
                      size: 10
                  },
                  dialog:{
                      title: "查找楼盘",
                      size: 'large',

                      searchForm: {
                          fields: [{
                              type: 'input',
                              label: '楼盘名',
                              name: 'estateName',
                              placeholder:'请先按楼盘名搜索',
                          }],
                          resetBtnVisible: true,
                          showToggleBtn: false
                      },
                      table: {
                          //表格
                          columns: [{
                              prop: 'sname',
                              label: '楼盘名'
                          }],
                          commonData: {

                          },
                          //请求参数配置
                          service: ServiceApi.name,
                          method: ServiceApi.methods.queryEstatePage,
                          args: {},
                          radioCol: true,
                          preLoad:false,
                          selectable: function(row) {
                              return true
                          }
                      },
                      onConfirm: function (){},
                      onBeforeConfirm: function(rows) {
                          let row = rows[0]
                          return true
                      }
                  },
                  rules:[{
                      type:'string',
                      required:true,
                      message:'请选择楼盘',
                  }]
              },
             // {type: 'popup',label: '楼盘地址',name: 'houseAddress'},
              {type: 'select',selectSourceKey:'orderStatus',label: '项目状态',name: 'orderSubStatus'},
              {type: 'select',selectSourceKey:'contractStatus',label: '合同状态',name: 'contractStatus'},
          ],
          service:contractDesigner.name,
          method:contractDesigner.methods.contractQuery,
          args:{uid:+Cookie.get('t8t-tc-uid'),sort:['firstAssignTime_desc'],type:1}
      }
    },
    watch:{
        activeName(val){
            let statusSearch = {type: 'select',selectSourceKey:'contractStatus',label: '合同状态',name: 'contractStatus'}
            let local = this.fields.find(item=>item.selectSourceKey == 'contractStatus')
            if(val == 1){
                // this.$nextTick(_=>{
                    if(!local) this.fields.push(statusSearch)
                // })
                this.args = {
                    uid:+Cookie.get('t8t-tc-uid'),
                    sort:['firstAssignTime_desc'],
                    type:1
                }
            }
            if(val == 2) {
                if(local) this.fields.splice(this.fields.indexOf(local), 1)
                this.args = {
                    uid:+Cookie.get('t8t-tc-uid'),
                    sort:['firstAssignTime_desc'],
                    type:val
                }
            }
            console.log(this.fields,this.args)

            // console.log(val)
            // console.log(this.fields)

        }

    },
    created () {
        // sort:firstAssignTime_desc
    },
    activated(){
        this.$refs['t8tTable'].reloadTable()
    },
    methods: {
        contractButton: function (row){
            if(row.orderSubStatus && parseInt(row.orderSubStatus) < 8100303) {
                this.$message.error("请及时登录商家APP进入量房签到页面上传量房图片")
                return
            }
            if(!row.contractStatus && row.orderSubStatus && parseInt(row.orderSubStatus) >= 8100602) {
                this.$message.error("不支持线上查看，请找线下纸质合同信息")
                return
            }
            if(row.ispower != 1){
                return this.$message.error('没有权限操作合同')
            }

            //待签，已签 查看合同详情
            else if( [2,3].indexOf(row.contractStatus) > -1 ){
                this.currentProjectId = row.projectId
                this.currentsourceProjectId = row.sourceProjectId
                this.contractInfoShow = true
            }

            //未签、暂存、作废 发起合同
            else if( [0,1,4].indexOf(row.contractStatus) > -1 ){

                methods.checkCreate(row.projectId, row.sourceProjectId, +Cookie.get('t8t-tc-uid')).then(res => {
                    this.contractInfoShow = false
                    this.$router.push({
                        path:'/tuchat-sale-manage/contract-designer-detail',
                        query:{
                            yid:row.projectId
                        }
                    })
                }).catch(e => {
                    return this.$msgbox({
                        type: 'error',
                        title: '不能发起合同',
                        message: e
                    })
                })

            }
        },
        //搜素
        submitSearch(objForm) {
            let search = objForm
            this.args = {...this.args,...{search:objForm}};
        },
        //获取辅助资料
        getCommonOptions: function(fatherCode,selectName) {
            debugger
            let arg =  {
                page: 1,
                search: {
                    pPropertyCode_in: typeof fatherCode == 'fatherCode' ? fatherCode : [fatherCode]
                },
                size: 100
            }
            let list = []
            apiCommon.queryUnionParent(arg)
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
                        this.commonData[selectName] = list
                    }
                })
        },

        jumpToProjectDetail: function (row){
            this.$router.push({
                path:'/tuchat-sale-manage/page-project-detail',
                query:{
                    id:row.projectId,
                    goBackRoute:'/tuchat-sale-manage/contract-designer-list'
                }
            })
        },
        dataLoaded(dataSource){
            dataSource.map(item => {
                let arr = this.commonData.contractStatusFull.filter(function (i){ return i.value == item.contractStatus })
                this.$set(item,'contractStatusName',(item.contractStatus == 0 && item.orderSubStatus >= 8100602) ? '已签' : ( arr.length ? arr[0].text : '--' ))
            })
            return dataSource
        },

    }
  }
</script>
<style>
    .contractDesignerList .hand{
        cursor: pointer;
        color: #00a0e9;
    }
</style>
