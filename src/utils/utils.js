export const setDOM = (total_credit, credit) => {
  const wbrr = document.querySelector('.wbrr')

  const obj = {
    total_credit: `全部积分： ${total_credit}`,
    credit: credit ? `今日签到：${credit}` : '今日已签到',
  }
  Object.keys(obj).forEach(key => {
    const newNode = document.createElement('span')
    newNode.innerHTML = obj[key]
    newNode.style.padding = '0 10px 0'
    wbrr.appendChild(newNode)
  })
}
