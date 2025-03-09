import spmRequest from "@/service/index.js";

const categoryApi = {
    allCategory:'/common/typeList',
    typeListDdd:'/common/typeList/add',
    typeDel:'/common/type/',
    typeEdit:'/common/typeList/edit'
}

export function getAllCategory() {
    return spmRequest.get({
        url:categoryApi.allCategory,
    })
}

export function addCategory(info) {
    return spmRequest.post({
        url:categoryApi.typeListDdd,
        data:info
    })
}

export function delCategory(id) {
    return spmRequest.delete({
        url:categoryApi.typeDel + id
    })
}

export function editCategory(info) {
    return spmRequest.post({
        url:categoryApi.typeEdit,
        data:info
    })
}
