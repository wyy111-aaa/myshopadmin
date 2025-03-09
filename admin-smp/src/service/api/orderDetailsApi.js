import spmRequest from "@/service/index.js";

const orderDetailsApi = {
    allOrder:'/common/ordersList',
    updateOrder:'/common/orderList/edit'
}

export function getAllOrder(info) {
    return spmRequest.post({
        url:orderDetailsApi.allOrder,
        data:info
    })
}

export function updateOrderInfo(info) {
    return spmRequest.post({
        url:orderDetailsApi.updateOrder,
        data:info
    })
}

