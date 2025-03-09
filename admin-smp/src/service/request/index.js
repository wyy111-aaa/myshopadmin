import axios from "axios";
// loading
import { ElLoading } from 'element-plus'

const IS_SHOW = true

class SPMRequest{
    instance
    interceptors
    showLoading
    loading


    constructor(config){

        this.instance = axios.create(config)
        this.showLoading = config.showLoading ?? IS_SHOW
        this.interceptors = config.interceptors


        // 请求拦截
        this.instance.interceptors.request.use(
            this.interceptors?.requestInterceptor,
            this.interceptors?.requestInterceptorCatch
        )

        this.instance.interceptors.response.use(
            this.interceptors?.responseInterceptor,
            this.interceptors?.responseInterceptorCatch
        )

        // 2.添加所有的实例都有的拦截器
        this.instance.interceptors.request.use(
            (config) => {
                if (this.showLoading) {
                    this.loading = ElLoading.service({
                        lock: true,
                        text: '正在请求数据...',
                        background: 'rgba(0,0,0,0.5)'
                    })
                }
                return config
            },
            (err) => {
                return err
            }
        )

        this.instance.interceptors.response.use(
            (res) => {
                // 移除 loading
                this.loading?.close()

                const data = res.data
                if (data.returnCode === '-1001' || data.code === 500) {
                    console.log('请求失败')
                } else {
                    return data
                }
            },
            (err) => {
                // 移除 loading
                this.loading?.close()

                if (err.response.status === 404) {
                    console.log('404 错误')
                }
                return err
            }
        )

    }

    // 重新写 request 方法
    request(config){
        return new Promise((resolve, reject) => {

            if (config.interceptors?.requestInterceptor) {
                config = config.interceptors.requestInterceptor(config)
            }

            if (config.showLoading === false) {
                this.showLoading = config.showLoading
            }

            this.instance
                .request(config)
                .then(res=>{
                    if (config.interceptors?.responseInterceptor) {
                        res = config.interceptors.responseInterceptor(res)
                    }
                    resolve(res)
                    // 将 loading 设置为 true,不影响下一个请求
                    this.showLoading = IS_SHOW
                })
                .catch((err) => {
                    this.showLoading = IS_SHOW
                    reject(err)
                    return err
                })
        })

    }

    get(config){
        return this.request({ ...config, method: 'GET' })
    }
    post(config) {
        return this.request({ ...config, method: 'POST' })
    }
    patch(config){
        return this.request({ ...config, method: 'PATCH' })
    }
    put(config){
        return this.request({ ...config, method: 'PUT' })
    }
    delete(config){
        return this.request({ ...config, method: 'DELETE' })
    }
}


export default SPMRequest
