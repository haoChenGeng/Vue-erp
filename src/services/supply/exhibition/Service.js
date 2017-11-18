// 供应链管理模块
let Services = {
    exhibition: {
        // /biz/supply-chain/app.supply-server
        name: 'o8fvjnGOxxL5gkOp0sQMo-gs-0dgcElxW-4jMIA4ZS5vdO7iyca',
        methods: {
            //views.inv.exh.apply.queryPageOrder   上样单列表查询
            queryList: 'ZfHMfIe49ZV9x0Kf-3EC-hdVu7XF-ksEOTxX-ALVeRIDg8MIL7n',
            //views.inv.exh.apply.submitOrders 列表页上样单批量提交接口
            submitOrder:'GfdgVbEkORwxHZMpfW2hKV_8kCKvnYNEpNO49LQO6eUdiEk',
            //views.inv.exh.apply.cancelOrder  批量上样单整单取消
            cancelOrder:'38NPCkxDxwmNgF_6jEYd7yvrRL3O6yDQ4yN7ic5yKr7EKlt',
            //views.inv.storage.findManagerByGroupId    查询仓库分组下面非禁用已生效的首个收货仓库信息
            findManagerByGroupId:"NWDRFj6LHzSUn8D8iLjlkRJUAWFUCb2fmS3VzXFBy5y8AFeJUCNtHBc",
            //views.inv.exh.apply.queryDetail  根据id查看单详情信息
            findOrderById:"mqvrn6W5fLvrPvNwl6U9qgRH2hcE2SMK2nMJtwVKOtlGKDS",
            //views.inv.exh.apply.cancelItem  上样单取消行
            cancelItems:"JK_7EexUBvQQh99lHZaeNAhXTF3gfKxtT56w-e20rBR",
            //views.inv.exh.apply.export   上样单列表数据导出
            export:'QWUJRYtgK1oYAc1L_b-5YUM2lg0_zrV92jkSHzk',
            //views.inv.exh.apply.delOrderByIds  上样单删除
            deleteOrder:'HR_Q5n3M0vVP3CdyWKfhLHhsIO9X-yNyK74DOvV5MzksBtj',
            //views.inv.exh.apply.createSave
            createSave:"lSvrnT6QycLs_QxY9h_KxpBlNDihW9lRZemoJaagPhu",
            //views.inv.exh.apply.createSubmit
            createSubmit:"z68NGfkTBqRYjKqixW_hh3wepVGqeKw-35BbS_qx-fBx_5o",
            //views.inv.exh.apply.updateSave
            updateSave:"wqW7_j6mAytK6h6rJssGP0gdfbyhsLNzXV3xcmlctsp",
            //views.inv.exh.apply.updateSubmit
            updateSubmit:"wJ0LtVc-6neMJpp17K5hN0_Wn88iJVtrk_ss5ny8qcQp9ge",
             //views.inv.exh.apply.completeWorkFlow  审核提交  
            completeWorkFlow:"kudhgY_WlkfBtCxfvUM2Cok_9nmcwtk-sn.mQMujek3UioOl9HA",
            //views.inv.exh.apply.getWkfCheckStream   审批流查看  
            showFlow:"AVbWHMZuPO4Nul_VDtQyqEL4jbA0arbQMALJkO5K34SLX8W-HJYQ_0v",
            //views.inv.exh.apply.queryDispatchPageOrder  样品调度列表
            queryDispatchPageOrder:"ZmlfYv1ZUN_i23Xe-mY61dcH7knW7krG_VeW9_nUz9hdAIg9x_QCUpqC0Tq",
            //views.inv.exh.apply.queryDispatchDetail  样品调度明细
            queryDispatchDetail:"5D47C1Nr5mshWAoEhPwfX95deE0xE9ozfP8go_5Vd-zjlC-wRh_1gCK",
            //上样撤样列表  views.inv.exh.apply.queryUpDownPageOrder
            queryUpDownPageOrder:"u227zuLg98wVGIckY4rSIysdP9ymIHcjnDcYVBhVOHxzS1tFrOp4ijfgrRQ",
            //上样撤样详情   views.inv.exh.apply.queryUpDownDetail
            queryUpDownDetail:"jvdsivCmQPq8vWvg8OLAnl_IxWIxnWZO9ngZkaENDATlrWdT-7ie5LJ",
           // queryUpDownDetail:"KVTDMnZV8b5jIMCGpalUdfL0PoAHxWN4-JoK4fiPXKd_kEp4CGg",
            //转样品调拨 views.inv.exh.apply.applyTransitionAllocate
            applyTransitionAllocate:"-DOTX6VAgLKqm9VJunM1XC51zJ8GrSQ4xeNJAkL0aQIJuHP_oq1M2jeMl3n3xdu",
            //撤样操作详情   views.inv.exh.apply.downApplyDetail
            downApplyDetail:"JhRVamKyYXT107XXkI_7nNXzx5pNQ9iYzbeBZteY1R_FHOQYau9",
            //上样操作详情   views.inv.exh.apply.upApplyDetail
            upApplyDetail:"AdXYCv_nSKqu8IQJpj8lzET50RWFytQ19h-6Oib0A4rKJKk",
            //上样提交 views.inv.exh.apply.upApply
            upApply:"d10zypYZ32iACRqGLwS4iH5qVO4_fCRoNgP8hLX",
            //撤样提交 views.inv.exh.apply.downApply
            downApply:"KkRTbx4bGCmmf2QAzXLs6OazvqY-mQHkGZ6C8tFIXR-"

        }
    },
    organization: {
        //  /biz/t8t-sys-acc/app
        name: 'CsxicaQ7wM_3kaiMdGJQAaOa2fUF8v-',
        methods: {
            // organization.query
            query: 'DOiN6_9fU1yNwZE_gRuTrdwwvEg',
        }
    }
}

export default Services
