
const app = getApp()

Page({

  data: {
    curLang: {},
    preLang: {},
    langList: [],
    refer: '',
    chooseIndex: 0,
  },

  onLoad(options){
    this.setData({
      refer: options.refer
    })
    if(this.data.refer === 'cur'){
      this.setData({
        langList: app.globalData.langList.slice(1),
        chooseIndex: options.index-1
      })
    }else {
      this.setData({
        langList: app.globalData.langList,
        chooseIndex: options.index-0
      })
    }
    
  },
  onShow(){
    this.setData({curLang: app.globalData.curLang})
    this.setData({preLang: app.globalData.preLang})
  },
  selectLang(e){
    let language = e.currentTarget.dataset
    
    if(this.data.refer === 'cur') {
      this.setData({
        chooseIndex: language.index-1
      })
      this.setData({curLang: language})
      wx.setStorageSync('curLang',language)
      app.globalData.curLang = language
      console.log(app.globalData.curLang)
    }else if(this.data.refer === 'pre') {
      this.setData({
        chooseIndex: language.index
      })
      this.setData({preLang: language})
      wx.setStorageSync('preLang',language)
      app.globalData.preLang = language
    }
    wx.switchTab({url: '/pages/index/index'})
  }
})