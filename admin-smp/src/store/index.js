import systemStore from "@/store/module/system.js";
import loginStore from "@/store/module/login.js";
import goodsBuyStore from "./module/goodsBuy.js";
import goodsStore from './module/goods.js';

import supplierStore from './module/supplier.js'
import userStore from './module/user.js'

import addressStore from '@/store/module/address.js'
import commentsStore from '@/store/module/comments.js'

import categoryStore from "@/store/module/category.js";
import orderDetailsStore from "@/store/module/orderDetails.js";


// 模块化管理，在这里使用 goodsBuy:goodsBuyStore(名称实例)

export default function useStore() {
    return {
        system:systemStore(),
        login:loginStore(),
        goodsBuy:goodsBuyStore(),
        goods:goodsStore(),
        category:categoryStore(),
        suppier:supplierStore(),
        user:userStore(),
        address:addressStore(),
        comments:commentsStore(),
        orderDetails:orderDetailsStore()
    }
}
