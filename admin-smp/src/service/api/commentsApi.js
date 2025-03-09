import spmRequest from "@/service/index.js";

const commentsApi = {
    allComments:'/common/commentsList',
    deleteCommentsByIds:'/common/delete/comments'
}

// 获取评论信息
export function getAllComments(info) {
    return spmRequest.post({
        url:commentsApi.allComments,
        data:info
    })
}

// 删除评论信息
export function deleteCommentsInfo(ids) {
    return spmRequest.post({
        url:commentsApi.deleteCommentsByIds,
        data: {ids:ids}
    })
}

