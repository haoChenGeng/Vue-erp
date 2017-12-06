// 供应链管理模块
let Services = {
    SUPPLY: {
        // /biz/supply-chain/app.supply-server
        name: 'o8fvjnGOxxL5gkOp0sQMo-gs-0dgcElxW-4jMIA4ZS5vdO7iyca',
        methods: {
            //shop.queryPageShopUnion
            SHOP_QUERY: '_TxRsQbTR65kV92dB4S1v23WfAj4ZGp-Fbf',
            //goods.queryPageGoodsUnion
            GOODS_QUERY_PAGE: 'LXwhGlteMF3SMGEBZ2uGOXypvc23o9FJISf6_xe',

        }
    },
    //货源清单
    SOURCE: {
        ///biz/t8t-scm-mdm/app
        name: '4OwUFKWkMz0oZxf6Ul9gRz5YoIEuYGl',
        methods: {
            // views.srcListService.queryProperty  搜索栏品牌列表
            QUERY_PROPERTY: 'SFEIMb6hQr5aCnTU-oEZa7G8Y8mkHiQHMU9VGx_d_yP464YMD00',
            //views.srcListService.queryPage
            QUERY_PAGE: 'lGyw68DnJ2RlwxSw7o.kYt8t0kIkRvI2ziDoytb3hlF',
            //views.srcListService.submit
            SRC_LIST_SERVICE_SUBMIT: 'h7ss1PgHkKg2Xg54YkYlSpxug4BwKt2vOom1qq7',
            //views.srcListService.query
            SRC_LIST_SERVICE_QUERY: 'WkmlMiK5uIx1kOBSkhM-PeaoZYD0UaWDWgXUSsv',
            //views.srcListService.disable
            SRC_LIST_SERVICE_DISABLE: 'GVAgimG13cXgCjQ0isCcBMdWkaSWhCpC_lwGTCrVP46',
            //views.srcListService.antiDisable
            SRC_LIST_SERVICE_ANTIDISABLE: 'I7-I2PgDHisIrtRHBtyQxA8CwKpZ4D5ceMBAflNEbw30ptY',
            //views.srcListService.addImport
            SRC_LIST_SERVICE_ADD_IMPORT: 'UWJtIk_rrlRXsRH3cStN1_cML8LMVLj45_YDNUgLpAk',
            //views.srcListService.updateImport
            SRC_LIST_SERVICE_UPDATE_IMPORT: '9BeWXPuCfPpDVI3HsWTszJUYLbPsFhPRzZJ5uKb58ZoMp7r',
            //views.srcListService.export
            SRC_LIST_SERVICE_EXPORT: 'acbMZ0BTDrEb9CZ_2PaFBEiSdAlVr5VNSZaXrwc',
            //views.srcListService.check
            SRC_LIST_SERVICE_CHECK: 'fqqlxOhBdzKKnpcoIGscNngsZ9vLnFr63l7u5_P',
            //views.srcListService.autoGenerate
            SRC_LIST_SERVICE_AUTO_GENERATE: '92EEB_beLBbv0x5mCEtXdFsG4L8IxT89ma7R7u1t21C32zJ',
            //views.srcListService.uploadFile
            SRC_LIST_SERVICE_UPLOAD_FILE: 'IAEF15Wa68Zk-jRHD6lwI6HpF3EgO_yc8mAYiVBxJIK5gcf'
        }
    },
    PREVENTREPEAT: {
        // /biz/supply-chain/app.supply-server
        name: 'A8AxrZKqnc5oUTxkgvWYWgNA8wPk46QfFuoU40XHq5QfWtmOSFM',
        methods: {
            bizArgsLicenseServiceQueryPage: '82z9UrzSz9R6IwAxKt2TfxmvjR2fZGowkNjz_lTxQj0xqbc', // bizArgsLicenseService.queryPage
            insert: 'ZWo59HHVYkhqV2TwLzXCUJaIgjKU7h7WmrVc0XhatBw', //bizArgsLicenseService.insert
            update: '3yEaxiiGoBJE1XwH4Wo0yl2pXlvmsxY_wN6heQ5vfaM', //bizArgsLicenseService.update
            query: 'h8rOVsS_iIKArSo0XkNrc4vdUd7vflrfAcI1qPB', //bizArgsLicenseService.query
            findById: 'b54RplxN5kPE5wtMwC118dWsqgL0aftmug-xBlbkco3',//bizArgsLicenseService.findById
            queryPage:'m1xDZoR1VC80UEQqqH0-hhojS_rebeZyQxnSTFHSST2lZJR' //bizArgsLicenseService.queryPage
        }
    }
}

export default Services
