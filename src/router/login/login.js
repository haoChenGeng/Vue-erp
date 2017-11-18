const Login = resolve => require(['src/views/login/login.vue'], resolve)

const routes = [
    {
        path: '/login',
        meta: { auth: false, title: '登录' },
        component: Login,
    },
]

export default routes
