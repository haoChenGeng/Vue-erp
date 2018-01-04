// 历史文件，不要在这里加东西了 新接口写在src/services里
let Services = {
	// 账号服务
	ACCOUNT: {
		// /biz/to8to-it/app.account
		name: 'YyYgrrI-qso7p9vEezqRHuYW37hhXyU0-c8o6KN',
		methods: {
			// account相关
			// account.login
			//LOGIN: 'NMDtf8eMjm2vxjQ7iTtfWF1',

            // views.user.login
            LOGIN: 'BaKVOtIClYCLEYCHaQPY_NPFwgx',
			// account.findById
			AC_FIND_BY_ID: 'rsgo1AdIwBKC97fdMtq9pcvTFna',
			// account.changePassword
			CHANGE_PASSWPRD: 'unfK9MoTBiaF-YrR99Ymmpp0VyJiWBy5hik',
			// org相关
			// organization.queryTree
			ORG_TREE: 'pG9Z2VOEhahU-kS2rS3SDonYC2NSBhYUfKK',
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
            //organization.queryCityRelation
            ORG_QUERY_CITY_RELATION: '9ZZDp1I7s1pE20LRo2aSX7UnlKv-F3Ct5ZB5UoRpjfQ',
            //organization.assignCity
            ORG_ASSIGN_CITY: 'ePe_lda-tl6g8xpYAh9Y20LE9sfpRw5xisX'
		}
	},
	// 权限服务
	PERM: {
		// /biz/to8to-it/app.tit-permission
		name: 'tVAwAOCV3m-nXnVtrjEqhWW-lSQAXX_N0fXcAvQEbCjSbcz',
		methods: {
			// account.checkPermission
			CHECK_PERMISSION: '3Hq_6VLFGePwtU420T2WsENDRI6n9bqJqpe',
			// account.listMenuTree
			LIST_MENU_TREE: 'ZtSdg1q5ZGgWK9uXd5Vomv0ajBbasiD',
			// permission.listByAccountID
			LIST_BY_UID: 'PqHpL5InOYZUPGbR_64Cn0Zcx7ZnZBh_Keo221g',
			// permission.listByAccountIDAndFatherUrl
			LIST_BY_ACCOUNTID_FATHERURL: 'DvW-av7KZ9YcNPEGgA-peb5QNCV9bzQD-Zd27llt34vB_lN-9q7EGZk'
		}
	},
	CONFIGURE: {
		// /biz/to8to-it/app.tit-configure
		name: 'OnLYil9jY0PiKilsavskNJvygGUxhME7eLPWccmGmYjb_ED',
		methods: {
			// systemCode.list
			SYS_CODE_LIST: 'vPnFi_QA4HeBWeU61ZjQPCn'
		}
	},
	// 财务模块
	DEBITCHANNEL: {
		// /biz/t8t-fi-fcm/app
		name: 'Q2VkTJ8qT30vdX2QPHDE2YqRvb2tfMp',
		methods: {
			// debitChannel.create
			CREATE: 'N8LxpSi9bJT-PkTue0QuVmPMMskaGl5',
			//debitChannel.update
			UPDATE: 'sZan4wrmKzZbGy9dwl7cDsLKKtlHIiZ',
			// debitChannel.queryPage
			PAYMETHOD_QUERY: 'fKfmTjLLnPN6TtgmTQtKP7dhNygAN0yiYM4',
			// debitChannel.status.update
			STATUSUPDATE: 'VBPLAUJ-A_56nUQO_TGk2wTR6bLZq0bV6KaH_77',
			// debitType.queryPage
			DEBITTYPE_QUERYPAGE: 'TS8-ZWQ9OdQ5cySscBWVGzKv8jS86f_',
			// debitType.create
			DEBITTYPE_CREATE:'VxDUZSSR_JDBQ1jKrXWEwWP34b7',
			// debitType.update
			DEBITTYPE_UPDATE:'kgjt0zqkiomgbAYGi94ok_zeLla',
			// batchDebitType.status.update
			BATCHDEBITTYPE_STATUS_UPDATE: 'VeyxFyf_B-0Sct9yoG6F-rUkOOZFQbzS-vBy-eY694l',
			//款项用途
			//fundPurpose.create
			FUNDPERPOSE_CREATE: 'tpsDqe9VHId3UHyOVzoHc5aumF2',
			//fundPurpose.queryPage
			FUNDPERPOSE_QUERY_PAGE: 'DQNVB8paXc5mUeq9rVAJPFfM4NP-CZg',
			//fundPurpose.status.update
			FUNDPERPOSE_STATUS_UPDATE: 'j1e_lWXL_rk_6qwfF7pELrrQ-m_dxf_WEQCTbNN',
			//batchfundPurpose.status.update
			FUNDPERPOSE_BATCH_STATUS_UPDATE: 'YnHgGhvqOnZT0RR1UhwXxqzaUlhIzGwaS5rLWwfDERm',
			//fundPurpose.update
			FUNDPERPOSE_UPDATE: 'ivqDuHNXKnxYeM5Ua1j1Jtgsm.6'
		}
	},
	DEBITWAYDISTRIBUTION: {
		// /biz/t8t-fi-fcm/app
		name: 'Q2VkTJ8qT30vdX2QPHDE2YqRvb2tfMp',
		methods: {
			// debitWayDistribution.queryPage
			QUERYPAGE: 'idi9-z2w02vyNl3pP3ux8r07ksC6VVM0kew8DArjtm8',
			// debitWayDistribution.status.update
			STATUSUPDATE: 'xerGiv_ov8vMo-A1YJMd-61t1-DNQS10e1FGv5gxAtIvqacwokY',
			//batchDebitWayDistribution.status.update
			BATCHSTATUSUPDATE: 'ga8T2Q64WHHjOTdR4hslWHxQuTqeLM_VQZjOmE6f8NoUZEySaLciLFY',
			// debitWayDistribution.create
			CREATE_ALLOT: 'SFNdVAMSVOMkDZOIXuWeNbcPLMkExzrPeIkPSLf',
			// debitWayDistribution.update
			UPDATE_ALLOT: '8rpI7-iA89aIWDAgwJy57FCr3KCHmhSD6TNBqm7'
		}
	},
    //基础资料
    BASEDATA:{
	    // /biz/t8t-scm-mdm/app
        name: '4kFXbl6g-G2AbInKo7VyRJOreftEsow',
        methods: {
            // goods.queryShopTreeByGroup  供应商树信息
            QUERYSHOPTREE: 'QsyoL-.BUNLHcCLI7494xnGL8CXQJvqFpAVB6lj',
            // goods.queryGoodsTreeByGroup  商品数信息
            QUERYGOODSTREE: '0RmGFxzZLG7B4N_e8IQY_3.6eoeD9AxN65OBRsd',
        }
    },
    // 新账户服务
    NEWACCOUNT: {
        // /biz/t8t-sys-acc/app
        name: 'PpKvmV96W9EfRrok8WJnLzDepPHXGbI',
        methods: {
            // account.checkCertificate
            CHECK_CERTIFICATE: 'JynA0lEHJgqP3wh-7PDP-W4BuCHV-PN2I9C',
        }

    }
}

export default Services
