export const toUrl = data => {
  let _result = []
  for (let key in data) {
    let value = data[key]
    if (value.constructor == Array) {
      value.forEach(_value => {
        _result.push(key + '=' + _value)
      })
    } else {
      _result.push(key + '=' + value)
    }
  }
  return _result.join('&')
}
