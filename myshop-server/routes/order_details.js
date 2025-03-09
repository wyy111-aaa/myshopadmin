var express = require('express');
const dbUtils = require('../utils/DBUtils.js');
const getOrderListData = require('../utils/getOrderListData.js')
const orderCode = require('../utils/orderCode.js')
var router = express.Router();

// 引入中间件
let auth = require('../utils/auth.js')



// 获取公共订单列表 {offset:0,size:10} (当前第几页数，分页数量)
router.post('/commonOrdersList', auth, async (req, res) => {
  let {
    offset,
    size
  } = req.body
  offset = Number(offset)
  size = Number(size)
  try {
    let total = 0
    let numList = await dbUtils.executeSql(orders.ordersCommonListNum, '')
    let list = await dbUtils.executeSql(orders.ordersCommonList, [offset, size])

    if (numList.length > 0) total = numList.total

    res.send({
      code: 200,
      data: {
        total: total,
        list: list
      }
    })
  } catch (err) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '获取失败'
    })
  }
})

// 查询 订单条数
router.get('/getTotal', auth, async (req, res) => {

  let id = req.user.uid
  let type = 'gain'

  try {

    // 未支付
    let dueList = await dbUtils.executeSql(orders.orderList(type, 1, id), '')
    let dueTotal = 0
    if (dueList.length > 0) {
      dueTotal = getOrderListData(dueList).length
    }


    // 已支付未发货
    let paidList = await dbUtils.executeSql(orders.orderList(type, 2, id), '')
    let paidTotal = 0
    if (paidList.length > 0) {
      paidTotal = getOrderListData(paidList).length
    }

    // 已发货未接收
    let shippedList = await dbUtils.executeSql(orders.orderList(type, 3, id), '')
    let shippedTotal = 0
    if (shippedList.length > 0) {
      shippedTotal = getOrderListData(shippedList).length
    }


    // 已收货货未评价
    let evaluateList = await dbUtils.executeSql(orders.orderList(type, 4, id), '')
    let evaluateTotal = 0
    if (evaluateList.length > 0) {
      evaluateTotal = getOrderListData(evaluateList).length >= 6 ? 6 : getOrderListData(evaluateList).length
    }

    res.send({
      code: 200,
      data: {
        dueTotal: dueTotal,
        paidTotal: paidTotal,
        shippedTotal: shippedTotal,
        evaluateTotal: evaluateTotal
      }
    })

  } catch (e) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '获取失败'
    })
  }

})


// 查询订单数据 数据传入 json格式 {type:'all'....}
// 规范传入数据 {type:"all",status:0} {type:"gain",status:x} {type:"afterSale",status:0}
router.post('/list', auth, async (req, res) => {

  let id = req.user.uid

  let {
    status,
    type
  } = req.body

  // type： all 全部订单信息，gain 获取（待付款,待发货，待收货）afterSale 售后
  try {
    let dataList = await dbUtils.executeSql(orders.orderList(type, status, id), '')
    let dataArray = []

    if (dataList.length > 0) {
      dataArray = getOrderListData(dataList)
    } else {
      dataArray = []
    }

    res.send({
      code: 200,
      data: dataArray
    })
  } catch (e) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '获取失败'
    })
  }
})

// 根据 订单号 删除
router.delete('/:orderNO', auth, async (req, res) => {
  let orderNO = req.params.orderNO

  try {
    let flag = await dbUtils.executeSql(orders.orderNoDelete, [orderNO])

    if (flag) {
      res.send({
        code: 200,
        status: true,
        msg: '删除成功'
      })
    } else {
      res.send({
        returnCode: "-1001",
        status: false,
        msg: '删除失败'
      })
    }

  } catch (e) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '删除失败'
    })
  }

})

// 根据 cid 删除
// 删除购物车商品 ids 是id 数组(json 格式传入{ids:[1,2]})
router.post('/delete/orders', auth, async (req, res) => {
  let {
    ids
  } = req.body

  let arr = [...ids]
  if (arr.length <= 0) return

  try {

    let str = arr.join(',')
    let deleteVal = await dbUtils.executeSql(orders.orderCidDelete(str), '')

    if (deleteVal) {
      res.send({
        code: 200,
        status: true,
        msg: '删除成功'
      })
    } else {
      res.send({
        returnCode: "-1001",
        status: false,
        msg: '删除失败'
      })
    }
  } catch (e) {
    res.send({
      returnCode: "-1001",
      status: false,
      errMsg: "删除失败"
    })
  }

})

// 订单号生成
router.get('/orderCode', auth, async (req, res) => {
  try {
    let code = orderCode()
    res.send({
      code: 200,
      orderCode: code
    })
  } catch (e) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '获取失败'
    })
  }
})

// 购物车购买商品生成订单
// goodsList 数组对象 传入格式（json）
// [{ shopCartId:xxx,gid: xx, price: xx, num: xx, order_no: xx, status: xx, address_id: xx, remark: xxx }] status:只传 1已下单，未支付； 2：已支付
// isPay:true
router.post('/add', auth, async (req, res) => {
  let {
    goodsList,
    isPay
  } = req.body

  let userId = req.user.uid

  let ids = []
  goodsList.forEach(item => {
    ids.push(item.shopCartId)
  });

  try {

    let flag = await dbUtils.executeSql(orders.ordersAdd(goodsList, isPay, userId), '')

    if (flag) {

      // 清理购物车商品
      let str = ids.join(',')
      await dbUtils.executeSql(orders.shopCartDeleteSql(str), '')

      res.send({
        code: 200,
        status: true,
        msg: '添加成功'
      })
    } else {
      res.send({
        returnCode: "-1001",
        status: false,
        msg: '添加失败'
      })
    }

  } catch (e) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '添加失败'
    })
  }
})


// 修改订单信息
// type 类型：（必传）
//           pay 支付；shipments 发货；Receive 收货；
//           appraise：评价，afterSale 申请售后；
//           Cancel:取消订单；expired 过期；address:修改地址
// status 修改状态,根据数据库修改
// remark 备注
// orderNo 订单号
// reason 原因

router.post('/ordersUpdate', auth, async (req, res) => {
  let {
    type,
    orderNo,
    status,
    remark,
    reason,
    addressId
  } = req.body

  if (!type || !orderNo) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '请选择修改状态类型或选择商品'
    })
    return
  }

  try {

    let flag = await dbUtils.executeSql(orders.ordersUpdate(type, orderNo, status, reason, addressId, remark), '')

    if (flag) {
      res.send({
        code: 200,
        status: true,
        msg: '修改成功'
      })
    } else {
      res.send({
        returnCode: "-1001",
        status: false,
        msg: '修改失败'
      })
    }

  } catch (e) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '修改失败'
    })
  }



})


// 根据 cid 修改数据（必传参数 gid price num order_no uid status address_id ）
router.patch('/:id', auth, async (req, res) => {
  let id = req.params.id
  let {
    gid,
    price,
    num,
    paytime,
    order_no,
    uid,
    status,
    after_sale,
    address_id,
    remark,
    reason
  } = req.body

  try {
    let updateOrders = await dbUtils.executeSql(orders.orderUpdateById, [gid, price, num, paytime, order_no, uid, status, after_sale, address_id, remark, reason, id])

    if (updateOrders) {
      res.send({
        code: 200,
        status: true,
        msg: '修改成功'
      })
    } else {
      res.send({
        returnCode: "-1001",
        status: false,
        msg: '修改失败'
      })
    }

  } catch (e) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '修改失败'
    })
  }
})


const orders = {

  // 查询所有
  orderList: (type, status, userId) => {
    let sql = ''
    switch (type) {
      case 'all':
        sql = `
        SELECT
        o.cid, a.uname, a.phone, a.address,
        g.gid,
        g.goodsname, g.imgs, g.description,
        t.typename,
        o.price, o.num,
        DATE_FORMAT(o.paytime, '%Y-%m-%d %H:%i:%s') as paytime,
        DATE_FORMAT(o.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(o.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at,
        o.order_no,
        o.status, o.after_sale, o.remark,o.reason
        FROM order_details o
        LEFT JOIN address a
        ON o.address_id = a.address_id
        LEFT JOIN goods g
        ON g.gid = o.gid
        LEFT JOIN type t
        ON g.tid = t.tid
        WHERE o.uid = '${userId}'
        ORDER BY o.created_at ASC
        `
        break;
      case 'gain':
        sql = `
        SELECT
        o.cid, a.uname, a.phone, a.address,
        g.gid,
        g.goodsname, g.imgs, g.description,
        t.typename,
        o.price, o.num,
        DATE_FORMAT(o.paytime, '%Y-%m-%d %H:%i:%s') as paytime,
        DATE_FORMAT(o.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(o.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at,
        o.order_no,
        o.status, o.after_sale, o.remark,o.reason
        FROM order_details o
        LEFT JOIN address a
        ON o.address_id = a.address_id
        LEFT JOIN goods g
        ON g.gid = o.gid
        LEFT JOIN type t
        ON g.tid = t.tid
        WHERE o.uid = '${userId}'
        AND o.status = '${status}'
        ORDER BY o.created_at ASC
        `
        break;
      case 'afterSale':
        sql = `
        SELECT
        o.cid, a.uname, a.phone, a.address,
        g.gid,
        g.goodsname, g.imgs, g.description,
        t.typename,
        o.price, o.num,
        DATE_FORMAT(o.paytime, '%Y-%m-%d %H:%i:%s') as paytime,
        DATE_FORMAT(o.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(o.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at,
        o.order_no,
        o.status, o.after_sale, o.remark,o.reason
        FROM order_details o
        LEFT JOIN address a
        ON o.address_id = a.address_id
        LEFT JOIN goods g
        ON g.gid = o.gid
        LEFT JOIN type t
        ON g.tid = t.tid
        WHERE o.uid = '${userId}'
        AND o.after_sale = '1'
        ORDER BY o.created_at ASC
        `
        break;
    }
    return sql
  },

  // 删除订单 orderon
  orderNoDelete: `DELETE FROM order_details WHERE order_no = ?`,



  // 批量删除订单 cid
  orderCidDelete: (str) => `DELETE FROM order_details WHERE cid in (${str})`,

  ordersAdd: (goodsList, isPay, userId) => {
    if (isPay) {

      let sql = `
        INSERT INTO order_details
        (gid, price, num, paytime, created_at, order_no, uid, status,
        after_sale, address_id, remark) VALUES`

      for (let i = 0; i < goodsList.length; i++) {
        if (i === goodsList.length - 1) {
          sql += `('${goodsList[i].gid}','${goodsList[i].price}','${goodsList[i].num}',
          NOW(), NOW(), '${goodsList[i].order_no}', '${userId}', '${goodsList[i].status}', 0,
          '${goodsList[i].address_id}', '${goodsList[i].remark}')`
        } else {
          sql += `('${goodsList[i].gid}','${goodsList[i].price}','${goodsList[i].num}',
          NOW(), NOW(), '${goodsList[i].order_no}', '${userId}', '${goodsList[i].status}', 0,
          '${goodsList[i].address_id}', '${goodsList[i].remark}'),`
        }
      }

      return sql

    } else {
      let sql = `
        INSERT INTO order_details
        (gid, price, num, created_at, order_no, uid, status,
        after_sale, address_id, remark) VALUES`

      for (let i = 0; i < goodsList.length; i++) {
        if (i === goodsList.length - 1) {
          sql += `('${goodsList[i].gid}','${goodsList[i].price}','${goodsList[i].num}',
          NOW(), '${goodsList[i].order_no}', '${userId}', '${goodsList[i].status}', 0,
          '${goodsList[i].address_id}', '${goodsList[i].remark}')`
        } else {
          sql += `('${goodsList[i].gid}','${goodsList[i].price}','${goodsList[i].num}',
          NOW(), '${goodsList[i].order_no}', '${userId}', '${goodsList[i].status}', 0,
          '${goodsList[i].address_id}', '${goodsList[i].remark}'),`
        }
      }

      return sql

    }
  },

  ordersUpdate: (type, orderNo, status, reason, addressId, remark) => {
    let sql = ''
    if (type === 'pay') {
      sql = `UPDATE order_details SET status = 2,paytime = NOW(),updated_at = NOW(),remark= '${remark ??''}' WHERE order_no = '${orderNo}'`
    } else if (type === 'afterSale') {
      sql = `UPDATE order_details SET after_sale = 1,updated_at = NOW(),reason = '${reason ??''}' WHERE order_no = '${orderNo}'`
    } else if (type === 'address') {
      sql = `UPDATE order_details SET address_id = ${addressId},updated_at = NOW() WHERE order_no = '${orderNo}'`
    } else {
      sql = `UPDATE order_details SET status = '${status}',updated_at = NOW(),remark= '${remark ??''}' WHERE order_no = '${orderNo}'`
    }

    return sql
  },

  ordersCommonList: `
    SELECT
    o.cid, a.uname, a.phone, a.address,
    g.goodsname, g.imgs, g.description,
    t.typename,
    o.price, o.num,
    DATE_FORMAT(o.paytime, '%Y-%m-%d %H:%i:%s') as paytime,
    DATE_FORMAT(o.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
    DATE_FORMAT(o.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at,
    o.order_no,
    o.status, o.after_sale, o.remark, o.reason
    FROM order_details o
    LEFT JOIN address a
    ON o.address_id = a.address_id
    LEFT JOIN goods g
    ON g.gid = o.gid
    LEFT JOIN type t
    ON g.tid = t.tid
    ORDER BY o.created_at ASC
    LIMIT ?, ?
  `,

  ordersCommonListNum: `SELECT COUNT(*) as total FROM order_details`,


  orderUpdateById: `
    UPDATE order_details SET gid = ? , price = ? , num = ? ,
    paytime = ? , updated_at = NOW(), order_no = ? , uid = ? , status = ? ,
    after_sale = ? , address_id = ? , remark = ? , reason = ?
    WHERE cid = ?
  `,

  // 删除商品信息
  shopCartDeleteSql: (str) => `DELETE FROM shoppingcart WHERE cid in (${str})`,



}





module.exports = router;