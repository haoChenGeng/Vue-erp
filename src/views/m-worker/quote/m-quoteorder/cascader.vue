<template>
    <div class="cascader">

        <div class="a-container">
            <div v-for="(item1, index1) in data" :class=" !index1 ? 'selection firstselection' : 'selection'" v-if="data[index1].isLeaf === false">
                <div>
                    <div class="item" :class="{ 'is-leaf': data[index1].isLeaf === true, 'is-active': activeArr[index1] === index2 }" v-for="(item2, index2) in item1.data" @click="onClick(index1, index2)" :title="item2.text">{{ item2.text }}</div>
                </div>
            </div>
            <div class="skuPanel selection">
                <div class="item skuItem" v-for="(item, indexsku) in skus" @click="skuClick(indexsku)" :title="item.goodsName">{{item.goodsName}}</div>
            </div>
            <div class="skuMsg" v-if="currentSku.hasOwnProperty('goodsImgs')">
                <div class="skuImg"><img width="170" height="170" :src="'http://pic.to8to.com/'+currentSku.goodsImg"/></div>
                <div class="skuAttrs">
                    <div class="skuAttr">
                        颜色：    {{currentSku.colorName}}
                    </div>
                    <div class="skuAttr">
                        <!--尺寸：   910*127-->
                    </div>
                </div>
                <div class="skuAction">
                    <el-button @click="submitSelectSku()" type="primary" size="small">加入选品</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeArr: [],
                currentSku:{},
            }
        },
        props: {
            data: {
                type: Array,
                default: []
            },
            skus: {
                type: Array,
                default: []
            },
            breadcrumbData:{
                type: Array,
                default:[]
            },
            currentRow: {},
            isAddingChildBom:false,
        },
        methods: {
            onClick(index1, index2) {
                this.activeArr.splice(index1)
                this.$set(this.activeArr, index1, index2)
                this.$emit('item-click', index1, index2, this.activeArr)
                this.currentSku = {}
            },
            skuClick(indexSku){
                let currentSku = this.skus[indexSku]
                if(currentSku.hasOwnProperty('goodsImgs') && currentSku.goodsImgs != ''){
                    let goodsImgs = JSON.parse(currentSku.goodsImgs)
                    currentSku.goodsImg = goodsImgs.length ? goodsImgs[0]: ''
                }
                this.currentSku = currentSku
            },
            submitSelectSku(){

                let row = {}
                //增加组件
                if( this.isAddingChildBom === true ){

                    //复制
                    row = JSON.parse(JSON.stringify(this.currentRow))
                    row.dosageDetailId = null
                    row.deliveryId = this.currentSku.id
                    row.productName = this.currentSku.goodsName
                    row.colorName = this.currentSku.colorName
                    row.goodsImgs = this.currentSku.goodsImgs
                    row.basicUnit = this.currentSku.basicUnit
                    row.productBrandName = this.currentSku.brandName
                    row.isBom = this.currentSku.isBom || 0
                    row.needSelect = this.currentSku.needSelect || 0
                    row.productFormat = this.currentSku.productFormat
                    row.productModel = this.currentSku.productModel
                    row.gdmItemId = this.currentSku.gdmItemId
                    row.estimateAmount = 0
                    row.actualAmount = 0
                    row.detailStatus = ''

                    //父组件的用量明细id
                    row.detailId = this.currentRow.dosageDetailId
                    row.bomGdmId = this.currentSku.bomGdmId || 0

                    //TODO 访问到app实例有没有其他更好的办法
                    this.$parent.$parent.$parent.handleChildDelivery([Object.assign({},row)])
                }

                //修改组件或者选择成品sku
                else{
                    row = Object.assign({},this.currentRow)
                    let isChangeBom = this.currentRow.isBom == 1 && this.currentRow.gdmItemId != this.currentSku.gdmItemId
                    row.deliveryId = this.currentSku.id
                    row.productName = this.currentSku.goodsName
                    row.colorName = this.currentSku.colorName
                    row.goodsImgs = this.currentSku.goodsImgs
                    row.basicUnit = this.currentSku.basicUnit
                    row.productBrandName = this.currentSku.brandName
                    row.productFormat = this.currentSku.productFormat
                    row.productModel = this.currentSku.productModel
                    row.isBom = this.currentSku.isBom || 0
                    row.needSelect = this.currentSku.needSelect || 0
                    row.detailId = this.currentRow.detailId || 0
                    row.bomGdmId = this.currentSku.bomGdmId || 0
                    row.gdmItemId = this.currentSku.gdmItemId
                    row.estimateAmount = 0
                    row.actualAmount = 0
                    this.currentRow = Object.assign(this.currentRow,row)

                    //编辑成品时如果是更换成品需要额外的操作
                    if( isChangeBom ){
                        this.$parent.$parent.$parent.handlerChangeBom(this.currentRow.dosageDetailId,this.currentRow)
                    }

                }
                this.$parent.close()
            }
        },
        created() {

        }
    }
</script>

<style scoped>
</style>
<style>
    .a-container{
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: row;
        flex-direction: row;
        color: #488ec1;
        min-height: 360px;
      /*  height: 100%;*/
    }
    .item:after {
        font-family: 'element-icons';
        /*content: "\E606";*/
        font-size: 12px;
        -ms-transform: scale(0.8);
        transform: scale(0.8);
        color: rgb(191, 203, 217);
        position: absolute;
        margin-top: 1px;
    }
    .item.is-leaf {
        padding-right: 15px;
    }
    .item.is-leaf:after {
        display: none;
    }
    .item:hover {
        /*color: #438ebf;*/
        font-weight:bold;
    }
    .item.is-active {
        color: #438ebf;
        background-color: #edf7fc;
        font-weight: bold;
    }
    .a-container .selection{
        width: 110px;
    }
    .skuPanel.selection{
        max-width: 250px;
        min-width: 150px;
    }
    .a-container .firstselection{
        background-color: #438EB9;
        color: #ffffff;
    }
    .a-container .item{
        font-size: 12px;
        position: relative;
        cursor: pointer;
        height: 28px;
        line-height: 28px;
        padding-left: 15px;
        padding-right: 15px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .cascader .breadcrumb .el-breadcrumb{
        font-size: 16px !important;
    }
    .cascader{
        flex:1;
        overflow: auto;
    }
    .skuMsg{
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        justify-content: center;
        -ms-flex-align: center;
        align-items: center;
        flex: 1;
    }
    .skuAttr{
        line-height: 30px;
    }
</style>


