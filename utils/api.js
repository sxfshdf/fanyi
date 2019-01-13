import md5 from "./md5.min.js"

const appKey = "11f93b2141a02b07"
const key = "cYhcwSuIgBBzdGXyNPRbIHQMEZbiFrdH"

function translate(q,{from = "auto", to = "auto"} = {from: "auto", to: "auto"}) {
  return new Promise((resolve, reject) => {

    let salt = Date.now()
    let sign = md5(appKey+q+salt+key)
  
    wx.request({
      url: "https://openapi.youdao.com/api",
      data: {
        q,
        from,
        to,
        appKey,
        sign,
        salt
      },
      success(res) {
        if(res.data && res.data.translation) {
          resolve(res.data)
        } else {
          reject({ status: "error", msg: "翻译失败"}) 
          wx.showToast({
            title: "翻译失败",
            icon: "none",
            duration: 2000
          })
        }
      },
      fail() {
        reject({ status: "error", msg: "翻译失败"}) 
        wx.showToast({
          title: "翻译失败",
          icon: "none",
          duration: 2000
        })
      }
    })
  })
}

module.exports.translate = translate