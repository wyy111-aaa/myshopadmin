var express = require('express');
const dbUtils = require('../utils/DBUtils.js');
var router = express.Router();

// 引入中间件
let auth = require('../utils/auth.js')






// 获取购物车商品列表
router.get('/list', auth, async (req, res) => {
  try {
    let id = req.user.uid
    // console.log(req.user)
    let list = await dbUtils.executeSql(shopCart.shopCartListSql, [id])
    res.send({
      code: 200,
      data: list
    })
  } catch (err) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '获取失败'
    })
  }
})

// // 获取公共商品列表 (管理员用不到)
// router.get('/commonShopCartList', auth, async (req, res) => {
//   try {
//     let list = await dbUtils.executeSql(shopCart.shopCartCommonListSql, '')
//     res.send({
//       code: 200,
//       data: list
//     })
//   } catch (err) {
//     res.send({
//       returnCode: "-1001",
//       status: false,
//       msg: '获取失败'
//     })
//   }
// })




// 添加购物车 参数 {gid:xxx,number:xxx}
router.post('/add', auth, async (req, res) => {
  let {
    gid,
    number
  } = req.body

  let uid = req.user.uid

  try {

    let goods = await dbUtils.executeSql(shopCart.goodsMsg, [gid, uid])
    // 存在商品
    if (goods.length > 0) {

      let num = goods[0].number + number
      let checkedNum = goods[0].is_checked
      let id = goods[0].cid


      let flag = await dbUtils.executeSql(shopCart.shopCartUpdateSql, [num, checkedNum, id])

      if (flag) {
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

    } else {
      let flag = await dbUtils.executeSql(shopCart.shopCartAddSql, [gid, uid, number])

      if (flag) {
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

    }

  } catch (e) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '添加失败'
    })
  }

})


router.post('/setAddress', auth, async (req, res) => {
  let {
    addressId
  } = req.body
  let userId = req.user.uid

  try {
    let updatesqlClose = `UPDATE address SET is_default = 0,updated_at = NOW() WHERE user_id = '${userId}'`
    let updatesqlSet = `UPDATE address SET is_default = 1,updated_at = NOW()  WHERE user_id = '${userId}' AND address_id = '${addressId}'`

    let flag = await dbUtils.executeSql(updatesqlClose, '')
    if (flag) {
      let flag2 = await dbUtils.executeSql(updatesqlSet, '')
      if (flag2) {
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




// 购物车数量/选中 修改
router.patch('/:id', auth, async (req, res) => {
  try {
    let id = req.params.id

    let {
      num,
      checkedNum
    } = req.body

    let updateGoods = await dbUtils.executeSql(shopCart.shopCartUpdateSql, [num, checkedNum, id])

    if (updateGoods) {
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


// 删除购物车商品 ids 是id 数组(json 格式传入{ids:[1,2]})
router.post('/delete/goods', auth, async (req, res) => {
  let {
    ids
  } = req.body

  let arr = [...ids]
  if (arr.length <= 0) return

  try {

    let str = arr.join(',')
    let deleteVal = await dbUtils.executeSql(shopCart.shopCartDeleteSql(str), '')

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

router.get('/user/address', auth, async (req, res) => {

  try {
    let userId = req.user.uid
    let addressList = await dbUtils.executeSql(shopCart.userAddress, [userId])
    res.send({
      code: 200,
      data: addressList
    })
  } catch (err) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '获取失败'
    })
  }

})




const shopCart = {

  // 获取购物车列表
  shopCartListSql: `SELECT 
  s.cid,s.is_checked,s.number,g.goodsname,g.imgs,g.price,g.sales,s.gid
  FROM shoppingcart s
  left JOIN goods g
  on g.gid = s.gid
  WHERE uid = ?`,

  // list 通用sql
  // shopCartCommonListSql: `SELECT 
  // s.cid,s.is_checked,s.number,g.goodsname,g.imgs,g.price,g.sales
  // FROM shoppingcart s
  // left JOIN goods g
  // on g.cid = s.gid`,


  // 修改商品信息
  shopCartUpdateSql: `UPDATE shoppingcart SET number= ?,
  updated_at = now(),is_checked = ? WHERE cid = ?`,

  // 删除商品信息
  shopCartDeleteSql: (str) => `DELETE FROM shoppingcart WHERE cid in (${str})`,

  // 添加商品信息
  shopCartAddSql: `INSERT INTO shoppingcart (gid,uid,number,is_checked,created_at) VALUES (?,?,?,1,NOW())`,

  // 查询商品
  goodsMsg: `SELECT * FROM shoppingcart WHERE gid = ? AND uid = ?`,

  userAddress: `SELECT * FROM address WHERE user_id = ?`

}




module.exports = router;