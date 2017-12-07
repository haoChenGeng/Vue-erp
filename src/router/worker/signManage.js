// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const SignManage = resolve => require(['src/views/m-worker/solution/sign-manage/sign-manage.vue'], resolve)
const SignManageAdd = resolve => require(['src/views/m-worker/solution/sign-manage/sign-manage-add.vue'], resolve)
const SignManagePreview = resolve => require(['src/views/m-worker/solution/sign-manage/agreenment-preview.vue'], resolve)

const routes = [{
    path: '/tochat-worker',
    component: Console,
    children: [
        { path: 'sign-manage', meta: { title: '签约管理',isFulldialog:false }, component: SignManage },

        { path: 'sign-manage/add', meta: { title: '签约管理--新增',isFulldialog:true }, component: SignManageAdd},

        { path: 'sign-manage/preview', meta: { title: '签约管理--预览',isFulldialog:true }, component: SignManagePreview }
    ]
}]

export default routes
