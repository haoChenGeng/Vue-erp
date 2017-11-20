let Services = {
    // organization
    ORG: {
        // /biz/t8t-sys-acc/app
        name: 'PQ7MA37RKUMX182N4Ldrany1U61bWrG',
        methods: {
            // organization.queryTree
            ORG_TREE: 'pG9Z2VOEhahU-kS2rS3SDonYC2NSBhYUfKK',
            //views.organization.queryTreeWithTypeAndFunction
            ORG_TREE_BY_TYPE_AND_FUNC: 'xrr-49g0fLi8wueSx2CMIfcWJR7L5twNeRdgR91cxujf8aydoF5prRsqvtKfLWv0R-U',
            // organization.queryByParentId
            QUERY_BY_PID: 'YtvzOVAV4SGd_tQB5sCJPByPBw26mO4PRCbGjPHB892',
            // organization.update
            ORG_UPDATE: 'EnmE2xqIHQui3zbd8ZuAZJjiS0BSf5p',
            // organization.query
            ORG_QUERY: 'WnEiGHWmqYSeFvaG9w3iHwJSEln',
            // organization.findById
            ORG_FIND_BY_ID: '8lpdM5saVV1YIHwbS8dIKJGH2sBHW3b',
            // employee.queryFull
            EMP_QUERY_FULL: 'P8u_iOqvcRM5jALQHdSKI8DPj3f',
            // organization.queryCityRelation
            ORG_QUERY_CITY_RELATION: '9ZZDp1I7s1pE20LRo2aSX7UnlKv-F3Ct5ZB5UoRpjfQ',
            // organization.assignCity
            ORG_ASSIGN_CITY: 'ePe_lda-tl6g8xpYAh9Y20LE9sfpRw5xisX',

            // v2
            // views.org.queryPage
            ORG_QUERY_V2: 'ZaNfVu2mEsxi0EO_y-Ov1Iu_mfQ64qp',
            // views.org.queryTree
            ORG_QUERY_TREE_V2: 'jt_8h9QExOlCS-f6ff2N_chgpf9UWwW',
            // views.org.create
            ORG_CREATE_V2: 'w1kzfLP9rKIqQbok-xttcHoPOQC',
            // views.org.findByCorpId
            ORG_FIND_BY_CORP: 'JaZW_r9dGLmqIYpS4Z5GAuSI-RQYw5uIhxe'
        }
    },
    CONFIGURE: {
        // /biz/to8to-it/app.tit-configure
        name: 'OnLYil9jY0PiKilsavskNJvygGUxhME7eLPWccmGmYjb_ED',
        methods: {
            // systemCode.list
            SYS_CODE_LIST: 'vPnFi_QA4HeBWeU61ZjQPCn',
            // systemCode.queryAll
            SYS_CODE_QUERYALL: 'QStfpA8OfKt0J84zrUHuPmUO7PR5yB6',
            // systemCode.getByFatherCodeList
            SYS_QUERY_BATCH: 'N9r2iHW0S1sUJbVtsL9H2CzkacmeHonbT9fc6a-KI-6',

            getByCode: 'u9-LgIPayWLQrgl_rjsrXUktlybLZvG', //systemCode.getByCode
        }
    },
    EVENT: {
        // /biz/t8t-sys-eda/app
        name: 'hLuQCMWVInu6UCaNIhru6tX3kFGgUHZ',
        methods: {
            actionDefQueryPage: 'x5qn5hyIO9XnPJepCL8gGV6epZ5qZY4lIarseOP', // views.actionDef.queryPage
            actionDefCreate: '4YTDOgmJDD2Q5DqXrgBB9UrjC7wlgfZG5cf', // views.actionDef.create
            actionDefUpdate: 'Qb7tYQsTefVBzOXD1ECGWZAvIjON17SYE_0', // views.actionDef.update
            actionDefFindById: '_Ic6fStwj_OAZ-MxU29IItdTeRiKGplWHKI', // views.actionDef.findById

            eventDefQueryPage: 'ahTgd25qcHdlWWBGkHGFxrXFQlbUhT2Iadg', // views.eventDef.queryPage
            eventDefCreate: '2NLQIh3Unv9GD9B-2bzu-H_d0QCC3I7', // views.eventDef.create
            eventDefUpdate: 'nCDk_BmWn60w5CjDZg2g246xdt3ydBA', // views.eventDef.update
            eventDefFindById: 'E_A_LiEmbG_yG71T_pyuFVyB_cEe2frtDma' // views.eventDef.findById
        }
    },

    EXPRESSION: {
        // /biz/t8t-sys-exp/app
        name: 'zEQxPT37qdpj3TEjNi6x8g2qj610pfb',
        methods: {
            constantQueryPage: '4JaBuGyCuG2Q_Al72S6EGwrzwL3', // constant.queryPage
            constantCreate: 'jF557XIEhztxg4qIX3UajOw', // constant.create
            constantUpdate: '9HmUyLx5DDO3PDl6o2SA9lK', // constant.update
            constantFindById: 'CkleIgBRIQoKASQZ5FskjpA-AVs', // constant.findById
            constantToVoid: 'QbgoZ4DwZFYSOJSQ-vO9YKc', // constant.toVoid
            constantQueryTree: 'XF_85qNmsisoODrtW6uqyTroj4z', // constant.queryTree
            constantupdateStatusBatch: 'ugnGwakHBQN0ZybqKmP6v77-hp1Aa7Z5KwJrbLi', // constant.updateStatusBatch

            variableQueryPage: 'jXJ1DhJLnZKWwiaHWOYYW2JagVs', // variable.queryPage
            variableCreate: 'XM5nX88oMYvNlAxFb_OUKfI', // variable.create
            variableUpdate: 'A0PcZv8UpIGfrDFrZMC6mrI', // variable.update
            variableFindById: '2-0LNhehr0wcrDxsCG1chSqcr9H', // variable.findById
            variableUpdateStatus: 'ox-spghPYgQc9kjfGwhNKwfwInoRLq4', // variable.updateStatus
            variableQuery: '35H0sadSn1GebF0bq2xJ55a', // variable.query

            formulaQueryPage: 't6A0cXTtoSLzzkkFitpqX1t5WSB', // formula.queryPage
            formulaCreate: 'LVD1LJDIaecnDnUfmHSLDVy', // formula.create
            formulaUpdate: 'huEsrPh8q7SdJumUgxwkQcI', // formula.update
            formulaFindById: 'PM4oXSSkPHhhuV9wf3Rf__728Z-', // formula.findById
            formulaQuery: 'SV-tIWREQu9USkzWCQcd7s5', // formula.query
            formulaGetExpressionTree: 'MGtiw30AfLDXha44qujPjvl5H9P3BwhGl8E6tex',// formula.getExpressionTree
            formulaCreateFromList: 'DPrjNFvaBul-7FvzRPgHwFUufBgvTcb5sbf', // formula.createFromList
            formulaUpdateFromList: 'jpDplfZ3ibY8qnRKXrVQNQfs03bKw9xmD1L',// formula.updateFromList

            formulaQueryDatabaseTree: 'YKJJYzDhWdH_YvR7N4LQC6p9qpvUN8aTw7LBZ-a',// views.variable.databaseTree
            getValueBySql: 'QqZvR8B1kSe9lfeNaOI-ehdqfoabMhVOIHmdFkmTKzE',// views.variable.getValueBySql
            getValueByApi: 'rnkxb2dsr6ZGbkUzqYpgg8a1hyU3D6xqpDsjW_scOBS',// views.variable.getValueByApi
            queryFieldList: 'ncbqpAX4orhKrQi8ugh_O4SNaxlyvRVbOiJl79uVxa2',// views.variable.queryFieldList
            getResultNew: 'GcgNBw_V9bWxmCLLjVAHhQPS52SK0ZQ7F1NNKFo',// views.formula.getResultNew
            expressionValidate: 'p80A2F6JpLoGZSA5kP4ubEsYhPr0qC6ydT31DoM24wvumxS',// views.formula.expressionValidate
            createNew: 'zDti2DEWz9YB-HAGTI3Lwo2HMtb',// formula.createNew
            queryByFormulaId: 'UJcYPcCPVXkonSM1VKrFl_OIXBdG6P3OnSWo4kjA38sQzyl',// views.variable.queryByFormulaId
            importBatch: '1492i5SRzd2NFrZoixthRBtvS0esWGonkzcrTFV',// views.formula.importBatch
        }
    },

    ACCOUNT: {
        // /biz/t8t-sys-acc/app
        name: 'I2j2ndHdq1LHNmFigw3SDOFf7KX0Bj9',
        methods: {
            accountFindById: 'NbQll6Xc4jJCrMdwpHdc-eDC0GK' // account.findById
        }
    },

    APP: {
        name: 'bXWNDxfYSvmg93oPAtI5hx8fhGrpkSh', ///biz/t8t-app-pam/app
        methods: {
            permissionExtServiceListPackPerm: 'GjhdXgClVyZAisYTReGyPYYgNyLG7EeISTmVi_YXwOwZ97KOtm8ERGq', //views.permissionExtService.listPackPerm
            permissionExtServiceCreate: 'Mjei8elHqHEQvZBR1J3leYdS5LAJxQaiWnDicWbZ34iRUST', //views.permissionExtService.create
            permissionExtServiceQueryPage: 'oExDoAW6ogtQ1vDNn9wi65wzDmPZx2_3DxUnu5jigdDoFwZiip_', //views.permissionExtService.queryPage
            permissionExtServiceUpdate: 'gUYhSf4IcYuzEifDjjN6jyNgC6eB7hJWJtF0KEfhVEWUETm', //views.permissionExtService.update
            permissionExtServiceUpdateIsDel: 'CJ1BtbxPqWmiSA01DsDCU-0xIBquzs05O2Gk-q0zmHozhJ34bUm2VTe',//views.permissionExtService.updateIsDel
            versionServiceFindById: 'iZlVa7NehVFwglcm3x6ZmMqPnJmc3EyIWjyIFL3TVVz',//views.versionService.findById
            versionServiceCreate: 'qxy1ZEGrtil6lzh.1-ZjWyn0pllwRj-UHRuVTgj', //views.versionService.create
            versionServiceUpdate: "UMfbHy0iCaPaDvhkSSLiycChPTTeITRRpLRTQGc", //views.versionService.update
            versionServiceQueryPage: "9HHF6TbRl90lErT2-qICsF9J5G0F3Oqnn0540f1_19G" //views.versionService.queryPage
        }
    },

    OPL: {
        // /biz/t8t-sys-opl/app
        name: 'zcjBFNoY4f8U0NLIgvSYBcpWVIHyk1q',
        methods: {
            queryPage: 'MAxT7GB_WGWNCPW', //queryPage
        }
    },

    PRODUCTPKG: {
        // /biz/dsp-prs-pqm/app
        name: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3',
        methods: {
            productPkgTempBaseQuery: 'Y1ijwXxY-pPCppYPgoB9moyPfVjQ7gf_DqM2kE8ZSQBbO66', // views.productPkgTemp.base.query
        }
    },

    // 供应链辅助资料
    SUPPLY_CONFIGURE: {
        // /biz/supply-chain/app.supply-server
        name: 'qVq5B_KUuBzTC3kyP9TiuA53IS1kiBn5fR5JVjR7fUS6nsTm4Zc',
        methods: {
            // property.queryPage
            QUERY_PAGE: 'Ewi6YId8aELgLHFBBSBMT4BvG3R',
            // property.queryUnionParent
            queryUnionParent: '5l6jR2KUJ4QdYxLFz0ZJGFy5XZkLajNNSEdLf0t',

        }
    },
    CONDITION: {
        // /biz/t8t-wkf-bpm/app
        name: '-UmWIPvUtA1rb5RIFn7E8j5vqLJ5gmy',
        methods: {
            CONDITION_PAGE_QUERY: 'QOhJWeEiLyiqM9Yn4AJd4hzjpuAP9sQurBaQDzm', // views.condition.queryPage
            CONDITION_CREATE: '2yxC6EWmQ3TK9GjTxVpgcHXyqPmwnTN2dPK', // views.condition.create
            CONDITION_UPDATE: '3_Fx9CZIxBadPlm-N2uIIkHhQkTfNkftshM', // views.condition.update
            CONDITION_FINDBYID: '38MP1fjJCPoVG07My_VIhNDB5CD9ss63_MR' // views.condition.findById

        }
    }
}

export default Services
