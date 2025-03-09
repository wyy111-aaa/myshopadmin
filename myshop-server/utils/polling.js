/**
 * 轮询任务：清理过期未支付的订单(30 分钟过期)
 *  
 */
const dbUtils = require('../utils/DBUtils.js');
const schedule = require('node-schedule')

const polling = () => {
  const dbUtils = require('../utils/DBUtils.js');
  let sql = `
    UPDATE order_details
    SET status = 7
    WHERE
    status = 1
    AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) > 30
  `
  // 每10分钟执行一次
  let j = schedule.scheduleJob('*/10 * * * *', async () => {
    await dbUtils.executeSql(sql, '')
  })
}

module.exports = polling