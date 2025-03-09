import {defineStore} from 'pinia'
import { ElMessage } from 'element-plus'

import {
    getAllCategory,
    addCategory,
    delCategory,
    editCategory
} from '@/service/api/categoryApi.js'

const categoryStore = defineStore('category', {
    state: () => {
        return {
            categoryList: [],
            fatherCategoryList: []
        }
    },
    getters: {},
    actions: {
        // 获取所有类型
        async getAllCategoryList() {
            this.categoryList = []
            this.fatherCategoryList = []
            try {
                let res = await getAllCategory()
                this.categoryList = res.data.list
                this.fatherCategoryList = this.categoryList.map(item => {
                    if (item.levels === 1) return item
                })
            } catch (e) {
                console.log('获取失败')
            }

        },
        // 添加类型
        async addType(info) {
            let flag = false
            try {
                let res = await addCategory(info)
                if (res.code === 200) {
                    flag = true
                    ElMessage({
                        type: "success",
                        message: "添加成功",
                    });
                    this.getAllCategoryList()
                    return flag
                }
            }catch (e) {
                console.log('添加失败')
                flag = false
                return flag
            }
        },

        // 删除
        async delType(id) {
            try {
                let res = await delCategory(id)
                if (res.code === 200) {
                    ElMessage({
                        type: "success",
                        message: "删除成功",
                    });
                    this.getAllCategoryList()
                }
            }catch (e) {
                console.log('删除失败')
            }
        },

        // 添加类型
        async editType(info) {
            let flag = false
            try {
                let res = await editCategory(info)
                if (res.code === 200) {
                    flag = true
                    ElMessage({
                        type: "success",
                        message: "修改成功",
                    });
                    this.getAllCategoryList()
                    return flag
                }
            }catch (e) {
                console.log('添加失败')
                flag = false
                return flag
            }
        },
    },
    persist: {
        enabled: true //开启数据持久化
    }
})


export default categoryStore
