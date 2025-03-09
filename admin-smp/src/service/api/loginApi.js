import spmRequest from "@/service/index.js";

const loginApi = {
    accountLogin: '/login',
    loginUserInfo: '/login/user/'
}

// 登录接口
export function accountLoginRequest(account) {
    return spmRequest.post({
        url:loginApi.accountLogin,
        data:account
    })
}

// 获取用户信息
export function requestUserInfo(id){
    return spmRequest.get({
        url:loginApi.loginUserInfo  + id,
        showLoading: false
    })
} 
