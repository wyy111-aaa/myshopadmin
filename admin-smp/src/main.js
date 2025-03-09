import { createApp } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from 'pinia'
import piniaPluginPersist  from 'pinia-plugin-persist'

import router from "@/router";

import 'normalize.css'
import '@/assets/css/index.less'
import '@/assets/css/iconfont/iconfont.css'
import '@/assets/css/iconfont/iconfont.js'
import 'element-plus/dist/index.css'

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersist) // 相当于vuex持久化存储

// 遍历ElementPlusIconsVue对象中的所有键值对，并将每个组件注册到Vue应用程序实例
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


app.use(router)
app.use(pinia)

app.mount('#app')
