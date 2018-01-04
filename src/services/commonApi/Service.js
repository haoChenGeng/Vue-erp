// 财务模块
let Services = {
    // 辅助资料
    CONFIGURE: {
        // /biz/to8to-it/app.tit-configure
        name: 'OnLYil9jY0PiKilsavskNJvygGUxhME7eLPWccmGmYjb_ED',
        methods: {
            // systemCode.list
            SYS_CODE_LIST: 'vPnFi_QA4HeBWeU61ZjQPCn',
            // systemCode.listNextLevelUnforbidden
            LIST_UNFORBIDDEN: 'vL0y_oFhAeDM3YTmFrp2oaHn1UDcQEzq1orWi41sEc2pVcjlpGN'
        }
    },
    // 供应链辅助资料
    SUPPLY_CONFIGURE: {
        // /biz/t8t-scm-cfg/app
        name: 'R8b7h4AHkMWAu5hFhrksUafEPkyKTyW',
        methods: {
            // property.queryPage
            QUERY_PAGE: 'Ewi6YId8aELgLHFBBSBMT4BvG3R',
            // property.queryUnionParent
            queryUnionParent: '5l6jR2KUJ4QdYxLFz0ZJGFy5XZkLajNNSEdLf0t',
            //views.property.queryChildrenByWholeCode  通过全码查询辅助资料
            queryChildrenByWholeCode: 'sDE1BauR-rhu_AU-6F9VF952lJ_JIl-r1QOnscFpFYW0GFS9p3nAG1z',
            //views.property.queryChildrenByWholeCodes
            queryChildrenByWholeCodes: "CEGKxWt_AJmoqBtXoGEqET64657I2n7n39qadM-E_uX2b1O8X5k8Ii2vEnj"
        }
    },

    //供应链基础资料
    SUPPLY_MASTERDATA: {
        // /biz/t8t-scm-mdm/app
        name: '4kFXbl6g-G2AbInKo7VyRJOreftEsow',
        methods: {
            // shop.queryShopUnion
            queryShopUnion: 'zPrIoMCwO3geMqwnGH2Afs0w-7lpdva',
            // shop.query
            queryShop: '4VE-APqV_Fs13Cswfj8'
        }
    },

    // 组织架构
    ORGANIZATION: {
        //  /biz/t8t-sys-acc/app
        name: 'CsxicaQ7wM_3kaiMdGJQAaOa2fUF8v-',
        methods: {
            // organization.queryByFunctionCode
            QUERY_BY_FUNCTIONCODE: 'UwBgld0zWv.T_KSfK6W2_uSPCGXiv-mkEbmTNx6qeGoR_hH',
            // organization.query
            ORG_QUERY: 'DOiN6_9fU1yNwZE_gRuTrdwwvEg',
            // views.organization.queryTreeWithTypeAndFunction
            QUERY_TREE_FUNCTION: '-DB0-GqPoWXHozK4BKUV3yMPaFmC4lppJyYYIe9k-Gk5VCj84OEe2JBi24SnYuFqXHe',
            // organization.queryWithoutDel
            ORG_QUERY_WITHOUTDEL: '9Ivp3_1e5zNZU_miVqa6YXq9Zg0sb1JBadatp4EuTiR',
            QUERYTREEBYTYPE: 'IefMV_-kDFPfZ-shDibTaiAtug9yEjMCuudrr6HFltn', // organization.queryTreeByType

        }
    },
    // 商品
    GOODS: {
        // /biz/t8t-scm-mdm/app
        name: '4kFXbl6g-G2AbInKo7VyRJOreftEsow',
        methods: {
            // goods.queryPage
            QUERY_PAGE: 'ByoqRxHfrD8M7MGSNKC-qVN',
            // goods.queryPageGoodsUnion
            QUERY_PAGE_GOODS_UNION: 'KYI9tvUKvrmrnw02TOmUAbkj27FmFOkq8nDox-O'
        }
    },
    // 事件以及分布式事务一致性
    EDA: {
        // /biz/t8t-sys-eda/app
        name: '806ndPAX4QHSaL8S3kOGYVWD7gJKERC',
        methods: {
            // views.queue.queryQueues
            QUERY_QUEUE_QUERYQUEUES: 'NJaG8pAbK6IGAM2RtOG2V_cGwPKCj8.QKtj'
        }
    }

}

export default Services
