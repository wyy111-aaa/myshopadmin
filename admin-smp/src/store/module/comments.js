import {defineStore} from 'pinia'
import { ElMessage } from 'element-plus'
import {
    getAllComments,
    deleteCommentsInfo,
} from '@/service/api/commentsApi.js'

const commentsStore = defineStore('comments',{
    state: () => {
        return {
            commentList:[]
        }
    },
    getters: {},
    actions: {
        // 获取评论信息
        async getAllCommentList(info){
            this.commentList = []
            let res = await getAllComments({...info})
            if(res.code === 200){
                this.commentList = res.data.list
            }
        },
        // 删除评价
        async deleteComments(ids){
            let flag = false
            try {
                let res =await deleteCommentsInfo(ids)
                if(res.code === 200){
                    ElMessage({
                        type: "success",
                        message: "删除成功",
                    });
                    flag = true
                    this.getAllCommentList({})
                    return flag
                }
            }catch (e) {
                flag = false
                ElMessage({
                    type: "error",
                    message: "删除失败",
                });
                return flag
            }

        }
    },
    persist:{
        enabled:true //开启数据持久化
    }
})


export default commentsStore
