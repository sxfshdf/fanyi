
const app = getApp()

Page({

  data: {
    curLang: {},
    langList: app.globalData.langList
  },

  onShow(){
    this.setData({curLang: app.globalData.curLang})
  },
  selectLang(e){
    let language = e.currentTarget.dataset
    this.setData({curLang: language})
    wx.setStorageSync('language',language)
    app.globalData.curLang = language
    wx.switchTab({url: '/pages/index/index'})
  }
})