const menuList = [
    {
        id:1,
        icon:'icon-shangpin',
        name:'商品中心',
        url:'/main/product',
        type:1,
        children:[
            { id:11, name:'采购信息',url:'/main/product/purchase',type:2},
            { id:12, name:'商品类别',url:'/main/product/category',type:2},
            { id:13, name:'商品信息',url:'/main/product/goods',type:2},
            { id:14, name:'供应商信息',url:'/main/product/supplier',type:2},
        ]
    },
    {
        id:2,
        icon:'icon-dingdan',
        name:'订单中心',
        url:'/main/orders',
        type:1,
        children:[
            { id:21, name:'订单信息',url:'/main/orders/orderInfo',type:2}
        ]
    },
    {
        id:3,
        icon:'icon-24gl-portraitMaleInfo3',
        name:'用户中心',
        url:'/main/users',
        type:1,
        children:[
            { id:31, name:'用户信息',url:'/main/users/userInfo',type:2},
            { id:32, name:'地址信息',url:'/main/users/address',type:2},
            { id:33, name:'评论信息',url:'/main/users/comments',type:2},
        ]
    },
]

export default menuList
