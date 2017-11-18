// 账号模块
let Services = {
    ACCOUNT: {
        // /biz/t8t-sys-acc/app
        name: 'GuSlsbEuI-IpnAy9Dc8eqQ75vVO667x',
        methods: {
            // position.query
            POSITION_QUERY: '64wmLJ-KJJnhoOSK2LDQdFe',

        }
    },
    PERM: {
        // /biz/t8t-sys-pem/app
        name: 'abqLtBZRxYd9AbDFankow0Azfw7jdUj',
        methods: {
            // role.list
            ROLE_LIST: 'UEIfVA5f.RcrsgG',
            // views.role.boundOaPosition
            BOUND_POSITION: 'TovqhqTiiwWIwQKDKlQAbkbOyClHNx5kiVgTA71',
            // views.role.queryPositionsByRoleCode
            QUERY_BOUND_POSITION: 'y8B50KTBzsEDdsSG5qwYH0xVGkv94LgdUy2NeVnoBSC1okCgZrG',
            // views.role.unbind
            UNBIND_POSITION: '18v-lLgIy6W0kywtPJiDjBxwpMI',
            // views.role.queryPosition
            QUERY_POSITION: 'RUXTTbrfPJfML1tVM2DmMwHVvlAVWn594dg',
            // views.allBizObject.listTree 和2的区别在与返回的格式不同，弃用
            ALL_BIZ_OBJ_LIST_TREE: 'DfagbuIXRRXj5NMzfNhDQSLIyCiaLiXdbI9DNOf',
            // views.allBizObject.listTree2
            ALL_BIZ_OBJ_LIST_TREE2: 'k-CU7iLREuqMJDo9tQNcTfxxzj5frH_wSuszurup2HY',
            // views.permission.list.order
            PERMISSION_LIST_SUB_LV: 'iutoW_GGVzQNdmSaHo_T9c0jq8ligSoSuxpdJhp',
            // permission.updateSortId
            UPDATE_PERM_SORT: 'YZgynSiyuJ207ay5Boaedw5RVfX0IGsllc_',
            // permission.queryPage
            QUERY_PAGE: 'dC_zYBlyJkjsakd5caAUza_CeE2Tq6t',
            // bizObject.add
            bizObjectAdd: 'dyxq8Z5tBxzMNRpUdLsP0DF',
            // bizObject.update
            bizObjectUpdate: '7UGd2l3MOJSFDj_a2e63lXHxjjj',
            //permission.getById
            permissionGetById: 'XGCuKYlvc3nsUPtjoTCO90eBhoT',
            //permission.delete
            permissionDelete: '97NCTOGWm7jSS-DtEKKlCGSz1uz',
            //permission.add
            permissionAdd: 'oZm-nkk3wysFyj-uyKeYHPM',
            //permission.update
            permissionUpdate: 'eK3N9jZZc3l4tzRq_olIUjh-fCI',
            //permission.deleteByIdList
            permissionDeleteByIdList: 'I2Cj4JsDKnPWFk9OGXFMLTRNzGfRyZXzmaVJehz',
            //permission.exportWithParentIds
            permissionExportWithParentIds: 'eHUsaQmuW2UadcmfhzVBxdlmLWUYMiU1w0TDz3-QWT0',
            //permission.importWithParentCodes
            permissionImportWithParentCodes: 'qvXnD_4IU8HzPtCBW362j9t5i786yIlUlE5z9HTvYL1rowi',
            //permission.listAccountRoleById
            permissionListAccountRoleById: 'jQr5kduQ6-wHxoVZBwUhr47asUsiAyMlQhFhiqYoysu',
            // views.role.queryRoleDetailByPermissionId
            queryRoleDetailByPermissionId: 'ZTpmboQbzIfkCqYC22fEZuLZKtMKCHXcPgKT2EMZ9SgnzagkQng04R5WFCu',
            // views.permission.genNewChildCode
            genNewChildCode: 'VcsujCWynNf6NUMao3RCunRpCtkg9Zghl8eJ6phlNFlgPaL',
            // accountRoleDetail.list
            accountRoleDetail:'-p7e0sZpAEVtD8m7lo43HtnB_9aP3aktkUh'

        }
    },
    CONFIGURE:{
        name: 'BrykHK2bCsWtTZqSYm62XRw7XF_MbELGnCbCRkRwMLnCLpo', // /biz/to8to-it/app.tit-configure
        methods:{
            systemCodeSearchByPage: 'AYaWP87iGs2KKKxmPT6rcW5rE0U72XRPv6x', // systemCode.searchByPage
        }
    }
}

export default Services
