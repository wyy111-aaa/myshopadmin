const getOrderListData = (list) => {

  let map = new Map()

  list.forEach(item => {
    map.set(item.order_no, {
      uname: item.uname,
      phone: item.phone,
      address: item.address,
      order_no: item.order_no,
      total: 0,
      created_at: item.created_at,
      paytime: item.paytime,
      updated_at: item.updated_at,
      status: item.status,
      after_sale: item.after_sale,
      remark: item.remark,
      reason: item.reason,
      children: []
    })
  });

  let newArr = [...map.values()]

  // 
  for (let i = 0; i < newArr.length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (newArr[i].order_no === list[j].order_no) {
        newArr[i].total = Number(newArr[i].total) + (Number(list[j].num) * Number(list[j].price))
        newArr[i].children.push({
          cid: list[j].cid,
          gid: list[j].gid,
          goodsname: list[j].goodsname,
          typename: list[j].typename,
          imgs: list[j].imgs,
          description: list[j].description,
          price: list[j].price,
          num: list[j].num,
        })
      }
    }

  }

  return newArr

}


module.exports = getOrderListData