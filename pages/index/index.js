
import { translate } from '../../utils/api.js'

//index.js
//获取应用实例
const app = getApp()



Page({
  data: {
    showClose: true,
    query: '',
    curLang: {},
    preLang: {},
    result: {},
    audioPlay: false,
    showTextarea: false,
    preLangText: '',
    history: []
  },
  onLoad(options){
    if(options.query) {
      this.setDate({
        query: options.query
      })
    }
    wx.clearStorage()
  },
  onShow(){
    if(this.data.curLang.lang !== app.globalData.curLang.lang) {
      this.setData({
        curLang: app.globalData.curLang
      })
    }
    if(this.data.preLang.lang !== app.globalData.preLang.lang) {
      this.setData({
        preLang: app.globalData.preLang
      })
    }
    // console.log(this.data.curLang)

    // this.setData({
    //   history: wx.getStorageSync('history')
    // })
    this.onComfirm()
    this.getFields()
  },
  onTapClose(e){
    this.setData({
      "query": '',
      "showClose": true,
      showTextarea: false,
      result: {}
    })

    console.log(this.data.history)
  },
  onInput(e){
    this.setData({ "query": e.detail.value})
    if (this.data.query.length > 0){
      this.setData({ "showClose": false })
    }else{
      this.setData({ "showClose": true })
    }
    // this.setData({result: {}})
  },
  onComfirm(){
    if(!this.data.query) return 
    wx.showLoading({
      title: '正在翻译',
    })
    translate(this.data.query.trim().replace(/ /ig,'').replace(/[\r\n]/g,""),{from: this.data.preLang.lang, to: this.data.curLang.lang}).then(res => {
      // this.data.set({})
      console.log(res)
      // this.setData({query: ''})
      res.translation[0] = this.UpFirstString(res.translation[0])
      
      // if( res.basic.explains && typeof(res.basic.explains) === 'object'){
      //   res.basic.explains = res.basic.explains.join('; ').toString()
      // }
      
      // console.log(res.basic.explains)
      // if(!res.basic.hasOwnProperty("explains")){
      //   console.log(111)
      // }
      // return 
      
      if(res.hasOwnProperty("basic") && res.basic.hasOwnProperty("explains")){
        res.basic.explains = res.basic.explains.join('; ').toString()
      }

      let {query,basic,translation,speakUrl,tSpeakUrl} = res
      this.setData({result: {query,basic,translation,speakUrl,tSpeakUrl}})

      this.setData({
        showTextarea: true
      })
      wx.hideLoading()

      let history = wx.getStorageSync('history') || []
      history.unshift({
        data: this.data.query.trim().replace(/ /ig,'').replace(/[\r\n]/g,""),
        result: this.data.result
      })
      wx.setStorageSync('history',history)
      // this.setData({
      //   hisroty: 
      // })
      this.setData({
        history: wx.getStorageSync('history')
      })
    })
    
  },
  getFields() {
    
    wx.createSelectorQuery().select('#xxx').fields({
      dataset: true,
    }, 
    (res) => {
      res.dataset // 节点的dataset
      this.setData({
        preLangText: res.dataset.text
      })
    }).exec()
  },
  exchange(e){
    
    
    if(this.data.preLangText === '自动检测') {
      wx.showToast({
        title: '自动检测无法对调语言',
        icon: 'none',
        duration: 2000
      })
    }else{
       
      [app.globalData.curLang, app.globalData.preLang] = [app.globalData.preLang, app.globalData.curLang]

       wx.setStorageSync('prevLang', app.globalData.preLang)
       wx.setStorageSync('curLang', app.globalData.curLang)
       
       

      this.setData({
        preLang: app.globalData.preLang,
        curLang: app.globalData.curLang
      })
      
      this.onComfirm()
    }
  },
  speak(e){
    let url = e.currentTarget.dataset.url
    const audio = wx.createInnerAudioContext()
    if(url === 'speak'){
      audio.src = this.data.result.speakUrl
    }else{
      audio.src = this.data.result.tSpeakUrl
    }
    audio.play()
    audio.onPlay(() => {
      this.setData({audioPlay: true})
    })
    audio.onEnded(() => {
      this.setData({audioPlay: false})
    })
  },
  UpFirstString(string){
    return string.substring(0,1).toUpperCase() + string.substring(1)
  }
})
