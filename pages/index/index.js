
import { translate } from '../../utils/api.js'

//index.js
//获取应用实例
const app = getApp()



Page({
  data: {
    showClose: true,
    query: '',
    curLang: {},
    result: {},
    audioPlay: false,
    showTextarea: false
  },
  onLoad(options){
    if(options.query) {
      this.setDate({
        query: options.query
      })
    }
  },
  onShow(){
    if(this.data.curLang.lang !== app.globalData.curLang.lang) {
      this.setData({
        curLang: app.globalData.curLang
      })
    }
    // console.log(this.data.curLang)
    this.onComfirm()
  },
  onTapClose(e){
    this.setData({
      "query": '',
      "showClose": true,
      showTextarea: false,
      result: {}
    })
  },
  onInput(e){
    this.setData({ "query": e.detail.value})
    if (this.data.query.length > 0){
      this.setData({ "showClose": false })
    }else{
      this.setData({ "showClose": true })
    }
    this.setData({result: {}})
  },
  onComfirm(){
    if(!this.data.query) return 
    
    translate(this.data.query,{from: "auto", to: this.data.curLang.lang}).then(res => {
      // this.data.set({})
      console.log(res)
      // this.setData({query: ''})
      res.translation[0] = this.UpFirstString(res.translation[0])

      res.basic.explains = res.basic.explains.join('; ').toString()

      let {query,basic,translation,speakUrl,tSpeakUrl} = res
      this.setData({result: {query,basic,translation,speakUrl,tSpeakUrl}})
      // console.log(this.data.result)
      // wx.playVoice({
      //   filePath: res.speakUrl,
      //   complete() { console.log('ok')}
      // })
      this.setData({
        showTextarea: true
      })
      console.log(this.data.result)
      
    })
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
