import {defineStore} from 'pinia'
import localCache from '@/utils/cache.js'
import router from "@/router/index.js";

import {
    accountLoginRequest,
    requestUserInfo,
} from '@/service/api/loginApi.js'

const loginStore = defineStore('login',{
    state: () => {
        return {
            token: '',
            userInfo: {},
        }
    },
    getters: {},
    actions: {
        async accountLogin(payload) {
            // 登录逻辑
            const loginResult = await accountLoginRequest(payload)

            const { id, token } = loginResult.data
            this.token = token
            localCache.setCache('token', token)

            // 获取用户信息
            const userInfoResult = await requestUserInfo(id)
            const userInfo = userInfoResult.data
            this.userInfo = userInfo
            localCache.setCache('userInfo', userInfo)

            // 跳转首页
            router.push('/main')
        }
    },
    persist:{
        enabled:true //开启数据持久化
    }
})


export default loginStore
