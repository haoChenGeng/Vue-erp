/**
 * Created by tomy.li on 2017/5/9.
 */

let  Services = {
    template: {
        // /biz/dsp-prs-pqm/app
        name: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3',
        methods:{
            //查询产品包模板 views.productPkgTemp.query
            searchTemplate: 'CNXZAq_UTBYDp9COKIC-kQAnFIgOKmlWRPJXgJl',

            //创建产品包模板 views.productPkgTemp.create
            createTemplate:'c3zjwjJL9eWIAcInQqzybOqqDP4tWPwn2aoZph6',

            //更新产品包模板 views.productPkgTemp.update
            updateTemplate:'S8xZvRwVjfRS6iRKnapLHgkpbwZUg1xngMtiMIx',

            //审核产品包模板 views.productPkgTemp.check
            checkTemplate:'ibbqkvRhUQO2fRLXki402wOrWsTczmh7orisg4F',

            //禁用产品包模板 views.productPkgTemp.forbidden
            forbiddenTemplate:'XiZhTXnJofGHcYCVPJsz9lVx_fLFU6xYkqxTmRQHCPq',

            //复制产品包模板 views.productPkgTemp.copy
            copyTemplate:'VggaUzBzkX9GYQtlt9Ka6pjTwGcXM2pOzmnE4n9',

        }
    },
    tempItem:{
        // /biz/dsp-prs-pqm/app
        name: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3',
        methods:{
            //views.tempItem.update
            updateTempItem: 'LnUSpgz6fZCYfe0kwIbZ0ceGFnUFChh',

            //views.tempItem.check
            checkTempItem: '7QBLR5i4fMgzMI5wWk3zlMCSNBDidhv',

            //查询产品包模板行 views.tempItem.query
            searchTempItemList : 'vLnojOoObKzDxJBqiWbhxcdaTWNpR8t',

            //views.tempItem.forbidden
            forbiddenTempItem:'ktovV_QnU-ehl9s6hgAr1TgpHqgqebVRPJ3',

            //复制 views.tempItem.copy
            copyTempItem:'M1UAC6T5be52FLLhASJBidGRaN69tnc',

            //产品包模板版本记录 views.tempRecord.query
            tempRecordQuery:'DIdYCqAfWpr3qnB2uc6qgY76sWQKGruDy6l',

        }
    },

    supply: {
        // /biz/t8t-scm-mdm/app
        name: '4kFXbl6g-G2AbInKo7VyRJOreftEsow',
        methods:{
            //报价配置sku查询商品信息 views.goods.queryGoodsForSetSku
            queryGoodsForSetSku : '1yvDQ5-lGkBG40OpMk61e9oxDjiPVvn9iKjCyrD7Ol3nucH',

            //按组织查询供应链有效的sku信息, 打包解决了商品状态过滤(已审核、非已淘汰、未禁用)以及城市分配等  goods.queryEffectGoodsByCity
            queryEffectGoodsByCity: 'mdm/queryEffectGoodsByCity',

            //按组织查询供应链有效的sku信息, 打包解决了商品状态过滤(已审核、非已淘汰、未禁用)以及城市分配是否有工长价、业主价等 goods.queryEffectGoodsByCityAndSalePrice
            queryEffectGoodsByCityAndSalePrice: 'mdm/queryEffectGoodsByCityAndSalePrice',
        }
    },

    //项目排期模板
    schedule: {
        // /biz/t8t-ps-pmd/app
        name: 'PHZ4wJ5NChyZm_bdgBuKFocGUCzQOjT',
        methods:{
            //schedule.module.queryPage-排期模板头记录列表分页
            module : 'i7i7ssrGiIWkCwyuNS8vsJrQ8YIvxaAWIZ-xlYS',

            //查询报价模板信息 schedule.module.queryPagePqmQuotaion
            getInfoQuotaion:'7lBW1onPuYVQ_lUM1lmsvuWwSEqVC2jCWxXkS5rTOAkEgxyYP69',

            //模板id查模板记录和模板行记录列表 schedule.module.queryModuleAndModuleItemById
            queryModuleAndModuleItemById:'Z0FlRV4xWyTqaV6Q3EVniJfCtY-F0_V5jcTdMPM2iLT1jESsRRTQkYAZ2w4ITO4',
        }
    }

}
export default Services

