/**
 * 商品相关服务配置
 */
let Services = {
    goods: {
        // /biz/supply-chain/app.supply-server
        name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
        methods: {
        // goods.queryPage  分页高级查询商品信息
        queryPage: 'w_Vf6wkZp6leugt09tYvyp8',
        // goods.queryGoodsTreeByGroup  查询满足条件的商品，根据其分组信息构造树形结构
        queryGoodsTreeByGroup :'lk2T5RsL1avogC0SczOjL7IDiKHGZIjO9cJ16wH28PhGBklIvgY',
        //goods.queryPageGoodsUnion  goods表和ext连表分页查询数据
        queryPageGoodsUnion:'rGj_4Xsu7-uqnHs3G1u-263hcNOppdnu4H_rwem',
        //views.sys.group.queryWholeGroupTree 查询整个分组树
        queryWholeGroupTree:'ajQdcyFpU2PpGQTcjDfQBtIS90UQExUgXqF8_TvES6yH9QtSRM_',
        //views.goods.queryGoodsUnionWithRelate 商品分类管理-查询分组下的商品
        queryGoodsUnionWithRelate:'_dXIBpYDfO8niSQt9kS8KHTZIrsNtuZNa4lAHzk6rHrMotXS36l-z3m',
        //views.goods.queryGoodsInfo  商品信息查询
        queryGoodsInfo:"OklVNk-bc3w-SuK5KQyaIWWanV3Ioqnd1kfLqA-"
       }
    },
    //商品包装管理
    goodsPack:{
         // /biz/supply-chain/app.supply-server
         name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
         methods: {
        //views.mdm.goodsPack.getDefault   获取商品默认包装
          getDefault: '6AWQ7Q1W2B6c6DOIN0_U8Q2u3wBzbhCEAAzBB367BOO',
          //views.mdm.goodsPack.isDuplicate 检查配置在goodsPack，或在unitConvert中是否已存在
          isDuplicate:'tHl4_4x9RE2uU0f9yCx6U7mgY3g3PE03YJzbuE_c5NGzjUG',
          //views.mdm.goodsPack.getVolume  根据参数自动计算体积单位和体积量
          getVolume:'q20ZzmHY5VRg-Z3nrWtIcAkVTsqT-EhUmiksAtwthhQ',
          //views.mdm.goodsPack.create  单个创建商品包装配置
          create:'QdgLQu-RAM1lwdEhSqVPwDmLBrWRkcISKNGUtP6',
          //views.mdm.goodsPack.isUsedAsBarcode  是否被用作条码
          isUsedAsBarcode:'QYetimDE1mOb0Yea3HYA-NuMOCsmqA0U_cARTZ-kwEZkjW7RNf4',
          //views.mdm.goodsPack.update  修改商品包装配置
          update :'QZEZ7U5g4J3Dg-Y7wR8rVCmHl5B3frSP4EUPk2h',
          //views.mdm.goodsPack.getById 单个查询商品配置
          getById:'zCB_2RQH1ypIg8-ma1x8WJwif80N2SB1vsX2dr6',
          //views.mdm.goodsPack.page  列表页展示
          queryPage:'jsZpdsU1kbYwMcPyM5U5a6JdjP6A5d56dgm',
          //views.mdm.goodsPack.delete  删除
          delete:'KkilbFz3oHPRWEnW-sbgKgSDFFhWdzQSWaee_RA',
          //views.mdm.goodsPack.disable  禁用
          disable:'21t765To3xzYIR66A5luNoLbca_2OC63eonsD7v',
          //views.mdm.goodsPack.available 反禁用
          available:'ug71rw8fApsYTvhptwJr8S2pWL2fFLyfoH_eWGyhHXV',
          //views.mdm.goodsPack.import 新增批量导入
          import:'aPHgMI0IWVWUKlJboZmFwKw9BsOXugkZQ5tRjHq',
          //views.mdm.goodsPack.batchUpdate 批量更新导入
          batchUpdate:'SZOZXyEnAL5WyiTkTuEoHv5IdVqyHN_6KW7KkXoR56nCE67'
       }

    },
  //bom相关
  bom:{
     // /biz/supply-chain/app.supply-server
         name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
         methods: {
          //查询标准bom和它所有叶子商品的到仓价格 views.sys.bom.queryStandardBomGoodsPrice
          queryStandardBomGoodsPrice:'-aVU-ovgPoqGpDL4UQJpSRGETP4_nL3vc9GuZHWehovBleg85AD9cdII113',
          //根据商品ids获取对应bom  views.sys.bom.getBomTreeList
          getBomTree:"ImVnc388odxheHlHfZxOpdSZHTBbmvVWiAhSEVxZwrA",
          //商品低位码重算 views.sys.bom.lowLevel.calculateLowLevel
          calculateLowLevel:"isaLvlwX4Dh_bFoTbCzQLyxhsnUSijqj4urNP1YWP2nSQdFmBiUPMhaUE15",
          //低位码导出 views.sys.bom.lowLevel.queryPage
          levelQueryPage:"amnmuMa6b0xCIzIvZRJpb5edullkYOIuqVVwldrl-hb3lMV"
         }
    },
    //调色费用   色系色号配置
    goodsTopcatColor:{
      // /biz/supply-chain/app.supply-server
         name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
          methods: {
            //批量导入色系、色号信息 views.mdm.goodsToningFee.importTopcoatColor
            importTopcoatColor:'EcYMTcvRNL5V_fSVzVoFaL5kk_5cZGO9ZEbLnO6koQsHU_p_kA_dyF8QcrhQH2z',
            //色系、色号信息查询 views.mdm.goodsToningFee.queryPageTopcoatColor
            queryPageTopcoatColor:'zJQJyPxaCBoXYzNEaCi5J4xhRDy7lO8L9ANyOwcF_fc_qa_-B4azx1W_C4vDMUaA1Yl'

          }
    },
    //调色费用  
    goodsToningFee:{
        // /biz/supply-chain/app.supply-server
         name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
          methods: {
            //新增调色费用 views.mdm.goodsToningFee.add
            add:'MHXzU9aCgSJIEfuIQTDNsDi24sO9MreEZHItZpWPyvh',
            //删除调色费用 views.mdm.goodsToningFee.del
            del:'uo26eDJAunlqLyb-szTkiEXXSvmTL6i6SlXkng2YTRC',
            //色系、规格费用配置信息查询 views.mdm.goodsToningFee.queryPageTongingFee
            queryPageTongingFee:'3-i7pkNf1vrpFQr2.yu6qNtcB1wpA7m-tqQA.IIdwjRqKM9sclEz-iu0pwKywsW',
            //编辑调色费用 views.mdm.goodsToningFee.update
            update:'ECAA2i0dJFAUmVNKBzOAaxhYHF-oVAV8A6XwmIxQ1sQ0rZr'
          }
    },
    //商品条码管理
    goodsBarcode:{
       // /biz/supply-chain/app.supply-server
         name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
         methods: {
          //列表查询 views.mdm.goodsBarcode.page  
          queryPage:'Y4uxwn0e5YfflobhEtBaCbuivR8VIIhig0ATmvk',
          //提交更新国际码 views.mdm.goodsBarcode.update
          update:'ltB938fG0cpk1k7zKx16p7XCdMdJV9fqBOxcs3KhecH',
          //导入更新国际码 views.mdm.goodsBarcode.importUpdate
          importUpdate:'gvmXhrRwgfViVqk0f5Um2Zn32M7_piWuzfeGzfqmFUed4VViIZJ',
          //执行条码数据生成更新 views.mdm.goodsBarcode.generate
          generate:'ax2imzG_sRb8EiY3jCbwb3C7UwO1UPcIgVRBstowC_qNJd8',
          //删除条码  views.mdm.goodsBarcode.delete
          delete:'8OIJCXeC8B5wOfIuTuld3S4JpX4IRF8xa47nV4JEszo',
          //打印标签 views.mdm.goodsBarcode.print
          print:'sqre0rVEGlWQgzEgm3Bm-cCI1Lqlw0fTh_pWvt5lLP4'
         }
     
    },
    //商品品牌管理
    brand:{
      // /biz/supply-chain/app.supply-server
         name: 'XAgCY5Yu3vtfJ5mOz6l1EatklIpkR9ATvWAjWO5sLB9onDCTTYI',
         methods: {
          //列表查询 sys.brand.queryPage
          queryPage:'AdIFWcJdfCt1g1g6rGtrqd6mo48kQIV'
         }

    },
    //商品货源
    source:{
      //    /biz/t8t-scm-mdm/app
        name: 'yhwfbc3bHENpH14VF_khLvG5zeWBnz5',
         methods: {
          //列表查询 sourceList.queryList
          queryList:'vNQGd5f7sarHgzFNzipZF1ngCqvJmNZ',
          //views.srcListService.query
          query:'kwyqTAZ1kyWth-js0BiKEsm0efhDb2XkfzUuy-F'
         }

    }

}

export default Services

