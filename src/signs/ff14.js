import { GM_xmlhttpRequest } from '$'
import { sign_fail, sign_success, toUrl } from '../utils/utils'

const path = 'https://actff1.web.sdo.com/20180707jifen/Server'
const urlList = [
  {
    name: '登录用户',
    url: '/HLogin.ashx',
    data: { method: 'loginstatus', loginout: 2 },
  },
  {
    name: '登录角色',
    url: '/ff14/HGetRoleList.ashx',
    data: {
      method: 'setff14role',
      AreaId: 1,
      AreaName: '陆行鸟',
      RoleName: '[拉诺西亚]再会的汽笛',
      Role: '12648490|LaNuoXiYa|3',
    },
  },
  {
    name: '签到',
    url: '/User.ashx',
    data: { method: 'signin', i: Math.random() },
  },
]

const makePostRequest = ({ url, data }) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      data: toUrl(data),
      onload: res => resolve(res),
      onerror: err => reject(err),
    })
  })
}

const ff14_sign = async storageKey => {
  const len = urlList.length
  for (let i = 0; i < len; i++) {
    const obj = urlList[i]
    const res = await makePostRequest({ url: path + obj.url, data: obj.data })

    if (res.status !== 200 || JSON.parse(res.response)['Code'] === -101) {
      sign_fail({
        storageKey,
        err_msg: '重新登录',
        callback: () => {
          window.open(
            'https://login.u.sdo.com/sdo/Login/LoginFrameFC.php?pm=2&appId=100001900&areaId=1&customSecurityLevel=2&target=top%810%853_param=from%3D78&thirdParty=wegame&returnURL=https://actff1.web.sdo.com/20180707jifen/Server/SDOLogin.ashx?returnPage=index.html'
          )
        },
      })
      return
    }

    if (i === 2) {
      const { Attach, Code } = JSON.parse(res.response)
      const Jifen = Attach && JSON.parse(Attach)['Jifen']
      if (Code === -1001 || Jifen) {
        const msg = Jifen ? `积分： ${Jifen}` : '已签到'
        localStorage.jifen = Jifen
        // sign_success(storageKey, msg)
      }
    }
  }
}

export default ff14_sign
