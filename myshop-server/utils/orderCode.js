function orderCode() {
  var orderCode = '';
  for (let i = 0; i < 6; i++) //6位随机数，用以加在时间戳后面。
  {
    orderCode += Math.floor(Math.random() * 10);
  }
  orderCode = new Date().getTime() + orderCode; //时间戳，用来生成订单号。
  return orderCode;
}

module.exports = orderCode