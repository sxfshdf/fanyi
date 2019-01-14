//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力


   

    this.globalData.preLang = wx.getStorageSync('preLang') || this.globalData.langList[0]
    this.globalData.curLang = wx.getStorageSync('curLang') || this.globalData.langList[3]



    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    curLang: {},
    preLang: {},
    langList: [{
      'chs': '自动检测',
      'index': 0,
      'lang': 'auto'
    },{
      'chs': '中文',
      'lang': 'zh-CHS',
      'index': 1
    },{
      'chs': '日语',
      'lang': 'ja',
      'index': 2
    },{
      'chs': '英文',
      'lang': 'EN',
      'index':3
    },{
      'chs': '韩文',
      'lang': 'ko',
      'index': 4
    },{
      'chs': '法文',
      'lang': 'fr',
      'index': 5
    },{
      'chs': '俄文',
      'lang': 'pt',
      'index': 6
    },{
      'chs': '西班牙文',
      'lang': 'es',
      'index': 7
    },{
      'chs': '葡萄牙文',
      'lang': 'pt',
      'index': 8
    },{
      'chs': '越南文',
      'lang': 'vi',
      'index': 9
    },{
      'chs': '德文',
      'lang': 'de',
      'index': 10
    },{
      'chs': '阿拉伯文',
      'lang': 'ar',
      'index': 11
    },{
      'chs': '印尼文',
      'lang': 'id',
      'index': 12
    },]
  }
})