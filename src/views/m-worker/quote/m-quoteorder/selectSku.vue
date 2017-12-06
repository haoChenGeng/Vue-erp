<template>
    <div class="g-main-container">
        <el-dialog title="" class="g-w-1000 my-el-dialog selectQuoteItemSkudialog" v-model="selectSkuVisible" @close="closeSelectQuoteDialog">
        <div class="selectQuoteItemSkudialogBody">
            <!--<t8t-breadcrumb :data="dialogBreadcrumbData" class="selectionSkuCrumb"></t8t-breadcrumb>-->
            <template>
                <div class="t8t-breadcrumb selectionSkuCrumb">
                    <el-breadcrumb separator=">">
                        <el-breadcrumb-item v-for="item in breadcrumbData">{{item.title}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </template>
            <div class="errorMsg" v-if="hasError">
                {{errorMsg}}
            </div>
          <cascader
              v-if="!hasError"
            :data="cascaderData"
            :skus="skus"
            :breadcrumbData="breadcrumbData"
            :currentRow="currentRow"
            :skuLoading="skuLoading"
            :orgId="orgId"
            :isAddingChildBom="isAddingChildBom"
            @item-click="onItemClick"
          ></cascader>
        </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from 'src/utils/api'
    import Cascader from './cascader.vue'
    import methods from 'src/services/worker/quoteorder/methods.js'
    export default {
        props:['currentGdmId','currentCategoryId','breadcrumbData','currentRow','orgId','isAddingChildBom','parentBomGdmId'],
        components: {
          Cascader
        },
        data() {
            return {
                selectSkuVisible: true,
                currentGdmId:null,
                currentRow:{},
                orgId:null,
                isAddingChildBom:false,
                parentBomGdmId:0,
                breadcrumbData:[],
                hasError:true,
                errorMsg:'',
                currentCategoryId:null,
                defaultExpandedKeys: [1],
                defaultCheckedKeys: [],
                cascaderData: [
                ],
                skus:[],
                skuLoading:false
            }
        },
        methods: {
            closeSelectQuoteDialog: function (){
                this.$emit('close')
            },
            submit: function (){

            },
            onItemClick(index1, index2, activeArr){
              this.skus = []
              this.cascaderData.splice(index1+1)
              // 当前点击数据
              let curItem = this.cascaderData[index1].data[index2]
              // active数据数组
               var arr = []
               activeArr.forEach((val, index) => {
                 arr.push(this.cascaderData[index].data[val])
               })


              // 发请求
              // 判断是否点击子节点
              let isLeaf = this.cascaderData[index1].isLeaf
              if(isLeaf) {
                // 是子节点图片逻辑
                console.log('子节点')
              }

              let queryField = {};

                arr.forEach((i) =>{
                    queryField[i.selectionName] = i.value
                })

              if(!isLeaf){
                // 不是子节点
                  let _this = this
                  methods.selectionSku(this.currentGdmId, this.currentCategoryId, this.orgId, queryField, this.parentBomGdmId || 0).then((res) => {
                      if( res.data.status == 200 ){
                          let result = res.data.result
                          let obj = {};
                          obj.isLeaf = ( result.skus != undefined ) ? true: false

                          if( result.skus != undefined ){
                              _this.skus = result.skus
                          }
                          obj.data = result.selections
                          this.$set(_this.cascaderData, index1+1, obj)
                          _this.hasError = false
                      }
                  })

              }
            },

            getSelections: function (queryField = {}){
                this.skuLoading = true
                let _this = this
                methods.selectionSku(this.currentGdmId, this.currentCategoryId, this.orgId, queryField, this.parentBomGdmId || 0).then((res) => {
                    this.skuLoading = false
                    if( res.data.status == 200 ){
                        let result = res.data.result
                        let obj = {};
                        obj.isLeaf = ( result.skus != undefined ) ? true: false

                        if( result.skus != undefined ){
                            _this.skus = result.skus
                        }
                        obj.data = result.selections
                        _this.cascaderData.push(obj)
                        _this.hasError = false
                    }else if( res.data.status == 30201 ) {
                        _this.errorMsg = '没有匹配到SKU'
                        _this.hasError = true
                    }else{
                        _this.errorMsg = res.data.result
                        _this.hasError = true
                    }
                })
            },
        },
        created(){
          this.isAddingChildBom = !this.parentBomGdmId == 0
          this.getSelections()
        }
    }
</script>




<style lang="css" scoped>
    .t8t-breadcrumb {
        height: 35px;
        min-height: 35px;
        border-bottom: 1px solid #eff7fa;
        display: flex;
        align-items: center;
    }

    .t8t-breadcrumb .el-breadcrumb {
        margin-left: 20px;
        font-size: 12px;
    }
</style>


<style>
    @media screen and (max-height: 900px){
        .selectQuoteItemSkudialog .el-dialog__body {
            min-width: auto;
        }
    }
    .selectQuoteItemSkudialog .el-dialog{
        max-height: 400px;
        height: 400px;
        margin-bottom:0px !important;
        display: flex;
        flex-direction: column;
    }
    .selectQuoteItemSkudialog .el-dialog__header{
        padding:0px;
    }

    .selectQuoteItemSkudialog .el-dialog__body {
        padding: 0px;
        display: flex;
        flex-direction: column;
        flex: 1
    }
    .errorMsg{
        padding-bottom: 0;
        text-align: center;
        color: #48576a;
        font-size: 14px;
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
    }

    .selectionSkuCrumb .el-breadcrumb__item {
        font-size: 14px;
    }
    .selectionSkuCrumb .el-breadcrumb__item:nth-child(3) {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .selectionSkuCrumb {
        background: #438EB9;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .selectionSkuCrumb .el-breadcrumb{
        width:100%;
    }

    .selectionSkuCrumb .el-breadcrumb__item__inner, .selectionSkuCrumb .el-breadcrumb__separator{
        color: #ffffff !important;
    }

    .g-main-container{

    }


    .selectQuoteItemSkudialogBody{
        display: flex;
        flex-direction: column;
        flex: 1;
    }

</style>

