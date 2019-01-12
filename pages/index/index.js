//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showClose: true,
    value: '',
  },
  onTapClose(e){
    this.setData({
      "query": '',
      "showClose": true
    })
  },
  onInput(e){
    this.setData({ "query": e.detail.value})
    if(this.data.value.length > 0){
      this.setData({ "showClose": false })
    }else{
      this.setData({ "showClose": true })
    }
  }
})
