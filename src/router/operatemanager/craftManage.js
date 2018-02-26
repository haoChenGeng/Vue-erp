/**
 * Created by terry.hao on 2018/1/28.
 * 工艺列表，创建工艺，编辑工艺，查看工艺
 */
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const CraftList = resolve => require(['src/views/m-operatemanager/craft-manage/craft-list.vue'], resolve)
const CraftCreate = resolve => require(['src/views/m-operatemanager/craft-manage/craft-create.vue'], resolve)
const CraftEdit = resolve => require(['src/views/m-operatemanager/craft-manage/craft-edit.vue'], resolve)
const CraftView = resolve => require(['src/views/m-operatemanager/craft-manage/craft-view.vue'], resolve)
const routes = [{
    path: '/tuchat-craft-manage',
    component: Console,
    children: [
        { path: 'craft-manage', component: CraftList, meta: { isFulldialog: false, title: '工艺展示' } },
        { path: 'craft-create', component: CraftCreate, meta: { isFulldialog: true, title: '创建工艺' } },
        { path: 'craft-edit', component: CraftEdit, meta: { isFulldialog: true, title: '编辑工艺' } },
        { path: 'craft-view', component: CraftView, meta: { isFulldialog: true, title: '查看工艺' } }
    ]
}]

export default routes