/**
 * 中间件
 */
const dbUtils = require('../utils/DBUtils.js');
let tokenKey = require('../utils/tokenKey.js')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  // 拿到 token 的 id
  let raw = String(req.headers.authorization).split(' ').pop()
  // 解秘钥 
  const tokenData = jwt.verify(raw, tokenKey.TOKEN_KEY)
  let {
    id
  } = tokenData

  let sql = `SELECT uid,uname,upwd,avatar,phone FROM users WHERE uid = ?`
  let user = await dbUtils.executeSql(sql, [id])

  if (user.length <= 0) {
    res.send({
      returnCode: "-1001",
      success: false,
      msg: "没有该用户"
    })
    return
  }

  req.user = user[0]
  // 接口通行
  next()
}

module.exports = auth;


