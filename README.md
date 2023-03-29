# zmh-autosign
用于给致美化网站的自动签到


## 油猴相关
使用了 GM_xmlhttpRequest, GM_getValue, GM_setValue


**1. GM_xmlhttpRequest**

GM_xmlhttpRequest 和 axios 都试了一下，项目里目前（2023.03.27）目前仍然是使用 axios 。 因为致美化需要获取 localStorage 里的 token，总是得进页面的，axios的请求是 xhr 能直接抓到，方便测试，就先这么用了

**2. GM_getValue GM_setValue**

查了一下： Tampermonkey的GM_setValue()数据存储在**LevelDB**数据库中，该数据库可在“用户数据目录”树中找到。

一旦进入Chrome的“用户数据目录”（例如：C:\Users\USER_JOE\AppData\Local\Google\Chrome\User Data\Default），导航到Local Extension Settings\dhdgffkkebhmkfjojejmpbldmpobfkfo文件夹


## 项目相关

1. 致美化的签到有点神秘，得多点几个页面才能刷新签到，所以额外加了几个请求再签到
2. 致美化的接口需要 Authorization ， 值是 'Bearer ' + localStorage.userData.token ，所以得进页面拿值，以后看情况优化掉

## 计划

1. 合并几个页面的签到，并且不需要进入指定页面即可签到