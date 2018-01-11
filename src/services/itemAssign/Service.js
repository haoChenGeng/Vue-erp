
let Services = {
    // 项目执行服务
    ITEM_ASSIGN: {
        // /biz/dsp-prs-ass/app
        name: 'UAR17K-aC6TYYJ0STNnwk8m6J-4keFe',
        methods: {
            // 项目经理接单配置
            // principalSetting.listPage  （项目经理接单配置列表页）
            PRINCIPAL_SETTING_LIST_PAGE: 'OpTBdMaEcAo-eFX5oqR2cFg7qtdOOAY2_3Y6020',
            // principalSetting.deleteById （配置删除接口）
            PRINCIPAL_SETTING_DELETE_BY_ID: 'gNPUwhsp_hhZIZKop8xhAymf4AqfyHq4axHynt4',
            // principalSetting.deleteByIds （配置删除接口）
            PRINCIPAL_SETTING_DELETE_BY_IDS: 'FxGlWeHTdDwrxmJuJa2S_cXDv1fRQbMHsP3WILZVnpq',

            // principalSetting.delete (配置删除接口)
            PRINCIPAL_SETTING_DELETE: 'PPRqRvPghMPuJ4d5jKohh66aiYWoqjhQW1a',
            // principalSetting.add (配置添加接口)
            PRINCIPAL_SETTING_ADD: 'GywTz9jNDsdS16bqeDrIYEZj5ywc0Mn',
            // principalSetting.update (配置编辑接)
            PRINCIPAL_SETTING_UPDATE: 'EYqKuIi9BVnrL1ZmaJDlKWqTaI-blGR-szh',


            // 综合评分配置接口
            // assessObj.settingPage （列表页接口）
            ASSESSOBJ_QUERY_PAGE: 'NEujN6upJmn4KBWvG9mxeIHNE73T6Lb',
            // assessObj.deleteById （配置删除接口）
            ASSESSOBJ_DELETE_BY_ID: 'WaaK1ZYRvDn6X6mRWZCV2cRAL5TaM1w',
            // assessObj.deleteByIds （配置批量删除接口）
            ASSESSOBJ_DELETE_BY_IDS: 't8kUC80U5Z4rTw9569nt6J-rqi39ySZ',
            // assessObject.get （配置GET接口）
            ASSESS_OBJECT_GET: 'LNOqgeA59KtKdLdX2HBamYTB3RH',
            // assessObject.create （配置创建接口）
            ASSESS_OBJECT_CREATE: 'onZEWpLFlCFmojaWGfjbCpiWPxrOS2S',
            // assessObject.update (配置编辑接口)
            ASSESS_OBJECT_UPDATE: 'EQ_2eED9a-S4T0AqfqzUucBvwfFAn9r',
            // assessObj.voidRow
            ASSESS_OBJECT_VOID: 'nkJXDqXJFlBJmLmVClVOhozsADR',


            // 项目派单相关模块接口
            // assignPrincipal.assignPage （项目派单页面接口）
            ASSIGN_PAGE: 'u5xFApBW3ceSvJ1S9tboCtKX.ZvaNzKw6q18e9R',

            // assignPrincipal.assignPageByProjectId (添加派单单据项目页面)
            ASSIGN_ADD_PAGE: 'uV-ibF92I5ef1QwOxVBbrCy7teDP_MzBRo2BaBnz7XZweUMxR2hFnVo',

            // assignPrincipal.assign (分配负责人接口)
            PRINCIPAL_ASSIGN: 'RWTEwUKYX9uxdAcymB_tlHdLCtQxOQjCI0l',

            // 重新派售后客服 views.recService.reAssignKF
            REASSIGNKF: 'gvdaeg9Y1nxdtZBN-mppdmQHym1fgM-n-vsmchS',

            // assignPrincipal.selectPrincipalList
            LIST_PRINCIPAL: 'Dx8Oy92IDz4D2Q3VDwtVXlVMWo9CfvSJ0bNEAlKE_s7KfJQ1R_s',

            // assignPrincipalProject.pc.selectItemManList
            LIST_ITEM_PRINCIPAL: 'GI7kLDKR10peOT9eWJ45aF1x6gHT4EKiujFiugLKfWGoC2Kp2az2L4bD7SlRuxu',

            // assignPrincipal.assignItemPrincipalListByProjectId
            LIST_ITEM_PRINCIPAL_BY_PROJECT: '9A1LxvGWr0vNIR1_CxuR0OdK1fN-IKJhsE-L2HPKgXAO8JB-I5A76fo49L7FLmSxtmd6t9m',

            // assignPrincipal.DeliveryList (派单列表页-交付经理)
            LIST_DELIVERY_ASSIGN: 'n1gUt4xU6uYHv2lxNO7uVk7p3y49aLcAmnNjqJFsfPe',

            // assignPrincipal.projectList (派单列表页-工程管家)
            LIST_PROJECT_ASSIGN: 'PN1WC5XT2JB8PBKAfcQA5jBPka-wOaSqt3y-KAo',

            // assignPrincipal.itemList (派单列表页-项目经理)
            LIST_ITEM_ASSIGN: 'nOH7nfYlMSA2hgZzkRM78CgtBiRsGEUlOa6',
                /**============================================================================= **/
            // views.assignPrincipalProject.pc.page
            LIST_ASSIGN_PROJECT: '1ABz-UY85juUo3p2IiTjpB1CbK5STNgoq97yPvxpiRK0AaNkk-x',
            // assignPrincipalProject.pc.assignPage
            PAGE_ASSIGN_PRINCIPAL: 'N5_SM1Nl41raQFIvXPoo7h25oh5WMHLkql3UnU-tCOLLVrvINBT',

            // views.assignPrincipal.assignRecordPage
            LIST_ASSIGN_RECORD: 'nCw7zQlJ0xTWIzzm1bgRXz3xj7_1fgIlvaM5_su0tTBjMTLygd7iLtd',
            //views.principal.getAssignList
            GET_MEMBER:'IOJh6wigEGbdSz8kMGDxuXzKy4IYbdwKO_xO7UTHg7o',

            //views.principal.getAssignPrincipalList
            GET_ASSIGN_PRINCIPAL_LIST:'x77jc6zPwxkVdqd4f6sYTAg8bkgHHIqKmpt3SGCskN4wVAkeGG3w4SS',


            //views.assignPrincipal.assignConfig
            ASSIGN_CONFIG:'z284s2jxcbia1ws0upI9L_r9g4bdHIwP7HJyNl8cmj_y5oowzEE',

            //views.assignPrincipal.pc.assign
            ASSIGN:'0x7_7Up6gusoO5t5NulRAm8nH5jR0iCcCiCkKN6-8yx6edw',

            //views.principal.getDecorationInfo
            GET_DECORATION_INFO:'3s-o4KRIubMswqfbDuOMGR_gAwJrK3s5AHcp9r7j9TP0p0C',

            //views.assignPrincipal.exportAssignRecord
            EXPORT_ASSIGN_RECORD: 'x9q5kAS2ihuoPgzzDuQS9yrhwlMN2iBx-5lcSMmeNZKhKswhtT8zSDPvVaJ',
        }
    },
    PERMISSION: {   // 权限服务
        // /biz/t8t-sys-pem/app
        name: 'J5J-hg72eJeCu6b3yeZSjeSrSkaFCXQ',
        methods: {
            // accountRole.listAccountByRole （根据角色查询用户列表）
            LIST_ACCOUNT_BY_ROLE: '-ocFpc5TvUt97p1M6m-d4SZvTnx9aiHqLfiB2nO7Z6S',
            // accountRole.queryByRoleAndOrg (根据角色和组织过来用户)
            QUERY_BY_ROLE_AND_ORG: 'jsnBmRrK0aiGG0ex3nUhdLwyBDN4rlGwfsazDaamunW'
        }
    },
    ACCOUNTSERVER: {  // 账号服务
        // /biz/t8t-sys-acc/app
        name: '0niCG_Xen3AYHkNcxoB1MJLWJ5thqaZ',
        methods: {
            // employee.findByAccountId
            FIND_BY_ACCOUNTID: 'Q_cYWAG7wQS6oQMMnQBAw59G1eV1Ml5Zqfb',

            // organization.queryCityRelation (查询组织绑定的城市)
            QUERY_CITY_RELATION: 'W0FRRT3QIc_3xTS4pxacCwWTzyN00MeUPGeXBAaPT4r'
        }
    },
    FORMULA_SERVER: {
        // /biz/t8t-sys-exp/app
        name: 'JEL7u0JEQHc6sIxzenzp2qEXPxuTQSC',
        methods: {
            // formula.query
            FORMULA_QUERY: 'iKbCndWyfL2ebE3TJa4hDIJ',
            // formula.queryPage
            FORMULA_QUERY_PAGE: '7IuxYNKIkNIxp_9HXYHjD7dq62y'
        }
    },
    SYS_DST: {
        // /biz/t8t-sys-dst/app
        name: 'eKsMx6lL0qjRDhObQyQB3Gxlg00vXSm',
        methods: {
            // standardDistrict.get.byCidList
            GET_BY_CID_LIST: '99ZzDNU1ASaI4PLtiOrYEEW_kbZH7vkMeZ4O2_-M2uW'
        }
    },
    PRS_PQM: {
        // /biz/dsp-prs-pqm/app
        name: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3',
        methods: {
            // views.product.package.query
            LOAD_PRODUCT_INFO: '05p2eQSHejbaBsgrJ7gbOHraesxc2nf4XIyth08'
        }
    },
        PROPERTY: {
            // /biz/t8t-scm-cfg/app
            name: 'R8b7h4AHkMWAu5hFhrksUafEPkyKTyW',
            methods: {
                QUERYP_ROPERTY_UNION: 'VzzwJAbDde1OZIVPsjbnRJIQ-dTF0B1M_AaYQ7t', //property.queryPropertyUnion
            }
        }
}


export default Services
