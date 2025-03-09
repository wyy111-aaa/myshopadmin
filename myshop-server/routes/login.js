/**
 * 登录模块
 */
var express = require('express');
let tokenKey = require('../utils/tokenKey.js');
const dbUtils = require('../utils/DBUtils.js');
const auth = require('../utils/auth.js')
const orderCode = require('../utils/orderCode.js')


var router = express.Router();
const jwt = require('jsonwebtoken')

// 手机号正则
let phoneReg = /^1[3456789]\d{9}$/;

/**  登录接口 **/
router.post('/', async (req, res) => {

  let username = req.body.username.trim()

  let password = req.body.password.trim()


  if (!username || !password) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '请输入账号或密码！！！'
    })
  }


  // 判断是否是管理员
  let isAdmin = false

  if (username === 'admin') {
    isAdmin = true
  } else {
    isAdmin = false

    if (!phoneReg.test(username)) {
      res.send({
        returnCode: "-1001",
        status: false,
        msg: '账号错误请重新输入！！！'
      })
    }
  }

  try {

    let user = await dbUtils.executeSql(login.selectUserSql(isAdmin, username), '')



    // 没有该用户
    if (user.length <= 0) {
      res.send({
        returnCode: "-1001",
        success: false,
        msg: "没有该用户或者密码错误"
      })
    }

    let isPassword = req.body.password === user[0]["upwd"] ? true : false

    // 密码匹配错误
    if (!isPassword) {
      res.send({
        returnCode: "-1001",
        status: false,
        msg: "没有该用户或者密码错误"
      })
    }

    // 生成 token 不设置过期时间
    const tokenData = jwt.sign({
      id: String(user[0]["uid"]),
    }, tokenKey.TOKEN_KEY)

    let datas = {
      id: user[0]["uid"],
      name: user[0]["uname"],
      token: tokenData
    }

    res.send({
      code: 200,
      data: datas,
      msg: "查询成功"
    })

  } catch (e) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '登录失败，请重新登录！！'
    })
  }

})

/** 注册接口 **/
router.post('/addUser', async (req, res) => {
  let {
    username,
    password,
    phone
  } = req.body

  // 无值返回错误
  if (!username || !password || !phone) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '请输入账号,密码或手机号！！！'
    })
  }


  username = username.trim()
  password = password.trim()
  phone = phone.trim()

  if (password.length < 6 || password.length > 16) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '密码长度为6-16位，请重新输入！！！'
    })
  }

  if (username.length > 25) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '用户名长度不能超过25位，请重新输入！！！'
    })
  }



  if (!phoneReg.test(phone)) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: '手机号错误请重新输入！！！'
    })
  }




  try {

    // 该用户是否已注册
    let user = await dbUtils.executeSql(login.selectUserSql(false, phone), '')

    if (user.length > 0) {
      res.send({
        returnCode: "-1001",
        status: false,
        msg: "注册失败,该手机号已注册"
      })
    }

    let flag = await dbUtils.executeSql(login.addUserSql, [username, password, phone])


    if (flag) {
      res.send({
        code: 200,
        status: true,
        msg: '注册成功'
      })
    } else {
      res.send({
        returnCode: "-1001",
        status: false,
        msg: "注册失败"
      })
    }

  } catch (e) {
    res.send({
      returnCode: "-1001",
      status: false,
      msg: "注册失败"
    })
  }

})

// 获取用户信息
router.get('/user/:id', auth, async (req, res) => {

  const user = req.user

  let userInfo = {
    id: user.uid,
    name: user.uname,
    avatar: user.avatar,
    phone: user.phone
  }

  res.send({
    code: 200,
    data: userInfo
  })
})


const login = {
  selectUserSql: (isAdmin, username) => {
    let sql = ''
    // 是管理员
    if (isAdmin) {
      sql = `SELECT uid,uname,upwd,avatar,phone FROM users WHERE uid = 'admin'`
    } else {
      sql = `SELECT uid,uname,upwd,avatar,phone FROM users WHERE phone = '${username}'`
    }
    return sql
  },

  addUserSql: `INSERT INTO users (uid,uname,upwd,phone,created_at,is_locked) VALUES (UUID(),?,?,?,NOW(),0)`
}


module.exports = router