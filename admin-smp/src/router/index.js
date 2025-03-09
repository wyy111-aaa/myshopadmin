import {createRouter,createWebHashHistory} from 'vue-router'
import {firstMenu} from "@/utils/mapMenu.js";
import localCache from '@/utils/cache.js'

const routes = [
    {
        path: '/',
        redirect: '/main'
    },
    {
        path: '/login',
        name:'login',
        component:()=>import('@/pages/login/index.vue')
    },
    {
        path: '/main',
        name: 'main',
        component: () => import('@/pages/main/index.vue'),
        children: [
            {
                path: '/main/product',
                name: 'product',
                children:[
                    {
                        path: '/main/product/purchase',
                        name:'purchase',
                        component:()=>import('@/pages/product/purchase/index.vue')
                    },
                    {
                        path: '/main/product/category',
                        name:'category',
                        component:()=>import('@/pages/product/category/index.vue')
                    },
                    {
                        path: '/main/product/goods',
                        name:'goods',
                        component:()=>import('@/pages/product/goods/index.vue')
                    },
                    {
                        path: '/main/product/supplier',
                        name:'supplier',
                        component:()=>import('@/pages/product/supplier/index.vue')
                    },
                ]
            },
            {
                path: '/main/orders',
                name: 'orders',
                children:[
                    {
                        path: '/main/orders/orderInfo',
                        name:'orderInfo',
                        component:()=>import('@/pages/orders/orderInfo/index.vue')
                    },
                ]
            },
            {
                path: '/main/users',
                name: 'users',
                children:[
                    {
                        path: '/main/users/userInfo',
                        name:'userInfo',
                        component:()=>import('@/pages/users/userInfo/index.vue')
                    },
                    {
                        path: '/main/users/address',
                        name:'address',
                        component:()=>import('@/pages/users/address/index.vue')
                    },
                    {
                        path: '/main/users/comments',
                        name:'comments',
                        component:()=>import('@/pages/users/comments/index.vue')
                    },
                ]
            },
        ]
    },
    {
        // 捕获任何不存在路径，转入notFound页面
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: () => import('@/pages/not-found/not-found.vue')
    }
]



const router = createRouter({
    routes,
    history:createWebHashHistory()
})

// 全局前置守卫
router.beforeEach((to)=>{
    // 如果目标路由不是'/login',则从缓存中获取token,如果没有token,则进入页面'/login'
    if (to.path !== '/login') {
        const token = localCache.getCache('token')
        if (!token) {
            return '/login'
        }
    }
    // 如果目标路由为'/main'，则进入firstMenu的路由，结束全局守卫前置
    if (to.path === '/main') {
        return firstMenu.url
    }
})

export default router
