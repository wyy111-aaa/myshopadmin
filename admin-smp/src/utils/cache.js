class LocalCache{

    /**
     * 设置本地缓存
     * @param key
     * @param value
     */

    // 将键值对存储到浏览器localStorage中
    // key为键的名称，value为键的值
    setCache(key,value){
        // 用JSON.stringify将value转化为json字符串格式存储起来
        window.localStorage.setItem(key, JSON.stringify(value))
    }

    /**
     * 获取缓存
     * @param key
     * @returns {any}
     */
    getCache(key){
        // 用JSON.parse()方法将json字符串格式的val转化为原来格式
        const val = window.localStorage.getItem(key)
        if (val) {
            return JSON.parse(val)
        }
    }

    /**
     * 删除缓存
     * @param key
     */
    // 从浏览器缓存中删除某键值对
    deleteCache(key){
        window.localStorage.removeItem(key)
    }
    // 清空浏览器缓存
    clearCache(){
        window.localStorage.clear()
    }
}


export default new LocalCache()
