// svg更换颜色
const changeSvgColor = (url, color) => {
  //转义后的#等于%23，利用正则表达式，替换所有%23后6位为新的十六进制六位数。
  let res = url.replace(/%22%23[a-zA-Z0-9]{3,6}/g, color.replace("#", "%22%23"))
  return res
}

export {
  changeSvgColor
}
