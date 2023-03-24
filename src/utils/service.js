import axios from 'axios'
// import qs from 'qs'

// 本地用户token
const userData = localStorage['userData'] && JSON.parse(localStorage['userData'])

// axios带token
const service = axios.create({
  headers: {
    Authorization: 'Bearer ' + userData.token,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

// 请求拦截器
// service.interceptors.request.use(
//   config => {
//     config.data = qs.stringify(config.data) // 转为formdata数据格式
//     return config
//   },
//   error => Promise.error(error)
// )

export default service
