
import { translate } from '../../utils/api.js'

//index.js
//获取应用实例
const app = getApp()

const audio = wx.createInnerAudioContext()

Page({
  data: {
    showClose: true,
    query: '',
    curLang: {},
    preLang: {},
    result: {},
    showTextarea: false,
    preLangText: '',
    history: [],
    showHistory: true,
    showTranslation: false,
    historyItem: {},
    audioPlayOrigin: false,
    audioPlayTrans: false,
    audioOnplay: false
  },
  onLoad(options){
    if(options.query) {
      this.setDate({
        query: options.query
      })
    }
    // wx.clearStorage()
  },
  onShow(){
    this.setData({
      preLang: app.globalData.preLang,
      curLang: app.globalData.curLang,
      history: wx.getStorageSync('history')
    })
    if(this.data.query){
      this.onComfirm()
    }
    this.getFields()
  },
  onTapClose(e){
    this.setData({
      "query": '',
      "showClose": true,
      showTextarea: false,
      result: {},
      showHistory: true,
      showTranslation: false,
      audioPlayOrigin: false,
      audioPlayTrans: false,
    })
    audio.stop()
    console.log(this.data.history)
  },
  onInput(e){
    this.setData({ 
      "query": e.detail.value,
    })
    if(e.currentTarget.dataset.query){
      if(!e.detail.value.length){
        this.setData({
          showTextarea: true,
          showHistory: true,
          showTextarea: false,
          showTranslation: false
        })
      }
    }
    if (this.data.query.length > 0){
      this.setData({ "showClose": false })
    }else{
      this.setData({ "showClose": true })
    }
    // this.setData({result: {}})
  },
  onComfirm(){
    if(!this.data.query) return 
    let query = this.data.query.trim().replace(/[\r\n]/g,"")
    console.log(query)
    if(!query.length){
      wx.showToast({
        title: "请输入正确的翻译内容",
        icon: "none",
        duration: 2000
      })
    }else {
      wx.showLoading({
        title: '正在翻译',
      })
      translate(query,{from: this.data.preLang.lang, to: this.data.curLang.lang}).then(res => {
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
        console.log("ppp",history)
        let historyItem = {
          data: this.data.query.trim().replace(/[\r\n]/g,""),
          result: this.data.result
        }
  
        if(history.length){
          let historyIndex = history.findIndex( item => {
            // console.log(item.data)
            console.log("historyItem.data",historyItem.data)
            // console.log(item.result.translation)
            console.log("historyItem.result.translation",historyItem.result.translation)
            return item.data.trim().replace(/[\r\n]/g,"") === historyItem.data && item.result.translation[0] === historyItem.result.translation[0]
          })
          console.log(historyIndex)
          if(historyIndex !== -1){
            history.splice(historyIndex,1)
          }
        }
        history.unshift(historyItem)
       
        wx.setStorageSync('history',history)
        // this.setData({
        //   hisroty: 
        // })
        this.setData({
          history: wx.getStorageSync('history'),
          showHistory: false,
          showTranslation: true
        })
      })
      
    }
    
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
    
    if(url === 'speak'){
      audio.src = this.data.result.speakUrl
    }else{
      audio.src = this.data.result.tSpeakUrl
    }
    audio.play()
    audio.onPlay(() => {
      if(url === 'speak'){
        this.setData({
          audioPlayOrigin: true,
          audioPlayTrans: false
        })
      }else{
        this.setData({
          audioPlayOrigin: false,
          audioPlayTrans: true
        })
      }
      
    })
    audio.onEnded(() => {
      this.setData({
        audioPlayOrigin: false,
        audioPlayTrans: false
      })
    })
  },
  pause(e){
    if(!this.data.audioOnplay){
      audio.pause()
      this.setData({
        audioOnplay: true
      })
    }else{
      audio.play()
      this.setData({
        audioOnplay: false
      })
    }
  },
  toDetail(e){
    let index = e.currentTarget.dataset.index
    let hisroty = wx.getStorageSync('history')
    
    this.setData({
      result: hisroty[index].result,
      showTextarea: true,
      showClose: false,
      showTranslation: true,
      showHistory: false,
      query: hisroty[index].result.query
    })
  },
  deleteHistory(e){
    let index = e.currentTarget.dataset.index
    let history = wx.getStorageSync('history')
    if(history){
      history.splice(index,1)
      wx.setStorageSync('history',history)
      this.setData({
        history: history
      })
    }
  },
  clearHistory(e){
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除所有历史记录吗？',
      success(res) {
        if (res.confirm) {
          wx.setStorageSync('history',[])
          that.setData({
            history: []
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  copy(e){
    let dataset = e.currentTarget.dataset
    if(dataset.query){
      wx.setClipboardData({
        data: dataset.query,
        success(res) {
          // wx.getClipboardData({
          //   success(res) {
          //     console.log(res.data) // data
          //   }
          // })
        }
      })
    }
    if(dataset.translation){
      wx.setClipboardData({
        data: 'data',
        success(res) {
          // wx.getClipboardData({
          //   success(res) {
          //     console.log(res.data) // data
          //   }
          // })
        }
      })
    }
  },
  UpFirstString(string){
    return string.substring(0,1).toUpperCase() + string.substring(1)
  }
})
