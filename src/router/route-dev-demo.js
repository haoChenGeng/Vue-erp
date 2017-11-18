// 可以根据此文件内容新建route-dev.js  此文件不要删除，不要更改

// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
// 这里配置开发时用到的路由，保存代码到生效的时间可由10s减少到1s内
// 例子
// const permission = resolve => require(['src/views/m-system/page-permission-manager/page-perm-mgt.vue'], resolve)

const routes = [
    // {
    //     path: '/system',
    //     component: Console,
    //     children: [
    //         {path: 'permission', meta: { isFulldialog: false, title: '权限管理'}, component: permission}
    //     ]
    // }
]

export default routes
