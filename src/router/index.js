import { createRouter, createWebHashHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import FrontendLayout from '../components/FrontendLayout.vue'

const backendRoutes = [
    {
        path:'/back',
        redirect:'/back/dashboard',
        component: BackendLayout,
        children: [
            {
                path:'dashboard',
                component: () => import('@/views/dashboard.vue'),
                meta: {
                    title: '数据分析',
                    icon: 'PieChart'
                }
            },{
                path:'knowledge',
                component: () => import('@/views/knowledge.vue'),
                meta: {
                    title: '知识文章',
                    icon: 'ChatLineRound'
                }
            },{
                path:'consultations',
                component: () => import('@/views/consultations.vue'),
                meta: {
                    title: '咨询记录',
                    icon: 'Message'
                }
            },{
                path:'emtional',
                component: () => import('@/views/emtional.vue'),
                meta: {
                    title: '情感分析',
                    icon: 'User'
                }
            }
        ]
    },{
        path:'/auth',
        component: () => import('@/components/AuthLayout.vue'),
        children: [
            {
                path:'login',
                component: () => import('@/views/login.vue'),
                meta: {
                    title: '登录'
                }
            },{
                path:'register',
                component: () => import('@/views/register.vue'),
                meta: {
                    title: '注册'
                }
            }
        ]
    }
]

const frontendRoutes = [
    {
        path:'/',
        component:FrontendLayout,
        children: [
            {
                path:'',
                component: () => import('@/views/home.vue')
            },{
                path:'consultation',
                component: () => import('@/views/consultation.vue')
            },{
                path:'emotionDiary',
                component: () => import('@/views/emotionDiary.vue')
            },{
                path:'knowledge',
                component: () => import('@/views/frontendKnowledge.vue')
            },{
                path:'knowledge/article/:id',
                component: () => import('@/views/articleDetail.vue'),
                props: true
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        ...backendRoutes,
        ...frontendRoutes
    ]
}) 
// 路由守卫
// 检查用户是否登录
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if(token){
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if(userInfo.userType == 2){
            if(to.path.startsWith('/back')){
                next()
            }else{
                next('/back/dashboard')
            }
        }else if (userInfo.userType == 1){
            // 添加对 userType == 1 的处理
            if(to.path.startsWith('/back') || to.path.startsWith('/auth')){
                next('/')
            }else{
                next()
            }
        } 
    }else{
        if(to.path.startsWith('/back')){
            next('/auth/login')
        }else{
            next()
        }
    }
})

export default router
