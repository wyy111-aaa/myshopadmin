export  let colLayout = {
    xl: 6, // >1920px 4个
    lg: 8,
    md: 12,
    sm: 24,
    xs: 24
}

export let labelWidth = '100px'

export let itemStyle = { padding: '5px 30px' }

// 1已下单，未支付，2已支付3 已发货，4已确认收货，5已评价，6取消订单，7 过期
export const statusList = [
    {id:1,name:'未支付',status:1},
    {id:2,name:'待发货',status:2},
    {id:3,name:'待收货',status:3},
    {id:4,name:'待评价',status:4},
    {id:5,name:'已评价',status:5},
    {id:6,name:'取消订单',status:6},
    {id:7,name:'订单过期',status:7},
]

export const saleList = [
    {id:1,name:'否',status:0},
    {id:2,name:'是',status:1},
]
